// ---------- Bilder und Videos anordnen ----------
// Größe ändert Obsidian selbst (Ecke ziehen, seit 1.12). Dieses Modul ergänzt nur die Anordnung.
// Gespeichert wird sie als Stichwort im Link, vor der Größe: ![[bild.png|right|300]].
// Obsidian liest „300“ als Breite und „right“ als Beschreibung; beim Ziehen an der Ecke ersetzt es nur die Zahl,
// das Stichwort bleibt also erhalten. Gestaltet wird über das Attribut „alt“ des Embeds (styles.css).
// Die Stichwörter sind englisch (left, center, right, row). Die deutschen aus älteren Notizen (links, mitte, rechts, reihe) gelten weiter.
const MEDIA_LAYOUTS = {
  left: { icon: "align-left" },
  center: { icon: "align-center" },
  right: { icon: "align-right" },
  row: { icon: "columns-2" },
};
const MEDIA_LAYOUT_DE = { links: "left", mitte: "center", rechts: "right", reihe: "row" };
// Stichwort vereinheitlichen: „Rechts“ → „right“, Unbekanntes → ""
const layoutKey = (s) => {
  const l = String(s || "").trim().toLowerCase();
  const k = MEDIA_LAYOUT_DE[l] || l;
  return MEDIA_LAYOUTS[k] ? k : "";
};
const MEDIA_TEXT = {
  de: {
    layouts: { left: "Links, Text daneben", center: "Mittig", right: "Rechts, Text daneben", row: "Nebeneinander" },
    bar: "Bild oder Video anordnen", normal: "Normal", smaller: "Kleiner", larger: "Größer",
    up: "Eine Zeile nach oben", down: "Eine Zeile nach unten", grip: "Größe ziehen", notFound: "Den Link zu diesem Bild habe ich nicht gefunden.",
  },
  en: {
    layouts: { left: "Left, text beside it", center: "Centred", right: "Right, text beside it", row: "Side by side" },
    bar: "Arrange image or video", normal: "Normal", smaller: "Smaller", larger: "Larger",
    up: "One line up", down: "One line down", grip: "Drag to resize", notFound: "Couldn’t find the link to this image.",
  },
};
const mediaText = () => MEDIA_TEXT[uiLang()];
const MEDIA_SELECTOR = ".markdown-source-view .internal-embed.image-embed, .markdown-source-view .internal-embed.video-embed";

// Größe am Ende eines Alias, wie Obsidian sie liest: „300“ oder „300x200“
const isSizePart = (s) => /^\s*\d+\s*(x\s*\d+\s*)?$/.test(String(s));

// Aktuelles Stichwort aus einem Alias, z. B. „right|300“ → „right“, auch „rechts|300“ → „right“
function mediaLayoutOf(alias) {
  return layoutKey(String(alias || "").split("|")[0]);
}

// Alias mit neuem Stichwort; Größe und eigene Beschreibung bleiben erhalten. Leeres Stichwort = Normal.
function withMediaLayout(alias, layout) {
  const parts = alias ? String(alias).split("|") : [];
  const size = parts.length && isSizePart(parts[parts.length - 1]) ? parts.pop().trim() : null;
  const rest = parts.filter((p) => p.trim() && !layoutKey(p));
  const key = layoutKey(layout);
  return [].concat(key ? [key] : [], rest, size ? [size] : []).join("|");
}

// Alias mit neuer Breite, wie Obsidian beim Ziehen an der Ecke: eine Größe am Ende wird ersetzt, sonst angehängt.
// Die Höhe fällt weg, damit das Seitenverhältnis erhalten bleibt.
function withMediaSize(alias, width) {
  const parts = alias ? String(alias).split("|") : [];
  if (parts.length && isSizePart(parts[parts.length - 1])) parts.pop();
  return parts.filter((p) => p.trim()).concat(width ? [String(Math.round(width))] : []).join("|");
}

// Embed-Links einer Zeile: ![[ziel|alias]] mit Position
function findEmbeds(text) {
  const out = [];
  const re = /!\[\[([^\]|]+?)(?:\|([^\]]*))?\]\]/g;
  let m;
  while ((m = re.exec(text))) out.push({ from: m.index, to: m.index + m[0].length, target: m[1].trim(), alias: m[2] === undefined ? null : m[2] });
  return out;
}

// Link mit neuem Alias zusammensetzen
const embedLink = (target, alias) => "![[" + target + (alias ? "|" + alias : "") + "]]";

// Nächstes Bild- oder Video-Embed zum Ereignisziel. Ohne instanceof, das in abgetrennten Fenstern nicht greift.
const closestMedia = (t) => (t && typeof t.closest === "function" ? t.closest(MEDIA_SELECTOR) : null);

