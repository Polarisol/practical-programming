# Pandas Basics: Exploring a Table of Kids

## Why use pandas?

NumPy is great for arrays of numbers, but real data usually looks like a **table**: every row is a person (or a product, or a day) and every column is a different kind of information, some numbers and some text. Pandas gives us the **DataFrame**, a table with named columns and labelled rows. We can load it from a file, look at it, pick parts of it, calculate, sort, filter, draw graphs and save it to Excel, all in a few lines.

Pandas is built on top of NumPy, so everything you know about arrays still helps here.

## Imports

```python
import pandas as pd
import numpy as np
```

If pandas isn't installed yet, run `pip install pandas matplotlib openpyxl` (matplotlib is used for graphs and openpyxl for saving Excel files).

## The data

All the examples use a small file called `kids.csv` (you can download it from the **Files** section of this unit). A CSV file is plain text: one line per row, with commas between the values. The first line holds the column names.

```text
Name,Gender,Height,Fav Color,History,Math,Computers,Physics
Roni,M,1.76,Red,73,91,94,85
Yuval,M,1.68,Blue,81,56,84,62
Hila,F,1.69,Green,86,92,95,89
Alex,F,1.72,Blue,80,90,93,83
Guy,M,1.74,Green,87,43,92,57
Daniel,M,1.75,Black,40,90,85,87
Dana,F,1.74,Blue,81,77,85,69
```

Put `kids.csv` in the same folder as your Python file.

## Loading a CSV file

`read_csv` reads the file and returns a DataFrame.

```python
kids = pd.read_csv('kids.csv')
print(kids)
```

```text
     Name Gender  Height Fav Color  History  Math  Computers  Physics
0    Roni      M    1.76       Red       73    91         94       85
1   Yuval      M    1.68      Blue       81    56         84       62
2    Hila      F    1.69     Green       86    92         95       89
3    Alex      F    1.72      Blue       80    90         93       83
4     Guy      M    1.74     Green       87    43         92       57
5  Daniel      M    1.75     Black       40    90         85       87
6    Dana      F    1.74      Blue       81    77         85       69
```

The numbers on the left (0 to 6) are the **index**: the label of each row. Pandas adds them automatically.

> Tip: in Jupyter or an interactive window, writing just `kids` on the last line of a cell shows the table nicely, without `print`. In a regular `.py` file you need `print(...)`.

## Getting to know the table

### Size, columns and index

```python
print(len(kids))      # 7         -> number of rows
print(kids.shape)     # (7, 8)    -> (rows, columns), just like a NumPy array
print(kids.columns)   # Index(['Name', 'Gender', 'Height', 'Fav Color', 'History', 'Math', 'Computers', 'Physics'])
print(kids.index)     # RangeIndex(start=0, stop=7, step=1)
```

### A quick look: `head` and `tail`

With thousands of rows we don't want to print everything. `head()` shows the first 5 rows and `tail()` the last 5. You can pass a number:

```python
print(kids.head(3))
```

```text
    Name Gender  Height Fav Color  History  Math  Computers  Physics
0   Roni      M    1.76       Red       73    91         94       85
1  Yuval      M    1.68      Blue       81    56         84       62
2   Hila      F    1.69     Green       86    92         95       89
```

```python
print(kids.tail(2))
```

```text
     Name Gender  Height Fav Color  History  Math  Computers  Physics
5  Daniel      M    1.75     Black       40    90         85       87
6    Dana      F    1.74      Blue       81    77         85       69
```

### `info`: what kind of data is in each column?

```python
kids.info()
```

```text
RangeIndex: 7 entries, 0 to 6
Data columns (total 8 columns):
 #   Column     Non-Null Count  Dtype
---  ------     --------------  -----
 0   Name       7 non-null      str
 1   Gender     7 non-null      str
 2   Height     7 non-null      float64
 3   Fav Color  7 non-null      str
 4   History    7 non-null      int64
 5   Math       7 non-null      int64
 6   Computers  7 non-null      int64
 7   Physics    7 non-null      int64
```

For each column we see how many values are filled in (**Non-Null**; missing values are not counted) and the type: text (`str`, shown as `object` in older pandas versions), whole numbers (`int64`) or decimal numbers (`float64`). This is the first thing to check with new data.

> `info()` prints by itself, so we don't wrap it in `print`.

### `describe`: statistics in one line

```python
print(kids.describe())
```

```text
         Height    History       Math  Computers    Physics
count  7.000000   7.000000   7.000000   7.000000   7.000000
mean   1.725714  75.428571  77.000000  89.714286  76.000000
std    0.030472  16.277358  19.815819   4.820591  13.076697
min    1.680000  40.000000  43.000000  84.000000  57.000000
25%    1.705000  76.500000  66.500000  85.000000  65.500000
50%    1.740000  81.000000  90.000000  92.000000  83.000000
75%    1.745000  83.500000  90.500000  93.500000  86.000000
max    1.760000  87.000000  92.000000  95.000000  89.000000
```

