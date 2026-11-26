# Starter GUI prompts

When you ask an AI to build the first version of an app (a starter user interface), the prompt you write decides what kind of code you get back. A vague prompt gets you code that *works*, but that you don't recognize. A good prompt gets you code that you can read, change and grow yourself.

## A vague prompt

> Make me an app that loads a data file and shows a graph.

This prompt leaves every important decision to the AI:

- **Which libraries?** It may pick Tkinter, Streamlit, Plotly, PyQt or something you have never heard of.
- **What structure?** One long script, several functions, a class, three files? You don't know until you look.
- **What names?** The button might be called `btn1`, the method `on_click`, the file name `fn`. You will have to hunt for them.
- **How much?** It might add menus, settings, error dialogs and a dark theme you didn't ask for. More code means more to read and more places for bugs to hide.

The result may run, but you are now a guest in someone else's code. You don't know where to add your own logic, and every change becomes another prompt.

## A good prompt

> Create a PySide6 app in a new file called `app.py`. The app should have a main window, written as a class.
>
> Add a button with the text "Load data". Name the button `file_load_button` and connect it to a method called `file_load_method`. In this method, open a file selection dialog and save the user's choice in `self.filename`.
>
> Also add an area of at least 300 by 300 pixels with a matplotlib graph in it. Create a method called `draw_graph` that draws something simple on the graph. I will change it later.

This prompt doesn't describe a finished app. It describes a **skeleton**, built the way *you* would build it, using tools *you* already know.

## Walking through the prompt

Each sentence in the prompt makes one decision, so the AI doesn't have to guess.

| What the prompt says | What it gives you |
|---|---|
| "a PySide6 app" | A library you learned in class. You can read every line. |
| "in a new file called `app.py`" | You know exactly where the code is, and it doesn't touch your other files. |
| "a main window, written as a class" | The structure we use in the course: widgets are attributes (`self.something`), actions are methods. |
| "Name the button `file_load_button`" | When you want to change the button, you search for that name. |
| "connect it to a method called `file_load_method`" | You know where the code that runs on a click lives. |
| "save the user's choice in `self.filename`" | Any other method in the class can use the file name later. |
| "at least 300 by 300 pixels with a matplotlib graph" | A library you know, and a size you chose. |
| "a method called `draw_graph` ... I will change it later" | A clear, empty spot for your own plotting code. "I will change it later" tells the AI to keep it simple. |

## What you get back

The AI should return something close to this:

```python
import sys

from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QFileDialog
)
from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg
from matplotlib.figure import Figure


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("My App")
        self.filename = None

        # The button
        self.file_load_button = QPushButton("Load data")
        self.file_load_button.clicked.connect(self.file_load_method)

        # The graph area
        self.figure = Figure()
        self.canvas = FigureCanvasQTAgg(self.figure)
        self.canvas.setMinimumSize(300, 300)
        self.ax = self.figure.add_subplot()

        # Put everything in the window
        layout = QVBoxLayout()
        layout.addWidget(self.file_load_button)
        layout.addWidget(self.canvas)
        central = QWidget()
        central.setLayout(layout)
        self.setCentralWidget(central)

        self.draw_graph()

    def file_load_method(self):
        self.filename, _ = QFileDialog.getOpenFileName(self, "Choose a file")
        print("Selected:", self.filename)

    def draw_graph(self):
        self.ax.clear()
        self.ax.plot([0, 1, 2, 3, 4], [0, 1, 4, 9, 16])
        self.canvas.draw()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
```

Look at how easy it is to find your way around:

- **Want to read the file after it is chosen?** Add your code at the end of `file_load_method`, where `self.filename` already holds the path.
- **Want to plot your real data?** Replace the two lines inside `draw_graph`, and call `self.draw_graph()` after loading the data.
- **Want another button?** Copy the two lines that create `file_load_button`, give the new one its own name and its own method, and add it to the layout.

Nothing here is a surprise. You could have written it yourself, it just would have taken longer.

## Why this matters

- **You understand the code.** It uses the libraries and the structure you learned, so you can read it line by line. You know what it does, you don't just *believe* it works.
- **You know where to put your code.** Every piece has a name you chose. Your logic goes into methods you named, not into a maze.
- **You can extend it yourself.** Adding a widget or a feature is a small, familiar change. You don't need to send another prompt for every tweak, and often it is faster to just do it.
- **Fewer surprises.** A short, focused prompt gets short, focused code. Less code means fewer hidden bugs and less to review.
- **You stay in control.** This is the whole idea of the [rules for using AI](?id=using-ai): the AI types faster than you, but **you** are the one who designs the app.

