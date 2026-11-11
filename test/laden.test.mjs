// Startet das gebaute Plugin mit einem nachgebauten Obsidian: lädt es ohne Fehler, und wann öffnet sich die Einrichtung?
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "dist", "main.js"), "utf8");

// Alles, was nicht eigens nachgebaut ist, nimmt jeden Aufruf an und tut nichts
const any = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k === "then" ? undefined : any),
  apply: () => any,
  construct: () => any,
});
const loose = (base) => Object.setPrototypeOf(base, new Proxy({}, { get: (t, k) => (typeof k === "string" ? () => any : undefined) }));

function load({ stored, notes, language = "de" }) {
  const opened = [];
  let saved = null;
  class Base { constructor(app) { this.app = app; } }
  loose(Base.prototype);
  Base.prototype.loadData = async () => (stored ? JSON.parse(JSON.stringify(stored)) : null);
  Base.prototype.saveData = async (d) => { saved = d; };
  class Modal extends Base { open() { opened.push(this.constructor.name); } }
  const obsidian = { Plugin: Base, MarkdownRenderChild: Base, PluginSettingTab: Base, Setting: Base, Modal, MarkdownView: Base, Notice: Base,
    Platform: { isMobile: false }, setIcon() {}, getLanguage: () => language };
  const body = loose({});
  globalThis.activeDocument = { body };
  globalThis.activeWindow = loose({});
  globalThis.window = loose({ localStorage: { getItem: () => null, setItem() {} } });
  globalThis.document = globalThis.activeDocument;
  const mod = { exports: {} };
  new Function("module", "require", src)(mod, () => obsidian);
  const app = loose({
    vault: loose({ getMarkdownFiles: () => Array.from({ length: notes }, (_, i) => ({ path: i + ".md" })) }),
    workspace: loose({ onLayoutReady: (cb) => cb() }),
  });
  const plugin = new mod.exports(app);
  return { plugin, opened, saved: () => saved };
}

test("Plugin lädt: bestehende Einstellungen, viele Notizen – keine Einrichtung, Ordner und Eigenschaften bleiben", async () => {
  const r = load({ stored: { quotesFolder: "40 Quotes", notes: {} }, notes: 2000, language: "de" });
  await r.plugin.onload();
  await new Promise((x) => setTimeout(x, 0));
  assert.deepEqual(r.opened, []);
  assert.equal(r.plugin.settings.lang, "en", "Oberfläche grundsätzlich Englisch");
  assert.equal(r.plugin.settings.noteLang, "de", "Eigenschaften bleiben deutsch");
  assert.equal(r.plugin.settings.mediaFolder, "50 Read · Watch · Listen");
  assert.equal(r.plugin.settings.setupDone, true);
  assert.equal(r.saved(), null, "beim Start wird nichts gespeichert");
});

test("Plugin lädt: bestehende Einstellungen, Vault wirkt beim Start leer – trotzdem keine Einrichtung", async () => {
  const r = load({ stored: { quotesFolder: "40 Quotes", notes: {} }, notes: 0 });
  await r.plugin.onload();
  await new Promise((x) => setTimeout(x, 0));
  assert.deepEqual(r.opened, []);
});

test("Plugin lädt: neu installiert im leeren Vault – Einrichtung öffnet sich auf Englisch", async () => {
  const r = load({ stored: null, notes: 1, language: "en" });
  await r.plugin.onload();
  await new Promise((x) => setTimeout(x, 0));
  assert.deepEqual(r.opened, ["SetupModal"]);
  assert.equal(r.plugin.settings.lang, "en");
});

test("Plugin lädt: neu installiert in einem Vault mit Notizen – einmal die Auswahl „In meinen Vault einbauen“", async () => {
  const r = load({ stored: null, notes: 50, language: "de" });
  await r.plugin.onload();
  await new Promise((x) => setTimeout(x, 0));
  assert.deepEqual(r.opened, ["AddModal"]);
  assert.equal(r.plugin.settings.lang, "en", "auch bei deutschem Obsidian");
  assert.equal(r.plugin.settings.noteLang, "en");
  assert.equal(r.plugin.settings.mediaFolder, "50 Media");
});
