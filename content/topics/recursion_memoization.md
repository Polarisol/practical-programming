# Memoization

## The Fibonacci sequence

In the Fibonacci sequence, each number is the sum of the two before it:

```
0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
```

This definition is already recursive, so the code almost writes itself:

```python
def fib(n):
    if n < 2:                          # base case: fib(0) = 0, fib(1) = 1
        return n
    return fib(n - 1) + fib(n - 2)     # recursive step

print(fib(10))  # 55
```

It works, but try `fib(40)`. It takes a long time, and `fib(50)` practically never finishes.

## Why is it so slow?

Look at the calls made by `fib(5)`:

```
                    fib(5)
                 /          \
            fib(4)            fib(3)
           /      \          /      \
       fib(3)    fib(2)   fib(2)   fib(1)
       /    \    /    \   /    \
   fib(2) fib(1) ...  ... ...  ...
```

`fib(3)` is calculated twice, `fib(2)` three times, and so on. The same answers are calculated again and again. The number of calls nearly doubles every time `n` grows by 1, so `fib(40)` makes more than 300 million calls.

## The solution: remember the answers

**Memoization** means saving the result of each call the first time it is calculated. The next time the same input appears, the function returns the saved answer instead of calculating it again.

We can keep the answers in a dictionary:

```python
memo = {}

def fib(n):
    if n in memo:                      # already calculated? return it
        return memo[n]
    if n < 2:
        result = n
    else:
        result = fib(n - 1) + fib(n - 2)
    memo[n] = result                   # remember it for next time
    return result

print(fib(50))  # 12586269025, instantly
```

Now each `fib(n)` is calculated only once, so `fib(50)` needs about 50 calculations instead of billions.

## The easy way: `lru_cache`

Python can do the memoization for us. Adding `@lru_cache` above the function makes Python remember every result automatically:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(100))  # 354224848179261915075
```

The function itself is unchanged. Only the line above it is new.

Memoization helps when a recursive function is called **many times with the same inputs**. It does not help with recursion depth: `fib(5000)` still needs 5000 levels on the stack, so it can still hit the `RecursionError` from **Be Careful**.
