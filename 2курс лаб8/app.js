const input = document.querySelector("#note");
const list = document.querySelector("#notes");
const key = "lab8_shopping_list";

let notes = [];

// Загрузка и десериализация данных из localStorage с обработкой ошибок
try {
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    notes = Array.isArray(saved) ? saved : [];
} catch (error) {
    console.error("Ошибка при чтении из localStorage:", error);
    notes = [];
}

// Функция отрисовки интерфейса
function render() {
    list.replaceChildren();

    notes.forEach((text, index) => {
        const li = document.createElement("li");
        li.textContent = text;

        const del = document.createElement("button");
        del.textContent = "Удалить";
        
        // Удаление элемента по клику
        del.addEventListener("click", () => {
            notes.splice(index, 1);
            save();
        });

        li.append(del);
        list.append(li);
    });
}

// Функция сохранения в localStorage и обновления экрана
function save() {
    try {
        localStorage.setItem(key, JSON.stringify(notes));
    } catch (error) {
    }
    render();
}

// Обработчик добавления новой записи
document.querySelector("#add").addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return; // Защита от пустого ввода

    notes.push(text);
    input.value = "";
    save();
});

// Поддержка добавления по нажатию клавиши Enter
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        document.querySelector("#add").click();
    }
});

// Первичный вызов отрисовки при загрузке страницы
render();