# OOP Inheritance: Sharing Code Between Classes

## Where We Left Off: the Cat Class

In the previous lesson we wrote a class that describes a cat. Every cat has a name, a color and a birth year, and every cat can be patted:

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

> We changed the message in `pat` a little, from "purrs" to "is happy". You will soon see why.

## Now We Want Dogs Too

Our program is growing, and now we also want to keep track of **dogs**. A dog is very much like a cat:

* It has a name, a color and a birth year.
* It can be patted, and we want to count the pats.

There is just **one difference**: every dog has an **ID number** (the number on the chip that the vet puts in the dog). So when we create a dog, we must also give its ID number.

Here is a `Dog` class:

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

And we can use it exactly like the cats:

```python
rex = Dog("Rex", "brown", 2018, 4521)
rex.pat()
print(rex.id_number)
```

Output:

```
Rex is happy... (patted 1 times)
4521
```

## Do You See the Problem?

Put the two classes side by side and look closely. They are **almost the same**!

| | `Cat` | `Dog` |
|---|---|---|
| `self.name = name` | ✅ | ✅ |
| `self.color = color` | ✅ | ✅ |
| `self.birth_year = birth_year` | ✅ | ✅ |
| `self.pat_counter = 0` | ✅ | ✅ |
| the `pat` method | ✅ | ✅ |
| `self.id_number = id_number` | ❌ | ✅ |

Only **one line** is different. Everything else we wrote **twice**.

Why is this bad?

* **More work**: we typed the same code two times.
* **Mistakes**: imagine we find a bug in `pat`, or want to change the message. We must remember to fix it in **both** classes. If we forget one, the cats and the dogs will behave differently.
* **It gets worse**: if tomorrow we add rabbits, hamsters and parrots, we will copy the same code again and again.

Programmers have a rule: **Don't Repeat Yourself**. When the same code appears in many places, there is usually a better way.

In our case, the better way is called **inheritance**.

## The Idea of Inheritance

Think about how we talk in real life. Cats and dogs are both **animals**. Everything that is true for **every animal** (it has a name, a color, a birth year, it can be patted) is true for cats **and** for dogs.

So here is the plan:

1. Write a class called `Animal` that has **everything that cats and dogs share**.
2. Say that `Cat` **is a kind of** `Animal`. It gets everything `Animal` has, **for free**.
3. Say that `Dog` **is a kind of** `Animal` too. It also gets everything for free, and then we add only **the one thing that is special** about dogs: the ID number.

Just like children inherit things from their parents (eye color, a family name, or a house), a class can **inherit** code from another class.

Some new words:

* **Parent class** (also called **base class** or **superclass**): the class we inherit from. Here, `Animal`.
* **Child class** (also called **subclass**): the class that inherits. Here, `Cat` and `Dog`.

## Step 1: The Animal Class

We take everything that is shared and put it in a class called `Animal`:

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

