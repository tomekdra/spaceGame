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
const imgMoon = new Image();
imgMoon.src = '3D_Mars.png';

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
        this.fuel = new Array(300);
        this.hp = new Array(100);
    }

    draw() {
        c.drawImage(imgRocket, 0, 0, 275, 370, this.x, this.y, this.w, this.h);
    }

    showFuel() {
        c.font = '20px Orbitron';
        this.fuel.length < 20 ? c.fillStyle = 'red' : c.fillStyle = "yellow";
        c.fillText("Fuel: " + this.fuel.length, 20, 30);
    }

    showHp() {
        c.font = '18px Orbitron';
        this.hp.length < 20 ? c.fillStyle = 'red' : c.fillStyle = "white";
        c.fillText("HP: " + this.hp.length, 20, 60);
    }

    flames() {
        c.drawImage(imgRocket, 0, 370, 275, 489, this.x, this.y + this.h, this.w, this.h);
    }


    gravity() {
        if (this.y + this.h / 2 > ch) {
            gameOver();
        }
            this.speedY += gravity;

        this.y += this.speedY;

       // canvas size bounce
        if (this.y <= 0) {
            this.y = 0.1;
            this.speedY = 0;
        }
        if (this.x <= 0) {
            this.x = 0;
        }
        if (this.x + this.w >= cw) {
            this.x -= this.speedX;
        }
    }

    collide(other) { // collisions with other obj
        // let a = this.x/2 - other.x/2;
        // let b = this.y/2 -other.y/2;
        // let c = Math.sqrt(a*a + b*b);
        // let sum = this.w/2 + other.w/2;
        // return sum;

        if (!(this.x + this.w < other.x || this.x > other.x + other.w
            || this.y + this.h < other.y || this.y > other.y + other.h)) {
            // floor bounce

            if (this.y + this.h + this.speedY > other.y) {
                this.speedY = -this.speedY * friction;
                if (this.speedY < 0 && this.speedY > -1) {
                    this.speedY = 0;
                }
            } else {
                this.speedY += gravity;
            }
            if (this.y+this.h > other.y+other.h) {
                this.speedY = -this.speedY;
                return false;
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
                    makeSound(80, 0.1, 'triangle');
                    this.fuel.splice(0, 1); // fuel burning
                }
            }
        }
        if (keys['s']) {
            this.y += this.speedY;
        }
        if (keys['a']) {
            if (this.speedX < 0) {
                this.x += this.speedX;
            } else {
                this.x -= this.speedX;
            }

        }
        if (keys['d']) {
            if (this.speedX < 0) {
                this.x -= this.speedX;
            } else {
                this.x += this.speedX;
            }

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

class Planet {
    constructor(x, y, radius, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }
    drawMoon () {
        c.drawImage(imgMoon, 0, 0, 628, 628, this.x-this.radius, this.y-this.radius, this.radius*2, this.radius*2)
    }
    update() {
        this.draw();
    }
    collide(other) {
        let a = this.x/2 - other.x/2;
        let b = this.y/2 -other.y/2;
        let c = Math.sqrt(a*a + b*b);
        let sum = this.radius/2 + (other.w /2);
        return c < sum;
    }

}

class Asteroid {
    constructor(x, y, w, h, color, vx, vy) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
        this.vx = vx;
        this.vy = vy;
    }

    draw() {
        c.beginPath();
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.w, this.h);
    }

    update() {
        this.draw();
        this.x += this.vx;
        this.y += this.vy;

        if (this.y <= 0 || this.y > ch) {
            this.vy = -this.vy
        }
        if (this.x <= 0 || this.x+this.w >= cw) {
            this.vx = -this.vx;
        }

    }
    collide(other) { // collisions with other obj
        // let a = this.x/2 - other.x/2;
        // let b = this.y/2 -other.y/2;
        // let c = Math.sqrt(a*a + b*b);
        // let sum = this.w/2 + other.w/2;
        // return sum;

        if (!(this.x + this.w < other.x || this.x > other.x + other.w
            || this.y + this.h < other.y || this.y > other.y + other.h)) {
            this.vx = -this.vx;
            this.vy = -this.vy;
        }
    }

}

const imgbackground = new Image();
imgbackground.src = "back.png";

