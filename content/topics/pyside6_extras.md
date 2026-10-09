# Extras

Three more things that make a PySide6 program look and feel like a "real" application: a **menu bar** at the top of the window, **splitters** that let the user drag to resize parts of the window, and **layouts** that arrange the widgets by themselves and adjust them when the window changes its size.

## Part 1: The Upper Menu Bar

The menu bar is the row at the top of the window with menus like **File**, **Edit** and **Help**. Clicking a menu opens a list of items, and clicking an item runs a method, just like clicking a button.

### Step 1: Use `QMainWindow` Instead of `QWidget`

Until now our window class inherited from `QWidget`. A plain `QWidget` has no menu bar. For a menu bar we use **`QMainWindow`**, which is a window that already has a place for a menu bar at the top (and for a status bar at the bottom).

```python
from PySide6.QtWidgets import QApplication, QMainWindow


class MyWindow(QMainWindow):        # QMainWindow instead of QWidget

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)
```

Everything else stays the same: `super().__init__()`, `initUI`, `setWindowTitle`, `setGeometry`, and the `if __name__ == "__main__":` part.

### Step 2: The Central Widget

There is one difference in how widgets are added. A `QMainWindow` has a few areas: the menu bar at the top, the status bar at the bottom, and the **central widget** in the middle. Our own widgets go in the central widget.

If you create widgets with `self` as their parent, like before, they are placed at the top-left corner of the window, **under** the menu bar, and the menu bar hides them.

The fix: create an empty `QWidget`, make it the central widget, and use **it** as the parent of your widgets:

```python
    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)

        self.central = QWidget()
        self.setCentralWidget(self.central)

        self.label = QLabel("Hello", self.central)      # parent is self.central, not self
        self.label.setGeometry(30, 20, 200, 30)
```

The position `(30, 20)` is now measured from the top-left corner of the central widget, which starts **below** the menu bar. So `setGeometry` works exactly as you are used to.

### Step 3: Create a Menu

Get the window's menu bar with `self.menuBar()`, and add a menu to it with `addMenu`:

```python
        menu_bar = self.menuBar()
        file_menu = menu_bar.addMenu("File")
        help_menu = menu_bar.addMenu("Help")
```

The menus appear in the menu bar in the order they were added.

### Step 4: Add Items (Actions) to the Menu

An item in a menu is called an **action** (`QAction`). It is imported from `PySide6.QtGui`:

```python
from PySide6.QtGui import QAction
```

Adding an item has 3 steps, very similar to a button:

1. Create the action with its text, and `self` as its parent.
2. Connect its **`triggered`** signal to a method. `triggered` is the action's version of a button's `clicked`.
3. Add the action to the menu.

```python
        self.clear_action = QAction("Clear", self)                 # 1. create
        self.clear_action.triggered.connect(self.clear_clicked)    # 2. connect
        file_menu.addAction(self.clear_action)                     # 3. add to the menu
```

Use `addSeparator()` to draw a line between groups of items:

```python
        file_menu.addAction(self.clear_action)
        file_menu.addSeparator()
        file_menu.addAction(self.exit_action)
```

### Keyboard Shortcuts

An action can also be triggered from the keyboard. Set the shortcut with `setShortcut`, and PySide6 writes it next to the item in the menu by itself:

```python
        self.exit_action = QAction("Exit", self)
        self.exit_action.setShortcut("Ctrl+Q")
        self.exit_action.triggered.connect(self.close)
```

Now **Ctrl+Q** closes the window, even when the menu is not open.

Notice `self.close`: the window already has a `close` method, so we can connect to it directly, without writing a method of our own.

### Menus Inside Menus

A menu can contain another menu (a **submenu**). Call `addMenu` on the menu instead of on the menu bar:

```python
        edit_menu = menu_bar.addMenu("Edit")
        case_menu = edit_menu.addMenu("Change Case")     # a submenu inside Edit
        case_menu.addAction(self.upper_action)
        case_menu.addAction(self.lower_action)
```

