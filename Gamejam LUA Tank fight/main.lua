-- Débogueur Visual Studio Code tomblind.local-lua-debugger-vscode
if pcall(require, "lldebugger") then
    require("lldebugger").start()
end

-- Cette ligne permet d'afficher des traces dans la console pendant l'éxécution
---@diagnostic disable-next-line: undefined-field
io.stdout:setvbuf("no")

-- préparation des listes pour charger la map (liste dans le cas ou on fait plusieurs map)
local map = {}

map[1] = {}
map[1].tiled = "carte"
map[1].tiledSet = "tilesheet"
map[1].nom = "map1"

-- préparation des variables de "map actuelle" pour charger le tileset et le data (tableau)
local mapActuelle = {}

mapActuelle.num = 1
mapActuelle.data = {}
mapActuelle.dataTileSet = {}
mapActuelle.imgTileSheet = {}


local Cheatcode = false

local GameState = {}
GameState.menu = false
GameState.play = false
GameState.boss = false
GameState.gameover = false
GameState.map1 = false
GameState.map2 = false
GameState.clear = false
GameState.win = false
GameState.timer = 0

local score = 0

local bg = nil

local Tank = {}
Tank.x = 20
Tank.y = 20
Tank.angle = 0
Tank.vx = 100
Tank.vy = 100
Tank.img = nil
Tank.HP = 3
Tank.shoot = false
Tank.touche = false
Tank.invu = 0
Tank.timer = 0
Tank.oldx = 0
Tank.oldy = 0

local ListeTirs = {}
local ListeTirsBoss = {}
local imgObus = nil
local imgObusBoss = nil
local imgNmi = nil
local font = nil
local imgExplosion = {}
local imgExplosionBoss = {}
local imgtrainee = nil
local imgbarils = nil
local imgBoss = {}
local imgHPBoss = nil

local S_tir = nil
local M_Gameplay = nil

local ListeExplosion = {}
Explosion = {}
Explosion.currentimg = 1
Explosion.x = 0
Explosion.y = 0

local ListeExplosionBoss = {}
local ExplosionBoss = {}
ExplosionBoss.currentimg = 1
ExplosionBoss.x = 0
ExplosionBoss.y = 0

local ListeBarils = {}
local Baril = {}
Baril.x = 0
Baril.y = 0

local ListeNmi = {}
local ListeBoss = {}

local States = {}
States.fix = "fixe"
States.move = "mouvement"
States.attack = "attaque"
States.total = "mouvement+attaque"
States.boss = "boss"

Largeur = love.graphics.getWidth()
Hauteur = love.graphics.getHeight()


function CheckCollision(x1, y1, w1, h1, x2, y2, w2, h2)
    return x1 < x2 + w2 and
        x2 < x1 + w1 and
        y1 < y2 + h2 and
        y2 < y1 + h1
end

function math.angle(x1, y1, x2, y2) return math.atan2(y2 - y1, x2 - x1) end

function math.dist(x1, y1, x2, y2) return ((x2 - x1) ^ 2 + (y2 - y1) ^ 2) ^ 0.5 end

function NouveauTir(xTir, yTir, angle)
    local Obus = {}
    Obus.x = xTir
    Obus.y = yTir
    Obus.angle = angle
    Obus.speed = 3
    table.insert(ListeTirs, Obus)
    love.audio.play(S_tir)
end

function NouveauTirBoss(xTir, yTir, angle)
    local ObusBoss = {}
    ObusBoss.x = xTir
    ObusBoss.y = yTir
    ObusBoss.angle = angle
    ObusBoss.speed = 3
    table.insert(ListeTirsBoss, ObusBoss)
    love.audio.play(S_tir)
end

function NouveauBaril(xBaril, YBaril)
    local Baril = {}
    Baril.x = xBaril
    Baril.y = YBaril
    table.insert(ListeBarils, Baril)
end

