import { addClient, deleteClient, getClientById, sanitizeClients, updateClient } from "./contacts.js";
import { validateClient } from "./validation.js";
import { selectClients } from "./search.js";
import createCrmUI from "./ui.js";
import { createStorage } from "../shared/storage.js";

export function initAdvanced(root) {
  const ui = createCrmUI(root);
  const storage = createStorage("lab10.crm.clients.v1");
  const loaded = storage.load([]);
  let clients = sanitizeClients(loaded);
  let editingId = null;

  if (storage.getLastError()) {
    ui.setStorageWarning(storage.getLastError());
  } else if (!Array.isArray(loaded) || loaded.length !== clients.length) {
    ui.setStorageWarning("Некорректные записи из хранилища пропущены. Остальные данные доступны.");
  }

  function render() {
    ui.renderList(selectClients(clients, ui.readFilters()), clients.length);
  }

  function saveChanges(message) {
    const saved = storage.save(clients);
    ui.setStorageWarning(saved ? "" : `Изменения доступны только в текущем сеансе. ${storage.getLastError()}`);
    render();
    ui.showMessage(message);
  }

  function newId() {
    let id;
    do {
      id = globalThis.crypto?.randomUUID?.() ?? `client-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    } while (getClientById(clients, id));
    return id;
  }

  ui.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = ui.readForm();
    const result = validateClient(input, clients, editingId);
    ui.setErrors(result.errors);
    if (!result.valid) {
      ui.showMessage("Проверьте отмеченные поля. Запись не сохранена.", "error");
      ui.focusFirstError(result.errors);
      return;
    }
    try {
      const isEditing = editingId !== null;
      clients = isEditing ? updateClient(clients, editingId, input) : addClient(clients, input, newId());
      editingId = null;
      ui.setEditing();
      saveChanges(isEditing ? "Данные клиента обновлены." : "Клиент добавлен.");
    } catch (error) {
      ui.showMessage(error.message, "error");
    }
  });

  ui.form.addEventListener("input", (event) => ui.clearFieldError(event.target.name));
  ui.cancelButton.addEventListener("click", () => {
    editingId = null;
    ui.setEditing();
    ui.showMessage("Редактирование отменено.");
  });

  ui.tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button || !ui.tableBody.contains(button)) return;
    const client = getClientById(clients, button.dataset.id);
    if (!client) {
      ui.showMessage("Клиент не найден. Список обновлён.", "error");
      render();
      return;
    }
    if (button.dataset.action === "edit") {
      editingId = client.id;
      ui.setEditing(client);
      ui.showMessage("");
    } else if (button.dataset.action === "delete" && window.confirm(`Удалить клиента «${client.name}»?`)) {
      clients = deleteClient(clients, client.id);
      if (editingId === client.id) {
        editingId = null;
        ui.setEditing();
      }
      saveChanges("Клиент удалён.");
    }
  });

  ui.searchInput.addEventListener("input", render);
  ui.filterSelect.addEventListener("change", render);
  ui.sortSelect.addEventListener("change", render);
  render();
}
