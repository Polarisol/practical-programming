# תגובה לסיגנלים

ב-PySide6, רכיבים (widgets) שולחים **סיגנלים** (signals) כשמשתמש מבצע איתם פעולה (למשל, לוחץ על כפתור, מקליד טקסט או משנה מספר). מחברים את הסיגנלים האלה לפונקציות Python שנקראות **סלוטים** (slots) כדי להפעיל פעולות.

## תוכנית דוגמה מלאה

התוכנית שלמטה מדגימה איך להגיב לשלושה אירועים נפוצים של רכיבים בחלון אחד:

1. לחיצה על כפתור (`clicked`)

2. הקלדה בשדה טקסט (`textChanged`)

3. שינוי ערך בתיבת מספר (`valueChanged`)

```
from PySide6.QtWidgets import QApplication, QWidget, QPushButton, QLineEdit, QSpinBox, QLabel

def on_button_clicked():
    name = name_input.text()
    message_label.setText(f"Welcome, {name or 'Guest'}!")

def on_text_changed(text):
    preview_label.setText(f"Typing: {text}")

def on_number_changed(val):
    square_label.setText(f"Square: {val * val}")

app = QApplication()
window = QWidget()
window.setWindowTitle("Reacting to Signals Demo")
window.setGeometry(100, 100, 360, 260)

# 1. Text input and its live preview label
name_input = QLineEdit(window)
name_input.setGeometry(20, 20, 180, 30)
name_input.setPlaceholderText("Enter your name")

preview_label = QLabel("Typing: ", window)
preview_label.setGeometry(20, 60, 320, 25)

# 2. Button and its action output label
action_button = QPushButton("Greet Me", window)
action_button.setGeometry(20, 100, 120, 30)

message_label = QLabel("Welcome!", window)
message_label.setGeometry(150, 105, 190, 25)

# 3. SpinBox and its calculated square output
number_box = QSpinBox(window)
number_box.setGeometry(20, 150, 80, 30)
number_box.setRange(-10, 10)
number_box.setValue(2)

square_label = QLabel("Square: 4", window)
square_label.setGeometry(120, 155, 180, 25)

# Connecting signals to functions
name_input.textChanged.connect(on_text_changed)
action_button.clicked.connect(on_button_clicked)
number_box.valueChanged.connect(on_number_changed)

window.show()
app.exec()
```

## איך זה עובד

### 1. לחיצה על כפתור (`action_button.clicked`)

* **סיגנל:** `clicked`

* **מתי נשלח:** כשהמשתמש משחרר את לחיצת העכבר על הכפתור.

* **המנגנון:**

  ```
  action_button.clicked.connect(on_button_clicked)
  ```

  `on_button_clicked` לוקחת את הטקסט הנוכחי מ-`name_input` בעזרת `.text()` וקובעת את ההודעה בעזרת `.setText()`.

### 2. עדכון טקסט בזמן אמת (`name_input.textChanged`)

* **סיגנל:** `textChanged`

* **מתי נשלח:** בכל הקשה על מקש (הוספה או מחיקה).

* **ארגומנט אוטומטי:** שולח את מחרוזת הטקסט המעודכנת ישירות לפונקציה המחוברת:

  ```
  def on_text_changed(text):
      preview_label.setText(f"Typing: {text}")
  ```

* **חלופה:** אם רוצים לעדכן רק כשהמשתמש לוחץ **Enter** או עובר משדה הקלט, השתמשו במקום זה ב-`name_input.editingFinished`.

### 3. שינויים בתיבת המספר (`number_box.valueChanged`)

* **סיגנל:** `valueChanged`

* **מתי נשלח:** בכל פעם שהמספר משתנה, דרך החיצים למעלה/למטה או בהקלדה ידנית.

* **ארגומנט אוטומטי:** שולח את הערך השלם החדש ישירות לפונקציית הסלוט:

  ```
  def on_number_changed(val):
      square_label.setText(f"Square: {val * val}")
  ```

  זה מחשב מחדש ומציג מיד את הריבוע של המספר, בלי צורך ללחוץ על כפתור.