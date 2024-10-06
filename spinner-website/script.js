// Game list
const games = [
    "Baldurs Gate 3", "Factorio", "Barotrauma", "Rainbow Six Siege", "Random P1r@t3d Game", "Stellaris", "Chained Together", "Roblox", "Supermarket Together", "Spin Again", ""
];

// Unique colors for each game
const colors = [
    '#f9c74f', // Yellow
    '#90be6d', // Green
    '#f94144', // Red
    '#577590', // Blue
    '#f3722c', // Orange
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
const selectedGameDiv = document.getElementById('selected-game');

// Create a triangle indicator
const triangle = document.createElement('div');
triangle.className = 'triangle';
document.body.appendChild(triangle);

const wheelRadius = canvas.width / 2;
const numSlices = games.length;
const sliceAngle = 2 * Math.PI / numSlices;

let startAngle = 0;
let currentAngle = 0;
let spinning = false;
let selectedGame = '';

function drawWheel() {
    for (let i = 0; i < numSlices; i++) {
        const color = colors[i % colors.length];
        const angle = startAngle + i * sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(wheelRadius, wheelRadius);
        ctx.arc(wheelRadius, wheelRadius, wheelRadius, angle, angle + sliceAngle);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#000'; // Black border
        ctx.lineWidth = 2; // Border thickness
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
    
    // Determine the index of the winning slice
    const adjustedAngle = (360 - finalAngle) % 360; // Invert the angle for slice calculation
    const sliceIndex = Math.floor(adjustedAngle / (360 / numSlices)) % numSlices;

    selectedGame = games[sliceIndex];
    selectedGameDiv.textContent = `Selected Game: ${selectedGame}`;
}

spinButton.addEventListener('click', spinWheel);

// Draw the wheel initially
drawWheel();