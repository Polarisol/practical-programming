# Files quiz

Check what you know about reading and writing text files. Answer all the questions, then press **Submit answers** to see your score and the corrections.

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

## The file `data.txt` contains the text `hello`. What does it contain after this code runs?
```python
with open('data.txt', 'w') as f:
    f.write('bye')
```
- [ ] `hellobye`
  > That's what `'a'` (append) would do. `'w'` doesn't keep the old content.
- [x] `bye`
  > Right! `'w'` empties the file as soon as it's opened, and then `bye` is written into it.
- [ ] `hello`
  > `'w'` opens the file for writing, so `f.write('bye')` does change it.
- [ ] Nothing, because Python raises an error when the file already exists.
  > `'w'` works fine with an existing file. It just erases what was in it.
> `'w'` (write) **erases** the file and starts it again from empty. Be careful: the old content is gone.

## The file `log.txt` has two lines, `A` and `B`. What does it contain after this code runs? (The options show the lines in one row.)
```python
with open('log.txt', 'a') as f:
    f.write('C\n')
```
- [ ] C
  > That's what `'w'` would do. `'a'` keeps the old lines.
- [ ] A B
  > `f.write('C\n')` does add a line to the file.
- [x] A B C
  > Right! `'a'` (append) keeps everything already in the file and adds the new text at the end.
- [ ] C A B
  > `'a'` always adds new text at the **end** of the file, never at the start.
> `'a'` (append) adds to the end of a file and keeps what's already there. It's the mode to use for things like logs.

## The file `scores.txt` does **not** exist yet. Which statements are true?
- [ ] `open('scores.txt', 'r')` creates a new, empty file to read from.
  > Reading a file that doesn't exist makes no sense, so Python doesn't create one.
- [x] `open('scores.txt', 'w')` creates a new, empty file.
  > Right! `'w'` creates the file if it's missing.
- [ ] `open('scores.txt', 'a')` raises an error, because there's nothing to add to.
  > `'a'` creates the file if it's missing, just like `'w'`.
- [x] `open('scores.txt', 'r')` raises a `FileNotFoundError`.
  > Right! `'r'` (read) only opens files that already exist.
> `'r'` is for reading an existing file. `'w'` and `'a'` are for writing, and both create the file if it doesn't exist.

## The file `notes.txt` has three lines: `one`, `two` and `three`. What is `content` after this code runs?
```python
with open('notes.txt', 'r') as f:
    content = f.read()
```
- [ ] Only the first line, `"one"`
  > `f.read()` reads the whole file, not one line.
- [ ] A list of the lines, `["one", "two", "three"]`
  > `f.read()` doesn't split the file into a list. You get one string.
- [ ] The number of lines, 3
  > `f.read()` returns the text itself, not a count.
- [x] The whole file as one string, `"one\ntwo\nthree\n"`
  > Right! `f.read()` returns everything in the file as a single string, including the `\n` at the end of each line.
> `f.read()` reads the **whole** file into one string. That's handy for short files that you want to handle all at once.

## The file `notes.txt` has three lines: `one`, `two` and `three`. What does this code print?
```python
count = 0
with open('notes.txt', 'r') as f:
    for line in f:
        count += 1
print(count)
```
- [x] 3
  > Right! A `for` loop over a file gives you one line in each round, so the loop runs three times.
- [ ] 1
  > The loop doesn't get the whole file at once. It gets it one line at a time.
- [ ] 14
  > That's the number of characters in the file. The loop goes over lines, not characters.
- [ ] 0
  > Opening the file with `'r'` doesn't empty it, so the loop does run.
> A `for` loop over an open file reads it **line by line**. This is the way to go when you want to handle each line separately, or when the file is large.

## The line `"5,25\n"` was read from a file. What does `line.strip().split(',')` return?
- [ ] `[5, 25]`
  > `split` returns strings, not numbers. Use `int(...)` to turn each one into a number.
- [ ] `["5,25"]`
  > That would happen without the `','`. Here the string is cut at every comma.
- [ ] `["5", "25\n"]`
  > `strip()` runs first and removes the `\n` from the end of the line.
- [x] `["5", "25"]`
  > Right! `strip()` removes the `\n` at the end, and `split(',')` cuts the string at the comma into a list of two strings.
> `strip()` removes spaces and the newline from both ends of a string. `split(',')` cuts a string into a list at every comma.

## The file `data.txt` is shown below. What does the code print?
```python
# data.txt:
# x,y
# 1,1
# 2,4
# 3,9

x_values = []
y_values = []
with open('data.txt', 'r') as f:
    next(f)
    for line in f:
        x, y = line.strip().split(',')
        x_values.append(int(x))
        y_values.append(int(y))
print(x_values, y_values)
```
- [ ] `[1, 1] [2, 4]`
  > Each **row** has an `x` and a `y`, but the code puts the `x` values in one list and the `y` values in another, column by column.
- [ ] `['x', 1, 2, 3] ['y', 1, 4, 9]`
  > `next(f)` skips the first line, so the header `x,y` never reaches the lists.
- [x] `[1, 2, 3] [1, 4, 9]`
  > Right! The header is skipped, and each line adds its first value to `x_values` and its second value to `y_values`.
- [ ] `['1', '2', '3'] ['1', '4', '9']`
  > `int(x)` and `int(y)` turn the strings into numbers before they're added to the lists.
> To read **columns** of data into separate lists, start with an empty list for each column. Then, for every line, split it and append each value to its own list. `next(f)` skips a header line.
