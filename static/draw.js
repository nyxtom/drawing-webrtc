const canvas = document.querySelector('.app canvas');
const activeCanvas = document.querySelector('.app canvas.active');
const ctx = canvas.getContext('2d');
const activeCtx = activeCanvas.getContext('2d');

var lastPoint;
var force = 1;
var mouseDown = false;

var activeToolElement = document.querySelector('[data-tool].active');
var activeTool = activeToolElement.dataset.tool;

document.querySelectorAll('[data-tool]').forEach(tool => {
    tool.onclick = function (e) {
        activeToolElement.classList.toggle('active');
        activeToolElement = tool;
        activeToolElement.classList.toggle('active');
        activeTool = activeToolElement.dataset.tool;
    };
});

const swatch = [
    ["#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff"],
    ["#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff"],
    ["#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc"],
    ["#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd"],
    ["#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0"],
    ["#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79"],
    ["#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47"],
    ["#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130"]
];
const colorMap = swatch.flat();

var activeShape;

let swatchContainer = document.querySelector('#color-picker');
let colorElements = {};
swatch.forEach(row => {
    let rowElem = document.createElement('div');
    rowElem.classList.add('hstack');
    row.forEach(c => {
        let elem = document.createElement('div');
        elem.classList.add('box');
        elem.classList.add('color-' + c.substr(1));
        elem.style.backgroundColor = c;
        elem.onclick = function (e) {
            colorPicker.dataset.color = c;
            colorPicker.style.color = c;
            if (colorElements[color]) {
                colorElements[color].classList.remove('active');
            }
            color = c;
            elem.classList.toggle('active');
            e.preventDefault();
        };
        colorElements[c] = elem;
        rowElem.appendChild(elem);
    });

    swatchContainer.appendChild(rowElem);
});

function randomColor() {
    return parseInt(Math.random() * colorMap.length);
}

var colorIndex = randomColor();
var color = colorMap[colorIndex];
var colorPicker = document.querySelector('[data-color]');
colorPicker.dataset.color = color;
colorPicker.style.color = color;
colorElements[color].classList.add('active');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    activeCanvas.width = window.innerWidth;
    activeCanvas.height = window.innerHeight;
}

function onPeerData(id, data) {
    let msg = JSON.parse(data);
    if (msg.event === 'draw') {
        draw(msg);
    } else if (msg.event === 'drawRect') {
        drawRect(msg);
    } else if (msg.event === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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

function drawRect(data, commit) {
    activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
    if (data.commit || commit) {
        ctx.strokeStyle = data.color;
        ctx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
    } else {
        activeCtx.strokeStyle = data.color;
        activeCtx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
    }
    activeShape = data;
}

function move(e) {
    mouseDown = e.buttons;
    if (e.buttons) {
        if (!lastPoint) {
            lastPoint = { x: e.offsetX, y: e.offsetY };
            originPoint = { x: e.offsetX, y: e.offsetY };
            return;
        }

        if (activeTool === 'pencil') {
            draw({
                lastPoint,
                x: e.offsetX,
                y: e.offsetY,
                force: force,
                color: color
            });

            broadcast(JSON.stringify({
                event: 'draw',
                lastPoint,
                x: e.offsetX,
                y: e.offsetY,
                force: force,
                color: color
            }));
        } else if (activeTool === 'rect') {
            let origin = {
                x: Math.min(originPoint.x, e.offsetX),
                y: Math.min(originPoint.y, e.offsetY)
            };
            drawRect({
                origin: origin,
                color: color,
                width: Math.abs(originPoint.x - e.offsetX),
                height: Math.abs(originPoint.y - e.offsetY)
            });
            broadcast(JSON.stringify({
                event: 'drawRect',
                origin: origin,
                color: color,
                width: Math.abs(originPoint.x - e.offsetX),
                height: Math.abs(originPoint.y - e.offsetY)
            }));
        }

        lastPoint = { x: e.offsetX, y: e.offsetY };
    } else {
        lastPoint = undefined;
    }
}

function down(e) {
    originPoint = { x: e.offsetX, y: e.offsetY };
}

function up() {
    if (activeShape) {
        drawRect(activeShape, true);
        broadcast(JSON.stringify(Object.assign({
            event: 'drawRect',
            commit: true,
        }, activeShape)));
        activeShape = undefined;
    }
    lastPoint = undefined;
    originPoint = undefined;
}

function key(e) {
    if (e.key === 'Backspace') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        broadcast(JSON.stringify({
            event: 'clear'
        }));
    }
    if (e.key === 'ArrowRight') {
        colorIndex++;
    }
    if (e.key === 'ArrowLeft') {
        colorIndex--;
    }
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (colorIndex >= colorMap.length) {
            colorIndex = 0;
        }
        if (colorIndex < 0) {
            colorIndex = colorMap.length - 1;
        }
        if (colorElements[color]) {
            colorElements[color].classList.remove('active');
        }
        color = colorMap[colorIndex];
        colorPicker.dataset.color = color;
        colorPicker.style.color = color;
        colorElements[color].classList.toggle('active');
    }
    if (mouseDown && (e.key === 'ArrowUp' || (e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))) {
        force += 0.025;
    }
    if (mouseDown && (e.key === 'ArrowDown' || (e.altKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))) {
        force -= 0.025;
    }
}

function forceChanged(e) {
    force = e.webkitForce || 1;
}

window.onresize = resize;
window.onmousedown = down;
window.onmousemove = move;
window.onmouseup = up;
window.onkeydown = key;

window.onwebkitmouseforcechanged = forceChanged;

resize();
