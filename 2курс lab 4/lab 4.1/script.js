const form = document.getElementById("studentForm");
const message = document.getElementById("message");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const course = document.getElementById("course").value;
    const agreement = document.getElementById("agreement").checked;

    if (name === "" || email === "" || course === "" || !agreement) {
        message.textContent = "Пожалуйста, заполните все обязательные поля.";
        message.style.color = "red";
        return;
    }

    message.textContent = "Регистрация успешно выполнена!";
    message.style.color = "green";
});
