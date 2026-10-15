# טיימרים ב-PySide6 (דוגמאות OOP)

לפעמים תוכנית צריכה לעשות משהו **בעצמה**, שוב ושוב, בלי שהמשתמש ילחץ על שום דבר. למשל: שעון שמתעדכן כל שנייה, ספירה לאחור, או גרף שקורא מדידה חדשה כל 100 מילישניות.

ב-PySide6 עושים את זה עם **טיימר** (timer): אובייקט ששולח סיגנל (signal) בכל פרק זמן קבוע.

## למה לא להשתמש בלולאה וב-`sleep`?

הרעיון הראשון הוא בדרך כלל לולאה עם `time.sleep`:

```python
    def start_clicked(self):
        for i in range(10):
            self.label.setText(str(i))
            time.sleep(1)       # do NOT do this in a GUI program
```

זה **לא** עובד. כל עוד המתודה רצה, PySide6 תקועה ומחכה שהיא תסתיים, ולכן במשך 10 שניות:

* החלון **קפוא**: הכפתורים לא מגיבים ואי אפשר להזיז את החלון כמו שצריך.
* התווית אפילו לא מתעדכנת. רק המספר האחרון מופיע, בסוף.

תוכנית GUI חייבת לשמור על המתודות שלה **קצרות**. טיימר פותר את זה: במקום מתודה ארוכה אחת שמחכה, PySide6 קוראת למתודה קצרה בכל פעם שהטיימר "מתקתק". בין תקתוק לתקתוק החלון פנוי להגיב למשתמש.

## השלבים הבסיסיים

את `QTimer` מייבאים מ-`PySide6.QtCore` (לא מ-`QtWidgets`, כי הוא לא ווידג'ט):

```python
from PySide6.QtCore import QTimer
```

שימוש בטיימר כולל 3 שלבים:

1. יוצרים את הטיימר ושומרים אותו עם `self.`.
2. מחברים את הסיגנל **`timeout`** שלו למתודה.
3. מפעילים אותו, עם הזמן בין תקתוקים ב**מילישניות**.

```python
    def initUI(self):
        # ... widgets ...
        self.timer = QTimer(self)                    # 1. create
        self.timer.timeout.connect(self.timer_tick)  # 2. connect
        self.timer.start(1000)                       # 3. start: tick every 1000 ms

    def timer_tick(self):
        print("One second passed")
```

* `QTimer(self)` - החלון הוא ההורה של הטיימר, ולכן הטיימר נמחק יחד עם החלון.
* `timeout` - הסיגנל של הטיימר. הוא עובד בדיוק כמו `clicked` של כפתור, רק שהטיימר "לוחץ" בעצמו.
* `start(1000)` - 1000 מילישניות = שנייה אחת. לחצי שנייה השתמשו ב-`start(500)`.

> **חשוב:** שמרו את הטיימר בתור `self.timer`. תצטרכו אותו אחר כך כדי לעצור אותו, ומשתנה רגיל `timer` ייעלם כש-`initUI` מסתיימת.

### הפעלת הטיימר מאוחר יותר

**לא** חייבים לקרוא ל-`start` מיד אחרי שהטיימר נוצר. שלבים 1 ו-2 רק **מכינים** את הטיימר. הוא לא עושה כלום עד שקוראים ל-`start`, וזה יכול לקרות בכל מקום במחלקה, בכל זמן.

מקרה נפוץ הוא ליצור ולחבר את הטיימר ב-`initUI`, ולהפעיל ולעצור אותו כשהמשתמש לוחץ על כפתור:

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

אפשר להפעיל ולעצור את אותו טיימר כמה פעמים שרוצים.

## מתודות שימושיות של טיימר

| מתודה | מה היא עושה |
|---|---|
| `start(ms)` | מפעילה את הטיימר, עם תקתוק כל `ms` מילישניות |
| `stop()` | עוצרת את הטיימר. אפשר להפעיל אותו שוב אחר כך |
| `isActive()` | מחזירה `True` אם הטיימר רץ כרגע |
| `setInterval(ms)` | משנה את הזמן בין תקתוקים |

## דוגמה: סטופר

בחלון יש תווית שמראה את השניות, ושלושה כפתורים: **Start**, **Stop** ו-**Reset**.

הרעיון:

* מספר השניות נשמר ב-`self.seconds`.
* הטיימר מתקתק כל שנייה. בכל תקתוק מוסיפים 1 ל-`self.seconds` ומעדכנים את התווית.
* הכפתורים רק מפעילים ועוצרים את הטיימר. הטיימר הוא זה שסופר.

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

שימו לב:

* הטיימר נוצר ב-`initUI`, אבל הוא **לא מופעל** שם. הוא מתחיל לפעול רק כשהמשתמש לוחץ על **Start**.
* `timer_tick` קצרה: היא משנה מספר אחד ותווית אחת, ומסתיימת. החלון נשאר מגיב, ולכן **Stop** עובד בכל רגע.
* **Reset** לא נוגע בטיימר. אם הסטופר רץ, הוא ממשיך לספור מ-0.

## עצירת הטיימר מתוך עצמו

מתודת התקתוק יכולה לעצור את הטיימר של עצמה. ככה עובדת **ספירה לאחור**: סופרים למטה, ועוצרים ב-0.

```python
    def timer_tick(self):
        self.seconds = self.seconds - 1
        self.time_label.setText(str(self.seconds))
        if self.seconds == 0:
            self.timer.stop()
            self.time_label.setText("Time is up!")
```

## לעשות משהו פעם אחת, אחרי השהיה

לפעמים לא צריך תקתוקים חוזרים, אלא רק פעולה **אחת** קצת מאוחר יותר. למשל, להציג "Saved!" ולנקות את ההודעה אחרי 2 שניות.

לזה משתמשים ב-`QTimer.singleShot`. אין צורך ליצור אובייקט טיימר:

```python
    def save_clicked(self):
        self.status_label.setText("Saved!")
        QTimer.singleShot(2000, self.clear_status)    # call clear_status once, in 2000 ms

    def clear_status(self):
        self.status_label.setText("")
```

`save_clicked` מסתיימת מיד, ולכן החלון לא קפוא במשך 2 השניות.

## בקצרה

| אני רוצה... | משתמשים ב- |
|---|---|
| לעשות משהו שוב ושוב | `self.timer = QTimer(self)`, לחבר את `timeout`, ואז `self.timer.start(ms)` |
| להפסיק לחזור | `self.timer.stop()` |
| לעשות משהו פעם אחת, מאוחר יותר | `QTimer.singleShot(ms, self.some_method)` |

> **הערה:** טיימר לא מדויק לגמרי. תקתוק יכול להגיע באיחור של כמה מילישניות, במיוחד אם התוכנית עסוקה. זה בסדר לשעון על המסך או לאנימציה, אבל למדידת זמן מדויקת, קראו את הזמן האמיתי (למשל עם `time.time()`) בתוך מתודת התקתוק, במקום לספור תקתוקים.
