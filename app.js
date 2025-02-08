/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("draw");

/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");
const clear = document.getElementById("clear");

function resizeCanvas() {
    canvas.width = window.innerWidth ;
    canvas.height = window.innerHeight;
}
resizeCanvas();

ctx.strokeStyle = "#BADA55";  
ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.lineWidth = 10;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let hue = 0;
let direction = true;

function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
    };
}

function startDrawing(x, y) {
    isDrawing = true;
    [lastX, lastY] = [x, y];
}

function draw(x, y) {
    if (!isDrawing) return;

    ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];

    hue = (hue + 1) % 360; // Keep hue within 0-360 range

    if (ctx.lineWidth >= 75 || ctx.lineWidth <= 1) {
        direction = !direction;
    }
    ctx.lineWidth += direction ? 1 : -1;
}

function stopDrawing() {
    isDrawing = false;
}

// Clear canvas
clear.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// 🎨 **PC Mouse Events**
canvas.addEventListener("mousedown", (e) => startDrawing(e.offsetX, e.offsetY));
canvas.addEventListener("mousemove", (e) => draw(e.offsetX, e.offsetY));
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

// 📱 **Mobile Touch Events**
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const { x, y } = getTouchPos(e);
    startDrawing(x, y);
});

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getTouchPos(e);
    draw(x, y);
});

canvas.addEventListener("touchend", stopDrawing);

window.addEventListener("resize", resizeCanvas);
