# 2D Arrays

```python
import numpy as np
```

## 2D arrays

An array can have more than one dimension, like a table of rows and columns.

```python
a = np.array([[1, 2, 3],
              [4, 5, 6]])
print(a)
# [[1 2 3]
#  [4 5 6]]

print(a.shape)  # (2, 3) -> 2 rows, 3 columns
```

## Reshaping arrays

`reshape` lets us change the shape of an array without changing its data.

1. With exact numbers

```python
a = np.arange(6)       # [0 1 2 3 4 5]
b = a.reshape(2, 3)    # 2 rows, 3 columns
print(b)
# [[0 1 2]
#  [3 4 5]]
```

2. Using `-1` to let NumPy figure out one of the dimensions

```python
a = np.arange(6)
b = a.reshape(2, -1)   # 2 rows, NumPy works out the columns (3)
print(b)
# [[0 1 2]
#  [3 4 5]]
```

## Multidimensional arrays

NumPy arrays can have three or more dimensions. For example, this 3D array has 2 blocks, 2 rows, and 3 columns:

```python
a = np.arange(12).reshape(2, 2, 3)
print(a.shape)  # (2, 2, 3)
```
