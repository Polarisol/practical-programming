# מדריך עיון לרכיבים (Widgets Reference)

הדף הזה הוא מדריך עיון לרכיבים (widgets) הנפוצים ביותר של PySide6. לכל רכיב תמצאו:

* **מה הוא** ומתי משתמשים בו
* **איך הוא נראה**
* **מה צריך לייבא**
* **איך יוצרים אותו**
* **מתודות לקביעה ולקריאה (set ו-get)**
* **מתודות חשובות נוספות**
* **אותות (signals) שימושיים** ומה הם אומרים

כל הדוגמאות מניחות שכבר יש לכם `window` (ראו את דף היסודות של PySide6):

```python
from PySide6.QtWidgets import QApplication, QWidget

app = QApplication()
window = QWidget()
window.setGeometry(100, 100, 600, 400)

# ... create your widgets here, with window as their parent ...

window.show()
app.exec()
```

## מתודות שיש לכל רכיב

כל הרכיבים שבהמשך תומכים במתודות האלה, ולכן הן לא חוזרות אצל כל רכיב בנפרד:

```python
widget.setGeometry(x, y, width, height)  # position and size together
widget.move(x, y)                        # position only
widget.resize(width, height)             # size only
widget.setFixedSize(width, height)       # size that cannot change

widget.setEnabled(False)                 # grayed out, user cannot interact
widget.isEnabled()                       # True / False

widget.hide()                            # make invisible
widget.show()                            # make visible again
widget.setVisible(True)                  # same as show() / hide()

widget.setToolTip("Help text")           # text shown when the mouse hovers over it
widget.setStyleSheet("color: blue; font-size: 16px;")  # CSS styling
```

### תזכורת לגבי אותות

