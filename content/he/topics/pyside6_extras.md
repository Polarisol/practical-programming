# תוספות

עוד שלושה דברים שגורמים לתוכנת PySide6 להיראות ולהרגיש כמו אפליקציה "אמיתית": **סרגל תפריטים** (menu bar) בראש החלון, **מפצלים** (splitters) שמאפשרים למשתמש לגרור ולשנות את הגודל של חלקים בחלון, ו-**פריסות** (layouts) שמסדרות את הווידג'טים בעצמן ומתאימות אותם כשהחלון משנה את גודלו.

## חלק 1: סרגל התפריטים העליון

סרגל התפריטים הוא השורה בראש החלון עם תפריטים כמו **File**, **Edit** ו-**Help**. לחיצה על תפריט פותחת רשימה של פריטים, ולחיצה על פריט מריצה מתודה, בדיוק כמו לחיצה על כפתור.

![חלון עם סרגל תפריטים: File, Edit ו-View. תפריט File פתוח ומציג את Clear ואת Exit (Ctrl+Q)](content/images/pyside_menubar.png)

### שלב 1: להשתמש ב-`QMainWindow` במקום ב-`QWidget`

עד עכשיו מחלקת החלון שלנו ירשה מ-`QWidget`. ל-`QWidget` פשוט אין סרגל תפריטים. בשביל סרגל תפריטים נשתמש ב-**`QMainWindow`**, שהוא חלון שכבר יש בו מקום לסרגל תפריטים למעלה (ולשורת סטטוס (status bar) למטה).

```python
from PySide6.QtWidgets import QApplication, QMainWindow


class MyWindow(QMainWindow):        # QMainWindow instead of QWidget

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)
```

כל השאר נשאר אותו דבר: `super().__init__()`, `initUI`, `setWindowTitle`, `setGeometry`, והחלק של `if __name__ == "__main__":`.

### שלב 2: הווידג'ט המרכזי

יש הבדל אחד באופן שבו מוסיפים ווידג'טים. ל-`QMainWindow` יש כמה אזורים: סרגל התפריטים למעלה, שורת הסטטוס למטה, ו-**הווידג'ט המרכזי** (central widget) באמצע. הווידג'טים שלנו נכנסים לווידג'ט המרכזי.

אם יוצרים ווידג'טים עם `self` בתור ההורה (parent) שלהם, כמו קודם, הם ממוקמים בפינה השמאלית העליונה של החלון, **מתחת** לסרגל התפריטים, וסרגל התפריטים מסתיר אותם.

הפתרון: ליצור `QWidget` ריק, להגדיר אותו בתור הווידג'ט המרכזי, ולהשתמש **בו** בתור ההורה של הווידג'טים שלכם:

```python
    def initUI(self):
        self.setWindowTitle("Window Title")
        self.setGeometry(100, 100, 400, 300)

        self.central = QWidget()
        self.setCentralWidget(self.central)

        self.label = QLabel("Hello", self.central)      # parent is self.central, not self
        self.label.setGeometry(30, 20, 200, 30)
```

המיקום `(30, 20)` נמדד עכשיו מהפינה השמאלית העליונה של הווידג'ט המרכזי, שמתחיל **מתחת** לסרגל התפריטים. כך ש-`setGeometry` עובד בדיוק כמו שאתם רגילים.

### שלב 3: יצירת תפריט

מקבלים את סרגל התפריטים של החלון עם `self.menuBar()`, ומוסיפים אליו תפריט עם `addMenu`:

```python
        menu_bar = self.menuBar()
        file_menu = menu_bar.addMenu("File")
        help_menu = menu_bar.addMenu("Help")
```

התפריטים מופיעים בסרגל לפי הסדר שבו הם נוספו.

### שלב 4: הוספת פריטים (פעולות) לתפריט

פריט בתפריט נקרא **פעולה** (action, `QAction`). מייבאים אותו מ-`PySide6.QtGui`:

```python
from PySide6.QtGui import QAction
```

הוספת פריט כוללת 3 שלבים, מאוד דומה לכפתור:

1. יוצרים את הפעולה עם הטקסט שלה, ועם `self` בתור ההורה שלה.
2. מחברים את הסיגנל **`triggered`** שלה למתודה. `triggered` הוא הגרסה של הפעולה ל-`clicked` של כפתור.
3. מוסיפים את הפעולה לתפריט.

```python
        self.clear_action = QAction("Clear", self)                 # 1. create
        self.clear_action.triggered.connect(self.clear_clicked)    # 2. connect
        file_menu.addAction(self.clear_action)                     # 3. add to the menu
```

משתמשים ב-`addSeparator()` כדי לצייר קו בין קבוצות של פריטים:

