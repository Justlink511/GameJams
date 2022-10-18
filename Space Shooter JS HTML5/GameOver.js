class GameOver {
    constructor() {
        this.keyboard = null;
        this.imageLoader = null;
        this.imgBackground = null;
        this.quit = false;
        this.new = false;
        this.quitOK = false;
        this.newOK = false;
    }
    load(pImageLoader) {

        this.imageLoader = pImageLoader;
        this.imgBackground = this.imageLoader.getImage("images/GameOverNew.png");
        this.background = new ScrollingBackground(this.imgBackground);
        this.background.speed = 0;
    }

    update(dt) {
        this.background.update(dt);

        if (this.keyboard["ArrowDown"] == true) {
            this.imgBackground = this.imageLoader.getImage("images/GameOverQuit.png");
            this.background = new ScrollingBackground(this.imgBackground);
            this.background.speed = 0;
            this.quit = true;
            this.new = false;
        }
        if (this.keyboard["ArrowUp"] == true) {
            this.imgBackground = this.imageLoader.getImage("images/GameOverNew.png");
            this.background = new ScrollingBackground(this.imgBackground);
            this.background.speed = 0;
            this.quit = false;
            this.new = true;
        }
        if (this.keyboard["Enter"] == true) {
            if (this.quit) {
                this.quitOK = true;
            } else { this.newOK = true }
        }
    }

    draw(pCtx) {
        this.background.draw(pCtx);
    }
}