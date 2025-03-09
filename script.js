const bgCanvas = document.getElementById("bgCanvas");
const drawCanvas = document.getElementById("drawCanvas");
const textCanvas = document.getElementById("textCanvas");
const bgCtx = bgCanvas.getContext("2d");
const drawCtx = drawCanvas.getContext("2d");
const textCtx = textCanvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const penBtn = document.getElementById("pen");
const eraserBtn = document.getElementById("eraser");
const clearBtn = document.getElementById("clear");
const lineWidth = document.getElementById("lineWidth");
const exportBtn = document.getElementById("export");
const textInput = document.getElementById("textInput");
const addTextBtn = document.getElementById("addText");

let isDrawing = false;
let mode = "pen";
let lastX = 0;
let lastY = 0;
let texts = [];
let draggingText = null;

drawCtx.lineWidth = 5;
drawCtx.lineCap = "round";
textCtx.font = "20px Arial";

// 初始化背景层（白底）
bgCtx.fillStyle = "#ffffff";
bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

// 画所有文本
function drawTexts() {
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    texts.forEach(t => {
        textCtx.fillStyle = t.color;
        textCtx.fillText(t.text, t.x, t.y);
    });
}

// 切换画布事件
function toggleCanvasEvents(drawActive, textActive) {
    drawCanvas.style.pointerEvents = drawActive ? "auto" : "none";
    textCanvas.style.pointerEvents = textActive ? "auto" : "none";
}

// 默认激活drawCanvas
toggleCanvasEvents(true, false);

// 画笔和橡皮擦监听drawCanvas
drawCanvas.addEventListener("mousedown", (e) => {
    if (mode === "pen" || mode === "eraser") {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
});

drawCanvas.addEventListener("mousemove", (e) => {
    if (isDrawing && (mode === "pen" || mode === "eraser")) {
        drawCtx.beginPath();
        drawCtx.moveTo(lastX, lastY);
        drawCtx.lineTo(e.offsetX, e.offsetY);
        drawCtx.strokeStyle = mode === "pen" ? colorPicker.value : "#ffffff";
        drawCtx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
});

drawCanvas.addEventListener("mouseup", () => isDrawing = false);
drawCanvas.addEventListener("mouseout", () => isDrawing = false);

// 文本监听textCanvas
textCanvas.addEventListener("mousedown", (e) => {
    if (mode === "text") {
        draggingText = texts.find(t =>
            e.offsetX >= t.x && e.offsetX <= t.x + textCtx.measureText(t.text).width &&
            e.offsetY >= t.y - 20 && e.offsetY <= t.y
        );
        if (!draggingText && textInput.value.trim()) {
            texts.push({ text: textInput.value, x: e.offsetX, y: e.offsetY, color: colorPicker.value });
            textInput.value = "";
            drawTexts();
        }
    }
});

textCanvas.addEventListener("mousemove", (e) => {
    if (draggingText) {
        draggingText.x = e.offsetX;
        draggingText.y = e.offsetY;
        drawTexts();
    }
});

textCanvas.addEventListener("mouseup", () => draggingText = null);
textCanvas.addEventListener("mouseout", () => draggingText = null);

penBtn.addEventListener("click", () => {
    mode = "pen";
    toggleCanvasEvents(true, false); // 激活drawCanvas
});

eraserBtn.addEventListener("click", () => {
    mode = "eraser";
    toggleCanvasEvents(true, false);
});

clearBtn.addEventListener("click", () => {
    drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    texts = [];
    drawTexts();
});

lineWidth.addEventListener("input", () => {
    drawCtx.lineWidth = lineWidth.value;
});

exportBtn.addEventListener("click", () => {
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = drawCanvas.width;
    mergedCanvas.height = drawCanvas.height;
    const mergedCtx = mergedCanvas.getContext("2d");
    mergedCtx.drawImage(bgCanvas, 0, 0); // 背景层
    mergedCtx.drawImage(drawCanvas, 0, 0); // 画笔层
    mergedCtx.drawImage(textCanvas, 0, 0); // 文本层
    const dataURL = mergedCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "whiteboard.png";
    link.click();
});

addTextBtn.addEventListener("click", () => {
    mode = "text";
    toggleCanvasEvents(false, true); // 激活textCanvas
});