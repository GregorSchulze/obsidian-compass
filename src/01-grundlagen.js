"use strict";
// Compass: Ein Codeblock ```quote-card``` zeigt das Zitat der Notiz als Karte.
// Zitat aus der Eigenschaft „quote“ oder dem Notiznamen, Quelle aus „author“, „source“ und „stelle“,
// Link aus „link“, Übersetzung aus „übersetzung“.
// Alles wird als Text gesetzt, nie als HTML. Links nur mit http oder https.
// Außerdem: ```note-header``` für einen farbigen Kopf in normalen Notizen.
// Aussehen in Einstellungen → Compass, getrennt nach Quotes und Notizen, gespeichert als CSS-Variablen.
const { Plugin, MarkdownRenderChild, PluginSettingTab, Setting, setIcon, Notice, Modal, MarkdownView, Platform, normalizePath } = require("obsidian");

const DEFAULTS = {
  mode: "auto",
  bgLight: "#9ab4e0",
  colorLight: "#222222",
  bgDark: "#2c3e5c",
  colorDark: "#eceae3",
  radius: 12,
  quoteFont: "\"Instrument Serif\", Georgia, serif",
  quoteSize: 1.8,
  quoteWeight: "400",
  quoteLineHeight: 1.3,
  markSize: 2.5,
  sourceFont: "\"Geist Mono\", ui-monospace, Menlo, monospace",
  sourceSize: 0.75,
  sourceWeight: "400",
  sourceUppercase: true,
  quoteTheme: "blau",
  quotesFolder: "40 Quotes",
  categoryThemes: {},
  shareFormat: "story",
  shareFolder: "99 System/Attachments/Shared",
  shareSignature: "",
  quoteTemplate: "99 System/Templates/Quote Template.md",
  mediaFolder: "50 Media",
  // Sprache der Oberfläche und Sprache der Notizen (Namen neuer Eigenschaften) sind getrennt. Standard ist Englisch.
  lang: "en",
  noteLang: "en",
  setupDone: false,
  setupTemplater: null,
};

const WEIGHTS = { "300": "Leicht", "400": "Normal", "500": "Mittel", "600": "Halbfett", "700": "Fett" };
const MODES = { auto: "Automatisch (wie Obsidian bzw. System)", light: "Immer hell", dark: "Immer dunkel" };

// Sprache der Oberfläche aus den Einstellungen: „en“ (Standard) oder „de“. Jede Datei hat ein eigenes Textobjekt { de, en }.
const uiLang = () => (PLUGIN && PLUGIN.settings && PLUGIN.settings.lang === "de" ? "de" : "en");
const BASE_TEXT = {
  de: { locale: "de-DE", weights: WEIGHTS, modes: MODES, link: "Link", linkAria: (host) => "Link zur Quelle: " + host, openQuote: "Zitat öffnen" },
  en: { locale: "en-GB", weights: { "300": "Light", "400": "Regular", "500": "Medium", "600": "Semibold", "700": "Bold" },
    modes: { auto: "Automatic (follows Obsidian or the system)", light: "Always light", dark: "Always dark" },
    link: "Link", linkAria: (host) => "Link to source: " + host, openQuote: "Open quote" },
};
const baseText = () => BASE_TEXT[uiLang()];

// Steuerzeichen (Zeilenumbrüche, Tabulatoren usw.) aus Eingaben entfernen oder ersetzen
const noControl = (s, repl = "") => Array.from(String(s == null ? "" : s), (c) => {
  const n = c.codePointAt(0);
  return n < 32 || n === 127 ? repl : c;
}).join("");

const plain = (v) => {
  if (Array.isArray(v)) v = v[0];
  if (v == null) return "";
  return String(v).trim().replace(/^\[\[|\]\]$/g, "").split("|").pop().trim();
};

