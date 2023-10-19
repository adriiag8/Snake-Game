//HTML elements
const board = document.getElementById("board");
const scoreBoard = document.getElementById("scoreBoard");
const startButton = document.getElementById("start");
const gameOverSign = document.getElementById("gameOver");


//Game Settings
const boardSize = 10;
const gameSpeed = 225;
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};


const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
};


//Game Variables
let snake;
let score;
let direction;
let boardSquares;
let emptySquares;
let moveInterval;
let audio = new Audio('/audio/ambient music.mp3');
audio.volume = 0.3;


// function that create the squares that is the path for the snake
const drawSquare = (square, type) => {
    let [row, column] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    let squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if (emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

// show the snake
const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}


const createRandomFood = () => {
    let randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

// make the movements of the snake
const moveSnake = () => {
    let newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    let [row, column] = newSquare.split('');

    if (newSquare < 0 ||
        newSquare > boardSize * boardSize ||
        (direction == 'ArrowRight' && column == 0) ||
        (direction == 'ArrowLeft' && column == 9 ||
            boardSquares[row][column] === squareTypes.snakeSquare)) {
        gameOver();
    } else {
        snake.push(newSquare);
        if (boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            let emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}


const addFood = () => {
    score++;
    updateScore();
    createRandomFood();

}


const gameOver = () => {
    gameOverSign.style.display = 'block';
    window.alert('Lo Siento, chocaste. ¡Empieza de nuevo!');
    clearInterval(moveInterval)
    startButton.disabled = false;
}


const setDirection = newDirection => {
    direction = newDirection;
}

// link the keyboard arrows with the game
const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}


const updateScore = () => {
    scoreBoard.innerText = score;
}


const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            let squareValue = `${rowIndex}${columnIndex}`;
            let squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
}


const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    board.innerHTML = '';
    emptySquares = [];
    createBoard();

}


const startGame = () => {
    setGame();
    gameOverSign.style.display = 'none';
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
    audio.play();
}


startButton.addEventListener('click', startGame);