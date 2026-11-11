import { CLIENT_STATUSES } from "./validation.js";

export default function createCrmUI(root) {
  root.innerHTML = `
    <header class="level-heading">
      <p class="eyebrow">Повышенный уровень · Вариант 16</p>
      <h2>Мини-CRM клиентов</h2>
      <p class="muted">Добавляйте клиентов, редактируйте данные, ищите записи и меняйте статус.</p>
    </header>
    <p id="crm-message" class="notice" role="status" aria-live="polite" hidden></p>
    <p id="crm-storage-notice" class="notice error" role="status" aria-live="polite" hidden></p>
    <form id="crm-form" class="card" novalidate>
      <h3 id="crm-form-title">Новый клиент</h3>
      <div class="form-grid">
        <div class="field">
          <label for="crm-name">Имя клиента</label>
          <input id="crm-name" name="name" type="text" autocomplete="name" required maxlength="80" placeholder="Например, Алия Садыкова" aria-describedby="crm-name-error">
          <p id="crm-name-error" class="field-error" hidden></p>
        </div>
        <div class="field">
          <label for="crm-email">Email клиента</label>
          <input id="crm-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="name@example.com" aria-describedby="crm-email-error">
          <p id="crm-email-error" class="field-error" hidden></p>
        </div>
        <div class="field">
          <label for="crm-phone">Телефон клиента</label>
          <input id="crm-phone" name="phone" type="tel" autocomplete="tel" required maxlength="40" placeholder="+7 701 123 45 67" aria-describedby="crm-phone-help crm-phone-error">
          <p id="crm-phone-help" class="muted">От 10 до 15 цифр. Можно использовать +, пробелы, скобки и дефисы.</p>
          <p id="crm-phone-error" class="field-error" hidden></p>
        </div>
        <div class="field">
          <label for="crm-status">Статус клиента</label>
          <select id="crm-status" name="status" aria-describedby="crm-status-error"></select>
          <p id="crm-status-error" class="field-error" hidden></p>
        </div>
      </div>
      <div class="actions">
        <button id="crm-submit" class="button" type="submit">Добавить клиента</button>
        <button id="crm-cancel" class="button secondary" type="button" hidden>Отменить редактирование</button>
      </div>
      <p class="muted">Записи сохраняются в этом браузере. Учебная CRM не отправляет данные на сервер.</p>
    </form>
    <section class="card" aria-labelledby="crm-list-title">
      <div class="section-toolbar">
        <h3 id="crm-list-title">Клиенты</h3>
        <p id="crm-count" class="badge" aria-live="polite"></p>
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="crm-search">Поиск клиентов</label>
          <input id="crm-search" type="search" placeholder="Имя, email или телефон">
        </div>
        <div class="field">
          <label for="crm-filter">Фильтр по статусу</label>
          <select id="crm-filter"><option value="all">Все статусы</option></select>
        </div>
        <div class="field">
          <label for="crm-sort">Сортировка клиентов</label>
          <select id="crm-sort">
            <option value="name-asc">Имя: А → Я</option>
            <option value="name-desc">Имя: Я → А</option>
            <option value="status">По статусу</option>
          </select>
        </div>
      </div>
      <div id="crm-table-wrap" class="table-wrap">
        <table class="data-table">
          <thead><tr><th scope="col">Имя</th><th scope="col">Email</th><th scope="col">Телефон</th><th scope="col">Статус</th><th scope="col">Действия</th></tr></thead>
          <tbody id="crm-rows"></tbody>
        </table>
      </div>
      <p id="crm-empty" class="empty-state" hidden></p>
    </section>`;

  const find = (selector) => root.querySelector(selector);
  const form = find("#crm-form");
  const fields = Object.fromEntries(["name", "email", "phone", "status"].map((name) => [name, find(`#crm-${name}`)]));
  const tableBody = find("#crm-rows");
  const cancelButton = find("#crm-cancel");
  const searchInput = find("#crm-search");
  const filterSelect = find("#crm-filter");
  const sortSelect = find("#crm-sort");

  for (const status of CLIENT_STATUSES) {
    for (const select of [fields.status, filterSelect]) {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      select.append(option);
    }
  }

  function setErrors(errors = {}) {
    for (const [name, input] of Object.entries(fields)) {
      const error = find(`#crm-${name}-error`);
      error.textContent = errors[name] ?? "";
      error.hidden = !errors[name];
      input.setAttribute("aria-invalid", String(Boolean(errors[name])));
    }
  }

  function clearFieldError(name) {
    if (!Object.hasOwn(fields, name)) return;
    fields[name].setAttribute("aria-invalid", "false");
    const error = find(`#crm-${name}-error`);
    error.textContent = "";
    error.hidden = true;
  }

  function showMessage(text, type = "success") {
    const message = find("#crm-message");
    message.textContent = text;
    message.className = `notice ${type === "error" ? "error" : "success"}`;
    message.hidden = !text;
  }

  function setStorageWarning(text) {
    const message = find("#crm-storage-notice");
    message.textContent = text;
    message.hidden = !text;
  }

  function setEditing(client = null) {
    form.reset();
    setErrors();
    if (client) {
      for (const [name, input] of Object.entries(fields)) input.value = client[name];
    }
    find("#crm-form-title").textContent = client ? "Редактирование клиента" : "Новый клиент";
    find("#crm-submit").textContent = client ? "Сохранить изменения" : "Добавить клиента";
    cancelButton.hidden = !client;
    if (client) fields.name.focus();
  }

  function renderList(clients, total) {
    tableBody.replaceChildren();
    for (const client of clients) {
      const row = document.createElement("tr");
      for (const key of ["name", "email", "phone", "status"]) {
        const cell = document.createElement("td");
        cell.textContent = client[key];
        row.append(cell);
      }
      const actionsCell = document.createElement("td");
      const actions = document.createElement("div");
      actions.className = "actions";
      for (const [action, title, style] of [["edit", "Изменить", "secondary"], ["delete", "Удалить", "danger"]]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `button ${style}`;
        button.textContent = title;
        button.setAttribute("aria-label", `${title} клиента ${client.name}`);
        button.dataset.action = action;
        button.dataset.id = client.id;
        actions.append(button);
      }
      actionsCell.append(actions);
      row.append(actionsCell);
      tableBody.append(row);
    }
    find("#crm-count").textContent = `Всего: ${total}. Показано: ${clients.length}.`;
    const empty = find("#crm-empty");
    empty.hidden = clients.length > 0;
    empty.textContent = total === 0 ? "Клиентов пока нет. Добавьте первую запись через форму." : "По вашему запросу ничего не найдено.";
    find("#crm-table-wrap").hidden = clients.length === 0;
  }

  return {
    form, tableBody, cancelButton, searchInput, filterSelect, sortSelect,
    readForm: () => Object.fromEntries(Object.entries(fields).map(([name, input]) => [name, input.value])),
    readFilters: () => ({ query: searchInput.value, status: filterSelect.value, sort: sortSelect.value }),
    focusFirstError: (errors) => fields[Object.keys(errors)[0]]?.focus(),
    setErrors, clearFieldError, showMessage, setStorageWarning, setEditing, renderList,
  };
}
