# PySide6 Basics Quiz

Check your understanding of the PySide6 basics: the event loop, widgets, `setGeometry` and signals. Answer all the questions, then press **Submit answers**.

## What is PySide6?
- [ ] A Python library for drawing charts and graphs
  > That describes libraries like Matplotlib. PySide6 is for building whole applications with windows, buttons and text boxes.
- [x] A Python framework for building desktop applications with a graphical user interface (GUI), based on the Qt library
  > Right! PySide6 is the official Python library for Qt, a trusted framework used in many real-world products.
- [ ] A framework for building websites in Python
  > Website frameworks such as Flask or Django run in a web browser. PySide6 builds desktop applications that run in their own windows.
- [ ] A code editor for writing and running Python programs
  > A code editor (like VS Code or PyCharm) is where you write code. PySide6 is a library you import in your code.
> PySide6 lets you build GUI applications in Python. It uses the **Qt** library underneath, so your programs get robust, professional-looking windows and widgets.

## What is the job of `app.exec()` at the end of a PySide6 program?
```python
app = QApplication()
window = QWidget()
window.show()
app.exec()
```
- [ ] It creates the window and draws it on the screen
  > The window is created by `QWidget()` and made visible by `window.show()`. `app.exec()` comes after both.
- [ ] It runs the program once from top to bottom and then exits
  > Without `app.exec()` that is exactly what would happen: the script would end and the window would close immediately.
- [x] It starts the event loop, which keeps the program running and reacting to the user until the window is closed
  > Right! The event loop waits for clicks, typing and other events, and calls your connected functions when they happen.
- [ ] It checks the code for errors before the window opens
  > PySide6 doesn't check your code. Python errors still appear only when the faulty line actually runs.
> Every PySide6 program creates one `QApplication`, sets up its windows and widgets, and then calls `app.exec()` to start the **event loop**, which runs until the user closes the window.

## Which line makes `button` run the function `button_method` every time it is clicked?
- [ ] `button.clicked.connect(button_method())`
  > The parentheses call `button_method` once, right away, while connecting. `connect` then gets the function's return value instead of the function itself.
- [ ] `button.clicked.function(button_method)`
  > `clicked` is a signal. You don't call it; you use its `connect` method to link it to a function. `function` isn't a real method of the signal.
- [ ] `button.connect(button_method)`
  > `connect` belongs to the signal, not to the button. PySide6 needs to know *which* signal (`clicked`, `pressed`, ...) should call the function.
- [x] `button.clicked.connect(button_method)`
  > Right! The `clicked` signal is connected to the function, written without parentheses, so PySide6 can call it on every click.
> To react to an event, connect the widget's **signal** to your function: `widget.signal.connect(function)`. Write the function name **without parentheses**: you give PySide6 the function, and PySide6 calls it later.

## The button inside this window was placed with one line of code. Which line?
![A 400 by 200 window. A Start button starts 50 pixels from the left and 60 pixels from the top of the window, and is 150 pixels wide and 40 pixels tall.](content/images/quiz_button_geometry.png)
- [x] `button.setGeometry(50, 60, 150, 40)`
  > Right! The order is `(x, y, width, height)`, and `x` and `y` are measured from the top-left corner of the window.
- [ ] `button.setGeometry(150, 40, 50, 60)`
  > This puts the size first. In `setGeometry`, the position comes first and the size second.
- [ ] `button.setPosition(50, 60, 150, 40)`
  > The numbers are right, but there is no `setPosition` method in PySide6. Position and size together are set with `setGeometry`.
- [ ] `button.setPosition(150, 40, 50, 60)`
  > there is no `setPosition` method in PySide6 and the numbers are in the wrong order for `setGeometry`.
> `setGeometry(x, y, width, height)` sets a widget's position and size in one call. Larger `x` moves the widget right, larger `y` moves it **down**.

## Which code correctly adds a label showing "Hello"?

- [ ] `label = QLabel("Hello")`
  > `window` is missing when the label is created, so the label is not part of the window and won't appear in it.
- [ ] `label = New.QLabel("Hello", window)`
  > `New` is not a thing we use
