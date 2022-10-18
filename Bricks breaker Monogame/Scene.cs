using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet_Module_3_Thibault_Vivier
{
    public class Scene
    {
        public ContentManager content;
        public SpriteBatch batch;
        public Rectangle screen;
        public Scene ()
        {
            //Recupération du service Locator

            content = ServiceLocator.GetService<ContentManager>();
            batch = ServiceLocator.GetService<SpriteBatch>();
            screen = ServiceLocator.GetService<Rectangle>();
        }

        public virtual void Load()
        {

        }
        public virtual void Unload()
        {

        }
        public virtual void Update()
        {

        }
        public virtual void Draw()
        {

        }

    }
}