```python
        file_menu.addAction(self.clear_action)
        file_menu.addSeparator()
        file_menu.addAction(self.exit_action)
```

### קיצורי מקלדת

אפשר להפעיל פעולה גם מהמקלדת. מגדירים את הקיצור עם `setShortcut`, ו-PySide6 כותבת אותו בעצמה ליד הפריט בתפריט:

```python
        self.exit_action = QAction("Exit", self)
        self.exit_action.setShortcut("Ctrl+Q")
        self.exit_action.triggered.connect(self.close)
```

עכשיו **Ctrl+Q** סוגר את החלון, גם כשהתפריט לא פתוח.

שימו לב ל-`self.close`: לחלון כבר יש מתודה `close`, אז אפשר להתחבר אליה ישירות, בלי לכתוב מתודה משלנו.

### תפריטים בתוך תפריטים

תפריט יכול להכיל תפריט אחר (**תת-תפריט**, submenu). קוראים ל-`addMenu` על התפריט במקום על סרגל התפריטים:

```python
        edit_menu = menu_bar.addMenu("Edit")
        case_menu = edit_menu.addMenu("Change Case")     # a submenu inside Edit
        case_menu.addAction(self.upper_action)
        case_menu.addAction(self.lower_action)
```

### פריטי סימון (פועל/כבוי)

פעולה יכולה להיות **ניתנת לסימון** (checkable), כמו תיבת סימון: כל לחיצה מעבירה אותה בין מצב פועל לכבוי, וכשהיא פועלת מוצג לידה סימן וי. הסיגנל `toggled` שלה שולח `True` או `False`, בדיוק כמו כפתור מתג:

```python
        self.bold_action = QAction("Bold", self)
        self.bold_action.setCheckable(True)
        self.bold_action.toggled.connect(self.bold_toggled)

    def bold_toggled(self, checked):
        if checked:
            print("Bold is on")
        else:
            print("Bold is off")
```

### דוגמה: עורך טקסט קטן

בחלון יש תיבת טקסט (`QTextEdit`), ושלושה תפריטים:

* **File**: Clear, ו-Exit (Ctrl+Q).
* **Edit**: תת-תפריט **Change Case** עם UPPER CASE ו-lower case.
* **View**: פריט **Read Only** שניתן לסימון.

```python
from PySide6.QtWidgets import QApplication, QMainWindow, QWidget, QTextEdit
from PySide6.QtGui import QAction


class EditorWindow(QMainWindow):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Small Editor")
        self.setGeometry(100, 100, 500, 350)

        # ----- the central widget and its widgets -----
        self.central = QWidget()
        self.setCentralWidget(self.central)

        self.text_box = QTextEdit(self.central)
        self.text_box.setGeometry(10, 10, 480, 300)

        # ----- the actions -----
        self.clear_action = QAction("Clear", self)
        self.clear_action.triggered.connect(self.clear_clicked)

        self.exit_action = QAction("Exit", self)
        self.exit_action.setShortcut("Ctrl+Q")
        self.exit_action.triggered.connect(self.close)

        self.upper_action = QAction("UPPER CASE", self)
        self.upper_action.triggered.connect(self.upper_clicked)

        self.lower_action = QAction("lower case", self)
        self.lower_action.triggered.connect(self.lower_clicked)

        self.read_only_action = QAction("Read Only", self)
        self.read_only_action.setCheckable(True)
        self.read_only_action.toggled.connect(self.read_only_toggled)

        # ----- the menus -----
        menu_bar = self.menuBar()

        file_menu = menu_bar.addMenu("File")
        file_menu.addAction(self.clear_action)
        file_menu.addSeparator()
        file_menu.addAction(self.exit_action)

        edit_menu = menu_bar.addMenu("Edit")
        case_menu = edit_menu.addMenu("Change Case")
        case_menu.addAction(self.upper_action)
        case_menu.addAction(self.lower_action)

        view_menu = menu_bar.addMenu("View")
        view_menu.addAction(self.read_only_action)

    def clear_clicked(self):
        self.text_box.clear()

    def upper_clicked(self):
        text = self.text_box.toPlainText()
        self.text_box.setPlainText(text.upper())

    def lower_clicked(self):
        text = self.text_box.toPlainText()
        self.text_box.setPlainText(text.lower())

    def read_only_toggled(self, checked):
        self.text_box.setReadOnly(checked)


if __name__ == "__main__":
    app = QApplication()
    window = EditorWindow()
    window.show()
    app.exec()
```

שימו לב:

* קודם יוצרים את הפעולות, ורק אחר כך מוסיפים אותן לתפריטים. זה שומר על הקוד מסודר: כל ה"מה כל פריט עושה" במקום אחד, וכל ה"איפה הוא מופיע" במקום אחר.
* המתודות שמחוברות לפעולות כתובות בדיוק כמו המתודות שמחוברות לכפתורים.

