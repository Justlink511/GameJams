class Sprite {
    constructor(pImg, pX = 0, pY = 0) {
        this.img = pImg
        this.x = pX;
        this.y = pY;
        this.scaleX = 1;
        this.scaleY = 1;

        this.width = pImg.width;
        this.height = pImg.height;

        this.currentFrame = 0;
        this.currentFrameInAnimation = 0;
        this.currentAnimation = null;
        this.frameTimer = 0;

        this.tileSize = {
            x: 0,
            y: 0
        }
        this.tilesheet = false;

        this.animations = [];
    }


    addAnimation(pName, pFrames, pSpeed, pLoop = true) {
        let animation = {
            name: pName,
            frames: pFrames,
            speed: pSpeed,
            loop: pLoop,
            end: false
        }
        this.animations.push(animation);
    }

    startAnimation(pName) {
        if (this.currentAnimation != null) {
            if (this.currentAnimation.name == pName) {
                return;
            }
        }
        this.animations.forEach(animation => {
            if (animation.name == pName) {
                this.currentAnimation = animation;
                this.currentFrameInAnimation = 0;
                this.currentFrame = this.currentAnimation.frames[this.currentFrameInAnimation];
                this.currentAnimation.end = false;
            }
        })

    }

    setTileSheet(pSizeX, pSizeY) {
        this.tilesheet = true;
        this.tileSize.x = pSizeX;
        this.tileSize.y = pSizeY;
        this.width = pSizeX;
        this.height = pSizeY;
    }

    setScale(pX, pY) {
        this.scaleX = pX;
        this.scaleY = pY;
    }

    collideWith(pSprite) {
        if (CheckCollision(pSprite, this)) {
            return true;
        }
        else {
            return false;
        }
    }

    update(dt) {
        if (this.currentAnimation != null) {
            this.frameTimer += dt;
            if (this.frameTimer >= this.currentAnimation.speed) {
                this.frameTimer = 0;
                this.currentFrameInAnimation += 1;

                if (this.currentFrameInAnimation > this.currentAnimation.frames.length - 1) {
                    if (this.currentAnimation.loop) {
                        this.currentFrameInAnimation = 0;
                    }
                    else {
                        this.currentFrameInAnimation--;
                        this.currentAnimation.end = true;
                    }
                }
                this.currentFrame = this.currentAnimation.frames[this.currentFrameInAnimation];
            }

        }
    }

    draw(Pctx) {
        if (!this.tilesheet) {
            Pctx.drawImage(this.img, this.x, this.y);
        }
        else {
            let nbCol = this.img.width / this.tileSize.x;
            let c = 0;
            let l = 0;

            l = Math.floor(this.currentFrame / nbCol);
            c = this.currentFrame - (l * nbCol);

            let x = c * this.tileSize.x;
            let y = l * this.tileSize.y;

            Pctx.drawImage(this.img, x, y, this.tileSize.x, this.tileSize.y, this.x, this.y, this.tileSize.x * this.scaleX, this.tileSize.y * this.scaleY);
        }
    }
}