For every **number** column we get the count, mean (average), standard deviation (how spread out the values are), minimum, maximum and the quartiles (`50%` is the median, the middle value).

`describe(include='all')` adds the text columns too. For them it shows how many different values there are (`unique`), the most common one (`top`) and how often it appears (`freq`). For example, `Gender` has 2 unique values and the most common is `M`, which appears 4 times. Where a statistic doesn't make sense (the mean of names), pandas writes `NaN` ("Not a Number", meaning "no value").

## Selecting by position: `iloc`

`iloc` stands for **i**nteger **loc**ation. It works exactly like indexing a 2D NumPy array: `kids.iloc[rows, columns]`, counting from 0.

```python
print(kids.iloc[0])        # the first row (all columns)
```

```text
Name         Roni
Gender          M
Height       1.76
Fav Color     Red
History        73
Math           91
Computers      94
Physics        85
Name: 0, dtype: object
```

A single row comes back as a **Series**: a one-column list of values, each with a label. A DataFrame is really a group of Series side by side.

```python
print(kids.iloc[0, 3])     # Red  -> row 0, column 3 (Fav Color)
```

Slices work like in Python and NumPy. **The end is not included**:

```python
print(kids.iloc[2:5, 0:5])   # rows 2, 3, 4 and columns 0 to 4
```

```text
   Name Gender  Height Fav Color  History
2  Hila      F    1.69     Green       86
3  Alex      F    1.72      Blue       80
4   Guy      M    1.74     Green       87
```

`:` means "all of them", and a list picks specific positions, in the order you write them:

```python
kids.iloc[:, 0:5]      # all rows, the first 5 columns
kids.iloc[:, [0, 6]]   # all rows, columns 0 and 6 (Name, Computers)
kids.iloc[:, [6, 0]]   # the same two columns, in the opposite order
```

```text
   Computers    Name
0         94    Roni
1         84   Yuval
...
```

### From pandas back to NumPy: `.values`

`.values` takes the data out of the table and gives back a plain NumPy array (without the column names and index):

```python
data = kids.iloc[:, 4:].values   # just the grades
print(data)
print(type(data))                # <class 'numpy.ndarray'>
```

```text
[[73 91 94 85]
 [81 56 84 62]
 [86 92 95 89]
 [80 90 93 83]
 [87 43 92 57]
 [40 90 85 87]
 [81 77 85 69]]
```

Now every NumPy tool works on it. For example, `reshape(-1)` flattens the 2D array into one long row of all 28 grades:

```python
print(data.reshape(-1))
# [73 91 94 85 81 56 84 62 86 92 95 89 80 90 93 83 87 43 92 57 40 90 85 87 81 77 85 69]
```

## Selecting by name: `loc`

Counting column numbers is easy to get wrong. `loc` selects by **labels**: the names of the rows (index) and columns. The form is the same: `kids.loc[rows, columns]`.

```python
kids.loc[:, 'Math']                 # one column -> a Series
kids.loc[:, ['Math', 'Physics']]    # a list of columns -> a DataFrame
new_data = kids.loc[:, ['Math', 'Physics']]   # save it as a new table
```

```python
print(kids.loc[2:5, ['Math', 'Physics']])
```

```text
   Math  Physics
2    92       89
3    90       83
4    43       57
5    90       87
```

> **Watch out:** with `loc`, the end of a slice **is included**. `kids.loc[2:5]` gives rows 2, 3, 4 **and 5**, while `kids.iloc[2:5]` gives only 2, 3, 4. That's because `loc` slices by label ("from label 2 to label 5"), not by position.

### Using a column as the index: `set_index`

Row labels 0 to 6 don't mean much. It's nicer to find a row by the kid's name. `set_index` turns a column into the index:

```python
kids.set_index('Name')
print(kids.index)       # RangeIndex(start=0, stop=7, step=1)  <- nothing changed!
```

Most pandas methods **don't change the original table**. They return a new, changed copy. To keep the change we can either save the result, or use `inplace=True` to change `kids` itself:

```python
kids = kids.set_index('Name')        # option 1: save the new table
kids.set_index('Name', inplace=True) # option 2: change kids in place (use one of them, not both!)
print(kids.index)
# Index(['Roni', 'Yuval', 'Hila', 'Alex', 'Guy', 'Daniel', 'Dana'], name='Name')
```

Now `loc` can use names:

```python
print(kids.loc['Hila'])              # Hila's whole row
print(kids.loc['Hila', 'Physics'])   # 89
print(kids.loc[['Hila', 'Dana'], ['Math', 'Physics']])
```

