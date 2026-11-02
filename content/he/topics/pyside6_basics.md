# מדריך PySide6 למתחילים

PySide6 היא ספריית ה-Python הרשמית לבניית אפליקציות שולחניות עם ממשק משתמש גרפי (GUI), בעזרת ה-framework של Qt.

## 1. אפליקציה מינימלית

זו התוכנית הבסיסית ביותר שנדרשת כדי ליצור ולהריץ חלון ריק.

```python
from PySide6.QtWidgets import QApplication, QWidget

app = QApplication()
window = QWidget()
window.resize(400, 200)
window.show()
app.exec()
```

* `app` היא האפליקציה עצמה. כל תוכנית PySide6 צריכה בדיוק אחת כזו.
* `window` הוא חלון ריק. `resize(400, 200)` קובע את הרוחב והגובה שלו בפיקסלים.
* `window.show()` גורם לחלון להופיע על המסך.
* `app.exec()` משאיר את התוכנית רצה עד שהמשתמש סוגר את החלון.

**התוצאה:**

![חלון ריק](content/images/pyside_basics_1_minimal.png)

## 2. הגדרת החלון

השתמשו במתודות האלה על אובייקט החלון כדי לשנות את הכותרת והגודל שלו.

* **הגדרת כותרת החלון:**

  ```python
  window.setWindowTitle("Hello World")
  ```

* **הגדרת מיקום וגודל:**
  הפרמטרים הם `(x, y, width, height)`. `x` ו-`y` הם המיקום של החלון על המסך.

  ```python
  window.setGeometry(100, 100, 400, 200)
  ```

**התוצאה:**

![חלון עם הכותרת Hello World](content/images/pyside_basics_2_window.png)

## 3. הוספת רכיבים

**רכיב** (widget) הוא כל אלמנט שרואים בתוך חלון: קטע טקסט, כפתור, תיבת טקסט, מחוון (slider) וכן הלאה. כדי לשים רכיב בתוך החלון, מעבירים את `window` בתור **הארגומנט האחרון** כשיוצרים אותו. אחר כך משתמשים ב-`setGeometry(x, y, width, height)` כדי למקם אותו, כאשר `x` ו-`y` נמדדים מ**הפינה השמאלית העליונה של החלון**.

### תווית

תווית (`QLabel`) מציגה טקסט בחלון.

```python
from PySide6.QtWidgets import QLabel

label = QLabel("Hello, PySide6!", window)
label.setGeometry(30, 30, 200, 30)
```

**התוצאה:**

![חלון עם תווית](content/images/pyside_basics_3_label.png)

### כפתור

כפתור (`QPushButton`) הוא משהו שהמשתמש יכול ללחוץ עליו.

```python
from PySide6.QtWidgets import QPushButton

button = QPushButton("Click me", window)
button.setGeometry(30, 80, 120, 40)
```

**התוצאה:**

![חלון עם תווית וכפתור](content/images/pyside_basics_4_button.png)

כרגע, לחיצה על הכפתור לא עושה כלום. בואו נתקן את זה.

## 4. תגובה לאירועים

כשהמשתמש עושה משהו עם רכיב (לוחץ על כפתור, מקליד טקסט, מזיז מחוון), הרכיב שולח **אות** (signal). אפשר **לחבר** (connect) אות לפונקציה משלכם, ו-PySide6 תקרא לפונקציה הזו בכל פעם שהאות נשלח.

כפתור שולח את האות `clicked` כשלוחצים עליו. בואו נגרום לו לשנות את הטקסט של התווית:

```python
def button_clicked():
    label.setText("The button was clicked!")

button.clicked.connect(button_clicked)
```

* `button_clicked` היא פונקציית Python רגילה שמשנה את הטקסט של התווית.
* `button.clicked.connect(button_clicked)` אומר ל-PySide6: "כשלוחצים על `button`, תקראי ל-`button_clicked`".
* שימו לב שאין **סוגריים** אחרי `button_clicked` בתוך `connect(...)`. אתם נותנים ל-PySide6 את הפונקציה כדי שהיא תוכל לקרוא לה מאוחר יותר. אתם **לא** קוראים לה בעצמכם.

**התוצאה אחרי לחיצה על הכפתור:**

