# Be Careful

Every time a function is called, Python saves information about that call in memory: its parameters, its local variables and where to return to. This area of memory is called the **call stack**. The information is only removed when the call finishes.

In recursion, a call does not finish until all the calls below it finish. So every level of recursion adds another entry to the stack, and they all stay there at the same time.

## Forgetting the base case

If the base case is missing, or is never reached, the function calls itself forever:

```python
def countdown(n):
    print(n)
    countdown(n - 1)   # no base case - it never stops!

countdown(5)
```

The same happens when the base case exists but the recursive step skips over it:

```python
def multiply(a, b):
    if b == 0:
        return 0
    return a + multiply(a, b - 2)   # b goes 3, 1, -1, -3 ... and never hits 0

multiply(4, 3)
```

## Too deep, even when correct

Even a correct recursive function can fail if the problem is too big. `multiply(4, 5000)` has a correct base case, but it needs 5000 calls waiting on the stack at once.

To protect the computer from running out of memory, Python limits how deep recursion can go (about 1000 levels by default). Past that limit, the program crashes with:

```
RecursionError: maximum recursion depth exceeded
```

You can see the limit with:

```python
import sys
print(sys.getrecursionlimit())  # 1000
```

It is possible to raise it with `sys.setrecursionlimit(...)`, but this is risky: if the stack really runs out of memory, Python itself can crash without any error message.

## How to stay safe

1. Always write the **base case first**, and make sure every call moves **toward** it.
2. Use recursion when the depth stays small, like Towers of Hanoi (depth = number of disks) or splitting a problem in half each time.
3. When the depth could grow with the size of the input (like counting down from a large number), a regular `for` or `while` loop is usually the better choice.
