let preference = {
    width: 10,
    height: 10,
    cellX: 50,
    cellY: 50,
    size: 40,
    margin: 5,
    container: null,
    framerate: 24,

    aspect: 1
}
let scene = {
    background: [],
    backgroundColor: 'transparent',
    typeBackground: 'color',
    getBackground: (x, y) => {
        if (scene.typeBackground == 'color') {
            return scene.backgroundColor
        } else if (scene.typeBackground == 'matrix') {
            return scene.background[ConvertToX(x, y)]
        }
    }
}


let pixelData = []
let LastUpdateTime = null
let deltaTime = 0

var noisefn = noise.perlin3;

let currentShader = (x, y, d, uv) => {
    let h = noisefn(x / 8, y / 8, Date.now() / 2500)
    if (h > .7)
        return 'rgb(251, 255, 0)'
    else if (h > .5)
        return 'rgb(251, 255, 0)'
    else if (h > .3)
        return 'rgb(255, 153, 0)'
    else if (h > -.1)
        return 'rgb(216, 70, 34)'
    else
        return scene.getBackground(x, y)
}
let mouseEventHandler = (id, e) => {
    return
    let pos = ConvertToXY(id)
    let c = 'orange'
    let bg = scene.getBackground(pos.x, pos.y)
    if (e == 'enter') {

        setPixel(pos.x - 1, pos.y, c)
        setPixel(pos.x + 1, pos.y, c)
        setPixel(pos.x, pos.y + 1, c)
        setPixel(pos.x, pos.y - 1, c)
        setPixelByID(id, c)
    } else {
        setPixel(pos.x - 1, pos.y, bg)
        setPixel(pos.x + 1, pos.y, bg)
        setPixel(pos.x, pos.y + 1, bg)
        setPixel(pos.x, pos.y - 1, bg)
        setPixelByID(id, bg)
    }
}



function ConvertToX(x, y) {
    x = Math.max(Math.min(x, preference.cellX - 1), 0)
    y = Math.max(Math.min(y, preference.cellY), 0)
    return y * preference.cellX + x
}

function ConvertToXY(lineX) {
    let y = Math.floor(lineX / preference.cellX)
    let x = Math.floor(lineX - (y * preference.cellX))
    return { x: x, y: y }
}

function initMatrix() {
    preference.container = document.getElementById('matrix_container')

    preference.width = window.innerWidth
    preference.height = window.innerHeight
    preference.aspect = preference.width / preference.height
    let nSize = preference.size + preference.margin * 2
    preference.cellX = Math.floor(preference.width / nSize)
    preference.cellY = Math.floor(preference.height / nSize)
    preference.container.innerHTML = ''
    for (let i = 0; i < preference.cellX * preference.cellY; i++) {

        preference.container.innerHTML += pixelPrefub(i)
        pixelData.push(scene.getBackground(ConvertToXY(i)))
    }

    //events
    for (let i = 0; i < preference.cellX * preference.cellY; i++) {
        preference.container.children[i].addEventListener('mouseover', function() {
            MouseEnterPixel(i)
        })
        preference.container.children[i].addEventListener('mouseout', function() {
            MouseExitPixel(i)
        })
    }



    LastUpdateTime = Date.now()
    setInterval(loopDrawMatrix, 1000 / preference.framerate)
}

function DrawMatrix() {
    for (let i = 0; i < preference.cellX * preference.cellY; i++) {
        preference.container.children[i].style.backgroundColor = pixelData[i]
        preference.container.children[i].style.boxShadow = `0px 0 15px ${pixelData[i]}`
    }
}

function shader(callback) {
    for (let y = 0; y < preference.cellY; y++) {
        for (let x = 0; x < preference.cellX; x++) {
            let ux = (2 * x / preference.cellX) - 1
            let uy = ((2 * y / preference.cellY) - 1) / preference.aspect
            setPixel(x, y, callback(x, y, deltaTime, { x: ux, y: uy }))
        }
    }
}

function loopDrawMatrix() {
    shader(currentShader)
    DrawMatrix()
    deltaTime = (Date.now() - LastUpdateTime) / 1000
    LastUpdateTime = Date.now()
}


function pixelPrefub(id) {
    let pID = 'pixel' + id
    return `
        <div id="${pID}" class="pixel"></div>
    `
}

function setPixel(x, y, col) {
    pixelData[ConvertToX(x, y)] = col
}

function setPixelByID(id, col) {
    pixelData[id] = col
}

function MouseEnterPixel(id) {
    mouseEventHandler(id, 'enter')
}

function MouseExitPixel(id) {
    mouseEventHandler(id, 'exit')
}