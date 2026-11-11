// ---------- Einrichtung (Start-Setup) ----------
// Für Menschen ohne Obsidian-Erfahrung: fragt Themen ab und legt Ordner, Vorlagen, Listen, Startseite und Startzitate an.
// Auf Deutsch oder Englisch. Legt nur an, was fehlt, und überschreibt nie etwas.

// Eigenschaftsnamen in englischen Vorlagen (zusätzlich zu PROP_EN, das Compass beim Lesen versteht)
const SETUP_KEYS_EN = Object.assign({}, PROP_EN, { ende: "end", plattform: "platform" });
const setupKey = (lang, key) => (lang === "en" ? SETUP_KEYS_EN[key] || key : key);

const SETUP_TOPICS = [
  { id: "journal", ico: "✍️", name: ["Tagebuch & Gedanken", "Journal & thoughts"], folder: "10 Reflect/Journal", tpl: ["Journal"], basic: true },
  { id: "career", ico: "💼", name: ["Arbeit & Karriere", "Work & career"], folder: "10 Reflect/Career", tpl: ["Note"], basic: true },
  { id: "family", ico: "💌", name: ["Familie & Freunde", "Family & friends"], folder: "20 Connect/Family", tpl: ["Person"], basic: true },
  { id: "stories", ico: "📖", name: ["Erinnerungen & Geschichten", "Memories & stories"], folder: "20 Connect/Lovely Stories", tpl: ["Story"], basic: true },
  { id: "recipes", ico: "🍳", name: ["Rezepte", "Recipes"], folder: "20 Connect/Recipes", tpl: ["Recipe"], basic: true },
  { id: "projects", ico: "🧭", name: ["Projekte & Hobbys", "Projects & hobbies"], folder: "30 Projects", tpl: ["Project"], basic: true, lists: ["project"] },
  { id: "quotes", ico: "❝", name: ["Zitate sammeln", "Collecting quotes"], folder: "40 Quotes", tpl: ["Quote"], basic: true, lists: ["quote"] },
  { id: "media", ico: "🍃", name: ["Lesen, Sehen, Hören", "Reading, watching, listening"], folder: "50 Media", tpl: ["Book", "Movie", "Podcast", "Article"], basic: true, lists: ["reading", "watching", "listening"] },
  { id: "write", ico: "🖋️", name: ["Schreiben & Veröffentlichen", "Writing & publishing"], folder: "60 Write", tpl: ["Write"], lists: ["writing"] },
  { id: "admin", ico: "🗄️", name: ["Alltag & Organisation", "Everyday & admin"], folder: "80 Admin", tpl: ["Note"] },
];
const SETUP_MEDIA = ["Articles", "Books", "Movies & Series", "Podcasts & Audiobooks"];
const SETUP_ROOT_INFO = {
  "00 Inbox": ["Alles Neue landet hier", "Everything new lands here"], "10 Reflect": ["Ich", "Me"], "20 Connect": ["Menschen", "People"],
  "30 Projects": ["Vorhaben, Hobbys", "Plans, hobbies"], "40 Quotes": ["100 Startzitate", "100 starter quotes"], "50 Media": ["Bücher, Filme, Podcasts", "Books, films, podcasts"],
  "60 Write": ["Texte", "Writing"], "80 Admin": ["Alltag", "Everyday"], "99 System": ["Vorlagen, Anhänge", "Templates, attachments"],
};

// Empfohlene Plugins. Installiert wird über Obsidians offizielle Plugin-Seite, nie im Hintergrund.
const SETUP_PLUGINS = [
  { id: "templater-obsidian", name: "Templater", dl: "6,2 Mio.", core: true,
    why: ["Jede neue Notiz bekommt automatisch die Vorlage ihres Ordners.", "Every new note automatically gets the template of its folder."],
    with: ["Füllt Kopf, Footer und Eigenschaften. Davon leben die Listen und die Startseite.", "Fills in header, footer and properties, which feed the lists and the home page."] },
  { id: "homepage", name: "Homepage", dl: "1,4 Mio.", core: true,
    why: ["Öffnet beim Start immer deine Startseite.", "Always opens your home page on startup."],
    with: ["Die Startseite zeigt Bereiche, Inbox und das Zitat des Tages.", "The home page shows your areas, your inbox and the quote of the day."] },
  { id: "obsidian-style-settings", name: "Style Settings", dl: "2,8 Mio.",
    why: ["Schrift und Farben einstellen, ohne Code.", "Adjust fonts and colours without code."],
    with: ["Optional: wirkt nur mit Themes, die Regler anbieten, etwa Minimal oder Blue Topaz.", "Optional: only works with themes that offer options, such as Minimal or Blue Topaz."] },
  { id: "obsidian-icon-folder", name: "Iconize", dl: "2,3 Mio.", core: true,
    why: ["Symbole für Ordner, damit du sofort siehst, wo was ist.", "Icons for folders, so you see at a glance where things are."],
    with: ["Symbol setzen: Rechtsklick auf einen Ordner.", "To set an icon: right-click a folder."] },
  { id: "notebook-navigator", name: "Notebook Navigator", dl: "1,1 Mio.", core: true,
    why: ["Notizen als Liste mit Vorschau, ähnlich wie Apple Notizen.", "Notes as a list with previews, similar to Apple Notes."],
    with: ["Für den Einstieg übersichtlicher als die normale Ordnerliste.", "Easier to start with than the standard folder list."] },
  { id: "obsidian-paste-image-rename", name: "Paste image rename", dl: "184.000", core: true,
    why: ["Eingefügte Bilder bekommen sprechende Namen statt „Pasted image 2026…“.", "Pasted images get meaningful names instead of “Pasted image 2026…”."],
    with: ["Bilder landen in 99 System/Attachments. Die Compass-Leiste ordnet sie an.", "Images go to 99 System/Attachments. The Compass toolbar arranges them."] },
  { id: "remember-cursor-position", name: "Remember cursor position", dl: "210.000", core: true,
    why: ["Lange Notizen öffnen sich dort, wo du aufgehört hast.", "Long notes open where you left off."], with: ["", ""] },
  { id: "table-editor-obsidian", name: "Advanced Tables", dl: "3,4 Mio.",
    why: ["Tabellen bequemer bearbeiten, mit Tab zur nächsten Zelle.", "Edit tables more comfortably, with Tab to the next cell."],
    with: ["Optional: Obsidian bearbeitet Tabellen inzwischen auch selbst.", "Optional: Obsidian can now edit tables on its own."] },
  { id: "highlightr-plugin", name: "Highlightr", dl: "749.000",
    why: ["Text farbig markieren, über ein Menü.", "Highlight text in colour from a menu."],
    with: ["Optional: seit 2022 nicht mehr aktualisiert.", "Optional: not updated since 2022."] },
  { id: "obsidian-importer", name: "Importer", dl: "1,9 Mio.", importer: true,
    why: ["Holt deine Notizen aus der bisherigen App.", "Brings over your notes from your previous app."],
    with: ["Einmalig für den Umzug. Danach kannst du es wieder ausschalten.", "Only needed for the move. You can switch it off afterwards."] },
];

