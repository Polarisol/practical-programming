# פריסות ב-PySide6

עד עכשיו כל ווידג'ט מוקם עם `setGeometry`: מיקום מדויק וגודל מדויק, בפיקסלים. הדף הזה מראה דרך טובה יותר: **פריסות** (layouts). הוא מסביר מה זו פריסה, ואחר כך את משפחת הפריסות השימושית ביותר, **פריסות הקופסה** (box layouts): `QBoxLayout`, `QHBoxLayout` ו-`QVBoxLayout`.

## מה זו פריסה?

### הבעיה עם `setGeometry`

עם `setGeometry` הווידג'טים **אף פעם לא משתנים**. כשהמשתמש מגדיל את החלון, הווידג'טים נשארים קטנים בפינה, ושאר החלון ריק:

![אותו חלון, קטן וגדול. עם setGeometry הווידג'טים שומרים על המקום והגודל שלהם](content/images/pyside_layout_problem.png)

ויש עוד בעיות:

* כשמקטינים את החלון, ווידג'טים נחתכים.
* טקסט ארוך יותר בתווית אולי לא ייכנס בגודל שבחרתם.
* במסך עם גופנים גדולים יותר, ווידג'טים עלולים לעלות אחד על השני.
* כדי להוסיף ווידג'ט אחד באמצע צריך לשנות את המספרים של כל הווידג'טים שמתחתיו.

### הרעיון

**פריסה** היא אובייקט שמסדר את הווידג'טים בשבילכם. במקום להגיד לכל ווידג'ט בדיוק איפה להיות, אומרים לפריסה רק את **הסדר** של הווידג'טים. הפריסה:

* מחשבת בעצמה את המיקום והגודל של כל ווידג'ט,
* מחשבת אותם מחדש בכל פעם שהחלון משנה את גודלו,
* משאירה רווח קטן ושווה בין הווידג'טים ומסביב לשוליים.

פריסה היא **לא** ווידג'ט. לא רואים אותה. היא רק מחליטה איפה הווידג'טים יהיו.

את כל הפריסות מייבאים מ-`PySide6.QtWidgets`.

### השלבים הבסיסיים

שימוש בפריסה כולל 3 שלבים:

1. יוצרים את הווידג'טים **בלי** הורה ו-**בלי** `setGeometry`.
2. יוצרים את הפריסה ומוסיפים אליה את הווידג'טים עם `addWidget`, לפי הסדר.
3. נותנים את הפריסה לחלון עם `self.setLayout(layout)`.

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout


class NameWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("QVBoxLayout")
        self.setGeometry(100, 100, 320, 220)

        self.label = QLabel("Enter your name:")      # 1. no parent, no setGeometry
        self.name_input = QLineEdit()
        self.hello_button = QPushButton("Say Hello")

        layout = QVBoxLayout()                        # 2. create the layout
        layout.addWidget(self.label)                  #    and add the widgets, in order
        layout.addWidget(self.name_input)
        layout.addWidget(self.hello_button)

        self.setLayout(layout)                        # 3. the window uses the layout


if __name__ == "__main__":
    app = QApplication()
    window = NameWindow()
    window.show()
    app.exec()
```

* אין צורך בהורה: `setLayout` הופכת את החלון להורה של כל הווידג'טים שבפריסה.
* הווידג'טים עדיין נשמרים עם `self.`, כי המתודות של המחלקה צריכות אותם. הפריסה עצמה לא נחוצה אחרי `initUI`, אז משתנה רגיל `layout` מספיק.
* מותר להשתמש ב-`self.setGeometry(...)` על **החלון**: זה נותן לחלון מיקום וגודל התחלתיים. הפריסה ממלאת את הגודל שיש לחלון, יהיה אשר יהיה.

> **הערה:** ווידג'ט ממוקם **או** עם `setGeometry` **או** עם פריסה, לא בשתי הדרכים. אם ווידג'ט נמצא בפריסה, הפריסה קובעת את המיקום והגודל שלו, ומתעלמים מה-`setGeometry` של הווידג'ט עצמו.

בתמונות בדף הזה, החלון השמאלי הוא מה שהמשתמש רואה, והחלון הימני מראה את התיבות של הפריסה מצוירות מעליו: קו מקווקו לכל פריסה, ותיבה צבעונית לכל ווידג'ט.

## פריסות קופסה

**פריסת קופסה** שמה את הווידג'טים **בשורה**, אחד אחרי השני. השורה יכולה להיות אנכית (אחד מתחת לשני) או אופקית (זה לצד זה). יש 3 מחלקות:

| מחלקה | מה היא עושה |
|---|---|
| `QVBoxLayout` | שורה אנכית: ווידג'ט אחד **מתחת** לשני |
| `QHBoxLayout` | שורה אופקית: ווידג'טים **זה לצד זה** |
| `QBoxLayout` | הקופסה הכללית. את הכיוון בוחרים בעצמכם |

`QHBoxLayout` ו-`QVBoxLayout` הן פשוט `QBoxLayout` שהכיוון שלה כבר נבחר. ברוב התוכניות תשתמשו רק בשתיים האלה.

### `QVBoxLayout`: אחד מתחת לשני

**V** בשביל **vertical** (אנכי). כל `addWidget` שם את הווידג'ט **מתחת** לקודם. זה החלון של הקוד שלמעלה:

![QVBoxLayout: התווית, שדה הטקסט והכפתור אחד מתחת לשני](content/images/pyside_box_vbox.png)

* כל ווידג'ט מקבל את **כל הרוחב** של החלון.
* הגבהים לא שווים. לשדה טקסט ולכפתור יש גובה קבוע, הם לא גדלים למעלה ולמטה. תווית **יכולה** לגדול, אז היא קיבלה את כל הגובה העודף, והטקסט שלה נמצא באמצע תיבה גדולה וריקה. זה לא נראה טוב, ומתקנים את זה עם **מתיחה** (stretch), שמוסברת בהמשך.

### `QHBoxLayout`: זה לצד זה

**H** בשביל **horizontal** (אופקי). כל `addWidget` שם את הווידג'ט **מימין** לקודם:

```python
    def initUI(self):
        self.setWindowTitle("QHBoxLayout")
        self.setGeometry(100, 100, 400, 60)

        self.label = QLabel("Name:")
        self.name_input = QLineEdit()
        self.ok_button = QPushButton("OK")

        layout = QHBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.name_input)
        layout.addWidget(self.ok_button)

        self.setLayout(layout)
