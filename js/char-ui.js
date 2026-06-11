// ============================================================
// FORJA — Char UI
// ============================================================

const CharUI = (() => {
  const SPRITES = {
    warrior: [
      { level: 1, file: 'escudeiro_1.png',   title: 'Escudeiro'   },
      { level: 2, file: 'cavaleiro_2.png',   title: 'Cavaleiro'   },
      { level: 3, file: 'templario_3.png',   title: 'Templário'   },
      { level: 4, file: 'falange_4.png',     title: 'Falange'     },
      { level: 5, file: 'paladino_5.png',    title: 'Paladino'    },
      { level: 6, file: 'vanguarda_6.png',   title: 'Vanguarda'   },
      { level: 7, file: 'guarda_7.png',      title: 'Guarda'      },
      { level: 8, file: 'grao-mestre_8.png', title: 'Grão-Mestre' },
    ],
    mage: [
      { level: 1, file: 'mago_1.png',               title: 'Mago'               },
      { level: 2, file: 'mago_de_gelo_2.png',       title: 'Mago de Gelo'       },
      { level: 3, file: 'bruxo_3.png',              title: 'Bruxo'              },
      { level: 4, file: 'feiticeiro_4.png',         title: 'Feiticeiro'         },
      { level: 5, file: 'omnimante_5.png',          title: 'Omnimante'          },
      { level: 6, file: 'mestre_mago_6.png',        title: 'Mestre Mago'        },
      { level: 7, file: 'arquimago_7.png',          title: 'Arquimago'          },
      { level: 8, file: 'feiticeiro_supremo_8.png', title: 'Feiticeiro Supremo' },
    ],
  };

  const getSpriteForLevel = (level, playerClass = 'warrior') => {
    const table = SPRITES[playerClass] || SPRITES.warrior;
    return table[Math.min(level, table.length) - 1] || table[0];
  };

  const render = () => {
    const player = Player.get();
    if (!player) return;

    const sprite = getSpriteForLevel(player.level, player.class);

    const img      = document.getElementById('char-sprite-img');
    const fallback = document.getElementById('char-sprite-fallback');
    if (img) {
      img.onerror = () => {
        img.onerror = null;
        img.style.display = 'none';
        if (fallback) fallback.style.display = 'inline';
      };
      img.onload = () => {
        img.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
      };
      // Atribuir src só depois dos handlers para evitar race condition
      img.src = `assets/sprites/${sprite.file}`;
      img.alt = sprite.title;
    }

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set('char-name',       player.name);
    const classLabel = player.class === 'mage' ? 'Mago' : 'Guerreiro';
    set('char-level',      `Nível ${player.level} · ${sprite.title}`);
    const classEl = document.getElementById('char-class-label');
    if (classEl) classEl.textContent = classLabel.toUpperCase();
    set('stat-hp',         `${player.hp} / ${player.maxHp}`);
    set('stat-xp',         `${player.xp} / ${player.maxXp}`);
    set('stat-gold',       player.gold);
    set('stat-streak',     `${player.streak} dia${player.streak !== 1 ? 's' : ''}`);
    set('stat-total',      player.totalCompleted || 0);

    if (player.createdAt) {
      set('char-since', new Date(player.createdAt).toLocaleDateString('pt-BR'));
    }
  };

  const reset = () => {
    if (confirm('Tem certeza? Todos os dados serão apagados permanentemente.')) {
      Storage.resetAll();
      window.location.href = 'index.html';
    }
  };

  return { render, reset };
})();

const UI = { render: CharUI.render };
