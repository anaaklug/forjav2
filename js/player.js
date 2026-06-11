// ============================================================
// FORJA — Player Logic
// Gerencia XP, HP, nível, gold e streak
// ============================================================

const Player = (() => {
  const XP_TABLE = {
    easy:   { xp: 10, hp: 2,  gold: 5  },
    medium: { xp: 20, hp: 5,  gold: 10 },
    hard:   { xp: 40, hp: 10, gold: 20 },
  };

  // XP necessário para subir de nível (cresce com o nível)
  const xpForLevel = (level) => Math.floor(100 * Math.pow(1.4, level - 1));

  const get = () => Storage.getPlayer();
  const save = (player) => Storage.savePlayer(player);

  // Completa uma tarefa: concede XP e Gold
  const completeTask = (difficulty = 'easy') => {
    const player = get();
    const rewards = XP_TABLE[difficulty] || XP_TABLE.easy;

    player.xp += rewards.xp;
    player.gold += rewards.gold;
    player.totalCompleted = (player.totalCompleted || 0) + 1;

    // Verifica level up em loop (pode subir vários níveis de uma vez)
    while (player.xp >= player.maxXp) {
      player.xp -= player.maxXp;
      player.level += 1;
      player.maxXp = xpForLevel(player.level);
      player.maxHp = 50 + (player.level - 1) * 5;
      player.hp = Math.min(player.hp + 10, player.maxHp); // recupera HP ao subir de nível
      Events.emit('levelUp', { level: player.level });
    }

    save(player);
    Events.emit('playerUpdated', player);
    Badges.check(player);
    return { rewards, player };
  };

  // Falhou hábito diário: perde HP
  const failHabit = (difficulty = 'easy') => {
    const player = get();
    const damage = XP_TABLE[difficulty]?.hp || 2;

    player.hp = Math.max(0, player.hp - damage);

    if (player.hp === 0) {
      player.neverZeroedHp = false;
      Events.emit('playerDied');
    }

    save(player);
    Events.emit('playerUpdated', player);
    return player;
  };

  // Gasta Gold na loja
  const spendGold = (amount) => {
    const player = get();
    if (player.gold < amount) return false;
    player.gold -= amount;
    save(player);
    Events.emit('playerUpdated', player);
    return true;
  };

  // Recupera HP (poção)
  const heal = (amount) => {
    const player = get();
    player.hp = Math.min(player.maxHp, player.hp + amount);
    save(player);
    Events.emit('playerUpdated', player);
  };

  // Checa e atualiza streak ao abrir o app
  const checkStreak = () => {
    const player = get();
    const today = new Date().toDateString();
    const last  = player.lastLoginDate;

    if (!last) {
      // Primeiro acesso
      player.streak = 1;
    } else if (last === today) {
      // Mesmo dia, não faz nada
      return player;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (last === yesterday.toDateString()) {
        player.streak += 1;
      } else {
        player.streak = 1; // quebrou o streak
        Events.emit('streakBroken');
      }
    }

    player.lastLoginDate = today;
    save(player);
    Events.emit('playerUpdated', player);
    Badges.check(player);
    return player;
  };

  return { get, save, completeTask, failHabit, spendGold, heal, checkStreak, xpForLevel };
})();