Notice that you can only write a prompt like this if you already know the tools. That is why we learn PySide6, matplotlib and classes first, and use the AI to save typing, not thinking.

## The AI builds the interface, you write the logic

Use these prompts for the **user interface only**: the window, the widgets, the layout and the connections between them. That part is mostly typing, and the AI is fast at it.

The **logic** is yours: calculations, reading and writing files, processing data, the physics of a simulation. In a good starter prompt, every piece of logic becomes an **empty method with a name you chose**, waiting for your code. That is exactly what "I will change it later" does in the prompt above.

## What to put in a starter prompt

1. **The technologies:** the GUI library and the plotting library (PySide6, matplotlib).
2. **The file:** which file to create.
3. **The structure:** a window as a class, which layout, what goes where.
4. **The names:** of widgets, methods and important variables.
5. **The connections:** which button or signal calls which method.
6. **The empty methods:** say which methods to leave empty (or with a `print`), because you will write the logic yourself.

## More example prompts

Each of these prompts builds only the interface. The methods are left for you.

### A small calculator form

> Create a PySide6 app in a new file called `calculator.py`, with a main window written as a class. Add two `QLineEdit` fields named `first_number_input` and `second_number_input`, a button with the text "Add" named `add_button`, and a `QLabel` named `result_label`. Use a `QVBoxLayout`. Connect `add_button` to a method called `add_numbers`. Leave `add_numbers` empty, I will write the calculation myself.

### A table and a file button

> Create a PySide6 app in a new file called `table_viewer.py`, with a main window written as a class. Add a button with the text "Open file" named `open_file_button`, connected to a method called `open_file`. In `open_file`, open a file selection dialog and save the user's choice in `self.filename`. Below the button, add a `QTableWidget` named `data_table` with 3 columns. Also create an empty method called `fill_table`. I will write the code that reads the file and fills the table myself.

### A slider and a graph

> Create a PySide6 app in a new file called `sine_explorer.py`, with a main window written as a class. Add a matplotlib graph of at least 400 by 300 pixels, and under it a horizontal `QSlider` named `frequency_slider` with values from 1 to 10. Connect the slider's `valueChanged` signal to a method called `update_graph`. For now, `update_graph` should only print the slider's value. I will write the drawing myself.

### A timer with Start and Stop buttons

> Create a PySide6 app in a new file called `animation.py`, with a main window written as a class. Add a matplotlib graph of at least 400 by 400 pixels, and two buttons in a row under it: "Start" named `start_button` and "Stop" named `stop_button`. Create a `QTimer` named `timer` that calls a method called `step` every 50 milliseconds. `start_button` starts the timer and `stop_button` stops it. Leave `step` empty, I will write the movement myself.

## After the AI answers

1. **Read all the code** before you run it. If a line is unclear, ask the AI to explain it.
2. **Check that it followed your prompt:** the file name, the names, the structure. If it added things you didn't ask for, ask it to remove them.
3. **Run it** and make sure the skeleton works.
4. **Commit** it to git. Now you have a clean starting point to go back to, and you can start adding your own code.

## Next step: a design prompt

Once the skeleton works and is committed, you can make it look good with a **second, separate prompt**. Keep the design out of the first prompt: first get the structure right, then work on the looks.

Ask the AI to put the design in a **QSS file** (see QSS Style Files in the [PySide6 unit](?id=pyside6)). All the colors, fonts and spacing then live in one file, and your Python code stays short and easy to read.

### A simple design prompt

> Design the window in `app.py` in a modern way, using a QSS file called `style.qss`. Load the file once, when the app starts. Don't change anything else in the Python code.

### A design prompt with your own choices

If you already know what you want, say it. Every detail you give is a decision the AI doesn't make for you:

> Design the window in `app.py` in a modern way, using a QSS file called `style.qss`. Load the file once, when the app starts. Use a light gray background, dark blue buttons with white text and rounded corners, a lighter blue when the mouse is over a button, and a 12 pt font. Add some spacing between the widgets. Don't change anything else in the Python code.

![The starter window before the design prompt, and after it with style.qss](content/images/prompt_design_before_after.png)

The Python code is the same in both windows. Only `style.qss` was added and loaded. This is the file:

```css
QMainWindow {
    background-color: #eef1f5;
}
QWidget {
    font-size: 12pt;
}
QPushButton {
    background-color: #1e3a8a;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    margin: 6px 4px;
    font-weight: bold;
}
QPushButton:hover {
    background-color: #3b82f6;
}
```

