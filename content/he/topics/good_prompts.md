# פרומפטים לממשק משתמש התחלתי

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

הפרומפט הזה לא מתאר אפליקציה גמורה. הוא מתאר **שלד**, שבנוי כמו ש*אתם* הייתם בונים אותו, עם כלים ש*אתם* כבר מכירים. כל משפט בפרומפט מקבל החלטה, כדי שה-AI לא יצטרך לנחש.

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

## אחרי שה-AI עונה

1. **קראו את כל הקוד** לפני שאתם מריצים אותו. אם שורה לא ברורה, בקשו מה-AI להסביר אותה.
2. **בדקו שהוא עשה מה שביקשתם:** שם הקובץ, השמות, המבנה. אם הוא הוסיף דברים שלא ביקשתם, בקשו ממנו להוריד אותם.
3. **הריצו** וודאו שהשלד עובד.
4. **בצעו commit** ב-git. עכשיו יש לכם נקודת התחלה נקייה לחזור אליה, ואפשר להתחיל להוסיף את הקוד שלכם.

## עוד דוגמאות לפרומפטים

כדאי לכתוב פרומפטים באנגלית, כי שמות הקבצים, הווידג'טים והמתודות ממילא באנגלית. כל אחד מהפרומפטים האלה בונה רק את הממשק, והמתודות נשארות לכם.

### טופס מחשבון קטן

> Create a PySide6 app in a new file called `calculator.py`, with a main window written as a class. Add two `QLineEdit` fields named `first_number_input` and `second_number_input`, a button with the text "Add" named `add_button`, and a `QLabel` named `result_label`. Use a `QVBoxLayout`. Connect `add_button` to a method called `add_numbers`. Leave `add_numbers` empty, I will write the calculation myself.

שני שדות קלט, כפתור ״Add״ ותווית לתוצאה, כל אחד עם שם. המתודה `add_numbers` נשארת ריקה, ואת החישוב אתם כותבים.

### טבלה וכפתור לבחירת קובץ

> Create a PySide6 app in a new file called `table_viewer.py`, with a main window written as a class. Add a button with the text "Open file" named `open_file_button`, connected to a method called `open_file`. In `open_file`, open a file selection dialog and save the user's choice in `self.filename`. Below the button, add a `QTableWidget` named `data_table` with 3 columns. Also create an empty method called `fill_table`. I will write the code that reads the file and fills the table myself.

כפתור שפותח חלון לבחירת קובץ ושומר את הבחירה ב-`self.filename`, וטבלה עם 3 עמודות. את הקריאה של הקובץ ואת מילוי הטבלה ב-`fill_table` אתם כותבים.

### מחוון (slider) וגרף

> Create a PySide6 app in a new file called `sine_explorer.py`, with a main window written as a class. Add a matplotlib graph of at least 400 by 300 pixels, and under it a horizontal `QSlider` named `frequency_slider` with values from 1 to 10. Connect the slider's `valueChanged` signal to a method called `update_graph`. For now, `update_graph` should only print the slider's value. I will write the drawing myself.

גרף ומתחתיו מחוון. כל הזזה של המחוון קוראת ל-`update_graph`, שבינתיים רק מדפיסה את הערך. את הציור אתם כותבים.

### טיימר עם כפתורי Start ו-Stop

> Create a PySide6 app in a new file called `animation.py`, with a main window written as a class. Add a matplotlib graph of at least 400 by 400 pixels, and two buttons in a row under it: "Start" named `start_button` and "Stop" named `stop_button`. Create a `QTimer` named `timer` that calls a method called `step` every 50 milliseconds. `start_button` starts the timer and `stop_button` stops it. Leave `step` empty, I will write the movement myself.

גרף, כפתורי ״Start״ ו-״Stop״, וטיימר שקורא ל-`step` כל 50 מילישניות. `step` נשארת ריקה, ואת התנועה אתם כותבים.

## השלב הבא: פרומפט לעיצוב

אחרי שהשלד עובד ונשמר ב-commit, אפשר לגרום לו להיראות טוב בעזרת **פרומפט שני ונפרד**. אל תכניסו את העיצוב לפרומפט הראשון: קודם בונים את המבנה נכון, ורק אחר כך עובדים על המראה.

בקשו מה-AI לשים את העיצוב ב**קובץ QSS** (ראו את הפריט על קובצי QSS ב[יחידת PySide6](?id=pyside6)). כך כל הצבעים, הגופנים והמרווחים נמצאים בקובץ אחד, וקוד ה-Python שלכם נשאר קצר וקל לקריאה.

