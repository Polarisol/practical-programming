# Introduction

**Recursion** is when a function calls **itself**. Instead of solving the whole problem at once, the function solves a small piece and hands the rest to a smaller copy of the same problem.

Every recursive function has two parts:

1. **Base case** - a case so simple that the function answers it directly, without calling itself. This is where the recursion stops.
2. **Recursive step** - the function calls itself on a **smaller** version of the problem, and uses that answer to build its own.

Each call must get closer to the base case. Otherwise the function would call itself forever.

## A simple example: multiplication

Multiplication is repeated addition. `a * b` is `a` added to itself `b` times. We can say it recursively:

- `a * 0` is `0` (base case)
- `a * b` is `a + a * (b - 1)` (recursive step)

```python
def multiply(a, b):
    if b == 0:                         # base case
        return 0
    return a + multiply(a, b - 1)      # recursive step

print(multiply(4, 3))  # 12
```

Here is what happens when we call `multiply(4, 3)`:

```
multiply(4, 3) = 4 + multiply(4, 2)
               = 4 + (4 + multiply(4, 1))
               = 4 + (4 + (4 + multiply(4, 0)))
               = 4 + (4 + (4 + 0))
               = 12
```

Each call waits for the call below it to finish. When the base case returns `0`, the answers travel back up and are added together.

## Towers of Hanoi

The Towers of Hanoi is a puzzle with three rods and a stack of disks of different sizes. At the start, all the disks sit on the first rod, from the largest at the bottom to the smallest at the top.

![Towers of Hanoi: four disks stacked on rod A, with empty rods B and C](content/images/towers_of_hanoi.svg)

The goal is to move the whole stack to the last rod. The rules are:

1. You move **one disk at a time**.
2. You can only take the **top** disk of a rod.
3. A disk can **never** be placed on top of a smaller disk.

Solving this by hand is hard once there are more than a few disks. With recursion it is short. To move `n` disks from rod A to rod C:

1. Move the top `n - 1` disks from A to B (using C as the helper).
2. Move the largest disk from A to C.
3. Move the `n - 1` disks from B to C (using A as the helper).

Steps 1 and 3 are the same puzzle with one disk fewer, so the function can call itself for them. The base case is a single disk, which we just move.

```python
def hanoi(n, start, target, helper):
    if n == 1:                                 # base case
        print(f"Move disk 1 from {start} to {target}")
        return
    hanoi(n - 1, start, helper, target)        # move n-1 disks out of the way
    print(f"Move disk {n} from {start} to {target}")
    hanoi(n - 1, helper, target, start)        # put them back on top

hanoi(3, "A", "C", "B")
```

Output:

```
Move disk 1 from A to C
Move disk 2 from A to B
Move disk 1 from C to B
Move disk 3 from A to C
Move disk 1 from B to A
Move disk 2 from B to C
Move disk 1 from A to C
```

Moving `n` disks takes `2**n - 1` moves. 3 disks take 7 moves, but 64 disks would take more than 18 quintillion moves.