### Check Items (On/Off)

An action can be **checkable**, like a check box: every click switches it between on and off, and a check mark is shown next to it when it is on. Its `toggled` signal sends `True` or `False`, exactly like a toggle button:

```python
        self.bold_action = QAction("Bold", self)
        self.bold_action.setCheckable(True)
        self.bold_action.toggled.connect(self.bold_toggled)

    def bold_toggled(self, checked):
        if checked:
            print("Bold is on")
        else:
            print("Bold is off")
```

### Example: A Small Text Editor

The window has a text box (`QTextEdit`), and three menus:

* **File**: Clear, and Exit (Ctrl+Q).
* **Edit**: a **Change Case** submenu with UPPER CASE and lower case.
* **View**: a checkable **Read Only** item.

```python
from PySide6.QtWidgets import QApplication, QMainWindow, QWidget, QTextEdit
from PySide6.QtGui import QAction


class EditorWindow(QMainWindow):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Small Editor")
        self.setGeometry(100, 100, 500, 350)

        # ----- the central widget and its widgets -----
        self.central = QWidget()
        self.setCentralWidget(self.central)

        self.text_box = QTextEdit(self.central)
        self.text_box.setGeometry(10, 10, 480, 300)

        # ----- the actions -----
        self.clear_action = QAction("Clear", self)
        self.clear_action.triggered.connect(self.clear_clicked)

        self.exit_action = QAction("Exit", self)
        self.exit_action.setShortcut("Ctrl+Q")
        self.exit_action.triggered.connect(self.close)

        self.upper_action = QAction("UPPER CASE", self)
        self.upper_action.triggered.connect(self.upper_clicked)

        self.lower_action = QAction("lower case", self)
        self.lower_action.triggered.connect(self.lower_clicked)

        self.read_only_action = QAction("Read Only", self)
        self.read_only_action.setCheckable(True)
        self.read_only_action.toggled.connect(self.read_only_toggled)

        # ----- the menus -----
        menu_bar = self.menuBar()

        file_menu = menu_bar.addMenu("File")
        file_menu.addAction(self.clear_action)
        file_menu.addSeparator()
        file_menu.addAction(self.exit_action)

        edit_menu = menu_bar.addMenu("Edit")
        case_menu = edit_menu.addMenu("Change Case")
        case_menu.addAction(self.upper_action)
        case_menu.addAction(self.lower_action)

        view_menu = menu_bar.addMenu("View")
        view_menu.addAction(self.read_only_action)

    def clear_clicked(self):
        self.text_box.clear()

    def upper_clicked(self):
        text = self.text_box.toPlainText()
        self.text_box.setPlainText(text.upper())

    def lower_clicked(self):
        text = self.text_box.toPlainText()
        self.text_box.setPlainText(text.lower())

    def read_only_toggled(self, checked):
        self.text_box.setReadOnly(checked)


if __name__ == "__main__":
    app = QApplication()
    window = EditorWindow()
    window.show()
    app.exec()
```

Notice:

* The actions are created first, and only then added to the menus. This keeps the code organized: all the "what does each item do" in one place, and all the "where does it appear" in another.
* The methods connected to the actions are written exactly like the methods connected to buttons.

> **Note for Mac users:** on macOS the menu bar is not shown inside the window. It appears at the top of the screen, like in every other Mac program. The code is the same.

## Part 2: Splitters

A **splitter** (`QSplitter`) divides an area into parts, with a thin handle between them. The user can **drag the handle** to make one part bigger and the other smaller. You have seen this in many programs: for example, VS Code, where you can drag the border between the file list and the code.

`QSplitter` is imported from `PySide6.QtWidgets`, and the direction of the split (`Qt`) from `PySide6.QtCore`:

```python
from PySide6.QtWidgets import QSplitter
from PySide6.QtCore import Qt
```

### Creating a Splitter

1. Create the splitter, with its direction:
   * `Qt.Horizontal` - the parts are side by side (left and right).
   * `Qt.Vertical` - the parts are one above the other (top and bottom).
