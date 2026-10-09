# PyInstall

When your program is ready, you may want to give it to someone who doesn't have Python, uv or VS Code. **PyInstaller** packs your program, the Python interpreter and all the libraries it uses into a folder or a single `.exe` file. The other person just double-clicks it, with nothing to install.

> PyInstaller builds for the system it runs on. Build on Windows to get a Windows `.exe`, and on a Mac to get a Mac app. You can't build a Windows `.exe` on a Mac (or the other way around).

## 1. Add PyInstaller to the Project

Open the project in VS Code, open the terminal and write:

```bash
uv add --dev pyinstaller
```

`--dev` marks PyInstaller as a tool you use while developing, not a library your program needs to run.

Before building, make sure the program runs correctly with **Ctrl+F5**. PyInstaller packs your program as it is, bugs included.

## 2. One Folder (the Default)

To build, run `pyinstaller` with the name of the file that starts your program:

```bash
uv run pyinstaller main.py
```

`uv run` runs the command inside the project's `.venv`, so PyInstaller sees every library you added with `uv add`.

When it finishes, there are a few new things in the project folder:

- `dist\main\`: **the result.** A folder with `main.exe` and an `_internal` folder next to it, which holds Python and the libraries.
- `build\`: temporary files PyInstaller used while working. You can delete it.
- `main.spec`: a file with the settings of the build. You can delete it too.

To give the program to someone, zip the whole `dist\main` folder and send it. They unzip it and double-click `main.exe`. The `.exe` doesn't work without the `_internal` folder next to it, so always send the whole folder.

> Tip: add `build/`, `dist/` and `*.spec` to the project's `.gitignore` file, so the build results don't end up in git.

## 3. One File

To get everything in a single `.exe` file, add `--onefile`:

```bash
uv run pyinstaller --onefile main.py
```

Now `dist\` has just one file, `main.exe`, which is easy to send.

The difference between the two:

| | One folder (default) | One file (`--onefile`) |
|---|---|---|
| What you send | A whole folder (zipped) | A single `.exe` |
| Starting the program | Fast | Slower: every time it runs, it first unpacks itself into a temporary folder |
| Antivirus | Usually fine | More often flagged by mistake as suspicious |

Both work. One folder is a good choice for bigger programs, and one file is convenient for small ones.

## 4. Choosing a Name

By default the program is named after your file (`main.exe`). To give it a nicer name, use `--name`:

```bash
uv run pyinstaller --onefile --name Calculator main.py
```

This creates `dist\Calculator.exe`.

## 5. GUI Programs (PySide6): No Terminal Window

If you build a PySide6 program the way shown above and double-click the `.exe`, **two** windows open: your window and an empty black terminal window behind it. If the user closes the terminal, your program closes too.

For GUI programs add `--windowed`, which tells PyInstaller not to open a terminal:

```bash
uv run pyinstaller --onefile --windowed main.py
```

`--noconsole` and `-w` do exactly the same thing as `--windowed`, so you may see any of them in examples online.

Keep in mind:

- With `--windowed` there is no terminal, so anything you `print()` is not shown anywhere. Show messages to the user inside the window instead (in a label or a message box).
- If the program crashes when it starts, build it once **without** `--windowed` and run it again: the terminal stays open and shows the error message.
- Don't use `--windowed` for programs that work in the terminal (with `input()` and `print()`). They need the terminal.

## 6. Adding an Icon

The icon is the picture of the `.exe` file in File Explorer and in the taskbar. On Windows it must be an **`.ico`** file. If you have a picture in another format (like `.png`), convert it with a free online converter (search for "png to ico").

Put the icon in the project folder (for example `app.ico`) and add `--icon`:

```bash
uv run pyinstaller --onefile --windowed --icon=app.ico main.py
```

> Windows remembers icons, so sometimes File Explorer keeps showing the old icon after you rebuild. Rename the `.exe` or copy it to another folder, and you'll see the new one.

### The icon of the window itself

`--icon` sets the icon of the `.exe` file. The small icon at the top-left corner of your PySide6 window is set separately, in the code, with `setWindowIcon`:

```python
from pathlib import Path
from PySide6.QtGui import QIcon

HERE = Path(__file__).parent      # the folder this file is in

    def initUI(self):
        self.setWindowTitle("Calculator")
        self.setWindowIcon(QIcon(str(HERE / "app.ico")))
```

Then tell PyInstaller to pack the icon file together with the program, using `--add-data` (the part after the `:` is the folder to put it in inside the program, and `.` means "next to the program"):

```bash
uv run pyinstaller --onefile --windowed --icon=app.ico --add-data "app.ico:." main.py
```

The same goes for any other file your program loads, like images or sounds: pack each one (or a whole folder, e.g. `--add-data "images:images"`) with `--add-data`, and build its path from `Path(__file__).parent` as above. A path like `"app.ico"` alone works when you run the program from VS Code, but not in the `.exe`, because there the program doesn't start in your project folder.

## Summary

| What you want | Add this |
|---|---|
| One folder (default) | nothing |
| One `.exe` file | `--onefile` |
| A different program name | `--name Calculator` |
| No terminal window (GUI programs, PySide6) | `--windowed` (or `--noconsole`, `-w`) |
| An icon for the `.exe` | `--icon=app.ico` |
| Pack a file the program loads | `--add-data "app.ico:."` |

A typical build of a PySide6 program:

```bash
uv run pyinstaller --onefile --windowed --name Calculator --icon=app.ico --add-data "app.ico:." main.py
```

The result is in the `dist` folder.
