# חלונות מרובים ב-PySide6

תוכניות רבות צריכות יותר מחלון אחד. למשל, חלון "אודות" (About), או חלון שני שמציג גרף.

המדריך הזה מחולק לשני חלקים:

1. **חלון שני פשוט** - השלבים הבסיסיים ליצירה ופתיחה של חלון נוסף.
2. **שני חלונות שמדברים זה עם זה** - שיתוף מידע בין החלונות.

## חלק 1: חלון שני פשוט

נוסיף לתוכנית חלון **About**. בחלון הראשי יש כפתור "About", ולחיצה עליו פותחת את חלון ה-About.

![החלון הראשי וחלון ה-About](content/images/pyside_oop_about_window.png)

התהליך כולל 4 שלבים:

1. יוצרים מחלקה (class) עבור החלון השני.
2. מייבאים אותה בקוד של החלון הראשי.
3. יוצרים אובייקט של החלון השני ב-`__init__` של החלון הראשי.
4. קוראים ל-`show()` כשרוצים שהוא יופיע, למשל כשלוחצים על כפתור.

נשתמש ב**שני קבצים**, באותה תיקייה:

* `about_window.py` - חלון ה-About.
* `main.py` - החלון הראשי. זה הקובץ שמריצים.

### שלב 1: יצירת המחלקה של החלון השני

החלון השני הוא חלון OOP רגיל לגמרי. כתבו אותו בקובץ משלו, `about_window.py`:

```python
from PySide6.QtWidgets import QWidget, QLabel


class AboutWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("About")
        self.setGeometry(550, 100, 300, 150)

        self.info_label = QLabel("My Calculator\nVersion 1.0\nWritten by: Dana Cohen", self)
        self.info_label.setGeometry(30, 30, 240, 90)
```

בקובץ הזה **אין** `QApplication` ואין את החלק של `if __name__ == "__main__":`. הוא רק מתאר את החלון. התוכנית עצמה מופעלת מתוך `main.py`.

### שלב 2: ייבוא בחלון הראשי

בראש הקובץ `main.py`, מייבאים את המחלקה מהקובץ. את שם הקובץ כותבים **בלי** `.py`:

```python
from about_window import AboutWindow
```

### שלב 3: יצירת החלון השני ב-`__init__`

ב-`__init__` של החלון הראשי, יוצרים אובייקט **אחד** של החלון השני ושומרים אותו עם `self.`:

```python
class MainWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.about_window = AboutWindow()    # created, but not visible yet
        self.initUI()
```

* חלון ה-About קיים עכשיו, אבל אף אחד לא קרא עליו ל-`show()`, ולכן הוא **מוסתר**.
* הוא נשמר בתור `self.about_window` כדי שהמתודות האחרות (כמו המתודה של הכפתור) יוכלו להשתמש בו.

### שלב 4: להציג אותו כשצריך

מוסיפים כפתור, וקוראים ל-`show()` במתודה של הכפתור:

```python
    def initUI(self):
        self.setWindowTitle("My Calculator")
        self.setGeometry(100, 100, 400, 200)

        self.about_button = QPushButton("About", self)
        self.about_button.setGeometry(30, 30, 120, 40)
        self.about_button.clicked.connect(self.about_clicked)

    def about_clicked(self):
        self.about_window.show()
```

### הקובץ `main.py` המלא

```python
from PySide6.QtWidgets import QApplication, QWidget, QPushButton
from about_window import AboutWindow


class MainWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.about_window = AboutWindow()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("My Calculator")
        self.setGeometry(100, 100, 400, 200)

        self.about_button = QPushButton("About", self)
        self.about_button.setGeometry(30, 30, 120, 40)
        self.about_button.clicked.connect(self.about_clicked)

    def about_clicked(self):
        self.about_window.show()


if __name__ == "__main__":
    app = QApplication()
    window = MainWindow()
    window.show()
    app.exec()
```

הריצו את `main.py` ולחצו על **About**. חלון ה-About נפתח. סגרו אותו עם ה-**X** שלו ולחצו שוב על **About**: הוא נפתח שוב.

## חלק 2: שני חלונות שמדברים זה עם זה

חלון ה-About רק **מציג** מידע. הרבה פעמים שני החלונות צריכים **לשתף מידע**. למשל, חלון ראשי שבו המשתמש מזין טמפרטורה, וחלון גרף שמציג אותה.

נבנה שני חלונות מחוברים:

* **`HeatTransferWidget`** - החלון הראשי.
* **`GraphWindow`** - חלון שני.

