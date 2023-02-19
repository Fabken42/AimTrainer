var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Montserrat&family=Orbitron:wght@500&family=Poppins:wght@500;700;900&display=swap');
document.head.appendChild(link);

const RAIO_MAXIMO = 22
var vidas = 4
var tiros = 0
var acertos = 0
var precisao = 0
var y_texto=35
var x_texto=30

const canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var c = canvas.getContext('2d')

function Alvo(x, y, raio) {
    this.x = x
    this.y = y
    this.raio = raio
    this.aumenta = true

    this.atualiza = () => {
        this.perdeVida()
        this.alteraTamanho()
        this.desenha()
    }

    this.perdeVida = () => {
        if (this.raio < 1) {
            vidas -= 1
            alvos.shift()

            if(vidas==0){
                window.alert('FIM DE JOGO!')
                window.alert(`Precisão: ${precisao.toFixed(2)}% | Acertos: ${acertos}`)
                alvos=[]
                vidas=4
                acertos=0
                tiros=0
                precisao=0
                velocidadeDeJogo=1000
            }
        }
    }

    this.alteraTamanho = () => {
        if (this.raio >= RAIO_MAXIMO)
            this.aumenta = false

        if (this.aumenta)
            this.raio += 0.2
        else this.raio -= 0.2
    }

    this.desenha = () => {
        c.beginPath()
        c.arc(this.x, this.y, this.raio, 0, 2 * Math.PI)
        c.fillStyle = 'red'
        c.fill()

        c.beginPath()
        c.arc(this.x, this.y, this.raio * .66, 0, 2 * Math.PI)
        c.fillStyle = 'white'
        c.fill()

        c.beginPath()
        c.arc(this.x, this.y, this.raio * .33, 0, 2 * Math.PI)
        c.fillStyle = 'red'
        c.fill()
    }
}

var mouse = {
    x: 0,
    y: 0
}

var alvos = []
velocidadeDeJogo = 1000
let timer = null

function adicionaAlvo() {
    clearInterval(timer)
    timer = setInterval(() => {
        adicionaAlvo()
    }, velocidadeDeJogo)
    let x = Math.floor(Math.random() * (canvas.width - RAIO_MAXIMO * 2) + RAIO_MAXIMO)
    let y = Math.floor(Math.random() * (canvas.height - RAIO_MAXIMO * 2 - y_texto) + RAIO_MAXIMO + y_texto)
    mouse.x = 0
    mouse.y = 0
    alvos.push(new Alvo(x, y, 1))
}

function alteraVelocidade(velocidade) {
    return velocidade > 400 ? velocidade - .12 : velocidade
}

function acertaAlvo(alvos) {
    for (alvo in alvos) {
        if ((Math.abs(mouse.x - alvos[alvo].x) <= alvos[alvo].raio) && (Math.abs(mouse.y - alvos[alvo].y) <= alvos[alvo].raio)) {
            alvos.splice(alvo, 1)
            return true
        }
    }
    return false
}

function animaJogo() { //desenhar grades brancas | limitar spawn dos alvos 
    console.log(vidas);
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = '#001624'
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    c.fillStyle='white'
    c.font = '30px Orbitron'
    c.fillText(`Vidas: ${vidas} | Acertos: ${acertos} | Precisão: ${precisao.toFixed(2)}% | Velocidade: ${(1/(velocidadeDeJogo/1000)).toFixed(2)} alvos/s`,x_texto, y_texto)
    
    for (let i = 0; i < alvos.length; i++) {
        alvos[i].atualiza()
    }
    velocidadeDeJogo = alteraVelocidade(velocidadeDeJogo)

    requestAnimationFrame(animaJogo)
}

window.addEventListener('resize', () => {
    alvos = []
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

canvas.addEventListener('click', (ev) => {
    mouse.x = ev.clientX
    mouse.y = ev.clientY
    tiros++
    if (acertaAlvo(alvos))
        acertos++
    precisao = 100 * (acertos / tiros) //em porcentagem
})

adicionaAlvo()
animaJogo()
