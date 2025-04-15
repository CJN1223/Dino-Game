
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let gameStarted = false;

let dino = {x: 50, y: 250, width: 20, height: 20};
let velocityY = 0;
const gravity = 0.6;
const jumpPowerY = -12; //negative is up in canvas
let isJumping = false;

let obstacles = [];
let obstacleSpeed = 10;

let score = 0;
let highScore = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //dino
    ctx.fillStyle = "green";
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function spawnObstacles() {
    const heightNumbers = [40, 60, 80];
    const randomHeightIndex = Math.floor(Math.random() * heightNumbers.length); 
    let obstacleHeight = heightNumbers[randomHeightIndex];

    const widthNumbers = [20, 30, 40];
    const randomWidthIndex = Math.floor(Math.random() * widthNumbers.length);
    let obstacleWidth = widthNumbers[randomWidthIndex];

    let obstacle = {x: canvas.width, y: 270 - obstacleHeight, width: obstacleWidth, height: obstacleHeight};
    obstacles.push(obstacle); //same thing as ArrayList.add(obstacle) in Java
}

function randomTime() {
    const timeNumbers = [1000, 1250, 1500, 2000]; 
    const randomTimeIndex = Math.floor(Math.random() * timeNumbers.length); 
    return timeNumbers[randomTimeIndex];
}

function spawnObstacleLoop() {
    spawnObstacles(); //spawns an obstacle immediately
    setTimeout(spawnObstacleLoop, randomTime()); //uses recursion to run again after a random delay
}

//start game logic
document.addEventListener("keydown", function(event) {
    if (!gameStarted && event.code === "Enter") {
        gameStarted = true;
        document.getElementById("startMessage").style.display = "none"; //hides the message once enter is pressed
        spawnObstacleLoop(); 
    }
    else if (!gameStarted) {
        event.preventDefault();
    }
});

function drawObstacles() { 
    ctx.fillStyle = "#607860";
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }
}

//jump logic
document.addEventListener("keydown", function(event) {
    if (gameStarted && event.code === "Space" && !isJumping) {
        velocityY = jumpPowerY;
        isJumping = true;
    }
});

function isColliding(dino, obstacle) {
    if (dino.x < obstacle.x + obstacle.width &&
        dino.x + dino.width > obstacle.x &&
        dino.y < obstacle.y + obstacle.height &&
        dino.y + dino.height > obstacle.y) {
        return true;
    }
    return false;
}

function updateGame() {
    velocityY += gravity;
    dino.y += velocityY;

    if (dino.y >= 250) { 
        dino.y = 250;
        velocityY = 0;
        isJumping = false; 
    }

    for (let i = 0; i < obstacles.length; i++) { 
        if (isColliding(dino, obstacles[i])) { 
            saveGame();
            window.location.reload();
            return;
        }
        obstacles[i].x -= obstacleSpeed;
        if (obstacles[i].x + obstacles[i].width < 0) { //once the obstacle is off the screen
            obstacles.splice(i, 1); //starts at i and removes 1 obstacle from array
            i--;
            score++;
            updateScore(score);
        }
    }

    drawGame();
    drawObstacles();
    requestAnimationFrame(updateGame); //runs updateGame() before next repaint. Usually 60 times per second
}

function updateScore(newScore) {
    score = newScore;
    document.getElementById("score").innerText = newScore;
}

function updateHighScore(newHighScore) {
    highScore = newHighScore;
    document.getElementById("highScore").innerText = newHighScore;
}

function saveGame() {
    if (score > highScore) {
        highScore = score;
        updateHighScore(highScore);
    }
    localStorage.setItem("highScore", highScore); //stores highScore as a string in local storage
}

function loadGame() {
    const savedHighScore = localStorage.getItem("highScore");
    if (savedHighScore != null) {
        highScore = parseInt(savedHighScore); //turns savedHighScore back into an int
        updateHighScore(highScore);
    }
}

document.getElementById("resetHighScoreButton").addEventListener("click", function() {
    localStorage.removeItem("highScore");
    highScore = 0;
    updateHighScore(highScore);
});

window.onload = function() {
    loadGame();
    updateGame();
};


