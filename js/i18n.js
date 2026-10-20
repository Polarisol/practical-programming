/*
 * The site's language: English or Hebrew, picked with the language button in the top bar
 * and remembered in this browser. index.html sets <html lang dir> before the page draws.
 *
 * In Hebrew:
 *  - interface text comes from HE below (the English text is the key);
 *  - text in content/topics.json comes from a "<field>_he" next to the field, e.g. "title_he";
 *  - Markdown notes and quizzes come from content/he/<same path>, e.g. content/he/topics/x.md.
 * Anything without a Hebrew version is shown in English.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const lang = root.lang === 'he' ? 'he' : 'en';

  const HE = {
    // Top bar, entry screen
    'Welcome': 'ברוכים הבאים',
    'Practical Programming Course Material': 'חומרי הקורס תכנות מעשי',
    'Dr. Tal Alon': 'ד״ר טל אלון',
    'ENTER': 'כניסה',
    'Search…  ( / )': 'חיפוש…  ( / )',
    'Search all topics': 'חיפוש בכל הנושאים',
    'Practice Python': 'תרגול Python',
    'Open a new Google Colab notebook': 'פתיחת מחברת Google Colab חדשה',
    'Colour scheme': 'ערכת צבעים',
    'Colour scheme: {name}': 'ערכת צבעים: {name}',
    'Light': 'בהיר',
    'Dark': 'כהה',
    'Terminal': 'טרמינל',
    'Black & White': 'שחור-לבן',
    'Hide unit icons': 'הסתרת סמלי היחידות',
    'Show unit icons': 'הצגת סמלי היחידות',
    'Topics': 'נושאים',
    'Main': 'ראשי',
    'Search Results': 'תוצאות חיפוש',
    'Lessons': 'שיעורים',
    'My stats': 'הנתונים שלי',

    // Python practice panel
    'Python practice': 'תרגול Python',
    'Close Python practice': 'סגירת תרגול Python',
    'Run (Ctrl+Enter)': 'הרצה (Ctrl+Enter)',
    '▶ Run': '▶ הרצה',
    '■ Stop': '■ עצירה',
    'Load an example': 'טעינת דוגמה',
    'Examples…': 'דוגמאות…',
    'Hello': 'שלום',
    'Variables': 'משתנים',
    'Input': 'קלט',
    'Loops': 'לולאות',
    'Functions': 'פונקציות',
    'Python code': 'קוד Python',
    'Tab indents · Ctrl+Enter runs · Esc closes · your code is saved in this browser':
      'Tab מזיח · Ctrl+Enter מריץ · Esc סוגר · הקוד נשמר בדפדפן הזה',
    '(values for input(), one per line)': '(ערכים עבור input(), אחד בכל שורה)',
    'Input values, one per line': 'ערכי קלט, אחד בכל שורה',
    'Output': 'פלט',
    'clear': 'ניקוי',
    'Replace your code with this example?': 'להחליף את הקוד שלך בדוגמה הזו?',
    'Stopped: the program printed too much. Is there a loop that never ends?':
      'נעצר: התוכנית הדפיסה יותר מדי. אולי יש לולאה שלא נגמרת?',
    'Loading Python… (the first time takes a few seconds)': 'טוען את Python… (בפעם הראשונה זה לוקח כמה שניות)',
    'Ready': 'מוכן',
    'Finished in {s} s': 'הסתיים תוך {s} שניות',
    'Python could not load. Check your internet connection and try again.':
      'לא ניתן היה לטעון את Python. בדקו את החיבור לאינטרנט ונסו שוב.',
    'Python is still loading. Your code will run as soon as it is ready…':
      'Python עדיין נטען. הקוד ירוץ ברגע שהוא יהיה מוכן…',
    'Running…': 'רץ…',
    'Stopped: the program ran for more than {n} seconds. Is there a loop that never ends?':
      'נעצר: התוכנית רצה יותר מ-{n} שניות. אולי יש לולאה שלא נגמרת?',
    'Stopped.': 'נעצר.',
    '(no output: use print() to show something)': '(אין פלט: השתמשו ב-print() כדי להציג משהו)',

    // Pages
    'Class Resources': 'חומרי הקורס',
    '{title} by {author}': '{title} מאת {author}',
    'by {author}': 'מאת {author}',
    'Loading…': 'טוען…',
    'Open this site through a web server. ': 'יש לפתוח את האתר דרך שרת אינטרנט. ',
    'Browsers block loading content from local files. In this folder run ':
      'דפדפנים חוסמים טעינת תוכן מקבצים מקומיים. הריצו בתיקייה הזו את ',
    ' and open http://localhost:8000': ' ופתחו את http://localhost:8000',
    'Could not load content/topics.json. ': 'לא ניתן לטעון את content/topics.json. ',
    'Check that the file exists and is valid JSON ({error}).': 'בדקו שהקובץ קיים ושהוא JSON תקין ({error}).',
    'Viewed {n} time': 'נצפה פעם אחת',
    'Viewed {n} times': 'נצפה {n} פעמים',
    'Topic not found · {site}': 'הנושא לא נמצא · {site}',
    'That topic doesn’t exist (yet). Pick one from the list.': 'הנושא הזה לא קיים (עדיין). בחרו נושא מהרשימה.',
    'Search Results · {site}': 'תוצאות חיפוש · {site}',
    'Searching…': 'מחפש…',
    '{n} item matches “{q}”': 'פריט אחד מתאים ל־„{q}”',
    '{n} items match “{q}”': '{n} פריטים מתאימים ל־„{q}”',
    'Nothing matches “{q}”. Try other words.': 'שום דבר לא מתאים ל־„{q}”. נסו מילים אחרות.',

    // Lessons
    'Lesson': 'שיעור',
    'Lesson {n}': 'שיעור {n}',
    'Latest': 'אחרון',
    '→': '←',
    '{n} item': 'פריט אחד',
    '{n} items': '{n} פריטים',
    'The material of each lesson, gathered from the units. The newest lesson is on top.':
      'החומר של כל שיעור, אסוף מהיחידות השונות. השיעור האחרון למעלה.',
    '← All lessons': '→ כל השיעורים',
    'Lesson not found · {site}': 'השיעור לא נמצא · {site}',
    'That lesson doesn’t exist (yet). Pick one from the list.': 'השיעור הזה לא קיים (עדיין). בחרו שיעור מהרשימה.',

    // Items on a topic page
    'Bot': 'בוט',
    'Text': 'טקסט',
    'Video': 'סרטון',
    'Quiz': 'בוחן',
    'Sim': 'הדמיה',
    'File': 'קובץ',
    'Link': 'קישור',
    'Videos': 'סרטונים',
    'Video {n}': 'סרטון {n}',
    'YouTube video': 'סרטון YouTube',
    'Written material': 'חומר כתוב',
    'Quizzes': 'בחנים',
    'Simulation': 'הדמיה',
    'Simulations': 'הדמיות',
    'Simulation {n}': 'הדמיה {n}',
    'This simulation could not start. Refresh the page to try again.': 'לא ניתן להפעיל את ההדמיה. רעננו את הדף כדי לנסות שוב.',
    'Files': 'קבצים',
    'More resources': 'מקורות נוספים',
    'Practice bot': 'בוט תרגול',
    'Practice with a bot': 'תרגול עם בוט',
    'Practice with the bot': 'תרגול עם הבוט',
    'Hi! Want to practice {topic} with me?': 'היי! רוצים לתרגל איתי {topic}?',
    'this topic': 'את הנושא הזה',
    'Start chatting ↗': 'התחילו לשוחח ↖',
    'chat ↗': 'שיחה ↖',
    '↗': '↖',
    'copy': 'העתקה',
    'copied ✓': 'הועתק ✓',
    'press Ctrl+C': 'לחצו Ctrl+C',
    '↻ Try again': '↻ נסו שוב',
    'Could not load {file}. ': 'לא ניתן לטעון את {file}. ',

    // Quizzes
    'Perfect score! 🎉': 'ציון מושלם! 🎉',
    'Great job! Check the corrections for what you missed.': 'כל הכבוד! עברו על התיקונים במה שפספסתם.',
    'Good effort. Read the feedback below, then try again.': 'ניסיון יפה. קראו את המשוב למטה ונסו שוב.',
    'Keep practicing. Read the feedback below, then try again.': 'המשיכו לתרגל. קראו את המשוב למטה ונסו שוב.',
    'No valid questions found in {file}.': 'לא נמצאו שאלות תקינות ב־{file}.',
    'Choose all that apply.': 'בחרו את כל התשובות הנכונות.',
    'Submit answers': 'הגשת התשובות',
    '{a} / {n} answered': 'נענו {a} / {n}',
    '{m} of {n} questions are not answered yet. Submit anyway?': '{m} מתוך {n} השאלות עדיין לא נענו. להגיש בכל זאת?',
    '✓ your answer': '✓ התשובה שלך',
    '✗ your answer': '✗ התשובה שלך',
    'correct answer': 'התשובה הנכונה',
    '✓ Correct': '✓ נכון',
    '✗ Incorrect': '✗ לא נכון',
    '— Not answered': '— לא נענתה',
    "Ready? {n} question. Let's see what you know!": 'מוכנים? שאלה אחת. בואו נראה מה אתם יודעים!',
    "Ready? {n} questions. Let's see what you know!": 'מוכנים? {n} שאלות. בואו נראה מה אתם יודעים!',

    // Path-finding simulation
    'Queue (front → back)': 'תור (מההתחלה ← לסוף)',
    'Stack (top → bottom)': 'מחסנית (מלמעלה ← למטה)',
    'Priority queue (smallest f = g + h first, then smallest h)': 'תור עדיפויות (קודם f = g + h הקטן ביותר, ואז h הקטן ביותר)',
    'Takes the square that has waited longest: it spreads out in rings.': 'לוקח את המשבצת שחיכתה הכי הרבה זמן: החיפוש מתפשט בטבעות.',
    'Takes the square added last: it dives deep, then backtracks.': 'לוקח את המשבצת שנוספה אחרונה: החיפוש צולל לעומק ואז חוזר אחורה.',
    'Takes the square with the smallest f = steps so far (g) + guess to the goal (h). On a tie, the one with the smaller h (closer to the goal).':
      'לוקח את המשבצת עם ה־f הקטן ביותר = הצעדים עד כה (g) + ההערכה עד היעד (h). בתיקו, את זו עם ה־h הקטן יותר (קרובה יותר ליעד).',
    'Start': 'התחלה',
    'Goal': 'יעד',
    'Wall': 'קיר',
    'Erase': 'מחיקה',
    'Grid, 10 by 10': 'לוח, 10 על 10',
    'Step': 'צעד',
    'Reset': 'איפוס',
    'Clear walls': 'ניקוי קירות',
    'Random walls': 'קירות אקראיים',
    'Speed': 'מהירות',
    'Algorithm': 'אלגוריתם',
    'Place': 'הצבה',
    'Place on the grid': 'הצבה על הלוח',
    'Slow': 'איטי',
    'Fast': 'מהיר',
    'explored (the number is the order)': 'נבדקה (המספר הוא הסדר)',
    'waiting in the list': 'מחכה ברשימה',
    'being explored now': 'נבדקת עכשיו',
    'the path found': 'המסלול שנמצא',
    'empty': 'ריקה',
    'wall': 'קיר',
    'waiting': 'מחכה',
    'explored {n}': 'נבדקה {n}',
    ', on the path': ', על המסלול',
    'start, {what}': 'התחלה, {what}',
    'goal, {what}': 'יעד, {what}',
    'Row {r}, column {c}: {what}': 'שורה {r}, עמודה {c}: {what}',
    '{list}: ': '{list}: ',
    '  … {n} more': '  … ועוד {n}',
    'Press Play or Step to start the search.': 'לחצו על הפעלה או על צעד כדי להתחיל את החיפוש.',
    'Exploring {cell} · {n} square explored': 'בודק את {cell} · נבדקה משבצת אחת',
    'Exploring {cell} · {n} squares explored': 'בודק את {cell} · נבדקו {n} משבצות',
    'Found the goal! Path: {steps} steps · {n} squares explored': 'היעד נמצא! מסלול: {steps} צעדים · נבדקו {n} משבצות',
    'No path: walls block the goal · {n} squares explored': 'אין מסלול: קירות חוסמים את היעד · נבדקו {n} משבצות',
    '❚❚ Pause': '❚❚ השהיה',
    '↻ Run again': '↻ הרצה חוזרת',
    '▶ Play': '▶ הפעלה',

    // Handwritten digit simulation
    'Drawing grid, 28 by 28. Draw a digit with the mouse or a finger.': 'לוח ציור, 28 על 28. ציירו ספרה בעכבר או באצבע.',
    'What the model sees': 'מה שהמודל רואה',
    'How sure the model is about each digit': 'כמה המודל בטוח בכל ספרה',
    '✎ Draw': '✎ ציור',
    '⌫ Erase': '⌫ מחיקה',
    'Clear': 'ניקוי',
    'Pen': 'עט',
    'The model says': 'המודל אומר',
    '{p}% sure': 'ודאות של {p}%',
    'What the model sees: your drawing cropped, scaled to fit 20 x 20 and centred, like the 60,000 MNIST digits it learned from. Each of the 784 squares is one input, from 0 (empty) to 1 (full ink).':
      'מה שהמודל רואה: הציור שלכם, חתוך, מוקטן או מוגדל כך שייכנס ל־20 על 20 וממורכז, בדיוק כמו 60,000 ספרות ה־MNIST שהמודל למד מהן. כל אחת מ־784 המשבצות היא קלט אחד, מ־0 (ריקה) עד 1 (מלאה בדיו).',
    'Draw a digit from 0 to 9 on the grid.': 'ציירו על הלוח ספרה מ־0 עד 9.',
    'Loading the model…': 'טוען את המודל…',
    'Keep drawing or erase, and watch the chances change.': 'המשיכו לצייר או למחוק, וצפו איך הסיכויים משתנים.',
    'The model could not load. Refresh the page to try again.': 'לא ניתן לטעון את המודל. רעננו את הדף כדי לנסות שוב.',

    // My stats
    'An example with made-up numbers.': 'דוגמה עם מספרים מומצאים.',
    'My stats isn’t set up yet.': 'הדף ״הנתונים שלי״ עוד לא הוגדר.',
    'Loading your XP…': 'טוען את ה־XP שלך…',
    'Your XP could not load. Check your connection and try again.': 'לא ניתן לטעון את ה־XP שלך. בדקו את החיבור ונסו שוב.',
    'Try again': 'נסו שוב',
    'Your sign-in ran out. Please sign in again.': 'פג תוקף ההתחברות. התחברו שוב, בבקשה.',
    '{email} isn’t on the class list. Sign in with the email you gave for the course, or ask your lecturer to add it.':
      'הכתובת {email} לא נמצאת ברשימת הכיתה. התחברו עם המייל שמסרתם לקורס, או בקשו מהמרצה להוסיף אותה.',
    'Sign in': 'התחברות',
    'Sign in with the Google account whose email you gave for the course. Only you can see your numbers.':
      'התחברו עם חשבון Google שאת כתובת המייל שלו מסרתם לקורס. רק אתם רואים את הנתונים שלכם.',
    'See an example with made-up numbers': 'לצפייה בדוגמה עם מספרים מומצאים',
    'Google sign-in could not load. Check your connection and refresh the page.': 'לא ניתן לטעון את ההתחברות של Google. בדקו את החיבור ורעננו את הדף.',
    'Exercise {n}': 'תרגיל {n}',
    'Quiz {n}': 'מבדק {n}',
    'Attendance': 'נוכחות',
    'Exercises': 'תרגילים',
    'Activities': 'פעילויות',
    'Sign out': 'התנתקות',
    'Hi {name}, here are your stats': 'היי {name}, הנה הנתונים שלך',
    'Here are your stats': 'הנה הנתונים שלך',
    'Total XP': 'סך הכול XP',
    '{n} purple': '{n} סגול',
    '{n} green': '{n} ירוק',
    'Class place': 'מקום בכיתה',
    'Place {n}': 'מקום {n}',
    'of {n} students': 'מתוך {n} סטודנטים',
    'Exercise grade': 'ציון תרגילים',
    'out of 100': 'מתוך 100',
    'Your XP beakers': 'כוסות ה־XP שלך',
    'Each colour fills its beaker up to {cap} XP, which is a full exercise grade. Anything above that pours into the project beaker as a bonus.':
      'כל צבע ממלא את הכוס שלו עד {cap} XP, שזה ציון תרגילים מלא. כל מה שמעבר לזה נשפך לכוס הפרויקט כבונוס.',
    'Where your XP came from': 'מאיפה הגיע ה־XP שלך',
    'No XP yet. It will show here after your first class.': 'עדיין אין XP. הוא יופיע כאן אחרי השיעור הראשון.',
    'Top 10': '10 המובילים',
    'Notes from {author}': 'הערות מ{author}',
    'Notes': 'הערות',
    'Purple XP': 'XP סגול',
    'Green XP': 'XP ירוק',
    'You': 'את/ה',
    'Purple XP {p} of {cap}, green XP {g} of {cap}. Project bonus: {pb} purple, {gb} green.':
      'XP סגול {p} מתוך {cap}, XP ירוק {g} מתוך {cap}. בונוס לפרויקט: {pb} סגול, {gb} ירוק.',
    'Project bonus': 'בונוס לפרויקט',
    'Purple': 'סגול',
    'Green': 'ירוק',
    '↻ Replay': '↻ שוב',
  };

  // Interface text in the current language. {name} in the text is filled from `vars`.
  function t(text, vars) {
    let s = (lang === 'he' && HE[text]) || text;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
    return s;
  }

  // English for 1, otherwise the plural form; Hebrew has its own text for each.
  const plural = (n, one, many, vars = {}) => t(n === 1 ? one : many, { n, ...vars });

  // A field from topics.json, using its "<field>_he" twin in Hebrew when there is one.
  function pick(obj, field) {
    if (!obj) return undefined;
    const he = obj[`${field}_he`];
    return lang === 'he' && typeof he === 'string' && he.trim() ? he : obj[field];
  }

  // Static text in index.html: data-i18n translates the element's text, and
  // data-i18n-attr="placeholder title" translates those attributes.
  if (lang === 'he') {
    document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.textContent.trim()); });
    document.querySelectorAll('[data-i18n-attr]').forEach((n) => {
      for (const a of n.dataset.i18nAttr.split(/\s+/)) if (n.hasAttribute(a)) n.setAttribute(a, t(n.getAttribute(a)));
    });
  }

  // ---------- Language button ----------
  // Shows the language it switches to; the page reloads in that language.
  const button = document.querySelector('.lang-toggle');
  if (button) {
    const other = lang === 'he' ? { id: 'en', short: 'EN', name: 'English' } : { id: 'he', short: 'עב', name: 'עברית (Hebrew)' };
    button.replaceChildren(Object.assign(document.createElement('span'), { className: 'lang-toggle-label', textContent: other.short }));
    button.setAttribute('lang', other.id);
    button.setAttribute('aria-label', other.name);
    button.title = other.name;
    button.addEventListener('click', () => {
      try { localStorage.setItem('lang', other.id); } catch { /* storage unavailable */ }
      location.reload();
    });
  }

  window.I18N = { lang, t, plural, pick };
})();
