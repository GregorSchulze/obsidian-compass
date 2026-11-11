// Texte der Zitatkarten
const QUOTE_TEXT = {
  de: {
    share: "Zitat teilen", none: (folder) => "Noch keine Zitate in „" + folder + "“.", today: "Zitat des Tages",
    notFound: (link) => "Zitat „" + link + "“ nicht gefunden.", editTitle: "Klicken, um das Zitat zu ändern", editAria: "Zitat, zum Ändern anklicken",
    nameExists: "Eine Notiz mit diesem Namen gibt es schon.", empty: "Das Zitat darf nicht leer sein.", editFailed: "Zitat konnte nicht geändert werden.",
    choose: "Zitate auswählen", prev: "Vorheriges Zitat", next: "Nächstes Zitat", resume: "Zitate wieder wechseln", pause: "Zitatwechsel anhalten",
  },
  en: {
    share: "Share quote", none: (folder) => "No quotes in “" + folder + "” yet.", today: "Quote of the day",
    notFound: (link) => "Quote “" + link + "” not found.", editTitle: "Click to edit the quote", editAria: "Quote, click to edit",
    nameExists: "A note with this name already exists.", empty: "The quote can’t be empty.", editFailed: "Couldn’t change the quote.",
    choose: "Choose quotes", prev: "Previous quote", next: "Next quote", resume: "Resume rotating quotes", pause: "Pause rotating quotes",
  },
};
const quoteText = () => QUOTE_TEXT[uiLang()];

// Teilen-Knopf für eine Karte
function shareButton(app, file) {
  const b = createEl("button", { cls: "clickable-icon quote-rotator-control quote-card-share", attr: { "aria-label": quoteText().share } });
  setIcon(b, "share");
  b.addEventListener("click", (e) => { e.stopPropagation(); if (PLUGIN) new ShareModal(app, PLUGIN, quotePayload(app, file)).open(); });
  return b;
}

// Kopfzeile der Karte: Quelle links, Knöpfe rechts auf einer Linie
function cardHead(card, controls) {
  const head = createDiv({ cls: "quote-card-head" });
  card.insertBefore(head, card.firstChild);
  const source = card.querySelector(".quote-card-source");
  if (source) head.appendChild(source);
  else head.createDiv();
  head.appendChild(controls);
}

// ```quote-card``` zeigt das Zitat dieser Notiz. Mit „quote: [[Notiz]]“ im Block (auch mehrfach, früher „zitat:“)
// oder der Eigenschaft „zitat“ zeigt es stattdessen fest das verlinkte Zitat, z. B. in Reflexionen und Journalen.
class QuoteCard extends MarkdownRenderChild {
  constructor(el, app, sourcePath, source) {
    super(el);
    this.app = app;
    this.sourcePath = sourcePath;
    const { opt, list } = blockOptions(source);
    // „today: 40 Quotes“ oder „today: yes“ (Standard-Ordner)
    this.today = opt.today != null ? (isYes(opt.today) ? "" : opt.today.replace(/\/+$/, "")) : null;
    this.refs = (list.quote || []).map((v) => linkTarget(v)).filter(Boolean);
    this.watch = new Set();
  }

