// ============================================================
// FORJA — Habits & Todos
// ============================================================

const Habits = (() => {
  const todayStr = () => new Date().toDateString();

  const getAll = () => Storage.getHabits();

  const add = ({ name, difficulty = 'easy', frequency = 'daily' }) => {
    Storage.addHabit({ name, difficulty, frequency });
    Events.emit('habitsUpdated', getAll());
  };

  const remove = (id) => {
    Storage.removeHabit(id);
    Events.emit('habitsUpdated', getAll());
  };

  const complete = (id) => {
    const habits = getAll();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = todayStr();
    if (habit.completedDates.includes(today)) return; // já completou hoje

    Storage.updateHabit(id, { completedDates: [...habit.completedDates, today] });
    const { rewards } = Player.completeTask(habit.difficulty);
    const updatedHabits = getAll();
    Events.emit('habitsUpdated', updatedHabits);
    Events.emit('taskCompleted', { type: 'habit', name: habit.name, rewards });

    // Verifica dia perfeito: todos os hábitos diários concluídos hoje
    const dailyHabits = updatedHabits.filter(h => h.frequency === 'daily');
    if (dailyHabits.length > 0 && dailyHabits.every(h => h.completedDates.includes(today))) {
      Events.emit('perfectDay');
    }

    return rewards;
  };

  // Verifica quais hábitos diários não foram feitos ontem e aplica penalidade.
  // Só roda uma vez por dia (guarda a última data de verificação no player).
  const applyDailyPenalties = () => {
    const player = Storage.getPlayer();
    if (!player) return;

    const today = new Date().toDateString();

    // Já rodou hoje — não penaliza de novo
    if (player.lastPenaltyDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const habits = getAll().filter(h => h.frequency === 'daily');
    let penalized = 0;

    habits.forEach(habit => {
      // Só penaliza se o hábito já existia ontem (criado antes de hoje)
      const createdBefore = new Date(habit.createdAt).toDateString() !== today;
      if (createdBefore && !habit.completedDates.includes(yesterdayStr)) {
        Player.failHabit(habit.difficulty);
        penalized++;
      }
    });

    // Marca que a penalidade já foi aplicada hoje
    player.lastPenaltyDate = today;
    Storage.savePlayer(player);

    if (penalized > 0) Events.emit('penaltiesApplied', { count: penalized });
  };

  const isCompletedToday = (habit) => habit.completedDates.includes(todayStr());

  return { getAll, add, remove, complete, applyDailyPenalties, isCompletedToday };
})();


const Todos = (() => {
  const getAll = () => Storage.getTodos();

  const add = ({ name, difficulty = 'easy' }) => {
    Storage.addTodo({ name, difficulty });
    Events.emit('todosUpdated', getAll());
  };

  const remove = (id) => {
    Storage.removeTodo(id);
    Events.emit('todosUpdated', getAll());
  };

  const complete = (id) => {
    const todos = getAll();
    const todo = todos.find(t => t.id === id);
    if (!todo || todo.completed) return;

    Storage.updateTodo(id, { completed: true, completedAt: new Date().toISOString() });
    const { rewards } = Player.completeTask(todo.difficulty);
    Events.emit('todosUpdated', getAll());
    Events.emit('taskCompleted', { type: 'todo', name: todo.name, rewards });
    return rewards;
  };

  return { getAll, add, remove, complete };
})();
