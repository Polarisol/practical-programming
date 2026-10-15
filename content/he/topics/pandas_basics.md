# יסודות pandas: חוקרים טבלה של ילדים

## למה להשתמש ב-pandas?

NumPy מצוינת למערכים של מספרים, אבל נתונים אמיתיים נראים בדרך כלל כמו **טבלה**: כל שורה היא אדם (או מוצר, או יום) וכל עמודה היא סוג מידע אחר, חלק מספרים וחלק טקסט. pandas נותנת לנו את ה-**DataFrame**, טבלה עם עמודות בעלות שם ושורות עם תוויות. אפשר לטעון אותה מקובץ, להסתכל עליה, לבחור חלקים ממנה, לחשב, למיין, לסנן, לצייר גרפים ולשמור אותה ל-Excel, והכול בכמה שורות קוד.

pandas בנויה מעל NumPy, אז כל מה שאתם יודעים על מערכים עדיין עוזר כאן.

## ייבוא (Imports)

```python
import pandas as pd
import numpy as np
```

אם pandas עדיין לא מותקנת, הריצו `pip install pandas matplotlib openpyxl` (matplotlib משמשת לגרפים ו-openpyxl לשמירת קובצי Excel).

## הנתונים

כל הדוגמאות משתמשות בקובץ קטן בשם `kids.csv` (אפשר להוריד אותו מהחלק **Files** של היחידה הזו). קובץ CSV הוא טקסט פשוט: שורה אחת לכל רשומה, עם פסיקים בין הערכים. השורה הראשונה מכילה את שמות העמודות.

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

שימו את `kids.csv` באותה תיקייה שבה נמצא קובץ ה-Python שלכם.

## טעינת קובץ CSV

`read_csv` קוראת את הקובץ ומחזירה DataFrame.

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

המספרים משמאל (0 עד 6) הם ה-**אינדקס** (index): התווית של כל שורה. pandas מוסיפה אותם אוטומטית.

> טיפ: ב-Jupyter או בחלון אינטראקטיבי, מספיק לכתוב `kids` בשורה האחרונה של התא כדי לראות את הטבלה בצורה יפה, בלי `print`. בקובץ `.py` רגיל צריך `print(...)`.

## מכירים את הטבלה

### גודל, עמודות ואינדקס

```python
print(len(kids))      # 7         -> number of rows
print(kids.shape)     # (7, 8)    -> (rows, columns), just like a NumPy array
print(kids.columns)   # Index(['Name', 'Gender', 'Height', 'Fav Color', 'History', 'Math', 'Computers', 'Physics'])
print(kids.index)     # RangeIndex(start=0, stop=7, step=1)
```

### הצצה מהירה: `head` ו-`tail`

כשיש אלפי שורות, אנחנו לא רוצים להדפיס הכול. `head()` מציגה את 5 השורות הראשונות ו-`tail()` את 5 האחרונות. אפשר להעביר מספר:

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

### `info`: איזה סוג נתונים יש בכל עמודה?

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

לכל עמודה אנחנו רואים כמה ערכים מלאים בה (**Non-Null**; ערכים חסרים לא נספרים) ואת הסוג: טקסט (`str`, שמוצג כ-`object` בגרסאות ישנות של pandas), מספרים שלמים (`int64`) או מספרים עשרוניים (`float64`). זה הדבר הראשון שבודקים כשמקבלים נתונים חדשים.

> `info()` מדפיסה בעצמה, אז לא עוטפים אותה ב-`print`.

### `describe`: סטטיסטיקה בשורה אחת

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

לכל עמודה **מספרית** אנחנו מקבלים את מספר הערכים, הממוצע, סטיית התקן (כמה הערכים מפוזרים), המינימום, המקסימום והרבעונים (`50%` הוא החציון, הערך האמצעי).

`describe(include='all')` מוסיפה גם את עמודות הטקסט. עבורן היא מציגה כמה ערכים שונים יש (`unique`), מהו הנפוץ ביותר (`top`) וכמה פעמים הוא מופיע (`freq`). למשל, ל-`Gender` יש 2 ערכים שונים, והנפוץ ביותר הוא `M`, שמופיע 4 פעמים. במקום שבו לסטטיסטיקה אין משמעות (ממוצע של שמות...), pandas כותבת `NaN` ("Not a Number", כלומר "אין ערך").