  onload() {
    if (PLUGIN) PLUGIN.quoteViews.add(this);
    this.render();
    this.registerEvent(this.app.metadataCache.on("changed", (file) => {
      if (file.path === this.sourcePath || this.watch.has(file.path)) this.render();
    }));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      const own = oldPath === this.sourcePath;
      if (own) this.sourcePath = file.path;
      if (own || this.watch.has(oldPath)) this.render();
    }));
  }

  onunload() {
    if (PLUGIN) PLUGIN.quoteViews.delete(this);
  }

  refresh() {
    this.render();
  }

  render() {
    const el = this.containerEl;
    const self = this.app.vault.getAbstractFileByPath(this.sourcePath);
    const fm = (self && (this.app.metadataCache.getFileCache(self) || {}).frontmatter) || {};
    this.watch = new Set();
    // Zitat des Tages: in Journalen nach dem Datum der Notiz, sonst nach heute
    if (this.today !== null) {
      const folder = this.today || defaultQuoteFolder();
      const day = /^\d{4}-\d{2}-\d{2}$/.test(plain(fm.date)) ? plain(fm.date) : isoDate();
      const file = quoteOfDay(quoteFiles(this.app, folder), day);
      el.empty();
      if (!file) { el.createEl("p", { cls: "quote-rotator-empty", text: quoteText().none(folder) }); return; }
      this.watch.add(file.path);
      const box = el.createDiv({ cls: "quote-card-ref" });
      buildCard(box, readCard(this.app, file), quoteTheme(file));
      const card = box.querySelector(".quote-card");
      makeOpenable(this.app, box, file);
      cardHead(card, createDiv({ cls: "quote-rotator-controls" }, (c) => c.appendChild(shareButton(this.app, file))));
      const d = new Date(day + "T12:00:00");
      cardKicker(card, quoteText().today + " · " + d.toLocaleDateString(baseText().locale, { day: "numeric", month: "short", year: "numeric" }));
      return;
    }
    const links = this.refs.length ? this.refs : [].concat(fm.zitat || []).map(linkTarget).filter(Boolean);
    if (!links.length) {
      buildCard(el, readCard(this.app, self), quoteTheme(self));
      const text = el.querySelector(".quote-card-quote");
      if (self && text) makeQuoteEditable(this.app, text, self, fm);
      if (self) cardHead(el.querySelector(".quote-card"), createDiv({ cls: "quote-rotator-controls" }, (c) => c.appendChild(shareButton(this.app, self))));
      return;
    }
    el.empty();
    for (const link of links) {
      const file = this.app.metadataCache.getFirstLinkpathDest(link, this.sourcePath);
      const box = el.createDiv({ cls: "quote-card-ref" });
      if (!file) {
        box.createEl("p", { cls: "quote-rotator-empty", text: quoteText().notFound(link) });
        continue;
      }
      this.watch.add(file.path);
      buildCard(box, readCard(this.app, file), quoteTheme(file));
      makeOpenable(this.app, box, file);
      cardHead(box.querySelector(".quote-card"), createDiv({ cls: "quote-rotator-controls" }, (c) => c.appendChild(shareButton(this.app, file))));
    }
  }
}

// Zitattext direkt in der Karte ändern. Ohne Eigenschaft „quote“ wird die Notiz umbenannt (Links bleiben erhalten);
// enthält der Text Zeichen, die Dateinamen nicht erlauben, landet er zusätzlich in „quote“.
function makeQuoteEditable(app, el, file, fm) {
  const original = el.textContent;
  const T = quoteText();
  el.setAttr("contenteditable", "plaintext-only");
  el.setAttr("spellcheck", "false");
  el.setAttr("title", T.editTitle);
  el.setAttr("aria-label", T.editAria);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); el.blur(); }
    if (e.key === "Escape") { el.textContent = original; el.blur(); }
  });
  el.addEventListener("blur", async () => {
    const value = el.textContent.replace(/\s+/g, " ").trim();
    if (!value || value === original) { el.textContent = original; return; }
    try {
      if (plain(fm.quote)) {
        await app.fileManager.processFrontMatter(file, (data) => { data.quote = value; });
        return;
      }
      const name = value.replace(/[\\/:*?"<>|#^[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, 120).trim();
      const folder = file.parent && file.parent.path !== "/" ? file.parent.path + "/" : "";
      const target = folder + name + "." + file.extension;
      if (!name || app.vault.getAbstractFileByPath(target) ||
          app.vault.getMarkdownFiles().some((f) => f !== file && f.basename.toLowerCase() === name.toLowerCase())) {
        new Notice(name ? T.nameExists : T.empty);
        el.textContent = original;
        return;
      }
      if (name !== value) await app.fileManager.processFrontMatter(file, (data) => { data.quote = value; });
      await app.fileManager.renameFile(file, target);
    } catch (err) {
      new Notice(T.editFailed);
      el.textContent = original;
    }
  });
}

function readCard(app, file) {
  const cache = file ? app.metadataCache.getFileCache(file) : null;
  const fm = (cache && cache.frontmatter) || {};
  return {
    author: plain(fm.author),
    source: plain(fm.source),
    place: plain(fmGet(fm, "stelle")),
    url: safeLink(fm.link),
    quote: plain(fm.quote) || (file ? file.basename : ""),
    translation: plain(fmGet(fm, "übersetzung")),
  };
}

// Alle Zitate eines Ordners (ohne Übersichten mit „_“ und ohne Liedtexte), sortiert für stabile Auswahl
function quoteFiles(app, folder) {
  return app.vault.getMarkdownFiles().filter((f) => {
    if (!f.path.startsWith(folder + "/") || f.basename.startsWith("_")) return false;
    const fm = (app.metadataCache.getFileCache(f) || {}).frontmatter || {};
    return fm.type === "quote" && plain(fmGet(fm, "art")) !== "Liedtext";
  }).sort((a, b) => a.path.localeCompare(b.path));
}

// Zitat des Tages: am selben Tag überall dasselbe, jeden Tag ein anderes (Streuwert aus dem Datum)
function quoteOfDay(files, iso) {
  if (!files.length) return null;
  let h = 2166136261;
  for (const ch of String(iso)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  return files[h % files.length];
}

// Vorlage füllen: Datum und Titel, in Templater- wie in der alten Schreibweise
function fillTemplate(text, title) {
  const iso = isoDate();
  return String(text)
    .replace(/<%\s*tp\.date\.now\([^)]*\)\s*%>/g, iso)
    .replace(/<%\s*tp\.file\.title\s*%>/g, title)
    .replace(/\{\{date(:[^}]*)?\}\}/g, iso)
    .replace(/\{\{title\}\}/g, title);
}