```

![QHBoxLayout: התווית, שדה הטקסט והכפתור זה לצד זה](content/images/pyside_box_hbox.png)

* כל ווידג'ט מקבל את **כל הגובה** של הפריסה.
* הרוחבים לא שווים. התווית והכפתור רחבים בדיוק כמו הטקסט שלהם. שדה הטקסט אוהב לגדול לרוחב, אז הוא קיבל את כל הרוחב העודף. זה בדיוק מה שרוצים בשורה כזאת.

### מי מקבל את המקום העודף?

כל ווידג'ט יודע איך הוא אוהב לגדול. לא צריך להגדיר את זה, אבל זה מסביר את מה שרואים:

| ווידג'ט | גדל לרוחב? | גדל למעלה ולמטה? |
|---|---|---|
| `QLabel` | יכול | יכול |
| `QPushButton`, `QSpinBox`, `QComboBox` | יכול | לא |
| `QLineEdit` | **אוהב** | לא |
| `QTextEdit`, `QTableWidget` | **אוהב** | **אוהב** |

יש ווידג'טים שרק **יכולים** לגדול, ויש כאלה ש**אוהבים** לגדול. כשיש מקום עודף, הווידג'טים שאוהבים לגדול מקבלים אותו קודם. בגלל זה, בדוגמה של `QHBoxLayout`, שדה הטקסט קיבל את כל הרוחב העודף והכפתור לא. כשווידג'טים מאותו סוג נמצאים זה לצד זה, הם מתחלקים במקום העודף שווה בשווה. בהמשך הדף תראו איך משנים את זה עם **מתיחה** ועם **מקדם מתיחה**.

### `QBoxLayout`: הקופסה הכללית

`QBoxLayout` מקבלת את **הכיוון** כשיוצרים אותה. יש 4 כיוונים:

```python
from PySide6.QtWidgets import QBoxLayout

