# טופס בסיסי ב-PySide6 בגישת OOP

ככל שתוכניות גדלות, להחזיק כל רכיב (widget) וכל פונקציה כמשתנה גלובלי נהיה מבולגן וקשה למעקב. כשכותבים את החלון כ**מחלקה** (class), כל הרכיבים שלו והפונקציות שמגיבות להם נשמרים ביחד במקום אחד, וככה נכתבות כמעט כל תוכניות PySide6 אמיתיות.

## התבנית הבסיסית

```python
from PySide6.QtWidgets import QApplication, QWidget

class MyWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)

if __name__ == "__main__":
    app = QApplication()
    window = MyWindow()
    window.show()
    app.exec()
```

* `class MyWindow(QWidget)` - החלון שלנו **הוא** `QWidget` (is a), עם כל מה ש-`QWidget` יודע לעשות, ועוד כל מה שנוסיף.
* `super().__init__()` - קודם כול נותן ל-`QWidget` לאתחל את עצמו. תמיד השאירו את השורה הזו.
* `initUI(self)` - המקום שבו בונים את החלון: קובעים את הכותרת והגודל שלו, ויוצרים את הרכיבים שלו.
* בתוך המחלקה, החלון נקרא **`self`**. לכן `window.setWindowTitle(...)` מהטופס שאינו OOP הופך ל-`self.setWindowTitle(...)`.
* `if __name__ == "__main__":` - הקוד שמריץ את התוכנית. הוא זהה לזה שבטופס שאינו OOP, חוץ מזה שהחלון נוצר עם `MyWindow()` במקום `QWidget()`.

## הוספת רכיבים

רכיבים נוצרים בתוך `initUI`. יש שני הבדלים לעומת הטופס שאינו OOP:

1. ההורה (parent) של הרכיב הוא **`self`** (החלון) במקום `window`.
2. הרכיב נשמר בתור **`self.something`** במקום במשתנה רגיל.

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton

class MyWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)

        self.label = QLabel("Hello, PySide6!", self)
        self.label.setGeometry(30, 30, 200, 30)

        self.button = QPushButton("Click me", self)
        self.button.setGeometry(30, 80, 120, 40)
```

**למה `self.label` ולא סתם `label`?** משתנה רגיל כמו `label` קיים רק בתוך `initUI` ונעלם כש-`initUI` מסתיימת. `self.label` נשמר **בתוך אובייקט החלון**, כך שכל מתודה אחרת של המחלקה יכולה להשתמש בו אחר כך, למשל כדי לשנות את הטקסט שלו כשלוחצים על כפתור.

> **טיפ:** רכיב שלא תצטרכו לגעת בו שוב אחרי שיצרתם אותו (כמו תווית כותרת קבועה) יכול להיות משתנה רגיל. כל רכיב שתקראו ממנו או תשנו אותו אחר כך חייב להישמר עם `self.`.

## חיבור לאותות ותגובה אליהם

הפונקציות שמגיבות לאותות (signals) הופכות ל**מתודות** של המחלקה:

* כותבים את המתודה בתוך המחלקה, עם `self` כפרמטר הראשון שלה.
* מחברים את האות ב-`initUI` עם **`self.`** לפני שם המתודה (ועדיין בלי סוגריים).
* בתוך המתודה, משתמשים ב-`self.` כדי להגיע לכל רכיב.

```python
    def initUI(self):
        # ... widgets created as above ...
        self.button.clicked.connect(self.button_clicked)

    def button_clicked(self):
        self.label.setText("The button was clicked!")
```

### אותות ששולחים ערך

אם אות שולח ערך (כמו `textChanged` של `QLineEdit` או `valueChanged` של `QSpinBox`), הערך מגיע **אחרי** `self` בפרמטרים של המתודה:

```python
        self.name_input = QLineEdit(self)
        self.name_input.textChanged.connect(self.name_changed)

    def name_changed(self, text):
        self.label.setText(f"Hello {text}")
```

## התוכנית המלאה

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton, QLineEdit

class MyWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)

        self.label = QLabel("Hello, PySide6!", self)
        self.label.setGeometry(30, 30, 300, 30)

        self.name_input = QLineEdit(self)
        self.name_input.setGeometry(30, 80, 200, 30)
        self.name_input.setPlaceholderText("Enter your name")
        self.name_input.textChanged.connect(self.name_changed)

        self.button = QPushButton("Click me", self)
        self.button.setGeometry(30, 130, 120, 40)
        self.button.clicked.connect(self.button_clicked)

    def name_changed(self, text):
        self.label.setText(f"Hello {text}")

    def button_clicked(self):
        self.label.setText("The button was clicked!")

if __name__ == "__main__":
    app = QApplication()
    window = MyWindow()
    window.show()
    app.exec()
```

## בלי OOP מול עם OOP במבט אחד

| | טופס בלי OOP | טופס עם OOP |
|---|---|---|
| יצירת החלון | `window = QWidget()` | `class MyWindow(QWidget)` + `window = MyWindow()` |
| הגדרת החלון | `window.setWindowTitle(...)` | `self.setWindowTitle(...)` בתוך `initUI` |
| ההורה של הרכיב | `QLabel("text", window)` | `QLabel("text", self)` |
| שמירת רכיב | `label = ...` | `self.label = ...` |
| פונקציית התגובה | `def button_clicked():` | `def button_clicked(self):` (מתודה) |
| חיבור אות | `button.clicked.connect(button_clicked)` | `self.button.clicked.connect(self.button_clicked)` |
| שימוש ברכיב בתוך הפונקציה | `label.setText(...)` | `self.label.setText(...)` |
