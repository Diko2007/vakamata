import { convertTemperature, getFormula, parseTemperature } from './temperature.js';
import createTemperatureUI, {
  clearTemperatureResult,
  showTemperatureError,
  showTemperatureResult,
} from './ui.js';

export function initBasic(root) {
  const ui = createTemperatureUI(root);
  const clear = () => clearTemperatureResult(ui, getFormula(ui.from.value, ui.to.value));
  clear();

  ui.form.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
      const input = parseTemperature(ui.value.value);
      const result = convertTemperature(input, ui.from.value, ui.to.value);
      showTemperatureResult(ui, input, result, ui.from.value, ui.to.value,
        getFormula(ui.from.value, ui.to.value));
    } catch (error) {
      showTemperatureError(ui, error.message);
    }
  });

  ui.value.addEventListener('input', clear);
  ui.from.addEventListener('change', clear);
  ui.to.addEventListener('change', clear);

  ui.swap.addEventListener('click', () => {
    const from = ui.from.value;
    ui.from.value = ui.to.value;
    ui.to.value = from;
    clear();
  });

  ui.form.addEventListener('reset', () => {
    clearTemperatureResult(ui, getFormula('C', 'F'));
  });
}
