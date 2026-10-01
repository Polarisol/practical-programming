# Quiz yourself!

Answer all the questions, then press **Submit answers** to see your score and the corrections.

## Which of these statements about Python are true?
- [ ] Python code usually runs faster than C or C++ code.
  > It's the other way around. Python is interpreted, so it usually runs slower than C or C++. What's fast is *writing* code in Python.
- [ ] Python is mainly used for data science and isn't suited for other kinds of projects.
  > Python is a general-purpose language. Data science is just one of many areas where it's used.
- [x] Python is used for web development, data analysis, artificial intelligence and scientific computing.
  > Right! Python is very versatile and shows up in all of these areas.
- [x] Slow parts of a Python program can be sped up with optimized libraries or by writing them in another language.
  > Right! This is the usual way to work around Python's slower execution speed.
> Python is quick to **write** but can be slower to **run** than languages like C or C++, because it's interpreted. Optimized libraries help close that gap.

## You want to explore a data set step by step, running small pieces of code and seeing charts right away. Which file type fits best?
- [ ] `.txt`
  > A `.txt` file holds plain text. It can't run code.
- [x] `.ipynb`
  > Right! A Jupyter Notebook lets you run code in small pieces and see the results and charts right under each piece.
- [ ] `.csv`
  > A `.csv` file stores table data. It can hold your data set, but it can't run code.
- [ ] `.py`
  > A `.py` file runs as a whole script or program. It works, but it isn't built for interactive, step-by-step exploration.
> Jupyter Notebooks (`.ipynb`) are made for interactive computing, data exploration and visualization. `.py` files are for scripts and modules that run on their own.

## What does this code print?
```python
a = 5

def foo():
    return a + 10

def bar():
    a = 20

bar()
print(foo())
```
- [ ] 30
  > This assumes `bar()` changed the global `a` to 20. It didn't: `a = 20` inside `bar` creates a new local variable.
- [ ] 25
  > Check the math: even if `a` were 20, `foo()` would return 30. In fact `a` is still 5.
- [ ] An error, because `foo` can't use `a`
  > Reading a global variable inside a function is perfectly fine.
- [x] 15
  > Right! `bar()` only creates a local `a`, so the global `a` stays 5, and `foo()` returns `5 + 10`.
> A function can **read** a global variable freely. But assigning to a variable inside a function creates a new **local** variable, unless you declare it `global`.

## What line should replace the comment so that the program prints 20?
```python
a = 5

def bar():
    # missing line
    a = 20

bar()
print(a)
```
- [x] `global a`
  > Right! `global a` tells Python that `a` inside `bar` is the global variable, so `a = 20` changes it.
- [ ] `return a`
  > `return` ends the function right away, so `a = 20` would never run. And the global `a` would still be 5.
- [ ] `a = a`
  > This makes Python treat `a` as local, and it fails because the local `a` has no value yet.
- [ ] Nothing, the code already prints 20
  > Without `global`, `a = 20` creates a local variable and the program prints 5.
> To **change** a global variable from inside a function, declare it with `global` first.

## The user types `7`. What does this code print?
```python
x = input("Enter a number: ")
print(x * 2)
```
- [ ] 14
  > That would happen with `int(input(...))`. Without `int`, `x` is the string `"7"`.
- [ ] An error
  > Multiplying a string by a whole number is allowed in Python. It repeats the string.
- [x] 77
  > Right! `input` always returns a string, and `"7" * 2` repeats it: `"77"`.
- [ ] 7
  > `* 2` does change the result. A string times 2 is the string written twice.
> `input` always returns a **string**. Use `int(...)` or `float(...)` to turn it into a number.

## What does this code print?
```python
name = "python"
print(f"{name.upper()} has {len(name)} letters")
```
- [ ] `{name.upper()} has {len(name)} letters`
  > The `f` before the quotes makes this an f-string, so the expressions inside `{ }` are calculated.
- [x] `PYTHON has 6 letters`
  > Right! `name.upper()` gives `"PYTHON"` and `len(name)` gives 6.
- [ ] `python has 6 letters`
  > `.upper()` turns every letter into a capital letter.
- [ ] `PYTHON has 5 letters`
  > Count again: p-y-t-h-o-n is 6 letters.
> In an f-string, anything inside `{ }` is calculated and its value is placed into the string.

## What does this code print? (Each value is printed on its own line; the options show them in one row.)
```python
for i in range(8):
    if i == 6:
        break
    if i % 2 == 1:
        continue
    print(i)
```
- [ ] 0 2 4 6
  > When `i` is 6, `break` exits the loop before `print(i)` runs.
- [ ] 1 3 5
  > `continue` skips the **odd** numbers (`i % 2 == 1`), so the odd numbers are the ones that are *not* printed.
- [ ] 0 1 2 3 4 5
  > `continue` jumps to the next round of the loop, so `print(i)` is skipped for odd numbers.
- [x] 0 2 4
  > Right! Odd numbers are skipped by `continue`, and the loop stops completely at 6 because of `break`.
> `continue` skips the rest of the current round and moves to the next one. `break` exits the loop completely.

## What does this code print?
```python
numbers = [3, 1, 3, 2, 1]
numbers.append(4)
unique = set(numbers)
print(len(numbers), len(unique))
```
- [x] 6 4
  > Right! After `append(4)` the list has 6 items. The set keeps only the unique values 1, 2, 3 and 4.
- [ ] 5 4
  > `append(4)` adds an item to the end of the list, so it now has 6 items, not 5.
- [ ] 6 6
  > A set doesn't allow duplicates, so the repeated 3 and 1 are kept only once.
- [ ] 5 3
  > Both counts include the 4 that `append` added: the list has 6 items and the set has 4.
> Converting a list to a set is an easy way to remove duplicates. The original list doesn't change.

## What does this code print?
```python
scores = {"Dana": 80}
scores["Dana"] = 90
scores["Avi"] = 75
print(len(scores), scores["Dana"])
```
- [ ] 2 80
  > `scores["Dana"] = 90` replaces the old value, so Dana's score is now 90.
- [ ] 3 90
  > Updating `"Dana"` doesn't add a new pair. Each key appears only once, so there are 2 pairs.
- [x] 2 90
  > Right! There are two keys, `"Dana"` and `"Avi"`, and Dana's value was updated to 90.
- [ ] 1 90
  > `scores["Avi"] = 75` uses a new key, so it adds a new pair to the dictionary.
> Assigning to an existing key **updates** its value. Assigning to a new key **adds** a new key-value pair.

## Which of these statements about text files in Python are true?
- [x] The `with` statement makes sure the file is closed when we're done with it.
  > Right! That's the main reason we open files with `with`.
- [ ] Python can read text files, but it can't write to them.
  > Python can both read and write text files, and the code for each is short.
- [x] We can read a whole text file into one string, or use a loop to read it line by line.
  > Right! Both ways work, so you can pick the one that fits your task.
- [ ] A `.txt` file can store formatting such as bold text and font sizes.
  > A `.txt` file holds plain, unformatted text only.
- [x] A `.csv` file stores table data, with commas separating the values.
  > Right! CSV stands for comma-separated values. Opened in Excel, each value goes into its own cell.
> Use `with` to open files safely. `.txt` files hold plain text, and `.csv` files hold table data separated by commas.
