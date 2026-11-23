# כתיבת פרומפטים טובים

כשמבקשים מ-AI לבנות גרסה ראשונה של אפליקציה (ממשק משתמש התחלתי), הפרומפט שכותבים קובע איזה קוד יחזור. פרומפט מעורפל יחזיר קוד ש*עובד*, אבל שאתם לא מכירים. פרומפט טוב יחזיר קוד שאתם יכולים לקרוא, לשנות ולהרחיב בעצמכם.

## פרומפט מעורפל

> Make me an app that loads a data file and shows a graph.

(״תכין לי אפליקציה שטוענת קובץ נתונים ומציגה גרף.״)

הפרומפט הזה משאיר ל-AI את כל ההחלטות החשובות:

- **אילו ספריות?** הוא עלול לבחור Tkinter, Streamlit, Plotly, PyQt או משהו שמעולם לא שמעתם עליו.
- **איזה מבנה?** סקריפט אחד ארוך, כמה פונקציות, מחלקה, שלושה קבצים? לא תדעו עד שתסתכלו.
- **אילו שמות?** הכפתור יכול להיקרא `btn1`, המתודה `on_click`, ושם הקובץ `fn`. תצטרכו לחפש אותם.
- **כמה?** הוא עלול להוסיף תפריטים, הגדרות, חלונות שגיאה וערכת נושא כהה שלא ביקשתם. יותר קוד זה יותר מה לקרוא ויותר מקומות שבאגים יכולים להסתתר בהם.

התוצאה אולי תרוץ, אבל עכשיו אתם אורחים בקוד של מישהו אחר. אתם לא יודעים איפה להוסיף את הלוגיקה שלכם, וכל שינוי הופך לעוד פרומפט.

## פרומפט טוב

> Create a PySide6 app in a new file called `app.py`. The app should have a main window, written as a class.
>
> Add a button with the text "Load data". Name the button `file_load_button` and connect it to a method called `file_load_method`. In this method, open a file selection dialog and save the user's choice in `self.filename`.
>
> Also add an area of at least 300 by 300 pixels with a matplotlib graph in it. Create a method called `draw_graph` that draws something simple on the graph. I will change it later.

ובעברית:

> צור אפליקציית PySide6 בקובץ חדש בשם `app.py`. לאפליקציה צריך להיות חלון ראשי, כתוב כמחלקה.
>
> הוסף כפתור עם הטקסט "Load data". קרא לכפתור `file_load_button` וחבר אותו למתודה בשם `file_load_method`. במתודה הזאת, פתח חלון לבחירת קובץ ושמור את הבחירה של המשתמש ב-`self.filename`.
>
> הוסף גם אזור בגודל 300 על 300 פיקסלים לפחות עם גרף matplotlib. צור מתודה בשם `draw_graph` שמציירת משהו פשוט על הגרף. אני אשנה אותה אחר כך.

הפרומפט הזה לא מתאר אפליקציה גמורה. הוא מתאר **שלד**, שבנוי כמו ש*אתם* הייתם בונים אותו, עם כלים ש*אתם* כבר מכירים.

## עוברים על הפרומפט

כל משפט בפרומפט מקבל החלטה אחת, כדי שה-AI לא יצטרך לנחש.

| מה הפרומפט אומר | מה זה נותן לכם |
|---|---|
| ״אפליקציית PySide6״ | ספרייה שלמדתם בכיתה. אתם יכולים לקרוא כל שורה. |
| ״בקובץ חדש בשם `app.py`״ | אתם יודעים בדיוק איפה הקוד נמצא, והוא לא נוגע בקבצים האחרים שלכם. |
| ״חלון ראשי, כתוב כמחלקה״ | המבנה שאנחנו משתמשים בו בקורס: ווידג'טים הם תכונות (`self.something`), ופעולות הן מתודות. |
| ״קרא לכפתור `file_load_button`״ | כשתרצו לשנות את הכפתור, תחפשו את השם הזה. |
| ״חבר אותו למתודה בשם `file_load_method`״ | אתם יודעים איפה נמצא הקוד שרץ בלחיצה. |
| ״שמור את הבחירה ב-`self.filename`״ | כל מתודה אחרת במחלקה יכולה להשתמש בשם הקובץ אחר כך. |
| ״300 על 300 פיקסלים לפחות עם גרף matplotlib״ | ספרייה שאתם מכירים, וגודל שאתם בחרתם. |
| ״מתודה בשם `draw_graph`... אני אשנה אותה אחר כך״ | מקום ברור וריק לקוד הגרפים שלכם. ״אני אשנה אחר כך״ אומר ל-AI לשמור על פשטות. |