2. Add widgets to it with `addWidget`. Each widget becomes one part, in the order they were added.

```python
        self.splitter = QSplitter(Qt.Horizontal)
        self.splitter.addWidget(self.left_text)     # left part
        self.splitter.addWidget(self.right_text)    # right part
```

The widgets added to a splitter are created **without** a parent and **without** `setGeometry`. The splitter becomes their parent, and it decides their size and position by itself.

### Making the Splitter Fill the Window

A splitter is most useful when it fills the whole window, so when the user makes the window bigger, the parts grow too. The easy way to do this is in a `QMainWindow`: make the splitter the **central widget**:

```python
        self.setCentralWidget(self.splitter)
```

The central widget always fills the window (below the menu bar), so the splitter does too.

### Setting the Starting Sizes

By default the splitter divides the space between the parts by itself. To choose the starting sizes, give `setSizes` a list with the size of each part in pixels, in the same order the widgets were added:

```python
        self.splitter.setSizes([150, 350])    # left part 150 pixels, right part 350 pixels
```

The user can still drag the handle afterwards.

### Stopping a Part From Disappearing

If the user drags the handle all the way to the side, the part on that side **collapses**: it disappears completely. To prevent this:

```python
        self.splitter.setChildrenCollapsible(False)
```

### A Part With Several Widgets

Each part of a splitter is **one** widget. To put several widgets in one part (for example, a line edit and a button), create an empty `QWidget` as a **panel**, put your widgets in the panel with `setGeometry` like always, and add the panel to the splitter:

```python
        self.left_panel = QWidget()

        self.name_input = QLineEdit(self.left_panel)        # parent is the panel
        self.name_input.setGeometry(10, 10, 130, 30)

        self.add_button = QPushButton("Add", self.left_panel)
        self.add_button.setGeometry(10, 50, 130, 30)

        self.splitter.addWidget(self.left_panel)            # the whole panel is one part
```

### Splitters Inside Splitters

A splitter is a widget too, so it can be added to **another** splitter. This is how you build a window that is divided both left/right and top/bottom.

For example: a left part, and a right side divided into top and bottom:

```python
        self.right_splitter = QSplitter(Qt.Vertical)
        self.right_splitter.addWidget(self.top_text)
        self.right_splitter.addWidget(self.bottom_text)

        self.main_splitter = QSplitter(Qt.Horizontal)
        self.main_splitter.addWidget(self.left_panel)
        self.main_splitter.addWidget(self.right_splitter)   # a splitter inside a splitter

        self.setCentralWidget(self.main_splitter)
```

```
+-----------+---------------------+
|           |      top_text       |
|   left    |                     |
|   panel   +---------------------+
|           |    bottom_text      |
|           |                     |
+-----------+---------------------+
```

### Example: Menu Bar and Splitters Together

The window has three parts:

* **Left**: a panel with a line edit and an **Add** button.
* **Right top**: a text box that gets every line that was added.
* **Right bottom**: a label that shows how many lines were added.

And a menu bar with **File > Clear** and **File > Exit**.

