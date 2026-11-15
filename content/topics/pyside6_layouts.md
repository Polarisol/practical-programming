# PySide6 Layouts

Until now every widget was placed with `setGeometry`: an exact position and an exact size, in pixels. This page shows a better way: **layouts**. It explains what a layout is, and then the most useful family of layouts, the **box layouts**: `QBoxLayout`, `QHBoxLayout` and `QVBoxLayout`.

## What Is a Layout?

### The Problem With `setGeometry`

With `setGeometry` the widgets **never change**. When the user makes the window bigger, the widgets stay small in the corner, and the rest of the window is empty:

![The same window, small and big. With setGeometry the widgets keep their place and size](content/images/pyside_layout_problem.png)

And there are more problems:

* When the window is made **smaller**, widgets are cut off.
* A longer text in a label may not fit in the size you chose.
* On a screen with bigger fonts, widgets may overlap.
* Adding one widget in the middle means changing the numbers of all the widgets below it.

### The Idea

A **layout** is an object that arranges widgets for you. Instead of telling every widget exactly where to be, you tell the layout only the **order** of the widgets. The layout:

* calculates the position and the size of every widget by itself,
* calculates them again every time the window changes its size,
* leaves a small, even space between the widgets and around the edges.

A layout is **not** a widget. You can't see it. It only decides where the widgets go.

All the layouts are imported from `PySide6.QtWidgets`.

### The Basic Steps

Using a layout has 3 steps:

1. Create the widgets **without** a parent and **without** `setGeometry`.
2. Create the layout and add the widgets to it with `addWidget`, in order.
3. Give the layout to the window with `self.setLayout(layout)`.

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout


class NameWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("QVBoxLayout")
        self.setGeometry(100, 100, 320, 220)

        self.label = QLabel("Enter your name:")      # 1. no parent, no setGeometry
        self.name_input = QLineEdit()
        self.hello_button = QPushButton("Say Hello")

        layout = QVBoxLayout()                        # 2. create the layout
        layout.addWidget(self.label)                  #    and add the widgets, in order
        layout.addWidget(self.name_input)
        layout.addWidget(self.hello_button)

        self.setLayout(layout)                        # 3. the window uses the layout


if __name__ == "__main__":
    app = QApplication()
    window = NameWindow()
    window.show()
    app.exec()
```

* There is no need for a parent: `setLayout` makes the window the parent of all the widgets in the layout.
* The widgets are still saved with `self.`, because the methods of the class need them. The layout itself is not needed after `initUI`, so a plain variable `layout` is fine.
* `self.setGeometry(...)` on the **window** is still fine: it gives the window its starting position and size. The layout fills whatever size the window has.

> **Note:** a widget is placed **either** with `setGeometry` **or** with a layout, not both. If a widget is in a layout, the layout decides its position and size, and the widget's own `setGeometry` is ignored.

In the images on this page, the left window is what the user sees, and the right window shows the layout's boxes drawn on top: a dashed line for every layout, and a colored box for every widget.

## Box Layouts

A **box layout** puts the widgets in a **line**, one after the other. The line can be vertical (one under the other) or horizontal (side by side). There are 3 classes:

| Class | What it does |
|---|---|
| `QVBoxLayout` | A vertical line: one widget **under** the other |
| `QHBoxLayout` | A horizontal line: widgets **side by side** |
| `QBoxLayout` | The general box. You choose the direction yourself |

`QHBoxLayout` and `QVBoxLayout` are just `QBoxLayout` with a direction that is already chosen. In most programs you will use only these two.

### `QVBoxLayout`: One Under the Other

**V** for **vertical**. Every `addWidget` puts the widget **below** the previous one. This is the window of the code above:

![QVBoxLayout: the label, the line edit and the button one under the other](content/images/pyside_box_vbox.png)

* Every widget gets the **full width** of the window.
* The heights are not equal. A line edit and a button have a fixed height, they don't grow up and down. A label **can** grow, so it got all the extra height, and its text is in the middle of a big empty box. This does not look good, and it is fixed with a **stretch**, explained below.

### `QHBoxLayout`: Side by Side

**H** for **horizontal**. Every `addWidget` puts the widget to the **right** of the previous one:

```python
    def initUI(self):
        self.setWindowTitle("QHBoxLayout")
        self.setGeometry(100, 100, 400, 60)

        self.label = QLabel("Name:")
        self.name_input = QLineEdit()
        self.ok_button = QPushButton("OK")

        layout = QHBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.name_input)
        layout.addWidget(self.ok_button)

        self.setLayout(layout)
