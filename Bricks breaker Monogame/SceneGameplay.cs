using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using Microsoft.Xna.Framework.Media;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TiledSharp;

namespace Projet_Module_3_Thibault_Vivier
{

    public interface IGameplay
    {
        List<Brick> getBricks();
        int getScore(int p);
        bool SetMultiBall();
        List<Sprite> getSprites();


    }
        internal class SceneGameplay : Scene, IGameplay
    {

        TmxMap map;
        Texture2D tileset;
        Sprite infos;
        SpriteFont FontInfos;
        Raquette raquette;
        Balle balle;
        Shoot shoot;
        Nain nain;
        Random rnd;
        List<Brick> lstBrick;
        List<Sprite> lstSprites;
        ServiceScene ChangeScene;
        Song MyMusic;
        

        bool lastState;
        bool setMultiBall;

        int tileWidth;
        int tileHeight;
        int mapWidth;
        int mapHeight;
        int tilesetLines;
        int tilesetColumns;
        int score;
        int scoreTotal;
        int bonusScore = 20;
        int ibonus = 1;
        int currentLevel = 1;
        int ballCount = 0;
        string Shighscore;
        int highscore;

        bool firstCycle = false;

        public SceneGameplay ()
        {
            ChangeScene = ServiceLocator.GetService<ServiceScene>();
        }

      

        private void LoadLevelT(int pNumber)
        {
            map = new TmxMap("Content/Maps/map" + pNumber + ".tmx");
            tileset = content.Load<Texture2D>(map.Tilesets[0].Name.ToString());
            tileWidth = map.Tilesets[0].TileWidth;
            tileHeight = map.Tilesets[0].TileHeight;
            mapWidth = map.Width;
            mapHeight = map.Height;
            tilesetLines = tileset.Width / tileWidth;
            tilesetColumns = tileset.Height / tileHeight;
            Texture2D texBrick;
            Texture2D[] texBrickAll = new Texture2D[100];
            for (int t = 1; t <= 100; t++)
            {
                texBrickAll[t - 1] = content.Load<Texture2D>("brick" + t);
            }
            int nbLayers = map.Layers.Count;
            int line;
            int column;

      
                line = 0;
                column = 0;

                for (int i = 0; i < map.Layers[0].Tiles.Count; i++)
                {
                    int gid = map.Layers[0].Tiles[i].Gid;

                    if (gid != 0)
                    {
                        int tileFrame = gid - 1;
                        int tilesetColumn = tileFrame % tilesetColumns;
                        int tilesetLine = (int)Math.Floor((double)tileFrame / (double)tilesetColumns);

                        float x = column * tileWidth;
                        float y = line * tileHeight;

                        Rectangle tilesetRec = new Rectangle(tileWidth * tilesetColumn, tileHeight * tilesetLine, tileWidth, tileHeight);

                        texBrick = texBrickAll[tileFrame];
                    if (gid == 43 || gid == 22)
                    {
                        BrickInvu MyBrick = new BrickInvu(texBrick);
                        MyBrick.SetPosition(x, y);
                        lstBrick.Add(MyBrick);
                        Debug.WriteLine("j'ai crée une brique invu");
                    }
                    else
                    {
                        Brick MyBrick = new Brick(texBrick);
                        MyBrick.SetPosition(x, y);
                        lstBrick.Add(MyBrick);
                    }
                        
                    }
                    column++;
                    if (column == mapWidth)
                    {
                        column = 0;
                        line++;
                    }
                }
                if (map.ObjectGroups.Count !=0)
            {
                for (int j = 0; j < map.ObjectGroups[0].Objects.Count; j++)
                {
                    double posX = map.ObjectGroups[0].Objects[j].X;
                    double posY = map.ObjectGroups[0].Objects[j].Y;
                    Nain MyNain = new Nain(content.Load<Texture2D>("NainCome"));
                    lstSprites.Add(MyNain);
                    MyNain.SetPosition((float)posX, (float)posY);
                }
            }

            MyMusic = content.Load<Song>("Mlevel" + pNumber);

        }

