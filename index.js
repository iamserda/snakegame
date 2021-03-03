const appGrid = document.getElementById("snakeGrid");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const score = document.getElementById("score");
const high = document.getElementById("high");
const announceP = document.getElementById('announcement');
const title = document.getElementById('title')

let steps;
let boxes = [];
let currentSnake = [2, 1, 0];
let gameStarted = false;
let intervalID = null;
let intervalTime = 1000;
let appleIndex;
let currentScore = 0;
let highestScore = 0;

const rowLength = 10;
const moveUp = -10;
const moveDown = 10;
const moveLeft = -1;
const moveRight = 1;

const snakeHead = currentSnake[0];

function createGrid() {
    for (let i = 0; i < 100; i++) {
        const box = document.createElement("div");
        box.classList.add("box");
        appGrid.appendChild(box);
        boxes.push(box);
    }
}

function displaySnake() {
    currentSnake.forEach((index) => {
        boxes[index].classList.add("snake");
        // boxes[index].style.border = "none";
        boxes[index].style.width = "25px";
        boxes[index].style.height = "25px";
    });
}

function move(step) {
    if (
        (currentSnake[0] + rowLength >= 100 && steps === moveDown) || //if snake has hit bottom
        (currentSnake[0] % rowLength === 9 && steps === moveRight) || //if snake has hit right wall
        (currentSnake[0] % rowLength === 0 && steps === moveLeft) || //if snake has hit left wall
        (currentSnake[0] - rowLength < 0 && steps === moveUp) || //if snake has hit top
        boxes[currentSnake[0] + steps].classList.contains("snake")
    ) {
        title.textContent =
            "Game Over! Please [ Reset ].";
        return clearInterval(intervalID);
    } else {
        const oldTail = currentSnake.pop();

        boxes[oldTail].classList.remove("snake");
        boxes[oldTail].style.border = "1px solid white";
        boxes[oldTail].style.width = "25px";
        boxes[oldTail].style.height = "25px";

        currentSnake.unshift(currentSnake[0] + step);

        eatApple();

        boxes[currentSnake[0]].classList.add("snake");
        boxes[currentSnake[0]].style.border = "2px solid rgb(255, 238, 0)";
        boxes[currentSnake[0]].style.width = "25px";
        boxes[currentSnake[0]].style.height = "25px";

        // console.log(currentSnake[0]);
        // console.log(currentSnake);
    }
}

function resetGame() {
    score.textContent = currentScore;
    if (currentScore > highestScore) {
        highestScore = currentScore;
        announceNewHighScore();
    }
    currentScore = 0;
    score.innerText = 0;
    clearInterval(intervalID);
    intervalTime = 1000;
    boxes = [];
    currentSnake = [2, 1, 0];
    appGrid.innerHTML = "";
    createGrid();
    displaySnake();
    title.textContent = "Snake Game";
    gameStarted = false;
}

function announceNewHighScore() {
    announceP.textContent = "New High Score! Congratulations."
    announceP.classList.toggle('hidden')
    setTimeout(() => {
        announceP.classList.toggle('hidden'), 3000
    })

    high.textContent = highestScore;
}

function startGame() {
    steps = moveRight;
    displaySnake();
    generateApple()
    intervalID = setInterval(() => {
        move(steps);
    }, intervalTime);
    gameStarted = true;
}

// function gameStatus() {
//     console.log(rowLength);
//     console.log(steps);
// }

function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * (rowLength * rowLength));
    } while (boxes[appleIndex].classList.contains('snake'))
    boxes[appleIndex].classList.add('apple');
}

function eatApple() {
    if (currentSnake[0] === appleIndex) {
        boxes[appleIndex].classList.remove('apple');
        currentScore += 1;
        score.textContent = currentScore;
        if (currentScore > highestScore) {
            highestScore = currentScore;
            announceNewHighScore();
        }
        currentSnake.push(currentSnake[0] + steps)
        clearInterval(intervalID);
        intervalID = setInterval(() => {
            move(steps);
        }, intervalTime);
        intervalTime *= 0.9;

        generateApple();
    }
}

document.onkeydown = function control(e) {
    if (e.keyCode === 39) {
        // console.log(e.code, e.keyCode);
        steps = moveRight;
    } else if (e.keyCode === 38) {
        // console.log(e.code, e.keyCode);
        steps = moveUp;
    } else if (e.keyCode === 37) {
        // console.log(e.code, e.keyCode);
        steps = moveLeft;
    } else if (e.keyCode === 40) {
        // console.log(e.code, e.keyCode);
        steps = moveDown;
    }
};

startButton.addEventListener("click", () => {
    if (gameStarted === false) {
        startGame();
    }
});

resetButton.addEventListener("click", () => {
    resetGame();
});

createGrid();
displaySnake();