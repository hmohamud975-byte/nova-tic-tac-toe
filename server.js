const express = require("express");

const app = express();

const PORT = 3000;


app.use(express.json());

app.use(express.static(__dirname));


app.get("/api/status", (req, res) => {

    res.json({

        online: true,

        game: "NOVA Tic Tac Toe",

        version: "1.0"

    });

});


app.get("/api/leaderboard", (req, res) => {

    res.json({

        message: "Leaderboard endpoint is working."

    });

});


app.listen(PORT, () => {

    console.log(
        `NOVA Tic Tac Toe running at http://localhost:${PORT}`
    );

});