const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var lastPoint;
var force;

function randomColor() {
    let r = Math.random() * 255;
    let g = Math.random() * 255;
    let b = Math.random() * 255;
    return `rgb(${r}, ${g}, ${b})`;
}

var color = randomColor();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function onPeerData(id, data) {
    draw(JSON.parse(data));
}

function draw(data) {
    ctx.beginPath();
    ctx.moveTo(data.lastPoint.x, data.lastPoint.y);
    ctx.lineTo(data.x, data.y);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = Math.pow(data.force || 1, 4) * 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
}

function move(e) {
    if (e.buttons) {
        if (!lastPoint) {
            lastPoint = { x: e.offsetX, y: e.offsetY };
            return;
        }

        draw({
            lastPoint,
            x: e.offsetX,
            y: e.offsetY,
            force: force,
            color: color
        });

        broadcast(JSON.stringify({
            lastPoint,
            x: e.offsetX,
            y: e.offsetY,
            force: force,
            color: color
        }));

        lastPoint = { x: e.offsetX, y: e.offsetY };
    }
}

function up() {
    lastPoint = undefined;
}

function key(e) {
    if (e.key === 'Backspace') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function forceChanged(e) {
    force = e.webkitForce || 1;
}

window.onresize = resize;
window.onmousemove = move;
window.onmouseup = up;
window.onkeydown = key;

window.onwebkitmouseforcechanged = forceChanged;

resize();
