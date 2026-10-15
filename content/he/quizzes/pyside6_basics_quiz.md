# בוחן יסודות PySide6

בדקו את ההבנה שלכם ביסודות של PySide6: לולאת האירועים (event loop), ווידג'טים, `setGeometry` וסיגנלים. ענו על כל השאלות, ואז לחצו על **הגשת התשובות**.

## מה זה PySide6?
- [ ] ספריית Python לציור תרשימים וגרפים
  > זה מתאר ספריות כמו Matplotlib. PySide6 נועדה לבניית אפליקציות שלמות עם חלונות, כפתורים ותיבות טקסט.
- [x] פריימוורק (framework) של Python לבניית אפליקציות שולחן עבודה עם ממשק משתמש גרפי (GUI), המבוסס על ספריית Qt
  > נכון! PySide6 היא ספריית ה-Python הרשמית של Qt, פריימוורק אמין שמשמש מוצרים רבים בעולם האמיתי.
- [ ] פריימוורק לבניית אתרי אינטרנט ב-Python
  > פריימוורקים לאתרים כמו Flask או Django רצים בדפדפן. PySide6 בונה אפליקציות שולחן עבודה שרצות בחלונות משלהן.
- [ ] עורך קוד לכתיבה והרצה של תוכניות Python
  > עורך קוד (כמו VS Code או PyCharm) הוא המקום שבו כותבים קוד. PySide6 היא ספרייה שמייבאים בקוד.
> PySide6 מאפשרת לבנות אפליקציות GUI ב-Python. מתחת לפני השטח היא משתמשת בספריית **Qt**, כך שהתוכניות שלכם מקבלות חלונות ווידג'טים יציבים ובעלי מראה מקצועי.

## מה התפקיד של `app.exec()` בסוף תוכנית PySide6?
```python
app = QApplication()
window = QWidget()
window.show()
app.exec()
```
- [ ] היא יוצרת את החלון ומציירת אותו על המסך
  > החלון נוצר על ידי `QWidget()` ונעשה גלוי על ידי `window.show()`. `app.exec()` מגיעה אחרי שניהם.
- [ ] היא מריצה את התוכנית פעם אחת מלמעלה למטה ואז יוצאת
  > בלי `app.exec()` זה בדיוק מה שהיה קורה: הסקריפט היה מסתיים והחלון היה נסגר מיד.
- [x] היא מפעילה את לולאת האירועים, שמשאירה את התוכנית רצה ומגיבה למשתמש עד שהחלון נסגר
  > נכון! לולאת האירועים מחכה ללחיצות, הקלדות ואירועים אחרים, וקוראת לפונקציות שחיברתם כשהם קורים.
- [ ] היא בודקת את הקוד לשגיאות לפני שהחלון נפתח
  > PySide6 לא בודקת את הקוד שלכם. שגיאות Python עדיין מופיעות רק כשהשורה הבעייתית באמת רצה.
> כל תוכנית PySide6 יוצרת `QApplication` אחד, מגדירה את החלונות והווידג'טים שלה, ואז קוראת ל-`app.exec()` כדי להפעיל את **לולאת האירועים**, שרצה עד שהמשתמש סוגר את החלון.

## איזו שורה גורמת ל-`button` להריץ את הפונקציה `button_method` בכל פעם שלוחצים עליו?
- [ ] `button.clicked.connect(button_method())`
  > הסוגריים קוראים ל-`button_method` פעם אחת, מיד, בזמן החיבור. `connect` מקבלת אז את הערך שהפונקציה מחזירה במקום את הפונקציה עצמה.
- [ ] `button.clicked.function(button_method)`
  > `clicked` הוא סיגנל. לא קוראים לו; משתמשים במתודה `connect` שלו כדי לחבר אותו לפונקציה. `function` היא לא מתודה אמיתית של הסיגנל.
- [ ] `button.connect(button_method)`
  > `connect` שייכת לסיגנל, לא לכפתור. PySide6 צריכה לדעת *איזה* סיגנל (`clicked`, `pressed`, ...) צריך לקרוא לפונקציה.
