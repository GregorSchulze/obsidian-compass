// Tests für „In meinen Vault einbauen“: Vorschläge, Plan und Ausführung in einem vorhandenen Vault.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(join(root, "dist", "main.js"), "utf8");
class Base { constructor() {} }
const obsidian = { Plugin: Base, MarkdownRenderChild: Base, PluginSettingTab: Base, Setting: Base, Modal: Base,
  MarkdownView: Base, Notice: Base, Platform: { isMobile: false }, setIcon() {} };
const lib = new Function("module", "require", src + "\nreturn { addPlan, runAdd, scanVault, suggestFolders, tileCandidates, defaultTiles, mediaSubsOf, ADD_TEXT, START_QUOTES };")({ exports: {} }, () => obsidian);

// Nachgebauter Vault aus einer Liste von Notizpfaden; Ordner ergeben sich daraus
function vault(paths, extra = {}) {
  const files = new Map(paths.map((p) => [p, "x"]));
  const folders = new Set();
  for (const p of paths) { const parts = p.split("/"); parts.pop(); for (let i = 1; i <= parts.length; i++) folders.add(parts.slice(0, i).join("/")); }
  for (const f of extra.folders || []) folders.add(f);
  const F = (p) => ({ path: p, basename: p.split("/").pop().replace(/\.(md|base)$/, ""), extension: p.split(".").pop() });
  const app = {
    vault: {
      getMarkdownFiles: () => [...files.keys()].filter((p) => p.endsWith(".md")).map(F),
      getAllFolders: () => [...folders].map((p) => ({ path: p, children: [] })),
      getAbstractFileByPath: (p) => (files.has(p) ? F(p) : folders.has(p) ? { path: p, children: [] } : null),
      createFolder: async (p) => { if (folders.has(p)) throw new Error("Ordner gibt es schon: " + p); folders.add(p); },
      create: async (p, c) => { if (files.has(p)) throw new Error("überschrieben: " + p); files.set(p, c); return F(p); },
    },
    internalPlugins: { getPluginById: (id) => (extra.core || {})[id] || null },
    plugins: { plugins: extra.plugins || {} },
  };
  return { app, files, folders };
}

const SMALL = ["Journal/2026-11-01.md", "Journal/2026-11-02.md", "Projekte/Garten.md", "Bücher/Stoner.md", "Bücher/Momo.md", "Rezepte/Brot.md", "Inbox/Idee.md", "Templates/Tag.md"];
const BIG = [
  ...Array.from({ length: 40 }, (_, i) => `04 Archive/a${i}.md`), ...Array.from({ length: 30 }, (_, i) => `Daily/d${i}.md`),
  ...Array.from({ length: 20 }, (_, i) => `03 Resources/r${i}.md`), ...Array.from({ length: 12 }, (_, i) => `02 Areas/x${i}.md`),
  ...Array.from({ length: 9 }, (_, i) => `Quotes/Zitat ${i}.md`), "Quotes/Erkenne dich selbst.md",
  "Library/Books/b1.md", "Library/Books/b2.md", "Library/Movies/m1.md", "Library/Podcasts/p1.md", "Library/Articles/x.md",
  ...Array.from({ length: 6 }, (_, i) => `01 Projects/p${i}.md`), "Meetings/m.md", "00 Inbox/i.md", "Templates/Daily Template.md", "Templates/Book Template.md", "Home.md",
];
const templater = (rules, mode) => ({ "templater-obsidian": { settings: { templates_folder: "Templates", trigger_on_file_creation_mode: mode, folder_templates: rules }, save_settings: async () => {} } });

test("Kleiner Vault: Vorschläge, neuer Zitate-Ordner, Bücher ohne Unterordner", () => {
  const { app } = vault(SMALL, { core: { templates: { enabled: true, instance: { options: { folder: "Templates" } } } } });
  const info = lib.scanVault(app);
  assert.equal(info.noteCount, SMALL.length);
  assert.equal(info.templates, "Templates");
  assert.equal(info.templatesFrom, "core");
  assert.equal(info.templater, null);
  const sug = lib.suggestFolders(info);
  assert.deepEqual(sug, { quotes: "", media: "Bücher", inbox: "Inbox" });
  const plan = lib.addPlan(info, { lang: "de", modules: ["quotes", "home", "headers", "media"], quoteFolder: "+Zitate", starter: true, mediaFolder: "Bücher", bases: true,
    name: "Anna", tiles: ["Journal", "Zitate", "Bücher"], homeMode: "new" }, "2026-11-11");
  assert.deepEqual(plan.folders, ["Zitate"]);
  assert.equal(plan.files.filter((f) => f.kind === "quote").length, 100);
  assert.deepEqual(plan.files.filter((f) => f.kind === "list").map((f) => f.path).sort(), ["Bücher/Reading List.base", "Zitate/Quote List.base"]);
  assert.deepEqual(plan.templates.sort(), ["Book", "Note", "Quote"], "nur Buch-Vorlage, weil der Ordner keine Unterordner hat");
  const book = plan.files.find((f) => f.path === "Templates/Book Template.md").content;
  assert.match(book, /\{\{date:YYYY-MM-DD\}\}|bewertung:/, "Obsidians Vorlagen statt Templater");
  assert.doesNotMatch(plan.files.find((f) => f.path === "Templates/Note Template.md").content, /tp\.date/, "ohne Templater keine Templater-Platzhalter");
  assert.deepEqual(plan.rules, [], "ohne Templater keine Regeln");
  assert.ok(plan.enableBases);
  assert.equal(plan.homePath, "Home.md");
  assert.match(plan.homeBlock, /^tile: Zitate \| Zitate \| @quotes$/m);
  assert.match(plan.homeBlock, /^tile: Bücher \| Bücher \| @media$/m);
  assert.match(plan.homeBlock, /^inbox: Inbox$/m);
  assert.match(plan.files.find((f) => f.path === "Bücher/Reading List.base").content, /file\.inFolder\(\\?"Bücher\\?"\)/);
});