![הטקסט של התווית השתנה אחרי הלחיצה על הכפתור](content/images/pyside_basics_5_clicked.png)

### התוכנית המלאה

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QPushButton


def button_clicked():
    label.setText("The button was clicked!")


app = QApplication()
window = QWidget()
window.setWindowTitle("Hello World")
window.setGeometry(100, 100, 400, 200)

label = QLabel("Hello, PySide6!", window)
label.setGeometry(30, 30, 200, 30)

button = QPushButton("Click me", window)
button.setGeometry(30, 80, 120, 40)
button.clicked.connect(button_clicked)

window.show()
app.exec()
```

## 5. שינוי המראה של רכיבים

לכל רכיב יש מתודה `setStyleSheet(...)` שמשנה את המראה שלו: הצבעים, גודל הגופן, המסגרת ועוד. נותנים לה מחרוזת של זוגות `property: value;`, באותו סגנון של CSS בדפי אינטרנט. כל הדוגמאות כאן מתחילות מהחלון של סעיף 3, עם התווית והכפתור.

### צבע וגודל של הטקסט

```python
label.setStyleSheet("color: blue; font-size: 24px;")
```

**התוצאה:**

![הטקסט של התווית גדול וכחול](content/images/pyside_basics_6_style_text.png)

### רקע, מסגרת וריווח

```python
label.setStyleSheet("background-color: yellow; border: 2px solid red; padding: 2px;")
```

* `border: 2px solid red` מצייר קו אדום, ברוחב 2 פיקסלים, מסביב לרכיב.
* `padding: 2px` משאיר קצת רווח בין המסגרת לטקסט.

**התוצאה:**

![לתווית יש רקע צהוב ומסגרת אדומה](content/images/pyside_basics_7_style_label_box.png)

### כפתור צבעוני

```python
button.setStyleSheet("background-color: green; color: white; font-weight: bold; border-radius: 10px;")
```

* `font-weight: bold` הופך את הטקסט למודגש.
* `border-radius: 10px` מעגל את הפינות.

**התוצאה:**

![כפתור ירוק עם טקסט לבן מודגש ופינות מעוגלות](content/images/pyside_basics_8_style_button.png)

### החלון כולו

אפשר לקרוא ל-`setStyleSheet` גם על החלון. העיצוב עובר **לכל הרכיבים שבתוכו**, ולכן כאן גם הכפתור נצבע בכחול.

```python
window.setStyleSheet("background-color: lightblue;")
```

**התוצאה:**

![לכל החלון יש רקע תכלת](content/images/pyside_basics_9_style_window.png)

### שינוי העיצוב כשמשהו קורה

אפשר לקרוא ל-`setStyleSheet` בכל רגע, לא רק כשיוצרים את הרכיב. למשל, בתוך הפונקציה שמגיבה לכפתור:

```python
def button_clicked():
    label.setText("The button was clicked!")
    label.setStyleSheet("color: white; background-color: purple; font-size: 16px;")
```

**התוצאה אחרי לחיצה על הכפתור:**

![אחרי הלחיצה, לתווית יש טקסט לבן על רקע סגול](content/images/pyside_basics_10_style_clicked.png)

### מאפיינים שימושיים

| מאפיין | מה הוא משנה | דוגמה |
| --- | --- | --- |
| `color` | צבע הטקסט | `color: red;` |
| `background-color` | צבע הרקע | `background-color: #3399FF;` |
| `font-size` | גודל הטקסט | `font-size: 20px;` |
| `font-weight` | טקסט מודגש | `font-weight: bold;` |
| `border` | קו מסביב לרכיב | `border: 1px solid black;` |
| `border-radius` | פינות מעוגלות | `border-radius: 8px;` |
| `padding` | רווח בין המסגרת לטקסט | `padding: 5px;` |

* צבעים יכולים להיות שמות (`red`, `lightblue`), קודי hex (`#3399FF`), או `rgb(255, 165, 0)`.
* כל קריאה ל-`setStyleSheet` **מחליפה** את העיצוב הקודם של אותו רכיב. כדי לשמור על צבע וגם להוסיף מסגרת, כתבו את שניהם באותה מחרוזת.
