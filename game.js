let ch;
let cw;
let c;

function newCanvas() {
    const canvas = document.getElementById('canvas');
    c = canvas.getContext('2d');
    canvas.width = 1300;
    canvas.height = 800;

    cw = canvas.width;
    ch = canvas.height;
}

newCanvas();


let keys = [];
let mouseclick = [];

const imgRocket = new Image();
imgRocket.src = 'rakieta.png';

const gravity = 0.1;
const friction = 0.5;

class Rocket {
    constructor(x, y, w, h, speedY, speedX, maxSpeed) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.speedY = speedY;
        this.speedX = speedX;
        this.maxSpeed = maxSpeed;
        this.fuel = new Array(100);
    }

    draw() {
        // c.beginPath();
        // c.fillStyle = 'red';
        // c.fillRect(this.x, this.y, this.w, this.h);
        c.drawImage(imgRocket, 0, 0, 275, 370, this.x, this.y, this.w, this.h);
    }

    showFuel() {
        c.font = '20px Verdana';
        c.fillStyle = 'white';
        c.fillText("Fuel: " + this.fuel.length, 20, 20)
    }

    flames() {
        // c.beginPath();
        // c.fillStyle = 'orange';
        // c.fillRect(this.x + this.w / 2 - 15, this.y + this.h, 30, 30);
        c.drawImage(imgRocket, 0, 370, 275, 489, this.x, this.y + this.h, this.w, this.h);
    }


    gravity() {
        if (this.y + this.h / 2 > ch) {
            gameOver();
        } else {
            this.speedY += gravity;
        }
        this.y += this.speedY;

        // canvas size bounce
        if (this.y <= 0) {
            this.y = 0.1;
            this.speedY = 0;
        }
        if (this.x <= 0) {
            this.x = this.speedX;
        }
        if (this.x + this.w >= cw) {
            this.x += this.speedX;
        }
    }

    collide(other) { // collisions with other obj
        if (!(this.x + this.w < other.x || this.x > other.x + other.w
            || this.y + this.h < other.y || this.y > other.y + other.h)) {
            if (this.y + this.h + this.speedY > other.h) {
                this.speedY = -this.speedY * friction;
                if (this.speedY < 0 && this.speedY > -1) {
                    this.speedY = 0;
                }
            } else {
                this.speedY += gravity;
            }
            this.y += this.speedY - 0.2;
            return true;
        }
    }


    update() {
        this.gravity();

        // key stering
        if (keys['w']) {
            if (this.speedY < -this.maxSpeed) {
                this.speedY = -this.maxSpeed;
            } else {
                if (this.fuel.length === 0) {
                    this.speedY += gravity;
                } else {
                    this.y -= this.speedY;
                    this.speedY -= 0.5;
                    this.flames();
                    makeSound(50, 0.2, 'triangle');
                    this.fuel.splice(0, 1); // fuel burning
                }

                console.log(this.fuel)
            }
        }
        if (keys['s']) {
            this.y += this.speedY;
        }
        if (keys['a']) {
            this.x -= this.speedX;
        }
        if (keys['d']) {
            this.x += this.speedX;
        }
        this.draw();
    }


}

class Box {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.w, this.h);
    }

    update() {
        this.draw();
    }

}

const imgbackground = new Image();
imgbackground.src = "back.png";

const mainMenu = () => {
    imgbackground.addEventListener('load', () => {
        c.drawImage(imgbackground, 0, 0);
        c.font = "60px Orbitron";
        c.fillStyle = "#6C748C";
        c.fillText("ORBITRON", cw / 2 - 180, 200);

        c.font = "30px Orbitron";
        c.fillText("Press SpaceBar to start!", cw / 2 - 250, ch / 2)
    });

        window.addEventListener('keypress', event => {
            if(event.code === "Space") {
                clearInterval(interval);
                newGame();

            }
        })

};

function gameOver() {
    clearInterval(interval);
    c.font = "30px Orbitron";
    c.fillStyle = 'red';
    c.fillText("You lose", cw / 2, ch / 2);
    c.fillRect(cw / 2, ch / 2 + 40, 100, 20);
    window.addEventListener('keypress', e => {
        if (e.code === 'Space') {
            clearInterval(interval);
            newGame();
        }
    })
}

function gameWin() {

    clearInterval(interval);
    c.font = "30px Verdana";
    c.fillStyle = 'orangered';
    c.fillText("Win", cw / 2, ch / 2);
    c.fillRect(cw / 2, ch / 2 + 40, 100, 20);
    window.addEventListener('keypress', e => {
        if (e.key === 'b') {
            clearInterval(interval);
            newGame();
        }
    })
}


function background() {

    const gradient = c.createLinearGradient(0, 0, cw, ch);
    gradient.addColorStop(0, '#060126');
    gradient.addColorStop(1, '#7C038C');
    c.fillStyle = gradient;
    c.fillRect(0, 0, cw, ch);

    const gradient1 = c.createLinearGradient(0, 0, cw, ch);
    gradient1.addColorStop(1, 'rgba(29, 1, 89, 1)');
    gradient1.addColorStop(0, '#7C038C');
    c.beginPath();
    c.moveTo(0, ch);
    c.lineTo(cw / 2, ch / 2);
    c.lineTo(cw, ch);
    c.fillStyle = gradient1;
    c.fill();
}

function key() {
    window.addEventListener('keydown', event => {
        keys[event.key] = true;
    });
    window.addEventListener('keyup', event => {
        keys[event.key] = false;
    });
    window.addEventListener("mousedown", e => {
        mouseclick[e.button] = true;

    });
    window.addEventListener("mouseup", e => {
        mouseclick[e.button] = false;
    });
}

function clear() {
    c.clearRect(0, 0, cw, ch)
}

let audio = new AudioContext();
let osc = null;

const makeSound = (freq, time, type, bool) => {
    if (bool === undefined) bool = true;
    if (type === undefined) type = "square";
    if (time === undefined) time = 0.1;
    if (bool === true) {
        osc = audio.createOscillator();
        osc.frequency.value = freq;
        const now = audio.currentTime;
        osc.type = type;
        osc.start(now);
        osc.connect(audio.destination);
        osc.stop(now + time);
    }
};


let interval;
function newGame() {

    const rakieta = new Rocket(20, ch - 400, 80, 120, 1, 3, 5);
    const box = new Box(0, ch - 100, 300, 100, 'green');
    const land = new Box(cw - 200, ch - 30, 200, 30, 'blue');

    function update() {
            clear();
            background();
            key();

            rakieta.collide(box);
            land.update();
            box.update();
            rakieta.update();
            rakieta.showFuel();
            if (rakieta.collide(land) && rakieta.speedY > -0.1) {
                gameWin();
            }


    }

    interval = setInterval(update, 1000 / 60);
}

// newGame();
mainMenu()

