// Game list
const games = [
    "Game 1", "Game 2", "Game 3", "Game 4", "Game 5"
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
const selectedGameDiv = document.getElementById('selected-game');

const wheelRadius = canvas.width / 2;
const numSlices = games.length;
const sliceAngle = 2 * Math.PI / numSlices;

let startAngle = 0;
let currentAngle = 0;
let spinning = false;
let selectedGame = '';

function drawWheel() {
    for (let i = 0; i < numSlices; i++) {
        // Set the colors alternately
        const color = i % 2 === 0 ? '#f9c74f' : '#90be6d';

        // Calculate the angle of each slice
        const angle = startAngle + i * sliceAngle;

        ctx.beginPath();
        ctx.moveTo(wheelRadius, wheelRadius);
        ctx.arc(wheelRadius, wheelRadius, wheelRadius, angle, angle + sliceAngle);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();

        // Add game names
        ctx.save();
        ctx.translate(wheelRadius, wheelRadius);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "18px Arial";
        ctx.fillText(games[i], wheelRadius - 10, 10);
        ctx.restore();
    }
}

function spinWheel() {
    if (spinning) return;
    spinning = true;
    
    // Set random spin duration and final angle
    let spinTime = Math.random() * 3000 + 2000;
    let totalSpins = Math.random() * 3600 + 360;

    let startTime = null;
    function animateSpin(time) {
        if (!startTime) startTime = time;

        const elapsed = time - startTime;
        currentAngle = (elapsed / spinTime) * totalSpins;
        if (elapsed < spinTime) {
            drawSpinningWheel();
            requestAnimationFrame(animateSpin);
        } else {
            finalizeSpin();
        }
    }
    requestAnimationFrame(animateSpin);
}

function drawSpinningWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(wheelRadius, wheelRadius);
    ctx.rotate(currentAngle * Math.PI / 180);
    ctx.translate(-wheelRadius, -wheelRadius);
    drawWheel();
    ctx.restore();
}

function finalizeSpin() {
    spinning = false;
    const finalAngle = currentAngle % 360;
    const sliceIndex = Math.floor(((360 - finalAngle) / 360) * numSlices) % numSlices;
    selectedGame = games[sliceIndex];
    selectedGameDiv.textContent = `Selected Game: ${selectedGame}`;
}

spinButton.addEventListener('click', spinWheel);

// Draw the wheel initially
drawWheel();