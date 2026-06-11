// ============================================================
// FORJA — Events (pub/sub simples)
// Permite comunicação entre módulos sem acoplamento direto
// ============================================================

const Events = (() => {
  const listeners = {};

  const on = (event, callback) => {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  };

  const off = (event, callback) => {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  };

  const emit = (event, data) => {
    (listeners[event] || []).forEach(cb => cb(data));
  };

  return { on, off, emit };
})();
