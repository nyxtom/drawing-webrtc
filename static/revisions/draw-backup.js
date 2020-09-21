const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

var color = 'purple';
var size = 1;
var tool = 'pen';
// var nodes = [];
// var selection = undefined;
// var state = {
//     move: false,
//     down: false,
//     context: undefined
// };

// var color = 'green';
// var drawPencil = false;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // draw();
}

function draw() {
    // for (let i = 0; i < nodes.length; i++) {
    //     let node = nodes[i];
    //     context.beginPath();
    //     context.fillStyle = node.selected ? node.selectedFill : node.fillStyle;
    //     context.arc(node.x, node.y, node.radius, 0, Math.PI * 2, true);
    //     context.strokeStyle = node.strokeStyle;
    //     context.fill();
    //     context.stroke();
    // }
}

// function within(x, y) {
//     return nodes.find(n => {
//         return x > (n.x - n.radius) &&
//             y > (n.y - n.radius) &&
//             x < (n.x + n.radius) &&
//             y < (n.y + n.radius);
//     });
// }

// var lastPoint;

// function down(e) {
//     if (!lastPoint) {
//         lastPoint = { x: e.offsetX, y: e.offsetY };
//         context.beginPath();
//         context.fillStyle = color;
//         context.arc(e.offsetX, e.offsetY, size / 2, 0, Math.PI * 2);
//         context.fill();
//         context.beginPath();
//         return;
//     }
//     if (tool === 'heart') {
//         context.font = `${size * 12}px roboto`;
//         context.strokeStyle = color;
//         let text = '🐎';
//         let bounds = context.measureText(text);
//         let x = e.offsetX - bounds.width / 2;
//         let y = e.offsetY + (size * 6);
//         context.strokeText(text, x, y);
//     } else if (tool === 'pen') {
//         context.moveTo(lastPoint.x, lastPoint.y);
//         context.lineTo(e.offsetX, e.offsetY);
//         context.strokeStyle = color;
//         context.lineWidth = size;
//         context.lineJoin = 'round';
//         context.lineCap = 'round';
//         context.stroke();
//         context.beginPath();
//     }
//     lastPoint = { x: e.offsetX, y: e.offsetY };
// }

function move(e) {
    // if (selection && e.buttons) {
    //     selection.x = e.offsetX;
    //     selection.y = e.offsetY;
    //     draw();
    // }
    // state.move = true;
}

// function down(e) {
//     drawPencil = true;
//     // let target = within(e.offsetX, e.offsetY);
//     // if (selection && selection.selected) {
//     //     selection.selected = false;
//     // }
//     // if (target) {
//     //     selection = target;
//     //     selection.selected = true;
//     //     draw();
//     // }
//     // state.down = true;
//     // state.move = false;
// }

// function up(e) {
//     drawPencil = false;
//     // if (!selection && !state.move) {
//     //     let node = {
//     //         x: e.offsetX,
//     //         y: e.offsetY,
//     //         radius: 5,
//     //         fillStyle: '#22cccc',
//     //         strokeStyle: '#009999',
//     //         selectedFill: '#88aaaa',
//     //         selected: false
//     //     };
//     //     nodes.push(node);
//     // }
//     // if (selection && !selection.selected) {
//     //     selection = undefined;
//     // }
//     // draw();
//     // state.down = false;
//     // state.moving = false;
// }

window.onresize = resize;
window.onmousemove = move;
// window.onmousedown = down;
// window.onkeydown = keydown;
// window.onkeypress = keypress;
// canvas.onmousedown = down;
// canvas.onmouseup = up;

resize();
