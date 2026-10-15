# מערכים דו-ממדיים

```python
import numpy as np
```

## מערכים דו-ממדיים

למערך יכול להיות יותר מממד אחד, כמו טבלה של שורות ועמודות.

```python
a = np.array([[1, 2, 3],
              [4, 5, 6]])
print(a)
# [[1 2 3]
#  [4 5 6]]

print(a.shape)  # (2, 3) -> 2 rows, 3 columns
```

## שינוי צורה של מערכים

`reshape` מאפשר לנו לשנות את הצורה של מערך בלי לשנות את הנתונים שלו.

1. עם מספרים מדויקים

```python
a = np.arange(6)       # [0 1 2 3 4 5]
b = a.reshape(2, 3)    # 2 rows, 3 columns
print(b)
# [[0 1 2]
#  [3 4 5]]
```

2. שימוש ב-`-1` כדי לתת ל-NumPy לחשב לבד את אחד הממדים

```python
a = np.arange(6)
b = a.reshape(2, -1)   # 2 rows, NumPy works out the columns (3)
print(b)
# [[0 1 2]
#  [3 4 5]]
```

## מערכים רב-ממדיים

למערכים של NumPy יכולים להיות שלושה ממדים ויותר. לדוגמה, למערך התלת-ממדי הזה יש 2 בלוקים, 2 שורות ו-3 עמודות:

```python
a = np.arange(12).reshape(2, 2, 3)
print(a.shape)  # (2, 2, 3)
```