## בחירה לפי מיקום: `iloc`

`iloc` הוא קיצור של **i**nteger **loc**ation (מיקום במספרים שלמים). הוא עובד בדיוק כמו גישה לאינדקסים במערך NumPy דו-ממדי: `kids.iloc[rows, columns]`, וסופרים מ-0.

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

שורה בודדת חוזרת כ-**Series**: רשימה של ערכים בעמודה אחת, שלכל אחד מהם יש תווית. DataFrame הוא בעצם אוסף של Series זו לצד זו.

```python
print(kids.iloc[0, 3])     # Red  -> row 0, column 3 (Fav Color)
```

חיתוכים (slices) עובדים כמו ב-Python וב-NumPy. **הסוף לא נכלל**:

```python
print(kids.iloc[2:5, 0:5])   # rows 2, 3, 4 and columns 0 to 4
```

```text
   Name Gender  Height Fav Color  History
2  Hila      F    1.69     Green       86
3  Alex      F    1.72      Blue       80
4   Guy      M    1.74     Green       87
```

`:` פירושו "את כולם", ורשימה בוחרת מיקומים מסוימים, בסדר שבו כתבתם אותם:

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

### מ-pandas בחזרה ל-NumPy: `.values`

`.values` מוציאה את הנתונים מהטבלה ומחזירה מערך NumPy רגיל (בלי שמות העמודות והאינדקס):

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

עכשיו כל הכלים של NumPy עובדים עליו. למשל, `reshape(-1)` משטחת את המערך הדו-ממדי לשורה ארוכה אחת של כל 28 הציונים:

```python
print(data.reshape(-1))
# [73 91 94 85 81 56 84 62 86 92 95 89 80 90 93 83 87 43 92 57 40 90 85 87 81 77 85 69]
```

## בחירה לפי שם: `loc`

קל לטעות כשסופרים מספרי עמודות. `loc` בוחרת לפי **תוויות**: השמות של השורות (האינדקס) ושל העמודות. הצורה זהה: `kids.loc[rows, columns]`.

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

> **שימו לב:** עם `loc`, סוף החיתוך **כן נכלל**. `kids.loc[2:5]` נותנת את השורות 2, 3, 4 **ו-5**, בעוד ש-`kids.iloc[2:5]` נותנת רק את 2, 3, 4. זה כי `loc` חותכת לפי תווית ("מהתווית 2 עד התווית 5"), ולא לפי מיקום.

### עמודה בתור אינדקס: `set_index`

תוויות השורות 0 עד 6 לא אומרות הרבה. יותר נוח למצוא שורה לפי שם הילד. `set_index` הופכת עמודה לאינדקס:

```python
kids.set_index('Name')
print(kids.index)       # RangeIndex(start=0, stop=7, step=1)  <- nothing changed!
```

רוב המתודות של pandas **לא משנות את הטבלה המקורית**. הן מחזירות עותק חדש ומשונה. כדי לשמור את השינוי אפשר או לשמור את התוצאה, או להשתמש ב-`inplace=True` כדי לשנות את `kids` עצמה:

```python
kids = kids.set_index('Name')        # option 1: save the new table
kids.set_index('Name', inplace=True) # option 2: change kids in place (use one of them, not both!)
print(kids.index)
# Index(['Roni', 'Yuval', 'Hila', 'Alex', 'Guy', 'Daniel', 'Dana'], name='Name')
```

עכשיו `loc` יכולה להשתמש בשמות:

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

### קיצור דרך לעמודה שלמה

לקחת עמודה שלמה זה דבר כל כך נפוץ, שיש לזה דרך קצרה יותר:

```python
kids.loc[:, 'Physics']   # the full form
kids['Physics']          # the shortcut, same result
```

## הוספת עמודות ושורות

השמה לשם של עמודה שעדיין לא קיימת **יוצרת** אותה. כאן אנחנו נותנים לכל ילד ציון אקראי בספורט בין 70 ל-79 (צריך ערך אחד לכל שורה, ולכן `size=len(kids)`):

