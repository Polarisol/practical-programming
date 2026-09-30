# Using Git

Git keeps a history of your project. Every time you **commit**, git saves a snapshot of all your files. Later you can see what changed, undo mistakes, or go back to any earlier snapshot. This page covers using git on your own, from inside VS Code. It assumes you have already done everything in **Installation** and **Starting a Project**.

## Before you start: tell git who you are

Git records your name and email in every commit, and refuses to commit until it knows them. If you didn't do this during **Installation**, open the terminal in VS Code (**View → Terminal**) and write:

```bash
git config --global user.name "place your name here"
git config --global user.email "place your email here"
```

You only need to do this once per computer. To check what's set, run `git config --global --list`.

> Use the same email as your GitHub account, so your commits are linked to it when you upload the project later.

## 1. The Source Control view

Everything git-related in VS Code lives in the **Source Control** view. Open it by clicking the branch-shaped icon in the left bar, or press **Ctrl+Shift+G**.

- **Changes**: the files that changed since your last commit. The letter next to each file tells you what happened to it: **U** untracked (a new file git doesn't know yet), **M** modified, **D** deleted.
- **The message box and the Commit button**: where you write what you did and save a snapshot.
- **Graph**: the history of your commits, newest on top.

The bottom-left corner of the window (the status bar) shows the name of the current **branch**, usually `master` or `main`. More on branches in the advanced section.

> If the Source Control view shows an **Initialize Repository** button, the folder isn't a git repository yet. This happens if git wasn't installed when you ran `uv init`. Click the button (or run `git init` in the terminal) to fix it. You'll also need to create the `.gitignore` file yourself (see the next section).

## 2. The `.gitignore` file

Some files should **not** be saved in git: files that are created automatically, can be recreated at any time, or are too big. `uv init` creates a `.gitignore` file that lists them. It looks like this:

```gitignore
# Python-generated files
__pycache__/
*.py[oc]
build/
dist/
wheels/
*.egg-info

# Virtual environments
.venv
```

Each line is a pattern. Git ignores every file and folder that matches one:

- `.venv`: anything named `.venv` (here, the project's Python environment, which uv can always recreate)
- `__pycache__/`: every folder named `__pycache__` (the trailing `/` means "folders only")
- `*.csv`: every file ending in `.csv` (`*` means "anything")
- `data/`: the whole `data` folder
- `secrets.txt`: a file with this exact name
- Lines starting with `#` are comments

Ignored files appear grayed out in the VS Code file explorer, and never show up in the **Changes** list.

You can add your own lines at any time. Good candidates:

- Large data files (e.g. `*.csv`, `data/`)
- Files with passwords or API keys (e.g. `.env`). Never commit these!
- Output your code creates (e.g. `output/`, `*.png` if they're generated plots)

> `.gitignore` only affects files git isn't tracking yet. If you already committed a file and then add it to `.gitignore`, git keeps tracking it. To stop, run `git rm --cached <file>` in the terminal and commit.

## 3. Commit your changes

A commit is a snapshot of your project with a short message describing what changed. Commit often: whenever something works, or before you try something risky.

1. Open the Source Control view (**Ctrl+Shift+G**).
2. Look at the **Changes** list. Click a file to see exactly what changed: the old version on the left, the new one on the right.
3. Write a short message in the message box, e.g. `Add plot of the results`.
4. Click **Commit** (or press **Ctrl+Enter** in the message box).

The first time, VS Code asks: *"There are no staged changes to commit. Would you like to stage all your changes and commit them directly?"* Choose **Always**. From now on, Commit saves all your changes.

> **Staging** means choosing which changes go into the next commit. Hover over a file in **Changes** and click **+** to stage only that file; staged files move to a **Staged Changes** list, and Commit saves only them. Working alone, you can usually skip this and commit everything.

> Tip: your very first commit after `uv init` should include all the files it created (`pyproject.toml`, `uv.lock`, `.python-version`, `.gitignore`, `main.py`, `README.md`). This way the project can always be recreated from the history.

The same in the terminal:

```bash
git add .                     # stage all changes
git commit -m "Add plot of the results"
```

## 4. Fix the last commit (amend)

Forgot a file, or made a typo in the message? Instead of making another commit, **amend** the last one: the new changes (and message) are merged into it.

1. Make the missing changes and save them.
2. Write the message in the message box. The new message replaces the old one, so if it was fine, write it again.
3. Click the small **arrow ⌄** next to the **Commit** button and choose **Commit (Amend)**.

The same in the terminal:

```bash
git add .
git commit --amend -m "The corrected message"   # new message
git commit --amend --no-edit                    # or: keep the old message
```

> Amend only the **last** commit, and only if you haven't pushed it to GitHub yet.

## 5. Discard changes: go back to the last commit

Made a mess and want your files back the way they were in the last commit?

- **One file**: in the **Changes** list, hover over the file and click the **Discard Changes** arrow (↶).
- **Everything**: hover over the **Changes** heading and click **Discard All Changes** (↶).

VS Code asks you to confirm. **This can't be undone**: the discarded changes are gone for good. Discarding an **untracked** (**U**) file deletes it.

The same in the terminal:

```bash
git restore main.py     # one file
git restore .           # all tracked files
git clean -fd           # delete all untracked files and folders (careful!)
```

### Undo the last commit itself

Committed too early? Click **⋯** (More Actions) at the top of the Source Control view and choose **Commit → Undo Last Commit**. The commit is removed from the history, but your files stay exactly as they are, with its changes back in the **Staged Changes** list. Fix what you need and commit again. (Terminal: `git reset --soft HEAD~1`.)

## 6. Go back in time: visit an earlier commit

You can look at your project exactly as it was at any earlier commit (e.g. to check how the code looked when it still worked) and then come back.

**Before you start, commit your current work.** Git won't let you leave with uncommitted changes that would be overwritten, and you don't want to lose them anyway. Also check the branch name in the bottom-left corner (e.g. `master`): you'll need it to come back.

### Travel back

1. In the Source Control view, open the **Graph** section.
2. Right-click the commit you want to visit and choose **Checkout (Detached)**.

All your files now look exactly as they did at that commit. You can open and run them as usual. The bottom-left corner now shows the commit's ID (e.g. `a1b2c3d`) instead of a branch name: this state is called **detached HEAD**. It just means "you're visiting the past, not on a branch".

> While visiting, you can look and experiment, but **don't commit** here. Commits made in detached HEAD don't belong to any branch and are easy to lose. To keep an experiment that starts here, create a branch first (see the advanced section).

### Come back to the present

1. Click the commit ID in the bottom-left corner.
2. Pick your branch (e.g. `master`) from the list.

Your files are back to your latest commit.

The same in the terminal:

```bash
git log --oneline       # list commits with their IDs
git switch --detach a1b2c3d   # visit commit a1b2c3d
git switch master       # come back (use your branch name)
```

> Want to throw away everything after an old commit and really continue from there? That's `git reset --hard <commit-id>`. It deletes the newer commits, so be careful. Usually it's safer to use a branch (below) or to copy the old code you need and commit it as a new change.

## 7. Advanced: branches

### What is a branch?

So far, your commits formed one straight line. A **branch** is a separate line of commits. It lets you try something (a new feature, a big rewrite) without touching your working code. If the experiment works, you merge it back; if it doesn't, you just switch back and forget it.

Two words to know:

- A **branch** is a name that points at the latest commit on its line. Your default branch is `master` (or `main`). Every new commit on a branch moves its name forward.
- **HEAD** means "where you are right now". Normally it points at a branch, so new commits go onto that branch. In the time-travel section above, HEAD pointed straight at an old commit instead of at a branch. That's why it was called *detached*.

```text
            C4 ─ C5          ← experiment
           /
C1 ─ C2 ─ C3 ─ C6            ← master  ← HEAD
```

Here, `experiment` split off from `master` after `C3`. You're on `master` (that's where HEAD points), so your files look like `C6`.

### Create a branch and move to it

1. Commit your current work.
2. Click the branch name in the bottom-left corner.
3. Choose **+ Create new branch…**, type a name (e.g. `experiment`) and press **Enter**.

You're now on the new branch; the bottom-left corner shows its name. Work and commit as usual: the commits go to `experiment`, and `master` stays as it was.

> To start a branch from an **old** commit (e.g. to keep an experiment you began while visiting the past), right-click that commit in the **Graph** and choose **Create Branch…**.

### Move back to the main branch

1. Commit (or discard) your changes.
2. Click the branch name in the bottom-left corner.
3. Choose `master`.

Your files jump back to the latest commit on `master`. Switch between branches the same way whenever you like: git swaps your files each time.

### Merge a branch

Experiment worked and you want it in `master`?

1. Switch to `master` (as above).
2. Click **⋯** (More Actions) at the top of the Source Control view and choose **Branch → Merge…**.
3. Pick `experiment`.

The changes from `experiment` are now in `master`. If both branches changed the same lines, git can't decide which version to keep and reports a **merge conflict**. VS Code marks the conflicting lines and lets you pick *Accept Current Change*, *Accept Incoming Change*, or *Accept Both*. Save the file and commit.

### Delete a branch

Done with the branch (merged it, or gave up on it)? Click **⋯ → Branch → Delete Branch…** and choose it. You can't delete the branch you're on, so switch to `master` first.

### The same in the terminal

```bash
git branch                   # list branches (* marks the current one)
git switch -c experiment     # create a branch and move to it
git switch master            # move back to master
git merge experiment         # merge experiment into the current branch
git branch -d experiment     # delete the branch (only if merged)
git branch -D experiment     # delete it even if not merged
```
