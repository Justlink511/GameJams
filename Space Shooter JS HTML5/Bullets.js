class Bullet extends Sprite {
    constructor(px, py, pVx, pVy, pType) {
        let img;
        switch (pType) {
            case 0:
                img = imageLoader.getImage("images/shotHero0.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(25, 25);
                this.currentFrame = 0;
                this.friendly = true;
                this.addAnimation("tir", [0, 1, 2, 3], 0.2, true);
                this.startAnimation("tir");
                break;
            case 1:
                img = imageLoader.getImage("images/shotHero.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(40, 40);
                this.currentFrame = 0;
                this.friendly = true;
                break;
            case 2:
                img = imageLoader.getImage("images/shotHero.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(40, 40);
                this.currentFrame = 0;
                this.friendly = true;
                this.addAnimation("tir", [0, 1, 2, 3], 0.05, true);
                this.startAnimation("tir");
                break;
            case "motherShip":
                img = imageLoader.getImage("images/shotMotherShip.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(20, 20);
                this.currentFrame = 0;
                this.friendly = false;
                break;

            case "preBeam":
                img = imageLoader.getImage("images/preBeam.png");
                super(img, px, py);
                this.setTileSheet(47, 48);
                this.currentFrame = 1;
                this.addAnimation("tir", [0, 1], 0.5, true);
                this.startAnimation("tir");
                this.friendly = false;
                break;


            case "laserBeam":
                img = imageLoader.getImage("images/laserBeam.png");
                super(img, px, py);
                this.setTileSheet(20, 90);
                this.currentFrame = 2;
                this.addAnimation("tir", [0, 1, 2], 0.1, true);
                //this.startAnimation("tir");
                this.friendly = false;
                break;

            case "ship":
                img = imageLoader.getImage("images/shotShip.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(10, 10);
                this.currentFrame = 0;
                this.friendly = false;
                break;

            case "Canon":
                img = imageLoader.getImage("images/CanonShot.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(15, 26);
                this.currentFrame = 0;
                this.friendly = true;
                break;
            case "Cruiser":
                img = imageLoader.getImage("images/BossShotCharge.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(50, 50);
                this.currentFrame = 10;
                this.friendly = false;
                this.addAnimation("tir", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, false);
                this.startAnimation("tir");
                break;

            case "arcBullet":
                img = imageLoader.getImage("images/arcBullet.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(48, 48);
                this.currentFrame = 0;
                this.friendly = false;
                this.addAnimation("tir", [0, 1, 2, 3, 4, 5, 6, 7], 0.05, true);
                this.startAnimation("tir");
                break;
            case "LaserH":
                img = imageLoader.getImage("images/laserH.png");
                super(img, px, py);
                this.setTileSheet(540, 30);
                this.currentFrame = 0;
                this.friendly = false;
                break;

            default:
                console.error("erreur pas de type de bullet");
                break;
        }
        this.type = pType;
        this.vx = pVx;
        this.vy = pVy;
    }

    outOfScreen(pWidth, pHeight) {
        if (this.x + this.tileSize.x < 0 ||
            this.y + this.tileSize.y < 0 ||
            this.x > pWidth ||
            this.y > pHeight
        ) {
            return true;
        }
        else {
            return false;
        }
    }

    update(dt) {
        super.update(dt);
        this.x += this.vx;
        this.y += this.vy;
    }
}