```python
kids.loc[:, 'Sports'] = np.random.randint(70, 80, size=len(kids))
```

אותו רעיון עובד גם לשורות. השמה לתווית אינדקס חדשה מוסיפה שורה, עם ערך אחד לכל עמודה, לפי הסדר:

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

> ציוני הספורט אקראיים, אז אצלכם הם יהיו שונים, וכך גם כל תוצאה בהמשך שמשתמשת בהם.

## חישובים: `mean` ו-`axis`

המתודות של NumPy (`mean`, `sum`, `min`, `max`, ...) עובדות גם ב-pandas:

```python
print(kids.loc[:, 'Physics'].mean())   # 79.0
```

חיתוך לפי תווית בלי כלום אחרי הנקודתיים פירושו "מהעמודה הזו ועד הסוף". לכן `kids.loc[:, 'History':]` הן כל עמודות הציונים. ה-`mean()` שלה מחשבת **לאורך כל עמודה, מלמעלה למטה** (הציון הממוצע בכל מקצוע):

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

עם `axis=1` היא מחשבת במקום זאת **לרוחב כל שורה** (הממוצע של כל ילד):

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

> זכרו: `axis=0` (ברירת המחדל) הולך **למטה** לאורך השורות ונותן תוצאה אחת לכל עמודה. `axis=1` הולך **לרוחב** העמודות ונותן תוצאה אחת לכל שורה.

אפשר לשמור את ממוצעי השורות כעמודה חדשה:

```python
kids.loc[:, 'Mean Score'] = kids.loc[:, 'History':].mean(axis=1)
```

## מיון: `sort_values`

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

בדיוק כמו ב-`set_index`, בלי `inplace=True` (או שמירה של התוצאה) הסדר המקורי נשאר כמו שהוא.

## שמירה ל-Excel

```python
kids.to_excel('kids.xlsx')
```

זה יוצר קובץ Excel ליד קובץ ה-Python שלכם, כשהאינדקס (השמות) הוא העמודה הראשונה. כדי לשמור CSV במקום, השתמשו ב-`kids.to_csv('kids_new.csv')`.

### תרגיל: ריאליסטים מול הומניסטים

צרו קובץ Excel עם שורה אחת לכל ילד ושתי עמודות:

- **Realistic**: הממוצע של ציוני הילד במתמטיקה (Math), מחשבים (Computers) ופיזיקה (Physics).
- **Humanistic**: הציון של הילד בהיסטוריה (History).

מיינו אותו מהממוצע הריאליסטי הגבוה ביותר לנמוך ביותר ושמרו אותו בשם `realistic_vs_humanistic.xlsx`.

פתרון:

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

> **pandas + PySide6:** pandas עושה את העבודה עם הנתונים ו-PySide6 נותנת לה חלון. למשל, תוכנית יכולה לכלול כפתור **Load** שקורא CSV עם `pd.read_csv`, וידג'ט טבלה שמציג את ה-DataFrame, וכפתור **Export** שקורא ל-`to_excel`. המשתמש מקבל אפליקציה אמיתית עם כפתורים, ואתם כותבים רק כמה שורות של pandas בתוך ה-slots.

## ספירת ערכים: `value_counts`

עבור עמודת טקסט, `value_counts()` סופרת כמה פעמים מופיע כל ערך, מהנפוץ ביותר ומטה:

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

## גרפים ישר מ-pandas

לכל Series ולכל DataFrame יש מתודה `plot` שמציירת גרף של matplotlib. מעבירים `kind` כדי לבחור את סוג הגרף. בקובץ `.py`, הוסיפו `import matplotlib.pyplot as plt` וקראו ל-`plt.show()` אחרי הציור כדי לפתוח את החלון.

### גרף עמודות של הצבעים האהובים

```python
kids.loc[:, 'Fav Color'].value_counts().plot(kind='bar', color='green', title='Favorite Colors',
                                             xlabel='Color', ylabel='Count')
```

![גרף עמודות של הצבעים האהובים](content/images/pandas_colors_bar.png)

שימו לב איך אנחנו **משרשרים** מתודות: `value_counts()` מחזירה Series, ואנחנו קוראים ל-`plot` על ה-Series הזו מיד.

