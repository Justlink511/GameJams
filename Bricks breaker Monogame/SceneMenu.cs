using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Projet_Module_3_Thibault_Vivier
{
    internal class SceneMenu : Scene
    {
        //public bool play = false;
        private Button playButton;
        private Button RulesButton;
        Texture2D bg;
        ServiceScene ChangeScene;
        string HighScore;
        SpriteFont FontInfos;
        Nain nain;
        Random rnd;
        public SceneMenu ()
        {
            ChangeScene = ServiceLocator.GetService<ServiceScene> ();
            
        }

        public void onClicPlay(Button pButton)
        {
            ChangeScene.GoToGameplay();
            Debug.WriteLine("J'ai cliqué sur le bouton play");
        }

        public void onClicRules(Button pButton)
        {
            ChangeScene.GoToRules();
        }

        public override void Load()
        {
            base.Load();
            bg = content.Load<Texture2D>("Menu");
            playButton = new Button(content.Load<Texture2D>("play"));
            playButton.SetPosition(500, 400);
            playButton.onClick = onClicPlay;
            RulesButton = new Button(content.Load<Texture2D>("bRules"));
            RulesButton.SetPosition(900, 400);
            RulesButton.onClick = onClicRules;
            FontInfos = content.Load<SpriteFont>("PixelFont");
            HighScore = File.ReadAllText("C:\\Users\\VIVIER Thibault\\Desktop\\formation dev JV\\Module 3 C# Monogame\\Projet Module 3 Thibault Vivier\\Content\\HighScore.txt");
            Debug.WriteLine(HighScore);
            rnd = new Random();
            nain = new Nain(content.Load<Texture2D>("NainCome"));
            nain.SetPosition(500, 0);

        }
        public override void Update()
        {
            base.Update();
            playButton.Update();
            RulesButton.Update();
            nain.Update();

            if (nain.position.Y > 960)
            {
                nain.SetPosition(rnd.Next(50,1500), 0);
            }
            
        }
        public override void Draw()
        {
            base.Draw();
            batch.Draw(bg, new Vector2(0, 0), Color.White);
            playButton.Draw();
            RulesButton.Draw();
            batch.DrawString(FontInfos, HighScore, new Vector2(1200, 300), Color.White);
            nain.Draw();

        }
    }
}
