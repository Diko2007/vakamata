import { validateClient } from "./validation.js";

function requireValidData(input, clients, excludeId = null) {
  const result = validateClient(input, clients, excludeId);
  if (!result.valid) throw new Error(Object.values(result.errors).join(" "));
  return result.data;
}

export function getClientById(clients, id) {
  return clients.find((client) => client.id === id) ?? null;
}

export function addClient(clients, input, id) {
  if (typeof id !== "string" || !id.trim() || getClientById(clients, id)) {
    throw new Error("Не удалось создать уникальный идентификатор клиента.");
  }
  const data = requireValidData(input, clients);
  return [...clients, { id, ...data }];
}

export function updateClient(clients, id, input) {
  if (!getClientById(clients, id)) throw new Error("Клиент для изменения не найден.");
  const data = requireValidData(input, clients, id);
  return clients.map((client) => (client.id === id ? { id, ...data } : client));
}

export function deleteClient(clients, id) {
  if (!getClientById(clients, id)) throw new Error("Клиент для удаления не найден.");
  return clients.filter((client) => client.id !== id);
}

// Загруженный JSON проверяется так же, как ввод пользователя.
export function sanitizeClients(value) {
  if (!Array.isArray(value)) return [];
  const clients = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id.trim()) continue;
    if (item.id.length > 100 || getClientById(clients, item.id)) continue;
    const result = validateClient(item, clients);
    if (result.valid) clients.push({ id: item.id, ...result.data });
  }
  return clients;
}