// Vorlagen: Eigenschaften [Name, Art, Vorgabe] mit deutschen Namen, Abschnitte [Deutsch, Englisch, Hinweis DE, Hinweis EN]
const SETUP_TEMPLATES = {
  Note: { type: "note", tag: "notes", props: [["kernaussage"], ["date", "date"], ["quellen", "list"], ["related", "list"]],
    sections: [["Gedanken", "Thoughts", "Was ist die Idee? Ein paar Sätze reichen.", "What is the idea? A few sentences are enough."], ["Zusammenhänge", "Connections", "Woran erinnert dich das? Verlinke mit [[ ]].", "What does it remind you of? Link with [[ ]]."], ["Anwenden", "Apply"]] },
  Journal: { type: "journal", tag: "journal", dayQuote: true, props: [["kernaussage"], ["date", "date"], ["mood"], ["related", "list"]],
    sections: [["Heute", "Today", "Was ist passiert? Zwei, drei Sätze reichen.", "What happened? Two or three sentences are enough."], ["Gedanken", "Thoughts"], ["Dankbar für", "Grateful for", null, null, "- \n- \n- "]] },
  Person: { type: "person", tag: "people", props: [["kernaussage"], ["relation"], ["birthday"], ["related", "list"]],
    sections: [["Was uns verbindet", "What connects us"], ["Merken", "Remember", "Geschenkideen, Lieblingsessen, wichtige Termine.", "Gift ideas, favourite food, important dates."]] },
  Story: { type: "story", tag: "stories", props: [["kernaussage"], ["kind"], ["date", "date"], ["place"], ["people", "list"], ["related", "list"]],
    sections: [["Was ist passiert?", "What happened?"], ["Warum ich sie nicht vergessen will", "Why I want to remember it"]] },
  Recipe: { type: "recipe", tag: "recipes", props: [["kernaussage"], ["from"], ["servings"], ["time"], ["quellen", "list"]],
    sections: [["Zutaten", "Ingredients", null, null, "- "], ["Zubereitung", "Method", null, null, "1. "], ["Die Geschichte dazu", "The story behind it"]] },
  Project: { type: "project", tag: "projects", props: [["status", "text", ["Idee", "Idea"]], ["kernaussage"], ["start", "date"], ["ende"], ["related", "list"]],
    sections: [["Ziel", "Goal", "Woran merkst du, dass es fertig ist?", "How will you know it is done?"], ["Nächste Schritte", "Next steps", null, null, "- [ ] "], ["Notizen", "Notes"]] },
  Quote: { type: "quote", tag: "quotes", quote: true, props: [["art", "text", ["Aussage", "Statement"]], ["author"], ["source"], ["stelle"], ["link"], ["thema", "list"], ["übersetzung"], ["teilen", "bool"], ["date", "date"], ["related", "list"]],
    sections: [["Was es für mich bedeutet", "What it means to me"]] },
  Book: { type: ["Buch", "Book"], tag: "books", props: [["author"], ["bewertung"], ["link"], ["notiz"], ["kernaussage"]],
    sections: [["Worum es geht", "What it is about"], ["Gedanken", "Thoughts"], ["Zitate", "Quotes", "Satz markieren, Rechtsklick, „Als Zitat speichern“. Das Zitat verweist dann auf dieses Buch.", "Select a sentence, right-click, “Save as quote”. The quote then links back to this book."]] },
  Movie: { type: ["Film", "Movie"], tag: "movies", props: [["bewertung"], ["plattform"], ["link"], ["notiz"]],
    sections: [["Worum es geht", "What it is about"], ["Eindruck", "Impression"]] },
  Podcast: { type: ["Podcast", "Podcast"], tag: "podcasts", props: [["author"], ["bewertung"], ["link"], ["notiz"]],
    sections: [["Folge", "Episode"], ["Gedanken", "Thoughts"]] },
  Article: { type: ["Artikel", "Article"], tag: "articles", props: [["author"], ["source"], ["link"], ["date", "date"], ["notiz"]],
    sections: [["Kernpunkte", "Key points", null, null, "- "], ["Gedanken", "Thoughts"]] },
  Write: { type: "write", tag: "write", props: [["status", "text", ["Idee", "Idea"]], ["kernaussage"], ["bezug", "list"], ["quellen", "list"], ["teilen", "bool"], ["date", "date"]],
    sections: [["Text", "Text"]] },
};
// Ordner → Vorlage (für Templater) und Farbthema je Vorlage
const SETUP_FOLDER_TEMPLATES = {
  "00 Inbox": "Note", "10 Reflect/Journal": "Journal", "10 Reflect/Career": "Note", "20 Connect/Family": "Person", "20 Connect/Lovely Stories": "Story",
  "20 Connect/Recipes": "Recipe", "30 Projects": "Project", "40 Quotes": "Quote", "50 Media/Books": "Book", "50 Media/Movies & Series": "Movie",
  "50 Media/Podcasts & Audiobooks": "Podcast", "50 Media/Articles": "Article", "60 Write": "Write", "80 Admin": "Note",
};
const SETUP_TEMPLATE_THEMES = { Journal: "ocker", Person: "rose", Story: "mint", Recipe: "blau", Project: "salbei", Book: "blau", Movie: "lavendel", Podcast: "mokka", Article: "sand", Write: "salbei" };
const SETUP_SYSTEM = { templates: "99 System/Templates", attachments: "99 System/Attachments" };

const yamlStr = (v) => JSON.stringify(String(v));
const pick = (v, lang) => (Array.isArray(v) ? v[lang === "en" ? 1 : 0] : v);
const DATE_TAG = '"<% tp.date.now("YYYY-MM-DD") %>"';

// opts.date: Datums-Platzhalter (Templater oder Obsidians Vorlagen), opts.quotes: Ordner für das Zitat des Tages
function setupTemplate(lang, name, opts = {}) {
  const T = SETUP_TEMPLATES[name];
  const dateTag = opts.date || DATE_TAG;
  const L = lang === "en" ? 1 : 0;
  const k = (x) => setupKey(lang, x);
  const fm = [];
  if (!T.quote) fm.push(k("vorlage") + ": " + name);
  fm.push("type: " + pick(T.type, lang));
  for (const [key, kind, def] of T.props) {
    if (kind === "date") fm.push(k(key) + ": " + dateTag);
    else if (kind === "list") fm.push(k(key) + ": []");
    else if (kind === "bool") fm.push(k(key) + ": false");
    else fm.push(k(key) + ":" + (def ? " " + pick(def, lang) : ""));
  }
  fm.push("tags:", "  - " + T.tag);
  let body = T.quote ? "```quote-card\n```\n" : "```note-header\n```\n";
  if (T.dayQuote) body += "\n```quote-card\ntoday: " + (opts.quotes || "40 Quotes") + "\n```\n";
  for (const s of T.sections) {
    body += "\n## " + s[L] + "\n";
    if (s[2 + L]) body += "%% " + s[2 + L] + " %%\n";
    body += (s[4] ? s[4] + "\n" : "\n") + "\n";
  }
  if (!T.quote) body += "```note-footer\n```\n";
  return "---\n" + fm.join("\n") + "\n---\n" + body;
}

