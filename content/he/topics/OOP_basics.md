# יסודות OOP: מחלקות ואובייקטים

## מה זה OOP?

**OOP** הם ראשי התיבות של **Object Oriented Programming**, כלומר **תכנות מונחה עצמים**. זוהי דרך לארגן תוכנית סביב **דברים** (שאנחנו קוראים להם **אובייקטים**).

חשבו על העולם האמיתי. הוא מלא בדברים: חתולים, מכוניות, טלפונים, סטודנטים. לכל דבר יש:

* **מידע על עצמו**: למכונית, למשל, יש יצרן, דגם ושנת ייצור.
* **דברים שהוא יכול לעשות**: כל מכונית יכולה לנסוע, לצפור, אפשר לתקן אותה.

OOP מאפשר לנו לכתוב תוכניות באותה דרך: אנחנו שומרים את המידע על דבר מסוים **וגם** את הדברים שהוא יכול לעשות **יחד, במקום אחד**.

## מחלקות ואובייקטים

יש שתי מילים ללמוד: **מחלקה** (class) ו**אובייקט** (object). ובואו נלך עם הדוגמה של החתול... כי חתולים זה מדהים.

* **מחלקה** היא **שרטוט** (או תבנית). היא מתארת מה יש לכל אובייקט מהסוג שלה ומה כל אובייקט מהסוג שלה יכול לעשות. מחלקה של חתול היא **לא** חתול. היא ההוראות להכנת חתולים.
* **אובייקט** של חתול, לעומת זאת, הוא **חתול אמיתי שנוצר מהשרטוט**. ממחלקה אחת אפשר ליצור כמה אובייקטים שרוצים... אז... אפשר ליצור הרבה חתולים.

### לכל אובייקט יש מידע משלו

לכל אובייקט חתול שאנחנו יוצרים יש שם **משלו**, צבע **משלו** ושנת לידה **משלו**. שינוי של חתול אחד לא משנה אף חתול אחר. זה נקרא **המצב** (state) של האובייקט (המידע שלו עצמו).

### לכל האובייקטים יש אותן יכולות

כל החתולים נוצרים מאותו מתכון, ולכן כולם יכולים לעשות **אותם דברים**. אם המתכון אומר "אפשר ללטף חתול", אז אפשר ללטף **כל** חתול. אנחנו כותבים את היכולת הזאת **פעם אחת**, במחלקה, וכל חתול מקבל אותה.

> **בקיצור:** לכל אובייקט יש **מידע משלו**, אבל כל האובייקטים מאותה מחלקה **חולקים את אותן יכולות**.

## המחלקה הראשונה שלנו: חתול

הנה הקוד של מחלקה שמתארת חתול. אל תדאגו אם זה נראה מבלבל בהתחלה, יחד עם ההסברים שלי בכיתה זה יהיה קל:

```python
class Cat:

    def __init__(self, name, color, birth_year):
        self.name = name
        self.color = color
        self.birth_year = birth_year
```

בואו נעבור על זה שורה אחרי שורה:

* `class Cat:` - אנחנו כותבים מתכון בשם `Cat`. שמות של מחלקות מתחילים בדרך כלל ב**אות גדולה**.
* `def __init__(self, name, color, birth_year):` - הפונקציה המיוחדת הזאת רצה **אוטומטית בכל פעם שנוצר חתול חדש**. התפקיד שלה הוא להכין את החתול החדש. (`init` הוא קיצור של *initialize*, שפירושו "לאתחל", כלומר להכין בהתחלה.) שימו לב ששם המתודה חייב להיות `__init__`, זה שם מיוחד.
* `name`, `color`, `birth_year` - המידע שחייבים לתת כשיוצרים חתול.
* `self` - פירושו **"החתול הזה"**, החתול שנוצר ממש עכשיו. Python נותנת לנו אותו בעצמה, אנחנו אף פעם לא מעבירים אותו.
* `self.name = name` - "שמור את השם שקיבלנו **בתוך החתול הזה**". אותו דבר לגבי הצבע ושנת הלידה.

