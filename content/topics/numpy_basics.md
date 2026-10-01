# NumPy Basics

## Why use NumPy?

Regular Python lists are flexible, but slow when working with lots of numbers. NumPy gives us the **array**, a fast, memory-efficient way to store and work with numbers, and lets us do math on entire arrays at once instead of writing loops. It is written in C, which is why it is so fast.

## Imports

```python
import numpy as np
```

## Creating arrays

1. From a list, using `array`

```python
a = np.array([1, 2, 3, 4])
print(a)  # [1 2 3 4]
```

2. Evenly spaced values with `linspace` (you choose how many values)

```python
# 5 evenly spaced numbers between 0 and 10 (including both ends)
a = np.linspace(0, 10, 5)
print(a)  # [ 0.   2.5  5.   7.5 10. ]
```

3. Evenly spaced values with `arange` (you choose the step size)

```python
# numbers from 0 up to (not including) 10, step of 2
a = np.arange(0, 10, 2)
print(a)  # [0 2 4 6 8]
```

4. Arrays filled with zeros, ones, or any value

```python
zeros = np.zeros(4)
print(zeros)  # [0. 0. 0. 0.]

ones = np.ones(4)
print(ones)  # [1. 1. 1. 1.]

fives = np.full(4, 5)
print(fives)  # [5 5 5 5]
```

## Working with whole arrays at once

The real power of NumPy is that we can use normal operators (`+`, `-`, `*`, `/`, `**`) directly on arrays, and they apply to every element, fast.

```python
a = np.array([1, 2, 3, 4])

print(a + 10)   # [11 12 13 14]
print(a * 2)    # [2 4 6 8]
print(a ** 2)   # [1 4 9 16]
print(2 ** a)   # [2 4 8 16]
```

We can also combine two arrays of the same size:

```python
a = np.array([1, 2, 3])
b = np.array([10, 20, 30])

print(a + b)  # [11 22 33]
print(a * b)  # [10 40 90]
```

This is much shorter, and much faster, than writing a loop to do the same thing.
