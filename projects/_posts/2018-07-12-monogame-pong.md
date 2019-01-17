---
title: MonoGame Pong with AI
description: Pong using MonoGame, with visual AI.
layout: post
---

## Structure

This is my first time using MonoGame/Microsoft XNA framework, and I must say, the way things are done and stuff is set out feels quite solid. The template code that Visual Studio creates for you when you create a MonoGame project, for example, is logical and employs many good practices when it comes to making a game (assuming that you aren't using a less minimal engine like Unity) - practices which I later came to adopt whenever I make games in any language, even for not so explicitly structured languages/frameworks such as Python (Pygame), JavaScript (HTML Canvas), etc.

The template looks something like this:

```csharp
public class Game : Microsoft.Xna.Framework.Game
{
    public GraphicsDeviceManager graphicsDevice;
    public SpriteBatch spriteBatch;
    
    public Game()
    {
        graphicsDevice = new GraphicsDeviceManager(this)
        {
            PreferMultiSampling = true
        };
        
    }

    protected override void Initialize()
    {
        base.Initialize();
    }

    protected override void LoadContent()
    {
        spriteBatch = new SpriteBatch(GraphicsDevice);
    }

    protected override void UnloadContent()
    {
    }

    protected override void Update(GameTime gameTime)
    {
        if (GamePad.GetState(PlayerIndex.One).Buttons.Back ==
            ButtonState.Pressed || Keyboard.GetState().IsKeyDown(
                Keys.Escape))
        {
            Exit();
        }
        
        
        base.Update(gameTime);
    }

    protected override void Draw(GameTime gameTime)
    {
        GraphicsDevice.Clear(Color.Black);

        spriteBatch.Begin();
        spriteBatch.End();

        base.Draw(gameTime);
    }
}
```

Now, I'd say C# is in of itself, quite structured (namespaces, statically typed, etc..) however this segmentation of the game class into the key sections as it is here (basically: keeping Logic, Drawing and Loading code distinctly separate) 