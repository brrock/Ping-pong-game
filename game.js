const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');


const modeToggle = document.getElementById('modeToggle');
const modeText = document.getElementById('modeText');
let twoPlayer = false;


const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 10;
const AI_X = canvas.width - PADDLE_WIDTH - 10;


let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;


let rightPaddleUp = false;
let rightPaddleDown = false;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

let playerScore = 0;
let aiScore = 0;


function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '40px Arial';
    ctx.fillText(text, x, y);
}


function collision(ballX, ballY, paddleX, paddleY) {
    return (
        ballX - BALL_RADIUS < paddleX + PADDLE_WIDTH &&
        ballX + BALL_RADIUS > paddleX &&
        ballY + BALL_RADIUS > paddleY &&
        ballY - BALL_RADIUS < paddleY + PADDLE_HEIGHT
    );
}


canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    playerY = e.clientY - rect.top - PADDLE_HEIGHT / 2;
   
    if (playerY < 0) playerY = 0;
    if (playerY > canvas.height - PADDLE_HEIGHT) playerY = canvas.height - PADDLE_HEIGHT;
});


document.addEventListener('keydown', function(e) {
    if (twoPlayer) {
        if (e.key === "ArrowUp") rightPaddleUp = true;
        if (e.key === "ArrowDown") rightPaddleDown = true;
    }
});
document.addEventListener('keyup', function(e) {
    if (twoPlayer) {
        if (e.key === "ArrowUp") rightPaddleUp = false;
        if (e.key === "ArrowDown") rightPaddleDown = false;
    }
});


function moveRightPaddle() {
    if (twoPlayer) {
        if (rightPaddleUp) aiY -= 7;
        if (rightPaddleDown) aiY += 7;
        
        if (aiY < 0) aiY = 0;
        if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
    } else {
        
        const center = aiY + PADDLE_HEIGHT / 2;
        if (center < ballY - 20) {
            aiY += 5;
        } else if (center > ballY + 20) {
            aiY -= 5;
        }
        if (aiY < 0) aiY = 0;
        if (aiY > canvas.height - PADDLE_HEIGHT) aiY = canvas.height - PADDLE_HEIGHT;
    }
}


function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}


function update() {
  
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    
    if (ballY - BALL_RADIUS < 0 || ballY + BALL_RADIUS > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

   
    if (collision(ballX, ballY, PLAYER_X, playerY)) {
        ballSpeedX = Math.abs(ballSpeedX);
        
        let deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.2;
    }

   
    if (collision(ballX, ballY, AI_X, aiY)) {
        ballSpeedX = -Math.abs(ballSpeedX);
        let deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.2;
    }

  
    if (ballX - BALL_RADIUS < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + BALL_RADIUS > canvas.width) {
        playerScore++;
        resetBall();
    }

    moveRightPaddle();
}


function render() {
 
    drawRect(0, 0, canvas.width, canvas.height, '#111');

    
    for (let i = 10; i < canvas.height; i += 30) {
        drawRect(canvas.width / 2 - 2, i, 4, 20, '#fff');
    }

    
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, '#0f0');
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, twoPlayer ? '#0ff' : '#f00');

    
    drawCircle(ballX, ballY, BALL_RADIUS, '#fff');

    
    drawText(playerScore, canvas.width / 4, 50, '#0f0');
    drawText(aiScore, (3 * canvas.width) / 4, 50, twoPlayer ? '#0ff' : '#f00');
}


function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}


modeToggle.addEventListener('click', function() {
    twoPlayer = !twoPlayer;
    if (twoPlayer) {
        modeToggle.textContent = "Switch to Single Player (vs AI)";
        modeText.textContent = "Current Mode: Two Player (Player vs Player)";
    } else {
        modeToggle.textContent = "Switch to 2 Player Mode";
        modeText.textContent = "Current Mode: Single Player (Player vs AI)";
    }
    
    aiY = (canvas.height - PADDLE_HEIGHT) / 2;
});


gameLoop();
