# Plotting Graphs with MatPlotLib

## Imports

```python
import matplotlib.pyplot as plt
import numpy as np
```

## Plotting lines

1. y=x^2

```python
data_x = np.linspace(-10, 10, 21)
data_y = data_x**2

fig, ax = plt.subplots(1,1)
ax.plot(data_x, data_y)
plt.show()
```

![Resulting line plot](content/images/graph1.png)

2. Let's style the plot

```python
data_x = np.linspace(-10, 10, 21)
data_y = data_x**2

fig, ax = plt.subplots(1,1)
ax.plot(data_x, data_y,
        linewidth=1, color=(0.2, 0, 1), linestyle='-',
        marker='o', markersize=6, markerfacecolor='red', markeredgewidth=0.5)
plt.show()
```

![Resulting line plot](content/images/graph2.png)

3. y=sin(x) and y=cos(x)

```python
data1_x = np.linspace(0, 4*np.pi, 100)
data1_y = np.sin(data1_x)
data1_y2 = np.cos(data1_x)

fig, ax = plt.subplots(1,1)
ax.plot(data1_x, data1_y)
ax.plot(data1_x, data1_y2)
plt.show()
```

![Resulting line plot](content/images/graph3.png)

4. Style the surrounding area

```python
data1_x = np.linspace(0, 4*np.pi, 100)
data1_y = np.sin(data1_x)
data1_y2= np.cos(data1_x)

fig, ax = plt.subplots(1,1)
ax.plot(data1_x, data1_y, label='sin', color='red', linestyle='dashed', linewidth=2)
ax.plot(data1_x, data1_y2, label='cos', color='blue')
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_title('Sin and Cos')
ax.legend()
plt.show()
```

![Resulting line plot](content/images/graph4.png)

## Scatter plots

5. Random scatter plot

```python
data2_x = np.linspace(0, 10, 100)
data2_y = 2.5 * data2_x + 2*np.random.normal(size=data2_x.size)

fig, ax = plt.subplots(1,1)
ax.scatter(data2_x, data2_y, label='Data', s=10, color='blue', marker='x')

# Add Labels and Legend
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.legend()
plt.show()
```

![Resulting line plot](content/images/graph5.png)

6. With a trend line (bonus)

```python
data2_x = np.linspace(0, 10, 100)
data2_y = 2.5 * data2_x + 2*np.random.normal(size=data2_x.size)

coefficients = np.polyfit(data2_x, data2_y, 1) # 1 is the degree of the polynomial
line_function = np.poly1d(coefficients) # Create a line function
line_x = np.linspace(0, 10, 100)
line_y = line_function(line_x)

fig, ax = plt.subplots(1,1)
ax.scatter(data2_x, data2_y, label='Data', s=10, color='blue', marker='x')
ax.plot(line_x, line_y, color='red', label='Trend Line')
ax.text(0, 20, f'y = {coefficients[0]:.2f}x + {coefficients[1]:.2f}', color='red')
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.legend()
plt.show()
```

![Resulting line plot](content/images/graph6.png)

## Histograms

7. Bar chart for grades

```python
# Generate random grade data
grades = np.random.normal(80, 20, 100).astype(int) # 100 random grades with mean 80

# Plot histogram using ax
fig, ax = plt.subplots(1,1)
ax.hist(grades, bins=10, edgecolor='black')

ax.set_xlabel('Grades')
ax.set_ylabel('Frequency')
ax.set_title('Grade Distribution')
plt.show()
```

![Resulting line plot](content/images/graph7.png)

## Bar Graphs

8. Simple bar graph

```python
food = ['Fries', 'Potato', 'Steak', 'Pizza', 'HotDog']
calories = [607, 542, 533, 296, 260]

# Plot bar plot
fig, ax = plt.subplots(1,1)
ax.bar(food, calories, color='skyblue', edgecolor='black')

# Add Labels and title
ax.set_xlabel('Categories')
ax.set_ylabel('Values')
ax.set_title('Bar Plot of Categories vs Values')

# Show plot
plt.show()
```

![Resulting line plot](content/images/graph8.png)

9. Now let's make it look nice

```python
food = ['Fries', 'Potato', 'Steak', 'Pizza', 'HotDog']
calories = [607, 542, 533, 296, 260]

# Define colors for each bar
colors = ['lightgray', 'lightgray', 'red', 'lightgray', 'lightgray']

# Plot bar plot
fig, ax = plt.subplots(1,1,dpi=150)
bars = ax.bar(food, calories, color=colors, width=0.8)
ax.set_title('Calories per 100g', fontsize=18, color=(0.3,0.3,0.3))

# Hide x-axis ticks
ax.tick_params(axis='x', which='both', bottom=False, top=False, labelsize=14)
ax.set_yticks([])

# Remove all spines
for spine in ax.spines.values():
    spine.set_visible(False)

# Display the calories value as text on the graph
for bar, calorie, color in zip(bars, calories, colors):
    height = bar.get_height()
    if color == 'red':
        text_color = 'white'
    else:
        text_color = (0.2,0.2,0.2)
    
    ax.text(bar.get_x() + bar.get_width() / 2, height*0.95, str(calorie), ha='center', fontsize=16, color=text_color)

# Show plot
plt.show()
```

![Resulting line plot](content/images/graph9.png)