```

![QHBoxLayout: the label, the line edit and the button side by side](content/images/pyside_box_hbox.png)

* Every widget gets the **full height** of the layout.
* The widths are not equal. The label and the button are as wide as their text. The line edit likes to grow sideways, so it got all the extra width. This is exactly what we want in a row like this one.

### Who Gets the Extra Space?

Every widget knows how it likes to grow. You don't need to set this, but it explains what you see:

| Widget | Grows sideways? | Grows up and down? |
|---|---|---|
| `QLabel` | Can | Can |
| `QPushButton`, `QSpinBox`, `QComboBox` | Can | No |
| `QLineEdit` | **Likes to** | No |
| `QTextEdit`, `QTableWidget` | **Likes to** | **Likes to** |

Some widgets only **can** grow, and others **like** to grow. When there is extra space, the widgets that like to grow get it first. This is why, in the `QHBoxLayout` example, the line edit got all the extra width and the button did not. When widgets of the same kind are side by side, they share the extra space equally. Later on this page you'll see how to change this with a **stretch** and a **stretch factor**.

### `QBoxLayout`: The General Box

`QBoxLayout` gets the **direction** when it is created. There are 4 directions:

```python
from PySide6.QtWidgets import QBoxLayout

layout = QBoxLayout(QBoxLayout.LeftToRight)     # the same as QHBoxLayout()
layout = QBoxLayout(QBoxLayout.RightToLeft)     # side by side, the first widget on the right
layout = QBoxLayout(QBoxLayout.TopToBottom)     # the same as QVBoxLayout()
layout = QBoxLayout(QBoxLayout.BottomToTop)     # one under the other, the first widget at the bottom
```

Here are 4 windows. In each one, the buttons `1`, `2` and `3` were added in this order, with the same code. Only the direction is different:

![QBoxLayout in its 4 directions: LeftToRight, RightToLeft, TopToBottom and BottomToTop](content/images/pyside_box_directions.png)

The useful thing about `QBoxLayout` is that the direction can be **changed while the program runs**, with `setDirection`. For example, a button that switches the buttons between a row and a column:

```python
    def initUI(self):
        self.setWindowTitle("Switch direction")

        self.one_button = QPushButton("1")
        self.two_button = QPushButton("2")
        self.switch_button = QPushButton("Switch")
        self.switch_button.clicked.connect(self.switch_clicked)

        self.box_layout = QBoxLayout(QBoxLayout.LeftToRight)
        self.box_layout.addWidget(self.one_button)
        self.box_layout.addWidget(self.two_button)
        self.box_layout.addWidget(self.switch_button)

        self.setLayout(self.box_layout)

    def switch_clicked(self):
        if self.box_layout.direction() == QBoxLayout.LeftToRight:
            self.box_layout.setDirection(QBoxLayout.TopToBottom)
        else:
            self.box_layout.setDirection(QBoxLayout.LeftToRight)
```

This time the layout is saved as `self.box_layout`, because the method `switch_clicked` needs it. Don't call it `self.layout`: every widget already has a method called `layout()`.

## Controlling the Space

### Stretch: Empty Space That Pushes

`addStretch()` adds an **invisible spring** to a box layout. The spring takes all the extra space, and pushes the widgets away from it.

In the `QVBoxLayout` example, the label took the extra height. With a stretch at the end, the stretch takes it instead, and the widgets stay together at the top:

```python
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.name_input)
        layout.addWidget(self.hello_button)
        layout.addStretch()                  # all the extra space goes here, at the bottom
```

![Without addStretch the label takes the extra height. With addStretch the stretch takes it, and the widgets stay at the top](content/images/pyside_box_vstretch.png)

**Where** you put the stretch decides where the widgets go. Here are 4 windows with an `OK` and a `Cancel` button in a `QHBoxLayout`:

![Two buttons in a QHBoxLayout: without a stretch, with a stretch after them, before them, and on both sides](content/images/pyside_box_stretch.png)

* **No stretch**: the buttons share the whole width.
* Stretch **after** the widgets: the widgets are pushed to the **start** (left, or top).
* Stretch **before** the widgets: the widgets are pushed to the **end** (right, or bottom).
* Stretch **before and after**: the widgets are in the **middle**.

A very common use is the third one: `OK` and `Cancel` on the right side of a window, like in many programs:

```python
        layout = QHBoxLayout()
        layout.addStretch()                  # pushes the buttons to the right
        layout.addWidget(self.ok_button)
        layout.addWidget(self.cancel_button)
```

### Stretch Factor: Who Gets More Space

When two widgets both like to grow, like the two text boxes here, they share the extra space equally. To give one of them more, add a **stretch factor** as a second value to `addWidget`. The space is divided by the ratio of the numbers:

```python
        layout = QHBoxLayout()
        layout.addWidget(self.left_text, 1)      # gets 1 part
        layout.addWidget(self.right_text, 2)     # gets 2 parts: twice as wide
```

![Stretch factors 1 and 2: the right text box is twice as wide as the left one](content/images/pyside_box_stretch_factor.png)

`addStretch` can get a factor too. For example, `addStretch(1)` before the widgets and `addStretch(3)` after them leaves 1 part of empty space before and 3 parts after.

### Fixed Space

`addSpacing(pixels)` adds an empty space of an **exact** size, that does not grow. It is useful to separate groups of widgets:

```python
        layout = QVBoxLayout()
        layout.addWidget(self.name_input)
        layout.addWidget(self.age_input)
        layout.addSpacing(20)                    # 20 pixels between the fields and the button
        layout.addWidget(self.save_button)
