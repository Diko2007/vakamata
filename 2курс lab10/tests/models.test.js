import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  ABSOLUTE_ZERO, parseTemperature, convertTemperature,
  celsiusToFahrenheit, fahrenheitToCelsius, celsiusToKelvin,
} from "../src/modules/basic/temperature.js";
import {
  addTask, toggleTask, removeTask, clearCompletedTasks,
  filterTasks, getTaskCounts, restoreTasks,
} from "../src/modules/medium/model.js";
import { normalizeClient, validateClient } from "../src/modules/advanced/validation.js";
import {
  addClient, updateClient, deleteClient, getClientById, sanitizeClients,
} from "../src/modules/advanced/contacts.js";
import {
  searchClients, filterClientsByStatus, sortClients, selectClients,
} from "../src/modules/advanced/search.js";
import { createStorage } from "../src/modules/shared/storage.js";

// Проверки запускаются без браузера: бизнес-модули не зависят от DOM.
const almostEqual = (actual, expected) => {
  assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} должно быть близко к ${expected}`);
};

function frozenTasks() {
  return Object.freeze([
    Object.freeze({ id: 1, title: "Прочитать лекцию", completed: false }),
    Object.freeze({ id: 2, title: "Сдать работу", completed: true }),
  ]);
}

const validClient = (changes = {}) => ({
  name: "Алия Садыкова",
  email: "aliya@example.org",
  phone: "+77011234567",
  status: "Новый",
  ...changes,
});

function frozenClients() {
  return Object.freeze([
    Object.freeze({ id: "client-a", name: "Борис Иванов", email: "boris@example.org", phone: "+77011234567", status: "Новый" }),
    Object.freeze({ id: "client-b", name: "Анна Петрова", email: "anna@example.org", phone: "+77027654321", status: "В работе" }),
    Object.freeze({ id: "client-c", name: "Вера Садыкова", email: "vera@example.org", phone: "+77035553322", status: "Завершён" }),
    Object.freeze({ id: "client-d", name: "Алексей Ким", email: "alex@example.org", phone: "+77048889900", status: "Новый" }),
  ]);
}

// Минимальный адаптер Storage для проверки JSON и ошибок, без DOM-заглушек.
function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
  };
}

describe("Базовый уровень: конвертер температур", () => {
  it("B01: правильные формулы °C ↔ °F и °C ↔ K", () => {
    assert.equal(celsiusToFahrenheit(25), 77);
    assert.equal(fahrenheitToCelsius(32), 0);
    assert.equal(celsiusToKelvin(100), 373.15);
    assert.equal(convertTemperature("25", "C", "F"), 77);
    assert.equal(convertTemperature("32", "F", "C"), 0);
    assert.equal(convertTemperature("100", "C", "K"), 373.15);
    almostEqual(convertTemperature("273.15", "K", "C"), 0);
    almostEqual(convertTemperature("32", "F", "K"), 273.15);
    almostEqual(convertTemperature("273.15", "K", "F"), 32);
  });

  it("B02: ноль является числом, а не пустым вводом", () => {
    assert.equal(parseTemperature("0"), 0);
    assert.equal(convertTemperature(0, "C", "F"), 32);
    assert.equal(convertTemperature("0", "C", "K"), 273.15);
    assert.equal(convertTemperature(0, "K", "K"), 0);
  });

  it("B03: десятичная запятая, Unicode-минус и научная запись", () => {
    assert.equal(parseTemperature("  −12,5  "), -12.5);
    assert.equal(convertTemperature("−12,5", "C", "F"), 9.5);
    assert.equal(parseTemperature("1,25e2"), 125);
  });

  it("B04: пустое поле отклоняется", () => {
    for (const value of ["", "   ", "\n\t"]) {
      assert.throws(() => convertTemperature(value, "C", "F"), /Введите температуру/);
    }
  });

  it("B05: неправильный формат и нечисловые значения отклоняются", () => {
    for (const value of ["abc", "12abc", "1,2,3", "0x10", "1e309", null, true, [], {}, NaN, Infinity]) {
      assert.throws(() => convertTemperature(value, "C", "F"), Error);
    }
  });

  it("B06: абсолютный ноль принимается точно во всех шкалах", () => {
    for (const from of ["C", "F", "K"]) {
      for (const to of ["C", "F", "K"]) {
        assert.equal(convertTemperature(ABSOLUTE_ZERO[from], from, to), ABSOLUTE_ZERO[to]);
      }
    }
  });

  it("B07: температура ниже абсолютного нуля отклоняется", () => {
    for (const from of ["C", "F", "K"]) {
      assert.throws(() => convertTemperature(ABSOLUTE_ZERO[from] - 0.01, from, "C"), /абсолютного нуля/);
    }
  });

  it("B08: неизвестные единицы и свойства прототипа не принимаются", () => {
    for (const unit of ["R", "", "toString", "__proto__"]) {
      assert.throws(() => convertTemperature(10, unit, "C"), /Выберите существующую единицу/);
      assert.throws(() => convertTemperature(10, "C", unit), /Выберите существующую единицу/);
    }
  });

  it("B09: переполнение результата перехватывается, большие конечные результаты допустимы", () => {
    assert.throws(() => convertTemperature(Number.MAX_VALUE, "C", "F"), /Результат слишком велик/);
    const result = convertTemperature(Number.MAX_VALUE, "F", "C");
    assert.ok(Number.isFinite(result) && result > 0);
    assert.equal(convertTemperature(Number.MAX_VALUE, "C", "C"), Number.MAX_VALUE);
  });

  it("B10: повторный расчёт и обратный перевод не накапливают состояние", () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      assert.equal(convertTemperature(25, "C", "F"), 77);
      assert.equal(convertTemperature(77, "F", "C"), 25);
    }
    assert.equal(convertTemperature(100, "C", "C"), 100);
  });
});

describe("Средний уровень: список задач", () => {
  it("M01: добавление нормализует пробелы, создаёт ID и не меняет исходный массив", () => {
    const empty = Object.freeze([]);
    const first = addTask(empty, "  Сдать   лабораторную  ");
    assert.deepEqual(first, [{ id: 1, title: "Сдать лабораторную", completed: false }]);
    assert.deepEqual(empty, []);
    const second = addTask(Object.freeze(first.map(Object.freeze)), "Подготовить README");
    assert.equal(second.length, 2);
    assert.notEqual(second[0].id, second[1].id);
    assert.equal(first.length, 1);
  });

  it("M02: пустое название отклоняется", () => {
    assert.throws(() => addTask([], "  "), /Введите название задачи/);
  });

  it("M03: название неправильного типа отклоняется", () => {
    for (const value of [123, null, undefined, {}, []]) {
      assert.throws(() => addTask([], value), /должно быть текстом/);
    }
  });

  it("M04: допустимы 1 и 120 символов, но не 121", () => {
    assert.equal(addTask([], "Я")[0].title, "Я");
    assert.equal(addTask([], "я".repeat(120))[0].title.length, 120);
    assert.throws(() => addTask([], "я".repeat(121)), /не более 120/);
  });

  it("M05: повтор задачи отклоняется без учёта регистра и лишних пробелов", () => {
    const tasks = frozenTasks();
    assert.throws(() => addTask(tasks, " сдать   РАБОТУ "), /уже есть/);
    assert.equal(tasks.length, 2);
  });

  it("M06: двойное переключение возвращает состояние без изменения исходных данных", () => {
    const tasks = frozenTasks();
    const completed = toggleTask(tasks, 1);
    assert.equal(completed[0].completed, true);
    assert.equal(tasks[0].completed, false);
    assert.deepEqual(toggleTask(completed, 1), tasks);
  });

  it("M07: удаляется нужная задача; повторное удаление и неизвестный ID дают ошибку", () => {
    const tasks = frozenTasks();
    const remaining = removeTask(tasks, 1);
    assert.deepEqual(remaining, [{ id: 2, title: "Сдать работу", completed: true }]);
    assert.equal(tasks.length, 2);
    assert.throws(() => removeTask(remaining, 1), /не найдена/);
    assert.throws(() => toggleTask(tasks, 999), /не найдена/);
  });

  it("M08: фильтры и счётчики соответствуют состояниям задач", () => {
    const tasks = frozenTasks();
    assert.deepEqual(getTaskCounts(tasks), { total: 2, active: 1, completed: 1 });
    assert.deepEqual(filterTasks(tasks, "active").map((task) => task.id), [1]);
    assert.deepEqual(filterTasks(tasks, "completed").map((task) => task.id), [2]);
    assert.deepEqual(filterTasks(tasks, "all"), tasks);
    assert.deepEqual(getTaskCounts([]), { total: 0, active: 0, completed: 0 });
    assert.throws(() => filterTasks(tasks, "unknown"), /Неизвестный фильтр/);
  });

  it("M09: очистка удаляет только выполненные задачи и допускает повтор", () => {
    const tasks = frozenTasks();
    const active = clearCompletedTasks(tasks);
    assert.deepEqual(active, [{ id: 1, title: "Прочитать лекцию", completed: false }]);
    assert.deepEqual(clearCompletedTasks(active), active);
    assert.equal(tasks.length, 2);
  });

  it("M10: восстановление исключает повреждённые записи, повторные ID и названия", () => {
    const raw = [
      null,
      { id: 1, title: "А", completed: false },
      { id: 1, title: "Б", completed: false },
      { id: 2, title: " а ", completed: true },
      { id: -1, title: "В", completed: false },
      { id: 3, title: "Г", completed: "false" },
      { id: 4, title: "  Д  ", completed: true },
    ];
    assert.deepEqual(restoreTasks(raw), [
      { id: 1, title: "А", completed: false },
      { id: 4, title: "Д", completed: true },
    ]);
    assert.deepEqual(restoreTasks({ unexpected: true }), []);
  });
});

describe("Повышенный уровень: мини-CRM", () => {
  it("H01: корректный клиент добавляется с нормализацией и без мутации", () => {
    const input = validClient({
      name: "  Алия   Садыкова  ", email: " ALIYA@EXAMPLE.ORG ",
      phone: "+7 (701) 123-45-67", status: " Новый ",
    });
    const empty = Object.freeze([]);
    assert.deepEqual(normalizeClient(input), validClient());
    const clients = addClient(empty, input, "client-1");
    assert.deepEqual(clients, [{ id: "client-1", ...validClient() }]);
    assert.deepEqual(empty, []);
    assert.deepEqual(getClientById(clients, "client-1"), clients[0]);
    assert.equal(getClientById(clients, "missing"), null);
  });

  it("H02: пустые обязательные поля дают отдельные ошибки", () => {
    const result = validateClient({ name: " ", email: "", phone: "", status: "" });
    assert.equal(result.valid, false);
    assert.deepEqual(Object.keys(result.errors).sort(), ["email", "name", "phone", "status"]);
    assert.throws(() => addClient([], {}, "client-1"), /Имя должно содержать/);
  });

  it("H03: неправильный email, буквы в телефоне и неизвестный статус отклоняются", () => {
    for (const email of ["not-an-email", "a@@example.org", "a b@example.org"]) {
      assert.ok(validateClient(validClient({ email })).errors.email);
    }
    for (const phone of ["abc77011234567", "++77011234567"]) {
      assert.ok(validateClient(validClient({ phone })).errors.phone);
    }
    assert.ok(validateClient(validClient({ status: "Неизвестный" })).errors.status);
    assert.equal(validateClient(null).valid, false);
  });

  it("H04: длина имени допускает границы 2 и 80 символов", () => {
    for (const name of ["Ян", "я".repeat(80)]) {
      assert.equal(validateClient(validClient({ name })).valid, true);
    }
    for (const name of ["Я", "я".repeat(81)]) {
      assert.ok(validateClient(validClient({ name })).errors.name);
    }
  });

  it("H05: проверяются границы длины телефона и email", () => {
    for (const phone of ["+1234567890", "+123456789012345"]) {
      assert.equal(validateClient(validClient({ phone })).valid, true);
    }
    for (const phone of ["+123456789", "+1234567890123456"]) {
      assert.ok(validateClient(validClient({ phone })).errors.phone);
    }
    const longestEmail = `${"a".repeat(242)}@example.org`;
    assert.equal(longestEmail.length, 254);
    assert.equal(validateClient(validClient({ email: longestEmail })).valid, true);
    assert.ok(validateClient(validClient({ email: `a${longestEmail}` })).errors.email);
  });

  it("H06: повтор email с другим регистром и повтор идентификатора запрещены", () => {
    const clients = frozenClients();
    assert.throws(() => addClient(clients, validClient({ email: " BORIS@EXAMPLE.ORG " }), "new-id"), /email уже существует/);
    assert.throws(() => addClient(clients, validClient(), "client-a"), /уникальный идентификатор/);
    assert.throws(() => addClient(clients, validClient(), "  "), /уникальный идентификатор/);
    assert.equal(clients.length, 4);
  });

  it("H07: редактирование сохраняет свой email и меняет только выбранного клиента", () => {
    const clients = frozenClients();
    const updated = updateClient(clients, "client-a", {
      ...clients[0], name: " Борис   Сергеев ", email: " BORIS@EXAMPLE.ORG ", status: "В работе",
    });
    assert.equal(updated[0].name, "Борис Сергеев");
    assert.equal(updated[0].email, "boris@example.org");
    assert.equal(updated[0].status, "В работе");
    assert.equal(updated[0].id, "client-a");
    assert.equal(clients[0].name, "Борис Иванов");
    assert.deepEqual(updated.slice(1), clients.slice(1));
  });

  it("H08: редактирование не допускает чужой email или неизвестный ID", () => {
    const clients = frozenClients();
    assert.throws(() => updateClient(clients, "client-a", { ...clients[0], email: clients[1].email }), /email уже существует/);
    assert.throws(() => updateClient(clients, "missing", validClient()), /для изменения не найден/);
  });

  it("H09: удаление не меняет исходный массив, повторное удаление сообщает об ошибке", () => {
    const clients = frozenClients();
    const remaining = deleteClient(clients, "client-b");
    assert.deepEqual(remaining.map((client) => client.id), ["client-a", "client-c", "client-d"]);
    assert.equal(clients.length, 4);
    assert.throws(() => deleteClient(remaining, "client-b"), /для удаления не найден/);
  });

  it("H10: поиск работает по имени, email и телефону независимо от оформления", () => {
    const clients = frozenClients();
    assert.deepEqual(searchClients(clients, "ивАНОВ").map((client) => client.id), ["client-a"]);
    assert.deepEqual(searchClients(clients, "ANNA@EXAMPLE").map((client) => client.id), ["client-b"]);
    assert.deepEqual(searchClients(clients, "  +7 (701) 123-45-67  ").map((client) => client.id), ["client-a"]);
    assert.deepEqual(searchClients(clients, "701123").map((client) => client.id), ["client-a"]);
    assert.deepEqual(searchClients(clients, "несуществующий"), []);
    assert.deepEqual(searchClients(clients, "   "), clients);
  });

  it("H11: фильтрация, сортировки и составной запрос работают без мутации", () => {
    const clients = frozenClients();
    const ids = (items) => items.map((client) => client.id);
    assert.deepEqual(ids(filterClientsByStatus(clients, "Новый")), ["client-a", "client-d"]);
    assert.deepEqual(ids(sortClients(clients, "name-asc")), ["client-d", "client-b", "client-a", "client-c"]);
    assert.deepEqual(ids(sortClients(clients, "name-desc")), ["client-c", "client-a", "client-b", "client-d"]);
    assert.deepEqual(ids(sortClients(clients, "status")), ["client-d", "client-a", "client-b", "client-c"]);
    assert.deepEqual(ids(selectClients(clients, { query: "EXAMPLE.ORG", status: "Новый", sort: "name-desc" })), ["client-a", "client-d"]);
    assert.deepEqual(ids(clients), ["client-a", "client-b", "client-c", "client-d"]);
  });

  it("H12: восстановление исключает повреждённые, повторные и невалидные записи", () => {
    const clients = frozenClients();
    const raw = [
      null, clients[0],
      { ...clients[1], id: "client-a" },
      { ...clients[1], email: " BORIS@EXAMPLE.ORG " },
      { ...clients[1], email: "broken" },
      { ...clients[1], id: "x".repeat(101) },
      { ...clients[1], status: "Ошибка" },
      clients[3],
    ];
    assert.deepEqual(sanitizeClients(raw), [clients[0], clients[3]]);
    assert.deepEqual(sanitizeClients({ unexpected: true }), []);
  });
});

describe("Общий модуль хранения JSON", () => {
  it("S01: отсутствие ключа возвращает резервное значение без ошибки", () => {
    const storage = createStorage("missing", memoryStorage());
    const fallback = [];
    assert.equal(storage.load(fallback), fallback);
    assert.equal(storage.getLastError(), "");
  });

  it("S02: сохранение и чтение выполняют JSON-копирование данных", () => {
    const storage = createStorage("tasks", memoryStorage());
    const original = [{ id: 1, title: "Сдать работу", completed: false }];
    assert.equal(storage.save(original), true);
    const loaded = storage.load([]);
    assert.deepEqual(loaded, original);
    assert.notEqual(loaded, original);
    loaded[0].title = "Изменено только в памяти";
    assert.equal(storage.load([])[0].title, "Сдать работу");
  });

  it("S03: очистка одного ключа не удаляет данные другого проекта", () => {
    const adapter = memoryStorage();
    const tasks = createStorage("tasks", adapter);
    const crm = createStorage("crm", adapter);
    tasks.save(["Задача"]);
    crm.save(["Клиент"]);
    assert.equal(tasks.clear(), true);
    assert.deepEqual(tasks.load([]), []);
    assert.deepEqual(crm.load([]), ["Клиент"]);
    assert.equal(tasks.clear(), true);
  });

  it("S04: повреждённый JSON не вызывает падения, после исправления ошибка очищается", () => {
    const adapter = memoryStorage();
    adapter.setItem("tasks", "{broken-json");
    const storage = createStorage("tasks", adapter);
    assert.deepEqual(storage.load([]), []);
    assert.match(storage.getLastError(), /Не удалось прочитать/);
    assert.equal(adapter.getItem("tasks"), "{broken-json");
    adapter.setItem("tasks", '[{"id":1}]');
    assert.deepEqual(storage.load([]), [{ id: 1 }]);
    assert.equal(storage.getLastError(), "");
  });

  it("S05: заблокированное хранилище возвращает fallback/false и понятные ошибки", () => {
    const blocked = () => { throw new Error("Storage blocked"); };
    const storage = createStorage("tasks", { getItem: blocked, setItem: blocked, removeItem: blocked });
    assert.deepEqual(storage.load([]), []);
    assert.match(storage.getLastError(), /Не удалось прочитать/);
    assert.equal(storage.save([]), false);
    assert.match(storage.getLastError(), /Не удалось сохранить/);
    assert.equal(storage.clear(), false);
    assert.match(storage.getLastError(), /Не удалось очистить/);
  });

  it("S06: ошибка квоты и циклический JSON не теряют последнее успешное сохранение", () => {
    const backend = memoryStorage();
    let quotaExceeded = true;
    const storage = createStorage("tasks", {
      ...backend,
      setItem(key, value) {
        if (quotaExceeded) throw new Error("Quota exceeded");
        backend.setItem(key, value);
      },
    });
    assert.equal(storage.save([1]), false);
    assert.match(storage.getLastError(), /Не удалось сохранить/);
    quotaExceeded = false;
    assert.equal(storage.save([2]), true);
    assert.equal(storage.getLastError(), "");
    const circular = {};
    circular.self = circular;
    assert.equal(storage.save(circular), false);
    assert.match(storage.getLastError(), /Не удалось сохранить/);
    assert.deepEqual(storage.load([]), [2]);
  });
});
