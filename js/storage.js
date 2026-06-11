// ============================================================
// FORJA — Storage Layer
// Toda interação com localStorage passa por aqui
// ============================================================

const Storage = (() => {
  const KEYS = {
    PLAYER:       'forja_player',
    HABITS:       'forja_habits',
    TODOS:        'forja_todos',
    INVENTORY:    'forja_inventory',
    BADGES:       'forja_badges',
    INITIALIZED:  'forja_initialized',
  };

  // --- Genérico ---
  const get = (key) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      console.error(`[Storage] Erro ao salvar: ${key}`);
      return false;
    }
  };

  const remove = (key) => localStorage.removeItem(key);

  // --- Player ---
  const defaultPlayer = (name = 'Herói', playerClass = 'warrior') => ({
    name,
    class: playerClass,
    level: 1,
    xp: 0,
    maxXp: 100,
    hp: 50,
    maxHp: 50,
    gold: 0,
    streak: 0,
    lastLoginDate: null,
    totalCompleted: 0,
    neverZeroedHp: true,
    potionsUsed: 0,
    equipment: { weapon: null, armor: null, accessory: null },
    createdAt: new Date().toISOString(),
  });

  const getPlayer = ()          => get(KEYS.PLAYER);
  const savePlayer = (player)   => set(KEYS.PLAYER, player);
  const initPlayer = (name, playerClass) => set(KEYS.PLAYER, defaultPlayer(name, playerClass));

  // --- Hábitos ---
  const getHabits  = ()         => get(KEYS.HABITS)    || [];
  const saveHabits = (habits)   => set(KEYS.HABITS, habits);

  const addHabit = (habit) => {
    const habits = getHabits();
    habits.push({ ...habit, id: crypto.randomUUID(), completedDates: [], createdAt: new Date().toISOString() });
    saveHabits(habits);
  };

  const updateHabit = (id, changes) => {
    const habits = getHabits().map(h => h.id === id ? { ...h, ...changes } : h);
    saveHabits(habits);
  };

  const removeHabit = (id) => saveHabits(getHabits().filter(h => h.id !== id));

  // --- To-dos ---
  const getTodos  = ()          => get(KEYS.TODOS)     || [];
  const saveTodos = (todos)     => set(KEYS.TODOS, todos);

  const addTodo = (todo) => {
    const todos = getTodos();
    todos.push({ ...todo, id: crypto.randomUUID(), completed: false, createdAt: new Date().toISOString() });
    saveTodos(todos);
  };

  const updateTodo = (id, changes) => {
    const todos = getTodos().map(t => t.id === id ? { ...t, ...changes } : t);
    saveTodos(todos);
  };

  const removeTodo = (id) => saveTodos(getTodos().filter(t => t.id !== id));

  // --- Inventário ---
  const getInventory  = ()        => get(KEYS.INVENTORY) || [];
  const saveInventory = (inv)     => set(KEYS.INVENTORY, inv);

  const addToInventory = (item) => {
    const inv = getInventory();
    inv.push({ ...item, id: crypto.randomUUID(), equipped: false, purchasedAt: new Date().toISOString() });
    saveInventory(inv);
  };

  // --- Badges ---
  const BADGE_DEFINITIONS = [
    { id: 'first_step',    name: 'Primeiro Passo',   description: 'Complete seu primeiro hábito.',         icon: '👣' },
    { id: 'week_streak',   name: 'Semana Perfeita',  description: 'Mantenha um streak de 7 dias.',         icon: '🔥' },
    { id: 'workaholic',    name: 'Workaholic',        description: 'Complete 50 tarefas no total.',         icon: '💪' },
    { id: 'rich',          name: 'Rico!',             description: 'Acumule 500 de Gold.',                  icon: '💰' },
    { id: 'resilient',     name: 'Resiliente',        description: 'Use uma poção para recuperar HP.',       icon: '🧪' },
    { id: 'collector',     name: 'Colecionador',      description: 'Compre 5 itens na loja.',               icon: '🛒' },
    { id: 'level_5',       name: 'Veterano',          description: 'Alcance o nível 5.',                    icon: '⚔️' },
    { id: 'level_10',      name: 'Lendário',          description: 'Alcance o nível 10.',                   icon: '👑' },
  ];

  const getBadges  = ()       => get(KEYS.BADGES) || BADGE_DEFINITIONS.map(b => ({ ...b, unlocked: false, unlockedAt: null }));
  const saveBadges = (badges) => set(KEYS.BADGES, badges);

  const unlockBadge = (id) => {
    const badges = getBadges().map(b =>
      b.id === id && !b.unlocked
        ? { ...b, unlocked: true, unlockedAt: new Date().toISOString() }
        : b
    );
    saveBadges(badges);
    return badges.find(b => b.id === id);
  };

  // --- Controle de inicialização ---
  const isInitialized = () => !!get(KEYS.INITIALIZED);
  const markInitialized = () => set(KEYS.INITIALIZED, true);

  const resetAll = () => Object.values(KEYS).forEach(k => remove(k));

  return {
    getPlayer, savePlayer, initPlayer,
    getHabits, saveHabits, addHabit, updateHabit, removeHabit,
    getTodos, saveTodos, addTodo, updateTodo, removeTodo,
    getInventory, saveInventory, addToInventory,
    getBadges, saveBadges, unlockBadge, BADGE_DEFINITIONS,
    isInitialized, markInitialized,
    resetAll,
  };
})();
