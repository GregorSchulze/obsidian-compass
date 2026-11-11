// ```note-header``` zeichnet den farbigen Kopf einer Notiz: Bereich, Status, Titel, Kernaussage, Datum, Bezug.
// Farbe: zuerst das Farbthema der Vorlage (Eigenschaft „vorlage“, Zuordnung in den Einstellungen),
// sonst „color: …“ im Block (früher „farbe:“), sonst das Standard-Thema. Alles kommt live aus den Eigenschaften der Notiz.

// Thema einer Notiz: Vorlage vor „color:“ im Block vor Standard-Thema
function noteTheme(plugin, fm, blockColor) {
  const n = plugin.settings.notes;
  const byTemplate = n.templateThemes[plain(fmGet(fm, "vorlage"))];
  if (THEMES[byTemplate]) return byTemplate;
  if (THEMES[blockColor]) return blockColor;
  return THEMES[n.defaultTheme] ? n.defaultTheme : "sand";
}

class NoteHeader extends MarkdownRenderChild {
  constructor(el, plugin, source, sourcePath) {
    super(el);
    this.plugin = plugin;
    this.app = plugin.app;
    this.sourcePath = sourcePath;
    this.blockColor = themeKey(blockOptions(source).opt.color);
  }

  theme(fm) {
    return noteTheme(this.plugin, fm, this.blockColor);
  }

  onunload() {
    this.plugin.headers.delete(this);
  }