```

### Alignment: A Widget That Does Not Fill Its Place

By default, a widget gets the full width of a `QVBoxLayout` (or the full height of a `QHBoxLayout`). To keep a widget in its natural size, and place it on one side or in the middle, give `addWidget` an **alignment**. `Qt` is imported from `PySide6.QtCore`:

```python
from PySide6.QtCore import Qt

        layout.addWidget(self.hello_button, alignment=Qt.AlignCenter)   # in the middle, not full width
        layout.addWidget(self.ok_button, alignment=Qt.AlignRight)       # on the right side
```

### Spacing and Margins

Two methods change the empty space that a layout leaves:

```python
        layout.setSpacing(20)                     # 20 pixels between the widgets
        layout.setContentsMargins(5, 5, 5, 5)     # space around the edges: left, top, right, bottom
```

## Layouts Inside Layouts

Real windows are not just one row or one column. The solution is to put box layouts **inside** box layouts. `addLayout` adds a whole layout to another layout, as if it were one widget.

Example: a **Chat** window. It has 3 parts, one under the other, so the main layout is a `QVBoxLayout`:

1. At the top, a row with the name of the friend: a `QHBoxLayout`.
2. In the middle, a text box with the messages.
3. At the bottom, a row with a line edit for a new message and a **Send** button: another `QHBoxLayout`.

![Layouts inside layouts: two QHBoxLayout rows inside a QVBoxLayout](content/images/pyside_box_nested.png)

The trick is to **plan first**: look at the window you want, and draw boxes around groups of widgets, like in the right window. Every row of widgets is a `QHBoxLayout`, and every column is a `QVBoxLayout`. Then write the code from the inside out: first the small layouts, then the main layout that holds them.

```python
from PySide6.QtWidgets import (QApplication, QWidget, QLabel, QLineEdit, QPushButton,
                               QTextEdit, QVBoxLayout, QHBoxLayout)


class ChatWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Chat")
        self.setGeometry(100, 100, 380, 280)

        # ----- 1. the top row -----
        self.to_label = QLabel("To:")
        self.to_input = QLineEdit()

        top_layout = QHBoxLayout()
        top_layout.addWidget(self.to_label)
        top_layout.addWidget(self.to_input)

        # ----- 2. the messages -----
        self.messages_box = QTextEdit()
        self.messages_box.setReadOnly(True)

        # ----- 3. the bottom row -----
        self.message_input = QLineEdit()
        self.message_input.returnPressed.connect(self.send_clicked)
        self.send_button = QPushButton("Send")
        self.send_button.clicked.connect(self.send_clicked)

        bottom_layout = QHBoxLayout()
        bottom_layout.addWidget(self.message_input)
        bottom_layout.addWidget(self.send_button)

        # ----- the main layout holds everything -----
        main_layout = QVBoxLayout()
        main_layout.addLayout(top_layout)           # a layout inside a layout
        main_layout.addWidget(self.messages_box)
        main_layout.addLayout(bottom_layout)        # a layout inside a layout

        self.setLayout(main_layout)

    def send_clicked(self):
        text = self.message_input.text()
        if text != "":
            self.messages_box.append("Me: " + text)
            self.message_input.clear()


if __name__ == "__main__":
    app = QApplication()
    window = ChatWindow()
    window.show()
    app.exec()
```

Notice:

* Only the main layout is given to the window with `self.setLayout`. The other layouts are inside it.
* `addLayout` is used for a layout, and `addWidget` for a widget. Both can be used in the same layout.
* The text box is the only widget that **likes** to grow in height, so it gets all the extra height. The two rows keep their height. Nothing needs a stretch.
* In each row, the line edit gets the extra width, and the label and the button stay as wide as their text.

Now make the window bigger. Everything adjusts by itself:

![The Chat window at two sizes. The text box and the line edits grow with the window](content/images/pyside_box_resize.png)

A layout inside a layout inside a layout also works, as deep as you need. For example, a `QHBoxLayout` with two `QVBoxLayout` columns, where each column has its own widgets.

## In Short

| I want to... | Use |
|---|---|
| Widgets that adjust to the window's size | A layout: `addWidget` in order, then `self.setLayout(layout)` |
| Widgets one under the other | `QVBoxLayout()` |
| Widgets side by side | `QHBoxLayout()` |
| Choose the direction myself | `QBoxLayout(QBoxLayout.RightToLeft)` (or `LeftToRight`, `TopToBottom`, `BottomToTop`) |
| Change the direction while the program runs | `layout.setDirection(QBoxLayout.TopToBottom)` |
| Push widgets to one side | `layout.addStretch()` before or after them |
| Widgets in the middle | `addStretch()` before **and** after them |
| One widget gets more space | `layout.addWidget(w, 2)` (stretch factor) |
| An exact empty space | `layout.addSpacing(20)` |
| A widget in its natural size, on one side | `layout.addWidget(w, alignment=Qt.AlignRight)` |
| Space between the widgets | `layout.setSpacing(20)` |
| Space around the edges | `layout.setContentsMargins(left, top, right, bottom)` |
| A layout inside a layout | `main_layout.addLayout(inner_layout)` |
