# * What we need to remember

1. A **class** is a **blueprint for creating objects**. It defines the attributes (variables) and methods (functions) that the objects created from the class will have.

2. A class name starts with a capital letter by convention. This helps distinguish class names from variable names and makes the code more readable.

3. An **object** is an instance of a class. We can create many objects from the same class.

4. Every object has its own information - attributes stored in variables. The values of these variables together represent the object's entire **state**.

5. All objects of the same class **share the same abilities or behavior** - methods defined in the class. Each object can use these methods, but the methods operate on the object's own data.

6. **Functions** defined inside a class are called **methods**. They define the abilities or behavior that objects of the class can use.

7. Inside the class definition, we use the keyword `self` to refer to the object which is dealt with by the method at that moment. It allows us to access the object's attributes and other methods from within the class. all methods must have `self` as their first parameter, but we do not pass it when calling the method; Python does it automatically.

8. The **`__init__`** method is a special method in a class that is automatically called when a new object is created. It is used to initialize the object's attributes. It sometimes takes parameters to set the initial state of the object.

9. To access an object's attributes or call its methods from outside the class, we use the **dot notation**: `object.attribute` or `object.method()`. For example, `mitzi.name` or `mitzi.pat()`.

10. A class can inherit from another class, which means it can take on the attributes and methods of the parent class. `class Cat(Animal):` creates a `Cat` class that inherits from the `Animal` class. the parent class is also called the **superclass**, and the class that inherits is called the **subclass**.

11. We can 'rewrite' a method that exist in the parent class, so that it will so something different in the subclass. This is called **method overriding**. For example, if the `Animal` class has a `speak` method, the `Cat` subclass can provide its own implementation of `speak` that behaves differently from the one in `Animal`.

12. If we used overriding and we have a method in the subclass, we can still call the method from the parent class using the `super()` function. For example, `super().speak()` inside the `Cat` subclass would call the `speak` method of the `Animal` superclass.

13. It is super common and often critical to call `super().__init__()` inside the `__init__` method of a subclass to ensure that the parent class is properly initialized.