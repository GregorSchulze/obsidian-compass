// Tests für die Texte der Oberfläche: jede Text-ID gibt es auf Deutsch und Englisch, die Sprache kommt aus settings.lang.
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
// Alle Textobjekte im Build: „const …_TEXT = {“ und die How-To-Einträge
const names = [...src.matchAll(/^const ([A-Z_]+_TEXT|HOWTO) = \{/gm)].map((m) => m[1]);
const helpers = ["uiLang", "baseText", "shareText", "quoteText", "dashText", "noteText", "settingsText", "mediaText", "pluginText", "themeLabel", "shareFileName", "THEMES"];
const lib = new Function("module", "require", src + "\nreturn { " + names.concat(helpers).join(", ") +
  ", setPlugin: (p) => { PLUGIN = p; } };")({ exports: {} }, () => obsidian);

// Beispielwerte für Textfunktionen, z. B. page(i, n) oder contrast(r)
const call = (fn) => fn(...[2, 3, 4].slice(0, fn.length));

test("Alle Textobjekte werden gefunden", () => {
  for (const n of ["BASE_TEXT", "SHARE_TEXT", "QUOTE_TEXT", "DASH_TEXT", "NOTE_TEXT", "HOWTO", "SETTINGS_TEXT", "SETUP_TEXT", "MEDIA_TEXT", "PLUGIN_TEXT"])
    assert.ok(names.includes(n), n + " fehlt");
});

test("Jede Text-ID gibt es auf Deutsch und Englisch, mit gleicher Form", () => {
  const same = (de, en, path) => {
    if (typeof de === "function") {
      assert.equal(typeof en, "function", path + " ist auf Englisch keine Funktion");
      assert.equal(en.length, de.length, path + ": gleiche Zahl an Werten");
      assert.equal(typeof call(en), typeof call(de), path + ": gleicher Ergebnistyp");
      return;
    }
    if (Array.isArray(de)) {
      assert.ok(Array.isArray(en), path + " ist auf Englisch keine Liste");
      assert.equal(en.length, de.length, path + ": gleich viele Einträge");
      de.forEach((x, i) => same(x, en[i], path + "[" + i + "]"));
      return;
    }
    if (de && typeof de === "object") {
      assert.ok(en && typeof en === "object", path + " fehlt auf Englisch");
      assert.deepEqual(Object.keys(en).sort(), Object.keys(de).sort(), path + ": gleiche Text-IDs");
      for (const k of Object.keys(de)) same(de[k], en[k], path + "." + k);
      return;
    }
    assert.equal(typeof en, typeof de, path);
    if (typeof de === "string") assert.ok(!de.trim() || en.trim(), path + " ist auf Englisch leer");
  };
  for (const n of names) {
    assert.deepEqual(Object.keys(lib[n]).sort(), ["de", "en"], n + " braucht genau de und en");
    same(lib[n].de, lib[n].en, n);
  }
});

test("Englische Texte enthalten keine deutschen Umlaute", () => {
  const bad = [];
  const walk = (v, path) => {
    if (typeof v === "function") v = call(v);
    if (typeof v === "string") { if (/[äöüÄÖÜß]/.test(v)) bad.push(path + ": " + v); return; }
    if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, path + "." + k);
  };
  for (const n of names) walk(lib[n].en, n + ".en");
  assert.deepEqual(bad, []);
});

test("Sprache kommt aus settings.lang, Englisch ist Standard, Unbekanntes wird Englisch", () => {
  lib.setPlugin(null);
  assert.equal(lib.uiLang(), "en");
  lib.setPlugin({ settings: {} });
  assert.equal(lib.uiLang(), "en");
  lib.setPlugin({ settings: { lang: "fr" } });
  assert.equal(lib.uiLang(), "en");
  lib.setPlugin({ settings: { lang: "<script>" } });
  assert.equal(lib.shareText().share, "Share");
  lib.setPlugin({ settings: { lang: "en" } });
  assert.equal(lib.uiLang(), "en");
  const pairs = [["baseText", "BASE_TEXT"], ["shareText", "SHARE_TEXT"], ["quoteText", "QUOTE_TEXT"], ["dashText", "DASH_TEXT"], ["noteText", "NOTE_TEXT"],
    ["settingsText", "SETTINGS_TEXT"], ["mediaText", "MEDIA_TEXT"], ["pluginText", "PLUGIN_TEXT"]];
  for (const [get, obj] of pairs) assert.equal(lib[get](), lib[obj].en, get + " liefert Englisch");
  assert.equal(lib.shareText().share, "Share");
  assert.equal(lib.quoteText().today, "Quote of the day");
  assert.equal(lib.themeLabel("blau"), "Blue");
  assert.match(lib.shareFileName("???"), /_Quote\.png$/);
  lib.setPlugin({ settings: { lang: "de" } });
  for (const [get, obj] of pairs) assert.equal(lib[get](), lib[obj].de, get + " liefert Deutsch");
  assert.equal(lib.quoteText().today, "Zitat des Tages");
  assert.equal(lib.themeLabel("blau"), "Blau");
  assert.match(lib.shareFileName("???"), /_Zitat\.png$/);
  lib.setPlugin(null);
});

test("Deutsch bleibt wie bisher: Themen, Schriftdicken und Modi", () => {
  assert.equal(lib.NOTE_TEXT.de.themes, lib.THEMES);
  assert.equal(lib.BASE_TEXT.de.weights["700"], "Fett");
  assert.equal(lib.BASE_TEXT.de.modes.auto, "Automatisch (wie Obsidian bzw. System)");
  assert.equal(lib.SETTINGS_TEXT.de.contrast(lib.SETTINGS_TEXT.de.num(4.56)), "Kontrast 4,6 : 1 – ");
  assert.equal(lib.SETTINGS_TEXT.en.contrast(lib.SETTINGS_TEXT.en.num(4.56)), "Contrast 4.6 : 1 – ");
});

test("How To: gleiche Einträge in beiden Sprachen, mit Titel, Text, Code und Tipps", () => {
  assert.ok(lib.HOWTO.de.length >= 10);
  lib.HOWTO.en.forEach((item, i) => {
    for (const k of ["title", "text", "code"]) assert.ok(typeof item[k] === "string" && item[k].trim(), "HOWTO.en[" + i + "]." + k);
    assert.equal(item.tips.length, lib.HOWTO.de[i].tips.length, "Tipps in " + item.title);
  });
});

test("Sicherheit: kein HTML aus Text, kein eval", () => {
  assert.doesNotMatch(src, /\.innerHTML|\.outerHTML|insertAdjacentHTML|document\.write|\beval\(/);
});