function NouveauNmi(xNmi, yNmi, stateNmi)
    local Nmi = {}
    Nmi.x = xNmi
    Nmi.y = yNmi
    Nmi.angle = math.rad(math.random(0, 360))
    Nmi.speed = 30
    Nmi.vx = 50
    Nmi.vy = 50
    Nmi.state = stateNmi
    Nmi.shoot = true
    Nmi.timer = 0
    Nmi.oldx = 0
    Nmi.oldy = 0
    Nmi.baril = false
    table.insert(ListeNmi, Nmi)
    if math.dist(Tank.x, Tank.y, Nmi.x, Nmi.y) < 100 then
        Nmi.x = Nmi.x + 100
        Nmi.y = Nmi.y + 100
    end
end

function NouvelleExplosion(xExplo, yExplo)
    local Explosion = {}
    Explosion.currentimg = 1
    Explosion.x = xExplo
    Explosion.y = yExplo
    table.insert(ListeExplosion, Explosion)
end

function NouvelleExplosionBoss(xExploBoss, yExploBoss)
    local ExplosionBoss = {}
    ExplosionBoss.currentimg = 1
    ExplosionBoss.x = xExploBoss
    ExplosionBoss.y = yExploBoss
    table.insert(ListeExplosionBoss, ExplosionBoss)
end

function NouveauBoss(xBoss, yBoss)
    local Boss = {}
    Boss.currentimg = 1
    Boss.x = xBoss
    Boss.y = yBoss
    Boss.angle = math.rad(math.random(0.360))
    Boss.vx = 20
    Boss.vy = 20
    Boss.HP = 6
    Boss.touche = false
    Boss.shoot = true
    Boss.timer = 0
    Boss.invu = 0
    table.insert(ListeBoss, Boss)
end

function love.load()

    GameState.menu = true
    M_Gameplay = love.audio.newSource("M_Gameplay.mp3", "stream")
    S_tir = love.audio.newSource("S_tir.wav", "static")
    bg = love.graphics.newImage("Background sable.png", nil)
    imgBoss[1] = love.graphics.newImage("tankboss0.png", nil)
    imgBoss[2] = love.graphics.newImage("tankboss1.png", nil)
    imgExplosion[1] = love.graphics.newImage("ExpTank0.png", nil)
    imgExplosion[2] = love.graphics.newImage("ExpTank1.png", nil)
    imgExplosion[3] = love.graphics.newImage("ExpTank2.png", nil)
    imgExplosionBoss[1] = love.graphics.newImage("ExpBoss0.png", nil)
    imgExplosionBoss[2] = love.graphics.newImage("ExpBoss1.png", nil)
    imgExplosionBoss[3] = love.graphics.newImage("ExpBoss2.png", nil)
    imgtrainee = love.graphics.newImage("trainee.png", nil)
    imgbarils = love.graphics.newImage("Barilsx3.png", nil)
    imgHPBoss = love.graphics.newImage("HP.png", nil)

    font = love.graphics.newFont("font.otf")
    imgNmi = love.graphics.newImage("Tank e.png", nil)
    Tank.img = love.graphics.newImage("Tank00.png", nil)
    imgObus = love.graphics.newImage("obus1.png", nil)
    imgObusBoss = love.graphics.newImage("doubleObus.png", nil)
    NouveauNmi(math.random(50, love.graphics.getWidth() - imgNmi:getWidth() * 2),
        math.random(50, love.graphics.getWidth() - imgNmi:getWidth() * 2), States.fix)
    Tank.x = 30
    Tank.y = 70

    -- Map N° 2 Avec TILED !
    -- require et récupération des données de base de la map
    mapActuelle.data = require(map[mapActuelle.num].tiled)
    mapActuelle.dataTileSet = require(map[mapActuelle.num].tiledSet)

    -- Je prend l'image .png et je la récupère dans une variable love.graphics
    TileSheetName = mapActuelle.dataTileSet.image
    mapActuelle.imgTileSheet = love.graphics.newImage(TileSheetName, nil)
    mapActuelle.quads = {}
    -- Je découpe l'image en Quad pour avoir les tiles correspondantes avec les numéros
    local ts = mapActuelle.dataTileSet
    local xAct, yAct = 0, 0
    mapActuelle.quads[0] = nil
    for q = 1, ts.tilecount do
        mapActuelle.quads[q] = love.graphics.newQuad(xAct, yAct, ts.tilewidth, ts.tileheight, ts.imagewidth,
            ts.imageheight)
        xAct = xAct + ts.tilewidth
        if xAct >= ts.imagewidth then
            xAct = 0
            yAct = yAct + ts.tileheight
        end
    end
