# Cloning repositories

A repository on GitHub is a copy of a project, with its whole history. **Cloning** downloads it to your computer: all the files, plus the git history, already connected to GitHub. Use it to start working on a project from GitHub (yours, the course's, or a friend's), or to continue your own project on another computer.

## 1. Find the repository's address

On the repository's GitHub page, click the green **Code** button and copy the **HTTPS** address. It looks like this:

```text
https://github.com/<user-name>/<repository-name>.git
```

> If you know the user name and the repository name, you can just write the address yourself. The `.git` at the end is optional.

## 2. Clone into a folder in VS Code

1. Create a new, **empty** folder for the project, e.g. `C:\Projects\my-project`.
2. In VS Code choose **File → Open Folder…** and open it.
3. Open the terminal (**View → Terminal**) and write `git clone`, the address, and then a dot:

```bash
git clone https://github.com/<user-name>/<repository-name>.git .
```

The **dot** at the end means "into the current folder". The project's files appear directly in the folder you opened, and VS Code already shows them in the explorer and in the Source Control view.

> Without the dot, git creates a **new folder** named after the repository inside the current folder, and you'd have to open that folder in VS Code. With the dot, the folder must be empty, or git refuses (*"destination path '.' already exists and is not an empty directory"*).

> A **private** repository asks you to sign in to GitHub the first time. Choose the browser option and approve. Public repositories can be cloned by anyone.

You can also clone without the terminal: in the Source Control view (**Ctrl+Shift+G**) of an empty window click **Clone Repository**, paste the address and choose a folder.

## 3. `uv sync`: recreate the Python environment

The `.venv` folder (the project's Python environment with all its libraries) is listed in `.gitignore`, so it is **not** on GitHub and not in your clone. You recreate it with one command:

```bash
uv sync
```

uv reads `pyproject.toml` and `uv.lock`, installs the right Python version, creates `.venv` and installs exactly the same libraries, at exactly the same versions. After that you can run the code as usual. If VS Code asks which Python to use, pick the one inside `.venv`.

> Run `uv sync` again whenever you pull changes that added or removed libraries (that is, changed `pyproject.toml` or `uv.lock`). If you're not sure, just run it: when nothing changed, it does nothing.

## 4. Start every session with Pull

A repository can change on GitHub while you're away: you pushed from another computer, or someone else pushed. Your copy doesn't know about it until you **pull**.

**Every time you sit at a computer, or open a repository you haven't used for a while, first of all click Pull.** In the Source Control view, Pull is the button with an **arrow pointing down onto a line** (↧). Pull downloads the new commits from GitHub and brings your files up to date with the GitHub code base.

Working on old files and then pulling is how you get **merge conflicts**: the same lines changed in two places. Pulling first avoids most of them.

> Pull refuses if you have uncommitted changes in files it needs to update. Commit them (or discard them) and pull again.

## 5. While you work: Commit, then Sync Changes

Your commits are saved only on your computer until you send them to GitHub. While you work, use the **same blue button** in the Source Control view twice:

1. **First click: Commit.** Write a message and click **Commit**. This saves a snapshot on your computer.
2. **Second click: Sync Changes.** After the commit, the same button turns into **Sync Changes ↑1** (the number is how many commits are waiting). Click it to update the cloud: it pulls any new commits from GitHub and then pushes yours.

Do this every time you finish a piece of work, and always before you leave the computer, so GitHub and your other computers have your latest code. (The circling arrows in the bottom-left corner of the window, and the Push button with the arrow pointing **up**, ↥, do the same.)


## The same in the terminal

```bash
git clone https://github.com/<user-name>/<repository-name>.git .   # clone into this folder
uv sync          # recreate .venv and install the libraries
git pull         # get the latest commits from GitHub
git push         # upload your commits to GitHub
git status       # where am I? anything to commit, pull or push?
```
