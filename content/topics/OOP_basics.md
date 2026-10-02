# OOP Basics: Classes and Objects

## What is OOP?

**OOP** stands for **Object Oriented Programming**. It is a way of organizing a program around **things** (we call them **objects**).

Think about the real world. It is full of things: cats, cars, phones, students. Every thing has:

* **Information about itself**: a car, for example, has a make, a model and a year.
* **Things it can do**: every car can drive, it can honk, it can be repaired.

OOP lets us write programs the same way: we keep the information about a thing **and** the things it can do **together in one place**.

## Classes and Objects

There are two words to learn: **class** and **object**. And lets go with the cat example... because cats are awesome.

* A **class** is a **blueprint** (or a template). It describes what every object of its type has and what every object of its type can do. A class of a cat is **not** a cat. It is the instructions for making cats.
* An **object** of a cat however is a **real cat made from the blueprint**. From one class we can make as many objects as we like... so... we can create many cats.

### Each object has its own information

Every cat object we make has its **own** name, its **own** color and its **own** birth year. Changing one cat does not change any other cat. This is called the object's **state** (its own information).

### All objects share the same abilities

All cats are made from the same recipe, so they can all do the **same things**. If the recipe says "a cat can be patted", then **every** cat can be patted. We write this ability **once**, in the class, and every cat gets it.

> **In short:** each object has **its own information**, but all objects of the same class **share the same abilities**.

## Our First Class: a Cat

Here is the code for a class that describes a cat. don't worry if it looks confusing at first, along with my explanations in class this will be easy:

```python
class Cat:

    def __init__(self, name, color, birth_year):
        self.name = name
        self.color = color
        self.birth_year = birth_year
```

Let's go over it line by line:

* `class Cat:` - we are writing a recipe called `Cat`. Class names usually start with a **capital letter**.
* `def __init__(self, name, color, birth_year):` - this special function runs **automatically every time a new cat is created**. Its job is to set up the new cat. (`init` is short for *initialize*, which means "set up at the start".) Note that the name of the method must be '__init__', it is a special name.
* `name`, `color`, `birth_year` - the information we must give when we create a cat.
* `self` - means **"this cat"**, the cat that is being created right now. Python gives it to us by itself, we never pass it.
* `self.name = name` - "save the name we got **inside this cat**". The same goes for the color and the birth year.

Variables saved with `self.` (like `self.name`) belong to the object. Each cat has its own copy of them.

## Creating Cats

To create a cat, we write the class name and give it the information in parentheses, just like calling a function:

```python
mitzi = Cat("Mitzi", "orange", 2019)
shadow = Cat("Shadow", "black", 2021)
snow = Cat("Snow", "white", 2020)
smokey = Cat("Smokey", "gray", 2023)
```

Each line creates a **new, separate cat object**. Python runs `__init__` for each one, with the values we gave. When we create mitzi, the 'self' inside the Cat class refers to mitzi. When we create shadow, the 'self' refers to shadow, and so on.

![Mitzi, an orange cat](content/images/cat_mitzi.svg) ![Shadow, a black cat](content/images/cat_shadow.svg) ![Snow, a white cat](content/images/cat_snow.svg) ![Smokey, a gray cat](content/images/cat_smokey.svg)

We now have **one class** (`Cat`) and **four objects** (four cats).

## Each Cat Has Its Own Information

To read a cat's information, we write the object, a dot, and the name of the variable:

```python
print(mitzi.name)        # Mitzi
print(mitzi.color)       # orange
print(shadow.name)       # Shadow
print(shadow.color)      # black
print(snow.birth_year)   # 2020
```

`mitzi.color` means "the color **of Mitzi**". `shadow.color` means "the color **of Shadow**". Same variable name, different cats, different values.

We can use them like any other variable:

```python
print(f"{smokey.name} is a {smokey.color} cat born in {smokey.birth_year}")
```

Output:

```
Smokey is a gray cat born in 2023
```

We can even put cats in a list and go over them with a loop:

```python
cats = [mitzi, shadow, snow, smokey]

for cat in cats:
    print(f"{cat.name} is {cat.color}")
```

Output:

```
Mitzi is orange
Shadow is black
Snow is white
Smokey is gray
```

## Patting Cats: Adding an Ability

Cats love to be patted. Let's teach our cats this, and let each cat **remember how many times it was patted**.

We need two new things in the class:

1. A **pat counter**: a new variable `self.pat_counter` that every cat starts with at `0`.
2. A **`pat` method**: a function written inside the class. Every cat can use it.

> A function that is written **inside a class** is called a **method**.

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

What changed:

* `self.pat_counter = 0` - every new cat starts with **0 pats**. Notice that we **don't** give the pat counter when we create a cat. Every cat simply starts at 0, so `__init__` sets it by itself.
* `def pat(self):` - the `pat` method. Like `__init__`, it gets `self`, which means **"the cat that is being patted"**.
* `self.pat_counter = self.pat_counter + 1` - add 1 to **this cat's** counter. Only this cat's counter, no other cat's.

## Patting in Action

We create the cats exactly as before:

```python
mitzi = Cat("Mitzi", "orange", 2019)
shadow = Cat("Shadow", "black", 2021)
snow = Cat("Snow", "white", 2020)
```

To pat a cat, we write the object, a dot, and the method name **with parentheses**:

```python
mitzi.pat()
mitzi.pat()
shadow.pat()
mitzi.pat()
```

Output:

```
Mitzi purrs... (patted 1 times)
Mitzi purrs... (patted 2 times)
Shadow purrs... (patted 1 times)
Mitzi purrs... (patted 3 times)
```

Look at the third line: Shadow's counter is **1**, not 3. Patting Mitzi did not change Shadow at all. Each cat keeps **its own** count.

Now let's check all the counters:

```python
print(mitzi.pat_counter)    # 3
print(shadow.pat_counter)   # 1
print(snow.pat_counter)     # 0
```

![Mitzi, patted 3 times](content/images/cat_mitzi_patted.svg) ![Shadow, patted 1 time](content/images/cat_shadow_patted.svg) ![Snow, patted 0 times](content/images/cat_snow_patted.svg)

Poor Snow was never patted, so its counter is still **0**.

This is the whole idea of OOP in one example:

* **Same ability**: we wrote `pat` **once**, and **every** cat can use it.
* **Own information**: each cat remembers **its own** name, color, birth year and number of pats.

## A Full Program

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

Output:

```
Mitzi purrs... (patted 1 times)
Mitzi purrs... (patted 2 times)
Shadow purrs... (patted 1 times)
Mitzi purrs... (patted 3 times)
Mitzi the orange cat was patted 3 times
Shadow the black cat was patted 1 times
Snow the white cat was patted 0 times
```

## Summary

| Word | What it means | In our example |
|------|---------------|----------------|
| **Class** | The recipe | `Cat` |
| **Object** | A real thing made from the recipe | `mitzi`, `shadow`, `snow` |
| **`__init__`** | Runs automatically when an object is created, to set it up | Saves the name, color and birth year, and sets the pat counter to 0 |
| **`self`** | "This object", the one we are working with right now | The cat being created or patted |
| **Object variable** | Information that each object keeps for itself | `self.name`, `self.pat_counter` |
| **Method** | A function inside the class that every object can use | `pat` |
