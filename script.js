const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Slicing variables
let isSlicing = false;
let mouseTrail = [];
canvas.addEventListener('mousedown', () => {
    isSlicing = true;
});

canvas.addEventListener('mouseup', () => {
    isSlicing = false;
    mouseTrail = [];
});

canvas.addEventListener('mousemove', (e) => {
    if (isSlicing) {
        const rect = canvas.getBoundingClientRect();
        mouseTrail.push({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });

        // Limit the trail length
        if (mouseTrail.length > 10) mouseTrail.shift();
    }
});
function drawSlicingTrail() {
    if (mouseTrail.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;

        ctx.moveTo(mouseTrail[0].x, mouseTrail[0].y);
        for (let i = 1; i < mouseTrail.length; i++) {
            ctx.lineTo(mouseTrail[i].x, mouseTrail[i].y);
        }

        ctx.stroke();
        ctx.closePath();
    }
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawSlicingTrail(); // Draw the slicing trail
    requestAnimationFrame(gameLoop); // Continuously update
}

gameLoop();
const sliceSound = new Audio('~/fruitninja/sounds/slice.mp3');
const missSound = new Audio('~/fruitninja/sounds/miss.mp3');
function playSliceSound() {
    sliceSound.currentTime = 0; // Reset audio
    sliceSound.play();
}
const fruits = [];
function spawnFruit() {
    const x = Math.random() * canvas.width; // Random X position
    const speed = Math.random() * 2 + 3; // Random speed
    const fruit = {
        x,
        y: canvas.height,
        vx: Math.random() * 4 - 2, // Random horizontal velocity
        vy: -speed, // Initial vertical velocity
        radius: 20,
        type: 'fruit', // You can add bomb logic later
    };

    fruits.push(fruit);
}
function updateFruits() {
    for (let i = fruits.length - 1; i >= 0; i--) {
        const fruit = fruits[i];
        fruit.x += fruit.vx;
        fruit.y += fruit.vy;
        fruit.vy += 0.1; // Simulate gravity

        // Remove fruits if they fall off-screen
        if (fruit.y > canvas.height) {
            fruits.splice(i, 1);
            playMissSound(); // Play miss sound (to be defined)
        }
    }
}
function drawFruits() {
    fruits.forEach(fruit => {
        ctx.beginPath();
        ctx.arc(fruit.x, fruit.y, fruit.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'orange';
        ctx.fill();
        ctx.closePath();
    });
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawFruits(); // Draw fruits
    updateFruits(); // Move fruits
    drawSlicingTrail(); // Draw slicing trail
    requestAnimationFrame(gameLoop);
}

setInterval(spawnFruit, 1000); // Spawn a fruit every second
gameLoop();
function detectCollisions() {
    fruits.forEach((fruit, index) => {
        for (let i = 0; i < mouseTrail.length; i++) {
            const dx = fruit.x - mouseTrail[i].x;
            const dy = fruit.y - mouseTrail[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < fruit.radius) {
                fruits.splice(index, 1); // Remove sliced fruit
                playSliceSound(); // Play slicing sound
                break;
            }
        }
    });
}
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    updateFruits(); // Move fruits
    detectCollisions(); // Check for slicing
    drawFruits(); // Draw fruits
    drawSlicingTrail(); // Draw slicing trail
    requestAnimationFrame(gameLoop);
}
