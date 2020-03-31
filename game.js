const canvas = document.getElementById('canvas');

const c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const cw = canvas.width;
const ch = canvas.height;

let keys = [];

let posX = cw/2 -50;
let posY = ch/2 -50;
const psize = 100;
let speedY = 2;
let speedX = 1;
const gravity = 0.1;
const friction = 0.7;
function player() {
    c.fillStyle = 'red';
    c.fillRect(posX, posY, psize, psize);

    if(posY + psize + speedY > ch){
        speedY = -speedY*friction;
    } else {
        speedY += gravity;
    }
    posY += speedY;

    if(keys[87]) {
        posY -= speedY;
        speedY -= 0.5;
        flames();
    }
    if(keys[83]) {
        posY += speedY;
    }
    if(keys[65]) {
        posX -= speedX;
    }
    if(keys[68]) {
        posX += speedX;
    }

}
function flames() {
    c.fillStyle = 'orange';
    c.fillRect(posX + psize/2-15, posY + psize, 30, 30);
}

function start () {

    window.addEventListener('keydown', event => {
        keys[event.keyCode] = true;
    });
    window.addEventListener('keyup', event => {
        keys[event.keyCode] = false;
    })
}
function clear() {
    c.clearRect(0,0, cw, ch)
}

function update() {
    clear();
    start();
    player();

}
setInterval(update, 1000/60);