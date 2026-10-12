# BFS - Breadth-First Search

## The idea

Drop a stone into a pond. The ripples spread out in rings: first the water right next to the stone moves, then the ring around that, then the next ring.

**Breadth-First Search** (BFS) explores a graph the same way. It starts at one node and visits:

1. First, all the nodes that are **1 step** away.
2. Then, all the nodes that are **2 steps** away.
3. Then 3 steps, and so on, until there is nothing new left.

"Breadth" means "width": BFS goes **wide** before it goes deep.

## An example

We start at `A` in our example graph. The colours show how many steps away each node is, and the small black numbers show the order in which BFS visits them:

![BFS on the example graph. A is step 0, B and C are step 1, D, E and F are step 2, G is step 3. The path A-B-E-G is highlighted](content/images/bfs_layers.svg)

- **Step 0:** `A` - where we start.
- **Step 1:** `B` and `C` - the neighbours of `A`.
- **Step 2:** `D`, `E` and `F` - the new neighbours of `B` and `C`.
- **Step 3:** `G` - the only node still not visited.

Because BFS reaches every node through the **fewest possible steps**, the first time it reaches a node, it has found the shortest way to it. The red line is the shortest path from `A` to `G`: `A → B → E → G`, 3 steps.

## The waiting line: a queue

How does BFS remember who comes next? It uses a **queue**, just like the line at the school cafeteria: whoever came in **first** is served **first**. New nodes join at the back of the line, and we always take the next node from the front.

Here is the queue while BFS runs from `A`:

| We visit | Its new neighbours join the line | The queue after that |
|----------|----------------------------------|----------------------|
| `A` | `B`, `C` | `B C` |
| `B` | `D`, `E` (`A` was already seen) | `C D E` |
| `C` | `F` | `D E F` |
| `D` | nothing new | `E F` |
| `E` | `G` | `F G` |
| `F` | nothing new | `G` |
| `G` | nothing new | empty - we are done |

Notice that a node joins the line at most once. We mark it as **seen** when it joins, so nobody adds it again.

## The code

Python has a ready-made queue called `deque` (say "deck"). `append` adds to the back, and `popleft` takes from the front.

```python
from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F', 'G'],
    'F': ['C', 'E'],
    'G': ['E'],
}

def bfs(graph, start):
    visited = {start}           # nodes we have already seen
    queue = deque([start])      # nodes waiting to be visited, first in - first out
    order = []

    while queue:
        node = queue.popleft()  # take the node that has waited the longest
        order.append(node)
        for neighbour in graph[node]:
            if neighbour not in visited:
                visited.add(neighbour)
                queue.append(neighbour)
    return order

print(bfs(graph, 'A'))   # ['A', 'B', 'C', 'D', 'E', 'F', 'G']
```

> Why not use a normal list and `pop(0)`? It works, but taking the first item out of a long list is slow, because Python has to move all the other items one place forward. `deque` takes it out instantly.

## Finding the shortest path

Visiting the nodes is nice, but usually we want the **path** itself. The trick: whenever we reach a new node, we write down **which node we came from**. When we reach the goal, we follow these notes backwards, from the goal to the start, like following breadcrumbs.

```python
def shortest_path(graph, start, goal):
    came_from = {start: None}   # for every node we reach: the node we came from
    queue = deque([start])

    while queue:
        node = queue.popleft()
        if node == goal:
            break
        for neighbour in graph[node]:
            if neighbour not in came_from:
                came_from[neighbour] = node
                queue.append(neighbour)

    if goal not in came_from:
        return None             # there is no way to reach the goal

    # walk backwards from the goal to the start
    path = []
    node = goal
    while node is not None:
        path.append(node)
        node = came_from[node]
    path.reverse()
    return path

print(shortest_path(graph, 'A', 'G'))   # ['A', 'B', 'E', 'G']
print(shortest_path(graph, 'D', 'F'))   # ['D', 'B', 'E', 'F']
```

Here `came_from` does two jobs: it remembers the way back, and it is also our "already seen" collection.

## When to use BFS

- **Good:** BFS always finds the path with the **fewest steps**. On a grid map where every move costs the same, that is the shortest path for a robot.
- **Good:** It is simple and it never gets lost going down a long, wrong road.
- **Not so good:** It searches in **all directions equally**, even away from the goal. On a big map it looks at a huge number of squares (you will see this in the A\* item).
- **Not so good:** It counts steps, not distances. If roads have different lengths (weights), the path with fewer roads is not always the quickest one.
