// ```home-dashboard``` baut die Startseite: Begrüßung, Zitat, Bereiche als Kacheln, Fortschritt, zuletzt bearbeitet.
// Optionen je Zeile „key: value“, Kacheln als „tile: Title | Folder | [[Link|Text]], …“ oder mit @media, @write, @quotes.
// Die deutschen Schlüssel aus älteren Notizen (kachel, zitate, @medien …) gelten weiter.
const DASH_TEXT = {
  de: { locale: "de-DE", morning: "Guten Morgen", day: "Guten Tag", evening: "Guten Abend", capture: "＋ Schnell erfassen", captureAria: (n) => `Schnell erfassen, ${n} Notizen in der Inbox`,
    quote: "＋ Zitat", text: "＋ Text", areas: "Bereiche", all: "Alle Notizen ↗", entries: "Einträge", open: "offen", reading: "Leseliste", watching: "Watchlist",
    listening: "Podcasts", pro: "Fachlektüre", texts: (n) => (n === 1 ? " Text" : " Texte"), firstText: "＋ Ersten Text schreiben", quotes: " Zitate", overview: "Übersicht",
    notes: (n) => (n === 1 ? " Notiz" : " Notizen"), cont: "Weitermachen", booksRead: "Bücher gelesen", filmsSeen: "Filme & Serien gesehen", recent: "Zuletzt bearbeitet" },
  en: { locale: "en-GB", morning: "Good morning", day: "Good afternoon", evening: "Good evening", capture: "＋ Quick note", captureAria: (n) => `Quick note, ${n} notes in the inbox`,
    quote: "＋ Quote", text: "＋ Text", areas: "Areas", all: "All notes ↗", entries: "entries", open: "open", reading: "Reading list", watching: "Watchlist",
    listening: "Podcasts", pro: "Professional reading", texts: (n) => (n === 1 ? " text" : " texts"), firstText: "＋ Write your first text", quotes: " quotes", overview: "Overview",
    notes: (n) => (n === 1 ? " note" : " notes"), cont: "Keep going", booksRead: "Books read", filmsSeen: "Films & series watched", recent: "Recently edited" },
};
const dashText = () => DASH_TEXT[uiLang()];
// Unterordner der Medien, auf Deutsch (bestehende Vaults) oder Englisch (Einrichtung)
// Kachel-Kürzel: englisch, deutsche aus älteren Notizen gelten weiter
const tileToken = (s) => ({ "@medien": "@media", "@zitate": "@quotes", "@texte": "@write" })[s.toLowerCase()] || s;
// Auch übliche Namen aus anderen Vaults (Movies, Films, Audiobooks …), damit das Einbauen vorhandene Ordner erkennt
const MEDIA_SUBS = { reading: ["Bücher", "Artikel", "Books", "Articles"], watching: ["Filme & Serien", "Movies & Series", "Movies", "Films", "Filme", "Series", "Serien"],
  listening: ["Podcasts & Hörbücher", "Podcasts & Audiobooks", "Podcasts", "Audiobooks", "Hörbücher"], pro: ["Fachlektüre"] };

class HomeDashboard extends MarkdownRenderChild {
  constructor(el, app, source, sourcePath) {
    super(el);
    this.app = app;
    this.sourcePath = sourcePath;
    const de = PLUGIN && PLUGIN.settings.noteLang === "de";
    const { opt, list } = blockOptions(source);
    this.opt = Object.assign({
      name: "", quotes: defaultQuoteFolder(), seconds: "17", inbox: "00 Inbox", capture: "_Quick Notes",
      media: (PLUGIN && PLUGIN.settings.mediaFolder) || DEFAULTS.mediaFolder, readingplan: de ? "Leseplan" : "Reading Plan",
      template: (PLUGIN && PLUGIN.settings.quoteTemplate) || DEFAULTS.quoteTemplate, all: "",
    }, opt);
    // Nur an den ersten beiden „|“ trennen, Links wie [[Notiz|Text]] enthalten selbst eins
    this.tiles = (list.tile || []).map((v) => v.match(/^([^|]+)\|([^|]+)(?:\|(.*))?$/)).filter(Boolean)
      .map((p) => ({ title: p[1].trim(), folder: p[2].trim().replace(/\/+$/, ""), links: tileToken((p[3] || "").trim()) }));
  }