## מה מקבלים בחזרה

ה-AI אמור להחזיר משהו קרוב לזה:

```python
import sys

from PySide6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QPushButton, QFileDialog
)
from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg
from matplotlib.figure import Figure


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("My App")
        self.filename = None

        # The button
        self.file_load_button = QPushButton("Load data")
        self.file_load_button.clicked.connect(self.file_load_method)

        # The graph area
        self.figure = Figure()
        self.canvas = FigureCanvasQTAgg(self.figure)
        self.canvas.setMinimumSize(300, 300)
        self.ax = self.figure.add_subplot()

        # Put everything in the window
        layout = QVBoxLayout()
        layout.addWidget(self.file_load_button)
        layout.addWidget(self.canvas)
        central = QWidget()
        central.setLayout(layout)
        self.setCentralWidget(central)

        self.draw_graph()

    def file_load_method(self):
        self.filename, _ = QFileDialog.getOpenFileName(self, "Choose a file")
        print("Selected:", self.filename)

    def draw_graph(self):
        self.ax.clear()
        self.ax.plot([0, 1, 2, 3, 4], [0, 1, 4, 9, 16])
        self.canvas.draw()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
```

שימו לב כמה קל להתמצא:

- **רוצים לקרוא את הקובץ אחרי שנבחר?** הוסיפו את הקוד שלכם בסוף `file_load_method`, שם `self.filename` כבר מחזיק את הנתיב.
- **רוצים לצייר את הנתונים האמיתיים שלכם?** החליפו את שתי השורות שבתוך `draw_graph`, וקראו ל-`self.draw_graph()` אחרי טעינת הנתונים.
- **רוצים כפתור נוסף?** העתיקו את שתי השורות שיוצרות את `file_load_button`, תנו לכפתור החדש שם משלו ומתודה משלו, והוסיפו אותו ל-layout.

אין כאן שום הפתעה. יכולתם לכתוב את זה בעצמכם, זה רק היה לוקח יותר זמן.

## למה זה חשוב

- **אתם מבינים את הקוד.** הוא משתמש בספריות ובמבנה שלמדתם, כך שאתם יכולים לקרוא אותו שורה אחר שורה. אתם יודעים מה הוא עושה, ולא רק *מאמינים* שהוא עובד.
- **אתם יודעים איפה לשים את הקוד שלכם.** לכל חלק יש שם שאתם בחרתם. הלוגיקה שלכם נכנסת למתודות שאתם נתתם להן שם, ולא למבוך.
- **אתם יכולים להרחיב לבד.** הוספת ווידג'ט או יכולת היא שינוי קטן ומוכר. לא צריך לשלוח פרומפט על כל שינוי קטן, ולעיתים קרובות מהיר יותר פשוט לעשות את זה בעצמכם.
- **פחות הפתעות.** פרומפט קצר וממוקד מחזיר קוד קצר וממוקד. פחות קוד זה פחות באגים נסתרים ופחות מה לבדוק.
- **אתם נשארים בשליטה.** זה כל הרעיון של [הכללים לשימוש ב-AI](?id=using-ai): ה-AI מקליד מהר יותר מכם, אבל **אתם** אלה שמתכננים את האפליקציה.

שימו לב שאפשר לכתוב פרומפט כזה רק אם כבר מכירים את הכלים. בגלל זה אנחנו לומדים קודם PySide6, matplotlib ומחלקות, ומשתמשים ב-AI כדי לחסוך הקלדה, לא מחשבה.

## מה לכתוב בפרומפט התחלתי

