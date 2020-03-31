const canvas = document.getElementById('canvas');

const c = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const cw = canvas.width;
const ch = canvas.height;

let keys = [];

let posX = cw/2 -50;
let posY = ch/2 -50;
let speedY = 2;
let speedX = 1;
const maxSpeed = 5;

const psize = 60;

const gravity = 0.1;
const friction = 0.5;

function rocket() {
    c.fillStyle = 'red';
    c.fillRect(posX, posY, psize, psize);

    // gravity
    if(posY + psize + speedY > ch){
        speedY = -speedY*friction;
    } else {
        speedY += gravity;
    }
    posY += speedY;


    // key stering
    if(keys['w']) {
        if(speedY < -maxSpeed) {
            speedY = -maxSpeed;
        } else {
            posY -= speedY;
            speedY -= 0.5;
            flames();
        }
    }
    if(keys['s']) {
        posY += speedY;
    }
    if(keys['a']) {
        posX -= speedX;
    }
    if(keys['d']) {
        posX += speedX;
    }


}

function box(x, y, w, h) {
    c.fillStyle = 'green';
    c.fillRect(x,y,w,h);
}
function flames() {
    c.fillStyle = 'orange';
    c.fillRect(posX + psize/2-15, posY + psize, 30, 30);
}

function background() {
    const gradient = c.createLinearGradient(0, 0, cw, ch);
    gradient.addColorStop(0, '#060126');
    gradient.addColorStop(1, '#7C038C');
    c.fillStyle = gradient;
    c.fillRect(0, 0, cw, ch)

    const gradient1 = c.createLinearGradient(0, 0, cw, ch);
    gradient1.addColorStop(1, 'rgba(29, 1, 89, 0.5)');
    gradient1.addColorStop(0, '#7C038C');
    c.beginPath();
    c.moveTo(0, ch);
    c.lineTo(cw/2, ch/2);
    c.lineTo(cw, ch);
    c.fillStyle = gradient1;
    c.fill();
}

function start () {

    window.addEventListener('keydown', event => {
        keys[event.key] = true;
    });
    window.addEventListener('keyup', event => {
        keys[event.key] = false;
    })
}

function clear() {
    c.clearRect(0,0, cw, ch)
}

function update() {
    clear();
    background();
    start();
    rocket();
    box()
}
setInterval(update, 1000/60);