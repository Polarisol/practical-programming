# Widgets Reference

This page is a reference for the most common PySide6 widgets. For each widget you will find:

* **What it is** and when to use it
* **What it looks like**
* **What to import**
* **How to create it**
* **Set and get methods**
* **Other important methods**
* **Useful signals** and what they mean

All the examples assume you already have a `window` (see the PySide6 basics page):

```python
from PySide6.QtWidgets import QApplication, QWidget

app = QApplication()
window = QWidget()
window.setGeometry(100, 100, 600, 400)

# ... create your widgets here, with window as their parent ...

window.show()
app.exec()
```

## Methods Every Widget Has

Every widget below supports these methods, so they are not repeated for each widget:

```python
widget.setGeometry(x, y, width, height)  # position and size together
widget.move(x, y)                        # position only
widget.resize(width, height)             # size only
widget.setFixedSize(width, height)       # size that cannot change

widget.setEnabled(False)                 # grayed out, user cannot interact
widget.isEnabled()                       # True / False

widget.hide()                            # make invisible
widget.show()                            # make visible again
widget.setVisible(True)                  # same as show() / hide()

widget.setToolTip("Help text")           # text shown when the mouse hovers over it
widget.setStyleSheet("color: blue; font-size: 16px;")  # CSS styling
```

### A Reminder About Signals

A **signal** is emitted by a widget when something happens to it (a click, a new value, etc.). You connect a signal to your own function:

```python
widget.someSignal.connect(my_function)
```

Some signals **send a value** with them. In that case your function must accept a parameter:

```python
def on_value_changed(value):    # value is sent automatically by the signal
    print(value)

spin.valueChanged.connect(on_value_changed)
```

In the tables below, the value a signal sends is written in parentheses, e.g. `valueChanged(int)`. A signal written with `()` sends nothing, so your function should take no parameters.

## 1. Simple Label (`QLabel`)

A label shows **read-only text** on the window. The user cannot edit it. Labels are used for titles, descriptions and showing results.