```text
      Math  Physics
Name
Hila    92       89
Dana    77       69
```

### A shortcut for a whole column

Getting a whole column is so common that there's a shorter way:

```python
kids.loc[:, 'Physics']   # the full form
kids['Physics']          # the shortcut, same result
```

## Adding columns and rows

Assigning to a column name that doesn't exist yet **creates** it. Here we give every kid a random Sports grade between 70 and 79 (we need one value per row, so `size=len(kids)`):

```python
kids.loc[:, 'Sports'] = np.random.randint(70, 80, size=len(kids))
```

The same idea works for rows. Assigning to a new index label adds a row, with one value per column, in order:

```python
kids.loc['Erez'] = ['M', 1.79, 'Green', 90, 98, 95, 100, 85]
print(kids)
```

```text
       Gender  Height Fav Color  History  Math  Computers  Physics  Sports
Name
Roni        M    1.76       Red       73    91         94       85      75
Yuval       M    1.68      Blue       81    56         84       62      78
Hila        F    1.69     Green       86    92         95       89      79
Alex        F    1.72      Blue       80    90         93       83      75
Guy         M    1.74     Green       87    43         92       57      70
Daniel      M    1.75     Black       40    90         85       87      70
Dana        F    1.74      Blue       81    77         85       69      71
Erez        M    1.79     Green       90    98         95      100      85
```

> The Sports grades are random, so yours will be different, and so will every result below that uses them.

## Calculating: `mean` and `axis`

The NumPy methods (`mean`, `sum`, `min`, `max`, ...) work on pandas too:

```python
print(kids.loc[:, 'Physics'].mean())   # 79.0
```

A label slice with nothing after the colon means "from this column to the end". So `kids.loc[:, 'History':]` is all the grade columns. Its `mean()` calculates **down each column** (the average grade in each subject):

```python
print(kids.loc[:, 'History':].mean())
```

```text
History      77.250
Math         79.625
Computers    90.375
Physics      79.000
Sports       75.375
```

With `axis=1` it calculates **across each row** instead (the average of each kid):

```python
print(kids.loc[:, 'History':].mean(axis=1))
```

```text
Name
Roni      83.6
Yuval     72.2
Hila      88.2
...
Erez      93.6
```

> Remember: `axis=0` (the default) goes **down** the rows and gives one result per column. `axis=1` goes **across** the columns and gives one result per row.

We can save the row averages as a new column:

```python
kids.loc[:, 'Mean Score'] = kids.loc[:, 'History':].mean(axis=1)
```

## Sorting: `sort_values`

```python
kids.sort_values('Mean Score')                    # lowest first
kids.sort_values('Mean Score', ascending=False)   # highest first
kids.sort_values('Mean Score', ascending=False, inplace=True)   # keep the new order
print(kids.loc[:, ['Physics', 'Sports', 'Mean Score']])
```

```text
      Physics  Sports  Mean Score
Name
Erez      100      85        93.6
Hila       89      79        88.2
Alex       83      75        84.2
Roni       85      75        83.6
Dana       69      71        76.6
Daniel     87      70        74.4
Yuval      62      78        72.2
Guy        57      70        69.8
```

Just like `set_index`, without `inplace=True` (or saving the result) the original order stays the same.

## Saving to Excel

```python
kids.to_excel('kids.xlsx')
```

This creates an Excel file next to your Python file, with the index (the names) as the first column. Use `kids.to_csv('kids_new.csv')` to save a CSV instead.

### Exercise: Realistic vs Humanistic

Create an Excel file with one row per kid and two columns:

- **Realistic**: the average of the kid's Math, Computers and Physics grades.
- **Humanistic**: the kid's History grade.

Sort it from the highest Realistic average to the lowest and save it as `realistic_vs_humanistic.xlsx`.

Solution:

```python
report = pd.DataFrame()
report['Realistic'] = kids.loc[:, ['Math', 'Computers', 'Physics']].mean(axis=1).round(1)
report['Humanistic'] = kids['History']
report.sort_values('Realistic', ascending=False, inplace=True)
report.to_excel('realistic_vs_humanistic.xlsx')
print(report)
```

```text
      Realistic  Humanistic
Name
Erez       97.7          90
Hila       92.0          86
Roni       90.0          73
Alex       88.7          80
Daniel     87.3          40
Dana       77.0          81
Yuval      67.3          81
Guy        64.0          87
```

> **Pandas + PySide6:** pandas does the data work and PySide6 gives it a window. For example, a program could have a **Load** button that reads a CSV with `pd.read_csv`, a table widget that shows the DataFrame, and an **Export** button that calls `to_excel`. The user gets a real app with buttons, and you only write a few lines of pandas inside the slots.

## Counting values: `value_counts`