כך נראה העורך. משמאל, **Edit > Change Case** פתוח ומציג את תת-התפריט. מימין, **View** פתוח, ול-**Read Only** יש סימן וי כי לחצו עליו:

![משמאל: תפריט Edit עם תת-התפריט Change Case פתוח. מימין: תפריט View עם Read Only מסומן](content/images/pyside_menubar_submenu_check.png)

> **הערה למשתמשי Mac:** ב-macOS סרגל התפריטים לא מוצג בתוך החלון. הוא מופיע בראש המסך, כמו בכל תוכנת Mac אחרת. הקוד זהה.

## חלק 2: מפצלים

**מפצל** (`QSplitter`) מחלק אזור לחלקים, עם ידית דקה ביניהם. המשתמש יכול **לגרור את הידית** כדי להגדיל חלק אחד ולהקטין את השני. ראיתם את זה בהרבה תוכנות: למשל ב-VS Code, שבה אפשר לגרור את הגבול בין רשימת הקבצים לקוד.

את `QSplitter` מייבאים מ-`PySide6.QtWidgets`, ואת כיוון הפיצול (`Qt`) מ-`PySide6.QtCore`:

```python
from PySide6.QtWidgets import QSplitter
from PySide6.QtCore import Qt
```

### יצירת מפצל

1. יוצרים את המפצל, עם הכיוון שלו:
   * `Qt.Horizontal` - החלקים זה לצד זה (שמאל וימין).
   * `Qt.Vertical` - החלקים אחד מעל השני (למעלה ולמטה).
2. מוסיפים אליו ווידג'טים עם `addWidget`. כל ווידג'ט הופך לחלק אחד, לפי הסדר שבו הם נוספו.

```python
        self.splitter = QSplitter(Qt.Horizontal)
        self.splitter.addWidget(self.left_text)     # left part
        self.splitter.addWidget(self.right_text)    # right part
```

הווידג'טים שמוסיפים למפצל נוצרים **בלי** הורה ו-**בלי** `setGeometry`. המפצל הופך להורה שלהם, והוא מחליט בעצמו על הגודל והמיקום שלהם.

הנה חלון עם מפצל אופקי ושתי תיבות טקסט. החץ הוורוד מראה את הידית ביניהן. גרירה שלה ימינה מגדילה את החלק השמאלי ומקטינה את החלק הימני:

![מפצל אופקי עם שתי תיבות טקסט, לפני ואחרי גרירת הידית ימינה](content/images/pyside_splitter_drag.png)

### לגרום למפצל למלא את החלון

מפצל הכי שימושי כשהוא ממלא את כל החלון, כך שכשהמשתמש מגדיל את החלון, גם החלקים גדלים. הדרך הקלה לעשות את זה היא ב-`QMainWindow`: להגדיר את המפצל בתור **הווידג'ט המרכזי**:

```python
        self.setCentralWidget(self.splitter)
```

הווידג'ט המרכזי תמיד ממלא את החלון (מתחת לסרגל התפריטים), אז גם המפצל.

### הגדרת הגדלים ההתחלתיים

כברירת מחדל המפצל מחלק בעצמו את המקום בין החלקים. כדי לבחור את הגדלים ההתחלתיים, נותנים ל-`setSizes` רשימה עם הגודל של כל חלק בפיקסלים, באותו סדר שבו הווידג'טים נוספו:

```python
        self.splitter.setSizes([150, 350])    # left part 150 pixels, right part 350 pixels
```

המשתמש עדיין יכול לגרור את הידית אחר כך.

### למנוע מחלק להיעלם

אם המשתמש גורר את הידית עד הסוף לצד אחד, החלק שבצד הזה **מתקפל** (collapses): הוא נעלם לגמרי. כדי למנוע את זה:

```python
        self.splitter.setChildrenCollapsible(False)
```

### חלק עם כמה ווידג'טים

כל חלק של מפצל הוא ווידג'ט **אחד**. כדי לשים כמה ווידג'טים בחלק אחד (למשל, שדה טקסט וכפתור), יוצרים `QWidget` ריק בתור **פאנל**, שמים בו את הווידג'טים עם `setGeometry` כמו תמיד, ומוסיפים את הפאנל למפצל:

```python
        self.left_panel = QWidget()

        self.name_input = QLineEdit(self.left_panel)        # parent is the panel
        self.name_input.setGeometry(10, 10, 130, 30)

        self.add_button = QPushButton("Add", self.left_panel)
        self.add_button.setGeometry(10, 50, 130, 30)

        self.splitter.addWidget(self.left_panel)            # the whole panel is one part
```

