# Why use Git

Without git, a project usually ends up looking like this: `main.py`, `main_old.py`, `main_works.py`, `main_final_REALLY.py`. Nobody remembers which one is which, and the version that worked yesterday is gone. Git solves this.

## What git gives you

- **Undo anything.** Every commit is a snapshot of the whole project. Broke something? Go back to the last version that worked, for one file or for everything.
- **See what changed.** Git shows you, line by line, what you changed since the last commit. This is the fastest way to find the change that broke your code.
- **Check the AI's work.** When Copilot or another AI edits your files, git shows you exactly what it changed. Review it, keep what's good, and discard the rest with one click.
- **Experiment without fear.** Try a big change on a **branch**. If it works, merge it. If not, throw it away. Your working code is never touched.
- **A history of your project.** Every commit records what changed, when, and why (your message). Months later you can still see how the project grew.
- **A backup and a way to share.** Push your commits to **GitHub**, and your project is safe even if your computer isn't. From there you can continue on another computer, hand in your work, or work on the same project with friends.

## Git and GitHub are not the same

- **Git** is the program on your computer that keeps the history. It works even without the internet.
- **GitHub** is a website that keeps a copy of your repository in the cloud, so you can back it up, share it and collaborate.

You commit with git on your computer, and push to GitHub when you want the cloud copy updated.

> Git only helps if you use it. A project with no commits has no history to go back to. Start committing from the first day.
