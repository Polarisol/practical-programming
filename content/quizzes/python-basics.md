# Python Basics Quiz

Answer all the questions, then press **Submit answers** to see your score and the corrections.

## What does `len([1, 2, 3])` return?
- [ ] 2
  > Not quite. `len` counts the items; it doesn't give the last index.
- [x] 3
  > Correct! The list has three items.
- [ ] 6
  > That's the sum of the items, which is what `sum()` returns.

## What does this code print?
```python
x = 5
x = x + 2
print(x)
```
- [ ] 5
  > The second line changes `x`, so it's no longer 5 when it's printed.
- [x] 7
  > Right! `x + 2` is calculated first, then the result is stored back in `x`.
- [ ] x + 2
  > `print(x)` prints the value of `x`, not the expression that created it.
> A variable is a name for a value. Assigning to it again replaces the old value.

## Which of these are valid variable names in Python?
- [x] `total_sum`
  > Valid: letters and underscores are fine.
- [ ] `2nd_place`
  > Invalid: a name can't start with a digit.
- [x] `_count`
  > Valid: a name may start with an underscore.
- [ ] `my-name`
  > Invalid: `-` is the minus operator, not part of a name.

## How many times does this loop print `hi`?
```python
for i in range(3):
    print("hi")
```
- [ ] 2
  > `range(3)` gives 0, 1 and 2, which is three values.
- [x] 3
  > Correct! `range(3)` produces 0, 1, 2.
- [ ] 4
  > `range(3)` stops *before* 3.

## Which of these values count as `False` in an `if` statement?
- [x] `0`
  > Zero is "falsy".
- [x] `""` (an empty string)
  > Empty containers and strings are falsy.
- [ ] `"False"`
  > This is a non-empty string, so it counts as True!
- [x] `[]` (an empty list)
  > Empty lists are falsy.
> Python treats `0`, `None` and empty strings or containers as False. Everything else is True.
