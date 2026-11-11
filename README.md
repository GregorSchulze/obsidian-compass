# Compass

Quote cards, a quote of the day, coloured note headers, a home dashboard, image layout and sharing as images. A guided setup builds a complete note system for new vaults. In English, with German available.

## Features

- **Quote cards.** A `quote-card` block shows a note's quote as a card. `quote-rotator` cycles through a folder of quotes. A quote of the day changes daily and is the same everywhere on that day.
- **Share as image.** Turn any quote or passage into an image for stories (9:16), posts (4:5) or squares (1:1). Images come in light or dark and keep text out of the areas Instagram covers. Long texts become a carousel.
- **Note header and footer.** A coloured header shows area, status, title, summary, date and sources. You can edit the title and summary right in the header. Each template can have its own colour.
- **Home dashboard.** The `home-dashboard` block shows a greeting, rotating quotes, tiles for your folders, reading progress and recently edited notes.
- **Arrange images and videos.** Place media left or right with text flowing around it, centred, or side by side. On iPhone and iPad, resize images with a touch grip.
- **Guided setup.** For a new vault it creates folders, templates, lists (Bases), a home page and 100 starter quotes. For a vault you already use, it works with your folders and only adds what you choose. Nothing is ever overwritten.

## Getting started

- **New vault:** the beginner setup opens on its own.
- **Vault you already use:** on first start Compass asks once whether to add itself to your vault or start fresh. “Add to my vault” takes four steps:
  1. Pick the building blocks: quotes, home page, note headers, media lists.
  2. Confirm the suggested folders from your vault, or create new ones. Your templates folder and Templater rules are picked up; existing templates and rules stay.
  3. Choose the tiles for the home page. If you already have one, Compass creates “Compass Home” or copies the block for you to paste.
  4. Review what will be added and what stays as it is, then press “Add”.
- You can start it again any time from the command palette with “Start setup”. Only what is missing is added.
- **How-to:** every block is explained with a live example under Settings → Compass → How To.

## Blocks

````
```quote-card
```
````

````
```quote-rotator
folder: 40 Quotes
seconds: 17
```
````

````
```quote-card
today: 40 Quotes
```
````

````
```home-dashboard
name: Anna
quotes: 40 Quotes
dailyquote: yes
tile: Media | 50 Media | @media
tile: Projects | 30 Projects | [[Project List.base|Projects]]
```
````

````
```note-header
```
````

Image layout lives in the link: `![[garden.png|right|300]]`. The keywords are `left`, `center`, `right` and `row`.

Notes written with earlier German keywords (`ordner`, `heute`, `kachel`, `rechts` …) keep working.

## Language

Compass is in English. German is available under Settings → Compass, and the setup can create a German note system.

Property names are a separate setting, so lists and filters keep matching your notes. Compass reads both forms either way, for example `summary` or `kernaussage`, and `rating` or `bewertung`.

## Recommended plugins

The setup suggests Templater, Homepage, Iconize, Notebook Navigator, Paste image rename and Remember cursor position, and explains how each works with Compass. It only opens their official pages in Obsidian. Installing them is up to you.

With Templater, the setup adds folder templates only for folders that have none. Existing rules stay as they are, and a setup based on file-name rules keeps its mode.

## Privacy and security

- No network requests and no telemetry. Everything stays in your vault.
- Note content is always rendered as text, never as HTML. Links open only with `http` or `https`.

## Starter quotes

The 100 starter quotes either have no author or come from authors whose works are in the public domain. Each comes in English and German.

## Fonts

The defaults use Instrument Serif and Geist Mono when they are installed, and fall back to Georgia and the system monospace font otherwise. You can change the fonts in the settings.

## License

[MIT](LICENSE)

Development notes (German): [ENTWICKLUNG.md](ENTWICKLUNG.md)
