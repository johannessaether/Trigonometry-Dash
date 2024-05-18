const board = document.getElementById("board")
const ctx = board.getContext("2d")
board.width = 800
board.height = 600
let i = board.width
let n = 0
let score = 0
const highscore = parseInt(localStorage.getItem("highscore")) || 0
let stop = true
let startscreen = true
let gameOver = true
let collision = false
let expOpacity = 1
const pi2 = Math.PI * 2
let gameSpeed = 4
let details = false


//BANE
const cirk = {
    senterX: board.width / 2,
    senterY: board.height / 2,
    radius: 200,
}

function drawBane() {
    for (let i = 0; i < board.width + 1; i += 100) {
        ctx.beginPath()
        ctx.strokeStyle = "grey"
        ctx.lineWidth = 1
        ctx.moveTo(i, 0)
        ctx.lineTo(i, board.height)

        ctx.moveTo(0, i)
        ctx.lineTo(board.width, i)
        ctx.stroke()
        ctx.closePath()
    }

    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.lineWidth = 3
    ctx.arc(cirk.senterX, cirk.senterY, cirk.radius, 0, pi2)
    ctx.closePath()

    ctx.moveTo(board.width / 2, 0)
    ctx.lineTo(board.width / 2, board.height)

    ctx.moveTo(0, board.height / 2)
    ctx.lineTo(board.width, board.height / 2)

    ctx.moveTo(board.width / 2 - 10, 10)
    ctx.lineTo(board.width / 2, 0)
    ctx.lineTo(board.width / 2 + 10, 10)

    ctx.moveTo(board.width - 10, board.height / 2 - 10)
    ctx.lineTo(board.width, board.height / 2)
    ctx.lineTo(board.width - 10, board.height / 2 + 10)

    ctx.stroke()

    if (details) {
        ctx.font = "15px sans-serif"
        ctx.fillStyle = "black"
        let angleDisplay = - char.angle / Math.PI * 180 - 180 + 540
        if (char.angle > pi2) {
            char.angle = 0
        }
        if (char.angle < 0) {
            char.angle = pi2
        }
        ctx.fillText(Math.floor(angleDisplay) + "°", char.x + 20, char.y + 20)
    }


    if (!stop) {
        ctx.fillStyle = "black"
        ctx.font = "30px Pusab"
        ctx.fillText("Score: " + score, 30, 50)
        music.play()
    } else {
        music.pause()
    }
}
//BANE


//KARAKTER
const char = {
    radius: 20,
    x: board.width / 2,
    y: board.height / 2 - cirk.radius,
    angle: 3 * Math.PI / 2,
    speed: 0, // Hastighet starter som null
    acceleration: 0.05, // Akselerasjon for økning av hastighet
    maxSpeed: 0.2 // Maksimal hastighet
}

function drawChar() {
    char.x = cirk.senterX + cirk.radius * Math.cos(char.angle)
    char.y = cirk.senterY + cirk.radius * Math.sin(char.angle)

    //tegner karakter
    ctx.beginPath()
    ctx.fillStyle = "blue"
    ctx.arc(char.x, char.y, char.radius, 0, pi2)

    if (collision) {
        ctx.fillStyle = "rgba(255, 0, 0, " + expOpacity + ")" // Rød med gradvis gjennomsiktighet
        char.radius += 5
        expOpacity -= 0.02
    } else if (details) {
        // Standardfarge og størrelse
        expOpacity = 1
        ctx.moveTo(char.x, char.y)
        ctx.lineTo(char.x, cirk.senterY)
        ctx.moveTo(char.x, char.y)
        ctx.lineTo(cirk.senterX, char.y)
        ctx.moveTo(char.x, char.y)
        ctx.lineTo(cirk.senterX, cirk.senterY)
        ctx.stroke()
    }

    ctx.fill()
    ctx.closePath()
}
//KARAKTER


//OPPDATERING
function update() {
    if (i < 0) {
        i = board.width
        //n++
        n = Math.floor(Math.random() * 5)
        randInt()
    } else {
        i -= gameSpeed
    }
    char.angle += char.speed
}
//OPPDATERING


//KONTROLLER
let arrowKeyPressed = false

document.addEventListener("keydown", function (event) {
    if (!arrowKeyPressed) {
        switch (event.key) {
            case "ArrowLeft":
                arrowKeyPressed = true
                char.speed = Math.min(char.speed - char.acceleration, char.maxSpeed)
                break
            case "ArrowRight":
                arrowKeyPressed = true
                char.speed = Math.min(char.speed + char.acceleration, char.maxSpeed)
                break
        }
    }
})

document.addEventListener("keyup", function (event) {
    if (arrowKeyPressed) {
        switch (event.key) {
            case "ArrowLeft":
            case "ArrowRight":
                arrowKeyPressed = false
                char.speed = 0
                break
        }
    }
})
//KONTROLLER


