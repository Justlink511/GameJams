class Ennemy {
    constructor(pSprite) {
        this.sprite = pSprite;
        this.pendingDelay = 0;
        this.timer = 0;
        this.speed = 1;
        this.started = false;
        this.shoot = false;
        this.shootTimer = 0;
        this.shootSpeed = 2;
        this.sinAngle = 0;
        this.life = 10;
    }

    update(dt) {
        this.sprite.update(dt);
    }

    getShotPosition(pBulletHeight) {
        let position = { x: 0, y: 0 };
        let midShip = this.sprite.x + (this.sprite.tileSize.x / 2);
        position.y = this.sprite.y + this.sprite.tileSize.y + (pBulletHeight);
        position.x = midShip;
        return position
    }

    draw(pCtx) {
        this.sprite.draw(pCtx);
    }
}

class Asteroid extends Ennemy {
    constructor(pSprite, pType, pBulletList, pTarget) {
        super(pSprite, pType, pBulletList, pTarget);
        this.type = pType;
        this.target = pTarget;
        this.speed = rnd(100, 350) / 100;
        this.life = 9999;
        this.invu = false;
        this.sprite.currentFrame = rnd(0, 11);
    }
    update(dt) {
        super.update(dt);
        this.sprite.y += this.speed;
        if (this.sprite.collideWith(this.target.spriteHero) && !this.target.invu) {
            this.target.life -= 1;
            this.target.invu = true;
        }
    }
}

class Cruiser extends Ennemy {
    constructor(pSprite, pType, pBulletList, pTarget) {
        super(pSprite, pType, pBulletList, pTarget);
        this.type = pType;
        this.lstBullets = pBulletList;
        this.target = pTarget;
        this.speed = rnd(100, 350) / 100;
        this.life = 25;
        this.invu = false;
        this.sprite.currentFrame = 0;
        this.sprite.addAnimation("Arrive", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0], 0.002, false);
        this.sprite.startAnimation("Arrive");
        this.sndArrive = new sound("sounds/warp-drive.wav", 0.2);
    }
    update(dt) {
        super.update(dt);

        if (!this.shoot) {
            this.sndArrive.play();
            let position = this.getShotPosition(50);
            let b = new Bullet(position.x, position.y, 0, 0.5, "Cruiser");
            this.lstBullets.push(b);
            this.shoot = true;
        } else {
            this.shootTimer += dt;
            if (this.shootTimer >= this.shootSpeed) {
                this.shootTimer = 0;
            }
        }
    }
}

class Ship extends Ennemy {
    constructor(pSprite, pType, pBulletList, pTarget) {
        super(pSprite, pType, pBulletList, pTarget);
        this.life = 2;
        this.type = pType;
        this.lstBullets = pBulletList;
        this.target = pTarget;
        this.speed = rnd(150, 300) / 100;
        this.invu = false;
        this.angle = 0;
        this.state = "left";
        this.shootSpeed = 5;
        this.hit = false;
        this.hitTimer = 0;
    }
    update(dt) {
        super.update(dt);

        switch (this.state) {
            case "left":
                this.sprite.x -= this.speed;
                if (this.sprite.x <= 50) {
                    this.state = "right";
                }
                break;
            case "right":
                this.sprite.x += this.speed;
                if (this.sprite.x >= 400) {
                    this.state = "left";
                }
                break;
            default:
                break;
        }

        this.sprite.y += this.speed;
        this.angle = angle(this.sprite.x, this.sprite.y, this.target.x, this.target.y);
        if (!this.shoot) {
            let position = this.getShotPosition(10);
            let vx = Math.cos(this.angle) * 10
            let vy = Math.sin(this.angle) * 10
            let b = new Bullet(position.x, position.y, vx, vy, "ship");
            this.lstBullets.push(b);
            this.shoot = true;
        } else {
            this.shootTimer += dt;
            if (this.shootTimer >= this.shootSpeed) {
                this.shoot = false;
                this.shootTimer = 0;
            }
        }
        if (this.hit) {
            this.sprite.currentFrame = 1;
            this.hitTimer += dt;
            if (this.hitTimer >= 0.2) {
                this.hit = false;
                this.sprite.currentFrame = 0;
                this.hitTimer = 0;
            }
        }
    }
}

