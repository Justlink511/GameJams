using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using Microsoft.Xna.Framework.Input;
using System;
using System.Diagnostics;
using System.IO;
using TiledSharp;





//note : Angle de la balle, dépend de la vélocité X, créer un ratio entre centre de la balle et centre de la raquette




namespace Projet_Module_3_Thibault_Vivier
{

    interface ServiceScene
    {
        void GoToGameplay();

        void GoToGameover();
        void GoToRules();
        void GoToMenu();

    }
    public class JeuCasseBrique : Game, ServiceScene
    {
        private GraphicsDeviceManager graphics;
        public SpriteBatch spriteBatch;

        
        
        SceneMenu MaSceneMenu;
        SceneGameplay MaSceneGameplay;
        SceneGameover MaSceneGameover;
        SceneRules MaSceneRules;
        Scene CurrentScene;
        Rectangle screen;
        


        public JeuCasseBrique()
        {
            graphics = new GraphicsDeviceManager(this);
            Content.RootDirectory = "Content";
            IsMouseVisible = true;
            graphics.PreferredBackBufferHeight = 960;
            graphics.PreferredBackBufferWidth = 1800;
            graphics.ApplyChanges();
        }

        protected override void Initialize()
        {
            // TODO: Add your initialization logic here

            base.Initialize();


        }

        protected override void LoadContent()
        {
            screen = this.Window.ClientBounds;
            Debug.WriteLine(screen.Width);
            
            spriteBatch = new SpriteBatch(GraphicsDevice);
            //ServiceLocator.Load(Content, spriteBatch, screen);
            ServiceLocator.AddService(spriteBatch);
            ServiceLocator.AddService(screen);
            ServiceLocator.AddService(Content);

            ServiceLocator.AddService<ServiceScene>(this);

            MaSceneMenu = new SceneMenu();
            MaSceneGameplay = new SceneGameplay();
            MaSceneGameover = new SceneGameover();
            MaSceneRules = new SceneRules();    
            CurrentScene = MaSceneMenu;

            MaSceneRules.Load();
            MaSceneGameplay.Load();
            MaSceneMenu.Load();
            MaSceneGameover.Load();



            // TODO: use this.Content to load your game content here
            


        }

        protected override void Update(GameTime gameTime)
        {
            if (GamePad.GetState(PlayerIndex.One).Buttons.Back == ButtonState.Pressed || Keyboard.GetState().IsKeyDown(Keys.Escape))
                Exit();

            if (Keyboard.GetState().IsKeyDown(Keys.Enter ) && CurrentScene == MaSceneMenu)
            {
                CurrentScene = MaSceneGameplay;
            }

            // TODO: Add your update logic here

            CurrentScene.Update();

            base.Update(gameTime);
        }

        protected override void Draw(GameTime gameTime)
        {
            GraphicsDevice.Clear(Color.Black);

            // TODO: Add your drawing code here
            spriteBatch.Begin();

            

            CurrentScene.Draw();

            spriteBatch.End();


            base.Draw(gameTime);
        }

        public void GoToGameplay()
        {
            
            CurrentScene = MaSceneGameplay;
        }
        public void GoToGameover()
        {
            CurrentScene = MaSceneGameover;
            MaSceneGameplay.Load();
        }

        public void GoToRules()
        {
            CurrentScene = MaSceneRules;
        }
        public void GoToMenu()
        {
            CurrentScene = MaSceneMenu;
        }
    }
}