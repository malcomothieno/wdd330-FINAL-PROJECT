export const $ = (selector, root = document) => root.querySelector(selector);

export function createEl(tag, { className, text, attrs = {} } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text; // textContent avoids HTML injection
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  return el;
}
