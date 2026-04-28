/* ═══════════════════════════════════════════════════════════════════
   WFB3 SPECIAL RULES DATA
   Source: Warhammer Armies (3rd ed.) — army background, psychology
           sections and unit entries.
   Used by: card-render.js to display special rule tags on unit cards.
═══════════════════════════════════════════════════════════════════ */

/* Short descriptions shown as tooltips on rule tags. */
const WFB3_RULE_DEFS = {
  'Cause Fear':            'Causes Fear in enemies. Enemies must pass a Fear test before charging and may flee.',
  'Cause Terror':          'Causes Terror. Enemies must pass a Terror test (−1 WP) before charging and may flee.',
  'Frenzy':                '+1 Attack. Must always pursue. Immune to Fear & Terror while frenzied. Lost if unit takes casualties.',
  'Hatred':                'Must re-roll all misses in the first round of hand-to-hand combat against the hated enemy.',
  'Hatred (High Elves & Wood Elves)': 'Must re-roll all misses in the first round of hand-to-hand combat against High Elves and Wood Elves.',
  'Hatred (Goblinoids)':   'Must re-roll all misses in the first round of hand-to-hand combat against Orcs, Goblins and all Goblinoids.',
  'Stupidity':             'Must pass a Leadership test at the start of each turn or remain stationary / blunder forward.',
  'Immune to Psychology':  'Never takes psychological tests. Immune to Fear, Terror, Hatred, and Frenzy effects.',
  'Skirmishers':           'Loose formation. May move through difficult terrain freely. Confer no rank bonuses.',
  'Fast Cavalry':          'May skirmish, evade charges, and freely reform during movement.',
  'Scouts':                'Deployed after all other forces. May be placed anywhere on the table not in an enemy zone.',
  'Ambushers':             'Arrive from unexpected directions after the game begins.',
  'Fly':                   'Uses Fly move (M×3) instead of normal ground movement. Ignores terrain and intervening units.',
  'Poisoned Attacks':      'Successful hits automatically wound — no Strength roll needed.',
  'Regeneration':          'At the start of each turn, roll for each wound suffered. On a 4+ the wound is regenerated.',
  'Fanatics':              'Hidden within a parent unit. When released, spin out randomly causing automatic hits on anything in their path.',
};

/* Per-unit special rules.
   Keys are unit IDs as they appear in WFB3_UNITS (no "card-" prefix).
   Values are arrays of rule name strings, drawn from WFB3_RULE_DEFS above
   or free-form short strings for rules unique to that entry. */
