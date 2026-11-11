// Tests für die reinen Hilfsfunktionen. Lädt dist/main.js mit einer kleinen Obsidian-Attrappe.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "dist", "main.js"), "utf8");
class Base { constructor() {} }
const obsidian = { Plugin: Base, MarkdownRenderChild: Base, PluginSettingTab: Base, Setting: Base, Modal: Base,
  MarkdownView: Base, Notice: Base, Platform: { isMobile: false }, setIcon() {} };
const names = ["markdownToPlain", "quoteOfDay", "fillTemplate", "parseSources", "contrast", "isoDate",
  "shareFileName", "plain", "safeLink", "safeColor", "safeFont", "linkTarget",
  "withMediaLayout", "mediaLayoutOf", "findEmbeds", "embedLink", "withMediaSize"];
const lib = new Function("module", "require", src + "\nreturn {" + names.join(",") + "};")({ exports: {} }, () => obsidian);

test("Markdown wird zu reinem Text, Überschriften bleiben erkennbar", () => {
  const out = lib.markdownToPlain("## Titel\nDas ist **fett** mit [[Notiz|Link]] und [web](https://x.y)\n- Punkt\n```js\ncode\n```\n%% privat %%\nEnde");
  assert.equal(out, "## Titel\nDas ist fett mit Link und web\n• Punkt\n\nEnde");
});

test("Zitat des Tages: stabil am selben Tag, gestreut über Tage", () => {
  const files = ["a", "b", "c", "d", "e"].map((n) => ({ path: n }));
  assert.equal(lib.quoteOfDay(files, "2026-11-09"), lib.quoteOfDay(files, "2026-11-09"));
  const seen = new Set();
  for (let d = 1; d <= 30; d++) seen.add(lib.quoteOfDay(files, "2026-01-" + String(d).padStart(2, "0")).path);
  assert.ok(seen.size >= 4, "mindestens vier verschiedene Zitate in 30 Tagen");
  assert.equal(lib.quoteOfDay([], "2026-11-09"), null);
});

