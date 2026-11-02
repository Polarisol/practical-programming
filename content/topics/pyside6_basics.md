# PySide6 Beginner's Guide

PySide6 is the official Python library used to build graphical user interface (GUI) desktop applications using the Qt framework.

## 1. Minimal Application

This is the baseline program required to create and run an empty window.

```python
from PySide6.QtWidgets import QApplication, QWidget

app = QApplication()
window = QWidget()
window.resize(400, 200)
window.show()
app.exec()
```

* `app` is the application itself. Every PySide6 program needs exactly one.
* `window` is an empty window. `resize(400, 200)` sets its width and height in pixels.
* `window.show()` makes the window appear on the screen.
* `app.exec()` keeps the program running until the user closes the window.

**Result:**

![An empty window](content/images/pyside_basics_1_minimal.png)

## 2. Window Setup

Use these methods on your window object to change its title and size.

* **Set window title:**

  ```python
  window.setWindowTitle("Hello World")
  ```

* **Set position and size:**
  The parameters are `(x, y, width, height)`. `x` and `y` are the position of the window on the screen.

  ```python
  window.setGeometry(100, 100, 400, 200)
  ```

**Result:**

![A window with the title Hello World](content/images/pyside_basics_2_window.png)

## 3. Adding Widgets

A **widget** is any element you see inside a window: a piece of text, a button, a text box, a slider, and so on. To put a widget inside the window, pass `window` as the **last argument** when you create it. Then use `setGeometry(x, y, width, height)` to place it, where `x` and `y` are measured from the **top-left corner of the window**.

### A Label

A label (`QLabel`) shows text on the window.

```python
from PySide6.QtWidgets import QLabel

label = QLabel("Hello, PySide6!", window)
label.setGeometry(30, 30, 200, 30)
```

**Result:**

![A window with a label](content/images/pyside_basics_3_label.png)

### A Button

A button (`QPushButton`) is something the user can click.

```python
from PySide6.QtWidgets import QPushButton

button = QPushButton("Click me", window)
button.setGeometry(30, 80, 120, 40)
```

**Result:**

![A window with a label and a button](content/images/pyside_basics_4_button.png)

Right now, clicking the button does nothing. Let's fix that.

## 4. Reacting to Events

When the user does something with a widget (clicks a button, types text, moves a slider), the widget sends out a **signal**. You can **connect** a signal to a function of your own, and PySide6 will call that function every time the signal is sent.

A button sends the `clicked` signal when it is clicked. Let's make it change the text of the label:

```python
def button_clicked():
    label.setText("The button was clicked!")

button.clicked.connect(button_clicked)
```

* `button_clicked` is a normal Python function that changes the label's text.
* `button.clicked.connect(button_clicked)` tells PySide6: "when `button` is clicked, call `button_clicked`".
* Notice there are **no parentheses** after `button_clicked` in `connect(...)`. You are giving PySide6 the function so it can call it later. You are **not** calling it yourself.

**Result after clicking the button:**

![The label text changed after clicking the button](content/images/pyside_basics_5_clicked.png)

### The Complete Program

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton


def button_clicked():
    label.setText("The button was clicked!")


app = QApplication()
window = QWidget()
window.setWindowTitle("Hello World")
window.setGeometry(100, 100, 400, 200)

label = QLabel("Hello, PySide6!", window)
label.setGeometry(30, 30, 200, 30)

button = QPushButton("Click me", window)
button.setGeometry(30, 80, 120, 40)
button.clicked.connect(button_clicked)

window.show()
app.exec()
```

## 5. Changing How Widgets Look

Every widget has a `setStyleSheet(...)` method that changes how it looks: its colors, font size, border, and more. You give it a string of `property: value;` pairs, written in the same style as CSS on web pages. The examples below all start from the window of section 3, with the label and the button.

### Text color and size

```python
label.setStyleSheet("color: blue; font-size: 24px;")
```

**Result:**

![The label text is big and blue](content/images/pyside_basics_6_style_text.png)

### Background, border, and padding

```python
label.setStyleSheet("background-color: yellow; border: 2px solid red; padding: 2px;")
```

* `border: 2px solid red` draws a red line, 2 pixels wide, around the widget.
* `padding: 2px` leaves a little space between the border and the text.

**Result:**

![The label has a yellow background and a red border](content/images/pyside_basics_7_style_label_box.png)

### A colorful button

```python
button.setStyleSheet("background-color: green; color: white; font-weight: bold; border-radius: 10px;")
```

* `font-weight: bold` makes the text bold.
* `border-radius: 10px` rounds the corners.

**Result:**

![A green button with white bold text and rounded corners](content/images/pyside_basics_8_style_button.png)

### The whole window

You can call `setStyleSheet` on the window too. The style is passed on to **all the widgets inside it**, so here the button also turns blue.

```python
window.setStyleSheet("background-color: lightblue;")
```

**Result:**

![The whole window has a light blue background](content/images/pyside_basics_9_style_window.png)

### Changing the style when something happens

`setStyleSheet` can be called at any time, not only when the widget is created. For example, inside the function that reacts to the button:

```python
def button_clicked():
    label.setText("The button was clicked!")
    label.setStyleSheet("color: white; background-color: purple; font-size: 16px;")
```

**Result after clicking the button:**

![After the click, the label has white text on a purple background](content/images/pyside_basics_10_style_clicked.png)

### Useful properties

| Property | What it changes | Example |
| --- | --- | --- |
| `color` | Text color | `color: red;` |
| `background-color` | Background color | `background-color: #3399FF;` |
| `font-size` | Text size | `font-size: 20px;` |
| `font-weight` | Bold text | `font-weight: bold;` |
| `border` | A line around the widget | `border: 1px solid black;` |
| `border-radius` | Rounded corners | `border-radius: 8px;` |
| `padding` | Space between the border and the text | `padding: 5px;` |

* Colors can be names (`red`, `lightblue`), hex codes (`#3399FF`), or `rgb(255, 165, 0)`.
* Each call to `setStyleSheet` **replaces** the previous style of that widget. To keep a color and add a border, write both in the same string.
