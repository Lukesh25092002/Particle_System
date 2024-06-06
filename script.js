const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, '#FFDB5C');
gradient.addColorStop(0.5, '#FFAF61');
gradient.addColorStop(1, '#BFF6C3');
ctx.fillStyle = gradient;
ctx.fillRect(0,0,canvas.width,canvas.height);

class Particle{
    constructor(effect){
        this.effect = effect;
        this.radius = Math.random()*10 + 20;
        this.x = this.radius + Math.random()*(this.effect.width-2*this.radius);
        this.y = this.radius + Math.random()*(this.effect.height-2*this.radius);
        this.speedX = Math.random()*10-5;
        this.speedY = Math.random()*10-5;
    }

    update(){
        this.x += this.speedX;
        if(this.x+this.radius>=this.effect.width || this.x-this.radius<0){
            this.speedX *= -1;
        }

        this.y += this.speedY;
        if(this.y+this.radius>=this.effect.height || this.y-this.radius<0){
            this.speedY *= -1;
        }
    }

    draw(context){
        context.fillStyle = `hsl(${this.x*360/this.effect.width},100%,50%)`;
        context.strokeStyle = 'black';
        context.beginPath();
        context.arc(this.x,this.y,this.radius,0,Math.PI*2);
        context.fill();
        context.stroke();
    }
}

class Effect{
    constructor(canvas){
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        this.numberOfParticles = 15;
        this.particleArray = [];

        this.createParticles();
    }

    createParticles(){
        for(let i=0 ; i<this.numberOfParticles ; i++){
            this.particleArray.push(new Particle(this));
        }
    }

    connectParticles(context){
        const maxDistance = 300;
        const boundDistance = 150;

        for(let i=0 ; i<this.numberOfParticles ; i++){
            for(let j=i+1 ; j<this.numberOfParticles ; j++){
                const dx = this.particleArray[i].x - this.particleArray[j].x;
                const dy = this.particleArray[i].y - this.particleArray[j].y;
                const currDistance = Math.hypot(dx, dy);

                if(currDistance>maxDistance){
                    continue;
                }
                else if(currDistance>boundDistance){
                    context.strokeStyle = gradient;
                    context.globalAlpha = 1 - (currDistance-boundDistance)/(maxDistance-boundDistance);

                    context.beginPath();
                    context.moveTo(this.particleArray[i].x,this.particleArray[i].y);
                    context.lineTo(this.particleArray[j].x,this.particleArray[j].y);
                    context.closePath();
                    context.stroke();

                    context.globalAlpha = 1;
                }
                else{
                    context.strokeStyle = gradient;
                    context.beginPath();
                    context.moveTo(this.particleArray[i].x,this.particleArray[i].y);
                    context.lineTo(this.particleArray[j].x,this.particleArray[j].y);
                    context.closePath();
                    context.stroke();
                }
            }
        }
    }

    handelParticles(context){
        this.particleArray.forEach(function(particle){
            particle.update();
        });

        this.connectParticles(context);

        this.particleArray.forEach(function(particle){
            particle.draw(context);
        });
    }

    
}

const effect = new Effect(canvas);

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    effect.handelParticles(ctx);
    requestAnimationFrame(animate);
}
animate();