//CONEXION AL CANVAS
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const buttonStart = document.getElementById("start");





// VARIABLES GLOBALES
let frames = 0;
let requestID;
let audio = new Audio ()
audio.src = "assets/audio/pop.mp3"
let audio1 = new Audio ()
audio1.src ="assets/audio/gameover.mp3"
audio1.loop = false
let audio2 = new Audio ()
audio2.src ="assets/audio/win.mp3"
audio2.loop = false





const enemies =[]
const imageEnemies = ["assets/images/momia_v1.png","assets/images/momia_v2.png","assets/images/mummy3.png","assets/images/mummy4.png","assets/images/mummy5.png"]

const kemonitos = []
const kemonitoImage = new Image()
kemonitoImage.src = "assets/images/kemonito.png"





// CLASES


class Character {
    constructor(x,y,w,h,img){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.image = new Image()
        this.image.src = img
    }

    draw(){
        if(frames % 1 === 0) {
            this.x -= 3;
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    collision(object) {
        return (
            this.x < object.x + object.width &&
            this.x + this.width > object.x &&
            this.y < object.y + object.height &&
            this.y + this.height > object.y
        )
    }
}


class Luchador extends Character{
    constructor(x,y,w,h){
        super(x, y, w, h)
      this.image = new Image()
      this.image.src = "assets/images/luchador.png"  
      this.vidas = 3
    }
    draw(){
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
  }


class Enemy extends Character{
    constructor(x,y,w,h, img){
        super(x, y, w, h, img)
      }
    }
  

class Item {
    constructor(w, h, img, positionX, positionY, speedX, speedY) {
        this.width = w;
        this.height = h;
        this.image = new Image();
        this.image.src = img;
        this.position = {
            x: positionX,
            y: positionY
        };
        this.speed = {
            x: speedX,
            y: speedY
        };
    }
    draw() {
        this.position.x += this.speed.x ;
        this.position.y += this.speed.y;
        ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
        collision(object) {
            return (
                this.position.x < object.x + object.width &&
                this.position.x + this.width > object.x &&
                this.position.y < object.y + object.height &&
                this.position.y + this.height > object.y
            )
        }
    }
    
    class Kemonito extends Item {
        constructor(width, height, img, positionX, positionY, speedX, speedY) {
            super(width, height, img, positionX, positionY, speedX, speedY);
        }
        draw() {
            this.position.x += this.speed.x * 0.6;
            this.position.y += this.speed.y;
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    class Background{
        constructor(){
            this.x = 0;
            this.y = 0;
            this.width = canvas.width;
            this.height = canvas.height;
            this.image = new Image();
            this.image.src = "assets/images/background3.png"
            
        }   
    
        draw() {
            this.x -= 1;
            if(this.x < -canvas.width){
                this.x = 0
            }
            ctx.drawImage(this.image,this.x,this.y, this.width,this.height)
            ctx.drawImage(
                this.image,
                this.x + this.width, 
                this.y ,
                this.width,
                this.height)    
            }
        
        gameOver(){
            ctx.fillStyle="white"
            ctx.font = "100px Arial"
            ctx.fillText("GAME OVER",150,150)
            audio1.play()
            ctx.font = "50px Arial"
            ctx.fillText(`Your score: ${ Math.round(frames/25)} `,150,300)
        }

        win(){
            ctx.fillStyle="white"
            ctx.font = "100px Arial"
            ctx.fillText("YOU WIN",150,150)
        }
            
                            
    }





// INSTANCIAS
const background = new Background()
const luchador = new Luchador(100,canvas.height/2,40,75)




// START GAME
function startGame() {
    console.log("prueba de inicio de juego")
    requestID = requestAnimationFrame(updateCanvas)
}



//UPDATE CANVAS
function updateCanvas(){
    frames ++;
      ctx.clearRect(0,0,canvas.width, canvas.height)
    background.draw()
    luchador.draw()
    corazones()
    score()
    generateEnemies()
    drawEnemies()
    lanzarKemonitos()
    statusCheck()
    winTheGame()
    
if(requestID){
    requestID = requestAnimationFrame(updateCanvas)
    }
   
}



// INICIAR JUEGO CON UN CLICK DE BOTON
buttonStart.addEventListener("click",startGame)




  // GENERAR ENEMIGOS
  function generateEnemies(){
   
    if(frames % 320===0 || frames % 200 === 0 || frames % 135 === 0 || frames % 423 === 0 ){

        let y = Math.floor(Math.random() * (canvas.height - 80) ) + 15
        let imgRand = Math.floor(Math.random() * imageEnemies.length)
        const enemy = new Enemy (canvas.width,y,45,55,imageEnemies[imgRand])
        enemies.push(enemy)
    
    }}




// DIBUJAR ENEMIGOS
function drawEnemies(){

    enemies.forEach((enemy,index_enemy) => {
        enemy.draw()

        if(luchador.collision(enemy)){
            console.log("hay contacto")
            luchador.vidas --
            enemies.splice(index_enemy,1)
        }

        kemonitos.forEach((kemonito,index_kemonito) => {
            kemonito.draw()
    
        if(kemonito.collision(enemy)){
            console.log("se muere una momia")
            enemies.splice(index_enemy,1)
            kemonitos.splice(index_kemonito,1)
            }})


        if (enemy.x + enemy.width <= 0){
            enemies.splice(index_enemy,1)
            luchador.vidas --
            console.log(enemies)
            }

     


        })}

    
   
        
    


//SCORE
function score(){
    const puntos = Math.round(frames/25)
    ctx.fillStyle="white"
    ctx.font = '20px Arial';
    ctx.fillText(`Score ${puntos}`, canvas.width-100, 25);
  }



//CORAZON DE VIDAS
  function corazones(){
    const vida = new Image()
    vida.src = "assets/images/vidas.png"
    ctx.drawImage(vida,0,5,60,30)
    ctx.fillStyle="white"
    ctx.font = '20 px Arial';
    ctx.fillText(`X ${luchador.vidas}`, 60,30); 
  }


// STATUS
function statusCheck() {
    if (luchador.vidas <= 0 ) {
        background.gameOver()
        requestAnimationFrame = null
        
          
  }}


// WIN THE GAME
 function winTheGame(){ 
     let puntos = Math.round(frames/25)
  if (puntos === 40){
    background.win()
    audio2.play()
    requestAnimationFrame = null
  }}








// MOVIENTOS DEL SANTO
addEventListener("keydown",(event) => {
            //izquierda (flecha)
    if(event.keyCode === 37){
        if (luchador.x > 10){
          luchador.x -=20  
        }}
            //derecha (flecha)
    if(event.keyCode === 39){
        if (luchador.x < canvas.width-luchador.width){
          luchador.x +=20  
        }}
            //arriba (flecha)
    if(event.keyCode === 38){
        if (luchador.y > 20){
          luchador.y -=20  
        }}
  
            //abajo (flecha)
        if(event.keyCode === 40){
            if (luchador.y < canvas.height-luchador.height-15){
              luchador.y +=20  
            }}

            //disparar (s)
    if (event.keyCode === 83){

            console.log("dispara un kemonito")
            kemonitos.push(new Kemonito(40,40,kemonitoImage.src,luchador.x, luchador.y+25,3,0))
            audio.play()
        }
    })

   

// DISPARAR KEMONITOS
    function lanzarKemonitos() {
        kemonitos.forEach((kemonito, kemonito_index) => {
            kemonito.draw();
            if (kemonito.position.y + kemonito.height <= 0) {
                kemonitos.splice(kemonito_index, 1);
            }
        });
    }


