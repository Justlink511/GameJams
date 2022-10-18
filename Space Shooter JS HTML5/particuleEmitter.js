class Particle {
    constructor(pX, pY) {
        this.x = pX;
        this.y = pY;
        this.imgParticles = imageLoader.getImage("images/particles.png");
        this.frame = rnd(0, 11);
        this.life = rnd(1000, 2000) / 1000;
        this.lifeMax = this.life;
        this.angle = Math.random() * (2 * Math.PI);
        this.vx = rnd(10, 500) / 100 * Math.cos(this.angle);
        this.vy = rnd(10, 500) / 100 * Math.sin(this.angle);
        this.alpha = Math.random();


        this.tileSize = {
            x: 15,
            y: 15
        }

    }



    update(dt) {
        this.life -= dt;
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(pCtx) {
        let coef = this.life / this.lifeMax;
        pCtx.globalAlpha = this.alpha * coef;
        let nbCol = this.imgParticles.width / this.tileSize.x;
        let c = 0;
        let l = 0;

        l = Math.floor(this.frame / nbCol);
        c = this.frame - (l * nbCol);

        let x = c * this.tileSize.x;
        let y = l * this.tileSize.y;
        pCtx.drawImage(this.imgParticles, x, y, this.tileSize.x, this.tileSize.y, this.x, this.y, this.tileSize.x, this.tileSize.y);
        pCtx.globalAlpha = 1;
    }
}


class ParticleEmitter {
    constructor(pX, pY) {
        this.lstParticles = [];
        this.x = pX;
        this.y = pY;
    }


    add() {
        let p = new Particle(this.x + rnd(-5, 5), this.y + rnd(-5, 5));
        this.lstParticles.push(p);

    }

    update(dt) {
        for (let index = this.lstParticles.length - 1; index >= 0; index -= 1) {
            let p = this.lstParticles[index];
            p.update(dt);
            if (p.life <= 0) {
                this.lstParticles.splice(index, 1);
            }
        }
    }

    draw(pCtx) {
        this.lstParticles.forEach(p => {
            p.draw(pCtx);

        });
    }
}