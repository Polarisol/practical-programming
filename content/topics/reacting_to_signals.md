# Reacting to Signals

In PySide6, widgets emit **signals** when a user interacts with them (e.g., clicking a button, typing text, or changing a number). You connect these signals to Python functions called **slots** to trigger actions.

## Complete Example Program

The program below demonstrates how to react to three common widget events in one window:

1. Clicking a button (`clicked`)

2. Typing into a text field (`textChanged`)

3. Adjusting a number box (`valueChanged`)

```
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QLineEdit, QSpinBox, QLabel

def on_button_clicked():
    name = name_input.text()
    message_label.setText(f"Welcome, {name or 'Guest'}!")

def on_text_changed(text):
    preview_label.setText(f"Typing: {text}")

def on_number_changed(val):
    square_label.setText(f"Square: {val * val}")

app = QApplication()
window = QWidget()
window.setWindowTitle("Reacting to Signals Demo")
window.setGeometry(100, 100, 360, 260)

# 1. Text input and its live preview label
name_input = QLineEdit(window)
name_input.setGeometry(20, 20, 180, 30)
name_input.setPlaceholderText("Enter your name")

preview_label = QLabel("Typing: ", window)
preview_label.setGeometry(20, 60, 320, 25)

# 2. Button and its action output label
action_button = QPushButton("Greet Me", window)
action_button.setGeometry(20, 100, 120, 30)

message_label = QLabel("Welcome!", window)
message_label.setGeometry(150, 105, 190, 25)

# 3. SpinBox and its calculated square output
number_box = QSpinBox(window)
number_box.setGeometry(20, 150, 80, 30)
number_box.setRange(-10, 10)
number_box.setValue(2)

square_label = QLabel("Square: 4", window)
square_label.setGeometry(120, 155, 180, 25)

# Connecting signals to functions
name_input.textChanged.connect(on_text_changed)
action_button.clicked.connect(on_button_clicked)
number_box.valueChanged.connect(on_number_changed)

window.show()
app.exec()
```

## How It Works

### 1. Button Click (`action_button.clicked`)

* **Signal:** `clicked`

* **Trigger:** Emitted when the user releases a mouse click on the button.

* **Mechanism:**

  ```
  action_button.clicked.connect(on_button_clicked)
  ```

  `on_button_clicked` retrieves the current text from `name_input` via `.text()` and sets the message using `.setText()`.

### 2. Live Text Updates (`name_input.textChanged`)

* **Signal:** `textChanged`

* **Trigger:** Emitted on every single keystroke (insertion or deletion).

* **Automatic Argument:** Sends the updated text string directly to the connected function:

  ```
  def on_text_changed(text):
      preview_label.setText(f"Typing: {text}")
  ```

* **Alternative:** If you only want to update when the user presses **Enter** or moves away from the input, use `name_input.editingFinished` instead.

### 3. Number Box Changes (`number_box.valueChanged`)

* **Signal:** `valueChanged`

* **Trigger:** Emitted whenever the number changes via the up/down arrows or manual typing.

* **Automatic Argument:** Sends the new integer value directly into the slot function:

  ```
  def on_number_changed(val):
      square_label.setText(f"Square: {val * val}")
  ```

  This immediately recalculates and displays the square of the number without needing a button press.