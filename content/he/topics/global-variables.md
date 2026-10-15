# משתנים גלובליים

זה בסדר גמור לקרוא את הערך של משתנה גלובלי מתוך פונקציה:

```python
a = 5

def foo():
    return a + 10

foo() # the result will be 15
```

אבל נוצרת בעיה אם ננסה לשנות משתנה גלובלי מתוך פונקציה (במקום לשנות את המשתנה הגלובלי, נוצר משתנה מקומי חדש):

```python
a = 5

def bar():
    a = 20

bar()
print(a) # will print 5
```

הפתרון הוא להצהיר על המשתנה כ-`global` לפני שמשתמשים בו:

```python
a = 5

def bar():
    global a
    a = 20

bar()
print(a) # will print 20
```