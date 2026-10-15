# קריאה וכתיבה של קבצי טקסט


#### כתיבת שורות לקובץ חדש בלולאה

```python
with open('data.txt', 'w') as f:
    for i in range(101):
        f.write(f"{i},{i**2}\n")
```

#### הוספת שורות לקובץ קיים

```python
with open('data.txt', 'a') as f:
    for i in range(101,151):
        f.write(f"{i},{i**2}\n")
```

#### אם הפורמט נכון, אפשר לשנות את הסיומת ל-.csv, ש-Excel קורא בקלות

```python
with open('data.csv', 'w') as f:
    for i in range(101):
        f.write(f"{i},{i**2}\n")
```

#### כדי לפתוח מסמך (לא רק מסמכי טקסט... גם SolidWorks, PDF וכו') עם תוכנת ברירת המחדל במחשב

```python
import os
os.startfile('data.csv') # windows only
```

#### קריאת כל התוכן של הקובץ למחרוזת אחת

```python
with open('alice.txt', 'r') as f:
    content = f.read()
```

#### קריאה תוך כדי ארגון הנתונים במערכים

```python
x_values = []
y_values = []
with open('data.txt', 'r') as f:
    next(f)  # (optionally - to skip header line)
    for line in f:
        x, y = line.strip().split(',')
        x_values.append(int(x))
        y_values.append(int(y))
```