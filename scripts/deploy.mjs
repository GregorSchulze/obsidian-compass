// Baut das Plugin und kopiert main.js, styles.css und manifest.json in den Vault.
// Zielordner über OBSIDIAN_PLUGIN_DIR änderbar. Vorher Obsidian am Mac beenden oder das Plugin danach neu laden.
import { copyFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = process.env.OBSIDIAN_PLUGIN_DIR ||
  join(homedir(), "Library/Mobile Documents/iCloud~md~obsidian/Documents/Main Vault/.obsidian/plugins/quote-card");
if (!existsSync(target)) { console.error("Zielordner fehlt: " + target); process.exit(1); }
execFileSync(process.execPath, [join(root, "scripts", "build.mjs")], { stdio: "inherit" });
// Alle Tests im Ordner test, damit neue nicht vergessen werden
const tests = readdirSync(join(root, "test")).filter((f) => f.endsWith(".test.mjs")).map((f) => join(root, "test", f));
execFileSync(process.execPath, ["--test", ...tests], { stdio: "inherit" });
copyFileSync(join(root, "dist", "main.js"), join(target, "main.js"));
for (const f of ["styles.css", "manifest.json"]) copyFileSync(join(root, f), join(target, f));
console.log("In den Vault kopiert: " + target);
