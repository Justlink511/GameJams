class Hero {
    constructor(pX, pY) {
        this.imgHeroMod0 = imageLoader.getImage("images/HeroMod1.png");
        this.imgHeroMod2 = imageLoader.getImage("images/HeroMod2.png");
        this.spriteHero = new Sprite(this.imgHeroMod0, pX, pY);
        this.spriteHero.setTileSheet(33, 50);
        this.spriteHero.currentFrame = 0;
        this.x = this.spriteHero.x;
        this.y = this.spriteHero.y;
        this.speed = 5;
        this.shootTimer = 0;
        this.shootSpeed = 0.7;
        this.shoot = false;
        this.shoot2 = false;
        this.mod = 0;
        this.canonCount = 0;
        this.canon1 = null;
        this.canon2 = null;
        this.damage = 1;
        this.lifeMax = 5;
        this.life = 5;
        this.invu = false;
        this.invuTimer = 0;


    }

    getLifeRatio() {
        return this.life / this.lifeMax;
    }


    getShotPosition(pBulletHeight) {
        let position = { x: 0, y: 0 };
        let midShip = this.x + (this.spriteHero.tileSize.x / 2);
        position.y = this.y - (pBulletHeight);
        position.x = midShip;
        return position
    }

    getShip2() {
        this.spriteHero = new Sprite(this.imgHeroMod2, this.x, this.y);
        this.spriteHero.setTileSheet(64, 60);
        this.shoot2 = true;
        this.shootSpeed = 0.2;
    }

    update(dt) {
        this.spriteHero.x = this.x;
        this.spriteHero.y = this.y;

        /*if (this.invu) {
            this.invuTimer += dt;
            if (this.invuTimer >= 1) {
                this.invuTimer = 0;
                this.invu = false;
            }
        }*/

        if (this.shoot) {
            this.shootTimer += dt;
            if (this.shootTimer >= this.shootSpeed) {
                this.shoot = false;
                this.shootTimer = 0;
            }
        }

        if (this.mod == 2) {

        }

        if (this.mod == 1) {

        }

        if (this.canon1 != null) {
            this.canon1.update(dt);
        }
        if (this.canon2 != null) {
            this.canon2.update(dt);
        }
    }

    draw(pCtx) {
        this.spriteHero.draw(pCtx);

        let ratio = this.getLifeRatio();
        pCtx.fillStyle = "rgb(0,255,0)";
        pCtx.fillRect(10, 850, ratio * 150, 40);

        if (this.canon1 != null) {
            this.canon1.draw(pCtx);
        }
        if (this.canon2 != null) {
            this.canon2.draw(pCtx);
        }

    }
}

class Canon extends Sprite {
    constructor(px, py, pSide, pHero) {
        let img;
        switch (pSide) {
            case "Right":
                img = imageLoader.getImage("images/HeroCanon.png");
                super(img, px, py);
                this.hero = pHero;
                this.setTileSheet(30, 30);
                this.currentFrame = 0;
                this.addAnimation("tir", [0, 1], 0.8, true);
                this.startAnimation("tir");
                this.x = this.hero.x + this.hero.spriteHero.tileSize.x;
                this.y = this.hero.y;

                break;

            case "Left":
                img = imageLoader.getImage("images/HeroCanon.png");
                super(img, px, py);
                this.hero = pHero;
                this.setTileSheet(30, 30);
                this.currentFrame = 0;
                this.addAnimation("tir", [0, 1], 0.8, true);
                this.startAnimation("tir");
                this.x = this.hero.x - this.tileSize.x;
                this.y = this.hero.y;

                break;

            default:
                break;
        }
        this.shoot = false;
        this.shootTimer = 0;
        this.shootSpeed = 1.5;
        this.side = pSide;
    }
    update(dt) {
        super.update(dt);

        switch (this.side) {
            case "Right":
                this.x = this.hero.x + this.hero.spriteHero.tileSize.x;
                this.y = this.hero.y;
                break;

            case "Left":
                this.x = this.hero.x - this.tileSize.x;
                this.y = this.hero.y;
                break;

            default:
                break;
        }


        if (this.shoot) {
            this.shootTimer += dt;
            if (this.shootTimer >= this.shootSpeed) {
                this.shoot = false;
                this.shootTimer = 0;
            }
        }

    }
}