end

function love.update(dt)

    if GameState.map2 and #ListeBoss <= 0 and #ListeNmi <= 0 then
        GameState.win = true
    end


    if GameState.menu then
        Tank.x = 30
        Tank.y = 70
        Tank.angle = 0
        Tank.HP = 3
        score = 0
        for n = #ListeNmi, 1, -1 do
            table.remove(ListeNmi, n)
        end
        for b = #ListeBoss, 1, -1 do
            table.remove(ListeBoss, b)
        end
        NouveauNmi(math.random(0, love.graphics.getWidth() - imgNmi:getWidth() * 2),
            math.random(0, love.graphics.getHeight() - imgNmi:getHeight() * 2), States.fix)
        while #ListeBarils < 6 do
            NouveauBaril(math.random(0, (Largeur - imgbarils:getWidth())),
                math.random(50, Hauteur - imgbarils:getHeight()))
        end
    end

    if GameState.clear then
        for layer = 2, #mapActuelle.data.layers do
            local tile = 1
            for l = 1, mapActuelle.data.height do

                for c = 1, mapActuelle.data.width do

                    local id = mapActuelle.data.layers[layer].data[tile]
                    local texQuad = mapActuelle.quads[id]
                    if texQuad ~= nil then
                        NouveauBaril(
                            (c - 1) * mapActuelle.data.tilewidth,
                            (l - 1) * mapActuelle.data.tileheight
                        )
                    end
                    tile = tile + 1
                end
            end
        end
    end

    if GameState.play then
        if GameState.clear then
            GameState.timer = GameState.timer + dt
            if GameState.timer >= 2 then
                GameState.clear = false
                GameState.timer = 0
            end
        end
        -- gestion du temps entre 2 tirs
        if Tank.shoot then
            Tank.timer = Tank.timer + dt
            if Tank.timer >= 1 then
                Tank.shoot = false
                Tank.timer = 0
            end
        end
        for n = #ListeNmi, 1, -1 do
            local Nmi = ListeNmi[n]
            if Nmi.shoot then
                Nmi.timer = Nmi.timer + dt
                if Nmi.timer >= 5 then
                    Nmi.shoot = false
                    Nmi.timer = 0
                end
            end

        end
        for n = #ListeBoss, 1, -1 do
            local Boss = ListeBoss[n]
            if Boss.shoot then
                Boss.timer = Boss.timer + dt
                if Boss.timer >= 5 then
                    Boss.shoot = false
                    Boss.timer = 0
                end
            end
        end
        -- gestion de la periode invulnérable entre 2 dégats
        if Tank.touche then
            Tank.invu = Tank.invu + dt
            if Tank.invu >= 2 then
                Tank.touche = false
                Tank.invu = 0
            end
        end
        for n = #ListeBoss, 1, -1 do
            local Boss = ListeBoss[n]
            if Boss.touche then
                Boss.invu = Boss.invu + dt
                if Boss.invu >= 2 then
                    Boss.touche = false
                    Boss.invu = 0
                end
            end
        end



        -- gestion du déplacement du tank
        local angle_rad = math.rad(Tank.angle)
        local xspeed = math.cos(angle_rad) * (Tank.vx) * dt
        local yspeed = math.sin(angle_rad) * (Tank.vy) * dt
        if love.keyboard.isDown("up") then
            Tank.oldx = Tank.x
            Tank.oldy = Tank.y
            if Tank.x + Tank.img:getWidth() < 0 then
                Tank.x = Largeur - 40
            end
            if Tank.x - Tank.img:getWidth() > Largeur then
                Tank.x = 0 + 40
            end
            if Tank.y + Tank.img:getHeight() < 70 then
                Tank.y = Hauteur - 30
            end
            if Tank.y - Tank.img:getHeight() > Hauteur then
                Tank.y = 0 + 60
            end
            Tank.y = Tank.y + yspeed
            Tank.x = Tank.x + xspeed
            for n = 1, #ListeBarils do
                local Baril = ListeBarils[n]
                if CheckCollision(Tank.x, Tank.y, Tank.img:getWidth(), Tank.img:getHeight(), Baril.x, Baril.y,
                    imgbarils:getWidth(), imgbarils:getHeight()) then
                    Tank.x = Tank.oldx
                    Tank.y = Tank.oldy
                end
            end

        end

        if love.keyboard.isDown("down") then
            Tank.oldx = Tank.x
            Tank.oldy = Tank.y
            if Tank.x + Tank.img:getWidth() < 0 then
                Tank.x = Largeur - 40
            end
            if Tank.x - Tank.img:getWidth() > Largeur then
                Tank.x = 0 + 40
            end
            if Tank.y + Tank.img:getHeight() < 70 then
                Tank.y = Hauteur - 40
            end
            if Tank.y - Tank.img:getHeight() > Hauteur then
                Tank.y = 0 + 40
            end
            Tank.y = Tank.y - yspeed
            Tank.x = Tank.x - xspeed
            for n = 1, #ListeBarils do
                local Baril = ListeBarils[n]
                if CheckCollision(Tank.x, Tank.y, Tank.img:getWidth(), Tank.img:getHeight(), Baril.x, Baril.y,
                    imgbarils:getWidth(), imgbarils:getHeight()) then
                    Tank.x = Tank.oldx
                    Tank.y = Tank.oldy
                end
            end
        end

        if love.keyboard.isDown("right") then
            Tank.angle = Tank.angle + 90 * dt
            if Tank.angle >= 360 then
                Tank.angle = 0
            end
        end
        if love.keyboard.isDown("left") then
            Tank.angle = Tank.angle - 90 * dt
            if Tank.angle <= 0 then
                Tank.angle = 360
            end
        end

        -- gestion des explosions
        for n = #ListeExplosion, 1, -1 do
            local Explosion = ListeExplosion[n]
            Explosion.currentimg = Explosion.currentimg + (2 * dt)
            if math.floor(Explosion.currentimg) > 3 then
                table.remove(ListeExplosion, n)
            end
        end

        for n = #ListeExplosionBoss, 1, -1 do
            local ExplosionBoss = ListeExplosionBoss[n]
            ExplosionBoss.currentimg = ExplosionBoss.currentimg + (1 * dt)
            if math.floor(ExplosionBoss.currentimg) > 3 then
                table.remove(ListeExplosionBoss, n)
            end
        end

        -- gestion des actions du boss
        for n = #ListeBoss, 1, -1 do
            local Boss = ListeBoss[n]
            local xspeed = math.cos(Boss.angle) * (Boss.vx) * dt
            local yspeed = math.sin(Boss.angle) * (Boss.vy) * dt
            Boss.currentimg = Boss.currentimg + (1 * dt)
            if math.floor(Boss.currentimg) > 2 then
                Boss.currentimg = 1
            end
            if GameState.boss then
                Boss.angle = math.rad(180)
                Boss.x = Boss.x + xspeed
                Boss.y = Boss.y + yspeed
                if Boss.x < Largeur - 60 then
                    GameState.boss = false
                end
            else
                Boss.angle = math.angle(Boss.x, Boss.y, Tank.x, Tank.y)
                if math.dist(Boss.x, Boss.y, Tank.x, Tank.y) > 150 then
                    Boss.x = Boss.x + xspeed
                    Boss.y = Boss.y + yspeed
                end
                if Boss.shoot == false then
                    NouveauTirBoss(Boss.x + 50 * math.cos(Boss.angle), Boss.y + 50 * math.sin(Boss.angle), Boss.angle)
                    Boss.shoot = true
                end
            end

        end

        -- gestion de ce que fait l'ennemi en fonction de son état

        for n = #ListeNmi, 1, -1 do
            local Nmi = ListeNmi[n]
            local oldxNmi = Nmi.x
            local oldyNmi = Nmi.y
            local xspeed = math.cos(Nmi.angle) * (Nmi.vx) * dt
            local yspeed = math.sin(Nmi.angle) * (Nmi.vy) * dt
            if Nmi.state == States.move then
                for b = 1, #ListeBarils do
                    local Baril = ListeBarils[b]
                    if CheckCollision(Nmi.x, Nmi.y, imgNmi:getWidth(), imgNmi:getHeight(), Baril.x, Baril.y,
                        imgbarils:getWidth(), imgbarils:getHeight()) then
                        Nmi.baril = true
                    end
                end
                if Nmi.x + imgNmi:getWidth() < 0 then
                    Nmi.x = Largeur - 40

                elseif Nmi.x - imgNmi:getWidth() > Largeur then
                    Nmi.x = 0 + 40

                elseif Nmi.y + imgNmi:getHeight() < 60 then
                    Nmi.y = Hauteur - 40

                elseif Nmi.y - imgNmi:getHeight() > Hauteur then
                    Nmi.y = 0 + 40
                end
                if Nmi.baril then
                    Nmi.x = Nmi.x - xspeed
                    Nmi.y = Nmi.y - yspeed
                    Nmi.angle = Nmi.angle + math.rad(90)
                    Nmi.baril = false

                else
                    Nmi.x = Nmi.x + xspeed
                    Nmi.y = Nmi.y + yspeed
                end



            elseif Nmi.state == States.attack then
                Nmi.angle = math.angle(Nmi.x, Nmi.y, Tank.x, Tank.y)
                if Nmi.x + imgNmi:getWidth() < 0 then
                    Nmi.x = Largeur - 40
                end
                if Nmi.x - imgNmi:getWidth() > Largeur then
                    Nmi.x = 0 + 40
                end
                if Nmi.y + imgNmi:getHeight() < 60 then
                    Nmi.y = Hauteur - 40
                end
                if Nmi.y - imgNmi:getHeight() > Hauteur then
                    Nmi.y = 0 + 40
                end
                if Nmi.shoot == false then
                    NouveauTir(Nmi.x + 50 * math.cos(Nmi.angle), Nmi.y + 50 * math.sin(Nmi.angle), Nmi.angle)
                    Nmi.shoot = true
                end

            elseif Nmi.state == States.total then
                Nmi.angle = math.angle(Nmi.x, Nmi.y, Tank.x, Tank.y)
                for b = 1, #ListeBarils do
                    local Baril = ListeBarils[b]
                    if CheckCollision(Nmi.x, Nmi.y, imgNmi:getWidth(), imgNmi:getHeight(), Baril.x, Baril.y,
                        imgbarils:getWidth(), imgbarils:getHeight()) then
                        Nmi.baril = true
                    end
                end
                if Nmi.x + imgNmi:getWidth() < 0 then
                    Nmi.x = Largeur - 40

                elseif Nmi.x - imgNmi:getWidth() > Largeur then
                    Nmi.x = 0 + 40

                elseif Nmi.y + imgNmi:getHeight() < 60 then
                    Nmi.y = Hauteur - 40

                elseif Nmi.y - imgNmi:getHeight() > Hauteur then
                    Nmi.y = 0 + 40
                end
                if Nmi.shoot == false then
                    NouveauTir(Nmi.x + 50 * math.cos(Nmi.angle), Nmi.y + 50 * math.sin(Nmi.angle), Nmi.angle)
                    Nmi.shoot = true
                end
                if Nmi.baril then
                    Nmi.x = Nmi.x - xspeed
                    Nmi.y = Nmi.y - yspeed
                    Nmi.baril = false
                else
                    Nmi.x = Nmi.x + ((math.cos(Nmi.angle)) * Nmi.vx * dt)
                    Nmi.y = Nmi.y + ((math.sin(Nmi.angle)) * Nmi.vy * dt)
                end

            elseif Nmi.state == States.fix then
                if Nmi.x + imgNmi:getWidth() < 0 then
                    Nmi.x = Largeur - 40
                end
                if Nmi.x - imgNmi:getWidth() > Largeur then
                    Nmi.x = 0 + 40
                end
                if Nmi.y + imgNmi:getHeight() < 60 then
                    Nmi.y = Hauteur - 40
                end
                if Nmi.y - imgNmi:getHeight() > Hauteur then
                    Nmi.y = 0 + 40
                end
            end
        end


        -- gestion des collisions entre tirs boss et decors + hero
        for t = #ListeTirsBoss, 1, -1 do
            local ObusBoss = ListeTirsBoss[t]
            ObusBoss.x = ObusBoss.x + (ObusBoss.speed * math.cos(ObusBoss.angle))
            ObusBoss.y = ObusBoss.y + (ObusBoss.speed * math.sin(ObusBoss.angle))
            if ObusBoss.x < 0 or ObusBoss.x > Largeur or ObusBoss.y < 0 or ObusBoss.y > Hauteur then
                table.remove(ListeTirsBoss, t)
            end
            for n = #ListeBarils, 1, -1 do
                Baril = ListeBarils[n]
                if CheckCollision(ObusBoss.x, ObusBoss.y, imgObusBoss:getWidth(), imgObusBoss:getHeight(), Baril.x,
                    Baril.y, imgbarils:getWidth(), imgbarils:getHeight()) then
                    table.remove(ListeTirsBoss, t)
                end
            end
            if CheckCollision(ObusBoss.x, ObusBoss.y, imgObusBoss:getWidth(), imgObusBoss:getHeight(), Tank.x, Tank.y,
                Tank.img:getWidth(), Tank.img:getHeight()) and Tank.touche == false then
                table.remove(ListeTirsBoss, t)
                Tank.HP = Tank.HP - 1
                Tank.touche = true
                if Cheatcode then
                    Tank.HP = 3
                elseif Tank.HP == 0 then
                    NouvelleExplosion(Tank.x, Tank.y)
                    Tank.shoot = 0
                    GameState.boss = false
                    GameState.play = false
                    GameState.gameover = true
                    love.audio.stop()
                end
            end
        end


        -- gestion des collisions entre tirs et ennemis
        for t = #ListeTirs, 1, -1 do
            local Obus = ListeTirs[t]
            Obus.x = Obus.x + (Obus.speed * math.cos(Obus.angle))
            Obus.y = Obus.y + (Obus.speed * math.sin(Obus.angle))
            if Obus.x < 0 or Obus.x > Largeur or Obus.y < 0 or Obus.y > Hauteur then
                table.remove(ListeTirs, t)
            end
            for b = #ListeBoss, 1, -1 do
                local Boss = ListeBoss[b]
                if CheckCollision(Obus.x, Obus.y, imgObus:getWidth(), imgObus:getHeight(), Boss.x, Boss.y,
                    imgBoss[math.floor(Boss.currentimg)]:getWidth(), imgBoss[math.floor(Boss.currentimg)]:getHeight())
                    and Boss.touche == false and GameState.boss == false then
                    table.remove(ListeTirs, t)
                    Boss.touche = true
                    Boss.HP = Boss.HP - 1
                end
                if Boss.HP <= 0 then
                    if GameState.map1 then
                        NouvelleExplosionBoss(Boss.x, Boss.y)
                        table.remove(ListeBoss, b)
                        score = score + 50
                        GameState.map1 = false
                        GameState.map2 = true
                        GameState.clear = true
                        for ba = #ListeBarils, 1, -1 do
                            table.remove(ListeBarils, ba)
                        end
                        Tank.x = 30
                        Tank.y = 70
                        Tank.angle = 0
                        Tank.HP = 3
                        score = 0
                        for n = #ListeNmi, 1, -1 do
                            table.remove(ListeNmi, n)
                        end
                        for b = #ListeBoss, 1, -1 do
                            table.remove(ListeBoss, b)
                        end
                        NouveauNmi(math.random(0, love.graphics.getWidth() - imgNmi:getWidth() * 2),
                            math.random(0, love.graphics.getHeight() - imgNmi:getHeight() * 2), States.fix)
                        NouveauNmi(math.random(0, love.graphics.getWidth() - imgNmi:getWidth() * 2),
                            math.random(0, love.graphics.getHeight() - imgNmi:getHeight() * 2), States.fix)
                    elseif GameState.map2 then
                        NouvelleExplosionBoss(Boss.x, Boss.y)
                        table.remove(ListeBoss, b)
                        score = score + 50
                    end
                end
            end
            for n = #ListeBarils, 1, -1 do
                local Baril = ListeBarils[n]
                if CheckCollision(Obus.x, Obus.y, imgObus:getWidth(), imgObus:getHeight(), Baril.x, Baril.y,
                    imgbarils:getWidth(), imgbarils:getHeight()) then
                    table.remove(ListeTirs, t)
                end
            end
            for n = #ListeNmi, 1, -1 do
                local Nmi = ListeNmi[n]
                if CheckCollision(Obus.x, Obus.y, imgObus:getWidth(), imgObus:getHeight(), Nmi.x, Nmi.y,
                    imgNmi:getWidth(), imgNmi:getHeight()) then
                    table.remove(ListeTirs, t)
                    NouvelleExplosion(Nmi.x, Nmi.y)
                    table.remove(ListeNmi, n)
                    score = score + 50
                    if score < 50 then
                        NouveauNmi(math.random(0, love.graphics.getWidth() - imgNmi:getWidth() * 2),
                            math.random(60, love.graphics.getHeight() - imgNmi:getHeight() * 2), States.fix)
                    elseif score >= 50 and score < 100 then
                        NouveauNmi(math.random(0, love.graphics.getWidth() - imgNmi:getWidth() * 2),
                            math.random(60, love.graphics.getHeight() - imgNmi:getHeight() * 2), States.move)
                    elseif score >= 100 and score < 150 then
                        NouveauNmi(math.random(0, love.graphics.getWidth() - imgNmi:getWidth() * 2),
                            math.random(60, love.graphics.getHeight() - imgNmi:getHeight() * 2), States.attack)
                    elseif score >= 150 and score < 250 then
                        NouveauNmi(math.random(0, love.graphics.getWidth() - imgNmi:getWidth() * 2),
                            math.random(60, love.graphics.getHeight() - imgNmi:getHeight() * 2), States.total)
                    elseif score >= 250 then
                        NouveauBoss(love.graphics.getWidth() + 100, love.graphics.getHeight() / 2)
                        GameState.boss = true
                    end
                end
            end
            -- gestion des collisions entre tirs et Tank Hero
            if CheckCollision(Obus.x, Obus.y, imgObus:getWidth(), imgObus:getHeight(), Tank.x, Tank.y,
                Tank.img:getWidth(), Tank.img:getHeight()) and Tank.touche == false then
                table.remove(ListeTirs, t)
                Tank.HP = Tank.HP - 1
                Tank.touche = true
                if Cheatcode then
                    Tank.HP = 3
                elseif Tank.HP == 0 then
                    NouvelleExplosion(Tank.x, Tank.y)
                    Tank.shoot = false
                    GameState.boss = false
                    GameState.play = false
                    GameState.gameover = true
                    love.audio.stop()
                end
            end
        end
        for n = #ListeNmi, 1, -1 do
            local Nmi = ListeNmi[n]
            if CheckCollision(Tank.x, Tank.y, Tank.img:getWidth(), Tank.img:getHeight(), Nmi.x, Nmi.y, imgNmi:getWidth()
                , imgNmi:getHeight()) and Tank.touche == false then
                Tank.HP = Tank.HP - 1
                Tank.touche = true
                if Cheatcode then
                    Tank.HP = 3
                elseif Tank.HP == 0 then
                    NouvelleExplosion(Tank.x, Tank.y)
                    Tank.shoot = false
                    GameState.boss = false
                    GameState.play = false
                    GameState.gameover = true
                    love.audio.stop()
                end
            end
        end
    end
