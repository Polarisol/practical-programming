# Using Git

Git keeps a history of your project as a list of save points called **commits**. This page shows the everyday routine of working alone in VS Code, using the buttons of the **Source Control** view (the branch-shaped icon in the left bar, or **Ctrl+Shift+G**). No terminal commands needed.

## Getting started

`uv init` already turned your project folder into a git repository and created a `.gitignore` file, which lists the files git should leave alone (see **.gitignore rules**).

Git also needs to know who you are before your first commit. Do this once per computer, in the VS Code terminal (**View → Terminal**):

```bash
git config --global user.name "place your name here"
git config --global user.email "place your email here"
```

> Use the same email as your GitHub account.

## The routine

**1. Work.** Write code, by yourself or with help from an AI agent.

**2. Test and save.** Run the code, check that it does what you wanted, and save all the files.

**3. Review the changes.** After a bit of work (see **When should I commit** for how much), open **Source Control**. The **Changes** list shows every file that changed since your last commit: **M** for modified, **U** for a new file. Click a file to see the old version and the new one side by side. Read it, especially if an AI wrote it.

![The Changes line, with the Discard and Stage buttons](content/images/git_vscode_changes.svg)

**4. Throw away what you don't want.** Hover over a file and click the **backwards arrow** (Discard Changes) to return it to how it was in the last commit. The same arrow on the **Changes** line discards everything. Careful: discarded changes are gone for good.

**5. Stage the rest.** Happy with the changes? Click the **+** on the **Changes** line. The files move to **Staged Changes**, meaning they'll go into the next commit.

![The message box with the AI button, and the Commit button](content/images/git_vscode_commit.svg)

**6. Write a message.** Describe in a few words what you did, e.g. `Add a Save button to the main window`. You can click the **sparkle** button to let AI write it, but read it before you commit: it is sometimes wrong.

**7. Commit.** Click the blue **Commit** button. If you forgot the message, VS Code opens a temporary file called `COMMIT_EDITMSG` instead. Write the message on its first line, save it and close it, and the commit is done.

**8. Upload to GitHub.** After a commit, the same blue button changes:

![Publish Branch and Sync Changes](content/images/git_vscode_publish.svg)

- **Publish Branch**: the project is still only on your computer. Click it once to create a repository on GitHub (choose private or public) and upload everything.
- **Sync Changes**: the project is already on GitHub. Click it to upload your new commits (it also downloads any new commits from GitHub).

**9. Start every session with Pull.** If you work on more than one computer, the GitHub copy may have commits you don't have yet. Before you start working, click **Pull** in the header of the **Graph** section (an arrow pointing down onto a commit point). Commit your local changes first, or git won't pull.

![The Pull button in the Graph header](content/images/git_vscode_pull.svg)

Then back to step 1.

## Going back in time

Sometimes you want to see your code as it was earlier: to check how it looked when it still worked, to find out when a bug first appeared, or to copy a function you've since deleted or broken.

**Commit your current work first.** Then, in the **Graph**, right-click the commit you want to visit and choose **Checkout (Detached)**.

![Right-click a commit and choose Checkout (Detached)](content/images/git_vscode_checkout.svg)

All your files now look exactly as they did then, and you can open and run them. Look around, but **don't commit** here: commits made while visiting the past are easy to lose.

To come back to the present, click the **⋯** at the top of the Source Control view (above the commit message), choose **Checkout to...**, and pick **master** (or **main**).

![The ⋯ menu, Checkout to..., and master](content/images/git_vscode_back.svg)

Your files are back to your latest commit.