const WFB3_UNIT_RULES = {

  /* ── DARK ELVES ──────────────────────────────────────────────── */
  // All Dark Elves hate High Elves and Wood Elves (army-wide rule)
  'de-40100-warriors':          ['Hatred (High Elves & Wood Elves)'],
  'de-2060-crossbowmen':        ['Hatred (High Elves & Wood Elves)'],
  'de-1060-witch-elves':        ['Frenzy', 'Hatred (High Elves & Wood Elves)'],
  'de-025-shadows':             ['Scouts', 'Hatred (High Elves & Wood Elves)'],
  'de-040-dark-riders':         ['Fast Cavalry', 'Hatred (High Elves & Wood Elves)'],
  'de-020-helldrakes':          ['Stupidity', 'Hatred (High Elves & Wood Elves)'],   // Cold One riders
  'de-030-doomsteeds':          ['Hatred (High Elves & Wood Elves)'],
  'de-040-doomdrakes':          ['Stupidity', 'Hatred (High Elves & Wood Elves)'],   // younger Cold One riders
  'de-08-whelp-masters':        ['Hatred (High Elves & Wood Elves)'],

  /* ── WOOD ELVES ──────────────────────────────────────────────── */
  // All Wood Elves hate Goblinoids (army-wide rule)
  'we-020-elven-lords':         ['Hatred (Goblinoids)'],
  'we-040-wood-riders':         ['Fast Cavalry', 'Hatred (Goblinoids)'],
  'we-04-wain-lords':           ['Hatred (Goblinoids)'],
  'we-020-guards':              ['Hatred (Goblinoids)'],
  'we-040-wardancers':          ['Immune to Psychology', 'Hatred (Goblinoids)'],
  'we-030-lords-bowmen':        ['Hatred (Goblinoids)'],
  'we-030-glade-runners':       ['Scouts', 'Skirmishers', 'Hatred (Goblinoids)'],
  'we-3060-archers':            ['Hatred (Goblinoids)'],
  'we-060-warrior-kinbands':    ['Hatred (Goblinoids)'],
  'we-06-beastmasters':         ['Hatred (Goblinoids)'],
  'we-020-falconers':           ['Skirmishers', 'Hatred (Goblinoids)'],
  'we-08-shapechangers':        ['Cause Fear', 'Hatred (Goblinoids)'],
  'we-03-treemen':              ['Cause Fear', 'Hatred (Goblinoids)'],

  /* ── HIGH ELVES ──────────────────────────────────────────────── */
  'he-05-elven-dragonkin':      ['Cause Fear', 'Fly'],
  'he-040-shore-riders':        ['Fast Cavalry'],
  'he-010-sea-elf-wardancers':  ['Immune to Psychology'],
  'he-025-seekers':             ['Scouts', 'Skirmishers'],

  /* ── EMPIRE ──────────────────────────────────────────────────── */
  'em-016-fleglers':            ['Frenzy', 'Immune to Psychology'],
  'em-010-bergjaeger':          ['Scouts', 'Skirmishers'],
  'em-030-forstjaeger':         ['Scouts', 'Skirmishers'],

  /* ── BRETONNIA ───────────────────────────────────────────────── */
  'br-080-chasseurs-de-la-mort': ['Scouts'],
  'br-020-ribalds':              ['Skirmishers'],

  /* ── CHAOS ───────────────────────────────────────────────────── */
  'ch-020-chaos-warrior-horse': ['Cause Fear'],
  'ch-020-chaos-warriors':      ['Cause Fear'],
  'ch-025-minotaurs':           ['Cause Fear', 'Frenzy'],
  'ch-010-trolls':              ['Cause Fear', 'Stupidity', 'Regeneration'],

  /* ── SKAVEN ──────────────────────────────────────────────────── */
  'sk-010-night-runners':       ['Scouts', 'Skirmishers'],
  'sk-020-gutter-runners':      ['Scouts', 'Skirmishers'],
  'sk-06-plague-censer-bearers':['Cause Fear', 'Frenzy'],
  'sk-020-plague-monks':        ['Frenzy'],

  /* ── SLANN ───────────────────────────────────────────────────── */
  'sl-020-venom-tribes':        ['Poisoned Attacks', 'Skirmishers'],
  'sl-015-scouts':              ['Scouts', 'Skirmishers'],
  'sl-030-jaguar-warriors':     ['Scouts'],
  'sl-05-troglodytes':          ['Cause Fear', 'Stupidity'],
  'sl-030-human-slaves':        ['Stupidity'],

  /* ── ORCS & GOBLINS ──────────────────────────────────────────── */
  'og-030-savage-boyz':         ['Frenzy'],
  'og-020-savage-arrers':       ['Frenzy'],
  'og-040-black-orcs':          ['Immune to Psychology'],
  'og-020-trolls':              ['Cause Fear', 'Stupidity', 'Regeneration'],
  'og-03-goblin-fanatics-per-goblin-infantry-u': ['Fanatics'],

  /* ── DWARFS ──────────────────────────────────────────────────── */
  // All Dwarfs hate Goblinoids (army-wide rule)
  'dw-020-hammerers':           ['Hatred (Goblinoids)'],
  'dw-040-dwarf-clansmen':      ['Hatred (Goblinoids)'],
  'dw-020-iron-breakers':       ['Hatred (Goblinoids)'],
  'dw-020-longbeards':          ['Hatred (Goblinoids)'],
  'dw-2060-dwarf-crossbowmen':  ['Hatred (Goblinoids)'],
  'dw-40120-dwarf-warriors':    ['Hatred (Goblinoids)'],
  'dw-020-thunderers':          ['Hatred (Goblinoids)'],
  'dw-020-troll-slayers':       ['Frenzy', 'Immune to Psychology', 'Hatred (Goblinoids)'],
  'dw-010-giant-slayers':       ['Frenzy', 'Immune to Psychology', 'Hatred (Goblinoids)'],
  'dw-050-gnome-warriors':      [],
  'dw-012-sappers':             ['Scouts', 'Hatred (Goblinoids)'],
  'dw-015-mountaineers':        ['Scouts', 'Skirmishers', 'Hatred (Goblinoids)'],

  /* ── UNDEAD ──────────────────────────────────────────────────── */
  // All Undead: Cause Fear + Immune to Psychology. Mummies: Cause Terror instead.
  'un-050-death-riders':        ['Cause Fear', 'Immune to Psychology'],
  'un-04-undead-chariots':      ['Cause Fear', 'Immune to Psychology'],
  'un-20100-skeleton-warriors': ['Cause Fear', 'Immune to Psychology'],
  'un-040-skeleton-archers':    ['Cause Fear', 'Immune to Psychology'],
  'un-040-skeleton-crossbows':  ['Cause Fear', 'Immune to Psychology'],
  'un-1050-grim-reapers':       ['Cause Fear', 'Immune to Psychology'],
  'un-0100-zombies':            ['Cause Fear', 'Immune to Psychology'],
  'un-080-ghouls':              ['Cause Fear', 'Immune to Psychology'],
  'un-010-mummies':             ['Cause Terror', 'Immune to Psychology'],
  'un-06-carrion':              ['Cause Fear', 'Immune to Psychology', 'Fly'],
  'un-01-plague-cart':          ['Cause Fear', 'Immune to Psychology'],
  'un-04-undead-war-machines':  ['Cause Fear', 'Immune to Psychology'],

};
