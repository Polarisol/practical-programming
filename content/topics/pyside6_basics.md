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
