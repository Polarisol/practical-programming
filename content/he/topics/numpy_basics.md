# יסודות NumPy

## למה להשתמש ב-NumPy?

רשימות רגילות בפייתון הן גמישות, אבל איטיות כשעובדים עם הרבה מספרים. NumPy נותנת לנו את ה-**מערך** (array), דרך מהירה וחסכונית בזיכרון לאחסן מספרים ולעבוד איתם, ומאפשרת לנו לבצע חישובים על מערכים שלמים בבת אחת במקום לכתוב לולאות. היא כתובה ב-C, ובגלל זה היא כל כך מהירה.

## ייבוא

```python
import numpy as np
```

## יצירת מערכים

1. מרשימה, בעזרת `array`

```python
a = np.array([1, 2, 3, 4])
print(a)  # [1 2 3 4]
```

2. ערכים במרווחים שווים בעזרת `linspace` (אתם בוחרים כמה ערכים יהיו)

```python
# 5 evenly spaced numbers between 0 and 10 (including both ends)
a = np.linspace(0, 10, 5)
print(a)  # [ 0.   2.5  5.   7.5 10. ]
```

3. ערכים במרווחים שווים בעזרת `arange` (אתם בוחרים את גודל הצעד)

```python
# numbers from 0 up to (not including) 10, step of 2
a = np.arange(0, 10, 2)
print(a)  # [0 2 4 6 8]
```

4. מערכים מלאים באפסים, באחדות או בכל ערך אחר

```python
zeros = np.zeros(4)
print(zeros)  # [0. 0. 0. 0.]

ones = np.ones(4)
print(ones)  # [1. 1. 1. 1.]

fives = np.full(4, 5)
print(fives)  # [5 5 5 5]
```

## עבודה עם מערכים שלמים בבת אחת

הכוח האמיתי של NumPy הוא שאפשר להשתמש באופרטורים הרגילים (`+`, `-`, `*`, `/`, `**`) ישירות על מערכים, והם מופעלים על כל איבר, ומהר.

```python
a = np.array([1, 2, 3, 4])

print(a + 10)   # [11 12 13 14]
print(a * 2)    # [2 4 6 8]
print(a ** 2)   # [1 4 9 16]
print(2 ** a)   # [2 4 8 16]
```

אפשר גם לשלב שני מערכים באותו גודל:

```python
a = np.array([1, 2, 3])
b = np.array([10, 20, 30])

print(a + b)  # [11 22 33]
print(a * b)  # [10 40 90]
```

זה הרבה יותר קצר, והרבה יותר מהיר, מאשר לכתוב לולאה שעושה את אותו הדבר.

## שימוש במתודות של NumPy

למערכי NumPy יש מתודות שימושיות למציאת מידע על הערכים שלהם:

```python
scores = np.array([70, 85, 90, 65])

print(scores.sum())   # 310: the total
print(scores.mean())  # 77.5: the average
print(scores.min())   # 65: the smallest value
print(scores.max())   # 90: the largest value
```

המתודות האלה מחשבות תוצאות עבור המערך כולו בלי צורך בלולאה.

## פונקציות מתמטיות

NumPy מספקת גם פונקציות מתמטיות שפועלות על כל ערך במערך. הפונקציות הטריגונומטריות משתמשות בזוויות ברדיאנים.

```python
angles = np.array([0, np.pi / 2, np.pi])

print(np.sin(angles))   # [0. 1. 0.]
print(np.cos(angles))   # [ 1.  0. -1.]

numbers = np.array([1, 4, 9])
print(np.sqrt(numbers))  # [1. 2. 3.]
```