const mainMenu = () => {
    clearInterval(interval);
    imgbackground.addEventListener('load', () => {
        c.drawImage(imgbackground, 0, 0);
        c.font = "60px Orbitron";
        c.fillStyle = "#6C748C";
        c.fillText("ORBITRON", cw / 2 - 180, 200);

        c.font = "30px Orbitron";
        c.fillText("Press SpaceBar to start!", cw / 2 - 250, ch / 2)
    });

    window.addEventListener('keypress', event => {
        if (event.code === "Space") {
            clearInterval(interval);
            newGame();

        }
    })

};

function gameOver() {
    clearInterval(interval);
    c.font = "30px Orbitron";
    c.fillStyle = '#A60321';
    c.fillText("You lose", cw / 2, ch / 2);
    c.fillRect(cw / 2, ch / 2 + 30, 150, 20);
    window.addEventListener('keypress', e => {
        if (e.code === 'Space') {
            clearInterval(interval);
            newGame();
        }
    })
}

function gameWin() {
    clearInterval(interval);
    c.font = "30px Orbitron";
    c.fillStyle = '#A7F2C1';
    c.fillText("You Win", cw / 2, ch / 2);
    c.fillRect(cw / 2 - 30, ch / 2 + 30, 200, 20);
    window.addEventListener('keypress', e => {
        if (e.key === 'b') {
            clearInterval(interval);
            newGame();
        }
    })
}

const epone = new Image();
epone.src = "bg5.jpg";

