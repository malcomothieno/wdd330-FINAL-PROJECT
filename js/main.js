import { $ } from './utils/helpers.js';
import * as Api from './modules/MealApi.js';
import * as Grocery from './modules/GroceryList.js';
import { loadFavorites, saveFavorites, loadTheme, saveTheme, loadLastSearch, saveLastSearch } from './modules/Storage.js';
import { getAdvice } from './modules/AdviceApi.js';
import { renderCards, showModal, setStatus, fillCategories, renderGrocery, setTip } from './modules/UI.js';

const refreshGrocery = () => renderGrocery({
  onToggle: (id) => { Grocery.toggleItem(id); refreshGrocery(); },
  onDelete: (id) => { Grocery.deleteItem(id); refreshGrocery(); }
});

async function addMealToGrocery(id) {
  try {
    const meal = await Api.getMealById(id);
    if (!meal) return;
    const added = Grocery.addIngredients(Api.extractIngredients(meal));
    refreshGrocery();
    setStatus(added ? `Added ${added} ingredient(s) from ${meal.strMeal} to your grocery list.` : `${meal.strMeal} ingredients are already on your list.`);
  } catch (err) {
    console.error(err);
    setStatus('Could not add ingredients. Please try again.');
  }
}

function toggleFavorite(id) {
  const favs = loadFavorites();
  saveFavorites(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);
}

const cardHandlers = { onView: viewRecipe, onAdd: addMealToGrocery };
const modalHandlers = { onAdd: addMealToGrocery, onFavorite: toggleFavorite, isFavorite: (id) => loadFavorites().includes(id) };

async function load(fetcher, label) {
  setStatus('Loading…');
  try {
    const meals = await fetcher();
    renderCards(meals, cardHandlers);
    setStatus(meals.length ? `${meals.length} recipe(s) found for ${label}.` : `No recipes found for ${label}.`);
  } catch (err) {
    console.error(err);
    renderCards([], cardHandlers);
    setStatus('Something went wrong reaching the recipe service. Please try again.');
  }
}

async function viewRecipe(id) {
  try {
    const meal = await Api.getMealById(id);
    if (meal) showModal(meal, modalHandlers);
  } catch (err) {
    console.error(err);
    setStatus('Could not load that recipe.');
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = $('#theme-btn');
  btn.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
  btn.setAttribute('aria-pressed', String(theme === 'dark'));
}

document.addEventListener('DOMContentLoaded', async () => {
  applyTheme(loadTheme());
  $('#theme-btn').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
  });
  const last = loadLastSearch();
  if (last) { $('#search-input').value = last; load(() => Api.searchMeals(last), `"${last}"`); }
  refreshGrocery();
  getAdvice().then(setTip);

  $('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const term = $('#search-input').value.trim();
    if (term) { saveLastSearch(term); load(() => Api.searchMeals(term), `"${term}"`); }
  });

  $('#category-select').addEventListener('change', (e) => {
    const cat = e.target.value;
    if (cat) load(() => Api.filterByCategory(cat), cat);
  });

  $('#surprise-btn').addEventListener('click', async () => {
    try {
      const meal = await Api.getRandomMeal();
      if (meal) { renderCards([meal], cardHandlers); setStatus('Here is a surprise recipe!'); showModal(meal, modalHandlers); }
    } catch (err) {
      console.error(err);
      setStatus('Could not fetch a random recipe.');
    }
  });

  $('#favorites-btn').addEventListener('click', () => {
    const ids = loadFavorites();
    if (!ids.length) { renderCards([], cardHandlers); setStatus('No favorites yet. Open a recipe and save it.'); return; }
    load(async () => (await Promise.all(ids.map(Api.getMealById))).filter(Boolean), 'your favorites');
  });

  $('#grocery-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#grocery-input');
    Grocery.addItem(input.value);
    input.value = '';
    refreshGrocery();
  });

  $('#clear-checked').addEventListener('click', () => { Grocery.clearChecked(); refreshGrocery(); });

  try { fillCategories(await Api.getCategories()); } catch (err) { console.error(err); }
});
