using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet_Module_3_Thibault_Vivier
{
    public delegate void OnClick(Button pSender);

    public class Button : Sprite
    {
        public bool isHover { get; private set; }
        private MouseState oldMouseState;
        public OnClick onClick { get; set; }

        public Button(Texture2D pTexture) : base(pTexture)
        {

        }

        public override void Update()
        {
            MouseState newMouseState = Mouse.GetState();
            Point MousePos = newMouseState.Position;

            if (boundingBox.Contains(MousePos))
            {
                if (!isHover)
                {
                    isHover = true;
                    Debug.WriteLine("The button is now hover");
                }
            }
            else
            {
                if (isHover == true)
                {
                    Debug.WriteLine("The button is no more hover");
                }
                isHover = false;
            }

            if (isHover)
            {
                if (newMouseState.LeftButton == ButtonState.Pressed
                    && oldMouseState.LeftButton == ButtonState.Released)
                {
                    Debug.WriteLine("Button is clicked");
                    if (onClick != null)
                        onClick(this);
                }
            }

            oldMouseState = newMouseState;
            base.Update();
        }

    }
}