const safeLink = (v) => {
  const s = plain(v);
  if (!/^https?:\/\/[^\s"<>]+$/i.test(s)) return null;
  try { return new URL(s); } catch (e) { return null; }
};

const safeFont = (s) => String(s || "").replace(/[;{}<>\\]/g, "").trim();
const safeColor = (s, fallback) => (/^#[0-9a-f]{6}$/i.test(s) ? s : fallback);

// Kontrast nach WCAG
const luminance = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// Eigenschaften auf Deutsch oder Englisch: Compass liest beide Namen, z. B. „kernaussage“ oder „summary“
const PROP_EN = { vorlage: "template", kernaussage: "summary", teilen: "share", geteilt: "shared", thema: "topic", stelle: "location",
  "übersetzung": "translation", bewertung: "rating", notiz: "comment", quellen: "sources", bezug: "about", art: "kind", farbe: "color" };
const fmGet = (fm, key) => {
  if (!fm) return undefined;
  if (fm[key] !== undefined) return fm[key];
  return PROP_EN[key] ? fm[PROP_EN[key]] : undefined;
};
// Name zum Schreiben: den vorhandenen weiterverwenden, sonst je nach Sprache der Notizen (nicht der Oberfläche)
const fmKey = (fm, key) => {
  if (fm && fm[key] !== undefined) return key;
  if (fm && PROP_EN[key] && fm[PROP_EN[key]] !== undefined) return PROP_EN[key];
  return PLUGIN && PLUGIN.settings.noteLang === "en" && PROP_EN[key] ? PROP_EN[key] : key;
};

// Schlüsselwörter in Codeblöcken sind englisch. Die deutschen aus älteren Notizen gelten weiter.
const KEYWORDS_DE = { ordner: "folder", sekunden: "seconds", heute: "today", zitat: "quote", zitate: "quotes", kachel: "tile",
  tageszitat: "dailyquote", erfassen: "capture", medien: "media", leseplan: "readingplan", vorlage: "template", alle: "all", farbe: "color" };
const keyword = (k) => {
  const l = String(k || "").trim().toLowerCase().replace(/[-_\s]/g, "");
  return KEYWORDS_DE[l] || l;
};
const isYes = (v) => /^(ja|yes|true|on|1)$/i.test(String(v == null ? "" : v).trim());
const isToday = (v) => /^(heute|today)$/i.test(String(v == null ? "" : v).trim());
// „schlüssel: wert“-Zeilen eines Codeblocks, Schlüssel auf Englisch vereinheitlicht. Mehrfache Schlüssel (tile) als Liste.
function blockOptions(source) {
  const opt = {}, list = {};
  for (const line of String(source || "").split("\n")) {
    const m = line.match(/^\s*([a-zäöüß][a-zäöüß_ -]*?)\s*:\s*(.+?)\s*$/i);
    if (!m) continue;
    const key = keyword(m[1]);
    (list[key] = list[key] || []).push(m[2]);
    opt[key] = m[2];
  }
  return { opt, list };
}

// Das laufende Plugin, damit Karten seine Einstellungen kennen
let PLUGIN = null;

// Farbthema einer Zitatkarte: Kategorie (Unterordner von 40 Quotes) vor Standard-Thema. „custom“ = eigene Farben.
function quoteTheme(file) {
  const s = PLUGIN ? PLUGIN.settings : DEFAULTS;
  const base = (s.quotesFolder || "40 Quotes") + "/";
  const rest = file && file.path.startsWith(base) ? file.path.slice(base.length) : "";
  const category = rest.includes("/") ? rest.split("/")[0] : "";
  const theme = (category && (s.categoryThemes || {})[category]) || s.quoteTheme || "custom";
  return theme === "custom" || THEMES[theme] ? theme : "custom";
}

function buildCard(el, { author, source, place, url, quote, translation }, theme) {
  el.empty();
  const card = el.createDiv({ cls: "quote-card is-" + (theme || "custom") });
  const line = [author, source, place].filter(Boolean).join(" · ");
  if (line || url) {
    const p = card.createEl("p", { cls: "quote-card-source" });
    if (line) p.appendText(line);
    if (url) {
      if (line) p.appendText(" · ");
      const B = baseText();
      const a = p.createEl("a", {
        cls: "quote-card-link",
        text: B.link,
        href: url.href,
        attr: { target: "_blank", rel: "noopener noreferrer", "aria-label": B.linkAria(url.hostname) },
      });
      setIcon(a.createSpan({ cls: "quote-card-arrow", attr: { "aria-hidden": "true" } }), "arrow-up-right");
    }
  }
  const q = card.createEl("p", { cls: "quote-card-text" });
  q.createSpan({ cls: "quote-card-mark", text: "“", attr: { "aria-hidden": "true" } });
  q.createSpan({ cls: "quote-card-quote", text: quote });
  if (translation) card.createEl("p", { cls: "quote-card-translation", text: translation, attr: { lang: uiLang() } });
}

// Link-Ziel aus "[[Notiz|Text]]" oder "Notiz"
const linkTarget = (v) => String(Array.isArray(v) ? v[0] : v || "").trim().replace(/^\[\[|\]\]$/g, "").split("|")[0].trim();

// Klick oder Enter auf den Zitattext öffnet die Notiz des Zitats
function makeOpenable(app, card, file) {
  const text = card.querySelector(".quote-card-text");
  if (!text) return;
  text.addClass("quote-rotator-open");
  text.setAttr("role", "link");
  text.setAttr("tabindex", "0");
  text.setAttr("title", baseText().openQuote);
  const open = () => app.workspace.openLinkText(file.path, "", false);
  text.addEventListener("click", open);
  text.addEventListener("keydown", (e) => { if (e.key === "Enter") open(); });
}