### פרומפט עיצוב פשוט

> Design the window in `app.py` in a modern way, using a QSS file called `style.qss`. Load the file once, when the app starts. Don't change anything else in the Python code.

(״עצב את החלון ב-`app.py` בצורה מודרנית, בעזרת קובץ QSS בשם `style.qss`. טען את הקובץ פעם אחת, כשהאפליקציה עולה. אל תשנה שום דבר אחר בקוד ה-Python.״)

### פרומפט עיצוב עם הבחירות שלכם

אם אתם כבר יודעים מה אתם רוצים, תגידו את זה. כל פרט שאתם נותנים הוא החלטה שה-AI לא מקבל במקומכם:

> Design the window in `app.py` in a modern way, using a QSS file called `style.qss`. Load the file once, when the app starts. Use a light gray background, dark blue buttons with white text and rounded corners, a lighter blue when the mouse is over a button, and a 12 pt font. Add some spacing between the widgets. Don't change anything else in the Python code.

רקע אפור בהיר, כפתורים בכחול כהה עם טקסט לבן ופינות מעוגלות, כחול בהיר יותר כשהעכבר מעל כפתור, גופן בגודל 12, ומרווחים בין הווידג'טים.

![חלון השלד לפני פרומפט העיצוב, ואחריו עם style.qss](content/images/prompt_design_before_after_he.png)

קוד ה-Python זהה בשני החלונות. רק הקובץ `style.qss` נוסף ונטען. זה הקובץ:

```css
QMainWindow {
    background-color: #eef1f5;
}
QWidget {
    font-size: 12pt;
}
QPushButton {
    background-color: #1e3a8a;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    margin: 6px 4px;
    font-weight: bold;
}
QPushButton:hover {
    background-color: #3b82f6;
}
```

עכשיו תורכם: **פתחו את `style.qss` ושחקו איתו.** שנו צבע, עגלו יותר את הפינות, הגדילו את הגופן, הריצו שוב את האפליקציה וראו מה השתנה. הקובץ קצר וקל לקריאה, אז לא צריך עוד פרומפט על כל שינוי קטן. ה-AI נתן לכם נקודת התחלה, והמראה הסופי צריך להיות שלכם.

עוד דברים שאפשר לבקש: ערכת נושא כהה, גופן מסוים, צבע בולט לכפתור חשוב אחד, או מסגרת סביב אזור הגרף.

״אל תשנה שום דבר אחר בקוד ה-Python״ זה משפט חשוב. בדקו ב-git שה-AI עמד בזה: השינויים צריכים להיות הקובץ החדש `style.qss`, השורה או שתיים שטוענות אותו, ואולי כמה קריאות ל-`setObjectName`. אם התוצאה לא מוצאת חן בעיניכם, בטלו את השינויים ונסו פרומפט אחר. אם היא מוצאת חן, בצעו commit.

### לגרום לגרף להיראות טוב

קובץ ה-QSS מעצב את החלון, אבל לא את הגרף: את הגרף matplotlib מצייר בעצמו. לכן הגרף מקבל פרומפט משלו. כאן לא צריך את המילים הטכניות. תארו במילים פשוטות מה אתם רוצים לראות. למשל:

> Make the graph in `draw_graph` look nicer. Remove the lines on the top and right sides of the graph, add a title and a name for each axis, make the line thicker and dark blue with a dot on every point, and make the background of the graph the same light gray as the window. Keep the grid off. Only change `draw_graph`.

(״תגרום לגרף ב-`draw_graph` להיראות יותר טוב. תוריד את הקווים בצד העליון והימני של הגרף, תוסיף כותרת ושם לכל ציר, תעשה את הקו עבה יותר וכחול כהה עם נקודה על כל נקודת נתונים, ותעשה את הרקע של הגרף באותו אפור בהיר כמו החלון. תשאיר את הרשת כבויה. תשנה רק את `draw_graph`.״)

![החלון המעוצב לפני פרומפט הגרף, ואחריו](content/images/prompt_graph_before_after_he.png)

ה-AI משנה רק את `draw_graph`:

