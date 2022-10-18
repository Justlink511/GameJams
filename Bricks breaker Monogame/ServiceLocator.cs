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
    /* public class ServiceLocator
     {

         public static ContentManager content { get; private set; }
         public static SpriteBatch batch { get; private set; }
         public static Rectangle screen { get; private set; }

         public static void Load(ContentManager pContent, SpriteBatch pBatch, Rectangle pScreen)
         {
             content = pContent;
             screen = pScreen;
             batch = pBatch;
         }
     }*/

    public static class ServiceLocator
    {
        private static readonly Dictionary<Type,object> listServices =
            new Dictionary<Type,object>();

        public static void AddService<T>(T Service)
        {
            listServices[typeof(T)] = Service;  
        }

        public static T GetService<T>()
        {
            return (T) listServices[typeof(T)];
        }
    }
}
