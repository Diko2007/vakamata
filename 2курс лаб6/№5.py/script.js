const themeBtn = document.querySelector("#themeBtn");
const resetBtn = document.querySelector("#resetBtn");
const status = document.querySelector("#status");


// Переключение темы
themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    const darkTheme = document.body.classList.contains("dark");

    if (darkTheme) {
        status.textContent = "Сейчас включена темная тема";

        localStorage.setItem("theme", "dark");
    } else {
        status.textContent = "Сейчас включена светлая тема";

        localStorage.setItem("theme", "light");
    }

});


// Сброс темы
resetBtn.addEventListener("click", function () {

    document.body.classList.remove("dark");

    status.textContent = "Сейчас включена светлая тема";

    localStorage.setItem("theme", "light");

});


// Дополнительная функция:
// восстановление темы после перезагрузки страницы

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

    status.textContent = "Сейчас включена темная тема";

}
