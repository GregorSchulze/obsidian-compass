// ---------- In einen vorhandenen Vault einbauen ----------
// Für Menschen, die Obsidian schon nutzen: Compass nutzt ihre Ordner und ergänzt nur, was sie auswählen.
// Nichts wird verschoben, umbenannt oder überschrieben. Vorschau und Ausführung rechnen mit demselben Plan (addPlan).

// Ordner, die nicht als Kachel vorgewählt werden (Archiv, Tagesnotizen, Vorlagen, Anhänge)
const ADD_NO_TILE = /archiv|daily|tägliche|template|vorlage|attachment|anhänge|assets|^_/i;
// Ordner, die gar nicht als Kachel angeboten werden
const ADD_NO_TILE_AT_ALL = /^(templates?|vorlagen|attachments?|anhänge|assets)$/i;

const cleanPath = (p) => {
  const s = noControl(p).replace(/^\/+|\/+$/g, "").trim();
  if (!s) return "";
  return typeof normalizePath === "function" ? normalizePath(s) : s;
};
// Titel einer Kachel aus dem Ordnernamen, ohne Nummer davor: „01 Projects“ → „Projects“
const tileTitle = (path) => { const n = path.split("/").pop(); return n.replace(/^\d+[\s._-]*/, "") || n; };

// Vault lesen: Ordner mit Notizzahl, Vorlagenordner, Templater-Regeln, Startseite, Bases. Ändert nichts.
function scanVault(app) {
  const vault = app.vault;
  const files = vault.getMarkdownFiles();
  const counts = {};
  for (const f of files) {
    const parts = f.path.split("/");
    parts.pop();
    for (let i = 1; i <= parts.length; i++) { const p = parts.slice(0, i).join("/"); counts[p] = (counts[p] || 0) + 1; }
  }
  const all = typeof vault.getAllFolders === "function" ? vault.getAllFolders(false) : vault.getAllLoadedFiles().filter((f) => f && Array.isArray(f.children));
  const folders = all.map((f) => f.path).filter((p) => p && p !== "/")
    .map((p) => ({ path: p, name: p.split("/").pop(), depth: p.split("/").length, count: counts[p] || 0 }))
    .sort((a, b) => a.path.localeCompare(b.path));
  const plugins = (app.plugins && app.plugins.plugins) || {};
  const tp = plugins["templater-obsidian"];
  const tpSettings = tp && tp.settings ? tp.settings : null;
  let templates = "", templatesFrom = "";
  if (tpSettings && tpSettings.templates_folder) { templates = cleanPath(tpSettings.templates_folder); templatesFrom = "templater"; }
  if (!templates) {
    try {
      const core = app.internalPlugins && app.internalPlugins.getPluginById && app.internalPlugins.getPluginById("templates");
      const folder = core && core.enabled && core.instance && core.instance.options && core.instance.options.folder;
      if (folder) { templates = cleanPath(folder); templatesFrom = "core"; }
    } catch (e) { /* nur Komfort */ }
  }
  const templateNames = templates ? files.filter((f) => f.path.startsWith(templates + "/")).map((f) => f.basename) : [];
  // Startseite: aus dem Plugin „Homepage“ oder eine Notiz „Home“ im Hauptordner
  let home = null;
  try {
    const hs = plugins.homepage && plugins.homepage.settings;
    const first = hs && hs.homepages && Object.values(hs.homepages)[0];
    const value = (first && first.value) || (hs && hs.defaultNote);
    if (value) home = { name: String(value).replace(/\.md$/i, ""), via: "Homepage" };
  } catch (e) { home = null; }
  if (!home && vault.getAbstractFileByPath("Home.md")) home = { name: "Home", via: "" };
  let bases = false;
  try { const b = app.internalPlugins && app.internalPlugins.getPluginById && app.internalPlugins.getPluginById("bases"); bases = !!(b && b.enabled); } catch (e) { bases = false; }
  return {
    noteCount: files.length, folders, templates, templatesFrom, templateNames, home, bases,
    templater: tpSettings ? { rules: (Array.isArray(tpSettings.folder_templates) ? tpSettings.folder_templates : []).filter((x) => x && x.folder).map((x) => ({ folder: cleanPath(x.folder), template: String(x.template || "") })) } : null,
  };
}

// Vorschläge aus den Ordnernamen: flache und volle Ordner zuerst
function suggestFolders(info) {
  const by = (re) => info.folders.filter((f) => re.test(f.name)).sort((a, b) => a.depth - b.depth || b.count - a.count)[0];
  const quotes = by(/^(quotes?|zitate?|citations?)$/i) || by(/quote|zitat/i);
  const media = by(/^(media|medien|library|bibliothek)$/i) || by(/read.*watch|lesen.*sehen/i) || by(/^(books?|bücher|reading|lesen)$/i);
  const inbox = by(/inbox|eingang/i);
  return { quotes: quotes ? quotes.path : "", media: media ? media.path : "", inbox: inbox ? inbox.path : "" };
}

// Bekannte Unterordner eines Medienordners → Art der Vorlage und Liste (Namen wie auf der Startseite, MEDIA_SUBS)
function mediaSubsOf(info, media) {
  const out = [];
  for (const f of info.folders) {
    if (f.depth !== media.split("/").length + 1 || !f.path.startsWith(media + "/")) continue;
    for (const [list, names] of [["reading", MEDIA_SUBS.reading], ["watching", MEDIA_SUBS.watching], ["listening", MEDIA_SUBS.listening]]) {
      if (!names.some((n) => n.toLowerCase() === f.name.toLowerCase())) continue;
      const kind = list === "watching" ? "Movie" : list === "listening" ? "Podcast" : /artik|artic/i.test(f.name) ? "Article" : "Book";
      out.push({ name: f.name, path: f.path, count: f.count, kind, list });
    }
  }
  return out;
}