```python
from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QSplitter,
                               QLineEdit, QPushButton, QTextEdit, QLabel)
from PySide6.QtGui import QAction
from PySide6.QtCore import Qt


class NotesWindow(QMainWindow):

    def __init__(self):
        super().__init__()
        self.count = 0
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Notes")
        self.setGeometry(100, 100, 600, 400)

        # ----- left part: a panel with a line edit and a button -----
        self.left_panel = QWidget()

        self.note_input = QLineEdit(self.left_panel)
        self.note_input.setGeometry(10, 10, 160, 30)

        self.add_button = QPushButton("Add", self.left_panel)
        self.add_button.setGeometry(10, 50, 160, 30)
        self.add_button.clicked.connect(self.add_clicked)

        # ----- right part: a text box above a label -----
        self.notes_box = QTextEdit()
        self.notes_box.setReadOnly(True)

        self.count_label = QLabel("0 notes")

        self.right_splitter = QSplitter(Qt.Vertical)
        self.right_splitter.addWidget(self.notes_box)
        self.right_splitter.addWidget(self.count_label)
        self.right_splitter.setSizes([300, 50])

        # ----- the main splitter fills the window -----
        self.main_splitter = QSplitter(Qt.Horizontal)
        self.main_splitter.addWidget(self.left_panel)
        self.main_splitter.addWidget(self.right_splitter)
        self.main_splitter.setSizes([180, 420])
        self.main_splitter.setChildrenCollapsible(False)

        self.setCentralWidget(self.main_splitter)

        # ----- the menu bar -----
        self.clear_action = QAction("Clear", self)
        self.clear_action.triggered.connect(self.clear_clicked)

        self.exit_action = QAction("Exit", self)
        self.exit_action.setShortcut("Ctrl+Q")
        self.exit_action.triggered.connect(self.close)

        file_menu = self.menuBar().addMenu("File")
        file_menu.addAction(self.clear_action)
        file_menu.addSeparator()
        file_menu.addAction(self.exit_action)

    def add_clicked(self):
        self.notes_box.append(self.note_input.text())
        self.note_input.clear()
        self.count = self.count + 1
        self.count_label.setText(str(self.count) + " notes")

    def clear_clicked(self):
        self.notes_box.clear()
        self.count = 0
        self.count_label.setText("0 notes")


if __name__ == "__main__":
    app = QApplication()
    window = NotesWindow()
    window.show()
    app.exec()
```

Notice:

* `self.setGeometry(...)` is still used for the **window** itself. Inside the splitters, only the widgets in the left panel use `setGeometry`, because they are placed inside the panel, not directly in a splitter.
* `self.right_splitter.setChildrenCollapsible(False)` was not called, so the user can drag the lower handle all the way down and hide the label. Try it.
* Make the window bigger: the text box grows, but the line edit and the button in the left panel keep their size, because they were placed with `setGeometry`.

## Part 3: Layouts

### The Problem With `setGeometry`

Until now every widget was placed with `setGeometry`: an exact position and an exact size, in pixels. This is simple, but the widgets **never change**. When the user makes the window bigger, the widgets stay small in the corner, and the rest of the window is empty:

![The same window, small and big. With setGeometry the widgets keep their place and size](content/images/pyside_layout_problem.png)

And when the window is made smaller, widgets are cut off. There are more problems: a longer text in a label may not fit in the size you chose, and on a screen with bigger fonts everything may overlap.

A **layout** solves this. Instead of telling every widget exactly where to be, you tell the layout the **order** of the widgets: "one under the other", or "side by side", or "in a table". The layout calculates the positions and sizes by itself, and calculates them again every time the window changes its size.

All the layouts are imported from `PySide6.QtWidgets`.

### The Basic Steps

Using a layout has 3 steps:

1. Create the widgets **without** a parent and **without** `setGeometry`.
2. Create the layout and add the widgets to it with `addWidget`, in order.
3. Give the layout to the window with `self.setLayout(layout)`.

```python
    def initUI(self):
        self.setWindowTitle("QVBoxLayout")

        self.label = QLabel("Enter your name:")      # 1. no parent, no setGeometry
        self.name_input = QLineEdit()
        self.ok_button = QPushButton("OK")

        layout = QVBoxLayout()                        # 2. create the layout
        layout.addWidget(self.label)                  #    and add the widgets, in order
        layout.addWidget(self.name_input)
        layout.addWidget(self.ok_button)

        self.setLayout(layout)                        # 3. the window uses the layout
```

* There is no need for a parent: `setLayout` makes the window the parent of all the widgets in the layout.
* The widgets are still saved with `self.`, because the methods of the class need them. The layout itself is not needed after `initUI`, so a plain variable `layout` is fine.
* The window can still get a starting size with `self.setGeometry(...)`. The layout fills whatever size the window has.

There are 4 common layouts. In the images below, the left window is what the user sees, and the right window shows the layout's boxes drawn on top.

