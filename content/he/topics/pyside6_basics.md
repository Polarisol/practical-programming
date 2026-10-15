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
