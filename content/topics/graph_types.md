# What type of graph should I use?

Don't start with the data. Start with the **question** your graph answers. The question picks the graph.

| My question | Graph | matplotlib |
|---|---|---|
| How does it change over time? | Line plot | `ax.plot` |
| Which category has more? | Bar graph | `ax.bar` |
| Is X related to Y? | Scatter plot | `ax.scatter` |
| How are the values spread? | Histogram | `ax.hist` |

## How does it change over time? → Line plot

The x-axis is time (or another number that goes in order). The line connects the points because the values in between make sense.

![A line plot of temperature during the day](content/images/graph_type_line.png)

## Which category has more? → Bar graph

The x-axis is **names** (categories), not numbers. Each bar is one amount. Start the y-axis at zero.

![A bar graph of students' favorite pets](content/images/graph_type_bar.png)

## Is X related to Y? → Scatter plot

Each point is one thing measured twice (one student: hours studied and grade). Don't connect the points, their order means nothing.

![A scatter plot of study time vs. grade](content/images/graph_type_scatter.png)

## How are the values spread? → Histogram

One list of numbers. matplotlib splits it into ranges (bins) and counts how many values fall in each. It shows where most values are, and how wide the spread is.

![A histogram of exam grades](content/images/graph_type_hist.png)

**Bar graph or histogram?** Bars compare categories (Cat, Dog). A histogram counts numbers in ranges (60-65, 65-70), so its bars touch.

## Other graphs

**Parts of a whole → Pie chart** (`ax.pie`). Only for a few parts that add up to 100%. A bar graph is usually easier to read.

![A pie chart of screen time](content/images/graph_type_pie.png)

**Comparing spreads of several groups → Box plot** (`ax.boxplot`). Like several histograms side by side, in a small space. The line is the median, the box holds the middle half of the values.

![A box plot of height by class](content/images/graph_type_box.png)

**Still not sure?** Try two graphs and keep the one that tells the story faster.
