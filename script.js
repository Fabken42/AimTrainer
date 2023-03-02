//ADICIONAR SOM AO ACERTAR ALVO, QUANDO ALVO SOME E GAME OVER

var link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Montserrat&family=Orbitron:wght@500&family=Poppins:wght@500;700;900&display=swap');
document.head.appendChild(link);
//---------------------------------------------------------//
const RAIO_MAXIMO = 22
const x_texto = 5

const recordeEl = document.querySelector('.recorde')
const pontuacaoEl = document.querySelector('.pontuacao')
const precisaoEl = document.querySelector('.precisao')
const btnJogarEl = document.querySelector('.btn_jogar')

const menu = document.querySelector('.gameover')
const canvas = document.querySelector('.canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
var c = canvas.getContext('2d')

//---------------------------------------------------------//

function Alvo(x, y, raio) {
    this.x = x
    this.y = y
    this.raio = raio
    this.aumenta = true

    this.atualiza = () => {
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
            this.raio += .2
        else this.raio -= .2

        if (this.raio < 1) {
            perdeVida()
        }
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
//------------------------FUNÇÕES-------------------------------

function inicializaVariveis() {
    alvos = []
    velocidadeDeJogo = 1000
    timer = null
    vidas = 4
    tiros = 0
    acertos = 0
    precisao = 0
    y_texto = Math.floor(canvas.width / 38)
}

function adicionaAlvo() {
    mouse.x = 0
    mouse.y = 0

    clearInterval(timer)
    timer = setInterval(() => {
        adicionaAlvo()
    }, velocidadeDeJogo)
    let x = Math.floor(Math.random() * (canvas.width - (RAIO_MAXIMO * 4)) + (RAIO_MAXIMO * 2))
    let y = Math.floor(Math.random() * (canvas.height - (RAIO_MAXIMO * 4)) + (RAIO_MAXIMO * 2) + (y_texto / 2))
    alvos.push(new Alvo(x, y, 1))
}

function perdeVida() {
    vidas -= 1
    alvos.shift()

    if (!vidas) {
        fimDeJogo()
    }
}

function fimDeJogo() {
    clearInterval(timer)
    canvas.classList.add('hide-canvas')
    menu.classList.remove('hide-gameover')

    var recorde = getRecordeLocal()
    if (recorde < acertos)
        localStorage.setItem('recorde', acertos)

    recordeEl.textContent = `${getRecordeLocal()}`
    pontuacaoEl.textContent = `${acertos}`
    precisaoEl.textContent = `${precisao.toFixed(2)}%`
}

function getRecordeLocal() {
    return parseInt(localStorage.getItem('recorde'));
}


function alteraVelocidade(velocidade) {
    return velocidade > 500 ? velocidade - .12 : velocidade
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

function animaJogo() {
    c.clearRect(0, 0, canvas.width, canvas.height)
    c.fillStyle = '#001624'
    c.fillRect(0, 0, canvas.width, canvas.height)

    c.fillStyle = 'white'
    c.font = `${y_texto}px Orbitron`
    c.fillText(`Vidas: ${vidas} | Acertos: ${acertos} | Precisão: ${precisao.toFixed(2)}% | Velocidade: ${(1 / (velocidadeDeJogo / 1000)).toFixed(2)} alvos/s`, x_texto, y_texto)

    alvos.forEach((alvo) => alvo.atualiza())

    velocidadeDeJogo = alteraVelocidade(velocidadeDeJogo)
    vidas ? requestAnimationFrame(animaJogo) : cancelAnimationFrame(animaJogo)
}
//---------------------EVENT LISTENERS------------------------
window.addEventListener("load", () => {
    recordeEl.textContent = `${getRecordeLocal()}`
    pontuacaoEl.textContent = `0`
    precisaoEl.textContent = `0`
});

btnJogarEl.addEventListener('click', () => {
    canvas.classList.remove('hide-canvas')
    menu.classList.add('hide-gameover')

    inicializaVariveis()
    animaJogo()
    adicionaAlvo()
})

window.addEventListener('resize', () => {
    alvos = []
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    y_texto = Math.floor(canvas.width / 38)
})

canvas.addEventListener('click', (ev) => {
    mouse.x = ev.clientX
    mouse.y = ev.clientY
    tiros++
    if (acertaAlvo(alvos))
        acertos++
    precisao = 100 * (acertos / tiros) //em porcentagem
})
