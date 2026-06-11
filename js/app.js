// ============================================================
// FORJA — App
// Inicialização, onboarding, toast, eventos globais
// ============================================================

const App = (() => {

  // --- Toast ---
  const toast = (message, type = 'success', duration = 3000) => {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = message;
    container.appendChild(el);

    setTimeout(() => {
      el.style.animation = 'toast-out 0.3s ease forwards';
      setTimeout(() => el.remove(), 300);
    }, duration);
  };

  // --- Burst de XP/Gold na tela ---
  const burst = (text, x, y, type = 'xp') => {
    const el = document.createElement('div');
    el.className = `xp-burst ${type === 'gold' ? 'gold-burst' : ''}`;
    el.textContent = text;
    el.style.left = `${x}px`;
    el.style.top  = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1200);
  };

  // --- Eventos globais ---
  const registerEvents = () => {
    Events.on('taskCompleted', ({ name, rewards }) => {
      toast(`✅ <strong>${name}</strong> — +${rewards.xp} XP, +${rewards.gold} Gold`, 'reward');
    });

    Events.on('levelUp', ({ level }) => {
      toast(`🎉 <strong>LEVEL UP!</strong> Você alcançou o nível ${level}!`, 'reward', 5000);
      document.body.classList.add('level-up-effect');
      setTimeout(() => document.body.classList.remove('level-up-effect'), 1500);
    });

    Events.on('badgesUnlocked', (badges) => {
      badges.forEach(badge => {
        setTimeout(() => {
          toast(`${badge.icon} <strong>Conquista desbloqueada:</strong> ${badge.name}`, 'badge', 5000);
        }, 500);
      });
    });

    Events.on('playerDied', () => {
      toast('💀 Seu HP chegou a zero! Tome cuidado com seus hábitos.', 'danger', 6000);
    });

    Events.on('streakBroken', () => {
      toast('😔 Sua sequência foi quebrada. Recomece hoje!', 'danger', 4000);
    });

    Events.on('penaltiesApplied', ({ count }) => {
      toast(`⚠️ ${count} hábito(s) não concluído(s) ontem. HP perdido!`, 'danger', 4000);
    });

    Events.on('perfectDay', () => {
      toast('🌟 <strong>Dia Perfeito!</strong> Todos os hábitos concluídos. Parabéns!', 'reward', 6000);
    });
  };

  // --- Marca link ativo na nav ---
  const setActiveNav = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === currentPage);
    });
  };

  // --- Onboarding ---
  const showOnboarding = () => {
    const overlay = document.getElementById('onboarding-overlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.classList.add('onboarding-appear');
  };

  const hideOnboarding = () => {
    const overlay = document.getElementById('onboarding-overlay');
    if (!overlay) return;
    overlay.style.animation = 'toast-out 0.4s ease forwards';
    setTimeout(() => overlay.remove(), 400);
  };

  // Configura onerror do sprite do onboarding sem loop
  const setupOnboardingSprite = () => {
    const img      = document.getElementById('onboarding-sprite-img');
    const fallback = document.getElementById('onboarding-sprite-fallback');
    if (!img) return;
    img.onerror = () => {
      img.onerror = null;
      img.style.display = 'none';
      if (fallback) fallback.style.display = 'inline';
    };
  };

  const setupOnboarding = () => {
    const form    = document.getElementById('onboarding-form');
    const nameInput = document.getElementById('onboarding-name');
    if (!form || !nameInput) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name        = nameInput.value.trim() || 'Herói';
      const classInput  = document.getElementById('onboarding-class');
      const playerClass = classInput?.value || 'warrior';
      Storage.initPlayer(name, playerClass);
      Storage.markInitialized();
      hideOnboarding();
      setTimeout(() => {
        Player.checkStreak();
        Habits.applyDailyPenalties();
        if (typeof UI !== 'undefined') UI.render();
        toast(`Bem-vindo à Forja, <strong>${name}</strong>! Sua jornada começa agora. ⚔️`, 'reward', 5000);
      }, 450);
    });
  };

  // --- Setup do botão de tema ---
  const setupThemeButton = () => {
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', Theme.toggle);
  };

  // --- Inicialização ---
  const init = () => {
    registerEvents();
    setActiveNav();
    setupOnboarding();
    setupOnboardingSprite();
    setupThemeButton();

    const start = () => {
      if (!Storage.isInitialized()) {
        showOnboarding();
      } else {
        if (!sessionStorage.getItem('forja_session_started')) {
          Player.checkStreak();
          Habits.applyDailyPenalties();
          sessionStorage.setItem('forja_session_started', 'true');
        }
        if (typeof UI !== 'undefined') UI.render();
      }
    };

    // Splash antes de mostrar o conteúdo
    Theme.showSplash(start);
  };

  return { init, toast, burst };
})();

// Inicia quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', App.init);
