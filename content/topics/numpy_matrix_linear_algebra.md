# NumPy Matrix Operations and Linear Algebra

NumPy can work with matrices, which are rectangular tables of numbers. These are useful in science, engineering, graphics, and many other areas.

## Matrix operations

Use `@` for matrix multiplication. This is different from `*`, which multiplies matching values element by element.

```python
import numpy as np

A = np.array([[1, 2],
              [3, 4]])
B = np.array([[5, 6],
              [7, 8]])

print(A * B)
# [[ 5 12]
#  [21 32]]

print(A @ B)
# [[19 22]
#  [43 50]]
```

The transpose switches rows and columns:

```python
print(A.T)
# [[1 3]
#  [2 4]]
```

## Solving linear equations

`np.linalg.solve` can solve equations written as a matrix equation, `A @ x = b`.

```python
# x + y = 5
# 2x + y = 7
A = np.array([[1, 1],
              [2, 1]])
b = np.array([5, 7])

x = np.linalg.solve(A, b)
print(x)  # [2. 3.]
```

So the solution is `x = 2` and `y = 3`.
