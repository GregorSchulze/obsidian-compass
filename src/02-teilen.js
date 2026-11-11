// ---------- Teilen ----------
// Das Zitat wird als Bild im Instagram-Format gezeichnet (nur Text und Farben, nie HTML).
// Danach: Teilen über das System-Menü (wo verfügbar), Bild kopieren, im Vault speichern oder Vollbild für einen Screenshot.
// Safezones: Bereiche, die Instagram mit Bedienelementen überdeckt oder im Profilraster abschneidet.
// Story: oben Profilname und Fortschrittsbalken (ca. 250 px), unten Antwortfeld (ca. 340 px).
// Post 4:5 und Quadrat: Das Profilraster zeigt 3:4 und schneidet links und rechts ab (Quadrat je 135 px).
const SHARE_FORMATS = {
  story: { w: 1080, h: 1920, safe: { top: 250, bottom: 340, side: 108 } },
  post: { w: 1080, h: 1350, safe: { top: 108, bottom: 108, side: 108 }, crop: { side: 34 } },
  square: { w: 1080, h: 1080, safe: { top: 108, bottom: 108, side: 160 }, crop: { side: 135 } },
};

// Texte für Teilen-Dialog und „Zitat speichern“
const SHARE_TEXT = {
  de: {
    formats: { story: "Story 9:16", post: "Post 4:5", square: "Quadrat 1:1" },
    altText: "Text als Bild: ", altQuote: "Zitat als Bild: ", pager: "Bilder im Karussell", prev: "Vorheriges Bild", next: "Nächstes Bild",
    hint: "Jetzt Screenshot machen. Tippen, um die Knöpfe zurückzuholen.", title: "Titel", source: "Quelle", textAria: "Text im Bild", textPh: "Text für das Bild",
    editInfo: "Ändert nur das Bild, nicht die Notiz. „## “ am Zeilenanfang macht eine Überschrift.", original: "Original",
    format: "Format", lightDark: "Hell oder dunkel", light: "Hell", dark: "Dunkel", safezone: "Safezone",
    safezoneTitle: "Zeigt, was Instagram überdeckt oder abschneidet. Nur in der Vorschau, nie im Bild.", theme: "Farbthema", custom: "Eigene Farben",
    text: "Text", smaller: "Schrift kleiner", larger: "Schrift größer", centered: "Zentriert", frame: "Rahmen", position: "Position",
    up: "Text nach oben", middle: "Mitte", middleAria: "Text mittig", down: "Text nach unten", edit: "Text bearbeiten",
    actions: "Aktionen", share: "Teilen", copy: "Kopieren", save: "Speichern", fullscreen: "Vollbild", close: "Schließen",
    page: (i, n) => "Bild " + i + " von " + n,
    carousel: (n) => "Der Text ist zu lang für ein gut lesbares Bild und verteilt sich auf " + n + " Bilder, für ein Karussell. Teilen und Speichern nehmen alle mit.",
    cantShare: "Teilen geht hier nicht. Nutze Speichern oder Vollbild für einen Screenshot.", shareFailed: "Teilen hat nicht geklappt. Nutze Speichern oder Vollbild.",
    copiedN: (i) => "Bild " + i + " kopiert.", copied: "Bild kopiert. Jetzt z. B. in Instagram am Rechner oder in eine Nachricht einfügen.",
    copyFailed: "Kopieren hat nicht geklappt. Nutze Speichern.", savedN: (n, folder) => n + " Bilder gespeichert in " + folder,
    saved: (path) => "Gespeichert: " + path, saveFailed: "Speichern hat nicht geklappt.", fileName: "Zitat",
    capTitle: "Zitat speichern", quote: "Zitat", quotePh: "Was wurde gesagt oder geschrieben?", author: "Autor", authorPh: "z. B. Byron Katie",
    sourcePh: "Buch, Podcast, Gespräch … oder [[Notiz]]", place: "Stelle", placePh: "z. B. S. 42 oder 12:30", topic: "Thema",
    topicPh: "Mehrere mit Komma trennen", category: "Kategorie", openAfter: "Danach öffnen", cancel: "Abbrechen",
    needQuote: "Bitte zuerst das Zitat eintragen.", needLetters: "Das Zitat braucht Buchstaben oder Zahlen.", exists: "Dieses Zitat gibt es schon.",
    savedIn: (base) => "Zitat gespeichert in " + base,
  },
  en: {
    formats: { story: "Story 9:16", post: "Post 4:5", square: "Square 1:1" },
    altText: "Text as image: ", altQuote: "Quote as image: ", pager: "Images in the carousel", prev: "Previous image", next: "Next image",
    hint: "Take a screenshot now. Tap to bring the buttons back.", title: "Title", source: "Source", textAria: "Text in the image", textPh: "Text for the image",
    editInfo: "Changes only the image, not the note. “## ” at the start of a line makes a heading.", original: "Original",
    format: "Format", lightDark: "Light or dark", light: "Light", dark: "Dark", safezone: "Safe zone",
    safezoneTitle: "Shows what Instagram covers or crops. Only in the preview, never in the image.", theme: "Colour theme", custom: "Custom colours",
    text: "Text", smaller: "Smaller text", larger: "Larger text", centered: "Centred", frame: "Frame", position: "Position",
    up: "Move text up", middle: "Middle", middleAria: "Centre text vertically", down: "Move text down", edit: "Edit text",
    actions: "Actions", share: "Share", copy: "Copy", save: "Save", fullscreen: "Full screen", close: "Close",
    page: (i, n) => "Image " + i + " of " + n,
    carousel: (n) => "The text is too long for one readable image and is spread across " + n + " images, for a carousel. Share and Save include all of them.",
    cantShare: "Sharing isn’t available here. Use Save, or Full screen for a screenshot.", shareFailed: "Sharing didn’t work. Use Save or Full screen.",
    copiedN: (i) => "Image " + i + " copied.", copied: "Image copied. Now paste it, e.g. into Instagram on your computer or into a message.",
    copyFailed: "Copying didn’t work. Use Save.", savedN: (n, folder) => n + " images saved in " + folder,
    saved: (path) => "Saved: " + path, saveFailed: "Saving didn’t work.", fileName: "Quote",
    capTitle: "Save quote", quote: "Quote", quotePh: "What was said or written?", author: "Author", authorPh: "e.g. Byron Katie",
    sourcePh: "Book, podcast, conversation … or [[Note]]", place: "Location", placePh: "e.g. p. 42 or 12:30", topic: "Topic",
    topicPh: "Separate several with commas", category: "Category", openAfter: "Open afterwards", cancel: "Cancel",
    needQuote: "Please enter the quote first.", needLetters: "The quote needs letters or numbers.", exists: "This quote already exists.",
    savedIn: (base) => "Quote saved in " + base,
  },
};
const shareText = () => SHARE_TEXT[uiLang()];

