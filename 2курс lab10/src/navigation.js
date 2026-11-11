export const LEVELS = ['basic', 'medium', 'advanced'];

export function initNavigation() {
  const buttons = [...document.querySelectorAll('[data-level]')];

  function showLevel(id) {
    const active = LEVELS.includes(id) ? id : 'basic';
    for (const button of buttons) {
      const selected = button.dataset.level === active;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      document.querySelector(`#${button.dataset.level}`).hidden = !selected;
    }
  }

  for (const [index, button] of buttons.entries()) {
    button.addEventListener('click', () => {
      showLevel(button.dataset.level);
      // pushState меняет URL без переноса фокуса с кнопки на якорь секции.
      if (window.location.hash.slice(1) !== button.dataset.level) {
        window.history.pushState(null, '', `#${button.dataset.level}`);
      }
    });
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      buttons[next].focus();
      buttons[next].click();
    });
  }
  window.addEventListener('hashchange', () => showLevel(window.location.hash.slice(1)));
  window.addEventListener('popstate', () => showLevel(window.location.hash.slice(1)));
  showLevel(window.location.hash.slice(1));
}
