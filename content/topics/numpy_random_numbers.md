# Random Numbers

```python
import numpy as np
```

NumPy can generate random numbers, which is useful for testing and simulations. These numbers are **pseudo-random**: they are produced by an algorithm, so they are not truly random, even though they usually look random.

## One random number

To get one random number, leave out the size argument:

```python
decimal = np.random.rand()          # one decimal between 0 and 1
integer = np.random.randint(0, 10)  # one integer from 0 up to 10
print(decimal)
print(integer)
```

## Random arrays

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
