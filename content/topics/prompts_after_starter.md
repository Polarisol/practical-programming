# Prompts after the starter GUI

Once the starter skeleton works and is committed, the real work begins: adding your logic, one piece at a time. The rule of thumb stays the same: **you stay in control and you own the code base.**

We read, understand, test and approve every part of the code the AI writes. That is only possible when each answer is short. So from now on, every prompt asks for **one small change**, and says **how** to do it.

## A vague prompt

> Read the data file and plot it.

The AI decides everything: pandas, numpy or the `csv` module? Where to keep the values? What to do with the header line? It may also rewrite methods you already wrote. You get a lot of code to review, and none of it is code you planned.

## A small, specific prompt

> In `file_load_method`, open the file at `self.filename` for reading using `with open`, skip the first line, and loop over the rest, adding the first value of each line to `self.x_values` and the second one to `self.y_values`. Both are floats. Clear the lists before.

This prompt makes every decision for the AI:

- **Where:** inside `file_load_method`, the method you already named.
- **How:** `with open` and a loop, tools you learned in the [Python Basics unit](?id=python-basics).
- **Names and types:** `self.x_values` and `self.y_values`, both floats.
- **Details:** skip the header line, clear the lists first so loading a second file doesn't mix the data.

You get back a few lines you could have written yourself:

```python
        self.x_values.clear()
        self.y_values.clear()
        with open(self.filename, "r") as file:
            file.readline()  # skip the first line
            for line in file:
                values = line.split(",")
                self.x_values.append(float(values[0]))
                self.y_values.append(float(values[1]))
```

Notice that the prompt didn't say what separates the values, so the AI guessed a comma. If your file uses tabs or spaces, say so. Every detail you leave out is a decision the AI makes for you.

## The cycle

1. **Prompt** for one small change.
2. **Read** every line. If something is unclear, ask the AI to explain it.
3. **Test** it. Print the lists, try a small file, try the edge cases.
4. **Approve** it with a commit. If you don't like it, discard the change with git and try again, or fix it yourself.

Then move on to the next small change, for example:

> In `draw_graph`, clear the axes and plot `self.y_values` against `self.x_values` as a blue line with round markers. Then call `self.canvas.draw()`.

> At the end of `file_load_method`, call `self.draw_graph()`.

## Rules of thumb

- **One change per prompt.** If you need the word "and also", it is probably two prompts.
- **Say where:** the file and the method.
- **Say how:** the tools, the loop, the names, the types.
- **If you can't say how, you are not ready to prompt.** Learn how it is done first, then ask the AI to type it.
- **If it is quicker to type it yourself, do it.** Small changes often are.
