# ירושה בתכנות מונחה עצמים: שיתוף קוד בין מחלקות

## איפה עצרנו: המחלקה Cat

בשיעור הקודם כתבנו מחלקה שמתארת חתול. לכל חתול יש שם, צבע ושנת לידה, ואפשר ללטף כל חתול:

```python
class Cat:

    def __init__(self, name, color, birth_year):
        self.name = name
        self.color = color
        self.birth_year = birth_year
        self.pat_counter = 0

    def pat(self):
        self.pat_counter = self.pat_counter + 1
        print(f"{self.name} is happy... (patted {self.pat_counter} times)")
```

> שינינו קצת את ההודעה ב-`pat`, מ-"purrs" (מגרגר) ל-"is happy" (שמח). עוד מעט תבינו למה.

## עכשיו אנחנו רוצים גם כלבים

התוכנית שלנו גדלה, ועכשיו אנחנו רוצים לנהל גם **כלבים**. כלב דומה מאוד לחתול:

* יש לו שם, צבע ושנת לידה.
* אפשר ללטף אותו, ואנחנו רוצים לספור את הליטופים.

יש רק **הבדל אחד**: לכל כלב יש **מספר זיהוי** (המספר שעל השבב שהווטרינר משתיל בכלב). לכן כשאנחנו יוצרים כלב, אנחנו חייבים לתת גם את מספר הזיהוי שלו.

הנה מחלקה `Dog`:

```python
class Dog:

    def __init__(self, name, color, birth_year, id_number):
        self.name = name
        self.color = color
        self.birth_year = birth_year
        self.id_number = id_number
        self.pat_counter = 0

    def pat(self):
        self.pat_counter = self.pat_counter + 1
        print(f"{self.name} is happy... (patted {self.pat_counter} times)")
```

ואפשר להשתמש בה בדיוק כמו בחתולים:

```python
rex = Dog("Rex", "brown", 2018, 4521)
rex.pat()
print(rex.id_number)
```

פלט:

```
Rex is happy... (patted 1 times)
4521
```

## רואים את הבעיה?

שימו את שתי המחלקות זו לצד זו ותסתכלו טוב. הן **כמעט זהות**!

| | `Cat` | `Dog` |
|---|---|---|
| `self.name = name` | ✅ | ✅ |
| `self.color = color` | ✅ | ✅ |
| `self.birth_year = birth_year` | ✅ | ✅ |
| `self.pat_counter = 0` | ✅ | ✅ |
| המתודה `pat` | ✅ | ✅ |
| `self.id_number = id_number` | ❌ | ✅ |

רק **שורה אחת** שונה. את כל השאר כתבנו **פעמיים**.

למה זה רע?

* **יותר עבודה**: הקלדנו את אותו קוד פעמיים.
* **טעויות**: תחשבו שמצאנו באג ב-`pat`, או שאנחנו רוצים לשנות את ההודעה. צריך לזכור לתקן את זה **בשתי** המחלקות. אם שכחנו אחת, החתולים והכלבים יתנהגו אחרת.
* **וזה רק מחמיר**: אם מחר נוסיף ארנבים, אוגרים ותוכים, נעתיק את אותו קוד שוב ושוב.