- [x] `button.clicked.connect(button_method)`
  > נכון! הסיגנל `clicked` מחובר לפונקציה, שנכתבת בלי סוגריים, כך ש-PySide6 יכולה לקרוא לה בכל לחיצה.
> כדי להגיב לאירוע, מחברים את ה**סיגנל** של הווידג'ט לפונקציה שלכם: `widget.signal.connect(function)`. כותבים את שם הפונקציה **בלי סוגריים**: אתם נותנים ל-PySide6 את הפונקציה, ו-PySide6 קוראת לה מאוחר יותר.

## הכפתור בחלון הזה מוקם בשורת קוד אחת. איזו שורה?
![חלון](content/images/geometry_question.webp)
- [x] `button.setGeometry(50, 60, 150, 40)`
  > נכון! הסדר הוא `(x, y, width, height)`, ו-`x` ו-`y` נמדדים מהפינה השמאלית העליונה של החלון.
- [ ] `button.setGeometry(150, 40, 50, 60)`
  > כאן הגודל מופיע ראשון. ב-`setGeometry`, המיקום בא קודם והגודל אחריו.
- [ ] `button.setPosition(50, 60, 150, 40)`
  > המספרים נכונים, אבל אין מתודה `setPosition` ב-PySide6. מיקום וגודל ביחד נקבעים עם `setGeometry`.
- [ ] `button.setPosition(150, 40, 50, 60)`
  > אין מתודה `setPosition` ב-PySide6, והמספרים גם בסדר הלא נכון עבור `setGeometry`.
> `setGeometry(x, y, width, height)` קובעת את המיקום והגודל של ווידג'ט בקריאה אחת. `x` גדול יותר מזיז את הווידג'ט ימינה, ו-`y` גדול יותר מזיז אותו **למטה**.

## איזה קוד מוסיף נכון תווית שמציגה "Hello"?

- [ ] `label = QLabel("Hello")`
  > חסר `window` ביצירת התווית, ולכן התווית לא שייכת לחלון ולא תופיע בו.
- [ ] `label = New.QLabel("Hello", window)`
  > `New` זה לא משהו שאנחנו משתמשים בו
- [ ] `label = QLabel.new("Hello")`
  > `new` זה לא משהו שאנחנו משתמשים בו
- [x] `label = QLabel("Hello", window)`
  > נכון! התווית נוצרת עם `window` בתור הארגומנט האחרון, ו-`setGeometry` מקבלת את כל ארבעת המספרים.
> כדי לשים ווידג'ט בתוך חלון, מעבירים את `window` בתור **הארגומנט האחרון** כשיוצרים אותו.

## מה הקוד הזה מדפיס?
```python
dspin = QDoubleSpinBox(window)
dspin.setValue(150.555)
print(dspin.value())
```
- [ ] 150.555
  > יש כאן שתי מגבלות: הטווח ברירת המחדל ומספר ספרות אחרי הנקודה ברירת המחדל.
- [ ] 150.56
  > העיגול ל-2 ספרות אחרי הנקודה אמיתי, אבל הערך גם נמצא מחוץ לטווח ברירת המחדל.
- [x] 99.99
  > נכון! המקסימום ברירת המחדל של `QDoubleSpinBox` הוא 99.99, אז ערך גדול יותר משתנה בשקט למקסימום.
- [ ] 99.0
  > הערך אכן מוגבל על ידי המקסימום, אבל המקסימום של `QDoubleSpinBox` הוא 99.99, המספר הגדול ביותר עם 2 ספרות אחרי הנקודה שקטן מ-100.
- [ ] כלום, התוכנית זורקת שגיאה כי הערך מחוץ לטווח
  > לא נזרקת שגיאה. זה בדיוק מה שהופך את המגבלה הזו לקלה לפספוס.