### `QVBoxLayout`: One Under the Other

**V** for **vertical**. Every `addWidget` puts the widget **below** the previous one. The code above creates this window:

![QVBoxLayout: the label, the line edit and the button one under the other](content/images/pyside_layout_vbox.png)

Every widget gets the full width of the window. The label got the extra height, which does not look good. This is fixed with a **stretch**, explained below.

### `QHBoxLayout`: Side by Side

**H** for **horizontal**. Every `addWidget` puts the widget to the **right** of the previous one:

```python
        self.back_button = QPushButton("Back")
        self.next_button = QPushButton("Next")
        self.cancel_button = QPushButton("Cancel")

        layout = QHBoxLayout()
        layout.addWidget(self.back_button)
        layout.addWidget(self.next_button)
        layout.addWidget(self.cancel_button)

        self.setLayout(layout)
```

![QHBoxLayout: three buttons side by side](content/images/pyside_layout_hbox.png)

### `QGridLayout`: A Table of Rows and Columns

In a grid, `addWidget` also gets the **row** and the **column** of the widget. Rows and columns are counted from 0, like a list:

```python
        layout.addWidget(self.some_button, 1, 2)     # row 1, column 2
```

A widget can also take more than one cell. Two more numbers give how many **rows** and how many **columns** it takes:

```python
        layout.addWidget(self.display, 0, 0, 1, 3)   # row 0, column 0, 1 row high, 3 columns wide
```

Example: the keys of a calculator. The display takes the 3 columns of row 0, and the `0` key takes 2 columns:

```python
        layout = QGridLayout()

        self.display = QLineEdit("0")
        layout.addWidget(self.display, 0, 0, 1, 3)

        texts = ["7", "8", "9", "4", "5", "6", "1", "2", "3"]
        for i in range(9):
            button = QPushButton(texts[i])
            layout.addWidget(button, 1 + i // 3, i % 3)

        layout.addWidget(QPushButton("0"), 4, 0, 1, 2)
        layout.addWidget(QPushButton("="), 4, 2)

        self.setLayout(layout)
```

![QGridLayout: a calculator keypad, with the row and column of every cell](content/images/pyside_layout_grid.png)

The numbers in the corners of the right window are `row,column`, and the size of the widgets that take more than one cell.

The loop calculates the place of each of the 9 buttons: `i // 3` is the row (0, 0, 0, 1, 1, 1, ...) and `i % 3` is the column (0, 1, 2, 0, 1, 2, ...). The row starts at 1, because row 0 is the display.

> **Note:** to connect the buttons that were created in the loop, connect each one inside the loop, for example `button.clicked.connect(self.digit_clicked)`. In `digit_clicked`, `self.sender().text()` tells you which button was clicked.

### `QFormLayout`: Labels and Fields

A form is a common case: a column of labels on the left, and a column of fields on the right. `QFormLayout` does exactly this. `addRow` gets the label's text and the field, and creates the label by itself:

```python
        self.name_input = QLineEdit()
        self.age_input = QSpinBox()
        self.email_input = QLineEdit()

        layout = QFormLayout()
        layout.addRow("Name:", self.name_input)
        layout.addRow("Age:", self.age_input)
        layout.addRow("Email:", self.email_input)

        self.setLayout(layout)
```

![QFormLayout: labels on the left, fields on the right](content/images/pyside_layout_form.png)

The labels column is exactly as wide as the longest label, and the fields get the rest of the width.

### Stretch: Empty Space That Pushes

In the `QVBoxLayout` example, the extra height was given to the label, and the widgets were spread over the window. Usually we want the widgets to stay together at the top, and the empty space to be at the bottom.

`addStretch()` adds an **invisible spring** to the layout. The spring takes all the extra space, and pushes the widgets away from it:

```python
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.name_input)
        layout.addWidget(self.ok_button)
        layout.addStretch()                  # all the extra space goes here, at the bottom
```

