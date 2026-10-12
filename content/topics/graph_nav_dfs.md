# DFS - Depth-First Search

## The idea

Imagine exploring a cave with many tunnels. You pick a tunnel and walk along it as far as you can. When you reach a dead end, you walk **back** to the last place where there was a tunnel you have not tried yet, and go down that one. You keep doing this until you have seen every tunnel.

That is **Depth-First Search** (DFS). It goes **deep** first: it keeps moving forward to a new neighbour for as long as it can. Only when it is stuck does it go back (this is called **backtracking**) and try another way.

## An example

We start at `A` again. The purple arrows show where DFS walks forward, and the black numbers show the order of the visits:

![DFS on the example graph. The visit order is A, B, D, E, F, C, G](content/images/dfs_order.svg)

Let's follow it:

1. Start at `A`. Its first neighbour is `B`, so go to `B`.
2. From `B`, the first new neighbour is `D`. Go to `D`.
3. `D` is a dead end (its only neighbour, `B`, was already visited). Go **back** to `B`.
4. `B` still has `E`. Go to `E`.
5. From `E`, go to `F`.
6. From `F`, go to `C`. `C` is a dead end now (`A` and `F` are visited). Back to `F`, also done, back to `E`.
7. `E` still has `G`. Go to `G`. Now every node has been visited.

The order is `A, B, D, E, F, C, G`. Compare it to BFS, which visited `A, B, C, D, E, F, G`: BFS reached `C` third, because it is only one step from `A`. DFS reached it sixth, after a long trip around the graph.

## The code: recursion

DFS fits **recursion** perfectly. "Visit a node" means: mark it, and then visit each of its neighbours that was not visited yet. When a call ends, Python automatically goes back to the call before it. That is the backtracking, for free.

```python
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F', 'G'],
    'F': ['C', 'E'],
    'G': ['E'],
}

def dfs(graph, node, visited=None):
    if visited is None:
        visited = []
    visited.append(node)
    for neighbour in graph[node]:
        if neighbour not in visited:
            dfs(graph, neighbour, visited)   # go deeper before trying the next neighbour
    return visited

print(dfs(graph, 'A'))   # ['A', 'B', 'D', 'E', 'F', 'C', 'G']
```

> Why `visited=None` and not `visited=[]`? A default list in Python is created only **once** and shared by every call to the function. A second call to `dfs` would start with the nodes from the first call. Starting with `None` and creating a new list inside avoids this trap.

## The code: a stack

BFS used a queue: first in, first out. DFS can use a **stack** instead: **last in, first out**, like a pile of plates. You always take the plate from the top, which is the one you put there last. So DFS keeps working on the newest node it found, and that is exactly what makes it go deep.

A Python list is a ready-made stack: `append` puts on top, `pop()` takes from the top.

```python
def dfs_stack(graph, start):
    visited = []
    stack = [start]                 # last in - first out
    while stack:
        node = stack.pop()          # take the node that was added last
        if node in visited:
            continue
        visited.append(node)
        for neighbour in reversed(graph[node]):   # reversed, so the first neighbour is on top
            if neighbour not in visited:
                stack.append(neighbour)
    return visited

print(dfs_stack(graph, 'A'))   # ['A', 'B', 'D', 'E', 'F', 'C', 'G']
```

Look how similar this is to the BFS code. Change the stack to a queue, and DFS becomes BFS. This version is also safer on very big graphs, because a very deep recursion can hit Python's recursion limit.

## Finding a path with DFS

DFS can also find a way from one node to another: go deep, and if a neighbour leads to the goal, put the current node in front of that path.

```python
def find_path(graph, node, goal, visited=None):
    if visited is None:
        visited = set()
    if node == goal:
        return [node]
    visited.add(node)
    for neighbour in graph[node]:
        if neighbour not in visited:
            rest = find_path(graph, neighbour, goal, visited)
            if rest is not None:
                return [node] + rest
    return None

print(find_path(graph, 'A', 'C'))   # ['A', 'B', 'E', 'F', 'C']
```

It found **a** path, but look at it: 4 steps, when `A` and `C` are direct neighbours! DFS went down the `B` tunnel first and followed it all the way around. **DFS finds a path, not the shortest path.**

## When to use DFS

- **Good:** answering "**is there any way** from here to there?" or "which places can I reach at all?".
- **Good:** visiting **every** node, for example a robot that must check every room in a building, or counting the separate islands on a map.
- **Good:** puzzles where you try a choice and go back if it fails, like solving a maze or sudoku. Many maze generators also use DFS to carve their corridors.
- **Good:** it uses little memory, because it only remembers the current path and not a whole ring of nodes.
- **Not so good:** the path it finds can be long and strange. For the shortest path, use BFS or A\*.