משתנים שנשמרים עם `self.` (כמו `self.name`) שייכים לאובייקט. לכל חתול יש עותק משלו שלהם.

## יצירת חתולים

כדי ליצור חתול, כותבים את שם המחלקה ונותנים לה את המידע בסוגריים, בדיוק כמו בקריאה לפונקציה:

```python
mitzi = Cat("Mitzi", "orange", 2019)
shadow = Cat("Shadow", "black", 2021)
snow = Cat("Snow", "white", 2020)
smokey = Cat("Smokey", "gray", 2023)
```

כל שורה יוצרת **אובייקט חתול חדש ונפרד**. Python מריצה את `__init__` עבור כל אחד, עם הערכים שנתנו. כשאנחנו יוצרים את mitzi, ה-'self' בתוך המחלקה Cat מתייחס ל-mitzi. כשאנחנו יוצרים את shadow, ה-'self' מתייחס ל-shadow, וכן הלאה.

![מיצי, חתולה כתומה](content/images/cat_mitzi.svg) ![שאדו, חתול שחור](content/images/cat_shadow.svg) ![סנואו, חתול לבן](content/images/cat_snow.svg) ![סמוקי, חתול אפור](content/images/cat_smokey.svg)

עכשיו יש לנו **מחלקה אחת** (`Cat`) ו**ארבעה אובייקטים** (ארבעה חתולים).

## לכל חתול יש מידע משלו

כדי לקרוא את המידע של חתול, כותבים את האובייקט, נקודה, ואת שם המשתנה:

```python
print(mitzi.name)        # Mitzi
print(mitzi.color)       # orange
print(shadow.name)       # Shadow
print(shadow.color)      # black
print(snow.birth_year)   # 2020
```

`mitzi.color` פירושו "הצבע **של מיצי**". `shadow.color` פירושו "הצבע **של שאדו**". אותו שם משתנה, חתולים שונים, ערכים שונים.

אפשר להשתמש בהם כמו בכל משתנה אחר:

```python
print(f"{smokey.name} is a {smokey.color} cat born in {smokey.birth_year}")
```

פלט:

```
Smokey is a gray cat born in 2023
```

אפשר אפילו לשים חתולים ברשימה ולעבור עליהם בלולאה:

```python
cats = [mitzi, shadow, snow, smokey]

for cat in cats:
    print(f"{cat.name} is {cat.color}")
```

פלט:

```
Mitzi is orange
Shadow is black
Snow is white
Smokey is gray
```

## ליטוף חתולים: הוספת יכולת

חתולים אוהבים שמלטפים אותם. בואו נלמד את החתולים שלנו את זה, ונגרום לכל חתול **לזכור כמה פעמים ליטפו אותו**.

אנחנו צריכים שני דברים חדשים במחלקה:

1. **מונה ליטופים**: משתנה חדש `self.pat_counter` שכל חתול מתחיל איתו ב-`0`.
2. **מתודה `pat`**: פונקציה שכתובה בתוך המחלקה. כל חתול יכול להשתמש בה.

> פונקציה שכתובה **בתוך מחלקה** נקראת **מתודה** (method).

```python
class Cat:

    def __init__(self, name, color, birth_year):
        self.name = name
        self.color = color
        self.birth_year = birth_year
        self.pat_counter = 0

    def pat(self):
        self.pat_counter = self.pat_counter + 1
        print(f"{self.name} purrs... (patted {self.pat_counter} times)")
```

מה השתנה:

* `self.pat_counter = 0` - כל חתול חדש מתחיל עם **0 ליטופים**. שימו לב שאנחנו **לא** נותנים את מונה הליטופים כשיוצרים חתול. כל חתול פשוט מתחיל מ-0, אז `__init__` קובע את זה בעצמו.
* `def pat(self):` - המתודה `pat`. כמו `__init__`, גם היא מקבלת את `self`, שפירושו **"החתול שמלטפים עכשיו"**.
* `self.pat_counter = self.pat_counter + 1` - מוסיפים 1 למונה **של החתול הזה**. רק למונה של החתול הזה, לא של אף חתול אחר.

