using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using SharpDX.Direct3D9;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet_Module_3_Thibault_Vivier
{

    public interface IBalle
    {
        bool fireBall();

        Rectangle GetBoundingBox();
    }
    public class Balle : Sprite, IBalle
    {

        public bool Start = false;
        public bool Lost = false;
        IRaquette raquette;
        Vector2 raquettePos;
        Rectangle raquetteBox;
        int raquetteWidth;
        IGameplay igameplay;
        List<Brick> lstBrick;
        bool fire = false;
        Texture2D MyTexture;

        public Balle(Texture2D pTexture) : base(pTexture)
        {

            
            //raquettePos = raquette.GetPos();
            //raquetteBox = raquette.GetBoundingBox();
            
            vitesse = new Vector2(-5, -5);
            sprite = "balle";
            MyTexture = pTexture;
            
            //score = igameplay.getScore();
            
            ServiceLocator.AddService<IBalle>(this);



        }

        public void InversDirection()
        {
            vitesse.Y = vitesse.Y * (-1);
        }

        public override void Update()
        {
            base.Update();
            raquette = ServiceLocator.GetService<IRaquette>();
            igameplay = ServiceLocator.GetService<IGameplay>();
            raquettePos = raquette.GetPos();
            raquetteBox = raquette.GetBoundingBox();
            raquetteWidth = raquette.GetWidth();
            lstBrick = igameplay.getBricks();
            if (!Start)
            {
                SetPosition(raquettePos.X, raquettePos.Y - Height);

            }
            if (Mouse.GetState().LeftButton == ButtonState.Pressed)
            {
                Start = true;
                
            }
            if (Start)
            {
                

                if(position.X < 0 || position.X + Width > screen.Width-200)
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
                    //vitesse = new Vector2(-5, -5);
                }

                if (boundingBox.Intersects(raquetteBox)) 
                {
                    float posRatio = position.X - raquettePos.X;
                    float ratio = posRatio / raquetteWidth;

                    vitesse.X = 10 * ratio - 5;

                    vitesse.Y = vitesse.Y * (-1);
                    SetPosition(position.X, raquettePos.Y - Height);
                
                }
                for (int b = lstBrick.Count - 1; b >= 0; b--)
                {
                    if (lstBrick[b].boundingBox.Intersects(NextPositionX()))
                    {
                        if (!lstBrick[b].invu)
                        {
                            lstBrick[b].remove = true;
                            igameplay.getScore(10);
                        }
                        
                        if (lstBrick[b].invu)
                        {
                            if (fire)
                            {
                                lstBrick[b].remove = true;
                                igameplay.getScore(10);
                            }
                        }
                        
                        if (!fire)
                        {
                            position = position-vitesse;
                            InverseVitesseX();
                        }
                        
                        
                    }
                    if (lstBrick[b].boundingBox.Intersects(NextPositionY()))
                    {
                        if (!lstBrick[b].invu)
                        {
                            lstBrick[b].remove = true;
                            igameplay.getScore(10);
                        }

                        if (lstBrick[b].invu)
                        {
                            if (fire)
                            {
                                lstBrick[b].remove = true;
                                igameplay.getScore(10);
                            }
                        }

                        if (!fire)
                        {
                            position = position - vitesse;
                            InverseVitesseY();
                        }


                    }


                    }
                }
            if (fire)
            {
                MyTexture = content.Load<Texture2D>("balleFire");
            }
        }

        public override void Draw()
        {
            batch.Draw(MyTexture, position, Color.White);
        }

            public bool fireBall()
        {
            fire = true;
            
            return fire;
        }
        public Rectangle GetBoundingBox()
        {
            return boundingBox;
        }

    }
}