```python
def draw_graph(self):
    self.ax.clear()
    self.figure.set_facecolor("#eef1f5")
    self.ax.set_facecolor("#eef1f5")
    self.ax.spines["top"].set_visible(False)
    self.ax.spines["right"].set_visible(False)
    self.ax.set_axisbelow(True)
    self.ax.plot([0, 1, 2, 3, 4], [0, 1, 4, 9, 16],
                 color="#1e3a8a", linewidth=2.5, marker="o")
    self.ax.set_title("My data", fontweight="bold")
    self.ax.set_xlabel("x")
    self.ax.set_ylabel("y")
    self.canvas.draw()
```

עכשיו קראו את הקוד. יש דברים שקל מאוד לעשות ברגע שיודעים איך. עכשיו אתם יכולים לשנות את הערכים בעצמכם כדי לקבל את המראה שאתם רוצים.

### זום ושמירה של הגרף

אזור הגרף עדיין לא נראה כל כך טוב, כי הגרף לא מנצל נכון את המקום שמסביבו. בנוסף, אנחנו רוצים להוסיף אפשרות לזום ולשמירת הגרף כתמונה. נכתוב לזה פרומפט המשך.

> Make the graph occupy the entire width of the window but ensure that the y axis title is fully visible, and go up until it is almost at the "Load Data" button. Add an option for zooming and for saving the graph as an image, with only two buttons and place them so they line up with the main title, on the right side of the graph. Style it to match the rest of the app using `style.qss`. Don't change `draw_graph`.

(״תגרום לגרף לתפוס את כל רוחב החלון, אבל תוודא שהשם של ציר ה-y נראה במלואו, ותעלה אותו עד שהוא כמעט מגיע לכפתור ״Load Data״. תוסיף אפשרות לזום ולשמירת הגרף כתמונה, עם שני כפתורים בלבד, ותמקם אותם כך שיהיו בשורה אחת עם הכותרת הראשית, בצד הימני של הגרף. תעצב אותם כך שיתאימו לשאר האפליקציה בעזרת `style.qss`. אל תשנה את `draw_graph`.״)

![האפליקציה לפני הפרומפט, ואחריו](content/images/prompt_toolbar_before_after_he.png)

השינוי ב-Python קטן. מחלקה קטנה מעל `MainWindow` משאירה רק שניים מהכפתורים של סרגל הכלים (toolbar):

```python
from PySide6.QtCore import Qt
from PySide6.QtWidgets import QGridLayout
from matplotlib.backends.backend_qtagg import NavigationToolbar2QT


class GraphToolbar(NavigationToolbar2QT):
    # Keep only the Zoom and Save buttons of matplotlib's toolbar
    toolitems = [t for t in NavigationToolbar2QT.toolitems if t[0] in ("Zoom", "Save")]
```

ובנוסף משתנות כמה שורות ב-`__init__`. הגרף מסדר את עצמו כך שימלא את השטח שלו, וסרגל הכלים יושב מעל הגרף, בפינה הימנית העליונה שלו:

```python
        self.figure = Figure(layout="constrained")    # was: Figure()
```

```python
        self.toolbar = GraphToolbar(self.canvas, self, coordinates=False)
        graph_area = QGridLayout()
        graph_area.addWidget(self.canvas, 0, 0)
        graph_area.addWidget(self.toolbar, 0, 0, Qt.AlignTop | Qt.AlignRight)
        layout.addLayout(graph_area)    # was: layout.addWidget(self.canvas)
        layout.setSpacing(0)            # less space between the button and the graph
```

`layout="constrained"` אומר ל-matplotlib להגדיל את הגרף כמה שאפשר, ועדיין להשאיר מקום לכותרת ולשמות הצירים. כשמכניסים את ה-canvas ואת סרגל הכלים לאותו תא ב-`QGridLayout`, אחד מהם יושב מעל השני.

מה עושים שני הכפתורים:

- **Zoom** (זכוכית המגדלת): לוחצים עליו, ואז מסמנים מלבן על החלק של הגרף שרוצים לראות בגדול. גרירה עם הכפתור הימני של העכבר מקטינה. לחיצה נוספת על הכפתור מכבה את הזום.
- **Save** (הדיסקט): שומר את הגרף כקובץ PNG, JPG, PDF או SVG.

לסרגל הכלים של matplotlib יש עוד כפתורים: Home (חזרה לתצוגה המלאה), Back, Forward, Pan (הזזת הגרף) ועוד כמה הגדרות. רוצים גם אחד מהם? הוסיפו את השם שלו לרשימה ב-`GraphToolbar`, למשל `("Home", "Zoom", "Save")`. רוצים לשנות את המראה? שנו את הצבעים ב-`style.qss`, בדיוק כמו קודם.
