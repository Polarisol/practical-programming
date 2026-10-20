# Setting up "My stats"

"My stats" lets each student sign in with Google and see their own XP from your Google Sheet: the beakers animation, their exercise grade, XP per exercise, מבדק, attendance and activities, their place in the class, an anonymous top 10, and your notes.

It has three parts:

1. **A Google sign-in ID** (a "client ID"). It tells Google that sign-ins come from your site.
2. **A small script attached to the sheet** (`stats.gs` in this folder). It checks who signed in and sends back only that student's numbers. Nobody else's name or email ever leaves the sheet.
3. **Two lines in `content/topics.json`**, which tell the site where the script is.

Until part 3 is filled in, the page is hidden from the side list. You can always preview it with made-up numbers at `?stats&demo`, for example `https://polarisol.github.io/practical-programming/?stats&demo`.

## 1. Create the sign-in ID (once)

1. Open <https://console.cloud.google.com> with your Google account and create a new project, for example "Course stats".
2. Go to **APIs & Services → OAuth consent screen** (it may be called **Google Auth Platform**). Choose **External**, give the app a name such as "Practical Programming stats", and add your email as the support and contact email. You don't need to add any scopes.
3. Under **Audience**, press **Publish app** so it's "In production". Otherwise only the test users you list can sign in. Because the app asks only for a name and email, Google doesn't need to review it.
4. Go to **Credentials → Create credentials → OAuth client ID** and choose **Web application**.
5. Under **Authorized JavaScript origins**, add `https://polarisol.github.io`. To test on your computer, also add `http://localhost:8000` and `http://localhost`. Leave **Authorized redirect URIs** empty.
6. Press **Create** and copy the **Client ID**. It ends in `.apps.googleusercontent.com`.

## 2. Attach the script to the sheet

1. Open the sheet and choose **Extensions → Apps Script**.
2. Delete what's in `Code.gs` and paste in the whole of [`stats.gs`](stats.gs).
3. At the top, replace `PASTE-YOUR-CLIENT-ID.apps.googleusercontent.com` with your Client ID, keeping the quotes. Press **Save**.
4. Press **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Press **Deploy**, then **Authorize access**. Google will warn that the app isn't verified, because it's your own script. Choose **Advanced → Go to ... (unsafe)** and **Allow**. The script asks for two things: the spreadsheet it's attached to ("...spreadsheets that this application has been installed in"), and to connect to an external service, which it uses to check each sign-in with Google. It can't open any of your other files. Google's wording says "edit", but the script only reads.
6. Copy the **Web app URL**. It ends in `/exec`.

"Anyone" means anyone can call the script, but without a valid Google sign-in made for your site it only answers "signed out", and with one it answers only with that person's own row.

## 3. Turn the page on

In `content/topics.json`, add a `stats` block inside the `site` block:

```json
"site": {
  "title": "Practical Programming",
  ...
  "footer_he": "תכנות מעשי · ד״ר טל אלון",
  "stats": {
    "script": "https://script.google.com/macros/s/.../exec",
    "client_id": "1234-abcd.apps.googleusercontent.com",
    "form": "https://forms.gle/..."
  }
},
```

**My stats** now appears in the side list, under Lessons. `"form"` is optional: the link to the form where students register the email they sign in with. The sign-in box shows it as "Not registered yet? Register your email", and so does the message a student gets when their email isn't in the sheet. Answers to the form don't reach the Scores tab on their own, so copy each email into the EMail column.

## How the sheet is read

The script finds columns by their headings, so you can move columns around and add new ones as long as the headings follow the same pattern:

| Tab | Headings it uses |
|-----|------------------|
| `Scores` | `EMail`, `ID`, `Name`, `Total Purple XP`, `Total Green XP`, `Ex1 purple` / `Ex1 green` (any number), `Quiz 1 purple` / `Quiz 1 green` (any number), `Purple XP from attendance` / `Green XP from attendance`, `Purple XP from activities` / `Green XP from activities` |
| `Notes` | `EMail`, `Note1` to `Note5` |
| `ExeMax` | `Exe` (the exercise number), `Max Purple`, `Max Green`: the most XP of each colour the exercise is meant to give |

- A student is matched by the email they sign in with. Capital letters and spaces around it don't matter.
- An empty cell counts as 0.
- An exercise, מבדק, attendance or activities line appears on the page once **any** student has a number in it, so things that haven't happened yet stay hidden. To add Ex9, add `Ex9 purple` and `Ex9 green` columns (and include them in your total formulas).
- The class place uses `Total Purple XP` + `Total Green XP`. Students with the same total share a place. Rows with neither an email nor an ID are skipped.
- The exercise grade is 50 points for each colour: `min(XP, 190) / 190 × 50`. The 190 and the project beaker's 500 are set at the top of `stats.gs`.
- Each exercise is a bar out of its maximum from `ExeMax`, labelled like `7 / 14`. Points above the maximum continue the bar in gold, with a ★ after the numbers. An exercise missing from `ExeMax` shows plain numbers, and a maximum of 0 with no points shows a dash. Quizzes are bars out of 24 (set by `QUIZ_MAX` at the top of `js/stats.js`).
- Notes are shown in Hebrew, right to left, in both languages of the site. Empty note cells are skipped.

Changes in the sheet show up the next time a student opens or refreshes the page.

## A new semester

The script can only open the sheet it's attached to, so each semester's sheet gets its own copy:

1. Make the new sheet with **File → Make a copy** of the old one. The script is copied along with it. Then clear the old students' rows, or paste in the new ones. The new sheet needs the same tab names and headings.
2. In the new sheet, open **Extensions → Apps Script** and deploy it as in part 2 (steps 4 to 6). The Client ID is already in the copied script.
3. Put the new **Web app URL** in `"script"` in `content/topics.json`.

## Changing the script later

After editing `stats.gs`, always use **Deploy → Manage deployments → pencil → New version**. A "New deployment" gets a new address, and the site would still call the old one.
