using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Projet_Module_3_Thibault_Vivier
{
    internal class SceneGameover : Scene
    {
        private Button playButton;
        ServiceScene ChangeScene;

        public SceneGameover() : base()
        {
            ChangeScene = ServiceLocator.GetService<ServiceScene>();
        }


        public void onClicPlay(Button pButton)
        {
            ChangeScene.GoToGameplay();
            Debug.WriteLine("J'ai cliqué sur le bouton play");
        }
        public override void Load()
        {
            base.Load();
            playButton = new Button(content.Load<Texture2D>("play"));
            playButton.SetPosition(700, 400);
            playButton.onClick = onClicPlay;

        }
        public override void Update()
        {
            base.Update();
            playButton.Update();

        }
        public override void Draw()
        {
            base.Draw();
            playButton.Draw();

        }
    }
}