test("Großer Vault: vorhandene Ordner, Templater-Regeln bleiben, Startseite gibt es schon", () => {
  const rules = [{ folder: "Daily", template: "Templates/Daily Template.md" }, { folder: "Library/Books", template: "Templates/Book Template.md" }];
  const { app } = vault(BIG, { plugins: { ...templater(rules, "folder"), homepage: { settings: { homepages: { "Main Homepage": { value: "Home" } } } } }, core: { bases: { enabled: true } } });
  const info = lib.scanVault(app);
  const sug = lib.suggestFolders(info);
  assert.equal(sug.quotes, "Quotes");
  assert.equal(sug.media, "Library");
  assert.deepEqual(info.home, { name: "Home", via: "Homepage" });
  assert.deepEqual(lib.mediaSubsOf(info, "Library").map((s) => s.kind).sort(), ["Article", "Book", "Movie", "Podcast"]);
  const cands = lib.tileCandidates(info, ["Quotes", "Library"]);
  const tiles = lib.defaultTiles(cands, ["Quotes", "Library"]);
  assert.deepEqual(tiles.slice(0, 2), ["Quotes", "Library"], "Ordner der Bausteine zuerst");
  assert.ok(!tiles.includes("04 Archive") && !tiles.includes("Daily"), "kein Archiv, keine Tagesnotizen");
  assert.ok(!cands.some((c) => c.path === "Templates"), "Vorlagen sind keine Kachel");
  const plan = lib.addPlan(info, { lang: "en", modules: ["quotes", "home", "media"], quoteFolder: "Quotes", starter: false, mediaFolder: "Library", rules: true, bases: false,
    name: "", tiles, homeMode: "new" });
  assert.deepEqual(plan.folders, []);
  assert.equal(plan.files.filter((f) => f.kind === "quote").length, 0);
  assert.equal(plan.homePath, "Compass Home.md", "vorhandene Startseite bleibt");
  assert.ok(plan.keep.includes("Templates/Book Template.md"), "eigene Buch-Vorlage bleibt");
  assert.ok(!plan.files.some((f) => f.path === "Templates/Book Template.md"));
  assert.deepEqual(plan.rules.map((r) => r.folder).sort(), ["Library/Articles", "Library/Movies", "Library/Podcasts", "Quotes"], "nur Ordner ohne eigene Regel");
  assert.equal(plan.enableBases, false, "Bases ist schon an");
  assert.deepEqual(plan.files.filter((f) => f.kind === "list").map((f) => f.path).sort(),
    ["Library/Listening List.base", "Library/Reading List.base", "Library/Watching List.base", "Quotes/Quote List.base"]);
  assert.match(plan.files.find((f) => f.path === "Templates/Quote Template.md").content, /tp\.date\.now/, "mit Templater dessen Platzhalter");
});