class Laser extends Ennemy {
    constructor(pSprite, pType, pBulletList, pTarget) {
        super(pSprite, pType, pBulletList, pTarget);
        this.life = 800;
        this.type = pType;
        this.lstBullets = pBulletList;
        this.target = pTarget;
        this.speed = 1;
        this.invu = false;
        this.angle = 0;
        this.shootSpeed = 5;
        this.hit = false;
        this.hitTimer = 0;
        this.sprite.addAnimation("start", [0, 1, 2, 3], 0.5, true);
        this.sprite.startAnimation("start");
        this.imgEnnemyLaser1 = imageLoader.getImage("images/EnnemyLaser1.png");
        this.imgEnnemyLaser = imageLoader.getImage("images/EnnemyLaser.png");
    }
    update(dt) {
        super.update(dt);
        this.sprite.y += this.speed;

        if (!this.shoot) {
            let b = new Bullet(this.sprite.x + this.sprite.tileSize.x, this.sprite.y + this.sprite.tileSize.y / 2, 0, 1, "LaserH");
            this.lstBullets.push(b);
            this.shoot = true;
        }

        for (let index = this.lstBullets.length - 1; index >= 0; index -= 1) {
            let b = this.lstBullets[index];
            if (b.type == "LaserH" && b.collideWith(this.target.spriteHero) && !this.target.invu) {
                console.log("Je suis passé la");
                this.lstBullets.splice(index, 1);
                this.target.life -= 1;
                this.hit = true;
            }
        }




        if (this.hit) {
            this.sprite = new Sprite(this.imgEnnemyLaser1, this.sprite.x, this.sprite.y);
            this.sprite.setTileSheet(32, 80);
            //this.sprite.addAnimation("start", [0, 1, 2, 3], 0.5, true);
            //this.sprite.startAnimation("start");

            for (let index = this.lstBullets.length - 1; index >= 0; index -= 1) {
                let b = this.lstBullets[index];
                if (b.type == "LaserH") {
                    this.lstBullets.splice(index, 1);
                }
            }
            this.hitTimer += dt;
            if (this.hitTimer >= 3) {
                this.hit = false;
                this.shoot = false;
                this.hitTimer = 0;
            }
        } else {
            this.sprite = new Sprite(this.imgEnnemyLaser, this.sprite.x, this.sprite.y);
            this.sprite.setTileSheet(47.5, 80);
            //this.sprite.addAnimation("start", [0, 1, 2, 3], 0.5, true);
            //this.sprite.startAnimation("start");
        }

    }
}

class MotherShip extends Ennemy {
    constructor(pSprite, pType, pBulletList, pTarget) {
        super(pSprite, pType, pBulletList, pTarget);
        this.state = "getPos";
        this.lstBullets = pBulletList;
        this.type = pType;
        this.target = pTarget;
        this.invu = false;
        this.shootSpeed = 0.5;
        this.pos = rnd(50, 150);
        this.hit = false;
        this.life = 50;
    }
    update(dt) {
        super.update(dt);

        switch (this.state) {
            case "getPos":
                this.sprite.y += this.speed;
                if (this.sprite.y >= 100) {
                    this.state = "attack";
                }
                break;
            case "attack":

                let position = this.getShotPosition(20);
                if (!this.shoot) {
                    let b = new Bullet(position.x, position.y, rnd(-400, 400) / 100, +3, "motherShip");
                    this.lstBullets.push(b);
                    this.shoot = true;
                } else {
                    this.shootTimer += dt;
                    if (this.shootTimer >= this.shootSpeed) {
                        this.shoot = false;
                        this.shootTimer = 0;
                    }
                }
                break;

            default:
                break;


        }

        //this.sync();
    }
}

class MotherShip2 extends Ennemy {
    constructor(pSprite, pType, pBulletList, pTarget) {
        super(pSprite, pType, pBulletList, pTarget);
        this.state = "getPos";
        this.lstBullets = pBulletList;
        this.type = pType;
        this.target = pTarget;
        this.invu = false;
        this.shootSpeed = 0.5;
        this.pos = 150;
        this.hit = false;
        this.life = 100;
    }
    update(dt) {
        super.update(dt);

        switch (this.state) {
            case "getPos":
                this.sprite.currentFrame = 1;
                this.sprite.x += this.speed;
                if (this.sprite.x >= this.pos) {
                    this.state = "attack";
                }
                /*
                if (!this.shoot) {
                    let b = new Bullet(position.x, position.y, rnd(-400, 400) / 100, +3, "motherShip");
                    this.lstBullets.push(b);
                    this.shoot = true;
                } else {
                    this.shootTimer += dt;
                    if (this.shootTimer >= this.shootSpeed) {
                        this.shoot = false;
                        this.shootTimer = 0;
                    }
                }*/
                break;
            case "attack":
                this.sprite.currentFrame = 0;
                let position = this.getShotPosition(20);
                if (!this.shoot) {
                    let b = new Bullet(position.x, position.y, rnd(-400, 400) / 100, +3, "motherShip");
                    this.lstBullets.push(b);
                    this.shoot = true;
                } else {
                    this.shootTimer += dt;
                    if (this.shootTimer >= this.shootSpeed) {
                        this.shoot = false;
                        this.shootTimer = 0;
                    }
                }
                break;

            default:
                break;


        }

        //this.sync();
    }
}