![A simple label](content/images/widget_label.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QLabel
  from PySide6.QtCore import Qt          # only needed for alignment
  ```

* **Create:**

  ```python
  label = QLabel("Hello, I am a label", window)
  label.setGeometry(20, 20, 250, 30)
  ```

* **Set and get:**

  ```python
  label.setText("New text")    # set the text (must be a string)
  text = label.text()          # get the text

  label.setText(str(42))       # numbers must be converted to a string
  label.setNum(42)             # ...or use setNum for a number
  ```

* **Other important methods:**

  ```python
  label.clear()                                  # remove the text
  label.setAlignment(Qt.AlignmentFlag.AlignCenter)  # center the text in the label
  label.setWordWrap(True)                        # break long text into several lines
  label.setStyleSheet("font-size: 20px; color: darkblue; font-weight: bold;")
  ```

* **Useful signals:**
  A label is a display-only widget, so it has **no useful signals** for beginners. You change a label from the functions connected to *other* widgets' signals.

## 2. Label as a Color Indicator (`QLabel`)

A label **without text** but with a **background color** makes a simple indicator, like a status light (red = error, green = OK). With a `border-radius` of half its size, the label becomes a circle.

![Labels used as color indicators](content/images/widget_label_color.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QLabel
  ```

* **Create:**

  ```python
  indicator = QLabel(window)                 # no text
  indicator.setGeometry(20, 20, 40, 40)
  indicator.setStyleSheet("background-color: red;")
  ```

* **Set the color:**

  ```python
  # Square indicator
  indicator.setStyleSheet("background-color: green;")

  # Round indicator (border-radius = half of the width)
  indicator.setStyleSheet("background-color: green; border: 1px solid black; border-radius: 20px;")

  # Colors can be names, hex codes or RGB values
  indicator.setStyleSheet("background-color: #3399FF;")
  indicator.setStyleSheet("background-color: rgb(255, 165, 0);")
  ```

  A handy pattern is a function that sets the color, so you don't repeat the whole style string:

  ```python
  def set_indicator(color):
      indicator.setStyleSheet(f"background-color: {color}; border: 1px solid black; border-radius: 20px;")

  set_indicator("orange")
  ```

* **Get the color:**
  There is no `getColor()` method. You can read back the whole style string with `indicator.styleSheet()`, but it is usually simpler to **keep the current color in a variable** and update it whenever you call `set_indicator`.

* **Useful signals:**
  None. The indicator is changed from functions connected to other widgets.

## 3. Label Showing an Image (`QLabel` + `QPixmap`)

A label can show a **picture** instead of text. The picture is loaded into a `QPixmap` object, and the pixmap is placed in the label.

![A label showing an image](content/images/widget_label_image.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QLabel
  from PySide6.QtGui import QPixmap
  from PySide6.QtCore import Qt          # only needed for scaling options
  ```

* **Create:**

  ```python
  image_label = QLabel(window)
  image_label.setGeometry(20, 20, 160, 110)

  pixmap = QPixmap("images/house.png")   # path to an image file (png, jpg, ...)
  image_label.setPixmap(pixmap)
  ```

  > **Note:** the path is relative to the folder you **run** the program from (usually the project folder), not to the folder of the `.py` file.

* **Set and get:**

  ```python
  image_label.setPixmap(QPixmap("images/other.png"))  # set / replace the image
  current = image_label.pixmap()                      # get the current QPixmap
  ```

* **Other important methods:**

  ```python
  # Check the image was actually loaded (a wrong path gives an empty pixmap, not an error!)
  if pixmap.isNull():
      print("Image not found")

  # Stretch the image to fill the whole label (may distort it)
  image_label.setScaledContents(True)

  # Resize the image to fit the label while keeping its proportions
  scaled = pixmap.scaled(160, 110, Qt.AspectRatioMode.KeepAspectRatio,
                         Qt.TransformationMode.SmoothTransformation)
  image_label.setPixmap(scaled)

  # Size of the image
  w = pixmap.width()
  h = pixmap.height()

  # Remove the image
  image_label.clear()
  ```

* **Useful signals:**
  None.

## 4. Single-Line Text Input (`QLineEdit`)

A box where the user types **one line of text**, such as a name, a number or a password.

![QLineEdit with placeholder text and with typed text](content/images/widget_lineedit.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QLineEdit
  ```

* **Create:**

  ```python
  name_input = QLineEdit(window)
  name_input.setGeometry(20, 20, 220, 30)
  ```

* **Set and get:**

  ```python
  name_input.setText("Dana Cohen")    # set the text
  text = name_input.text()            # get the text (always a string!)
  ```

  The text is always a **string**. To use it as a number, convert it, and be ready for invalid input:

  ```python
  try:
      age = int(age_input.text())
  except ValueError:
      result_label.setText("Please enter a whole number")
  ```

* **Other important methods:**

  ```python
  name_input.clear()                                  # empty the box
  name_input.setPlaceholderText("Enter your name")    # gray hint shown when empty
  name_input.setReadOnly(True)                        # user can see but not edit
  name_input.setMaxLength(20)                         # limit number of characters
  name_input.setEchoMode(QLineEdit.EchoMode.Password) # show ●●●● instead of the text
  name_input.setFocus()                               # put the typing cursor in this box
  ```

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `textChanged(str)` | Every time the text changes, by the user **or** by `setText()` | the new text |
  | `textEdited(str)` | Every time the **user** changes the text (not by `setText()`) | the new text |
  | `returnPressed()` | The user pressed **Enter** | nothing |
  | `editingFinished()` | The user pressed Enter **or** left the box (clicked somewhere else) | nothing |

  ```python
  def on_name_changed(text):
      preview_label.setText(f"Hello {text}")

  name_input.textChanged.connect(on_name_changed)
  ```

## 5. Multi-Line Text Box (`QTextEdit`)

A box for **many lines of text**. Use it when the user needs to write a longer text, or as a read-only output area (for example, a log of messages).

![QTextEdit](content/images/widget_textedit.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QTextEdit
  ```

* **Create:**

  ```python
  text_box = QTextEdit(window)
  text_box.setGeometry(20, 20, 300, 130)
  ```

* **Set and get:**

  ```python
  text_box.setPlainText("Line 1\nLine 2")   # set the whole text (\n = new line)
  text = text_box.toPlainText()             # get the whole text as one string

  lines = text_box.toPlainText().split("\n")  # get the text as a list of lines
  ```

  > **Note:** `QTextEdit` uses `setPlainText()` / `toPlainText()`, **not** `setText()` / `text()` like `QLineEdit`.

* **Other important methods:**

  ```python
  text_box.append("A new line at the end")       # add a line (great for logs)
  text_box.insertPlainText("text")               # insert at the cursor position
  text_box.clear()                               # remove all text
  text_box.setReadOnly(True)                     # use the box for output only
  text_box.setPlaceholderText("Write your notes here...")
  text_box.setHtml("<b>Bold</b> and <i>italic</i>")  # show formatted (HTML) text
  ```

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `textChanged()` | Every time the text changes | **nothing** - read the text with `toPlainText()` |

  ```python
  def on_text_changed():
      count_label.setText(f"{len(text_box.toPlainText())} characters")

  text_box.textChanged.connect(on_text_changed)
  ```

  > **Note:** unlike `QLineEdit`, the `textChanged` signal of `QTextEdit` sends **no value**, so the connected function takes no parameters.

## 6. Number Boxes (`QSpinBox` and `QDoubleSpinBox`)

A box for choosing a **number**, with up/down arrows. The user can also type the number.

* `QSpinBox` - for **integers** (`1`, `2`, `3`)
* `QDoubleSpinBox` - for **decimal numbers** (`3.14`)

![QSpinBox and QDoubleSpinBox](content/images/widget_spinbox.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QSpinBox, QDoubleSpinBox
  ```

* **Create:**

  ```python
  spin = QSpinBox(window)
  spin.setGeometry(20, 20, 100, 30)

  dspin = QDoubleSpinBox(window)
  dspin.setGeometry(140, 20, 100, 30)
  ```

* **Set and get:**

  ```python
  spin.setValue(42)          # set
  n = spin.value()           # get -> int

  dspin.setValue(3.14)       # set
  x = dspin.value()          # get -> float
  ```

  > **Important:** the default range of both is **0 to 99**. Setting a value outside the range silently changes it to the nearest limit, so always set the range you need first.

* **Other important methods:**

  ```python
  spin.setRange(-100, 100)       # minimum and maximum
  spin.setMinimum(0)             # or set them separately
  spin.setMaximum(1000)
  spin.setSingleStep(5)          # how much one arrow click changes the value
  spin.setPrefix("$ ")           # text shown before the number
  spin.setSuffix(" kg")          # text shown after the number
  spin.setWrapping(True)         # after the maximum, go back to the minimum
  spin.setReadOnly(True)         # use the box for output only

  # Hide the up/down arrows (nice for output boxes)
  spin.setButtonSymbols(QSpinBox.ButtonSymbols.NoButtons)

  # Only for QDoubleSpinBox
  dspin.setDecimals(3)           # number of digits after the decimal point (default 2)
  ```

  > **Note:** `QDoubleSpinBox` **rounds** the value to the number of decimals: with the default of 2, `dspin.setValue(3.14159)` stores `3.14`.

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `valueChanged(int)` / `valueChanged(float)` | Every time the value changes (arrows, typing, or `setValue()`) | the new value |
  | `editingFinished()` | The user pressed Enter or left the box | nothing |

  ```python
  def on_value_changed(value):
      square_label.setText(f"Square: {value * value}")

  spin.valueChanged.connect(on_value_changed)
  ```

## 7. Button (`QPushButton`)

A button the user **clicks** to perform an action.

![QPushButton](content/images/widget_pushbutton.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QPushButton
  ```

* **Create:**

  ```python
  button = QPushButton("Click me", window)
  button.setGeometry(20, 20, 120, 35)
  ```

* **Set and get:**

  ```python
  button.setText("Calculate")    # set the text on the button
  text = button.text()           # get the text
  ```

* **Other important methods:**

  ```python
  button.setEnabled(False)      # disable the button (grayed out, cannot be clicked)
  button.setEnabled(True)       # enable it again
  button.click()                # "click" the button from code - emits clicked
  button.setStyleSheet("background-color: lightgreen; font-size: 16px;")
  ```

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `clicked()` | The button was clicked (mouse pressed **and released** over it) | nothing* |
  | `pressed()` | The mouse button went **down** on the button | nothing |
  | `released()` | The mouse button went **up** | nothing |

  *`clicked` actually sends a `bool` (the checked state, see the next section), but for a normal button you can ignore it and connect a function with no parameters.

  ```python
  def on_click():
      result_label.setText("Button was clicked!")

  button.clicked.connect(on_click)
  ```

## 8. Toggle Button (`QPushButton` in Checkable Mode)

A normal `QPushButton` that **stays pressed** after you click it, and pops back up when you click it again. It works like an ON/OFF switch. It is the same class as a normal button, just with `setCheckable(True)`.

![Toggle button, OFF (left) and ON (right)](content/images/widget_pushbutton_toggle.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QPushButton
  ```

* **Create:**

  ```python
  toggle = QPushButton("Light: OFF", window)
  toggle.setGeometry(20, 20, 120, 35)
  toggle.setCheckable(True)        # this makes it a toggle button
  ```

* **Set and get:**

  ```python
  toggle.setChecked(True)          # set to ON (pressed)
  is_on = toggle.isChecked()       # get: True = ON, False = OFF

  toggle.toggle()                  # flip the state (ON -> OFF, OFF -> ON)
  ```

* **Other important methods:**
  Same as a normal button: `setText()`, `text()`, `setEnabled()`.
  A useful trick is to give the "ON" state a different color using the `:checked` CSS state:

  ```python
  toggle.setStyleSheet("QPushButton:checked { background-color: yellow; }")
  ```

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `toggled(bool)` | The state changed, by the user **or** by `setChecked()` / `toggle()` | `True` if now ON, `False` if now OFF |
  | `clicked(bool)` | The **user** clicked the button | the new state |

  ```python
  def on_toggled(checked):
      if checked:
          toggle.setText("Light: ON")
      else:
          toggle.setText("Light: OFF")

  toggle.toggled.connect(on_toggled)
  ```

## 9. Slider (`QSlider`)

A handle that the user **drags** along a line to choose a number from a range. Good for things like volume, speed or brightness. A slider can be horizontal or vertical.

![Horizontal and vertical QSlider](content/images/widget_slider.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QSlider
  from PySide6.QtCore import Qt          # needed for the orientation
  ```

* **Create:**

  ```python
  slider = QSlider(Qt.Orientation.Horizontal, window)   # or Qt.Orientation.Vertical
  slider.setGeometry(20, 20, 220, 30)
  slider.setRange(0, 100)
  ```

* **Set and get:**

  ```python
  slider.setValue(30)        # move the handle to 30
  value = slider.value()     # get the current value (int)
  ```

  > **Note:** a slider only works with **integers**. For decimals, use a bigger range and divide. For example, for values 0.0 to 1.0 in steps of 0.01, use `setRange(0, 100)` and then `slider.value() / 100`.

* **Other important methods:**

  ```python
  slider.setMinimum(0)
  slider.setMaximum(255)
  slider.setSingleStep(1)          # change when using the arrow keys
  slider.setPageStep(10)           # change when clicking on the line next to the handle

  # Tick marks
  slider.setTickPosition(QSlider.TickPosition.TicksBelow)
  slider.setTickInterval(10)       # a tick every 10 units
  ```

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `valueChanged(int)` | Every time the value changes (dragging, clicking, keys, or `setValue()`) | the new value |
  | `sliderMoved(int)` | While the user is **dragging** the handle | the new position |
  | `sliderPressed()` | The user grabbed the handle | nothing |
  | `sliderReleased()` | The user let go of the handle | nothing |

  ```python
  def on_slider_changed(value):
      volume_label.setText(f"Volume: {value}%")

  slider.valueChanged.connect(on_slider_changed)
  ```

## 10. Table (`QTableWidget`)

A **grid of cells** organized in rows and columns, like a small spreadsheet. Each cell holds a `QTableWidgetItem`. The user can select cells and (by default) edit them.

![QTableWidget](content/images/widget_tablewidget.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QTableWidget, QTableWidgetItem
  ```

* **Create:**

  ```python
  table = QTableWidget(3, 3, window)     # 3 rows, 3 columns
  table.setGeometry(20, 20, 340, 125)
  table.setHorizontalHeaderLabels(["Name", "Age", "Grade"])
  ```

* **Set and get a cell:**

  Every cell holds a `QTableWidgetItem`, and the text must be a **string**:

  ```python
  # Set: put a new item in row 0, column 1
  table.setItem(0, 1, QTableWidgetItem("21"))
  table.setItem(0, 2, QTableWidgetItem(str(95)))   # convert numbers to strings

  # Get: take the item, then its text
  item = table.item(0, 1)
  if item is not None:            # an empty cell has no item -> None
      age = int(item.text())
  ```

  > **Important:** `table.item(row, col)` returns `None` for a cell that was never filled, so `table.item(row, col).text()` will crash on an empty cell. Always check for `None` first.

  Filling a whole table from a list:

  ```python
  students = [("Dana", 21, 95), ("Yossi", 23, 88), ("Noa", 22, 91)]

  table.setRowCount(len(students))
  for row, student in enumerate(students):
      for col, value in enumerate(student):
          table.setItem(row, col, QTableWidgetItem(str(value)))
  ```

* **Other important methods:**

  ```python
  # Size of the table
  table.setRowCount(5)
  table.setColumnCount(4)
  rows = table.rowCount()
  cols = table.columnCount()

  # Add / remove rows
  table.insertRow(table.rowCount())   # add an empty row at the end
  table.removeRow(0)                  # remove the first row

  # Clear
  table.clearContents()               # empty all cells, keep the headers
  table.setRowCount(0)                # remove all rows

  # Headers
  table.setVerticalHeaderLabels(["a", "b", "c"])   # row titles (default: 1, 2, 3, ...)

  # Selected cell
  row = table.currentRow()
  col = table.currentColumn()

  # Prevent the user from editing the cells
  table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)

  # Column widths
  table.setColumnWidth(0, 120)
  table.resizeColumnsToContents()                  # fit columns to their text
  table.horizontalHeader().setStretchLastSection(True)  # last column fills the width
  ```

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `cellClicked(int, int)` | The user clicked a cell | row, column |
  | `cellDoubleClicked(int, int)` | The user double-clicked a cell | row, column |
  | `cellChanged(int, int)` | The text of a cell changed (user edit **or** `setItem()` from code) | row, column |
  | `currentCellChanged(int, int, int, int)` | The selected cell moved | new row, new column, previous row, previous column |
  | `itemSelectionChanged()` | The selection changed | nothing |

  ```python
  def on_cell_clicked(row, col):
      item = table.item(row, col)
      if item is not None:
          info_label.setText(f"Row {row}, column {col}: {item.text()}")

  table.cellClicked.connect(on_cell_clicked)
  ```

  > **Note:** `cellChanged` is also emitted when **your code** fills the table. If you don't want your function to run while filling the table, block the signals temporarily:
  >
  > ```python
  > table.blockSignals(True)
  > # ... fill the table ...
  > table.blockSignals(False)
  > ```

## 11. Drop-Down List (`QComboBox`)

A button that opens a **list of options**, and the user selects **one** of them. Saves space compared to showing all the options at once.

![QComboBox](content/images/widget_combobox.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QComboBox
  ```

* **Create:**

  ```python
  combo = QComboBox(window)
  combo.setGeometry(20, 20, 150, 30)
  combo.addItems(["Red", "Green", "Blue"])
  ```

* **Set and get:**

  Each option has an **index** (starting from 0) and a **text**:

  ```python
  # Get the selected option
  text = combo.currentText()       # "Green"
  index = combo.currentIndex()     # 1   (-1 if the list is empty)

  # Select an option from code
  combo.setCurrentIndex(2)         # select by index
  combo.setCurrentText("Blue")     # select by text
  ```

* **Other important methods:**

  ```python
  combo.addItem("Yellow")              # add one option
  combo.addItems(["Black", "White"])   # add several options
  combo.insertItem(0, "Purple")        # insert at a position
  combo.removeItem(0)                  # remove by index
  combo.clear()                        # remove all options

  n = combo.count()                    # number of options
  t = combo.itemText(2)                # text of the option at index 2
  i = combo.findText("Blue")           # index of an option (-1 if not found)

  combo.setEditable(True)              # let the user also type a value

  # Attach a hidden value to each option, and read it back
  combo.addItem("Small", 10)
  combo.addItem("Large", 50)
  size = combo.currentData()           # 10 or 50, depending on the selection
  ```

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `currentIndexChanged(int)` | The selected option changed (by the user **or** by code) | the new index |
  | `currentTextChanged(str)` | The selected text changed (by the user **or** by code) | the new text |
  | `activated(int)` | The **user** chose an option (even the same one again) | the chosen index |

  ```python
  def on_color_changed(text):
      indicator.setStyleSheet(f"background-color: {text};")

  combo.currentTextChanged.connect(on_color_changed)
  ```

## 12. Check Box (`QCheckBox`)

A small box with a label that the user can **check or uncheck**. Used for yes/no choices, like "Remember me" or "Show grid". Unlike a combo box, several check boxes can be checked at the same time.

![QCheckBox unchecked and checked](content/images/widget_checkbox.png)

* **Import:**

  ```python
  from PySide6.QtWidgets import QCheckBox
  ```

* **Create:**

  ```python
  check = QCheckBox("Show grid", window)
  check.setGeometry(20, 20, 150, 30)
  ```

* **Set and get:**

  ```python
  check.setChecked(True)            # check it
  is_checked = check.isChecked()    # get: True / False

  check.setText("Show axes")        # change the label text
  text = check.text()
  ```

* **Other important methods:**

  ```python
  check.toggle()                    # flip the state
  check.setEnabled(False)           # gray it out
  ```

* **Useful signals:**

  | Signal | When is it emitted | Sends |
  |---|---|---|
  | `toggled(bool)` | The state changed, by the user **or** by `setChecked()` | `True` if checked, `False` if not |
  | `clicked(bool)` | The **user** clicked the box | the new state |
  | `stateChanged(int)` | The state changed | `0` = unchecked, `2` = checked |

  `toggled` is the easiest to use, since it sends a simple `True` / `False`:

  ```python
  def on_grid_toggled(checked):
      if checked:
          status_label.setText("Grid is ON")
      else:
          status_label.setText("Grid is OFF")

  check.toggled.connect(on_grid_toggled)
  ```

## Quick Reference

| Widget | Import from | Set | Get | Main signal |
|---|---|---|---|---|
| `QLabel` (text) | `QtWidgets` | `setText(str)` | `text()` | - |
| `QLabel` (color) | `QtWidgets` | `setStyleSheet("background-color: ...")` | keep in a variable | - |
| `QLabel` (image) | `QtWidgets`, `QPixmap` from `QtGui` | `setPixmap(QPixmap(path))` | `pixmap()` | - |
| `QLineEdit` | `QtWidgets` | `setText(str)` | `text()` | `textChanged(str)`, `editingFinished()` |
| `QTextEdit` | `QtWidgets` | `setPlainText(str)` | `toPlainText()` | `textChanged()` |
| `QSpinBox` | `QtWidgets` | `setValue(int)` | `value()` | `valueChanged(int)` |
| `QDoubleSpinBox` | `QtWidgets` | `setValue(float)` | `value()` | `valueChanged(float)` |
| `QPushButton` | `QtWidgets` | `setText(str)` | `text()` | `clicked()` |
| `QPushButton` (toggle) | `QtWidgets` | `setChecked(bool)` | `isChecked()` | `toggled(bool)` |
| `QSlider` | `QtWidgets`, `Qt` from `QtCore` | `setValue(int)` | `value()` | `valueChanged(int)` |
| `QTableWidget` | `QtWidgets` | `setItem(r, c, QTableWidgetItem(str))` | `item(r, c).text()` | `cellClicked(int, int)`, `cellChanged(int, int)` |
| `QComboBox` | `QtWidgets` | `setCurrentIndex(int)` / `setCurrentText(str)` | `currentIndex()` / `currentText()` | `currentIndexChanged(int)`, `currentTextChanged(str)` |
| `QCheckBox` | `QtWidgets` | `setChecked(bool)` | `isChecked()` | `toggled(bool)` |