- [ ] `label = QLabel.new("Hello")`
  > `new` is not a thing we use
- [x] `label = QLabel("Hello", window)`
  > Right! The label is created with `window` as its last argument, and `setGeometry` gets all four numbers.
> To put a widget in a window, pass `window` as the **last argument** when you create it, then place it with `setGeometry(x, y, width, height)`.

## What does this code print?
```python
dspin = QDoubleSpinBox(window)
dspin.setValue(150.555)
print(dspin.value())
```
- [ ] 150.555
  > Two limits apply here: the default range and the default number of decimals.
- [ ] 150.56
  > The rounding to 2 decimals is real, but the value is also outside the default range.
- [x] 99.99
  > Right! The default maximum of a `QDoubleSpinBox` is 99.99, so a larger value is silently changed to the maximum.
- [ ] 99.0
  > The value is limited by the maximum, but the maximum of a `QDoubleSpinBox` is 99.99, the largest number with 2 decimals below 100.
- [ ] Nothing, the program raises an error because the value is out of range
  > No error is raised. That's what makes this limit easy to miss.
> Number boxes have a small default range: 0 to 99 for `QSpinBox` and 0 to 99.99 for `QDoubleSpinBox`, which also keeps only **2 decimals**. A value outside the range is silently changed, so call `setRange()` (and `setDecimals()` if needed) before setting a value.

## What does this program do?
```python
from PySide6.QtWidgets import QApplication, QWidget, QLineEdit, QLabel


def my_method():
    text = name_input.text()
    count_label.setText(f"Letters: {len(text)}")


app = QApplication()
window = QWidget()
window.setGeometry(100, 100, 300, 120)

name_input = QLineEdit(window)
name_input.setGeometry(20, 20, 200, 30)

count_label = QLabel("Letters: 0", window)
count_label.setGeometry(20, 70, 200, 30)

name_input.editingFinished.connect(my_method)

window.show()
app.exec()
```
- [ ] When the user presses the button, the label shows how many characters were typed
  > The program does not have a button; it reacts to finishing editing the text box.
- [x] When the user finishes typing in the box (presses Enter or leaves the box), the label shows how many characters were typed
  > Right! `editingFinished` calls `my_method`, which reads the text and shows its length with `len()`.
- [ ] Every time the user types a letter, the label immediately updates the count
  > Updating on every key press would need the `textChanged` signal. `editingFinished` waits until the user is done.
- [ ] When the user finishes typing, the label shows the text that was typed
  > The label shows `len(text)`, the **number** of characters, not the text itself.
> A small program is read in two parts: the setup (creating widgets with `setGeometry`) and the connections. Here, the `editingFinished` signal of the `QLineEdit` is connected to `my_method`, which updates the label.

## The user typed "Tal" in a QLineEdit field named `name_input` and chose 3 in a QSpinBox field named `spin`. Which code shows "Tal selected 3" in `result_label`?
**A**
```python
name = name_input.text()
number = spin.text()
result_label.setText(f"{name} selected {number}")
```
**B**
```python
name = name_input.text()
number = spin.value()
result_label.setText(f"{name} selected {number}")
```
**C**
```python
name = name_input.value()
number = spin.value()
result_label.setValue(name + " selected " + number)
```
**D**
```python
name = name_input.getText()
number = spin.getValue()
result_label.setText(f"{name} selected {number}")
```
- [ ] A
  > numerical widgets like `QSpinBox` use `value()` to get the current number, not `text()`.
- [x] B
  > Right! `text()` returns the string "Tal", `value()` returns the integer 3, and the f-string combines them.
- [ ] C
  > text based widgets like `QLineEdit` use `text()` to get the current string, not `value()`.
- [ ] D
  > There are no `getText()` or `getValue()` methods. In PySide6, the "get" methods are named after the property: `text()` and `value()`.
> To read a widget, call its get method with parentheses: `QLineEdit.text()` returns a **string** and `QSpinBox.value()` returns an **integer**. An f-string is the easiest way to mix them into one text for `setText()`.
