# Fantasy3RulesWiki

A fan-made digital companion for a classic rank-and-flank tabletop wargame. Runs entirely in the browser — no server, no build step, no dependencies.

**[→ Open the Rules Reference](https://brandonsneed.github.io/Fantasy3RulesWiki/)**

---

## What's included

### 📖 Rules Reference Wiki
A searchable, cross-linked rules reference covering the full game system — turn sequence, movement, shooting, combat, psychology, magic, special rules, and the bestiary. Organised into sections with a sidebar navigation and hash-based URLs so individual pages are bookmarkable and shareable.

- Multi-word search with keyword highlighting and keyboard navigation (`/` or `Ctrl+K` to focus)
- All internal references link directly to the relevant section
- Printable quick-reference sheet

**[Open Wiki](https://brandonsneed.github.io/Fantasy3RulesWiki/)**

### ⚔️ Army List Builder
A point-tracked army list builder with the full roster of units, characters, allies, and mercenaries. Drag-and-drop card ordering, force section groupings, and a print/PDF layout.

- Supports custom units (import via exported unit card JSON)
- Save and load multiple lists via local storage or JSON export
- Optional rules appendix printed alongside the list

**[Open Army List Builder](https://brandonsneed.github.io/Fantasy3RulesWiki/army-list.html)**

### 🃏 Unit Card Editor
A unit card creator and editor for building reference cards to use at the table. Supports standard infantry, war machines, war altars, handler & beast units, chariots, and characters.

- Points calculator based on race, equipment, and mounts
- Export cards as JSON and import directly into the army list builder
- Print-ready single-page layout

**[Open Unit Card Editor](https://brandonsneed.github.io/Fantasy3RulesWiki/unit-card.html)**

---

## Technical notes

- Single-file SPA (`index.html`) — all wiki content is embedded, no requests after initial load
- Army list and unit card editor are standalone HTML files sharing a common data layer
- All state persisted to `localStorage`; JSON export/import for portability
- Hosted on GitHub Pages; no backend

---

*Fan project. Not affiliated with or endorsed by any publisher.*
