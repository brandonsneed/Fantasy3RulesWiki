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
      { name: "Frostblade",          cost: 50, desc: "Each wound inflicted causes D3 wounds. Enemy model hit must pass a Cl test or panic and flee immediately." },
      { name: "Trance",              cost: 25, desc: "Wielder always strikes in Initiative order regardless of weapon type. Wielder is immune to spells during their own Initiative phase." },
      { name: "Enchanted Wound",     cost: 25, desc: "Wounds inflicted by this weapon cannot be healed by Regeneration, healing spells, or any other means." },
      { name: "Hellhoned Blade",     cost: 10, desc: "+1 Strength. No armour save allowed against wounds." },
      { name: "Sacred Blade",        cost: 10, desc: "+2 to hit against Undead, Daemonic, and Chaos creatures. Daemons struck must pass a WP test or be immediately banished." },
      { name: "Exorcism Blade",      cost: 10, desc: "Any Chaos or Daemonic creature wounded must pass a WP test or be instantly destroyed and removed from play." },
      { name: "Enchanted Strike",    cost: 10, desc: "All attacks count as magical. Useful against creatures that can only be harmed by magic." },
      { name: "Parasitic Blade",     cost: 10, desc: "For every wound inflicted on the enemy (after saves), the enemy's unit suffers an additional automatic wound with no save." },
      { name: "Parrying Blade",      cost: 10, desc: "+1 to the wielder's armour save in hand-to-hand combat." },
      { name: "Fireblade",           cost: 10, desc: "Causes fire damage. Undead models wounded must pass a Cl test or be destroyed outright. Flammable creatures suffer +1 wound per hit." },
      { name: "Degeneration Strike", cost:  5, desc: "Each wound inflicted permanently reduces the target's WS and BS by 1 (cumulative). Models reduced to WS 0 cannot fight." },
      { name: "Mighty Strike",       cost:  5, desc: "+1 Strength bonus for the wielder in hand-to-hand combat." },
      { name: "Cursed Blade",        cost:  5, desc: "Each wound inflicted on the enemy also inflicts D3 wounds on the wielder (no save allowed). A desperate weapon." },
      { name: "Baneblade",           cost:  5, desc: "Counts as a magical attack. +1 to hit against one enemy race or unit type chosen when the weapon is purchased." },
      { name: "Frenzied Blade",      cost:  5, desc: "The wielder is subject to Frenzy whenever this weapon is drawn. All Frenzy rules apply." },
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
      { name: "Chaos Armour",                    cost: 50, desc: "Provides a 4+ save. Grants the wearer D3 random Chaos attributes at the start of the battle." },
      { name: "Mithril Armour",                  cost: 50, desc: "Provides a 4+ save with no movement penalty. As light as clothing." },
      { name: "Galvorn Armour",                  cost: 50, desc: "Provides a 3+ save. Magic weapons wound the wearer only on a roll of 6." },
      { name: "Magically Inscribed Armour",      cost: 50, desc: "The wearer is completely immune to all spells and magical effects." },
      { name: "Dwarf Mithril",                   cost: 25, desc: "Provides Heavy Armour protection with no movement penalty. Armour save improved by 1." },
      { name: "Spell Shield",                    cost: 25, desc: "Once per battle, automatically nullifies one spell that would affect the bearer." },
      { name: "Spell-tempered Armour",           cost: 25, desc: "+1 to armour save against all magical attacks and spell effects." },
      { name: "Blinding Glare",                  cost: 25, desc: "In hand-to-hand combat, enemy must pass an Initiative test or suffer −4 WS and BS for the duration of that combat." },
      { name: "Talismanic Shield",               cost: 15, desc: "Provides a 5+ save against all attacks, including magical ones that would normally ignore saves." },
      { name: "Arcane Armour",                   cost: 10, desc: "+1 to armour save, but only against magical attacks and spells." },
      { name: "Protective Runes or Symbols",     cost: 10, desc: "+1 to saves against Chaos magic and psychological effects such as Fear and Terror." },
      { name: "Dragonhelm",                      cost:  5, desc: "+1 to armour save against fire-based attacks and breath weapons." },
      { name: "Dragonshield",                    cost:  5, desc: "+1 to armour save against fire-based attacks. Cannot be used alongside another shield." },
      { name: "Cold Steel",                      cost:  3, desc: "Armour counts as one type heavier (Light Armour becomes Heavy, Heavy becomes Plate, etc.)." },
      { name: "Magical Woad / War-paint / Tattoos", cost: 3, desc: "Grants a 6+ natural armour save to otherwise unarmoured models. Cannot be combined with other armour." },
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
      { name: "Battle Banner",      cost: 100, desc: "The bearer's unit is immune to Fear and Terror for as long as the banner is raised and the bearer is alive." },
      { name: "Icon of Divine Wrath", cost: 100, desc: "All friendly units within 12″ may re-roll one failed Leadership test per turn." },
      { name: "Bane Banner",        cost: 100, desc: "All enemies within 6″ of the banner suffer −1 to their armour saves." },
      { name: "Amuletic Standard",  cost: 100, desc: "The bearer's unit is immune to all magic missiles and direct-damage spells." },
      { name: "Sacred Standard",    cost: 100, desc: "All Undead units within 6″ of this banner are subject to Instability at the start of each turn." },
      { name: "Hellfire Banner",    cost:  50, desc: "All enemy units within 12″ of this banner must treat the bearer's unit as causing Fear." },
      { name: "Dread Banner",       cost:  50, desc: "Any enemy unit wishing to charge the bearer's unit must first pass a WP test or be unable to charge." },
      { name: "Talismanic Standard", cost: 50, desc: "All models in the bearer's unit receive +1 to their armour saves against all attacks." },
      { name: "War Banner",         cost:  25, desc: "+1 to the bearer's unit's combat resolution score in any round of hand-to-hand combat." },
      { name: "Ward of the Brave",  cost:  25, desc: "Once per battle, the bearer's unit is automatically immune to Rout tests for one full turn." },
      { name: "Relic Banner",       cost:  25, desc: "All friendly units within 12″ receive +1 to their Leadership value." },
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
      { name: "Doomsounder",   cost: 25, desc: "All enemy units within 12″ when the instrument sounds must pass a WP test or become subject to Terror that turn." },
      { name: "Battlecall",    cost: 25, desc: "All friendly units within 12″ may re-roll any failed Rout tests while the instrument is sounding." },
      { name: "Battlecry",     cost: 25, desc: "+1 to combat resolution for all friendly units within 12″ in the turn the instrument is played." },
      { name: "Hymn of Hate",  cost: 25, desc: "All friendly units within 12″ treat every enemy unit as a hated enemy for that turn." },
      { name: "Call of Valour", cost: 25, desc: "Once per battle: all friendly units within 12″ are immune to Fear for one full turn." },
      { name: "Battlerage",    cost: 25, desc: "Once per battle: all friendly units within 12″ are subject to Frenzy for one full turn." },
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
      { name: "Hail of Doom",   cost: 25, desc: "Fires 2D6 magical arrows simultaneously. Each hits on 2+, Strength 3, no armour save. One use only." },
      { name: "Arcane Arrow",   cost: 20, desc: "A single arrow that hits automatically with a −3 armour save modifier. Counts as a magical attack. One use only." },
      { name: "Wings of Death", cost: 10, desc: "Fires a cloud at one enemy unit. Every model in the unit must pass a Cl test or be slain outright. One use only." },
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
      { name: "Seeking Arrows", cost: 10, desc: "All shots with this supply count as magical attacks and gain +1 to hit." },
      { name: "Blood Arrows",   cost:  5, desc: "Each successful hit with this supply causes D3 wounds instead of 1." },
      { name: "Arcane Bodkin",  cost:  5, desc: "All hits with this supply completely ignore armour saves." },
      { name: "Hell Shafts",    cost:  5, desc: "Any unit hit by this supply must immediately test for Fear as if charged by a Fear-causing enemy." },
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
