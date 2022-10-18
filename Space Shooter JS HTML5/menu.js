class Menu {
    constructor() {
        this.keyboard = null;
        this.imageLoader = null;
        this.imgBackground = null;
        this.background = null;
        this.particleEmitter = new ParticleEmitter(rnd(50, 550), rnd(50, 850));
        this.particleEmitter1 = new ParticleEmitter(rnd(40, 580), rnd(40, 880));
        this.particleEmitter2 = new ParticleEmitter(300, 450);
        this.start = false;
        this.particleTimer = 0;
        this.particleTimer1 = 0;
        this.particleDelay = 2;
        this.particleDelay1 = 1;
    }

    load(pImageLoader) {

        //chargement de l'image loader, 
        this.imageLoader = pImageLoader;
        this.imgBackground = this.imageLoader.getImage("images/menu.png");
        this.background = new ScrollingBackground(this.imgBackground);
        this.background.speed = 0;

        for (let n = 0; n < 50; n += 1) {
            this.particleEmitter.add();
        }

    }

    update(dt) {
        this.background.update(dt);
        this.particleEmitter.update(dt);
        this.particleEmitter1.update(dt);
        this.particleTimer = this.particleTimer + dt;
        this.particleTimer1 = this.particleTimer1 + dt
        if (this.particleTimer >= this.particleDelay) {
            this.particleEmitter.x = rnd(50, 550);
            this.particleEmitter.y = rnd(50, 850);
            for (let n = 0; n < rnd(50, 500); n += 1) {
                this.particleEmitter.add();
            }
            this.particleTimer = 0;
        }
        if (this.particleTimer1 >= this.particleDelay1) {
            this.particleEmitter1.x = rnd(50, 550);
            this.particleEmitter1.y = rnd(50, 850);
            for (let n = 0; n < rnd(50, 500); n += 1) {
                this.particleEmitter1.add();
            }
            this.particleTimer1 = 0;
        }

        if (this.keyboard["Space"] == true) {
            this.start = true;
        }


    }

    draw(pCtx) {
        pCtx.save();
        pCtx.scale(1, 1);
        //dessine le fond qui scroll
        this.background.draw(pCtx);
        this.particleEmitter.draw(pCtx);
        this.particleEmitter1.draw(pCtx);
        pCtx.restore();
    }

    keypressed(pKey) {
        /*if (pKey == "Space") {
            let position = this.player.getShotPosition(14)
            let b = new Bullet(position.x, position.y, 0, -2, "PLAYER");
            this.lstBullets.push(b);
        }*/
    }
}