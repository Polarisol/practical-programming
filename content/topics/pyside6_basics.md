# PySide6 Beginner's Guide

PySide6 is the official Python library used to build graphical user interface (GUI) desktop applications using the Qt framework.

## 1. Minimal Application

This is the baseline program required to create and run an empty window.

```
from PySide6.QtWidgets import QApplication, QWidget

app = QApplication()
window = QWidget()
window.show()
app.exec()

```

## 2. Window Setup

Use these methods on your window object to change its title and size.

* **Set window title:**

  ```
  window.setWindowTitle("Hello World")
  
  ```

* **Set position and size:**
  The parameters are `(x, y, width, height)`.

  ```
  window.setGeometry(100, 100, 600, 400)
  
  ```

## 3. Widget Types and Controls

### Text Labels (`QLabel`)

A label displays read-only text on the screen.

* **Import:**

  ```
  from PySide6.QtWidgets import QLabel
  
  ```

* **Define the variable:**

  ```
  label = QLabel("Initial text", window)
  
  ```

* **Get and Set text:**

  ```
  # Set text
  label.setText("Updated text")
  
  # Get text
  current_text = label.text()
  
  ```

* **Position and dimensions:**

  ```
  label.move(50, 50)
  label.setGeometry(50, 50, 200, 40)
  
  ```

* **Styling with CSS:**

  ```
  label.setStyleSheet("font-family: Consolas; font-size: 40px; color: red")
  
  ```

### Buttons (`QPushButton`)

Buttons allow users to trigger actions when clicked.

* **Import:**

  ```
  from PySide6.QtWidgets import QPushButton
  
  ```

* **Define the variable:**

  ```
  button = QPushButton("Press me please", window)
  
  ```

* **Get and Set text:**

  ```
  # Set button label
  button.setText("Click here")
  
  # Get button label
  current_text = button.text()
  
  ```

* **Connect click signal to a function:**

  ```
  button.clicked.connect(button_function)
  
  ```

### Text Input (`QLineEdit`)

A single-line input field for entering text.

* **Import:**

  ```
  from PySide6.QtWidgets import QLineEdit
  
  ```

* **Define the variable:**

  ```
  name = QLineEdit(window)
  
  ```

* **Get and Set text:**

  ```
  # Set text programmatically
  name.setText("Default Name")
  
  # Get entered text
  user_text = name.text()
  
  ```

* **Add placeholder text:**

  ```
  name.setPlaceholderText("Enter your name")
  
  ```

* **React to user input with signals:**

  ```
  # Trigger when user presses Enter or clicks outside
  name.editingFinished.connect(update_label)
  
  # Trigger immediately on every keystroke
  name.textChanged.connect(input_text_changed)
  
  ```

### Number Selectors: `QSpinBox` & `QDoubleSpinBox`

Use these widgets when you want users to pick a number.

* `QSpinBox` is for **integers** (whole numbers like `1`, `2`, `3`).

* `QDoubleSpinBox` is for **floating-point numbers** (decimals like `1.25`, `3.14`).

* **Import:**

  ```
  from PySide6.QtWidgets import QSpinBox, QDoubleSpinBox
  
  ```

* **Define the variables:**

  ```
  spin = QSpinBox(window)
  dspin = QDoubleSpinBox(window)
  
  ```

#### Shared Controls

Both widgets share the same basic getter, setter, and setup methods:

* **Get and Set value:**

  ```
  # Set value
  spin.setValue(10)
  dspin.setValue(2.5)
  
  # Get value
  int_val = spin.value()       # returns int
  float_val = dspin.value()    # returns float
  
  ```

* **Set minimum and maximum limits:**

  ```
  # QSpinBox (integers)
  spin.setRange(0, 100)
  
  # QDoubleSpinBox (floats)
  dspin.setRange(0.0, 10.0)
  
  ```

* **Set step size for up/down clicks:**

  ```
  spin.setSingleStep(1)        # jumps by 1
  dspin.setSingleStep(0.1)     # jumps by 0.1
  
  ```

* **React to changes (Signal):**

  ```
  spin.valueChanged.connect(calculate)
  dspin.valueChanged.connect(calculate)
  
  ```

#### Unique to `QDoubleSpinBox`

* **Set number of decimal places shown:**

  ```
  dspin.setDecimals(2)   # shows 2 decimal digits, e.g., 3.50
  
  ```

## 4. UI Polish and Read-Only Output

You can modify spinboxes to act strictly as neat, display-only output fields.

* **Prevent user typing (read-only):**

  ```
  widget.setReadOnly(True)
  
  ```

* **Dim output background:**

  ```
  widget.setStyleSheet("background-color: lightgray;")
  
  ```

## 5. Global Window Styling (CSS / QSS)

You can style your window and widgets all at once with CSS rules:

```
window.setStyleSheet("""
    QWidget {
        background-color: #f0f0f0;
        font-family: Arial, sans-serif;
        font-size: 18px;
    }
    QSpinBox, QDoubleSpinBox {
        border: 2px solid #bbb;
        color: #111111;
    }
    QSpinBox::up-button, QSpinBox::down-button,
    QDoubleSpinBox::up-button, QDoubleSpinBox::down-button {
        width: 0;
        height: 0;
        border: none;
    }
    QLabel {
        border: 2px solid #ccc;
        border-radius: 6px;
        color: #222222;
        background-color: #C9C9C9;
        padding-left: 5px;
    }
    QPushButton {
        border: 2px solid #ccc;
        border-radius: 6px;
        color: black;
        background-color: #AAAAAA;
    }
    QPushButton:hover {
        background-color: #999999;
    }
""")

```