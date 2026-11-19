# Colors

Every color on a screen is made of **three lights**: **R**ed, **G**reen and **B**lue. Each tiny dot on the screen (a pixel) has the three, and turns each one on a little or a lot. Mixing the three lights at different strengths makes every color you see.

![Red, green and blue light mixed together: red + green = yellow, red + blue = magenta, green + blue = cyan, all three = white](content/images/pyside_colors_rgb_mix.png)

## 1. Three Numbers

In PySide6 you write a color as `rgb(red, green, blue)`. Each number is **how strong** that light is:

* `0` means the light is **off**.
* `255` means the light is **fully on**.
* Anything in between is partly on.

```python
label.setStyleSheet("color: rgb(255, 0, 0);")              # only red: red
label.setStyleSheet("background-color: rgb(255, 255, 0);") # red + green: yellow
```

The order is always **red, green, blue**. `rgb(0, 0, 255)` is blue, not red.

Each number has 256 values (0 to 255), so there are 256 × 256 × 256 = **16,777,216** colors.

## 2. How to Think About It

![Red getting stronger, grays from black to white, and some mixed colors, each with its rgb numbers](content/images/pyside_colors_swatches.png)

* **All off** is black: `rgb(0, 0, 0)`. **All on** is white: `rgb(255, 255, 255)`.
* **All three equal** is gray. Bigger numbers make a lighter gray: `rgb(64, 64, 64)` is dark gray, `rgb(192, 192, 192)` is light gray.
* **Bigger numbers mean brighter.** `rgb(128, 0, 0)` is dark red, `rgb(255, 0, 0)` is bright red.
* **The biggest number wins.** In `rgb(255, 165, 0)` red is the strongest, with a good amount of green, so it is orange.
* To make a color **paler**, raise the small numbers: `rgb(255, 0, 0)` is red, `rgb(255, 192, 203)` is pink.

Some colors to start from:

| Color | rgb |
|---|---|
| Black | `rgb(0, 0, 0)` |
| White | `rgb(255, 255, 255)` |
| Gray | `rgb(128, 128, 128)` |
| Red | `rgb(255, 0, 0)` |
| Green | `rgb(0, 255, 0)` |
| Blue | `rgb(0, 0, 255)` |
| Yellow | `rgb(255, 255, 0)` |
| Cyan | `rgb(0, 255, 255)` |
| Magenta | `rgb(255, 0, 255)` |
| Orange | `rgb(255, 165, 0)` |
| Purple | `rgb(128, 0, 128)` |
| Pink | `rgb(255, 192, 203)` |
| Brown | `rgb(139, 69, 19)` |

## 3. Colors From Variables

The three numbers are just numbers, so your code can choose them. Build the string with an f-string:

```python
import random

def change_color():
    r = random.randint(0, 255)
    g = random.randint(0, 255)
    b = random.randint(0, 255)
    label.setStyleSheet(f"background-color: rgb({r}, {g}, {b});")
    label.setText(f"rgb({r}, {g}, {b})")

button.clicked.connect(change_color)
```

Each click paints the label with a new random color and shows its numbers.

## 4. Hex Colors

In style sheets, and especially in QSS files, you will often see colors like `#FF8000`. This is **the same three numbers**, written in base 16 (hexadecimal) instead of base 10:

```text
#FF8000
 RR GG BB
 FF = 255   red
 80 = 128   green
 00 = 0     blue

#FF8000 is the same as rgb(255, 128, 0)
```

Two hex digits per light, in the same order: red, green, blue. `00` is off, `FF` is fully on.

```css
QPushButton {
    background-color: #2563eb;   /* the same as rgb(37, 99, 235) */
    color: #ffffff;              /* the same as rgb(255, 255, 255) */
}
```

Both ways work everywhere in PySide6 style sheets, and you can mix them in the same file. To turn your numbers into hex in Python: `f"#{r:02X}{g:02X}{b:02X}"`.

## In Short

| I want... | Write |
|---|---|
| A color by its three lights | `rgb(255, 165, 0)` |
| Black / white | `rgb(0, 0, 0)` / `rgb(255, 255, 255)` |
| A gray | three equal numbers, e.g. `rgb(128, 128, 128)` |
| A darker color | smaller numbers |
| A paler color | raise the small numbers |
| A color from variables | `f"rgb({r}, {g}, {b})"` |
| The same color in hex | `#FFA500` (`FF`, `A5`, `00`) |

* Each number must be between `0` and `255`.
* The order is always red, green, blue.
