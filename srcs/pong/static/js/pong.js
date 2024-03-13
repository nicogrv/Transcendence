const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');



class Pong {
    constructor(rightColor, leftColor, ballColor, speedPadle, speedBall) {
        var rPad = new Paddle("right", rightColor);
        var lPad = new Paddle("left", leftColor);
        var ball = new Ball(ballColor);
        this.playerNb = 0
        this.startGame = false;
        rPad.s = speedPadle
        lPad.s = speedPadle
        ball.s = speedBall

        this.gameLoop(0, rPad, lPad, ball);
    }
    draw(lPad, rPad, ball) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
    
        ctx.fillStyle = lPad.color; 
        ctx.font = '124px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'
        ctx.fillText(lPad.point, canvas.width/2/2, 100); 
        ctx.fillStyle = rPad.color; 
        ctx.fillText(rPad.point, canvas.width/2 + (canvas.width/2/2), 100); 
    
    
        
        ctx.fillStyle = lPad.color;
        ctx.fillRect(lPad.x, lPad.y, lPad.w, lPad.h);
        ctx.fillStyle = rPad.color;
        ctx.fillRect(rPad.x, rPad.y, rPad.w, rPad.h);
        ball.animateParticles(ctx)
        
        ctx.fillStyle = ball.color;
        ctx.beginPath(); 
        ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2); 
        ctx.fill(); 
    }
    
    
    
    
    gameLoop(frame, lPad, rPad, ball) {
        this.draw(lPad, rPad, ball)
        if (this.startGame) {
            if (this.playerNb == 1) {
                let data = {
                    player1: {
                        
                        ball: {
                            x: ball.x,
                            y: ball.y
                        },
                        lPad: {
                            x: lPad.x,
                            y: lPad.y
                        }
                    }
                };
                socket.send(JSON.stringify(data));
            }
            else {
                let data = {
                    player2: {
                        rPad: {
                            x: rPad.x,
                            y: rPad.y
                        }
                    }
                };
                socket.send(JSON.stringify(data));
                console.log(socket_ball_x)
                ball.x = socket_ball_x
                ball.y = socket_ball_y
                lPad.x = socket_lPad_x
                lPad.y = socket_lPad_y
            }
            if (KeyW)
            lPad.up()
        if (KeyS)
        lPad.down()
            if (ArrowUp)
            rPad.up()
                if (ArrowDown)
            rPad.down()
            if (rPad.point > 2 || lPad.point > 2) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white'; 
                ctx.font = '124px Arial';
                ctx.textAlign = 'center'; 
                ctx.textBaseline = 'middle'
                if (lPad.point > 2)
                    ctx.fillText("Left win", canvas.width/2, canvas.height/2); 
                else
                    ctx.fillText("Right win", canvas.width/2, canvas.height/2); 
                ctx.fillStyle = 'gray'; 
                ctx.font = '80px Arial';
                ctx.fillText(`${lPad.point}:${rPad.point}`, canvas.width/2, canvas.height/3*2); 
                }
            else
                ball.moove(lPad, rPad)
            ctx.fillStyle = 'black'
        }
        requestAnimationFrame(() => {
            this.gameLoop(++frame, lPad, rPad, ball)
        });
    }
}

class Paddle {
    constructor(side, color) {
        if (side == "right")
            this.x = canvas.width/100
        else
            this.x = canvas.width/100*98
        this.point = 0
        this.w = canvas.width/100;
        this.h = canvas.height/5;
        this.y = (canvas.height/2)-(this.h/2)
        this.s = 10
        this.color = color
    }
    up() {
        if (0 < this.y)
            this.y -= this.s;
    }
    down () {
        if (this.y + this.h < canvas.height)
            this.y += this.s;
    }
};

class Particle {
    constructor(startX, startY, side, color) {
        let size = 15
        this.color = color
        this.x = startX;
        this.y = startY;
        this.a = Math.random() + 1
        this.r = 1
        this.s = 1
        let randDir = Math.random()
        let randSide = Math.random()
        let randAlpha = Math.random()
        let randRotate = Math.random()
        let randSize = Math.random()
        if (randSide < 0.5)
            randSide = -1;
        else
            randSide = 1;
        switch (side) {
            case "top":
                this.vecX = ((randDir * this.s) * randSide);
                this.vecY = (1-randDir * this.s);
                break ;
            case "right":
                this.vecX = (randDir * this.s) * -1 ;
                this.vecY = (1-randDir * this.s) * randSide;
                break;
            case "bottom":
                this.vecX = ((randDir * this.s) * randSide);
                this.vecY = (1-randDir * this.s) * -1;
                break;
            case "left":
                this.vecX = ((randDir * this.s) * 1);
                this.vecY = (1-randDir * this.s) *randSide;
                break;
        }

        // if (randAlpha > 0.5)
        // randAlpha -= 0.5
        // if (randAlpha < 0.2)
        // randAlpha += 0.2
        this.size = size + (size*randSize)
        this.vecSize = randSize
        this.vecA = randAlpha;
        this.vecR = randRotate/20 * randSide;
    }

    draw(ctx) {
        if (this.a - this.vecA < 0 || this.size < 0)
            return "out"
        ctx.fillStyle = this.color;
        if (pong.startGame)
            ctx.globalAlpha =  this.a - this.vecA;
        else
            ctx.globalAlpha = this.a;
        ctx.translate(this.x, this.y);
        if (pong.startGame)
            this.r -= this.vecR
        ctx.rotate(this.r);
        if (pong.startGame)
            this.size -= this.vecSize
        ctx.fillRect(-10 / 2, -10 / 2, this.size, this.size);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 1
        return ""
    }

