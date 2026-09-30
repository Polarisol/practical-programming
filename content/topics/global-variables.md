# Global Variables in Python

It is perfectly fine to read the value of a global variable from within a function:

```python
a = 5

def foo():
    return a + 10

foo() # the result will be 15
```

However, an issue arises if we try to modify a global variable from within a function (it creates a new local variable instead of modifying the global one):

```python
a = 5

def bar():
    a = 20

bar()
print(a) # will print 5
```

The solution is to declare the variable as `global` before using it:

```python
a = 5

def bar():
    global a
    a = 20

bar()
print(a) # will print 20
```