// Listen (Bases) in der Sprache der Einrichtung. „where“ legt Ordner fest, für das Einbauen in vorhandene Vaults:
// { quotes: "40 Quotes", media: "50 Media", subs: { reading: ["Books", "Articles"], … } }; ein leerer Unterordner meint den Medienordner selbst.
const SETUP_MEDIA_SUBS = { reading: ["Books", "Articles"], watching: ["Movies & Series"], listening: ["Podcasts & Audiobooks"] };
const joinPath = (a, b) => (b ? a + "/" + b : a);
// YAML-Text in einfachen Anführungszeichen: Ordnernamen mit „#“, „:“ oder Anführungszeichen bleiben vollständig
const yamlQ = (s) => "'" + String(s).replace(/'/g, "''") + "'";
function setupBases(lang, where = {}) {
  const Q = where.quotes || "40 Quotes", M = where.media || "50 Media", SUBS = where.subs || SETUP_MEDIA_SUBS;
  const de = lang !== "en";
  const k = (x) => setupKey(lang, x);
  const t = (a, b) => (de ? a : b);
  const prop = (name, label) => `  ${name}:\n    displayName: ${yamlStr(label)}\n`;
  const order = (...cols) => "    order:\n" + cols.map((c) => "      - " + c + "\n").join("");
  const sortBy = (p, dir) => `    sort:\n      - property: ${p}\n        direction: ${dir || "ASC"}\n`;
  const view = (type, name, extra) => `  - type: ${type}\n    name: ${yamlStr(name)}\n` + extra;
  const media = (sub) => yamlQ(`file.inFolder(${yamlStr(joinPath(M, sub))})`);
  const done = (a, b) => `if(${k("bewertung")} != null && ${k("bewertung")} != "", ${yamlStr(a)}, ${yamlStr(b)})`;
  const mediaBase = (subs, doneLabel, openLabel, views) =>
    "filters:\n  or:\n" + subs.map((s) => "    - " + media(s) + "\n").join("") +
    `formulas:\n  status: '${done(doneLabel, openLabel)}'\n  quotes: ${yamlQ(`file.backlinks.filter(value.asFile().inFolder(${yamlStr(Q)}))`)}\n` +
    "properties:\n" + prop("file.name", t("Titel", "Title")) + prop("note.type", t("Art", "Type")) + prop("note.author", t("Autor", "Author")) +
    prop("note." + k("bewertung"), t("Bewertung", "Rating")) + prop("note." + k("notiz"), t("Notiz", "Comment")) +
    prop("formula.status", "Status") + prop("formula.quotes", t("Zitate", "Quotes")) + "views:\n" + views;
  const cols = ["file.name", "author", "type", k("bewertung"), "formula.quotes"];
  return {
    quote: { path: Q + "/Quote List.base", content:
      `filters:\n  and:\n    - ${yamlQ(`file.inFolder(${yamlStr(Q)})`)}\n    - file.ext == "md"\nproperties:\n` +
      prop("file.name", t("Zitat", "Quote")) + prop("note.author", t("Autor", "Author")) + prop("note.source", t("Quelle", "Source")) +
      prop("note." + k("thema"), t("Thema", "Topic")) + prop("note." + k("art"), t("Art", "Kind")) + prop("note." + k("teilen"), t("Teilen", "Share")) +
      prop("note." + k("geteilt"), t("Geteilt", "Shared")) + "views:\n" +
      view("cards", t("Alle", "All"), order("file.name", "author", "source") + sortBy("file.name")) +
      view("table", t("Nach Autor", "By author"), `    groupBy:\n      property: author\n      direction: ASC\n` + order("file.name", "source", k("stelle")) + sortBy("file.name")) +
      view("table", t("Nach Thema", "By topic"), `    groupBy:\n      property: ${k("thema")}\n      direction: ASC\n` + order("file.name", "author") + sortBy("file.name")) +
      view("cards", t("Fragen", "Questions"), `    filters:\n      and:\n        - ${k("art")} == ${yamlStr(t("Frage", "Question"))}\n` + order("file.name") + sortBy("file.name")) +
      view("cards", t("Zum Teilen", "To share"), `    filters:\n      and:\n        - ${k("teilen")} == true\n` + order("file.name", "author", "source") + sortBy("file.name")) +
      view("cards", t("Noch nicht geteilt", "Not shared yet"), `    filters:\n      and:\n        - ${k("teilen")} == true\n        - not:\n            - file.hasProperty("${k("geteilt")}")\n` + order("file.name", "author") + sortBy("file.name")) +
      view("table", t("Zuletzt geteilt", "Recently shared"), `    filters:\n      and:\n        - file.hasProperty("${k("geteilt")}")\n` + order("file.name", k("geteilt"), "author") + sortBy(k("geteilt"), "DESC")) },
    reading: { path: M + "/Reading List.base", content: mediaBase(SUBS.reading || [], t("Gelesen", "Read"), t("Offen", "To read"),
      view("table", t("Leseliste", "Reading list"), `    groupBy:\n      property: formula.status\n      direction: DESC\n` + order(...cols) + sortBy("file.name")) +
      view("table", t("Gelesen", "Read"), `    filters:\n      and:\n        - formula.status == ${yamlStr(t("Gelesen", "Read"))}\n` + order(...cols) + sortBy(k("bewertung"), "DESC"))) },
    watching: { path: M + "/Watching List.base", content: mediaBase(SUBS.watching || [], t("Gesehen", "Watched"), t("Offen", "To watch"),
      view("table", t("Watchlist", "Watchlist"), `    groupBy:\n      property: formula.status\n      direction: DESC\n` + order("file.name", "type", k("bewertung"), k("plattform")) + sortBy("file.name")) +
      view("table", t("Nach Art", "By type"), `    groupBy:\n      property: type\n      direction: ASC\n` + order("file.name", k("bewertung")) + sortBy("file.name"))) },
    listening: { path: M + "/Listening List.base", content: mediaBase(SUBS.listening || [], t("Gehört", "Listened"), t("Offen", "To listen"),
      view("table", t("Hörliste", "Listening list"), `    groupBy:\n      property: formula.status\n      direction: DESC\n` + order(...cols) + sortBy("file.name"))) },
    project: { path: "30 Projects/Project List.base", content:
      'filters:\n  and:\n    - file.inFolder("30 Projects")\n    - file.ext == "md"\nproperties:\n' + prop("file.name", t("Projekt", "Project")) +
      prop("note.status", "Status") + prop("note." + k("kernaussage"), t("Kernaussage", "Summary")) + "views:\n" +
      view("table", t("Nach Status", "By status"), `    groupBy:\n      property: status\n      direction: ASC\n` + order("file.name", "status", k("kernaussage"), "start") + sortBy("file.name")) },
    writing: { path: "60 Write/Writing List.base", content:
      'filters:\n  and:\n    - file.inFolder("60 Write")\n    - file.ext == "md"\nproperties:\n' + prop("file.name", t("Titel", "Title")) +
      prop("note.status", "Status") + prop("note." + k("bezug"), t("Bezug", "About")) + prop("note." + k("teilen"), t("Teilen", "Share")) + prop("note.date", t("Datum", "Date")) + "views:\n" +
      view("table", t("Nach Status", "By status"), `    groupBy:\n      property: status\n      direction: ASC\n` + order("file.name", "status", k("bezug"), "date") + sortBy("date", "DESC")) +
      view("table", t("Zum Teilen", "To share"), `    filters:\n      and:\n        - ${k("teilen")} == true\n` + order("file.name", "status", "date") + sortBy("date", "DESC")) },
  };
}

// Notizname aus einem Zitat: wie beim Erfassen, ohne Zeichen, die Dateinamen nicht erlauben
const setupQuoteName = (q) => String(q).replace(/[\\/:*?"<>|#^[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, 120).replace(/[\s.…]+$/, "").trim();

function setupQuoteNote(lang, q, today) {
  const L = lang === "en" ? 1 : 0;
  const k = (x) => setupKey(lang, x);
  const text = L ? q.en : q.de;
  const kind = q.kind === "Frage" ? ["Frage", "Question"][L] : ["Aussage", "Statement"][L];
  const fm = ["type: quote", k("art") + ": " + kind, "author:" + (q.author[L] ? " " + yamlStr(q.author[L]) : ""),
    "source:" + (q.source[L] ? " " + yamlStr(q.source[L]) : ""), k("stelle") + ":" + (q.place[L] ? " " + yamlStr(q.place[L]) : ""), "link:"];
  fm.push(k("thema") + ":" + (q.topic[L].length ? "\n" + q.topic[L].map((x) => "  - " + yamlStr(x)).join("\n") : " []"));
  fm.push(k("übersetzung") + ":", k("teilen") + ": false", "date: " + yamlStr(today), "related: []", "tags:", "  - quotes");
  const name = setupQuoteName(text);
  if (name !== text) fm.push("quote: " + yamlStr(text));
  return { name, content: "---\n" + fm.join("\n") + "\n---\n```quote-card\n```\n\n## " + ["Was es für mich bedeutet", "What it means to me"][L] + "\n\n" };
}

function setupHome(lang, plan) {
  const de = lang !== "en";
  const roots = plan.roots;
  const tile = (title, folder, links) => `tile: ${title} | ${folder}${links ? " | " + links : ""}\n`;
  let block = "```home-dashboard\n" + (plan.name ? "name: " + plan.name.replace(/[\n|]/g, " ") + "\n" : "");
  if (roots.includes("40 Quotes")) block += "quotes: 40 Quotes\ndailyquote: yes\n";
  block += "inbox: 00 Inbox\ncapture: Quick Notes\nmedia: 50 Media\ntemplate: " + SETUP_SYSTEM.templates + "/Quote Template.md\n";
  const titles = { "10 Reflect": "Reflect", "20 Connect": "Connect", "30 Projects": "Projects", "40 Quotes": "Quotes", "50 Media": "Media", "60 Write": "Write", "80 Admin": "Admin" };
  for (const r of roots) {
    if (!titles[r]) continue;
    const links = r === "50 Media" ? "@media" : r === "40 Quotes" ? "@quotes" : r === "60 Write" ? "@write"
      : r === "30 Projects" ? "[[Project List.base|" + (de ? "Projektliste" : "Project list") + "]]" : "";
    block += tile(titles[r], r, links);
  }
  block += "```\n";
  return "---\ntype: dashboard\ncssclasses:\n  - home-dash-page\ntags:\n  - home\n---\n" + block;
}

// Plan: was angelegt würde. Rein rechnerisch, damit Vorschau und Tests dasselbe sehen wie die Ausführung.
function setupPlan(opts) {
  const lang = opts.lang === "en" ? "en" : "de";
  const chosen = SETUP_TOPICS.filter((t) => (opts.topics || []).includes(t.id));
  const folders = new Set(["00 Inbox", "99 System", SETUP_SYSTEM.templates, SETUP_SYSTEM.attachments]);
  for (const t of chosen) {
    const parts = t.folder.split("/");
    for (let i = 1; i <= parts.length; i++) folders.add(parts.slice(0, i).join("/"));
    if (t.id === "media") for (const m of SETUP_MEDIA) folders.add("50 Media/" + m);
  }
  const roots = [...new Set([...folders].map((f) => f.split("/")[0]))].sort();
  const names = ["Note"];
  for (const t of chosen) for (const n of t.tpl) if (!names.includes(n)) names.push(n);
  const files = [];
  for (const n of names) files.push({ path: `${SETUP_SYSTEM.templates}/${n} Template.md`, content: setupTemplate(lang, n), kind: "template" });
  const bases = setupBases(lang);
  for (const t of chosen) for (const l of t.lists || []) files.push({ path: bases[l].path, content: bases[l].content, kind: "list" });
  const today = opts.today || isoDate();
  if (chosen.some((t) => t.id === "quotes")) {
    for (const q of START_QUOTES) {
      const n = setupQuoteNote(lang, q, today);
      files.push({ path: "40 Quotes/" + n.name + ".md", content: n.content, kind: "quote", basename: n.name });
    }
  }
  const plan = { lang, topics: chosen.map((t) => t.id), name: noControl(opts.name, " ").replace(/[`|]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40), theme: THEMES[opts.theme] ? opts.theme : "sand", folders: [...folders].sort(), roots, templates: names };
  files.push({ path: "Home.md", content: setupHome(lang, plan), kind: "home" });
  files.push({ path: "00 Inbox/Quick Notes.md", content: setupTemplate(lang, "Note").replace("<% tp.date.now(\"YYYY-MM-DD\") %>", today), kind: "note" });
  plan.files = files;
  plan.folderTemplates = Object.entries(SETUP_FOLDER_TEMPLATES).filter(([f, n]) => folders.has(f) && names.includes(n))
    .map(([folder, n]) => ({ folder, template: `${SETUP_SYSTEM.templates}/${n} Template.md` }));
  return plan;
}

// Ausführen: nur Fehlendes anlegen. Zitate auch dann überspringen, wenn es eine Notiz gleichen Namens irgendwo gibt.
async function runSetup(app, plugin, plan) {
  const vault = app.vault;
  const result = { created: [], skipped: [] };
  for (const f of plan.folders) {
    if (vault.getAbstractFileByPath(f)) continue;
    await vault.createFolder(f);
    result.created.push(f + "/");
  }
  const names = new Set(vault.getMarkdownFiles().map((f) => f.basename.toLowerCase()));
  for (const file of plan.files) {
    if (vault.getAbstractFileByPath(file.path) || (file.kind === "quote" && names.has(file.basename.toLowerCase()))) { result.skipped.push(file.path); continue; }
    await vault.create(file.path, file.content);
    result.created.push(file.path);
  }
  // Einstellungen von Compass auf die neue Struktur stellen; vorhandene Zuordnungen bleiben
  const s = plugin.settings, n = s.notes;
  s.lang = plan.lang;
  s.noteLang = plan.lang;
  s.quotesFolder = "40 Quotes";
  s.mediaFolder = "50 Media";
  s.quoteTemplate = SETUP_SYSTEM.templates + "/Quote Template.md";
  s.shareFolder = SETUP_SYSTEM.attachments + "/Shared";
  n.templateFolder = SETUP_SYSTEM.templates;
  n.defaultTheme = plan.theme;
  n.templateThemes = Object.assign({}, SETUP_TEMPLATE_THEMES, n.templateThemes || {});
  s.setupDone = true;
  s.setupTemplater = plan.folderTemplates;
  await plugin.saveSettings();
  // Obsidian: Anhänge in 99 System/Attachments, falls noch nichts eingestellt ist; Bases einschalten
  try {
    if (typeof vault.getConfig === "function" && ["", "/", "./"].includes(vault.getConfig("attachmentFolderPath") || "")) vault.setConfig("attachmentFolderPath", SETUP_SYSTEM.attachments);
  } catch (e) { /* nur Komfort */ }
  try {
    const bases = app.internalPlugins && app.internalPlugins.getPluginById && app.internalPlugins.getPluginById("bases");
    if (bases && !bases.enabled) await bases.enable(true);
  } catch (e) { /* nur Komfort */ }
  await applyTemplaterSetup(app, plugin);
  return result;
}

// Werte, auf die sich ältere Installationen stillschweigend verlassen haben (frühere Standards).
// Neu installiert gelten die englischen, neutralen Standards aus DEFAULTS.
const LEGACY_DEFAULTS = { noteLang: "de", mediaFolder: "50 Read · Watch · Listen", quoteTemplate: "99 System/_Template/Quote Template.md", shareFolder: "99 System/_assets/Quotes" };

// Erster Start nach einem Update: frühere Standards festhalten, damit sich in vorhandenen Notizen nichts verschiebt.
// Wer Compass schon vor der Einrichtung (2.6.0) benutzt hat, bekommt sie nie von selbst.
function firstRunSettings(stored) {
  if (!stored) return {};
  const out = {};
  for (const [k, v] of Object.entries(LEGACY_DEFAULTS)) if (stored[k] === undefined) out[k] = v;
  // Wer die Oberfläche schon auf Englisch hatte, hat auch englische Eigenschaften bekommen
  if (stored.noteLang === undefined && stored.lang === "en") out.noteLang = "en";
  if (stored.setupDone === undefined) out.setupDone = true;
  return out;
}

// Von selbst öffnet sich nur etwas, wenn die Einrichtung nie lief oder übersprungen wurde:
// im (fast) leeren Vault die Einsteiger-Einrichtung, sonst einmal die Auswahl „In meinen Vault einbauen“ oder „Neu anfangen“.
const autoSetupMode = (settings, noteCount) => (settings.setupDone ? null : noteCount <= 3 ? "setup" : "welcome");

// Ordner-Vorlagen an Templater übergeben, sobald es installiert ist. Den Schalter „bei neuer Datei auslösen“
// speichert Templater pro Gerät; den setzt die Person selbst.
// opts.templates: Vorlagenordner, falls Templater noch keinen hat; opts.ignore: Ordner, in dem Templater nichts auslösen soll
async function applyTemplaterSetup(app, plugin, opts = {}) {
  const list = plugin.settings.setupTemplater;
  const ignore = opts.ignore === undefined ? "99 System" : opts.ignore;
  const tp = app.plugins && app.plugins.plugins && app.plugins.plugins["templater-obsidian"];
  if (!list || !list.length || !tp || !tp.settings) return false;
  const st = tp.settings;
  st.templates_folder = st.templates_folder || opts.templates || SETUP_SYSTEM.templates;
  // Den Modus nur setzen, wenn noch keiner gewählt ist oder keine Regeln nach Dateinamen bestehen. Vorhandene Einrichtungen bleiben.
  const fileRules = Array.isArray(st.file_templates) && st.file_templates.some((x) => x && x.regex);
  if (!st.trigger_on_file_creation_mode || (st.trigger_on_file_creation_mode !== "folder" && !fileRules)) st.trigger_on_file_creation_mode = "folder";
  st.folder_templates = Array.isArray(st.folder_templates) ? st.folder_templates : [];
  for (const ft of list) if (!st.folder_templates.some((x) => x.folder === ft.folder)) st.folder_templates.push(ft);
  st.ignore_folders_on_creation = Array.isArray(st.ignore_folders_on_creation) ? st.ignore_folders_on_creation : [];
  if (ignore && !st.ignore_folders_on_creation.some((x) => x && x.folder === ignore)) st.ignore_folders_on_creation.push({ folder: ignore });
  if (typeof tp.save_settings === "function") await tp.save_settings(); else await tp.saveData(st);
  plugin.settings.setupTemplater = null;
  await plugin.saveSettings();
  return true;
}

const openPluginPage = (id) => window.open("obsidian://show-plugin?id=" + encodeURIComponent(id));

// Texte des Fensters
const SETUP_TEXT = {
  de: {
    kicker: "Compass · Einrichtung", step: (i, n) => `Schritt ${i} von ${n}`,
    welcome: "Willkommen", welcomeLead: "In zwei Minuten bekommst du ein fertiges Notizsystem: Ordner, Vorlagen, Listen und eine Startseite.",
    welcomeP1: "Obsidian speichert alles als einfache Textdateien in einem Ordner auf deinem Gerät. Nichts ist in einer fremden Cloud eingesperrt, und nichts geht verloren.",
    welcomeP2: "Du entscheidest, was hineinkommt. Bevor etwas angelegt wird, siehst du eine Vorschau. Vorhandene Dateien werden nie überschrieben.",
    nonEmpty: (n) => `Hinweis: In diesem Vault liegen schon ${n} Notizen. Die Einrichtung legt nur an, was noch fehlt.`,
    alreadyUsing: "Du nutzt Obsidian schon? Compass in deine Ordner einbauen",
    name: "Wie sollen wir dich auf der Startseite begrüßen?", namePh: "Vorname (optional)", language: "Sprache",
    start: "Los geht’s", later: "Später einrichten", laterHint: "Die Einrichtung startest du jederzeit über die Befehlspalette: „Einrichtung starten“.", back: "Zurück", next: "Weiter", nextBasic: "Weiter mit Grundsystem", create: "Erstellen", close: "Schließen",
    topics: "Worüber willst du Notizen machen?", topicsP: "Wähle alles, was passt. Du kannst später jederzeit Ordner ergänzen.",
    basic: "Weiß ich noch nicht", basicP: "nimm das Grundsystem. Es passt für die meisten und lässt sich jederzeit anpassen.",
    from: "Kommst du von einer anderen App?", fromNo: "Nein, ich fange neu an", fromOther: "andere",
    look: "Wie soll es aussehen?", lookP: "Jede Notiz bekommt oben einen farbigen Kopf mit Titel und Kernaussage. Wähle die Grundfarbe. Pro Vorlage lässt sie sich später einzeln ändern.",
    sampleArea: "Reflect · Journal", sampleTitle: "Erster Frühling in der neuen Stadt", sampleLead: "Was ich in den ersten Wochen gelernt habe.",
    templates: "Deine Vorlagen", templatesP: "Jeder Ordner bekommt eine passende Vorlage. Legst du dort eine neue Notiz an, ist sie sofort fertig aufgebaut: farbiger Kopf, die richtigen Eigenschaften, Abschnitte zum Ausfüllen und unten ein Footer mit Verweisen.",
    props: "Eigenschaften", sections: "Abschnitte", newTag: "neu",
    plugins: "Plugins, die das System vervollständigen", pluginsP: "Diese Erweiterungen von anderen Entwicklern machen Compass rund. Nach der Einrichtung öffnet ein Knopf pro Plugin seine offizielle Seite in Obsidian. Dort tippst du auf „Installieren“. So läuft alles über Obsidians eigene Prüfung.",
    flow: ["Neue Notiz im Ordner", "Templater setzt die Vorlage", "Eigenschaften füllen die Listen", "Startseite zeigt alles"], downloads: "Downloads",
    preview: "So wird dein Vault aussehen", folders: "Ordner", willCreate: "Was angelegt wird", nTemplates: "Vorlagen", nLists: "Listen", nQuotes: "Startzitate", nPlugins: "Plugins zum Installieren",
    quotesNote: "Die 100 Startzitate: allgemeine Coaching-Fragen und Sprichwörter sowie Zitate gemeinfreier Autoren wie Mark Aurel, Seneca, Epiktet, Goethe und Rilke, jeweils mit Quelle.",
    safeNote: "Vorhandene Ordner und Dateien bleiben unverändert. Fehlt etwas, kannst du die Einrichtung später erneut starten.",
    working: "Wird angelegt …", done: "Fertig", doneP: (c, s) => `${c} Ordner und Dateien angelegt` + (s ? `, ${s} übersprungen, weil es sie schon gab.` : "."),
    nextSteps: "Nächste Schritte", install: (n) => `${n} installieren`, open: "Öffnen",
    templaterHint: "Nach der Installation von Templater: Einstellungen → Templater → „Trigger Templater on new file creation“ einschalten. Das gilt pro Gerät.",
    openHome: "Startseite öffnen", openHowTo: "How To in den Einstellungen", error: "Die Einrichtung ist nicht vollständig durchgelaufen. Bereits Angelegtes bleibt erhalten.",
  },
  en: {
    kicker: "Compass · Setup", step: (i, n) => `Step ${i} of ${n}`,
    welcome: "Welcome", welcomeLead: "In two minutes you get a complete note system: folders, templates, lists and a home page.",
    welcomeP1: "Obsidian stores everything as plain text files in a folder on your device. Nothing is locked into someone else's cloud, and nothing gets lost.",
    welcomeP2: "You decide what goes in. You see a preview before anything is created. Existing files are never overwritten.",
    nonEmpty: (n) => `Note: this vault already contains ${n} notes. Setup only creates what is missing.`,
    alreadyUsing: "Already using Obsidian? Add Compass to your own folders",
    name: "How should the home page greet you?", namePh: "First name (optional)", language: "Language",
    start: "Let’s go", later: "Set up later", laterHint: "You can start setup any time from the command palette: “Start setup”.", back: "Back", next: "Next", nextBasic: "Continue with the basic system", create: "Create", close: "Close",
    topics: "What do you want to take notes about?", topicsP: "Pick everything that fits. You can add folders at any time.",
    basic: "I don’t know yet", basicP: "use the basic system. It suits most people and can be changed at any time.",
    from: "Are you coming from another app?", fromNo: "No, I’m starting fresh", fromOther: "other",
    look: "How should it look?", lookP: "Every note gets a coloured header with its title and summary. Pick the base colour. You can change it per template later.",
    sampleArea: "Reflect · Journal", sampleTitle: "First spring in the new city", sampleLead: "What I learned in the first weeks.",
    templates: "Your templates", templatesP: "Every folder gets a matching template. Create a new note there and it is ready right away: coloured header, the right properties, sections to fill in and a footer with links at the bottom.",
    props: "Properties", sections: "Sections", newTag: "new",
    plugins: "Plugins that complete the system", pluginsP: "These extensions by other developers round off Compass. After setup, one button per plugin opens its official page in Obsidian. Tap “Install” there. That way everything goes through Obsidian’s own review.",
    flow: ["New note in a folder", "Templater applies the template", "Properties feed the lists", "Home page shows it all"], downloads: "downloads",
    preview: "This is what your vault will look like", folders: "Folders", willCreate: "What will be created", nTemplates: "Templates", nLists: "Lists", nQuotes: "Starter quotes", nPlugins: "Plugins to install",
    quotesNote: "The 100 starter quotes: general coaching questions and proverbs plus quotes by public-domain authors such as Marcus Aurelius, Seneca, Epictetus, Goethe and Rilke, each with its source.",
    safeNote: "Existing folders and files stay as they are. If something is missing, you can run setup again later.",
    working: "Creating …", done: "Done", doneP: (c, s) => `Created ${c} folders and files` + (s ? `, skipped ${s} that already existed.` : "."),
    nextSteps: "Next steps", install: (n) => `Install ${n}`, open: "Open",
    templaterHint: "After installing Templater: Settings → Templater → turn on “Trigger Templater on new file creation”. This applies per device.",
    openHome: "Open home page", openHowTo: "How To in the settings", error: "Setup did not finish completely. Everything created so far is kept.",
  },
};

class SetupModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.state = { step: 0, lang: plugin.settings.lang === "de" ? "de" : "en", topics: new Set(), basic: false, from: "no",
      theme: plugin.settings.notes.defaultTheme || "sand", tpl: "Journal", name: "", plugins: new Set(SETUP_PLUGINS.filter((p) => p.core).map((p) => p.id)), result: null };
  }

  get T() { return SETUP_TEXT[this.state.lang]; }

  onOpen() {
    this.modalEl.addClass("cmp-setup-modal");
    this.render();
  }

  onClose() { this.contentEl.empty(); }

  plan() {
    return setupPlan({ lang: this.state.lang, topics: [...this.state.topics], theme: this.state.theme, name: this.state.name });
  }

  plugins() { return SETUP_PLUGINS.filter((p) => !p.importer || this.state.from !== "no"); }

  chosenPlugins() { return this.plugins().filter((p) => this.state.plugins.has(p.id) || (p.importer && this.state.from !== "no")); }

  go(step) {
    if (this.state.step === 1 && step === 2 && !this.state.topics.size) {
      this.state.topics = new Set(SETUP_TOPICS.filter((t) => t.basic).map((t) => t.id));
      this.state.basic = true;
    }
    this.state.step = step;
    this.render();
  }

  render() {
    const el = this.contentEl;
    const T = this.T, S = this.state, L = S.lang === "en" ? 1 : 0;
    el.empty();
    const bar = el.createDiv({ cls: "cmp-steps", attr: { "aria-hidden": "true" } });
    for (let i = 0; i < 7; i++) bar.createEl("i", { cls: i <= S.step ? "is-done" : "" });
    const body = el.createDiv({ cls: "cmp-body" });
    const foot = el.createDiv({ cls: "cmp-foot" });
    const button = (parent, text, cls, onClick) => { const b = parent.createEl("button", { text, cls }); b.addEventListener("click", onClick); return b; };
    const kicker = (text) => body.createEl("p", { cls: "cmp-kicker", text });
    const h1 = (text) => body.createEl("h2", { cls: "cmp-title", text });
    const left = foot.createDiv();

    if (S.step === 0) {
      kicker(T.kicker);
      h1(T.welcome);
      body.createEl("p", { cls: "cmp-lead", text: T.welcomeLead });
      body.createEl("p", { text: T.welcomeP1 });
      body.createEl("p", { text: T.welcomeP2 });
      const count = this.app.vault.getMarkdownFiles().length;
      if (count > 3) body.createEl("p", { cls: "cmp-note", text: T.nonEmpty(count) });
      // Wer Obsidian schon nutzt, baut Compass lieber in die eigenen Ordner ein
      const own = body.createEl("button", { cls: "cmp-btn mod-link cmp-own", text: T.alreadyUsing });
      own.addEventListener("click", () => { this.close(); const m = new AddModal(this.app, this.plugin); m.state.lang = S.lang; m.open(); });
      const langRow = body.createDiv({ cls: "cmp-row" });
      langRow.createSpan({ cls: "cmp-label", text: T.language });
      const chips = langRow.createDiv({ cls: "cmp-chips", attr: { role: "group", "aria-label": T.language } });
      for (const [code, label] of [["de", "Deutsch"], ["en", "English"]]) {
        const c = button(chips, label, "cmp-chip", () => { S.lang = code; this.render(); });
        c.setAttr("aria-pressed", String(S.lang === code));
      }
      const nameRow = body.createDiv({ cls: "cmp-row" });
      nameRow.createEl("label", { cls: "cmp-label", text: T.name, attr: { for: "cmp-name" } });
      const input = nameRow.createEl("input", { type: "text", cls: "cmp-input", attr: { id: "cmp-name", placeholder: T.namePh, maxlength: "40" } });
      input.value = S.name;
      input.addEventListener("input", () => { S.name = input.value; });
      // „Später“ heißt: nicht mehr von selbst öffnen. Starten geht weiter über den Befehl oder die Einstellungen.
      button(left, T.later, "cmp-btn mod-link", async () => {
        this.plugin.settings.setupDone = true;
        await this.plugin.saveSettings();
        new Notice(T.laterHint, 8000);
        this.close();
      });
      button(foot, T.start, "cmp-btn mod-cta", () => this.go(1));
      return;
    }

    if (S.step === 1) {
      kicker(T.step(1, 5));
      h1(T.topics);
      body.createEl("p", { text: T.topicsP });
      const cards = body.createDiv({ cls: "cmp-cards" });
      for (const t of SETUP_TOPICS) {
        const c = cards.createEl("button", { cls: "cmp-card", attr: { "aria-pressed": String(S.topics.has(t.id)) } });
        c.createSpan({ cls: "cmp-ico", text: t.ico, attr: { "aria-hidden": "true" } });
        c.createEl("b", { text: t.name[L] });
        c.createEl("small", { text: t.folder });
        c.addEventListener("click", () => { S.topics.has(t.id) ? S.topics.delete(t.id) : S.topics.add(t.id); S.basic = false; this.render(); });
      }
      const basic = body.createEl("button", { cls: "cmp-basic", attr: { "aria-pressed": String(S.basic) } });
      basic.createEl("b", { text: T.basic });
      basic.appendText(" – " + T.basicP);
      basic.addEventListener("click", () => { S.basic = !S.basic; S.topics = new Set(S.basic ? SETUP_TOPICS.filter((t) => t.basic).map((t) => t.id) : []); this.render(); });
      body.createEl("h3", { cls: "cmp-sub", text: T.from });
      const chips = body.createDiv({ cls: "cmp-chips" });
      for (const [code, label] of [["no", T.fromNo], ["Notion", "Notion"], ["Evernote", "Evernote"], ["Apple", S.lang === "en" ? "Apple Notes" : "Apple Notizen"], ["other", T.fromOther]]) {
        const c = button(chips, label, "cmp-chip", () => { S.from = code; this.render(); });
        c.setAttr("aria-pressed", String(S.from === code));
      }
      button(left, T.back, "cmp-btn", () => this.go(0));
      button(foot, S.topics.size ? T.next : T.nextBasic, "cmp-btn mod-cta", () => this.go(2));
      return;
    }

    if (S.step === 2) {
      kicker(T.step(2, 5));
      h1(T.look);
      body.createEl("p", { text: T.lookP });
      const sw = body.createDiv({ cls: "cmp-swatches", attr: { role: "group" } });
      for (const k of Object.keys(THEMES)) {
        const name = NOTE_TEXT[S.lang === "en" ? "en" : "de"].themes[k];
        const b = sw.createEl("button", { cls: "cmp-swatch is-" + k, attr: { "aria-label": name, title: name, "aria-pressed": String(S.theme === k) } });
        b.addEventListener("click", () => { S.theme = k; this.render(); });
      }
      const head = body.createDiv({ cls: "note-header is-" + S.theme });
      const row = head.createDiv({ cls: "note-header-row" });
      row.createSpan({ cls: "note-header-label", text: T.sampleArea });
      head.createEl("h1", { cls: "note-header-title", text: T.sampleTitle });
      head.createEl("p", { cls: "note-header-lead", text: T.sampleLead });
      button(left, T.back, "cmp-btn", () => this.go(1));
      button(foot, T.next, "cmp-btn mod-cta", () => this.go(3));
      return;
    }

    if (S.step === 3) {
      const plan = this.plan();
      if (!plan.templates.includes(S.tpl)) S.tpl = plan.templates[0];
      kicker(T.step(3, 5));
      h1(T.templates);
      body.createEl("p", { text: T.templatesP });
      const wrap = body.createDiv({ cls: "cmp-tplwrap" });
      const list = wrap.createDiv({ cls: "cmp-tpllist", attr: { role: "tablist" } });
      const isNew = (n) => ["Project", "Movie", "Podcast", "Article"].includes(n);
      for (const n of plan.templates) {
        const b = list.createEl("button", { cls: "cmp-tplbtn", attr: { role: "tab", "aria-selected": String(n === S.tpl) } });
        b.createEl("b", { text: n });
        if (isNew(n)) b.createSpan({ cls: "cmp-new", text: T.newTag });
        b.createEl("small", { text: Object.entries(SETUP_FOLDER_TEMPLATES).filter(([f, t]) => t === n && plan.folders.includes(f)).map(([f]) => f).join(", ") });
        b.addEventListener("click", () => { S.tpl = n; this.render(); });
      }
      const view = wrap.createDiv({ cls: "cmp-tplview", attr: { role: "tabpanel" } });
      const spec = SETUP_TEMPLATES[S.tpl];
      if (spec.quote) {
        const q = START_QUOTES.find((x) => x.author[0] === "Epiktet") || START_QUOTES[0];
        buildCard(view.createDiv(), { author: q.author[L], source: q.source[L], quote: S.lang === "en" ? q.en : q.de }, "blau");
      } else {
        const theme = SETUP_TEMPLATE_THEMES[S.tpl] || S.theme;
        const head = view.createDiv({ cls: "note-header is-" + theme });
        const row = head.createDiv({ cls: "note-header-row" });
        row.createSpan({ cls: "note-header-label", text: (Object.entries(SETUP_FOLDER_TEMPLATES).find(([, t]) => t === S.tpl) || ["00 Inbox"])[0].replace(/^\d+ /, "").replace("/", " · ") });
        head.createEl("h1", { cls: "note-header-title", text: S.tpl });
      }
      const sec = (label, items, cls) => { const d = view.createDiv({ cls: "cmp-tplsec" }); d.createEl("p", { cls: "cmp-kicker", text: label }); const box = d.createDiv({ cls }); items.forEach((i) => box.createSpan({ text: i })); };
      sec(T.props, spec.props.map(([k]) => setupKey(S.lang, k)), "cmp-tags");
      sec(T.sections, spec.sections.map((s) => s[L]), "cmp-secs");
      button(left, T.back, "cmp-btn", () => this.go(2));
      button(foot, T.next, "cmp-btn mod-cta", () => this.go(4));
      return;
    }

    if (S.step === 4) {
      kicker(T.step(4, 5));
      h1(T.plugins);
      body.createEl("p", { text: T.pluginsP });
      const flow = body.createDiv({ cls: "cmp-flow" });
      T.flow.forEach((f, i) => { if (i) flow.createEl("em", { text: "→" }); flow.createSpan({ text: f }); });
      for (const p of this.plugins()) {
        const row = body.createEl("label", { cls: "cmp-plugin" });
        const box = row.createEl("input", { type: "checkbox" });
        box.checked = this.state.plugins.has(p.id) || (p.importer && S.from !== "no");
        box.addEventListener("change", () => { box.checked ? S.plugins.add(p.id) : S.plugins.delete(p.id); });
        const head = row.createSpan();
        head.createSpan({ cls: "cmp-pname", text: p.name });
        head.createSpan({ cls: "cmp-dl", text: p.dl + " " + T.downloads });
        row.createSpan({ cls: "cmp-why", text: p.why[L] });
        if (p.with[L]) row.createSpan({ cls: "cmp-with", text: p.with[L] });
      }
      button(left, T.back, "cmp-btn", () => this.go(3));
      button(foot, T.next, "cmp-btn mod-cta", () => this.go(5));
      return;
    }

    if (S.step === 5) {
      const plan = this.plan();
      kicker(T.step(5, 5));
      h1(T.preview);
      const grid = body.createDiv({ cls: "cmp-grid2" });
      const a = grid.createDiv();
      a.createEl("h3", { cls: "cmp-sub", text: T.folders });
      const tree = a.createEl("pre", { cls: "cmp-tree" });
      const roots = plan.roots;
      const lines = [];
      for (const r of roots) {
        lines.push([r + (SETUP_ROOT_INFO[r] ? "  " + SETUP_ROOT_INFO[r][L] : ""), true]);
        const subs = plan.folders.filter((f) => f.startsWith(r + "/"));
        subs.forEach((s, i) => lines.push([(i === subs.length - 1 ? "└─ " : "├─ ") + s.slice(r.length + 1), false]));
      }
      lines.push(["Home", true]);
      for (const [text, strong] of lines) tree.createDiv({ cls: strong ? "is-root" : "", text });
      const b = grid.createDiv();
      b.createEl("h3", { cls: "cmp-sub", text: T.willCreate });
      const facts = b.createEl("ul", { cls: "cmp-facts" });
      const fact = (label, n) => { const li = facts.createEl("li"); li.createSpan({ text: label }); li.createEl("b", { text: String(n) }); };
      fact(T.folders, plan.folders.length);
      fact(T.nTemplates, plan.templates.length);
      fact(T.nLists, plan.files.filter((f) => f.kind === "list").length);
      fact(T.nQuotes, plan.files.filter((f) => f.kind === "quote").length);
      fact(T.nPlugins, this.chosenPlugins().length);
      const tags = b.createDiv({ cls: "cmp-tags" });
      plan.templates.forEach((n) => tags.createSpan({ text: n }));
      if (plan.topics.includes("quotes")) b.createEl("p", { cls: "cmp-note", text: T.quotesNote });
      b.createEl("p", { cls: "cmp-note", text: T.safeNote });
      button(left, T.back, "cmp-btn", () => this.go(4));
      const create = button(foot, T.create, "cmp-btn mod-cta", async () => {
        create.disabled = true;
        create.setText(T.working);
        try { S.result = await runSetup(this.app, this.plugin, plan); }
        catch (e) { new Notice(T.error); S.result = { created: [], skipped: [], error: true }; }
        this.go(6);
      });
      return;
    }

    // Fertig
    kicker(T.kicker);
    h1(T.done);
    const r = S.result || { created: [], skipped: [] };
    body.createEl("p", { cls: "cmp-lead", text: r.error ? T.error : T.doneP(r.created.length, r.skipped.length) });
    body.createEl("h3", { cls: "cmp-sub", text: T.nextSteps });
    const todo = body.createEl("ul", { cls: "cmp-todo" });
    for (const p of this.chosenPlugins()) {
      const li = todo.createEl("li");
      li.createSpan({ text: T.install(p.name) });
      button(li, T.open, "cmp-btn", () => openPluginPage(p.id));
    }
    if (this.chosenPlugins().some((p) => p.id === "templater-obsidian")) body.createEl("p", { cls: "cmp-note", text: T.templaterHint });
    button(left, T.openHowTo, "cmp-btn mod-link", () => { this.close(); const s = this.app.setting; if (s) { s.open(); s.openTabById(this.plugin.manifest.id); } });
    button(foot, T.openHome, "cmp-btn mod-cta", async () => { this.close(); await this.app.workspace.openLinkText("Home", "", false); });
  }
}

