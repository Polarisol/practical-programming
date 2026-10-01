# * What we need to remember

1. Numpy can deal with data much faster and more efficiently than regular Python lists. Backstage it is written in C, which is why it is so fast.

2. Numpy allows us to create 1D arrays, as well as multi-dimensional arrays, which are useful for representing matrices and higher-dimensional data.

3. NumPy supports element-wise operations on arrays, which means we can perform mathematical operations on entire arrays without writing loops. the loops are handled internally in C, making the operations much faster.

4. NumPy provides a wide range of functions for creating, manipulating, and performing computations on arrays efficiently such as `reshape`, `transpose`, `sum`, `mean`, `max`, `min`, `sin`, `cos`, `exp` and many more. don't use the Math module for array operations - use NumPy's functions instead.

5. We need to remember how to turn a list into a NumPy array using `np.array()`, how to work with `linspace` and `arange` to create arrays.

6. We need to remember the ways to get a random number, or numbers, using `np.random`:`np.random.rand()`, `np.random.randint()`, and `np.random.uniform()`.