  onload() {
    this.plugin.headers.add(this);
    this.render();
    this.registerEvent(this.app.metadataCache.on("changed", (file) => {
      if (file.path === this.sourcePath) this.render();
    }));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      if (oldPath === this.sourcePath) { this.sourcePath = file.path; this.render(); }
    }));
  }

  render() {
    const file = this.app.vault.getAbstractFileByPath(this.sourcePath);
    const fm = (file && (this.app.metadataCache.getFileCache(file) || {}).frontmatter) || {};
    const el = this.containerEl;
    el.empty();
    const T = noteText();
    const locale = baseText().locale;
    const head = el.createDiv({ cls: "note-header is-" + this.theme(fm), attr: { lang: uiLang() } });

    // Bereich aus dem Ordnerpfad: „60 Write/Fachlektüre/Design“ wird „Write · Fachlektüre / Design“
    const parts = this.sourcePath.split("/").slice(0, -1);
    const area = parts.length ? parts[0].replace(/^\d+\s+/, "").split(" · ")[0] : "";
    const row = head.createDiv({ cls: "note-header-row" });
    row.createSpan({ cls: "note-header-label", text: [area, parts.slice(1).join(" / ")].filter(Boolean).join(" · ") });
    if (plain(fm.status)) row.createSpan({ cls: "note-header-label note-header-pill", text: plain(fm.status) });

    const title = head.createEl("h1", { cls: "note-header-title", text: plain(fm.titel) || (file ? file.basename : "") });
    if (file) this.makeEditable(title, file, fm);
    // Kernaussage: direkt im Kopf bearbeitbar, leer mit blassem Platzhalter
    const leadText = plain(fmGet(fm, "kernaussage"));
    const lead = head.createEl("p", { cls: "note-header-lead" + (leadText ? "" : " is-empty"), text: leadText });
    if (file) this.makeLeadEditable(lead, file, leadText);

    const meta = head.createDiv({ cls: "note-header-meta note-header-label" });
    // Weitere Angaben aus den Vorlagen: Autor bzw. Herkunft, Bewertung, Portionen, Zeit
    const by = plain(fm.author || fm.autor || fm.from || fm.to);
    if (by) meta.createSpan({ text: (fm.to && !fm.autor && !fm.author && !fm.from ? T.to : T.by) + by });
    if (plain(fmGet(fm, "bewertung"))) meta.createSpan({ text: plain(fmGet(fm, "bewertung")) });
    if (plain(fm.servings)) meta.createSpan({ text: plain(fm.servings) + T.servings });
    if (plain(fm.time)) meta.createSpan({ text: plain(fm.time) });
    const date = plain(fm.date || fm.datum);
    const d = /^\d{4}-\d{2}-\d{2}$/.test(date) ? new Date(date + "T12:00:00") : null;
    if (d) meta.createSpan({ text: d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" }) });
    const refs = [].concat(fmGet(fm, "bezug") || []).map(linkTarget).filter(Boolean);
    if (refs.length) {
      const span = meta.createSpan({ text: T.about });
      refs.forEach((ref, i) => {
        if (i) span.appendText(", ");
        const dest = this.app.metadataCache.getFirstLinkpathDest(ref, this.sourcePath);
        const a = span.createEl("a", { text: dest ? dest.basename : ref, href: "#", cls: "note-header-link" });
        a.addEventListener("click", (e) => { e.preventDefault(); this.app.workspace.openLinkText(ref, this.sourcePath, e.ctrlKey || e.metaKey); });
      });
    }
    // Quellen: Webadressen als Link mit Pfeil, Notizen als interner Link, alles andere als Text
    const sources = [].concat(fmGet(fm, "quellen") || []).map((s) => String(s || "").trim()).filter(Boolean);
    if (sources.length) {
      const span = meta.createSpan({ text: T.sources });
      sources.forEach((s, i) => {
        if (i) span.appendText(", ");
        const url = safeLink(s);
        if (url) {
          const a = span.createEl("a", { text: url.hostname.replace(/^www\./, ""), href: url.href, cls: "note-header-link",
            attr: { target: "_blank", rel: "noopener noreferrer", "aria-label": T.sourceAria + url.hostname } });
          setIcon(a.createSpan({ cls: "note-header-arrow", attr: { "aria-hidden": "true" } }), "arrow-up-right");
        } else if (/^\[\[.+\]\]$/.test(s)) {
          const ref = linkTarget(s);
          const dest = this.app.metadataCache.getFirstLinkpathDest(ref, this.sourcePath);
          const a = span.createEl("a", { text: dest ? dest.basename : ref, href: "#", cls: "note-header-link" });
          a.addEventListener("click", (e) => { e.preventDefault(); this.app.workspace.openLinkText(ref, this.sourcePath, e.ctrlKey || e.metaKey); });
        } else {
          span.appendText(s);
        }
      });
    }
    if (fmGet(fm, "teilen") === true) meta.createSpan({ text: T.share });
    const n = this.plugin.settings.notes;
    const cache = (file && this.app.metadataCache.getFileCache(file)) || {};
    // Lesezeit: Wörter ohne Eigenschaften und Codeblöcke, 200 Wörter pro Minute
    if (n.showReadTime && file) {
      const span = meta.createSpan({ cls: "note-header-readtime" });
      this.app.vault.cachedRead(file).then((text) => {
        const body = text.replace(/^---\n[\s\S]*?\n---\n?/, "").replace(/```[\s\S]*?```/g, " ").replace(/%%[\s\S]*?%%/g, " ");
        const words = (body.match(/[\p{L}\p{N}]+/gu) || []).length;
        if (words < 30) { span.remove(); return; }
        span.setText(T.readTime(Math.max(1, Math.round(words / 200)), words.toLocaleString(locale)));
      });
    }
    if (!meta.childElementCount) meta.remove();

    // Fortschritt: erledigte Checkboxen der Notiz
    const tasks = (cache.listItems || []).filter((i) => i.task !== undefined);
    if (n.showProgress && tasks.length) {
      const done = tasks.filter((i) => i.task !== " ").length;
      const box = head.createDiv({ cls: "note-header-progress" });
      const top = box.createDiv({ cls: "note-header-row note-header-label" });
      top.createSpan({ text: T.tasks });
      top.createSpan({ text: done + " / " + tasks.length });
      const bar = box.createDiv({ cls: "note-header-bar", attr: { role: "progressbar", "aria-label": T.tasksDone,
        "aria-valuemin": "0", "aria-valuemax": String(tasks.length), "aria-valuenow": String(done) } });
      bar.createSpan().setCssProps({ width: Math.round((done / tasks.length) * 100) + "%" });
    }

    // Inhalt: automatisch aus den Überschriften ab ##, mit Unterebenen bis zur eingestellten Tiefe
    const sections = (cache.headings || []).filter((h) => h.level >= 2 && h.level <= n.tocDepth);
    if (n.showToc && file && sections.length >= n.tocMin) {
      const toc = el.createEl("nav", { cls: "note-toc", attr: { "aria-label": T.toc } });
      toc.createSpan({ cls: "note-header-label note-toc-label", text: T.toc });
      const stack = [{ level: 1, list: toc.createEl("ol") }];
      for (const h of sections) {
        while (stack.length > 1 && stack[stack.length - 1].level >= h.level) stack.pop();
        const top = stack[stack.length - 1];
        // Jede Überschrift kommt in die Liste der nächsthöheren Ebene, darunter beginnt ihre eigene Unterliste
        const li = top.list.createEl("li");
        const a = li.createEl("a", { text: h.heading, href: "#" });
        a.addEventListener("click", (e) => { e.preventDefault(); this.app.workspace.openLinkText(file.path + "#" + h.heading, this.sourcePath); });
        stack.push({ level: h.level, list: li.createEl("ol") });
      }
      toc.querySelectorAll("ol").forEach((o) => { if (!o.childElementCount) o.remove(); });
    }

    // Themenfarbe an die Notiz weitergeben, z. B. für die Hinweisbox „Merke“
    const view = el.closest(".markdown-preview-view, .markdown-source-view");
    if (view) {
      const th = this.theme(fm);
      view.style.setProperty("--nh-note-light", "var(--nh-" + th + "-light)");
      view.style.setProperty("--nh-note-dark", "var(--nh-" + th + "-dark)");
    }
  }
}

// Titel direkt im Kopf ändern: ohne Eigenschaft „titel“ wird die Datei umbenannt (Links bleiben erhalten),
// mit „titel“ wird nur die Eigenschaft geändert
NoteHeader.prototype.makeEditable = function (el, file, fm) {
  const original = el.textContent;
  const T = noteText();
  el.setAttr("contenteditable", "plaintext-only");
  el.setAttr("spellcheck", "false");
  el.setAttr("title", T.titleTitle);
  el.setAttr("aria-label", T.titleAria);
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); el.blur(); }
    if (e.key === "Escape") { el.textContent = original; el.blur(); }
  });
  el.addEventListener("blur", async () => {
    const value = el.textContent.replace(/\s+/g, " ").trim();
    if (!value || value === original) { el.textContent = original; return; }
    try {
      if (plain(fm.titel)) {
        await this.app.fileManager.processFrontMatter(file, (data) => { data.titel = value; });
        return;
      }
      const name = value.replace(/[\\/:*?"<>|#^[\]]/g, "").trim();
      const folder = file.parent && file.parent.path !== "/" ? file.parent.path + "/" : "";
      const target = folder + name + "." + file.extension;
      if (!name) { el.textContent = original; return; }
      if (this.app.vault.getAbstractFileByPath(target) ||
          this.app.vault.getMarkdownFiles().some((f) => f !== file && f.basename.toLowerCase() === name.toLowerCase())) {
        new Notice(T.nameTaken);
        el.textContent = original;
        return;
      }
      await this.app.fileManager.renameFile(file, target);
    } catch (err) {
      new Notice(T.titleFailed);
      el.textContent = original;
    }
  });
};

// Englische Farbnamen für „color:“ im Block; die Schlüssel der Themen selbst bleiben (sand, blau …)
const THEME_EN = { blue: "blau", sage: "salbei", lavender: "lavendel", ochre: "ocker", mocha: "mokka", black: "mono", "black/white": "mono" };
const themeKey = (v) => { const l = String(v || "").trim().split(/\s+/)[0].toLowerCase(); return THEME_EN[l] || l; };
const THEMES = { sand: "Sand", blau: "Blau", salbei: "Salbei", rose: "Rosé", lavendel: "Lavendel", mint: "Mint", ocker: "Ocker", mokka: "Mokka", mono: "Schwarz/Weiß" };

// Texte für Kopf und Footer der Notizen; die Schlüssel der Farbthemen (sand, blau …) bleiben in beiden Sprachen gleich
const NOTE_TEXT = {
  de: {
    themes: THEMES, by: "Von ", to: "An ", servings: " Portionen", about: "Bezug: ", sources: "Quellen: ", sourceAria: "Quelle: ", share: "Teilen ✓",
    readTime: (min, words) => min + " Min. Lesezeit · " + words + " Wörter", tasks: "Aufgaben", tasksDone: "Aufgaben erledigt", toc: "Inhalt",
    titleTitle: "Klicken, um den Titel zu ändern", titleAria: "Titel, zum Ändern anklicken",
    nameTaken: "Eine Notiz mit diesem Namen gibt es schon. Bitte einen anderen Titel wählen.", titleFailed: "Titel konnte nicht geändert werden.",
    leadPh: "Kernaussage hinzufügen …", leadTitle: "Klicken, um die Kernaussage zu ändern", leadAria: "Kernaussage, zum Ändern anklicken",
    leadFailed: "Kernaussage konnte nicht gespeichert werden.",
    backlinks: "Verweist hierher", related: "Verwandt", tags: "Schlagworte", modified: "Zuletzt geändert", created: "erstellt ",
  },
  en: {
    themes: { sand: "Sand", blau: "Blue", salbei: "Sage", rose: "Rosé", lavendel: "Lavender", mint: "Mint", ocker: "Ochre", mokka: "Mocha", mono: "Black/White" },
    by: "By ", to: "To ", servings: " servings", about: "About: ", sources: "Sources: ", sourceAria: "Source: ", share: "Share ✓",
    readTime: (min, words) => min + " min read · " + words + " words", tasks: "Tasks", tasksDone: "Tasks done", toc: "Contents",
    titleTitle: "Click to change the title", titleAria: "Title, click to change",
    nameTaken: "A note with this name already exists. Please choose a different title.", titleFailed: "Couldn’t change the title.",
    leadPh: "Add a summary …", leadTitle: "Click to change the summary", leadAria: "Summary, click to change",
    leadFailed: "Couldn’t save the summary.",
    backlinks: "Linked from", related: "Related", tags: "Tags", modified: "Last modified", created: "created ",
  },
};
const noteText = () => NOTE_TEXT[uiLang()];
// Anzeigename eines Farbthemas in der eingestellten Sprache
const themeLabel = (key) => noteText().themes[key] || THEMES[key] || key;

const NOTE_DEFAULTS = {
  mode: "auto",
  defaultTheme: "sand",
  sandLight: "#e3d9c6", sandDark: "#4a4232",
  blauLight: "#9ab4e0", blauDark: "#2c3e5c",
  salbeiLight: "#c6d3bd", salbeiDark: "#34433a",
  roseLight: "#e8cfc8", roseDark: "#4d3632",
  lavendelLight: "#d4cde6", lavendelDark: "#3b3550",
  mintLight: "#c3ddd3", mintDark: "#25423b",
  ockerLight: "#e8d7a6", ockerDark: "#4a3f22",
  mokkaLight: "#d9c3b0", mokkaDark: "#4b3529",
  monoLight: "#ffffff", monoDark: "#111111",
  textLight: "#222222", textDark: "#eceae3",
  radius: 12,
  titleFont: "\"Instrument Serif\", Georgia, serif", titleSize: 2.5, titleWeight: "400",
  leadSize: 1.2, leadItalic: true,
  labelFont: "\"Geist Mono\", ui-monospace, Menlo, monospace", labelSize: 0.72, labelUppercase: true,
  showProgress: true,
  mediaLimit: true,
  mediaMax: 560,
  showReadTime: true,
  showToc: true,
  tocMin: 2,
  tocDepth: 4,
  showFooter: true,
  showNav: true,
  templateFolder: "99 System/_Template",
  templateThemes: {
    Write: "salbei", Buch: "blau", Reflexion: "blau", Rezept: "blau",
    Journal: "ocker", Jahresrückblick: "ocker", Everyday: "sand", Note: "sand",
    Code: "lavendel", Person: "rose", Brief: "rose", Story: "mint",
  },
};

// Name einer Vorlage ohne „Template“: „Write Template“ wird „Write“. So steht es auch in der Eigenschaft „vorlage“.
const templateKey = (basename) => basename.replace(/\s*template\s*$/i, "").trim();

const HOWTO_NOTE = "How To – Compass";
const FENCE = "```";
// Anleitung im Einstellungsreiter, je Sprache. Die Schlüsselwörter in den Codeblöcken sind englisch (folder, seconds, today …), die deutschen gelten weiter.
const HOWTO = {
  de: [
    {
      title: "Rotierende Zitate",
      text: "Zeigt reihum ein Zitat aus einem Ordner, mit sanfter Überblendung. Steht z. B. oben auf Home. Mit „start: today“ beginnt er mit dem Zitat des Tages.",
      code: FENCE + "quote-rotator\nfolder: 40 Quotes\nseconds: 17\n" + FENCE,
      tips: [
        "Mit Umschalter: mehrere Ordner mit „;“ trennen, z. B. folder: Zitate = 40 Quotes/Zitate; Fragen = 40 Quotes/Fragen",
        "Oben rechts in der Karte: ← vorheriges Zitat, Pause/Play, → nächstes Zitat, ⇪ teilen.",
        "Maus über der Karte hält den Wechsel an. Klick auf den Zitattext öffnet die Notiz.",
        "seconds: zwischen 5 und 600. Ohne Angabe 17 Sekunden.",
        "Die Schlüsselwörter sind englisch. Ältere deutsche (ordner, sekunden, heute, kachel …) funktionieren weiter.",
      ],
    },
    {
      title: "Zitatkarte in einer Zitat-Notiz",
      text: "Zeigt das Zitat der eigenen Notiz als Karte. Steckt schon im Quote Template.",
      code: FENCE + "quote-card\n" + FENCE,
      tips: [
        "Das Zitat kommt aus dem Notiznamen oder aus der Eigenschaft „quote“.",
        "Die Quellenzeile kommt aus „author“, „source“ und „stelle“, der Link aus „link“, die Übersetzung aus „übersetzung“.",
      ],
    },
    {
      title: "Feste Zitatkarte in einer anderen Notiz",
      text: "Zeigt ein bestimmtes Zitat, ohne zu rotieren, z. B. in einer Reflexion oder im Jahres-Journal. Mehrere Blöcke pro Notiz sind möglich.",
      code: FENCE + "quote-card\nquote: [[Name des Zitats]]\n" + FENCE,
      tips: [
        "Alternativ die Eigenschaft „zitat“ in der Notiz setzen und einen leeren quote-card-Block einfügen. So erscheint die Notiz auch in den Backlinks des Zitats.",
      ],
    },
    {
      title: "Zitat teilen, z. B. auf Instagram",
      text: "Jede Zitatkarte hat oben rechts einen Teilen-Knopf ⇪, auch die rotierende. Er öffnet das Zitat als Bild im Vollbild, in Farbe und Schrift der Karte.",
      code: FENCE + "quote-card\n" + FENCE,
      tips: [
        "Format wählen: Story 9:16, Post 4:5 oder Quadrat 1:1. Dazu hell oder dunkel.",
        "Teilen: öffnet das Teilen-Menü des Geräts, dort Instagram wählen. Erscheint nur, wo das Gerät es erlaubt.",
        "Kopieren: Bild in die Zwischenablage. Speichern: Bild in 99 System/_assets/Quotes als „Datum_Zitat.png“, auf dem iPhone in der Dateien-App.",
        "Vollbild: nur noch das Bild, dann Screenshot machen. Tippen holt die Knöpfe zurück.",
        "Auch über die Befehlspalette („Zitat teilen“) oder das Kontextmenü einer Zitat-Notiz.",
        "Farbpunkte unten wechseln das Farbthema, „Quelle“ blendet die Quellenzeile aus.",
        "↑ und ↓ verschieben den Text innerhalb der Safezone, „Mitte“ setzt ihn zurück.",
        "„Text bearbeiten“ ändert Text und Quellenzeile nur für das Bild, die Notiz bleibt unverändert. „Original“ stellt alles wieder her.",
        "A− und A+ ändern die Schriftgröße, „Zentriert“ die Ausrichtung, „Rahmen“ setzt einen feinen Rahmen.",
        "Zu lange Texte verteilen sich auf mehrere Bilder (Karussell). Mit ‹ › blättern, Teilen und Speichern nehmen alle mit.",
        "Bei Zitaten trägt Teilen, Kopieren oder Speichern das Datum in „geteilt“ ein. Die Quote-Liste zeigt „Noch nicht geteilt“.",
        "Safezone: Text bleibt aus den Bereichen, die Instagram überdeckt (Story oben und unten) oder im Profilraster abschneidet (Post und Quadrat seitlich). Die gestrichelte Markierung erscheint nur in der Vorschau.",
      ],
    },
    {
      title: "Beliebigen Text als Bild teilen",
      text: "Geht in jeder Notiz, auch mit normalem Fließtext. Das Bild hat die Farbe der Notiz, also das Thema ihrer Vorlage.",
      code: "Text markieren → Rechtsklick → „Auswahl als Bild teilen“",
      tips: [
        "Ohne Markierung wird der Absatz an der Schreibmarke geteilt („Absatz als Bild teilen“).",
        "Auf dem iPhone: Text markieren, dann in der Leiste über der Tastatur auf ⇪ tippen. Ohne Tastatur: ⇪ oben in der Notiz oder Menü ⋮ → „Text als Bild teilen“.",
        "Ohne Markierung öffnet sich der Dialog mit einem Eingabefeld, dort den Text eintippen oder einfügen.",
        "Überschriften (#, ##, ###) erscheinen im Bild im selben Stil wie in der Notiz, mit Serifen, größer und in Schwarz bzw. Weiß; der Fließtext serifenlos und etwas weicher, immer gut lesbar. Fett, Links und Codeblöcke werden zu reinem Text, Listen zu „•“.",
        "Unter „Text bearbeiten“ machst du mit „## “ am Zeilenanfang selbst eine Überschrift.",
        "Oben steht der Notiztitel, „Titel“ blendet ihn aus. Zu lange Texte werden gekürzt und mit … markiert.",
      ],
    },
    {
      title: "Zitat speichern",
      text: "Macht aus einer Markierung eine neue Zitat-Notiz, zum Beispiel beim Lesen einer Buchnotiz. Autor und Quelle werden aus Buch- und Mediennotizen übernommen.",
      code: "Text markieren → Rechtsklick → „Als Zitat speichern“",
      tips: [
        "Auf dem iPhone: Text markieren, dann in der Leiste über der Tastatur auf das Anführungszeichen tippen.",
        "Ohne Markierung: „＋ Zitat“ auf Home oder Befehlspalette → „Markierung als Zitat speichern“.",
        "Gibt es das Zitat schon, öffnet sich die vorhandene Notiz statt eines Duplikats.",
      ],
    },
    {
      title: "Zitat des Tages",
      text: "Jeden Tag ein anderes Zitat, am selben Tag überall dasselbe. In Journalen gilt das Datum der Notiz.",
      code: FENCE + "quote-card\ntoday: 40 Quotes\n" + FENCE,
      tips: [
        "Steckt schon in der Journal-Vorlage.",
        "Auf Home: „dailyquote: yes“ im home-dashboard-Block, dann beginnen die rotierenden Zitate mit dem Zitat des Tages.",
      ],
    },
    {
      title: "Bilder und Videos anordnen",
      text: "Am Mac an der unteren rechten Ecke eines Bildes ziehen (eingebaut in Obsidian). Auf iPhone und iPad das Bild antippen und den braunen Griff unten rechts mit dem Finger ziehen. Zum Anordnen mit der Maus über ein Bild oder Video fahren bzw. es antippen.",
      code: "![[Bild.png|right|300]]",
      tips: [
        "Links und Rechts: Text fließt daneben. Auf dem iPhone steht das Bild über dem Text.",
        "Mittig: in der Mitte, ohne Text daneben. Nebeneinander: zwei Bilder in einer Zeile, beide bekommen „row“.",
        "− und + machen ein Bild kleiner oder größer, auf Mac und iPhone.",
        "↑ und ↓ verschieben die Zeile mit dem Bild. Normal entfernt die Anordnung.",
        "Die Anordnung steht als Stichwort im Link vor der Größe: left, center, right, row. Ältere deutsche (links, mitte, rechts, reihe) gelten weiter. Ziehen an der Bildecke ändert nur die Zahl.",
        "Bilder und Videos ohne eigene Größe sind höchstens 560 Pixel breit. Einstellbar unter Notizen → Bilder und Videos.",
      ],
    },
    {
      title: "Farbiger Kopf für Notizen",
      text: "Kopf mit Bereich, Status, Titel, Kernaussage, Datum, Bezug und Quellen. Steckt schon im Write Template.",
      code: FENCE + "note-header\n" + FENCE,
      tips: [
        "Titel ändern: in den Titel im Kopf klicken, tippen, Enter. Esc bricht ab.",
        "Farbe: über die Eigenschaft „vorlage“ und die Zuordnung im Bereich Notizen. Einzeln geht auch „color: rose“ im Block.",
        "Eigenschaften: status, kernaussage, bezug, quellen, teilen, date.",
        "## wird zur großen Serif-Überschrift, ### zum kleinen Etikett.",
      ],
    },
    {
      title: "Startseite",
      text: "Begrüßung, rotierende Zitate, Bereiche als Kacheln, Fortschritt und zuletzt bearbeitete Notizen. Steht in Home.",
      code: FENCE + "home-dashboard\nname: Anna\nquotes: 40 Quotes\ndailyquote: yes\ntile: Media | 50 Media | @media\ntile: Connect | 20 Connect | [[Recipes]], [[Family]]\n" + FENCE,
      tips: [
        "Eine Zeile „tile: Titel | Ordner | Links“ pro Kachel. Statt Links gehen @media, @write und @quotes.",
        "Benennst du eine verlinkte Notiz um, im Block den Namen nachtragen.",
      ],
    },
    {
      title: "Einrichtung für Einsteiger",
      text: "Legt für jemanden, der neu mit Obsidian anfängt, ein fertiges Notizsystem an: Ordner, Vorlagen, Listen, Startseite und 100 Startzitate, auf Deutsch oder Englisch. In einem leeren Vault öffnet sie sich von selbst.",
      code: "Befehlspalette → „Einrichtung starten“",
      tips: [
        "Unter „Themen“ wählt „Grundsystem“ alles Wichtige aus, wenn man noch nicht weiß, wie man anfangen soll.",
        "Vor dem Anlegen zeigt eine Vorschau den Ordnerbaum. Vorhandenes wird nie überschrieben.",
        "Empfohlene Plugins: Am Ende öffnet ein Knopf pro Plugin seine offizielle Seite in Obsidian.",
        "Nach der Installation von Templater: „Trigger Templater on new file creation“ einschalten, pro Gerät.",
        "Vault mit Notizen: „Einrichtung starten“ bietet „In meinen Vault einbauen“. Compass nutzt dann deine Ordner und Vorlagen und ergänzt nur, was du auswählst.",
      ],
    },
  ],
  en: [
    {
      title: "Rotating quotes",
      text: "Shows one quote after another from a folder, with a gentle cross-fade. Sits at the top of Home, for example. With “start: today” it begins with the quote of the day.",
      code: FENCE + "quote-rotator\nfolder: 40 Quotes\nseconds: 17\n" + FENCE,
      tips: [
        "With a switcher: separate several folders with “;”, e.g. folder: Quotes = 40 Quotes/Quotes; Questions = 40 Quotes/Questions",
        "Top right of the card: ← previous quote, pause/play, → next quote, ⇪ share.",
        "Hovering over the card pauses the rotation. Clicking the quote text opens the note.",
        "seconds: between 5 and 600. Without it, 17 seconds.",
        "Older German keywords (ordner, sekunden, heute, kachel …) keep working.",
      ],
    },
    {
      title: "Quote card in a quote note",
      text: "Shows the note’s own quote as a card. Already included in the Quote Template.",
      code: FENCE + "quote-card\n" + FENCE,
      tips: [
        "The quote comes from the note name or from the property “quote”.",
        "The source line comes from “author”, “source” and “location”, the link from “link”, the translation from “translation”.",
      ],
    },
    {
      title: "Fixed quote card in another note",
      text: "Shows one particular quote without rotating, e.g. in a reflection or a yearly journal. Several blocks per note are possible. The option zitat means quote.",
      code: FENCE + "quote-card\nquote: [[Name of the quote]]\n" + FENCE,
      tips: [
        "Alternatively, set the property “zitat” in the note and add an empty quote-card block. That way the note also shows up in the quote’s backlinks.",
      ],
    },
    {
      title: "Share a quote, e.g. on Instagram",
      text: "Every quote card has a share button ⇪ in the top right, the rotating one too. It opens the quote as an image in full screen, in the card’s colours and font.",
      code: FENCE + "quote-card\n" + FENCE,
      tips: [
        "Choose a format: Story 9:16, Post 4:5 or Square 1:1. Plus light or dark.",
        "Share: opens the device’s share menu, choose Instagram there. Only appears where the device allows it.",
        "Copy: image to the clipboard. Save: image as “date_quote.png” in the folder set under Quotes → Sharing; on the iPhone you’ll find it in the Files app.",
        "Full screen: only the image, then take a screenshot. Tapping brings the buttons back.",
        "Also via the command palette (“Share quote”) or the context menu of a quote note.",
        "The colour dots at the bottom switch the colour theme, “Source” hides the source line.",
        "↑ and ↓ move the text within the safe zone, “Middle” resets it.",
        "“Edit text” changes the text and source line only for the image; the note stays unchanged. “Original” restores everything.",
        "A− and A+ change the font size, “Centred” the alignment, “Frame” adds a fine frame.",
        "Texts that are too long are spread across several images (carousel). Browse with ‹ ›; Share and Save include all of them.",
        "For quotes, sharing, copying or saving enters the date in “shared”. The quote list shows “Not shared yet”.",
        "Safe zone: text stays out of the areas that Instagram covers (Story, top and bottom) or crops in the profile grid (Post and Square, at the sides). The dashed marking only appears in the preview.",
      ],
    },
    {
      title: "Share any text as an image",
      text: "Works in every note, with ordinary body text too. The image takes the note’s colour, i.e. the theme of its template.",
      code: "Select text → right-click → “Share selection as image”",
      tips: [
        "Without a selection, the paragraph at the cursor is shared (“Share paragraph as image”).",
        "On the iPhone: select text, then tap ⇪ in the bar above the keyboard. Without the keyboard: ⇪ at the top of the note or menu ⋮ → “Share text as image”.",
        "With nothing selected, the dialog opens with an input field; type or paste your text there.",
        "Headings (#, ##, ###) appear in the image in the same style as in the note: with serifs, larger and in black or white. Body text is sans-serif and a little softer, always easy to read. Bold, links and code blocks become plain text, lists become “•”.",
        "Under “Edit text”, “## ” at the start of a line makes a heading of your own.",
        "The note title sits at the top; “Title” hides it. Texts that are too long are spread across several images.",
      ],
    },
    {
      title: "Save quote",
      text: "Turns a selection into a new quote note, for example while reading a book note. Author and source are taken over from book and media notes.",
      code: "Select text → right-click → “Save as quote”",
      tips: [
        "On the iPhone: select text, then tap the quotation mark in the bar above the keyboard.",
        "Without a selection: “＋ Quote” on Home or command palette → “Save selection as quote”.",
        "If the quote already exists, the existing note opens instead of a duplicate.",
      ],
    },
    {
      title: "Quote of the day",
      text: "A different quote every day, the same one everywhere on the same day. In journals, the note’s date counts.",
      code: FENCE + "quote-card\ntoday: 40 Quotes\n" + FENCE,
      tips: [
        "Already included in the Journal template.",
        "On Home: “dailyquote: yes” in the home-dashboard block, then the rotating quotes start with the quote of the day.",
      ],
    },
    {
      title: "Arrange images and videos",
      text: "On the Mac, drag the bottom right corner of an image (built into Obsidian). On iPhone and iPad, tap the image and drag the brown handle at the bottom right with your finger. To arrange, hover over an image or video with the mouse or tap it.",
      code: "![[Image.png|right|300]]",
      tips: [
        "Left and Right: text flows beside it. On the iPhone the image sits above the text.",
        "Centred: in the middle, with no text beside it. Side by side: two images in one line, both get “row”.",
        "− and + make an image smaller or larger, on Mac and iPhone.",
        "↑ and ↓ move the line with the image. Normal removes the arrangement.",
        "The arrangement is stored as a keyword in the link, before the size: left, center, right, row. Older German ones (links, mitte, rechts, reihe) keep working. Dragging the image corner only changes the number.",
        "Images and videos without a size of their own are at most 560 pixels wide. Adjustable under Notes → Images and videos.",
      ],
    },
    {
      title: "Coloured header for notes",
      text: "Header with area, status, title, summary, date, about and sources. Already included in the templates from the setup.",
      code: FENCE + "note-header\n" + FENCE,
      tips: [
        "Change the title: click into the title in the header, type, Enter. Esc cancels.",
        "Colour: via the property “template” and the assignment in the Notes section. For a single note, “color: rose” in the block works too.",
        "Properties: status, summary, about, sources, share, date.",
        "## becomes a large serif heading, ### a small label.",
      ],
    },
    {
      title: "Home page",
      text: "Greeting, rotating quotes, areas as tiles, progress and recently edited notes. Lives in Home.",
      code: FENCE + "home-dashboard\nname: Anna\nquotes: 40 Quotes\ndailyquote: yes\ntile: Media | 50 Media | @media\ntile: Connect | 20 Connect | [[Recipes]], [[Family]]\n" + FENCE,
      tips: [
        "One line “tile: Title | Folder | Links” per tile. Instead of links, @media, @write and @quotes work.",
        "If you rename a linked note, update its name in the block.",
      ],
    },
    {
      title: "Setup for beginners",
      text: "Creates a ready-made note system for someone new to Obsidian: folders, templates, lists, a home page and 100 starter quotes, in English or German. In an empty vault it opens by itself.",
      code: "Command palette → “Start setup”",
      tips: [
        "On the topics step, “I don’t know yet” picks the basic system with everything important, if you’re not sure how to start.",
        "Before anything is created, a preview shows the folder tree. Nothing that already exists is ever overwritten.",
        "Recommended plugins: at the end, one button per plugin opens its official page in Obsidian.",
        "After installing Templater: turn on “Trigger Templater on new file creation”, per device.",
        "Vault with notes: “Start setup” offers “Add to my vault”. Compass then uses your folders and templates and only adds what you choose.",
      ],
    },
  ],
};

// Kernaussage direkt im Kopf ändern: schreibt in die Eigenschaft „kernaussage“
NoteHeader.prototype.makeLeadEditable = function (el, file, original) {
  const T = noteText();
  el.setAttr("contenteditable", "plaintext-only");
  el.setAttr("data-placeholder", T.leadPh);
  el.setAttr("title", T.leadTitle);
  el.setAttr("aria-label", T.leadAria);
  el.addEventListener("focus", () => el.removeClass("is-empty"));
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); el.blur(); }
    if (e.key === "Escape") { el.textContent = original; el.blur(); }
  });
  el.addEventListener("blur", async () => {
    const value = el.textContent.replace(/\s+/g, " ").trim();
    if (!value) el.addClass("is-empty");
    if (value === original) { el.textContent = original; return; }
    try {
      await this.app.fileManager.processFrontMatter(file, (data) => { data[fmKey(data, "kernaussage")] = value || null; });
    } catch (err) {
      new Notice(T.leadFailed);
      el.textContent = original;
    }
  });
};