### עמודה לכל ילד

```python
kids.loc[:, 'Mean Score'].plot(kind='bar')
```

![גרף עמודות של הציון הממוצע של כל ילד](content/images/pandas_mean_bar.png)

האינדקס (השמות) הופך לתוויות על ציר ה-x.

### גרף פיזור: מתמטיקה מול פיזיקה

בגרף פיזור (scatter plot) קוראים ל-`plot` על כל ה-DataFrame ונותנים את שמות העמודות של x ושל y:

```python
kids.plot('Math', 'Physics', kind='scatter', title='Math vs Physics', xlabel='Math', ylabel='Physics')
```

![גרף פיזור של ציוני מתמטיקה מול ציוני פיזיקה](content/images/pandas_scatter.png)

כל נקודה היא ילד אחד. הנקודות עולות משמאל לימין: ילדים שטובים במתמטיקה נוטים להיות טובים גם בפיזיקה.

## סינון שורות

### שלב 1: השוואה נותנת True/False לכל שורה

השוואה של עמודה לערך בודקת את **כל השורות** בבת אחת, בדיוק כמו במערכי NumPy:

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

### שלב 2: משתמשים ברשימת ה-True/False כדי לבחור שורות

כשמכניסים את רשימת ערכי ה-True/False הזו (**מסנן**, או **מסכה** - mask) לתוך `loc`, נשארות רק השורות שהן `True`:

```python
green_filter = kids.loc[:, 'Fav Color'] == 'Green'
print(kids.loc[green_filter])
```

הדרך הקצרה, הכול בשורה אחת:

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

### תרגיל: טובים בפיזיקה

אילו ילדים קיבלו ציון 80 ומעלה בפיזיקה?

פתרון:

```python
print(kids[kids['Physics'] >= 80])
```

ארז, הילה, אלכס, רוני ודניאל.

### שילוב תנאים: `&` ו-`|`

כדי לשלב תנאים, משתמשים ב-`&` עבור **וגם** וב-`|` עבור **או**. כל תנאי **חייב להיות בתוך סוגריים משלו**:

```python
phys_and_math_filter = (kids['Physics'] >= 80) & (kids['Math'] >= 80)
print(kids[phys_and_math_filter])    # 80 or more in Physics AND in Math
```

```python
kids[(kids['Physics'] >= 80) | (kids['Math'] >= 80)]    # 80 or more in at least one of them
```

> **שימו לב:** ה-`and` / `or` של Python לא עובדים כאן וזורקים שגיאה, כי הם לא יודעים להשוות עמודות שלמות. תמיד השתמשו ב-`&` / `|`, עם סוגריים סביב כל תנאי.

## סיכום

| מה | איך |
|------|-----|
| טעינת קובץ CSV | `kids = pd.read_csv('kids.csv')` |
| גודל, עמודות, תוויות שורות | `len(kids)`, `kids.shape`, `kids.columns`, `kids.index` |
| שורות ראשונות / אחרונות | `kids.head()`, `kids.tail()` |
| סוגי עמודות, סטטיסטיקה | `kids.info()`, `kids.describe()` |
| בחירה לפי מיקום (הסוף לא נכלל) | `kids.iloc[2:5, 0:5]` |
| בחירה לפי שם (הסוף נכלל) | `kids.loc['Hila', 'Physics']` |
| עמודה אחת | `kids['Physics']` |
| למערך NumPy | `kids.values` |
| שמות בתור אינדקס | `kids.set_index('Name', inplace=True)` |
| עמודה חדשה / שורה חדשה | `kids.loc[:, 'Sports'] = ...`, `kids.loc['Erez'] = [...]` |
| ממוצע של כל עמודה / כל שורה | `.mean()`, `.mean(axis=1)` |
| מיון | `kids.sort_values('Mean Score', ascending=False)` |
| שמירה ל-Excel | `kids.to_excel('kids.xlsx')` |
| ספירת ערכים | `kids['Fav Color'].value_counts()` |
| ציור גרף | `.plot(kind='bar')`, `kids.plot('Math', 'Physics', kind='scatter')` |
| סינון שורות | `kids[(kids['Physics'] >= 80) & (kids['Math'] >= 80)]` |
