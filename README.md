# NOVA Tic Tac Toe

## 1. Project Name

**NOVA Tic Tac Toe**

A cyber-themed Tic-Tac-Toe web application with Player vs AI and Player vs Friend modes.

## 2. Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* MySQL
* XAMPP
* JWT
* bcrypt

## 3. Requirements

Before running the application, make sure you have:

* Node.js and npm installed
* XAMPP installed
* MySQL running through XAMPP
* A web browser
* The NOVA Tic Tac Toe project files

## 4. How to Install

Open the project folder in VS Code.

Open the terminal and run:

```bash
npm install
```

This installs the required Node.js packages from `package.json`.

## 5. How to Create the Database

Open MySQL through XAMPP or the MySQL command line.

Create the database:

```sql
CREATE DATABASE nova_tic_tac_toe;
```

Select the database:

```sql
USE nova_tic_tac_toe;
```

Create the users table:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Create the matches table:

```sql
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    opponent VARCHAR(50) NOT NULL DEFAULT 'Nova AI',
    result ENUM('Win', 'Loss', 'Draw') NOT NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

The database should now contain:

```text
nova_tic_tac_toe
├── users
└── matches
```

## 6. How to Start XAMPP

1. Open the XAMPP Control Panel.
2. Start **Apache**.
3. Start **MySQL**.
4. Make sure both services are running.

The application uses MySQL to store user accounts and match history.

## 7. How to Start the Node Server

Open the project folder in VS Code.

Open the terminal and run:

```bash
node server.js
```

The terminal should display:

```text
NOVA Tic Tac Toe running at http://localhost:3000
Connected to nova_tic_tac_toe database!
```

## 8. How to Open the Application

Open a web browser and go to:

```text
http://localhost:3000
```

The NOVA registration screen should appear.

Create an account and then log in.

After logging in, the Tic-Tac-Toe game will open.

## 9. How to Test the Application

### Test Account

Create an account using your own test details.

Example:

```text
Username: testplayer
Password: Test1234
```

> This is only an example. Create the account through the application's registration page before testing.

### Test Login

Use the same username and password to log in.

### Test Match Saving

1. Log in.
2. Select **Player vs AI**.
3. Play a match.
4. Finish the match.
5. Open **HISTORY**.
6. The result should appear in the match history.

The result should also be stored in the MySQL `matches` table.

You can verify it with:

```sql
USE nova_tic_tac_toe;

SELECT * FROM users;

SELECT * FROM matches;
```

### Test Logout

Click **LOGOUT**.

The application should return to the authentication screen.

### Test Protected Features

Try accessing match history without being logged in.

Protected API requests require a valid authentication token, so unauthorized requests should be rejected.
