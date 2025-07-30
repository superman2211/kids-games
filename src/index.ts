const canvas: HTMLCanvasElement = document.getElementById("c") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

const gameSize = { x: 1000, y: 1000 };
const size = { x: 120, y: 120 };
const border = 70;
const distance = 200;
const lineWidth = 10;

const rectangles = [
    { color: "red" },
    { color: "blue" },
    { color: "yellow" },
    { color: "green" },
];

const target = { color: "yellow" };

function update() {
    // 1, 0, 0
    // 0, 1, 0
    // 0, 0, 1
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / gameSize.x;
    const scaleY = canvas.height / gameSize.y;
    const scale = Math.min(scaleX, scaleY);

    const tx = (canvas.width - gameSize.x * scale) / 2;
    const ty = (canvas.height - gameSize.y * scale) / 2;

    context.setTransform(scale, 0, 0, scale, tx, ty);

    let position = {
        x: (gameSize.x - rectangles.length * size.x - (rectangles.length - 1) * border) / 2,
        y: (gameSize.y - size.y - distance - size.y) / 2,
    };

    for (const rectangle of rectangles) {
        context.strokeStyle = rectangle.color;
        context.lineWidth = lineWidth;

        context.strokeRect(
            position.x,
            position.y,
            size.x,
            size.y
        );

        position.x += size.x + border;
    }

    let targetPosition = {
        x: (gameSize.x - size.x) / 2, 
        y: position.y + size.y + distance,
    }

    context.fillStyle = target.color;
    context.fillRect(
        targetPosition.x,
        targetPosition.y,
        size.x,
        size.y
    );

    context.strokeStyle = target.color;
    context.lineWidth = lineWidth;
    context.strokeRect(
        targetPosition.x,
        targetPosition.y,
        size.x,
        size.y
    );

    requestAnimationFrame(update);
}

requestAnimationFrame(update);