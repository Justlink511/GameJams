using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet_Module_3_Thibault_Vivier
{


    internal class Flower : Sprite 
    {
        IRaquette raquette;
        INain nain;
        IGameplay gameplay;
        List<Nain> lstNain;
        int raquetteWidth;
        Vector2 raquettePos;
        Rectangle raquetteBox;
        public Flower(Texture2D pTexture) : base(pTexture)
        {
            //vitesse = new Vector2(0, 5);
            gameplay = ServiceLocator.GetService<IGameplay>();
            sprite = "flower";



        }

        public override void Update()
        {
            base.Update();

            nain = ServiceLocator.GetService<INain>();
            raquette = ServiceLocator.GetService<IRaquette>();
            raquetteBox = raquette.GetBoundingBox();
            raquetteWidth = raquette.GetWidth();
            //raquettePos = raquette.GetPos();

            if (boundingBox.Intersects(raquetteBox))
            {
                raquette.Touched();
                nain.GetFlower();
                remove = true;
            }

            if (position.Y > screen.Height)
            {
                nain.GetFlower();
                remove = true;
            }
            
        }

        public bool Removed()
        {
        return remove;
        }

        public void setAngle()
        {
            raquette = ServiceLocator.GetService<IRaquette>();
            raquettePos = raquette.GetPos();
            double dy = raquettePos.Y - position.Y;
            double dx = (raquettePos.X + raquette.GetWidth() / 2) - (position.X + Width / 2);
            double angleRad = Math.Atan2(dy, dx);
            vitesse.X = (float)(Math.Cos(angleRad) * 5);
            vitesse.Y = (float)(Math.Sin(angleRad) * 5);
        }
    }
}
