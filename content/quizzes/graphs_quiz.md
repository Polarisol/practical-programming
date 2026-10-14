# Quiz yourself!

Test what you remember about plotting graphs: what matplotlib is for, choosing the right plot, keeping graphs clear, and spotting graphs that don't tell the truth.

## What is matplotlib?
- [ ] A Python library for doing fast calculations on arrays of numbers.
  > That's NumPy. Matplotlib often works together with NumPy, but its job is drawing, not calculating.
- [ ] A website where you upload a spreadsheet and get a graph back.
  > Matplotlib isn't a website. It's a library you use from your own Python code.
- [x] A Python library for creating graphs and visualizations.
  > Right! Matplotlib is a comprehensive library for creating graphs and visualizations in Python.
- [ ] A tool that can only draw line plots.
  > Matplotlib can draw many kinds of plots: line plots, scatter plots, bar charts, histograms and more.
> Matplotlib is Python's go-to library for turning data into pictures, and it supports many types of plots.

## Where can a graph made with matplotlib end up?
- [x] Shown inside a Jupyter notebook.
  > Yes. In a notebook the graph appears right under the cell that made it.
- [ ] Only printed on paper, never on screen.
  > Graphs are usually viewed on screen. You can print an image file, but that's not the only option.
- [x] Saved as an image file, such as a PNG.
  > Yes. You can save a graph as an image and use it in a report or a presentation.
- [x] Displayed inside a graphical user interface (an app window).
  > Yes. Graphs can be embedded in GUI apps, for example ones built with PySide6.
> A matplotlib graph can be shown in a Jupyter notebook, saved as an image file, or displayed in a graphical user interface.

## You measured the height and the weight of 50 students and want to see if taller students tend to weigh more. Which type of plot fits best?
- [ ] A pie chart
  > A pie chart shows how one whole is split into parts. It can't show how two measurements relate to each other.
- [x] A scatter plot
  > Right! Each student becomes one dot (height on one axis, weight on the other), so you can see whether the dots form an upward trend.
- [ ] A histogram
  > A histogram shows how *one* measurement is spread out, for example how many students are in each height range. It doesn't compare two measurements.
- [ ] A line plot over time
  > There's no time here. A line plot connects points in order, which is great for trends over time but suggests a sequence that doesn't exist in this data.
> Matplotlib offers many plot types, and choosing the right one is part of telling the story clearly. Scatter plots show the relationship between two measurements.

## What does it mean to keep a high **data-to-ink ratio**?
- [ ] Use as many colors as possible so the graph looks exciting.
  > Extra colors that don't mean anything distract from the data. Use color when it helps the reader, for example to tell two lines apart.
- [ ] Print graphs in black and white to save printer ink.
  > The name sounds like it's about printing, but it's about where the reader's attention goes, not about saving ink.
- [x] Most of what is drawn should show the data, not decorations.
  > Exactly! Remove backgrounds, 3D effects, heavy grid lines and clip art that don't help the reader understand the data.
- [ ] Put as many data points as possible into a single graph.
  > Cramming more data in usually makes a graph harder to read. The ratio is about removing unnecessary decoration, not adding data.
> A graph tells a story. A high data-to-ink ratio keeps the focus on the data, and good labels, colors, line styles and markers make the story easy to follow.

## What is wrong with this graph?
![A bar chart titled "Phones sold this year" comparing Brand A and Brand B](content/images/misleading_truncated_axis.svg)
- [ ] The bars should be drawn as a line plot instead.
  > A bar chart is a fine choice for comparing two brands. The problem is in the axis.
- [ ] Brand B's bar is the wrong color.
  > Colors are a style choice and don't change what the numbers mean here.
- [x] The y-axis starts at 96, so a small difference looks huge.
  > Right! Brand B sold 101 thousand and Brand A 97 thousand, only about 4% more. Because the axis starts at 96, Brand B's bar looks five times taller.
- [ ] The y-axis label is missing.
  > Look again: the axis is labeled "Phones sold (thousands)". The labels are fine, the scale is not.
