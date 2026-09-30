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
```

Multi-line strings are created using triple quotes. f-strings allow embedding expressions directly inside a string.

```python
multi_line = """This is a
multi-line string."""
name = "Alice"
greeting = f"Hello, {name}!"
print(greeting)  # 'Hello, Alice!'
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
print(numbers[0])    # First index
print(numbers[1:3])  # List slicing
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