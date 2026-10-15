# A* Search

## The idea

BFS finds the shortest path, but it is a bit "blind". It spreads out in every direction equally, even in directions that lead **away** from the goal.

When you look for the bathroom in a new building and you see a sign pointing left, you do not search the right side of the building first. You head left, and only try other ways if that one is blocked.

**A\*** (say "A-star") works like that. It still searches carefully, like BFS, but it uses a **guess** of how far each place is from the goal, and it always tries the most promising place first.

## BFS vs A\* on a map

Here is a robot on a grid map. It starts at `S`, must reach `G`, and there is a wall in the middle. Each move goes one square up, down, left or right. The light blue squares are the ones each algorithm had to look at before it found the goal:

![The same grid twice. On the left, BFS explored 83 squares, almost the whole map. On the right, A* explored only 21 squares, mostly between S and G. Both found a path of 12 steps](content/images/astar_vs_bfs.svg)

Both found a shortest path, 12 steps. But BFS looked at **83** squares, almost the whole map, while A\* looked at only **21**, mostly the squares that lead toward the goal. On a real map with millions of squares, this difference is huge. That is why A\* is the favourite of game makers and robot builders.

## The three numbers: g, h and f

For every square it knows about, A\* keeps three numbers:

- **g** - how many steps it **really** took to get here from the start. This we know exactly.
- **h** - a **guess** (called a **heuristic**) of how many steps are left from here to the goal.
- **f = g + h** - the guessed length of the whole trip, if we go through this square.

A\* always explores the square with the **smallest f** next: the square on the shortest-looking trip.

When several squares share the smallest f, A\* takes the one with the **smallest h** first: the one whose guess says it is closest to the goal. This does not change the answer (A\* still finds a shortest path), it just helps A\* reach the goal sooner instead of trying many equally good squares side by side.

A good guess on a grid is the **Manhattan distance**: the number of rows plus the number of columns between the square and the goal, as if there were no walls. (It is named after the streets of Manhattan, where you can only walk along a grid of blocks.)

```
h = |row - goal_row| + |col - goal_col|
```

For example, `S` is in row 3, column 2, and `G` is in row 3, column 10. The guess from `S` is `|3 - 3| + |2 - 10| = 8`. The real path is 12 steps because of the wall, but 8 is a fine guess.

> **The golden rule of the guess:** it may be too small, but it must **never be bigger** than the real distance. The Manhattan distance follows this rule, because walls can only make the trip longer, never shorter. With such a guess, A\* always finds a shortest path. If the guess is too big, A\* can rush past the best path and return a longer one.

## A small example by hand

Say the robot is at `S` (g = 0, h = 8, f = 8) and looks at its four neighbours:

| Square | g (steps so far) | h (guess to goal) | f = g + h |
|--------|------------------|-------------------|-----------|
| right of `S` | 1 | 7 | **8** |
| above `S` | 1 | 9 | 10 |
| below `S` | 1 | 9 | 10 |
| left of `S` | 1 | 9 | 10 |

The square on the right has the smallest f, so A\* explores it next. It keeps moving right until the wall blocks it. Then the squares around the wall have the smallest f, so A\* walks around the wall and continues to `G`. It almost never bothers with the squares behind `S`, because their f is always bigger.

## Choosing the smallest: a priority queue

BFS used a queue (first in, first out), and DFS used a stack (last in, first out). A\* needs a **priority queue**: whatever you put in, the item with the **smallest** value always comes out first. It is like the emergency room in a hospital, where the most urgent patient is treated first, not the one who came first.

Python has one in the `heapq` module:

```python
import heapq

waiting = []
heapq.heappush(waiting, (10, 'above'))
heapq.heappush(waiting, (8, 'right'))
heapq.heappush(waiting, (12, 'far away'))

print(heapq.heappop(waiting))   # (8, 'right') - the smallest number comes out first
```

We push `(f, h, square)`, so the square with the smallest f comes out first. Python compares tuples one item at a time, so when two squares have the same f, it compares `h` next: the square closer to the goal comes out first.

## The code

The map is a list of strings: `#` is a wall, `S` is the start and `G` is the goal. A square is stored as a pair `(row, col)`.

```python
import heapq

grid = [
    "............",
    "............",
    "......#.....",
    "..S...#...G.",
    "......#.....",
    "......#.....",
    "............",
    "............",
]

def find(symbol):
    for row in range(len(grid)):
        for col in range(len(grid[row])):
            if grid[row][col] == symbol:
                return (row, col)

def neighbours(cell):
    row, col = cell
    result = []
    for d_row, d_col in [(-1, 0), (1, 0), (0, -1), (0, 1)]:   # up, down, left, right
        r, c = row + d_row, col + d_col
        if 0 <= r < len(grid) and 0 <= c < len(grid[0]) and grid[r][c] != '#':
            result.append((r, c))
    return result

def guess(cell, goal):
    # Manhattan distance: rows + columns between the squares, ignoring walls
    return abs(cell[0] - goal[0]) + abs(cell[1] - goal[1])

def a_star(start, goal):
    steps = {start: 0}              # g: the real number of steps from the start
    came_from = {start: None}
    to_visit = [(guess(start, goal), guess(start, goal), start)]  # (f, h, cell): smallest f first, on a tie smallest h
    explored = set()                # squares we already took out of the priority queue

    while to_visit:
        f, h, cell = heapq.heappop(to_visit)
        if cell in explored:        # an older entry for a square we already explored
            continue
        explored.add(cell)
        if cell == goal:
            break
        for nb in neighbours(cell):
            new_steps = steps[cell] + 1
            if nb not in steps or new_steps < steps[nb]:   # a new square, or a shorter way to it
                steps[nb] = new_steps
                came_from[nb] = cell
                heapq.heappush(to_visit, (new_steps + guess(nb, goal), guess(nb, goal), nb))

    if goal not in came_from:
        return None, len(explored)  # the goal cannot be reached

    # walk backwards from the goal to the start, exactly like in BFS
    path = []
    cell = goal
    while cell is not None:
        path.append(cell)
        cell = came_from[cell]
    path.reverse()
    return path, len(explored)

path, explored = a_star(find('S'), find('G'))
print('Squares explored:', explored)   # 21
print('Steps:', len(path) - 1)         # 12
print(path)
```

Output:

```
Squares explored: 21
Steps: 12
[(3, 2), (3, 3), (3, 4), (3, 5), (2, 5), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (2, 10), (3, 10)]
```

The path goes right from `S`, up and around the top of the wall, and down to `G`.

Try it yourself: move the wall, make it longer, or add more walls, and see how the number of explored squares changes.

## A\* and its family

- If the guess is always `0`, A\* looks only at the real distance, and it behaves like BFS: it spreads out evenly in all directions.
- A\* also works on **weighted** graphs, like the town map in the introduction. Instead of adding `1` for each step, add the weight of the road (the minutes). With a guess of `0`, this is the famous **Dijkstra's algorithm**, which map apps are built on. With a good guess (for example, the straight-line distance to the destination), it becomes A\*.

## When to use A\*

- **Good:** finding the **shortest path to one specific goal**, fast. This is the classic choice for robot path planning and for characters in video games.
- **Good:** the better the guess, the fewer squares it explores.
- **Not so good:** you need a sensible guess. If you do not know where the goal is (for example, "find the nearest charging station"), you cannot make a guess, and BFS or Dijkstra is the right tool.
- **Not so good:** it is more code than BFS. For a small map, BFS is often good enough.
