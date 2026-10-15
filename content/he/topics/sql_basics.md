# יסודות SQL

## מה זה SQL?

רוב התוכנות האמיתיות צריכות **לשמור נתונים** ולמצוא אותם שוב אחר כך: משתמשים, ציונים, הזמנות, תוצאות. לשמור אותם ברשימות או בקובצי טקסט זה עובד לדברים קטנים, אבל זה נהיה איטי ומבולגן ככל שהנתונים גדלים. **מסד נתונים** (database) פותר את זה. הוא שומר את הנתונים מסודרים ב**טבלאות**, ומאפשר לנו לשאול עליהם שאלות במהירות.

**SQL** (ראשי תיבות של Structured Query Language, נהגה "אס-קיו-אל" או "סיקוול") היא השפה שבה אנחנו מדברים עם מסד נתונים. ב-SQL אנחנו אומרים למסד הנתונים *מה* אנחנו רוצים, והוא כבר מבין לבד *איך* להשיג את זה.

טבלה נראית כמו גיליון אלקטרוני:

| id | name   | grade | city      |
|----|--------|-------|-----------|
| 1  | Roni   | 91    | Haifa     |
| 2  | Yuval  | 56    | Tel Aviv  |
| 3  | Hila   | 92    | Haifa     |

- כל **שורה** (row) היא רשומה אחת (סטודנט אחד).
- כל **עמודה** (column) היא סוג אחד של מידע, עם טיפוס קבוע (מספר, טקסט…).
- **המפתח הראשי** (primary key, כאן `id`) הוא עמודה שהערך שלה ייחודי לכל שורה, כך שתמיד נוכל להצביע על שורה אחת בדיוק.

ארבע הפעולות הבסיסיות שאנחנו עושים עם נתונים נקראות **CRUD**:

| אות | משמעות | פקודת SQL |
|--------|---------|-------------|
| **C** | Create (יצירה) | `INSERT` |
| **R** | Read (קריאה)   | `SELECT` |
| **U** | Update (עדכון) | `UPDATE` |
| **D** | Delete (מחיקה) | `DELETE` |

> מילות המפתח של SQL לא רגישות לאותיות גדולות/קטנות (גם `select` עובד), אבל אנחנו כותבים אותן באותיות גדולות כדי שיבלטו לעומת שמות הטבלאות והעמודות.

## מה זה SQLite?

יש הרבה תוכנות של מסדי נתונים: MySQL, PostgreSQL, SQL Server, Oracle… רובן הן **שרתים** שצריך להתקין ולהריץ בנפרד. **SQLite** שונה: כל מסד הנתונים הוא **קובץ אחד** בדיסק שלכם (למשל `school.db`), ואין שום שרת להתקין.

ויותר מזה, SQLite מגיע **מובנה בתוך Python**. המודול נקרא `sqlite3`, ואין מה לעשות `pip install`.

SQLite הוא מקום מצוין ללמוד בו, והוא גם משמש באמת: הוא נמצא בתוך כל טלפון, כל דפדפן ובהרבה תוכנות שולחניות. ה-SQL שתלמדו כאן עובד כמעט אותו דבר גם במסדי הנתונים האחרים.

