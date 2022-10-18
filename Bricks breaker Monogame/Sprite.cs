using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet_Module_3_Thibault_Vivier
{
    public class Sprite
    {
        public Vector2 position;
        public Vector2 vitesse;
        public ContentManager content;
        public SpriteBatch batch;
        public Rectangle screen;
        public bool remove = false;
        public string sprite = "sprite";
        public Rectangle boundingBox { get; private set; }
        private Texture2D texture;
        public int Height
        { get { return texture.Height; } }
        public int Width
        { get { return texture.Width; } }

        public Sprite(Texture2D pTexture)
        {
            texture = pTexture;
            content = ServiceLocator.GetService<ContentManager>();
            batch = ServiceLocator.GetService<SpriteBatch>();
            screen = ServiceLocator.GetService<Rectangle>();
        }
        public void SetPosition(Vector2 pPosition)
        { position = pPosition; }
        public void SetPosition(float pX, float pY)
        {
            position = new Vector2(pX, pY);
        }

        public Rectangle NextPositionX()
        {
            Rectangle nextPosition = boundingBox;
            nextPosition.X = (int)(nextPosition.X + vitesse.X);
            return nextPosition;
        }

        public Rectangle NextPositionY()
        {
            Rectangle nextPosition = boundingBox;
            nextPosition.Y = (int)(nextPosition.Y + vitesse.Y);
            return nextPosition;
        }

        public void InverseVitesseX()
        {
            vitesse = new Vector2(-vitesse.X, vitesse.Y);
        }

        public void InverseVitesseY()
        {
            vitesse = new Vector2(vitesse.X, -vitesse.Y);
        }

        public virtual void Update()
        {
            boundingBox = new Rectangle((int)position.X, (int)position.Y, Width, Height);
            position += vitesse;
        }

        public virtual void Draw()
        {
            batch.Draw(texture, position, Color.White);
        }

        public void Remove(List<Sprite>pList)
        {
            pList.Remove(this);
            
        }

    }
}
