// ============================================================
// FORJA — UI (index.html)
// Dashboard principal com sprites por nível
// ============================================================

const UI = (() => {

  const difficultyLabel = { easy: 'Fácil', medium: 'Médio', hard: 'Difícil' };
  const difficultyTag   = { easy: 'tag-easy', medium: 'tag-medium', hard: 'tag-hard' };
  const xpReward        = { easy: 10, medium: 20, hard: 40 };
  const goldReward      = { easy: 5,  medium: 10, hard: 20 };

  // Mapeamento de nível → sprite por classe
  const SPRITES = {
    warrior: [
      { level: 1, file: 'escudeiro_1.png',   title: 'Escudeiro',   desc: 'Sua jornada começa aqui. Cada hábito é um passo.' },
      { level: 2, file: 'cavaleiro_2.png',   title: 'Cavaleiro',   desc: 'A disciplina começa a tomar forma. Continue.' },
      { level: 3, file: 'templario_3.png',   title: 'Templário',   desc: 'Sua devoção aos hábitos é inabalável.' },
      { level: 4, file: 'falange_4.png',     title: 'Falange',     desc: 'Você se tornou um pilar de constância.' },
      { level: 5, file: 'paladino_5.png',    title: 'Paladino',    desc: 'Força e virtude caminham juntas em você.' },
      { level: 6, file: 'vanguarda_6.png',   title: 'Vanguarda',   desc: 'Você lidera pelo exemplo. Nada te para.' },
      { level: 7, file: 'guarda_7.png',      title: 'Guarda',      desc: 'Guardião dos seus compromissos. Lendário.' },
      { level: 8, file: 'grao-mestre_8.png', title: 'Grão-Mestre', desc: 'O ápice da Forja. Você é uma lenda viva.' },
    ],
    mage: [
      { level: 1, file: 'mago_1.png',              title: 'Mago',              desc: 'Os primeiros feitiços tomam forma. Sua jornada arcana começa.' },
      { level: 2, file: 'mago_de_gelo_2.png',      title: 'Mago de Gelo',      desc: 'O frio da disciplina forja sua mente. Continue.' },
      { level: 3, file: 'bruxo_3.png',             title: 'Bruxo',             desc: 'Conhecimentos proibidos ampliam seu poder.' },
      { level: 4, file: 'feiticeiro_4.png',        title: 'Feiticeiro',        desc: 'A magia flui naturalmente por você agora.' },
      { level: 5, file: 'omnimante_5.png',         title: 'Omnimante',         desc: 'Você domina múltiplas escolas arcanas.' },
      { level: 6, file: 'mestre_mago_6.png',       title: 'Mestre Mago',       desc: 'Poucos alcançam este domínio. Você é um deles.' },
      { level: 7, file: 'arquimago_7.png',         title: 'Arquimago',         desc: 'A mais alta ordem da magia. Lendário.' },
      { level: 8, file: 'feiticeiro_supremo_8.png',title: 'Feiticeiro Supremo',desc: 'O ápice do poder arcano. Você reescreve a realidade.' },
    ],
  };

  const getSpriteForLevel = (level, playerClass = 'warrior') => {
    const table = SPRITES[playerClass] || SPRITES.warrior;
    const idx   = Math.min(level, table.length) - 1;
    return table[Math.max(0, idx)];
  };

  // --- Painel do jogador ---
  const renderPlayer = () => {
    const player = Player.get();
    if (!player) return;

    const sprite = getSpriteForLevel(player.level, player.class);

    // Sprite — onerror com null para evitar loop de flickering
    const img      = document.getElementById('player-sprite-img');
    const fallback = document.getElementById('player-sprite-fallback');
    if (img) {
      img.onerror = () => {
        img.onerror = null;
        img.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';
      };
      img.onload = () => {
        img.style.display = 'block';
        if (fallback) fallback.style.display = 'none';
      };
      img.src = `assets/sprites/${sprite.file}`;
      img.alt = sprite.title;
    }

    // Textos
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

    set('player-name',        player.name);
    set('player-class-title', sprite.title);
    set('player-level-badge', `Nível ${player.level} · ${sprite.title}`);
    set('player-streak',      `🔥 ${player.streak} dia${player.streak !== 1 ? 's' : ''}`);
    set('player-total',       `✅ ${player.totalCompleted || 0} tarefa${(player.totalCompleted || 0) !== 1 ? 's' : ''}`);
    set('player-gold',        player.gold);
    set('hp-text',            `${player.hp}/${player.maxHp}`);
    set('xp-text',            `${player.xp}/${player.maxXp}`);

    const hpPct = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));
    const xpPct = Math.max(0, Math.min(100, (player.xp / player.maxXp) * 100));

    const hpBar = document.getElementById('hp-bar');
    const xpBar = document.getElementById('xp-bar');
    if (hpBar) hpBar.style.width = `${hpPct}%`;
    if (xpBar) xpBar.style.width = `${xpPct}%`;

    // Cor do HP muda conforme o valor
    if (hpBar) {
      if (hpPct <= 25)      hpBar.style.background = 'linear-gradient(90deg,#7b1e1e,#c0392b)';
      else if (hpPct <= 50) hpBar.style.background = 'linear-gradient(90deg,#a93226,#e74c3c)';
      else                  hpBar.style.background = 'linear-gradient(90deg,#c0392b,#e74c3c)';
    }
  };

  // --- Modal de level up ---
  const showLevelUp = (level) => {
    const modal   = document.getElementById('levelup-modal');
    const titleEl = document.getElementById('levelup-title');
    const descEl  = document.getElementById('levelup-desc');
    const spriteEl = document.getElementById('levelup-sprite');
    if (!modal) return;

    const player  = Player.get();
    const sprite = getSpriteForLevel(level, player?.class);

    if (titleEl) titleEl.textContent = sprite.title;
    if (descEl)  descEl.textContent  = sprite.desc;
    if (spriteEl) {
      spriteEl.innerHTML = '';
      const modalImg = document.createElement('img');
      modalImg.src   = `assets/sprites/${sprite.file}`;
      modalImg.alt   = sprite.title;
      modalImg.style.cssText = 'width:100%;height:100%;object-fit:contain;image-rendering:pixelated;';
      modalImg.onerror = () => {
        modalImg.onerror = null;
        modalImg.style.display = 'none';
        const em = document.createElement('span');
        em.textContent = '⚔️';
        em.style.fontSize = '3rem';
        spriteEl.appendChild(em);
      };
      spriteEl.appendChild(modalImg);
    }

    modal.style.display = 'flex';
  };

  const closeLevelUp = () => {
    const modal = document.getElementById('levelup-modal');
    if (modal) modal.style.display = 'none';
  };

  // --- Lista de hábitos ---
  const renderHabits = () => {
    const list = document.getElementById('habits-list');
    if (!list) return;

    const habits = Habits.getAll();

    if (habits.length === 0) {
      list.innerHTML = `
        <div style="
          text-align:center;padding:32px 16px;
          border:1px dashed var(--border);border-radius:var(--radius-lg);
          color:var(--text-muted);
        ">
          <div style="font-size:2rem;margin-bottom:8px;opacity:0.4;">📅</div>
          <p style="font-size:0.88rem;">Nenhum hábito ainda.</p>
          <p style="font-size:0.78rem;margin-top:4px;">Abra o formulário abaixo para começar!</p>
        </div>`;
      return;
    }

    // Banner de dia perfeito
    const dailyHabits = habits.filter(h => h.frequency === 'daily');
    const today = new Date().toDateString();
    const allDone = dailyHabits.length > 0 && dailyHabits.every(h => h.completedDates.includes(today));

    const existingBanner = document.getElementById('perfect-day-banner');
    if (existingBanner) existingBanner.remove();

    if (allDone) {
      const banner = document.createElement('div');
      banner.id = 'perfect-day-banner';
      banner.style.cssText = `
        background: linear-gradient(135deg, rgba(39,174,96,0.15), rgba(39,174,96,0.05));
        border: 1px solid rgba(39,174,96,0.4);
        border-radius: var(--radius-lg);
        padding: 14px 18px;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
        animation: page-fade-in 0.4s ease;
      `;
      banner.innerHTML = `
        <span style="font-size:1.6rem;">🌟</span>
        <div>
          <div style="font-family:var(--font-display);font-size:0.82rem;color:var(--accent-green);font-weight:600;letter-spacing:0.05em;">
            DIA PERFEITO
          </div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px;">
            Todos os hábitos de hoje foram concluídos!
          </div>
        </div>
      `;
      list.prepend(banner);
    }

    const habitsHTML = habits.map(habit => {
      const done = Habits.isCompletedToday(habit);
      return `
        <div class="habit-card card" id="habit-${habit.id}" style="
          display:flex;align-items:center;gap:14px;
          opacity:${done ? '0.55' : '1'};
          transition:opacity 0.35s, border-color 0.2s;
          border-color:${done ? 'var(--accent-green)44' : 'var(--border)'};
        ">
          <!-- Botão de completar -->
          <button
            class="complete-btn ${done ? 'done' : ''}"
            onclick="UI.completeHabit('${habit.id}', event)"
            ${done ? 'disabled' : ''}
            title="${done ? 'Concluído hoje!' : 'Marcar como feito'}"
            style="
              width:38px;height:38px;border-radius:50%;border:2px solid ${done ? 'var(--accent-green)' : 'var(--border-glow)'};
              background:${done ? 'rgba(39,174,96,0.15)' : 'transparent'};
              color:${done ? 'var(--accent-green)' : 'var(--text-muted)'};
              font-size:1rem;cursor:${done ? 'default' : 'pointer'};
              display:flex;align-items:center;justify-content:center;
              transition:all 0.2s;flex-shrink:0;
            "
            onmouseover="if(!this.disabled)this.style.borderColor='var(--accent-gold)';if(!this.disabled)this.style.color='var(--accent-gold)';"
            onmouseout="if(!this.disabled)this.style.borderColor='var(--border-glow)';if(!this.disabled)this.style.color='var(--text-muted)';"
          >${done ? '✓' : '○'}</button>

          <!-- Info -->
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px;">
              <span style="
                font-weight:600;font-size:0.95rem;
                ${done ? 'text-decoration:line-through;color:var(--text-muted);' : 'color:var(--text-primary);'}
              ">${habit.name}</span>
              <span class="tag ${difficultyTag[habit.difficulty]}">${difficultyLabel[habit.difficulty]}</span>
            </div>
            <div style="font-size:0.73rem;color:var(--text-muted);display:flex;gap:10px;flex-wrap:wrap;">
              <span>🔁 Diário</span>
              <span style="color:var(--xp-color);">+${xpReward[habit.difficulty]} XP</span>
              <span style="color:var(--gold-color);">+${goldReward[habit.difficulty]} Gold</span>
              ${done ? '<span style="color:var(--accent-green);">✅ Feito hoje</span>' : ''}
            </div>
          </div>

          <!-- Remover -->
          <button
            onclick="UI.removeHabit('${habit.id}')"
            title="Remover hábito"
            style="
              width:30px;height:30px;border-radius:var(--radius-sm);border:1px solid transparent;
              background:transparent;color:var(--text-muted);font-size:0.85rem;
              cursor:pointer;display:flex;align-items:center;justify-content:center;
              transition:all 0.2s;flex-shrink:0;
            "
            onmouseover="this.style.borderColor='var(--accent-red)';this.style.color='var(--accent-red)';"
            onmouseout="this.style.borderColor='transparent';this.style.color='var(--text-muted)';"
          >🗑</button>
        </div>`;
    }).join('');
    list.innerHTML += habitsHTML;
  };

  // --- Lista de to-dos ---
  const renderTodos = () => {
    const list = document.getElementById('todos-list');
    if (!list) return;

    const all       = Todos.getAll();
    const pending   = all.filter(t => !t.completed);
    const completed = all.filter(t => t.completed);

    if (all.length === 0) {
      list.innerHTML = `
        <div style="
          text-align:center;padding:32px 16px;
          border:1px dashed var(--border);border-radius:var(--radius-lg);
          color:var(--text-muted);
        ">
          <div style="font-size:2rem;margin-bottom:8px;opacity:0.4;">✅</div>
          <p style="font-size:0.88rem;">Nenhuma tarefa ainda.</p>
          <p style="font-size:0.78rem;margin-top:4px;">Abra o formulário abaixo para adicionar!</p>
        </div>`;
      return;
    }

    const todoCard = (todo) => `
      <div class="card" id="todo-${todo.id}" style="
        display:flex;align-items:center;gap:14px;
        opacity:${todo.completed ? '0.5' : '1'};
        transition:opacity 0.35s, border-color 0.2s;
        border-color:${todo.completed ? 'var(--accent-green)44' : 'var(--border)'};
      ">
        <button
          onclick="UI.completeTodo('${todo.id}', event)"
          ${todo.completed ? 'disabled' : ''}
          title="${todo.completed ? 'Concluída!' : 'Marcar como feita'}"
          style="
            width:38px;height:38px;border-radius:50%;
            border:2px solid ${todo.completed ? 'var(--accent-green)' : 'var(--border-glow)'};
            background:${todo.completed ? 'rgba(39,174,96,0.15)' : 'transparent'};
            color:${todo.completed ? 'var(--accent-green)' : 'var(--text-muted)'};
            font-size:1rem;cursor:${todo.completed ? 'default' : 'pointer'};
            display:flex;align-items:center;justify-content:center;
            transition:all 0.2s;flex-shrink:0;
          "
          onmouseover="if(!this.disabled)this.style.borderColor='var(--accent-gold)';if(!this.disabled)this.style.color='var(--accent-gold)';"
          onmouseout="if(!this.disabled)this.style.borderColor='var(--border-glow)';if(!this.disabled)this.style.color='var(--text-muted)';"
        >${todo.completed ? '✓' : '○'}</button>

        <div style="flex:1;min-width:0;">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:3px;">
            <span style="
              font-weight:600;font-size:0.95rem;
              ${todo.completed ? 'text-decoration:line-through;color:var(--text-muted);' : 'color:var(--text-primary);'}
            ">${todo.name}</span>
            <span class="tag ${difficultyTag[todo.difficulty]}">${difficultyLabel[todo.difficulty]}</span>
          </div>
          <div style="font-size:0.73rem;color:var(--text-muted);display:flex;gap:10px;flex-wrap:wrap;">
            <span style="color:var(--xp-color);">+${xpReward[todo.difficulty]} XP</span>
            <span style="color:var(--gold-color);">+${goldReward[todo.difficulty]} Gold</span>
            ${todo.completed ? '<span style="color:var(--accent-green);">✅ Concluída</span>' : ''}
          </div>
        </div>

        ${!todo.completed ? `
        <button
          onclick="UI.removeTodo('${todo.id}')"
          title="Remover tarefa"
          style="
            width:30px;height:30px;border-radius:var(--radius-sm);border:1px solid transparent;
            background:transparent;color:var(--text-muted);font-size:0.85rem;
            cursor:pointer;display:flex;align-items:center;justify-content:center;
            transition:all 0.2s;flex-shrink:0;
          "
          onmouseover="this.style.borderColor='var(--accent-red)';this.style.color='var(--accent-red)';"
          onmouseout="this.style.borderColor='transparent';this.style.color='var(--text-muted)';"
        >🗑</button>` : ''}
      </div>`;

    list.innerHTML = [...pending, ...completed].map(todoCard).join('');
  };

  // --- Ações ---
  const completeHabit = (id, event) => {
    const rewards = Habits.complete(id);
    if (rewards && event) {
      App.burst(`+${rewards.xp} XP`, event.clientX - 24, event.clientY - 44, 'xp');
      setTimeout(() => App.burst(`+${rewards.gold}G`, event.clientX + 10, event.clientY - 64, 'gold'), 120);
    }
  };

  const removeHabit = (id) => {
    if (confirm('Remover este hábito?')) Habits.remove(id);
  };

  const completeTodo = (id, event) => {
    const rewards = Todos.complete(id);
    if (rewards && event) {
      App.burst(`+${rewards.xp} XP`, event.clientX - 24, event.clientY - 44, 'xp');
      setTimeout(() => App.burst(`+${rewards.gold}G`, event.clientX + 10, event.clientY - 64, 'gold'), 120);
    }
  };

  const removeTodo = (id) => {
    if (confirm('Remover esta tarefa?')) Todos.remove(id);
  };

  // --- Formulários ---
  const setupForms = () => {
    const habitForm = document.getElementById('habit-form');
    if (habitForm) {
      habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('habit-name').value.trim();
        const difficulty = document.getElementById('habit-difficulty').value;
        if (!name) return;
        Habits.add({ name, difficulty });
        habitForm.reset();
        // Fecha o <details>
        habitForm.closest('details').removeAttribute('open');
      });
    }

    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
      todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('todo-name').value.trim();
        const difficulty = document.getElementById('todo-difficulty').value;
        if (!name) return;
        Todos.add({ name, difficulty });
        todoForm.reset();
        todoForm.closest('details').removeAttribute('open');
      });
    }
  };

  // --- Listeners de eventos ---
  const setupListeners = () => {
    Events.on('playerUpdated', renderPlayer);
    Events.on('habitsUpdated', renderHabits);
    Events.on('todosUpdated',  renderTodos);
    Events.on('levelUp', ({ level }) => showLevelUp(level));
  };

  // --- Render completo ---
  const render = () => {
    renderPlayer();
    renderHabits();
    renderTodos();
    setupForms();
    setupListeners();
  };

  // --- Seleção de classe no onboarding ---
  const selectClass = (cls) => {
    const input = document.getElementById('onboarding-class');
    if (input) input.value = cls;

    const warrior = document.getElementById('class-warrior');
    const mage    = document.getElementById('class-mage');
    const btn     = document.querySelector('#onboarding-form button[type="submit"]');

    if (cls === 'warrior') {
      if (warrior) { warrior.style.borderColor = 'var(--accent-gold)';  warrior.style.opacity = '1'; }
      if (mage)    { mage.style.borderColor    = 'var(--border)';        mage.style.opacity    = '0.65'; }
      if (btn) btn.innerHTML = '⚔️ &nbsp; Começar minha jornada';
    } else {
      if (mage)    { mage.style.borderColor    = 'var(--accent-purple)'; mage.style.opacity    = '1'; }
      if (warrior) { warrior.style.borderColor = 'var(--border)';        warrior.style.opacity = '0.65'; }
      if (btn) btn.innerHTML = '🧙 &nbsp; Começar minha jornada';
    }
  };

  // Também atualizar ícone da classe no player panel
  const getClassIcon = (playerClass) => playerClass === 'mage' ? '🧙' : '⚔️';

  return {
    render,
    completeHabit, removeHabit,
    completeTodo,  removeTodo,
    showLevelUp,   closeLevelUp,
    selectClass,   getClassIcon,
  };
})();
