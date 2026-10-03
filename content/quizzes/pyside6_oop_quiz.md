# PySide6 advanced quiz

Answer all the questions, then press **Submit answers** to see your score and the corrections.

## What does the first line of this class definition mean?
```python
class MyWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()
```
- [ ] `MyWindow` creates a new `QWidget` and stores it in a variable called `MyWindow`
  > A class definition doesn't create any object yet. Objects are created later, with `MyWindow()`.
- [ ] `MyWindow` is a function that receives a `QWidget` as its parameter. `QWidget` is the window on which we place all controls.
  > The parentheses after a **class** name list the class it inherits from, not parameters like in a function.
- [x] `MyWindow` inherits from `QWidget`: it **is a** `QWidget`, with everything a `QWidget` can do, plus whatever we add
  > Right! That's inheritance. Our window gets methods like `setWindowTitle` and `show` for free from `QWidget`.
- [ ] `MyWindow` is placed inside a `QWidget`, as one of its child widgets
  > That's what passing a **parent** does, like `QLabel("text", self)`. Inheritance is a different idea.
> Writing `class MyWindow(QWidget)` makes our window a special kind of `QWidget`. The line `super().__init__()` then lets `QWidget` set itself up before we add our own things.

## Inside the `MyWindow` class, what does `self` refer to in `self.setWindowTitle("Hello")`?
- [x] The window object itself, the one that was created with `MyWindow()`
  > Exactly. Inside the class the window calls itself `self`, so `window.setWindowTitle(...)` from the non-OOP form becomes `self.setWindowTitle(...)`.
- [ ] The `QApplication` object
  > The application is created separately with `QApplication()`. `self` is the window, not the app.
- [ ] The `QWidget` class in general, shared by all windows in the program
  > `self` is one specific **object**, not the whole class. If you created two `MyWindow` objects, each would have its own `self`.
- [ ] The last widget that was created in `initUI`
  > Widgets are reached through `self` (like `self.label`), but `self` itself is always the window.

## A student wrote this code. Clicking the button causes an error. Why?
```python
    def initUI(self):
        label = QLabel("Hello", self)
        self.button = QPushButton("Click me", self)
        self.button.clicked.connect(self.button_clicked)

    def button_clicked(self):
        label.setText("Clicked!")
```
- [ ] The button was not saved with `self.`, so it can't be clicked
  > The button **is** saved as `self.button`, and the click does reach `button_clicked`. The problem is inside that method.
- [ ] `setText` can only be called inside `initUI`
  > `setText` can be called from any method, at any time. That's how labels change when the user does something.
- [ ] The label must be created in `__init__`, not in `initUI`
  > Widgets are normally created in `initUI`. Where it's created isn't the issue; how it's saved is.
- [x] `label` is a plain variable that exists only inside `initUI`, so `button_clicked` can't see it
  > Right! The fix is `self.label = QLabel("Hello", self)` in `initUI` and `self.label.setText("Clicked!")` in the method.
> A plain variable disappears when its method ends. A widget you will read or change later must be saved inside the window object with `self.`, so every method of the class can use it.

## Which line correctly connects the button's `clicked` signal to the method `button_clicked` of the same window?
- [ ] `self.button.clicked.connect(self.button_clicked())`
  > The parentheses **call** the method right away, while the window is still being built, and pass its result to `connect`. Leave the parentheses out.
- [x] `self.button.clicked.connect(self.button_clicked)`
  > Right! `self.` before the method name, and no parentheses, so PySide6 can call it later when the button is clicked.
- [ ] `self.button.clicked.connect(button_clicked)`
  > `button_clicked` is a method of the class, so it must be reached through `self.`. Without it, Python looks for a plain function with that name and doesn't find one.
- [ ] `button.clicked.connect(self.button_clicked)`
  > The button was saved as `self.button`. A plain `button` doesn't exist in this method.

## The About window class is in the file `about_window.py`. Which of these are needed so the main window (in `main.py`) can open it when a button is clicked?
- [x] `from about_window import AboutWindow` at the top of `main.py`
  > Needed. The file name is written **without** `.py`, and we import the class from it.
- [ ] `import about_window.py` at the top of `main.py`
  > The `.py` is never written in an import. And even without it, we need the `AboutWindow` class itself.
- [x] `self.about_window = AboutWindow()` in the main window's `__init__`
  > Needed. This creates the About window once (hidden) and saves it with `self.` so the button's method can use it.
