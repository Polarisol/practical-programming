# * What we need to remember

1. A **database** stores data in **tables**. Every **row** is one record and every **column** is one kind of information with a fixed type. The **primary key** (usually `id`) is unique for every row, so we can always point to exactly one row.

2. **SQL** is the language we use to talk to a database. We tell it *what* we want, and it works out *how* to get it.

3. **SQLite** keeps the whole database in **a single file** and comes built into Python as the `sqlite3` module, so there is nothing to install.

4. The basic steps in Python: `sqlite3.connect()` → `cursor()` → `execute()` → `fetchall()` / `fetchone()` → `commit()` (after changing data) → `close()`. see **Connecting to a database** in the **SQL Basics** section.

5. The four basic operations are **CRUD**: Create = `INSERT`, Read = `SELECT`, Update = `UPDATE`, Delete = `DELETE`. see **SQL Basics**.

6. **Always** write a `WHERE` in `UPDATE` and `DELETE`. Without it, *every* row in the table is changed or deleted!

7. `SELECT` is the richest command. Remember the order of its parts: `SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT ...`. `WHERE` filters rows **before** grouping, and `HAVING` filters the **groups**. see **Grouping with GROUP BY and HAVING** in the **SQL Basics** section.

8. **Aggregate functions** (`COUNT`, `SUM`, `AVG`, `MIN`, `MAX`) turn many rows into one value.

9. Each kind of thing gets its **own table**, and tables are connected with ids (**foreign keys**). A **JOIN** brings the matching rows of the tables together. You do not need to remember every kind of JOIN by heart; just know what a JOIN does and look up the details when needed. see **More than one table: JOIN** in the **SQL Basics** section.

10. **SQL injection**: if we glue user input into a query with f-strings or `+`, a user can type text that changes our SQL command. **Never** build SQL from outside values this way. Always use `?` placeholders and pass the values separately as a tuple: `cur.execute('... WHERE name = ?', (name,))`. see the **SQL Injection** section.

11. A tuple with one value needs a comma: `(name,)`. `(name)` is just `name`.

12. **SQL abstraction**: we don't scatter SQL queries all over the code. We create one class (e.g. `Database`) that connects to the database in `__init__` and has methods with clear names, like `get_average_grade()`. **All the SQL lives in this class, and only in it.** The rest of the project just calls its methods. see the **SQL Abstraction** section.
