---
title: MonoGame Pong with AI
description: Pong using MonoGame, with visual AI.
layout: post
feature: true
thumb: /passets/8/thumb.png
image: https://github.com/PixelZerg/Pong/raw/master/demo.gif
displaybox-syle: normal
links:
  - GitHub Page: https://github.com/PixelZerg/Pong
  - Related Note: /notes/movement/
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

I'd say C# is in of itself, quite structured (namespaces, statically typed, etc..) however, this segmentation of the game class into the key sections as it is here (basically: keeping Logic, Drawing and Loading code, etc distinctly separate) makes the workflow even more clean and manageable.

## AI
The AI internally simulates the paths the balls will follow through a bunch of geometry.

Essentially, if you know the velocity vector and the position of the ball, then (as the ball will always travel in a straight line) you have all the information needed to figure out the path that ball will follow. If the path intersects some boundary, the gradient of the line will simply be inverted.

The path is internally simulated until the intersection point of the path and the AI's side is determined. That's where the ball will end up (assuming the other player hits it - otherwise, you get the point anyways), so all the AI needs to do is move its paddle to that position.