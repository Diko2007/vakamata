import { UNIT_LABELS } from './temperature.js';

export default function createTemperatureUI(root) {
  root.innerHTML = `
    <div class="card">
      <p class="eyebrow">Базовый уровень · вариант 1</p>
      <h2>Конвертер температур</h2>
      <p class="muted">Перевод между градусами Цельсия, Фаренгейта и кельвинами.</p>
      <form id="temperature-form" novalidate>
        <div class="form-grid">
          <div class="field">
            <label for="temperature-value">Температура</label>
            <input id="temperature-value" name="value" type="text" inputmode="decimal"
              value="0" autocomplete="off" aria-describedby="temperature-hint temperature-error">
            <small id="temperature-hint" class="muted">Можно использовать точку или запятую: −12,5.</small>
          </div>
          <div class="field">
            <label for="temperature-from">Из единицы</label>
            <select id="temperature-from" name="from">
              <option value="C">Цельсий (°C)</option>
              <option value="F">Фаренгейт (°F)</option>
              <option value="K">Кельвин (K)</option>
            </select>
          </div>
          <div class="field">
            <label for="temperature-to">В единицу</label>
            <select id="temperature-to" name="to">
              <option value="F">Фаренгейт (°F)</option>
              <option value="C">Цельсий (°C)</option>
              <option value="K">Кельвин (K)</option>
            </select>
          </div>
        </div>
        <div class="actions">
          <button class="button" type="submit">Перевести</button>
          <button class="button secondary" id="temperature-swap" type="button">Поменять единицы</button>
          <button class="button secondary" type="reset">Сбросить</button>
        </div>
      </form>
      <p id="temperature-error" class="notice error" role="alert" hidden></p>
      <div class="result-box">
        <p class="muted">Результат</p>
        <output id="temperature-result" for="temperature-value temperature-from temperature-to"
          aria-live="polite">Нажмите «Перевести», чтобы получить результат.</output>
        <p id="temperature-formula" class="muted"></p>
      </div>
      <p class="muted">Нижняя граница: −273,15 °C = −459,67 °F = 0 K.</p>
    </div>
  `;
  return {
    form: root.querySelector('#temperature-form'),
    value: root.querySelector('#temperature-value'),
    from: root.querySelector('#temperature-from'),
    to: root.querySelector('#temperature-to'),
    swap: root.querySelector('#temperature-swap'),
    result: root.querySelector('#temperature-result'),
    formula: root.querySelector('#temperature-formula'),
    error: root.querySelector('#temperature-error'),
  };
}

function formatNumber(value) {
  if (value !== 0 && (Math.abs(value) < 0.000001 || Math.abs(value) >= 1e12)) {
    return value.toExponential(6).replace('.', ',');
  }
  return new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 6 }).format(value);
}

export function clearTemperatureResult(ui, formula) {
  ui.error.hidden = true;
  ui.error.textContent = '';
  ui.value.removeAttribute('aria-invalid');
  ui.result.textContent = 'Нажмите «Перевести», чтобы получить результат.';
  ui.formula.textContent = formula;
}

export function showTemperatureResult(ui, input, result, from, to, formula) {
  clearTemperatureResult(ui, formula);
  ui.result.textContent = `${formatNumber(input)} ${UNIT_LABELS[from]} = ${formatNumber(result)} ${UNIT_LABELS[to]}`;
}

export function showTemperatureError(ui, message) {
  ui.error.textContent = message;
  ui.error.hidden = false;
  ui.value.setAttribute('aria-invalid', 'true');
  ui.result.textContent = 'Исправьте ввод и повторите перевод.';
}