1. **הטכנולוגיות:** השפה, ספריית הממשק הגרפי, ספריית הגרפים או הנתונים (PySide6, matplotlib, NumPy, pandas...).
2. **הקובץ:** איזה קובץ ליצור או לשנות.
3. **המבנה:** חלון כמחלקה, איזה layout, מה נמצא איפה.
4. **השמות:** של הווידג'טים, המתודות והמשתנים החשובים.
5. **החיבורים:** איזה כפתור או signal קורא לאיזו מתודה.
6. **גודל המשימה:** מה להשאיר כמקום פשוט וזמני, ושאתם תמלאו אותו אחר כך.

## עוד דוגמאות לפרומפטים

כדאי לכתוב פרומפטים באנגלית, כי שמות הקבצים, הווידג'טים והמתודות ממילא באנגלית.

### טופס מחשבון קטן

> Create a PySide6 app in a new file called `calculator.py`, with a main window written as a class. Add two `QLineEdit` fields named `first_number_input` and `second_number_input`, a button with the text "Add" named `add_button`, and a `QLabel` named `result_label`. Use a `QVBoxLayout`. Connect `add_button` to a method called `add_numbers` that reads both fields, converts them to `float`, and shows the sum in `result_label`. Don't add error handling yet, I will add it myself.

שני שדות קלט, כפתור ״Add״ ותווית לתוצאה, כל אחד עם שם. המתודה `add_numbers` מחברת את המספרים. את הטיפול בשגיאות אתם תוסיפו בעצמכם.

### טבלת נתונים מקובץ CSV

> Create a PySide6 app in a new file called `table_viewer.py`, with a main window written as a class. Add a button with the text "Open CSV" named `open_csv_button`, connected to a method called `open_csv`. In `open_csv`, open a file selection dialog that shows only `.csv` files, read the chosen file with pandas into `self.data`, and then call a method called `fill_table`. Below the button, add a `QTableWidget` named `data_table`. `fill_table` should copy `self.data` into `data_table`, with the column names as headers.

כפתור שפותח קובץ CSV, קורא אותו עם pandas לתוך `self.data`, ומתודה נפרדת `fill_table` שממלאת את הטבלה.

### מחוון (slider) שמשנה גרף

> Create a PySide6 app in a new file called `sine_explorer.py`, with a main window written as a class. Add a matplotlib graph of at least 400 by 300 pixels, and under it a horizontal `QSlider` named `frequency_slider` with values from 1 to 10. Connect the slider's `valueChanged` signal to a method called `update_graph`. In `update_graph`, use NumPy to draw `sin(frequency * x)` for x from 0 to 2π, where `frequency` is the slider's value. Draw the graph once when the window opens.

גרף ומתחתיו מחוון. כל הזזה של המחוון קוראת ל-`update_graph`, שמציירת סינוס בתדירות שנבחרה בעזרת NumPy.

### אנימציה פשוטה עם טיימר

> Create a PySide6 app in a new file called `animation.py`, with a main window written as a class. Add a matplotlib graph of at least 400 by 400 pixels, and two buttons in a row under it: "Start" named `start_button` and "Stop" named `stop_button`. Create a `QTimer` named `timer` that calls a method called `step` every 50 milliseconds. `start_button` starts the timer and `stop_button` stops it. Keep the ball's position in `self.x` and `self.y`. In `step`, move the ball a little and redraw it as a single dot. Keep the movement simple, I will add the physics later.

גרף, כפתורי ״Start״ ו-״Stop״, וטיימר שקורא ל-`step` כל 50 מילישניות. המיקום של הכדור נשמר ב-`self.x` וב-`self.y`, ואת הפיזיקה אתם תוסיפו אחר כך.

## אחרי שה-AI עונה

1. **קראו את כל הקוד** לפני שאתם מריצים אותו. אם שורה לא ברורה, בקשו מה-AI להסביר אותה.
2. **בדקו שהוא עשה מה שביקשתם:** שם הקובץ, השמות, המבנה. אם הוא הוסיף דברים שלא ביקשתם, בקשו ממנו להוריד אותם.
3. **הריצו** וודאו שהשלד עובד.
4. **בצעו commit** ב-git. עכשיו יש לכם נקודת התחלה נקייה לחזור אליה, ואפשר להתחיל להוסיף את הקוד שלכם.
