# PySide6 Layouts

With `setGeometry`, widgets keep their exact place and size, even when the window is resized. A **layout** places the widgets for you: you give it only the **order** of the widgets, and it sets their positions and sizes, and updates them when the window changes size.

## The 3 Steps

1. Create the widgets **without** a parent and **without** `setGeometry`.
2. Create a layout and add the widgets with `addWidget`, in order.
3. Give the layout to the window: `self.setLayout(layout)`.

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout


class NameWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("QVBoxLayout")

        self.label = QLabel("Enter your name:")
        self.name_input = QLineEdit()
        self.hello_button = QPushButton("Say Hello")

        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.name_input)
        layout.addWidget(self.hello_button)

        self.setLayout(layout)


if __name__ == "__main__":
    app = QApplication()
    window = NameWindow()
    window.show()
    app.exec()
```

In the images below, the right window shows the layout's boxes drawn on top.

## `QVBoxLayout`: One Under the Other

![QVBoxLayout: the label, the line edit and the button one under the other](content/images/pyside_box_vbox.png)

## `QHBoxLayout`: Side by Side

Same steps, with `QHBoxLayout()` instead:

```python
        layout = QHBoxLayout()
        layout.addWidget(self.label)          # QLabel("Name:")
        layout.addWidget(self.name_input)
        layout.addWidget(self.ok_button)
```

![QHBoxLayout: the label, the line edit and the button side by side](content/images/pyside_box_hbox.png)

## `QBoxLayout`: Any Direction

`QHBoxLayout` and `QVBoxLayout` are shortcuts for `QBoxLayout` with a direction:

```python
layout = QBoxLayout(QBoxLayout.LeftToRight)    # like QHBoxLayout
layout = QBoxLayout(QBoxLayout.TopToBottom)    # like QVBoxLayout
layout = QBoxLayout(QBoxLayout.RightToLeft)
layout = QBoxLayout(QBoxLayout.BottomToTop)
```

![The same 3 buttons in the 4 directions of QBoxLayout](content/images/pyside_box_directions.png)

## Stretch: Push Widgets to a Side

`layout.addStretch()` adds an invisible spring that takes the empty space:

![Two buttons with no stretch, a stretch after, before, and on both sides](content/images/pyside_box_stretch.png)

```python
        layout = QHBoxLayout()
        layout.addStretch()                   # OK and Cancel on the right
        layout.addWidget(self.ok_button)
        layout.addWidget(self.cancel_button)
```

## Layouts Inside Layouts

Draw boxes around the rows of your window. Each row is a `QHBoxLayout`, and they go one under the other in a main `QVBoxLayout`. Use `addLayout` to add a layout:

![A Chat window: two QHBoxLayout rows inside a QVBoxLayout](content/images/pyside_box_nested.png)

```python
        top_layout = QHBoxLayout()
        top_layout.addWidget(self.to_label)
        top_layout.addWidget(self.to_input)

        bottom_layout = QHBoxLayout()
        bottom_layout.addWidget(self.message_input)
        bottom_layout.addWidget(self.send_button)

        main_layout = QVBoxLayout()
        main_layout.addLayout(top_layout)          # a layout inside a layout
        main_layout.addWidget(self.messages_box)
        main_layout.addLayout(bottom_layout)

        self.setLayout(main_layout)                # only the main layout
```

## In Short

| I want... | Use |
|---|---|
| Widgets one under the other | `QVBoxLayout()` |
| Widgets side by side | `QHBoxLayout()` |
| Another direction | `QBoxLayout(QBoxLayout.RightToLeft)` |
| Push widgets to a side | `layout.addStretch()` before or after them |
| A layout inside a layout | `main_layout.addLayout(inner_layout)` |
| Give the layout to the window | `self.setLayout(main_layout)` |
