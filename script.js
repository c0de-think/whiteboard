const canvas = document.getElementById("whiteboard");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const penBtn = document.getElementById("pen");
const eraserBtn = document.getElementById("eraser");
const clearBtn = document.getElementById("clear");
const lineWidth = document.getElementById("lineWidth");
const exportBtn = document.getElementById("export");

let isDrawing = false;
let mode = 'pen';
let lastX = 0;
let lastY = 0;

ctx.lineWidth = 5;
ctx.lineCap = "round"; // 圆形箭头，画起来顺滑
ctx.fillStyle = '#ffffff'; // 初始白底

// 开始画画
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

// 画线过程
canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);

    // 三元运算符
    ctx.strokeStyle = mode === 'pen' ? colorPicker.value : '#ffffff';
    ctx.stroke();

    [lastX, lastY] = [e.offsetX, e.offsetY]; // 更新最后坐标
})

// 停止画画
canvas.addEventListener("mouseup", (e) => isDrawing = false);
canvas.addEventListener("mouseout", (e) => isDrawing = false); // 鼠标离开也停止

// 切换模式
penBtn.addEventListener("click", () => mode = 'pen');
eraserBtn.addEventListener("click", () => mode = 'eraser');

// 清空画布
clearBtn.addEventListener("click", () => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

// 监听粗细变化
lineWidth.addEventListener("input", () => {
    ctx.lineWidth = lineWidth.value;
});

// 导出画布
exportBtn.addEventListener("click", () => {
    // 导出
    const dataURL = canvas.toDataURL("image/png");

    // 下载
    const link = document.createElement("a"); // 创建下载链接
    link.href = dataURL;
    link.download = "whiteboard.png";
    link.click();
})