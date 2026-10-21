# שימוש ב-LLM (Gemini)

## למה לקרוא למודל שפה מתוך Python?

עד עכשיו, לדבר עם צ'אטבוט היה אומר לפתוח אתר ולהקליד. אבל אותם מודלי שפה גדולים (LLM) אפשר לקרוא גם **מתוך תוכניות Python שלנו**. הקוד שלנו שולח למודל הודעה, ומקבל בחזרה את התשובה שלו כמחרוזת, שאפשר להדפיס, לשמור או להשתמש בה.

זה פותח הרבה אפשרויות: תוכנית שמסכמת קובץ, בוט עם אישיות משלו, עוזר שמסתכל על תמונה, או עוזר שיכול להריץ פונקציות Python שכתבנו בעצמנו.

כאן נשתמש ב-**Google Gemini**, כי יש לו מסלול חינמי וספריית Python פשוטה. הרעיונות (client, צ'אט, הודעות ותשובות) נראים כמעט אותו דבר גם אצל ספקים אחרים.

## הכנה

**שלב ראשון:** ביקור ב-[aistudio.google.com](https://aistudio.google.com) ויצירת **מפתח API**.

**שלב שני:** יצירת קובץ בשם `.env` ובתוכו משתנה בשם `GEMINI_API_KEY` עם מפתח ה-API:

```
GEMINI_API_KEY=your-key-here
```

> המפתח הוא כמו סיסמה. אל תשתפו אותו ואל תכתבו אותו בתוך הקוד. אם אתם משתמשים ב-Git, הוסיפו את `.env` לקובץ `.gitignore`.

**שלב שלישי:** התקנת הספריות הנחוצות בפייתון:

```bash
pip install google-genai python-dotenv
```

## הדוגמה הבסיסית ביותר

צ'אט פשוט (עם זיכרון אוטומטי לשיחה):

```python
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()
client = genai.Client()
chat = client.chats.create(model="gemini-3.1-flash-lite")
response = chat.send_message("Hello, how are you?")
print(response.text)
```

```
>> Hi, I'm great! How can I help you today?
```

- `load_dotenv()` קורא את קובץ ה-`.env`, כדי שה-client ימצא את `GEMINI_API_KEY`.
- `client.chats.create(...)` פותח צ'אט עם מודל מסוים.
- כל `chat.send_message(...)` זוכר את ההודעות הקודמות באותו צ'אט.

## שימוש בהגדרות מערכת

שימוש בהגדרות בוט בסיסיות שאפשר לצרף לכל בוט בזמן היצירה:

```python
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()
client = genai.Client()
config = types.GenerateContentConfig(
        system_instruction="You are a helpful assistant that translates English to French.")
chat = client.chats.create(
        model="gemini-3.1-flash-lite",
        config=config)

response = chat.send_message("Hello, how are you?")
print(response.text)
```

```
>> Ciao, come stai?
```

## עבודה עם תמונה

```python
import PIL.Image
my_image = PIL.Image.open('test_image.png')
response = chat.send_message(["What is in this loaded image?", my_image])
```

## עבודה עם כלים

```python
temperature = 20
def make_warm() -> str:
    ''' This tool warms the room by one degree, and should be used if the user is feeling cold.'''
    global temperature
    temperature += 1
    return f"The temperature is now {temperature} degrees." # this goes to the LLM

config = types.GenerateContentConfig(
    system_instruction="You are a helpful assistant",
    tools = [make_warm]
)
chat = client.chats.create(
        model="gemini-3.1-flash-lite",
        config=config)
response = chat.send_message("Hi, I'm a bit cold")
print(response.text)
```
