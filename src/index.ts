import { Rectangle } from "./data";

const canvas: HTMLCanvasElement = document.getElementById("c") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
const dpr = Math.max(Math.min(devicePixelRatio, 2), 1);

function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

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
const rectangeCount = 4;
const colors = ["red", "green", "blue", "yellow"];

const rectangles: Array<Rectangle> = [];

const target: Rectangle = { box: { position: { x: 0, y: 0 }, size }, color: "" };

function initLevel() {
    let x = (gameSize.x - rectangeCount * size.x - (rectangeCount - 1) * border) / 2;
    let y = (gameSize.y - size.y - distance - size.y) / 2;

    for (let i = 0; i < rectangeCount; i++) {
        rectangles[i] = { box: { position: { x, y }, size }, color: colors[i] };

        x += size.x + border;
    }

    target.box.position.x = (gameSize.x - size.x) / 2;
    target.box.position.y = y + size.y + distance;
    target.color = colors[0];
}

initLevel();

const pointer = {
    position: { x: 0, y: 0 },
    pressed: false,
    pressed_changed: false
}

const dragPosition = { x: 0, y: 0 };
let dragStarted = false;

canvas.addEventListener("mousedown", (e) => {
    pointer.position.x = e.clientX * dpr;
    pointer.position.y = e.clientY * dpr;
    pointer.pressed = true;
    pointer.pressed_changed = true;

    e.preventDefault();
});

canvas.addEventListener("mousemove", (e) => {
    pointer.position.x = e.clientX * dpr;
    pointer.position.y = e.clientY * dpr;
    pointer.pressed_changed = false;

    e.preventDefault();
});

canvas.addEventListener("mouseup", (e) => {
    pointer.position.x = e.clientX * dpr;
    pointer.position.y = e.clientY * dpr;
    pointer.pressed = false;
    pointer.pressed_changed = true;

    e.preventDefault();
});

canvas.addEventListener("mouseleave", (e) => {
    pointer.position.x = e.clientX * dpr;
    pointer.position.y = e.clientY * dpr;
    pointer.pressed = false;
    pointer.pressed_changed = true;

    e.preventDefault();
});

canvas.addEventListener("touchstart", (e) => {
    let touch = e.touches[0];

    pointer.position.x = touch.clientX * dpr;
    pointer.position.y = touch.clientY * dpr;
    pointer.pressed = true;
    pointer.pressed_changed = true;

    e.preventDefault();
});

canvas.addEventListener("touchmove", (e) => {
    let touch = e.touches[0];

    pointer.position.x = touch.clientX * dpr;
    pointer.position.y = touch.clientY * dpr;
    pointer.pressed_changed = false;

    e.preventDefault();
});

canvas.addEventListener("touchend", (e) => {
    pointer.pressed = false;
    pointer.pressed_changed = true;

    e.preventDefault();
});

function update() {
    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / gameSize.x;
    const scaleY = canvas.height / gameSize.y;
    const scale = Math.min(scaleX, scaleY);

    const tx = (canvas.width - gameSize.x * scale) / 2;
    const ty = (canvas.height - gameSize.y * scale) / 2;

    context.setTransform(scale, 0, 0, scale, tx, ty);

    const localPointer = {
        x: (pointer.position.x - tx) / scale,
        y: (pointer.position.y - ty) / scale,
    }

    for (const rectangle of rectangles) {
        context.strokeStyle = rectangle.color;
        context.lineWidth = lineWidth;

        context.strokeRect(
            rectangle.box.position.x,
            rectangle.box.position.y,
            rectangle.box.size.x,
            rectangle.box.size.y
        );
    }

    context.fillStyle = target.color;
    context.fillRect(
        target.box.position.x,
        target.box.position.y,
        target.box.size.x,
        target.box.size.y
    );

    context.strokeStyle = target.color;
    context.lineWidth = lineWidth;
    context.strokeRect(
        target.box.position.x,
        target.box.position.y,
        target.box.size.x,
        target.box.size.y
    );

    // console.log("dragStarted", dragStarted, "pressed", pointer.pressed, "pressed_changed", pointer.pressed_changed);

    if (dragStarted) {
        if (pointer.pressed) {
            let deltaX = localPointer.x - dragPosition.x;
            let deltaY = localPointer.y - dragPosition.y;

            target.box.position.x += deltaX;
            target.box.position.y += deltaY;

            dragPosition.x = localPointer.x;
            dragPosition.y = localPointer.y;
        } else {
            dragStarted = false;

            console.log("drag end");
        }
    } else {
        if (pointer.pressed && pointer.pressed_changed) {
            if (target.box.position.x < localPointer.x && localPointer.x < target.box.position.x + target.box.size.x &&
                target.box.position.y < localPointer.y && localPointer.y < target.box.position.y + target.box.size.y
            ) {
                dragStarted = true;

                dragPosition.x = localPointer.x;
                dragPosition.y = localPointer.y;

                console.log("drag start");
            }
        }
    }

    context.fillStyle = "white";
    context.fillRect(
        localPointer.x - 15,
        localPointer.y - 15,
        30, 30
    );

    requestAnimationFrame(update);
}

requestAnimationFrame(update);