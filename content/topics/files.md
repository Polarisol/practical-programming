# Reading and Writing Text Files


### Writing lines to a new file in a loop

```python
with open('data.txt', 'w') as f:
    for i in range(101):
        f.write(f"{i},{i**2}\n")
```

### Appending lines to an existing file

```python
with open('data.txt', 'a') as f:
    for i in range(101,151):
        f.write(f"{i},{i**2}\n")
```

### If formatted correctly, the extension can be changed to .csv, which Excel reads easily

```python
with open('data.csv', 'w') as f:
    for i in range(101):
        f.write(f"{i},{i**2}\n")
```

### To open a document (not just text documents... also SolidWorks, PDF, etc.) with the default program on the computer

```python
import os
os.startfile('data.csv')
```

### Reading the entire file content into a single string

```python
with open('alice.txt', 'r') as f:
    content = f.read()
```

### Reading while organizing the data into arrays

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