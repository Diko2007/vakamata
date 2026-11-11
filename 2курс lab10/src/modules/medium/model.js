// Модель задач: данные и правила работы без DOM и localStorage.
export const MAX_TITLE_LENGTH = 120;

export function normalizeTitle(value) {
  if (typeof value !== "string") {
    throw new Error("Название задачи должно быть текстом.");
  }
  return value.trim().replace(/\s+/g, " ");
}

export function validateTaskTitle(value, tasks = []) {
  const title = normalizeTitle(value);
  if (title.length === 0) {
    throw new Error("Введите название задачи.");
  }
  if (title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Название должно содержать не более ${MAX_TITLE_LENGTH} символов.`);
  }
  if (tasks.some((task) => normalizeTitle(task.title).toLocaleLowerCase("ru") === title.toLocaleLowerCase("ru"))) {
    throw new Error("Такая задача уже есть в списке.");
  }
  return title;
}

export function addTask(tasks, value) {
  const title = validateTaskTitle(value, tasks);
  const largestId = tasks.reduce((largest, task) => Math.max(largest, task.id), 0);
  const id = largestId + 1;
  if (!Number.isSafeInteger(id)) {
    throw new Error("Не удалось создать номер задачи.");
  }
  return [...tasks, { id, title, completed: false }];
}

function requireTask(tasks, id) {
  if (!tasks.some((task) => task.id === id)) {
    throw new Error("Задача не найдена. Обновите список.");
  }
}

export function toggleTask(tasks, id) {
  requireTask(tasks, id);
  return tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
}

export function removeTask(tasks, id) {
  requireTask(tasks, id);
  return tasks.filter((task) => task.id !== id);
}

export function clearCompletedTasks(tasks) {
  return tasks.filter((task) => !task.completed);
}

export function filterTasks(tasks, filter = "all") {
  if (filter === "active") return tasks.filter((task) => !task.completed);
  if (filter === "completed") return tasks.filter((task) => task.completed);
  if (filter === "all") return [...tasks];
  throw new Error("Неизвестный фильтр задач.");
}

export function getTaskCounts(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  return { total: tasks.length, active: tasks.length - completed, completed };
}

// При загрузке принимаем только корректные записи с уникальными ID и названиями.
export function restoreTasks(value) {
  if (!Array.isArray(value)) return [];
  const tasks = [];
  const ids = new Set();
  for (const item of value) {
    if (!item || typeof item !== "object" || !Number.isSafeInteger(item.id) || item.id < 1 ||
        typeof item.completed !== "boolean" || ids.has(item.id)) continue;
    try {
      const title = validateTaskTitle(item.title, tasks);
      tasks.push({ id: item.id, title, completed: item.completed });
      ids.add(item.id);
    } catch {
      // Повреждённая запись не должна мешать загрузке остальных задач.
    }
  }
  return tasks;
}
