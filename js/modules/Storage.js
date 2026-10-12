const KEYS = { grocery: 'mpc-grocery', favorites: 'mpc-favorites' };

function read(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch {
    return []; // corrupted JSON or storage blocked
  }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (err) { console.error('Storage failed', err); }
}

export const loadGrocery = () => read(KEYS.grocery);
export const saveGrocery = (items) => write(KEYS.grocery, items);
export const loadFavorites = () => read(KEYS.favorites);
export const saveFavorites = (ids) => write(KEYS.favorites, ids);