למתכנתים יש כלל: **אל תחזור על עצמך** (Don't Repeat Yourself). כשאותו קוד מופיע בהרבה מקומות, בדרך כלל יש דרך טובה יותר.

במקרה שלנו, הדרך הטובה יותר נקראת **ירושה** (inheritance).

## הרעיון של ירושה

תחשבו איך אנחנו מדברים בחיים האמיתיים. חתולים וכלבים הם שניהם **בעלי חיים**. כל מה שנכון לגבי **כל בעל חיים** (יש לו שם, צבע, שנת לידה, ואפשר ללטף אותו) נכון לגבי חתולים **וגם** לגבי כלבים.

אז הנה התוכנית:

1. נכתוב מחלקה בשם `Animal` שיש בה **את כל מה שמשותף לחתולים ולכלבים**.
2. נגיד ש-`Cat` **הוא סוג של** `Animal`. הוא מקבל את כל מה שיש ל-`Animal`, **בחינם**.
3. נגיד שגם `Dog` **הוא סוג של** `Animal`. גם הוא מקבל הכול בחינם, ואז נוסיף רק את **הדבר האחד שמיוחד** לכלבים: מספר הזיהוי.

בדיוק כמו שילדים יורשים דברים מההורים שלהם (צבע עיניים, שם משפחה, או דירה), מחלקה יכולה **לרשת** קוד ממחלקה אחרת.

כמה מילים חדשות:

* **מחלקת אב** (parent class, ונקראת גם **מחלקת בסיס** (base class) או **superclass**): המחלקה שממנה יורשים. כאן, `Animal`.
* **מחלקת בן** (child class, ונקראת גם **subclass**): המחלקה שיורשת. כאן, `Cat` ו-`Dog`.

## שלב 1: המחלקה Animal

ניקח את כל מה שמשותף ונשים אותו במחלקה בשם `Animal`:

```python
class Animal:

    def __init__(self, name, color, birth_year):
        self.name = name
        self.color = color
        self.birth_year = birth_year
        self.pat_counter = 0

    def pat(self):
        self.pat_counter = self.pat_counter + 1
        print(f"{self.name} is happy... (patted {self.pat_counter} times)")
```

שום דבר חדש כאן. זו בדיוק המחלקה `Cat` הישנה שלנו, רק עם שם אחר. (עכשיו אתם יודעים למה שינינו את "purrs" ל-"is happy": כלבים לא מגרגרים, אז ההודעה צריכה להתאים **לכל** בעל חיים.)

שימו לב ש-`Animal` הוא לא יצור מסוים. הוא "בעל חיים כלשהו" כללי, שיש לו רק את מה **שמשותף לכל** בעלי החיים. הנה התוכנית להמשך: `Cat` ו-`Dog` שניהם יירשו מ-`Animal`. החתול לא מוסיף שום דבר חדש, והכלב מוסיף מספר זיהוי:

![Animal היא מחלקת האב. Cat ו-Dog שתיהן יורשות ממנה. Dog מוסיפה גם id_number.](content/images/animal_inheritance.svg)

## שלב 2: המחלקה Cat יורשת מ-Animal

```python
class Cat(Animal):
    pass
```

זהו. שתי שורות! בואו נעבור עליהן:

* `class Cat(Animal):` - השם שבסוגריים הוא **מחלקת האב**. השורה הזו אומרת: "`Cat` הוא סוג של `Animal`. תן לו את כל מה שיש ל-`Animal`."
* `pass` - ב-Python מחלקה לא יכולה להיות ריקה. `pass` אומר "**אין כאן מה להוסיף**". חתול הוא פשוט בעל חיים, לא יותר, אז אין מה לכתוב בנוסף.

אף על פי שלא כתבנו `__init__` או `pat` בתוך `Cat`, יש אותם לחתול, כי הוא **ירש** אותם מ-`Animal`:

```python
mitzi = Cat("Mitzi", "orange", 2019)
mitzi.pat()
mitzi.pat()
print(mitzi.color)
```

פלט:

```
Mitzi is happy... (patted 1 times)
Mitzi is happy... (patted 2 times)
orange
```

איך Python יודעת מה לעשות? כשאנחנו קוראים ל-`mitzi.pat()`, Python מחפשת מתודה `pat` בתוך `Cat`. היא לא מוצאת, אז היא **עולה למעלה אל האב**, `Animal`, ומוצאת אותה שם. אותו דבר קורה עם `__init__` כשאנחנו יוצרים את החתול.

## שלב 3: המחלקה Dog יורשת מ-Animal

גם כלב הוא בעל חיים, אז מתחילים באותה צורה:

```python
class Dog(Animal):
```

אבל כלב **קצת שונה**: ה-`__init__` שלו צריך לקבל גם `id_number`. ה-`__init__` ש-`Animal` נותן לנו מקבל רק שם, צבע ושנת לידה. זה לא מספיק לכלב.

לכן המחלקה `Dog` תכתוב `__init__` **משלה**. כשמחלקת בן כותבת מתודה עם **אותו שם** כמו מתודה של האב שלה, הגרסה של הבן **מחליפה** את הגרסה של האב. לזה קוראים **דריסה** (overriding) של המתודה.

```python
class Dog(Animal):

    def __init__(self, name, color, birth_year, id_number):
        super().__init__(name, color, birth_year)
        self.id_number = id_number
```

בואו נעבור על זה שורה אחרי שורה:

* `def __init__(self, name, color, birth_year, id_number):` - ה-`__init__` של הכלב עצמו. הוא מקבל את כל מה שבעל חיים מקבל, **ועוד** `id_number`. מכיוון שלמחלקה `Dog` יש `__init__` משלה, Python תשתמש **בו** כשניצור כלב, ולא בזה של `Animal`.
* `super().__init__(name, color, birth_year)` - זו השורה החדשה והחשובה. `super()` פירושו "**מחלקת האב שלי**" (כאן, `Animal`). אז השורה הזו אומרת: "תריץ את ה-`__init__` של **האב**, ותן לו את השם, הצבע ושנת הלידה". ה-`__init__` של האב עושה אז את העבודה הרגילה שלו: שומר את השם, הצבע ושנת הלידה, ומאפס את מונה הליטופים.
* `self.id_number = id_number` - אחרי שהאב סיים את החלק שלו, אנחנו עושים את **הדבר הנוסף היחיד** שרק כלבים צריכים: שומרים את מספר הזיהוי.

במילים פשוטות, ה-`__init__` של הכלב אומר: "**קודם, תאתחל אותי כמו כל בעל חיים. אחר כך, תשמור גם את מספר הזיהוי שלי.**"

### למה אנחנו צריכים את `super()`?

זכרו, ה-`__init__` של הכלב **מחליף** את ה-`__init__` של בעל החיים. אז כשאנחנו יוצרים כלב, ה-`__init__` של בעל החיים **לא** רץ מעצמו. אבל כלב עדיין צריך שם, צבע, שנת לידה ומונה ליטופים. מישהו צריך לשמור אותם.

בלי `super()`, היינו צריכים **בעצמנו** לכתוב את השורות האלה, בתוך ה-`__init__` של הכלב:

```python
class Dog(Animal):

    def __init__(self, name, color, birth_year, id_number):
        self.name = name
        self.color = color
        self.birth_year = birth_year
        self.pat_counter = 0
        self.id_number = id_number
```

זה עובד, אבל תסתכלו על זה: ארבע השורות הראשונות **מועתקות** מ-`Animal`. זו בדיוק החזרה שרצינו להיפטר ממנה! חזרנו לנקודת ההתחלה, עם אותן שורות כתובות בשני מקומות ועם אותן בעיות: אם נשנה את האופן שבו בעל חיים מאותחל, נצטרך לזכור לשנות גם את הכלב.

בדוגמה שלנו ל-`__init__` של האב יש רק ארבע שורות, אז ההעתקה לא נראית נורא כל כך. אבל בתוכניות אמיתיות ל-`__init__` של אב יכולות להיות **10, 20 ואפילו יותר** שורות, והרבה מחלקות בן יכולות לרשת מאותו אב. להעתיק את כל זה לכל בן זה הרבה עבודה והרבה מקומות לטעויות.

`super().__init__(name, color, birth_year)` חוסך לנו את כל זה. ב**שורה אחת** אנחנו אומרים ל-Python: "**תריצי את ה-`__init__` של האב ותני לו לעשות את העבודה הרגילה שלו**". האב שומר את השם, הצבע, שנת הלידה ומונה הליטופים **בשבילנו**, לא משנה כמה שורות זה דורש. אחר כך אנחנו כותבים רק את מה **שחדש** לכלבים:

```python
class Dog(Animal):

    def __init__(self, name, color, birth_year, id_number):
        super().__init__(name, color, birth_year)   # the parent does its part
        self.id_number = id_number                  # we add only what is new
```

### כלבים עדיין מקבלים את `pat` בחינם

דרסנו **רק** את `__init__`. לא כתבנו מתודה `pat` בתוך `Dog`, אז כלבים עדיין יורשים את `pat` מ-`Animal`, בדיוק כמו חתולים:

```python
rex = Dog("Rex", "brown", 2018, 4521)
rex.pat()
print(f"{rex.name}'s ID number is {rex.id_number}")
```

פלט:

```
Rex is happy... (patted 1 times)
Rex's ID number is 4521
```

## תוכנית מלאה

```python
class Animal:

    def __init__(self, name, color, birth_year):
        self.name = name
        self.color = color
        self.birth_year = birth_year
        self.pat_counter = 0

    def pat(self):
        self.pat_counter = self.pat_counter + 1
        print(f"{self.name} is happy... (patted {self.pat_counter} times)")


class Cat(Animal):
    pass


class Dog(Animal):

    def __init__(self, name, color, birth_year, id_number):
        super().__init__(name, color, birth_year)
        self.id_number = id_number


mitzi = Cat("Mitzi", "orange", 2019)
shadow = Cat("Shadow", "black", 2021)
rex = Dog("Rex", "brown", 2018, 4521)
bella = Dog("Bella", "white", 2022, 7730)

mitzi.pat()
rex.pat()
rex.pat()
bella.pat()

animals = [mitzi, shadow, rex, bella]
for animal in animals:
    print(f"{animal.name} the {animal.color} animal was patted {animal.pat_counter} times")

print(f"{rex.name}'s ID number is {rex.id_number}")
print(f"{bella.name}'s ID number is {bella.id_number}")
```

פלט:

```
Mitzi is happy... (patted 1 times)
Rex is happy... (patted 1 times)
Rex is happy... (patted 2 times)
Bella is happy... (patted 1 times)
Mitzi the orange animal was patted 1 times
Shadow the black animal was patted 0 times
Rex the brown animal was patted 2 times
Bella the white animal was patted 1 times
Rex's ID number is 4521
Bella's ID number is 7730
```

שימו לב שחתולים וכלבים חיים בשלום באותה **רשימה**, והלולאה מתייחסת לכולם באותה צורה. זה עובד כי **כולם בעלי חיים**: לכולם יש שם, צבע ומונה ליטופים.

אבל זהירות: רק לכלבים יש מספר זיהוי. `mitzi.id_number` יגרום לשגיאה, כי המחלקה `Cat` אף פעם לא שומרת מספר זיהוי.

השוו את זה לנקודת ההתחלה: הקוד המשותף כתוב עכשיו **פעם אחת בלבד**, בתוך `Animal`. אם נרצה לשנות את ההודעה של `pat`, נשנה אותה במקום אחד, וגם החתולים וגם הכלבים יקבלו את השינוי. ואם מחר נרצה להוסיף ארנבים, זה פשוט:

```python
class Rabbit(Animal):
    pass
```

## סיכום

| מונח | מה המשמעות | בדוגמה שלנו |
|------|---------------|----------------|
| **ירושה** (inheritance) | מחלקה מקבלת את כל הקוד של מחלקה אחרת, בחינם | `Cat` ו-`Dog` מקבלות את `__init__` ואת `pat` מ-`Animal` |
| **מחלקת אב** (parent class, base class, superclass) | המחלקה שממנה יורשים | `Animal` |
| **מחלקת בן** (child class, subclass) | המחלקה שיורשת | `Cat`, `Dog` |
| **`class Child(Parent):`** | איך כותבים "Child הוא סוג של Parent" | `class Dog(Animal):` |
| **`pass`** | "אין כאן מה להוסיף" | `Cat` לא מוסיפה כלום ל-`Animal` |
| **דריסה** (overriding) | מחלקת בן כותבת גרסה משלה למתודה של האב, והיא מחליפה את הגרסה של האב | `Dog` כותבת `__init__` משלה |
| **`super()`** | "מחלקת האב שלי", משמשת כדי להריץ את הגרסה של האב למתודה | `super().__init__(name, color, birth_year)` |
