let source;
let tiles = [];
let cols = 4;
let rows = 4;
let w, h;
let board = [];

let scoopY = 600;
let iceCreamY = 600;
let startButton, pauseButton;
let line = 0;

let soundFile;
let fft;
let isPlaying = false;

function preload() {
    source = loadImage('Scull.png');
    soundFile = loadSound('music.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    drawButtons();
    background(50);
    fft = new p5.FFT();
    soundFile.amp(0.5);

    w = width / cols;
    h = height / rows;

    // Chop up source image into tiles
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * w;
            let y = j * h;
            let img = createImage(w, h);
            img.copy(source, x, y, w, h, 0, 0, w, h);
            let index = i + j * cols;
            board.push(index);
            let tile = new Tile(index, img);
            tiles.push(tile);
        }
    }
    // Remove the last tile
    tiles.pop();
    board.pop();
    // -1 means empty spot
    board.push(-1);

    // Shuffle the board
    simpleShuffle(board);
}
// Swap two elements of an array
function swap(i, j, arr) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// Pick a random spot to attempt a move
// This should be improved to select from only valid moves
function randomMove(arr) {
    let r1 = floor(random(cols));
    let r2 = floor(random(rows));
    move(r1, r2, arr);
}

// Shuffle the board
function simpleShuffle(arr) {
    for (let i = 0; i < 100000; i++) {
        randomMove(arr);
    }
}

// Move based on click
function mousePressed() {
    let i = floor(mouseX / w);
    let j = floor(mouseY / h);
    move(i, j, board);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function icecream(x, y) {
    //starting icecream
    noStroke();
    fill(255, 255, 150);
    triangle(x, y, x + 5, y + 5, x + 10, y); //Cone
}

function drawButtons() {
    startButton = createButton('Lets Play A Game!');
    startButton.position(20, 20);
    startButton.size(110, 50);
    startButton.mousePressed(startMusic);

    //pauseButton = createButton('Pause');
    //pauseButton.position(startButton.x, startButton.y + 60);
    //pauseButton.size(110, 50);
    //pauseButton.mousePressed(pauseMusic);
}

function startMusic() {
    soundFile.play();
    isPlaying = true;
}

function pauseMusic() {
    soundFile.pause();
    isPlaying = false;
}

function addVanScoop(x) {
    // vanilla scoop

    scoopY -= 7;
    fill(245, 242, 235);
    ellipseMode(CORNER);
    ellipse(x, scoopY - 5, 10, 10);
}

function addChocScoop(x) {
    //chocolate scoop

    scoopY -= 7;
    fill(89, 52, 38);
    ellipseMode(CORNER);
    ellipse(x, scoopY - 5, 10, 10);
}
function addStrawScoop(x) {
    // strawberry scoop

    scoopY -= 7;
    fill(232, 172, 209);
    ellipseMode(CORNER);
    ellipse(x, scoopY - 5, 10, 10);
}

function draw() {
    if (isPlaying) {
        background(50);
        let spectrum = fft.analyze();
        stroke(0);
        for (let i = 0; i < spectrum.length; i++) {
            let amp = spectrum[i];
            let y = map(amp, 0, 255, 0, height);
            //drawIcecream(i * 10, y);
        }
    }
    background(0);

    // Draw the current board
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let index = i + j * cols;
            let x = i * w;
            let y = j * h;
            let tileIndex = board[index];
            if (tileIndex > -1) {
                let img = tiles[tileIndex].img;
                image(img, x, y, w, h);
            }
        }
    }

    // Show it as grid
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            let x = i * w;
            let y = j * h;
            strokeWeight(2);
            noFill();
            rect(x, y, w, h);
        }
    }

    // If it is solved
    if (isSolved()) {
        console.log('SOLVED');
    }
}

function drawIcecream(x, h) {
    scoopY = height - 27;
    icecream(x, height - 30, color(255));
    scoopNum = int(h / 10);
    for (let i = 0; i < scoopNum; i++) {
        if (i % 3 == 0) {
            addChocScoop(x);
        } else if (i % 3 == 1) {
            addStrawScoop(x);
        } else {
            addVanScoop(x);
        }
    }
}

function isSolved() {
    for (let i = 0; i < board.length - 1; i++) {
        if (board[i] !== tiles[i].index) {
            return false;
        }
    }
    return true;
}

// Swap two pieces
function move(i, j, arr) {
    let blank = findBlank();
    let blankCol = blank % cols;
    let blankRow = floor(blank / rows);

    // Double check valid move
    if (isNeighbor(i, j, blankCol, blankRow)) {
        swap(blank, i + j * cols, arr);
    }
}

// Check if neighbor
function isNeighbor(i, j, x, y) {
    if (i !== x && j !== y) {
        return false;
    }

    if (abs(i - x) == 1 || abs(j - y) == 1) {
        return true;
    }
    return false;
}

// Probably could just use a variable
// to track blank spot
function findBlank() {
    for (let i = 0; i < board.length; i++) {
        if (board[i] == -1) return i;
    }
}