        private void NextLevel()
        {
            scoreTotal = scoreTotal + score;
            score = 0;
            bonusScore = 0;
            ibonus = 0;
            currentLevel++;
            Load();
        }

        private void NewBonus(float pX, float pY)
        {
            Random rnd = new Random();
            int bonusType = rnd.Next(0, 5);
            Debug.WriteLine(bonusType);
            if (bonusType == 0)
            {
                Bonus bonus = new Bonus(content.Load<Texture2D>("BonusShoot"));
                bonus.type = 0;
                lstSprites.Add(bonus);
                bonus.SetPosition(pX, pY);
            }
            if (bonusType == 1)
            {
                Bonus bonus = new Bonus(content.Load<Texture2D>("BonusSmall"));
                bonus.type = 1;
                lstSprites.Add(bonus);
                bonus.SetPosition(pX, pY);
            }
            if (bonusType == 2)
            {
                Bonus bonus = new Bonus(content.Load<Texture2D>("BonusBig"));
                bonus.type = 2;
                lstSprites.Add(bonus);
                bonus.SetPosition(pX, pY);
            }
            if (bonusType == 3)
            {
                Bonus bonus = new Bonus(content.Load<Texture2D>("BonusFire"));
                bonus.type = 3;
                lstSprites.Add(bonus);
                bonus.SetPosition(pX, pY);
            }
            if (bonusType == 4)
            {
                Bonus bonus = new Bonus(content.Load<Texture2D>("BonusMulti"));
                bonus.type = 4;
                lstSprites.Add(bonus);
                bonus.SetPosition(pX, pY);
            }
            
        }
        public void multiBall()
        {
            Debug.WriteLine("J'ai ajouté une balle");
            Balle newBalle = new Balle(content.Load<Texture2D>("balle"));
            newBalle.SetPosition(raquette.position.X, raquette.position.Y - newBalle.Height);
            lstSprites.Add(newBalle);
            setMultiBall = false;
        }

         private void ChangeRaquetteSmall()
         {
            Vector2 OldPos = raquette.position;
            raquette = new Raquette(content.Load<Texture2D>("raquetteP"));
            raquette.SetPosition(OldPos.X, OldPos.Y);
            raquette.Small = false;
         }
        private void ChangeRaquetteBig()
        {
            Vector2 OldPos = raquette.position;
            raquette = new Raquette(content.Load<Texture2D>("raquetteB"));
            raquette.SetPosition(OldPos.X, OldPos.Y);
            raquette.Big = false;
        }

        public override void Load()
        {
            base.Load();

            firstCycle = false;
            ServiceLocator.AddService<IGameplay>(this);
           
            Debug.WriteLine(highscore);
            // initialisation des bricks et des textures 
            infos = new Sprite (content.Load<Texture2D>("infos"));
            infos.SetPosition(screen.Width-200, 0);
            FontInfos = content.Load<SpriteFont>("PixelFont");
            lstBrick = new List<Brick>();
            lstSprites = new List<Sprite>();
            rnd = new Random();

            // initialisation de la map
            LoadLevelT(currentLevel);
            

            // initialisation de la raquette
            raquette = new Raquette(content.Load<Texture2D>("raquette"));
            raquette.SetPosition(screen.Width/2 - (raquette.Width/2), screen.Height - raquette.Height);

            


            // initialisation de la balle
            balle = new Balle(content.Load<Texture2D>("balle"));
            lstSprites.Add(balle);
            balle.SetPosition(raquette.position.X, raquette.position.Y - balle.Height);

        }

