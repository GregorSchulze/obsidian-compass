// Texte des Einstellungsreiters
const SETTINGS_TEXT = {
  de: {
    language: "Sprache / Language",
    languageDesc: "Für Einstellungen, Dialoge, Menüs und Hinweise. Befehlsnamen wechseln nach einem Neustart von Obsidian.",
    noteLang: "Eigenschaften in Notizen", noteLangDesc: "Namen, die Compass für neue Eigenschaften verwendet, z. B. summary oder kernaussage. Vorhandene behalten ihren Namen, Compass liest beide.",
    tabsAria: "Einstellungen für", tabs: { quotes: "Quotes", notes: "Notizen", howto: "How To" },
    setup: "Einrichtung / Setup", setupDesc: "Legt Ordner, Vorlagen, Listen, Startseite und 100 Startzitate an, auf Deutsch oder Englisch. Vorhandenes wird nie überschrieben.",
    setupBtn: "Einrichtung starten",
    howtoIntro: "Alle Bausteine fügst du als Codeblock in eine Notiz ein. Kopieren, in die Notiz einfügen, fertig. Live-Beispiele findest du in der Notiz „How To – Compass“.",
    examples: "Beispiele ansehen", examplesDesc: "Öffnet die How-To-Notiz mit allen Bausteinen in Aktion.", examplesBtn: "How-To-Notiz öffnen",
    copy: "Kopieren", copied: "Kopiert ✓", copyManual: "Bitte von Hand markieren",
    fontDesc: "Schriftname, wie er auf dem Gerät installiert ist. Mehrere mit Komma trennen, die erste vorhandene wird genutzt.",
    light: "Hell", dark: "Dunkel", num: (r) => r.toFixed(1).replace(".", ","),
    contrast: (r) => "Kontrast " + r + " : 1 – ", good7: "sehr gut lesbar.", good45: "gut lesbar.", weak: "zu schwach, Farben anpassen.",
    custom: "Eigene Farben", colorTheme: "Farbthema", defaultTheme: "Standard-Thema", mode: "Modus",
    quoteExceptions: (list) => " Ausnahmen, weil ihre Kategorie ein eigenes Thema hat: " + list + ". Diese änderst du unten bei „Kategorien“.",
    quoteThemeDesc: "Gilt für alle Zitatkarten, auch für bestehende und rotierende. Die Themen sind dieselben wie bei den Notizen, ihre Farben stellst du dort ein.",
    quoteModeDesc: "Automatisch folgt dem hellen oder dunklen Design von Obsidian. Steht Obsidian auf „An System anpassen“, wechselt die Karte mit deinen Systemeinstellungen.",
    categories: "Kategorien", quotesFolder: "Zitate-Ordner", quotesFolderDesc: "Jeder Unterordner ist eine Kategorie und kann ein eigenes Farbthema bekommen.",
    standard: (name) => "Standard (" + name + ")", allCategories: "Alle Kategorien auf Standard-Thema",
    allCategoriesDesc: "Hebt alle Zuordnungen auf. Danach haben alle Zitatkarten das Standard-Thema.", clear: "Zuordnungen aufheben",
    customDesc: "Gelten für Zitatkarten mit dem Thema „Eigene Farben“.",
    bgLight: "Hintergrund hell", textLight: "Text hell", bgDark: "Hintergrund dunkel", textDark: "Text dunkel",
    card: "Karte", corners: "Ecken", cornersDesc: "Rundung der Ecken in Pixeln.", quote: "Zitat", font: "Schriftart", size: "Schriftgröße",
    sizeDesc: "Relativ zur normalen Textgröße.", weight: "Schriftdicke", lineHeight: "Zeilenabstand", markSize: "Größe des Anführungszeichens",
    markSizeDesc: "Relativ zur Schriftgröße des Zitats.", sourceLine: "Quellenzeile", uppercase: "Großbuchstaben",
    share: "Teilen", shareDesc: "Der Knopf ⇪ in jeder Zitatkarte macht aus dem Zitat ein Bild für Instagram, in Farbe und Schrift der Karte.",
    shareFormat: "Standard-Format", signature: "Signatur",
    signatureDesc: "Steht klein unten im Bild, z. B. deine Webseite oder dein Instagram-Name. Leer lassen für keine Signatur.", signaturePh: "@deinname",
    shareFolder: "Ordner für gespeicherte Bilder",
    shareFolderDesc: "„Speichern“ legt das Bild hier ab. Auf dem iPhone findest du es in der Dateien-App unter Obsidian und kannst es von dort teilen.",
    resetQuotes: "Quotes auf Standard zurücksetzen", reset: "Zurücksetzen",
    sample: { area: "Write · Gedanken", status: "Entwurf", title: "Designsysteme als Sprache", meta: "8. Nov. 2026 · Teilen ✓" },
    contrastAll: (list) => "Kontrast hell / dunkel – " + list + ". Unter 4,5 : 1 (⚠) ist die Schrift schwer lesbar.",
    noteExceptions: (list) => " Ausnahmen, weil ihre Vorlage ein eigenes Thema hat: " + list + ". Diese änderst du unten bei „Vorlagen“.",
    noteThemeDesc: "Gilt für alle Köpfe in deinen Notizen, auch für bestehende.",
    noteModeDesc: "Automatisch folgt dem hellen oder dunklen Design von Obsidian. Steht Obsidian auf „An System anpassen“, wechselt der Kopf mit deinen Systemeinstellungen.",
    templates: "Vorlagen", templateFolder: "Vorlagen-Ordner", templateFolderDesc: "Hier liegen deine Vorlagen. Jede Vorlage kann ein eigenes Farbthema bekommen.",
    templatesInfo: "Eine Änderung wirkt sofort auf alle Notizen dieser Vorlage, auch auf bestehende. Die Notiz erkennt ihre Vorlage an der Eigenschaft „vorlage“, z. B. vorlage: Write.",
    allTemplates: "Alle Vorlagen auf Standard-Thema", allTemplatesDesc: "Hebt alle Zuordnungen auf. Danach haben alle Köpfe das Standard-Thema.",
    themeColors: "Farben der Themen", previewIn: "Vorschau zeigen in", lightOf: (name) => name + " hell", darkOf: (name) => name + " dunkel",
    header: "Kopf", titleFont: "Schriftart Titel", titleSize: "Schriftgröße Titel", titleWeight: "Schriftdicke Titel",
    leadSize: "Schriftgröße Kernaussage", leadItalic: "Kernaussage kursiv", labelFont: "Schriftart Beschriftungen",
    labelSize: "Schriftgröße Beschriftungen", labelSizeDesc: "Bereich, Status, Datum, Bezug und Quellen.", labelUpper: "Beschriftungen in Großbuchstaben",
    elements: "Elemente", progress: "Fortschritt im Kopf", progressDesc: "Zählt die Checkboxen der Notiz, z. B. „Aufgaben 2 / 5“ mit Balken.",
    readTime: "Lesezeit im Kopf", readTimeDesc: "Ab 30 Wörtern, z. B. „4 Min. Lesezeit · 820 Wörter“.",
    toc: "Inhaltsverzeichnis", tocDesc: "Unter dem Kopf, automatisch aus den Überschriften, mit Unterebenen.",
    tocMin: "Inhaltsverzeichnis ab", tocMinDesc: "Mindestzahl an Überschriften, damit es erscheint.",
    tocDepth: "Inhaltsverzeichnis Tiefe", tocDepthDesc: "2 = nur ##, 3 = mit ###, 4 = mit ####.",
    footer: "Footer", footerDesc: "Am Ende von Notizen mit footer-Block: Verweise, Verwandtes, Schlagworte, Daten.",
    nav: "Vor/Zurück im Footer", navDesc: "Links zur vorherigen und nächsten Notiz im selben Ordner.",
    media: "Bilder und Videos",
    mediaInfo: "Größe ändert Obsidian selbst: an der Ecke eines Bildes ziehen. Zum Anordnen mit der Maus über ein Bild oder Video fahren bzw. es antippen: links, mittig, rechts, nebeneinander, eine Zeile nach oben oder unten.",
    mediaLimit: "Ohne eigene Größe begrenzen", mediaLimitDesc: "Bilder und Videos ohne Größenangabe werden nicht mehr bildschirmbreit eingefügt.",
    mediaMax: "Größte Breite", mediaMaxDesc: "In Pixeln, für Bilder und Videos ohne eigene Größe.",
    resetNotes: "Notizen auf Standard zurücksetzen", resetNotesDesc: "Farben, Schriften und Zuordnungen der Vorlagen.",
  },
  en: {
    language: "Language / Sprache",
    languageDesc: "For settings, dialogs, menus and notices. Command names change after restarting Obsidian.",
    noteLang: "Properties in notes", noteLangDesc: "Names Compass uses for new properties, e.g. summary or kernaussage. Existing ones keep their names; Compass reads both.",
    tabsAria: "Settings for", tabs: { quotes: "Quotes", notes: "Notes", howto: "How To" },
    setup: "Setup", setupDesc: "Creates folders, templates, lists, a home page and 100 starter quotes, in English or German. Nothing that already exists is ever overwritten.",
    setupBtn: "Start setup",
    howtoIntro: "You add every building block to a note as a code block. Copy, paste into the note, done. You’ll find live examples in the note “How To – Compass”.",
    examples: "See examples", examplesDesc: "Opens the How To note with every building block in action.", examplesBtn: "Open How To note",
    copy: "Copy", copied: "Copied ✓", copyManual: "Please select it by hand",
    fontDesc: "Font name as installed on the device. Separate several with commas; the first one available is used.",
    light: "Light", dark: "Dark", num: (r) => r.toFixed(1),
    contrast: (r) => "Contrast " + r + " : 1 – ", good7: "very easy to read.", good45: "easy to read.", weak: "too weak, adjust the colours.",
    custom: "Custom colours", colorTheme: "Colour theme", defaultTheme: "Default theme", mode: "Mode",
    quoteExceptions: (list) => " Exceptions, because their category has its own theme: " + list + ". Change these below under “Categories”.",
    quoteThemeDesc: "Applies to all quote cards, including existing and rotating ones. The themes are the same as for notes; you set their colours there.",
    quoteModeDesc: "Automatic follows Obsidian’s light or dark theme. If Obsidian is set to “Adapt to system”, the card switches with your system settings.",
    categories: "Categories", quotesFolder: "Quotes folder", quotesFolderDesc: "Every subfolder is a category and can get its own colour theme.",
    standard: (name) => "Default (" + name + ")", allCategories: "All categories to the default theme",
    allCategoriesDesc: "Removes all assignments. Afterwards every quote card has the default theme.", clear: "Remove assignments",
    customDesc: "Apply to quote cards with the theme “Custom colours”.",
    bgLight: "Background light", textLight: "Text light", bgDark: "Background dark", textDark: "Text dark",
    card: "Card", corners: "Corners", cornersDesc: "Corner radius in pixels.", quote: "Quote", font: "Font", size: "Font size",
    sizeDesc: "Relative to the normal text size.", weight: "Font weight", lineHeight: "Line height", markSize: "Size of the quotation mark",
    markSizeDesc: "Relative to the quote’s font size.", sourceLine: "Source line", uppercase: "Capital letters",
    share: "Sharing", shareDesc: "The ⇪ button on every quote card turns the quote into an image for Instagram, in the card’s colours and fonts.",
    shareFormat: "Default format", signature: "Signature",
    signatureDesc: "Appears small at the bottom of the image, e.g. your website or Instagram name. Leave empty for no signature.", signaturePh: "@yourname",
    shareFolder: "Folder for saved images",
    shareFolderDesc: "“Save” puts the image here. On the iPhone you’ll find it in the Files app under Obsidian and can share it from there.",
    resetQuotes: "Reset quotes to defaults", reset: "Reset",
    sample: { area: "Write · Thoughts", status: "Draft", title: "Design systems as a language", meta: "8 Nov 2026 · Share ✓" },
    contrastAll: (list) => "Contrast light / dark – " + list + ". Below 4.5 : 1 (⚠) the text is hard to read.",
    noteExceptions: (list) => " Exceptions, because their template has its own theme: " + list + ". Change these below under “Templates”.",
    noteThemeDesc: "Applies to all headers in your notes, including existing ones.",
    noteModeDesc: "Automatic follows Obsidian’s light or dark theme. If Obsidian is set to “Adapt to system”, the header switches with your system settings.",
    templates: "Templates", templateFolder: "Templates folder", templateFolderDesc: "Your templates live here. Every template can get its own colour theme.",
    templatesInfo: "A change applies at once to all notes from this template, including existing ones. A note knows its template from the property “template”, e.g. template: Write.",
    allTemplates: "All templates to the default theme", allTemplatesDesc: "Removes all assignments. Afterwards every header has the default theme.",
    themeColors: "Theme colours", previewIn: "Show preview in", lightOf: (name) => name + " light", darkOf: (name) => name + " dark",
    header: "Header", titleFont: "Title font", titleSize: "Title font size", titleWeight: "Title font weight",
    leadSize: "Summary font size", leadItalic: "Summary in italics", labelFont: "Label font",
    labelSize: "Label font size", labelSizeDesc: "Area, status, date, about and sources.", labelUpper: "Labels in capital letters",
    elements: "Elements", progress: "Progress in the header", progressDesc: "Counts the note’s checkboxes, e.g. “Tasks 2 / 5” with a bar.",
    readTime: "Reading time in the header", readTimeDesc: "From 30 words, e.g. “4 min read · 820 words”.",
    toc: "Table of contents", tocDesc: "Below the header, built automatically from the headings, with sub-levels.",
    tocMin: "Table of contents from", tocMinDesc: "Minimum number of headings for it to appear.",
    tocDepth: "Table of contents depth", tocDepthDesc: "2 = only ##, 3 = with ###, 4 = with ####.",
    footer: "Footer", footerDesc: "At the end of notes with a footer block: backlinks, related notes, tags, dates.",
    nav: "Previous/next in the footer", navDesc: "Links to the previous and next note in the same folder.",
    media: "Images and videos",
    mediaInfo: "Obsidian handles the size itself: drag the corner of an image. To arrange, hover over an image or video with the mouse or tap it: left, centre, right, side by side, one line up or down.",
    mediaLimit: "Limit images without a size", mediaLimitDesc: "Images and videos without a size are no longer inserted at full screen width.",
    mediaMax: "Maximum width", mediaMaxDesc: "In pixels, for images and videos without a size of their own.",
    resetNotes: "Reset notes to defaults", resetNotesDesc: "Colours, fonts and template assignments.",
  },
};
const settingsText = () => SETTINGS_TEXT[uiLang()];
// Sprachen zur Auswahl, jeweils in der eigenen Sprache benannt
const LANGUAGES = { en: "English", de: "Deutsch" };

