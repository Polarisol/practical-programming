# .gitignore rules

Each line in `.gitignore` is a rule. Git doesn't track files that match a rule.

**Ignore:** files that are created automatically (`.venv`, `__pycache__/`), large data and output (`data/`, `output/`), and secrets (`.env`). **Never commit passwords or API keys.**

## The rules

| Rule | Ignores |
|------|---------|
| `notes.txt` | Every file or folder with this name, in any folder |
| `*.csv` | Every file ending in `.csv` (`*` = any text) |
| `output/` | Every **folder** named `output` (trailing `/` = folders only) |
| `/config.py` | Only `config.py` in the main folder (leading `/` = from here) |
| `logs/**` | Everything inside `logs`, at any depth |
| `!keep.csv` | **Exception**: don't ignore this file |
| `# text` | A comment |

The **last** matching rule wins, so an exception comes after the rule it cancels:

```gitignore
*.csv
!students.csv
```

## Already committed? Untrack it

`.gitignore` only affects files git isn't tracking yet. For a file you already committed, add it to `.gitignore`, then run this and commit:

```bash
git rm --cached secrets.txt     # the file stays on your computer
```

> A password that reached GitHub stays in the history. Change it.
