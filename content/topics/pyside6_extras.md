# Extras

Two more things that make a PySide6 program look and feel like a "real" application: a **menu bar** at the top of the window, and **splitters** that let the user drag to resize parts of the window.

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
