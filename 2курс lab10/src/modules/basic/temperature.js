// Бизнес-логика: модуль не обращается к DOM и не хранит состояние формы.
export const UNIT_LABELS = Object.freeze({ C: '°C', F: '°F', K: 'K' });
export const ABSOLUTE_ZERO = Object.freeze({ C: -273.15, F: -459.67, K: 0 });

export function parseTemperature(value) {
  if (typeof value === 'string') {
    const text = value.trim().replace(/^−/, '-').replace(',', '.');
    if (text === '') throw new Error('Введите температуру.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(text)) {
      throw new Error('Введите число, например 25 или −12,5.');
    }
    value = Number(text);
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Введите конечное число допустимой величины.');
  }
  return value;
}

export function celsiusToFahrenheit(celsius) {
  return celsius * 1.8 + 32;
}

export function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) / 1.8;
}

export function celsiusToKelvin(celsius) {
  return celsius + 273.15;
}

function validateUnit(unit) {
  if (!Object.hasOwn(UNIT_LABELS, unit)) {
    throw new Error('Выберите существующую единицу: °C, °F или K.');
  }
}

export function convertTemperature(value, from, to) {
  validateUnit(from);
  validateUnit(to);
  const number = parseTemperature(value);

  if (number < ABSOLUTE_ZERO[from]) {
    throw new Error(`Температура не может быть ниже абсолютного нуля: ${ABSOLUTE_ZERO[from]} ${UNIT_LABELS[from]}.`);
  }
  if (from === to) return number;
  // Точная граница избавляет от погрешности вроде −273.15000000000003.
  if (number === ABSOLUTE_ZERO[from]) return ABSOLUTE_ZERO[to];

  const celsius = from === 'C'
    ? number
    : from === 'F' ? fahrenheitToCelsius(number) : number - 273.15;
  const result = to === 'C'
    ? celsius
    : to === 'F' ? celsiusToFahrenheit(celsius) : celsiusToKelvin(celsius);

  if (!Number.isFinite(result)) {
    throw new Error('Результат слишком велик. Уменьшите исходное число.');
  }
  return Math.max(result, ABSOLUTE_ZERO[to]);
}

export function getFormula(from, to) {
  validateUnit(from);
  validateUnit(to);
  if (from === to) return 'Единицы совпадают: значение не изменяется.';
  const formulas = {
    'C-F': '°F = °C × 1,8 + 32',
    'F-C': '°C = (°F − 32) ÷ 1,8',
    'C-K': 'K = °C + 273,15',
    'K-C': '°C = K − 273,15',
    'F-K': 'K = (°F − 32) ÷ 1,8 + 273,15',
    'K-F': '°F = (K − 273,15) × 1,8 + 32',
  };
  return formulas[`${from}-${to}`];
}
