# Python Basics

#### Output and Input

The `print` function is used to output text to the screen.

```python
print("Hello, world!")
```

The `input` function is used to get input from the user as a string.

```python
name = input("Enter your name: ")  # Receives a string
age = int(input("Enter your age: "))  # Converts the input to an integer
height = float(input("Enter your height in meters: "))  # Converts the input to a float
```

#### Strings

Strings are sequences of characters, and various methods can be used to manipulate them.

```python
s = "Hello, World!"
print(s.lower())      # 'hello, world!'
print(s.upper())      # 'HELLO, WORLD!'
print(s.replace("World", "Python"))  # 'Hello, Python!'
print(len(s))  # prints the length of the string
```

Multi-line strings are created using triple quotes. f-strings allow embedding expressions directly inside a string.

```python
multi_line = """This is a
multi-line string."""
name = "Alice"
greeting = f"Hello, {name}!"
print(greeting)  # 'Hello, Alice!'
```

#### Conditionals

Comparison operators compare two values and return `True` or `False`.

```python
x = 7
print(x == 7)   # True  - equal to
print(x != 7)   # False - not equal to
print(x < 10)   # True  - less than
print(x > 10)   # False - greater than
print(x <= 7)   # True  - less than or equal to
print(x >= 8)   # False - greater than or equal to
```

Logical operators combine or reverse conditions: `and` is `True` only if both sides are true, `or` is `True` if at least one side is true, and `not` flips the result.

```python
age = 20
has_ticket = False
print(age >= 18 and has_ticket)  # False - both must be True
print(age >= 18 or has_ticket)   # True  - one is enough
print(not has_ticket)            # True  - reverses False
```

A simple `if` runs its indented block only when the condition is true.

```python
temperature = 30
if temperature > 25:
    print("It's hot today!")  # Runs only if the condition is True
```

An `if` / `else` chooses between two options.

```python
number = int(input("Enter a number: "))
if number % 2 == 0:
    print("Even")
else:
    print("Odd")
```

`elif` (short for "else if") checks more conditions in order. Only the first block whose condition is true runs.

```python
grade = 85
if grade >= 90:
    print("A")
elif grade >= 80:
    print("B")  # This runs, and the rest are skipped
elif grade >= 70:
    print("C")
else:
    print("Needs improvement")
```

Conditions can combine comparison and logical operators.

```python
username = "admin"
password = "1234"
if username == "admin" and password != "":
    print("Logging in...")
elif username == "" or password == "":
    print("Please fill in all fields")
else:
    print("Unknown user")
```

#### Loops

A `for` loop is used to iterate over items in a collection. `break` exits the loop, and `continue` skips to the next iteration.

```python
for i in range(10):
    if i == 5:
        break  # Exits the loop when i equals 5
    if i % 2 == 0:
        continue  # Skips even numbers
    print(i)
```

#### Lists

Lists are mutable collections of items.

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

#### Sets

Sets are unordered collections of unique items. They do not allow duplicates.

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

##### Eliminating Duplicates Using a Set

Because sets enforce uniqueness, they are a highly efficient way to remove duplicate elements from a list. You can simply convert the list to a set, and then optionally convert it back to a list if needed.

```python
duplicates_list = [1, 2, 2, 3, 4, 4, 4, 5]

# Convert to set to remove duplicates, then back to a list
unique_list = list(set(duplicates_list))

print(unique_list)  # Output: [1, 2, 3, 4, 5]
```

#### Dictionaries

Dictionaries are collections of key-value pairs.

```python
person = {"name": "Bob", "age": 25}
print(person["name"])       # Accessing a value by key
person["age"] = 26          # Updating a value
person["city"] = "New York" # Adding a new key-value pair
del person["city"]          # Deleting a pair
```

#### Functions

Functions can be created to perform repetitive tasks.

```python
def greet(name):
    return f"Hello, {name}!"

message = greet("Charlie")
print(message)  # 'Hello, Charlie!'
```