test("Vorlage: Templater- und alte Platzhalter werden gefüllt", () => {
  const out = lib.fillTemplate('date: "<% tp.date.now("YYYY-MM-DD") %>"\ntitle: <% tp.file.title %>\nalt: {{date:YYYY-MM-DD}} {{title}}', "Ist es wahr");
  assert.match(out, /^date: "\d{4}-\d{2}-\d{2}"$/m);
  assert.ok(!/<%|\{\{/.test(out));
  assert.match(out, /title: Ist es wahr/);
});

test("Dateinamen: Datum_Text, ohne verbotene Zeichen, im Karussell nummeriert", () => {
  assert.match(lib.shareFileName("Ist es wahr?"), /^\d{4}-\d{2}-\d{2}_Ist es wahr\.png$/);
  assert.match(lib.shareFileName("## A/B: C*", 1, 3), /^\d{4}-\d{2}-\d{2}_A B C_2\.png$/);
  assert.ok(!lib.shareFileName("x".repeat(200)).includes("x".repeat(61)));
});

test("Sicherheit: nur http(s)-Links, nur gültige Farben, keine CSS-Einschleusung", () => {
  assert.equal(lib.safeLink("javascript:alert(1)"), null);
  assert.equal(lib.safeLink("data:text/html,x"), null);
  assert.equal(lib.safeLink("https://example.com/a").href, "https://example.com/a");
  assert.equal(lib.safeColor("red;background:url(x)", "#000000"), "#000000");
  assert.equal(lib.safeColor("#9ab4e0", "#000000"), "#9ab4e0");
  assert.ok(!/[;{}<>]/.test(lib.safeFont("Arial; } body { display:none")));
});

test("Quellen und Links werden richtig gelesen", () => {
  assert.deepEqual(lib.parseSources("Quotes = 40 Quotes/Quotes; 40 Quotes/Coach Quotes").map((s) => s.label), ["Quotes", "Coach Quotes"]);
  assert.equal(lib.linkTarget("[[Dune|Der Wüstenplanet]]"), "Dune");
  assert.equal(lib.plain(["[[Dune|Der Wüstenplanet]]"]), "Der Wüstenplanet");
});

test("Kontrast nach WCAG: Schwarz auf Weiß ist 21 : 1", () => {
  assert.equal(Math.round(lib.contrast("#000000", "#ffffff")), 21);
});

// So schreibt Obsidian 1.15 die Breite beim Ziehen an der Bildecke (nachgebaut aus app.js, Funktion „Fm“):
// Ist der letzte Teil eine Größe, wird nur er ersetzt, sonst wird „|Breite“ angehängt.
const obsidianResize = (alias, width) => {
  if (!alias || /^\s*[0-9]+\s*(?:x\s*[0-9]+\s*)?$/.test(alias)) return String(width);
  const i = alias.lastIndexOf("|");
  if (i !== -1 && /^\s*[0-9]+\s*(?:x\s*[0-9]+\s*)?$/.test(alias.slice(i + 1))) return alias.slice(0, i) + "|" + width;
  return alias + "|" + width;
};

test("Anordnen: Stichwort setzen, wechseln, entfernen; Größe und Beschreibung bleiben", () => {
  assert.equal(lib.withMediaLayout(null, "right"), "right");
  assert.equal(lib.withMediaLayout("300", "right"), "right|300");
  assert.equal(lib.withMediaLayout("right|300", "left"), "left|300");
  assert.equal(lib.withMediaLayout("left|300x200", ""), "300x200");
  assert.equal(lib.withMediaLayout("Skizze vom Garten|420", "center"), "center|Skizze vom Garten|420");
  assert.equal(lib.withMediaLayout("row", ""), "");
  assert.equal(lib.mediaLayoutOf("Right|300"), "right");
  assert.equal(lib.mediaLayoutOf("300"), "");
});

test("Anordnen: deutsche Stichwörter aus älteren Notizen gelten weiter und werden beim Ändern englisch", () => {
  assert.equal(lib.mediaLayoutOf("rechts|300"), "right");
  assert.equal(lib.mediaLayoutOf("Mitte"), "center");
  assert.equal(lib.withMediaLayout("rechts|300", "links"), "left|300");
  assert.equal(lib.withMediaLayout("reihe|Skizze|420", ""), "Skizze|420");
  assert.equal(lib.withMediaLayout("300", "mitte"), "center|300");
  assert.equal(lib.withMediaSize("links|300x200", 480), "links|480", "Größe ändern lässt das Stichwort, wie es ist");
});

test("Anordnen überlebt das Größe-Ziehen von Obsidian", () => {
  for (const layout of ["left", "right", "center", "row"]) {
    const alias = lib.withMediaLayout("300", layout);
    const resized = obsidianResize(alias, 480);
    assert.equal(lib.mediaLayoutOf(resized), layout);
    assert.ok(resized.endsWith("|480"));
  }
  assert.equal(obsidianResize(lib.withMediaLayout(null, "right"), 480), "right|480");
});

test("Embed-Links in einer Zeile finden und neu zusammensetzen", () => {
  const line = "Text ![[Garten.png|right|300]] und ![[Clip.mov]] Ende";
  const found = lib.findEmbeds(line);
  assert.equal(found.length, 2);
  assert.deepEqual([found[0].target, found[0].alias], ["Garten.png", "right|300"]);
  assert.equal(line.slice(found[1].from, found[1].to), "![[Clip.mov]]");
  assert.equal(found[1].alias, null);
  assert.equal(lib.embedLink("Clip.mov", lib.withMediaLayout(null, "center")), "![[Clip.mov|center]]");
});

test("Größe per Griff: schreibt dasselbe wie Obsidians Ziehen am Mac", () => {
  for (const alias of [null, "300", "right", "right|300", "left|300x200", "Skizze|420", "center|Skizze|420", "rechts|300"]) {
    const ours = lib.withMediaSize(alias, 480);
    const theirs = obsidianResize(alias === null ? "" : alias.replace(/\|\d+x\d+$/, "|300"), 480);
    assert.equal(lib.mediaLayoutOf(ours), lib.mediaLayoutOf(alias), "Anordnung bleibt: " + alias);
    assert.ok(ours.endsWith("480"), "neue Breite am Ende: " + ours);
    if (!/x\d+$/.test(alias || "")) assert.equal(ours, theirs, "wie Obsidian: " + alias);
  }
  assert.equal(lib.withMediaSize("left|300x200", 480), "left|480");
  assert.equal(lib.withMediaSize("right|300", 0), "right");
});
