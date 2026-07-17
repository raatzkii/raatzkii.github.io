const page = document.getElementById("brightSidePage");
const startSection = document.getElementById("brightSideStart");
const startButton = document.getElementById("brightSideStartBtn");
const stage = document.getElementById("brightSideStage");
const canvas = document.getElementById("brightSideCanvas");
const message = document.getElementById("brightSideMessage");
const messageText = document.getElementById("brightSideText");
const context = canvas.getContext("2d", { willReadFrequently: true });

const messages = [
    "i hope today is kind to you",
    "one step at a time",
    "resting is okay",
    "things will work out",
    "keep chasing what makes you happy",
    "someone's lucky to know you",
    "you bring good energy",
    "thanks for sticking around",
    "you seem like a genuinely nice person",
    "small steps still counts",
    "you are allowed to take a break",
    "you are doing enough",
    "something good is coming",
    "may your coffee taste amazing",
    "today is your lucky day",
    "i am glad you're here",
    "hi, beautiful",
    "i made all of these just for you",
    "you are my most attractive visitor, ever",
];

let isScratching = false;
let lastPoint = null;

function getDeviceSeed() {
    const storedSeed = localStorage.getItem("brightSideSeed");
    if (storedSeed) return Number(storedSeed);

    const seed = Math.floor(Math.random() * 1000000000);
    localStorage.setItem("brightSideSeed", String(seed));
    return seed;
}

function mulberry32(seed) {
    return function random() {
        let value = seed += 0x6D2B79F5;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
}

function getAttempt() {
    const attempt = Number(localStorage.getItem("brightSideAttempt") || "0") + 1;
    localStorage.setItem("brightSideAttempt", String(attempt));
    return attempt;
}

function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function drawCover(color, random) {
    context.globalCompositeOperation = "source-over";
    context.fillStyle = color;
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    context.globalAlpha = 0.1;
    context.fillStyle = color === "#32ff00" ? "#ffffff" : "#000000";
    for (let index = 0; index < 220; index += 1) {
        const x = random() * window.innerWidth;
        const y = random() * window.innerHeight;
        const size = 1 + random() * 2.5;
        context.fillRect(x, y, size, size);
    }
    context.globalAlpha = 1;
    context.globalCompositeOperation = "destination-out";
}

function setRandomMessage(random) {
    messageText.textContent = messages[Math.floor(random() * messages.length)];
    const safeX = 40 + random() * 24;
    const safeY = 34 + random() * 36;
    message.style.setProperty("--message-x", `${safeX}%`);
    message.style.setProperty("--message-y", `${safeY}%`);
}

function setCoverMode(color) {
    page.classList.toggle("cover-is-black", color === "#1c1c1c");
    page.classList.toggle("cover-is-green", color === "#32ff00");
}

function getPoint(event) {
    const pointer = event.touches?.[0] || event;
    return {
        x: pointer.clientX,
        y: pointer.clientY,
    };
}

function scratch(point) {
    const brushSize = Math.max(34, Math.min(window.innerWidth, window.innerHeight) * 0.08);

    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = brushSize;

    if (lastPoint) {
        context.beginPath();
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(point.x, point.y);
        context.stroke();
    }

    context.beginPath();
    context.arc(point.x, point.y, brushSize / 2, 0, Math.PI * 2);
    context.fill();

    lastPoint = point;
}

function startScratch() {
    resizeCanvas();

    const attempt = getAttempt();
    const random = mulberry32(getDeviceSeed() + attempt * 9973);
    const coverColor = random() > 0.5 ? "#32ff00" : "#1c1c1c";

    setCoverMode(coverColor);
    setRandomMessage(random);
    drawCover(coverColor, random);
    lastPoint = null;
    startSection.hidden = true;
    stage.hidden = false;
}

function showStart() {
    page.classList.remove("cover-is-black", "cover-is-green");
    stage.hidden = true;
    startSection.hidden = false;
    isScratching = false;
    lastPoint = null;
}

function handlePointerDown(event) {
    if (stage.hidden) return;
    event.preventDefault();
    isScratching = true;
    scratch(getPoint(event));
}

function handlePointerMove(event) {
    if (!isScratching || stage.hidden) return;
    event.preventDefault();
    scratch(getPoint(event));
}

function stopScratching() {
    isScratching = false;
    lastPoint = null;
}

canvas.addEventListener("pointerdown", handlePointerDown);
canvas.addEventListener("pointermove", handlePointerMove);
window.addEventListener("pointerup", stopScratching);
window.addEventListener("pointercancel", stopScratching);

canvas.addEventListener("touchstart", handlePointerDown, { passive: false });
canvas.addEventListener("touchmove", handlePointerMove, { passive: false });
window.addEventListener("touchend", stopScratching);
window.addEventListener("resize", () => {
    if (!stage.hidden) startScratch();
});

startButton.addEventListener("click", startScratch);

showStart();
