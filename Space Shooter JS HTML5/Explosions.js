class Explosion extends Sprite {
    constructor(px, py, pType) {
        let img;
        switch (pType) {
            case "Ship":
                img = imageLoader.getImage("images/exp64.png");
                super(img, px, py);
                this.setTileSheet(64, 64);
                this.currentFrame = 0;
                this.addAnimation("Exp", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 0.05, false);
                this.startAnimation("Exp");
                break;
            case "MotherShip":
                img = imageLoader.getImage("images/EnnemyMothership1.png");
                super(img, px, py);
                this.setTileSheet(250, 250);
                this.currentFrame = 0;
                this.addAnimation("ExpMotherShip", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 0.05, false);
                this.startAnimation("ExpMotherShip");
                break;
            case "MotherShip2":
                img = imageLoader.getImage("images/EnnemyMothership1.png");
                super(img, px, py);
                this.setTileSheet(250, 250);
                this.currentFrame = 0;
                this.addAnimation("ExpMotherShip", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 0.05, false);
                this.startAnimation("ExpMotherShip");
                break;
            case "Cruiser":
                img = imageLoader.getImage("images/Ennemycruiser1.png");
                super(img, px, py);
                this.setTileSheet(182, 232);
                this.currentFrame = 0;
                this.addAnimation("ExpCruiser", [15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 0.2, false);
                this.startAnimation("ExpCruiser");
                break;
            case "exp130":
                img = imageLoader.getImage("images/exp2.png");
                super(img, px, py);
                this.setTileSheet(132, 127, 6);
                this.addAnimation("exp132", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 0.05, false);
                this.startAnimation("exp132");
                break;
            case "Laser":
                img = imageLoader.getImage("images/exp64.png");
                super(img, px, py);
                this.setTileSheet(64, 64);
                this.currentFrame = 0;
                this.addAnimation("Exp", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 0.05, false);
                this.startAnimation("Exp");
                break;
            case "Boss1":
                img = imageLoader.getImage("images/exp64.png");
                super(img, px, py);
                this.setTileSheet(64, 64);
                this.currentFrame = 0;
                this.addAnimation("Exp", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 0.05, false);
                this.startAnimation("Exp");
                break;
            default:
                console.error("erreur pas de type d'explosion");
                break;
        }
        this.type = pType;

    }
    update(dt) {
        super.update(dt);

    }
}