רכיב שולח **אות** (signal) כשמשהו קורה לו (לחיצה, ערך חדש וכו'). אתם מחברים את האות לפונקציה משלכם:

```python
widget.someSignal.connect(my_function)
```

יש אותות ש**שולחים ערך** יחד איתם. במקרה כזה הפונקציה שלכם חייבת לקבל פרמטר:

```python
def on_value_changed(value):    # value is sent automatically by the signal
    print(value)

spin.valueChanged.connect(on_value_changed)
```

בטבלאות שבהמשך, הערך שאות שולח כתוב בסוגריים, למשל `valueChanged(int)`. אות שכתוב עם `()` לא שולח כלום, ולכן הפונקציה שלכם לא צריכה לקבל פרמטרים.

## 1. תווית פשוטה (`QLabel`)

תווית מציגה בחלון **טקסט לקריאה בלבד**. המשתמש לא יכול לערוך אותו. משתמשים בתוויות לכותרות, לתיאורים ולהצגת תוצאות.

![תווית פשוטה](content/images/widget_label.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QLabel
  from PySide6.QtCore import Qt          # only needed for alignment
  ```

* **יצירה:**

  ```python
  label = QLabel("Hello, I am a label", window)
  label.setGeometry(20, 20, 250, 30)
  ```

* **קביעה וקריאה:**

  ```python
  label.setText("New text")    # set the text (must be a string)
  text = label.text()          # get the text

  label.setText(str(42))       # numbers must be converted to a string
  label.setNum(42)             # ...or use setNum for a number
  ```

* **מתודות חשובות נוספות:**

  ```python
  label.clear()                                  # remove the text
  label.setAlignment(Qt.AlignmentFlag.AlignCenter)  # center the text in the label
  label.setWordWrap(True)                        # break long text into several lines
  label.setStyleSheet("font-size: 20px; color: darkblue; font-weight: bold;")
  ```

* **אותות שימושיים:**
  תווית היא רכיב לתצוגה בלבד, ולכן **אין לה אותות שימושיים** למתחילים. משנים תווית מתוך הפונקציות שמחוברות לאותות של רכיבים *אחרים*.

## 2. תווית כנורית צבע (`QLabel`)

תווית **בלי טקסט** אבל עם **צבע רקע** היא נורית חיווי פשוטה, כמו נורת סטטוס (אדום = שגיאה, ירוק = תקין). עם `border-radius` בגודל חצי מהגודל שלה, התווית הופכת לעיגול.

![תוויות שמשמשות כנוריות צבע](content/images/widget_label_color.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QLabel
  ```

* **יצירה:**

  ```python
  indicator = QLabel(window)                 # no text
  indicator.setGeometry(20, 20, 40, 40)
  indicator.setStyleSheet("background-color: red;")
  ```

* **קביעת הצבע:**

  ```python
  # Square indicator
  indicator.setStyleSheet("background-color: green;")

  # Round indicator (border-radius = half of the width)
  indicator.setStyleSheet("background-color: green; border: 1px solid black; border-radius: 20px;")

  # Colors can be names, hex codes or RGB values
  indicator.setStyleSheet("background-color: #3399FF;")
  indicator.setStyleSheet("background-color: rgb(255, 165, 0);")
  ```

  תבנית שימושית היא פונקציה שקובעת את הצבע, כדי שלא תצטרכו לחזור על כל מחרוזת העיצוב:

  ```python
  def set_indicator(color):
      indicator.setStyleSheet(f"background-color: {color}; border: 1px solid black; border-radius: 20px;")

  set_indicator("orange")
  ```

* **קריאת הצבע:**
  אין מתודה `getColor()`. אפשר לקרוא בחזרה את כל מחרוזת העיצוב עם `indicator.styleSheet()`, אבל בדרך כלל פשוט יותר **לשמור את הצבע הנוכחי במשתנה** ולעדכן אותו בכל פעם שקוראים ל-`set_indicator`.

* **אותות שימושיים:**
  אין. משנים את הנורית מתוך פונקציות שמחוברות לרכיבים אחרים.

## 3. תווית שמציגה תמונה (`QLabel` + `QPixmap`)

תווית יכולה להציג **תמונה** במקום טקסט. התמונה נטענת לאובייקט `QPixmap`, וה-pixmap מוצב בתוך התווית.

![תווית שמציגה תמונה](content/images/widget_label_image.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QLabel
  from PySide6.QtGui import QPixmap
  from PySide6.QtCore import Qt          # only needed for scaling options
  ```

* **יצירה:**

  ```python
  image_label = QLabel(window)
  image_label.setGeometry(20, 20, 160, 110)

  pixmap = QPixmap("images/house.png")   # path to an image file (png, jpg, ...)
  image_label.setPixmap(pixmap)
  ```

  > **שימו לב:** הנתיב הוא יחסי לתיקייה שממנה אתם **מריצים** את התוכנית (בדרך כלל תיקיית הפרויקט), ולא לתיקייה של קובץ ה-`.py`.

* **קביעה וקריאה:**

  ```python
  image_label.setPixmap(QPixmap("images/other.png"))  # set / replace the image
  current = image_label.pixmap()                      # get the current QPixmap
  ```

* **מתודות חשובות נוספות:**

  ```python
  # Check the image was actually loaded (a wrong path gives an empty pixmap, not an error!)
  if pixmap.isNull():
      print("Image not found")

  # Stretch the image to fill the whole label (may distort it)
  image_label.setScaledContents(True)

  # Resize the image to fit the label while keeping its proportions
  scaled = pixmap.scaled(160, 110, Qt.AspectRatioMode.KeepAspectRatio,
                         Qt.TransformationMode.SmoothTransformation)
  image_label.setPixmap(scaled)

  # Size of the image
  w = pixmap.width()
  h = pixmap.height()

  # Remove the image
  image_label.clear()
  ```

* **אותות שימושיים:**
  אין.

## 4. שדה קלט של שורה אחת (`QLineEdit`)

תיבה שבה המשתמש מקליד **שורת טקסט אחת**, למשל שם, מספר או סיסמה.

![QLineEdit עם טקסט רמז ועם טקסט מוקלד](content/images/widget_lineedit.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QLineEdit
  ```

* **יצירה:**

  ```python
  name_input = QLineEdit(window)
  name_input.setGeometry(20, 20, 220, 30)
  ```

* **קביעה וקריאה:**

  ```python
  name_input.setText("Dana Cohen")    # set the text
  text = name_input.text()            # get the text (always a string!)
  ```

  הטקסט הוא תמיד **מחרוזת**. כדי להשתמש בו כמספר, המירו אותו, והיו מוכנים לקלט לא תקין:

  ```python
  try:
      age = int(age_input.text())
  except ValueError:
      result_label.setText("Please enter a whole number")
  ```

* **מתודות חשובות נוספות:**

  ```python
  name_input.clear()                                  # empty the box
  name_input.setPlaceholderText("Enter your name")    # gray hint shown when empty
  name_input.setReadOnly(True)                        # user can see but not edit
  name_input.setMaxLength(20)                         # limit number of characters
  name_input.setEchoMode(QLineEdit.EchoMode.Password) # show ●●●● instead of the text
  name_input.setFocus()                               # put the typing cursor in this box
  ```

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `textChanged(str)` | בכל פעם שהטקסט משתנה, על ידי המשתמש **או** על ידי `setText()` | הטקסט החדש |
  | `textEdited(str)` | בכל פעם ש**המשתמש** משנה את הטקסט (לא על ידי `setText()`) | הטקסט החדש |
  | `returnPressed()` | המשתמש לחץ על **Enter** | כלום |
  | `editingFinished()` | המשתמש לחץ על Enter **או** יצא מהתיבה (לחץ במקום אחר) | כלום |

  ```python
  def on_name_changed(text):
      preview_label.setText(f"Hello {text}")

  name_input.textChanged.connect(on_name_changed)
  ```

## 5. תיבת טקסט מרובת שורות (`QTextEdit`)

תיבה ל**הרבה שורות טקסט**. השתמשו בה כשהמשתמש צריך לכתוב טקסט ארוך יותר, או כאזור פלט לקריאה בלבד (למשל, יומן הודעות).

![QTextEdit](content/images/widget_textedit.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QTextEdit
  ```

* **יצירה:**

  ```python
  text_box = QTextEdit(window)
  text_box.setGeometry(20, 20, 300, 130)
  ```

* **קביעה וקריאה:**

  ```python
  text_box.setPlainText("Line 1\nLine 2")   # set the whole text (\n = new line)
  text = text_box.toPlainText()             # get the whole text as one string

  lines = text_box.toPlainText().split("\n")  # get the text as a list of lines
  ```

  > **שימו לב:** `QTextEdit` משתמש ב-`setPlainText()` / `toPlainText()`, **ולא** ב-`setText()` / `text()` כמו `QLineEdit`.

* **מתודות חשובות נוספות:**

  ```python
  text_box.append("A new line at the end")       # add a line (great for logs)
  text_box.insertPlainText("text")               # insert at the cursor position
  text_box.clear()                               # remove all text
  text_box.setReadOnly(True)                     # use the box for output only
  text_box.setPlaceholderText("Write your notes here...")
  text_box.setHtml("<b>Bold</b> and <i>italic</i>")  # show formatted (HTML) text
  ```

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `textChanged()` | בכל פעם שהטקסט משתנה | **כלום** - קראו את הטקסט עם `toPlainText()` |

  ```python
  def on_text_changed():
      count_label.setText(f"{len(text_box.toPlainText())} characters")

  text_box.textChanged.connect(on_text_changed)
  ```

  > **שימו לב:** בניגוד ל-`QLineEdit`, האות `textChanged` של `QTextEdit` **לא שולח ערך**, ולכן הפונקציה המחוברת לא מקבלת פרמטרים.

## 6. תיבות מספר (`QSpinBox` ו-`QDoubleSpinBox`)

תיבה לבחירת **מספר**, עם חיצים למעלה/למטה. המשתמש יכול גם להקליד את המספר.

* `QSpinBox` - ל**מספרים שלמים** (`1`, `2`, `3`)
* `QDoubleSpinBox` - ל**מספרים עשרוניים** (`3.14`)

![QSpinBox ו-QDoubleSpinBox](content/images/widget_spinbox.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QSpinBox, QDoubleSpinBox
  ```

* **יצירה:**

  ```python
  spin = QSpinBox(window)
  spin.setGeometry(20, 20, 100, 30)

  dspin = QDoubleSpinBox(window)
  dspin.setGeometry(140, 20, 100, 30)
  ```

* **קביעה וקריאה:**

  ```python
  spin.setValue(42)          # set
  n = spin.value()           # get -> int

  dspin.setValue(3.14)       # set
  x = dspin.value()          # get -> float
  ```

  > **חשוב:** טווח ברירת המחדל של שניהם הוא **0 עד 99**. קביעת ערך מחוץ לטווח משנה אותו בשקט לגבול הקרוב ביותר, אז תמיד קבעו קודם את הטווח שאתם צריכים.

* **מתודות חשובות נוספות:**

  ```python
  spin.setRange(-100, 100)       # minimum and maximum
  spin.setMinimum(0)             # or set them separately
  spin.setMaximum(1000)
  spin.setSingleStep(5)          # how much one arrow click changes the value
  spin.setPrefix("$ ")           # text shown before the number
  spin.setSuffix(" kg")          # text shown after the number
  spin.setWrapping(True)         # after the maximum, go back to the minimum
  spin.setReadOnly(True)         # use the box for output only

  # Hide the up/down arrows (nice for output boxes)
  spin.setButtonSymbols(QSpinBox.ButtonSymbols.NoButtons)

  # Only for QDoubleSpinBox
  dspin.setDecimals(3)           # number of digits after the decimal point (default 2)
  ```

  > **שימו לב:** `QDoubleSpinBox` **מעגל** את הערך למספר הספרות אחרי הנקודה: עם ברירת המחדל של 2, `dspin.setValue(3.14159)` שומר `3.14`.

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `valueChanged(int)` / `valueChanged(float)` | בכל פעם שהערך משתנה (חיצים, הקלדה או `setValue()`) | הערך החדש |
  | `editingFinished()` | המשתמש לחץ על Enter או יצא מהתיבה | כלום |

  ```python
  def on_value_changed(value):
      square_label.setText(f"Square: {value * value}")

  spin.valueChanged.connect(on_value_changed)
  ```

## 7. כפתור (`QPushButton`)

כפתור שהמשתמש **לוחץ** עליו כדי לבצע פעולה.

![QPushButton](content/images/widget_pushbutton.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QPushButton
  ```

* **יצירה:**

  ```python
  button = QPushButton("Click me", window)
  button.setGeometry(20, 20, 120, 35)
  ```

* **קביעה וקריאה:**

  ```python
  button.setText("Calculate")    # set the text on the button
  text = button.text()           # get the text
  ```

* **מתודות חשובות נוספות:**

  ```python
  button.setEnabled(False)      # disable the button (grayed out, cannot be clicked)
  button.setEnabled(True)       # enable it again
  button.click()                # "click" the button from code - emits clicked
  button.setStyleSheet("background-color: lightgreen; font-size: 16px;")
  ```

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `clicked()` | לחצו על הכפתור (העכבר נלחץ **ושוחרר** מעליו) | כלום* |
  | `pressed()` | כפתור העכבר **נלחץ** על הכפתור | כלום |
  | `released()` | כפתור העכבר **שוחרר** | כלום |

  *בפועל `clicked` שולח `bool` (מצב הסימון, ראו את הסעיף הבא), אבל בכפתור רגיל אפשר להתעלם מזה ולחבר פונקציה בלי פרמטרים.

  ```python
  def on_click():
      result_label.setText("Button was clicked!")

  button.clicked.connect(on_click)
  ```

## 8. כפתור מתג (`QPushButton` במצב Checkable)

`QPushButton` רגיל ש**נשאר לחוץ** אחרי שלוחצים עליו, וקופץ חזרה כשלוחצים עליו שוב. הוא עובד כמו מתג ON/OFF. זו אותה מחלקה (class) כמו של כפתור רגיל, רק עם `setCheckable(True)`.

![כפתור מתג, OFF (משמאל) ו-ON (מימין)](content/images/widget_pushbutton_toggle.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QPushButton
  ```

* **יצירה:**

  ```python
  toggle = QPushButton("Light: OFF", window)
  toggle.setGeometry(20, 20, 120, 35)
  toggle.setCheckable(True)        # this makes it a toggle button
  ```

* **קביעה וקריאה:**

  ```python
  toggle.setChecked(True)          # set to ON (pressed)
  is_on = toggle.isChecked()       # get: True = ON, False = OFF

  toggle.toggle()                  # flip the state (ON -> OFF, OFF -> ON)
  ```

* **מתודות חשובות נוספות:**
  כמו בכפתור רגיל: `setText()`, `text()`, `setEnabled()`.
  טריק שימושי הוא לתת למצב "ON" צבע אחר בעזרת מצב ה-CSS `:checked`:

  ```python
  toggle.setStyleSheet("QPushButton:checked { background-color: yellow; }")
  ```

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `toggled(bool)` | המצב השתנה, על ידי המשתמש **או** על ידי `setChecked()` / `toggle()` | `True` אם עכשיו ON, `False` אם עכשיו OFF |
  | `clicked(bool)` | **המשתמש** לחץ על הכפתור | המצב החדש |

  ```python
  def on_toggled(checked):
      if checked:
          toggle.setText("Light: ON")
      else:
          toggle.setText("Light: OFF")

  toggle.toggled.connect(on_toggled)
  ```

## 9. מחוון (`QSlider`)

ידית שהמשתמש **גורר** לאורך קו כדי לבחור מספר מתוך טווח. מתאים לדברים כמו עוצמת קול, מהירות או בהירות. מחוון (slider) יכול להיות אופקי או אנכי.

![QSlider אופקי ואנכי](content/images/widget_slider.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QSlider
  from PySide6.QtCore import Qt          # needed for the orientation
  ```

* **יצירה:**

  ```python
  slider = QSlider(Qt.Orientation.Horizontal, window)   # or Qt.Orientation.Vertical
  slider.setGeometry(20, 20, 220, 30)
  slider.setRange(0, 100)
  ```

* **קביעה וקריאה:**

  ```python
  slider.setValue(30)        # move the handle to 30
  value = slider.value()     # get the current value (int)
  ```

  > **שימו לב:** מחוון עובד רק עם **מספרים שלמים**. בשביל מספרים עשרוניים, השתמשו בטווח גדול יותר וחלקו. למשל, לערכים 0.0 עד 1.0 בקפיצות של 0.01, השתמשו ב-`setRange(0, 100)` ואז ב-`slider.value() / 100`.

* **מתודות חשובות נוספות:**

  ```python
  slider.setMinimum(0)
  slider.setMaximum(255)
  slider.setSingleStep(1)          # change when using the arrow keys
  slider.setPageStep(10)           # change when clicking on the line next to the handle

  # Tick marks
  slider.setTickPosition(QSlider.TickPosition.TicksBelow)
  slider.setTickInterval(10)       # a tick every 10 units
  ```

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `valueChanged(int)` | בכל פעם שהערך משתנה (גרירה, לחיצה, מקשים או `setValue()`) | הערך החדש |
  | `sliderMoved(int)` | בזמן שהמשתמש **גורר** את הידית | המיקום החדש |
  | `sliderPressed()` | המשתמש תפס את הידית | כלום |
  | `sliderReleased()` | המשתמש עזב את הידית | כלום |

  ```python
  def on_slider_changed(value):
      volume_label.setText(f"Volume: {value}%")

  slider.valueChanged.connect(on_slider_changed)
  ```

## 10. טבלה (`QTableWidget`)

**רשת של תאים** שמסודרים בשורות ובעמודות, כמו גיליון אלקטרוני קטן. כל תא מחזיק `QTableWidgetItem`. המשתמש יכול לבחור תאים ו(כברירת מחדל) לערוך אותם.

![QTableWidget](content/images/widget_tablewidget.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QTableWidget, QTableWidgetItem
  ```

* **יצירה:**

  ```python
  table = QTableWidget(3, 3, window)     # 3 rows, 3 columns
  table.setGeometry(20, 20, 340, 125)
  table.setHorizontalHeaderLabels(["Name", "Age", "Grade"])
  ```

* **קביעה וקריאה של תא:**

  כל תא מחזיק `QTableWidgetItem`, והטקסט חייב להיות **מחרוזת**:

  ```python
  # Set: put a new item in row 0, column 1
  table.setItem(0, 1, QTableWidgetItem("21"))
  table.setItem(0, 2, QTableWidgetItem(str(95)))   # convert numbers to strings

  # Get: take the item, then its text
  item = table.item(0, 1)
  if item is not None:            # an empty cell has no item -> None
      age = int(item.text())
  ```

  > **חשוב:** `table.item(row, col)` מחזיר `None` עבור תא שמעולם לא מולא, ולכן `table.item(row, col).text()` יקרוס על תא ריק. תמיד בדקו קודם אם התקבל `None`.

  מילוי טבלה שלמה מתוך רשימה:

  ```python
  students = [("Dana", 21, 95), ("Yossi", 23, 88), ("Noa", 22, 91)]

  table.setRowCount(len(students))
  for row, student in enumerate(students):
      for col, value in enumerate(student):
          table.setItem(row, col, QTableWidgetItem(str(value)))
  ```

* **מתודות חשובות נוספות:**

  ```python
  # Size of the table
  table.setRowCount(5)
  table.setColumnCount(4)
  rows = table.rowCount()
  cols = table.columnCount()

  # Add / remove rows
  table.insertRow(table.rowCount())   # add an empty row at the end
  table.removeRow(0)                  # remove the first row

  # Clear
  table.clearContents()               # empty all cells, keep the headers
  table.setRowCount(0)                # remove all rows

  # Headers
  table.setVerticalHeaderLabels(["a", "b", "c"])   # row titles (default: 1, 2, 3, ...)

  # Selected cell
  row = table.currentRow()
  col = table.currentColumn()

  # Prevent the user from editing the cells
  table.setEditTriggers(QTableWidget.EditTrigger.NoEditTriggers)

  # Column widths
  table.setColumnWidth(0, 120)
  table.resizeColumnsToContents()                  # fit columns to their text
  table.horizontalHeader().setStretchLastSection(True)  # last column fills the width
  ```

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `cellClicked(int, int)` | המשתמש לחץ על תא | שורה, עמודה |
  | `cellDoubleClicked(int, int)` | המשתמש לחץ לחיצה כפולה על תא | שורה, עמודה |
  | `cellChanged(int, int)` | הטקסט של תא השתנה (עריכה של המשתמש **או** `setItem()` מתוך הקוד) | שורה, עמודה |
  | `currentCellChanged(int, int, int, int)` | התא הנבחר זז | שורה חדשה, עמודה חדשה, שורה קודמת, עמודה קודמת |
  | `itemSelectionChanged()` | הבחירה השתנתה | כלום |

  ```python
  def on_cell_clicked(row, col):
      item = table.item(row, col)
      if item is not None:
          info_label.setText(f"Row {row}, column {col}: {item.text()}")

  table.cellClicked.connect(on_cell_clicked)
  ```

  > **שימו לב:** `cellChanged` נשלח גם כש**הקוד שלכם** ממלא את הטבלה. אם אתם לא רוצים שהפונקציה שלכם תרוץ בזמן מילוי הטבלה, חסמו את האותות באופן זמני:
  >
  > ```python
  > table.blockSignals(True)
  > # ... fill the table ...
  > table.blockSignals(False)
  > ```

## 11. רשימה נפתחת (`QComboBox`)

כפתור שפותח **רשימת אפשרויות**, והמשתמש בוחר **אחת** מהן. חוסך מקום לעומת הצגת כל האפשרויות בבת אחת.

![QComboBox](content/images/widget_combobox.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QComboBox
  ```

* **יצירה:**

  ```python
  combo = QComboBox(window)
  combo.setGeometry(20, 20, 150, 30)
  combo.addItems(["Red", "Green", "Blue"])
  ```

* **קביעה וקריאה:**

  לכל אפשרות יש **אינדקס** (שמתחיל מ-0) ו**טקסט**:

  ```python
  # Get the selected option
  text = combo.currentText()       # "Green"
  index = combo.currentIndex()     # 1   (-1 if the list is empty)

  # Select an option from code
  combo.setCurrentIndex(2)         # select by index
  combo.setCurrentText("Blue")     # select by text
  ```

* **מתודות חשובות נוספות:**

  ```python
  combo.addItem("Yellow")              # add one option
  combo.addItems(["Black", "White"])   # add several options
  combo.insertItem(0, "Purple")        # insert at a position
  combo.removeItem(0)                  # remove by index
  combo.clear()                        # remove all options

  n = combo.count()                    # number of options
  t = combo.itemText(2)                # text of the option at index 2
  i = combo.findText("Blue")           # index of an option (-1 if not found)

  combo.setEditable(True)              # let the user also type a value

  # Attach a hidden value to each option, and read it back
  combo.addItem("Small", 10)
  combo.addItem("Large", 50)
  size = combo.currentData()           # 10 or 50, depending on the selection
  ```

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `currentIndexChanged(int)` | האפשרות הנבחרת השתנתה (על ידי המשתמש **או** על ידי הקוד) | האינדקס החדש |
  | `currentTextChanged(str)` | הטקסט הנבחר השתנה (על ידי המשתמש **או** על ידי הקוד) | הטקסט החדש |
  | `activated(int)` | **המשתמש** בחר אפשרות (גם אם בחר שוב באותה אחת) | האינדקס שנבחר |

  ```python
  def on_color_changed(text):
      indicator.setStyleSheet(f"background-color: {text};")

  combo.currentTextChanged.connect(on_color_changed)
  ```

## 12. תיבת סימון (`QCheckBox`)

תיבה קטנה עם תווית שהמשתמש יכול **לסמן או לבטל את הסימון** שלה. משמשת לבחירות של כן/לא, כמו "Remember me" או "Show grid". בניגוד לרשימה נפתחת (combo box), אפשר לסמן כמה תיבות סימון באותו זמן.

![QCheckBox לא מסומן ומסומן](content/images/widget_checkbox.png)

* **ייבוא:**

  ```python
  from PySide6.QtWidgets import QCheckBox
  ```

* **יצירה:**

  ```python
  check = QCheckBox("Show grid", window)
  check.setGeometry(20, 20, 150, 30)
  ```

* **קביעה וקריאה:**

  ```python
  check.setChecked(True)            # check it
  is_checked = check.isChecked()    # get: True / False

  check.setText("Show axes")        # change the label text
  text = check.text()
  ```

* **מתודות חשובות נוספות:**

  ```python
  check.toggle()                    # flip the state
  check.setEnabled(False)           # gray it out
  ```

* **אותות שימושיים:**

  | אות | מתי הוא נשלח | מה הוא שולח |
  |---|---|---|
  | `toggled(bool)` | המצב השתנה, על ידי המשתמש **או** על ידי `setChecked()` | `True` אם מסומן, `False` אם לא |
  | `clicked(bool)` | **המשתמש** לחץ על התיבה | המצב החדש |
  | `stateChanged(int)` | המצב השתנה | `0` = לא מסומן, `2` = מסומן |

  הכי קל להשתמש ב-`toggled`, כי הוא שולח `True` / `False` פשוט:

  ```python
  def on_grid_toggled(checked):
      if checked:
          status_label.setText("Grid is ON")
      else:
          status_label.setText("Grid is OFF")

  check.toggled.connect(on_grid_toggled)
  ```

## סיכום מהיר

| רכיב | מייבאים מ- | קביעה | קריאה | אות עיקרי |
|---|---|---|---|---|
| `QLabel` (טקסט) | `QtWidgets` | `setText(str)` | `text()` | - |
| `QLabel` (צבע) | `QtWidgets` | `setStyleSheet("background-color: ...")` | שומרים במשתנה | - |
| `QLabel` (תמונה) | `QtWidgets`, `QPixmap` מ-`QtGui` | `setPixmap(QPixmap(path))` | `pixmap()` | - |
| `QLineEdit` | `QtWidgets` | `setText(str)` | `text()` | `textChanged(str)`, `editingFinished()` |
| `QTextEdit` | `QtWidgets` | `setPlainText(str)` | `toPlainText()` | `textChanged()` |
| `QSpinBox` | `QtWidgets` | `setValue(int)` | `value()` | `valueChanged(int)` |
| `QDoubleSpinBox` | `QtWidgets` | `setValue(float)` | `value()` | `valueChanged(float)` |
| `QPushButton` | `QtWidgets` | `setText(str)` | `text()` | `clicked()` |
| `QPushButton` (מתג) | `QtWidgets` | `setChecked(bool)` | `isChecked()` | `toggled(bool)` |
| `QSlider` | `QtWidgets`, `Qt` מ-`QtCore` | `setValue(int)` | `value()` | `valueChanged(int)` |
| `QTableWidget` | `QtWidgets` | `setItem(r, c, QTableWidgetItem(str))` | `item(r, c).text()` | `cellClicked(int, int)`, `cellChanged(int, int)` |
| `QComboBox` | `QtWidgets` | `setCurrentIndex(int)` / `setCurrentText(str)` | `currentIndex()` / `currentText()` | `currentIndexChanged(int)`, `currentTextChanged(str)` |
| `QCheckBox` | `QtWidgets` | `setChecked(bool)` | `isChecked()` | `toggled(bool)` |
