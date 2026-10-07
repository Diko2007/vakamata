const form = document.getElementById("orderForm");

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

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    const delivery = document.querySelector(
        'input[name="delivery"]:checked'
    );

    const payment = document.querySelector(
        'input[name="payment"]:checked'
    );

    const agreement = document.getElementById("agreement").checked;


    if (name === "") {
        document.getElementById("nameError").textContent =
            "Введите имя";
        valid = false;
    }

    if (email === "") {
        document.getElementById("emailError").textContent =
            "Введите email";
        valid = false;
    }

    if (phone === "") {
        document.getElementById("phoneError").textContent =
            "Введите телефон";
        valid = false;
    }

    if (address === "") {
        document.getElementById("addressError").textContent =
            "Введите адрес";
        valid = false;
    }

    if (!delivery) {
        document.getElementById("deliveryError").textContent =
            "Выберите способ доставки";
        valid = false;
    }

    if (!payment) {
        document.getElementById("paymentError").textContent =
            "Выберите способ оплаты";
        valid = false;
    }

    if (!agreement) {
        document.getElementById("agreementError").textContent =
            "Необходимо согласиться с правилами";
        valid = false;
    }

    if (valid) {
        document.getElementById("success").textContent =
            "Заказ успешно оформлен!";
    }

});
