// ============================================================
// FORJA — Shop
// ============================================================

const Shop = (() => {
  const CATALOG = [
    { id: 'potion_small',  name: 'Poção Pequena',    type: 'consumable', icon: '🧪', cost: 25,  effect: { heal: 15 },  description: 'Recupera 15 HP.' },
    { id: 'potion_large',  name: 'Poção Grande',     type: 'consumable', icon: '⚗️', cost: 60,  effect: { heal: 35 },  description: 'Recupera 35 HP.' },
    { id: 'sword_iron',    name: 'Espada de Ferro',  type: 'weapon',     icon: '⚔️', cost: 100, effect: { xpBonus: 5 }, description: '+5 XP por tarefa.' },
    { id: 'shield_wood',   name: 'Escudo de Madeira',type: 'armor',      icon: '🛡️', cost: 80,  effect: { hpBonus: 10 },description: '+10 HP máximo.' },
    { id: 'ring_luck',     name: 'Anel da Sorte',    type: 'accessory',  icon: '💍', cost: 150, effect: { goldBonus: 5 },description: '+5 Gold por tarefa.' },
    { id: 'potion_elixir', name: 'Elixir do Herói',  type: 'consumable', icon: '✨', cost: 120, effect: { heal: 999 }, description: 'Restaura todo o HP.' },
  ];

  const getCatalog = () => CATALOG;

  const buy = (itemId) => {
    const item = CATALOG.find(i => i.id === itemId);
    if (!item) return { success: false, reason: 'Item não encontrado.' };

    const spent = Player.spendGold(item.cost);
    if (!spent) return { success: false, reason: 'Gold insuficiente.' };

    if (item.type === 'consumable') {
      // Usa imediatamente
      if (item.effect.heal) {
        Player.heal(item.effect.heal);
        // Registra uso de poção para conquista Resiliente
        const p = Storage.getPlayer();
        p.potionsUsed = (p.potionsUsed || 0) + 1;
        Storage.savePlayer(p);
      }
    } else {
      // Adiciona ao inventário
      Storage.addToInventory(item);
    }

    Events.emit('itemPurchased', item);
    Badges.check(Player.get());
    return { success: true, item };
  };

  return { getCatalog, buy };
})();