// Kleine Zeile über der Karte, z. B. „Zitat des Tages“
function cardKicker(card, text) {
  const k = createEl("p", { cls: "quote-card-kicker", text });
  card.insertBefore(k, card.firstChild);
}

// Standard-Ordner für Zitate: „Quotes“ im Zitate-Ordner, falls es ihn gibt, sonst der Zitate-Ordner selbst
function defaultQuoteFolder() {
  const root = (PLUGIN ? PLUGIN.settings.quotesFolder : DEFAULTS.quotesFolder) || DEFAULTS.quotesFolder;
  return PLUGIN && PLUGIN.app.vault.getAbstractFileByPath(root + "/Quotes") ? root + "/Quotes" : root;
}

// Quellen „Zitate = 40 Quotes/Zitate; Fragen = 40 Quotes/Fragen“ oder nur ein Ordner
function parseSources(value) {
  return String(value || defaultQuoteFolder()).split(";").map((part) => {
    const m = part.match(/^\s*(?:(.+?)\s*=\s*)?(.+?)\s*$/);
    if (!m) return null;
    const folder = m[2].replace(/\/+$/, "");
    return { label: (m[1] || folder.split("/").pop()).trim(), folder };
  }).filter(Boolean);
}

// ```quote-rotator``` zeigt reihum ein Zitat, mit sanfter Überblendung.
// Optionen im Block: „folder: …“, „seconds: 17“, „start: today“ (früher ordner, sekunden, heute).
// Mehrere Ordner mit „;“ trennen, dann erscheint ein Umschalter, z. B. Zitate und Fragen.
class QuoteRotator extends MarkdownRenderChild {
  constructor(el, app, source) {
    super(el);
    this.app = app;
    const { opt } = blockOptions(source);
    this.sources = parseSources(opt.folder);
    this.storeKey = "quote-rotator-quelle:" + this.sources.map((s) => s.folder).join(";");
    let saved = 0;
    try { saved = Number(window.localStorage.getItem(this.storeKey)) || 0; } catch (e) { saved = 0; }
    this.active = saved < this.sources.length ? saved : 0;
    this.seconds = Math.min(600, Math.max(5, Number(opt.seconds) || 17));
    this.startToday = isToday(opt.start);
    this.paused = false;
    this.hovered = false;
    this.current = null;
    this.history = [];
    this.pos = -1;
  }

  get folder() {
    return this.sources[this.active].folder;
  }

  quotes() {
    return quoteFiles(this.app, this.folder);
  }

  dayQuote() {
    return quoteOfDay(this.quotes(), isoDate());
  }

