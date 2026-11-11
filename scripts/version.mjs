// Erhöht die Version in manifest.json: node scripts/version.mjs [patch|minor|major]
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const file = join(dirname(fileURLToPath(import.meta.url)), "..", "manifest.json");
const m = JSON.parse(readFileSync(file, "utf8"));
const [a, b, c] = m.version.split(".").map(Number);
const kind = process.argv[2] || "patch";
m.version = kind === "major" ? `${a + 1}.0.0` : kind === "minor" ? `${a}.${b + 1}.0` : `${a}.${b}.${c + 1}`;
writeFileSync(file, JSON.stringify(m, null, 2) + "\n");
console.log("Version " + m.version);