layout = QBoxLayout(QBoxLayout.LeftToRight)     # the same as QHBoxLayout()
layout = QBoxLayout(QBoxLayout.RightToLeft)     # side by side, the first widget on the right
layout = QBoxLayout(QBoxLayout.TopToBottom)     # the same as QVBoxLayout()
layout = QBoxLayout(QBoxLayout.BottomToTop)     # one under the other, the first widget at the bottom
```

הנה 4 חלונות. בכל אחד מהם הכפתורים `1`, `2` ו-`3` נוספו בסדר הזה, עם אותו קוד. רק הכיוון שונה:

![QBoxLayout ב-4 הכיוונים שלה: LeftToRight, RightToLeft, TopToBottom ו-BottomToTop](content/images/pyside_box_directions.png)

הדבר השימושי ב-`QBoxLayout` הוא שאפשר **לשנות את הכיוון בזמן שהתוכנית רצה**, עם `setDirection`. לדוגמה, כפתור שמעביר את הכפתורים בין שורה לעמודה:

```python
    def initUI(self):
        self.setWindowTitle("Switch direction")

        self.one_button = QPushButton("1")
        self.two_button = QPushButton("2")
        self.switch_button = QPushButton("Switch")
        self.switch_button.clicked.connect(self.switch_clicked)

        self.box_layout = QBoxLayout(QBoxLayout.LeftToRight)
        self.box_layout.addWidget(self.one_button)
        self.box_layout.addWidget(self.two_button)
        self.box_layout.addWidget(self.switch_button)

        self.setLayout(self.box_layout)

    def switch_clicked(self):
        if self.box_layout.direction() == QBoxLayout.LeftToRight:
            self.box_layout.setDirection(QBoxLayout.TopToBottom)
        else:
            self.box_layout.setDirection(QBoxLayout.LeftToRight)
```

הפעם הפריסה נשמרת בתור `self.box_layout`, כי המתודה `switch_clicked` צריכה אותה. אל תקראו לה `self.layout`: לכל ווידג'ט כבר יש מתודה בשם `layout()`.

## שליטה במקום

### מתיחה: מקום ריק שדוחף

`addStretch()` מוסיפה לפריסת קופסה **קפיץ בלתי נראה**. הקפיץ לוקח את כל המקום העודף, ודוחף את הווידג'טים הרחק ממנו.

בדוגמה של `QVBoxLayout`, התווית לקחה את הגובה העודף. עם מתיחה בסוף, המתיחה לוקחת אותו במקומה, והווידג'טים נשארים יחד למעלה:

```python
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.name_input)
        layout.addWidget(self.hello_button)
        layout.addStretch()                  # all the extra space goes here, at the bottom
```

![בלי addStretch התווית לוקחת את הגובה העודף. עם addStretch המתיחה לוקחת אותו, והווידג'טים נשארים למעלה](content/images/pyside_box_vstretch.png)

**איפה** ששמים את המתיחה קובע לאן הווידג'טים הולכים. הנה 4 חלונות עם כפתור `OK` וכפתור `Cancel` ב-`QHBoxLayout`:

![שני כפתורים ב-QHBoxLayout: בלי מתיחה, עם מתיחה אחריהם, לפניהם, ומשני הצדדים](content/images/pyside_box_stretch.png)

* **בלי מתיחה**: הכפתורים מתחלקים בכל הרוחב.
* מתיחה **אחרי** הווידג'טים: הווידג'טים נדחפים **להתחלה** (שמאלה, או למעלה).
* מתיחה **לפני** הווידג'טים: הווידג'טים נדחפים **לסוף** (ימינה, או למטה).
* מתיחה **לפני ואחרי**: הווידג'טים **באמצע**.

שימוש נפוץ מאוד הוא השלישי: `OK` ו-`Cancel` בצד ימין של החלון, כמו בהרבה תוכנות:

```python
        layout = QHBoxLayout()
        layout.addStretch()                  # pushes the buttons to the right
        layout.addWidget(self.ok_button)
        layout.addWidget(self.cancel_button)
