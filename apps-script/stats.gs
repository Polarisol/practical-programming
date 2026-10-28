/**
 * "My stats" for the course site: a Google Apps Script web app attached to the XP sheet.
 *
 * The site signs a student in with Google and sends the sign-in token here. This script
 * checks the token with Google, finds the student's row by email, and returns only that
 * student's XP, their class place, an anonymous top 10 and their notes. Nobody else's
 * name or email ever leaves the sheet.
 *
 * Setup is in apps-script/README.md. The settings below are the only part to edit.
 *
 * @OnlyCurrentDoc  The script can open only the sheet it is attached to, none of your others.
 */

// The OAuth client ID from Google Cloud (the same one as "client_id" in content/topics.json).
const CLIENT_ID = '327691374361-no4v7b0buvpqb69itsvq67eo0jb4996g.apps.googleusercontent.com';

// How much XP of each colour counts toward the exercise grade (50 points each).
const EXERCISE_CAP = 190;
// The project beaker's scale for each colour.
const PROJECT_CAP = 500;

const SCORES_TAB = 'Scores';
const NOTES_TAB = 'Notes';
const MAX_TAB = 'ExeMax';   // the most XP of each colour each exercise is meant to give
const MAX_NOTES = 20;  // reads Note1 to Note20; missing or empty ones are skipped
const TOP = 10;

function doPost(e) {
  let body = {};
  try { body = JSON.parse((e && e.postData && e.postData.contents) || '{}'); } catch (err) { /* bad body */ }
  return json(handle(body.token));
}

// GET works too (for a quick test in the browser it only answers "signed_out").
function doGet(e) {
  return json(handle(e && e.parameter && e.parameter.token));
}

function handle(token) {
  const email = verify(token);
  if (!email) return { error: 'signed_out' };
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const scores = book.getSheetByName(SCORES_TAB);
  if (!scores) return { error: 'no_sheet' };
  return studentStats(scores.getDataRange().getValues(), notesFor(book, email), email, exerciseMax(book));
}

// The signed-in email, or '' when the token is missing, expired, or made for another site.
function verify(token) {
  if (!token || typeof token !== 'string' || token.length > 4096) return '';
  const res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(token),
    { muteHttpExceptions: true });
  if (res.getResponseCode() !== 200) return '';
  const info = JSON.parse(res.getContentText());
  const issuer = info.iss === 'accounts.google.com' || info.iss === 'https://accounts.google.com';
  const fresh = Number(info.exp) * 1000 > Date.now();
  const verified = info.email_verified === true || info.email_verified === 'true';
  if (info.aud !== CLIENT_ID || !issuer || !fresh || !verified) return '';
  return String(info.email || '').trim().toLowerCase();
}

const num = (v) => (typeof v === 'number' && isFinite(v) ? v : Number(v) || 0);
const filled = (v) => v !== '' && v !== null && v !== undefined;
const sameEmail = (v, email) => String(v || '').trim().toLowerCase() === email;

function studentStats(rows, notes, email, maxes) {
  const head = rows[0].map((h) => String(h).trim().toLowerCase());
  const col = (name) => head.indexOf(name.toLowerCase());
  const people = rows.slice(1).filter((r) => filled(r[col('EMail')]) || filled(r[col('ID')]));
  const me = people.find((r) => sameEmail(r[col('EMail')], email));
  if (!me) return { error: 'not_found', email: email };

  // Every exercise, quiz, attendance and activity column pair, in sheet order. One appears
  // only once some student has points in it, so things that haven't happened stay hidden.
  const items = [];
  const byKey = {};
  head.forEach((h, i) => {
    let m = h.match(/^(ex|quiz)\s*(\d+)\s+(purple|green)$/);
    let key, kind, n, colour;
    if (m) { kind = m[1] === 'ex' ? 'exercise' : 'quiz'; n = Number(m[2]); colour = m[3]; key = kind + n; }
    else if ((m = h.match(/^(purple|green) xp from (attendance|activities)$/))) { kind = m[2]; colour = m[1]; key = kind; }
    else return;
    if (!byKey[key]) { byKey[key] = { kind: kind, n: n || null, purple: 0, green: 0, cols: {} }; items.push(byKey[key]); }
    byKey[key].cols[colour] = i;
  });
  const shown = items.filter((it) => people.some((r) => filled(r[it.cols.purple]) || filled(r[it.cols.green])))
    .map((it) => ({
      kind: it.kind,
      n: it.n,
      purple: it.cols.purple === undefined ? 0 : num(me[it.cols.purple]),
      green: it.cols.green === undefined ? 0 : num(me[it.cols.green]),
      max: it.kind === 'exercise' && maxes && maxes[it.n] ? maxes[it.n] : undefined,
    }));

  // Totals come from the sheet's own formulas; without those columns they are added up here.
  const total = (r, colour) => {
    const c = col('Total ' + colour + ' XP');
    if (c >= 0) return num(r[c]);
    return items.reduce((s, it) => s + (it.cols[colour] === undefined ? 0 : num(r[it.cols[colour]])), 0);
  };
  const ranked = people.map((r) => ({ row: r, purple: total(r, 'Purple'), green: total(r, 'Green') }))
    .map((p) => Object.assign(p, { total: p.purple + p.green }))
    .sort((a, b) => b.total - a.total);
  // Students with the same total share a place: 1, 2, 2, 4.
  ranked.forEach((p, i) => { p.place = i && p.total === ranked[i - 1].total ? ranked[i - 1].place : i + 1; });
  const mine = ranked.find((p) => p.row === me);

  return {
    name: String(me[col('Name')] || ''),
    purple: mine.purple,
    green: mine.green,
    exerciseCap: EXERCISE_CAP,
    projectCap: PROJECT_CAP,
    items: shown,
    place: mine.place,
    classSize: ranked.length,
    top: ranked.slice(0, TOP).map((p) => ({ place: p.place, purple: p.purple, green: p.green, me: p.row === me })),
    notes: notes,
  };
}

// { 1: { purple: 14, green: 0 }, ... } from the ExeMax tab (columns Exe, Max Purple, Max Green).
function exerciseMax(book) {
  const sheet = book.getSheetByName(MAX_TAB);
  if (!sheet) return {};
  const rows = sheet.getDataRange().getValues();
  const head = rows[0].map((h) => String(h).trim().toLowerCase());
  const [n, p, g] = ['exe', 'max purple', 'max green'].map((h) => head.indexOf(h));
  const maxes = {};
  if (n < 0) return maxes;
  rows.slice(1).forEach((r) => {
    if (filled(r[n])) maxes[num(r[n])] = { purple: p < 0 ? null : num(r[p]), green: g < 0 ? null : num(r[g]) };
  });
  return maxes;
}

function notesFor(book, email) {
  const sheet = book.getSheetByName(NOTES_TAB);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  const head = rows[0].map((h) => String(h).trim().toLowerCase());
  const emailCol = head.indexOf('email');
  const row = rows.slice(1).find((r) => sameEmail(r[emailCol], email));
  if (!row) return [];
  const notes = [];
  for (let n = 1; n <= MAX_NOTES; n++) {
    const c = head.indexOf('note' + n);
    if (c >= 0 && String(row[c]).trim()) notes.push(String(row[c]).trim());
  }
  return notes;
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
