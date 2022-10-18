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
    internal class Bonus : Sprite
    {

        Random rnd;
        public int type;
        public IRaquette raquette;
        public IGameplay gameplay;
        public IBalle balle;

        public Bonus(Texture2D pTexture) : base(pTexture)
        {

            rnd = new Random();
            //type = rnd.Next(0,5);
            //type = 1;
            //Debug.WriteLine(type);
            vitesse = new Vector2(0, 3);
            raquette = ServiceLocator.GetService<IRaquette>();
            gameplay = ServiceLocator.GetService<IGameplay>();
            balle = ServiceLocator.GetService<IBalle>();
        }


        public override void Update()
        {
            base.Update();

            switch(type)
            { 
                case 0:
                    if (boundingBox.Intersects(raquette.GetBoundingBox()))
                    {
                        if(raquette.GetShoot())
                        {
                            gameplay.getScore(100);
                        }
                        else
                        {
                            raquette.SetShoot();
                            remove = true;
                            Debug.WriteLine("j'ai obtenu 0");
                        }
                        
                    }
                    break;

                case 1:
                    if (boundingBox.Intersects(raquette.GetBoundingBox()))
                    {
                        raquette.SetSmall();
                        gameplay.getScore(-100);
                        remove = true;
                        Debug.WriteLine("j'ai obtenu 1");
                    }
                    break;
                case 2:
                    if (boundingBox.Intersects(raquette.GetBoundingBox()))
                    {
                        if(raquette.GetBig())
                        {
                            gameplay.getScore(100);
                        } else
                        {
                            raquette.SetBig();
                            remove = true;
                            Debug.WriteLine("j'ai obtenu 2");
                        }
                        
                    }
                    break;
                case 3:
                    if (boundingBox.Intersects(raquette.GetBoundingBox()))
                    {
                        balle.fireBall();
                        remove = true;
                        Debug.WriteLine("j'ai obtenu 3");
                    }
                    break;
                case 4:
                    if (boundingBox.Intersects(raquette.GetBoundingBox()))
                    {
                        gameplay.SetMultiBall();
                        remove = true;
                        Debug.WriteLine("j'ai obtenu 4");
                    }
                    break;



            }

        }
    }
}
