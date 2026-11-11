// DOM-интерфейс: пользовательские строки выводятся только через textContent.
export default function createTaskInterface(root) {
  root.innerHTML = `
    <div class="level-heading">
      <p class="eyebrow">Средний уровень · Вариант 8</p>
      <h2>Список задач</h2>
      <p class="muted">Добавляйте задачи, отмечайте выполненные и выбирайте нужный фильтр.</p>
    </div>
    <div class="card">
      <form id="task-form" novalidate>
        <div class="form-grid">
          <label class="field" for="task-title">
            <span>Новая задача</span>
            <input id="task-title" name="title" type="text" maxlength="120"
              placeholder="Например, подготовиться к защите" autocomplete="off"
              aria-describedby="task-title-help task-message">
          </label>
        </div>
        <p class="muted" id="task-title-help">От 1 до 120 символов. Одинаковые задачи добавлять нельзя.</p>
        <div class="actions">
          <button class="button" type="submit">Добавить задачу</button>
        </div>
      </form>
      <p id="task-message" class="notice" role="status" aria-live="polite" hidden></p>
      <p data-role="storage-warning" class="notice error" role="status" aria-live="polite" hidden></p>
    </div>
    <div class="card">
      <div class="tasks-toolbar">
        <label class="field" for="task-filter">
          <span>Показать задачи</span>
          <select id="task-filter">
            <option value="all">Все задачи</option>
            <option value="active">Невыполненные</option>
            <option value="completed">Выполненные</option>
          </select>
        </label>
        <button class="button secondary" type="button" data-role="clear-completed" disabled>
          Удалить выполненные
        </button>
      </div>
      <p class="muted" data-role="counts" aria-live="polite"></p>
      <ul class="task-list" data-role="list" aria-label="Задачи"></ul>
      <p class="empty-state" data-role="empty"></p>
    </div>
  `;
  return {
    form: root.querySelector("#task-form"),
    title: root.querySelector("#task-title"),
    filter: root.querySelector("#task-filter"),
    list: root.querySelector('[data-role="list"]'),
    counts: root.querySelector('[data-role="counts"]'),
    empty: root.querySelector('[data-role="empty"]'),
    clearCompleted: root.querySelector('[data-role="clear-completed"]'),
    message: root.querySelector("#task-message"),
    storageWarning: root.querySelector('[data-role="storage-warning"]'),
  };
}

export function renderTasks(view, visibleTasks, counts, filter) {
  const fragment = document.createDocumentFragment();
  for (const task of visibleTasks) {
    const row = document.createElement("li");
    row.className = task.completed ? "task-row task-completed" : "task-row";

    const label = document.createElement("label");
    label.className = "task-label";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.dataset.action = "toggle";
    checkbox.dataset.id = String(task.id);
    const title = document.createElement("span");
    title.className = "task-text";
    title.textContent = task.title;
    label.append(checkbox, title);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "button danger";
    removeButton.textContent = "Удалить";
    removeButton.dataset.action = "remove";
    removeButton.dataset.id = String(task.id);
    removeButton.setAttribute("aria-label", `Удалить задачу «${task.title}»`);
    row.append(label, removeButton);
    fragment.append(row);
  }
  view.list.replaceChildren(fragment);
  view.counts.textContent = `Всего: ${counts.total} · Невыполненных: ${counts.active} · Выполненных: ${counts.completed}`;
  view.clearCompleted.disabled = counts.completed === 0;
  view.empty.hidden = visibleTasks.length > 0;
  const emptyMessages = {
    all: "Список пока пуст. Добавьте первую задачу.",
    active: "Невыполненных задач нет.",
    completed: "Выполненных задач пока нет.",
  };
  view.empty.textContent = emptyMessages[filter];
}

export function showTaskMessage(view, message = "", isError = false) {
  view.message.textContent = message;
  view.message.className = isError ? "notice error" : "notice success";
  view.message.hidden = !message;
  view.title.setAttribute("aria-invalid", String(isError));
}

export function showStorageWarning(view, message = "") {
  view.storageWarning.textContent = message;
  view.storageWarning.hidden = !message;
}
