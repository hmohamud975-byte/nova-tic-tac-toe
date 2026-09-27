const cells = document.querySelectorAll(".cell");

const message = document.getElementById("message");

const turn = document.getElementById("turn");

const round = document.getElementById("round");

const xScore = document.getElementById("xScore");

const oScore = document.getElementById("oScore");

const playerOne = document.getElementById("playerOne");

const playerTwo = document.getElementById("playerTwo");

const log = document.getElementById("log");

const themeBtn = document.getElementById("themeBtn");

const newGameBtn = document.getElementById("newGame");

const resetScoreBtn = document.getElementById("resetScore");

const modeButtons = document.querySelectorAll(".mode");


let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameOver = false;

let mode = "ai";

let roundNumber = 1;

let scores = {
    X: 0,
    O: 0
};


const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];

const savedScores = localStorage.getItem("novaScores");

if (savedScores) {

    scores = JSON.parse(savedScores);

    updateScore();

}

cells.forEach((cell, index) => {

    cell.addEventListener("click", () => {

        if (gameOver) return;

        if (board[index] !== "") return;

        if (mode === "ai" && currentPlayer === "O") return;


        makeMove(index);

    });

});



function makeMove(index) {

    board[index] = currentPlayer;

    cells[index].textContent = currentPlayer;

    cells[index].classList.add(currentPlayer.toLowerCase());


    const result = checkWinner();


    if (result) {

        endGame(result);

        return;

    }


    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateTurn();

    if (mode === "ai" && currentPlayer === "O") {

        turn.textContent = "AI THINKING";

        log.textContent = "NOVA is analyzing the grid...";

        setTimeout(aiMove, 500);

    }

}

function aiMove() {

    if (gameOver) return;


    let move = findBestMove();


    makeMove(move);

}

function findBestMove() {


    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            board[i] = "O";

            if (checkWinnerOnly() === "O") {

                board[i] = "";

                return i;

            }

            board[i] = "";

        }

    }

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            board[i] = "X";

            if (checkWinnerOnly() === "X") {

                board[i] = "";

                return i;

            }

            board[i] = "";

        }

    }

    if (board[4] === "") {

        return 4;

    }

    const corners = [0, 2, 6, 8];

    const availableCorners = corners.filter(i => board[i] === "");


    if (availableCorners.length > 0) {

        return availableCorners[
            Math.floor(Math.random() * availableCorners.length)
        ];

    }

    const available = board
        .map((value, index) => value === "" ? index : null)
        .filter(index => index !== null);


    return available[
        Math.floor(Math.random() * available.length)
    ];

}

function checkWinner() {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;


        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],
                combination: combination
            };

        }

    }


    if (board.every(cell => cell !== "")) {

        return {
            winner: "draw",
            combination: []
        };

    }


    return null;

}

function checkWinnerOnly() {

    for (const combination of winningCombinations) {

        const [a, b, c] = combination;


        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return board[a];

        }

    }


    return null;

}

function endGame(result) {

    gameOver = true;


    if (result.winner === "draw") {
    message.textContent = "GRID CONQUERED — DRAW";
    log.textContent = "New match starting in 10 seconds...";

    setTimeout(() => {
        startNewGame();
    }, 10000);

    return;


    }


    scores[result.winner]++;

    updateScore();

    saveScores();


    result.combination.forEach(index => {

        cells[index].classList.add("win");

    });


    if (mode === "ai") {

        if (result.winner === "X") {

            message.textContent = "MATCH POINT SECURED";

            message.classList.add("win");

            log.textContent = "You defeated NOVA.";

        } else {

            message.textContent =
                "GOT OUTPLAYED IN A 3×3 MAP";

            message.classList.add("loss");

            log.textContent =
                "NOVA read your moves and closed the match.";

        }

    } else {

        message.textContent =
            `${result.winner} — MATCH POINT SECURED`;

        message.classList.add("win");

        log.textContent =
            `Player ${result.winner} connected three.`;

    }

}

newGameBtn.addEventListener("click", () => {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameOver = false;

    roundNumber++;


    cells.forEach(cell => {

        cell.textContent = "";

        cell.className = "cell";

    });


    message.className = "";

    message.textContent =
        mode === "ai"
            ? "MAKE YOUR MOVE"
            : "PLAYER 01 STARTS";


    log.textContent = "New arena initialized.";

    updateTurn();

    round.textContent =
        `ROUND ${String(roundNumber).padStart(2, "0")}`;

});


resetScoreBtn.addEventListener("click", () => {

    scores = {
        X: 0,
        O: 0
    };

    saveScores();

    updateScore();

    log.textContent = "Scoreboard cleared.";

});


modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        modeButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");


        mode = button.dataset.mode;


        if (mode === "ai") {

            playerOne.textContent = "YOU";

            playerTwo.textContent = "NOVA AI";

        } else {

            playerOne.textContent = "PLAYER 01";

            playerTwo.textContent = "PLAYER 02";

        }


        startNewGame();

    });

});

function startNewGame() {

    board = ["", "", "", "", "", "", "", "", ""];

    currentPlayer = "X";

    gameOver = false;

    roundNumber = 1;


    cells.forEach(cell => {

        cell.textContent = "";

        cell.className = "cell";

    });


    message.className = "";

    message.textContent =
        mode === "ai"
            ? "MAKE YOUR MOVE"
            : "PLAYER 01 STARTS";


    updateTurn();

}

const themes = [

    {
        name: "CYBER",
        background: "#050611",
        cyan: "#00eaff",
        purple: "#9d4edd"
    },

    {
        name: "GALAXY",
        background: "#0d0620",
        cyan: "#c7a6ff",
        purple: "#7357ff"
    },

    {
        name: "CLOUD PINK",
        background: "#1c0d18",
        cyan: "#ffc8e8",
        purple: "#ff82c2"
    }

];


let themeIndex = 0;


themeBtn.addEventListener("click", () => {

    themeIndex++;

    if (themeIndex >= themes.length) {

        themeIndex = 0;

    }


    const theme = themes[themeIndex];


    document.documentElement.style.setProperty(
        "--background",
        theme.background
    );

    document.documentElement.style.setProperty(
        "--cyan",
        theme.cyan
    );

    document.documentElement.style.setProperty(
        "--purple",
        theme.purple
    );


    log.textContent =
        `${theme.name} theme activated.`;

});


function updateScore() {

    xScore.textContent = scores.X;

    oScore.textContent = scores.O;

}


function saveScores() {

    localStorage.setItem(
        "novaScores",
        JSON.stringify(scores)
    );

}


function updateTurn() {

    if (mode === "ai") {

        turn.textContent =
            currentPlayer === "X"
                ? "YOUR TURN"
                : "AI THINKING";

    } else {

        turn.textContent =
            currentPlayer === "X"
                ? "PLAYER 01"
                : "PLAYER 02";

    }

}