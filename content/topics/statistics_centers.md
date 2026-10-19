# Centers: Measures of Central Tendency

You have a pile of numbers: test scores, salaries, heights, waiting times. You want **one number** that says "this is a typical value". That number is called a **center**, and there are three common ways to find it: the **mean**, the **median** and the **mode**.

We will use one small example all the way through. Nine students took a quiz out of 10:

```python
scores = [6, 10, 3, 6, 9, 5, 10, 6, 8]
```

![Quiz scores of 9 students on a number line. The mode is 6, the most common score. The median is 6, the value in the middle of the sorted list. The mean is 7, the balance point](content/images/stats_mean_median_mode.svg)

## The mean (average)

Add all the values and divide by how many there are:

```math
\bar{x} = \frac{x_1 + x_2 + \dots + x_n}{n}
```

For our quiz: (6 + 10 + 3 + 6 + 9 + 5 + 10 + 6 + 8) / 9 = 63 / 9 = **7**.

A nice way to picture the mean: put the numbers as weights on a ruler. The mean is the point where the ruler **balances**, like the red triangle in the picture. The 3 on the left is far from 7, so it pulls hard, and it balances the two 10s on the right.

## The median (the middle)

Sort the values and take the one in the **middle**:

```
3  5  6  6  [6]  8  9  10  10
```

There are 9 values, so the middle one is the 5th: the median is **6**. Half of the students got 6 or less, and half got 6 or more.

If the number of values is **even**, there are two middle values, and the median is the mean of the two. For `[3, 5, 6, 8]` the median is (5 + 6) / 2 = 5.5.

## The mode (the most common)

The mode is the value that appears **most often**. Three students got 6, more than any other score, so the mode is **6**.

- A data set can have **two modes** or more, e.g. `[1, 1, 2, 2, 3]` has the modes 1 and 2.
- The mode is the only center that works for data that is **not numbers**. The most common favorite color in the class is a mode. You can't compute the "mean color".

## When the mean misleads: outliers

An **outlier** is a value that is far away from all the others. Look at the salaries at a small company:

![Salaries of 8 workers are between 8 and 12 thousand. The boss earns 90 thousand. The median is 10, but the mean is about 18.8, more than any worker earns](content/images/stats_outlier_salaries.svg)

- Mean: (8 + 9 + 9 + 10 + 10 + 10 + 11 + 12 + 90) / 9 ≈ **18.8**
- Median: **10**

If the company says "the average salary here is 18,800 ₪", that is true, but nobody except the boss earns that much! The one huge salary pulls the mean up. The median only cares about the order of the values, so the boss could earn 90 or 900 and the median would still be 10.

That is why news reports about salaries and house prices usually give the **median**.

## Which one should I use?

| Center | What it tells you | Good for | Watch out |
|--------|-------------------|----------|-----------|
| Mean | The balance point | Data without extreme values, e.g. heights | Outliers pull it |
| Median | The middle value | Data with outliers or a long tail, e.g. salaries | Ignores how far the values are |
| Mode | The most common value | Categories (colors, brands), shoe sizes in a shop | There may be several, or none that stands out |

A quick trick: if the mean is much bigger than the median, there are probably some very large values pulling it up (like the boss). If it is much smaller, there are some very small ones.

## In Python

Python has a built-in `statistics` module, and NumPy has the same tools for arrays:

```python
import statistics
import numpy as np

scores = [6, 10, 3, 6, 9, 5, 10, 6, 8]

print(statistics.mean(scores))    # 7
print(statistics.median(scores))  # 6
print(statistics.mode(scores))    # 6

print(np.mean(scores))            # 7.0
print(np.median(scores))          # 6.0

print(statistics.multimode([1, 1, 2, 2, 3]))  # [1, 2]
```

NumPy has no mode function, so use `statistics.mode` (or `statistics.multimode` when there may be more than one).

See the outlier effect yourself:

```python
salaries = [8, 9, 9, 10, 10, 10, 11, 12, 90]
print(np.mean(salaries))    # 18.77...
print(np.median(salaries))  # 10.0
```

### Try it

1. Remove the boss (`90`) from `salaries`. How much do the mean and the median change?
2. Write your own function `my_median(values)` without using `statistics` or NumPy. Hint: `sorted()` and `len()`, and remember the even case.
