# PySide6 Timers

Sometimes a program needs to do something **by itself**, again and again, without the user clicking anything. For example: a clock that updates every second, a countdown, or a graph that reads a new measurement every 100 milliseconds.

In PySide6 this is done with a **timer**: an object that sends a signal every fixed amount of time.

## Why Not Use a Loop and `sleep`?

The first idea is usually a loop with `time.sleep`:

```python
    def start_clicked(self):
        for i in range(10):
            self.label.setText(str(i))
            time.sleep(1)       # do NOT do this in a GUI program
```

This does **not** work. While the method is running, PySide6 is stuck waiting for it to finish, so for 10 seconds:

* The window is **frozen**: buttons do not respond and the window cannot be moved properly.
* The label does not even update. Only the last number appears, at the end.

A GUI program must keep its methods **short**. A timer solves this: instead of one long method that waits, PySide6 calls a short method every time the timer "ticks". Between ticks the window is free to respond to the user.

## The Basic Steps

`QTimer` is imported from `PySide6.QtCore` (not from `QtWidgets`, because it is not a widget):

```python
from PySide6.QtCore import QTimer
```

Using a timer has 3 steps:

1. Create the timer and save it with `self.`.
2. Connect its **`timeout`** signal to a method.
3. Start it, with the time between ticks in **milliseconds**.

```python
    def initUI(self):
        # ... widgets ...
        self.timer = QTimer(self)                    # 1. create
        self.timer.timeout.connect(self.timer_tick)  # 2. connect
        self.timer.start(1000)                       # 3. start: tick every 1000 ms

    def timer_tick(self):
        print("One second passed")
```

* `QTimer(self)` - the window is the timer's parent, so the timer is deleted together with the window.
* `timeout` - the timer's signal. It works exactly like `clicked` of a button, except that the timer "clicks" by itself.
* `start(1000)` - 1000 milliseconds = 1 second. For half a second use `start(500)`.

> **Important:** save the timer as `self.timer`. You need it later to stop it, and a plain variable `timer` would disappear when `initUI` ends.

### Starting the Timer Later

`start` does **not** have to be called right after the timer is created. Steps 1 and 2 only **prepare** the timer. It does nothing until `start` is called, and that can happen anywhere in the class, at any time.

A common case is to create and connect the timer in `initUI`, and start and stop it when the user clicks a button:

```python
    def initUI(self):
        # ... widgets ...
        self.timer = QTimer(self)                    # created and connected,
        self.timer.timeout.connect(self.timer_tick)  # but not running yet

    def start_clicked(self):
        self.timer.start(1000)      # the timer starts ticking now

    def stop_clicked(self):
        self.timer.stop()           # the ticks stop

    def timer_tick(self):
        print("One second passed")
```

The same timer can be started and stopped as many times as you want.

## Useful Timer Methods

| Method | What it does |
|---|---|
| `start(ms)` | Starts the timer, with a tick every `ms` milliseconds |
| `stop()` | Stops the timer. It can be started again later |
| `isActive()` | Returns `True` if the timer is currently running |
| `setInterval(ms)` | Changes the time between ticks |

## Example: A Stopwatch

The window has a label that shows the seconds, and three buttons: **Start**, **Stop** and **Reset**.

The idea:

* The number of seconds is kept in `self.seconds`.
* The timer ticks every second. On every tick we add 1 to `self.seconds` and update the label.
* The buttons only start and stop the timer. The timer does the counting.

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton
from PySide6.QtCore import QTimer


class StopwatchWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.seconds = 0
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Stopwatch")
        self.setGeometry(100, 100, 400, 150)

        self.time_label = QLabel("0", self)
        self.time_label.setGeometry(30, 20, 200, 30)

        self.start_button = QPushButton("Start", self)
        self.start_button.setGeometry(30, 70, 100, 40)
        self.start_button.clicked.connect(self.start_clicked)

        self.stop_button = QPushButton("Stop", self)
        self.stop_button.setGeometry(150, 70, 100, 40)
        self.stop_button.clicked.connect(self.stop_clicked)

        self.reset_button = QPushButton("Reset", self)
        self.reset_button.setGeometry(270, 70, 100, 40)
        self.reset_button.clicked.connect(self.reset_clicked)

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.timer_tick)

    def timer_tick(self):
        self.seconds = self.seconds + 1
        self.time_label.setText(str(self.seconds))

    def start_clicked(self):
        self.timer.start(1000)

    def stop_clicked(self):
        self.timer.stop()

    def reset_clicked(self):
        self.seconds = 0
        self.time_label.setText("0")


if __name__ == "__main__":
    app = QApplication()
    window = StopwatchWindow()
    window.show()
    app.exec()
```

Notice:

* The timer is created in `initUI`, but it is **not started** there. It starts only when the user clicks **Start**.
* `timer_tick` is short: it changes one number and one label, and ends. The window stays responsive, so **Stop** works at any moment.
* **Reset** does not touch the timer. If the stopwatch is running, it continues counting from 0.

## Stopping the Timer by Itself

The tick method can stop its own timer. This is how a **countdown** works: count down, and stop at 0.

```python
    def timer_tick(self):
        self.seconds = self.seconds - 1
        self.time_label.setText(str(self.seconds))
        if self.seconds == 0:
            self.timer.stop()
            self.time_label.setText("Time is up!")
```

## Doing Something Once, After a Delay

Sometimes you do not need repeated ticks, only **one** action a little later. For example, showing "Saved!" and clearing the message after 2 seconds.

For this use `QTimer.singleShot`. There is no need to create a timer object:

```python
    def save_clicked(self):
        self.status_label.setText("Saved!")
        QTimer.singleShot(2000, self.clear_status)    # call clear_status once, in 2000 ms

    def clear_status(self):
        self.status_label.setText("")
```

`save_clicked` ends immediately, so the window is not frozen during the 2 seconds.

## In Short

| I want to... | Use |
|---|---|
| Do something again and again | `self.timer = QTimer(self)`, connect `timeout`, then `self.timer.start(ms)` |
| Stop repeating | `self.timer.stop()` |
| Do something once, later | `QTimer.singleShot(ms, self.some_method)` |

> **Note:** a timer is not perfectly accurate. A tick can arrive a few milliseconds late, especially if the program is busy. This is fine for a clock on the screen or an animation, but for a precise time measurement, read the real time (for example with `time.time()`) inside the tick method instead of counting ticks.
