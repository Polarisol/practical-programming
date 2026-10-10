# SQL Basics

## What is SQL?

Most real programs need to **store data** and find it again later: users, grades, orders, scores. Keeping it in lists or in text files works for small things, but it gets slow and messy as the data grows. A **database** solves this. It keeps the data organised in **tables**, and lets us ask questions about it quickly.

**SQL** (Structured Query Language, said "S-Q-L" or "sequel") is the language we use to talk to a database. With SQL we tell the database *what* we want, and it works out *how* to get it.

A table looks like a spreadsheet:

| id | name   | grade | city      |
|----|--------|-------|-----------|
| 1  | Roni   | 91    | Haifa     |
| 2  | Yuval  | 56    | Tel Aviv  |
| 3  | Hila   | 92    | Haifa     |

- Every **row** is one record (one student).
- Every **column** is one kind of information, with a fixed type (number, text…).
- The **primary key** (`id` here) is a column whose value is unique for every row, so we can always point to exactly one row.

The four basic things we do with data are called **CRUD**:

| Letter | Meaning | SQL command |
|--------|---------|-------------|
| **C** | Create | `INSERT` |
| **R** | Read   | `SELECT` |
| **U** | Update | `UPDATE` |
| **D** | Delete | `DELETE` |

> SQL keywords are not case-sensitive (`select` works too), but we write them in CAPITALS so they stand out from table and column names.

## What is SQLite?

There are many database programs: MySQL, PostgreSQL, SQL Server, Oracle… Most of them are **servers** that you install and run separately. **SQLite** is different: the whole database is **a single file** on your disk (e.g. `school.db`), and there is no server to install.

Even better, SQLite comes **built into Python**. The module is called `sqlite3`, and there is nothing to `pip install`.

SQLite is a great place to learn, and it is also used for real: it is inside every phone, every web browser and many desktop programs. The SQL you learn here works almost the same in the other databases.

