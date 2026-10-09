# Recursion Quiz

Answer all the questions, then press **Submit answers** to see your score and the corrections.

## What is recursion?
- [ ] A function that runs over and over inside a loop
  > Loops repeat code, but recursion is about a function calling **itself**, not about loops.
- [x] A function that calls itself to solve a smaller version of the same problem
  > Right! A recursive function solves a small piece and hands the rest to a smaller copy of the same problem.
- [ ] A function that calls a different function to help it
  > Calling another function is normal. It only becomes recursion when the function calls **itself**.
- [ ] A variable that stores a function so it can be reused
  > Storing a function in a variable is possible in Python, but it has nothing to do with recursion.
> Recursion means a function calls itself. Each call works on a smaller version of the problem until it reaches a case simple enough to answer directly.

## Why do programmers like to use recursion for problems like the Towers of Hanoi?
- [ ] Recursion always runs faster than a loop that does the same job.
  > Not true. Recursion is often slower, because every call adds work and takes up space on the call stack.
- [ ] Recursion uses less memory, because it doesn't need any variables.
  > It's the opposite: every active call stays on the call stack, so deep recursion can use more memory.
- [x] It describes the problem using a smaller copy of itself.
  > Exactly. "Move `n - 1` disks, move the big one, move the `n - 1` disks back" turns a hard puzzle into a few short, clear lines of code.
- [ ] Python has no other way to solve puzzles like this one.
  > Anything solved with recursion can also be solved with loops. Recursion is a choice that often makes the code simpler.
> Recursion is useful because it is simple to reason about: if you can describe a problem using a smaller version of itself, the code often almost writes itself.

## Which of these problems are a good fit for recursion?
- [x] Adding up all the numbers in a list that may contain other lists
  > Good fit: each inner list is the same problem again, just smaller.
- [ ] Converting a single temperature from Celsius to Fahrenheit with one formula
  > This is one calculation. There is no smaller version of the problem to hand off.
- [ ] Printing today's date once at the top of a report
  > This is a single step that can't be broken into smaller, similar subproblems.
- [x] Checking if a word is a palindrome (palindromes are words that read the same forwards and backwards)
  > Good fit: compare the first and last letters, then check the shorter word in the middle the same way. A word with 0 or 1 letters is the base case.
- [x] Counting everyone in a family tree, where each person may have children
  > Good fit: each child's part of the tree is a smaller family tree, counted the same way.
> A problem fits recursion when it can be broken into **smaller, similar subproblems**, with a simple case at the bottom that can be answered directly.

## In this function, which line checks for the **base case**?
```python
def countdown(n):
    if n == 0:
        print("Liftoff!")
        return
    print(n)
    countdown(n - 1)
```
- [ ] `print(n)`
  > This line just prints the current number. It runs on every call except the last one.
- [ ] `countdown(n - 1)`
  > This is the **recursive step**: the function calls itself with a smaller number.
- [ ] `def countdown(n):`
  > This line only defines the function. It doesn't decide when the recursion stops.
- [x] `if n == 0:`
  > Right! When `n` is 0, the function answers directly and returns without calling itself.
> The **base case** is where the recursion stops. The **recursive step** calls the function on a smaller problem. Together they make sure every call moves toward the base case, so the function eventually ends.

## What does this code print?
```python
def mystery(n):
    if n == 0:
        return 0
    return n + mystery(n - 1)

print(mystery(4))
```
- [x] 10
  > Right! `4 + 3 + 2 + 1 + 0 = 10`.
- [ ] 24
  > That's `4 * 3 * 2 * 1`. The function **adds** `n`, it doesn't multiply.
- [ ] 0
  > The base case returns 0, but that 0 is then added to the numbers waiting in the calls above it.
- [ ] 4
  > The first call returns `4 + mystery(3)`, not just 4. It has to wait for the calls below it.
> Each call waits for the call below it. When `mystery(0)` returns 0, the answers travel back up: `1 + 0`, then `2 + 1`, then `3 + 3`, then `4 + 6 = 10`. The function adds up all the numbers from `n` down to 0.

## What happens when this code runs?
```python
def multiply(a, b):
    if b == 0:
        return 0
    return a + multiply(a, b - 2)

print(multiply(4, 3))
```
- [ ] It prints 12, because 4 is added three times
  > That would be true with `b - 1`. Here `b` jumps down by 2 each time.
- [x] It crashes with a `RecursionError`
  > Right! `b` goes 3, 1, -1, -3... and skips over 0, so the base case is never reached.
- [ ] It prints 8, because 4 is added twice before `b` runs out
  > There is no point where `b` lands on 0, so the function never returns a number at all.
- [ ] It prints 0, because the base case returns 0
  > The base case returns 0 only when `b == 0`, and that never happens here.
> Having a base case isn't enough: every call must move **toward** it. If the recursive step skips over the base case, the function calls itself until Python stops it.

## Which statements about calling `multiply(4, 5000)` are true? (`multiply` uses the correct `b - 1` version.)
- [ ] It prints 20000 without any problem.
  > Python's default recursion limit is about 1000 levels, so it never gets that far.
- [x] Its base case is correct.
  > True. `b` goes down by 1 each time, so it will reach 0 eventually.
- [x] About 5000 calls wait on the stack at once.
  > True. No call can finish until the calls below it finish, so they all pile up.
- [ ] Adding more RAM to the computer would let it finish.
  > The call stack has a small, fixed size given by the operating system. More RAM doesn't make it bigger.
- [x] Python stops it with a `RecursionError`.
  > True. Python limits recursion to about 1000 levels and raises this error to protect the program.
> Even a correct recursive function can fail if it goes too deep. When the depth grows with the size of the input, a regular `for` or `while` loop is usually the better choice.

## What is **memoization**?
- [ ] Making a function call itself on a smaller version of the problem
  > That's recursion. Memoization is a way to make recursive functions faster.
- [ ] Raising the recursion limit with `sys.setrecursionlimit(...)` so it can go deeper
  > That changes how deep recursion can go, and it is risky. It doesn't save any work.
- [ ] Always writing the base case first so the function stops
  > That's a good habit for avoiding infinite recursion, but it isn't memoization.
- [x] Saving results and reusing them for repeated inputs
  > Right! Instead of calculating the same answer again, the function looks it up.
> Some recursive functions, like Fibonacci, calculate the same values many times. Memoization stores each result the first time it's calculated, so later calls with the same input can return it right away.

## Which line should replace `# missing line` so that `fib` remembers its answers?
```python
memo = {}

def fib(n):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    result = fib(n - 1) + fib(n - 2)
    # missing line
    return result
```
- [x] `memo[n] = result`
  > Right! This stores the answer under the key `n`, so the next call with the same `n` finds it with `if n in memo`.
- [ ] `memo = {}`
  > This creates a new empty dictionary inside the function, so nothing is ever saved in the real `memo`.
- [ ] `result = memo[n]`
  > This reads from the dictionary instead of writing to it. Since `n` isn't stored yet, it raises a `KeyError`.
- [ ] `memo.append(result)`
  > Dictionaries don't have `.append()`. That's a list method, and a list wouldn't let you look up an answer by `n`.
> To memoize with a dictionary: first check if the input is already a key (`if n in memo`), and if not, calculate the answer and store it with `memo[n] = result` before returning it.