- [x] `self.about_window.show()` in the method connected to the button
  > Needed. The window exists from the start, but it only appears when `show()` is called.
- [ ] `app = QApplication()` and `app.exec()` at the bottom of `about_window.py`
  > `about_window.py` only describes the window. The program is started once, from `main.py`.
> The 4 steps: create a class for the second window, import it, create one object of it in the main window's `__init__`, and call `show()` when it should appear.

## In the two-window program, the main window creates the second window with `self.graph_window = GraphWindow(self)`. Inside `GraphWindow`, which line sets the main window's spin box to 20?
```python
class GraphWindow(QWidget):

    def __init__(self, main_window=None):
        super().__init__()
        self.main_window = main_window
        self.initUI()
```
- [ ] `self.temp_spin.setValue(20)`
  > Inside `GraphWindow`, `self` is the **graph** window, which has no `temp_spin`. The spin box lives in the main window.
- [x] `self.main_window.temp_spin.setValue(20)`
  > Right! `GraphWindow` saved the main window as `self.main_window`, and through it can reach the main window's widgets.
- [ ] `self.graph_window.temp_spin.setValue(20)`
  > `self.graph_window` exists only in the **main** window's code. From inside `GraphWindow`, we go the other way, with `self.main_window`.
- [ ] `main_window.temp_spin.setValue(20)`
  > `main_window` is the `__init__` parameter and disappears when `__init__` ends. It was saved as `self.main_window` exactly so other methods could use it.
> Each window keeps the other one: the main window uses `self.graph_window`, and the second window uses `self.main_window`. That's how data travels in both directions.

## What happens when this method runs in a PySide6 window?
```python
    def start_clicked(self):
        for i in range(10):
            self.label.setText(str(i))
            time.sleep(1) # wait for one second
```
- [x] The window is frozen for about 10 seconds: buttons don't respond
  > Right. PySide6 is stuck waiting for the method to finish, so it can't handle clicks in the meantime.
- [ ] The label counts 0, 1, 2 ... 9, one number per second, and the window keeps working normally
  > This is what we **want**, but it's not what happens. PySide6 can't update the window while the method is still running.
- [ ] Python raises an error, because `time.sleep` is not allowed inside a class
  > `time.sleep` works anywhere. The code runs; it just blocks the window.
- [x] The label doesn't show the numbers one by one; only the last number (9) appears at the end
  > Right. The window can only redraw itself after the method ends, so only the final text is shown.
> A GUI method must stay short. To do something repeatedly, use a `QTimer`: PySide6 calls a short method on every tick, and the window stays free between ticks.

## The timer below is created and connected, but not started. You want `timer_tick` to run every **half second** when the Start button is clicked. What goes inside `start_clicked`?
```python
    def initUI(self):
        self.count_label = QLabel("0", self)
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.timer_tick)

    def start_clicked(self):
        # ???
```
- [ ] `self.timer.start(0.5)`
  > The time is given in **milliseconds**, not seconds. Half a second is 500 ms.
- [x] `self.timer.start(500)`
  > Right! 500 milliseconds = half a second. The timer starts ticking now and keeps going until `stop()` is called.
- [ ] `self.timer_tick(500)`
  > This calls the tick method once, right now. It doesn't start the timer, so nothing repeats.
- [ ] `timer.start(500)`
  > The timer was saved as `self.timer`. A plain `timer` doesn't exist in this method.
> A timer is used in 3 steps: create it with `QTimer(self)` and save it with `self.`, connect its `timeout` signal to a method, and call `start(ms)` whenever you want it to begin.

## You asked an AI tool to add a menu bar to your PySide6 window, and it changed several parts of your code. What is the best next step?
- [ ] Run it, and if it works, never look at the changes
  > It may work now, but when you want to change the menu later, you won't know where it is or how it works.
- [ ] Delete the AI's changes and write the whole menu bar yourself from scratch
  > Using AI for things like a menu bar or a graph area is fine and saves time. You don't have to avoid it.
- [x] Go over the changes and understand them, at least the important parts, so you can control and change them later
  > Right! Look at which widgets were added, where they were created, and which methods their signals connect to.
- [ ] Ask the AI to put the whole program in one function so it's easier to read
  > Going back to one big function undoes the OOP structure that keeps the window organised.
> AI can help add features, but you are responsible for the code. Understanding its changes lets you fix and extend them yourself.
