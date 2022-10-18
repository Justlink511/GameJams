using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet_Module_3_Thibault_Vivier
{
    internal class BrickInvu : Brick
    {

        public BrickInvu (Texture2D pTexture) : base(pTexture)
        {
            invu = true;
        }
    }
}