test("Block kopieren statt Notiz anlegen; ohne Startseite kein Home", () => {
  const { app } = vault(BIG, { plugins: templater([], "folder") });
  const info = lib.scanVault(app);
  const copy = lib.addPlan(info, { lang: "en", modules: ["home"], tiles: ["01 Projects"], homeMode: "copy", name: "Anna" });
  assert.equal(copy.homePath, "");
  assert.ok(!copy.files.some((f) => f.kind === "home"));
  assert.match(copy.homeBlock, /^```home-dashboard\nname: Anna\n/);
  assert.match(copy.homeBlock, /^tile: Projects \| 01 Projects$/m);
  const none = lib.addPlan(info, { lang: "en", modules: ["quotes"], quoteFolder: "Quotes", starter: false });
  assert.equal(none.homeBlock, "");
});

test("Listen mit ungewöhnlichen Ordnernamen: Filter enthalten den vollen Namen", (t) => {
  try { execFileSync("ruby", ["-e", "1"]); } catch (e) { t.skip("Ruby fehlt"); return; }
  const Q = "Zitate #1 \"beste\" 'alt'", M = "Medien: alt #2";
  const { app } = vault([Q + "/a.md", M + "/Books/b.md", M + "/Movies/m.md"], { core: { bases: { enabled: true } } });
  const plan = lib.addPlan(lib.scanVault(app), { lang: "de", modules: ["quotes", "media"], quoteFolder: Q, mediaFolder: M, starter: false });
  const dir = mkdtempSync(join(tmpdir(), "compass-bestand-"));
  const lists = plan.files.filter((f) => f.kind === "list");
  lists.forEach((f, i) => writeFileSync(join(dir, i + ".yml"), f.content));
  // YAML lesen und die Filter als JSON zurückgeben
  const out = JSON.parse(execFileSync("ruby", ["-ryaml", "-rjson", "-e", 'puts JSON.generate(Dir[ARGV[0] + "/*.yml"].sort.map { |f| y = YAML.safe_load(File.read(f)); [y["filters"], y["formulas"]] })', dir]).toString());
  const filters = out.map(([f]) => JSON.stringify(f));
  assert.ok(filters.some((f) => f.includes(JSON.stringify("file.inFolder(" + JSON.stringify(Q) + ")").slice(1, -1))), "Zitate-Filter vollständig: " + filters.join(" | "));
  assert.ok(filters.some((f) => f.includes(JSON.stringify("file.inFolder(" + JSON.stringify(M + "/Books") + ")").slice(1, -1))), "Medien-Filter vollständig");
  for (const [, formulas] of out) if (formulas && formulas.quotes) assert.equal(formulas.quotes, "file.backlinks.filter(value.asFile().inFolder(" + JSON.stringify(Q) + "))");
});

test("Ausführen: legt nur Fehlendes an, überschreibt nie, Templater-Modus mit Dateiregeln bleibt", async () => {
  const tp = { settings: { templates_folder: "Templates", trigger_on_file_creation_mode: "file", file_templates: [{ regex: ".*", template: "Templates/X.md" }], folder_templates: [{ folder: "Daily", template: "Templates/Daily Template.md" }] }, save_settings: async () => {} };
  const v = vault(BIG, { plugins: { "templater-obsidian": tp }, core: { bases: { enabled: false, enable: async function () { this.enabled = true; } } } });
  const before = new Map(v.files);
  const info = lib.scanVault(v.app);
  const plan = lib.addPlan(info, { lang: "de", modules: ["quotes", "home", "headers", "media"], quoteFolder: "Quotes", starter: true, mediaFolder: "Library", rules: true, bases: true,
    tiles: ["Quotes"], homeMode: "new" }, "2026-11-11");
  const plugin = { settings: { lang: "en", noteLang: "de", notes: { templateThemes: { Book: "rose" } } }, saveSettings: async () => {} };
  const r = await lib.runAdd(v.app, plugin, plan);
  for (const [p, c] of before) assert.equal(v.files.get(p), c, "unverändert: " + p);
  assert.ok(r.skipped.some((p) => p.endsWith("Erkenne dich selbst.md")), "Startzitat mit vorhandenem Namen übersprungen");
  assert.ok(v.files.has("Compass Home.md"));
  assert.equal(tp.settings.trigger_on_file_creation_mode, "file", "Modus mit Dateiregeln bleibt");
  assert.equal(tp.settings.folder_templates.find((x) => x.folder === "Daily").template, "Templates/Daily Template.md");
  assert.ok(tp.settings.folder_templates.some((x) => x.folder === "Quotes"));
  assert.ok(tp.settings.ignore_folders_on_creation.some((x) => x.folder === "Templates"), "im Vorlagenordner löst Templater nichts aus");
  assert.equal(plugin.settings.quotesFolder, "Quotes");
  assert.equal(plugin.settings.mediaFolder, "Library");
  assert.equal(plugin.settings.notes.templateThemes.Book, "rose", "eigene Farbzuordnung bleibt");
  assert.equal(plugin.settings.notes.templateThemes.Movie, "lavendel", "neue Vorlage bekommt ihre Farbe");
  assert.equal(plugin.settings.setupDone, true);
  // Zweiter Durchlauf legt nichts mehr an
  const again = await lib.runAdd(v.app, plugin, lib.addPlan(lib.scanVault(v.app), { lang: "de", modules: ["quotes", "home", "headers", "media"], quoteFolder: "Quotes", starter: true, mediaFolder: "Library", rules: true, bases: true, tiles: ["Quotes"], homeMode: "new" }, "2026-11-11"));
  assert.equal(again.created.length, 0);
});