//HINDER
let obj = {
    x: 0,
    y: 0,
    radius: 20,
    avstand: 100
}

function sinWave(amp, d) {
    obj.x = i
    obj.y = Math.sin(i / 50) * amp + d

    ctx.beginPath()
    ctx.arc(obj.x, obj.y, obj.radius, 0, pi2)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()

    if (details) {
        ctx.font = "15px sans-serif"
        let number = (300 - d) / 200
        ctx.fillText("f(x) = " + amp + "sin(x) + " + number.toFixed(2), 410, 320)
    }
}
function yObstacle(amp, d) {
    obj.x = i * 2
    obj.y = d

    ctx.beginPath()
    ctx.arc(obj.x, obj.y, obj.radius, 0, pi2)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()

    if (details) {
        ctx.font = "15px sans-serif"
        let number = (300 - d) / 200
        ctx.fillText("f(x) = " + number.toFixed(2), 410, 320)
    }
}
function tan(amp, d) {
    obj.x = i
    obj.y = Math.tan(i / 80) * amp + d

    ctx.beginPath()
    ctx.arc(obj.x, obj.y, obj.radius, 0, pi2)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()

    if (details) {
        ctx.font = "15px sans-serif"
        let number = (300 - d) / 200
        ctx.fillText("f(x) = " + amp + "tan(x) + " + number.toFixed(2), 410, 320)
    }
}
function quad(amp, d) {
    obj.x = i
    obj.y = cirk.senterY - amp * ((i - 400) / 100) ** 2 - amp

    ctx.beginPath()
    ctx.arc(obj.x, obj.y, obj.radius, 0, pi2)
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.closePath()

    if (details) {
        ctx.font = "15px sans-serif"
        let number = (300 - d) / 200
        ctx.fillText("f(x) = " + amp + "x2 + " + number.toFixed(2), 410, 320)
    }
}
const arr = [quad, yObstacle, sinWave, tan]
//HINDER


//MYNTER
const coin = {
    radius: 20,
    x: 400,
    y: 500,
    avstand: 100
}

function placeCoin() {

    coin.avstand = Math.sqrt(Math.abs(char.x - coin.x) ** 2 + Math.abs(char.y - coin.y) ** 2)
    if (coin.avstand < char.radius + coin.radius) {
        const coinPlace = Math.random() * cirk.radius
        coin.x = cirk.senterX + cirk.radius * Math.cos(coinPlace)
        coin.y = cirk.senterY + cirk.radius * Math.sin(coinPlace)

        score += 1

        pointSound.cloneNode().play()
    }

    ctx.beginPath()
    ctx.arc(coin.x, coin.y, coin.radius, 0, pi2)
    ctx.fillStyle = "yellow"
    ctx.fill()
    ctx.closePath()

    ctx.moveTo(coin.x, coin.y + 10)
    ctx.lineTo(coin.x, coin.y - 10)
    ctx.stroke()
}
//MYNTER


//SJEKK KOLLISJON
function detectCollision() {
    obj.avstand = Math.sqrt(Math.abs(char.x - obj.x) ** 2 + Math.abs(char.y - obj.y) ** 2)
    if (obj.avstand < char.radius + obj.radius) {
        collision = true

        stop = true
        gameOver = true
        if (!GOsoundPlayed) {
            gameOverSound.play()
            GOsoundPlayed = true
        }
    }
}
//SJEKK KOLLISJON


//TILFELDIGE TALL TIL HINDER
let int1 = Math.floor((Math.random() - 0.5) * cirk.radius) // + cirk.senterY - cirk.radius
let int2 = Math.floor(Math.random() * cirk.radius * 2 + cirk.senterY - cirk.radius)

function randInt() {
    int1 = Math.floor((Math.random() - 0.5) * cirk.radius) // + cirk.senterY - cirk.radius
    int2 = Math.floor(Math.random() * cirk.radius * 2 + cirk.senterY - cirk.radius) // mellom 0 og 600
}
//TILFELDIGE TALL TIL HINDER


//PAUSE
const pauseBtn = {
    x: board.width - 50,
    y: 20,
    width: 30,
    height: 30,
    color: "blue"
}

function drawPauseBtn() {
    pauseBtnImg = new Image()
    pauseBtnImg.src = "./media/pausebutton.png"
    pauseBtnImg.style.opacity = "0.5"
    ctx.drawImage(pauseBtnImg, pauseBtn.x, pauseBtn.y, pauseBtn.width, pauseBtn.height)
}

function pauseCheck(x, y) {
    return x >= pauseBtn.x && x <= pauseBtn.x + pauseBtn.width &&
        y >= pauseBtn.y && y <= pauseBtn.y + pauseBtn.height;
}

board.addEventListener("click", function (event) {
    const rect = board.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (pauseCheck(mouseX, mouseY)) {
        stop = true
    }
})
//PAUSE