![Without addStretch the widgets are spread over the window. With addStretch they stay at the top](content/images/pyside_layout_stretch.png)

Where you put the stretch decides where the widgets go:

* Stretch **after** the widgets: the widgets are pushed to the **start** (top, or left).
* Stretch **before** the widgets: the widgets are pushed to the **end** (bottom, or right).
* Stretch **before and after**: the widgets are in the **middle**.

A very common use: buttons on the right side of a window, like **OK** and **Cancel** in many programs. Add a stretch **before** the buttons:

```python
        layout = QHBoxLayout()
        layout.addStretch()                  # pushes the buttons to the right
        layout.addWidget(self.back_button)
        layout.addWidget(self.next_button)
        layout.addWidget(self.cancel_button)
```

![Without addStretch the buttons share the width. With addStretch before them, they are pushed to the right](content/images/pyside_layout_hstretch.png)

### Stretch Factor: Who Gets More Space

When two widgets can both grow, they share the extra space equally. To give one of them more, add a **stretch factor** as a second value to `addWidget`. The space is divided by the ratio of the numbers:

```python
        layout = QHBoxLayout()
        layout.addWidget(self.left_text, 1)      # gets 1 part
        layout.addWidget(self.right_text, 2)     # gets 2 parts: twice as wide
```

![Stretch factors 1 and 2: the right text box is twice as wide as the left one](content/images/pyside_layout_stretch_factor.png)

### Layouts Inside Layouts

Real windows are not just one column or one row. The solution is to put layouts **inside** layouts. `addLayout` adds a whole layout to another layout, as if it were one widget.

Example: a **Sign Up** window. It is built from 3 parts, one under the other, so the main layout is a `QVBoxLayout`:

1. A form with the user's details: a `QFormLayout`.
2. A row of buttons on the right: a `QHBoxLayout` with a stretch before the buttons.
3. A text box that lists the users that were added.

![Layouts inside layouts: a form layout and a buttons layout inside a vertical main layout](content/images/pyside_layout_nested.png)

The trick is to **plan first**: look at the window you want, and draw boxes around groups of widgets, like in the right window. Every box is a layout. Then write the code from the inside out: first the small layouts, then the main layout that holds them.

```python
from PySide6.QtWidgets import (QApplication, QWidget, QLineEdit, QSpinBox, QPushButton,
                               QTextEdit, QVBoxLayout, QHBoxLayout, QFormLayout)


class SignUpWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Sign Up")
        self.setGeometry(100, 100, 340, 300)

        # ----- 1. the form -----
        self.name_input = QLineEdit()
        self.age_input = QSpinBox()
        self.email_input = QLineEdit()

        form_layout = QFormLayout()
        form_layout.addRow("Name:", self.name_input)
        form_layout.addRow("Age:", self.age_input)
        form_layout.addRow("Email:", self.email_input)

        # ----- 2. the buttons, pushed to the right -----
        self.add_button = QPushButton("Add")
        self.add_button.clicked.connect(self.add_clicked)
        self.clear_button = QPushButton("Clear")
        self.clear_button.clicked.connect(self.clear_clicked)

        buttons_layout = QHBoxLayout()
        buttons_layout.addStretch()
        buttons_layout.addWidget(self.add_button)
        buttons_layout.addWidget(self.clear_button)

        # ----- 3. the list of users -----
        self.users_box = QTextEdit()
        self.users_box.setReadOnly(True)

        # ----- the main layout holds everything -----
        main_layout = QVBoxLayout()
        main_layout.addLayout(form_layout)          # a layout inside a layout
        main_layout.addLayout(buttons_layout)       # a layout inside a layout
        main_layout.addWidget(self.users_box)

        self.setLayout(main_layout)

    def add_clicked(self):
        line = self.name_input.text() + ", " + str(self.age_input.value()) + ", " + self.email_input.text()
        self.users_box.append(line)
        self.name_input.clear()
        self.age_input.setValue(0)
        self.email_input.clear()

    def clear_clicked(self):
        self.users_box.clear()


if __name__ == "__main__":
    app = QApplication()
    window = SignUpWindow()
    window.show()
    app.exec()
```

