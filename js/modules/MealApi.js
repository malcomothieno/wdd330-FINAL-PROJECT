const BASE = 'https://www.themealdb.com/api/json/v1/1';

async function request(path) {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`TheMealDB request failed (${res.status})`);
  return res.json();
}

/** Search by meal name; if nothing matches, fall back to main-ingredient filter. */
export async function searchMeals(term) {
  const q = encodeURIComponent(term.trim());
  const byName = await request(`search.php?s=${q}`);
  if (byName.meals) return byName.meals;
  const byIngredient = await request(`filter.php?i=${q}`);
  return byIngredient.meals ?? [];
}

export async function getCategories() {
  const data = await request('list.php?c=list');
  return (data.meals ?? []).map((m) => m.strCategory);
}

export async function filterByCategory(category) {
  const data = await request(`filter.php?c=${encodeURIComponent(category)}`);
  return data.meals ?? [];
}

export async function getMealById(id) {
  const data = await request(`lookup.php?i=${encodeURIComponent(id)}`);
  return data.meals?.[0] ?? null;
}

export async function getRandomMeal() {
  const data = await request('random.php');
  return data.meals?.[0] ?? null;
}

/** Collapse strIngredient1..20 / strMeasure1..20 into a clean array. */
export function extractIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const name = meal[`strIngredient${i}`]?.trim();
    if (name) items.push({ name, measure: meal[`strMeasure${i}`]?.trim() ?? '' });
  }
  return items;
}
