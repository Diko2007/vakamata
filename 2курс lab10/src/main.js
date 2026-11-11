import { initBasic } from './modules/basic/main.js';
import { initMedium } from './modules/medium/main.js';
import { initAdvanced } from './modules/advanced/main.js';
import { initNavigation } from './navigation.js';

try {
  initBasic(document.querySelector('#basic'));
  initMedium(document.querySelector('#medium'));
  initAdvanced(document.querySelector('#advanced'));
  initNavigation();
  document.querySelector('#startup-status').hidden = true;
} catch (error) {
  const status = document.querySelector('#startup-status');
  status.className = 'notice error';
  status.textContent = 'Не удалось запустить приложение. Проверьте, что архив распакован полностью, и откройте страницу через start.py.';
  console.error(error);
}
