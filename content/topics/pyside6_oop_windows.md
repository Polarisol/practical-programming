# PySide6 Multiple Windows

Many programs need more than one window. For example, a main window where the user enters values, and a second window that shows a graph.

In this tutorial we build two connected windows:

* **`HeatTransferWidget`** - the main window.
* **`GraphWindow`** - a second window.

Each window will be able to **reach the other one**, so they can share data.

![Two connected windows](content/images/OOP_windows.png)

The picture shows the idea:

* **Red arrow:** the main window keeps the second window in `self.graph_window`.
* **Green arrow:** the second window keeps the main window in `self.main_window`.

## Step 1: The Second Window

The second window is a normal OOP window, with one addition: it receives the main window as a parameter and saves it.

```python
class GraphWindow(QWidget):

    def __init__(self, main_window=None):
        super().__init__()
        self.main_window = main_window    # remember who the main window is
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Graph Window")
        self.setGeometry(560, 100, 300, 200)
```

* `main_window=None` - a new parameter. The main window will be passed in here.
* `self.main_window = main_window` - saves it, so every method of `GraphWindow` can use it later.

> **Important:** do **not** write `super().__init__(main_window)`. Giving a widget a parent puts it **inside** the parent, so the "window" would appear as a part of the main window instead of as a separate window.

## Step 2: Create the Second Window in the Main Window

The main window creates the second window **once**, in its `__init__`:

```python
class HeatTransferWidget(QWidget):

    def __init__(self):
        super().__init__()
        self.graph_window = GraphWindow(self)    # create the second window
        self.initUI()
```

* `GraphWindow(self)` - creates the second window and passes **`self`** (the main window) to it. This is how the second window gets its `main_window`.
* `self.graph_window = ...` - saves the second window, so every method of the main window can use it.

The second window now exists, but it is **not visible yet**. Nothing calls `show()` on it.

**Why create it in `__init__`?**

* There is only **one** second window for the whole program.
* Its widgets and data are kept even when it is hidden. When it appears again, it looks the same as before.

## Step 3: Show and Hide

Every window has two methods that control whether it is visible:

| Method | What it does |
|---|---|
| `show()` | Makes the window appear |
| `hide()` | Makes the window disappear (it still exists, with all its data) |
| `isVisible()` | Returns `True` if the window is currently shown |

Add two buttons to the main window that show and hide the second window:

```python
    def initUI(self):
        self.setWindowTitle("Main Window")
        self.setGeometry(100, 100, 400, 200)

        self.show_button = QPushButton("Show graph", self)
        self.show_button.setGeometry(30, 80, 120, 40)
        self.show_button.clicked.connect(self.show_clicked)

        self.hide_button = QPushButton("Hide graph", self)
        self.hide_button.setGeometry(170, 80, 120, 40)
        self.hide_button.clicked.connect(self.hide_clicked)

    def show_clicked(self):
        self.graph_window.show()

    def hide_clicked(self):
        self.graph_window.hide()
```

The second window can also hide **itself**, with `self.hide()`:

```python
    # inside GraphWindow
    def close_clicked(self):
        self.hide()
```

> **Note:** clicking the **X** of the second window also just hides it. You can show it again later with `show()`.

## Step 4: Sharing Data Between the Windows

Each window can reach the other one, and through it, all of its widgets and methods.

### Main window → second window

Use **`self.graph_window`**:

```python
    # inside HeatTransferWidget
    def temperature_changed(self, value):
        self.graph_window.update_temperature(value)
```

This calls a method of the second window:

```python
    # inside GraphWindow
    def update_temperature(self, value):
        self.temp_label.setText(f"Temperature: {value}")
```

### Second window → main window

Use **`self.main_window`**:

```python
    # inside GraphWindow
    def reset_clicked(self):
        self.main_window.temp_spin.setValue(20)
```

This changes the spin box that lives in the main window.

### In short

| Code is written in... | To reach the other window, use... | Example |
|---|---|---|
| `HeatTransferWidget` (main) | `self.graph_window` | `self.graph_window.temp_label.setText("Hi")` |
| `GraphWindow` (second) | `self.main_window` | `self.main_window.temp_spin.value()` |

> **Tip:** you can reach the other window's widgets directly, like `self.main_window.temp_spin`. Calling one of its **methods** is usually cleaner, like `self.graph_window.update_temperature(value)`. That way, each window is responsible for its own widgets.

## Step 5: Closing Both Windows Together

A PySide6 program keeps running while **any** of its windows is open. If the user closes the main window while the second window is still visible, the program does not end.

To close the second window together with the main window, add this method to the main window:

```python
    # inside HeatTransferWidget
    def closeEvent(self, event):
        self.graph_window.close()
```

`closeEvent` is a special method name. PySide6 calls it automatically when the window is closed.

## The Complete Program

![The complete program](content/images/pyside_oop_two_windows.png)

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton, QSpinBox


class GraphWindow(QWidget):

    def __init__(self, main_window=None):
        super().__init__()
        self.main_window = main_window
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Graph Window")
        self.setGeometry(560, 100, 300, 200)

        self.temp_label = QLabel("Temperature: 20", self)
        self.temp_label.setGeometry(30, 30, 240, 30)

        self.reset_button = QPushButton("Reset temperature", self)
        self.reset_button.setGeometry(30, 80, 150, 40)
        self.reset_button.clicked.connect(self.reset_clicked)

        self.close_button = QPushButton("Close", self)
        self.close_button.setGeometry(30, 130, 150, 40)
        self.close_button.clicked.connect(self.close_clicked)

    def update_temperature(self, value):
        self.temp_label.setText(f"Temperature: {value}")

    def reset_clicked(self):
        self.main_window.temp_spin.setValue(20)

    def close_clicked(self):
        self.hide()


class HeatTransferWidget(QWidget):

    def __init__(self):
        super().__init__()
        self.graph_window = GraphWindow(self)
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Main Window")
        self.setGeometry(100, 100, 400, 200)

        self.temp_spin = QSpinBox(self)
        self.temp_spin.setGeometry(30, 30, 100, 30)
        self.temp_spin.setRange(-50, 150)
        self.temp_spin.setValue(20)
        self.temp_spin.valueChanged.connect(self.temperature_changed)

        self.show_button = QPushButton("Show graph", self)
        self.show_button.setGeometry(30, 80, 120, 40)
        self.show_button.clicked.connect(self.show_clicked)

        self.hide_button = QPushButton("Hide graph", self)
        self.hide_button.setGeometry(170, 80, 120, 40)
        self.hide_button.clicked.connect(self.hide_clicked)

    def temperature_changed(self, value):
        self.graph_window.update_temperature(value)

    def show_clicked(self):
        self.graph_window.show()

    def hide_clicked(self):
        self.graph_window.hide()

    def closeEvent(self, event):
        self.graph_window.close()


if __name__ == "__main__":
    app = QApplication()
    window = HeatTransferWidget()
    window.show()
    app.exec()
```

Try it:

* Click **Show graph** to open the second window.
* Change the number in the main window. The second window's label updates (main → second).
* Click **Reset temperature** in the second window. The main window's number goes back to 20 (second → main).
* Use **Hide graph**, **Close** and **Show graph** to hide and show the second window.
