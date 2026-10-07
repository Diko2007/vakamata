const input = document.querySelector("#taskInput");

const addBtn = document.querySelector("#addBtn");

const list = document.querySelector("#taskList");

const counter = document.querySelector("#counter");

const clearCompleted =
    document.querySelector("#clearCompleted");

const clearAll =
    document.querySelector("#clearAll");


// Обновление счетчика
function updateCounter() {

    const total =
        list.querySelectorAll("li").length;

    const completed =
        list.querySelectorAll("li.completed").length;

    counter.textContent =
        `Всего задач: ${total} | Выполнено: ${completed}`;
}


// Добавление задачи
function addTask() {

    const text = input.value.trim();

    // Не добавляем пустую задачу
    if (text === "") {
        return;
    }


    // Создаем новый элемент списка
    const li = document.createElement("li");

    const span = document.createElement("span");

    const deleteButton =
        document.createElement("button");


    span.textContent = text;

    deleteButton.textContent = "Удалить";

    deleteButton.className = "delete";


    // Отметить задачу выполненной
    span.addEventListener("click", function () {

        li.classList.toggle("completed");

        updateCounter();

    });


    // Удаление задачи
    deleteButton.addEventListener("click", function () {

        li.remove();

        updateCounter();

    });


    // Добавляем элементы в li
    li.append(span, deleteButton);


    // Добавляем li в список
    list.append(li);


    // Очищаем поле
    input.value = "";

    input.focus();


    updateCounter();
}


// Кнопка добавления
addBtn.addEventListener("click", addTask);


// Дополнительная функция:
// добавление задачи клавишей Enter

input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// Очистить выполненные
clearCompleted.addEventListener("click", function () {

    const completedTasks =
        list.querySelectorAll("li.completed");

    completedTasks.forEach(function (task) {

        task.remove();

    });

    updateCounter();

});


// Удалить все
clearAll.addEventListener("click", function () {

    list.replaceChildren();

    updateCounter();

});


updateCounter();