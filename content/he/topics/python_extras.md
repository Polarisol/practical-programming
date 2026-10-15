# תוספות

כמה טכניקות שימושיות שהופכות קוד Python לקצר ובטוח יותר.

## List Comprehension

List comprehension בונה רשימה חדשה בשורה אחת, במקום לכתוב לולאת `for` עם `append`.

#### בסיסי: העתקת האיברים לרשימה חדשה

הדרך הרגילה, עם לולאה:

```python
numbers = [1, 2, 3, 4, 5]

result = []
for x in numbers:
    result.append(x)
```

אותו הדבר בתור list comprehension:

```python
numbers = [1, 2, 3, 4, 5]
result = [x for x in numbers]   # [1, 2, 3, 4, 5]
```

זה עובד גם עם `range`:

```python
nums = [i for i in range(5)]   # [0, 1, 2, 3, 4]
```

#### עם שינוי: משנים כל איבר בדרך פנימה

הביטוי שלפני ה-`for` קובע מה נכנס לרשימה החדשה:

```python
numbers = [1, 2, 3, 4, 5]

squares = [x ** 2 for x in numbers]    # [1, 4, 9, 16, 25]
doubled = [x * 2 for x in numbers]     # [2, 4, 6, 8, 10]

names = ['dana', 'avi', 'noa']
upper = [name.upper() for name in names]   # ['DANA', 'AVI', 'NOA']
lengths = [len(name) for name in names]    # [4, 3, 3]
```

#### עם תנאי לסינון: `if` בסוף

`if` **אחרי** ה-`for` קובע **אילו** איברים נכנסים לרשימה. איברים שלא עומדים בתנאי מדולגים:

```python
numbers = [1, 2, 3, 4, 5, 6, 7, 8]

evens = [x for x in numbers if x % 2 == 0]          # [2, 4, 6, 8]
big_squares = [x ** 2 for x in numbers if x > 5]    # [36, 49, 64]
```

אותו סינון, כתוב כלולאה:

```python
evens = []
for x in numbers:
    if x % 2 == 0:
        evens.append(x)
```

#### עם תנאי על הערך: `if ... else` בהתחלה

`if ... else` **לפני** ה-`for` קובע **איזה ערך** נכנס לרשימה. כל איבר נכנס, אבל הערך שלו תלוי בתנאי. כאן ה-`else` הוא חובה:

```python
numbers = [1, 2, 3, 4, 5, 6]

labels = ['even' if x % 2 == 0 else 'odd' for x in numbers]
# ['odd', 'even', 'odd', 'even', 'odd', 'even']

grades = [55, 90, 72, 40]
passed = [g if g >= 56 else 0 for g in grades]   # [0, 90, 72, 0]
```

#### שניהם יחד

אפשר לשלב את שני סוגי התנאים: ה-`if` שבסוף מסנן, וה-`if ... else` שבהתחלה בוחר את הערך:

```python
numbers = [-3, -2, -1, 0, 1, 2, 3, 4]

# keep only non-zero numbers, then replace negatives with 0 and square the positives
result = [x ** 2 if x > 0 else 0 for x in numbers if x != 0]
# [0, 0, 0, 1, 4, 9, 16]
```

| איפה ה-`if`? | מה הוא עושה? | `else` |
|---|---|---|
| אחרי ה-`for` | מסנן: אילו איברים נכנסים | אסור |
| לפני ה-`for` | בוחר את הערך שנכנס | חובה |

## פונקציות Lambda

`lambda` היא פונקציה קטנה בלי שם, שנכתבת בשורה אחת. היא יכולה לקבל כל מספר של פרמטרים, אבל יש בה ביטוי אחד בלבד, והביטוי הזה מוחזר אוטומטית (בלי `return`).

```python
def square(x):
    return x ** 2

# the same function as a lambda:
square = lambda x: x ** 2

print(square(5))   # 25

add = lambda a, b: a + b
print(add(3, 4))   # 7
```

Lambda שימושיות במיוחד כשפונקציה צריכה לקבל פונקציה אחרת כפרמטר, למשל `sorted`, `max`, `min`, `map` ו-`filter`:

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

> `map` ו-`filter` עושות את אותה העבודה כמו list comprehension. השתמשו במה שנקרא לכם ברור יותר.

## try / except

כשקורית שגיאה (*חריגה*, exception), התוכנית בדרך כלל עוצרת. בלוק `try` מאפשר לנו לתפוס את השגיאה ולהחליט מה לעשות במקום.

#### בסיסי

```python
try:
    number = int(input('Enter a number: '))
    print(10 / number)
except:
    print('Something went wrong')
```

אם שורה כלשהי בתוך ה-`try` נכשלת, Python קופצת ישר ל-`except`, והתוכנית ממשיכה לרוץ.

#### תפיסת שגיאה ספציפית

עדיף לתפוס רק את השגיאות שאנחנו מצפים להן, ולטפל בכל אחת בצורה אחרת:

```python
try:
    number = int(input('Enter a number: '))
    print(10 / number)
except ValueError:
    print('That was not a number')
except ZeroDivisionError:
    print('Cannot divide by zero')
```

#### קבלת הודעת השגיאה: `except ... as e`

`as e` שומר את החריגה במשתנה, כך שנוכל להדפיס את ההודעה של Python עצמה על מה שהשתבש:

```python
try:
    number = int('abc')
except ValueError as e:
    print('Error:', e)
# Error: invalid literal for int() with base 10: 'abc'
```

`Exception` תופס (כמעט) כל שגיאה, ו-`type(e).__name__` אומר לנו איזו שגיאה זו הייתה:

```python
try:
    with open('missing.txt', 'r') as f:
        content = f.read()
except Exception as e:
    print(type(e).__name__, '-', e)
# FileNotFoundError - [Errno 2] No such file or directory: 'missing.txt'
```

#### `else` ו-`finally`

- `else` רץ רק אם **לא** קרתה שגיאה.
- `finally` רץ **תמיד**, עם או בלי שגיאה.

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

#### דוגמה: להמשיך לשאול עד שהקלט תקין

```python
while True:
    try:
        age = int(input('Enter your age: '))
        break   # reached only if int() succeeded
    except ValueError:
        print('Please enter a whole number')

print('Your age is', age)
```
