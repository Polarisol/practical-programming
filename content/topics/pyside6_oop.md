# PySide6 Basic OOP Form

As programs grow, keeping every widget and function as a global variable becomes messy and hard to follow. Writing the window as a **class** keeps all of its widgets and the functions that react to them together in one place, and this is how almost all real PySide6 programs are written.

## The Basic Template

```python
from PySide6.QtWidgets import QApplication, QWidget

class MyWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)

if __name__ == "__main__":
    app = QApplication()
    window = MyWindow()
    window.show()
    app.exec()
```

* `class MyWindow(QWidget)` - our window **is a** `QWidget`, with everything a `QWidget` can do, plus whatever we add.
* `super().__init__()` - first lets `QWidget` set itself up. Always keep this line.
* `initUI(self)` - the place where we build the window: set its title and size, and create its widgets.
* Inside the class, the window is called **`self`**. So `window.setWindowTitle(...)` from the non-OOP form becomes `self.setWindowTitle(...)`.
* `if __name__ == "__main__":` - the code that runs the program. It is the same as in the non-OOP form, except that the window is created with `MyWindow()` instead of `QWidget()`.

## Adding Widgets

Widgets are created inside `initUI`. There are two differences from the non-OOP form:

1. The parent of the widget is **`self`** (the window) instead of `window`.
2. The widget is saved as **`self.something`** instead of a plain variable.

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton

class MyWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)

        self.label = QLabel("Hello, PySide6!", self)
        self.label.setGeometry(30, 30, 200, 30)

        self.button = QPushButton("Click me", self)
        self.button.setGeometry(30, 80, 120, 40)
```

**Why `self.label` and not just `label`?** A plain variable like `label` exists only inside `initUI` and disappears when `initUI` ends. `self.label` is saved **inside the window object**, so every other method of the class can use it later, for example to change its text when a button is clicked.

> **Tip:** a widget that you never need to touch again after creating it (like a fixed title label) can be a plain variable. Any widget you will read from or change later must be saved with `self.`.

## Connecting and Reacting to Signals

The functions that react to signals become **methods** of the class:

* Write the method inside the class, with `self` as its first parameter.
* Connect the signal in `initUI` using **`self.`** before the method name (and still no parentheses).
* Inside the method, use `self.` to reach any widget.

```python
    def initUI(self):
        # ... widgets created as above ...
        self.button.clicked.connect(self.button_clicked)

    def button_clicked(self):
        self.label.setText("The button was clicked!")
```

### Signals That Send a Value

If a signal sends a value (like `textChanged` of a `QLineEdit` or `valueChanged` of a `QSpinBox`), the value comes **after** `self` in the method's parameters:

```python
        self.name_input = QLineEdit(self)
        self.name_input.textChanged.connect(self.name_changed)

    def name_changed(self, text):
        self.label.setText(f"Hello {text}")
```

## The Complete Program

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton, QLineEdit

class MyWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)

        self.label = QLabel("Hello, PySide6!", self)
        self.label.setGeometry(30, 30, 300, 30)

        self.name_input = QLineEdit(self)
        self.name_input.setGeometry(30, 80, 200, 30)
        self.name_input.setPlaceholderText("Enter your name")
        self.name_input.textChanged.connect(self.name_changed)

        self.button = QPushButton("Click me", self)
        self.button.setGeometry(30, 130, 120, 40)
        self.button.clicked.connect(self.button_clicked)

    def name_changed(self, text):
        self.label.setText(f"Hello {text}")

    def button_clicked(self):
        self.label.setText("The button was clicked!")

if __name__ == "__main__":
    app = QApplication()
    window = MyWindow()
    window.show()
    app.exec()
```

## Non-OOP vs. OOP at a Glance

| | Non-OOP form | OOP form |
|---|---|---|
| Create the window | `window = QWidget()` | `class MyWindow(QWidget)` + `window = MyWindow()` |
| Set up the window | `window.setWindowTitle(...)` | `self.setWindowTitle(...)` inside `initUI` |
| Widget parent | `QLabel("text", window)` | `QLabel("text", self)` |
| Store a widget | `label = ...` | `self.label = ...` |
| Reacting function | `def button_clicked():` | `def button_clicked(self):` (a method) |
| Connect a signal | `button.clicked.connect(button_clicked)` | `self.button.clicked.connect(self.button_clicked)` |
| Use a widget in the function | `label.setText(...)` | `self.label.setText(...)` |
