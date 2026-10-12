import { $, createEl } from '../utils/helpers.js';
import { extractIngredients } from './MealApi.js';
import { getItems } from './GroceryList.js';

export function setStatus(message) {
  $('#status').textContent = message;
}

export function renderCards(meals, { onView, onAdd }) {
  const container = $('#results');
  container.replaceChildren();
  meals.forEach((meal) => {
    const card = createEl('article', { className: 'card' });
    card.append(createEl('img', { attrs: { src: meal.strMealThumb, alt: meal.strMeal, loading: 'lazy' } }));
    const body = createEl('div', { className: 'card-body' });
    body.append(createEl('h3', { text: meal.strMeal }));
    // filter.php results omit category/area, so only show them when present
    const meta = [meal.strCategory, meal.strArea].filter(Boolean).join(' • ');
    if (meta) body.append(createEl('p', { className: 'meta', text: meta }));
    const actions = createEl('div', { className: 'card-actions' });
    const btn = createEl('button', { className: 'btn', text: 'View Recipe', attrs: { type: 'button' } });
    btn.addEventListener('click', () => onView(meal.idMeal));
    const add = createEl('button', { className: 'btn btn-alt', text: '+ Grocery List', attrs: { type: 'button' } });
    add.addEventListener('click', () => onAdd(meal.idMeal));
    actions.append(btn, add);
    body.append(actions);
    card.append(body);
    container.append(card);
  });
}

export function showModal(meal, { onAdd, onFavorite, isFavorite }) {
  const dialog = $('#recipe-modal');
  dialog.replaceChildren();
  dialog.append(
    createEl('h2', { text: meal.strMeal, attrs: { id: 'modal-title' } }),
    createEl('img', { attrs: { src: meal.strMealThumb, alt: meal.strMeal } }),
    createEl('p', { className: 'meta', text: [meal.strCategory, meal.strArea].filter(Boolean).join(' • ') }),
    createEl('h3', { text: 'Ingredients' })
  );
  const list = createEl('ul');
  extractIngredients(meal).forEach(({ name, measure }) =>
    list.append(createEl('li', { text: `${measure} ${name}`.trim() })));
  dialog.append(list, createEl('h3', { text: 'Instructions' }),
    createEl('p', { className: 'instructions', text: meal.strInstructions }));
  const actions = createEl('div', { className: 'modal-actions' });
  const add = createEl('button', { className: 'btn', text: '+ Add to Grocery List', attrs: { type: 'button' } });
  add.addEventListener('click', () => onAdd(meal.idMeal));
  const fav = createEl('button', { className: 'btn btn-alt', attrs: { type: 'button' } });
  const label = () => { fav.textContent = isFavorite(meal.idMeal) ? '♥ Saved' : '♡ Save Favorite'; };
  label();
  fav.addEventListener('click', () => { onFavorite(meal.idMeal); label(); });
  const close = createEl('button', { className: 'btn', text: 'Close', attrs: { type: 'button' } });
  close.addEventListener('click', () => dialog.close());
  actions.append(add, fav, close);
  dialog.append(actions);
  dialog.showModal();
}

export function fillCategories(categories) {
  const select = $('#category-select');
  categories.forEach((c) => select.append(createEl('option', { text: c, attrs: { value: c } })));
}

export function setTip(text) {
  $('#daily-tip').textContent = `Daily tip: ${text}`;
}

export function renderGrocery({ onToggle, onDelete }) {
  const list = $('#grocery-list');
  const items = getItems();
  list.replaceChildren();
  $('#grocery-empty').hidden = items.length > 0;
  items.forEach((item) => {
    const li = createEl('li');
    const box = createEl('input', { attrs: { type: 'checkbox', id: `g-${item.id}` } });
    box.checked = item.checked;
    box.addEventListener('change', () => onToggle(item.id));
    const label = createEl('label', {
      className: item.checked ? 'done' : '',
      text: `${item.measure} ${item.name}`.trim(),
      attrs: { for: `g-${item.id}` }
    });
    const del = createEl('button', { className: 'icon-btn', text: '✕', attrs: { type: 'button', 'aria-label': `Delete ${item.name}` } });
    del.addEventListener('click', () => onDelete(item.id));
    li.append(box, label, del);
    list.append(li);
  });
}