## ליטוף בפעולה

יוצרים את החתולים בדיוק כמו קודם:

```python
mitzi = Cat("Mitzi", "orange", 2019)
shadow = Cat("Shadow", "black", 2021)
snow = Cat("Snow", "white", 2020)
```

כדי ללטף חתול, כותבים את האובייקט, נקודה, ואת שם המתודה **עם סוגריים**:

```python
mitzi.pat()
mitzi.pat()
shadow.pat()
mitzi.pat()
```

פלט:

```
Mitzi purrs... (patted 1 times)
Mitzi purrs... (patted 2 times)
Shadow purrs... (patted 1 times)
Mitzi purrs... (patted 3 times)
```

הסתכלו על השורה השלישית: המונה של שאדו הוא **1**, לא 3. הליטוף של מיצי לא שינה את שאדו בכלל. כל חתול שומר את הספירה **שלו**.

עכשיו בואו נבדוק את כל המונים:

```python
print(mitzi.pat_counter)    # 3
print(shadow.pat_counter)   # 1
print(snow.pat_counter)     # 0
```

![מיצי, ליטפו אותה 3 פעמים](content/images/cat_mitzi_patted.svg) ![שאדו, ליטפו אותו פעם אחת](content/images/cat_shadow_patted.svg) ![סנואו, ליטפו אותו 0 פעמים](content/images/cat_snow_patted.svg)

סנואו המסכן אף פעם לא קיבל ליטוף, אז המונה שלו עדיין **0**.

זה כל הרעיון של OOP בדוגמה אחת:

* **אותה יכולת**: כתבנו את `pat` **פעם אחת**, ו**כל** חתול יכול להשתמש בה.
* **מידע משלו**: כל חתול זוכר את השם, הצבע, שנת הלידה ומספר הליטופים **שלו**.

## תוכנית מלאה

```python
class Cat:

    def __init__(self, name, color, birth_year):
        self.name = name
        self.color = color
        self.birth_year = birth_year
        self.pat_counter = 0

    def pat(self):
        self.pat_counter = self.pat_counter + 1
        print(f"{self.name} purrs... (patted {self.pat_counter} times)")


mitzi = Cat("Mitzi", "orange", 2019)
shadow = Cat("Shadow", "black", 2021)
snow = Cat("Snow", "white", 2020)

mitzi.pat()
mitzi.pat()
shadow.pat()
mitzi.pat()

cats = [mitzi, shadow, snow]
for cat in cats:
    print(f"{cat.name} the {cat.color} cat was patted {cat.pat_counter} times")
```

פלט:

```
Mitzi purrs... (patted 1 times)
Mitzi purrs... (patted 2 times)
Shadow purrs... (patted 1 times)
Mitzi purrs... (patted 3 times)
Mitzi the orange cat was patted 3 times
Shadow the black cat was patted 1 times
Snow the white cat was patted 0 times
```

## סיכום

| מונח | מה זה אומר | בדוגמה שלנו |
|------|---------------|----------------|
| **מחלקה (Class)** | המתכון | `Cat` |
| **אובייקט (Object)** | דבר אמיתי שנוצר מהמתכון | `mitzi`, `shadow`, `snow` |
| **`__init__`** | רצה אוטומטית כשאובייקט נוצר, כדי להכין אותו | שומרת את השם, הצבע ושנת הלידה, וקובעת את מונה הליטופים ל-0 |
| **`self`** | "האובייקט הזה", זה שאנחנו עובדים איתו עכשיו | החתול שנוצר או שמלטפים אותו |
| **משתנה של אובייקט** | מידע שכל אובייקט שומר לעצמו | `self.name`, `self.pat_counter` |
| **מתודה (Method)** | פונקציה בתוך המחלקה שכל אובייקט יכול להשתמש בה | `pat` |
