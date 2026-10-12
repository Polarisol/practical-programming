# SQL Injection

## The problem

Say we let the user type a name, and we look it up in the database. A natural first try is to glue the user's text into the SQL string:

```python
name = input('Name: ')
cur.execute(f"SELECT * FROM students WHERE name = '{name}'")   # DANGEROUS!
```

If the user types `Roni`, the database gets:

```sql
SELECT * FROM students WHERE name = 'Roni'
```

All good. But what if the user types this instead?

```
x' OR '1'='1
```

Now the text glued into the query becomes:

```sql
SELECT * FROM students WHERE name = 'x' OR '1'='1'
```

`'1'='1'` is always true, so the query returns **every student** in the table. The user didn't just give us a name. They **changed our SQL command**.

This is called **SQL injection**: the user "injects" their own SQL into our query. A malicious user can use it to see data they shouldn't, log in without a password, or even delete whole tables. It is one of the most common security holes in real programs.

> The root of the problem: the database can't tell which part of the string is **our command** and which part is **the user's data**. It's all just one string.

## The solution: `?` placeholders

Instead of gluing the value into the string, we put a `?` where the value should go, and pass the values separately as a tuple:

```python
name = input('Name: ')
cur.execute('SELECT * FROM students WHERE name = ?', (name,))   # safe
```

Now the command and the data reach the database **separately**. The database treats whatever is in `name` as **plain data**, never as SQL. If the user types `x' OR '1'='1`, the database simply looks for a student whose name is literally `x' OR '1'='1`, finds none, and nothing bad happens.

With more than one value, use one `?` for each, in order:

```python
cur.execute('INSERT INTO students (name, grade, city) VALUES (?, ?, ?)',
            (name, grade, city))
```

> Note the comma in `(name,)`: a tuple with one item needs it. `(name)` without the comma is just `name`.

## The rule

**Never build SQL with f-strings, `+` or `.format()` from values that come from outside** (the user, a file, the internet). Always use `?` and pass the values separately.

| ❌ Unsafe | ✅ Safe |
|----------|--------|
| `f"... WHERE name = '{name}'"` | `'... WHERE name = ?', (name,)` |
| `"... WHERE id = " + str(id)` | `'... WHERE id = ?', (id,)` |

A bonus: with `?` we never have to worry about quotes either. A name like `O'Brien` would break the f-string version, but works perfectly with `?`.
