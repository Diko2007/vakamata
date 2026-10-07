const temperatureInput = document.querySelector("#temperature");
const fromUnit = document.querySelector("#fromUnit");
const toUnit = document.querySelector("#toUnit");
const convertButton = document.querySelector("#convertButton");
const result = document.querySelector("#result");
const history = document.querySelector("#history");
const clearHistory = document.querySelector("#clearHistory");

function toCelsius(value, unit) {
    if (unit === "C") {
        return value;
    } else if (unit === "F") {
        return (value - 32) * 5 / 9;
    } else if (unit === "K") {
        return value - 273.15;
    }
}

function fromCelsius(value, unit) {
    if (unit === "C") {
        return value;
    } else if (unit === "F") {
        return value * 9 / 5 + 32;
    } else if (unit === "K") {
        return value + 273.15;
    }
}

function convertTemperature() {
    const value = Number(temperatureInput.value);
    const from = fromUnit.value;
    const to = toUnit.value;

    if (temperatureInput.value === "") {
        result.textContent = "Введите температуру.";
        return;
    }

    if (from === "C" && value < -273.15) {
        result.textContent = "Ошибка: температура не может быть ниже -273.15 °C.";
        return;
    } else if (from === "F" && value < -459.67) {
        result.textContent = "Ошибка: температура не может быть ниже -459.67 °F.";
        return;
    } else if (from === "K" && value < 0) {
        result.textContent = "Ошибка: температура в Кельвинах не может быть ниже 0 K.";
        return;
    }

    const celsius = toCelsius(value, from);
    const convertedValue = fromCelsius(celsius, to);

    let roundedValue = convertedValue;

    for (let i = 0; i < 1; i++) {
        roundedValue = Math.round(convertedValue * 100) / 100;
    }

    result.textContent =
        value + " " + from + " = " + roundedValue + " " + to;
        const historyItem = document.createElement("li");
historyItem.textContent =
    value + " " + from + " = " + roundedValue + " " + to;

history.appendChild(historyItem);

}

convertButton.addEventListener("click", convertTemperature);

temperatureInput.addEventListener("input", function () {
    result.textContent = "Введите данные и нажмите «Конвертировать».";
});

fromUnit.addEventListener("change", function () {
    result.textContent = "Единица температуры изменена.";
});
clearHistory.addEventListener("click", function () {
    history.innerHTML = "";
});