// ```note-footer``` am Ende einer Notiz: Verweise, Verwandtes, Schlagworte, Daten und Vor/Zurück im Ordner
class NoteFooter extends MarkdownRenderChild {
  constructor(el, plugin, sourcePath) {
    super(el);
    this.plugin = plugin;
    this.app = plugin.app;
    this.sourcePath = sourcePath;
  }

  onload() {
    this.render();
    // Verweise ändern sich, wenn andere Notizen sich ändern: gebündelt neu zeichnen
    const later = () => { window.clearTimeout(this.timer); this.timer = window.setTimeout(() => this.render(), 1500); };
    this.registerEvent(this.app.metadataCache.on("resolved", later));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      if (oldPath === this.sourcePath) this.sourcePath = file.path;
      later();
    }));
    this.plugin.footers.add(this);
  }

  onunload() {
    window.clearTimeout(this.timer);
    this.plugin.footers.delete(this);
  }

  link(parent, file, text) {
    const a = parent.createEl("a", { text: text || file.basename, href: "#", cls: "note-footer-link" });
    a.addEventListener("click", (e) => { e.preventDefault(); this.app.workspace.openLinkText(file.path, this.sourcePath, e.ctrlKey || e.metaKey); });
    return a;
  }

  render() {
    const n = this.plugin.settings.notes;
    const el = this.containerEl;
    el.empty();
    const file = this.app.vault.getAbstractFileByPath(this.sourcePath);
    if (!file || !n.showFooter) return;
    const cache = this.app.metadataCache.getFileCache(file) || {};
    const fm = cache.frontmatter || {};
    // Footer in der Farbe des Kopfs, damit das Ende der Notiz erkennbar ist
    const th = noteTheme(this.plugin, fm, "");
    const foot = el.createDiv({ cls: "note-footer" });
    foot.style.setProperty("--nf-light", "var(--nh-" + th + "-light)");
    foot.style.setProperty("--nf-dark", "var(--nh-" + th + "-dark)");
    const col = (label) => { const c = foot.createDiv({ cls: "note-footer-col" }); c.createSpan({ cls: "note-header-label note-footer-label", text: label }); return c; };

    const resolved = this.app.metadataCache.resolvedLinks || {};
    const back = Object.keys(resolved).filter((src) => src !== file.path && resolved[src][file.path])
      .map((src) => this.app.vault.getAbstractFileByPath(src)).filter(Boolean)
      .sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, 8);
    const T = noteText();
    if (back.length) { const ul = col(T.backlinks).createEl("ul"); back.forEach((f) => this.link(ul.createEl("li"), f)); }

    const related = [].concat(fm.related || []).map(linkTarget).filter(Boolean)
      .map((r) => this.app.metadataCache.getFirstLinkpathDest(r, this.sourcePath)).filter(Boolean);
    if (related.length) { const ul = col(T.related).createEl("ul"); related.forEach((f) => this.link(ul.createEl("li"), f)); }

    const tags = [...new Set([].concat(fm.tags || []).map((x) => String(x).replace(/^#/, ""))
      .concat((cache.tags || []).map((x) => x.tag.replace(/^#/, ""))).filter(Boolean))];
    if (tags.length) { const c = col(T.tags).createDiv({ cls: "note-footer-tags" }); tags.forEach((x) => c.createSpan({ cls: "note-footer-tag", text: x })); }

    const fmt = (ms) => new Date(ms).toLocaleDateString(baseText().locale, { day: "numeric", month: "short", year: "numeric" });
    const dates = col(T.modified);
    dates.createDiv({ text: fmt(file.stat.mtime) });
    dates.createDiv({ cls: "note-footer-muted", text: T.created + fmt(file.stat.ctime) });

    // Vor/Zurück: Notizen im selben Ordner, nach Namen sortiert
    if (n.showNav && file.parent && file.parent.children) {
      const coll = new Intl.Collator(uiLang(), { numeric: true, sensitivity: "base" });
      const sib = file.parent.children.filter((f) => f.extension === "md" && !f.basename.startsWith("_"))
        .sort((a, b) => coll.compare(a.basename, b.basename));
      const i = sib.indexOf(file);
      if (sib.length > 1 && i >= 0) {
        const nav = foot.createDiv({ cls: "note-footer-nav note-header-label" });
        if (i > 0) this.link(nav, sib[i - 1], "← " + sib[i - 1].basename); else nav.createSpan();
        if (i < sib.length - 1) this.link(nav, sib[i + 1], sib[i + 1].basename + " →");
      }
    }
  }
}