// Farben und Schriften so, wie die Karte sie gerade zeigt: unsichtbare Karte zeichnen und auslesen
function shareStyle(data, theme, mode) {
  const probe = activeDocument.body.createDiv({ cls: "quote-card-previews qc-share-probe", attr: { "aria-hidden": "true" } });
  const col = probe.createDiv({ cls: "quote-card-preview qc-force-" + mode });
  buildCard(col.createDiv(), Object.assign({}, data, { author: "A", url: null }), theme);
  const card = col.querySelector(".quote-card");
  const get = (sel) => window.getComputedStyle(sel ? card.querySelector(sel) : card);
  const c = get(), q = get(".quote-card-text"), src = get(".quote-card-source"), mark = get(".quote-card-mark");
  const qSize = parseFloat(q.fontSize) || 16;
  const style = {
    bg: c.backgroundColor,
    color: c.color,
    quoteFont: q.fontFamily,
    quoteWeight: q.fontWeight,
    lineHeight: (parseFloat(q.lineHeight) / qSize) || 1.3,
    sourceFont: src.fontFamily,
    sourceWeight: src.fontWeight,
    upper: src.textTransform === "uppercase",
    markRatio: (parseFloat(mark.fontSize) / qSize) || 2.5,
    headings: {},
    mode,
  };
  // Überschriften so, wie das Theme (Style Settings) sie in Notizen zeigt: Schrift, Dicke, Größe im Verhältnis zum Text
  const md = probe.createDiv({ cls: "markdown-preview-view markdown-rendered" });
  const pStyle = window.getComputedStyle(md.createEl("p", { text: "x" }));
  const pSize = parseFloat(pStyle.fontSize) || 16;
  // Fließtext in der Schrift der Notizen (bei dir serifenlos), mit Ersatzschriften, falls Canvas sie nicht kennt
  style.bodyFont = (pStyle.fontFamily ? pStyle.fontFamily + ", " : "") + "system-ui, sans-serif";
  style.bodyWeight = pStyle.fontWeight || "400";
  for (let i = 1; i <= 6; i++) {
    const hs = window.getComputedStyle(md.createEl("h" + i, { text: "x" }));
    style.headings[i] = {
      family: hs.fontFamily || style.quoteFont,
      weight: hs.fontWeight || "400",
      italic: hs.fontStyle === "italic",
      upper: hs.textTransform === "uppercase",
      ratio: Math.min(2.2, Math.max(1.05, (parseFloat(hs.fontSize) || pSize * 1.3) / pSize)),
    };
  }
  probe.remove();
  return style;
}

// Farben aus getComputedStyle („rgb(…)“) als #rrggbb, und Mischung zweier Farben
const toHex = (c) => {
  const m = String(c).match(/(\d+(?:\.\d+)?)/g);
  if (!m || m.length < 3) return /^#[0-9a-f]{6}$/i.test(c) ? c : "#222222";
  return "#" + m.slice(0, 3).map((v) => Math.round(Number(v)).toString(16).padStart(2, "0")).join("");
};
const mixHex = (fg, bg, t) => "#" + [1, 3, 5].map((i) => {
  const a = parseInt(fg.slice(i, i + 2), 16), b = parseInt(bg.slice(i, i + 2), 16);
  return Math.round(b + (a - b) * t).toString(16).padStart(2, "0");
}).join("");

// Hierarchie wie in den Notizen: Überschrift in der stärksten Farbe (schwarz bzw. weiß),
// Fließtext etwas weicher, aber immer mit gut lesbarem Kontrast (mindestens 4,5 : 1, Ziel 7 : 1 wenn möglich)
function textColors(style) {
  const bg = toHex(style.bg);
  const heading = style.mode === "dark" ? "#ffffff" : "#000000";
  const base = toHex(style.color);
  let t = 0.78, body = mixHex(base, bg, t);
  while (t < 1 && contrast(body, bg) < 4.5) { t = Math.min(1, t + 0.04); body = mixHex(base, bg, t); }
  return { heading, body };
}

// Text in Zeilen umbrechen, Zeilenumbrüche im Zitat bleiben erhalten
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  for (const para of String(text).split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? line + " " + word : word;
      if (line && ctx.measureText(test).width > maxWidth) { lines.push(line); line = word; }
      else line = test;
    }
    lines.push(line);
  }
  return lines;
}

