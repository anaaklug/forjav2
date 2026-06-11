// ============================================================
// FORJA — Theme & Splash
// ============================================================

const Theme = (() => {
  const STORAGE_KEY = 'forja_theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  const current = () => localStorage.getItem(STORAGE_KEY) || DARK;

  const apply = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === DARK ? '☀️' : '🌙';
  };

  const toggle = () => apply(current() === DARK ? LIGHT : DARK);

  // Aplica o tema salvo antes de qualquer render (evita flash)
  const init = () => {
    const saved = current();
    // Se não há preferência salva, detecta sistema
    if (!localStorage.getItem(STORAGE_KEY)) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      apply(prefersDark ? DARK : LIGHT);
    } else {
      apply(saved);
    }
  };

  // Splash screen com logo de acordo com o tema
  // Só executa uma vez por sessão de navegação
  const showSplash = (onDone) => {
    const splash = document.getElementById('splash-screen');
    const logo   = document.getElementById('splash-logo');
    if (!splash) { onDone?.(); return; }

    // Se já rodou nessa sessão, remove o splash e segue
    if (sessionStorage.getItem('forja_splash_shown')) {
      splash.remove();
      onDone?.();
      return;
    }
    sessionStorage.setItem('forja_splash_shown', 'true');

    // Logo correta para o tema atual
    if (logo) {
      const isDark = current() === DARK;
      logo.src = `assets/logos/${isDark ? 'forja_white.png' : 'forja_black.png'}`;
      logo.onerror = () => {
        logo.onerror = null;
        logo.style.display = 'none';
      };
    }

    // Duração da barra de loading (~1.3s) + fade out
    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.remove();
        onDone?.();
      }, 500);
    }, 3000);
  };

  return { init, apply, toggle, current, showSplash };
})();

// Aplica tema imediatamente (antes do DOMContentLoaded para evitar flash)
Theme.init();
