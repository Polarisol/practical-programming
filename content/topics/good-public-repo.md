# Tips for a good public repository

A public repository is your project's front door. Someone opens it, and within a minute they should know **what it is**, **how to run it**, and that it **actually runs**. These tips get you there.

## 1. Use uv, and commit its files

Commit these three files, so anyone can recreate your exact environment:

- `pyproject.toml`: the libraries your project needs
- `uv.lock`: the exact version of every library
- `.python-version`: the Python version

Then running your project is just:

```bash
uv sync
uv run main.py
```

No guessing which libraries to install, and no "it works on my computer". If you used `uv add` for every library, these files are already up to date. Check that they appear in the **Changes** list, and commit them.

## 2. Write a README

GitHub shows `README.md` on the repository's front page. Keep it short:

- **What it is**: one or two sentences.
- **A screenshot** (or a GIF), if it has a window or a plot. Put it in the repository, e.g. `images/screenshot.png` (see the example below).
- **How to run it**: the exact commands, from clone to run.
- **What else it needs**, if anything: an API key, a data file, a login.

````markdown
# Grade Analyzer

Reads a CSV of grades and plots each class's average.

![Screenshot](images/screenshot.png)

## Run it

```bash
git clone https://github.com/<user-name>/grade-analyzer.git
cd grade-analyzer
uv sync
uv run main.py
```
````

> To see how the README will look, open it in VS Code and press **Ctrl+Shift+V** (Markdown preview).

## 3. Keep junk and secrets out

Check `.gitignore` **before the first commit**. It should list at least `.venv`, `__pycache__/` and `.env`. Before every commit, glance at the **Changes** list: anything you didn't expect there?

- **Never commit passwords or API keys.** Put them in `.env` (ignored), and commit a `.env.example` with the names and no values, so others know what to fill in.
- **No large files.** Big data and generated output stay out. If the project needs data, explain in the README where to get it.

## 4. Make it run on someone else's computer

- **No paths from your computer.** `C:\Users\Dana\Desktop\data.csv` exists only on yours. Use a path relative to the project folder, e.g. `data/grades.csv`.
- **One clear starting point**, e.g. `main.py`, and the README says to run it.

## 5. Add a license

Without a license, nobody is allowed to reuse your code, even if it's public. On the repository's GitHub page click **Add file → Create new file**, name it `LICENSE`, click **Choose a license template**, pick **MIT License**, and commit. Then click **Pull** in VS Code to get the new file.

## 6. Fill in the "About" box

On the repository's page, click the ⚙ gear next to **About** (top right). Add a one-line description and a few **topics** (e.g. `python`, `pyside6`, `data-analysis`). This is what people see in search results.

## 7. Clean history, clear names

- **Commit messages that say what changed** (see *When should I commit*). They are public too.
- **Meaningful names** for the repository, files and folders: `grade-analyzer`, not `project1-final-v2`.

## The final test: clone it yourself

Clone your repository into a new, empty folder (see *Cloning repositories*), run `uv sync`, and follow your own README. If it runs there, it will run for others too. If something is missing, fix it, commit, and **Sync Changes**.
