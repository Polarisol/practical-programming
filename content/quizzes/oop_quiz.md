# Quiz yourself!

Answer all the questions, then press **Submit answers** to see your score and the corrections.

## Look at the line `mitzi = Cat("Mitzi", "orange", 2019)`. Which sentence is true?
- [ ] `mitzi` is the class and `Cat` is the object.
  > It's the other way around. The name after `=` with the parentheses (`Cat`) is the blueprint, and `mitzi` is what we get from it.
- [ ] `Cat` is itself a cat that can be patted.
  > A class is **not** a cat. It is only the instructions for making cats. We pat objects like `mitzi`, not the class.
- [x] `Cat` is the blueprint, and `mitzi` is an object made from it.
  > Right! The class describes what every cat has and can do, and `mitzi` is one real cat built from that description.
- [ ] Every new cat needs its own new class.
  > One class is enough for as many objects as we like. We can write `shadow = Cat(...)`, `snow = Cat(...)` and so on from the same `Cat` class.
> A **class** is a blueprint. An **object** is an instance made from that blueprint, and one class can create many objects.

## Using the `Cat` class from the lesson, what does the **last line** print?
```python
mitzi = Cat("Mitzi", "orange", 2019)
shadow = Cat("Shadow", "black", 2021)

mitzi.pat()
shadow.pat()
mitzi.pat()

print(mitzi.pat_counter, shadow.pat_counter)
```
- [x] `2 1`
  > Right! Mitzi was patted twice and Shadow once. Each cat counts only its own pats.
- [ ] `3 3`
  > That would mean all cats share one counter. But each object has its **own** `pat_counter`.
- [ ] `3 1`
  > Count again: `mitzi.pat()` appears only two times. The middle pat went to Shadow.
- [ ] `2 2`
  > Patting Mitzi doesn't change Shadow. Shadow was patted only once.
> Every object has its own **state**: its own values for its variables. All cats share the same `pat` method, but the method works on the data of the cat it was called on.

## When we call `shadow.pat()`, what does `self` mean inside the `pat` method?
- [ ] The `Cat` class.
  > `self` is not the class. It is one specific object made from the class.
- [x] The object `shadow`.
  > Right! `self` is the object the method is working on right now, which is the object written before the dot.
- [ ] The first cat that was ever created.
  > `self` changes with every call. For `mitzi.pat()` it is Mitzi, and for `shadow.pat()` it is Shadow.
- [ ] All the cats at once.
  > A method call works on **one** object only. That's why patting Shadow doesn't change any other cat.
> Inside a class, `self` means "this object". Every method has `self` as its first parameter, but we don't pass it ourselves. Python does it automatically.

## When does the `__init__` method run?
- [ ] Only when we write `mitzi.__init__()` ourselves.
  > We never need to call `__init__` ourselves to create an object. Python calls it for us.
- [ ] Once, when Python reads the `class Cat:` line.
  > Writing the class only creates the blueprint. No cat exists yet, so there is nothing to set up.
- [ ] Every time we call any method, like `mitzi.pat()`.
  > If that were true, `self.pat_counter = 0` would reset the counter on every pat, and it would never go above 1.
- [x] Automatically, every time a new object is created, for example `new_cat = Cat("Snow", "white", 2020)`.
  > Right! `__init__` runs once for each new object, to set up its starting values.
> `__init__` is a special method that **initializes** (sets up) a new object. The values we give in the parentheses, like a name and a color, are passed to it.

## Look at this class. Which statements are true?
```python
class Car:

    def __init__(self, make, year):
        self.make = make
        self.year = year

    def honk(self):
        print(f"The {self.make} says beep!")


my_car = Car("Toyota", 2015)
```
- [x] `honk` is a method, because it is a function written inside the class.
  > Right! A function written inside a class is called a method, and every `Car` object can use it.
- [ ] To use `honk`, we must write `my_car.honk(my_car)`.
  > We don't pass `self` ourselves. Python passes it automatically, so we just write `my_car.honk()`.
- [x] `my_car.year` gives `2015`.
  > Right! We use the dot to read an object's information: `my_car.year` means "the year of `my_car`".
- [ ] If we named the class `car` instead of `Car`, Python would give an error.
  > Python would accept `car`. Starting class names with a capital letter is a **convention**: it helps us tell classes apart from variables.
> We use **dot notation** to reach an object's information and abilities: `object.attribute` and `object.method()`.

## Here are an `Animal` class and a `Cat` class. What happens when this code runs?
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


