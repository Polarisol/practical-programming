# NumPy Polynomial Fitting and Evaluation

A polynomial can describe the relationship between numbers. NumPy can find a polynomial that fits measured data and then use it to estimate new values.

## Fitting a polynomial

`np.polyfit` finds the coefficients of a polynomial. The last argument is the degree: `1` means a straight line, `2` means a quadratic curve, and so on.

```python
import numpy as np

x = np.array([0, 1, 2, 3])
y = np.array([1, 3, 5, 7])

coefficients = np.polyfit(x, y, 1)
print(coefficients)  # [2. 1.]
```

These coefficients describe the line $y = 2x + 1$.

## Evaluating the polynomial

Use `np.polyval` to calculate values from the coefficients:

```python
new_x = np.array([4, 5])
new_y = np.polyval(coefficients, new_x)
print(new_y)  # [ 9. 11.]
```

The same function can evaluate one number or an entire array of numbers:

```python
print(np.polyval(coefficients, 10))  # 21.0
```
