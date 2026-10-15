# מספרים אקראיים

```python
import numpy as np
```

NumPy יודעת לייצר מספרים אקראיים, וזה שימושי לבדיקות ולסימולציות. המספרים האלה הם **פסאודו-אקראיים** (pseudo-random): הם נוצרים על ידי אלגוריתם, אז הם לא באמת אקראיים, למרות שבדרך כלל הם נראים אקראיים.

## מספר אקראי אחד

כדי לקבל מספר אקראי אחד, פשוט לא מעבירים את הארגומנט של הגודל:

```python
decimal = np.random.rand()          # one decimal between 0 and 1
integer = np.random.randint(0, 10)  # one integer from 0 up to 10
print(decimal)
print(integer)
```

## מערכים אקראיים

1. `random.rand` - מספרים עשרוניים אקראיים בין 0 ל-1

```python
a = np.random.rand(3)
print(a)  # e.g. [0.37 0.95 0.02]
```

2. `random.randint` - מספרים שלמים אקראיים בטווח

```python
# random integers from 0 up to (not including) 10, 5 of them
a = np.random.randint(0, 10, 5)
print(a)  # e.g. [3 7 1 9 4]
```

3. `random.uniform` - מספרים עשרוניים אקראיים בטווח שבוחרים

```python
# random decimals between 5 and 15, 4 of them
a = np.random.uniform(5, 15, 4)
print(a)  # e.g. [ 7.21 12.83  9.05  5.67]
```
