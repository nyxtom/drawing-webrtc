const canvas = document.querySelector('.app canvas');
const ctx = canvas.getContext('2d');

var drawState = {
    origin: undefined,
    move: false,
    down: false,
    layers: [],
    pointers: [],
    scale: 1
};

var activeToolElement = document.querySelector('[data-tool].active');
drawState.invoke = window[activeToolElement.dataset.tool];
document.querySelectorAll('[data-tool]').forEach(tool => {
    tool.onclick = function (e) {
        activeToolElement.classList.toggle('active');
        activeToolElement = tool;
        activeToolElement.classList.toggle('active');

        // set active tool invoke function
        let activeTool = activeToolElement.dataset.tool;
        drawState.invoke = window[activeTool];
    };
});

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw() {
    layers.forEach(l => {
        if (l.fill) {
            ctx.fillStyle = l.fill;
            ctx.fill(l.path);
        }
        if (l.stroke) {
            ctx.strokeStyle = l.stroke;
            ctx.stroke(l.path);
        }
    });
}

function brush(e) {
    if (!drawState.down || !drawState.current) {
        return;
    }
    if (!drawState.active) {
        drawState.active = new Path2D();
        drawState.layers.push(drawState.active);
    }
    let active = drawState.active;
    let current = drawState.current;
    active.moveTo(current.x, current.y);
    active.lineTo(e.offsetX, e.offsetY);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.stroke(active);
}

function move(e) {
    drawState.move = true;
    drawState.down = e.buttons;
    drawState.invoke(e);
    drawState.current = { x: e.offsetX, y: e.offsetY };
}

function down(e) {
    drawState.origin = e;
    drawState.down = true;
}

function up() {
    drawState.origin = undefined;
    drawState.down = false;
    drawState.move = false;
    drawState.active = undefined;
}

window.onmousedown = down;
window.onmousemove = move;
window.onmouseup = up;
window.onresize = resize;
resize();
