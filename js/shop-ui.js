// ============================================================
// FORJA — Shop UI
// ============================================================

const ShopUI = (() => {
  const typeLabel = { consumable: 'Consumível', weapon: 'Arma', armor: 'Armadura', accessory: 'Acessório' };
  const typeBorder = {
    consumable: 'var(--accent-green)',
    weapon:     'var(--accent-red)',
    armor:      'var(--accent-blue)',
    accessory:  'var(--accent-gold)',
  };

  const renderGold = () => {
    const el = document.getElementById('shop-gold');
    if (el) el.textContent = Player.get()?.gold ?? 0;
  };

  const renderCatalog = () => {
    const el = document.getElementById('shop-catalog');
    if (!el) return;

    const player = Player.get();
    const catalog = Shop.getCatalog();

    el.innerHTML = catalog.map(item => {
      const canAfford = player && player.gold >= item.cost;
      return `
        <div class="card" style="border-color:${typeBorder[item.type]}22;display:flex;flex-direction:column;gap:12px;">
          <div style="font-size:2.5rem;text-align:center;">${item.icon}</div>
          <div>
            <div style="font-family:var(--font-display);font-size:0.9rem;font-weight:600;margin-bottom:4px;">${item.name}</div>
            <div style="font-size:0.78rem;color:var(--text-muted);">${item.description}</div>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;">
            <span style="
              font-family:var(--font-display);font-size:0.65rem;letter-spacing:0.06em;
              padding:2px 8px;border-radius:999px;
              background:${typeBorder[item.type]}22;
              color:${typeBorder[item.type]};
              border:1px solid ${typeBorder[item.type]}44;
            ">${typeLabel[item.type]}</span>
            <button
              class="btn ${canAfford ? 'btn-primary' : 'btn-secondary'} btn-sm"
              onclick="ShopUI.buy('${item.id}', this)"
              ${canAfford ? '' : 'disabled'}
            >💰 ${item.cost}</button>
          </div>
        </div>`;
    }).join('');
  };

  const renderInventory = () => {
    const el = document.getElementById('inventory-list');
    if (!el) return;

    const inv = Storage.getInventory();

    if (inv.length === 0) {
      el.innerHTML = `<p style="color:var(--text-muted);font-style:italic;grid-column:1/-1;">Nenhum item no inventário ainda.</p>`;
      return;
    }

    el.innerHTML = inv.map(item => `
      <div class="card" style="display:flex;align-items:center;gap:12px;padding:12px 16px;">
        <span style="font-size:1.8rem;">${item.icon}</span>
        <div>
          <div style="font-size:0.85rem;font-weight:600;">${item.name}</div>
          <div style="font-size:0.72rem;color:var(--text-muted);">${item.description}</div>
        </div>
      </div>`).join('');
  };

  const buy = (itemId, btn) => {
    const result = Shop.buy(itemId);
    if (result.success) {
      btn.classList.add('bounce');
      setTimeout(() => btn.classList.remove('bounce'), 400);
      App.toast(`${result.item.icon} <strong>${result.item.name}</strong> comprado!`, 'reward');
      renderGold();
      renderCatalog();
      renderInventory();
    } else {
      App.toast(`❌ ${result.reason}`, 'danger');
    }
  };

  const render = () => {
    renderGold();
    renderCatalog();
    renderInventory();
    Events.on('playerUpdated', renderGold);
  };

  return { render, buy };
})();

// Substitui o UI.render padrão nessa página
const UI = { render: ShopUI.render };