class Boss1 extends Ennemy {
    constructor(pSprite, pType, pBulletList, pTarget) {
        super(pSprite, pType, pBulletList, pTarget);
        this.state = "getPos";
        this.lstBullets = pBulletList;
        this.type = pType;
        this.target = pTarget;
        this.angle = 0;
        this.shootSpeed = 0.2;
        this.laserPos = 0;
        this.pos = 10;
        this.hit = false;
        this.invu = true;
        this.life = 1200;
        this.lifeMax = 1200;
        this.imgEnergyBar = imageLoader.getImage("images/bossenergybar.png");
        this.energyBar = new Sprite(this.imgEnergyBar);
        this.energyBar.setTileSheet(600, 117);
        this.imgFeu = imageLoader.getImage("images/feu.png");
        this.feu = new Sprite(this.imgFeu, 150, 100);
        this.feu.setTileSheet(160, 160);
        this.feu.addAnimation("feu", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 0.1, true);
        this.feu.startAnimation('feu');
        this.feu2 = new Sprite(this.imgFeu, 300, 100);
        this.feu2.setTileSheet(160, 160);
        this.feu2.addAnimation("feu", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 0.1, true);
        this.feu2.startAnimation('feu');

    }
    update(dt) {
        super.update(dt);
        this.energyBar.update(dt);
        this.feu.update(dt);
        this.feu2.update(dt);

        switch (this.state) {
            case "getPos":
                this.sprite.y += this.speed;
                if (this.sprite.y >= this.pos) {
                    this.invu = false;
                    this.state = "attack";
                }
                break;
            case "attack":

                this.shootSpeed = 0.1;
                if (!this.shoot) {
                    let position = this.getShotPosition(20);
                    let b = new Bullet(position.x, position.y, rnd(-600, 600) / 100, rnd(100, 500) / 100, "motherShip");
                    this.lstBullets.push(b);
                    this.shoot = true;
                } else {
                    this.shootTimer += dt;
                    if (this.shootTimer >= this.shootSpeed) {
                        this.shoot = false;
                        this.shootTimer = 0;
                    }
                }
                if (this.life < 900 && this.life > 300) {
                    this.state = "attack2";
                }
                break;

            case "attack2":
                this.shootSpeed = 7;
                if (!this.shoot) {
                    let b = new Bullet(this.sprite.tileSize.x / 2, this.sprite.tileSize.y, 0, 5, "laserBeam");
                    this.lstBullets.push(b);
                    let a = new Bullet(110, 240, 0, 0, "preBeam");
                    let c = new Bullet(470, 240, 0, 0, "preBeam");
                    this.lstBullets.push(a);
                    this.lstBullets.push(c);
                } else {
                    let b = new Bullet(this.sprite.tileSize.x / 2, this.sprite.tileSize.y, 0, 0, "preBeam");
                    this.lstBullets.push(b);
                    let a = new Bullet(110, 240, 0, 10, "laserBeam");
                    let c = new Bullet(470, 240, 0, 10, "laserBeam");
                    this.lstBullets.push(a);
                    this.lstBullets.push(c);
                }


                this.shootTimer += dt;
                if (this.shoot && this.shootTimer >= this.shootSpeed) {
                    this.shoot = false;
                    this.shootTimer = 0;
                    for (let index = this.lstBullets.length - 1; index >= 0; index -= 1) {
                        let b = this.lstBullets[index];
                        if (b.type == "preBeam") {
                            this.lstBullets.splice(index, 1);
                        }
                    }
                }
                if (!this.shoot && this.shootTimer >= this.shootSpeed) {
                    this.shoot = true;
                    this.shootTimer = 0;
                    for (let index = this.lstBullets.length - 1; index >= 0; index -= 1) {
                        let b = this.lstBullets[index];
                        if (b.type == "preBeam") {
                            this.lstBullets.splice(index, 1);
                        }
                    }
                }

                if (this.life < 600) {
                    for (let index = this.lstBullets.length - 1; index >= 0; index -= 1) {
                        let b = this.lstBullets[index];
                        if (b.type == "preBeam") {
                            this.lstBullets.splice(index, 1);
                        }
                    }
                    this.state = "attack3";
                }
                break;

            case "attack3":
                this.angle = angle(this.sprite.x + 300, this.sprite.y + 60, this.target.x, this.target.y);
                this.shootSpeed = 3;
                if (!this.shoot) {
                    let position = this.getShotPosition(48);
                    let vx = Math.cos(this.angle) * 2
                    let vy = Math.sin(this.angle) * 2
                    for (let i = 5; i > 0; i--) {
                        let b = new Bullet(position.x, position.y, vx + (i - 2), vy + (i - 2), "arcBullet");
                        this.lstBullets.push(b);
                    }
                    this.shoot = true;
                } else {
                    this.shootTimer += dt;
                    if (this.shootTimer >= this.shootSpeed) {
                        this.shoot = false;
                        this.shootTimer = 0;
                    }
                }
                if (this.life < 300) {
                    this.state = "attack";
                }
                break;

            default:
                break;
        }
    }