Now it's your turn: **open `style.qss` and play with it.** Change a color, make the corners rounder, make the font bigger, then run the app again and see what happened. The file is short and easy to read, so you don't need another prompt for every small change. The AI gave you a starting point, and the final look should be yours. Tip: search for "hex color picker" to find the code of any color you like.

Other things you can ask for: a dark theme, a specific font, an accent color for one important button (give it a name with `setObjectName` and style it with `#name`), or a border around the graph area.

"Don't change anything else in the Python code" is important. Check with git that the AI kept its word: the changes should be the new `style.qss`, the line or two that load it, and perhaps a few `setObjectName` calls. If you don't like the result, discard the changes and try a different prompt. If you like it, commit it.

### Making the graph look good

The QSS file styles the window, but not the graph: matplotlib draws the graph itself. So the graph gets a prompt of its own. Here you don't need the technical words. Describe what you want to see, in plain language:

> Make the graph in `draw_graph` look nicer. Remove the lines on the top and right sides of the graph, add a title and a name for each axis, add a light grid in the background, make the line thicker and dark blue with a dot on every point, and make the background of the graph the same light gray as the window. Only change `draw_graph`.

![The styled window before the graph prompt, and after it](content/images/prompt_graph_before_after.png)

The AI changes only `draw_graph`:

```python
def draw_graph(self):
    self.ax.clear()
    self.figure.set_facecolor("#eef1f5")
    self.ax.set_facecolor("#eef1f5")
    self.ax.spines["top"].set_visible(False)
    self.ax.spines["right"].set_visible(False)
    self.ax.grid(True, color="#d0d5dd")
    self.ax.set_axisbelow(True)
    self.ax.plot([0, 1, 2, 3, 4], [0, 1, 4, 9, 16],
                 color="#1e3a8a", linewidth=2.5, marker="o")
    self.ax.set_title("My data", fontweight="bold")
    self.ax.set_xlabel("x")
    self.ax.set_ylabel("y")
    self.canvas.draw()
```

Now read the code. "The lines on the top and right" are called **spines** in matplotlib, and you just learned how to hide them. Next time you can do it yourself, without a prompt. When you replace the example data with your own, keep the styling lines and change only the `plot` line and the titles.

### Zoom and save the graph

Now let's let the user zoom in and save the graph as a picture. matplotlib already has a toolbar that does this, so ask for it by name, and ask for it to be styled like the rest of the app:

> Add a small toolbar above the graph with only two buttons: one to zoom in and one to save the graph as an image. Use matplotlib's ready-made toolbar, but keep only those two buttons and hide the mouse coordinates. Style it to match the rest of the app by adding rules to `style.qss`: the same background as the window, white rounded buttons, and a light blue background when the mouse is over a button or when a button is on. Don't change `draw_graph`.

![The app before the toolbar prompt, and after it](content/images/prompt_toolbar_before_after.png)

The Python change is small: a tiny class above `MainWindow` that keeps only two of the toolbar's buttons, and two lines in `__init__` that create the toolbar and put it in the layout:

```python
from matplotlib.backends.backend_qtagg import NavigationToolbar2QT


class GraphToolbar(NavigationToolbar2QT):
    # Keep only the Zoom and Save buttons of matplotlib's toolbar
    toolitems = [t for t in NavigationToolbar2QT.toolitems if t[0] in ("Zoom", "Save")]
```

```python
        self.toolbar = GraphToolbar(self.canvas, self, coordinates=False)
        layout.addWidget(self.toolbar)    # just before layout.addWidget(self.canvas)
```

The look comes from new rules at the end of `style.qss`:

```css
QToolBar {
    background-color: #eef1f5;
    border: none;
    spacing: 4px;
}
QToolButton {
    background-color: white;
    border: 1px solid #d0d5dd;
    border-radius: 6px;
    padding: 4px;
}
QToolButton:hover {
    background-color: #dbeafe;
}
QToolButton:checked {
    background-color: #bfdbfe;
    border-color: #1e3a8a;
}
```

What the two buttons do:

- **Zoom** (the magnifying glass): click it, then drag a rectangle over the part of the graph you want to see bigger. Drag with the right mouse button to zoom out. Click the button again to turn zoom off.
- **Save** (the disk): saves the graph as a PNG, JPG, PDF or SVG file.

matplotlib's toolbar has more buttons: Home (back to the full view), Back, Forward, Pan (move the graph around) and a few settings. Want one of them too? Add its name to the list in `GraphToolbar`, for example `("Home", "Zoom", "Save")`. Want to change the look? Change the colors in `style.qss`, just as you did before.