mitzi = Cat("Mitzi", "orange", 2019)
mitzi.pat()
```
- [ ] An error, because `Cat` has no `pat` method.
  > `Cat` doesn't write `pat` itself, but it inherits it. Python doesn't find `pat` in `Cat`, so it goes up to the parent `Animal` and finds it there.
- [x] It prints `Mitzi is happy... (patted 1 times)`
  > Right! `Cat` inherits both `__init__` and `pat` from `Animal`, so a cat can do everything an animal can.
- [ ] Nothing happens, because `pass` means the class is empty.
  > `pass` only means "nothing **extra** to add". The cat still gets everything from `Animal`.
- [ ] An error, because `Cat` has no `__init__` and can't receive a name.
  > `Cat` uses the `__init__` it inherited from `Animal`, which receives a name, a color and a birth year.
> `class Cat(Animal):` means `Cat` inherits from `Animal`. `Animal` is the **parent class** (superclass), and `Cat` is the **child class** (subclass).

## Using the `Animal`, `Cat` and `Dog` classes from the lesson, what happens on the **last line**?
```python
mitzi = Cat("Mitzi", "orange", 2019)
rex = Dog("Rex", "brown", 2018, 4521)

print(mitzi.id_number)
```
- [ ] It prints `0`
  > Only `pat_counter` starts at 0. The ID number is never set to a default value.
- [ ] It prints `4521`
  > `4521` is Rex's ID number. Each object has its own information, and Mitzi is a different object.
- [x] An error, because cats don't have an `id_number`.
  > Right! Only the `Dog` class saves an ID number. `Cat` inherits only what `Animal` has, and `Animal` has no ID number.
- [ ] It prints nothing, because Mitzi is a cat.
  > Python doesn't quietly skip it. Reading a variable that the object never saved causes an error.
> Inheritance goes from parent to child only. A child gets everything the parent has, but it doesn't get things that a **sibling** class (like `Dog`) adds.

## What does this code print?
```python
class Animal:

    def __init__(self, name):
        self.name = name

    def speak(self):
        print(f"{self.name} makes a sound")


class Cat(Animal):

    def speak(self):
        print(f"{self.name} says meow")


class Dog(Animal):
    pass


mitzi = Cat("Mitzi")
rex = Dog("Rex")
mitzi.speak()
rex.speak()
```
- [x] `Mitzi says meow`, then `Rex makes a sound`
  > Right! `Cat` overrides `speak` with its own version, while `Dog` writes nothing and keeps the version from `Animal`.
- [ ] `Mitzi makes a sound`, then `Rex makes a sound`
  > When a child writes a method with the **same name** as the parent's, the child's version is used. `Cat` has its own `speak`.
- [ ] `Mitzi says meow`, then `Rex says meow`
  > Only `Cat` changed `speak`. `Dog` inherits from `Animal`, not from `Cat`.
- [ ] `Mitzi makes a sound`, then `Mitzi says meow`
  > Each call runs one `speak` on one object. `rex.speak()` works on Rex, not on Mitzi.
> **Overriding** means a child class writes its own version of a parent's method. Python looks in the child class first, and only goes up to the parent if it doesn't find the method there.

## The `Animal` class is the one from the lesson. In this `Dog` class, the programmer forgot the `super()` line. What happens?
```python
class Dog(Animal):

    def __init__(self, name, color, birth_year, id_number):
        self.id_number = id_number


rex = Dog("Rex", "brown", 2018, 4521)
rex.pat()
```
- [ ] It prints `Rex is happy... (patted 1 times)`, because `Dog` inherits from `Animal`.
  > `Dog` does inherit from `Animal`, but its own `__init__` **replaces** the parent's. So the parent's `__init__` never runs and nothing sets up the pat counter.
- [ ] Python automatically runs both `__init__` methods, so everything works.
  > Python runs only one `__init__`: the child's. To also run the parent's, we must call it with `super().__init__(...)`.
- [ ] An error already on the line `rex = Dog(...)`.
  > Creating Rex works: the dog's `__init__` receives all four values and saves the ID number. The problem shows up later.
- [x] An error on `rex.pat()`, because Rex never got a `pat_counter`.
  > Right! The line `self.pat_counter = 0` is in the parent's `__init__`, which never ran. When `pat` tries to add 1 to `self.pat_counter`, it doesn't exist.
> When a child class overrides `__init__`, it should usually call `super().__init__(...)` so the parent can set up its part of the object.

## Which statements about `super().__init__(name, color, birth_year)` inside `Dog` are true?
- [ ] It creates a second, separate `Animal` object.
  > No new object is created. The parent's `__init__` sets up the **same** dog object that is being created.
- [x] It runs the parent's `__init__`, which saves the name, color, birth year and pat counter.
  > Right! `super()` means "my parent class", so this line runs `Animal`'s `__init__` for this dog.
- [ ] It must be written inside every method of the `Dog` class.
  > We only use `super()` where we need the parent's version of a method. `Dog` didn't override `pat`, so it doesn't need `super()` there.
- [x] Without it, we would have to copy the parent's setup lines into the dog's `__init__`.
  > Right! And copying code is exactly what inheritance helps us avoid: if the parent's setup changes, we would have to fix it in two places.
> `super()` gives us access to the parent class. Calling `super().__init__(...)` in a child's `__init__` lets the parent do its usual setup, and the child adds only what is new.
