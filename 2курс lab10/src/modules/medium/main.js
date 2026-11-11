// Обработчики связывают модель, интерфейс и независимый модуль хранения.
import {
  addTask, toggleTask, removeTask, clearCompletedTasks,
  filterTasks, getTaskCounts, restoreTasks,
} from "./model.js";
import createTaskInterface, { renderTasks, showTaskMessage, showStorageWarning } from "./ui.js";
import { createStorage } from "../shared/storage.js";

export function initMedium(root) {
  const view = createTaskInterface(root);
  const storage = createStorage("lab10.tasks.v1");
  const savedTasks = storage.load([]);
  let tasks = restoreTasks(savedTasks);
  let currentFilter = "all";

  function render() {
    renderTasks(view, filterTasks(tasks, currentFilter), getTaskCounts(tasks), currentFilter);
  }

  function commit(message) {
    const saved = storage.save(tasks);
    render();
    showTaskMessage(view, message);
    showStorageWarning(view, saved ? "" :
      "Не удалось сохранить задачи. Изменения останутся только до перезагрузки страницы.");
  }

  render();
  if (storage.getLastError()) {
    showStorageWarning(view, storage.getLastError());
  } else if (JSON.stringify(savedTasks) !== JSON.stringify(tasks)) {
    showStorageWarning(view, "Сохранённые данные содержали ошибки. Загружены только корректные задачи.");
  }

  view.form.addEventListener("submit", (event) => {
    event.preventDefault();
    try {
      tasks = addTask(tasks, view.title.value);
      // Новая задача должна быть видна даже после фильтра «Выполненные».
      currentFilter = "all";
      view.filter.value = currentFilter;
      view.form.reset();
      commit("Задача добавлена.");
      view.title.focus();
    } catch (error) {
      showTaskMessage(view, error.message, true);
      view.title.focus();
    }
  });

  view.title.addEventListener("input", () => showTaskMessage(view));

  view.filter.addEventListener("change", () => {
    currentFilter = view.filter.value;
    render();
    showTaskMessage(view);
  });

  view.list.addEventListener("change", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.dataset.action !== "toggle") return;
    try {
      const id = Number(input.dataset.id);
      tasks = toggleTask(tasks, id);
      const changedTask = tasks.find((task) => task.id === id);
      commit(changedTask.completed ? "Задача выполнена." : "Задача снова отмечена как невыполненная.");
      const nextCheckbox = view.list.querySelector(`input[data-id="${id}"]`);
      (nextCheckbox || view.filter).focus();
    } catch (error) {
      render();
      showTaskMessage(view, error.message, true);
    }
  });

  view.list.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button[data-action="remove"]');
    if (!button || !view.list.contains(button)) return;
    try {
      tasks = removeTask(tasks, Number(button.dataset.id));
      commit("Задача удалена.");
      view.title.focus();
    } catch (error) {
      showTaskMessage(view, error.message, true);
    }
  });

  view.clearCompleted.addEventListener("click", () => {
    tasks = clearCompletedTasks(tasks);
    commit("Выполненные задачи удалены.");
    view.filter.focus();
  });
}
