# Dispersion: Measures of Spread

A center tells you what a typical value is. It does **not** tell you how much the values differ from each other. For that we need a measure of **dispersion** (also called **spread** or **variability**).

Here are the quiz scores of two classes:

```python
class_a = [5, 6, 7, 7, 7, 8, 9]
class_b = [2, 3, 7, 7, 10, 10, 10]
```

Both classes have a mean of 7, and a median of 7 too. Are they the same?

![Two dot plots. Class A's scores are close together, between 5 and 9. Class B's scores go from 2 to 10. Both have a mean of 7](content/images/stats_same_mean_spread.svg)

Not at all! In class A everyone is close to 7. In class B some students struggle and some get full marks. A teacher would teach these two classes very differently. The measures below put a number on this difference.

## Range

The simplest measure: the largest value minus the smallest.

- Class A: 9 − 5 = **4**
- Class B: 10 − 2 = **8**

The range is easy to compute, but it only looks at two values, the two most extreme ones. One outlier can make it huge.

## Variance and standard deviation

These measure the **typical distance from the mean**, using every value. Let's compute them step by step for the goals a team scored in 8 games:

```python
goals = [4, 2, 5, 9, 4, 7, 4, 5]
```

![Goals in 8 games with the mean of 5 drawn as a line. Each game has a bar to the mean: -1, -3, 0, +4, -1, +2, -1, 0. The squares add up to 32, the variance is 4 and the standard deviation is 2](content/images/stats_deviations.svg)

1. **Find the mean:** 40 / 8 = **5**.
2. **Find each deviation**, the distance from the mean: −1, −3, 0, +4, −1, +2, −1, 0.
3. **Square each deviation:** 1, 9, 0, 16, 1, 4, 1, 0. Why square? If we just added the deviations, the minuses and the pluses would cancel out, and the sum would always be 0. Squaring makes them all positive.
4. **Average the squares:** 32 / 8 = **4**. This is the **variance**.
5. **Take the square root:** √4 = **2**. This is the **standard deviation** (std).

```math
\sigma^2 = \frac{\sum (x_i - \bar{x})^2}{n} \qquad \sigma = \sqrt{\sigma^2}
```

Why the last step? The variance is in **squared units**: "4 goals squared" doesn't mean much. The square root brings us back to the original units: a typical game is about **2 goals** away from the mean.

For our two classes: the std of class A is about **1.2**, and the std of class B is about **3.1**. Class B's scores are spread out more than twice as much.

### Population or sample?

If your data is **everyone** you care about (the whole class), divide by `n` as above. If it is only a **sample** from a bigger group (100 people out of a whole country), statisticians divide by `n − 1` instead, which gives a slightly bigger result. With a lot of data the difference is tiny. In NumPy you choose with `ddof`:

```python
np.std(goals)          # 2.0   divides by n
np.std(goals, ddof=1)  # ≈2.14  divides by n - 1
```

## The 68-95-99.7 rule

Many things in nature, like heights, have a **bell-shaped** distribution, called the **normal distribution**. For such data the standard deviation tells you a lot:

![A bell curve of student heights with mean 170 and std 10. 68% of the students are between 160 and 180, 95% between 150 and 190, and 99.7% between 140 and 200](content/images/stats_normal_68_95.svg)

- About **68%** of the values are within **1 std** of the mean.
- About **95%** are within **2 std**.
- About **99.7%** are within **3 std**.

So if the mean height is 170 cm and the std is 10 cm, a student who is 205 cm tall is more than 3 std above the mean, which is very rare.

## Quartiles, IQR and the box plot

Remember the median, the value in the middle? **Quartiles** cut the sorted data into four quarters:

- **Q1** (the first quartile): a quarter of the values are below it.
- **Q2** is the median: half of the values are below it.
- **Q3** (the third quartile): three quarters of the values are below it.

The **interquartile range** is **IQR = Q3 − Q1**, the width of the middle half of the data. Like the median, it doesn't care about outliers.

A **box plot** shows all of this in one picture. Here are the minutes 11 students spent on homework:

```python
minutes = [10, 15, 20, 20, 25, 30, 35, 40, 45, 60, 120]
```

![A box plot of homework minutes. The box goes from Q1 = 20 to Q3 = 42.5 with the median 30 inside. The whiskers reach 10 and 60. The value 120 is drawn alone as an outlier](content/images/stats_boxplot.svg)

- The **box** goes from Q1 to Q3, and the line inside it is the median.
- The **whiskers** reach the smallest and largest values that are not outliers.
- An **outlier** is a value more than **1.5 × IQR** beyond the box. Here 1.5 × 22.5 = 33.75, and 42.5 + 33.75 = 76.25, so 120 is an outlier. Maybe that student was not sure the homework was done until it was perfect.

## Which one should I use?

| Measure | Uses | Sensitive to outliers? | Goes well with |
|---------|------|------------------------|----------------|
| Range | Only the min and max | Very | A quick first look |
| Standard deviation | Every value | Yes | The mean |
| IQR | The middle half | No | The median |

## In Python

```python
import numpy as np
import statistics

class_a = [5, 6, 7, 7, 7, 8, 9]
class_b = [2, 3, 7, 7, 10, 10, 10]

print(np.ptp(class_a), np.ptp(class_b))   # 4 8      range ("peak to peak")
print(np.var(class_a), np.var(class_b))   # ≈1.43 ≈9.71  variance
print(np.std(class_a), np.std(class_b))   # ≈1.2 ≈3.12   standard deviation

minutes = [10, 15, 20, 20, 25, 30, 35, 40, 45, 60, 120]
q1, q3 = np.percentile(minutes, [25, 75])
print(q1, q3, q3 - q1)                     # 20.0 42.5 22.5

print(statistics.pstdev(class_b))          # ≈3.12  like np.std (divides by n)
print(statistics.stdev(class_b))           # ≈3.37  like ddof=1 (divides by n - 1)
```

To draw a box plot with Matplotlib:

```python
import matplotlib.pyplot as plt

plt.boxplot(minutes, vert=False)
plt.xlabel("Minutes of homework")
plt.show()
```

### Try it

1. Write your own `my_std(values)` that follows the 5 steps above, and check it against `np.std`.
2. Generate 10,000 random heights with `np.random.normal(170, 10, 10000)`. What fraction of them is between 160 and 180? Is it close to 68%?