Nothing new here. This is exactly our old `Cat` class, just with a different name. (Now you know why we changed "purrs" to "is happy": dogs don't purr, so the message should fit **any** animal.)

Notice that `Animal` is not any specific creature. It's a general "some animal" that only has what **all** animals share. Here is the plan for what comes next: `Cat` and `Dog` will both inherit from `Animal`. The cat adds nothing new, and the dog adds an ID number:

![Animal is the parent class. Cat and Dog both inherit from it. Dog also adds an id_number.](content/images/animal_inheritance.svg)

## Step 2: The Cat Class Inherits from Animal

```python
class Cat(Animal):
    pass
```

That's it. Two lines! Let's go over them:

* `class Cat(Animal):` - the name in the parentheses is the **parent class**. This line says: "`Cat` is a kind of `Animal`. Give it everything that `Animal` has."
* `pass` - in Python, a class can't be empty. `pass` means "**there is nothing to add here**". A cat is just an animal, nothing more, so there is nothing extra to write.

Even though we didn't write `__init__` or `pat` inside `Cat`, a cat has them, because it **inherited** them from `Animal`:

```python
mitzi = Cat("Mitzi", "orange", 2019)
mitzi.pat()
mitzi.pat()
print(mitzi.color)
```

Output:

```
Mitzi is happy... (patted 1 times)
Mitzi is happy... (patted 2 times)
orange
```

How does Python know what to do? When we call `mitzi.pat()`, Python looks for a `pat` method inside `Cat`. It doesn't find one, so it **goes up to the parent**, `Animal`, and finds it there. The same happens with `__init__` when we create the cat.

## Step 3: The Dog Class Inherits from Animal

A dog is also an animal, so we start the same way:

```python
class Dog(Animal):
```

But a dog is **a bit different**: its `__init__` must also receive an `id_number`. The `__init__` that `Animal` gives us only receives a name, a color and a birth year. That's not enough for a dog.

So the `Dog` class will write **its own** `__init__`. When a child class writes a method with **the same name** as a method in its parent, the child's version **replaces** the parent's version. This is called **overriding** the method.

```python
class Dog(Animal):

    def __init__(self, name, color, birth_year, id_number):
        super().__init__(name, color, birth_year)
        self.id_number = id_number
```

Let's go over it line by line:

* `def __init__(self, name, color, birth_year, id_number):` - the dog's own `__init__`. It receives everything an animal receives, **plus** `id_number`. Because `Dog` has its own `__init__`, Python will use **this one** when we create a dog, and not the one from `Animal`.
* `super().__init__(name, color, birth_year)` - this is the important new line. `super()` means "**my parent class**" (here, `Animal`). So this line means: "run the **parent's** `__init__`, and give it the name, the color and the birth year". The parent's `__init__` then does its usual job: it saves the name, the color and the birth year, and sets the pat counter to 0.
* `self.id_number = id_number` - after the parent finished its part, we do **the one extra thing** that only dogs need: save the ID number.

In plain words, the dog's `__init__` says: "**first, set me up like any animal. Then, also save my ID number.**"

### Why do we need `super()`?

Remember, the dog's `__init__` **replaces** the animal's `__init__`. So when we create a dog, the animal's `__init__` does **not** run by itself. But a dog still needs a name, a color, a birth year and a pat counter. Someone has to save them.

Without `super()`, **we** would have to write those lines ourselves, inside the dog's `__init__`:

```python
class Dog(Animal):

    def __init__(self, name, color, birth_year, id_number):
        self.name = name
        self.color = color
        self.birth_year = birth_year
        self.pat_counter = 0
        self.id_number = id_number
```

This works, but look at it: the first four lines are **copied** from `Animal`. That is exactly the repeating we wanted to get rid of! We would be back at the start, with the same lines written in two places and the same problems: if we change how an animal is set up, we must remember to change the dog too.

In our example the parent's `__init__` has only four lines, so copying them doesn't look so terrible. But in real programs a parent's `__init__` can have **10, 20 or even more** lines, and many child classes can inherit from the same parent. Copying all of that into every child would be a lot of work and a lot of places for mistakes.

`super().__init__(name, color, birth_year)` saves us from all of this. With **one line** we tell Python: "**run the parent's `__init__` and let it do its usual work**". The parent saves the name, the color, the birth year and the pat counter **for us**, no matter how many lines that takes. Then we only write what is **new** for dogs:

```python
class Dog(Animal):

    def __init__(self, name, color, birth_year, id_number):
        super().__init__(name, color, birth_year)   # the parent does its part
        self.id_number = id_number                  # we add only what is new
```

### Dogs still get `pat` for free

We overrode **only** `__init__`. We didn't write a `pat` method inside `Dog`, so dogs still inherit `pat` from `Animal`, just like cats:

```python
rex = Dog("Rex", "brown", 2018, 4521)
rex.pat()
print(f"{rex.name}'s ID number is {rex.id_number}")
```

Output:

```
Rex is happy... (patted 1 times)
Rex's ID number is 4521
```

## A Full Program

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

Output:

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

Notice that cats and dogs live happily in the **same list**, and the loop treats them all the same way. That works because they are **all animals**: they all have a name, a color and a pat counter.

But be careful: only dogs have an ID number. `mitzi.id_number` would give an error, because the `Cat` class never saves an ID number.

Compare this to where we started: the shared code is now written **only once**, inside `Animal`. If we want to change the `pat` message, we change it in one place, and both cats and dogs get the change. And if we want to add rabbits tomorrow, it's just:

```python
class Rabbit(Animal):
    pass
```

## Summary

| Word | What it means | In our example |
|------|---------------|----------------|
| **Inheritance** | A class gets all the code of another class, for free | `Cat` and `Dog` get `__init__` and `pat` from `Animal` |
| **Parent class** (base class, superclass) | The class we inherit from | `Animal` |
| **Child class** (subclass) | The class that inherits | `Cat`, `Dog` |
| **`class Child(Parent):`** | How we write "Child is a kind of Parent" | `class Dog(Animal):` |
| **`pass`** | "Nothing to add here" | `Cat` adds nothing to `Animal` |
| **Overriding** | A child writes its own version of a parent's method, which replaces the parent's version | `Dog` writes its own `__init__` |
| **`super()`** | "My parent class", used to run the parent's version of a method | `super().__init__(name, color, birth_year)` |
