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

        if (mode === "ai") {
        if (result.winner === "X") {
            saveMatchResult("Win");
        } else if (result.winner === "O") {
            saveMatchResult("Loss");
        } else if (result.winner === "draw") {
            saveMatchResult("Draw");
        }
    }


   if (result.winner === "draw") {
    message.textContent = "IT'S A DRAW, STAND DOWN!";
    log.textContent = "Draw! Start a new match when you're ready.";

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
    console.trace("NEW MATCH BUTTON FIRED");

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

async function saveMatchResult(result) {
    const token = localStorage.getItem("token");

    if (!token) {
        console.log("No login token. Match was not saved.");
        return;
    }

    try {
        const response = await fetch("/api/matches", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                result: result
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Could not save match:", data.message);
            return;
        }

        console.log("Match saved:", data);
    } catch (error) {
        console.error("Error saving match:", error);
    }
}

// =========================
// AUTHENTICATION
// =========================

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const registerPanel = document.getElementById("registerPanel");
const loginPanel = document.getElementById("loginPanel");

const showLogin = document.getElementById("showLogin");
const showRegister = document.getElementById("showRegister");

const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");


showLogin.addEventListener("click", () => {
    registerPanel.style.display = "none";
    loginPanel.style.display = "block";
});


showRegister.addEventListener("click", () => {
    loginPanel.style.display = "none";
    registerPanel.style.display = "block";
});


registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    registerMessage.textContent = "Creating account...";

    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password,
                confirmPassword: confirmPassword
            })
        });

        const data = await response.json();

        if (!response.ok) {
            registerMessage.textContent = data.message;
            return;
        }

        registerMessage.textContent = "Account created! Logging you in...";

        document.getElementById("registerForm").reset();

        setTimeout(() => {
            registerPanel.style.display = "none";
            loginPanel.style.display = "block";
        }, 1000);

    } catch (error) {
        console.error(error);
        registerMessage.textContent = "Could not connect to the server.";
    }
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    loginMessage.textContent = "Logging in...";

    try {
        const response = await fetch("https://nova-tic-tac-toe.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            loginMessage.textContent = data.message;
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);

        loginMessage.textContent = "Login successful!";

        setTimeout(() => {
            document.getElementById("authScreen").style.display = "none";
        }, 500);

    } catch (error) {
        console.error(error);
        loginMessage.textContent = "Could not connect to the server.";
    }
});

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    document.getElementById("authScreen").style.display = "flex";

    loginPanel.style.display = "block";
    registerPanel.style.display = "none";

    loginForm.reset();

    loginMessage.textContent = "";
});

// =========================
// MATCH HISTORY
// =========================

const historyBtn = document.getElementById("historyBtn");
const closeHistory = document.getElementById("closeHistory");
const historyScreen = document.getElementById("historyScreen");
const historyList = document.getElementById("historyList");

historyBtn.addEventListener("click", async () => {
    historyScreen.style.display = "flex";
    historyList.innerHTML = "<p>Loading match history...</p>";

    const token = localStorage.getItem("token");

    if (!token) {
        historyList.innerHTML = "<p>Please log in first.</p>";
        return;
    }

    try {
        const response = await fetch("/api/matches", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            historyList.innerHTML = `<p>${data.message}</p>`;
            return;
        }

        if (data.matches.length === 0) {
            historyList.innerHTML = "<p>No matches played yet.</p>";
            return;
        }

        historyList.innerHTML = "";

        data.matches.forEach(match => {
            const item = document.createElement("div");
            item.className = "history-item";

            item.innerHTML = `
                <div>
                    <div class="history-result">${match.result}</div>
                    <div class="history-opponent">vs ${match.opponent}</div>
                </div>

                <div class="history-date">
                    ${new Date(match.played_at).toLocaleString()}
                </div>
            `;

            historyList.appendChild(item);
        });

    } catch (error) {
        console.error(error);
        historyList.innerHTML = "<p>Could not load match history.</p>";
    }
});


closeHistory.addEventListener("click", () => {
    historyScreen.style.display = "none";
});



const savedToken = localStorage.getItem("token");

if (savedToken) {
    document.getElementById("authScreen").style.display = "none";
} else {
    document.getElementById("authScreen").style.display = "flex";
}