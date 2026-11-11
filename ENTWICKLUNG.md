# Compass – Entwicklung

Früher „Quotes & Notes“. Die interne Kennung bleibt `quote-card`, damit Einstellungen und Notizen unverändert weiterlaufen. Eine veröffentlichte Kennung kann sich nie mehr ändern.

Dieses Repository ist die Quelle. Im Vault liegt nur das gebaute Plugin unter `.obsidian/plugins/quote-card`.

## Aufbau

| Datei | Inhalt |
|---|---|
| `src/01-grundlagen.js` | Einstellungen, Hilfen, Kontrast, Zitatkarte |
| `src/02-teilen.js` | Teilen als Bild: Zeichnen, Karussell, Dialog, Zitat speichern |
| `src/03-zitate.js` | Feste und rotierende Zitatkarten, Zitat des Tages |
| `src/04-startseite.js` | `home-dashboard` |
| `src/05-notizen.js` | `note-header`, Farbthemen, How To, `note-footer` |
| `src/06-einstellungen.js` | Einstellungsreiter mit Sprachwahl Deutsch/Englisch |
| `src/07-bestand.js` | In einen vorhandenen Vault einbauen: Vault lesen, Ordner vorschlagen, Plan, Ausführen, Fenster (DE/EN) |
| `src/07-einrichtung.js` | Einrichtung für Einsteiger: Ordner, Vorlagen, Listen, Startseite, Plugin-Empfehlungen (DE/EN) |
| `src/07-einrichtung-zitate.js` | 100 Startzitate, ohne Autor oder gemeinfrei, jeweils deutsch und englisch |
| `src/07-medien.js` | Bilder und Videos anordnen: Leiste und Stichwort im Link |
| `src/07-plugin.js` | Plugin: Befehle, Menüs, Werkzeugleiste, Fenster |

Die Teile werden nur aneinandergehängt, es gibt keinen Bundler und keine Abhängigkeiten.

## Theme „Warm“

`theme/Warm` ist ein eigenes Theme und nicht Teil des Plugins: nur Obsidian-Variablen, Regler in Style Settings. Zum Einspielen `theme/Warm/theme.css` und `manifest.json` nach `.obsidian/themes/Warm` im Vault kopieren.

## Arbeiten

```bash
npm test
```

```bash
npm run version:minor
```

```bash
npm run deploy
```

`deploy` baut, testet und kopiert `main.js`, `styles.css` und `manifest.json` in den Vault. Danach Obsidian neu starten oder das Plugin aus- und einschalten. Bei einer neuen Version auch `versions.json` ergänzen (Version → `minAppVersion`).

## Veröffentlichen

1. Version erhöhen, `versions.json` ergänzen, committen und pushen.
2. GitHub-Release mit dem Tag der Version, z. B. `2.8.0`, ohne „v“. Anhänge: `dist/main.js` als `main.js`, `manifest.json`, `styles.css`.
3. Beim ersten Mal: auf community.obsidian.md mit dem Obsidian-Konto anmelden, GitHub verknüpfen, unter „Set up and claim“ das Plugin hinzufügen. Die Prüfung läuft automatisch.

Vorher Obsidians Prüfer laufen lassen (`eslint-plugin-obsidianmd`, Empfehlungs-Konfiguration). Sicherheitsregeln dürfen keine Fehler melden.

## Grundsätze

- Das Plugin gestaltet nur seine eigenen Bausteine. Überschriften, Fließtext und Links gehören zu Theme und Style Settings.
- Alles wird als Text gesetzt, nie als HTML. Links nur mit http oder https. Keine Netzwerkzugriffe.
- Keine Stile direkt im Code setzen: feste Werte als CSS-Klasse, berechnete Werte mit `setCssProps`.
- Fenster: Stile und Ereignisse gelten auch in abgetrennten Fenstern (`onEachWindow`, `activeDocument`).
- Erster Start: im (fast) leeren Vault die Einsteiger-Einrichtung, sonst einmal die Auswahl „In meinen Vault einbauen“ oder „Neu anfangen“ (`autoSetupMode`). Der Befehl „Einrichtung starten“ entscheidet genauso (`openCompassSetup`).
- Einbauen: `scanVault` liest nur, `addPlan` rechnet, `runAdd` legt an. Vorhandene Vorlagen gleichen Namens, Templater-Regeln, Modus und Startseite bleiben. Ordnernamen stehen in Listen-Filtern in YAML-Anführungszeichen, damit „#“ oder „:“ nichts abschneiden.
- Die Einrichtung legt nur Fehlendes an und überschreibt nie. Plugins installiert sie nicht selbst, sie öffnet nur deren offizielle Seite in Obsidian. Bei Templater ergänzt sie nur Ordner ohne Vorlage und ändert keinen gewählten Modus.
- Grundsätzlich Englisch: Oberfläche (`settings.lang`) und Eigenschaften (`settings.noteLang`) stehen standardmäßig auf `en`. Beide lassen sich getrennt umstellen.
- Ältere Installationen: `LEGACY_DEFAULTS` in `src/07-einrichtung.js` hält die früheren Standards fest (deutsche Eigenschaften, Medienordner, Zitat-Vorlage, Teilen-Ordner). Wer Compass schon vor 2.6.0 hatte, bekommt die Einrichtung nie von selbst.
- Eigenschaften gibt es deutsch und englisch (`kernaussage` / `summary` …). Compass liest beide, `PROP_EN` in `src/01-grundlagen.js` ordnet sie zu. Neue Namen richten sich nach `noteLang`, nicht nach der Oberfläche.
- Die Oberfläche gibt es englisch und deutsch, umschaltbar in den Einstellungen unter „Language / Sprache“ (`settings.lang`). Jede Datei hat ein Textobjekt `{ de, en }` (`…_TEXT`, die Anleitung in `HOWTO`). `test/texte.test.mjs` prüft, dass jede Text-ID in beiden Sprachen existiert.
- Schlüsselwörter in Codeblöcken und Bild-Links sind englisch (`folder`, `tile`, `today`, `right` …). Die deutschen aus älteren Notizen gelten weiter: `KEYWORDS_DE` und `blockOptions` in `src/01-grundlagen.js`, `MEDIA_LAYOUT_DE` in `src/07-medien.js`, `THEME_EN` für Farbnamen.
