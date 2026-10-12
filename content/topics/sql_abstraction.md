# SQL Abstraction

## The problem: SQL all over the code

Once we know SQL, it is tempting to write a query wherever we need some data: one in the main window, another in the report code, a third in a button handler. It works, but it quickly becomes a mess:

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

- **Hard to change:** if we rename a column or a table, we have to hunt for every query in the whole project.
- **Repeated code:** the same query gets copied to several places, and the copies slowly drift apart.
- **Hard to read:** the GUI or game code is full of SQL strings that have nothing to do with what that code is about.
- **Easy to break:** every part of the project has to know the table structure, remember to `commit`, use `?` placeholders correctly, and so on.

**We don't want to see SQL queries all over the code.**

## The solution: one class that holds all the SQL

We create **one class**, called for example `Database`, that is the only part of the project that talks to the database:

- In `__init__` it **connects** to the database (and creates the tables if they don't exist yet).
- It has **methods with clear, meaningful names**, like `add_student`, `get_students_in_city` or `get_average_grade`.
- Each method contains the SQL it needs and returns ordinary Python values (numbers, strings, lists, tuples).

The rest of the project just calls these methods. It never writes SQL, and doesn't even need to know that SQL is involved.

> **The rule:** all the SQL code lives in the `Database` class, and **only** in it. No other file imports `sqlite3` or contains a query.

## Example

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

`main.py` (or any other part of the project):

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

Notice that `main.py` has **no SQL at all**. It reads almost like plain English: "add a student", "get the students in Haifa", "get the average grade".

## Why this is better

- **One place to change:** if the table structure changes, we fix the `Database` class and nothing else.
- **Readable code:** the rest of the project describes *what* it needs (`db.get_average_grade()`), not *how* to get it.
- **No repetition:** each query is written once and reused everywhere.
- **Easy to test:** we can test each `Database` method on its own, for example with `Database(':memory:')`.
- **Easy to replace:** if one day we move from SQLite to another database, only this class has to change.

## Tips

- Name methods after **what they give you**, not after the SQL: `get_top_students(n)` is better than `select_order_by_grade_limit(n)`.
- Return simple Python values (lists, tuples, numbers), not cursors, so the caller doesn't need to know anything about `sqlite3`.
- Create **one** `Database` object when the program starts and pass it to the parts that need it (for example to your windows), instead of connecting again and again.
- When some part of the project needs new information, **add a new method** to `Database`. Don't write the query in that part of the code "just this once".