  onload() {
    const el = this.containerEl;
    el.empty();
    el.addClass("quote-rotator");
    const T = quoteText();
    if (this.sources.length > 1) {
      const tabs = el.createDiv({ cls: "quote-rotator-tabs", attr: { role: "group", "aria-label": T.choose } });
      this.tabButtons = this.sources.map((s, i) => {
        const b = tabs.createEl("button", { cls: "quote-rotator-tab", text: s.label });
        b.addEventListener("click", () => this.select(i));
        return b;
      });
      this.updateTabs();
    }
    this.slide = el.createDiv({ cls: "quote-rotator-slide" });
    // Steuerleiste: ← Pause/Play →
    this.controls = createDiv({ cls: "quote-rotator-controls" });
    const control = (icon, label, action) => {
      const b = this.controls.createEl("button", { cls: "clickable-icon quote-rotator-control", attr: { "aria-label": label } });
      setIcon(b, icon);
      b.addEventListener("click", action);
      return b;
    };
    control("arrow-left", T.prev, () => { this.show(true, "prev"); this.restartTimer(); });
    this.button = control("pause", "", () => { this.paused = !this.paused; this.updateButton(); });
    control("arrow-right", T.next, () => { this.show(true, "next"); this.restartTimer(); });
    control("share", T.share, () => { if (this.current && PLUGIN) new ShareModal(this.app, PLUGIN, quotePayload(this.app, this.current)).open(); });
    el.addEventListener("mouseenter", () => { this.hovered = true; });
    el.addEventListener("mouseleave", () => { this.hovered = false; });
    this.updateButton();
    this.show(false);
    this.restartTimer();
    if (PLUGIN) PLUGIN.quoteViews.add(this);
  }

  onunload() {
    if (PLUGIN) PLUGIN.quoteViews.delete(this);
  }

  // Nach geänderten Einstellungen: dasselbe Zitat im neuen Thema zeichnen
  refresh() {
    if (!this.current) return;
    const card = this.slide.querySelector(".quote-card");
    if (!card) return;
    card.className = "quote-card is-" + quoteTheme(this.current);
  }

  // Nach einem Klick auf einen Pfeil zählt die Wartezeit bis zum nächsten Wechsel neu
  restartTimer() {
    const el = this.containerEl;
    if (this.timer) window.clearInterval(this.timer);
    this.timer = this.registerInterval(window.setInterval(() => {
      if (!this.paused && !this.hovered && !el.contains(el.ownerDocument.activeElement)) this.show(true);
    }, this.seconds * 1000));
  }

  select(i) {
    if (i === this.active) return;
    this.active = i;
    try { window.localStorage.setItem(this.storeKey, String(i)); } catch (e) { /* nur Komfort */ }
    this.updateTabs();
    this.current = null;
    this.history = [];
    this.pos = -1;
    this.show(true);
    this.restartTimer();
  }

  updateTabs() {
    this.tabButtons.forEach((b, i) => {
      b.toggleClass("is-active", i === this.active);
      b.setAttr("aria-pressed", String(i === this.active));
    });
  }

  updateButton() {
    this.button.empty();
    setIcon(this.button, this.paused ? "play" : "pause");
    this.button.setAttr("aria-label", this.paused ? quoteText().resume : quoteText().pause);
    this.button.setAttr("aria-pressed", String(this.paused));
  }

  pick() {
    const files = this.quotes();
    if (!files.length) return null;
    const others = files.length > 1 ? files.filter((f) => f.path !== (this.current && this.current.path)) : files;
    return others[Math.floor(Math.random() * others.length)];
  }

  // Zurück geht durch die bisher gezeigten Zitate, vor wieder nach vorn und danach zu einem neuen
  next(dir) {
    if (dir === "prev") {
      if (this.pos > 0) this.pos--;
      return this.history[this.pos] || null;
    }
    if (this.pos < this.history.length - 1) return this.history[++this.pos];
    const file = !this.history.length && this.startToday ? this.dayQuote() : this.pick();
    if (file) {
      this.history.push(file);
      if (this.history.length > 50) this.history.shift();
      this.pos = this.history.length - 1;
    }
    return file;
  }

  show(fade, dir) {
    const file = this.next(dir);
    if (dir === "prev" && file === this.current) return;
    const draw = () => {
      if (!file) {
        this.slide.empty();
        this.slide.createEl("p", { cls: "quote-rotator-empty", text: quoteText().none(this.folder) });
        return;
      }
      this.current = file;
      buildCard(this.slide, readCard(this.app, file), quoteTheme(file));
      const card = this.slide.querySelector(".quote-card");
      makeOpenable(this.app, card, file);
      cardHead(card, this.controls);
      if (this.startToday && file === this.dayQuote()) cardKicker(card, quoteText().today);
    };
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fade || reduce) { draw(); return; }
    this.slide.addClass("is-fading");
    window.setTimeout(() => { draw(); this.slide.removeClass("is-fading"); }, 700);
  }
}