        public override void Update()
        {
            //départ music
            if (!firstCycle)
            {
                MediaPlayer.Volume = 0.1f;
                MediaPlayer.IsRepeating = true;
                MediaPlayer.Play(MyMusic);
                firstCycle = true;
            }
                


            if (score > bonusScore)
            {
                NewBonus(rnd.Next(50,1500), 100);
                Debug.WriteLine("j'ai crée un bonus");
                bonusScore += ibonus * 50;
                ibonus++;
            }

            if (setMultiBall)
            {
                multiBall();
            }

            // update de la raquette en fonction du bonus de taille

            raquette.Update();
            if (raquette.Small)
            {
                ChangeRaquetteSmall();
            }
            if (raquette.Big)
            {
                ChangeRaquetteBig();
            }

            //tir de la raquette
            if (raquette.Shoot)
            {
                if (Mouse.GetState().LeftButton == ButtonState.Pressed && lastState == false)
                { 
                    shoot = new Shoot(content.Load<Texture2D>("Shoot"));
                    shoot.SetPosition(raquette.position.X, raquette.position.Y);
                    lstSprites.Add(shoot);
                    lastState = true;
                }
                if (Mouse.GetState().LeftButton == ButtonState.Released && lastState == true)
                {
                    lastState = false;  
                }
                    
            }


            // parcours des sprites et suppressions 
            for (int i = lstSprites.Count - 1; i >= 0; i--)
            {
                lstSprites[i].Update();
                
                if (lstSprites[i].remove)
                {
                    lstSprites.Remove(lstSprites[i]);
                }
            }


            // parcourir les brick de la liste et suppression de celle qui sont touchées
            for (int b = lstBrick.Count - 1; b >= 0; b--)
            {
                lstBrick[b].Update();

                if (lstBrick[b].remove)
                {
                    lstBrick.Remove(lstBrick[b]);
                }
            }


            // passage au niveau suivant
            int count = 0;
            for (int b = lstBrick.Count - 1; b >= 0; b--)
            {
                
                if (!lstBrick[b].invu)
                    count++;
            }
            if (count == 0)
            {
                NextLevel();
            }

            // perte de toutes les balles
            ballCount = 0;
            for (int i = lstSprites.Count-1; i>=0; i--)
            {

                if (lstSprites[i].sprite == "balle")
                { 
                    ballCount++;
                }
            }
           
            if (ballCount == 0)
            {
                Shighscore = File.ReadAllText("C:\\Users\\VIVIER Thibault\\Desktop\\formation dev JV\\Module 3 C# Monogame\\Projet Module 3 Thibault Vivier\\Content\\HighScore.txt");
                highscore = Int32.Parse(Shighscore);
                if (scoreTotal ==0)
                {
                    scoreTotal = score;
                }
                if (scoreTotal > highscore)
                {
                    string SscoreTotal = scoreTotal.ToString();
                    File.WriteAllTextAsync("C:\\Users\\VIVIER Thibault\\Desktop\\formation dev JV\\Module 3 C# Monogame\\Projet Module 3 Thibault Vivier\\Content\\HighScore.txt", SscoreTotal);
                }
               
                MediaPlayer.Stop();
                ChangeScene.GoToGameover();
            }

            }

        public override void Draw()
        {
            base.Draw();

            raquette.Draw();

            foreach (var b in lstBrick)
            {
                b.Draw();
            }
            foreach (var item in lstSprites)
            {
                item.Draw();
            }
            infos.Draw();
            batch.DrawString(FontInfos, ("Score : " + score), new Vector2(1650, 250), Color.Black);
            batch.DrawString(FontInfos, ("ScoreTotal : " + scoreTotal), new Vector2(1620, 300), Color.Black);
            batch.DrawString(FontInfos, ("Level : " + currentLevel), new Vector2(1650, 350), Color.Black);            
        }

        public int getScore(int p)
        {
            score += p;
            return score;
        }

        public List<Brick> getBricks()
        {
            return lstBrick;
        }

        public List<Sprite> getSprites()
        {
            return lstSprites;
        }

        public bool SetMultiBall()
        {
            setMultiBall = true;
            return setMultiBall;
        }

    }
}
