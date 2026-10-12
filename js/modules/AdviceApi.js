const URL = 'https://api.adviceslip.com/advice';
const FALLBACK = 'Drink at least 8 glasses of water today!';

export async function getAdvice() {
  try {
    // Advice Slip caches responses, so a unique query string forces a fresh tip
    const res = await fetch(`${URL}?t=${Date.now()}`);
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    return data.slip?.advice ?? FALLBACK;
  } catch (err) {
    console.error('Advice API failed', err);
    return FALLBACK;
  }
}
