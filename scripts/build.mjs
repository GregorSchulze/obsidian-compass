// Setzt src/*.js in Namensreihenfolge zu dist/main.js zusammen. Keine Abhängigkeiten nötig.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const parts = readdirSync(join(root, "src")).filter((f) => f.endsWith(".js")).sort();
const code = parts.map((f) => readFileSync(join(root, "src", f), "utf8")).join("");
mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist", "main.js"), code);
console.log(`dist/main.js aus ${parts.length} Teilen, ${code.length} Zeichen`);
