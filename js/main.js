import { $ } from './utils/helpers.js';
import * as Api from './modules/MealApi.js';
import { renderCards, showModal, setStatus, fillCategories } from './modules/UI.js';

async function load(fetcher, label) {
  setStatus('Loading…');
  try {
    const meals = await fetcher();
    renderCards(meals, viewRecipe);
    setStatus(meals.length ? `${meals.length} recipe(s) found for ${label}.` : `No recipes found for ${label}.`);
  } catch (err) {
    console.error(err);
    renderCards([], viewRecipe);
    setStatus('Something went wrong reaching the recipe service. Please try again.');
  }
}

async function viewRecipe(id) {
  try {
    const meal = await Api.getMealById(id);
    if (meal) showModal(meal);
  } catch (err) {
    console.error(err);
    setStatus('Could not load that recipe.');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  $('#search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const term = $('#search-input').value.trim();
    if (term) load(() => Api.searchMeals(term), `"${term}"`);
  });

  $('#category-select').addEventListener('change', (e) => {
    const cat = e.target.value;
    if (cat) load(() => Api.filterByCategory(cat), cat);
  });

  $('#surprise-btn').addEventListener('click', async () => {
    try {
      const meal = await Api.getRandomMeal();
      if (meal) { renderCards([meal], viewRecipe); setStatus('Here is a surprise recipe!'); showModal(meal); }
    } catch (err) {
      console.error(err);
      setStatus('Could not fetch a random recipe.');
    }
  });

  try { fillCategories(await Api.getCategories()); } catch (err) { console.error(err); }
});
