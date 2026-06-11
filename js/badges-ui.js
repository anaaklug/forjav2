// ============================================================
// FORJA — Badges UI
// ============================================================

const BadgesUI = (() => {
  const render = () => {
    const grid    = document.getElementById('badges-grid');
    const countEl = document.getElementById('badges-count');
    if (!grid) return;

    const player   = Storage.getPlayer();
    const badges   = Badges.getAll();
    const progress = player ? Badges.getProgress(player) : {};
    const unlocked = badges.filter(b => b.unlocked).length;

    if (countEl) countEl.textContent = `${unlocked} / ${badges.length} desbloqueadas`;

    grid.innerHTML = badges.map(badge => {
      const prog    = progress[badge.id];
      const pct     = prog ? Math.round((prog.current / prog.goal) * 100) : 0;
      const isDone  = badge.unlocked;

      return `
      <div class="card" style="
        text-align:center;
        border-color: ${isDone ? 'var(--accent-gold)' : 'var(--border)'};
        opacity: ${isDone ? '1' : '0.7'};
        transition: all 0.3s;
        display:flex;flex-direction:column;gap:8px;
      ">
        <!-- Ícone -->
        <div style="font-size:2.4rem;${isDone ? '' : 'filter:grayscale(0.6);'}">
          ${badge.icon}
        </div>

        <!-- Nome -->
        <div style="
          font-family:var(--font-display);font-size:0.82rem;font-weight:600;
          color:${isDone ? 'var(--accent-gold)' : 'var(--text-primary)'};
          line-height:1.2;
        ">${badge.name}</div>

        <!-- Descrição -->
        <div style="font-size:0.75rem;color:var(--text-muted);flex:1;">${badge.description}</div>

        <!-- Progresso (só se não desbloqueada) -->
        ${!isDone && prog ? `
          <div>
            <div style="
              display:flex;justify-content:space-between;
              font-size:0.65rem;color:var(--text-muted);
              font-family:var(--font-display);letter-spacing:0.04em;
              margin-bottom:4px;
            ">
              <span>Progresso</span>
              <span>${prog.current} / ${prog.goal}</span>
            </div>
            <div class="progress-bar" style="height:6px;">
              <div class="progress-fill" style="
                width:${pct}%;
                background:linear-gradient(90deg, var(--accent-purple), var(--border-glow));
              "></div>
            </div>
          </div>
        ` : ''}

        <!-- Data de desbloqueio -->
        ${isDone && badge.unlockedAt ? `
          <div style="
            font-size:0.65rem;color:var(--accent-green);
            font-family:var(--font-display);letter-spacing:0.05em;
          ">✓ ${new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}</div>
        ` : ''}

        <!-- Bloqueada sem progresso -->
        ${!isDone && !prog ? `
          <div style="font-size:0.7rem;color:var(--text-muted);font-style:italic;">🔒 Bloqueada</div>
        ` : ''}
      </div>`;
    }).join('');
  };

  return { render };
})();

const UI = { render: BadgesUI.render };
