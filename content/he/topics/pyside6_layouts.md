# פריסות ב-PySide6

עם `setGeometry` הווידג'טים שומרים על המקום והגודל המדויקים שלהם, גם כשמשנים את גודל החלון. **פריסה** (layout) ממקמת את הווידג'טים בשבילכם: נותנים לה רק את **הסדר** של הווידג'טים, והיא קובעת את המיקומים והגדלים שלהם, ומעדכנת אותם כשהחלון משנה גודל.

## 3 השלבים

1. יוצרים את הווידג'טים **בלי** הורה ו-**בלי** `setGeometry`.
2. יוצרים פריסה ומוסיפים את הווידג'טים עם `addWidget`, לפי הסדר.
3. נותנים את הפריסה לחלון: `self.setLayout(layout)`.

```python
from PySide6.QtWidgets import QApplication, QWidget, QLabel, QLineEdit, QPushButton, QVBoxLayout


class NameWindow(QWidget):

    def __init__(self):
        super().__init__()
        self.initUI()

    def initUI(self):
        self.setWindowTitle("QVBoxLayout")

        self.label = QLabel("Enter your name:")
        self.name_input = QLineEdit()
        self.hello_button = QPushButton("Say Hello")

        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.name_input)
        layout.addWidget(self.hello_button)

        self.setLayout(layout)


if __name__ == "__main__":
    app = QApplication()
    window = NameWindow()
    window.show()
    app.exec()
```

בתמונות שלמטה, החלון הימני מראה את התיבות של הפריסה מצוירות מעליו.

## `QVBoxLayout`: אחד מתחת לשני

![QVBoxLayout: התווית, שדה הטקסט והכפתור אחד מתחת לשני](content/images/pyside_box_vbox.png)

## `QHBoxLayout`: זה לצד זה

אותם שלבים, עם `QHBoxLayout()` במקום:

```python
        layout = QHBoxLayout()
        layout.addWidget(self.label)          # QLabel("Name:")
        layout.addWidget(self.name_input)
        layout.addWidget(self.ok_button)
```

![QHBoxLayout: התווית, שדה הטקסט והכפתור זה לצד זה](content/images/pyside_box_hbox.png)

## `QBoxLayout`: כל כיוון

`QHBoxLayout` ו-`QVBoxLayout` הן קיצורים של `QBoxLayout` עם כיוון:

```python
layout = QBoxLayout(QBoxLayout.LeftToRight)    # like QHBoxLayout
layout = QBoxLayout(QBoxLayout.TopToBottom)    # like QVBoxLayout
layout = QBoxLayout(QBoxLayout.RightToLeft)
layout = QBoxLayout(QBoxLayout.BottomToTop)
```

![אותם 3 כפתורים ב-4 הכיוונים של QBoxLayout](content/images/pyside_box_directions.png)

## מתיחה: לדחוף ווידג'טים לצד

`layout.addStretch()` מוסיפה קפיץ בלתי נראה שלוקח את המקום הריק:

![שני כפתורים בלי מתיחה, עם מתיחה אחריהם, לפניהם ומשני הצדדים](content/images/pyside_box_stretch.png)

```python
        layout = QHBoxLayout()
        layout.addStretch()                   # OK and Cancel on the right
        layout.addWidget(self.ok_button)
        layout.addWidget(self.cancel_button)
```

## פריסות בתוך פריסות

ציירו תיבות מסביב לשורות של החלון. כל שורה היא `QHBoxLayout`, והשורות נמצאות אחת מתחת לשנייה ב-`QVBoxLayout` ראשית. מוסיפים פריסה עם `addLayout`:

![חלון צ'אט: שתי שורות QHBoxLayout בתוך QVBoxLayout](content/images/pyside_box_nested.png)

```python
        top_layout = QHBoxLayout()
        top_layout.addWidget(self.to_label)
        top_layout.addWidget(self.to_input)

        bottom_layout = QHBoxLayout()
        bottom_layout.addWidget(self.message_input)
        bottom_layout.addWidget(self.send_button)

        main_layout = QVBoxLayout()
        main_layout.addLayout(top_layout)          # a layout inside a layout
        main_layout.addWidget(self.messages_box)
        main_layout.addLayout(bottom_layout)

        self.setLayout(main_layout)                # only the main layout
```

## בקצרה

| אני רוצה... | להשתמש ב- |
|---|---|
| ווידג'טים אחד מתחת לשני | `QVBoxLayout()` |
| ווידג'טים זה לצד זה | `QHBoxLayout()` |
| כיוון אחר | `QBoxLayout(QBoxLayout.RightToLeft)` |
| לדחוף ווידג'טים לצד | `layout.addStretch()` לפניהם או אחריהם |
| פריסה בתוך פריסה | `main_layout.addLayout(inner_layout)` |
| לתת את הפריסה לחלון | `self.setLayout(main_layout)` |