For a text column, `value_counts()` counts how many times each value appears, from the most common down:

```python
print(kids.loc[:, 'Fav Color'].value_counts())
```

```text
Fav Color
Green    3
Blue     3
Red      1
Black    1
```

## Graphs straight from pandas

Every Series and DataFrame has a `plot` method that draws a matplotlib graph. Pass `kind` to choose the type of graph. In a `.py` file, add `import matplotlib.pyplot as plt` and call `plt.show()` after the plot to open the window.

### A bar chart of the favourite colours

```python
kids.loc[:, 'Fav Color'].value_counts().plot(kind='bar', color='green', title='Favorite Colors',
                                             xlabel='Color', ylabel='Count')
```

![Bar chart of favorite colors](content/images/pandas_colors_bar.png)

Notice how we **chain** methods: `value_counts()` returns a Series, and we call `plot` on that Series straight away.

### A bar for every kid

```python
kids.loc[:, 'Mean Score'].plot(kind='bar')
```

![Bar chart of each kid's mean score](content/images/pandas_mean_bar.png)

The index (the names) becomes the labels on the x axis.

### A scatter plot: Math vs Physics

For a scatter plot we call `plot` on the whole DataFrame and give the names of the x and y columns:

```python
kids.plot('Math', 'Physics', kind='scatter', title='Math vs Physics', xlabel='Math', ylabel='Physics')
```

![Scatter plot of Math against Physics grades](content/images/pandas_scatter.png)

Each dot is one kid. The dots go up from left to right: kids who are good at Math tend to be good at Physics too.

## Filtering rows

### Step 1: a comparison gives True/False for every row

Comparing a column to a value checks **every row** at once, just like with NumPy arrays:

```python
print(kids.loc[:, 'Fav Color'] == 'Green')
```

```text
Name
Erez       True
Hila       True
Alex      False
Roni      False
Dana      False
Daniel    False
Yuval     False
Guy        True
Name: Fav Color, dtype: bool
```

### Step 2: use the True/False list to pick rows

Putting that list of True/False values (a **filter**, or **mask**) inside `loc` keeps only the rows that are `True`:

```python
green_filter = kids.loc[:, 'Fav Color'] == 'Green'
print(kids.loc[green_filter])
```

The short way, all in one line:

```python
print(kids[kids['Fav Color'] == 'Green'])
```

```text
     Gender  Height Fav Color  History  Math  Computers  Physics  Sports  Mean Score
Name
Erez      M    1.79     Green       90    98         95      100      85        93.6
Hila      F    1.69     Green       86    92         95       89      79        88.2
Guy       M    1.74     Green       87    43         92       57      70        69.8
```

### Exercise: good at Physics

Which kids got a grade of 80 or more in Physics?

Solution:

```python
print(kids[kids['Physics'] >= 80])
```

Erez, Hila, Alex, Roni and Daniel.

### Combining conditions: `&` and `|`

To combine conditions, use `&` for **and** and `|` for **or**. Each condition **must be inside its own brackets**:

```python
phys_and_math_filter = (kids['Physics'] >= 80) & (kids['Math'] >= 80)
print(kids[phys_and_math_filter])    # 80 or more in Physics AND in Math
```

```python
kids[(kids['Physics'] >= 80) | (kids['Math'] >= 80)]    # 80 or more in at least one of them
```

> **Watch out:** Python's `and` / `or` don't work here and raise an error, because they can't compare whole columns. Always use `&` / `|`, with brackets around each condition.

## Summary

| What | How |
|------|-----|
| Load a CSV file | `kids = pd.read_csv('kids.csv')` |
| Size, columns, row labels | `len(kids)`, `kids.shape`, `kids.columns`, `kids.index` |
| First / last rows | `kids.head()`, `kids.tail()` |
| Column types, statistics | `kids.info()`, `kids.describe()` |
| Select by position (end not included) | `kids.iloc[2:5, 0:5]` |
| Select by name (end included) | `kids.loc['Hila', 'Physics']` |
| One column | `kids['Physics']` |
| To a NumPy array | `kids.values` |
| Names as the index | `kids.set_index('Name', inplace=True)` |
| New column / new row | `kids.loc[:, 'Sports'] = ...`, `kids.loc['Erez'] = [...]` |
| Average of each column / each row | `.mean()`, `.mean(axis=1)` |
| Sort | `kids.sort_values('Mean Score', ascending=False)` |
| Save to Excel | `kids.to_excel('kids.xlsx')` |
| Count values | `kids['Fav Color'].value_counts()` |
| Draw a graph | `.plot(kind='bar')`, `kids.plot('Math', 'Physics', kind='scatter')` |
| Filter rows | `kids[(kids['Physics'] >= 80) & (kids['Math'] >= 80)]` |
