# Practical Programming by Dr. Tal Alon

A free, static website for students. It has topic pages with embedded YouTube videos, your written notes, links to your practice bots and an animated ASCII background. It works on laptops and phones.

## See it on your computer

Browsers won't load the content from a double-clicked file, so start a tiny local server:

```bash
cd path/to/this/folder
python -m http.server 8000
```

Then open <http://localhost:8000>.

## Add or change a topic

All content lives in `content/`. You never need to edit the HTML or JavaScript.

1. Open `content/topics.json` and copy an existing topic block. Put a comma between blocks.
2. Edit the fields:

| Field      | What it is |
|------------|------------|
| `id`       | Short name with no spaces, used in the page address (`?id=...`) |
| `title`    | Topic name shown in the side list and on its page |
| `icon`     | A symbol or emoji for the topic, e.g. `☀`, `{ }`, `∑` |
| `blurb`    | One-line description |
| `videos`   | List of `{ "title": "...", "youtube": "<link or video ID>" }`. Add `"start": 90` to start at 1:30 |
| `material` | Path to a Markdown file inside `content/`, e.g. `"topics/my-topic.md"`. It can also be a list of files |
| `bots`     | List of `{ "label": "...", "description": "...", "url": "https://..." }`. Each bot appears **at the top** of the topic as an animated robot. `description` is what the robot "says" in its speech bubble. |
| `links`    | List of `{ "label": "...", "url": "https://..." }`. A file in `assets/` works too, e.g. `"assets/worksheet.pdf"` |

3. Write your notes in `content/topics/<something>.md` using Markdown: `# Heading`, `**bold**`, `- lists`, tables and code blocks. Put images in `assets/` and reference them as `![description](assets/picture.png)`.

Any field can be left out, and its section won't appear on the page.

The text on the Main page comes from `content/home.md`. Edit it like any other Markdown notes file (to use a different file, set `"home"` in the `site` block).

To change the site name (`title` + `author`, shown as "Practical Programming by Dr. Tal Alon"), subtitle or footer, edit the `site` block at the top of `topics.json`.

> Tip: if the home page shows an error after an edit, the JSON probably has a missing comma or quote. Paste it into <https://jsonlint.com> to find the error.

## Publish for free with GitHub Pages

1. Create a free account at <https://github.com> and click **New repository**. Name it (e.g. `class-site`) and make it **Public**.
2. Upload the files. Either drag this folder's contents onto **Add file → Upload files**, or use git:
   ```bash
   git init && git add . && git commit -m "Class site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/class-site.git
   git push -u origin main
   ```
3. In the repo go to **Settings → Pages**, choose **Deploy from a branch**, then branch **main** and folder **/ (root)**, and save.
4. After a minute the site is live at `https://<your-username>.github.io/class-site/`. Share that link with students, or put it on a QR code.

To update the site later, upload or push the changed files. The site refreshes by itself within a minute or two.

## Files

```
index.html            the whole site: Main page + every topic (switches in place)
topic.html            redirect for old topic.html?id=... links
css/style.css         colours, layout, light/dark theme
js/ascii-bg.js        interactive ASCII background
js/app.js             reads topics.json and builds the pages
content/topics.json   your topics  ← edit this
content/home.md       Main page text ← and this
content/topics/*.md   your notes   ← and these
assets/               images, PDFs, worksheets
```