```

### מקדם מתיחה: מי מקבל יותר מקום

כששני ווידג'טים אוהבים לגדול, כמו שתי תיבות הטקסט כאן, הם מתחלקים במקום העודף שווה בשווה. כדי לתת לאחד מהם יותר, מוסיפים **מקדם מתיחה** (stretch factor) כערך שני ל-`addWidget`. המקום מתחלק לפי היחס בין המספרים:

```python
        layout = QHBoxLayout()
        layout.addWidget(self.left_text, 1)      # gets 1 part
        layout.addWidget(self.right_text, 2)     # gets 2 parts: twice as wide
```

![מקדמי מתיחה 1 ו-2: תיבת הטקסט הימנית רחבה פי שניים מהשמאלית](content/images/pyside_box_stretch_factor.png)

גם `addStretch` יכולה לקבל מקדם. לדוגמה, `addStretch(1)` לפני הווידג'טים ו-`addStretch(3)` אחריהם משאירות חלק אחד של מקום ריק לפני ו-3 חלקים אחרי.

### מקום קבוע

`addSpacing(pixels)` מוסיפה מקום ריק בגודל **מדויק**, שלא גדל. זה שימושי כדי להפריד בין קבוצות של ווידג'טים:

```python
        layout = QVBoxLayout()
        layout.addWidget(self.name_input)
        layout.addWidget(self.age_input)
        layout.addSpacing(20)                    # 20 pixels between the fields and the button
        layout.addWidget(self.save_button)
```

### יישור: ווידג'ט שלא ממלא את המקום שלו

כברירת מחדל, ווידג'ט מקבל את כל הרוחב של `QVBoxLayout` (או את כל הגובה של `QHBoxLayout`). כדי להשאיר ווידג'ט בגודל הטבעי שלו, ולשים אותו בצד אחד או באמצע, נותנים ל-`addWidget` **יישור** (alignment). את `Qt` מייבאים מ-`PySide6.QtCore`:

```python
from PySide6.QtCore import Qt

        layout.addWidget(self.hello_button, alignment=Qt.AlignCenter)   # in the middle, not full width
        layout.addWidget(self.ok_button, alignment=Qt.AlignRight)       # on the right side
```

### רווחים ושוליים

שתי מתודות משנות את המקום הריק שהפריסה משאירה:

```python
        layout.setSpacing(20)                     # 20 pixels between the widgets
        layout.setContentsMargins(5, 5, 5, 5)     # space around the edges: left, top, right, bottom
```

## פריסות בתוך פריסות

חלונות אמיתיים הם לא רק שורה אחת או עמודה אחת. הפתרון הוא לשים פריסות קופסה **בתוך** פריסות קופסה. `addLayout` מוסיפה פריסה שלמה לפריסה אחרת, כאילו הייתה ווידג'ט אחד.

דוגמה: חלון **צ'אט**. יש בו 3 חלקים, אחד מתחת לשני, אז הפריסה הראשית היא `QVBoxLayout`:

1. למעלה, שורה עם השם של החבר: `QHBoxLayout`.
2. באמצע, תיבת טקסט עם ההודעות.
3. למטה, שורה עם שדה טקסט להודעה חדשה וכפתור **Send**: עוד `QHBoxLayout`.

![פריסות בתוך פריסות: שתי שורות QHBoxLayout בתוך QVBoxLayout](content/images/pyside_box_nested.png)

הטריק הוא **לתכנן קודם**: מסתכלים על החלון שרוצים, ומציירים תיבות מסביב לקבוצות של ווידג'טים, כמו בחלון הימני. כל שורה של ווידג'טים היא `QHBoxLayout`, וכל עמודה היא `QVBoxLayout`. אחר כך כותבים את הקוד מבפנים החוצה: קודם הפריסות הקטנות, ואז הפריסה הראשית שמחזיקה אותן.

```python
from PySide6.QtWidgets import (QApplication, QWidget, QLabel, QLineEdit, QPushButton,
                               QTextEdit, QVBoxLayout, QHBoxLayout)


class ChatWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("Chat")
        self.setGeometry(100, 100, 380, 280)

        # ----- 1. the top row -----
        self.to_label = QLabel("To:")
        self.to_input = QLineEdit()

        top_layout = QHBoxLayout()
        top_layout.addWidget(self.to_label)
        top_layout.addWidget(self.to_input)

        # ----- 2. the messages -----
        self.messages_box = QTextEdit()
        self.messages_box.setReadOnly(True)

        # ----- 3. the bottom row -----
        self.message_input = QLineEdit()
        self.message_input.returnPressed.connect(self.send_clicked)
        self.send_button = QPushButton("Send")
        self.send_button.clicked.connect(self.send_clicked)

        bottom_layout = QHBoxLayout()
        bottom_layout.addWidget(self.message_input)
        bottom_layout.addWidget(self.send_button)

        # ----- the main layout holds everything -----
        main_layout = QVBoxLayout()
        main_layout.addLayout(top_layout)           # a layout inside a layout
        main_layout.addWidget(self.messages_box)
        main_layout.addLayout(bottom_layout)        # a layout inside a layout

        self.setLayout(main_layout)

    def send_clicked(self):
        text = self.message_input.text()
        if text != "":
            self.messages_box.append("Me: " + text)
            self.message_input.clear()


if __name__ == "__main__":
    app = QApplication()
    window = ChatWindow()
    window.show()
    app.exec()
```

שימו לב:

* רק הפריסה הראשית ניתנת לחלון עם `self.setLayout`. הפריסות האחרות נמצאות בתוכה.
* `addLayout` משמשת לפריסה, ו-`addWidget` לווידג'ט. אפשר להשתמש בשתיהן באותה פריסה.
* תיבת הטקסט היא הווידג'ט היחיד ש**אוהב** לגדול לגובה, אז היא מקבלת את כל הגובה העודף. שתי השורות שומרות על הגובה שלהן. אין צורך במתיחה.
* בכל שורה, שדה הטקסט מקבל את הרוחב העודף, והתווית והכפתור נשארים רחבים כמו הטקסט שלהם.

עכשיו הגדילו את החלון. הכול מתאים את עצמו לבד:

![חלון הצ'אט בשני גדלים. תיבת הטקסט ושדות הטקסט גדלים עם החלון](content/images/pyside_box_resize.png)

גם פריסה בתוך פריסה בתוך פריסה עובדת, לכל עומק שצריך. לדוגמה, `QHBoxLayout` עם שתי עמודות `QVBoxLayout`, שבכל אחת מהן יש ווידג'טים משלה.

## בקצרה

| אני רוצה... | להשתמש ב- |
|---|---|
| ווידג'טים שמתאימים את עצמם לגודל החלון | פריסה: `addWidget` לפי הסדר, ואז `self.setLayout(layout)` |
| ווידג'טים אחד מתחת לשני | `QVBoxLayout()` |
| ווידג'טים זה לצד זה | `QHBoxLayout()` |
| לבחור את הכיוון בעצמי | `QBoxLayout(QBoxLayout.RightToLeft)` (או `LeftToRight`, `TopToBottom`, `BottomToTop`) |
| לשנות את הכיוון בזמן שהתוכנית רצה | `layout.setDirection(QBoxLayout.TopToBottom)` |
| לדחוף ווידג'טים לצד אחד | `layout.addStretch()` לפניהם או אחריהם |
| ווידג'טים באמצע | `addStretch()` לפניהם **וגם** אחריהם |
| ווידג'ט אחד מקבל יותר מקום | `layout.addWidget(w, 2)` (מקדם מתיחה) |
| מקום ריק בגודל מדויק | `layout.addSpacing(20)` |
| ווידג'ט בגודל הטבעי שלו, בצד אחד | `layout.addWidget(w, alignment=Qt.AlignRight)` |
| רווח בין הווידג'טים | `layout.setSpacing(20)` |
| רווח מסביב לשוליים | `layout.setContentsMargins(left, top, right, bottom)` |
| פריסה בתוך פריסה | `main_layout.addLayout(inner_layout)` |
