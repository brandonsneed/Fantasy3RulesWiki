# Project Context — WFB3 Digital Companion

## What this is

A fan-made digital reference suite for a classic 1980s rank-and-flank tabletop wargame (Warhammer Fantasy Battle 3rd Edition, published by Games Workshop). Built to replace physical rulebooks and army list binders at the table. Deliberately vague in its public-facing text for DMCA reasons — no edition numbers, publisher names, or "transcribed rules" language anywhere in the HTML or README.

The project has three tools that cross-link to each other:

- **`index.html`** — the main wiki/rules reference SPA (~3.5MB, all content inline)
- **`army-list.html`** — point-tracked army list builder with drag-drop cards
- **`unit-card.html`** — unit card creator/editor, exports JSON importable into the army list

Hosted on GitHub Pages: `https://brandonsneed.github.io/Fantasy3RulesWiki/`

---

## Architecture

### index.html — SPA Wiki

Single-file SPA. All content is in hidden `.page` divs (`id="page-{pageId}"`), shown/hidden by a `navigate(pageId)` function. No framework, no bundler — just vanilla JS and inline CSS.

**Key globals:**
- `store` — JS object holding all dynamic data (units, spells, magic items etc.), populated from `embeddedData` on init
- `sectionMeta` — maps pageId → `{ label, icon, desc, key, parent }` for nav rendering
- `currentPage` — tracks the active page

**Hash routing:** `navigate()` calls `history.pushState({pageId}, '', '#' + pageId)` unless called with `{ fromHash: true }`. A `popstate` listener handles back/forward. Both the hash init and `buildSearchIndex()` are deferred to `DOMContentLoaded` — critical, because the `.page` divs appear *after* the closing `</script>` tag in the HTML, so they don't exist in the DOM when inline scripts run.

**Search:** Multi-word AND logic with word-boundary scoring (4pt title word-match, 2pt title substring, 2pt body word-match, 1pt body substring). Indexes both JS store entries (dynamic pages) and `.wiki-section[id]` elements (static content). Keyboard: `↑↓` to navigate results, `Enter` to select, `Esc` to dismiss, `/` or `Ctrl+K` to focus.

**Special Rules page:** Built lazily on first visit via `renderSpecialRulesRef()`, memoized with `srBuilt` flag. Scroll spy watches `#content` div scrollTop (not `window`) because the SPA content scrolls inside that div.

**Cross-wiki links** use a standard inline style throughout:
```html
<a onclick="navigate('pageId');setTimeout(()=>document.getElementById('sectionId')?.scrollIntoView({behavior:'smooth'}),150)"
   style="color:var(--accent);cursor:pointer;text-decoration:none;border-bottom:1px dotted var(--accent)">
  link text
</a>
```

### army-list.html — Army List Builder

Standalone file. Units are rendered as draggable cards in a grid. Cards are stored in `cards[]` in localStorage, each card has a `sourceId` matching a unit in the data layer.

**Custom units:** Created in the unit card editor and imported as JSON. Stored in `customUnits[]`. The browser sidebar shows them under a "Custom Units" section. `inferCustomAssignments()` assigns custom cards to army sections by scanning the cards array for the nearest preceding official card — but it only runs on init, and only sets `assignedArmy` if not already set, so explicit drag-drop assignments are never overwritten.

**Force assignment for custom units:** When a custom card is drag-dropped, both the wrapper drop handler and zone drop handler explicitly set `card.assignedArmy = getForceArmyId(targetCard)`. This was a bug that took a while to nail — originally the assignment was being inferred on every save, which wiped explicit placements.

**`getForceArmyId(card)`** — returns the army for force section grouping. For custom units returns `card.assignedArmy || '__custom__'`.

**Print layout:** `applyPrintOrder()` runs on `beforeprint` event, reorders the DOM for logical grouping (character+unit pairs), restores display names. `buildPrintAppendix()` optionally appends a special rules reference section.

### unit-card.html — Unit Card Editor

Card types: standard, warmachine, waraltar, handler+beasts, chariot, character. Each type has its own render path. Points calculator built in. Export to JSON → import into army list builder. Also has a `+ Army List` button that POSTs the card directly to army-list.html via localStorage.