> In a bar chart, the length of a bar should match its value, so the y-axis should start at zero. Cutting the bottom off the axis exaggerates small differences.

## What is wrong with this graph?
![A line graph titled "Students in the course" from 2000 to 2023](content/images/misleading_uneven_axis.svg)
- [x] The years on the x-axis are not evenly spaced, so the growth looks like it slowed down.
  > Right! The first gaps are 10 years and the later gaps are 1 year, but they take up the same space. The course actually grew by exactly 2 students every year, so the real line is perfectly straight.
- [ ] The y-axis should start at 20, where the data starts.
  > Starting at zero is the honest choice here. The trick is on the other axis.
- [ ] The points should not be connected with a line.
  > Connecting points over time with a line is normal. The problem is the spacing of the years.
- [ ] There are too few data points to draw a graph.
  > Six points are enough for a graph. What matters is that each one is placed in the right spot.
> The distance along an axis should always match the size of the change. Uneven intervals bend the shape of the data and tell a false story.

## What is wrong with this graph?
![A line graph titled "Bugs found in our app each month" from January to June](content/images/misleading_inverted_axis.svg)
- [ ] The months should be written in full, like "January".
  > Short month names are perfectly clear. Look at the numbers on the y-axis.
- [ ] The line should be a different color.
  > The color doesn't change the story. Something else does.
- [ ] The graph shows too few months to be useful.
  > Six months is a reasonable range. The problem is in which direction the numbers go.
- [x] The y-axis is upside down, with 0 at the top.
  > Right! The line seems to go down, so it looks like the app is improving. In fact, bugs grew from 5 to 45 a month.
> Readers expect bigger values to be higher up. Flipping an axis makes a bad trend look like a good one, which is a classic way to deceive.

## What is wrong with this graph?
![A pie chart titled "Favourite lunch of students in our class" with three slices: Pizza, Falafel and Salad](content/images/misleading_pie_over_100.svg)
- [ ] Pie charts should never have more than two slices.
  > Pie charts can have several slices. They get hard to read with too many, but three is fine.
- [x] The percentages add up to 120%, not 100%.
  > Right! A pie shows how one whole (100%) is split into parts. 50% + 40% + 30% = 120%, so the slices can't be drawn honestly. If students could pick more than one lunch, a bar chart would be the right choice.
- [ ] The legend should be on the left side of the pie.
  > Where the legend sits is a style choice. Check whether the numbers make sense.
- [ ] Pizza should not be colored red.
  > The colors are fine. The numbers are the problem.
> Always check that a graph's numbers make sense. A pie chart must add up to 100%; if it doesn't, the pie is the wrong type of graph for that data.

## Which of these are ways a graph can mislead its readers?
- [x] Showing only the part of the data that supports your claim.
  > Yes. Selectively omitting data, such as showing only the few good months, hides the real story.
- [ ] Writing a clear title and labeling both axes.
  > This is good practice. Titles and labels help the reader understand the graph honestly.
- [x] Using an inappropriate scale on an axis.
  > Yes. A scale that is cut, stretched, uneven or flipped can make a change look bigger, smaller or even reversed.
- [ ] Choosing a scatter plot to show how two measurements are related.
  > That's the right plot for the job, not a trick.
> The stories told by misleading graphs are distorted and lead to wrong conclusions. Tell the truth with your graphs.

## You asked an AI agent to plot your data, and the result is almost right, but the labels are too small. What should you do?
- [x] Open the code, find the font size setting and change it yourself.
  > Right! Small tweaks are often fastest to make yourself, and reading the code helps you understand what it does.
- [ ] Throw away the code and write the whole graph from scratch by hand.
  > There's no need to start over. The AI's code is a good starting point you can adjust.
- [ ] Keep the graph as it is, since code written by AI shouldn't be changed.
  > AI code is just code. You are responsible for the result, and you can and should change it.
- [ ] Accept it, because the labels are just decoration.
  > Labels are part of the data story. If readers can't read them, they can't understand the graph.
> AI agents can write graph code for us, but we need to be comfortable changing that code ourselves to fine-tune parameters and get the graph to look exactly the way we want, fast.
