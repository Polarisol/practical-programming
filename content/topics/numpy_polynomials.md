# Polynomial Fitting

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

These coefficients describe the line y = 2x + 1.

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

## Example: fitting a curve and drawing it

Here we measure the height of a thrown ball every half second, fit a parabola (degree `2`) to the measurements, and draw both with Matplotlib. The data points are blue, the fitted polynomial is a red line, and the formula is written on the side.

```python
import numpy as np
import matplotlib.pyplot as plt

# Height of a thrown ball (meters), measured every half second
time = np.array([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4])
height = np.array([1.2, 9.5, 15.8, 19.4, 21.1, 20.3, 17.0, 11.6, 3.9])

# Fit a polynomial of degree 2 (a parabola)
a, b, c = np.polyfit(time, height, 2)

# Evaluate the polynomial on many points to draw a smooth curve
smooth_time = np.linspace(0, 4, 100)
smooth_height = np.polyval([a, b, c], smooth_time)

fig, ax = plt.subplots(figsize=(9, 5))
ax.scatter(time, height, color='blue', label='Measured data', zorder=3)
ax.plot(smooth_time, smooth_height, color='red', label='Fitted polynomial')

# Write the formula on the right side of the graph
formula = f'$y = {a:.2f}x^2 {b:+.2f}x {c:+.2f}$'
ax.text(1.05, 0.5, formula, transform=ax.transAxes,
        fontsize=16, color='red', va='center',
        bbox=dict(boxstyle='round', facecolor='white', edgecolor='red'))

ax.set_xlabel('Time (s)')
ax.set_ylabel('Height (m)')
ax.set_title('Fitting a parabola to a thrown ball')
ax.legend(loc='lower center')
fig.tight_layout()
plt.show()
```

![Blue data points with a red fitted parabola and its formula on the side](content/images/numpy_polyfit.png)

A few details in this example:

- `np.polyfit` returns three coefficients for degree 2, so we can unpack them straight into `a, b, c`.
- We draw the curve with 100 points from `np.linspace`, not just the 9 measured ones, so it looks smooth.
- Text between `$...$` is drawn as a math formula, so `x^2` appears as x².
- The format `{b:+.2f}` always shows the sign, so the formula reads `+ 19.19x` or `- 4.63x` correctly.
- `transform=ax.transAxes` places the text by position in the graph area (`0` to `1`), and `1.05` puts it just to the right of the graph.