---

## Data files

- **`units-data.js`** — full unit roster for all armies, allies, and mercenaries. Each entry has stats, options, flavour text, special rules, illustrations
- **`special-rules-data.js`** — special rules definitions, used by the wiki and the print appendix
- **`magic-items-data.js`** — magic weapons, armour, standards, instruments, scrolls, rings
- **`card-render.js`** — shared card rendering logic used by both army-list.html and unit-card.html

---

## Things that were tricky / known quirks

- **DOMContentLoaded timing** — `buildSearchIndex()` and hash routing init must run in `DOMContentLoaded`, not inline. The page divs come after `</script>` in the HTML so they're not in the DOM during inline script execution. Easy to miss, silently falls back to home page.

- **`inferCustomAssignments()` non-destructive** — must check `if (!c.assignedArmy)` before assigning. Removing this guard causes explicit drag-drop assignments to be wiped on every save/reload.

- **Scroll spy in SPA** — always attach to `document.getElementById('content')` scrollTop, not `window`. The main content area is a scrollable div, window never scrolls.

- **GitHub Pages CDN cache** — deploys go live within ~60s but CDN can serve stale for a few minutes. Cache-bust with a query param (`?v=commitsha`) to verify immediately after push.

- **Large file edits** — `index.html` is ~32,000 lines. The Edit tool struggles with whitespace-sensitive matching at that scale. For bulk replacements, write a Python script that does `content.replace(old, new)` and run it via Bash. The `_patch_*.py` scripts in git history are good templates.

---

## Content scope

The wiki covers the full game system across two source volumes:

- **Basic/Advanced game** — turn sequence, movement, shooting, combat, psychology, magic, war machines, scenery, characters, points
- **Bestiary** — intelligent races, giant races, creatures, undead, demons, elementals
- **Warhammer Armies supplement** — revised rules, army selection, allies, mercenaries, special rules, magic items, spell tables, full army lists for ~15 factions

All bare page-number citations (e.g. "see p13", "pp126–149") have been replaced with cross-wiki navigate links. Wizard Record Sheet reference genericised (the page doesn't exist in the wiki).

---

## This project as a template

This codebase is the structural and visual foundation for a family of related game reference wikis. If you are starting a new wiki project in this series, read this file first, then set up the new project's CLAUDE.md to reference it.

**What ports directly to a new project:**
- SPA shell pattern — `.page` divs, `navigate()`, `sectionMeta`, `currentPage`, hash routing, `popstate`
- CSS design system — all `--accent`, `--bg`, `--text-dim` etc. variables, the sidebar/topbar/content layout, card styles, print media queries
- Search — `buildSearchIndex()`, `scoreEntry()`, `makeSnippet()`, keyboard nav; just re-point at the new content
- `card-render.js` — stat table rendering is largely game-agnostic; extend for new stat lines
- Army list builder drag-drop architecture, force section grouping, print layout, save/load system
- Unit card editor structure — add/remove card types as needed for the new game's unit taxonomy

**What needs rebuilding for each new game:**
- All wiki content (rules, bestiary, army lists) — specific to the source material
- `units-data.js` — unit profiles, stats, options, flavour text
- `special-rules-data.js`, `magic-items-data.js` equivalents — rename/restructure as appropriate
- Unit stat line — RT uses 10 stats (M WS BS S T W I A Ld Cl WP Int) vs WFB's 9; card-render.js handles variable headers already
- Army organisation model — RT uses force org / detachment structure, not WFB's percentage-based lists
- Points system — RT points work differently; calculator in unit-card.html will need reworking

**Known sister projects:**
- `D:\Tabletop games\Warhammer 40,000\1st-8th Edition - Warhammer 40K Archives\40K Editions Through the Ages (1st - 8th Edition)\1st Edition (1987) - Rogue Trader\Wiki Project\` — RT (1987) wiki, spun off May 2026

---

## Repo

`https://github.com/brandonsneed/Fantasy3RulesWiki`

Main branch deploys automatically to GitHub Pages via the default Pages workflow. No build step — files are served as-is.
