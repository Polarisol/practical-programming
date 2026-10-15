# יסודות SymPy

## מה זה SymPy?

כשאנחנו כותבים `x = 5` ב-Python, `x` הוא סתם שם של מספר. Python יודעת לחשב רק עם ערכים שהיא כבר מכירה. אבל בשיעור מתמטיקה אנחנו עובדים הרבה פעמים עם `x` **לא ידוע**: פותחים את `(x + 1)²`, פותרים את `2x + 3 = 11`, או מוצאים את הנגזרת של `x³`.

**SymPy** (Symbolic Python) היא ספרייה שמאפשרת ל-Python לעשות מתמטיקה מהסוג הזה. היא עובדת עם **סמלים** (symbols) ונותנת תשובות **מדויקות**, בדיוק כמו שהייתם כותבים אותן על דף.

SymPy יודעת לפשט, לפתוח ולפרק לגורמים ביטויים, לפתור משוואות ומערכות משוואות, לגזור, לבצע אינטגרציה, למצוא גבולות, לעבוד עם מטריצות ועוד הרבה. היא חינמית, כתובה כולה ב-Python, והיא דרך טובה לגרום לפרויקט / לרובוט שלכם לפתור בעיות במתמטיקה או בפיזיקה.

## התקנת SymPy

בתיקיית הפרויקט שלכם (ראו **התחלת פרויקט**), הוסיפו את SymPy בעזרת `uv`:

```bash
uv add sympy
```

זהו. `uv` מתקין את SymPy בתוך ה-`.venv` של הפרויקט וכותב אותה לתוך `pyproject.toml`, כך שהפרויקט זוכר שהוא צריך אותה. אם אתם רוצים גם להפוך תוצאות של SymPy לפונקציות NumPy מהירות (בסוף השיעור), הוסיפו גם את NumPy:

```bash
uv add sympy numpy
```

## ייבוא SymPy

הדרך המקובלת היא לייבא את כל הספרייה תחת השם הקצר `sp`:

```python
import sympy as sp
```

ואז כל פונקציה של SymPy מתחילה ב-`sp.`, למשל `sp.sqrt(8)` או `sp.solve(...)`. כך ברור איזה `sqrt` שייך ל-SymPy ואיזה מגיע מ-`math` או מ-NumPy.

בסקריפטים קצרים ובניסויים אפשר לייבא רק את השמות שצריך:

```python
from sympy import symbols, sqrt, solve, diff, integrate
```

> הימנעו מ-`from sympy import *` יחד עם `from math import *` או `from numpy import *`. לכולן יש פונקציות שנקראות `sqrt`, `sin`, `pi` ... והייבוא האחרון מנצח בשקט.

הדוגמאות בהמשך משתמשות ב-`import sympy as sp`.

## שלב 1: מספרים מדויקים

חילוק רגיל ב-Python נותן מספר עשרוני מעוגל. ה-`Rational` של SymPy שומר על השבר המדויק:

```python
print(1 / 3)
print(sp.Rational(1, 3))
print(sp.Rational(1, 3) + sp.Rational(1, 6))
```

```math
0.3333333333333333
\frac{1}{3}
\frac{1}{2}
```

התיבה שמתחת לבלוק קוד מראה מה הקוד מדפיס, בכתיב מתמטי.

גם שורשים וקבועים כמו `pi` נשארים מדויקים, ו-SymPy מפשטת אותם בשבילכם:

```python
print(sp.sqrt(8))
print(sp.sqrt(2) ** 2)   # exactly 2, not 2.0000000000000004
```

```math
2 \sqrt{2}
2
```

כשאתם כן רוצים מספר עשרוני, השתמשו ב-`evalf()` (או ב-`sp.N`). אפשר לבקש כמה ספרות שרוצים:

```python
print(sp.sqrt(8).evalf())   # 2.82842712474619
print(sp.pi.evalf(30))      # 3.14159265358979323846264338328
print(sp.N(sp.sqrt(2), 5))  # 1.4142
```

## שלב 2: סמלים וביטויים

לפני שמשתמשים באות כנעלם, צריך להגיד ל-SymPy שהיא **סמל**:

```python
x, y = sp.symbols('x y')
```

עכשיו אפשר לבנות **ביטויים** (expressions) עם האופרטורים הרגילים של Python. זכרו שחזקות כותבים עם `**`, לא עם `^`.

```python
expr = x**2 + 2*x + 1
print(expr)
print(expr + x)
print(2 * expr)
```

```math
x^{2} + 2 x + 1
x^{2} + 3 x + 1
2 x^{2} + 4 x + 2
```

SymPy מכנסת איברים דומים באופן אוטומטי (`2*x + x` הפך ל-`3*x`).

### הצבת ערכים: `subs`

`subs` מחליפה סמל במספר, או אפילו בביטוי אחר:

```python
print(expr.subs(x, 3))
print(expr.subs(x, y + 1))
```

```math
16
2 y + \left(y + 1\right)^{2} + 3
```

### הדפסה יפה

`sp.pprint` מציירת את הביטוי בצורה "מתמטית" יותר בטרמינל, בעזרת תווי טקסט:

```python
sp.pprint((x**2 - 1) / (x + 3))
```

```math
\frac{x^{2} - 1}{x + 3}
```

> טיפ: ב-Jupyter, מספיק לכתוב את הביטוי בשורה האחרונה של התא כדי לראות אותו בכתיב מתמטי אמיתי.

## שלב 3: סידור מחדש של ביטויים

SymPy לא משנה את הצורה של ביטוי אלא אם ביקשתם ממנה. הפונקציות האלה משנות את הצורה בלי לשנות את הערך:

| פונקציה | מה היא עושה | דוגמה |
|---|---|---|
| `sp.expand` | פותחת סוגריים | `sp.expand((x + 1)**3)` |
| `sp.factor` | כותבת כמכפלה (פירוק לגורמים) | `sp.factor(x**2 - 5*x + 6)` |
| `sp.simplify` | מנסה למצוא את הצורה הפשוטה ביותר | `sp.simplify((x**2 - 1)/(x - 1))` |
| `sp.cancel` | מצמצמת גורמים משותפים בשבר | `sp.cancel((x**2 + 2*x + 1)/(x**2 + x))` |
| `sp.apart` | מפרקת לשברים חלקיים | `sp.apart(1/(x**2 - 1))` |

```math
(x + 1)^{3} = x^{3} + 3 x^{2} + 3 x + 1
x^{2} - 5 x + 6 = \left(x - 3\right) \left(x - 2\right)
\frac{x^{2} - 1}{x - 1} = x + 1
\frac{x^{2} + 2 x + 1}{x^{2} + x} = \frac{x + 1}{x}
\frac{1}{x^{2} - 1} = - \frac{1}{2 \left(x + 1\right)} + \frac{1}{2 \left(x - 1\right)}
```

`simplify` מכירה גם זהויות טריגונומטריות:

```python
print(sp.simplify(sp.sin(x)**2 + sp.cos(x)**2))
```

```math
\sin^{2}{\left(x \right)} + \cos^{2}{\left(x \right)} = 1
```

## שלב 4: פתרון משוואות

`sp.solve(expression, x)` מוצאת את הערכים של `x` שעבורם הביטוי **שווה לאפס**:

```python
print(sp.solve(x**2 - 5*x + 6, x))
```

```math
x^{2} - 5 x + 6 = 0 \quad\Rightarrow\quad x = 2,\ x = 3
```

אם בצד ימין של המשוואה יש משהו שאינו 0, כתבו אותה עם `sp.Eq(left, right)`. (אי אפשר להשתמש כאן ב-`=` או ב-`==`: `=` הוא השמה, ו-`==` בודק אם שני ביטויים זהים.)

```python
print(sp.solve(sp.Eq(2*x + 3, 11), x))
```

```math
2 x + 3 = 11 \quad\Rightarrow\quad x = 4
```

התשובות מדויקות. השתמשו ב-`evalf` אם אתם צריכים מספרים עשרוניים:

```python
solutions = sp.solve(x**2 - 2, x)
print(solutions)
print([s.evalf(4) for s in solutions])   # [-1.414, 1.414]
```