class QuoteCardSettings extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.section = "quotes";
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    const T = settingsText();
    // Sprache der Oberfläche; nur „de“ oder „en“ wird gespeichert
    new Setting(containerEl).setName(T.language).setDesc(T.languageDesc)
      .addDropdown((d) => d.addOptions(LANGUAGES).setValue(uiLang()).onChange(async (v) => {
        this.plugin.settings.lang = v === "de" ? "de" : "en";
        await this.plugin.saveSettings();
        this.display();
      }));
    // Sprache der Eigenschaften, getrennt von der Oberfläche, damit Listen und Filter auf vorhandene Namen passen
    new Setting(containerEl).setName(T.noteLang).setDesc(T.noteLangDesc)
      .addDropdown((d) => d.addOptions({ en: "English (summary, rating …)", de: "Deutsch (kernaussage, bewertung …)" })
        .setValue(this.plugin.settings.noteLang === "de" ? "de" : "en").onChange(async (v) => {
          this.plugin.settings.noteLang = v === "de" ? "de" : "en";
          await this.plugin.saveSettings();
        }));
    const tabs = containerEl.createDiv({ cls: "qc-settings-tabs", attr: { role: "group", "aria-label": T.tabsAria } });
    for (const key of ["quotes", "notes", "howto"]) {
      const b = tabs.createEl("button", { text: T.tabs[key], cls: "qc-settings-tab" + (this.section === key ? " is-active" : "") });
      b.setAttr("aria-pressed", String(this.section === key));
      b.addEventListener("click", () => { this.section = key; this.display(); });
    }
    if (this.section === "notes") this.displayNotes(containerEl);
    else if (this.section === "howto") this.displayHowTo(containerEl);
    else this.displayQuotes(containerEl);
  }

  // Anleitung: welche Bausteine es gibt, mit Code zum Kopieren
  displayHowTo(containerEl) {
    const T = settingsText();
    new Setting(containerEl).setName(T.setup)
      .setDesc(T.setupDesc)
      .addButton((b) => b.setButtonText(T.setupBtn).setCta().onClick(() => openCompassSetup(this.app, this.plugin)));
    containerEl.createEl("p", { cls: "setting-item-description", text: T.howtoIntro });
    new Setting(containerEl).setName(T.examples).setDesc(T.examplesDesc)
      .addButton((b) => b.setButtonText(T.examplesBtn).onClick(() => this.app.workspace.openLinkText(HOWTO_NOTE, "", false)));
    for (const item of HOWTO[uiLang()]) {
      const box = containerEl.createDiv({ cls: "qc-howto" });
      box.createEl("h3", { text: item.title });
      box.createEl("p", { cls: "setting-item-description", text: item.text });
      const pre = box.createEl("pre", { cls: "qc-howto-code" });
      pre.createEl("code", { text: item.code });
      const copy = box.createEl("button", { text: T.copy, cls: "qc-howto-copy" });
      copy.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(item.code); copy.setText(T.copied); }
        catch (e) { copy.setText(T.copyManual); }
        window.setTimeout(() => copy.setText(T.copy), 2000);
      });
      if (item.tips) {
        const ul = box.createEl("ul", { cls: "qc-howto-tips" });
        for (const tip of item.tips) ul.createEl("li", { text: tip });
      }
    }
  }

  // Gemeinsame Bausteine für beide Bereiche
  controls(containerEl, s, defaults, save) {
    const T = settingsText();
    return {
      slider: (name, desc, key, min, max, step) => new Setting(containerEl).setName(name).setDesc(desc)
        .addSlider((sl) => sl.setLimits(min, max, step).setValue(s[key]).setDynamicTooltip()
          .onChange(async (v) => { s[key] = v; await save(); })),
      weight: (name, key) => new Setting(containerEl).setName(name)
        .addDropdown((d) => d.addOptions(baseText().weights).setValue(s[key]).onChange(async (v) => { s[key] = v; await save(); })),
      font: (name, key) => new Setting(containerEl).setName(name)
        .setDesc(T.fontDesc)
        .addText((t) => t.setPlaceholder(defaults[key]).setValue(s[key])
          .onChange(async (v) => { s[key] = safeFont(v) || defaults[key]; await save(); })),
      color: (name, key) => new Setting(containerEl).setName(name)
        .addColorPicker((c) => c.setValue(s[key]).onChange(async (v) => { s[key] = safeColor(v, defaults[key]); await save(); })),
      toggle: (name, desc, key) => new Setting(containerEl).setName(name).setDesc(desc)
        .addToggle((t) => t.setValue(s[key]).onChange(async (v) => { s[key] = v; await save(); })),
    };
  }

  displayQuotes(containerEl) {
    const s = this.plugin.settings;
    const T = settingsText();
    // Vorschau beider Modi nebeneinander, darunter der Kontrast je Modus
    const previews = containerEl.createDiv({ cls: "quote-card-previews" });
    const infos = [];
    for (const [mode, label] of [["light", T.light], ["dark", T.dark]]) {
      const col = previews.createDiv({ cls: "quote-card-preview qc-force-" + mode });
      col.createEl("p", { cls: "setting-item-description", text: label });
      buildCard(col.createDiv(), {
        author: "Michael A. Nielsen",
        source: "Augmenting Long-term Memory",
        url: new URL("https://augmentingcognition.com/ltm.html"),
        quote: "Anki makes memory a choice.",
      }, s.quoteTheme);
      infos.push([col.createEl("p", { cls: "setting-item-description quote-card-contrast" }), mode]);
    }
    const showContrast = () => {
      const n = s.notes;
      const themed = THEMES[s.quoteTheme];
      for (const [el, mode] of infos) {
        const r = themed
          ? (mode === "light" ? contrast(n[s.quoteTheme + "Light"], n.textLight) : contrast(n[s.quoteTheme + "Dark"], n.textDark))
          : (mode === "light" ? contrast(s.bgLight, s.colorLight) : contrast(s.bgDark, s.colorDark));
        el.setText(T.contrast(T.num(r)) + (r >= 7 ? T.good7 : r >= 4.5 ? T.good45 : T.weak));
      }
    };
    showContrast();

    const save = async () => {
      await this.plugin.saveSettings();
      showContrast();
    };
    const { slider, weight, font, color } = this.controls(containerEl, s, DEFAULTS, save);

    const themeOptions = { custom: T.custom };
    for (const k of Object.keys(THEMES)) themeOptions[k] = themeLabel(k);
    const themeName = (k) => themeOptions[k] || themeOptions.custom;
    new Setting(containerEl).setName(T.colorTheme).setHeading();
    const mapped = Object.entries(s.categoryThemes).filter(([, v]) => themeOptions[v]);
    const exceptions = mapped.length ? T.quoteExceptions(mapped.map(([k, v]) => k + " → " + themeName(v)).join(", ")) : "";
    new Setting(containerEl).setName(T.defaultTheme)
      .setDesc(T.quoteThemeDesc + exceptions)
      .addDropdown((d) => d.addOptions(themeOptions).setValue(s.quoteTheme)
        .onChange(async (v) => { s.quoteTheme = v; await save(); this.display(); }));
    new Setting(containerEl).setName(T.mode)
      .setDesc(T.quoteModeDesc)
      .addDropdown((d) => d.addOptions(baseText().modes).setValue(s.mode).onChange(async (v) => { s.mode = v; await save(); }));

    // Kategorien = Unterordner des Zitate-Ordners, z. B. Zitate, Fragen, Sprüche
    new Setting(containerEl).setName(T.categories).setHeading();
    new Setting(containerEl).setName(T.quotesFolder)
      .setDesc(T.quotesFolderDesc)
      .addText((tx) => tx.setPlaceholder(DEFAULTS.quotesFolder).setValue(s.quotesFolder)
        .onChange(async (v) => { s.quotesFolder = v.trim().replace(/\/+$/, "") || DEFAULTS.quotesFolder; await save(); }));
    const root = this.app.vault.getAbstractFileByPath(s.quotesFolder);
    const categories = (root && root.children ? root.children.filter((c) => c.children) : []).map((c) => c.name)
      .sort((a, b) => a.localeCompare(b, uiLang()));
    for (const cat of categories) {
      new Setting(containerEl).setName(cat)
        .addDropdown((d) => d.addOptions(Object.assign({ "": T.standard(themeName(s.quoteTheme)) }, themeOptions))
          .setValue(s.categoryThemes[cat] || "")
          .onChange(async (v) => {
            if (v) s.categoryThemes[cat] = v;
            else delete s.categoryThemes[cat];
            await save();
            this.display();
          }));
    }
    new Setting(containerEl).setName(T.allCategories)
      .setDesc(T.allCategoriesDesc)
      .addButton((b) => b.setButtonText(T.clear).onClick(async () => {
        s.categoryThemes = {};
        await save();
        this.display();
      }));

    new Setting(containerEl).setName(T.custom).setHeading();
    containerEl.createEl("p", { cls: "setting-item-description", text: T.customDesc });
    color(T.bgLight, "bgLight");
    color(T.textLight, "colorLight");
    color(T.bgDark, "bgDark");
    color(T.textDark, "colorDark");

    new Setting(containerEl).setName(T.card).setHeading();
    slider(T.corners, T.cornersDesc, "radius", 0, 32, 1);

    new Setting(containerEl).setName(T.quote).setHeading();
    font(T.font, "quoteFont");
    slider(T.size, T.sizeDesc, "quoteSize", 1, 3, 0.05);
    weight(T.weight, "quoteWeight");
    slider(T.lineHeight, "", "quoteLineHeight", 1, 2, 0.05);
    slider(T.markSize, T.markSizeDesc, "markSize", 1, 4, 0.1);

    new Setting(containerEl).setName(T.sourceLine).setHeading();
    font(T.font, "sourceFont");
    slider(T.size, T.sizeDesc, "sourceSize", 0.6, 1.4, 0.05);
    weight(T.weight, "sourceWeight");
    new Setting(containerEl).setName(T.uppercase)
      .addToggle((t) => t.setValue(s.sourceUppercase).onChange(async (v) => { s.sourceUppercase = v; await save(); }));

    new Setting(containerEl).setName(T.share).setHeading();
    containerEl.createEl("p", { cls: "setting-item-description", text: T.shareDesc });
    new Setting(containerEl).setName(T.shareFormat)
      .addDropdown((d) => d.addOptions(Object.fromEntries(Object.keys(SHARE_FORMATS).map((k) => [k, shareText().formats[k]])))
        .setValue(s.shareFormat).onChange(async (v) => { s.shareFormat = v; await save(); }));
    new Setting(containerEl).setName(T.signature)
      .setDesc(T.signatureDesc)
      .addText((tx) => tx.setPlaceholder(T.signaturePh).setValue(s.shareSignature)
        .onChange(async (v) => { s.shareSignature = noControl(v).slice(0, 60); await save(); }));
    new Setting(containerEl).setName(T.shareFolder)
      .setDesc(T.shareFolderDesc)
      .addText((tx) => tx.setPlaceholder(DEFAULTS.shareFolder).setValue(s.shareFolder)
        .onChange(async (v) => { s.shareFolder = v.trim().replace(/^\/+|\/+$/g, "") || DEFAULTS.shareFolder; await save(); }));

    new Setting(containerEl).setName(T.resetQuotes)
      .addButton((b) => b.setButtonText(T.reset).onClick(async () => {
        // Nur das Aussehen zurücksetzen. Sprache, Ordner, Vorlage und Einrichtung bleiben, sonst zeigten Kacheln und Listen ins Leere.
        const s = this.plugin.settings;
        const keep = {};
        for (const k of ["lang", "noteLang", "quotesFolder", "mediaFolder", "quoteTemplate", "shareFolder", "shareSignature", "setupDone", "setupTemplater"]) keep[k] = s[k];
        this.plugin.settings = { ...DEFAULTS, ...keep, categoryThemes: {}, notes: s.notes };
        await this.plugin.saveSettings();
        this.display();
      }));
  }

  displayNotes(containerEl) {
    const s = this.plugin.settings.notes;
    const T = settingsText();

    // Vorschau hell und dunkel im gewählten Thema, darunter der Kontrast aller Themen
    const previewTheme = this.previewTheme || s.defaultTheme;
    const previews = containerEl.createDiv({ cls: "nh-previews" });
    for (const [mode, label] of [["light", T.light], ["dark", T.dark]]) {
      const col = previews.createDiv({ cls: "nh-preview nh-force-" + mode });
      col.createEl("p", { cls: "setting-item-description", text: label + " · " + themeLabel(previewTheme) });
      const head = col.createDiv({ cls: "note-header is-" + previewTheme });
      const row = head.createDiv({ cls: "note-header-row" });
      row.createSpan({ cls: "note-header-label", text: T.sample.area });
      row.createSpan({ cls: "note-header-label note-header-pill", text: T.sample.status });
      head.createEl("h1", { cls: "note-header-title", text: T.sample.title });
      head.createEl("p", { cls: "note-header-lead", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." });
      head.createDiv({ cls: "note-header-meta note-header-label" }).createSpan({ text: T.sample.meta });
    }
    const info = containerEl.createEl("p", { cls: "setting-item-description nh-contrast" });
    const showContrast = () => {
      const rate = (bg, fg) => { const r = contrast(bg, fg); return T.num(r) + (r >= 4.5 ? "" : " ⚠"); };
      info.setText(T.contrastAll(Object.keys(THEMES).map((k) =>
        themeLabel(k) + ": " + rate(s[k + "Light"], s.textLight) + " / " + rate(s[k + "Dark"], s.textDark)).join(" · ")));
    };
    showContrast();

    const save = async () => { await this.plugin.saveSettings(); showContrast(); };
    const { slider, weight, font, color, toggle } = this.controls(containerEl, s, NOTE_DEFAULTS, save);
    const themeOptions = {};
    for (const k of Object.keys(THEMES)) themeOptions[k] = themeLabel(k);

    new Setting(containerEl).setName(T.colorTheme).setHeading();
    const mapped = Object.entries(s.templateThemes).filter(([, v]) => THEMES[v]);
    const exceptions = mapped.length ? T.noteExceptions(mapped.map(([k, v]) => k + " → " + themeLabel(v)).join(", ")) : "";
    new Setting(containerEl).setName(T.defaultTheme)
      .setDesc(T.noteThemeDesc + exceptions)
      .addDropdown((d) => d.addOptions(themeOptions).setValue(s.defaultTheme)
        .onChange(async (v) => { s.defaultTheme = v; await save(); this.display(); }));
    new Setting(containerEl).setName(T.mode)
      .setDesc(T.noteModeDesc)
      .addDropdown((d) => d.addOptions(baseText().modes).setValue(s.mode).onChange(async (v) => { s.mode = v; await save(); }));

    // Vorlagen einem Thema zuordnen. Neue Notizen tragen ihre Vorlage in „vorlage“, so wirkt eine Änderung sofort auch auf bestehende Notizen.
    new Setting(containerEl).setName(T.templates).setHeading();
    new Setting(containerEl).setName(T.templateFolder)
      .setDesc(T.templateFolderDesc)
      .addText((t) => t.setPlaceholder(NOTE_DEFAULTS.templateFolder).setValue(s.templateFolder)
        .onChange(async (v) => { s.templateFolder = v.trim().replace(/\/+$/, "") || NOTE_DEFAULTS.templateFolder; await save(); }));
    const folder = s.templateFolder + "/";
    const templates = this.app.vault.getMarkdownFiles()
      .filter((f) => f.path.startsWith(folder) && !f.path.slice(folder.length).includes("/"))
      .map((f) => templateKey(f.basename))
      .sort((a, b) => a.localeCompare(b, uiLang()));
    const standardLabel = T.standard(themeLabel(s.defaultTheme));
    for (const key of templates) {
      new Setting(containerEl).setName(key)
        .addDropdown((d) => d.addOptions(Object.assign({ "": standardLabel }, themeOptions)).setValue(s.templateThemes[key] || "")
          .onChange(async (v) => {
            if (v) s.templateThemes[key] = v;
            else delete s.templateThemes[key];
            await save();
            this.display();
          }));
    }
    containerEl.createEl("p", { cls: "setting-item-description", text: T.templatesInfo });
    new Setting(containerEl).setName(T.allTemplates)
      .setDesc(T.allTemplatesDesc)
      .addButton((b) => b.setButtonText(T.clear).onClick(async () => {
        s.templateThemes = {};
        await save();
        this.display();
      }));

    new Setting(containerEl).setName(T.themeColors).setHeading();
    new Setting(containerEl).setName(T.previewIn)
      .addDropdown((d) => d.addOptions(themeOptions).setValue(previewTheme).onChange((v) => { this.previewTheme = v; this.display(); }));
    for (const k of Object.keys(THEMES)) {
      color(T.lightOf(themeLabel(k)), k + "Light");
      color(T.darkOf(themeLabel(k)), k + "Dark");
    }
    color(T.textLight, "textLight");
    color(T.textDark, "textDark");

    new Setting(containerEl).setName(T.header).setHeading();
    slider(T.corners, T.cornersDesc, "radius", 0, 32, 1);
    font(T.titleFont, "titleFont");
    slider(T.titleSize, T.sizeDesc, "titleSize", 1.4, 4, 0.05);
    weight(T.titleWeight, "titleWeight");
    slider(T.leadSize, T.sizeDesc, "leadSize", 0.9, 2, 0.05);
    toggle(T.leadItalic, "", "leadItalic");
    font(T.labelFont, "labelFont");
    slider(T.labelSize, T.labelSizeDesc, "labelSize", 0.6, 1.2, 0.02);
    toggle(T.labelUpper, "", "labelUppercase");

    new Setting(containerEl).setName(T.elements).setHeading();
    toggle(T.progress, T.progressDesc, "showProgress");
    toggle(T.readTime, T.readTimeDesc, "showReadTime");
    toggle(T.toc, T.tocDesc, "showToc");
    slider(T.tocMin, T.tocMinDesc, "tocMin", 1, 8, 1);
    slider(T.tocDepth, T.tocDepthDesc, "tocDepth", 2, 6, 1);
    toggle(T.footer, T.footerDesc, "showFooter");
    toggle(T.nav, T.navDesc, "showNav");

    new Setting(containerEl).setName(T.media).setHeading();
    containerEl.createEl("p", { cls: "setting-item-description", text: T.mediaInfo });
    toggle(T.mediaLimit, T.mediaLimitDesc, "mediaLimit");
    slider(T.mediaMax, T.mediaMaxDesc, "mediaMax", 280, 1000, 20);


    new Setting(containerEl).setName(T.resetNotes)
      .setDesc(T.resetNotesDesc)
      .addButton((b) => b.setButtonText(T.reset).onClick(async () => {
        this.plugin.settings.notes = JSON.parse(JSON.stringify(NOTE_DEFAULTS));
        await this.plugin.saveSettings();
        this.display();
      }));
  }
}
