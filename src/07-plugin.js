// Befehle, Kontextmenüs und Hinweise. Befehlsnamen werden beim Laden gesetzt, Menüs bei jedem Öffnen.
const PLUGIN_TEXT = {
  de: {
    shareQuote: "Zitat teilen", shareText: "Text als Bild teilen", setup: "Einrichtung starten / Start setup", saveQuote: "Markierung als Zitat speichern",
    saveAsQuote: "Als Zitat speichern", shareSelection: "Auswahl als Bild teilen", shareParagraph: "Absatz als Bild teilen",
    templater: "Compass: Ordner-Vorlagen an Templater übergeben. Jetzt in den Templater-Einstellungen „Trigger Templater on new file creation“ einschalten.",
    noText: "Kein Text markiert. Tippe deinen Text unten ein oder markiere vorher eine Stelle.",
  },
  en: {
    shareQuote: "Share quote", shareText: "Share text as image", setup: "Start setup", saveQuote: "Save selection as quote",
    saveAsQuote: "Save as quote", shareSelection: "Share selection as image", shareParagraph: "Share paragraph as image",
    templater: "Compass: folder templates handed to Templater. Now turn on “Trigger Templater on new file creation” in Templater’s settings.",
    noText: "No text selected. Type your text below or select a passage first.",
  },
};
const pluginText = () => PLUGIN_TEXT[uiLang()];

