# Introduction

How does a phone find the fastest way to drive to a friend's house? How does a robot vacuum get from the kitchen to the bedroom without hitting the sofa? How does a character in a game chase you around walls?

They all solve the same question: **how do I get from here to there?** To answer it, a computer first turns the world into a **graph**, and then searches the graph for a way through.

## What is a graph?

A graph is a very simple thing. It has only two parts:

- **Nodes** (also called vertices) - the places. A city, a room, a square on a board.
- **Edges** - the connections between places. A road, a door, a step from one square to the next.

Here is a small town drawn as a graph:

![A small town as a graph: Home, Bakery, School, Park, Library and Pool connected by roads, each road labelled with the minutes it takes](content/images/graph_town_map.svg)

Each road has a number on it: how many minutes it takes to walk. A number like this is called a **weight**, and a graph with numbers on its edges is a **weighted graph**. If all the edges are the same (one step each), the graph is **unweighted**.

Now questions about the town become questions about the graph:

- Can I walk from Home to the Pool? *Is there a path between two nodes?*
- What is the quickest way from Home to the Library? *What is the shortest path?*

## Maps and mazes are graphs too

A graph does not have to look like circles and lines. A maze, a game board or a map of a room can be split into squares. Every open square is a node, and two squares that touch are connected by an edge. Walls are simply squares with no node.

![A small grid with dark wall squares. Every open square has a dot, and dots of neighbouring squares are joined by lines](content/images/graph_grid.svg)

This is exactly what robots do. A robot builds a map of the room as a grid (called an **occupancy grid**): each square is marked free or blocked. Then finding a way through the room is finding a path in the graph.

## A graph in Python

The easiest way to store a graph in Python is a **dictionary**. Each key is a node, and its value is the list of its neighbours:

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

print(graph['B'])   # ['A', 'D', 'E'] - the places you can go from B
```

This is called an **adjacency list** ("adjacent" means "next to"). We will use this graph in the next items:

![Example graph with seven nodes A to G](content/images/graph_example.svg)

## The big idea: search

A computer cannot "see" the whole map at once like we do. It looks at one node at a time, and asks "where can I go from here?". Every search algorithm keeps two things:

1. **A list of nodes waiting to be visited** - places we know about but have not looked at yet. This is often called the **frontier**.
2. **A set of nodes already visited** - so we do not go around in circles forever.

The search repeats one simple step: take a node from the waiting list, look at its neighbours, and add the new ones to the waiting list. The only difference between the algorithms is **which node we take next**:

| Algorithm | Which node comes next? | Good for |
|-----------|------------------------|----------|
| **BFS** - Breadth-First Search | The one that has waited the longest | The shortest path when every step costs the same |
| **DFS** - Depth-First Search | The one that was added last | Going deep, exploring everything, checking if a path exists |
| **A\*** (A-star) | The one that looks closest to the goal | Finding the shortest path fast, using a smart guess |

## Where are these used?

- **GPS and map apps** find the fastest route between two addresses. The roads are edges and the travel times are weights.
- **Robot vacuums and delivery robots** plan a path across a room or a building on a grid map, and plan again when someone puts a chair in the way.
- **Warehouse robots** carry shelves between hundreds of locations without bumping into each other.
- **Robot arms** search for a way to move from one position to another without hitting anything.
- **Mars rovers** plan their drive around rocks and craters, because a person on Earth is too far away to steer them in real time.
- **Video games** move characters around walls toward the player. A\* is the classic choice here.
- **Social networks** use BFS to find "friends of friends".

In the next items we will see how each algorithm works, step by step, with code you can run yourself.
