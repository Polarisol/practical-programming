# * What we need to remember (OOP)

1. You should go over the code skeleton for the OOP version of PySide6 and understand it thoroughly.

2. You should understand the inheritance made in the class definition of the window.

3. You should know that the `self` keyword inside a window class refers to the window instance itself.

4. You should understand how to define variables and methods inside the window class. using `self.variable_name` for instance variables and `def method_name(self):` for instance methods.

5. You should understand how to connect signals to slots within the window class, using `self.button.clicked.connect(self.method_name)` as an example.

6. You should understand how create and show additional windows. importing them, creating objects of the window classes, and calling their `show()` methods. See 'PySide6 Multiple Windows Part 1' for more details.

7. You should understand the setup that enable data to be accessed across different windows. See 'PySide6 Multiple Windows Part 2' for more details.

8. You should know what timers are, why they are used, and how to use them. See 'PySide6 Timers' for more details.