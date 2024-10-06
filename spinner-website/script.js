// Game list
const games = [
    "Baldurs Gate 3", "Factorio", "Barotrauma", "Rainbow Six Siege", "Random Game Aquired By A Certain Mean", "Stellaris", "Chained Together", ""
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

    // Randomize the spin, ensuring the wheel stops at a random angle
    const randomSpinAngle = Math.random() * 2 * Math.PI * 5; // Spin multiple times (5x)
    startAngle += randomSpinAngle;

    drawWheel();

    // Determine the winning slice based on the final angle
    finalizeSpin();
}

function finalizeSpin() {
    spinning = false;

    // Calculate the final angle under the triangle (which is at angle 0)
    const finalAngle = (2 * Math.PI - startAngle % (2 * Math.PI)) % (2 * Math.PI);
    const sliceIndex = Math.floor(finalAngle / sliceAngle) % numSlices;

    selectedGame = games[sliceIndex];
    selectedGameDiv.textContent = `Selected Game: ${selectedGame}`;
}

spinButton.addEventListener('click', spinWheel);

// Draw the wheel initially
drawWheel();