Notice:

* Only the main layout is given to the window with `self.setLayout`. The other layouts are inside it.
* `addLayout` is used for a layout, and `addWidget` for a widget. Both can be used in the same layout.
* The text box is the only widget that can grow in height, so it gets all the extra height. Nothing else needs a stretch.

Now make the window bigger. Everything adjusts by itself: the fields get wider, the buttons stay on the right, and the text box gets all the new space:

![The Sign Up window at two sizes. The widgets grow with the window](content/images/pyside_layout_resize.png)

### Spacing and Margins

Two methods change the empty space a layout leaves:

```python
        layout.setSpacing(20)                     # 20 pixels between the widgets
        layout.setContentsMargins(5, 5, 5, 5)     # space around the edges: left, top, right, bottom
```

Use `setContentsMargins(0, 0, 0, 0)` on an inner layout when you want it to touch the edges exactly.

### Layouts With a Menu Bar and Splitters

Layouts work together with the first two parts:

* **In a `QMainWindow`**, the layout is not given to the window itself (it already has its own layout, for the menu bar and the central widget). Give it to the **central widget** instead:

  ```python
          self.central = QWidget()
          self.setCentralWidget(self.central)
          self.central.setLayout(main_layout)        # not self.setLayout
  ```

* **In a splitter**, a panel can use a layout instead of `setGeometry`. Then the widgets in the panel grow and shrink when the user drags the splitter's handle:

  ```python
          self.left_panel = QWidget()
          panel_layout = QVBoxLayout()
          panel_layout.addWidget(self.note_input)
          panel_layout.addWidget(self.add_button)
          panel_layout.addStretch()
          self.left_panel.setLayout(panel_layout)
  ```

> **Note:** a widget is placed **either** with `setGeometry` **or** with a layout, not both. If a widget is in a layout, the layout decides its position and size, and `setGeometry` is ignored.

## In Short

| I want to... | Use |
|---|---|
| A window with a menu bar | Inherit from `QMainWindow` instead of `QWidget` |
| Place my widgets under the menu bar | `self.central = QWidget()`, `self.setCentralWidget(self.central)`, and `self.central` as the parent |
| Add a menu | `file_menu = self.menuBar().addMenu("File")` |
| Add an item to a menu | `QAction("Text", self)`, connect `triggered`, then `file_menu.addAction(...)` |
| A line between items | `file_menu.addSeparator()` |
| A keyboard shortcut | `action.setShortcut("Ctrl+Q")` |
| A submenu | `sub_menu = file_menu.addMenu("Text")` |
| An on/off item | `action.setCheckable(True)`, connect `toggled` |
| Parts the user can resize | `QSplitter(Qt.Horizontal)` or `QSplitter(Qt.Vertical)`, then `addWidget` |
| A splitter that fills the window | `self.setCentralWidget(self.splitter)` |
| Starting sizes of the parts | `splitter.setSizes([150, 350])` |
| Parts that cannot disappear | `splitter.setChildrenCollapsible(False)` |
| Several widgets in one part | Put them in a `QWidget` panel, and add the panel |
| Widgets that adjust to the window's size | A layout: `addWidget` in order, then `self.setLayout(layout)` |
| Widgets one under the other | `QVBoxLayout()` |
| Widgets side by side | `QHBoxLayout()` |
| Widgets in rows and columns | `QGridLayout()`, `layout.addWidget(w, row, column)` |
| A widget that takes several cells | `layout.addWidget(w, row, column, rows, columns)` |
| Labels and fields | `QFormLayout()`, `layout.addRow("Name:", w)` |
| Push widgets to one side | `layout.addStretch()` before or after them |
| One widget gets more space | `layout.addWidget(w, 2)` (stretch factor) |
| A layout inside a layout | `main_layout.addLayout(inner_layout)` |
| A layout in a `QMainWindow` | `self.central.setLayout(layout)` |