//PLAY OG MENY
const playBtn = {
    x: cirk.senterX - 50,
    y: cirk.senterY - 50,
    width: 100,
    height: 100,
    color: "blue"
}

const menu = {
    x: board.width / 16,
    y: board.height / 12,
    width: 700,
    height: 500,
    color: "rgba(0, 0, 0, 0.5)"
}

function drawPlayBtn() {
    ctx.fillStyle = menu.color
    ctx.fillRect(menu.x, menu.y, menu.width, menu.height)

    if (startscreen) {
        ctx.fillStyle = "white"
        ctx.font = "50px Pusab"
        ctx.fillText("PRESS PLAY TO START", 100, 165)
        ctx.font = "30px Pusab"
        ctx.fillText("HIGHSCORE: " + highscore, 280, 220)
        ctx.fillText("Use left/right arrow to avoid", 158, 410)
        ctx.fillText("the trigonometric functions!", 165, 450)
    } else if (gameOver && !startscreen) {
        ctx.fillStyle = "white"
        ctx.font = "50px Pusab"
        ctx.fillText("GAME OVER", 245, 165)
        ctx.font = "30px Pusab"
        ctx.fillText("SCORE: " + score, 320, 193)
        // Highscore
        if (score > highscore) {
            localStorage.setItem("highscore", score)
            ctx.fillText("NEW HIGHSCORE!", 270, 220)
        } else {
            ctx.fillText("HIGHSCORE: " + highscore, 280, 220)
        }
    } else {
        ctx.fillStyle = "white"
        ctx.font = "50px Pusab"
        ctx.fillText("PAUSE", 316, 165)
        ctx.font = "30px Pusab"
        ctx.fillText("SCORE: " + score, 320, 193)
    }

    playBtnImg = new Image()
    playBtnImg.src = "./media/playbutton.png"
    ctx.drawImage(playBtnImg, playBtn.x, playBtn.y, playBtn.width, playBtn.height)
}

function playCheck(x, y) {
    return x >= playBtn.x && x <= playBtn.x + playBtn.width &&
        y >= playBtn.y && y <= playBtn.y + playBtn.height;
}

board.addEventListener("click", function (event) {
    const rect = board.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top

    if (playCheck(mouseX, mouseY)) {
        stop = false
        startscreen = false

        if (gameOver) {
            // Reset
            i = 0
            score = 0
            expOpacity = 1
            gameOver = false
            n = 0
            obj.avstand = 100
            coin.avstand = 100
            char.x = board.width / 2
            char.y = board.height / 2 - cirk.radius
            char.radius = 20
            char.angle = 3 * Math.PI / 2
            collision = false
            GOsoundPlayed = false
        }
    }
})
//PLAY OG MENY


//GAMEMODES
easy = document.getElementById("easy")
medium = document.getElementById("medium")
hard = document.getElementById("hard")

easy.addEventListener("click", function () {
    gameSpeed = 4
    easy.style.width = "110px"
    medium.style.width = "90px"
    hard.style.width = "90px"
    obj.radius = 20
})

medium.addEventListener("click", function () {
    gameSpeed = 6
    easy.style.width = "90px"
    medium.style.width = "110px"
    hard.style.width = "90px"
    obj.radius = 30
})

hard.addEventListener("click", function () {
    gameSpeed = 8
    easy.style.width = "90px"
    medium.style.width = "90px"
    hard.style.width = "110px"
    obj.radius = 40
})
//GAMEMODES


//MUSIKK OG LYD
let music = new Audio("media/stereomadness.mp3")
const pointSound = new Audio("media/point.mp3")
const gameOverSound = new Audio("media/gameover.mp3")
let GOsoundPlayed = false

const stereomadness = document.getElementById("stereomadness")
const jumper = document.getElementById("jumper")
const loonboon = document.getElementById("loonboon")
const tissetass = document.getElementById("tissetass") // Hjemmelaga sang til spillet, ikke døm navnet plis
stereomadness.addEventListener("click", function () {
    chooseMusic("stereomadness")

})

jumper.addEventListener("click", function () {
    chooseMusic("jumper")
})

loonboon.addEventListener("click", function () {
    chooseMusic("loonboon")
})

tissetass.addEventListener("click", function () {
    chooseMusic("tissetass")
})

function chooseMusic(src) {
    music.src = "media/" + src + ".mp3"
}
//MUSIKK OG LYD


//FINAL DRAW
function draw() {
    ctx.fillStyle = "rgb(255 255 255 / 30%)"
    ctx.fillRect(0, 0, board.width, board.height)
    drawBane()
    drawChar()
    if (!collision) {
        if (n == arr.length) {
            n = 0
        }
        arr[n](int1, int2)
        placeCoin()
    }
    if (!stop) {
        update()
        drawPauseBtn()
    }
    if (stop) {
        drawPlayBtn()
    }
    detectCollision()
}

setInterval(draw, 10)
//FINAL DRAW

