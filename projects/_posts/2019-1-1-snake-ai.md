---
title: Snake AI
description: Feed Forward Neural Networks evolving to play Snake
layout: post
feature: true
thumb: /passets/9/thumb.gif
image: https://camo.githubusercontent.com/89c44a17868737bc78ccc4e38fc574fa608531e1/68747470733a2f2f692e696d6775722e636f6d2f4568354f614d342e676966
displaybox-syle: normal
links:
  - GitHub Page: https://github.com/PixelZerg/SnakeAI
---

Here, I am using an evolutionary algorithm to try and optimise the weights of feed forward neural networks such that they can play snake.
It's not using any external libraries, apart from `NumPy` and `Pygame` (for the rendering stuff).

The neural networks are fully connected, feed-forward neural networks. It has `24` input neurons, which correspond to the distance of food and tail tiles in the 8 directions from the head of the snake ([code here](https://github.com/PixelZerg/SnakeAI/blob/master/snake.py#L151)), a single hidden layer with `16` neurons and `4` output neurons which correspond to the 4 movement directions (can be thought of as arrow keys). Their activation functions are the standard sigmoid function ([code here](https://github.com/PixelZerg/SnakeAI/blob/master/neuroga.py#L17)):


$$
\text{sigmoid}(x) = \frac{1}{1+e^{-x}}
$$

<center>standard sigmoid function</center>

A population of 400 of such neural networks are created, [their weights and biases initialised using glorot initialisation](https://github.com/PixelZerg/SnakeAI/blob/master/neuroga.py#L51). Each of their fitnesses are evaluated by having the network control a snake for a certain amount of time ([code here](https://github.com/PixelZerg/SnakeAI/blob/master/trainer.py#L81)).


$$
\sigma^2 = \frac{2}{\text{shape}[0]+\text{shape}[-1]}
$$

<center>glorot initialisation (normal distribution with mean 0 and variance as shown above)</center>

The best performing networks are selected and then repeatedly produce children networks until there are 400 of them (the rest are ~~killed~~ deleted) whereby children networks have their parents' [weights and biases crossed](https://github.com/PixelZerg/SnakeAI/blob/master/neuroga.py#L276). Then some of the population have their weights/biases [randomly mutated](https://github.com/PixelZerg/SnakeAI/blob/master/neuroga.py#L347) for good measure. This is repeated many, many times until, by a process similar to genetic evolution in biology, we begin to see neural networks which are pretty good at playing snake emerge.

Here is the code which is internally run at each step of this process, representing this ([can be found here](https://github.com/PixelZerg/SnakeAI/blob/master/neuroga.py#L434)):

```python
self.population = self.mutate(
                self.recombine(
                    self.select(self.population,**self.selection_args),
                    self.pop_size,
                    self.cross_args), **self.mutate_args)
```

Since this project is making use of my minimal yet robust feed forward neural network/genetic algorithm implementation, [neuroga](https://github.com/PixelZerg/SnakeAI/blob/master/neuroga.py), though, all of the above is abstracted away with some really neat-looking code:

```python
genetic = ng.Genetic([24,16,4], # network architecture
                     400, # population size
                     fitness_function,
                     save='model/', # save directory
                     save_interval=5,
                     opt_max=True, # whether to maximise or minimise
                     activf=ng.sigmoid) # activation function
```

Neuroga handles all the stuff like periodically saving/loading the models to/from disk, graph plotting, etc while letting you easily tweak hyperperameters such as mutation rate, network architectures, etc.

The training all happens in a headless manner (the internal game model is interacted with directly, rather than drawing the graphics, etc) so as to increase efficiency in terms of time, memory and processing power. Networks can, however, be loaded and run using the rendering engine at a later time (as you can see at the top of this page).

I had to experiment a lot before seeing any good results: [my experimentation notes log](https://github.com/PixelZerg/SnakeAI/blob/master/notes.txt). I had to experiment with many things such as the inputs to the neural network, hyperperameters, internal algorithms (such as recombination), etc.

I especially had to experiment with fitness functions quite a lot. In the code, you can find [several](https://github.com/PixelZerg/SnakeAI/blob/master/trainer.py#L5) [fitness](https://github.com/PixelZerg/SnakeAI/blob/master/trainer.py#L23) [functions](https://github.com/PixelZerg/SnakeAI/blob/master/trainer.py#L46) [I](https://github.com/PixelZerg/SnakeAI/blob/master/trainer.py#L64) [experimented](https://github.com/PixelZerg/SnakeAI/blob/master/trainer.py#L81) [with](https://github.com/PixelZerg/SnakeAI/blob/master/trainer.py#L101).

The one which gave the best results was [this one](https://github.com/PixelZerg/SnakeAI/blob/master/trainer.py#L81):

$$
\left\{\begin{matrix}
2^{\text{eaten}}\times n^n & \text{eaten}<10\\
2^{\text{10(eaten-9)}}\times n^n & \text{otherwise}
\end{matrix}\right.
$$

<center><a href="https://github.com/PixelZerg/SnakeAI/blob/4756265cb5c299c5f8a2bbf302fbaae5fa9d2270/trainer.py#L81">fit5</a> - the fitness function which yielded the best results<center>