כל חלון יוכל **להגיע לחלון השני**. כדי לשמור על דוגמה קצרה, שתי המחלקות נמצאות כאן ב**קובץ אחד**. אפשר גם לפצל אותן לשני קבצים, כמו בחלק 1.

![שני חלונות מחוברים](content/images/OOP_windows.png)

התמונה ממחישה את הרעיון:

* **החץ האדום:** החלון הראשי שומר את החלון השני ב-`self.graph_window`.
* **החץ הירוק:** החלון השני שומר את החלון הראשי ב-`self.main_window`.

### שלב 1: החלון השני

החלון השני הוא חלון OOP רגיל, עם תוספת אחת: הוא מקבל את החלון הראשי כפרמטר ושומר אותו.

```python
class GraphWindow(QWidget):

    def __init__(self, main_window=None):
        super().__init__()
        self.main_window = main_window    # remember who the main window is
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Graph Window")
        self.setGeometry(560, 100, 300, 200)
```

* `main_window=None` - פרמטר חדש. דרכו יועבר החלון הראשי.
* `self.main_window = main_window` - שומר אותו, כך שכל מתודה של `GraphWindow` תוכל להשתמש בו בהמשך.

> **חשוב:** **אל** תכתבו `super().__init__(main_window)`. כשנותנים לווידג'ט הורה (parent), הוא ממוקם **בתוך** ההורה, וכך ה"חלון" יופיע כחלק מהחלון הראשי במקום כחלון נפרד.

### שלב 2: יצירת החלון השני בתוך החלון הראשי

החלון הראשי יוצר את החלון השני **פעם אחת**, ב-`__init__` שלו:

```python
class HeatTransferWidget(QWidget):

    def __init__(self):
        super().__init__()
        self.graph_window = GraphWindow(self)    # create the second window
        self.initUI()
```

* `GraphWindow(self)` - יוצר את החלון השני ומעביר לו את **`self`** (החלון הראשי). כך החלון השני מקבל את ה-`main_window` שלו.
* `self.graph_window = ...` - שומר את החלון השני, כך שכל מתודה של החלון הראשי תוכל להשתמש בו.

החלון השני קיים עכשיו, אבל הוא **עדיין לא גלוי**. אף אחד לא קורא עליו ל-`show()`.

**למה ליצור אותו ב-`__init__`?**

* יש רק חלון שני **אחד** לכל התוכנית.
* הווידג'טים והמידע שלו נשמרים גם כשהוא מוסתר. כשהוא מופיע שוב, הוא נראה בדיוק כמו קודם.

### שלב 3: הצגה והסתרה

לכל חלון יש שתי מתודות ששולטות בשאלה אם הוא גלוי:

| מתודה | מה היא עושה |
|---|---|
| `show()` | גורמת לחלון להופיע |
| `hide()` | גורמת לחלון להיעלם (הוא עדיין קיים, עם כל המידע שלו) |
| `isVisible()` | מחזירה `True` אם החלון מוצג כרגע |

הוסיפו לחלון הראשי שני כפתורים שמציגים ומסתירים את החלון השני:

```python
    def initUI(self):
        self.setWindowTitle("Main Window")
        self.setGeometry(100, 100, 400, 200)

        self.show_button = QPushButton("Show graph", self)
        self.show_button.setGeometry(30, 80, 120, 40)
        self.show_button.clicked.connect(self.show_clicked)

        self.hide_button = QPushButton("Hide graph", self)
        self.hide_button.setGeometry(170, 80, 120, 40)
        self.hide_button.clicked.connect(self.hide_clicked)

    def show_clicked(self):
        self.graph_window.show()

    def hide_clicked(self):
        self.graph_window.hide()
```

החלון השני יכול גם להסתיר **את עצמו**, עם `self.hide()`:

```python
    # inside GraphWindow
    def close_clicked(self):
        self.hide()
```

> **הערה:** גם לחיצה על ה-**X** של החלון השני רק מסתירה אותו. אפשר להציג אותו שוב אחר כך עם `show()`.

### שלב 4: שיתוף מידע בין החלונות

כל חלון יכול להגיע לחלון השני, ודרכו - לכל הווידג'טים והמתודות שלו.

#### חלון ראשי ← חלון שני

משתמשים ב-**`self.graph_window`**:

```python
    # inside HeatTransferWidget
    def temperature_changed(self, value):
        self.graph_window.update_temperature(value)
```

זה קורא למתודה של החלון השני:

```python
    # inside GraphWindow
    def update_temperature(self, value):
        self.temp_label.setText(f"Temperature: {value}")
```

#### חלון שני ← חלון ראשי

משתמשים ב-**`self.main_window`**:

```python
    # inside GraphWindow
    def reset_clicked(self):
        self.main_window.temp_spin.setValue(20)
```

זה משנה את ה-spin box שנמצא בחלון הראשי.

#### בקיצור

| הקוד כתוב בתוך... | כדי להגיע לחלון השני, משתמשים ב... | דוגמה |
|---|---|---|
| `HeatTransferWidget` (ראשי) | `self.graph_window` | `self.graph_window.temp_label.setText("Hi")` |
| `GraphWindow` (שני) | `self.main_window` | `self.main_window.temp_spin.value()` |

> **טיפ:** אפשר לגשת ישירות לווידג'טים של החלון השני, כמו `self.main_window.temp_spin`. בדרך כלל נקי יותר לקרוא לאחת ה**מתודות** שלו, כמו `self.graph_window.update_temperature(value)`. כך כל חלון אחראי על הווידג'טים של עצמו.

### שלב 5: סגירת שני החלונות יחד

תוכנית PySide6 ממשיכה לרוץ כל עוד **אחד כלשהו** מהחלונות שלה פתוח. אם המשתמש סוגר את החלון הראשי בזמן שהחלון השני עדיין גלוי, התוכנית לא מסתיימת.

כדי לסגור את החלון השני יחד עם החלון הראשי, הוסיפו לחלון הראשי את המתודה הזו:

```python
    # inside HeatTransferWidget
    def closeEvent(self, event):
        self.graph_window.close()
```

`closeEvent` הוא שם מתודה מיוחד. PySide6 קוראת לה אוטומטית כשהחלון נסגר.

### התוכנית המלאה

![התוכנית המלאה](content/images/pyside_oop_two_windows.png)

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton, QSpinBox


class GraphWindow(QWidget):

    def __init__(self, main_window=None):
        super().__init__()
        self.main_window = main_window
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Graph Window")
        self.setGeometry(560, 100, 300, 200)

        self.temp_label = QLabel("Temperature: 20", self)
        self.temp_label.setGeometry(30, 30, 240, 30)

        self.reset_button = QPushButton("Reset temperature", self)
        self.reset_button.setGeometry(30, 80, 150, 40)
        self.reset_button.clicked.connect(self.reset_clicked)

        self.close_button = QPushButton("Close", self)
        self.close_button.setGeometry(30, 130, 150, 40)
        self.close_button.clicked.connect(self.close_clicked)

    def update_temperature(self, value):
        self.temp_label.setText(f"Temperature: {value}")

    def reset_clicked(self):
        self.main_window.temp_spin.setValue(20)

    def close_clicked(self):
        self.hide()


class HeatTransferWidget(QWidget):

    def __init__(self):
        super().__init__()
        self.graph_window = GraphWindow(self)
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Main Window")
        self.setGeometry(100, 100, 400, 200)

        self.temp_spin = QSpinBox(self)
        self.temp_spin.setGeometry(30, 30, 100, 30)
        self.temp_spin.setRange(-50, 150)
        self.temp_spin.setValue(20)
        self.temp_spin.valueChanged.connect(self.temperature_changed)

        self.show_button = QPushButton("Show graph", self)
        self.show_button.setGeometry(30, 80, 120, 40)
        self.show_button.clicked.connect(self.show_clicked)

        self.hide_button = QPushButton("Hide graph", self)
        self.hide_button.setGeometry(170, 80, 120, 40)
        self.hide_button.clicked.connect(self.hide_clicked)

    def temperature_changed(self, value):
        self.graph_window.update_temperature(value)

    def show_clicked(self):
        self.graph_window.show()

    def hide_clicked(self):
        self.graph_window.hide()

    def closeEvent(self, event):
        self.graph_window.close()


if __name__ == "__main__":
    app = QApplication()
    window = HeatTransferWidget()
    window.show()
    app.exec()
```

נסו את זה:

* לחצו על **Show graph** כדי לפתוח את החלון השני.
* שנו את המספר בחלון הראשי. התווית בחלון השני מתעדכנת (ראשי ← שני).
* לחצו על **Reset temperature** בחלון השני. המספר בחלון הראשי חוזר ל-20 (שני ← ראשי).
* השתמשו ב-**Hide graph**, **Close** ו-**Show graph** כדי להסתיר ולהציג את החלון השני.
