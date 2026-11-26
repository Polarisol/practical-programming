# פרומפטים אחרי ממשק המשתמש ההתחלתי

אחרי שהשלד ההתחלתי עובד ויש עליו commit, מתחילה העבודה האמיתית: להוסיף את הלוגיקה שלכם, חלק אחרי חלק. כלל האצבע נשאר אותו כלל: **אתם נשארים בשליטה, והקוד שייך לכם.**

אנחנו קוראים, מבינים, בודקים ומאשרים כל חלק בקוד שה-AI כותב. זה אפשרי רק כשכל תשובה קצרה. לכן מעכשיו, כל פרומפט מבקש **שינוי קטן אחד**, ואומר **איך** לעשות אותו.

## פרומפט מעורפל

> Read the data file and plot it.

(״תקרא את קובץ הנתונים ותצייר אותו.״)

ה-AI מחליט על הכול: pandas, numpy או המודול `csv`? איפה לשמור את הערכים? מה לעשות עם שורת הכותרת? הוא גם עלול לכתוב מחדש מתודות שכבר כתבתם. אתם מקבלים הרבה קוד לבדוק, ושום דבר ממנו הוא לא קוד שתכננתם.

## פרומפט קטן ומדויק

> In `file_load_method`, open the file at `self.filename` for reading using `with open`, skip the first line, and loop over the rest, adding the first value of each line to `self.x_values` and the second one to `self.y_values`. Both are floats. Clear the lists before.

ובעברית:

> במתודה `file_load_method`, פתח את הקובץ שב-`self.filename` לקריאה בעזרת `with open`, דלג על השורה הראשונה, ועבור בלולאה על השאר: הוסף את הערך הראשון בכל שורה ל-`self.x_values` ואת השני ל-`self.y_values`. שניהם מסוג float. לפני כן, רוקן את הרשימות.

הפרומפט הזה מקבל כל החלטה במקום ה-AI:

- **איפה:** בתוך `file_load_method`, המתודה שכבר נתתם לה שם.
- **איך:** `with open` ולולאה, כלים שלמדתם ב[יחידת יסודות Python](?id=python-basics).
- **שמות וסוגים:** `self.x_values` ו-`self.y_values`, שניהם float.
- **פרטים:** לדלג על שורת הכותרת, ולרוקן קודם את הרשימות כדי שטעינה של קובץ שני לא תערבב את הנתונים.

מה שחוזר הוא כמה שורות שיכולתם לכתוב בעצמכם:

```python
        self.x_values.clear()
        self.y_values.clear()
        with open(self.filename, "r") as file:
            file.readline()  # skip the first line
            for line in file:
                values = line.split(",")
                self.x_values.append(float(values[0]))
                self.y_values.append(float(values[1]))
```

שימו לב שהפרומפט לא אמר מה מפריד בין הערכים, אז ה-AI ניחש פסיק. אם בקובץ שלכם יש טאבים או רווחים, תגידו את זה. כל פרט שאתם משמיטים הוא החלטה שה-AI מקבל במקומכם.

## המחזור

1. **פרומפט** לשינוי קטן אחד.
2. **קוראים** כל שורה. אם משהו לא ברור, מבקשים מה-AI להסביר.
3. **בודקים.** מדפיסים את הרשימות, מנסים קובץ קטן, מנסים מקרי קצה.
4. **מאשרים** עם commit. אם זה לא מוצא חן בעיניכם, מבטלים את השינוי ב-git ומנסים שוב, או מתקנים בעצמכם.

ואז ממשיכים לשינוי הקטן הבא, למשל:

> In `draw_graph`, clear the axes and plot `self.y_values` against `self.x_values` as a blue line with round markers. Then call `self.canvas.draw()`.

(״ב-`draw_graph`, נקה את הצירים וצייר את `self.y_values` מול `self.x_values` כקו כחול עם סמנים עגולים. אחר כך קרא ל-`self.canvas.draw()`.״)

> At the end of `file_load_method`, call `self.draw_graph()`.

(״בסוף `file_load_method`, קרא ל-`self.draw_graph()`.״)

## כללי אצבע

- **שינוי אחד בכל פרומפט.** אם אתם צריכים לכתוב ״וגם״, כנראה שאלה שני פרומפטים.
- **תגידו איפה:** הקובץ והמתודה.
- **תגידו איך:** הכלים, הלולאה, השמות, הסוגים.
- **אם אתם לא יודעים להגיד איך, אתם עוד לא מוכנים לכתוב את הפרומפט.** קודם תלמדו איך עושים את זה, ואז תבקשו מה-AI להקליד.
- **אם מהר יותר להקליד בעצמכם, תקלידו.** בשינויים קטנים זה קורה הרבה.
