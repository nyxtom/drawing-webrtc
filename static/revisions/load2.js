/**
 * Ensures that window.onload calls the list of callbacks.
 */
var __loaders = [];
window.onload = function () {
    for (let i = 0; i < __loaders.length; i++) {
        __loaders[i]();
    }
};

/**
 * Sets up a window onload callback routine.
 * @param {Function} callback The function to load on window load
 */
function load(...callbacks) {
    __loaders.push(...callbacks);
}

/** Drawing environment setup */
function setup() {
    const canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;

    let config = {
        radius: 10,
        lineWidth: 2,
        strokeStyle: '#2EB3BB',
        fillStyle: '#83CCDC',
        lineDash: [4]
    };

    let nodes = [];

    const states = {
        'down': 1,
        'up': 2,
        'move': 3
    };
    let state = '';

    const modes = {
        'draw': 1,
        'type': 2
    };
    let mode = modes.draw;

    let currentNode;

    window.onresize = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        nodes.forEach(node => drawNode(node));
    };

    window.onmousedown = function (e) {
        state = states.down;
    };

    window.onmousemove = function (e) {
        state = states.move;
    };

    window.onmouseup = function (e) {
        if (state === states.down && mode === modes.draw) {
            node(e);
        }

        state = states.up;
    };

    window.onkeypress = function (e) {
        if (mode === modes.type) {
            type(e.key);
        }
    };

    window.onkeydown = function (e) {
        if (mode === modes.type) {
            if (e.key === 'Backspace') {
                backspace();
            }
        }
    };

    function draw() {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        nodes.forEach(node => drawNode(node));

        window.requestAnimationFrame(() => draw());
    }

    function node(e) {
        nodes.push({
            x: e.x,
            y: e.y,
            text: ''
        });

        currentNode = nodes[nodes.length - 1];
        drawNode(nodes[nodes.length - 1]);
        mode = modes.type;
    }

    function type(key) {
        if (currentNode) {
            currentNode.text += key;
            drawNode(currentNode);
        }
    }

    function backspace() {
        if (currentNode) {
            let len = currentNode.text.length;
            if (len > 0) {
                currentNode.text = currentNode.text.slice(0, len - 1);
                currentNode.text += key;
                drawNode(currentNode);
            }
        }
    }

    function drawNode(node) {
        ctx.lineWidth = config.lineWidth;
        ctx.fillStyle = config.fillStyle;
        ctx.setLineDash(config.lineDash);
        ctx.beginPath();
        ctx.arc(node.x, node.y, config.radius, 0, 2 * Math.PI, true);
        ctx.fill();
        if (node.text) {
            ctx.font = '18px roboto';
            let metrics = ctx.measureText(node.text);
            let tx = node.x - metrics.width / 2;
            let ty = node.y + config.radius * 4;

            ctx.fillText(node.text, tx, ty);
        }
    }

    window.requestAnimationFrame(() => draw());
}

load(() => setup());