### מפצלים בתוך מפצלים

גם מפצל הוא ווידג'ט, אז אפשר להוסיף אותו למפצל **אחר**. כך בונים חלון שמחולק גם לשמאל/ימין וגם למעלה/למטה.

לדוגמה: חלק שמאלי, וצד ימני שמחולק לעליון ותחתון:

```python
        self.right_splitter = QSplitter(Qt.Vertical)
        self.right_splitter.addWidget(self.top_text)
        self.right_splitter.addWidget(self.bottom_text)

        self.main_splitter = QSplitter(Qt.Horizontal)
        self.main_splitter.addWidget(self.left_panel)
        self.main_splitter.addWidget(self.right_splitter)   # a splitter inside a splitter

        self.setCentralWidget(self.main_splitter)
```

```
+-----------+---------------------+
|           |      top_text       |
|   left    |                     |
|   panel   +---------------------+
|           |    bottom_text      |
|           |                     |
+-----------+---------------------+
```

### דוגמה: סרגל תפריטים ומפצלים ביחד

לחלון יש שלושה חלקים:

* **שמאל**: פאנל עם שדה טקסט וכפתור **Add**.
* **ימין למעלה**: תיבת טקסט שמקבלת כל שורה שנוספה.
* **ימין למטה**: תווית שמראה כמה שורות נוספו.

ובנוסף סרגל תפריטים עם **File > Clear** ו-**File > Exit**.

```python
from PySide6.QtWidgets import (QApplication, QMainWindow, QWidget, QSplitter,
                               QLineEdit, QPushButton, QTextEdit, QLabel)
from PySide6.QtGui import QAction
from PySide6.QtCore import Qt


class NotesWindow(QMainWindow):

    def __init__(self):
        super().__init__()
        self.count = 0
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Notes")
        self.setGeometry(100, 100, 600, 400)

        # ----- left part: a panel with a line edit and a button -----
        self.left_panel = QWidget()

        self.note_input = QLineEdit(self.left_panel)
        self.note_input.setGeometry(10, 10, 160, 30)

        self.add_button = QPushButton("Add", self.left_panel)
        self.add_button.setGeometry(10, 50, 160, 30)
        self.add_button.clicked.connect(self.add_clicked)

        # ----- right part: a text box above a label -----
        self.notes_box = QTextEdit()
        self.notes_box.setReadOnly(True)

        self.count_label = QLabel("0 notes")

        self.right_splitter = QSplitter(Qt.Vertical)
        self.right_splitter.addWidget(self.notes_box)
        self.right_splitter.addWidget(self.count_label)
        self.right_splitter.setSizes([300, 50])

        # ----- the main splitter fills the window -----
        self.main_splitter = QSplitter(Qt.Horizontal)
        self.main_splitter.addWidget(self.left_panel)
        self.main_splitter.addWidget(self.right_splitter)
        self.main_splitter.setSizes([180, 420])
        self.main_splitter.setChildrenCollapsible(False)

        self.setCentralWidget(self.main_splitter)

        # ----- the menu bar -----
        self.clear_action = QAction("Clear", self)
        self.clear_action.triggered.connect(self.clear_clicked)

        self.exit_action = QAction("Exit", self)
        self.exit_action.setShortcut("Ctrl+Q")
        self.exit_action.triggered.connect(self.close)

        file_menu = self.menuBar().addMenu("File")
        file_menu.addAction(self.clear_action)
        file_menu.addSeparator()
        file_menu.addAction(self.exit_action)

    def add_clicked(self):
        self.notes_box.append(self.note_input.text())
        self.note_input.clear()
        self.count = self.count + 1
        self.count_label.setText(str(self.count) + " notes")

    def clear_clicked(self):
        self.notes_box.clear()
        self.count = 0
        self.count_label.setText("0 notes")


if __name__ == "__main__":
    app = QApplication()
    window = NotesWindow()
    window.show()
    app.exec()
```

שימו לב:

* עדיין משתמשים ב-`self.setGeometry(...)` בשביל ה**חלון** עצמו. בתוך המפצלים, רק הווידג'טים שבפאנל השמאלי משתמשים ב-`setGeometry`, כי הם ממוקמים בתוך הפאנל, ולא ישירות בתוך מפצל.
* לא קראנו ל-`self.right_splitter.setChildrenCollapsible(False)`, אז המשתמש יכול לגרור את הידית התחתונה עד למטה ולהסתיר את התווית. נסו את זה.
* הגדילו את החלון: תיבת הטקסט גדלה, אבל שדה הטקסט והכפתור בפאנל השמאלי שומרים על הגודל שלהם, כי הם מוקמו עם `setGeometry`.

