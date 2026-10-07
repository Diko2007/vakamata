const form = document.getElementById("orderForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");

nameInput.addEventListener("input", function() {
    document.getElementById("previewName").textContent =
        nameInput.value || "—";
});

emailInput.addEventListener("input", function() {
    document.getElementById("previewEmail").textContent =
        emailInput.value || "—";
});

phoneInput.addEventListener("input", function() {
    document.getElementById("previewPhone").textContent =
        phoneInput.value || "—";
});

addressInput.addEventListener("input", function() {
    document.getElementById("previewAddress").textContent =
        addressInput.value || "—";
});


const deliveryInputs = document.querySelectorAll(
    'input[name="delivery"]'
);

deliveryInputs.forEach(function(input) {
    input.addEventListener("change", function() {
        document.getElementById("previewDelivery").textContent =
            input.value === "courier" ? "Курьер" : "Самовывоз";
    });
});


const paymentInputs = document.querySelectorAll(
    'input[name="payment"]'
);

paymentInputs.forEach(function(input) {
    input.addEventListener("change", function() {
        document.getElementById("previewPayment").textContent =
            input.value === "card" ? "Банковская карта" : "Наличными";
    });
});


form.addEventListener("submit", function(event) {

    event.preventDefault();

    document.getElementById("nameError").textContent = "";
    document.getElementById("emailError").textContent = "";
    document.getElementById("phoneError").textContent = "";
    document.getElementById("addressError").textContent = "";
    document.getElementById("deliveryError").textContent = "";
    document.getElementById("paymentError").textContent = "";
    document.getElementById("agreementError").textContent = "";
    document.getElementById("success").textContent = "";

    let valid = true;

    if (nameInput.value === "") {
        document.getElementById("nameError").textContent =
            "Введите имя";
        valid = false;
    }

    if (emailInput.value === "") {
        document.getElementById("emailError").textContent =
            "Введите email";
        valid = false;
    }

    if (phoneInput.value === "") {
        document.getElementById("phoneError").textContent =
            "Введите телефон";
        valid = false;
    }

    if (addressInput.value === "") {
        document.getElementById("addressError").textContent =
            "Введите адрес";
        valid = false;
    }

    if (!document.querySelector('input[name="delivery"]:checked')) {
        document.getElementById("deliveryError").textContent =
            "Выберите способ доставки";
        valid = false;
    }

    if (!document.querySelector('input[name="payment"]:checked')) {
        document.getElementById("paymentError").textContent =
            "Выберите способ оплаты";
        valid = false;
    }

    if (!document.getElementById("agreement").checked) {
        document.getElementById("agreementError").textContent =
            "Необходимо согласиться с правилами";
        valid = false;
    }

    if (valid) {
        document.getElementById("success").textContent =
            "Заказ успешно оформлен!";
    }

});
