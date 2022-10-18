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
    internal class Shoot : Sprite
    {
        IGameplay igameplay;
        List<Brick> lstBrick;

        public Shoot (Texture2D pTexture) : base(pTexture)
        {
            vitesse = new Vector2(0, -5);
            
            
        }

        public override void Update()
        {
            base.Update();
            igameplay = ServiceLocator.GetService<IGameplay>();
            lstBrick = igameplay.getBricks();
            if (position.Y < 0)
            {
                remove = true;

            }

            for (int j = lstBrick.Count - 1; j >= 0; j--)
            {
                if (lstBrick[j].boundingBox.Intersects(boundingBox))
                {
                    if (!lstBrick[j].invu)
                    {
                        lstBrick[j].remove = true;
                        igameplay.getScore(5);
                    }
                    remove = true;

                }
            }
        }


    }
}
