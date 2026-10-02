# * What we need to remember

1. A **class** is a **blueprint for creating objects**. It defines the attributes (variables) and methods (functions) that the objects created from the class will have.

2. An **object** is an instance of a class. We can create many objects from the same class.

3. Every object has its own information - attributes stored in variables. The values of these variables together represent the object's entire **state**.

4. All objects of the same class **share the same abilities or behavior** - methods defined in the class. Each object can use these methods, but the methods operate on the object's own data.

5. **Functions** defined inside a class are called **methods**. They define the abilities or behavior that objects of the class can use.

6. Inside the class definition, we use the keyword `self` to refer to the object which is dealt with by the method at that moment. It allows us to access the object's attributes and other methods from within the class. all methods must have `self` as their first parameter, but we do not pass it when calling the method; Python does it automatically.

7. The **`__init__`** method is a special method in a class that is automatically called when a new object is created. It is used to initialize the object's attributes. It sometimes takes parameters to set the initial state of the object.

8. To access an object's attributes or call its methods from outside the class, we use the **dot notation**: `object.attribute` or `object.method()`. For example, `mitzi.name` or `mitzi.pat()`.