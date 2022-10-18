class PowerUp extends Sprite {
    constructor(px, py, pType) {
        let img;

        switch (pType) {
            case "Mod":
                img = imageLoader.getImage("images/PowerUp.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(62.5, 75);
                this.currentFrame = 1;
                this.addAnimation("glow", [0, 4], 0.2, true);
                this.startAnimation("glow");
                break;
            case "Heal":
                img = imageLoader.getImage("images/PowerUp.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(62.5, 75);
                this.currentFrame = 1;
                this.addAnimation("glow", [1, 5], 0.2, true);
                this.startAnimation("glow");
                break;
            case "Shield":
                img = imageLoader.getImage("images/PowerUp.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(62.5, 75);
                this.currentFrame = 0;
                this.addAnimation("glow", [2, 6], 0.2, true);
                this.startAnimation("glow");
                break;
            case "Attack":
                img = imageLoader.getImage("images/PowerUp.png");
                super(img, px, py); // appel le constructor de Sprite
                this.setTileSheet(62.5, 75);
                this.currentFrame = 0;
                this.addAnimation("glow", [3, 7], 0.2, true);
                this.startAnimation("glow");
                break;

            default:
                break;
        }
        this.type = pType;
        this.vy = 2;
        this.start = false;

    }

    outOfScreen(pWidth, pHeight) {
        if (this.x + this.tileSize.x < 0 ||
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
        this.y += this.vy;
    }

}