

let gameReady = false;
let imageLoader = new ImageLoader();

let menu = new Menu();

let sceneJeu = new SceneJeu();
let Level2 = new level2();
let gameOver = new GameOver();

let keyboard = [];


function toucheEnfoncee(t) {
    t.preventDefault();
    if (keyboard[t.code] == false || keyboard[t.code] == null) {
        sceneJeu.keypressed(t.code);
    }
    keyboard[t.code] = true;
}

function toucheRelachee(t) {
    t.preventDefault();
    keyboard[t.code] = false;
}

function load() {

    // récupérer les fonctions HTML5 qui permettent d'écouter les évenements du clavier
    document.addEventListener("keydown", toucheEnfoncee, false);
    document.addEventListener("keyup", toucheRelachee, false);



    imageLoader.add("images/background.png");
    imageLoader.add("images/menu.png");
    imageLoader.add("images/HeroMod1.png");
    imageLoader.add("images/HeroMod2.png");
    imageLoader.add("images/particles.png");
    imageLoader.add("images/shotHero.png");
    imageLoader.add("images/shotHero0.png");
    imageLoader.add("images/EnnemyShip1.png");
    imageLoader.add("images/EnnemyDestroyer.png");
    imageLoader.add("images/Ennemycruiser1.png");
    imageLoader.add("images/EnnemyMothership.png");
    imageLoader.add("images/EnnemyMothership1.png");
    imageLoader.add("images/EnnemyCruiser.png");
    imageLoader.add("images/EnnemyLaser.png");
    imageLoader.add("images/EnnemyLaser1.png");
    imageLoader.add("images/exp64.png");
    imageLoader.add("images/exp2.png");
    imageLoader.add("images/shotShip.png");
    imageLoader.add("images/shotMotherShip.png");
    imageLoader.add("images/Asteroids.png");
    imageLoader.add("images/BossShotCharge.png");
    imageLoader.add("images/PowerUp.png");
    imageLoader.add("images/HeroCanon.png");
    imageLoader.add("images/CanonShot.png");
    imageLoader.add("images/boss.png");
    imageLoader.add("images/bossenergybar.png");
    imageLoader.add("images/arcBullet.png");
    imageLoader.add("images/laserBeam.png");
    imageLoader.add("images/laserH.png");
    imageLoader.add("images/GameOverNew.png");
    imageLoader.add("images/GameOverQuit.png");
    imageLoader.add("images/preBeam.png");
    imageLoader.add("images/victory.png");
    imageLoader.add("images/levl2BG.png");
    imageLoader.add("images/Ennemy2Mothership.png");
    imageLoader.add("images/feu.png");


    imageLoader.start(startGame);
    menu.load(imageLoader);


}

function startGame() {
    console.log("le jeu a demarré")
    gameReady = true;

    //menu.load(imageLoader);
    sceneJeu.load(imageLoader);
    Level2.load(imageLoader);
    gameOver.load(imageLoader);

}

function update(dt) {

    if (menu.start == false) {
        menu.keyboard = keyboard;
        menu.update(dt);
    }
    if (menu.start && sceneJeu.GameOver == false && !sceneJeu.switchMap) {
        sceneJeu.keyboard = keyboard;
        sceneJeu.update(dt);
    }
    if (sceneJeu.switchMap) {
        Level2.keyboard = keyboard;
        Level2.update(dt);
    }
    if (menu.start && (sceneJeu.GameOver || Level2.GameOver)) {
        gameOver.keyboard = keyboard;
        gameOver.update(dt);
        if (gameOver.newOK) {
            sceneJeu = new SceneJeu();
            sceneJeu.load(imageLoader);
            Level2 = new level2();
            Level2.load(imageLoader);
            gameOver.newOK = false;
        }
        if (gameOver.quitOK) {
            menu.start = false;
            sceneJeu = new SceneJeu();
            sceneJeu.load(imageLoader);
            Level2 = new level2();
            Level2.load(imageLoader);
            gameOver.quitOK = false;
        }
    }

}

function draw(pCtx) {

    if (menu.start == false) {
        menu.draw(pCtx);
    }
    if (menu.start && sceneJeu.GameOver == false && !sceneJeu.switchMap) {
        sceneJeu.draw(pCtx);
    }
    if (sceneJeu.switchMap) {
        Level2.draw(pCtx);
    }
    if (menu.start && (sceneJeu.GameOver || Level2.GameOver)) {
        gameOver.draw(pCtx);
    }
}