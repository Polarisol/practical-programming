# קובצי עיצוב QSS

כשקוראים ל-`setStyleSheet("...")` על כל ווידג'ט, אותן מחרוזות עיצוב חוזרות בכל הקוד. **קובץ QSS** (Qt Style Sheet) שומר את כל העיצוב ב**קובץ אחד**, ושורת קוד אחת מחילה אותו על כל האפליקציה.

![אותו חלון בלי QSS ועם style.qss, ואיזה כלל עיצב כל חלק](content/images/pyside_qss_before_after.png)

## 1. כותבים את הקובץ

יוצרים קובץ `style.qss` ליד קובץ ה-`.py`. כל **כלל** הוא בורר (selector, אילו ווידג'טים) ובלוק של זוגות `property: value;` (אותן תכונות כמו ב-`setStyleSheet`):

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

## 2. טוענים אותו פעם אחת

קוראים את הקובץ ונותנים את הטקסט שלו ל**אפליקציה**, לפני `app.exec()`:

```python
app = QApplication()

with open("style.qss") as f:
    app.setStyleSheet(f.read())

window = LoginWindow()
window.show()
app.exec()
```

כדי לעצב ווידג'ט אחד מסוים, נותנים לו שם בקוד, ומשתמשים ב-`#name` בקובץ:

```python
self.title = QLabel("Welcome!")
self.title.setObjectName("title")     # matches QLabel#title
```

## 3. מצבים

מוסיפים `:state` לבורר כדי לשנות את המראה כשמשהו קורה. בלי שום קוד:

```css
QPushButton:hover    { background-color: #3b82f6; }   /* mouse over it */
QPushButton:pressed  { background-color: #1e3a8a; }   /* being clicked */
QPushButton:disabled { background-color: #cbd5e1; color: #64748b; }
```

![כפתור QPushButton במצב רגיל, כשהעכבר מעליו, בלחיצה וכשהוא מושבת](content/images/pyside_qss_states.png)

## בקצרה

| אני רוצה לעצב... | בורר |
|---|---|
| כל ווידג'ט | `QWidget { ... }` |
| כל הווידג'טים מסוג אחד | `QPushButton { ... }` |
| כמה סוגים יחד | `QLineEdit, QSpinBox { ... }` |
| ווידג'ט אחד (עם `setObjectName("title")`) | `#title { ... }` או `QLabel#title { ... }` |
| ווידג'ט כשהעכבר מעליו | `QPushButton:hover { ... }` |
| ווידג'ט בזמן לחיצה | `QPushButton:pressed { ... }` |
| ווידג'ט מושבת | `QPushButton:disabled { ... }` |

* `/* ... */` היא הערה בקובץ QSS.
* קיבלתם `FileNotFoundError`? הריצו את התוכנית מהתיקייה שבה נמצא `style.qss`.
* ערכת נושא כהה היא פשוט קובץ נוסף: קוראים שוב ל-`app.setStyleSheet(...)` עם `dark.qss`.
