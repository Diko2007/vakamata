import { CLIENT_STATUSES } from "./validation.js";

export function searchClients(clients, query = "") {
  const text = String(query ?? "").trim().toLocaleLowerCase("ru");
  if (!text) return [...clients];
  const phoneQuery = /^[+\d\s()-]+$/u.test(text) ? text.replace(/\D/gu, "") : "";
  return clients.filter((client) => {
    const fields = [client.name, client.email, client.phone];
    const textMatches = fields.some((field) => field.toLocaleLowerCase("ru").includes(text));
    const phoneMatches = phoneQuery && client.phone.replace(/\D/gu, "").includes(phoneQuery);
    return textMatches || Boolean(phoneMatches);
  });
}

export function filterClientsByStatus(clients, status = "all") {
  return status === "all" ? [...clients] : clients.filter((client) => client.status === status);
}

export function sortClients(clients, order = "name-asc") {
  return [...clients].sort((a, b) => {
    const byName = a.name.localeCompare(b.name, "ru", { sensitivity: "base", numeric: true });
    if (order === "name-desc") return -byName;
    if (order === "status") {
      return CLIENT_STATUSES.indexOf(a.status) - CLIENT_STATUSES.indexOf(b.status) || byName;
    }
    return byName;
  });
}

export function selectClients(clients, { query = "", status = "all", sort = "name-asc" } = {}) {
  return sortClients(filterClientsByStatus(searchClients(clients, query), status), sort);
}