end

function love.draw()

    if GameState.menu then
        love.graphics.print("Ceci est le menu principal", font, 300, 0)
        love.graphics.print("Press SPACE to start a new game", font, 280, 300)
    end

    if GameState.play or GameState.gameover then
        if GameState.map1 then
            -- affichage du background
            love.graphics.draw(bg, 0, 0)

            -- affichage des barils
            for n = 1, #ListeBarils do
                local Baril = ListeBarils[n]
                love.graphics.draw(imgbarils, Baril.x, Baril.y, 0, 1, 1, imgbarils:getWidth() / 2,
                    imgbarils:getHeight() / 2)
            end
            -- affichage de la map TILED une fois que le jeu est en map 2
            -- on anticipe si jamais on a plusieurs layers
        elseif GameState.map2 then
            local layer
            local tile
            local c, l
            for layer = 1, #mapActuelle.data.layers do
                tile = 1
                for l = 1, mapActuelle.data.height do

                    for c = 1, mapActuelle.data.width do

                        local id = mapActuelle.data.layers[layer].data[tile]
                        local texQuad = mapActuelle.quads[id]
                        if texQuad ~= nil then
                            love.graphics.draw(
                                mapActuelle.imgTileSheet,
                                texQuad,
                                (c - 1) * mapActuelle.data.tilewidth,
                                (l - 1) * mapActuelle.data.tileheight
                            )
                        end
                        tile = tile + 1
                    end
                end
            end
        end

        -- affichage du tank
        if Tank.HP > 0 then
            love.graphics.draw(
                Tank.img,
                Tank.x,
                Tank.y,
                math.rad(Tank.angle),
                1,
                1,
                Tank.img:getWidth() / 2,
                Tank.img:getHeight() / 2
            )
        end
        -- affichage des tirs
        for t = 1, #ListeTirs do
            local Obus = ListeTirs[t]
            local direction = math.rad(Tank.angle)
            love.graphics.draw(imgObus, Obus.x, Obus.y, Obus.angle, 1, 1, imgObus:getWidth() / 2, imgObus:getHeight() / 2)
        end
        -- affichage des ennemis
        for n = 1, #ListeNmi do
            local Nmi = ListeNmi[n]
            love.graphics.draw(imgNmi, Nmi.x, Nmi.y, Nmi.angle, 1, 1, imgNmi:getWidth() / 2, imgNmi:getHeight() / 2)
        end
        -- affichage du boss
        for b = 1, #ListeBoss do
            local Boss = ListeBoss[b]
            love.graphics.draw(imgBoss[math.floor(Boss.currentimg)], Boss.x, Boss.y, Boss.angle, 1, 1,
                imgBoss[math.floor(Boss.currentimg)]:getWidth() / 2, imgBoss[math.floor(Boss.currentimg)]:getHeight() / 2)
            love.graphics.print("HP : ", font, 500, 0)
            for n = 1, Boss.HP do
                love.graphics.draw(imgHPBoss, 550 + (n * 32), 0)
            end
        end
        -- affichage des tirs du boss
        for t = 1, #ListeTirsBoss do
            local ObusBoss = ListeTirsBoss[t]
            love.graphics.draw(imgObusBoss, ObusBoss.x, ObusBoss.y, ObusBoss.angle, 1, 1, imgObusBoss:getWidth() / 2,
                imgObusBoss:getHeight() / 2)
        end
        love.graphics.print("SCORE : " .. tostring(score), font, 0, 0)
        love.graphics.print("HP : ", font, 200, 0)
        if GameState.clear then
            love.graphics.print("STAGE CLEAR !!", font, Largeur / 2, Hauteur / 2)
        end
        -- affichage du nombre de HP
        for n = 1, Tank.HP do
            love.graphics.draw(Tank.img, 300 + (n * 40), 0)
        end

        -- affichage des explosions
        for n = 1, #ListeExplosion do
            local Explosion = ListeExplosion[n]
            love.graphics.draw(imgExplosion[math.floor(Explosion.currentimg)], Explosion.x, Explosion.y)
        end
        for n = 1, #ListeExplosionBoss do
            local ExplosionBoss = ListeExplosionBoss[n]
            love.graphics.draw(imgExplosionBoss[math.floor(ExplosionBoss.currentimg)], ExplosionBoss.x, ExplosionBoss.y)
        end
        if GameState.win then
            love.graphics.print("CONGRATULATIONS !!", font, 350, 300)
        end
        if GameState.gameover then
            love.graphics.print("GAME OVER", font, 350, 300)
            love.graphics.print("Press P", font, 350, 350)
        end
    end
end

function love.keypressed(key)
    if key == "space" and Tank.shoot == false then
        if (GameState.play or GameState.boss) then
            NouveauTir(Tank.x + math.cos(math.rad(Tank.angle)) * 50, Tank.y + math.sin(math.rad(Tank.angle)) * 50,
                math.rad(Tank.angle))
            Tank.shoot = true
        elseif GameState.menu then
            GameState.play = true
            GameState.map1 = true
            love.audio.play(M_Gameplay)
            GameState.menu = false
        end
    end
    if key == "p" then
        if GameState.gameover then
            GameState.menu = true
            GameState.gameover = false
        end
    end
end