    getLifeRatio() {
        return this.life / this.lifeMax;
    }

    draw(pCtx) {
        super.draw(pCtx);
        if (this.state != "getPos") {
            let ratio = this.getLifeRatio();
            pCtx.fillStyle = "rgb(255,255,255)";
            pCtx.fillRect(1, 50, 600, 50);
            pCtx.fillStyle = "rgb(0,255,0)";
            pCtx.fillRect(1, 50, 600 * ratio, 50);
            this.energyBar.draw(pCtx);
        }
        if (this.life < 900) {
            this.feu.draw(pCtx);
        }
        if (this.life < 600) {
            this.feu2.draw(pCtx);
        }

    }
}

class EnnemyWave {
    constructor(pSprite, pType, pNumber, pPendingDelay, pStartDistance, pShooter = false, pX, pY, pBulletList, pTarget) {
        this.EnnemyList = [];
        this.sprite = pSprite;
        this.type = pType;
        this.startDistance = pStartDistance;
        this.started = false;
        this.number = pNumber;
        this.shooter = pShooter;
        this.pendingDelay = pPendingDelay;
        this.x = pX;
        this.y = pY;
        this.lstBullets = pBulletList;
        this.target = pTarget;
    }

    addEnnemy(pEnnemy) {
        this.EnnemyList.push(pEnnemy);
    }

    update(dt) {
        for (let i = this.EnnemyList.length - 1; i >= 0; i -= 1) {
            let ennemy = this.EnnemyList[i];
            let ennemySprite = this.EnnemyList[i].sprite;

            if (ennemy.started == false) {
                ennemy.timer += dt;
                if (ennemy.timer >= ennemy.pendingDelay) {
                    console.log("un ennemy démarre");
                    ennemy.started = true;
                }
            }

            if (ennemy.started) {
                ennemy.update(dt);
                if (ennemy.sprite.y > canvas.height) {
                    console.log("suppression d'un sprite hors écran");
                    this.EnnemyList.splice(i, 1);
                }
            }
        }

    }

    draw(pCtx) {
        this.EnnemyList.forEach(ennemy => {
            ennemy.draw(pCtx);
        });
    }
}

class WavesManager {
    constructor() {
        this.wavesList = [];
        this.currentWave = null;
    }

    AddWave(pWave) {
        this.wavesList.push(pWave);
    }

    StopWave(pWave) {
        console.log("stop la vague précedente");
        let index = this.wavesList.indexOf(pWave);
        if (index != -1) {
            this.wavesList.splice(index, 1);
        }
    }
    StartWave(pWave) {
        console.log("Vague démarrée à " + pWave.startDistance);
        pWave.started = true;

        this.currentWave = pWave;

        for (let i = 0; i < pWave.number; i += 1) {

            let mySprite = new Sprite(pWave.sprite.img);
            Object.assign(mySprite, pWave.sprite);

            let ennemy
            switch (pWave.type) {
                case "Ship":
                    ennemy = new Ship(mySprite, pWave.type, pWave.lstBullets, pWave.target);
                    break;
                case "MotherShip":
                    ennemy = new MotherShip(mySprite, pWave.type, pWave.lstBullets, pWave.target);
                    break;
                case "MotherShip2":
                    ennemy = new MotherShip2(mySprite, pWave.type, pWave.lstBullets, pWave.target);
                    break;
                case "Cruiser":
                    ennemy = new Cruiser(mySprite, pWave.type, pWave.lstBullets, pWave.target);
                    break;
                case "Asteroid":
                    ennemy = new Asteroid(mySprite, pWave.type, pWave.lstBullets, pWave.target);
                    break;
                case "Boss1":
                    ennemy = new Boss1(mySprite, pWave.type, pWave.lstBullets, pWave.target);
                    break;
                case "Laser":
                    ennemy = new Laser(mySprite, pWave.type, pWave.lstBullets, pWave.target);
                    break;

                default:
                    break;
            }


            ennemy.sprite.x = pWave.x;
            ennemy.sprite.y = pWave.y;
            ennemy.pendingDelay = i * pWave.pendingDelay;
            pWave.addEnnemy(ennemy);
        }
    }

    update(dt, pDistance) {
        this.wavesList.forEach(wave => {
            if (pDistance >= wave.startDistance && !wave.started) {
                this.StartWave(wave);
            }
            if (wave.started) {
                wave.update(dt);
            }
        });

    }

    draw(pCtx) {
        this.wavesList.forEach(wave => {
            if (wave.started) {
                wave.draw(pCtx);
            }
        });
    }
}