  onload() {
    const el = this.containerEl;
    el.empty();
    el.addClass("home-dash");
    this.head = el.createDiv({ cls: "home-dash-head" });
    const quote = el.createDiv({ cls: "home-dash-quote" });
    const today = isYes(this.opt.dailyquote) ? "\nstart: today" : "";
    this.addChild(new QuoteRotator(quote, this.app, "folder: " + this.opt.quotes + "\nseconds: " + this.opt.seconds + today));
    this.body = el.createDiv();
    this.refresh();
    // Zahlen und Listen nach Änderungen im Vault neu zeichnen, gebündelt
    const later = () => { window.clearTimeout(this.timer); this.timer = window.setTimeout(() => this.refresh(), 1500); };
    for (const ev of ["create", "delete", "rename"]) this.registerEvent(this.app.vault.on(ev, later));
    this.registerEvent(this.app.metadataCache.on("changed", later));
  }

  onunload() {
    window.clearTimeout(this.timer);
  }

  refresh() {
    this.renderHead();
    this.renderBody();
  }

  files(folder) {
    return this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(folder + "/"));
  }

  fm(file) {
    return (this.app.metadataCache.getFileCache(file) || {}).frontmatter || {};
  }

  // Einträge mit Eigenschaft „bewertung“: [bewertet, gesamt]
  rated(folders) {
    const items = folders.flatMap((f) => this.files(f)).filter((f) => fmGet(this.fm(f), "bewertung") !== undefined);
    return [items.filter((f) => plain(fmGet(this.fm(f), "bewertung")) !== "").length, items.length];
  }

  link(parent, target, label, cls) {
    const dest = this.app.metadataCache.getFirstLinkpathDest(target, this.sourcePath);
    const a = parent.createEl("a", {
      text: label || target,
      href: "#",
      cls: ["home-dash-link", dest ? "" : "is-unresolved", cls || ""].join(" ").trim(),
    });
    a.addEventListener("click", (e) => {
      e.preventDefault();
      this.app.workspace.openLinkText(target, this.sourcePath, e.ctrlKey || e.metaKey);
    });
    return a;
  }

  renderHead() {
    const h = this.head;
    h.empty();
    const now = new Date();
    const D = dashText();
    h.createEl("p", { cls: "home-dash-label", text: now.toLocaleDateString(D.locale, { weekday: "long", day: "numeric", month: "long" }) });
    const hour = now.getHours();
    const greet = hour < 11 ? D.morning : hour < 17 ? D.day : D.evening;
    h.createEl("h1", { cls: "home-dash-title", text: greet + (this.opt.name ? ", " + this.opt.name : "") });
    const actions = h.createDiv({ cls: "home-dash-actions" });
    const capture = this.link(actions, this.opt.capture, D.capture, "home-dash-btn mod-cta");
    const inbox = this.files(this.opt.inbox).length;
    if (inbox) {
      capture.createSpan({ cls: "home-dash-count", text: String(inbox) });
      capture.setAttr("aria-label", D.captureAria(inbox));
    }
    const quote = actions.createEl("a", { cls: "home-dash-link home-dash-btn", text: D.quote, href: "#" });
    quote.addEventListener("click", (e) => { e.preventDefault(); this.newQuote(); });
    if (this.app.metadataCache.getFirstLinkpathDest("Writing List.base", this.sourcePath)) this.link(actions, "Writing List.base", D.text, "home-dash-btn");
  }

  // Neues Zitat: Erfassen-Fenster mit Autor, Quelle, Kategorie
  newQuote() {
    if (PLUGIN) new QuoteCaptureModal(this.app, PLUGIN, { text: "", file: null }).open();
  }

  renderBody() {
    const b = this.body;
    b.empty();
    const areas = b.createDiv({ cls: "home-dash-section" });
    const head = areas.createDiv({ cls: "home-dash-sechead" });
    const D = dashText();
    head.createEl("p", { cls: "home-dash-label", text: D.areas });
    if (this.opt.all) this.link(head, this.opt.all, D.all, "home-dash-more");
    const grid = areas.createDiv({ cls: "home-dash-grid" });
    for (const t of this.tiles) this.renderTile(grid, t);
    const two = b.createDiv({ cls: "home-dash-two" });
    this.renderProgress(two.createDiv({ cls: "home-dash-section" }));
    this.renderRecent(two.createDiv({ cls: "home-dash-section" }));
  }

  renderTile(grid, t) {
    const tile = grid.createDiv({ cls: "home-dash-tile" });
    const num = (t.folder.match(/^(\d+)\s/) || [])[1];
    const count = this.files(t.folder).length;
    const label = tile.createEl("p", { cls: "home-dash-label" });
    tile.createEl("h3", { cls: "home-dash-tile-title", text: t.title });
    const ul = tile.createEl("ul");
    const row = (target, text, value) => {
      const li = ul.createEl("li");
      this.link(li, target, text);
      if (value != null) li.createSpan({ cls: "home-dash-stat", text: value });
    };
    const D = dashText();
    if (t.links === "@media") {
      label.setText((num ? num + " · " : "") + count + " " + D.entries);
      const R = t.folder;
      const exist = (names) => names.filter((n) => this.app.vault.getAbstractFileByPath(R + "/" + n));
      const open = (names) => { const [done, all] = this.rated(names.map((f) => R + "/" + f)); return (all - done) + " " + D.open; };
      let any = false;
      for (const [key, base] of [["reading", "Reading List.base"], ["watching", "Watching List.base"], ["listening", "Listening List.base"], ["pro", "Reading List.base"]]) {
        const subs = exist(MEDIA_SUBS[key]);
        if (subs.length) { row(base, D[key], open(subs)); any = true; }
      }
      // Medienordner ohne Unterordner, z. B. nur „Books“: alles darin zählt zur Leseliste
      if (!any) { const [done, all] = this.rated([R]); row("Reading List.base", D.reading, (all - done) + " " + D.open); }
    } else if (t.links === "@write") {
      label.setText((num ? num + " · " : "") + count + D.texts(count));
      row("Writing List.base", "Writing List");
      if (!count) row("Writing List.base", D.firstText);
    } else if (t.links === "@quotes") {
      const folder = this.app.vault.getAbstractFileByPath(t.folder);
      const subs = (folder && folder.children ? folder.children.filter((c) => c.children) : [])
        .sort((a, b) => this.files(b.path).length - this.files(a.path).length);
      // Ohne Unterordner zählen die Zitate direkt im Ordner
      const total = subs.length ? subs.reduce((n, x) => n + this.files(x.path).length, 0) : this.files(t.folder).filter((f) => f.extension === "md").length;
      label.setText((num ? num + " · " : "") + total + D.quotes);
      const overview = this.app.metadataCache.getFirstLinkpathDest("_Quotes", this.sourcePath) ? "_Quotes" : "Quote List.base";
      for (const x of subs) row(overview, x.name, String(this.files(x.path).length));
      row(overview, D.overview);
    } else {
      label.setText((num ? num + " · " : "") + count + D.notes(count));
      for (const m of t.links.matchAll(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g)) row(m[1].trim(), (m[2] || m[1]).trim());
    }
  }

  renderProgress(sec) {
    const D = dashText();
    sec.createDiv({ cls: "home-dash-sechead" }).createEl("p", { cls: "home-dash-label", text: D.cont });
    const bar = (target, text, done, all) => {
      const box = sec.createDiv({ cls: "home-dash-progress" });
      const top = box.createDiv({ cls: "home-dash-progress-row" });
      this.link(top, target, text);
      top.createSpan({ cls: "home-dash-label", text: done + " / " + all });
      const track = box.createDiv({
        cls: "home-dash-bar",
        attr: { role: "progressbar", "aria-label": text, "aria-valuemin": "0", "aria-valuemax": String(all), "aria-valuenow": String(done) },
      });
      track.createSpan().setCssProps({ width: (all ? Math.max(2, Math.round((done / all) * 100)) : 0) + "%" });
    };
    const plan = this.app.metadataCache.getFirstLinkpathDest(this.opt.readingplan, this.sourcePath);
    const tasks = ((plan && this.app.metadataCache.getFileCache(plan)) || {}).listItems || [];
    const todo = tasks.filter((i) => i.task !== undefined);
    if (plan) bar(this.opt.readingplan, plan.basename, todo.filter((i) => i.task !== " ").length, todo.length);
    const R = this.opt.media;
    const [booksDone, books] = this.rated([R + "/Bücher", R + "/Books"]);
    if (books) bar("Reading List.base", D.booksRead, booksDone, books);
    const [filmsDone, films] = this.rated([R + "/Filme & Serien", R + "/Movies & Series"]);
    if (films) bar("Watching List.base", D.filmsSeen, filmsDone, films);
  }

  renderRecent(sec) {
    sec.createDiv({ cls: "home-dash-sechead" }).createEl("p", { cls: "home-dash-label", text: dashText().recent });
    const ul = sec.createEl("ul", { cls: "home-dash-recent" });
    const recent = this.app.vault.getMarkdownFiles()
      .filter((f) => f.path !== this.sourcePath && !f.path.startsWith("99 System/") && !f.path.includes("/Jairus Joer/Artikel/"))
      .sort((a, b) => b.stat.mtime - a.stat.mtime)
      .slice(0, 6);
    for (const f of recent) {
      const li = ul.createEl("li");
      this.link(li, f.path, f.basename);
      const area = f.path.includes("/") ? f.path.split("/")[0].replace(/^\d+\s+/, "").split(" · ")[0] : "";
      li.createSpan({ cls: "home-dash-label", text: area });
    }
  }
}

