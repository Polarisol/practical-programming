# SymPy Basics

## What is SymPy?

When we write `x = 5` in Python, `x` is just a name for a number. Python can only calculate with values it already knows. But in a math class we often work with an **unknown** `x`: we expand `(x + 1)²`, solve `2x + 3 = 11`, or find the derivative of `x³`.

**SymPy** (Symbolic Python) is a library that lets Python do this kind of math. It works with **symbols** and gives **exact** answers, just like you would write them on paper:

- NumPy says `√8 = 2.8284271247461903` (a rounded decimal).
- SymPy says `√8 = 2*sqrt(2)` (the exact answer).

SymPy can simplify, expand and factor expressions, solve equations and systems of equations, differentiate, integrate, find limits, work with matrices and much more. It is free, written entirely in Python, and is a good "calculator" to check your homework.

## Installing SymPy

In your project folder (see **Starting a Project**), add SymPy with `uv`:

```bash
uv add sympy
```

That's it. `uv` installs SymPy into the project's `.venv` and writes it into `pyproject.toml`, so the project remembers that it needs it. If you also want to turn SymPy results into fast NumPy functions (at the end of this lesson), add NumPy too:

```bash
uv add sympy numpy
```

## Importing SymPy

The common way is to import the whole library under the short name `sp`:

```python
import sympy as sp
```

Then every SymPy function starts with `sp.`, for example `sp.sqrt(8)` or `sp.solve(...)`. This keeps it clear which `sqrt` is SymPy's and which is from `math` or NumPy.

For short scripts and experiments you can import just the names you need:

```python
from sympy import symbols, sqrt, solve, diff, integrate
```

> Avoid `from sympy import *` together with `from math import *` or `from numpy import *`. They all have functions called `sqrt`, `sin`, `pi` ... and the last import silently wins.

The examples below use `import sympy as sp`.

## Level 1: Exact numbers

Regular Python division gives a rounded decimal. SymPy's `Rational` keeps the exact fraction:

```python
print(1 / 3)                                   # 0.3333333333333333
print(sp.Rational(1, 3))                       # 1/3
print(sp.Rational(1, 3) + sp.Rational(1, 6))   # 1/2
```

Square roots and constants like `pi` also stay exact, and SymPy simplifies them for you:

```python
print(sp.sqrt(8))        # 2*sqrt(2)
print(sp.sqrt(2) ** 2)   # 2         (exactly 2, not 2.0000000000000004)
```

When you do want a decimal number, use `evalf()` (or `sp.N`). You can ask for as many digits as you like:

```python
print(sp.sqrt(8).evalf())   # 2.82842712474619
print(sp.pi.evalf(30))      # 3.14159265358979323846264338328
print(sp.N(sp.sqrt(2), 5))  # 1.4142
```

## Level 2: Symbols and expressions

Before using a letter as an unknown, we must tell SymPy that it is a **symbol**:

```python
x, y = sp.symbols('x y')
```

Now we can build **expressions** with the usual Python operators. Remember that powers are written with `**`, not `^`.

```python
expr = x**2 + 2*x + 1
print(expr)          # x**2 + 2*x + 1
print(expr + x)      # x**2 + 3*x + 1
print(2 * expr)      # 2*x**2 + 4*x + 2
```

SymPy collects like terms automatically (`2*x + x` became `3*x`).

### Substituting values: `subs`

`subs` replaces a symbol with a number, or even with another expression:

```python
print(expr.subs(x, 3))        # 16
print(expr.subs(x, y + 1))    # 2*y + (y + 1)**2 + 3
```

### Pretty printing

`sp.pprint` draws the expression in a more "math-like" way in the terminal:

```python
sp.pprint((x**2 - 1) / (x + 3))
```

```text
 2
x  - 1
──────
x + 3
```

> Tip: in Jupyter, just writing the expression on the last line of a cell shows it as real math notation.

## Level 3: Rearranging expressions

SymPy does not change the form of an expression unless you ask it to. These functions change the form without changing the value:

| Function | What it does | Example | Result |
|---|---|---|---|
| `sp.expand` | Opens brackets | `sp.expand((x + 1)**3)` | `x**3 + 3*x**2 + 3*x + 1` |
| `sp.factor` | Writes as a product | `sp.factor(x**2 - 5*x + 6)` | `(x - 3)*(x - 2)` |
| `sp.simplify` | Tries to find the simplest form | `sp.simplify((x**2 - 1)/(x - 1))` | `x + 1` |
| `sp.cancel` | Cancels common factors in a fraction | `sp.cancel((x**2 + 2*x + 1)/(x**2 + x))` | `(x + 1)/x` |
| `sp.apart` | Splits into partial fractions | `sp.apart(1/(x**2 - 1))` | `-1/(2*(x + 1)) + 1/(2*(x - 1))` |

`simplify` also knows trigonometric identities:

```python
print(sp.simplify(sp.sin(x)**2 + sp.cos(x)**2))   # 1
```

## Level 4: Solving equations

`sp.solve(expression, x)` finds the values of `x` that make the expression **equal to zero**:

```python
print(sp.solve(x**2 - 5*x + 6, x))   # [2, 3]
```

