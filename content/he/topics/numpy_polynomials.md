# התאמת פולינום

פולינום יכול לתאר את הקשר בין מספרים. NumPy יכולה למצוא פולינום שמתאים לנתונים שנמדדו, ואז להשתמש בו כדי להעריך ערכים חדשים.

## התאמת פולינום

`np.polyfit` מוצאת את המקדמים של פולינום. הארגומנט האחרון הוא המעלה: `1` פירושו קו ישר, `2` פירושו עקומה ריבועית (פרבולה), וכן הלאה.

```python
import numpy as np

x = np.array([0, 1, 2, 3])
y = np.array([1, 3, 5, 7])

coefficients = np.polyfit(x, y, 1)
print(coefficients)  # [2. 1.]
```

המקדמים האלה מתארים את הישר y = 2x + 1.

## חישוב ערכי הפולינום

השתמשו ב-`np.polyval` כדי לחשב ערכים מתוך המקדמים:

```python
new_x = np.array([4, 5])
new_y = np.polyval(coefficients, new_x)
print(new_y)  # [ 9. 11.]
```

אותה פונקציה יכולה לחשב ערך עבור מספר אחד או עבור מערך שלם של מספרים:

```python
print(np.polyval(coefficients, 10))  # 21.0
```

## דוגמה: התאמת עקומה וציור שלה

כאן אנחנו מודדים את הגובה של כדור שנזרק כל חצי שנייה, מתאימים פרבולה (מעלה `2`) למדידות, ומציירים את שתיהן עם Matplotlib. נקודות הנתונים כחולות, הפולינום המותאם הוא קו אדום, והנוסחה כתובה בצד.

```python
import numpy as np
import matplotlib.pyplot as plt

# Height of a thrown ball (meters), measured every half second
time = np.array([0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4])
height = np.array([1.2, 9.5, 15.8, 19.4, 21.1, 20.3, 17.0, 11.6, 3.9])

# Fit a polynomial of degree 2 (a parabola)
a, b, c = np.polyfit(time, height, 2)

# Evaluate the polynomial on many points to draw a smooth curve
smooth_time = np.linspace(0, 4, 100)
smooth_height = np.polyval([a, b, c], smooth_time)

fig, ax = plt.subplots(figsize=(9, 5))
ax.scatter(time, height, color='blue', label='Measured data', zorder=3)
ax.plot(smooth_time, smooth_height, color='red', label='Fitted polynomial')

# Write the formula on the right side of the graph
formula = f'$y = {a:.2f}x^2 {b:+.2f}x {c:+.2f}$'
ax.text(1.05, 0.5, formula, transform=ax.transAxes,
        fontsize=16, color='red', va='center',
        bbox=dict(boxstyle='round', facecolor='white', edgecolor='red'))

ax.set_xlabel('Time (s)')
ax.set_ylabel('Height (m)')
ax.set_title('Fitting a parabola to a thrown ball')
ax.legend(loc='lower center')
fig.tight_layout()
plt.show()
```

![נקודות נתונים כחולות עם פרבולה מותאמת באדום והנוסחה שלה בצד](content/images/numpy_polyfit.png)

כמה פרטים בדוגמה הזו:

- `np.polyfit` מחזירה שלושה מקדמים עבור מעלה 2, כך שאפשר לפרק אותם ישר לתוך `a, b, c`.
- אנחנו מציירים את העקומה עם 100 נקודות מ-`np.linspace`, ולא רק עם 9 הנקודות שנמדדו, כדי שתיראה חלקה.
- טקסט בין `$...$` מצויר כנוסחה מתמטית, כך ש-`x^2` מופיע כ-x².
- הפורמט `{b:+.2f}` תמיד מציג את הסימן, כך שהנוסחה נקראת נכון: `+ 19.19x` או `- 4.63x`.
- `transform=ax.transAxes` ממקם את הטקסט לפי מיקום בתוך אזור הגרף (מ-`0` עד `1`), ו-`1.05` שם אותו קצת מימין לגרף.
