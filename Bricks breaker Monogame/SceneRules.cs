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
    internal class SceneRules : Scene
    {
        private Button playButton;
        private Button menuButton;
        ServiceScene ChangeScene;
        Texture2D bg;

        public SceneRules()
        {
            ChangeScene = ServiceLocator.GetService<ServiceScene>();

        }

        public void onClicPlay(Button pButton)
        {
            ChangeScene.GoToGameplay();
            Debug.WriteLine("J'ai cliqué sur le bouton play");
        }

        public void onClicMenu(Button pButton)
        {
            ChangeScene.GoToMenu();
        }

        public override void Load()
        {
            base.Load();
            bg = content.Load<Texture2D>("Rules");
            playButton = new Button(content.Load<Texture2D>("play"));
            playButton.SetPosition(500, 800);
            playButton.onClick = onClicPlay;
            menuButton = new Button(content.Load<Texture2D>("bMenu"));
            menuButton.SetPosition(900, 800);
            menuButton.onClick = onClicMenu;
        }

        public override void Update()
        {
            base.Update();
            playButton.Update();
            menuButton.Update();

        }
        public override void Draw()
        {
            base.Draw();
            batch.Draw(bg, new Vector2(0, 0), Color.White);
            playButton.Draw();
            menuButton.Draw();
        }
        }
}
