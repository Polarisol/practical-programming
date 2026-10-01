# NumPy Advanced

## Imports

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

## Random arrays

NumPy can generate random numbers, which is useful for testing and simulations.

1. `random.rand` - random decimals between 0 and 1

```python
a = np.random.rand(3)
print(a)  # e.g. [0.37 0.95 0.02]
```

2. `random.randint` - random whole numbers in a range

```python
# random integers from 0 up to (not including) 10, 5 of them
a = np.random.randint(0, 10, 5)
print(a)  # e.g. [3 7 1 9 4]
```

3. `random.uniform` - random decimals in a custom range

```python
# random decimals between 5 and 15, 4 of them
a = np.random.uniform(5, 15, 4)
print(a)  # e.g. [ 7.21 12.83  9.05  5.67]
```
