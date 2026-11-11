// Tests für die Einrichtung: was angelegt wird, in beiden Sprachen, und dass nichts überschrieben wird.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "dist", "main.js"), "utf8");
class Base { constructor() {} }
const obsidian = { Plugin: Base, MarkdownRenderChild: Base, PluginSettingTab: Base, Setting: Base, Modal: Base,
  MarkdownView: Base, Notice: Base, Platform: { isMobile: false }, setIcon() {} };
const lib = new Function("module", "require", src + "\nreturn { setupPlan, runSetup, START_QUOTES, SETUP_TOPICS, fmGet, fmKey, firstRunSettings, autoSetupMode, applyTemplaterSetup, addPlan, runAdd, scanVault, suggestFolders, tileCandidates, defaultTiles, noControl, blockOptions, keyword, isYes, themeKey, HomeDashboard, QuoteRotator, setPlugin: (p) => { PLUGIN = p; } };")({ exports: {} }, () => obsidian);

const BASIC = lib.SETUP_TOPICS.filter((t) => t.basic).map((t) => t.id);
const ALL = lib.SETUP_TOPICS.map((t) => t.id);
const frontmatter = (text) => (text.match(/^---\n([\s\S]*?)\n---\n/) || [])[1];

test("Startzitate: 100, alle mit deutscher und englischer Fassung, keine doppelten Namen", () => {
  assert.equal(lib.START_QUOTES.length, 100);
  for (const q of lib.START_QUOTES) assert.ok(q.de && q.en && q.topic[0].length === q.topic[1].length);
  for (const lang of ["de", "en"]) {
    const names = lib.setupPlan({ lang, topics: ["quotes"], today: "2026-11-11" }).files.filter((f) => f.kind === "quote").map((f) => f.basename.toLowerCase());
    assert.equal(new Set(names).size, 100, "eindeutige Notiznamen " + lang);
    for (const n of names) assert.ok(!/[\\/:*?"<>|#^[\]]/.test(n) && n.length <= 120 && !/[.\s]$/.test(n), "gültiger Name: " + n);
  }
});

test("Grundsystem: Ordner, Vorlagen, Listen und Startseite", () => {
  const p = lib.setupPlan({ lang: "de", topics: BASIC, theme: "salbei", name: "Anna", today: "2026-11-11" });
  for (const f of ["00 Inbox", "10 Reflect/Journal", "10 Reflect/Career", "20 Connect/Family", "20 Connect/Lovely Stories", "20 Connect/Recipes",
    "30 Projects", "40 Quotes", "50 Media/Books", "50 Media/Movies & Series", "50 Media/Podcasts & Audiobooks", "50 Media/Articles", "99 System/Templates", "99 System/Attachments"])
    assert.ok(p.folders.includes(f), "Ordner " + f);
  assert.ok(!p.folders.includes("60 Write") && !p.folders.includes("80 Admin"));
  assert.deepEqual(p.templates.sort(), ["Article", "Book", "Journal", "Movie", "Note", "Person", "Podcast", "Project", "Quote", "Recipe", "Story"]);
  assert.deepEqual(p.files.filter((f) => f.kind === "list").map((f) => f.path).sort(),
    ["30 Projects/Project List.base", "40 Quotes/Quote List.base", "50 Media/Listening List.base", "50 Media/Reading List.base", "50 Media/Watching List.base"]);
  const home = p.files.find((f) => f.path === "Home.md").content;
  assert.match(home, /name: Anna/);
  assert.match(home, /dailyquote: yes/);
  assert.match(home, /tile: Media \| 50 Media \| @media/);
  assert.doesNotMatch(home, /^(kachel|zitate|tageszitat|erfassen|medien|vorlage):/m, "nur englische Schlüssel");
  assert.match(p.files.find((f) => f.path.endsWith("Journal Template.md")).content, /```quote-card\ntoday: 40 Quotes/);
  assert.equal(p.files.filter((f) => f.kind === "quote").length, 100);
  assert.ok(p.folderTemplates.some((x) => x.folder === "50 Media/Books" && x.template.endsWith("Book Template.md")));
});

test("Vorname: keine Steuerzeichen, Backticks oder Trennstriche im Startseiten-Block", () => {
  const p = lib.setupPlan({ lang: "de", topics: ["journal"], name: "Anna\n```\nkachel: X | Y\r|`" });
  assert.equal(p.name, "Anna kachel: X Y");
  const home = p.files.find((f) => f.path === "Home.md").content;
  assert.equal((home.match(/```/g) || []).length % 2, 0, "Codeblöcke bleiben geschlossen");
  assert.doesNotMatch(home, /^kachel: X/m);
});