module.exports = class QuoteCardPlugin extends Plugin {
  async onload() {
    const stored = await this.loadData();
    const data = stored || {};
    // Frühere Fassung kannte nur eine Farbe: die wird zur hellen Variante
    if (data.background && !data.bgLight) data.bgLight = data.background;
    if (data.color && !data.colorLight) data.colorLight = data.color;
    delete data.background;
    delete data.color;
    const notes = Object.assign(JSON.parse(JSON.stringify(NOTE_DEFAULTS)), data.notes || {});
    this.settings = Object.assign({}, DEFAULTS, data, { notes });
    this.headers = new Set();
    this.footers = new Set();
    this.settings.categoryThemes = Object.assign({}, this.settings.categoryThemes);
    if (this.settings.shareFolder === "_assets/Quotes geteilt") this.settings.shareFolder = DEFAULTS.shareFolder;
    this.settings = { ...this.settings, ...firstRunSettings(stored) };
    this.quoteViews = new Set();
    // eslint-disable-next-line @typescript-eslint/no-this-alias -- die Hilfsfunktionen der anderen Dateien lesen Einstellungen und Sprache über PLUGIN
    PLUGIN = this;
    // Hauptfenster und abgetrennte Fenster (Pop-out): Stile und Ereignisse gelten in jedem
    this.docs = new Set([activeDocument]);
    this.perWindow = [];
    this.registerEvent(this.app.workspace.on("window-open", (win) => {
      this.docs.add(win.doc);
      this.applyStyles();
      for (const fn of this.perWindow) fn(win.doc);
    }));
    this.registerEvent(this.app.workspace.on("window-close", (win) => this.docs.delete(win.doc)));
    this.applyStyles();
    this.addSettingTab(new QuoteCardSettings(this.app, this));
    const T = pluginText();
    this.addCommand({
      id: "share-quote",
      name: T.shareQuote,
      icon: "share",
      checkCallback: (checking) => {
        const target = this.shareTarget(this.app.workspace.getActiveFile());
        if (target && !checking) new ShareModal(this.app, this, quotePayload(this.app, target)).open();
        return !!target;
      },
    });
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file) => {
      const target = this.shareTarget(file);
      if (target) menu.addItem((i) => i.setTitle(pluginText().shareQuote).setIcon("share").onClick(() => new ShareModal(this.app, this, quotePayload(this.app, target)).open()));
    }));
    // Beliebigen Text teilen. Auf dem Smartphone geht beim Öffnen von Palette oder Menü die Markierung oft verloren,
    // deshalb merkt sich das Plugin die letzte Markierung. Ohne Text öffnet der Dialog mit dem Eingabefeld.
    this.lastSelection = { text: "", path: "", time: 0 };
    this.onEachWindow((doc) => this.registerDomEvent(doc, "selectionchange", () => {
      const sel = doc.getSelection();
      const text = sel ? String(sel).trim() : "";
      if (!text || (sel.anchorNode && sel.anchorNode.closest && sel.anchorNode.closest(".modal"))) return;
      const file = this.app.workspace.getActiveFile();
      this.lastSelection = { text: text.slice(0, 5000), path: file ? file.path : "", time: Date.now() };
    }));
    this.addCommand({
      id: "share-text",
      name: T.shareText,
      icon: "share",
      checkCallback: (checking) => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view) return false;
        if (!checking) this.openTextShare(view);
        return true;
      },
    });
    // Einrichtung: per Befehl jederzeit, von selbst nur in einem (fast) leeren Vault
    this.addCommand({ id: "setup", name: T.setup, icon: "compass", callback: () => openCompassSetup(this.app, this) });
    this.app.workspace.onLayoutReady(async () => {
      const mode = autoSetupMode(this.settings, this.app.vault.getMarkdownFiles().length);
      if (mode === "setup") new SetupModal(this.app, this).open();
      else if (mode === "welcome") new AddModal(this.app, this).open();
      // Ordner-Vorlagen an Templater übergeben, sobald es nach der Einrichtung installiert ist
      if (this.settings.setupTemplater && await applyTemplaterSetup(this.app, this)) new Notice(pluginText().templater, 12000);
    });
    this.addCommand({
      id: "save-quote",
      name: T.saveQuote,
      icon: "quote",
      callback: () => {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        new QuoteCaptureModal(this.app, this, { text: view ? this.textForShare(view) : "", file: view ? view.file : null }).open();
      },
    });
    this.registerEvent(this.app.workspace.on("editor-menu", (menu, editor, info) => {
      const text = editorText(editor);
      if (!markdownToPlain(text)) return;
      const selected = editor.somethingSelected();
      const M = pluginText();
      if (selected) menu.addItem((i) => i.setTitle(M.saveAsQuote).setIcon("quote")
        .onClick(() => new QuoteCaptureModal(this.app, this, { text, file: info && info.file }).open()));
      menu.addItem((i) => i.setTitle(selected ? M.shareSelection : M.shareParagraph).setIcon("share")
        .onClick(() => new ShareModal(this.app, this, textPayload(this.app, info && info.file, text)).open()));
    }));
    // Menü ⋮ oben in der Notiz, gut erreichbar auf dem Smartphone
    this.registerEvent(this.app.workspace.on("file-menu", (menu, file, source) => {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view || view.file !== file || source === "file-explorer-context-menu") return;
      menu.addItem((i) => i.setTitle(pluginText().shareText).setIcon("share").onClick(() => this.openTextShare(view)));
    }));
    // Einmalig: „Text als Bild teilen“ in die Werkzeugleiste über der Tastatur (direkt nach Rückgängig/Wiederholen).
    // Über Obsidian selbst, damit kein laufendes Obsidian den Eintrag mit einer älteren Fassung überschreibt.
    // Entfernst du den Knopf später, bleibt er weg.
    // Merker pro Gerät (nicht synchronisiert): Jedes Gerät trägt den Knopf einmal selbst ein. So schreibt kein Gerät
    // mit veralteten Einstellungen ihn wieder weg, und entfernst du ihn später auf einem Gerät, bleibt er dort weg.
    this.app.workspace.onLayoutReady(() => {
      const vault = this.app.vault;
      if (typeof vault.getConfig !== "function" || typeof vault.setConfig !== "function") return;
      const store = (key) => (typeof this.app.loadLocalStorage === "function"
        ? { get: () => this.app.loadLocalStorage(key), set: () => this.app.saveLocalStorage(key, "1") }
        : { get: () => { try { return window.localStorage.getItem(key); } catch (e) { return "1"; } }, set: () => { try { window.localStorage.setItem(key, "1"); } catch (e) { /* egal */ } } });
      // Teilen direkt nach Rückgängig/Wiederholen, Zitat speichern direkt dahinter
      let after = "editor:redo";
      for (const [cmd, key] of [["share-text", "quote-card-toolbar-added"], ["save-quote", "quote-card-toolbar-added-2"]]) {
        const id = this.manifest.id + ":" + cmd;
        const mark = store(key);
        if (!mark.get()) {
          const cmds = (vault.getConfig("mobileToolbarCommands") || []).slice();
          if (!cmds.includes(id)) {
            const at = cmds.indexOf(after);
            cmds.splice(at >= 0 ? at + 1 : 0, 0, id);
            vault.setConfig("mobileToolbarCommands", cmds);
          }
          mark.set();
        }
        after = id;
      }
    });
    // Auf dem Smartphone zusätzlich ein Teilen-Symbol oben in jeder Notiz
    if (Platform.isMobile) {
      const addAction = (leaf) => {
        const view = leaf && leaf.view;
        if (!(view instanceof MarkdownView) || view.qcShareAction) return;
        view.qcShareAction = view.addAction("share", pluginText().shareText, () => this.openTextShare(view));
      };
      this.app.workspace.onLayoutReady(() => this.app.workspace.iterateAllLeaves(addAction));
      this.registerEvent(this.app.workspace.on("active-leaf-change", addAction));
    }
    // Bilder und Videos anordnen (Leiste über dem Embed in der Live-Vorschau)
    this.media = new MediaBar(this);
    this.onEachWindow((doc) => this.media.load(doc));
    this.registerMarkdownCodeBlockProcessor("quote-card", (src, el, ctx) => {
      ctx.addChild(new QuoteCard(el, this.app, ctx.sourcePath, src));
    });
    this.registerMarkdownCodeBlockProcessor("quote-rotator", (src, el, ctx) => {
      ctx.addChild(new QuoteRotator(el, this.app, src));
    });
    this.registerMarkdownCodeBlockProcessor("home-dashboard", (src, el, ctx) => {
      ctx.addChild(new HomeDashboard(el, this.app, src, ctx.sourcePath));
    });
    this.registerMarkdownCodeBlockProcessor("note-footer", (src, el, ctx) => {
      ctx.addChild(new NoteFooter(el, this, ctx.sourcePath));
    });
    this.registerMarkdownCodeBlockProcessor("note-header", (src, el, ctx) => {
      ctx.addChild(new NoteHeader(el, this, src, ctx.sourcePath));
    });
  }

  // Welches Zitat geteilt wird: eine Zitat-Notiz selbst oder das Zitat aus der Eigenschaft „zitat“
  shareTarget(file) {
    if (!file || file.extension !== "md") return null;
    if (file.path.startsWith((this.settings.quotesFolder || DEFAULTS.quotesFolder) + "/")) return file;
    const fm = (this.app.metadataCache.getFileCache(file) || {}).frontmatter || {};
    const link = [].concat(fm.zitat || []).map(linkTarget).filter(Boolean)[0];
    return link ? this.app.metadataCache.getFirstLinkpathDest(link, file.path) : null;
  }

  // Text zum Teilen: Markierung im Editor, sonst Absatz an der Schreibmarke, sonst Markierung in der Leseansicht,
  // sonst die zuletzt markierte Stelle dieser Notiz (höchstens zwei Minuten alt)
  textForShare(view) {
    let text = view.getMode() === "source" ? editorText(view.editor) : "";
    if (!markdownToPlain(text)) text = String(activeWindow.getSelection() || "").trim();
    const last = this.lastSelection || {};
    if (!markdownToPlain(text) && last.text && view.file && last.path === view.file.path && Date.now() - last.time < 120000) text = last.text;
    return markdownToPlain(text) ? text : "";
  }

  openTextShare(view) {
    const text = this.textForShare(view);
    const modal = new ShareModal(this.app, this, textPayload(this.app, view.file, text));
    if (!text) {
      modal.startEditing = true;
      new Notice(pluginText().noText);
    }
    modal.open();
  }

  // fn läuft für das Hauptfenster, jedes offene und jedes später geöffnete Fenster
  onEachWindow(fn) {
    this.perWindow.push(fn);
    for (const doc of this.docs) fn(doc);
  }

  onunload() {
    if (this.media) this.media.unload();
    this.app.workspace.iterateAllLeaves((leaf) => {
      const view = leaf.view;
      if (view && view.qcShareAction) { view.qcShareAction.remove(); delete view.qcShareAction; }
    });
    for (const doc of this.docs || []) {
      const body = doc.body;
      body.removeClass("qc-media-limit");
      for (const k of Object.keys(this.vars())) body.style.removeProperty(k);
      body.removeClass(...Object.keys(MODES).flatMap((m) => ["qc-mode-" + m, "nh-mode-" + m]));
    }
  }

  vars() {
    const s = this.settings;
    const n = s.notes;
    const v = {
      "--qc-bg-light": safeColor(s.bgLight, DEFAULTS.bgLight),
      "--qc-color-light": safeColor(s.colorLight, DEFAULTS.colorLight),
      "--qc-bg-dark": safeColor(s.bgDark, DEFAULTS.bgDark),
      "--qc-color-dark": safeColor(s.colorDark, DEFAULTS.colorDark),
      "--qc-radius": Number(s.radius) + "px",
      "--qc-quote-font": safeFont(s.quoteFont) || DEFAULTS.quoteFont,
      "--qc-quote-size": Number(s.quoteSize) + "em",
      "--qc-quote-weight": WEIGHTS[s.quoteWeight] ? s.quoteWeight : "400",
      "--qc-quote-line-height": String(Number(s.quoteLineHeight)),
      "--qc-mark-size": Number(s.markSize) + "em",
      "--qc-source-font": safeFont(s.sourceFont) || DEFAULTS.sourceFont,
      "--qc-source-size": Number(s.sourceSize) + "em",
      "--qc-source-weight": WEIGHTS[s.sourceWeight] ? s.sourceWeight : "400",
      "--qc-source-transform": s.sourceUppercase ? "uppercase" : "none",
    };
    for (const k of Object.keys(THEMES)) {
      v["--nh-" + k + "-light"] = safeColor(n[k + "Light"], NOTE_DEFAULTS[k + "Light"]);
      v["--nh-" + k + "-dark"] = safeColor(n[k + "Dark"], NOTE_DEFAULTS[k + "Dark"]);
    }
    return Object.assign(v, {
      "--nh-text-light": safeColor(n.textLight, NOTE_DEFAULTS.textLight),
      "--nh-text-dark": safeColor(n.textDark, NOTE_DEFAULTS.textDark),
      "--nh-radius": Number(n.radius) + "px",
      "--nh-title-font": safeFont(n.titleFont) || NOTE_DEFAULTS.titleFont,
      "--nh-title-size": Number(n.titleSize) + "em",
      "--nh-title-weight": WEIGHTS[n.titleWeight] ? n.titleWeight : "400",
      "--nh-lead-size": Number(n.leadSize) + "em",
      "--nh-lead-style": n.leadItalic ? "italic" : "normal",
      "--nh-label-font": safeFont(n.labelFont) || NOTE_DEFAULTS.labelFont,
      "--nh-label-size": Number(n.labelSize) + "em",
      "--nh-label-transform": n.labelUppercase ? "uppercase" : "none",
      "--qc-media-max": Math.max(200, Math.min(1200, Number(n.mediaMax) || 560)) + "px",
    });
  }

  applyStyles() {
    const vars = this.vars();
    const quoteMode = MODES[this.settings.mode] ? this.settings.mode : "auto";
    const noteMode = MODES[this.settings.notes.mode] ? this.settings.notes.mode : "auto";
    for (const doc of this.docs) {
      const body = doc.body;
      body.setCssProps(vars);
      body.removeClass(...Object.keys(MODES).flatMap((m) => ["qc-mode-" + m, "nh-mode-" + m]));
      body.addClass("qc-mode-" + quoteMode, "nh-mode-" + noteMode);
      body.toggleClass("qc-media-limit", this.settings.notes.mediaLimit !== false);
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.applyStyles();
    // Offene Köpfe und Zitatkarten sofort im neuen Thema zeichnen
    for (const h of this.headers) h.render();
    for (const f of this.footers) f.render();
    for (const v of this.quoteViews) v.refresh();
  }
};
