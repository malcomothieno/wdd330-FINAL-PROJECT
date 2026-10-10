import { $, createEl } from '../utils/helpers.js';
import { extractIngredients } from './MealApi.js';

export function setStatus(message) {
  $('#status').textContent = message;
}

export function renderCards(meals, onView) {
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
    const btn = createEl('button', { className: 'btn', text: 'View Recipe', attrs: { type: 'button' } });
    btn.addEventListener('click', () => onView(meal.idMeal));
    body.append(btn);
    card.append(body);
    container.append(card);
  });
}

export function showModal(meal) {
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
  const close = createEl('button', { className: 'btn', text: 'Close', attrs: { type: 'button' } });
  close.addEventListener('click', () => dialog.close());
  dialog.append(close);
  dialog.showModal();
}

export function fillCategories(categories) {
  const select = $('#category-select');
  categories.forEach((c) => select.append(createEl('option', { text: c, attrs: { value: c } })));
}
