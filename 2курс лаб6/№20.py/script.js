const startBtn =
    document.querySelector("#startBtn");

const gameArea =
    document.querySelector("#gameArea");

const target =
    document.querySelector("#target");

const scoreText =
    document.querySelector("#score");

const message =
    document.querySelector("#message");


let score = 0;

const maxScore = 10;


// Перемещение объекта
function moveTarget() {

    const maxX =
        gameArea.clientWidth - target.offsetWidth;

    const maxY =
        gameArea.clientHeight - target.offsetHeight;


    const randomX =
        Math.floor(Math.random() * maxX);

    const randomY =
        Math.floor(Math.random() * maxY);


    target.style.left = randomX + "px";

    target.style.top = randomY + "px";
}


// Начало игры
function startGame() {

    score = 0;

    scoreText.textContent =
        `Попаданий: ${score} / ${maxScore}`;

    message.textContent =
        "Игра началась! Лови объект.";

    target.hidden = false;

    startBtn.disabled = true;

    // Возвращаем размер объекта
    target.style.width = "50px";
    target.style.height = "50px";

    moveTarget();
}


// Кнопка начала игры
startBtn.addEventListener("click", function () {

    startGame();

});


// Клик по объекту
target.addEventListener("click", function () {

    score++;


    scoreText.textContent =
        `Попаданий: ${score} / ${maxScore}`;


    // Дополнительная функция:
    // объект уменьшается после каждого попадания

    const newSize =
        Math.max(25, 50 - score * 2);

    target.style.width =
        newSize + "px";

    target.style.height =
        newSize + "px";


    // Проверяем окончание игры
    if (score >= maxScore) {

        target.hidden = true;

        startBtn.disabled = false;

        message.textContent =
            "Игра окончена! Ты поймал объект 10 раз.";

        return;
    }


    // Перемещаем объект
    moveTarget();

});