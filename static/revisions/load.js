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

const context = canvas.getContext('2d');
context.imageSmoothingEnabled = true;
context.font = '18px roboto';

let text = [''];
let index = 0;

function draw() {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let offset = 100;
    let tokens = parse(text);

    tokens.forEach(token => {
        if (token.code) {
            offset += renderCode(token, offset);
        } else {
            offset += renderText(token, offset);
        }
    });
}

function parse(lines) {
    let cur = [];
    let tokens = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let matches = line.match(/^`{3}([a-zA-Z]*)/);
        if (matches) {
            let type = matches[1];
            if (cur.length && cur[0].code) {
                type = cur[0].type;
                tokens.push({ code: cur.slice(1), type });
                cur = [];
            } else {
                cur.push({ line, code: true, type });
            }
            continue;
        } else if (!cur.length && line.match(/\s*\#/g)) {
            let level = line.match(/\s*\#/g).length;
            tokens.push({ heading: line, level });
            continue;
        }
        if (!cur.length) {
            tokens.push(line);
        } else {
            cur.push(line);
        }
    }
    if (cur.length) {
        tokens.push(cur[0].line, ...cur.slice(1));
    }
    return tokens;
}

function renderCode(token, offset) {
    let height = 0;
    context.font = '16px roboto';
    context.textAlign = 'left';

    let lens = token.code.map(c => c.length);
    let maxLen = Math.max(...lens);
    let maxText = token.code.find(c => c.length === maxLen);
    let maxWidth = Math.max(context.measureText(maxText).width, 300);
    let x = window.innerWidth / 2 - maxWidth / 2;
    let maxHeight = token.code.length * 16 * 1.5;
    context.fillStyle = '#cccccc';
    context.lineWidth = 3;
    context.strokeRect(x, offset, maxWidth, maxHeight);
    context.fillRect(x, offset, maxWidth, maxHeight);

    // before
    offset += 16;
    height += 16;

    token.code.forEach(c => {
        let h = renderText(c, offset);
        height += h;
        offset += h;
    });

    // after
    offset += 16;
    height += 16;

    return height;
}

function renderText(token, offset) {
    let lineHeight = 1.5;
    let headingSize = 32;
    let baseSize = 16;
    let height = baseSize * lineHeight;
    if (token.heading) {
        let size = headingSize - (token.level * 4);
        context.font = `bold ${size}px roboto`;
        height = size * lineHeight;
        token = token.heading;
    } else {
        context.font = `${baseSize}px roboto`;
    }

    context.textAlign = 'center';
    context.fillStyle = '#333333';

    let centerX = window.innerWidth / 2;
    context.fillText(token, centerX, offset);

    return height;
}

window.onkeypress = function (e) {
    if (e.key === 'Enter') {
        text.push('');
    } else {
        text[text.length - 1] += e.key;
    }
    draw();
    e.preventDefault();
};

window.onkeydown = function (e) {
    if (!text.length || !text[0].length) {
        return;
    }
    if (e.key === 'Backspace') {
        let txt = text[text.length - 1];
        txt = txt.slice(0, txt.length - 1);
        text[text.length - 1] = txt;
        if (!txt.length && text.length > 1) {
        }
        draw();
    }
};
}

load(() => setup());