> טיפ: כדי להציץ לתוך קובץ `.db`, התקינו את התוכנה החינמית **DB Browser for SQLite** (<https://sqlitebrowser.org>) או את התוסף **SQLite Viewer** ל-VS Code.

## התחברות למסד נתונים

```python
import sqlite3

con = sqlite3.connect('school.db')   # opens the file, or creates it if it doesn't exist
cur = con.cursor()                   # the cursor runs our SQL commands
```

- `connect` נותן לנו **חיבור** (connection) לקובץ מסד הנתונים.
- **הסמן** (cursor) שולח SQL למסד הנתונים עם `cur.execute(...)` ומחזיר את התוצאות.
- כשאנחנו משנים נתונים, חייבים לקרוא ל-`con.commit()` כדי לשמור את השינויים בקובץ.
- בסוף קוראים ל-`con.close()`.

> טיפ: `sqlite3.connect(':memory:')` יוצר מסד נתונים זמני בזיכרון. הוא נעלם כשהתוכנית מסתיימת, וזה נוח מאוד לניסויים.

## יצירת טבלה

```python
cur.execute('''
    CREATE TABLE IF NOT EXISTS students (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        name  TEXT NOT NULL,
        grade INTEGER,
        city  TEXT
    )
''')
con.commit()
```

- `IF NOT EXISTS` מונע שגיאה אם מריצים את התוכנית בפעם השנייה.
- לכל עמודה יש שם וטיפוס. הטיפוסים הנפוצים ב-SQLite הם `INTEGER`, `REAL` (מספר עשרוני, float), `TEXT` ו-`BLOB` (בתים גולמיים).
- `PRIMARY KEY AUTOINCREMENT` אומר ש-SQLite נותן לבד לכל שורה חדשה את ה-`id` הבא.
- `NOT NULL` אומר שבעמודה הזו חייב תמיד להיות ערך.

כדי למחוק טבלה שלמה (עם כל הנתונים שבה!) משתמשים ב-`DROP TABLE students`.

## C: יצירה (INSERT)

```python
cur.execute('INSERT INTO students (name, grade, city) VALUES (?, ?, ?)',
            ('Roni', 91, 'Haifa'))
con.commit()
```

סימני ה-`?` הם **מצייני מקום** (placeholders). את הערכים האמיתיים מעבירים בנפרד, כ-tuple, ו-`sqlite3` מכניס אותם בצורה בטוחה.

> **לעולם** אל תבנו SQL עם f-strings או עם `+`, כמו `f"... VALUES ('{name}')"`. אם הטקסט מכיל `'` הפקודה נשברת, ומשתמש ערמומי יכול להקליד טקסט שמריץ SQL משלו (זה נקרא **SQL injection**). תמיד השתמשו במצייני מקום `?`.

כדי להוסיף הרבה שורות בבת אחת משתמשים ב-`executemany` עם רשימה של tuples:

```python
students = [
    ('Yuval',  56, 'Tel Aviv'),
    ('Hila',   92, 'Haifa'),
    ('Alex',   90, 'Jerusalem'),
    ('Guy',    43, 'Tel Aviv'),
    ('Daniel', 90, None),          # None in Python becomes NULL in SQL (no value)
    ('Dana',   77, 'Haifa'),
]
cur.executemany('INSERT INTO students (name, grade, city) VALUES (?, ?, ?)', students)
con.commit()
```

אחרי הכנסה, `cur.lastrowid` מכיל את ה-`id` שהשורה החדשה קיבלה.

## R: קריאה (SELECT)

`SELECT` מבקש שורות ממסד הנתונים. את התוצאה קוראים עם `fetchall` (רשימה של tuples), עם `fetchone` (tuple אחד, או `None`), או בלולאה על הסמן.

```python
cur.execute('SELECT * FROM students')     # * means "all columns"
rows = cur.fetchall()
for row in rows:
    print(row)
```

```text
(1, 'Roni', 91, 'Haifa')
(2, 'Yuval', 56, 'Tel Aviv')
(3, 'Hila', 92, 'Haifa')
(4, 'Alex', 90, 'Jerusalem')
(5, 'Guy', 43, 'Tel Aviv')
(6, 'Daniel', 90, None)
(7, 'Dana', 77, 'Haifa')
```

בחרו רק את העמודות שאתם צריכים, ופרקו אותן בתוך הלולאה:

```python
for name, grade in cur.execute('SELECT name, grade FROM students'):
    print(f'{name} got {grade}')
```

`SELECT` היא הפקודה החשובה ביותר (והעשירה ביותר), ולכן הסעיפים הבאים צוללים לעומק שלה.

## U: עדכון (UPDATE)

```python
cur.execute('UPDATE students SET grade = ? WHERE name = ?', (95, 'Guy'))
con.commit()
print(cur.rowcount, 'row(s) changed')
```

אפשר לשנות כמה עמודות בבת אחת, והערך החדש יכול להשתמש בערך הישן:

```python
cur.execute("UPDATE students SET grade = grade + 5, city = 'Haifa' WHERE id = ?", (2,))
con.commit()
```

> **תמיד** כתבו `WHERE` ב-`UPDATE`. בלעדיו, *כל* השורות בטבלה משתנות!

## D: מחיקה (DELETE)

```python
cur.execute('DELETE FROM students WHERE id = ?', (5,))
con.commit()
```

> אותה אזהרה: `DELETE FROM students` בלי `WHERE` מוחק את **כל** השורות.

שימו לב ל-`(5,)`: הערכים חייבים תמיד להיות tuple, גם כשיש רק אחד. `(5)` זה פשוט המספר 5.

## סינון עם WHERE

הדוגמאות מכאן והלאה משתמשות בשבעת הסטודנטים כפי שהוכנסו למעלה (לפני העדכון והמחיקה).

`WHERE` משאיר רק את השורות שמקיימות תנאי.

```python
cur.execute('SELECT name, grade FROM students WHERE grade >= ?', (90,))
print(cur.fetchall())
# [('Roni', 91), ('Hila', 92), ('Alex', 90), ('Daniel', 90)]
```

אופרטורי ההשוואה:

| אופרטור | משמעות |
|----------|---------|
| `=` | שווה (`=` אחד, לא `==`) |
| `!=` או `<>` | לא שווה |
| `<`, `>`, `<=`, `>=` | קטן / גדול |
| `AND`, `OR`, `NOT` | שילוב תנאים |
| `BETWEEN a AND b` | בטווח בין a ל-b (כולל שניהם) |
| `IN (a, b, c)` | שווה לאחד מהערכים |
| `LIKE 'pattern'` | התאמת טקסט: `%` = כל טקסט, `_` = תו אחד |
| `IS NULL` / `IS NOT NULL` | אין ערך / יש ערך |

כמה דוגמאות:

```sql
SELECT * FROM students WHERE city = 'Haifa' AND grade > 80;
SELECT * FROM students WHERE city = 'Haifa' OR city = 'Jerusalem';
SELECT * FROM students WHERE city IN ('Haifa', 'Jerusalem');   -- same as the line above
SELECT * FROM students WHERE grade BETWEEN 60 AND 80;
SELECT * FROM students WHERE name LIKE 'D%';                   -- names starting with D
SELECT * FROM students WHERE name LIKE '%a%';                  -- names containing an a
SELECT * FROM students WHERE city IS NULL;                     -- not "= NULL"!
```

> ב-SQL, ערכי טקסט נכתבים בתוך **גרשיים בודדים** (`'Haifa'`). `--` מתחיל הערה, כמו `#` ב-Python.

## מיון והגבלה

`ORDER BY` ממיין את התוצאה (`ASC` זה מהקטן לגדול, וזו ברירת המחדל; `DESC` זה מהגדול לקטן). `LIMIT` משאיר רק את השורות הראשונות.

```sql
SELECT name, grade FROM students ORDER BY grade DESC;            -- best first
SELECT name, grade FROM students ORDER BY city, name;            -- by city, then by name
SELECT name, grade FROM students ORDER BY grade DESC LIMIT 3;    -- the top 3
```

`DISTINCT` מסיר שורות כפולות:

```sql
SELECT DISTINCT city FROM students;
```

## חישובים ופונקציות צבירה

אפשר לחשב בתוך `SELECT` ולתת לתוצאה שם עם `AS`:

```sql
SELECT name, grade, grade * 1.1 AS boosted FROM students;
```

**פונקציות צבירה** (aggregate functions) הופכות הרבה שורות לערך אחד:

| פונקציה | תוצאה |
|----------|--------|
| `COUNT(*)` | כמה שורות יש |
| `SUM(col)` | הסכום |
| `AVG(col)` | הממוצע |
| `MIN(col)`, `MAX(col)` | הקטן ביותר / הגדול ביותר |

```python
cur.execute('SELECT COUNT(*), AVG(grade), MAX(grade) FROM students')
count, avg, best = cur.fetchone()
print(count, round(avg, 1), best)
```

## קיבוץ עם GROUP BY ו-HAVING

`GROUP BY` מחלק את השורות לקבוצות ומריץ את פונקציית הצבירה על כל קבוצה.

```sql
SELECT city, COUNT(*) AS kids, ROUND(AVG(grade), 1) AS avg_grade
FROM students
GROUP BY city;
```

```text
(None, 1, 90.0)
('Haifa', 3, 86.7)
('Jerusalem', 1, 90.0)
('Tel Aviv', 2, 49.5)
```

`WHERE` מסנן שורות **לפני** הקיבוץ. כדי לסנן את **הקבוצות** עצמן משתמשים ב-`HAVING`:

```sql
SELECT city, AVG(grade) AS avg_grade
FROM students
GROUP BY city
HAVING COUNT(*) >= 2;          -- only cities with at least 2 students
```

הסדר של החלקים ב-`SELECT` הוא תמיד:

```sql
SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...
```

## יותר מטבלה אחת: JOIN

תכנון טוב של מסד נתונים שומר כל סוג של דבר ב**טבלה משלו**, ומחבר בין הטבלאות בעזרת מזהים (ids). למשל, סטודנטים לוקחים קורסים:

```python
cur.executescript('''
    CREATE TABLE IF NOT EXISTS courses (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enrollments (
        student_id INTEGER REFERENCES students(id),
        course_id  INTEGER REFERENCES courses(id),
        score      INTEGER
    );

    INSERT INTO courses (title) VALUES ('Math'), ('Physics'), ('Art');

    INSERT INTO enrollments VALUES
        (1, 1, 95), (1, 2, 88),     -- Roni: Math, Physics
        (3, 1, 90),                 -- Hila: Math
        (4, 2, 72), (4, 1, 81);     -- Alex: Physics, Math
''')
con.commit()
```

(`executescript` מריץ כמה פקודות SQL שמופרדות ב-`;`. השתמשו בו רק להכנה ראשונית, כי הוא לא מקבל ערכי `?`.)

`student_id` ו-`course_id` הם **מפתחות זרים** (foreign keys): הם מכילים את ה-`id` של שורה בטבלה אחרת. במקום לכתוב "Roni" שוב ושוב, אנחנו שומרים `1` ומחפשים את השם כשצריך אותו. החיפוש הזה הוא **JOIN**:

```sql
SELECT students.name, courses.title, enrollments.score
FROM enrollments
JOIN students ON enrollments.student_id = students.id
JOIN courses  ON enrollments.course_id  = courses.id;
```

```text
('Roni', 'Math', 95)
('Roni', 'Physics', 88)
('Hila', 'Math', 90)
('Alex', 'Physics', 72)
('Alex', 'Math', 81)
```

`ON` אומר איך השורות של שתי הטבלאות מתאימות זו לזו. הכתיבה `table.column` מבהירה מאיזו טבלה מגיעה כל עמודה.

לשמות טבלאות ארוכים אפשר לתת **כינויים** (aliases) קצרים:

```sql
SELECT s.name, c.title, e.score
FROM enrollments AS e
JOIN students AS s ON e.student_id = s.id
JOIN courses  AS c ON e.course_id  = c.id
WHERE c.title = 'Math'
ORDER BY e.score DESC;
```

### INNER JOIN מול LEFT JOIN

- `JOIN` (שנקרא גם `INNER JOIN`) משאיר רק שורות שיש להן התאמה **בשתי** הטבלאות.
- `LEFT JOIN` משאיר **כל** שורה מהטבלה השמאלית (הראשונה). איפה שאין התאמה, העמודות של הטבלה הימנית הן `NULL`.

```sql
SELECT s.name, COUNT(e.course_id) AS courses
FROM students AS s
LEFT JOIN enrollments AS e ON e.student_id = s.id
GROUP BY s.id
ORDER BY courses DESC;
```

```text
('Roni', 2)
('Alex', 2)
('Hila', 1)
('Yuval', 0)
...
```

עם `JOIN` רגיל, הסטודנטים שלא לוקחים אף קורס היו נעלמים מהתוצאה. עם `LEFT JOIN` הם נשארים, עם 0 קורסים. אותו רעיון מוצא את הקורסים שאף אחד לא לוקח:

```sql
SELECT c.title
FROM courses AS c
LEFT JOIN enrollments AS e ON e.course_id = c.id
WHERE e.course_id IS NULL;         -- 'Art'
```

## שאילתות משנה

אפשר להשתמש ב-`SELECT` בתוך `SELECT` אחר, בתוך סוגריים:

```sql
-- students above the class average
SELECT name, grade
FROM students
WHERE grade > (SELECT AVG(grade) FROM students);

-- students who take Math
SELECT name FROM students
WHERE id IN (SELECT student_id FROM enrollments WHERE course_id = 1);
```

## לחבר הכול ביחד

הרגל טוב הוא להשתמש בחיבור עם `with`. הוא עושה commit לבד אם הכול עבד, ו**מגלגל אחורה** (rollback, מבטל את השינויים) אם הייתה שגיאה. הגדרה של `row_factory` מאפשרת לנו לקרוא עמודות לפי שם במקום לפי מיקום.

```python
import sqlite3


def add_student(con, name, grade, city):
    with con:                       # commit on success, rollback on error
        con.execute('INSERT INTO students (name, grade, city) VALUES (?, ?, ?)',
                    (name, grade, city))


def top_students(con, min_grade):
    cur = con.execute('SELECT name, grade FROM students WHERE grade >= ? ORDER BY grade DESC',
                      (min_grade,))
    return cur.fetchall()


con = sqlite3.connect('school.db')
con.row_factory = sqlite3.Row      # rows behave like dicts too

add_student(con, 'Noa', 88, 'Eilat')

for row in top_students(con, 85):
    print(row['name'], row['grade'])

con.close()
```

(`con.execute(...)` הוא קיצור דרך שיוצר בשבילנו סמן ומריץ את הפקודה.)

## סיכום

| אני רוצה… | SQL |
|------------|-----|
| ליצור טבלה | `CREATE TABLE t (col TYPE, ...)` |
| להוסיף שורה | `INSERT INTO t (a, b) VALUES (?, ?)` |
| לקרוא שורות | `SELECT a, b FROM t WHERE ... ORDER BY ... LIMIT n` |
| לשנות שורות | `UPDATE t SET a = ? WHERE ...` |
| למחוק שורות | `DELETE FROM t WHERE ...` |
| לספור / לחשב ממוצע | `SELECT COUNT(*), AVG(a) FROM t` |
| לכל קבוצה | `... GROUP BY col HAVING ...` |
| לשלב טבלאות | `... FROM t1 JOIN t2 ON t1.x = t2.y` |

וב-Python: `connect` ← `cursor` / `execute` עם מצייני מקום `?` ← `fetchall` / `fetchone` ← `commit` ← `close`.
