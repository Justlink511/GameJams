using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet_Module_3_Thibault_Vivier
{
    public interface INain
    {
        int GetFlower();

        void AddFlower();

    }
    public class Nain : Sprite, INain
    {
        string mode = "Come";
        IRaquette raquette;
        IGameplay gameplay;
        IBalle balle;
        Rectangle balleBox;
        Rectangle raquetteBox;
        Texture2D myTexture;
        List<Brick> lstBrick;
        List<Sprite> lstSprites;
        Flower MyFlower;
        int raquetteWidth;
        bool flowerOn;
        bool onBrick = false;
        Vector2 raquettePos;
        int countFlower = 0;
        int rebound = 0;
        public Nain(Texture2D pTexture) : base (pTexture)
        {
            //mode = "Come";
            sprite = "nain";
            vitesse = new Vector2(0, 2);
            myTexture = pTexture;
            //lstFlower = new List<Flower>();
            gameplay = ServiceLocator.GetService<IGameplay>();
            lstSprites = gameplay.getSprites();
            ServiceLocator.AddService<INain>(this);
            MyFlower = new Flower(content.Load<Texture2D>("flower"));


        }

        public void AddFlower()
        {
            
            MyFlower.SetPosition(position.X, position.Y - MyFlower.Height);
            MyFlower.setAngle();
            flowerOn = true;
            //countFlower += 1;
            //lstSprites.Add(MyFlower);
        }

        public override void Update()
        {
            base.Update();
            raquette = ServiceLocator.GetService<IRaquette>();
            raquetteBox = raquette.GetBoundingBox();
            raquetteWidth = raquette.GetWidth();
            raquettePos = raquette.GetPos();
            gameplay = ServiceLocator.GetService<IGameplay>();
            balle = ServiceLocator.GetService<IBalle>();
            balleBox = balle.GetBoundingBox();
            lstBrick = gameplay.getBricks();
            lstSprites = gameplay.getSprites();

            switch (mode)
            {
                case "Come":
                    {
                        myTexture = content.Load<Texture2D>("NainCome");
                        for (int i = lstBrick.Count - 1; i >= 0; i--)
                        {
                            if (boundingBox.Intersects(lstBrick[i].boundingBox))
                            {
                                onBrick = true;
                                Debug.WriteLine("je passe en mode attack");
                                vitesse = new Vector2(0, 0);
                                mode = "Attack";
                            }
                        }
                    }
                    break;
                case "Attack":
                    {
                        if (flowerOn == false)
                        {
                            AddFlower();
                        }
                        MyFlower.Update();
                        myTexture = content.Load<Texture2D>("NainAttack");
                        onBrick = false;
                        for (int i = lstBrick.Count - 1; i >= 0; i--)
                        {
                            if (boundingBox.Intersects(lstBrick[i].boundingBox))
                            {
                                if (boundingBox.Intersects(balleBox))
                                {
                                    mode = "Fall";
                                    Debug.WriteLine("Je passe en mode FALL");
                                    onBrick = false;
                                }
                                onBrick = true;
                            } 
                        }
                        if (!onBrick)
                        {
                                mode = "Come";
                                vitesse = new Vector2(0, 2);

                        }

                        if (MyFlower.remove)
                        {
                            flowerOn = false;
                            MyFlower.remove = false;
                        }



                        /*if(countFlower == 0)
                        {
                            AddFlower();
                        }*/
                        
                    }
                    break;
                case "Fall":
                    {
                        myTexture = content.Load<Texture2D>("NainFall");
                        vitesse += new Vector2(0, 0.02f);
                        if (boundingBox.Intersects(raquetteBox))
                        {
                            Vector2 vitesseRebond = vitesse;
                            float posRatio = position.X - raquettePos.X;
                            float ratio = posRatio / raquetteWidth;
                            vitesseRebond.X = 8 * ratio;
                            vitesseRebond.Y = (vitesseRebond.Y) * (-1);
                            vitesse = vitesseRebond;
                            SetPosition(position.X, position.Y - 20);
                            gameplay.getScore(50 * rebound);
                            rebound++;
                            // prevoir un système qui génère une gravité pour faire rebondir le Nain sur la raquette
                            // il faut un rebond avec un angle comme la balle
                        }
                        if (rebound >= 4)
                        {
                            gameplay.getScore(200);
                            rebound = 0;
                            remove = true;
                        }

                        if (position.X < 0 || position.X + Width > screen.Width - 200)
                        {
                            vitesse.X = vitesse.X * (-1);
                        }
                        if (position.Y < 0)
                        {
                            vitesse.Y = vitesse.Y * (-1);
                        }
                        if (position.Y > screen.Height)
                        {
                            remove = true;
                            
                        }
                    }
                    break;

                default:
                    break;
            }

        }

        public override void Draw()
        {
            batch.Draw(myTexture, position, Color.White);
            if (mode == "Attack" )
            {
                MyFlower.Draw();
            }
            /*if (lstFlower != null)
            {
                for (int i = lstFlower.Count - 1; i >= 0; i--)
                {
                    lstFlower[i].Draw();
                }
            }*/
            
        }

        public int GetFlower()
        {
            countFlower = 0;
            return countFlower;
        }

    }
}
