---
title: Casio Minesweeper
description: Minesweeper written in MicroPython for the Casio fx-CG50 graphical calculator
layout: post
feature: true
thumb: /passets/12/thumb.gif
displaybox-syle: normal
video:
  - "/passets/12/minesweeper-cropped.mp4"
links:
  - Code: https://github.com/PixelZerg/Casio-Python/blob/master/mines.py 
---

The Python available on the fx-CG50 is relatively limited while at the same time also being quite powerful. It runs MicroPython v1.9.4 but, quoting its [manual](https://support.casio.com/storage/en/manual/pdf/EN/004/fx-CG50_Soft_v320_EN.pdf): "_does not support all of the functions, commands, modules, and libraries of MicroPython_". Actually it seems to only support two modules: `math` and `random`.

Notably, it doesn't have the `time` module (or `utime` since we're talking about MicroPython here), so I can't `time.sleep` - meaning I can't show pretty animations and also, I can't record game completion speeds in this project.

With these, and other various limitations in mind, adopting a slightly more succinct coding style, I made the minesweeper program you see above.

Some other notable limitations:
- Cannot hook keys (user input done through `input()`)
    - means that the enter button must be pressed after each key press
- No colour, graphics, etc
- No arbitrary positioning of printing cursor

## Installation
Commands here, when given, will be Linux shell commands - but it shouldn't be too hard to follow on other platforms. It's literally just downloading a file and moving it onto the calculator by USB.

#### 1) Get the code
There's a link at the top of this page that says "Code". You can just copy it from there and paste it into a file in some temporary directory called `mines.py`.

```
> cd /tmp
> wget https://raw.githubusercontent.com/PixelZerg/Casio-Python/master/mines.py
```

#### 2) Put it onto the Calculator
Connect the calculator to your PC with the USB cable that came with the calculator.

![](/passets/12/1.jpg)
The calculator should look like this once it is connected. Press `F1`.

Then move the `mines.py` file into the root directory of the calculator.

```
# mount /dev/sdb1 /mnt
# cp mines.py /mnt
```

Now you need to eject/unmount the calculator.

On Windows, you can probably do this by going to your system tray, right clicking on the USB icon and telling it to eject.

```
# sudo umount /dev/sdb1
```

If you did that right, the calculator should look like this:
![](/passets/12/2.jpg)

Press `EXIT` as it says to, then go to the `MENU` and select the Python option. You should now see `mines.py` listed (as in the video above). Select it and press `F1` to run it.

## Usage
If you followed the installation procedure above correctly, you should be able to run the program.

In the program, you will have a cursor, marked by an `X`. You can move it around and the viewport will pan around as required too. You can put down a flag at the cursor's position or check the tile too.

The game ends either when you successfully flag each mine (and so win) or when you activate a mine (and so lose).

The controls are:

| Key | Function          |
| --- | ----------------- |
| 8   | Move cursor up    |
| 2   | Move cursor down  |
| 4   | Move cursor left  |
| 6   | Move cursor right |
| 5   | Toggle flag       |
| EXE | Check tile        |

Note: you will need to press EXE (Enter) after inputting the keys above (apart from the last one for obvious reasons).

The program also fully works with standard Python (not MicroPython) and so you can also run it on your computer's terminal. For this reason, there are also alternate controls for keyboards:

| Key | Function          |
| --- | ----------------- |
| w   | Move cursor up    |
| s   | Move cursor down  |
| a   | Move cursor left  |
| d   | Move cursor right |
| z   | Put down a flag   |
| x   | Check tile        |

Either works, and they can be used interchangeably.