    update() {
        this.x += this.vecX;
        this.y += this.vecY;
    }
}

class Ball {
    init(side) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.r = 10
        this.nbParticle = 30
        this.particles = []
        let randDir = Math.random().toFixed(2);
        let randSide = Math.random().toFixed(2);
        if (randSide < 0.5)
            this.vecX = 1
        else
            this.vecX = -1
        if (side === "right")
            this.vecX = 1
        if (side === "left")
            this.vecX = -1
        if (randDir < 0.5) {
            this.vecY = (randDir-1)
        }
        else {
            // console.log(randDir)
            this.vecY = randDir
        }
    }
    constructor(color) {
        this.color = color
        this.init("")
    }

   
    moove(lPad, rPad) {
        if (this.x + this.r >= rPad.x && this.y < rPad.y + rPad.h && this.y > rPad.y) {
            this.genParticle(this.x, this.y, "right", rPad.color)

            this.vecX *= -1
        }
        if (this.x - this.r <= lPad.x+lPad.w && this.y < lPad.y + lPad.h && this.y > lPad.y) {
            this.genParticle(this.x, this.y, "left", lPad.color)
            this.vecX *= -1
        }
        if (this.y + this.r > canvas.height) {
            this.genParticle(this.x, this.y, "bottom", this.color)
            this.vecY *= -1
        }
        if (this.y - this.r < 0 ) {
            this.genParticle(this.x, this.y, "top", this.color)
            this.vecY *= -1
        }
        
        if (this.x < 0) {
            this.genParticle(this.x, this.y, "left", this.color)
            rPad.point += 1;
            this.init("right")
            return 
        }
        
        if (this.x > canvas.width){
            lPad.point += 1;
            this.genParticle(this.x, this.y, "right", this.color)
            this.init("left")
            return ;
        }
        this.x += parseFloat(this.vecX * this.s);
        this.y += parseFloat(this.vecY * this.s);
    }
    genParticle (startX, startY, side, color) {
        for (let i = 0; i < this.nbParticle; i++) {
            this.particles.push(new Particle(startX, startY, side, color));
        }
    }
    animateParticles(ctx) {
        for (let particle of this.particles) {
            particle.draw(ctx);
            if (pong.startGame) {
                particle.update();
            }
        }
    }

};



var ArrowUp = false
var ArrowDown = false
var KeyW = false
var KeyS = false

var pong = new Pong("#ff5000", "#5f50f0", "#fff", 10, 8)

document.addEventListener('keydown', function(event) {
    var keyCode = event.key;
    if (keyCode === "ArrowUp")
        ArrowUp = true
    else if (keyCode === "ArrowDown")
        ArrowDown = true
    else if (keyCode === "w")
        KeyW = true
    else if (keyCode === "s")
        KeyS = true
    else if(keyCode === "g" && pong.startGame)
        pong.startGame = false
    else if(keyCode === "g" && !pong.startGame)
        pong.startGame = true

});
document.addEventListener('keyup', function(event) {
        var keyCode = event.key;
    if (keyCode === "ArrowUp")
        ArrowUp = false
    else if (keyCode === "ArrowDown")
        ArrowDown = false
    else if (keyCode === "w")
        KeyW = false
    else if (keyCode === "s")
        KeyS = false
});



function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Vérifie si le cookie commence par le nom recherché
        if (cookie.indexOf(name + '=') === 0) {
            // Récupère la valeur du cookie
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    // Retourne null si le cookie n'est pas trouvé
    return null;
}

var token = getCookie('PongToken');


var socket_ball_x
var socket_ball_y
var socket_lPad_x
var socket_lPad_y
var socket_rPad_x
var socket_rPad_y


var socket;
async function main(matchData) {
    console.log(matchData)
    socket = new WebSocket(`ws://localhost:8000/match`);
    while (!(socket.readyState === WebSocket.OPEN)) {
        console.log('En attente de connexion...');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    socket.onmessage = function(event) {
        var data = JSON.parse(event.data);
        // console.log(data)
        if (("player1" in data) && matchData.player == 2) {
            socket_ball_x = data.player1.ball.x
            socket_ball_y = data.player1.ball.y
            socket_lPad_x = data.player1.lPad.x
            socket_lPad_y = data.player1.lPad.y
        }
        else if (("player2" in data) && matchData.player == 1) {
            socket_rPad_x = data.player2.rPad.x
            socket_rPad_y = data.player2.rPad.y
        }
        // Utilisez les données reçues comme vous le souhaitez, par exemple, affichez-les dans la console
        // console.log(data);
        // Ou mettez à jour le DOM pour afficher les données dans le navigateur
        // Exemple de mise à jour d'un élément ayant l'ID "data-container"
    };
    pong.playerNb = matchData.player
}


if (token) {    
        fetch("http://127.0.0.1:8000/api/pong/getIdMatch")
        .then(response => {
            if (!response.ok) {throw new Error('La requête a échoué');}return response.json(); })
        .then(data => {
            if ("error" in data) {
                console.log(data)
                return;
            }
            else {
                main(data.ok);
            }
        })
            
}