כך נראה החלון אחרי הוספת שלוש הערות. מימין, אותו חלון כששתי הידיות של המפצלים מסומנות בוורוד: הידית של `main_splitter` (שמאל/ימין) והידית של `right_splitter` (למעלה/למטה):

![החלון Notes. מימין, הידיות של main_splitter ושל right_splitter מסומנות בוורוד](content/images/pyside_splitter_notes.png)

## חלק 3: פריסות

### הבעיה עם `setGeometry`

עד עכשיו כל ווידג'ט מוקם עם `setGeometry`: מיקום מדויק וגודל מדויק, בפיקסלים. זה פשוט, אבל הווידג'טים **אף פעם לא משתנים**. כשהמשתמש מגדיל את החלון, הווידג'טים נשארים קטנים בפינה, ושאר החלון ריק:

![אותו חלון, קטן וגדול. עם setGeometry הווידג'טים שומרים על המקום והגודל שלהם](content/images/pyside_layout_problem.png)

וכשמקטינים את החלון, ווידג'טים נחתכים. ויש עוד בעיות: טקסט ארוך יותר בתווית אולי לא ייכנס בגודל שבחרתם, ובמסך עם גופנים גדולים יותר הכול עלול לעלות אחד על השני.

**פריסה** (layout) פותרת את זה. במקום להגיד לכל ווידג'ט בדיוק איפה להיות, אומרים לפריסה את **הסדר** של הווידג'טים: "אחד מתחת לשני", או "זה לצד זה", או "בטבלה". הפריסה מחשבת את המיקומים והגדלים בעצמה, ומחשבת אותם מחדש בכל פעם שהחלון משנה את גודלו.

את כל הפריסות מייבאים מ-`PySide6.QtWidgets`.

### השלבים הבסיסיים

שימוש בפריסה כולל 3 שלבים:

1. יוצרים את הווידג'טים **בלי** הורה ו-**בלי** `setGeometry`.
2. יוצרים את הפריסה ומוסיפים אליה את הווידג'טים עם `addWidget`, לפי הסדר.
3. נותנים את הפריסה לחלון עם `self.setLayout(layout)`.

```python
    def initUI(self):
        self.setWindowTitle("QVBoxLayout")

        self.label = QLabel("Enter your name:")      # 1. no parent, no setGeometry
        self.name_input = QLineEdit()
        self.ok_button = QPushButton("OK")

        layout = QVBoxLayout()                        # 2. create the layout
        layout.addWidget(self.label)                  #    and add the widgets, in order
        layout.addWidget(self.name_input)
        layout.addWidget(self.ok_button)

        self.setLayout(layout)                        # 3. the window uses the layout
```

* אין צורך בהורה: `setLayout` הופכת את החלון להורה של כל הווידג'טים שבפריסה.
* הווידג'טים עדיין נשמרים עם `self.`, כי המתודות של המחלקה צריכות אותם. הפריסה עצמה לא נחוצה אחרי `initUI`, אז משתנה רגיל `layout` מספיק.
* עדיין אפשר לתת לחלון גודל התחלתי עם `self.setGeometry(...)`. הפריסה ממלאת את הגודל שיש לחלון, יהיה אשר יהיה.

יש 4 פריסות נפוצות. בתמונות שלמטה, החלון השמאלי הוא מה שהמשתמש רואה, והחלון הימני מראה את התיבות של הפריסה מצוירות מעליו.

### `QVBoxLayout`: אחד מתחת לשני

**V** בשביל **vertical** (אנכי). כל `addWidget` שם את הווידג'ט **מתחת** לקודם. הקוד שלמעלה יוצר את החלון הזה:

![QVBoxLayout: התווית, שדה הטקסט והכפתור אחד מתחת לשני](content/images/pyside_layout_vbox.png)

כל ווידג'ט מקבל את כל הרוחב של החלון. התווית קיבלה את הגובה העודף, וזה לא נראה טוב. מתקנים את זה עם **מתיחה** (stretch), שמוסברת בהמשך.

### `QHBoxLayout`: זה לצד זה

**H** בשביל **horizontal** (אופקי). כל `addWidget` שם את הווידג'ט **מימין** לקודם:

```python
        self.back_button = QPushButton("Back")
        self.next_button = QPushButton("Next")
        self.cancel_button = QPushButton("Cancel")

        layout = QHBoxLayout()
        layout.addWidget(self.back_button)
        layout.addWidget(self.next_button)
        layout.addWidget(self.cancel_button)

        self.setLayout(layout)
```

![QHBoxLayout: שלושה כפתורים זה לצד זה](content/images/pyside_layout_hbox.png)

### `QGridLayout`: טבלה של שורות ועמודות

ברשת (grid), `addWidget` מקבלת גם את ה**שורה** וה**עמודה** של הווידג'ט. סופרים שורות ועמודות מ-0, כמו ברשימה:

```python
        layout.addWidget(self.some_button, 1, 2)     # row 1, column 2
```

ווידג'ט יכול גם לתפוס יותר מתא אחד. שני מספרים נוספים קובעים כמה **שורות** וכמה **עמודות** הוא תופס:

```python
        layout.addWidget(self.display, 0, 0, 1, 3)   # row 0, column 0, 1 row high, 3 columns wide
```

דוגמה: המקשים של מחשבון. התצוגה תופסת את 3 העמודות של שורה 0, ומקש ה-`0` תופס 2 עמודות:

```python
        layout = QGridLayout()

        self.display = QLineEdit("0")
        layout.addWidget(self.display, 0, 0, 1, 3)

        texts = ["7", "8", "9", "4", "5", "6", "1", "2", "3"]
        for i in range(9):
            button = QPushButton(texts[i])
            layout.addWidget(button, 1 + i // 3, i % 3)

        layout.addWidget(QPushButton("0"), 4, 0, 1, 2)
        layout.addWidget(QPushButton("="), 4, 2)

        self.setLayout(layout)
```

![QGridLayout: לוח מקשים של מחשבון, עם השורה והעמודה של כל תא](content/images/pyside_layout_grid.png)

המספרים בפינות של החלון הימני הם `row,column`, והגודל של הווידג'טים שתופסים יותר מתא אחד.

הלולאה מחשבת את המקום של כל אחד מ-9 הכפתורים: `i // 3` היא השורה (0, 0, 0, 1, 1, 1, ...) ו-`i % 3` היא העמודה (0, 1, 2, 0, 1, 2, ...). השורה מתחילה ב-1, כי שורה 0 היא התצוגה.

> **הערה:** כדי לחבר את הכפתורים שנוצרו בלולאה, מחברים כל אחד מהם בתוך הלולאה, למשל `button.clicked.connect(self.digit_clicked)`. בתוך `digit_clicked`, `self.sender().text()` אומר לכם על איזה כפתור לחצו.

### `QFormLayout`: תוויות ושדות

טופס הוא מקרה נפוץ: עמודה של תוויות משמאל, ועמודה של שדות מימין. `QFormLayout` עושה בדיוק את זה. `addRow` מקבלת את הטקסט של התווית ואת השדה, ויוצרת את התווית בעצמה:

```python
        self.name_input = QLineEdit()
        self.age_input = QSpinBox()
        self.email_input = QLineEdit()

        layout = QFormLayout()
        layout.addRow("Name:", self.name_input)
        layout.addRow("Age:", self.age_input)
        layout.addRow("Email:", self.email_input)

        self.setLayout(layout)
```

![QFormLayout: תוויות משמאל, שדות מימין](content/images/pyside_layout_form.png)

עמודת התוויות רחבה בדיוק כמו התווית הארוכה ביותר, והשדות מקבלים את שאר הרוחב.

### מתיחה: מקום ריק שדוחף

בדוגמה של `QVBoxLayout`, הגובה העודף ניתן לתווית, והווידג'טים התפזרו על פני החלון. בדרך כלל אנחנו רוצים שהווידג'טים יישארו ביחד למעלה, ושהמקום הריק יהיה למטה.

`addStretch()` מוסיפה לפריסה **קפיץ בלתי נראה**. הקפיץ תופס את כל המקום העודף, ודוחף את הווידג'טים הרחק ממנו:

```python
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.name_input)
        layout.addWidget(self.ok_button)
        layout.addStretch()                  # all the extra space goes here, at the bottom
```

![בלי addStretch הווידג'טים מפוזרים על פני החלון. עם addStretch הם נשארים למעלה](content/images/pyside_layout_stretch.png)

המקום שבו שמים את המתיחה קובע לאן הווידג'טים הולכים:

* מתיחה **אחרי** הווידג'טים: הווידג'טים נדחפים ל**התחלה** (למעלה, או שמאלה).
* מתיחה **לפני** הווידג'טים: הווידג'טים נדחפים ל**סוף** (למטה, או ימינה).
* מתיחה **לפני ואחרי**: הווידג'טים נמצאים ב**אמצע**.

שימוש נפוץ מאוד: כפתורים בצד הימני של חלון, כמו **OK** ו-**Cancel** בהרבה תוכנות. מוסיפים מתיחה **לפני** הכפתורים:

```python
        layout = QHBoxLayout()
        layout.addStretch()                  # pushes the buttons to the right
        layout.addWidget(self.back_button)
        layout.addWidget(self.next_button)
        layout.addWidget(self.cancel_button)
```

![בלי addStretch הכפתורים חולקים את הרוחב. עם addStretch לפניהם, הם נדחפים ימינה](content/images/pyside_layout_hstretch.png)

### מקדם מתיחה: מי מקבל יותר מקום

כששני ווידג'טים יכולים לגדול, הם מתחלקים במקום העודף שווה בשווה. כדי לתת לאחד מהם יותר, מוסיפים **מקדם מתיחה** (stretch factor) כערך שני ל-`addWidget`. המקום מתחלק לפי היחס בין המספרים:

```python
        layout = QHBoxLayout()
        layout.addWidget(self.left_text, 1)      # gets 1 part
        layout.addWidget(self.right_text, 2)     # gets 2 parts: twice as wide
```

![מקדמי מתיחה 1 ו-2: תיבת הטקסט הימנית רחבה פי שניים מהשמאלית](content/images/pyside_layout_stretch_factor.png)

### פריסות בתוך פריסות

חלונות אמיתיים הם לא רק עמודה אחת או שורה אחת. הפתרון הוא לשים פריסות **בתוך** פריסות. `addLayout` מוסיפה פריסה שלמה לפריסה אחרת, כאילו הייתה ווידג'ט אחד.

דוגמה: חלון **Sign Up** (הרשמה). הוא בנוי מ-3 חלקים, אחד מתחת לשני, ולכן הפריסה הראשית היא `QVBoxLayout`:

1. טופס עם הפרטים של המשתמש: `QFormLayout`.
2. שורה של כפתורים בצד ימין: `QHBoxLayout` עם מתיחה לפני הכפתורים.
3. תיבת טקסט שמציגה את רשימת המשתמשים שנוספו.

![פריסות בתוך פריסות: פריסת טופס ופריסת כפתורים בתוך פריסה ראשית אנכית](content/images/pyside_layout_nested.png)

הטריק הוא **לתכנן קודם**: מסתכלים על החלון שרוצים, ומציירים תיבות סביב קבוצות של ווידג'טים, כמו בחלון הימני. כל תיבה היא פריסה. אחר כך כותבים את הקוד מבפנים החוצה: קודם הפריסות הקטנות, ואז הפריסה הראשית שמחזיקה אותן.

```python
from PySide6.QtWidgets import (QApplication, QWidget, QLineEdit, QSpinBox, QPushButton,
                               QTextEdit, QVBoxLayout, QHBoxLayout, QFormLayout)


class SignUpWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Sign Up")
        self.setGeometry(100, 100, 340, 300)

        # ----- 1. the form -----
        self.name_input = QLineEdit()
        self.age_input = QSpinBox()
        self.email_input = QLineEdit()

        form_layout = QFormLayout()
        form_layout.addRow("Name:", self.name_input)
        form_layout.addRow("Age:", self.age_input)
        form_layout.addRow("Email:", self.email_input)

        # ----- 2. the buttons, pushed to the right -----
        self.add_button = QPushButton("Add")
        self.add_button.clicked.connect(self.add_clicked)
        self.clear_button = QPushButton("Clear")
        self.clear_button.clicked.connect(self.clear_clicked)

        buttons_layout = QHBoxLayout()
        buttons_layout.addStretch()
        buttons_layout.addWidget(self.add_button)
        buttons_layout.addWidget(self.clear_button)

        # ----- 3. the list of users -----
        self.users_box = QTextEdit()
        self.users_box.setReadOnly(True)

        # ----- the main layout holds everything -----
        main_layout = QVBoxLayout()
        main_layout.addLayout(form_layout)          # a layout inside a layout
        main_layout.addLayout(buttons_layout)       # a layout inside a layout
        main_layout.addWidget(self.users_box)

        self.setLayout(main_layout)

    def add_clicked(self):
        line = self.name_input.text() + ", " + str(self.age_input.value()) + ", " + self.email_input.text()
        self.users_box.append(line)
        self.name_input.clear()
        self.age_input.setValue(0)
        self.email_input.clear()

    def clear_clicked(self):
        self.users_box.clear()


if __name__ == "__main__":
    app = QApplication()
    window = SignUpWindow()
    window.show()
    app.exec()
```

שימו לב:

* רק הפריסה הראשית ניתנת לחלון עם `self.setLayout`. שאר הפריסות נמצאות בתוכה.
* משתמשים ב-`addLayout` בשביל פריסה, וב-`addWidget` בשביל ווידג'ט. אפשר להשתמש בשתיהן באותה פריסה.
* תיבת הטקסט היא הווידג'ט היחיד שיכול לגדול לגובה, אז היא מקבלת את כל הגובה העודף. אף דבר אחר לא צריך מתיחה.

עכשיו הגדילו את החלון. הכול מתאים את עצמו לבד: השדות נעשים רחבים יותר, הכפתורים נשארים בצד ימין, ותיבת הטקסט מקבלת את כל המקום החדש:

![החלון Sign Up בשני גדלים. הווידג'טים גדלים יחד עם החלון](content/images/pyside_layout_resize.png)

### ריווח ושוליים

שתי מתודות משנות את המקום הריק שפריסה משאירה:

```python
        layout.setSpacing(20)                     # 20 pixels between the widgets
        layout.setContentsMargins(5, 5, 5, 5)     # space around the edges: left, top, right, bottom
```

השתמשו ב-`setContentsMargins(0, 0, 0, 0)` על פריסה פנימית כשאתם רוצים שהיא תיגע בדיוק בקצוות.

### פריסות עם סרגל תפריטים ומפצלים

פריסות עובדות ביחד עם שני החלקים הראשונים:

* **ב-`QMainWindow`**, לא נותנים את הפריסה לחלון עצמו (כבר יש לו פריסה משלו, בשביל סרגל התפריטים והווידג'ט המרכזי). נותנים אותה במקום זאת ל**ווידג'ט המרכזי**:

  ```python
          self.central = QWidget()
          self.setCentralWidget(self.central)
          self.central.setLayout(main_layout)        # not self.setLayout
  ```

* **במפצל**, פאנל יכול להשתמש בפריסה במקום ב-`setGeometry`. כך הווידג'טים שבפאנל גדלים ומתכווצים כשהמשתמש גורר את הידית של המפצל:

  ```python
          self.left_panel = QWidget()
          panel_layout = QVBoxLayout()
          panel_layout.addWidget(self.note_input)
          panel_layout.addWidget(self.add_button)
          panel_layout.addStretch()
          self.left_panel.setLayout(panel_layout)
  ```

> **הערה:** ווידג'ט ממוקם **או** עם `setGeometry` **או** עם פריסה, לא בשתי הדרכים. אם ווידג'ט נמצא בפריסה, הפריסה קובעת את המיקום והגודל שלו, ו-`setGeometry` מתעלמים ממנו.

## בקצרה

| אני רוצה... | להשתמש ב- |
|---|---|
| חלון עם סרגל תפריטים | לרשת מ-`QMainWindow` במקום מ-`QWidget` |
| למקם את הווידג'טים שלי מתחת לסרגל התפריטים | `self.central = QWidget()`, `self.setCentralWidget(self.central)`, ו-`self.central` בתור ההורה |
| להוסיף תפריט | `file_menu = self.menuBar().addMenu("File")` |
| להוסיף פריט לתפריט | `QAction("Text", self)`, לחבר את `triggered`, ואז `file_menu.addAction(...)` |
| קו בין פריטים | `file_menu.addSeparator()` |
| קיצור מקלדת | `action.setShortcut("Ctrl+Q")` |
| תת-תפריט | `sub_menu = file_menu.addMenu("Text")` |
| פריט פועל/כבוי | `action.setCheckable(True)`, לחבר את `toggled` |
| חלקים שהמשתמש יכול לשנות את גודלם | `QSplitter(Qt.Horizontal)` או `QSplitter(Qt.Vertical)`, ואז `addWidget` |
| מפצל שממלא את החלון | `self.setCentralWidget(self.splitter)` |
| גדלים התחלתיים של החלקים | `splitter.setSizes([150, 350])` |
| חלקים שלא יכולים להיעלם | `splitter.setChildrenCollapsible(False)` |
| כמה ווידג'טים בחלק אחד | לשים אותם בפאנל `QWidget`, ולהוסיף את הפאנל |
| ווידג'טים שמתאימים את עצמם לגודל החלון | פריסה: `addWidget` לפי הסדר, ואז `self.setLayout(layout)` |
| ווידג'טים אחד מתחת לשני | `QVBoxLayout()` |
| ווידג'טים זה לצד זה | `QHBoxLayout()` |
| ווידג'טים בשורות ובעמודות | `QGridLayout()`, `layout.addWidget(w, row, column)` |
| ווידג'ט שתופס כמה תאים | `layout.addWidget(w, row, column, rows, columns)` |
| תוויות ושדות | `QFormLayout()`, `layout.addRow("Name:", w)` |
| לדחוף ווידג'טים לצד אחד | `layout.addStretch()` לפניהם או אחריהם |
| ווידג'ט אחד מקבל יותר מקום | `layout.addWidget(w, 2)` (מקדם מתיחה) |
| פריסה בתוך פריסה | `main_layout.addLayout(inner_layout)` |
| פריסה ב-`QMainWindow` | `self.central.setLayout(layout)` |
