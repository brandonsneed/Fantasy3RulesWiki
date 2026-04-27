/* ═══════════════════════════════════════════════════════════════════
   WFB3 MAGIC ITEMS DATA
   Source: Warhammer Armies (3rd ed.) — Magic Items Charts
   Used by: army-list.html to populate ability pickers for magic
   equipment options (standards, instruments, weapons, armour, etc.)
═══════════════════════════════════════════════════════════════════ */

const WFB3_MAGIC_ITEMS = {

  /* ──────────────────────────────────────────────────────
     MAGIC WEAPONS
     Base cost: 25 pts. Unlimited abilities for swords;
     one ability for other weapons (Dwarf axes/hammers = unlimited).
  ────────────────────────────────────────────────────── */
  weapon: {
    category: "weapon",
    label: "Magic Weapon",
    base: 25,
    maxAbilities: null,
    abilities: [
      { name: "Frostblade",          cost: 50 },
      { name: "Trance",              cost: 25 },
      { name: "Enchanted Wound",     cost: 25 },
      { name: "Hellhoned Blade",     cost: 10 },
      { name: "Sacred Blade",        cost: 10 },
      { name: "Exorcism Blade",      cost: 10 },
      { name: "Enchanted Strike",    cost: 10 },
      { name: "Parasitic Blade",     cost: 10 },
      { name: "Parrying Blade",      cost: 10 },
      { name: "Fireblade",           cost: 10 },
      { name: "Degeneration Strike", cost:  5 },
      { name: "Mighty Strike",       cost:  5 },
      { name: "Cursed Blade",        cost:  5 },
      { name: "Baneblade",           cost:  5 },
      { name: "Frenzied Blade",      cost:  5 },
    ]
  },

  /* ──────────────────────────────────────────────────────
     MAGIC ARMOUR
     Base cost: normal armour cost (already in unit option).
     One magical ability only (character may have magic armour
     AND magic shield = two separate abilities total).
  ────────────────────────────────────────────────────── */
  armour: {
    category: "armour",
    label: "Magic Armour",
    base: 0,
    maxAbilities: 1,
    abilities: [
      { name: "Chaos Armour",                    cost: 50 },
      { name: "Mithril Armour",                  cost: 50 },
      { name: "Galvorn Armour",                  cost: 50 },
      { name: "Magically Inscribed Armour",      cost: 50 },
      { name: "Dwarf Mithril",                   cost: 25 },
      { name: "Spell Shield",                    cost: 25 },
      { name: "Spell-tempered Armour",           cost: 25 },
      { name: "Blinding Glare",                  cost: 25 },
      { name: "Talismanic Shield",               cost: 15 },
      { name: "Arcane Armour",                   cost: 10 },
      { name: "Protective Runes or Symbols",     cost: 10 },
      { name: "Dragonhelm",                      cost:  5 },
      { name: "Dragonshield",                    cost:  5 },
      { name: "Cold Steel",                      cost:  3 },
      { name: "Magical Woad / War-paint / Tattoos", cost: 3 },
    ]
  },

  /* ──────────────────────────────────────────────────────
     MAGIC STANDARDS
     Unit standard: base (ordinary standard cost) + 1 ability.
     Army/contingent standard: 50 pts base + up to 3 abilities.
     maxAbilities is enforced by the army list maximum (shown in
     the unit option cost), not strictly limited here in the UI —
     the player is responsible for staying within their list limit.
  ────────────────────────────────────────────────────── */
  standard: {
    category: "standard",
    label: "Magic Standard",
    base: 0,
    maxAbilities: 3,
    abilities: [
      { name: "Battle Banner",      cost: 100 },
      { name: "Icon of Divine Wrath", cost: 100 },
      { name: "Bane Banner",        cost: 100 },
      { name: "Amuletic Standard",  cost: 100 },
      { name: "Sacred Standard",    cost: 100 },
      { name: "Hellfire Banner",    cost:  50 },
      { name: "Dread Banner",       cost:  50 },
      { name: "Talismanic Standard", cost: 50 },
      { name: "War Banner",         cost:  25 },
      { name: "Ward of the Brave",  cost:  25 },
      { name: "Relic Banner",       cost:  25 },
    ]
  },

  /* ──────────────────────────────────────────────────────
     MAGIC INSTRUMENTS
     Base cost: ordinary instrument cost (already in option).
     One magical ability costing 25 pts extra.
  ────────────────────────────────────────────────────── */
  instrument: {
    category: "instrument",
    label: "Magic Instrument",
    base: 0,
    maxAbilities: 1,
    abilities: [
      { name: "Doomsounder",   cost: 25 },
      { name: "Battlecall",    cost: 25 },
      { name: "Battlecry",     cost: 25 },
      { name: "Hymn of Hate",  cost: 25 },
      { name: "Call of Valour", cost: 25 },
      { name: "Battlerage",    cost: 25 },
    ]
  },

  /* ──────────────────────────────────────────────────────
     MAGIC MISSILES — ONE SHOT
     Fixed cost per missile (no base + ability structure;
     each entry IS the full cost for that missile).
  ────────────────────────────────────────────────────── */
  missile_oneshot: {
    category: "missile",
    label: "One-Shot Magic Missile",
    base: 0,
    maxAbilities: 1,
    abilities: [
      { name: "Hail of Doom",   cost: 25 },
      { name: "Arcane Arrow",   cost: 20 },
      { name: "Wings of Death", cost: 10 },
    ]
  },

  /* ──────────────────────────────────────────────────────
     MAGIC MISSILES — SUPPLY (enough for whole battle)
  ────────────────────────────────────────────────────── */
  missile_supply: {
    category: "missile",
    label: "Magic Missile Supply",
    base: 0,
    maxAbilities: 1,
    abilities: [
      { name: "Seeking Arrows", cost: 10 },
      { name: "Blood Arrows",   cost:  5 },
      { name: "Arcane Bodkin",  cost:  5 },
      { name: "Hell Shafts",    cost:  5 },
    ]
  },

  /* ──────────────────────────────────────────────────────
     SCROLLS
     Cost per spell level; a scroll may hold multiple spells.
     Handled differently: level picker rather than named ability.
  ────────────────────────────────────────────────────── */
  scroll: {
    category: "scroll",
    label: "Scroll",
    base: 0,
    maxAbilities: null,
    levels: [
      { level: 1, cost:  25 },
      { level: 2, cost:  50 },
      { level: 3, cost: 100 },
      { level: 4, cost: 200 },
    ]
  },

  /* ──────────────────────────────────────────────────────
     MAGIC RINGS
     One spell per ring; cost per spell level.
  ────────────────────────────────────────────────────── */
  ring: {
    category: "ring",
    label: "Magic Ring",
    base: 0,
    maxAbilities: 1,
    levels: [
      { level: 1, cost:  50 },
      { level: 2, cost: 100 },
      { level: 3, cost: 200 },
      { level: 4, cost: 400 },
    ]
  },

};
