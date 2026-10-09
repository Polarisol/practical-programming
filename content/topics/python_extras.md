# Extras

A few handy techniques that make Python code shorter and safer.

## List Comprehension

A list comprehension builds a new list in a single line, instead of writing a `for` loop with `append`.

#### Basic: copy the items into a new list

The regular way, with a loop:

```python
numbers = [1, 2, 3, 4, 5]

result = []
for x in numbers:
    result.append(x)
```

The same thing as a list comprehension:

```python
numbers = [1, 2, 3, 4, 5]
result = [x for x in numbers]   # [1, 2, 3, 4, 5]
```

It also works with `range`:

```python
nums = [i for i in range(5)]   # [0, 1, 2, 3, 4]
```

#### With modification: change each item on the way in

The expression before `for` decides what goes into the new list:

```python
numbers = [1, 2, 3, 4, 5]

squares = [x ** 2 for x in numbers]    # [1, 4, 9, 16, 25]
doubled = [x * 2 for x in numbers]     # [2, 4, 6, 8, 10]

names = ['dana', 'avi', 'noa']
upper = [name.upper() for name in names]   # ['DANA', 'AVI', 'NOA']
lengths = [len(name) for name in names]    # [4, 3, 3]
```

#### With a condition for filtering: `if` at the end

An `if` **after** the `for` decides **which** items enter the list. Items that fail the condition are skipped:

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8]

evens = [x for x in numbers if x % 2 == 0]          # [2, 4, 6, 8]
big_squares = [x ** 2 for x in numbers if x > 5]    # [36, 49, 64]
```

The same filter written as a loop:

```python
evens = []
for x in numbers:
    if x % 2 == 0:
        evens.append(x)
```

#### With a condition on the value: `if ... else` at the start

An `if ... else` **before** the `for` decides **what value** enters the list. Every item enters, but its value depends on the condition. Here the `else` is required:

```python
numbers = [1, 2, 3, 4, 5, 6]

labels = ['even' if x % 2 == 0 else 'odd' for x in numbers]
# ['odd', 'even', 'odd', 'even', 'odd', 'even']

grades = [55, 90, 72, 40]
passed = [g if g >= 56 else 0 for g in grades]   # [0, 90, 72, 0]
```

#### Both together

The two kinds of conditions can be combined: the end `if` filters, the start `if ... else` chooses the value:

```python
numbers = [-3, -2, -1, 0, 1, 2, 3, 4]

# keep only non-zero numbers, then replace negatives with 0 and square the positives
result = [x ** 2 if x > 0 else 0 for x in numbers if x != 0]
# [0, 0, 0, 1, 4, 9, 16]
```

| Where is the `if`? | What does it do? | `else` |
|---|---|---|
| After the `for` | Filters: which items enter | Not allowed |
| Before the `for` | Chooses the value that enters | Required |

## Lambda Functions

A `lambda` is a small function without a name, written in one line. It can take any number of parameters, but has only one expression, and that expression is returned automatically (no `return`).

```python
def square(x):
    return x ** 2

# the same function as a lambda:
square = lambda x: x ** 2

print(square(5))   # 25

add = lambda a, b: a + b
print(add(3, 4))   # 7
```

Lambdas are most useful when a function needs another function as a parameter, for example `sorted`, `max`, `min`, `map` and `filter`:

```python
students = [('Dana', 88), ('Avi', 95), ('Noa', 72)]

# sort by the grade (the item at index 1) instead of by the name
by_grade = sorted(students, key=lambda s: s[1])
# [('Noa', 72), ('Dana', 88), ('Avi', 95)]

best = max(students, key=lambda s: s[1])    # ('Avi', 95)

words = ['banana', 'kiwi', 'apple']
by_length = sorted(words, key=lambda w: len(w))   # ['kiwi', 'apple', 'banana']
```

```python
numbers = [1, 2, 3, 4, 5]

squares = list(map(lambda x: x ** 2, numbers))         # [1, 4, 9, 16, 25]
evens = list(filter(lambda x: x % 2 == 0, numbers))    # [2, 4]
```

> `map` and `filter` do the same job as list comprehensions. Use whichever reads more clearly to you.

## try / except

When an error (an *exception*) happens, the program normally stops. A `try` block lets us catch the error and decide what to do instead.

#### Basic

```python
try:
    number = int(input('Enter a number: '))
    print(10 / number)
except:
    print('Something went wrong')
```

If any line inside `try` fails, Python jumps straight to `except`, and the program keeps running.

#### Catching a specific error

It's better to catch only the errors we expect, and handle each one differently:

```python
try:
    number = int(input('Enter a number: '))
    print(10 / number)
except ValueError:
    print('That was not a number')
except ZeroDivisionError:
    print('Cannot divide by zero')
```

#### Getting the error message: `except ... as e`

`as e` saves the exception in a variable, so we can print Python's own message about what went wrong:

```python
try:
    number = int('abc')
except ValueError as e:
    print('Error:', e)
# Error: invalid literal for int() with base 10: 'abc'
```

`Exception` catches (almost) any error, and `type(e).__name__` tells us which one it was:

```python
try:
    with open('missing.txt', 'r') as f:
        content = f.read()
except Exception as e:
    print(type(e).__name__, '-', e)
# FileNotFoundError - [Errno 2] No such file or directory: 'missing.txt'
```

#### `else` and `finally`

- `else` runs only if **no** error happened.
- `finally` runs **always**, with or without an error.

```python
try:
    number = int(input('Enter a number: '))
except ValueError as e:
    print('Error:', e)
else:
    print('You entered', number)
finally:
    print('Done')
```

#### Example: keep asking until the input is valid

```python
while True:
    try:
        age = int(input('Enter your age: '))
        break   # reached only if int() succeeded
    except ValueError:
        print('Please enter a whole number')

print('Your age is', age)
```
