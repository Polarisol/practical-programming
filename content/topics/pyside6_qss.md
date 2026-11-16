# QSS Style Files

With `setStyleSheet("...")` on every widget, the same style strings repeat all over your code. A **QSS file** (Qt Style Sheet) keeps all the styles in **one file**, and one line of code applies them to the whole app.

![The same window without QSS and with style.qss, and which rule styled each part](content/images/pyside_qss_before_after.png)

## 1. Write the File

Create `style.qss` next to your `.py` file. Each **rule** is a selector (which widgets) and a block of `property: value;` pairs (the same properties as in `setStyleSheet`):

```css
QWidget {                     /* every widget */
    background-color: #f1f5f9;
    font-size: 14px;
}

QLabel#title {                /* only the label named "title" */
    font-size: 22px;
    font-weight: bold;
    color: #1d4ed8;
}

QLineEdit {                   /* every QLineEdit */
    background-color: white;
    border: 1px solid #94a3b8;
    border-radius: 6px;
    padding: 4px;
}

QPushButton {                 /* every QPushButton */
    background-color: #2563eb;
    color: white;
    border-radius: 6px;
    padding: 6px 12px;
}
```

## 2. Load It Once

Read the file and give its text to the **app**, before `app.exec()`:

```python
app = QApplication()

with open("style.qss") as f:
    app.setStyleSheet(f.read())

window = LoginWindow()
window.show()
app.exec()
```

To style one specific widget, give it a name in your code, and use `#name` in the file:

```python
self.title = QLabel("Welcome!")
self.title.setObjectName("title")     # matches QLabel#title
```

## 3. States

Add `:state` to a selector to change the look when something happens. No code needed:

```css
QPushButton:hover    { background-color: #3b82f6; }   /* mouse over it */
QPushButton:pressed  { background-color: #1e3a8a; }   /* being clicked */
QPushButton:disabled { background-color: #cbd5e1; color: #64748b; }
```

![A QPushButton in its normal, hover, pressed and disabled states](content/images/pyside_qss_states.png)

## In Short

| I want to style... | Selector |
|---|---|
| Every widget | `QWidget { ... }` |
| Every widget of one type | `QPushButton { ... }` |
| Several types together | `QLineEdit, QSpinBox { ... }` |
| One widget (with `setObjectName("title")`) | `#title { ... }` or `QLabel#title { ... }` |
| A widget when the mouse is over it | `QPushButton:hover { ... }` |
| A widget while it is clicked | `QPushButton:pressed { ... }` |
| A disabled widget | `QPushButton:disabled { ... }` |

* `/* ... */` is a comment in a QSS file.
* `FileNotFoundError`? Run the program from the folder that has `style.qss`.
* A dark theme is just another file: call `app.setStyleSheet(...)` again with `dark.qss`.