If the equation has something other than 0 on the right side, write it with `sp.Eq(left, right)`. (We can't use `=` or `==` for this: `=` is assignment and `==` checks if two expressions are identical.)

```python
print(sp.solve(sp.Eq(2*x + 3, 11), x))   # [4]
```

The answers are exact. Use `evalf` if you need decimals:

```python
solutions = sp.solve(x**2 - 2, x)
print(solutions)                          # [-sqrt(2), sqrt(2)]
print([s.evalf(4) for s in solutions])    # [-1.414, 1.414]
```

SymPy also finds complex solutions (`I` is the imaginary unit, √-1):

```python
print(sp.solve(x**2 + 1, x))   # [-I, I]
```

### Systems of equations

Pass a list of equations and a list of unknowns. The answer is a dictionary:

```python
print(sp.solve([x + y - 10, x - y - 2], [x, y]))   # {x: 6, y: 4}
```

## Level 5: Calculus

### Derivatives: `diff`

```python
print(sp.diff(x**3 + 2*x, x))           # 3*x**2 + 2
print(sp.diff(sp.sin(x) * sp.exp(x), x)) # exp(x)*sin(x) + exp(x)*cos(x)   (product rule)
print(sp.diff(x**4, x, 2))              # 12*x**2   (second derivative)
print(sp.diff(x**2 * y**3, y))          # 3*x**2*y**2   (derivative by y; x is a constant)
```

To get the slope at a point, differentiate first and then substitute:

```python
print(sp.diff(x**2, x).subs(x, 3))   # 6
```

### Integrals: `integrate`

Without limits we get the antiderivative (SymPy does not add the `+ C`). With a tuple `(x, a, b)` we get a definite integral:

```python
print(sp.integrate(x**2, x))                                # x**3/3
print(sp.integrate(sp.sin(x), (x, 0, sp.pi)))               # 2
print(sp.integrate(sp.exp(-x**2), (x, -sp.oo, sp.oo)))      # sqrt(pi)
```

`sp.oo` (two letters o) is infinity.

### Limits: `limit`

```python
print(sp.limit(sp.sin(x) / x, x, 0))           # 1
print(sp.limit(1 / x, x, 0, '+'))              # oo   (from the right)
print(sp.limit((1 + 1/x)**x, x, sp.oo))        # E    (the number e)
```

### Series

`series` writes a function as a polynomial around a point (a Taylor series). The `O(x**8)` stands for "the rest of the terms":

```python
print(sp.series(sp.sin(x), x, 0, 8))
# x - x**3/6 + x**5/120 - x**7/5040 + O(x**8)
```

And `summation` can even add up infinite sums:

```python
n = sp.symbols('n')
print(sp.summation(1 / n**2, (n, 1, sp.oo)))   # pi**2/6
```

## Level 6: Matrices

SymPy matrices work like NumPy matrices, but the answers are exact, and they can contain symbols:

```python
M = sp.Matrix([[1, 2], [3, 4]])
print(M.det())         # -2
print(M.inv())         # Matrix([[-2, 1], [3/2, -1/2]])
print(M.eigenvals())   # {5/2 - sqrt(33)/2: 1, 5/2 + sqrt(33)/2: 1}

a, b = sp.symbols('a b')
A = sp.Matrix([[a, b], [b, a]])
print(A.det())         # a**2 - b**2
print(A.eigenvals())   # {a - b: 1, a + b: 1}
```

In `eigenvals`, the number after each value is how many times it appears.

## Level 7: Differential equations

A differential equation connects a function with its derivatives. First declare `f` as an unknown **function**, then solve with `dsolve`. `C1` and `C2` are the constants that the initial conditions would decide.

```python
f = sp.Function('f')

# f'(x) = f(x)
print(sp.dsolve(f(x).diff(x) - f(x), f(x)))
# Eq(f(x), C1*exp(x))

# f''(x) + f(x) = 0
print(sp.dsolve(f(x).diff(x, 2) + f(x), f(x)))
# Eq(f(x), C1*sin(x) + C2*cos(x))
```

## Level 8: From symbols back to numbers

SymPy is exact, but slow when you need to calculate an expression for thousands of values (for example, to draw a graph). `sp.lambdify` turns an expression into a regular, fast Python function that works on NumPy arrays:

```python
import numpy as np

g = sp.lambdify(x, x**2 + 1)
print(g(np.array([0, 1, 2])))   # [1 2 5]
```

This is the common way to combine the two libraries: use SymPy to find the formula (for example a derivative), then `lambdify` it and use NumPy and Matplotlib to calculate and draw it.

And to put a result in a report or presentation, `sp.latex` gives the LaTeX code of any expression:

```python
print(sp.latex(sp.Integral(x**2, x)))   # \int x^{2}\, dx
```

## Summary

| Task | Code |
|---|---|
| Install | `uv add sympy` |
| Import | `import sympy as sp` |
| Exact fraction | `sp.Rational(1, 3)` |
| Decimal value | `expr.evalf()` or `sp.N(expr, digits)` |
| Create symbols | `x, y = sp.symbols('x y')` |
| Substitute | `expr.subs(x, 3)` |
| Expand / factor / simplify | `sp.expand(e)`, `sp.factor(e)`, `sp.simplify(e)` |
| Solve `expr = 0` | `sp.solve(expr, x)` |
| Solve `left = right` | `sp.solve(sp.Eq(left, right), x)` |
| Derivative | `sp.diff(e, x)` |
| Integral | `sp.integrate(e, x)` or `sp.integrate(e, (x, a, b))` |
| Limit | `sp.limit(e, x, point)` |
| Matrix | `sp.Matrix([[1, 2], [3, 4]])` |
| Differential equation | `sp.dsolve(equation, f(x))` |
| To a fast NumPy function | `sp.lambdify(x, e)` |
