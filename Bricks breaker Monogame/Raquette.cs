using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Content;
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
    public interface IRaquette
    {
        Vector2 GetPos();
        int GetWidth();
        Rectangle GetBoundingBox();
        bool SetShoot();
        bool SetBig();
        bool SetSmall();
        bool Touched();
        bool GetShoot();
        bool GetBig();
        bool GetSmall();

    }
    public class Raquette : Sprite, IRaquette
    {

        public bool Shoot = false;
        public Texture2D Normal;
        public bool Big = false;
        public bool Small = false;
        public bool touched = false;
        public int TimerTarget = 100;
        public int Timer = 0;

        //public int ratio { get {return   };
        public Raquette(Texture2D pTexture) : base (pTexture)
        {
            ServiceLocator.AddService<IRaquette>(this);
            Normal = pTexture;
            

        }

        public override void Update()
        {
            base.Update();
            {
                if(!touched)
                {
                    if (Mouse.GetState().X < Width/2)
                    { SetPosition(0, position.Y); }
                    else if (Mouse.GetState().X > screen.Width - 200)
                    { SetPosition(screen.Width - 200 - Width, position.Y); }
                    else
                    {
                        SetPosition(Mouse.GetState().X - Width/2, position.Y);
                    }
                    
                }
                if(touched)
                {
                    if (Timer >= TimerTarget)
                    {
                        touched = false;
                        Timer = 0;
                    }
                    else
                    {
                        Timer++;
                    }
                }
                
            }
            

        }

        public void ShootMod()
        {
            if (Shoot == false)
            {
                Shoot = true;
            } else
            {
                Shoot = false;
            }
            
        }


        public Vector2 GetPos()
        {
            return position;
        }
        public int GetWidth()
        {
            return Width;
        }
        public Rectangle GetBoundingBox()
        {
            return boundingBox;
        }
        public bool SetShoot()
        {
            Shoot = true;
            return Shoot;
        }
        public bool SetSmall()
        {
            Small = true;
            return Small;
        }
        public bool SetBig()
        {
                Big = true;
            return Big;
        }
        public bool GetShoot()
        {
            return Shoot;
        }
        public bool GetBig()
        {
            return Big;
        }
        public bool GetSmall()
        {
            return Small;
        }

        public bool Touched()
        {
            touched = true;
            Debug.WriteLine("j'ai été touché");
            return touched;
        }

    }
}
