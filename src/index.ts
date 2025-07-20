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

const position = { x: 100, y: 100 };
const size = { x: 150, y: 250 };
const speed = { x: 10, y: 10 };

function update() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "red";
    context.fillRect(position.x, position.y, size.x, size.y);

    context.strokeStyle = "green";
    context.lineWidth = 10;
    context.strokeRect(position.x, position.y, size.x, size.y);

    position.x += speed.x;
    position.y += speed.y;

    if (position.x < 0 || position.x + size.x > canvas.width) {
        speed.x = -speed.x;
    }

    if (position.y < 0 || position.y + size.y > canvas.height) {
        speed.y = -speed.y;
    }

    requestAnimationFrame(update);
}

requestAnimationFrame(update);