class MediaBar {
  constructor(plugin) {
    this.plugin = plugin;
    this.app = plugin.app;
    this.embed = null;
    this.bar = null;
    this.grip = null;
    this.hideTimer = 0;
  }

  // Ereignisse für ein Fenster (Hauptfenster oder abgetrenntes Fenster) anmelden
  load(doc) {
    const p = this.plugin;
    // Am Rechner beim Darüberfahren, auf dem iPhone beim Antippen
    p.registerDomEvent(doc, "pointerover", (e) => {
      if (e.pointerType === "touch") return;
      const embed = closestMedia(e.target);
      if (embed) this.show(embed);
      else if (this.bar && !this.bar.contains(e.target)) this.hideSoon();
    });
    p.registerDomEvent(doc, "pointerdown", (e) => {
      const embed = closestMedia(e.target);
      if (embed) this.show(embed);
      else if (this.bar && !this.bar.contains(e.target) && !(this.grip && this.grip.contains(e.target))) this.hide();
    }, true);
    p.registerDomEvent(doc, "keydown", (e) => { if (e.key === "Escape") this.hide(); });
    p.registerDomEvent(doc, "scroll", () => this.place(), true);
  }

  unload() {
    this.hide();
  }

  // Die Notiz-Ansicht, in der das Embed steckt
  viewFor(embed) {
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      if (leaf.view && leaf.view.containerEl.contains(embed)) return leaf.view;
    }
    return null;
  }

  // Wo steht der Link zu diesem Embed im Text? Sucht in der Zeile des Embeds und den Nachbarzeilen.
  locate(embed) {
    const view = this.viewFor(embed);
    const cm = view && view.editor && view.editor.cm;
    if (!cm || typeof cm.posAtDOM !== "function") return null;
    let pos;
    try { pos = cm.posAtDOM(embed); } catch (e) { return null; }
    const doc = cm.state.doc;
    const target = String(embed.getAttribute("src") || "").trim();
    const here = doc.lineAt(pos).number;
    let best = null;
    for (const n of [here, here - 1, here + 1]) {
      if (n < 1 || n > doc.lines) continue;
      const line = doc.line(n);
      for (const m of findEmbeds(line.text)) {
        if (m.target !== target) continue;
        const from = line.from + m.from, to = line.from + m.to;
        const dist = Math.min(Math.abs(pos - from), Math.abs(pos - to));
        if (!best || dist < best.dist) best = Object.assign({}, m, { from, to, dist, line: n - 1, view });
      }
    }
    return best;
  }

  show(embed) {
    window.clearTimeout(this.hideTimer);
    if (this.embed === embed && this.bar) return;
    const found = this.locate(embed);
    if (!found) return;
    this.hide();
    this.embed = embed;
    const current = mediaLayoutOf(found.alias);
    const T = mediaText();
    const bar = (this.bar = embed.ownerDocument.body.createDiv({ cls: "qc-media-bar", attr: { role: "toolbar", "aria-label": T.bar } }));
    const button = (icon, label, run, active) => {
      const b = bar.createEl("button", { cls: "clickable-icon" + (active ? " is-active" : ""), attr: { "aria-label": label, title: label } });
      setIcon(b, icon);
      if (active) b.setAttr("aria-pressed", "true");
      b.addEventListener("pointerdown", (e) => e.preventDefault());
      b.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); run(); });
    };
    for (const [key, l] of Object.entries(MEDIA_LAYOUTS)) button(l.icon, T.layouts[key], () => this.apply(key), current === key);
    button("square", T.normal, () => this.apply(""), !current);
    bar.createDiv({ cls: "qc-media-sep" });
    if (this.image()) {
      button("zoom-out", T.smaller, () => this.resizeBy(0.8));
      button("zoom-in", T.larger, () => this.resizeBy(1.25));
      bar.createDiv({ cls: "qc-media-sep" });
      // Auf iPhone und iPad gibt es Obsidians Ziehgriff nicht, dort kommt ein eigener für den Finger dazu
      if (Platform.isMobile) this.addGrip();
    }
    button("arrow-up", T.up, () => this.move("up"));
    button("arrow-down", T.down, () => this.move("down"));
    bar.addEventListener("pointerleave", (e) => { if (e.pointerType !== "touch") this.hideSoon(); });
    bar.addEventListener("pointerenter", () => window.clearTimeout(this.hideTimer));
    this.place();
  }

  place() {
    if (!this.bar || !this.embed) return;
    if (!this.embed.isConnected) { this.hide(); return; }
    const r = this.embed.getBoundingClientRect();
    const top = Math.max(8, r.top + 8), left = Math.max(8, Math.min(r.left + 8, this.win().innerWidth - this.bar.offsetWidth - 8));
    this.bar.setCssProps({ top: top + "px", left: left + "px" });
    const img = this.image();
    if (this.grip && img) {
      const ir = img.getBoundingClientRect();
      this.grip.setCssProps({ top: (ir.bottom - 34) + "px", left: (ir.right - 34) + "px" });
    }
  }

  hideSoon() {
    window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(() => this.hide(), 400);
  }

  hide() {
    window.clearTimeout(this.hideTimer);
    if (this.dragging) return;
    if (this.bar) this.bar.remove();
    if (this.grip) this.grip.remove();
    this.bar = null;
    this.grip = null;
    this.embed = null;
  }

  // Fenster des Embeds, auch bei abgetrennten Fenstern
  win() {
    return (this.embed && this.embed.ownerDocument.defaultView) || activeWindow;
  }

  // Das Bild im Embed (Videos werden nicht skaliert)
  image() {
    return this.embed && this.embed.matches(".image-embed") ? this.embed.querySelector("img") : null;
  }

  // Breite des Bildes in den Link schreiben
  writeSize(width) {
    const found = this.embed && this.locate(this.embed);
    if (!found) { new Notice(mediaText().notFound); return false; }
    const editor = found.view.editor;
    editor.replaceRange(embedLink(found.target, withMediaSize(found.alias, width)), editor.offsetToPos(found.from), editor.offsetToPos(found.to));
    return true;
  }

  // Größte sinnvolle Breite: die Breite der Notiz
  maxWidth() {
    const box = this.embed && this.embed.closest(".cm-content, .markdown-preview-sizer, .markdown-source-view");
    return Math.max(120, box ? box.clientWidth : this.win().innerWidth);
  }

  resizeBy(factor) {
    const img = this.image();
    if (!img) return;
    const width = Math.max(60, Math.min(this.maxWidth(), img.getBoundingClientRect().width * factor));
    if (this.writeSize(width)) this.hide();
  }

  // Ziehgriff für den Finger, unten rechts am Bild. Erst beim Loslassen wird die Breite in den Link geschrieben.
  addGrip() {
    const grip = (this.grip = this.embed.ownerDocument.body.createDiv({ cls: "qc-media-grip", attr: { role: "slider", "aria-label": mediaText().grip } }));
    let startX = 0, startWidth = 0, width = 0;
    grip.addEventListener("pointerdown", (e) => {
      const img = this.image();
      if (!img) return;
      e.preventDefault();
      e.stopPropagation();
      try { grip.setPointerCapture(e.pointerId); } catch (err) { /* nur Komfort */ }
      this.dragging = true;
      window.clearTimeout(this.hideTimer);
      startX = e.clientX;
      startWidth = width = img.getBoundingClientRect().width;
      img.addClass("qc-media-resizing");
      grip.addClass("is-dragging");
    });
    grip.addEventListener("pointermove", (e) => {
      if (!this.dragging) return;
      const img = this.image();
      if (!img) return;
      e.preventDefault();
      width = Math.round(Math.max(60, Math.min(this.maxWidth(), startWidth + (e.clientX - startX))));
      img.setCssProps({ width: width + "px" });
      this.place();
    });
    const end = (e) => {
      if (!this.dragging) return;
      this.dragging = false;
      grip.removeClass("is-dragging");
      try { grip.releasePointerCapture(e.pointerId); } catch (err) { /* nur Komfort */ }
      if (Math.abs(width - startWidth) >= 2) this.writeSize(width);
      else { const img = this.image(); if (img) { img.removeClass("qc-media-resizing"); img.style.removeProperty("width"); } }
      this.hide();
    };
    grip.addEventListener("pointerup", end);
    grip.addEventListener("pointercancel", end);
  }

  // Stichwort im Link setzen oder entfernen
  apply(layout) {
    const found = this.embed && this.locate(this.embed);
    if (!found) { new Notice(mediaText().notFound); this.hide(); return; }
    const editor = found.view.editor;
    const next = embedLink(found.target, withMediaLayout(found.alias, layout));
    editor.replaceRange(next, editor.offsetToPos(found.from), editor.offsetToPos(found.to));
    this.hide();
  }

  // Zeile mit dem Bild verschieben, mit den Obsidian-Befehlen „Zeile nach oben/unten“
  move(dir) {
    const found = this.embed && this.locate(this.embed);
    if (!found) { this.hide(); return; }
    const editor = found.view.editor;
    editor.setCursor({ line: found.line, ch: 0 });
    this.app.commands.executeCommandById(dir === "up" ? "editor:swap-line-up" : "editor:swap-line-down");
    this.hide();
  }
}

