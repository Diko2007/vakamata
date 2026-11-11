export const CLIENT_STATUSES = Object.freeze(["Новый", "В работе", "Завершён"]);

const asText = (value) => (typeof value === "string" ? value : "");

export function normalizeClient(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const phone = asText(source.phone).trim();
  return {
    name: asText(source.name).trim().replace(/\s+/gu, " "),
    email: asText(source.email).trim().toLowerCase(),
    phone: `${phone.startsWith("+") ? "+" : ""}${phone.replace(/\D/gu, "")}`,
    status: asText(source.status).trim(),
  };
}

export function validateClient(input, clients = [], excludeId = null) {
  const source = input && typeof input === "object" ? input : {};
  const data = normalizeClient(source);
  const rawPhone = asText(source.phone).trim();
  const errors = {};

  if (data.name.length < 2 || data.name.length > 80) {
    errors.name = "Имя должно содержать от 2 до 80 символов.";
  }
  if (data.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(data.email)) {
    errors.email = "Введите email в формате name@example.com.";
  } else if (clients.some((client) => client.id !== excludeId && client.email.toLowerCase() === data.email)) {
    errors.email = "Клиент с таким email уже существует.";
  }

  const phoneDigits = data.phone.replace(/\D/gu, "");
  if (!/^\+?[\d\s()-]+$/u.test(rawPhone) || phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "Телефон: от 10 до 15 цифр; допустимы +, пробелы, скобки и дефисы.";
  }
  if (!CLIENT_STATUSES.includes(data.status)) {
    errors.status = "Выберите статус клиента из списка.";
  }

  return { valid: Object.keys(errors).length === 0, errors, data };
}