// Bild(er) zum Teilen zeichnen. opts: signature, guides (Safezone markieren), offset (-1 oben … 1 unten),
// scale (Schriftgröße), align ("left" | "center"), frame (feiner Rahmen).
// Passt der Text nicht mehr gut lesbar auf ein Bild, verteilt er sich auf mehrere Bilder (Karussell) statt gekürzt zu werden.
async function drawShareImages(data, style, format, opts) {
  opts = opts || {};
  const isText = data.kind === "text";
  const fmt = SHARE_FORMATS[format] || SHARE_FORMATS.story;
  const { w, h, safe } = fmt;
  const scale = Math.max(0.6, Math.min(1.6, Number(opts.scale) || 1));
  const center = opts.align === "center";
  const ctx = activeDocument.createElement("canvas").getContext("2d");
  const font = (weight, size, family, italic) => (italic ? "italic " : "") + weight + " " + Math.round(size) + "px " + family;
  const spacing = (px) => { if ("letterSpacing" in ctx) ctx.letterSpacing = px; };
  const fonts = activeDocument.fonts;
  if (fonts && fonts.load) {
    try {
      await Promise.all([
        fonts.load(font(style.quoteWeight, 80, style.quoteFont)),
        fonts.load(font(style.quoteWeight, 40, style.quoteFont, true)),
        fonts.load(font(style.sourceWeight, 30, style.sourceFont)),
        style.bodyFont ? fonts.load(font(style.bodyWeight, 40, style.bodyFont)) : Promise.resolve(),
        ...Object.values(style.headings || {}).map((hd) => fonts.load(font(hd.weight, 60, hd.family, hd.italic))),
      ]);
    } catch (e) { /* dann eben die Ersatzschrift */ }
  }
  const pad = safe.side;
  const maxW = w - 2 * pad;

  // Quellenzeile oben (auf jedem Bild gleich)
  const srcSize = Math.round(w * 0.028);
  const srcSpacing = Math.round(srcSize * 0.04) + "px";
  const srcFont = font(style.sourceWeight, srcSize, style.sourceFont);
  const srcText = [data.author, data.source, data.place].filter(Boolean).join(" · ");
  ctx.font = srcFont;
  spacing(srcSpacing);
  const srcLines = srcText ? wrapText(ctx, style.upper ? srcText.toUpperCase() : srcText, maxW) : [];
  const sigText = String(opts.signature || "").trim();
  const top = safe.top + srcLines.length * srcSize * 1.5 + (srcLines.length ? srcSize * 1.5 : 0);
  const footer = srcSize * 2.5;
  const bottomFor = (paged) => h - safe.bottom - (sigText || paged ? footer : 0);

  // Zeilen planen. Jede Zeile: Schrift, Grundlinie y, Zeilenkasten t0 bis t1 (für den Seitenumbruch)
  const lh = isText ? 1.5 : style.lineHeight;
  const trRatio = 0.55;
  const colors = isText ? textColors(style) : null;
  const build = (sz) => {
    const out = [];
    let yy = 0;
    if (isText) {
      // Fließtext: Zeilen mit „# “ bis „###### “ sind Überschriften im Stil der Notiz
      let first = true, para = 0, gap = false;
      for (const raw of String(data.quote).split("\n")) {
        if (!raw.trim()) { if (!first) { yy += sz * 0.7; gap = true; } continue; }
        const hm = raw.match(/^\s{0,3}(#{1,6})\s+(.*)$/);
        if (hm || gap) para++;
        gap = false;
        if (hm) {
          const hd = (style.headings || {})[hm[1].length] || { family: style.quoteFont, weight: style.quoteWeight, ratio: 1.3 };
          const hsz = sz * hd.ratio;
          const f = font(hd.weight, hsz, hd.family, hd.italic);
          ctx.font = f;
          spacing("0px");
          if (!first) yy += sz * 0.6;
          for (const line of wrapText(ctx, hd.upper ? hm[2].toUpperCase() : hm[2], maxW)) {
            const t0 = yy;
            yy += hsz * 1.15;
            out.push({ text: line, font: f, y: yy - hsz * 0.075, t0, t1: yy, base: "alphabetic", spacing: "0px", heading: true, color: colors.heading, para });
          }
          yy += sz * 0.4;
        } else {
          const f = font(style.bodyWeight || "400", sz, style.bodyFont || "system-ui, sans-serif");
          ctx.font = f;
          spacing("0px");
          for (const line of wrapText(ctx, raw, maxW)) {
            const t0 = yy;
            yy += sz * lh;
            out.push({ text: line, font: f, y: yy - sz * (lh - 1) / 2, t0, t1: yy, base: "alphabetic", spacing: "0px", color: colors.body, para });
          }
        }
        first = false;
      }
    } else {
      // Zitat: Anführungszeichen, Zitat, darunter klein und kursiv die Übersetzung
      const qSpacing = (-sz * 0.01).toFixed(1) + "px";
      const markH = sz * style.markRatio * 0.55;
      out.push({ text: "“", font: font(style.quoteWeight, sz * style.markRatio, style.quoteFont), y: 0, t0: 0, t1: markH, base: "top", spacing: "0px", mark: true });
      yy = markH;
      const qf = font(style.quoteWeight, sz, style.quoteFont);
      ctx.font = qf;
      spacing(qSpacing);
      for (const line of wrapText(ctx, data.quote, maxW)) {
        const t0 = yy;
        yy += sz * lh;
        out.push({ text: line, font: qf, y: yy - sz * (lh - 1) / 2, t0, t1: yy, base: "alphabetic", spacing: qSpacing });
      }
      if (data.translation) {
        yy += sz * 0.5;
        const tf = font(style.quoteWeight, sz * trRatio, style.quoteFont, true);
        ctx.font = tf;
        spacing("0px");
        for (const line of wrapText(ctx, data.translation, maxW)) {
          const t0 = yy;
          yy += sz * trRatio * 1.45;
          out.push({ text: line, font: tf, y: yy, t0, t1: yy, base: "alphabetic", spacing: "0px", alpha: 0.85 });
        }
      }
    }
    return { ops: out, height: yy };
  };

  // Größte Schrift, die auf ein Bild passt; unterhalb der gut lesbaren Größe lieber mehrere Bilder
  const start = Math.round(w * (isText ? 0.065 : 0.13) * scale);
  const readable = Math.round((isText ? 34 : 40) * scale);
  let size = start, layout = null;
  for (; size >= readable; size -= 2) {
    layout = build(size);
    if (layout.height <= bottomFor(false) - top) break;
  }
  let pages;
  if (size >= readable) pages = [layout.ops];
  else {
    size = readable;
    layout = build(size);
    const avail = bottomFor(true) - top;
    pages = [];
    const ops = layout.ops;
    let cur = [], begin = 0, pageStart = 0;
    const take = (j) => cur.push(Object.assign({}, ops[j], { y: ops[j].y - begin }));
    for (let k = 0; k < ops.length; k++) {
      const op = ops[k];
      // Eine Überschrift nie allein am Ende eines Bildes: sie braucht Platz für die nächste Zeile
      const need = op.heading && ops[k + 1] ? ops[k + 1].t1 : op.t1;
      if (cur.length && need - begin > avail) {
        // Lieber vor dem Absatz umbrechen, der auf diesem Bild begonnen hat, als ihn zu zerteilen
        let s0 = k;
        while (s0 > pageStart && ops[s0 - 1].para !== undefined && ops[s0 - 1].para === op.para) s0--;
        if (s0 > pageStart && s0 < k) {
          cur.splice(cur.length - (k - s0));
          pages.push(cur);
          cur = [];
          begin = ops[s0].t0;
          pageStart = s0;
          for (let j = s0; j < k; j++) take(j);
        } else {
          pages.push(cur);
          cur = [];
        }
      }
      if (!cur.length) { begin = op.t0; pageStart = k; }
      take(k);
    }
    if (cur.length) pages.push(cur);
  }
  const paged = pages.length > 1;
  const bottom = bottomFor(paged);

  const apply = (op) => {
    ctx.font = op.font;
    ctx.textBaseline = op.base;
    spacing(op.spacing);
  };
  const paint = (ops, index, guides) => {
    const canvas = activeDocument.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const c = canvas.getContext("2d");
    const cs = (px) => { if ("letterSpacing" in c) c.letterSpacing = px; };
    c.fillStyle = style.bg;
    c.fillRect(0, 0, w, h);
    // Feiner Rahmen, außerhalb der Safezone und innerhalb dessen, was das Profilraster zeigt
    if (opts.frame) {
      const fx = fmt.crop ? fmt.crop.side + 4 : 48;
      const fy = fmt === SHARE_FORMATS.story ? safe.top - 90 : 48;
      c.save();
      c.strokeStyle = style.color;
      c.globalAlpha = 0.35;
      c.lineWidth = 3;
      c.strokeRect(fx, fy, w - 2 * fx, h - 2 * fy);
      c.restore();
    }
    c.fillStyle = style.color;
    c.textBaseline = "alphabetic";
    c.font = srcFont;
    cs(srcSpacing);
    let y = safe.top;
    for (const line of srcLines) {
      y += srcSize * 1.5;
      c.fillText(line, center ? (w - c.measureText(line).width) / 2 : pad, y);
    }
    // Sichtbare Schrift (Tinte) messen, Zeilen ausrichten
    let inkTop = Infinity, inkBottom = -Infinity;
    const placed = ops.map((op) => {
      apply(op);
      const m = ctx.measureText(op.text || " ");
      const ascent = Number.isFinite(m.actualBoundingBoxAscent) ? m.actualBoundingBoxAscent : parseFloat(op.font) * 0.75;
      const descent = Number.isFinite(m.actualBoundingBoxDescent) ? m.actualBoundingBoxDescent : parseFloat(op.font) * 0.2;
      const left = m.actualBoundingBoxLeft > 0 ? m.actualBoundingBoxLeft : 0;
      const x = center ? (w - m.width) / 2 : pad + left;
      if (op.text) {
        inkTop = Math.min(inkTop, op.y - ascent);
        inkBottom = Math.max(inkBottom, op.y + descent);
      }
      return Object.assign({}, op, { x });
    });
    let shift;
    if (paged) shift = top - inkTop; // Karussell: auf jedem Bild oben bündig, damit alle gleich wirken
    else {
      // Mitte der Safezone; nur wenn Quelle oder Signatur im Weg sind, innerhalb des freien Raums
      const inkHeight = inkBottom - inkTop;
      shift = (safe.top + h - safe.bottom - inkHeight) / 2 - inkTop;
      const move = Math.max(-1, Math.min(1, Number(opts.offset) || 0));
      shift += move * Math.max(0, (bottom - top) - inkHeight) / 2;
      shift = Math.min(Math.max(shift, top - inkTop), Math.max(top - inkTop, bottom - inkBottom));
    }
    for (const op of placed) {
      c.font = op.font;
      c.textBaseline = op.base;
      cs(op.spacing);
      c.globalAlpha = op.alpha || 1;
      c.fillStyle = op.color || style.color;
      c.fillText(op.text, op.x, op.y + shift);
    }
    c.globalAlpha = 1;
    c.fillStyle = style.color;
    c.textBaseline = "alphabetic";
    c.font = srcFont;
    cs(srcSpacing);
    c.globalAlpha = 0.75;
    // Signatur unten, z. B. Webseite oder Instagram-Name; im Karussell rechts die Seitenzahl.
    // Grundlinie um die Unterlänge angehoben, damit auch „/“, „g“ oder „p“ in der Safezone bleiben.
    const footY = h - safe.bottom - Math.round(srcSize * 0.3);
    if (sigText) {
      const sig = style.upper ? sigText.toUpperCase() : sigText;
      c.fillText(sig, center && !paged ? (w - c.measureText(sig).width) / 2 : pad, footY);
    }
    if (paged) {
      const num = (index + 1) + " / " + pages.length;
      c.fillText(num, w - pad - c.measureText(num).width, footY);
    }
    c.globalAlpha = 1;
    // Nur in der Vorschau: Bereiche markieren, die Instagram überdeckt oder abschneidet
    if (guides) {
      c.save();
      c.fillStyle = style.color;
      c.globalAlpha = 0.12;
      const cut = fmt.crop ? fmt.crop.side : 0;
      if (fmt === SHARE_FORMATS.story) {
        c.fillRect(0, 0, w, safe.top);
        c.fillRect(0, h - safe.bottom, w, safe.bottom);
      }
      if (cut) {
        c.fillRect(0, 0, cut, h);
        c.fillRect(w - cut, 0, cut, h);
      }
      c.globalAlpha = 0.5;
      c.strokeStyle = style.color;
      c.lineWidth = 3;
      c.setLineDash([18, 12]);
      c.strokeRect(safe.side, safe.top, w - 2 * safe.side, h - safe.top - safe.bottom);
      c.restore();
    }
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  };
  const blobs = [];
  const guideBlobs = [];
  for (let i = 0; i < pages.length; i++) {
    blobs.push(await paint(pages[i], i, false));
    if (opts.guides) guideBlobs.push(await paint(pages[i], i, true));
  }
  return { blobs, guideBlobs: opts.guides ? guideBlobs : null, pages: pages.length, size };
}

// Markdown zu reinem Text: Formatierung, Links, Codeblöcke und Kommentare raus, Listen als „•“
function markdownToPlain(md) {
  return String(md || "")
    .replace(/^---\n[\s\S]*?\n---\n?/, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/%%[\s\S]*?%%/g, "")
    .replace(/!\[\[[^\]]*\]\]/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, (m, a) => a.split("#").pop())
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^[ \t]{0,3}(#{1,6})[ \t]+/gm, "$1 ")
    .replace(/^[ \t]*>[ \t]?(\[![^\]]*\][+-]?[ \t]*)?/gm, "")
    .replace(/^([ \t]*)[-*+][ \t]+\[[ xX]\][ \t]+/gm, "$1• ")
    .replace(/^([ \t]*)[-*+][ \t]+/gm, "$1• ")
    .replace(/(\*\*|__|==|~~)(.+?)\1/g, "$2")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/<[^>]*>/g, "")
    .replace(/#([\wäöüÄÖÜß/-]+)/g, "$1")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Was geteilt wird: ein Zitat (mit Anführungszeichen) oder Fließtext, jeweils mit Farbthema
function quotePayload(app, file) {
  return { kind: "quote", data: Object.assign(readCard(app, file), { kind: "quote" }), theme: quoteTheme(file), file };
}
function textPayload(app, file, text) {
  const fm = (file && (app.metadataCache.getFileCache(file) || {}).frontmatter) || {};
  const theme = PLUGIN ? noteTheme(PLUGIN, fm, plain(fmGet(fm, "farbe"))) : "sand";
  return { kind: "text", data: { kind: "text", quote: markdownToPlain(text), author: file ? file.basename : "", source: "", place: "", translation: "" }, theme };
}

// Markierter Text oder, ohne Markierung, der Absatz an der Schreibmarke
function editorText(editor) {
  if (!editor) return "";
  const sel = editor.getSelection();
  if (sel && sel.trim()) return sel;
  const cur = editor.getCursor().line;
  const blank = (n) => !editor.getLine(n).trim();
  if (blank(cur)) return "";
  let from = cur, to = cur;
  while (from > 0 && !blank(from - 1)) from--;
  while (to < editor.lineCount() - 1 && !blank(to + 1)) to++;
  const text = editor.getRange({ line: from, ch: 0 }, { line: to, ch: editor.getLine(to).length });
  return /^(```|---|%%)/.test(text.trim()) ? "" : text;
}

// Heutiges Datum als JJJJ-MM-TT (lokale Zeit)
const isoDate = (d) => {
  d = d || new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};

// Dateiname „Datum_Zitat.png“, z. B. „2026-11-08_Ist es wahr.png“, im Karussell mit „_1“, „_2“ …
const shareFileName = (quote, index, count) => {
  const text = String(quote).replace(/^#+\s*/gm, "").replace(/[\\/:*?"<>|#^[\]\n\r]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60).replace(/[\s.…]+$/, "").trim() || shareText().fileName;
  return isoDate() + "_" + text + (count > 1 ? "_" + (index + 1) : "") + ".png";
};

class ShareModal extends Modal {
  constructor(app, plugin, payload) {
    super(app);
    this.plugin = plugin;
    this.kind = payload.kind;
    this.data = payload.data;
    this.theme = payload.theme;
    this.file = payload.file || null;
    this.showSource = true;
    this.showGuides = true;
    this.offset = 0;
    this.scale = 1;
    this.align = "left";
    this.frame = false;
    this.page = 0;
    this.blobs = [];
    this.urls = [];
    this.guideUrls = [];
    // Nur für das Bild bearbeitbar; die Notiz bleibt unverändert
    this.original = Object.assign({}, this.data);
    const s = plugin.settings;
    this.format = SHARE_FORMATS[s.shareFormat] ? s.shareFormat : "story";
    this.mode = s.mode === "light" || s.mode === "dark" ? s.mode : (activeDocument.body.hasClass("theme-dark") ? "dark" : "light");
  }

  onOpen() {
    this.modalEl.addClass("qc-share-modal");
    const el = this.contentEl;
    el.empty();
    const T = shareText();
    this.stage = el.createDiv({ cls: "qc-share-stage" });
    this.img = this.stage.createEl("img", { cls: "qc-share-image", attr: { alt: (this.kind === "text" ? T.altText : T.altQuote) + this.data.quote } });
    this.stage.addEventListener("click", () => this.setClean(!this.modalEl.hasClass("is-clean")));
    // Karussell: zwischen den Bildern blättern
    this.pager = el.createDiv({ cls: "qc-share-pager is-hidden", attr: { role: "group", "aria-label": T.pager } });
    const prev = this.pager.createEl("button", { cls: "qc-share-chip", text: "‹", attr: { "aria-label": T.prev } });
    this.pageLabel = this.pager.createSpan({ cls: "qc-share-pagelabel" });
    const next = this.pager.createEl("button", { cls: "qc-share-chip", text: "›", attr: { "aria-label": T.next } });
    prev.addEventListener("click", () => this.turn(-1));
    next.addEventListener("click", () => this.turn(1));
    this.hint = el.createEl("p", { cls: "qc-share-hint", text: T.hint });
    this.note = el.createEl("p", { cls: "qc-share-note" });
    // Bearbeiten: Text und Quellenzeile nur für das Bild ändern
    this.editor = el.createDiv({ cls: "qc-share-edit is-hidden" });
    const sourceLabel = this.kind === "text" ? T.title : T.source;
    this.sourceInput = this.editor.createEl("input", { type: "text", cls: "qc-share-input", attr: { "aria-label": sourceLabel, placeholder: sourceLabel } });
    this.sourceInput.value = [this.data.author, this.data.source, this.data.place].filter(Boolean).join(" · ");
    this.textInput = this.editor.createEl("textarea", { cls: "qc-share-input", attr: { "aria-label": T.textAria, rows: "5", placeholder: T.textPh } });
    this.textInput.value = this.data.quote;
    const editRow = this.editor.createDiv({ cls: "qc-share-edit-row" });
    editRow.createSpan({ cls: "qc-share-edit-info", text: T.editInfo });
    const reset = editRow.createEl("button", { cls: "qc-share-chip", text: T.original });
    reset.addEventListener("click", () => {
      this.data = Object.assign({}, this.original);
      this.textInput.value = this.data.quote;
      this.sourceInput.value = [this.data.author, this.data.source, this.data.place].filter(Boolean).join(" · ");
      this.render();
    });
    const onEdit = () => {
      window.clearTimeout(this.editTimer);
      this.editTimer = window.setTimeout(() => {
        this.data = Object.assign({}, this.data, {
          quote: this.textInput.value.slice(0, 5000),
          author: this.sourceInput.value.replace(/\s+/g, " ").trim().slice(0, 200),
          source: "",
          place: "",
        });
        this.render();
      }, 300);
    };
    this.textInput.addEventListener("input", onEdit);
    this.sourceInput.addEventListener("input", onEdit);

    const bar = el.createDiv({ cls: "qc-share-bar" });
    const group = (label) => bar.createDiv({ cls: "qc-share-group", attr: { role: "group", "aria-label": label } });
    const chip = (parent, text, aria, onClick) => {
      const b = parent.createEl("button", { cls: "qc-share-chip", text, attr: aria ? { "aria-label": aria } : {} });
      b.addEventListener("click", onClick);
      return b;
    };
    const formats = group(T.format);
    this.formatButtons = Object.keys(SHARE_FORMATS).map((key) => [key, chip(formats, T.formats[key], null, () => { this.format = key; this.render(); })]);
    const modes = group(T.lightDark);
    this.modeButtons = [["light", T.light], ["dark", T.dark]].map(([key, label]) => [key, chip(modes, label, null, () => { this.mode = key; this.render(); })]);
    this.sourceButton = chip(modes, this.kind === "text" ? T.title : T.source, null, () => { this.showSource = !this.showSource; this.render(); });
    this.guideButton = chip(modes, T.safezone, null, () => { this.showGuides = !this.showGuides; this.render(); });
    this.guideButton.setAttr("title", T.safezoneTitle);

    // Farbthemen als Farbpunkte; „Eigene Farben“ gibt es nur für Zitate
    const themes = group(T.theme);
    const keys = Object.keys(THEMES).concat(this.kind === "quote" ? ["custom"] : []);
    this.themeButtons = keys.map((key) => {
      const name = key === "custom" ? T.custom : themeLabel(key);
      const b = themes.createEl("button", { cls: "qc-share-swatch", attr: { "aria-label": name, title: name } });
      b.addEventListener("click", () => { this.theme = key; this.render(); });
      return [key, b];
    });

    // Text: Größe, Ausrichtung, Rahmen, Position, Bearbeiten
    const text = group(T.text);
    chip(text, "A−", T.smaller, () => { this.scale = Math.max(0.7, Math.round((this.scale - 0.1) * 10) / 10); this.render(); });
    chip(text, "A+", T.larger, () => { this.scale = Math.min(1.5, Math.round((this.scale + 0.1) * 10) / 10); this.render(); });
    this.alignButton = chip(text, T.centered, null, () => { this.align = this.align === "center" ? "left" : "center"; this.render(); });
    this.frameButton = chip(text, T.frame, null, () => { this.frame = !this.frame; this.render(); });
    const position = group(T.position);
    chip(position, "↑", T.up, () => { this.offset = Math.max(-1, Math.round((this.offset - 0.25) * 4) / 4); this.render(); });
    this.centerButton = chip(position, T.middle, T.middleAria, () => { this.offset = 0; this.render(); });
    chip(position, "↓", T.down, () => { this.offset = Math.min(1, Math.round((this.offset + 0.25) * 4) / 4); this.render(); });
    this.editButton = chip(position, T.edit, null, () => this.toggleEdit());

    const actions = group(T.actions);
    const action = (icon, label, run, cta) => {
      const b = actions.createEl("button", { cls: "qc-share-action" + (cta ? " mod-cta" : "") });
      setIcon(b.createSpan({ cls: "qc-share-icon", attr: { "aria-hidden": "true" } }), icon);
      b.createSpan({ text: label });
      b.addEventListener("click", async () => {
        b.disabled = true;
        try { await run(); } finally { b.disabled = false; }
      });
      return b;
    };
    this.shareButton = action("share", T.share, () => this.share(), true);
    if (navigator.clipboard && window.ClipboardItem) action("copy", T.copy, () => this.copy());
    action("download", T.save, () => this.save());
    action("maximize", T.fullscreen, () => this.setClean(true));
    action("x", T.close, () => this.close());
    this.render();
    if (this.startEditing) this.toggleEdit();
  }

  onClose() {
    window.clearTimeout(this.editTimer);
    this.revoke();
    this.contentEl.empty();
  }

  revoke() {
    for (const u of this.urls.concat(this.guideUrls)) URL.revokeObjectURL(u);
    this.urls = [];
    this.guideUrls = [];
  }

  toggleEdit() {
    const open = this.editor.hasClass("is-hidden");
    this.editor.toggleClass("is-hidden", !open);
    this.editButton.toggleClass("is-active", open);
    this.editButton.setAttr("aria-pressed", String(open));
    if (open) this.textInput.focus();
  }

  turn(step) {
    const n = this.blobs.length;
    if (n < 2) return;
    this.page = (this.page + step + n) % n;
    this.showImage();
  }

  // Im Vollbild (für den Screenshot) immer das saubere Bild, ohne Safezone-Markierung
  setClean(on) {
    this.modalEl.toggleClass("is-clean", on);
    this.showImage();
  }

  showImage() {
    const i = Math.min(this.page, Math.max(0, this.urls.length - 1));
    const clean = this.modalEl.hasClass("is-clean") || !this.showGuides || !this.guideUrls[i];
    const src = clean ? this.urls[i] : this.guideUrls[i];
    if (src && this.img.src !== src) this.img.src = src;
    const n = this.urls.length;
    this.pager.toggleClass("is-hidden", n < 2);
    this.pageLabel.setText(shareText().page(i + 1, n));
  }

  async render() {
    const mark = (b, on) => { b.toggleClass("is-active", on); b.setAttr("aria-pressed", String(on)); };
    for (const [k, b] of this.formatButtons) mark(b, k === this.format);
    for (const [k, b] of this.modeButtons) mark(b, k === this.mode);
    mark(this.sourceButton, this.showSource);
    mark(this.guideButton, this.showGuides);
    mark(this.alignButton, this.align === "center");
    mark(this.frameButton, this.frame);
    this.centerButton.toggleClass("is-active", this.offset === 0);
    for (const [k, b] of this.themeButtons) {
      mark(b, k === this.theme);
      const st = shareStyle(this.data, k, this.mode);
      b.style.setProperty("--qc-swatch-bg", st.bg);
      b.style.setProperty("--qc-swatch-fg", st.color);
    }
    const style = shareStyle(this.data, this.theme, this.mode);
    this.modalEl.style.setProperty("--qc-share-bg", style.bg);
    this.modalEl.style.setProperty("--qc-share-color", style.color);
    const token = (this.token = {});
    const data = this.showSource ? this.data : Object.assign({}, this.data, { author: "", source: "", place: "" });
    const result = await drawShareImages(data, style, this.format, {
      signature: this.plugin.settings.shareSignature, guides: this.showGuides, offset: this.offset,
      scale: this.scale, align: this.align, frame: this.frame,
    });
    if (token !== this.token || !result || !result.blobs.length || result.blobs.some((b) => !b)) return;
    this.revoke();
    this.blobs = result.blobs;
    this.urls = result.blobs.map((b) => URL.createObjectURL(b));
    this.guideUrls = (result.guideBlobs || []).map((b) => URL.createObjectURL(b));
    if (this.page >= this.blobs.length) this.page = 0;
    this.note.setText(result.pages > 1 ? shareText().carousel(result.pages) : "");
    this.showImage();
    this.shareButton.toggleClass("is-hidden", !this.canShare());
  }

  imageFiles() {
    return this.blobs.map((b, i) => new File([b], shareFileName(this.data.quote, i, this.blobs.length), { type: "image/png" }));
  }

  canShare() {
    try { return !!(this.blobs.length && navigator.share && navigator.canShare && navigator.canShare({ files: this.imageFiles() })); }
    catch (e) { return false; }
  }

  // Bei Zitaten festhalten, wann sie zuletzt geteilt wurden (Eigenschaft „geteilt“)
  async markShared() {
    if (this.kind !== "quote" || !this.file) return;
    try { await this.app.fileManager.processFrontMatter(this.file, (fm) => { fm[fmKey(fm, "geteilt")] = isoDate(); }); }
    catch (e) { /* nur Komfort */ }
  }

  // System-Menü: auf dem iPhone z. B. Instagram, Nachrichten, Fotos sichern
  async share() {
    const T = shareText();
    if (!this.canShare()) { new Notice(T.cantShare); return; }
    try {
      await navigator.share({ files: this.imageFiles() });
      await this.markShared();
    } catch (e) { if (e && e.name !== "AbortError") new Notice(T.shareFailed); }
  }

  async copy() {
    const T = shareText();
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": this.blobs[this.page] })]);
      new Notice(this.blobs.length > 1 ? T.copiedN(this.page + 1) : T.copied);
      await this.markShared();
    } catch (e) { new Notice(T.copyFailed); }
  }

  // Im Vault ablegen: auf dem iPhone in der Dateien-App unter Obsidian zu finden, von dort aus teilbar
  async save() {
    const vault = this.app.vault;
    const folder = String(this.plugin.settings.shareFolder || DEFAULTS.shareFolder).replace(/^\/+|\/+$/g, "").replace(/\.\.+/g, "") || DEFAULTS.shareFolder;
    try {
      // Ordner Stufe für Stufe anlegen, falls es ihn noch nicht gibt
      let part = "";
      for (const seg of folder.split("/")) {
        part = part ? part + "/" + seg : seg;
        if (!vault.getAbstractFileByPath(part)) await vault.createFolder(part);
      }
      const saved = [];
      for (let i = 0; i < this.blobs.length; i++) {
        const name = shareFileName(this.data.quote, i, this.blobs.length).replace(/\.png$/, "");
        let path = folder + "/" + name + ".png";
        for (let k = 2; vault.getAbstractFileByPath(path); k++) path = folder + "/" + name + " " + k + ".png";
        await vault.createBinary(path, await this.blobs[i].arrayBuffer());
        saved.push(path);
      }
      new Notice(saved.length > 1 ? shareText().savedN(saved.length, folder) : shareText().saved(saved[0]));
      await this.markShared();
    } catch (e) { new Notice(shareText().saveFailed); }
  }
}

// Zitat schnell erfassen: aus einer Markierung (z. B. in einer Buchnotiz) oder leer, z. B. über „＋ Zitat“ auf Home.
// Legt eine Zitat-Notiz aus der Quote-Vorlage an. Aus Buch- und Mediennotizen werden Autor und Quelle (als Link) übernommen.
class QuoteCaptureModal extends Modal {
  constructor(app, plugin, opts) {
    super(app);
    this.plugin = plugin;
    this.text = markdownToPlain((opts && opts.text) || "").replace(/^#+\s*/gm, "").replace(/^•\s*/gm, "").replace(/\s*\n\s*/g, " ").trim();
    this.from = (opts && opts.file) || null;
  }

  onOpen() {
    this.modalEl.addClass("qc-capture-modal");
    const T = shareText();
    this.titleEl.setText(T.capTitle);
    const el = this.contentEl;
    el.empty();
    const s = this.plugin.settings;
    const fm = (this.from && (this.app.metadataCache.getFileCache(this.from) || {}).frontmatter) || {};
    const media = this.from && (this.from.path.startsWith((s.mediaFolder || DEFAULTS.mediaFolder) + "/") || ["Buch", "Book"].includes(plain(fmGet(fm, "vorlage"))));
    const field = (label, control) => {
      const row = el.createDiv({ cls: "qc-capture-field" });
      const id = "qc-capture-" + label.toLowerCase().replace(/[^a-zäöü]/g, "");
      row.createEl("label", { text: label, attr: { for: id } });
      const input = control(row);
      input.id = id;
      return input;
    };
    this.quoteEl = field(T.quote, (r) => r.createEl("textarea", { cls: "qc-share-input", attr: { rows: "4", placeholder: T.quotePh } }));
    this.quoteEl.value = this.text;
    this.authorEl = field(T.author, (r) => r.createEl("input", { type: "text", cls: "qc-share-input", attr: { placeholder: T.authorPh } }));
    this.authorEl.value = media ? plain(fm.author || fm.autor) : "";
    this.sourceEl = field(T.source, (r) => r.createEl("input", { type: "text", cls: "qc-share-input", attr: { placeholder: T.sourcePh } }));
    this.sourceEl.value = media ? "[[" + this.from.basename + "]]" : "";
    this.placeEl = field(T.place, (r) => r.createEl("input", { type: "text", cls: "qc-share-input", attr: { placeholder: T.placePh } }));
    this.topicEl = field(T.topic, (r) => r.createEl("input", { type: "text", cls: "qc-share-input", attr: { placeholder: T.topicPh } }));
    const root = this.app.vault.getAbstractFileByPath(s.quotesFolder || DEFAULTS.quotesFolder);
    const cats = (root && root.children ? root.children.filter((c) => c.children).map((c) => c.name) : []).sort((a, b) => a.localeCompare(b, uiLang()));
    this.catEl = field(T.category, (r) => r.createEl("select", { cls: "dropdown" }));
    for (const c of cats) this.catEl.createEl("option", { text: c, value: c });
    this.catEl.value = cats.includes("Quotes") ? "Quotes" : (cats[0] || "");
    const openRow = el.createDiv({ cls: "qc-capture-field is-inline" });
    this.openEl = openRow.createEl("input", { type: "checkbox", attr: { id: "qc-capture-open" } });
    openRow.createEl("label", { text: T.openAfter, attr: { for: "qc-capture-open" } });
    const buttons = el.createDiv({ cls: "modal-button-container" });
    const save = buttons.createEl("button", { cls: "mod-cta", text: T.save });
    buttons.createEl("button", { text: T.cancel }).addEventListener("click", () => this.close());
    save.addEventListener("click", () => this.save());
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey || e.target.tagName === "INPUT")) { e.preventDefault(); this.save(); }
    });
    window.setTimeout(() => (this.text ? this.authorEl : this.quoteEl).focus(), 50);
  }

  onClose() {
    this.contentEl.empty();
  }

  async save() {
    if (this.busy) return;
    const T = shareText();
    const quote = this.quoteEl.value.replace(/\s+/g, " ").trim().slice(0, 2000);
    if (!quote) { new Notice(T.needQuote); return; }
    const vault = this.app.vault;
    const s = this.plugin.settings;
    const base = (s.quotesFolder || DEFAULTS.quotesFolder) + (this.catEl.value ? "/" + this.catEl.value : "");
    // Notizname wie bei den anderen Zitaten: das Zitat selbst, ohne Zeichen, die Dateinamen nicht erlauben
    const name = quote.replace(/[\\/:*?"<>|#^[\]]/g, "").replace(/\s+/g, " ").trim().slice(0, 120).replace(/[\s.…]+$/, "").trim();
    if (!name) { new Notice(T.needLetters); return; }
    const twin = vault.getMarkdownFiles().find((f) => f.basename.toLowerCase() === name.toLowerCase());
    if (twin) {
      new Notice(T.exists);
      this.close();
      await this.app.workspace.getLeaf(false).openFile(twin);
      return;
    }
    this.busy = true;
    try {
      const tpl = vault.getAbstractFileByPath(s.quoteTemplate || DEFAULTS.quoteTemplate);
      const text = tpl ? fillTemplate(await vault.read(tpl), name) : "---\ntype: quote\n---\n```quote-card\n```\n";
      const file = await vault.create(base + "/" + name + ".md", text);
      const list = (v) => v.split(",").map((x) => x.trim()).filter(Boolean);
      const author = this.authorEl.value.trim(), source = this.sourceEl.value.trim(), place = this.placeEl.value.trim();
      const topics = list(this.topicEl.value);
      const from = this.from;
      await this.app.fileManager.processFrontMatter(file, (fm) => {
        if (author) fm.author = author;
        if (source) fm.source = source;
        if (place) fm[fmKey(fm, "stelle")] = place;
        if (topics.length) fm[fmKey(fm, "thema")] = topics;
        if (name !== quote) fm.quote = quote;
        // Gefunden in: Rückverweis auf die Notiz, aus der das Zitat stammt, falls sie nicht schon die Quelle ist
        if (from && !source.includes("[[" + from.basename)) fm.related = [].concat(fm.related || []).concat("[[" + from.basename + "]]");
      });
      new Notice(T.savedIn(base));
      this.close();
      if (this.openEl.checked) await this.app.workspace.getLeaf(false).openFile(file);
    } catch (e) {
      new Notice(T.saveFailed);
    } finally {
      this.busy = false;
    }
  }
}

