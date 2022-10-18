
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d");
let interval;

let derniereUpdate = Date.now();

function run() {
    let maintenant = Date.now();
    let dt = (maintenant - derniereUpdate) / 1000;
    derniereUpdate = maintenant;
    update(dt);
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw(ctx);


}

function init() {
    interval = setInterval(run, 1000 / 60);
    ctx.imageSmoothingEnabled = false;
    ctx.msimageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    load();
}

init();