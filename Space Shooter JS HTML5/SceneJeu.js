class SceneJeu {
    constructor() {
        this.keyboard = null;
        this.imageLoader = null;
        this.imgBackground = null;
        this.hero = null;
        this.endMap = false;
        this.switchMap = false;
        this.GameOver = false;
        this.wavesManager = new WavesManager();
        this.lstBullets = [];
        this.lstPowerUp = [];
        this.lstExp = [];
        this.musicStarted = false;
    }

    load(pImageLoader) {

        //chargement de l'image loader, 
        this.imageLoader = pImageLoader;
        this.imgBackground = this.imageLoader.getImage("images/background.png");
        this.background = new ScrollingBackground(this.imgBackground);
        this.background.speed = 1;
        this.hero = new Hero(300, 800);
        this.hitHero = this.hero.life;

        this.sndShoot = new sound("sounds/heroShot.wav", 0.05);
        this.sndHurt = new sound("sounds/hurt.ogg", 0.2);
        this.sndExplosion = new sound("sounds/explosion.wav", 0.2);
        this.sndExplosion5 = new sound("sounds/Explosion5.m4a", 0.2);
        this.sndPowerUp = new sound("sounds/powerUp.wav", 0.5);
        this.sndMusic = new sound("sounds/musique.mp3", 0.2);
        this.sndSuccess = new sound("sounds/success.mp3", 0.3);


        let imgAsteroids = this.imageLoader.getImage("images/Asteroids.png");
        let spriteAsteroids = new Sprite(imgAsteroids);
        spriteAsteroids.setTileSheet(50, 50);

        let imgVictory = this.imageLoader.getImage("images/victory.png");
        this.spriteVictory = new Sprite(imgVictory);
        this.spriteVictory.setTileSheet(400, 334);
        this.spriteVictory.x = 100;
        this.spriteVictory.y = 300;

        let imgEnnemyShip = this.imageLoader.getImage("images/EnnemyShip1.png");
        let spriteEnnemyShip = new Sprite(imgEnnemyShip);
        spriteEnnemyShip.setTileSheet(60, 60);

        let imgEnnemyMothership = this.imageLoader.getImage("images/EnnemyMothership1.png");
        let spriteEnnemyMothership = new Sprite(imgEnnemyMothership);
        spriteEnnemyMothership.setTileSheet(250, 250);

        let imgEnnemyCruiser = this.imageLoader.getImage("images/Ennemycruiser1.png");
        let spriteEnnemyCruiser = new Sprite(imgEnnemyCruiser);
        spriteEnnemyCruiser.setTileSheet(182, 232);

        let imgEnnemyLaser = this.imageLoader.getImage("images/EnnemyLaser.png");
        let spriteEnnemyLaser = new Sprite(imgEnnemyLaser);
        spriteEnnemyLaser.setTileSheet(47.5, 80);

        let imgBoss1 = this.imageLoader.getImage("images/boss.png");
        let spriteBoss1 = new Sprite(imgBoss1);
        spriteBoss1.setTileSheet(600, 339);



        this.wavesManager.AddWave(new EnnemyWave(spriteEnnemyLaser, "Laser", 1, 2, 3300, true, 10, -60, this.lstBullets, this.hero));
        this.wavesManager.AddWave(new EnnemyWave(spriteEnnemyLaser, "Laser", 1, 2, 5000, true, 10, -60, this.lstBullets, this.hero));
        this.wavesManager.AddWave(new EnnemyWave(spriteEnnemyShip, "Ship", 5, 2, 4300, true, 32, -60, this.lstBullets, this.hero));
        this.wavesManager.AddWave(new EnnemyWave(spriteEnnemyShip, "Ship", 8, 2, 3500, true, 500, -60, this.lstBullets, this.hero));
        this.wavesManager.AddWave(new EnnemyWave(spriteEnnemyMothership, "MotherShip", 1, 25, 4000, false, 200, -250, this.lstBullets, this.hero));
        this.wavesManager.AddWave(new EnnemyWave(spriteEnnemyShip, "Ship", 10, 2, 7000, true, 500, -60, this.lstBullets, this.hero));
        this.wavesManager.AddWave(new EnnemyWave(spriteEnnemyCruiser, "Cruiser", 1, 2, 5200, true, 90, 60, this.lstBullets, this.hero));
        this.wavesManager.AddWave(new EnnemyWave(spriteEnnemyCruiser, "Cruiser", 1, 2, 5300, true, 300, 60, this.lstBullets, this.hero));

        //création champs d'asteroids
        for (let index = 9; index >= 0; index--) {
            this.wavesManager.AddWave(new EnnemyWave(spriteAsteroids, "Asteroid", rnd(5, 10), rnd(300, 900) / 100, (6000 + rnd(-15, 15)), true, (20 + (60 * index)), -60, this.lstBullets, this.hero));
        }

        //création du boss 1
        this.wavesManager.AddWave(new EnnemyWave(spriteBoss1, "Boss1", 1, 0, 8000, true, 0, -350, this.lstBullets, this.hero));



    }

    update(dt) {
        if (this.musicStarted == false) {
            this.sndMusic.sound.loop = true;
            this.sndMusic.play();
            this.musicStarted = true;
        }
        this.background.update(dt);
        this.wavesManager.update(dt, this.background.distance);
        //this.particleEmitter.update(dt);

        //gestion update des explosions 
        for (let index = this.lstExp.length - 1; index >= 0; index -= 1) {
            let exp = this.lstExp[index];
            exp.update(dt);
        }

        //gestion des Power Up
        for (let index = this.lstPowerUp.length - 1; index >= 0; index -= 1) {
            let pu = this.lstPowerUp[index];
            pu.update(dt);
            if (pu.outOfScreen(canvas.width, canvas.height)) {
                this.lstPowerUp.splice(index, 1);
            }
            if (pu.collideWith(this.hero.spriteHero)) {
                this.sndPowerUp.play();
                if (pu.type == "Mod") {
                    this.hero.getShip2();
                    this.hero.life = 5;
                    this.hitHero = this.hero.life;
                }
                if (pu.type == "Attack") {
                    if (this.hero.canonCount == 0) {
                        this.hero.canon1 = new Canon(this.hero.x, this.hero.y, "Right", this.hero);
                    }
                    if (this.hero.canonCount == 1) {
                        this.hero.canon2 = new Canon(this.hero.x, this.hero.y, "Left", this.hero);
                    }
                    this.hero.canonCount += 1;
                }


                this.lstPowerUp.splice(index, 1);
            }
        }
        if (this.background.distance >= 3500 && this.background.distance <= 3505 && this.lstPowerUp.length < 1) {
            let pu = new PowerUp(300, -20, "Attack");
            this.lstPowerUp.push(pu);
        }
        if (this.background.distance >= 5500 && this.background.distance <= 5505 && this.lstPowerUp.length < 1) {
            let pu = new PowerUp(300, -20, "Attack");
            this.lstPowerUp.push(pu);
        }
        if (this.background.distance >= 4800 && this.background.distance <= 4805 && this.lstPowerUp.length < 1) {
            let pu = new PowerUp(300, -20, "Mod");
            this.lstPowerUp.push(pu);
        }


        // activation du son de dégat lorsque le hero perd de la vie

        if (this.hero.life < this.hitHero) {
            this.sndHurt.play();
            this.hitHero = this.hero.life;
        }


        // gestion des bullets et collisions avec les ennemis et avec le hero
        for (let index = this.lstBullets.length - 1; index >= 0; index -= 1) {
            let b = this.lstBullets[index];
            b.update(dt);
            if (b.outOfScreen(canvas.width, canvas.height)) {
                this.lstBullets.splice(index, 1);
                console.log("bullet sortie de l'écran");
            } else {
                if (b.collideWith(this.hero.spriteHero) && !this.hero.invu && !b.friendly && b.type != "LaserH") {
                    this.hero.life -= 1;
                    this.lstBullets.splice(index, 1);
                    this.hero.invu = true;
                }
                if (this.wavesManager.wavesList != null && b.friendly) {
                    let lstWaves = this.wavesManager.wavesList;
                    for (let indexWaves = lstWaves.length - 1; indexWaves >= 0; indexWaves -= 1) {
                        let wave = lstWaves[indexWaves];
                        let lstEnnemy = wave.EnnemyList;
                        for (let indexEnnemy = lstEnnemy.length - 1; indexEnnemy >= 0; indexEnnemy -= 1) {
                            let a = lstEnnemy[indexEnnemy];
                            if (b.collideWith(a.sprite) && a.invu == false) {
                                this.lstBullets.splice(index, 1);
                                a.life -= this.hero.damage;
                                a.hit = true;
                                if (a.life <= 0 && a.type != "Boss1") {
                                    this.sndExplosion5.play();
                                    console.log("Je viens de fumer le boss!");
                                    let exp = new Explosion(a.sprite.x, a.sprite.y, a.type);
                                    lstEnnemy.splice(indexEnnemy, 1);
                                    this.lstExp.push(exp);
                                }
                                if (a.type == "Boss1") {
                                    if (a.life < 900 && a.life > 890 || a.life < 600 && a.life > 590 || a.life < 300 && a.life > 290) {
                                        for (let life = 10; life >= 0; life -= 1) {
                                            this.sndExplosion.play();
                                            let exp = new Explosion(a.sprite.x + rnd(0, 600), a.sprite.y + rnd(0, 300), "Ship");
                                            this.lstExp.push(exp);
                                            if (this.lstPowerUp.length < 1) {
                                                let pu = new PowerUp(300, 220, "Mod");
                                                this.lstPowerUp.push(pu);
                                            }
                                        }
                                    }
                                    if (a.life < 5) {
                                        for (let final = 40; final >= 0; final--) {
                                            this.sndExplosion.play();
                                            let exp = new Explosion(a.sprite.x + rnd(0, 600), a.sprite.y + rnd(0, 350), "exp130");
                                            this.lstExp.push(exp);
                                            lstEnnemy.splice(indexEnnemy, 1);
                                            this.endMap = true;
                                        }
                                    }

                                }
                                if (a.type == "Cruiser" || a.type == "MotherShip") {
                                    if (a.life < 5) {
                                        this.sndExplosion.play();
                                        let exp = new Explosion(a.sprite.x + rnd(0, 150), a.sprite.y + rnd(0, 150), "exp130");
                                        this.lstExp.push(exp);
                                    }
                                }

                            }
                        }
                    }
                }
            }
        }

        // gestions des animations d'explosions terminées 

        this.lstExp.forEach(exp => {
            if (exp.currentAnimation.end) {
                this.lstExp.splice(exp, 1);
            }
        });

        //gestion des mouvements et tirs Hero
        if (this.endMap == false) {


            if (this.keyboard["ArrowDown"] == true && this.hero.y + this.hero.spriteHero.tileSize.y < canvas.height) {
                this.hero.spriteHero.currentFrame = 0;
                this.hero.y += this.hero.speed;
            }
            if (this.keyboard["ArrowUp"] == true && this.hero.y > 0) {
                this.hero.spriteHero.currentFrame = 1;
                this.hero.y -= this.hero.speed;
            }
            if (this.keyboard["ArrowLeft"] == true && this.hero.x > 0) {
                this.hero.x -= this.hero.speed;
            }
            if (this.keyboard["ArrowRight"] == true && this.hero.x + this.hero.spriteHero.tileSize.x < canvas.width) {
                this.hero.x += this.hero.speed;
            }
            if (this.keyboard["Space"] == true && !this.hero.shoot) {
                this.sndShoot.play();
                let position = this.hero.getShotPosition(13)
                let b = new Bullet(position.x, position.y, 0, -10, this.hero.mod);
                this.lstBullets.push(b);
                this.hero.shoot = true;
                if (this.hero.shoot2) {
                    let b2 = new Bullet(position.x - 30, position.y, 0, -10, this.hero.mod);
                    this.lstBullets.push(b2);
                }

            }
            if (this.hero.canon1 != null && !this.hero.canon1.shoot) {
                let canonBullet = new Bullet(this.hero.canon1.x, this.hero.canon1.y - 30, 0, -5, "Canon");
                this.lstBullets.push(canonBullet);
                this.hero.canon1.shoot = true;
            }
            if (this.hero.canon2 != null && !this.hero.canon2.shoot) {
                let canonBullet = new Bullet(this.hero.canon2.x, this.hero.canon2.y - 30, 0, -5, "Canon");
                this.lstBullets.push(canonBullet);
                this.hero.canon2.shoot = true;
            }
            if (this.hero.life <= 0) {
                this.GameOver = true;
                this.sndMusic.stop();
            }
        } else {
            this.sndMusic.stop();
            this.sndSuccess.play();
            if (this.hero.x > 320) {
                this.hero.x -= this.hero.speed;
            }
            else if (this.hero.x < 310) {
                this.hero.x += this.hero.speed;
            } else {
                if (this.hero.y > -100) {
                    this.hero.y -= 10;
                } else {
                    this.switchMap = true;
                }

            }
        }
        this.hero.update(dt);
    }

    draw(pCtx) {
        pCtx.save();
        pCtx.scale(1, 1);
        //dessine le fond qui scroll
        this.background.draw(pCtx);
        //this.particleEmitter.draw(pCtx);
        this.wavesManager.draw(pCtx);
        this.hero.draw(pCtx);

        this.lstBullets.forEach(b => {
            b.draw(pCtx);

        });
        this.lstExp.forEach(exp => {
            exp.draw(pCtx);

        });
        this.lstPowerUp.forEach(pu => {
            pu.draw(pCtx);

        });
        if (this.endMap && !this.switchMap) {
            this.spriteVictory.draw(pCtx);
        }

        pCtx.restore();
    }

    keypressed(pKey) {
        /*if (pKey == "Space") {
            let position = this.hero.getShotPosition(13)
            let b = new Bullet(position.x, position.y, 0, -2, this.hero.mod);
            this.lstBullets.push(b);

        }*/
    }
}