> לתיבות מספרים יש טווח ברירת מחדל קטן: 0 עד 99 עבור `QSpinBox` ו-0 עד 99.99 עבור `QDoubleSpinBox`, ששומרת גם רק **2 ספרות אחרי הנקודה**. ערך מחוץ לטווח משתנה בשקט, אז קראו ל-`setRange()` (ול-`setDecimals()` אם צריך) לפני שאתם קובעים ערך.

## מה התוכנית הזו עושה?
```python
from PySide6.QtWidgets import QApplication, QWidget, QLineEdit, QLabel


def my_method():
    text = name_input.text()
    count_label.setText(f"Letters: {len(text)}")


app = QApplication()
window = QWidget()
window.setGeometry(100, 100, 300, 120)

name_input = QLineEdit(window)
name_input.setGeometry(20, 20, 200, 30)

count_label = QLabel("Letters: 0", window)
count_label.setGeometry(20, 70, 200, 30)

name_input.editingFinished.connect(my_method)

window.show()
app.exec()
```
- [ ] כשהמשתמש לוחץ על הכפתור, התווית מציגה כמה תווים הוקלדו
  > בתוכנית אין כפתור; היא מגיבה לסיום העריכה של תיבת הטקסט.
- [x] כשהמשתמש מסיים להקליד בתיבה (לוחץ Enter או יוצא מהתיבה), התווית מציגה כמה תווים הוקלדו
  > נכון! `editingFinished` קורא ל-`my_method`, שקוראת את הטקסט ומציגה את האורך שלו עם `len()`.
- [ ] בכל פעם שהמשתמש מקליד אות, התווית מעדכנת מיד את הספירה
  > עדכון בכל הקשה היה דורש את הסיגנל `textChanged`. `editingFinished` מחכה עד שהמשתמש מסיים.
- [ ] כשהמשתמש מסיים להקליד, התווית מציגה את הטקסט שהוקלד
  > התווית מציגה את `len(text)`, כלומר את **מספר** התווים, לא את הטקסט עצמו.
> תוכנית קטנה קוראים בשני חלקים: ההגדרה (יצירת ווידג'טים עם `setGeometry`) והחיבורים. כאן, הסיגנל `editingFinished` של ה-`QLineEdit` מחובר ל-`my_method`, שמעדכנת את התווית.

## המשתמש הקליד "Tal" בשדה QLineEdit בשם `name_input` ובחר 3 בשדה QSpinBox בשם `spin`. איזה קוד מציג "Tal selected 3" ב-`result_label`?
**A**
```python
name = name_input.text()
number = spin.text()
result_label.setText(f"{name} selected {number}")
```
**B**
```python
name = name_input.text()
number = spin.value()
result_label.setText(f"{name} selected {number}")
```
**C**
```python
name = name_input.value()
number = spin.value()
result_label.setValue(name + " selected " + number)
```
**D**
```python
name = name_input.getText()
number = spin.getValue()
result_label.setText(f"{name} selected {number}")
```
- [ ] A
  > ווידג'טים מספריים כמו `QSpinBox` משתמשים ב-`value()` כדי לקבל את המספר הנוכחי, לא ב-`text()`.
- [x] B
  > נכון! `text()` מחזירה את המחרוזת "Tal", `value()` מחזירה את המספר השלם 3, וה-f-string מחברת ביניהם.
- [ ] C
  > ווידג'טים מבוססי טקסט כמו `QLineEdit` משתמשים ב-`text()` כדי לקבל את המחרוזת הנוכחית, לא ב-`value()`.
- [ ] D
  > אין מתודות `getText()` או `getValue()`. ב-PySide6, מתודות ה"קבלה" נקראות על שם התכונה: `text()` ו-`value()`.
> כדי לקרוא ערך מווידג'ט, קוראים למתודת הקבלה שלו עם סוגריים: `QLineEdit.text()` מחזירה **מחרוזת** ו-`QSpinBox.value()` מחזירה **מספר שלם**. f-string היא הדרך הקלה ביותר לשלב אותם לטקסט אחד עבור `setText()`.
