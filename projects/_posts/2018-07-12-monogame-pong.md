---
title: MonoGame Pong with AI
description: Pong using MonoGame, with visual AI.
layout: post
---

## AI
The AI internally simulates the paths the balls will follow through a bunch of geometry.

Essentially, if you know the velocity vector and the position of the ball, then (as the ball will always travel in a straight line) you have all the information needed to figure out the path that ball will follow. If the path intersects some boundary, the gradient of the line will simply be inverted.

The path is internally simulated until the intersection point of the path and the AI's side is determined. That's where the ball will end up (assuming the other player hits it - otherwise, you get the point anyways), so all the AI needs to do is move its paddle to that position.

### Movement
A naive approach to implement AI movement, and one I see people often run into problems with, is to just do the following:

```csharp
while(true){
    if(x < targetx){
        x += 1;
    }
    else if(x > targetx){
        x -= 1;
    }
    else{
        // reached target
    }
}
```
<center><small>(this can easily be extended into higher dimensions by doing the same for y,z,etc)</small></center>

This will work, and will actually work perfectly when you are using integers for everything, but let's say for example that `x` is non-integer value such as `0.5` and `targetx` is `1`, for example.

Since `x < targetx` is true, `x += 1` will be executed, making `x` now `1.5`. On the next iteration, `x > targetx` is true and so `x -= 1` will be executed, making `x` now `0.5` again. This will then keep repeating forever, making the movement direction to constantly flip every frame, resulting in a weird vibrating sort of motion.

In other words, the step distance (of `1` in this case) is too large, and keeps over-stepping the actual position!

The solution is simple, really. When the distance from the target is smaller than the step, you can just essentially step directly to the target position (woe teleportation). Here's an implementation of this below:

```csharp
while(true){
    if(x+1 < targetx){
        x += 1;
    }
    else if(x-1 > targetx){
        x -= 1;
    }
    else{
        x = targetx;
        // reached target
    }
}
```

### Better Movement

The above movement code is linear and makes the movement look unnatural (though it may be good enough for a lot of cases). You can make the movement look more beautiful by modelling the movement with a non-linear function (make it ease in and ease out). Below is the equation I used for the AI in this project, for example:



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