// Ordner, die als Kachel infrage kommen: Hauptordner und die Ordner der gewählten Bausteine (auch neue)
function tileCandidates(info, extra) {
  const top = info.folders.filter((f) => f.depth === 1 && !ADD_NO_TILE_AT_ALL.test(f.name));
  for (const p of extra || []) {
    if (!p || top.some((f) => f.path === p)) continue;
    top.push(info.folders.find((x) => x.path === p) || { path: p, name: p.split("/").pop(), depth: p.split("/").length, count: 0 });
  }
  return top.filter((f) => !/[|\n]/.test(f.path)).sort((a, b) => b.count - a.count);
}
// Vorgewählt: die Ordner der Bausteine, dann die größten, ohne Archiv, Tagesnotizen und Vorlagen, höchstens sechs
const defaultTiles = (cands, must) => [...new Set([...(must || []).filter((p) => cands.some((c) => c.path === p)),
  ...cands.filter((f) => !ADD_NO_TILE.test(f.name)).map((f) => f.path)])].slice(0, 6);

// Plan: was angelegt würde. Rein rechnerisch, damit Vorschau, Tests und Ausführung dasselbe sehen.
// choice: { lang, modules: ["quotes","home","headers","media"], quoteFolder, starter, mediaFolder, rules, bases, name, tiles, homeMode }
// Ordner, die neu angelegt werden sollen, beginnen mit „+“.
function addPlan(info, choice, today) {
  const lang = choice.lang === "de" ? "de" : "en";
  const de = lang === "de";
  const mods = new Set(choice.modules || []);
  const isNew = (v) => String(v || "").startsWith("+");
  const pathOf = (v) => cleanPath(String(v || "").replace(/^\+/, ""));
  const folders = [], files = [], rules = [], templates = [], keep = [];
  const tplFolder = info.templates || (de ? "Vorlagen" : "Templates");
  const tplPath = (n) => `${tplFolder}/${n} Template.md`;
  const hasTpl = (n) => info.templateNames.includes(n + " Template");
  const addTpl = (n) => { if (!templates.includes(n)) templates.push(n); };
  const listsOn = info.bases || !!choice.bases;
  const bases = {};
  const quotesDir = mods.has("quotes") ? pathOf(choice.quoteFolder) : "";
  const mediaDir = mods.has("media") ? pathOf(choice.mediaFolder) : "";
  let subs = [];

  if (quotesDir) {
    if (isNew(choice.quoteFolder)) folders.push(quotesDir);
    addTpl("Quote");
    rules.push({ folder: quotesDir, template: tplPath("Quote") });
    if (choice.starter) {
      for (const q of START_QUOTES) {
        const n = setupQuoteNote(lang, q, today || isoDate());
        files.push({ path: quotesDir + "/" + n.name + ".md", content: n.content, kind: "quote", basename: n.name });
      }
    }
  }
  if (mediaDir) {
    if (isNew(choice.mediaFolder)) {
      folders.push(mediaDir);
      for (const m of SETUP_MEDIA) folders.push(mediaDir + "/" + m);
      subs = [["Books", "Book", "reading"], ["Movies & Series", "Movie", "watching"], ["Podcasts & Audiobooks", "Podcast", "listening"], ["Articles", "Article", "reading"]]
        .map(([name, kind, list]) => ({ name, path: mediaDir + "/" + name, kind, list }));
    } else subs = mediaSubsOf(info, mediaDir);
    if (subs.length) for (const s of subs) { addTpl(s.kind); rules.push({ folder: s.path, template: tplPath(s.kind) }); }
    else { addTpl("Book"); rules.push({ folder: mediaDir, template: tplPath("Book") }); }
  }
  if (mods.has("headers")) addTpl("Note");

  // Vorlagen: vorhandene gleichen Namens bleiben und werden weiter benutzt
  if (templates.length && !info.templates) folders.unshift(tplFolder);
  const dateTag = info.templater ? DATE_TAG : '"{{date:YYYY-MM-DD}}"';
  for (const n of templates) {
    if (hasTpl(n)) { keep.push(tplPath(n)); continue; }
    files.push({ path: tplPath(n), content: setupTemplate(lang, n, { date: dateTag, quotes: quotesDir || undefined }), kind: "template" });
  }

  // Listen (Bases), nur wenn Bases an ist oder eingeschaltet wird
  if (listsOn && (quotesDir || mediaDir)) {
    const listSubs = { reading: [], watching: [], listening: [] };
    if (mediaDir) {
      if (subs.length) for (const s of subs) listSubs[s.list].push(s.name);
      else listSubs.reading.push("");
    }
    const b = setupBases(lang, { quotes: quotesDir || "40 Quotes", media: mediaDir || "50 Media", subs: listSubs });
    if (quotesDir) files.push({ path: b.quote.path, content: b.quote.content, kind: "list" });
    for (const l of ["reading", "watching", "listening"]) if (listSubs[l].length) files.push({ path: b[l].path, content: b[l].content, kind: "list" });
    Object.assign(bases, b);
  }

  // Templater: nur Ordner ohne eigene Regel, nur wenn gewünscht und installiert
  const own = new Set(((info.templater && info.templater.rules) || []).map((r) => r.folder));
  const newRules = info.templater && choice.rules ? rules.filter((r) => !own.has(r.folder)) : [];

  // Startseite
  const quoteTemplate = quotesDir ? tplPath("Quote") : "";
  let homeBlock = "", homePath = "";
  if (mods.has("home")) {
    const name = noControl(choice.name, " ").replace(/[`|]/g, " ").replace(/\s+/g, " ").trim().slice(0, 40);
    const inbox = suggestFolders(info).inbox;
    let block = "```home-dashboard\n" + (name ? "name: " + name + "\n" : "");
    if (quotesDir) block += "quotes: " + quotesDir + "\ndailyquote: yes\n";
    if (inbox) block += "inbox: " + inbox + "\n";
    if (mediaDir) block += "media: " + mediaDir + "\n";
    if (quoteTemplate) block += "template: " + quoteTemplate + "\n";
    for (const t of choice.tiles || []) {
      if (/[|\n]/.test(t)) continue;
      const links = t === quotesDir ? " | @quotes" : t === mediaDir ? " | @media" : "";
      block += "tile: " + tileTitle(t) + " | " + t + links + "\n";
    }
    homeBlock = block + "```\n";
    if (choice.homeMode !== "copy") {
      homePath = info.home ? "Compass Home.md" : "Home.md";
      files.push({ path: homePath, content: "---\ntype: dashboard\ncssclasses:\n  - home-dash-page\ntags:\n  - home\n---\n" + homeBlock, kind: "home" });
    }
  }

  return {
    lang, folders: [...new Set(folders)], files, templates, keep, rules: newRules, ownRules: [...own],
    enableBases: !info.bases && !!choice.bases && !!(quotesDir || mediaDir), homeBlock, homePath, homeMode: choice.homeMode === "copy" ? "copy" : "new",
    templatesFolder: tplFolder, subs,
    settings: { quotesFolder: quotesDir, mediaFolder: mediaDir, quoteTemplate: quoteTemplate && hasTpl("Quote") ? tplPath("Quote") : quoteTemplate, templateFolder: templates.length ? tplFolder : "" },
  };
}

// Ausführen: nur Fehlendes anlegen. Zitate auch dann überspringen, wenn es eine Notiz gleichen Namens irgendwo gibt.
async function runAdd(app, plugin, plan) {
  const vault = app.vault;
  const result = { created: [], skipped: [], copied: false };
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
  const s = plugin.settings, n = s.notes;
  s.lang = plan.lang;
  s.noteLang = plan.lang;
  if (plan.settings.quotesFolder) s.quotesFolder = plan.settings.quotesFolder;
  if (plan.settings.mediaFolder) s.mediaFolder = plan.settings.mediaFolder;
  if (plan.settings.quoteTemplate) s.quoteTemplate = plan.settings.quoteTemplate;
  if (plan.settings.templateFolder) n.templateFolder = plan.settings.templateFolder;
  n.templateThemes = Object.assign({}, n.templateThemes || {});
  // Farben nur für die neu angelegten Vorlagen; eigene Vorlagen gleichen Namens behalten ihre Zuordnung
  const kept = new Set(plan.keep);
  for (const t of plan.templates) if (!kept.has(`${plan.templatesFolder}/${t} Template.md`) && !n.templateThemes[t] && SETUP_TEMPLATE_THEMES[t]) n.templateThemes[t] = SETUP_TEMPLATE_THEMES[t];
  s.setupDone = true;
  await plugin.saveSettings();
  if (plan.enableBases) {
    try {
      const b = app.internalPlugins && app.internalPlugins.getPluginById && app.internalPlugins.getPluginById("bases");
      if (b && !b.enabled) await b.enable(true);
    } catch (e) { /* nur Komfort */ }
  }
  if (plan.rules.length) {
    s.setupTemplater = plan.rules;
    await applyTemplaterSetup(app, plugin, { templates: plan.templatesFolder, ignore: plan.templatesFolder });
  }
  if (plan.homeMode === "copy" && plan.homeBlock) {
    try { await navigator.clipboard.writeText(plan.homeBlock); result.copied = true; } catch (e) { result.copied = false; }
  }
  return result;
}

const ADD_TEXT = {
  de: {
    kicker: "Compass · Erster Start", kickerDone: "Compass · Eingebaut", step: (n, of) => `Schritt ${n} von ${of}`,
    ready: "Compass ist bereit", readyLead: (n) => `Dein Vault hat schon ${n} Notizen. Wie soll Compass starten?`,
    add: "In meinen Vault einbauen", addP: "Compass nutzt deine Ordner und ergänzt nur, was du auswählst. Nichts wird verschoben, umbenannt oder überschrieben.",
    fresh: "Neu anfangen", freshP: "Ein fertiges Notizsystem mit eigenen Ordnern, Vorlagen und 100 Startzitaten. Gedacht für leere Vaults. Legt zusätzliche Ordner an.",
    readyNote: "Sofort und ohne Einrichtung: Teilen als Bild und Bilder anordnen. Später findest du dieses Fenster unter „Einrichtung starten“.",
    language: "Sprache", later: "Später", laterHint: "Du kannst Compass jederzeit über die Befehlspalette einbauen: „Einrichtung starten“.",
    next: "Weiter", back: "Zurück", toFresh: "Zur Einsteiger-Einrichtung",
    what: "Was willst du nutzen?", whatP: "Wähle die Bausteine. Für jeden schlägt Compass im nächsten Schritt passende Ordner aus deinem Vault vor.",
    modules: { quotes: ["Zitate", "Zitatkarten, rotierende Zitate, Zitat des Tages"], home: ["Startseite", "Begrüßung, Zitate, Kacheln für deine Ordner"],
      headers: ["Notizköpfe", "Farbiger Kopf und Footer in einer neuen Vorlage"], media: ["Medienlisten", "Bücher, Filme, Podcasts mit Fortschritt"] },
    noSetup: "Teilen als Bild und Bilder anordnen brauchen keine Einrichtung.",
    folders: "Deine Ordner", foldersP: "Compass arbeitet mit deinen Ordnern. Vorschläge sind markiert, du kannst jeden ändern.",
    suggestion: "Vorschlag", newFolder: (n) => `＋ Neuer Ordner „${n}“`, notes: (n) => `${n} Notizen`,
    quotes: "Zitate", quoteFolder: "Zitate-Ordner", quoteNew: "Zitate",
    starterNew: "100 Startzitate dazulegen, damit Zitatkarten und Zitat des Tages sofort etwas zeigen.",
    starterFilled: "100 Startzitate dazulegen. Dein Ordner hat schon Zitate, Namen, die es gibt, werden übersprungen.",
    quoteProps: "Compass liest aus deinen Zitat-Notizen den Namen oder die Eigenschaft „quote“, dazu „author“ und „source“. Vorhandene Notizen bleiben unverändert.",
    media: "Medienlisten", mediaFolder: "Medien-Ordner", mediaNew: "Medien", found: "Gefunden, Compass zählt sie einzeln:",
    mediaNewP: "Compass legt den Ordner mit Books, Movies & Series, Podcasts & Audiobooks und Articles an.",
    mediaNoSubs: "Keine Unterordner: Compass legt nur die Leseliste und die Buch-Vorlage an. Filme und Podcasts kannst du später ergänzen.",
    templates: "Vorlagen", templatesFolder: "Vorlagen-Ordner",
    templatesFrom: { templater: "aus Templater übernommen", core: "aus Obsidians Vorlagen übernommen", none: "neu" },
    tagNew: "neu", tagKeep: "bleibt", tagExists: "gibt es, bleibt",
    rulesNote: "Templater-Regeln: Deine bleiben. Compass ergänzt nur Ordner ohne Regel, der Modus bleibt.",
    rulesCheck: "Neue Regeln in Templater eintragen", noTemplater: "Templater ist nicht installiert. Die Vorlagen fügst du über Obsidians Befehl „Vorlage einfügen“ ein.",
    lists: "Listen", basesCheck: "Obsidians Kern-Plugin „Bases“ einschalten. Die Zitate- und Medienlisten brauchen es.",
    homeTitle: "Deine Startseite", homeP: "Vorgewählt sind deine größten Ordner, ohne Archiv, Tagesnotizen und Vorlagen. Wähle die, die du oft brauchst.",
    greeting: "Begrüßung", namePh: "Vorname (optional)", tiles: "Kacheln", where: "Wo?",
    homeNewExisting: "Neue Notiz „Compass Home“ anlegen", homeNewExistingP: (n) => `Deine Startseite „${n}“ bleibt, wie sie ist.`,
    homeCopyExisting: (n) => `Block kopieren und selbst in „${n}“ einfügen`, homeCopyExistingP: "Compass ändert keine vorhandene Notiz.",
    homeNew: "Neue Notiz „Home“ anlegen", homeNewP: "Mit dem Plugin „Homepage“ öffnet sie sich beim Start.",
    homeCopy: "Nur den Block kopieren", homeCopyP: "Zum Einfügen in eine eigene Notiz.", noTiles: "Keine Kacheln gewählt.",
    hello: "Hallo", sampleQuote: "„Was würdest du tun, wenn du wüsstest, dass du nicht scheitern kannst?“",
    what2: "Das passiert", adds: "Kommt dazu", stays: "Bleibt, wie es ist",
    addFolder: (n) => `Ordner „${n}“`, addStarter: "Bis zu 100 Startzitate", addStarterP: "Namen, die es schon gibt, werden übersprungen",
    addTemplates: (n, f) => `${n} ${n === 1 ? "Vorlage" : "Vorlagen"} in „${f}“`, addRules: (n) => `${n} neue Templater-${n === 1 ? "Regel" : "Regeln"}`,
    addHomeP: (n) => `${n} ${n === 1 ? "Kachel" : "Kacheln"}`, addCopy: "Startseiten-Block in der Zwischenablage", addCopyP: (n) => `zum Einfügen in „${n}“`,
    addBases: "Kern-Plugin „Bases“ eingeschaltet",
    keepNotes: (n, f) => `${n} Notizen und ${f} Ordner`, keepNotesP: "nichts verschoben, umbenannt oder überschrieben",
    keepHome: (n) => `Startseite „${n}“`, keepRules: (n) => `${n} Templater-${n === 1 ? "Regel" : "Regeln"} und der Modus`,
    keepProps: "Eigenschaften deiner Notizen", keepLook: "Theme, Schriften und Einstellungen von Obsidian",
    previewNote: "Eingebaut wird erst mit „Einbauen“. Du kannst das jederzeit erneut starten, es kommt nur Fehlendes dazu.",
    run: "Einbauen", working: "Wird eingebaut …", error: "Das Einbauen ist nicht vollständig durchgelaufen. Bereits Angelegtes bleibt erhalten.",
    done: "Fertig", doneP: (c, s) => `${c} Ordner und Dateien angelegt` + (s ? `, ${s} übersprungen, weil es sie schon gab.` : ", nichts überschrieben."),
    nextSteps: "So geht es weiter", openHome: "Startseite öffnen", open: "Öffnen", pasteHome: "Block in deine Startseite einfügen", copyAgain: "Kopieren",
    copied: "Kopiert", insertHint: "Vorlagen fügst du über Obsidians Befehl „Vorlage einfügen“ ein.",
    templaterHint: "In Templater „Trigger Templater on new file creation“ einschalten, dann bekommen neue Notizen ihre Vorlage von selbst. Das gilt pro Gerät.",
    howto: "How To in den Einstellungen", close: "Schließen",
  },
  en: {
    kicker: "Compass · First start", kickerDone: "Compass · Added", step: (n, of) => `Step ${n} of ${of}`,
    ready: "Compass is ready", readyLead: (n) => `Your vault already has ${n} notes. How should Compass start?`,
    add: "Add to my vault", addP: "Compass uses your folders and only adds what you choose. Nothing is moved, renamed or overwritten.",
    fresh: "Start fresh", freshP: "A ready-made note system with its own folders, templates and 100 starter quotes. Meant for empty vaults. Creates extra folders.",
    readyNote: "Works right away, without setup: sharing as image and arranging images. You can open this window again with “Start setup”.",
    language: "Language", later: "Later", laterHint: "You can add Compass to your vault any time from the command palette: “Start setup”.",
    next: "Next", back: "Back", toFresh: "Go to the beginner setup",
    what: "What do you want to use?", whatP: "Pick the building blocks. In the next step Compass suggests matching folders from your vault for each one.",
    modules: { quotes: ["Quotes", "Quote cards, rotating quotes, quote of the day"], home: ["Home page", "Greeting, quotes, tiles for your folders"],
      headers: ["Note headers", "Coloured header and footer in a new template"], media: ["Media lists", "Books, films, podcasts with progress"] },
    noSetup: "Sharing as image and arranging images need no setup.",
    folders: "Your folders", foldersP: "Compass works with your folders. Suggestions are marked, and you can change each one.",
    suggestion: "suggested", newFolder: (n) => `＋ New folder “${n}”`, notes: (n) => `${n} notes`,
    quotes: "Quotes", quoteFolder: "Quotes folder", quoteNew: "Quotes",
    starterNew: "Add 100 starter quotes so quote cards and the quote of the day show something right away.",
    starterFilled: "Add 100 starter quotes. Your folder already has quotes; names that exist are skipped.",
    quoteProps: "Compass reads the quote from the note name or the property “quote”, plus “author” and “source”. Existing notes stay unchanged.",
    media: "Media lists", mediaFolder: "Media folder", mediaNew: "Media", found: "Found; Compass counts them separately:",
    mediaNewP: "Compass creates the folder with Books, Movies & Series, Podcasts & Audiobooks and Articles.",
    mediaNoSubs: "No subfolders: Compass only adds the reading list and the book template. You can add films and podcasts later.",
    templates: "Templates", templatesFolder: "Templates folder",
    templatesFrom: { templater: "taken from Templater", core: "taken from Obsidian’s Templates", none: "new" },
    tagNew: "new", tagKeep: "stays", tagExists: "exists, stays",
    rulesNote: "Templater rules: yours stay. Compass only adds folders without a rule and keeps the mode.",
    rulesCheck: "Add the new rules to Templater", noTemplater: "Templater is not installed. Insert the templates with Obsidian’s “Insert template” command.",
    lists: "Lists", basesCheck: "Turn on Obsidian’s core plugin “Bases”. The quote and media lists need it.",
    homeTitle: "Your home page", homeP: "Your largest folders are preselected, without archive, daily notes and templates. Pick the ones you use often.",
    greeting: "Greeting", namePh: "First name (optional)", tiles: "Tiles", where: "Where?",
    homeNewExisting: "Create a new note “Compass Home”", homeNewExistingP: (n) => `Your home page “${n}” stays as it is.`,
    homeCopyExisting: (n) => `Copy the block and paste it into “${n}” yourself`, homeCopyExistingP: "Compass doesn’t change any existing note.",
    homeNew: "Create a new note “Home”", homeNewP: "With the Homepage plugin it opens on startup.",
    homeCopy: "Only copy the block", homeCopyP: "To paste into a note of your own.", noTiles: "No tiles selected.",
    hello: "Hello", sampleQuote: "“What would you do if you knew you could not fail?”",
    what2: "What happens", adds: "Added", stays: "Stays as it is",
    addFolder: (n) => `Folder “${n}”`, addStarter: "Up to 100 starter quotes", addStarterP: "Names that already exist are skipped",
    addTemplates: (n, f) => `${n} ${n === 1 ? "template" : "templates"} in “${f}”`, addRules: (n) => `${n} new Templater ${n === 1 ? "rule" : "rules"}`,
    addHomeP: (n) => `${n} ${n === 1 ? "tile" : "tiles"}`, addCopy: "Home page block on the clipboard", addCopyP: (n) => `to paste into “${n}”`,
    addBases: "Core plugin “Bases” turned on",
    keepNotes: (n, f) => `${n} notes and ${f} folders`, keepNotesP: "nothing moved, renamed or overwritten",
    keepHome: (n) => `Home page “${n}”`, keepRules: (n) => `${n} Templater ${n === 1 ? "rule" : "rules"} and the mode`,
    keepProps: "Your notes’ properties", keepLook: "Obsidian’s theme, fonts and settings",
    previewNote: "Nothing happens until you press “Add”. You can run this again any time; only what is missing is added.",
    run: "Add", working: "Adding …", error: "Adding did not finish completely. Everything created so far is kept.",
    done: "Done", doneP: (c, s) => `Created ${c} folders and files` + (s ? `, skipped ${s} that already existed.` : ", nothing overwritten."),
    nextSteps: "What’s next", openHome: "Open home page", open: "Open", pasteHome: "Paste the block into your home page", copyAgain: "Copy",
    copied: "Copied", insertHint: "Insert templates with Obsidian’s “Insert template” command.",
    templaterHint: "In Templater, turn on “Trigger Templater on new file creation” so new notes get their template by themselves. This applies per device.",
    howto: "How To in the settings", close: "Close",
  },
};

class AddModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    this.info = scanVault(app);
    const sug = suggestFolders(this.info);
    this.sug = sug;
    const quoteFilled = sug.quotes && (this.info.folders.find((f) => f.path === sug.quotes) || { count: 0 }).count > 0;
    this.state = {
      step: 0, lang: plugin.settings.lang === "de" ? "de" : "en", way: "add",
      modules: new Set(["quotes", "home", "headers"].concat(sug.media ? ["media"] : [])),
      quoteFolder: sug.quotes || "+", starter: !quoteFilled, mediaFolder: sug.media || "+",
      rules: true, bases: !this.info.bases, name: "", tiles: null, homeMode: "new", result: null,
    };
  }

  get T() { return ADD_TEXT[this.state.lang]; }

  onOpen() {
    this.modalEl.addClass("cmp-setup-modal");
    this.render();
  }

  onClose() { this.contentEl.empty(); }

  // Ordnerwerte: „+“ allein heißt „neuer Ordner mit Standardnamen“ in der gewählten Sprache
  choice() {
    const S = this.state, T = this.T;
    const fix = (v, name) => (v === "+" ? "+" + name : v);
    const quoteFolder = fix(S.quoteFolder, T.quoteNew), mediaFolder = fix(S.mediaFolder, T.mediaNew);
    if (!S.tiles) S.tiles = new Set(defaultTiles(this.candidates(), this.moduleFolders()));
    return { lang: S.lang, modules: [...S.modules], quoteFolder, starter: S.starter, mediaFolder, rules: S.rules, bases: S.bases,
      name: S.name, tiles: [...S.tiles], homeMode: S.homeMode };
  }

  // Ordner der gewählten Bausteine, neue mit ihrem künftigen Namen
  moduleFolders() {
    const S = this.state, T = this.T, out = [];
    if (S.modules.has("quotes")) out.push(S.quoteFolder === "+" ? T.quoteNew : S.quoteFolder);
    if (S.modules.has("media")) out.push(S.mediaFolder === "+" ? T.mediaNew : S.mediaFolder);
    return out;
  }

  candidates() {
    return tileCandidates(this.info, this.moduleFolders());
  }

  plan() { return addPlan(this.info, this.choice()); }

  go(step) {
    this.state.step = step;
    this.render();
  }

  render() {
    const el = this.contentEl;
    const T = this.T, S = this.state, info = this.info;
    el.empty();
    const bar = el.createDiv({ cls: "cmp-steps", attr: { "aria-hidden": "true" } });
    for (let i = 0; i < 6; i++) bar.createEl("i", { cls: i <= S.step ? "is-done" : "" });
    const body = el.createDiv({ cls: "cmp-body" });
    const foot = el.createDiv({ cls: "cmp-foot" });
    const left = foot.createDiv();
    const button = (parent, text, cls, onClick) => { const b = parent.createEl("button", { text, cls }); b.addEventListener("click", onClick); return b; };
    const kicker = (text) => body.createEl("p", { cls: "cmp-kicker", text });
    const h1 = (text) => body.createEl("h2", { cls: "cmp-title", text });
    const num = (n) => n.toLocaleString(S.lang === "de" ? "de-DE" : "en-GB");
    const check = (parent, checked, text, onChange) => {
      const l = parent.createEl("label", { cls: "cmp-check" });
      const cb = l.createEl("input", { attr: { type: "checkbox" } });
      cb.checked = checked;
      cb.addEventListener("change", () => onChange(cb.checked));
      l.createSpan({ text });
      return cb;
    };

    // 0 · Start: einbauen oder neu anfangen
    if (S.step === 0) {
      kicker(T.kicker);
      h1(T.ready);
      body.createEl("p", { cls: "cmp-lead", text: T.readyLead(num(info.noteCount)) });
      const choice = body.createDiv({ cls: "cmp-choice" });
      for (const [id, head, text] of [["add", T.add, T.addP], ["fresh", T.fresh, T.freshP]]) {
        const b = choice.createEl("button", { cls: "cmp-basic", attr: { "aria-pressed": String(S.way === id) } });
        b.createEl("b", { text: head });
        b.createEl("small", { text });
        b.addEventListener("click", () => { S.way = id; this.render(); });
      }
      const langRow = body.createDiv({ cls: "cmp-row" });
      langRow.createSpan({ cls: "cmp-label", text: T.language });
      const chips = langRow.createDiv({ cls: "cmp-chips", attr: { role: "group", "aria-label": T.language } });
      for (const [code, label] of [["en", "English"], ["de", "Deutsch"]]) {
        const c = button(chips, label, "cmp-chip", () => { S.lang = code; this.render(); });
        c.setAttr("aria-pressed", String(S.lang === code));
      }
      body.createEl("p", { cls: "cmp-note", text: T.readyNote });
      button(left, T.later, "cmp-btn mod-link", async () => {
        this.plugin.settings.setupDone = true;
        await this.plugin.saveSettings();
        new Notice(T.laterHint, 8000);
        this.close();
      });
      button(foot, S.way === "add" ? T.next : T.toFresh, "cmp-btn mod-cta", () => {
        if (S.way === "add") { this.go(1); return; }
        this.close();
        const m = new SetupModal(this.app, this.plugin);
        m.state.lang = S.lang;
        m.open();
      });
      return;
    }

    // 1 · Bausteine
    if (S.step === 1) {
      kicker(T.step(1, 4));
      h1(T.what);
      body.createEl("p", { text: T.whatP });
      const cards = body.createDiv({ cls: "cmp-cards" });
      for (const [id, ico] of [["quotes", "❝"], ["home", "⌂"], ["headers", "▤"], ["media", "📚"]]) {
        const c = cards.createEl("button", { cls: "cmp-card", attr: { "aria-pressed": String(S.modules.has(id)) } });
        c.createSpan({ cls: "cmp-ico", text: ico, attr: { "aria-hidden": "true" } });
        c.createEl("b", { text: T.modules[id][0] });
        c.createEl("small", { text: T.modules[id][1] });
        c.addEventListener("click", () => { S.modules.has(id) ? S.modules.delete(id) : S.modules.add(id); S.tiles = null; this.render(); });
      }
      body.createEl("p", { cls: "cmp-note", text: T.noSetup });
      button(left, T.back, "cmp-btn", () => this.go(0));
      const next = button(foot, T.next, "cmp-btn mod-cta", () => this.go(2));
      if (!S.modules.size) next.disabled = true;
      return;
    }

    // 2 · Ordner
    if (S.step === 2) {
      kicker(T.step(2, 4));
      h1(T.folders);
      body.createEl("p", { text: T.foldersP });
      const map = body.createDiv({ cls: "cmp-map" });
      const select = (parent, value, suggestion, newName, onChange) => {
        const s = parent.createEl("select", { cls: "dropdown" });
        for (const f of info.folders) {
          const o = s.createEl("option", { text: f.path + " (" + num(f.count) + ")" + (f.path === suggestion ? " · " + T.suggestion : "") });
          o.value = f.path;
        }
        const o = s.createEl("option", { text: T.newFolder(newName) + (!suggestion ? " · " + T.suggestion : "") });
        o.value = "+";
        s.value = value;
        s.addEventListener("change", () => onChange(s.value));
        return s;
      };
      const field = (parent, label) => { const f = parent.createDiv({ cls: "cmp-field" }); f.createEl("label", { text: label }); return f; };
      const block = (title) => { const b = map.createDiv({ cls: "cmp-block" }); b.createEl("h3", { text: title }); return b; };
      const plan = this.plan();

      if (S.modules.has("quotes")) {
        const b = block(T.quotes);
        select(field(b, T.quoteFolder), S.quoteFolder, this.sug.quotes, T.quoteNew, (v) => {
          S.quoteFolder = v;
          S.starter = v === "+" || !(info.folders.find((f) => f.path === v) || { count: 0 }).count;
          S.tiles = null;
          this.render();
        });
        const filled = S.quoteFolder !== "+" && (info.folders.find((f) => f.path === S.quoteFolder) || { count: 0 }).count > 0;
        check(b, S.starter, filled ? T.starterFilled : T.starterNew, (v) => { S.starter = v; });
        b.createEl("p", { cls: "cmp-note", text: T.quoteProps });
      }
      if (S.modules.has("media")) {
        const b = block(T.media);
        select(field(b, T.mediaFolder), S.mediaFolder, this.sug.media, T.mediaNew, (v) => { S.mediaFolder = v; S.tiles = null; this.render(); });
        if (S.mediaFolder === "+") b.createEl("p", { cls: "cmp-note", text: T.mediaNewP });
        else if (plan.subs.length) {
          b.createEl("p", { cls: "cmp-note", text: T.found });
          const found = b.createDiv({ cls: "cmp-found" });
          for (const x of plan.subs) found.createSpan({ text: x.name + " " + num(x.count || 0) });
        } else b.createEl("p", { cls: "cmp-note", text: T.mediaNoSubs });
      }
      if (plan.templates.length) {
        const b = block(T.templates);
        const f = field(b, T.templatesFolder);
        f.createSpan({ text: plan.templatesFolder + " · " + T.templatesFrom[info.templatesFrom || "none"] });
        const list = b.createEl("ul", { cls: "cmp-rules" });
        for (const n of plan.templates) {
          const exists = info.templateNames.includes(n + " Template");
          const li = list.createEl("li", { cls: exists ? "is-keep" : "" });
          li.createEl("code", { text: plan.templatesFolder + "/" + n + " Template.md" });
          li.createSpan({ cls: "cmp-tag" + (exists ? "" : " is-new"), text: exists ? T.tagExists : T.tagNew });
        }
        if (info.templater) {
          b.createEl("p", { cls: "cmp-note", text: T.rulesNote });
          const rules = b.createEl("ul", { cls: "cmp-rules" });
          for (const r of info.templater.rules) {
            const li = rules.createEl("li", { cls: "is-keep" });
            li.createSpan({ text: r.folder + " → " + r.template.split("/").pop().replace(/\.md$/, "") });
            li.createSpan({ cls: "cmp-tag", text: T.tagKeep });
          }
          const fresh = addPlan(info, Object.assign(this.choice(), { rules: true })).rules;
          for (const r of fresh) {
            const li = rules.createEl("li");
            li.createSpan({ text: r.folder + " → " + r.template.split("/").pop().replace(/\.md$/, "") });
            li.createSpan({ cls: "cmp-tag is-new", text: T.tagNew });
          }
          if (fresh.length) check(b, S.rules, T.rulesCheck, (v) => { S.rules = v; });
        } else b.createEl("p", { cls: "cmp-note", text: T.noTemplater });
      }
      if ((S.modules.has("quotes") || S.modules.has("media")) && !info.bases) {
        const b = block(T.lists);
        check(b, S.bases, T.basesCheck, (v) => { S.bases = v; });
      }
      button(left, T.back, "cmp-btn", () => this.go(1));
      button(foot, T.next, "cmp-btn mod-cta", () => this.go(S.modules.has("home") ? 3 : 4));
      return;
    }

    // 3 · Startseite
    if (S.step === 3) {
      kicker(T.step(3, 4));
      h1(T.homeTitle);
      body.createEl("p", { text: T.homeP });
      const f = body.createDiv({ cls: "cmp-field" });
      f.createEl("label", { text: T.greeting });
      const name = f.createEl("input", { cls: "cmp-input", attr: { type: "text", placeholder: T.namePh, maxlength: "40", autocomplete: "given-name" } });
      name.value = S.name;
      body.createEl("h3", { cls: "cmp-sub", text: T.tiles });
      const pick = body.createDiv({ cls: "cmp-pick" });
      const cands = this.candidates();
      if (!S.tiles) S.tiles = new Set(defaultTiles(cands, this.moduleFolders()));
      for (const c of cands) {
        const l = pick.createEl("label");
        const cb = l.createEl("input", { attr: { type: "checkbox" } });
        cb.checked = S.tiles.has(c.path);
        l.createSpan({ text: c.path });
        l.createEl("small", { text: num(c.count) });
        cb.addEventListener("change", () => { cb.checked ? S.tiles.add(c.path) : S.tiles.delete(c.path); drawTiles(); });
      }
      body.createEl("h3", { cls: "cmp-sub", text: T.where });
      const radio = body.createDiv({ cls: "cmp-radio" });
      const opts = info.home
        ? [["new", T.homeNewExisting, T.homeNewExistingP(info.home.name)], ["copy", T.homeCopyExisting(info.home.name), T.homeCopyExistingP]]
        : [["new", T.homeNew, T.homeNewP], ["copy", T.homeCopy, T.homeCopyP]];
      for (const [id, head, small] of opts) {
        const l = radio.createEl("label");
        const r = l.createEl("input", { attr: { type: "radio", name: "cmp-home" } });
        r.checked = S.homeMode === id;
        const t = l.createSpan();
        t.createEl("b", { text: head });
        t.createEl("small", { cls: "cmp-note", text: small });
        r.addEventListener("change", () => { S.homeMode = id; });
      }
      // Kleine Vorschau der Startseite
      const home = body.createDiv({ cls: "cmp-home" });
      const greet = () => T.hello + (S.name.trim() ? ", " + noControl(S.name, " ").trim().slice(0, 40) : "");
      const hello = home.createEl("p", { cls: "cmp-hello", text: greet() });
      if (S.modules.has("quotes")) home.createEl("p", { cls: "cmp-sample-quote", text: T.sampleQuote });
      const grid = home.createDiv({ cls: "cmp-tilegrid" });
      const drawTiles = () => {
        grid.empty();
        for (const c of cands) if (S.tiles.has(c.path)) { const d = grid.createDiv(); d.createEl("b", { text: tileTitle(c.path) }); d.createEl("small", { text: T.notes(num(c.count)) }); }
        if (!S.tiles.size) grid.createEl("p", { cls: "cmp-note", text: T.noTiles });
      };
      drawTiles();
      name.addEventListener("input", () => { S.name = name.value; hello.setText(greet()); });
      button(left, T.back, "cmp-btn", () => this.go(2));
      button(foot, T.next, "cmp-btn mod-cta", () => this.go(4));
      return;
    }

    // 4 · Vorschau
    if (S.step === 4) {
      const plan = this.plan();
      kicker(T.step(4, 4));
      h1(T.what2);
      const cols = body.createDiv({ cls: "cmp-cols" });
      const a = cols.createDiv(), k = cols.createDiv();
      a.createEl("h3", { cls: "cmp-sub", text: T.adds });
      k.createEl("h3", { cls: "cmp-sub", text: T.stays });
      const ul = a.createEl("ul", { cls: "cmp-list" }), kl = k.createEl("ul", { cls: "cmp-list is-keep" });
      const item = (list, mark, text, small) => {
        const li = list.createEl("li");
        li.createEl("i", { text: mark, attr: { "aria-hidden": "true" } });
        const s = li.createSpan({ text });
        if (small) s.createEl("small", { text: small });
      };
      for (const f of plan.folders) item(ul, "+", T.addFolder(f));
      if (plan.files.some((f) => f.kind === "quote")) item(ul, "+", T.addStarter, T.addStarterP);
      for (const f of plan.files.filter((x) => x.kind === "list")) item(ul, "+", f.path);
      const nTpl = plan.files.filter((x) => x.kind === "template").length;
      if (nTpl) item(ul, "+", T.addTemplates(nTpl, plan.templatesFolder));
      if (plan.rules.length) item(ul, "+", T.addRules(plan.rules.length));
      if (plan.homePath) item(ul, "+", plan.homePath, T.addHomeP(this.choice().tiles.length));
      else if (S.modules.has("home")) item(ul, "⧉", T.addCopy, T.addCopyP(info.home ? info.home.name : "…"));
      if (plan.enableBases) item(ul, "+", T.addBases);
      item(kl, "✓", T.keepNotes(num(info.noteCount), num(info.folders.length)), T.keepNotesP);
      if (info.home) item(kl, "✓", T.keepHome(info.home.name), info.home.via);
      if (info.templater && info.templater.rules.length) item(kl, "✓", T.keepRules(info.templater.rules.length));
      for (const p of plan.keep) item(kl, "✓", p);
      item(kl, "✓", T.keepProps);
      item(kl, "✓", T.keepLook);
      body.createEl("p", { cls: "cmp-note", text: T.previewNote });
      button(left, T.back, "cmp-btn", () => this.go(S.modules.has("home") ? 3 : 2));
      const run = button(foot, T.run, "cmp-btn mod-cta", async () => {
        run.disabled = true;
        run.setText(T.working);
        try { S.result = await runAdd(this.app, this.plugin, plan); S.plan = plan; }
        catch (e) { new Notice(T.error); S.result = { created: [], skipped: [], error: true }; }
        this.go(5);
      });
      return;
    }

    // 5 · Fertig
    const r = S.result || { created: [], skipped: [] };
    const plan = S.plan || this.plan();
    kicker(T.kickerDone);
    h1(T.done);
    body.createEl("p", { cls: "cmp-lead", text: r.error ? T.error : T.doneP(r.created.length, r.skipped.length) });
    body.createEl("h3", { cls: "cmp-sub", text: T.nextSteps });
    const todo = body.createEl("ul", { cls: "cmp-todo" });
    if (plan.homePath) {
      const li = todo.createEl("li");
      li.createSpan({ text: T.openHome });
      button(li, T.open, "cmp-btn", async () => { this.close(); await this.app.workspace.openLinkText(plan.homePath, "", false); });
    } else if (plan.homeBlock) {
      const li = todo.createEl("li");
      li.createSpan({ text: T.pasteHome });
      const b = button(li, r.copied ? T.copied : T.copyAgain, "cmp-btn", async () => {
        try { await navigator.clipboard.writeText(plan.homeBlock); b.setText(T.copied); } catch (e) { b.setText(T.copyAgain); }
      });
    }
    if (plan.files.some((f) => f.kind === "template")) body.createEl("p", { cls: "cmp-note", text: info.templater ? T.templaterHint : T.insertHint });
    button(left, T.howto, "cmp-btn mod-link", () => { this.close(); const s = this.app.setting; if (s) { s.open(); s.openTabById(this.plugin.manifest.id); } });
    button(foot, T.close, "cmp-btn mod-cta", () => this.close());
  }
}

// „Einrichtung starten“: im (fast) leeren Vault die Einsteiger-Einrichtung, sonst die Auswahl mit „In meinen Vault einbauen“
function openCompassSetup(app, plugin) {
  if (app.vault.getMarkdownFiles().length <= 3) new SetupModal(app, plugin).open();
  else new AddModal(app, plugin).open();
}
