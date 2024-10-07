// Game list
const games = [
    "Baldurs Gate 3", "Factorio", "Barotrauma", "Rainbow Six Siege", 
    "Stellaris", "Chained Together", "Roblox", "Supermarket Together", 
    "Wildcard", "Buy A New Game", "Hearts Of Iron IV", "Fortnite",
    "Crusader Kings III", "Lethal Company", "Helldivers 2", "Minecraft", 
    
];

// Unique colors for each game
const colors = [
    '#ff0000', // Red
    '#ff4500', // Orange
    '#ffff00', // Yellow
    '#00ff00', // Lime
    '#008000', // Green
    '#00bfff', // Sky Blue
    '#0000ff', // Blue
    '#8a2be2', // Violet
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numSlices; i++) {
        const color = colors[i % colors.length];
        const angle = startAngle + i * sliceAngle;

        // Draw slice
        ctx.beginPath();
        ctx.moveTo(wheelRadius, wheelRadius);
        ctx.arc(wheelRadius, wheelRadius, wheelRadius, angle, angle + sliceAngle);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add game names
        ctx.save();
        ctx.translate(wheelRadius, wheelRadius);
        ctx.rotate(angle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Arial";
        ctx.fillText(games[i], wheelRadius - 10, 5);
        ctx.restore();
    }
}

function spinWheel() {
    if (spinning) return;
    spinning = true;

    let spinTime = Math.random() * 3000 + 2000;
    let totalRotation = Math.random() * 10 + 5; // 5 to 15 full rotations

    let startTime = null;
    function animateSpin(time) {
        if (!startTime) startTime = time;

        const elapsed = time - startTime;
        const progress = elapsed / spinTime;
        
        // Easing function for smooth deceleration
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        
        currentAngle = easeOut(progress) * totalRotation * 2 * Math.PI;
        
        if (progress < 1) {
            drawSpinningWheel();
            requestAnimationFrame(animateSpin);
        } else {
            finalizeSpin();
        }
    }
    requestAnimationFrame(animateSpin);
}

function drawSpinningWheel() {
    ctx.save();
    ctx.translate(wheelRadius, wheelRadius);
    ctx.rotate(currentAngle);
    ctx.translate(-wheelRadius, -wheelRadius);
    drawWheel();
    ctx.restore();
}

function finalizeSpin() {
    spinning = false;

    // Calculate the winning slice based on the final angle
    const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const sliceIndex = Math.floor(numSlices - (normalizedAngle / (2 * Math.PI) * numSlices)) % numSlices;

    selectedGame = games[sliceIndex];
    if (selectedGame === "Buy A New Game") {
        // Generate a random budget between $5 and $60
        const budget = Math.floor(Math.random() * (60 - 10 + 1)) + 5;
        selectedGameDiv.textContent = `Selected: Buy A New Game - Budget: $${budget}`;
    } else {
        selectedGameDiv.textContent = `Selected Game: ${selectedGame}`;
    }
}

spinButton.addEventListener('click', spinWheel);

// Draw the wheel initially
drawWheel();