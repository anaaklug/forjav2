// ============================================================
// FORJA — Badges
// Verifica e desbloqueia conquistas
// ============================================================

const Badges = (() => {
  // Regras de desbloqueio para cada badge
  const rules = {
    first_step:  (player) => (player.totalCompleted || 0) >= 1,
    week_streak: (player) => (player.streak || 0) >= 7,
    workaholic:  (player) => (player.totalCompleted || 0) >= 50,
    rich:        (player) => (player.gold || 0) >= 500,
    resilient:   (player) => (player.potionsUsed || 0) >= 1,
    collector:   ()       => Storage.getInventory().length >= 5,
    level_5:     (player) => (player.level || 1) >= 5,
    level_10:    (player) => (player.level || 1) >= 10,
  };

  // Verifica todas as conquistas e desbloqueia as que foram atingidas
  const check = (player) => {
    const badges = Storage.getBadges();
    const newlyUnlocked = [];

    badges.forEach(badge => {
      if (!badge.unlocked && rules[badge.id]?.(player)) {
        const unlocked = Storage.unlockBadge(badge.id);
        if (unlocked) newlyUnlocked.push(unlocked);
      }
    });

    if (newlyUnlocked.length > 0) {
      Events.emit('badgesUnlocked', newlyUnlocked);
    }

    return newlyUnlocked;
  };

  const getAll = () => Storage.getBadges();

  // Retorna progresso atual e meta de cada badge (para exibir na UI)
  const getProgress = (player) => {
    const inv = Storage.getInventory();
    return {
      first_step:  { current: Math.min(player.totalCompleted || 0, 1),   goal: 1  },
      week_streak: { current: Math.min(player.streak || 0, 7),           goal: 7  },
      workaholic:  { current: Math.min(player.totalCompleted || 0, 50),  goal: 50 },
      rich:        { current: Math.min(player.gold || 0, 500),           goal: 500},
      resilient:   { current: Math.min(player.potionsUsed || 0, 1),      goal: 1  },
      collector:   { current: Math.min(inv.length, 5),                   goal: 5  },
      level_5:     { current: Math.min(player.level || 1, 5),            goal: 5  },
      level_10:    { current: Math.min(player.level || 1, 10),           goal: 10 },
    };
  };

  return { check, getAll, getProgress };
})();