```math
x^{2} - 2 = 0 \quad\Rightarrow\quad x = - \sqrt{2},\ x = \sqrt{2}
```

SymPy מוצאת גם פתרונות מרוכבים (`I` היא היחידה המדומה, √-1):

```python
print(sp.solve(x**2 + 1, x))
```

```math
x^{2} + 1 = 0 \quad\Rightarrow\quad x = - i,\ x = i
```

### מערכות משוואות

מעבירים רשימה של משוואות ורשימה של נעלמים. התשובה היא מילון:

```python
print(sp.solve([x + y - 10, x - y - 2], [x, y]))
```

```math
\begin{cases} x + y = 10 \\ x - y = 2 \end{cases} \quad\Rightarrow\quad x = 6,\ y = 4
```

## שלב 5: חשבון אינפיניטסימלי

### נגזרות: `diff`

```python
print(sp.diff(x**3 + 2*x, x))
print(sp.diff(sp.sin(x) * sp.exp(x), x))   # product rule
print(sp.diff(x**4, x, 2))                 # second derivative
print(sp.diff(x**2 * y**3, y))             # derivative by y; x is a constant
```

```math
\frac{d}{dx}\left(x^{3} + 2 x\right) = 3 x^{2} + 2
\frac{d}{dx}\left(e^{x} \sin{\left(x \right)}\right) = e^{x} \sin{\left(x \right)} + e^{x} \cos{\left(x \right)}
\frac{d^{2}}{dx^{2}}\, x^{4} = 12 x^{2}
\frac{\partial}{\partial y}\left(x^{2} y^{3}\right) = 3 x^{2} y^{2}
```

כדי לקבל את השיפוע בנקודה, קודם גוזרים ואז מציבים:

```python
print(sp.diff(x**2, x).subs(x, 3))
```

```math
\left.\frac{d}{dx}\, x^{2}\right|_{x=3} = 6
```

### אינטגרלים: `integrate`

בלי גבולות מקבלים את הפונקציה הקדומה (SymPy לא מוסיפה את ה-`+ C`). עם tuple מהצורה `(x, a, b)` מקבלים אינטגרל מסוים:

```python
print(sp.integrate(x**2, x))
print(sp.integrate(sp.sin(x), (x, 0, sp.pi)))
print(sp.integrate(sp.exp(-x**2), (x, -sp.oo, sp.oo)))
```

```math
\int x^{2}\, dx = \frac{x^{3}}{3}
\int_{0}^{\pi} \sin{\left(x \right)}\, dx = 2
\int_{-\infty}^{\infty} e^{- x^{2}}\, dx = \sqrt{\pi}
```

`sp.oo` (שתי אותיות o) הוא אינסוף.

### גבולות: `limit`

```python
print(sp.limit(sp.sin(x) / x, x, 0))
print(sp.limit(1 / x, x, 0, '+'))         # from the right
print(sp.limit((1 + 1/x)**x, x, sp.oo))   # the number e
```

```math
\lim_{x \to 0} \frac{\sin{\left(x \right)}}{x} = 1
\lim_{x \to 0^{+}} \frac{1}{x} = \infty
\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^{x} = e
```

### טורים

`series` כותבת פונקציה כפולינום סביב נקודה (טור טיילור). ה-`O(x**8)` מסמן את "שאר האיברים":

```python
print(sp.series(sp.sin(x), x, 0, 8))
```

```math
\sin{\left(x \right)} = x - \frac{x^{3}}{6} + \frac{x^{5}}{120} - \frac{x^{7}}{5040} + O\left(x^{8}\right)
```

ו-`summation` יודעת לסכם אפילו סכומים אינסופיים:

```python
n = sp.symbols('n')
print(sp.summation(1 / n**2, (n, 1, sp.oo)))
```

```math
\sum_{n=1}^{\infty} \frac{1}{n^{2}} = \frac{\pi^{2}}{6}
```

## שלב 6: מטריצות

מטריצות של SymPy עובדות כמו מטריצות של NumPy, אבל התשובות מדויקות, והן יכולות להכיל סמלים:

```python
M = sp.Matrix([[1, 2], [3, 4]])
print(M.det())
print(M.inv())
print(M.eigenvals())

a, b = sp.symbols('a b')
A = sp.Matrix([[a, b], [b, a]])
print(A.det())
print(A.eigenvals())
```

```math
M = \left[\begin{matrix}1 & 2\\3 & 4\end{matrix}\right] \qquad \det M = -2 \qquad M^{-1} = \left[\begin{matrix}-2 & 1\\\frac{3}{2} & - \frac{1}{2}\end{matrix}\right]
\lambda = \frac{5}{2} - \frac{\sqrt{33}}{2},\ \ \lambda = \frac{5}{2} + \frac{\sqrt{33}}{2}
A = \left[\begin{matrix}a & b\\b & a\end{matrix}\right] \qquad \det A = a^{2} - b^{2} \qquad \lambda = a - b,\ \ \lambda = a + b
```

ב-`eigenvals`, המספר שאחרי כל ערך עצמי הוא כמה פעמים הוא מופיע (הריבוי שלו).

## שלב 7: משוואות דיפרנציאליות

משוואה דיפרנציאלית מקשרת בין פונקציה לנגזרות שלה. קודם מגדירים את `f` כ**פונקציה** לא ידועה, ואז פותרים עם `dsolve`. `C1` ו-`C2` הם הקבועים שתנאי ההתחלה היו קובעים.

```python
f = sp.Function('f')

print(sp.dsolve(f(x).diff(x) - f(x), f(x)))
print(sp.dsolve(f(x).diff(x, 2) + f(x), f(x)))
```

```math
f'(x) = f(x) \quad\Rightarrow\quad f{\left(x \right)} = C_{1} e^{x}
f''(x) + f(x) = 0 \quad\Rightarrow\quad f{\left(x \right)} = C_{1} \sin{\left(x \right)} + C_{2} \cos{\left(x \right)}
```

## שלב 8: מסמלים חזרה למספרים

SymPy מדויקת, אבל איטית כשצריך לחשב ביטוי עבור אלפי ערכים (למשל, כדי לצייר גרף). `sp.lambdify` הופכת ביטוי לפונקציית Python רגילה ומהירה שעובדת על מערכים של NumPy:

```python
import numpy as np

g = sp.lambdify(x, x**2 + 1)
print(g(np.array([0, 1, 2])))   # [1 2 5]
```

זו הדרך המקובלת לשלב את שתי הספריות: משתמשים ב-SymPy כדי למצוא את הנוסחה (למשל נגזרת), ואז מפעילים עליה `lambdify` ומשתמשים ב-NumPy וב-Matplotlib כדי לחשב ולצייר אותה.

וכדי להכניס תוצאה לדוח או למצגת, `sp.latex` נותנת את קוד ה-LaTeX של כל ביטוי:

```python
print(sp.latex(sp.Integral(x**2, x)))   # \int x^{2}\, dx
```

כך נראה קוד ה-LaTeX הזה אחרי שהוא מצויר:

```math
\int x^{2}\, dx
```

## סיכום

| משימה | קוד |
|---|---|
| התקנה | `uv add sympy` |
| ייבוא | `import sympy as sp` |
| שבר מדויק | `sp.Rational(1, 3)` |
| ערך עשרוני | `expr.evalf()` או `sp.N(expr, digits)` |
| יצירת סמלים | `x, y = sp.symbols('x y')` |
| הצבה | `expr.subs(x, 3)` |
| פתיחה / פירוק לגורמים / פישוט | `sp.expand(e)`, `sp.factor(e)`, `sp.simplify(e)` |
| פתרון `expr = 0` | `sp.solve(expr, x)` |
| פתרון `left = right` | `sp.solve(sp.Eq(left, right), x)` |
| נגזרת | `sp.diff(e, x)` |
| אינטגרל | `sp.integrate(e, x)` או `sp.integrate(e, (x, a, b))` |
| גבול | `sp.limit(e, x, point)` |
| מטריצה | `sp.Matrix([[1, 2], [3, 4]])` |
| משוואה דיפרנציאלית | `sp.dsolve(equation, f(x))` |
| לפונקציית NumPy מהירה | `sp.lambdify(x, e)` |