test("Erster Start: bestehende Nutzer behalten Ordner und deutsche Eigenschaften, bekommen nie eine Einrichtung", () => {
  // Ältere Installation: Einstellungen gespeichert, aus der Zeit vor der Einrichtung, viele Notizen, ohne Sprache und Medienordner
  const old = lib.firstRunSettings({ quotesFolder: "40 Quotes", shareFolder: "99 System/_assets/Quotes", notes: {} });
  assert.deepEqual(old, { noteLang: "de", mediaFolder: "50 Read · Watch · Listen", quoteTemplate: "99 System/_Template/Quote Template.md", setupDone: true });
  assert.equal(old.lang, undefined, "Oberfläche folgt dem neuen Standard Englisch");
  assert.equal(lib.autoSetupMode({ ...old }, 0), null, "auch wenn der Vault beim Start kurz leer wirkt");
  // Wer die Oberfläche schon englisch hatte, hat englische Eigenschaften
  assert.equal(lib.firstRunSettings({ lang: "en", setupDone: true }).noteLang, "en");
  // Gespeicherte Werte bleiben unangetastet
  assert.deepEqual(lib.firstRunSettings({ setupDone: true, lang: "de", noteLang: "de", mediaFolder: "M", quoteTemplate: "T", shareFolder: "S" }), {});
  // Neu installiert: Englisch aus den Standards
  assert.deepEqual(lib.firstRunSettings(null), {});
  assert.equal(lib.autoSetupMode({ setupDone: false }, 2), "setup", "leerer Vault: Einsteiger-Einrichtung");
  assert.equal(lib.autoSetupMode({ setupDone: false }, 40), "welcome", "Vault mit Notizen: einmal die Auswahl");
});

test("Templater: ergänzt nur, ändert keine Regeln und keinen Modus mit Dateiregeln", async () => {
  const run = async (st) => {
    const tp = { settings: st, save_settings: async () => {} };
    const plugin = { settings: { setupTemplater: [{ folder: "10 Reflect/Journal", template: "99 System/Templates/Journal Template.md" }, { folder: "00 Inbox", template: "99 System/Templates/Note Template.md" }] }, saveSettings: async () => {} };
    const done = await lib.applyTemplaterSetup({ plugins: { plugins: { "templater-obsidian": tp } } }, plugin);
    return { st, done, left: plugin.settings.setupTemplater };
  };
  // Eigene Einrichtung mit Dateiregeln: Modus und Ordner bleiben, eigene Zuordnung bleibt
  const own = await run({ templates_folder: "Vorlagen", trigger_on_file_creation_mode: "file", file_templates: [{ regex: ".*", template: "Vorlagen/X.md" }],
    folder_templates: [{ folder: "00 Inbox", template: "Vorlagen/Inbox.md" }] });
  assert.equal(own.st.trigger_on_file_creation_mode, "file");
  assert.equal(own.st.templates_folder, "Vorlagen");
  assert.equal(own.st.folder_templates.find((x) => x.folder === "00 Inbox").template, "Vorlagen/Inbox.md");
  assert.equal(own.st.folder_templates.length, 2);
  assert.ok(own.done && own.left === null);
  // Frisch installiertes Templater: Ordnermodus und Vorlagenordner werden gesetzt
  const fresh = await run({});
  assert.equal(fresh.st.trigger_on_file_creation_mode, "folder");
  assert.equal(fresh.st.templates_folder, "99 System/Templates");
});

test("Eingaben: Steuerzeichen werden entfernt oder ersetzt", () => {
  assert.equal(lib.noControl("a\nb\tc\u007f"), "abc");
  assert.equal(lib.noControl("a\nb", " "), "a b");
  assert.equal(lib.noControl(null), "");
});

