# Why SymPy?

## Why SymPy matters in Python

Python is great at calculating with numbers. Libraries like NumPy can do millions of calculations per second. But numbers are only half of the story. Before you can calculate, you often need the **formula**: what is the derivative of this function? Which `x` solves this equation? What is the inverse of this matrix?

On paper you find the formula with algebra, and that is slow and easy to get wrong. **SymPy** lets Python do the algebra for you:

- **Exact answers.** `sqrt(2)` stays `√2` and `1/3` stays `1/3`. There are no rounding errors hiding in the result.
- **Formulas, not only numbers.** You get a general answer with letters in it, and you can reuse it for any values later.
- **Checking your own work.** You can test your homework, or the formula you copied from a book, in one line.
- **Pure Python.** It is free, installs with one command, and works together with NumPy and Matplotlib.

That is why SymPy is used in schools, universities, research labs and engineering companies. It is the "math notebook" of the Python world.

## How SymPy is used in robotics

A robot is full of math: angles, distances, speeds, forces. Engineers use SymPy to **find** the equations once, and then the robot's program uses those equations to **calculate** quickly, many times a second.

### Where is the robot arm's hand? (Kinematics)

Think of a simple robot arm with two parts (links) of lengths `L1` and `L2`, and two motors that turn by angles `θ1` and `θ2`. Where is the hand (the end of the arm)? With a bit of trigonometry:

```python
import sympy as sp

t1, t2, L1, L2 = sp.symbols('theta1 theta2 L1 L2')

x = L1*sp.cos(t1) + L2*sp.cos(t1 + t2)
y = L1*sp.sin(t1) + L2*sp.sin(t1 + t2)
```

```math
x = L_{1} \cos{\left(\theta_{1} \right)} + L_{2} \cos{\left(\theta_{1} + \theta_{2} \right)}
y = L_{1} \sin{\left(\theta_{1} \right)} + L_{2} \sin{\left(\theta_{1} + \theta_{2} \right)}
```

This is called **forward kinematics**: from the motor angles to the position of the hand. The opposite question, "which angles put the hand at a point I choose?", is called **inverse kinematics**, and it means solving equations, which is exactly what `sp.solve` does.

### How fast does the hand move? (The Jacobian)

When the motors turn a little, how much does the hand move? The answer is a matrix of derivatives called the **Jacobian**. By hand it is a lot of work; SymPy does it in one line:

```python
J = sp.Matrix([x, y]).jacobian([t1, t2])
print(sp.simplify(J.det()))
```

```math
\det J = L_{1} L_{2} \sin{\left(\theta_{2} \right)}
```

The result tells us something important: when `sin(θ2) = 0` (the arm is fully stretched or fully folded) the determinant is 0. In this position, called a **singularity**, the arm can't move its hand in every direction. Robot programmers must avoid it, and SymPy found it for us.

### More examples

- **Motion planning.** Find a smooth path for a motor, for example a polynomial that starts and stops at speed 0, by solving a system of equations.
- **Dynamics.** Get the equations of motion of a robot (forces, torques, gravity) from physics. SymPy even has a special module for this, `sympy.physics.mechanics`.
- **Control.** Design and check controllers that keep a robot balanced or moving on a line, using derivatives, Laplace transforms and differential equations.
- **Sensors.** Rotate and move coordinates with rotation matrices, for example from the camera's point of view to the robot's point of view.

### From formula to robot code

A robot can't wait for SymPy to do algebra while it is moving. So the usual workflow is:

1. **Find** the formula with SymPy (once, on your computer).
2. **Turn it into fast code** with `sp.lambdify` (you will see it at the end of the next lesson), or print it as code with `sp.pycode` or even `sp.ccode` for C programs on microcontrollers.
3. **Use** that fast function in the robot's program.

In the next lesson, **SymPy Basics**, you will learn the tools step by step.
