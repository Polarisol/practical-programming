# When should I commit

A commit is a save point you can always come back to. The rule of thumb: **commit whenever you'd be sad to lose what you just did.**

## Commit when

- **Something works.** A function returns the right answer, the window opens, the plot looks right. Commit before you touch it again.
- **Before something risky.** About to refactor, delete code, or let the AI make a big change? Commit first, so you can go back in one click.
- **After the AI changed your code, and you checked it.** Review the changes in the **Changes** list, discard what you don't want, and commit the rest.
- **You finished one small task.** "Add the save button", "Fix the crash on empty input". One idea per commit.
- **Before you leave the computer.** Commit, then **Sync Changes** so the work is also on GitHub.

## Don't commit

- **Code that doesn't run**, if you can help it. Every commit should be a point you'd want to return to. (Leaving for the day is the exception: commit anyway, and say so in the message, e.g. `WIP: plot not finished`.)
- **A whole day's work in one commit.** If it breaks, you can't tell which change did it, and going back loses everything.
- **Files that belong in `.gitignore`**: `.venv`, large data, generated output, and never passwords or API keys.

## How often?

For most of the course: **every 15 to 30 minutes of work**, or every time you finish a small step. Small commits are free, and many small save points are much more useful than a few big ones.

## Forgot to commit for a while?

It happens. Nothing is lost: your changes are still in the files, Git just hasn't saved them yet. Don't panic, and don't make it worse by changing more code first.

1. **Commit now, before anything else.** The longer you wait, the bigger and more tangled the change gets.
2. **Look at the Changes list.** Click each file to see what changed. This also reminds you what you did.
3. **If the work splits into separate ideas, make a few commits.** Hover a file and click **+** (Stage Changes) to stage only that file, write a message for just that part, and commit. Repeat for the next group of files. In the diff view you can even select some lines, right-click, and choose **Stage Selected Ranges**.
4. **If it's all one tangled change, one commit is fine.** Write a message that describes the whole thing, e.g. `Add the results window and export to CSV`. One honest big commit is far better than no commit.
5. **Sync Changes**, so the work is also on GitHub.

Then set yourself a reminder: commit every time you finish a small step.

## Write a useful message

The message should say **what the commit does**, short and specific:

| Bad | Good |
|-----|------|
| `changes` | `Add a Save button to the main window` |
| `fix` | `Fix crash when the input file is empty` |
| `asdf` | `Plot grades by class as a bar chart` |

> Before every commit, glance at the **Changes** list. If a file you don't recognize is there, find out why before you commit it.