test("Wenig gewählt: nur Journal und Zitate", () => {
  const p = lib.setupPlan({ lang: "de", topics: ["journal", "quotes"] });
  assert.deepEqual(p.roots, ["00 Inbox", "10 Reflect", "40 Quotes", "99 System"]);
  assert.deepEqual(p.templates.sort(), ["Journal", "Note", "Quote"]);
});

test("Englisch: englische Eigenschaften und Abschnitte, Compass liest sie", () => {
  const p = lib.setupPlan({ lang: "en", topics: ALL, today: "2026-11-11" });
  const journal = p.files.find((f) => f.path.endsWith("Journal Template.md")).content;
  assert.match(journal, /^template: Journal$/m);
  assert.match(journal, /^summary:$/m);
  assert.match(journal, /## Grateful for/);
  assert.doesNotMatch(journal, /kernaussage|vorlage/);
  const quote = p.files.find((f) => f.kind === "quote" && f.content.includes("Epictetus")).content;
  assert.match(quote, /^kind: Statement$/m);
  assert.match(quote, /^location: /m);
  // Compass liest englische Namen über die deutschen Schlüssel
  assert.equal(lib.fmGet({ summary: "x" }, "kernaussage"), "x");
  assert.equal(lib.fmGet({ share: true }, "teilen"), true);
  assert.equal(lib.fmKey({ rating: 3 }, "bewertung"), "rating");
});

test("Alle erzeugten Eigenschaften und Listen sind gültiges YAML", (t) => {
  try { execFileSync("ruby", ["-e", "1"]); } catch (e) { t.skip("Ruby fehlt"); return; }
  const dir = mkdtempSync(join(tmpdir(), "compass-yaml-"));
  let n = 0;
  for (const lang of ["de", "en"]) {
    for (const f of lib.setupPlan({ lang, topics: ALL, name: "Anna", today: "2026-11-11" }).files) {
      const yaml = f.path.endsWith(".base") ? f.content : frontmatter(f.content);
      if (!yaml) continue;
      writeFileSync(join(dir, `${n++}.yml`), yaml.replace(/<% tp\.date\.now\("YYYY-MM-DD"\) %>/g, "2026-11-11"));
    }
  }
  const out = execFileSync("ruby", ["-rdate", "-ryaml", "-e", 'bad = Dir[ARGV[0] + "/*.yml"].reject { |f| begin; YAML.safe_load(File.read(f), permitted_classes: [Date]); true; rescue => e; warn(f + ": " + e.message); false; end }; puts bad.size', dir]).toString().trim();
  assert.equal(out, "0", "ungültige YAML-Dateien");
  assert.ok(n > 200);
});

test("Ausführen: legt Fehlendes an, überschreibt nie, Zitate mit vorhandenem Namen werden übersprungen", async () => {
  const files = new Map([["Home.md", "eigene Startseite"], ["40 Quotes/Coach Quotes/Erkenne dich selbst.md", "x"]]);
  const folders = new Set(["40 Quotes", "40 Quotes/Coach Quotes"]);
  const F = (p) => ({ path: p, basename: p.split("/").pop().replace(/\.md$/, ""), extension: p.split(".").pop() });
  const app = {
    vault: {
      getAbstractFileByPath: (p) => (files.has(p) ? F(p) : folders.has(p) ? { path: p, children: [] } : null),
      createFolder: async (p) => { folders.add(p); },
      create: async (p, c) => { if (files.has(p)) throw new Error("überschrieben: " + p); files.set(p, c); return F(p); },
      getMarkdownFiles: () => [...files.keys()].filter((p) => p.endsWith(".md")).map(F),
      getConfig: () => "/", setConfig: () => {},
    },
    internalPlugins: { getPluginById: () => ({ enabled: true }) },
    plugins: { plugins: {} },
  };
  const plugin = { settings: { notes: { templateThemes: { Journal: "rose" } } }, saveSettings: async () => {} };
  const plan = lib.setupPlan({ lang: "de", topics: BASIC, today: "2026-11-11" });
  const r = await lib.runSetup(app, plugin, plan);
  assert.equal(files.get("Home.md"), "eigene Startseite");
  assert.ok(r.skipped.includes("Home.md"));
  assert.ok(r.skipped.some((p) => p.endsWith("Erkenne dich selbst.md")), "Zitat mit gleichem Namen übersprungen");
  assert.equal(plugin.settings.notes.templateThemes.Journal, "rose", "eigene Zuordnung bleibt");
  assert.equal(plugin.settings.mediaFolder, "50 Media");
  assert.ok(plugin.settings.setupDone);
  // Zweiter Durchlauf legt nichts mehr an
  const again = await lib.runSetup(app, plugin, plan);
  assert.equal(again.created.length, 0);
});

test("Englische Oberfläche, deutsche Notizen: neue Eigenschaften folgen der Notizsprache, nicht der Oberfläche", () => {
  lib.setPlugin({ settings: { lang: "en", noteLang: "de" } });
  assert.equal(lib.fmKey({}, "geteilt"), "geteilt", "Listen filtern weiter auf „geteilt“");
  assert.equal(lib.fmKey({ shared: "2026-11-11" }, "geteilt"), "shared", "vorhandener Name bleibt");
  lib.setPlugin({ settings: { lang: "de", noteLang: "en" } });
  assert.equal(lib.fmKey({}, "geteilt"), "shared");
  lib.setPlugin(null);
});

test("Schlüsselwörter: englisch, die deutschen aus älteren Notizen bedeuten dasselbe", () => {
  const en = lib.blockOptions("folder: 40 Quotes\nseconds: 20\nstart: today\ntile: A | B\ntile: C | D | @quotes\ndailyquote: yes\ncolor: blue");
  const de = lib.blockOptions("ordner: 40 Quotes\nsekunden: 20\nstart: heute\nkachel: A | B\nkachel: C | D | @quotes\ntageszitat: ja\nfarbe: blau");
  assert.deepEqual(Object.keys(de.opt).sort(), Object.keys(en.opt).sort());
  assert.equal(de.opt.folder, "40 Quotes");
  assert.equal(de.list.tile.length, 2);
  assert.ok(lib.isYes(en.opt.dailyquote) && lib.isYes(de.opt.dailyquote));
  assert.equal(lib.themeKey(en.opt.color), "blau");
  assert.equal(lib.themeKey(de.opt.color), "blau");
  assert.equal(lib.keyword("Daily-Quote"), "dailyquote");
  assert.equal(lib.isYes("nein"), false);
});

test("Startseite und Rotator lesen alte deutsche Blöcke wie neue englische", () => {
  lib.setPlugin(null);
  const old = new lib.HomeDashboard({}, {}, "name: Anna\nzitate: Quotes = 40 Quotes/Quotes; Fragen = 40 Quotes/Fragen\ntageszitat: ja\nkachel: Life | 10 Life | [[Recipes]], [[Garden|Garten]]\nkachel: Medien | 50 Read | @medien\nkachel: Zitate | 40 Quotes | @zitate", "Home.md");
  const neu = new lib.HomeDashboard({}, {}, "name: Anna\nquotes: Quotes = 40 Quotes/Quotes; Fragen = 40 Quotes/Fragen\ndailyquote: yes\ntile: Life | 10 Life | [[Recipes]], [[Garden|Garten]]\ntile: Medien | 50 Read | @media\ntile: Zitate | 40 Quotes | @quotes", "Home.md");
  for (const d of [old, neu]) {
    assert.equal(d.opt.name, "Anna");
    assert.equal(d.opt.quotes, "Quotes = 40 Quotes/Quotes; Fragen = 40 Quotes/Fragen");
    assert.ok(lib.isYes(d.opt.dailyquote));
    assert.deepEqual(d.tiles.map((t) => t.links), ["[[Recipes]], [[Garden|Garten]]", "@media", "@quotes"]);
  }
  const rot = (src) => { const r = new lib.QuoteRotator({}, {}, src); return [r.sources.map((s) => s.folder).join(";"), r.seconds, r.startToday]; };
  assert.deepEqual(rot("ordner: 40 Quotes/Quotes\nsekunden: 20\nstart: heute"), rot("folder: 40 Quotes/Quotes\nseconds: 20\nstart: today"));
  assert.deepEqual(rot("folder: 40 Quotes/Quotes\nseconds: 20\nstart: today"), ["40 Quotes/Quotes", 20, true]);
});
