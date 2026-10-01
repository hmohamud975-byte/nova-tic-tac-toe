const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3000;
const JWT_SECRET = "nova-super-secret-key-change-this-later";

app.use(express.json());
app.use(express.static(__dirname));

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "nova_tic_tac_toe"
});

db.connect((error) => {
    if (error) {
        console.error("Database connection failed:", error);
        return;
    }

    console.log("Connected to nova_tic_tac_toe database!");
});

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

app.post("/api/signup", async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    // Check that all fields were provided
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Yo, fill in all the fields first."
        });
    }

    // Validate username
    const usernameRegex = /^[A-Za-z0-9_-]{3,20}$/;

    if (!usernameRegex.test(username)) {
        return res.status(400).json({
            success: false,
            message: "That username isn't valid. Use 3–20 letters, numbers, _ or -."
        });
    }

    // Validate password length
    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            message: "Your password needs to be at least 8 characters."
        });
    }

    // Check passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Those passwords don't match. Try again."
        });
    }

    // Check if username already exists
    const checkSql = "SELECT id FROM users WHERE username = ?";

    db.query(checkSql, [username], async (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Something went wrong on the server."
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                success: false,
                message: "That username is already taken. Try another one."
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Save the new user
        const insertSql =
            "INSERT INTO users (username, password) VALUES (?, ?)";

        db.query(
            insertSql,
            [username, hashedPassword],
            (error, results) => {
                if (error) {
                    console.error(error);

                    return res.status(500).json({
                        success: false,
                        message: "Could not create your account."
                    });
                }

                res.status(201).json({
                    success: true,
                    message: "Account created! You can now log in."
                });
            }
        );
    });
}); 

app.get("/api/users", (req, res) => {
    db.query("SELECT id, username, created_at FROM users", (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Could not retrieve users."
            });
        }

        res.json(results);
    });
});
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter your username and password."
        });
    }

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], async (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Something went wrong on the server."
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Those login details don't match."
            });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Those login details don't match."
            });
        }

        // Create login token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.json({
            success: true,
            message: `Welcome back, ${user.username}!`,
            token: token,
            user: {
                id: user.id,
                username: user.username
            }
        });
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "You need to log in first."
        });
    }

    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({
                success: false,
                message: "Your login session is invalid or expired."
            });
        }

        req.user = user;
        next();
    });
}

app.get("/api/profile", authenticateToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

app.post("/api/matches", authenticateToken, (req, res) => {
    const { result } = req.body;

    if (!result || !["Win", "Loss", "Draw"].includes(result)) {
        return res.status(400).json({
            success: false,
            message: "Invalid match result."
        });
    }

    const sql = `
        INSERT INTO matches (user_id, opponent, result)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [req.user.id, "Nova AI", result],
        (error, results) => {
            if (error) {
                console.error(error);

                return res.status(500).json({
                    success: false,
                    message: "Could not save match."
                });
            }

            res.status(201).json({
                success: true,
                message: "Match saved!",
                matchId: results.insertId
            });
        }
    );
});

app.get("/api/matches", authenticateToken, (req, res) => {
    const sql = `
        SELECT id, opponent, result, played_at
        FROM matches
        WHERE user_id = ?
        ORDER BY played_at DESC
    `;

    db.query(sql, [req.user.id], (error, results) => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Could not retrieve match history."
            });
        }

        res.json({
            success: true,
            matches: results
        });
    });
});

app.listen(PORT, () => {
    console.log(
        `NOVA Tic Tac Toe running at http://localhost:${PORT}`
    );
});