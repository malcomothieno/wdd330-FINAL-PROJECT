import { loadGrocery, saveGrocery } from './Storage.js';

let items = loadGrocery();

const persist = () => saveGrocery(items);
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const getItems = () => [...items];

/** Add one item; skips duplicates (same name, case-insensitive). Returns true if added. */
export function addItem(name, measure = '') {
  const clean = name.trim();
  if (!clean || items.some((i) => i.name.toLowerCase() === clean.toLowerCase())) return false;
  items.push({ id: newId(), name: clean, measure: measure.trim(), checked: false });
  persist();
  return true;
}

/** Add every ingredient of a meal; returns how many were new. */
export function addIngredients(ingredients) {
  const added = ingredients.filter(({ name, measure }) => addItem(name, measure)).length;
  return added;
}

export function toggleItem(id) {
  const item = items.find((i) => i.id === id);
  if (item) { item.checked = !item.checked; persist(); }
}

export function deleteItem(id) {
  items = items.filter((i) => i.id !== id);
  persist();
}

export function clearChecked() {
  items = items.filter((i) => !i.checked);
  persist();
}