function background() {
    c.drawImage(epone, 0, 0, 1300, 800);
    //
    // const gradient = c.createLinearGradient(0, 0, cw, ch);
    // gradient.addColorStop(0, '#060126');
    // gradient.addColorStop(1, '#7C038C');
    // c.fillStyle = gradient;
    // c.fillRect(0, 0, cw, ch);
    //
    // const gradient1 = c.createLinearGradient(0, 0, cw, ch);
    // gradient1.addColorStop(1, 'rgba(29, 1, 89, 1)');
    // gradient1.addColorStop(0, '#7C038C');
    // c.beginPath();
    // c.moveTo(0, ch);
    // c.lineTo(cw / 2, ch / 2);
    // c.lineTo(cw, ch);
    // c.fillStyle = gradient1;
    // c.fill();
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
const makeSoundBackground = (bool, type) => {
    if(bool === undefined) bool = true;
    if(type=== undefined) type = "square";
    const time = 15;
    const nuty = {
        'D6': 1174.66,
        'C6': 1046.50,
        'B5': 987.77,
        'A5': 880.00,
        'G5': 783.99,
        'F#5': 739.99,
        'E6': 1318.51,
        'E5': 659.26,
// ###
        'F#4': 369.99,
        'E4': 329.63,
        'D4': 293.66,
        'C4': 261.63,
        'B3': 246.94,
        'A3': 220.00,
        'G3': 196.00,
        'F#3': 185.00,
// ###
        'E3': 164.81,
        'D3': 146.83,
        'C3': 130.81,
        'B2': 123.47,
        'A2': 110.00,
        'G2': 98.00,
        'F#2': 92.50
    };

    if(bool === true) {
        osc = audio.createOscillator();
        osc.frequency.value = 0;
        const now = audio.currentTime;
        osc.type = type;
        osc.start(now);
        osc.connect(audio.destination);
        osc.stop(now + time);

        for (let i = 0; i < time/2; i++){
            osc.frequency.setValueAtTime(nuty.G3, i + 0.2);
            osc.frequency.setValueAtTime(nuty.A3, i + 0.4);
            osc.frequency.setValueAtTime(nuty.G2, i + 0.6);
            osc.frequency.setValueAtTime(nuty.D3, i + 0.8);
            osc.frequency.setValueAtTime(nuty.G3, i + 1);
        }
        for (let i = time/2; i < time; i++){
            osc.frequency.setValueAtTime(nuty.C4, i + 0.2);
            osc.frequency.setValueAtTime(nuty.D4, i + 0.4);
            osc.frequency.setValueAtTime(nuty.E4, i + 0.6);
            osc.frequency.setValueAtTime(nuty.C4, i + 0.8);
            osc.frequency.setValueAtTime(nuty.D4, i + 1);
            osc.frequency.setValueAtTime(nuty.E4, i + 1.2);
            osc.frequency.setValueAtTime(0, i + 1.4);
        }


    }
};

let interval;
let timeout;
const astroColors = [
    '#1D2659',
    '#0E1A40',
    '#6C748C',
    '#071126',
    '#273859'
];


function randomizeColors(arr) {
    return arr[Math.floor(Math.random()*astroColors.length)]
}

function newGame() {

    const rakieta = new Rocket(20, ch - 400, 50, 90, 1, 3, 5);
    const start = new Box(0, ch - 100, 300, 100, '#6C748C');
    const land = new Box(cw - 200, 150, 200, 30, '#707C8C');
    const landCover = new Box(cw - 215, 145, 30, 40, 'red');
    const box = new Box(700, 500, 200, 30, '#071126');
    const moon = new Planet (cw/2, 0, 200, astroColors[2], 0,0);
    const moonAmosphere = new Planet (cw/2, 0, 240, 'rgba(0, 0, 0, 0.5)', 0,0);

    makeSoundBackground(true, 'triangle');

    let astro = [];
    let mixBox = [];
    let mixBox2 = [];
    let mixBox3 = [];
    for (let i = 0; i < 500; i++) {
        astro.push(new Asteroid(Math.random() * (cw - 100), Math.random() * (300 - 10), Math.random() * 2, Math.random() * 2, 'grey', Math.random() * 2, Math.random() * 3))
    }
    for (let i = 0; i < 100; i++) {
        mixBox.push(new Asteroid(Math.random() * (1200-1000)+1000, Math.random() * (500-300)+300, Math.random() * (30-5), Math.random() * (30-5), astroColors[Math.floor(Math.random()*astroColors.length)], 0, 0))
    }
    for (let i = 0; i < 100; i++) {
        mixBox2.push(new Asteroid(Math.random() * (800-500)+500, Math.random() * (200-20) + 20, Math.random() * (30-5), Math.random() * (30-5), randomizeColors(astroColors), 3, 2))
    }
    for (let i = 0; i < 100; i++) {
        mixBox3.push(new Asteroid(Math.random() * (600-300)+300, Math.random() *(800-500)+500, Math.random() * (30-5)+5, Math.random() * (30-5)+5, randomizeColors(astroColors), 0, 0))
    }

    function update() {
        clear();
        background();
        key();

        land.update();
        landCover.update();
        start.update();
        moonAmosphere.update();
        moon.drawMoon();
        box.update();

        rakieta.update();
        rakieta.collide(start);
        rakieta.collide(landCover);
        rakieta.collide(box);
        rakieta.showFuel();
        rakieta.showHp();

        if(moon.collide(rakieta)) {
            rakieta.hp.splice(0, 1);
            rakieta.speedY = -rakieta.speedY;
            rakieta.speedX = -rakieta.speedX;
            rakieta.y += 1;
            rakieta.x += rakieta.speedY;
            makeSound(1000, 0.1, 'square')
        }

        astro.forEach(el => el.update());

        mixBox.forEach(el => el.update());
        mixBox2.forEach(el => el.update());
        mixBox2.forEach(el => el.collide(land));
        mixBox2.forEach(el => el.collide(start));
        mixBox2.forEach(el => el.collide(box));

        mixBox3.forEach(el => el.update());

        for(let i = 0; i < mixBox.length; i++) {
            if(rakieta.collide(mixBox[i])) {
                rakieta.hp.splice(0,1);
            }
        }
        for(let i = 0; i < mixBox2.length; i++) {
            if(rakieta.collide(mixBox2[i])) {
                rakieta.hp.splice(0,1);
            }
        }
        for(let i = 0; i < mixBox3.length; i++) {
            if(rakieta.collide(mixBox3[i])) {
                rakieta.hp.splice(0,1);
            }
        }

        if (rakieta.collide(land) && rakieta.speedY > -0.1) {
            gameWin();
            clearInterval(interval);
        }
        if (rakieta.fuel.length === 0) {
            timeout = setTimeout(gameOver, 2000);
        }
        if (rakieta.hp.length === 0) {
            gameOver();
        }

    }


    // kill all intervals and timeouts
    let killId = setTimeout(function () {
        for (var i = killId; i > 0; i--) clearInterval(i)
    }, 1000);

    interval = setInterval(update, 1000 / 60);
}

mainMenu();

