# יסודות Python

#### פלט וקלט

הפונקציה `print` משמשת להצגת טקסט על המסך.

```python
print("Hello, world!")
```

הפונקציה `input` משמשת לקבלת קלט מהמשתמש כמחרוזת.

```python
name = input("Enter your name: ")  # Receives a string
age = int(input("Enter your age: "))  # Converts the input to an integer
height = float(input("Enter your height in meters: "))  # Converts the input to a float
```

#### מחרוזות

מחרוזות (strings) הן רצפים של תווים, ואפשר להשתמש במגוון מתודות כדי לעבד אותן.

```python
s = "Hello, World!"
print(s.lower())      # 'hello, world!'
print(s.upper())      # 'HELLO, WORLD!'
print(s.replace("World", "Python"))  # 'Hello, Python!'
print(len(s))  # prints the length of the string
```

מחרוזות של כמה שורות יוצרים בעזרת שלושה מירכאות. f-strings מאפשרות לשלב ביטויים ישירות בתוך מחרוזת.

```python
multi_line = """This is a
multi-line string."""
name = "Alice"
greeting = f"Hello, {name}!"
print(greeting)  # 'Hello, Alice!'
```

#### תנאים

אופרטורי השוואה (`==`, `!=`, `<`, `>`, `<=`, `>=`) מחזירים `True` או `False`. אופרטורים לוגיים משלבים ביניהם: `and` (שניהם נכונים), `or` (לפחות אחד נכון), `not` (הופך).

```python
x = 7
print(x == 7, x != 7, x <= 10)  # True False True
print(x > 5 and x < 10)         # True
print(x < 5 or x == 7)          # True
print(not x == 7)               # False
```

`if` מריץ בלוק רק כשהתנאי שלו נכון, `elif` בודק תנאים נוספים לפי הסדר, ו-`else` רץ כשאף תנאי לא התקיים.

```python
grade = 85
if grade >= 90:
    print("A")
elif grade >= 80 and grade < 90:
    print("B")  # This runs
else:
    print("Keep going")
```

#### לולאות

לולאת `for` משמשת למעבר על הפריטים באוסף. `break` יוצא מהלולאה, ו-`continue` מדלג לאיטרציה הבאה.

```python
for i in range(10):
    if i == 5:
        break  # Exits the loop when i equals 5
    if i % 2 == 0:
        continue  # Skips even numbers
    print(i)
```

#### רשימות

רשימות (lists) הן אוספים של פריטים שאפשר לשנות (mutable).

```python
numbers = [1, 2, 3, 4, 5]
print(len(numbers))  # prints the length of the list
print(numbers[0])    # First value 1
print(numbers[1:3])  # List slicing [2, 3]
print(numbers[-1])   # Last value 5
print(numbers[2:])   # slicing to the end [3, 4, 5]
numbers.append(6)    # Adds an item to the end of the list
numbers.insert(0, 0) # Inserts an item at the beginning of the list
del numbers[2]       # Deletes the item at index 2
removed = numbers.pop()  # Removes and returns the last item
index = numbers.index(4) # Finds the index of the value 4
```

#### קבוצות

קבוצות (sets) הן אוספים לא מסודרים של פריטים ייחודיים. הן לא מאפשרות כפילויות.

```python
fruits = {"apple", "banana", "cherry"}
fruits.add("orange")    # Adds an item
fruits.add("apple")     # Will not be added because it already exists
fruits.remove("banana") # Removes an item
print(fruits)

# A set can be created from a list
# list_items = [1, 2, 3]
# set_from_list = set(list_items) 
```

##### הסרת כפילויות בעזרת קבוצה

מכיוון שקבוצות מחייבות ייחודיות, הן דרך יעילה מאוד להסיר איברים כפולים מרשימה. פשוט ממירים את הרשימה לקבוצה, ואז, אם צריך, ממירים אותה בחזרה לרשימה.

```python
duplicates_list = [1, 2, 2, 3, 4, 4, 4, 5]

# Convert to set to remove duplicates, then back to a list
unique_list = list(set(duplicates_list))

print(unique_list)  # Output: [1, 2, 3, 4, 5]
```

#### מילונים

מילונים (dictionaries) הם אוספים של זוגות מפתח-ערך.

```python
person = {"name": "Bob", "age": 25}
print(person["name"])       # Accessing a value by key
person["age"] = 26          # Updating a value
person["city"] = "New York" # Adding a new key-value pair
del person["city"]          # Deleting a pair
```

#### פונקציות

אפשר ליצור פונקציות כדי לבצע משימות שחוזרות על עצמן.

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Charlie")
print(message)  # 'Hello, Charlie!'
```