> Tip: to look inside a `.db` file, install the free **DB Browser for SQLite** (<https://sqlitebrowser.org>) or the **SQLite Viewer** extension for VS Code.

## Connecting to a database

```python
import sqlite3

con = sqlite3.connect('school.db')   # opens the file, or creates it if it doesn't exist
cur = con.cursor()                   # the cursor runs our SQL commands
```

- `connect` gives us a **connection** to the database file.
- The **cursor** sends SQL to the database with `cur.execute(...)` and brings back the results.
- When we change data, we must call `con.commit()` to save the changes to the file.
- At the end we call `con.close()`.

> Tip: `sqlite3.connect(':memory:')` makes a temporary database in memory. It disappears when the program ends, which is handy for experiments.

## Creating a table

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

- `IF NOT EXISTS` stops an error if we run the program a second time.
- Each column has a name and a type. The common SQLite types are `INTEGER`, `REAL` (a float), `TEXT` and `BLOB` (raw bytes).
- `PRIMARY KEY AUTOINCREMENT` means SQLite gives each new row the next `id` by itself.
- `NOT NULL` means this column must always have a value.

To remove a whole table (with all its data!) use `DROP TABLE students`.

## C: Create (INSERT)

```python
cur.execute('INSERT INTO students (name, grade, city) VALUES (?, ?, ?)',
            ('Roni', 91, 'Haifa'))
con.commit()
```

The `?` marks are **placeholders**. We pass the real values separately, as a tuple, and `sqlite3` puts them in safely.

> **Never** build SQL with f-strings or `+`, like `f"... VALUES ('{name}')"`. If the text contains a `'` the command breaks, and a sneaky user can type text that runs their own SQL (this is called **SQL injection**). Always use `?` placeholders.

To add many rows at once use `executemany` with a list of tuples:

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

After an insert, `cur.lastrowid` holds the `id` that the new row got.

## R: Read (SELECT)

`SELECT` asks the database for rows. The result is read with `fetchall` (a list of tuples), `fetchone` (one tuple, or `None`), or by looping on the cursor.

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

Pick only the columns you need, and unpack them in the loop:

```python
for name, grade in cur.execute('SELECT name, grade FROM students'):
    print(f'{name} got {grade}')
```

`SELECT` is the most important (and the richest) command, so the next sections go deeper into it.

## U: Update (UPDATE)

```python
cur.execute('UPDATE students SET grade = ? WHERE name = ?', (95, 'Guy'))
con.commit()
print(cur.rowcount, 'row(s) changed')
```

Several columns can change at once, and the new value can use the old one:

```python
cur.execute("UPDATE students SET grade = grade + 5, city = 'Haifa' WHERE id = ?", (2,))
con.commit()
```

> **Always** write a `WHERE` in `UPDATE`. Without it, *every* row in the table is changed!

## D: Delete (DELETE)

```python
cur.execute('DELETE FROM students WHERE id = ?', (5,))
con.commit()
```

> The same warning: `DELETE FROM students` with no `WHERE` deletes **all** the rows.

Notice the `(5,)`: the values must always be a tuple, even when there is only one. `(5)` is just the number 5.

## Filtering with WHERE

The examples from here on use the seven students as they were inserted above (before the update and delete).

`WHERE` keeps only the rows that match a condition.

```python
cur.execute('SELECT name, grade FROM students WHERE grade >= ?', (90,))
print(cur.fetchall())
# [('Roni', 91), ('Hila', 92), ('Alex', 90), ('Daniel', 90)]
```

The comparison operators:

| Operator | Meaning |
|----------|---------|
| `=` | equal (one `=`, not `==`) |
| `!=` or `<>` | not equal |
| `<`, `>`, `<=`, `>=` | smaller / bigger |
| `AND`, `OR`, `NOT` | combine conditions |
| `BETWEEN a AND b` | in the range a to b (including both) |
| `IN (a, b, c)` | equal to one of the values |
| `LIKE 'pattern'` | text matching: `%` = any text, `_` = one character |
| `IS NULL` / `IS NOT NULL` | has no value / has a value |

Some examples:

```sql
SELECT * FROM students WHERE city = 'Haifa' AND grade > 80;
SELECT * FROM students WHERE city = 'Haifa' OR city = 'Jerusalem';
SELECT * FROM students WHERE city IN ('Haifa', 'Jerusalem');   -- same as the line above
SELECT * FROM students WHERE grade BETWEEN 60 AND 80;
SELECT * FROM students WHERE name LIKE 'D%';                   -- names starting with D
SELECT * FROM students WHERE name LIKE '%a%';                  -- names containing an a
SELECT * FROM students WHERE city IS NULL;                     -- not "= NULL"!
```

> In SQL, text values go in **single quotes** (`'Haifa'`). `--` starts a comment, like `#` in Python.

## Sorting and limiting

`ORDER BY` sorts the result (`ASC` is small to big and is the default; `DESC` is big to small). `LIMIT` keeps only the first rows.

```sql
SELECT name, grade FROM students ORDER BY grade DESC;            -- best first
SELECT name, grade FROM students ORDER BY city, name;            -- by city, then by name
SELECT name, grade FROM students ORDER BY grade DESC LIMIT 3;    -- the top 3
```

`DISTINCT` removes repeated rows:

```sql
SELECT DISTINCT city FROM students;
```

## Calculations and aggregate functions

You can calculate inside a `SELECT` and give the result a name with `AS`:

```sql
SELECT name, grade, grade * 1.1 AS boosted FROM students;
```

**Aggregate functions** turn many rows into one value:

| Function | Result |
|----------|--------|
| `COUNT(*)` | how many rows |
| `SUM(col)` | the total |
| `AVG(col)` | the average |
| `MIN(col)`, `MAX(col)` | the smallest / biggest |

```python
cur.execute('SELECT COUNT(*), AVG(grade), MAX(grade) FROM students')
count, avg, best = cur.fetchone()
print(count, round(avg, 1), best)
```

## Grouping with GROUP BY and HAVING

`GROUP BY` splits the rows into groups and runs the aggregate function on each group.

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

`WHERE` filters rows **before** grouping. To filter the **groups** themselves use `HAVING`:

```sql
SELECT city, AVG(grade) AS avg_grade
FROM students
GROUP BY city
HAVING COUNT(*) >= 2;          -- only cities with at least 2 students
```

The order of the parts in a `SELECT` is always:

```sql
SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...
```

## More than one table: JOIN

Good database design keeps each kind of thing in its **own table**, and connects the tables with ids. For example, students take courses:

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

(`executescript` runs several SQL commands separated by `;`. Use it for setup only, as it doesn't take `?` values.)

`student_id` and `course_id` are **foreign keys**: they hold the `id` of a row in another table. Instead of writing "Roni" again and again, we store `1` and look the name up when we need it. That look-up is a **JOIN**:

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

`ON` says how the rows of the two tables match. Writing `table.column` makes it clear which table each column comes from.

Long table names can get short **aliases**:

```sql
SELECT s.name, c.title, e.score
FROM enrollments AS e
JOIN students AS s ON e.student_id = s.id
JOIN courses  AS c ON e.course_id  = c.id
WHERE c.title = 'Math'
ORDER BY e.score DESC;
```

### INNER JOIN vs LEFT JOIN

- `JOIN` (also called `INNER JOIN`) keeps only rows that have a match in **both** tables.
- `LEFT JOIN` keeps **every** row from the left (first) table. Where there is no match, the columns of the right table are `NULL`.

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

With a plain `JOIN`, the students who take no course would disappear from the result. With `LEFT JOIN` they stay, with 0 courses. The same idea finds the courses nobody takes:

```sql
SELECT c.title
FROM courses AS c
LEFT JOIN enrollments AS e ON e.course_id = c.id
WHERE e.course_id IS NULL;         -- 'Art'
```

## Subqueries

A `SELECT` can be used inside another one, in brackets:

```sql
-- students above the class average
SELECT name, grade
FROM students
WHERE grade > (SELECT AVG(grade) FROM students);

-- students who take Math
SELECT name FROM students
WHERE id IN (SELECT student_id FROM enrollments WHERE course_id = 1);
```

## Putting it together

A good habit is to use the connection with `with`. It commits by itself if everything worked, and **rolls back** (cancels the changes) if there was an error. Setting `row_factory` lets us read columns by name instead of by position.

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

(`con.execute(...)` is a shortcut that makes a cursor for us and runs the command.)

## Summary

| I want to… | SQL |
|------------|-----|
| make a table | `CREATE TABLE t (col TYPE, ...)` |
| add a row | `INSERT INTO t (a, b) VALUES (?, ?)` |
| read rows | `SELECT a, b FROM t WHERE ... ORDER BY ... LIMIT n` |
| change rows | `UPDATE t SET a = ? WHERE ...` |
| remove rows | `DELETE FROM t WHERE ...` |
| count / average | `SELECT COUNT(*), AVG(a) FROM t` |
| per group | `... GROUP BY col HAVING ...` |
| combine tables | `... FROM t1 JOIN t2 ON t1.x = t2.y` |

And in Python: `connect` → `cursor` / `execute` with `?` placeholders → `fetchall` / `fetchone` → `commit` → `close`.
