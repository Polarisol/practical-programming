# הפשטה של SQL

## הבעיה: SQL מפוזר בכל הקוד

ברגע שאנחנו יודעים SQL, מפתה לכתוב שאילתה בכל מקום שבו צריך נתונים: אחת בחלון הראשי, עוד אחת בקוד של הדוחות, ושלישית בפונקציה שמטפלת בלחיצה על כפתור. זה עובד, אבל מהר מאוד זה הופך לבלגן:

```python
# in the GUI code
cur.execute('SELECT name, grade FROM students WHERE city = ?', (city,))
...
# in the report code
cur.execute('SELECT AVG(grade) FROM students')
...
# in the button handler
cur.execute('UPDATE students SET grade = ? WHERE id = ?', (grade, student_id))
con.commit()
```

- **קשה לשנות:** אם משנים שם של עמודה או של טבלה, צריך לצוד כל שאילתה בכל הפרויקט.
- **קוד חוזר:** אותה שאילתה מועתקת לכמה מקומות, והעותקים לאט לאט מתרחקים זה מזה.
- **קשה לקרוא:** הקוד של הממשק הגרפי או של המשחק מלא במחרוזות SQL שאין להן שום קשר למה שהקוד הזה אמור לעשות.
- **קל לשבור:** כל חלק בפרויקט צריך להכיר את מבנה הטבלאות, לזכור לעשות `commit`, להשתמש נכון ב-placeholders של `?`, וכן הלאה.

**אנחנו לא רוצים לראות שאילתות SQL בכל פינה בקוד.**

## הפתרון: מחלקה אחת שמחזיקה את כל ה-SQL

אנחנו יוצרים **מחלקה (class) אחת**, למשל בשם `Database`, שהיא החלק היחיד בפרויקט שמדבר עם מסד הנתונים:

- ב-`__init__` היא **מתחברת** למסד הנתונים (ויוצרת את הטבלאות אם הן עדיין לא קיימות).
- יש לה **מתודות עם שמות ברורים ומשמעותיים**, כמו `add_student`, `get_students_in_city` או `get_average_grade`.
- כל מתודה מכילה את ה-SQL שהיא צריכה ומחזירה ערכי Python רגילים (מספרים, מחרוזות, רשימות, tuples).

שאר הפרויקט פשוט קורא למתודות האלה. הוא אף פעם לא כותב SQL, והוא אפילו לא צריך לדעת שיש כאן SQL בכלל.

> **הכלל:** כל קוד ה-SQL נמצא במחלקה `Database`, **ורק** בה. אף קובץ אחר לא מייבא את `sqlite3` או מכיל שאילתה.

## דוגמה

`database.py`:

```python
import sqlite3


class Database:
    def __init__(self, filename='school.db'):
        self.con = sqlite3.connect(filename)
        self.con.execute('''
            CREATE TABLE IF NOT EXISTS students (
                id    INTEGER PRIMARY KEY AUTOINCREMENT,
                name  TEXT NOT NULL,
                grade INTEGER,
                city  TEXT
            )
        ''')
        self.con.commit()

    def add_student(self, name, grade, city):
        with self.con:
            self.con.execute('INSERT INTO students (name, grade, city) VALUES (?, ?, ?)',
                             (name, grade, city))

    def get_all_students(self):
        cur = self.con.execute('SELECT id, name, grade, city FROM students ORDER BY name')
        return cur.fetchall()

    def get_students_in_city(self, city):
        cur = self.con.execute('SELECT name, grade FROM students WHERE city = ?', (city,))
        return cur.fetchall()

    def get_average_grade(self):
        cur = self.con.execute('SELECT AVG(grade) FROM students')
        return cur.fetchone()[0]

    def update_grade(self, student_id, new_grade):
        with self.con:
            self.con.execute('UPDATE students SET grade = ? WHERE id = ?',
                             (new_grade, student_id))

    def delete_student(self, student_id):
        with self.con:
            self.con.execute('DELETE FROM students WHERE id = ?', (student_id,))

    def close(self):
        self.con.close()
```

`main.py` (או כל חלק אחר בפרויקט):

```python
from database import Database

db = Database()

db.add_student('Noa', 88, 'Eilat')
db.update_grade(2, 75)

for name, grade in db.get_students_in_city('Haifa'):
    print(name, grade)

print('Class average:', db.get_average_grade())

db.close()
```

שימו לב שב-`main.py` **אין SQL בכלל**. הוא נקרא כמעט כמו אנגלית פשוטה: "תוסיף תלמיד", "תביא את התלמידים בחיפה", "תביא את הציון הממוצע".

## למה זה עדיף

- **מקום אחד לשנות:** אם מבנה הטבלה משתנה, מתקנים את המחלקה `Database` ותו לא.
- **קוד קריא:** שאר הפרויקט מתאר *מה* הוא צריך (`db.get_average_grade()`), ולא *איך* להשיג את זה.
- **בלי חזרות:** כל שאילתה נכתבת פעם אחת ומשמשת בכל מקום.
- **קל לבדוק:** אפשר לבדוק כל מתודה של `Database` בנפרד, למשל עם `Database(':memory:')`.
- **קל להחליף:** אם יום אחד נעבור מ-SQLite למסד נתונים אחר, רק המחלקה הזו תצטרך להשתנות.

## טיפים

- תנו למתודות שמות לפי **מה שהן נותנות לכם**, ולא לפי ה-SQL: `get_top_students(n)` עדיף על `select_order_by_grade_limit(n)`.
- החזירו ערכי Python פשוטים (רשימות, tuples, מספרים), ולא cursors, כדי שמי שקורא למתודה לא יצטרך לדעת שום דבר על `sqlite3`.
- צרו אובייקט `Database` **אחד** כשהתוכנית מתחילה והעבירו אותו לחלקים שצריכים אותו (למשל לחלונות שלכם), במקום להתחבר שוב ושוב.
- כשחלק כלשהו בפרויקט צריך מידע חדש, **הוסיפו מתודה חדשה** ל-`Database`. אל תכתבו את השאילתה באותו חלק של הקוד "רק הפעם".
