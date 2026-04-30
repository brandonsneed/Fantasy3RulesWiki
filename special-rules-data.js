/* ═══════════════════════════════════════════════════════════════════
   WFB3 SPECIAL RULES DATA  —  single source of truth
   Source: Warhammer Fantasy Battle (3rd ed.) rulebook & Warhammer
           Armies (3rd ed.) — psychology, bestiary & unit entries.

   Exports (all computed from WFB3_RULES below):
     WFB3_RULES              — master catalogue (category / short / text)
     WFB3_RULE_DEFS          — { ruleName: tooltipText }  used by card-render.js
     WFB3_SPECIAL_RULES_CATALOGUE — { ruleName: {category,text} } used by unit-card.html
     WFB3_STT_RULE_MAP       — { sttKey: catalogueName }  used by unit-card.html
     WFB3_UNIT_RULES         — { unitId: [ruleNames…] }   used by card-render.js
═══════════════════════════════════════════════════════════════════ */

/* ── Master rules catalogue ─────────────────────────────────────────────────
   Each entry:
     category     — grouping label shown in companion reference sheet
     short        — one-line tooltip shown on army-list card tags
     text         — full rule text shown in companion reference sheet
     catalogueName — (optional) key used in WFB3_SPECIAL_RULES_CATALOGUE when
                    it differs from the entry key (e.g. 'Scouts' → 'Scout Rules')
   Entries with only `short` are tag-only (tooltip, no companion panel).
   Entries with only `text` are catalogue-only (companion panel, no card tag). */

const WFB3_RULES = {

  /* ── PSYCHOLOGY ─────────────────────────────────────────────────────── */

  'Animosity': {
    category: 'Psychology',
    short: 'O&G units test each turn not in combat. Fail: unit squabbles — stands still, attacks itself, or blunders forward.',
    text: 'At the start of each player turn, any Orc or Goblin unit not currently in close combat must test for Animosity (Black Orcs are exempt — see Black Orc Animosity). Roll 2D6 against the unit\'s Leadership. On a fail, consult the Animosity table: the unit may refuse orders and squabble, attack a friendly unit, or blunder forward out of control. Goblins and Night Goblins are more prone to Animosity than Orcs. Units in the Animosity condition may not cast spells, use missiles, or perform any voluntary actions. See the Animosity Table in the rulebook.'
  },

  'Cause Fear': {
    category: 'Psychology',
    short: 'Enemies must test before charging or when charged. Fail to charge: frozen. Fail when charged: auto-rout.',
    text: 'This unit causes Fear in all living enemies under 10′ tall (unless those enemies are themselves Fear-causing or Immune to Psychology). Enemies wishing to charge this unit must first pass a Fear test (2D6 vs Cl). Failure means they cannot charge that turn. When this unit charges an enemy, the target must test or automatically rout. Enemies pushed back in combat by a Fear-causing unit also auto-rout. Note: creatures over 10′ tall are not affected by Fear from smaller creatures.'
  },

  'Cause Terror': {
    category: 'Psychology',
    short: 'Causes Terror (stronger than Fear). Enemies test on WP with −1 modifier before charging; fail = rout.',
    text: 'This unit causes Terror — a more powerful form of Fear. Enemies (regardless of size) wishing to charge must pass a Terror test (2D6 vs WP, with a −1 modifier). Failure means they cannot charge. When this unit charges, targets must test or automatically rout. Enemies pushed back in combat by a Terror-causing unit automatically rout. Units that are already subject to Fear are not additionally penalised; Terror supersedes Fear. Units that themselves Cause Terror are immune to Terror from others.'
  },

  'Fear': {
    category: 'Psychology',
    short: 'Enemies of this unit must pass a Fear test (2D6 vs Cl) to charge, or rout when charged.',
    text: 'Enemies must test (2D6 vs Cl) to charge, fire within charge reach of, or when charged by this unit. Fail to charge: cannot move. Fail when charged: auto-rout. Pushed-back by a feared enemy: auto-rout.'
  },

  'Terror': {
    category: 'Psychology',
    short: 'Stronger than Fear. Enemies test on WP (−1) to charge or when charged; fail = rout.',
    text: 'Terror is a heightened form of Fear caused by truly monstrous creatures. It affects enemies regardless of size. Enemies must test (2D6 vs WP, −1 modifier) to charge, fire within charge reach of, or when charged by a Terror-causing creature. Fail to charge: cannot move. Fail when charged: auto-rout.'
  },

  'Frenzy': {
    category: 'Psychology',
    short: '+1 Attack. Must always pursue. Immune to Fear & Terror while frenzied. Lost if unit takes casualties.',
    text: 'Test on charge (2D6 vs Cl; fail = frenzied). While frenzied: +1 to hit, +1 to wound, +1 to saves; must follow-up and pursue; never take Rout tests. Frenzy lasts while in base-to-base contact with enemy.'
  },

  'Hatred': {
    category: 'Psychology',
    short: 'Re-roll all missed attacks in the first round of combat against the hated enemy.',
    text: 'Must charge/shoot hated enemy if able (Cl test to resist). In combat vs hated: +1 to hit in the first round; +1 Ld on rout tests if pushed back; must always pursue.'
  },

  'Hatred (High Elves & Wood Elves)': {
    category: 'Psychology',
    short: 'Re-roll all misses in the first round of combat against High Elves and Wood Elves.',
    text: 'This unit hates all High Elves and Wood Elves. Must charge/shoot hated enemy if able (Cl test to resist). In combat vs High or Wood Elves: +1 to hit in the first round; +1 Ld on rout tests if pushed back; must always pursue.'
  },

  'Hatred (Goblinoids)': {
    category: 'Psychology',
    short: 'Re-roll all misses in the first round of combat against Orcs, Goblins and all Goblinoids.',
    text: 'This unit hates all Goblinoids (Orcs, Goblins, Hobgoblins, Snotlings and any similar creatures). Must charge/shoot hated enemy if able (Cl test to resist). In combat vs Goblinoids: +1 to hit in the first round; +1 Ld on rout tests if pushed back; must always pursue.'
  },

  'Hatred (Dwarfs & Gnomes)': {
    category: 'Psychology',
    short: 'Re-roll all misses in the first round of combat against Dwarfs and Gnomes.',
    text: 'This unit hates all Dwarfs and Gnomes. Must charge/shoot hated enemy if able (Cl test to resist). In combat vs Dwarfs or Gnomes: +1 to hit in the first round; +1 Ld on rout tests if pushed back; must always pursue. This is a racial trait of Goblins as noted in the O&G army psychology section.'
  },

  'Stupidity': {
    category: 'Psychology',
    short: 'Test each turn. Fail in combat: only odd-numbered models fight. Fail out of combat: random blundering move.',
    text: 'Test at start of each turn (2D6 vs Cl). Fail in combat: odd man fights on D6 4+, characters test individually. Fail out of combat: random half-rate movement, no magic or shooting.'
  },

  'Immune to Psychology': {
    category: 'Psychology',
    short: 'Never tests for Fear, Terror, Hatred, Animosity, Panic, or any other psychological reaction.',
    text: 'This unit is completely immune to all psychological reactions. It never tests for Fear, Terror, Hatred, Animosity, Panic, Stupidity, or any similar mental effect. It cannot be affected by spells or items that cause psychological reactions. Note that being Immune to Psychology does not grant immunity to other effects that happen to mention a psychology rule (e.g. Instability in Undead armies).'
  },

  'Instability': {
    category: 'Psychology',
    short: 'Undead: suffer automatic D6 Strength 4 hits at end of each turn away from a controlling wizard.',
    text: 'Undead units that are not within range of a controlling wizard\'s Instability radius suffer D6 automatic Strength 4 hits at the end of each movement phase, with no armour save allowed. Wounds from Instability cannot be regenerated. If a controlling wizard is slain, all Undead units under their control immediately become subject to Instability. Units reduced to 0 models by Instability crumble and are removed. Mummies and other independently animated Undead are immune to Instability.'
  },

  /* ── COMBAT SPECIAL RULES ───────────────────────────────────────────── */

  'Poisoned Attacks': {
    category: 'Combat',
    short: 'All attacks automatically wound on any successful to-hit roll — no Strength roll needed.',
    text: 'All attacks made by this unit (or with the designated poisoned weapon) automatically wound on any successful to-hit roll. No separate Strength vs Toughness roll is made. Armour saves are still taken as normal. If the model has multiple attacks only the specified attacks are poisoned unless otherwise noted. Poisoned attacks still count as magical if the attacker also has Magical Attacks.'
  },

  'Regeneration': {
    category: 'Combat',
    short: 'At the start of each turn, roll D6 for each wound taken that turn; on a 4+ the wound is healed.',
    text: 'At the end of each player turn, a model with Regeneration may roll D6 for each wound it suffered during that turn. On a 4+, that wound is healed and removed. Wounds caused by fire or acid are harder to regenerate — fire wounds heal on 6+ only; wounds from weapons that are wholly fire/acid based cannot be regenerated at all. Armoured Trolls cannot regenerate. Wounds healed by Regeneration are removed before Instability is checked.'
  },

  'Fly': {
    category: 'Combat',
    short: 'Uses flying movement (M×3). Ignores terrain and intervening units; cannot land in impassable terrain.',
    text: 'Flying creatures use a special Fly movement of M×3 instead of their ground movement. They ignore all terrain, obstacles, and intervening units during their move, but must start and end their move in legal positions (cannot land on impassable terrain or inside other units). Flying models may not fly over the heads of enemies in close combat. In close combat a flying creature fights normally. Flying creatures cannot march-move but may charge at full fly distance.'
  },

  'Fast Cavalry': {
    category: 'Combat',
    short: 'May skirmish, freely evade charges, and perform an additional free reform during movement.',
    text: 'Fast Cavalry units are highly mobile mounted troops. They may adopt loose skirmish formation, may evade charges as a free action, and may perform one additional free reformation during their movement phase. Fast Cavalry may also fire missiles while moving at no penalty. When pursuing they always use the mount\'s Movement characteristic. They may not form ordered ranks like regular cavalry but are less restricted in their movement options.'
  },

  'Magical Attacks': {
    category: 'Combat',
    short: 'All attacks count as magical — required to harm ethereal and certain daemonic creatures.',
    text: 'All attacks made by this unit count as magical attacks. This is required to harm Ethereal creatures (wraiths, spirits) and some types of Daemonic or Chaos entities that can only be harmed by magic. Magical attacks also interact with certain spell effects and magic item abilities. A unit with Magical Attacks does not automatically receive any combat bonus — the magical nature only matters for the purpose of wounding creatures immune to mundane weapons.'
  },

  'Fanatics': {
    category: 'Combat',
    short: 'Hidden in a parent unit. When released, spin out dealing automatic hits on everything in their path.',
    text: 'Night Goblin Fanatics are hidden within a Night Goblin infantry unit before the game. When the unit moves to within 8″ of an enemy unit, or when the owning player chooses, the Fanatics are released. Each Fanatic spins out in a random direction, rolling 2D6″ of movement. Everything in their path (friend or foe) suffers an automatic Strength 5 hit with no armour save. After release, Fanatics move randomly each turn — roll D8 for direction, 2D6″ distance. A Fanatic that hits a wall, impassable terrain, or rolls 1–2 is removed.'
  },

  'Ambushers': {
    category: 'Deployment',
    short: 'Deploy after all other units; arrive from unexpected angles during the battle.',
    text: 'Ambushers are not deployed at the start of the game. Instead, they are placed in reserve. From Turn 2 onwards, roll D6 at the start of the owning player\'s turn — on a 4+ the Ambushers may arrive. They are placed anywhere on the table edge (or as specified in the scenario rules) that is not in the enemy deployment zone or within 12″ of an enemy unit. Ambushers that arrive may not charge in the turn they arrive.'
  },

  /* ── DEPLOYMENT & SPECIAL TROOP TYPES ──────────────────────────────── */

  'Scouts': {
    category: 'Deployment',
    short: 'Deploy after all other forces; may be placed anywhere on the table not in the enemy deployment zone.',
    text: 'All Skirmisher rules apply except rules 7 & 8: Scouts may charge normal troops and may stand their ground when charged. Scouts are deployed after all other forces have been placed. They may be positioned anywhere on the table that is not within the enemy deployment zone and not within charge distance of an enemy unit. +5 pts per model (unmodified).',
    catalogueName: 'Scout Rules'
  },

  'Skirmishers': {
    category: 'Special Troop',
    short: 'Loose formation. −1 to hit with missiles. Half terrain penalties. No rank bonuses. Must flee most charges.',
    text: 'Loose formation (within 2″ of at least one other model). −1 to hit with missiles. Half penalties for obstacles and difficult ground. No formation manoeuvres needed. Immune to Unformed. Must run from most charges; may only charge skirmishers, units <¼ their strength, or Unformed/routing units. Same points cost.',
    catalogueName: 'Skirmisher Rules'
  },

  'Berserker Rules': {
    category: 'Special Troop',
    short: 'Auto-Frenzy on first contact. Cannot rout. Must always charge nearest enemy if not in combat.',
    text: 'No armour (shield allowed). Auto-Frenzy on first charge or being charged — permanent for battle. Cannot be pushed back or routed in hand-to-hand. Must always follow up and pursue. If not in combat: must charge nearest enemy (or nearest friendly if none in range). +5 pts per model.'
  },

  'Forester Rules': {
    category: 'Special Troop',
    short: 'No movement penalty in woods. May spend a full turn to set traps in any wood.',
    text: 'No movement penalty in woods (no reserve move within woods). May spend a full turn to set traps in any wood. Each enemy model moving through a trapped wood rolls D6; on 6, takes a Strength 4 hit with no armour save. +2 pts per model.'
  },

  'Falconer Rules': {
    category: 'Special Troop',
    short: 'Hawk attacks as a weapon: Range 24″, BS 5, Str 2 in shooting; 1 extra attack in combat.',
    text: 'Hawk counts as a weapon. Shooting: Range 24″, BS 5, Str 2 (may move and fire same turn). In hand-to-hand: 1 extra hawk attack at WS 5, Str 2 per falconer. +3 pts per model.'
  },

  'Flagellant Rules': {
    category: 'Special Troop',
    short: 'Frenzy, double attacks, no armour. Hate all Chaos units.',
    text: 'Subject to Frenzy. Double normal number of attacks. No armour (shield allowed). Subject to Hatred against all Chaos units. +4 pts per model.'
  },

  'Bombardier Rules': {
    category: 'Special Troop',
    short: 'Supervises one war engine per turn, granting various accuracy or damage bonuses.',
    text: 'Character model leading an engine battery. Supervises one engine per turn: lobbing engines use D20 to hit (deviate reduced by 1–2″); bolt throwers +1 to hit; cannons/organ guns +1 wound; skyrockets reposition ±3″. +20 pts (unmodified).'
  },

  'Assassin Rules': {
    category: 'Special Troop',
    short: 'Hidden in a unit. Immune to casualties while concealed. Duels any enemy model in combat.',
    text: 'Hidden within a unit at game start. Immune to casualties while concealed. Can shoot any front-rank model within 8″. In combat: revealed to duel any single enemy model, taking precedence over all other challenges. +25 pts (unmodified).'
  },

  /* ── CARD TYPE RULES ────────────────────────────────────────────────── */

  'War Altar Rules': {
    category: 'Special Rule',
    short: 'Guards immune to psychology. Friendly units within 12″ gain +1 combat resolution and +2 Ld.',
    text: 'Guards within 6″ immune to psychology. Friendly units within 12″: +1 combat resolution, +2 Ld bonus. If captured, own side must take an immediate Rout test. Base cost: 50 pts.'
  },

  'Animal Handler Rules': {
    category: 'Special Rule',
    short: 'Beasts fight in front. If all handlers die the beasts go wild and head for the nearest table edge.',
    text: 'Beasts positioned in front of handlers. Psychology uses the leader handler\'s profile. Pack may make 1 free manoeuvre per turn. If all handlers die, beasts go wild and move toward nearest table edge. Handlers cannot fight in first round of combat. +5 pts per handler.'
  },

  /* ── RACIAL RULES ───────────────────────────────────────────────────── */

  'Dwarf Racial Rules': {
    category: 'Racial Rules',
    short: 'Hate Goblinoids. No movement penalty for armour. Slayers: immune to Fear / cannot be routed.',
    text: 'Hate all goblinoids (Orcs, Goblins, Hobgoblins, Snotlings). Animosity against friendly Elf units. Troll Slayers: immune to Fear from living creatures. Giant Slayers: immune to Fear and cannot be routed from combat. No movement penalties for armour. See Bestiary: Dwarfs.'
  },

  'Orc & Goblin Racial Rules': {
    category: 'Racial Rules',
    short: 'Animosity between units. Goblins hate Dwarfs & fear Elves. Savage Orcs subject to Frenzy.',
    text: 'Animosity between goblinoid units on the same side. Goblins Hate Dwarfs & Gnomes. Goblins Fear Elf units of more than half their own numeric strength. Savage Orcs subject to Frenzy. Black Orcs: see Black Orc Animosity rule.'
  },

  'Skaven Racial Rules': {
    category: 'Racial Rules',
    short: 'Chaotic alignment. Units may have chaos attributes. Clan specialists have sub-rules.',
    text: 'Chaotic alignment. Units may have D6−3 dominant chaotic attributes; characters D6−4 personal attributes. Clan specialists (Eshin assassins, Moulder beast packs, Pestilens censer bearers, Skryre wind globes) have their own sub-rules. See Bestiary: Skaven.'
  },

  'Undead Racial Rules': {
    category: 'Racial Rules',
    short: 'Cause Fear, immune to psychology, subject to Instability. Skeletons/Zombies stupid without a controlling wizard.',
    text: 'Most Undead: immune to psychology, cause Fear in all living creatures, subject to Instability. Skeletons/Zombies/Undead Horsemen: Stupid unless controlled by a character; cannot be routed. Ghouls: not immune to psychology; always rout if pushed back. Vampires: separate rules — see Bestiary.'
  },

  'Chaos Racial Rules': {
    category: 'Racial Rules',
    short: 'Chaotic alignment. Units may have dominant chaotic attributes. Psychology varies by unit.',
    text: 'Chaotic alignment. Units may have dominant chaotic attributes (Thugs D6−5, Marauders D6−4, Warriors/Beastmen D6−3). Character personal attributes scale with rank up to D6+1 for Lords. Psychology varies by unit — see individual entries.'
  },

  'Dark Elf Racial Rules': {
    category: 'Racial Rules',
    short: 'Hate all other Elf kindreds. Witch Elves frenzied. Characters may have chaotic attributes.',
    text: 'Hate all other Elf kindreds. Witch Elves subject to Frenzy. Dark Elf characters may have up to D6−3 personal chaotic attributes.'
  },

  /* ── BESTIARY — GIANT RACES ─────────────────────────────────────────── */

  'Giant Rules': {
    category: 'Bestiary — Giant Races',
    short: 'Causes Fear (under 10′). Half terrain penalties. May be drunk. Roll special attack table when in combat.',
    text: 'Causes Fear in creatures under 10′. Halves movement penalties for difficult ground; ignores obstacles under 10′. Short-weapon troops suffer −1 to hit. If pushed-back, roll D6: 6 = Giant falls (use Fallen Giant template, D6 Str 5 hits in fall direction). Roll D6 before game: 6 = drunk — each move requires D10 roll determining stagger, fall, or random lurch. See Bestiary: Giant Races for drunk attack table.'
  },

  'Ogre Rules': {
    category: 'Bestiary — Giant Races',
    short: 'Causes Fear (under 10′). −1 enemy armour save. Neutral alignment. Max Level 5 wizard.',
    text: 'Causes Fear in creatures under 10′. −1 to enemy armour saves. Neutral alignment — Ld −1 when fighting for goblinoid armies (no points change). Max Level 5 wizard.'
  },

  'Troll Rules': {
    category: 'Bestiary — Giant Races',
    short: 'Causes Fear, Stupidity, Regeneration (4+). Special attacks: Regurgitate or Thump. −2 enemy armour save.',
    text: 'Causes Fear in creatures under 10′. Subject to Stupidity. Regeneration: at end of each turn, any Troll that took wounds that turn rolls D6 — on 4+ all wounds recovered (fire/acid: 6+ only; wholly fire/acid: no regeneration). 3 attacks (claws/bite or weapons). Special attacks: Regurgitate (Str 5 auto-hit, ignores all armour, D3 wounds — once per battle) or Thump (+2 WS, +2 Str, −3 save, D3 wounds). −2 to enemy armour saves. Armoured Trolls cannot regenerate.'
  },

  'Minotaur Rules': {
    category: 'Bestiary — Giant Races',
    short: 'Causes Fear (under 10′). −1 enemy armour save. Blood-greed after routing enemies.',
    text: 'Causes Fear in creatures under 10′. −1 to enemy armour saves. Blood-greed: when unit routs enemies, test 2D6 vs Cl — fail means unit feeds D6 turns (no pursuit, no free hacks). If charged while feeding: automatic Frenzy. D6−4 chaotic attributes.'
  },

  'Treeman Rules': {
    category: 'Bestiary — Giant Races',
    short: 'Causes Fear (under 10′). Hate Goblinoids. Flammable. Natural save 5–6. −2 enemy armour save. Stomp attacks.',
    text: 'Causes Fear in creatures under 10′. Hate all goblinoids. Flammable. Natural save 5–6. −2 to enemy armour saves. Stomp attacks. May pick up and throw a rock (12″, D6 Str 5 hits, −2 save) instead of moving, or drop it on enemies in combat. No movement penalty in woods; ignores obstacles under 10′. Good alignment.'
  },

  'Troglodyte Rules': {
    category: 'Bestiary — Giant Races',
    short: 'Causes Fear, Stupidity. Immune to Fear/Panic. Nauseating smell: opponents −1 to hit.',
    text: 'Causes Fear in creatures under 10′. Subject to Stupidity. Immune to Fear and Panic (but can be routed). Nauseating smell: hand-to-hand opponents suffer −1 to hit. −1 to enemy armour saves. No Troglodyte wizards.'
  },

  /* ── BESTIARY — UNIT-SPECIFIC ───────────────────────────────────────── */

  'Black Orc Animosity': {
    category: 'Bestiary — Unit Specific',
    short: 'Cannot be led by non-Black Orc commanders. Immune to panic from routing Goblinoids.',
    text: 'Cannot be led by non–Black Orc commanders. Immune to panic from routing Goblinoids. Goblinoids in the same unit still test for animosity normally. Subject to wizard spell substitution.'
  },

  'Savage Orc Frenzy': {
    category: 'Bestiary — Unit Specific',
    short: 'Subject to Frenzy. Count as light armour despite being naked. Fear of war engines.',
    text: 'Subject to Frenzy. Count as light armour for magical protection despite being naked. Fear of chariots and war engines. If struck by a war engine, must take an immediate Rout test.'
  },

  'Rat-Ogre Fear': {
    category: 'Bestiary — Unit Specific',
    short: 'Causes Fear (under 10′). Must be led by an Animal Handler at all times.',
    text: 'Causes Fear in creatures under 10′ tall. Must be led by an Animal Handler at all times. May have chaos attributes.'
  },

  /* ── MOUNT RULES ────────────────────────────────────────────────────── */

  'War Boar Gore': {
    category: 'Mount Rule',
    short: 'Gore on charge (lance bonus, no first-round save). Rider −1 Ld, +2 armour save.',
    text: 'Gore attack on charge: treated as a lance (Strength bonus, no armour save first round). Rider suffers −1 Ld modifier. Rider gains +2 armour save bonus. War Boars may not wear barding.'
  },

  'Ki-rin Magical Attacks': {
    category: 'Mount Rule',
    short: 'All attacks magical. Horn charge grants lance bonus. Save mod −1. War beast.',
    text: 'All attacks are magical. Horn attack on charge grants lance-style bonus. Save modifier −1. War beast.'
  },

  'Pegasus Magical Attacks': {
    category: 'Mount Rule',
    short: 'All attacks magical. 1 stomp attack. Good or Neutral riders only.',
    text: 'All attacks are magical. 1 stomp attack. Riding animal — Neutral or Good alignment characters only.'
  },

  'Temple Dog Rules': {
    category: 'Mount Rule',
    short: 'Magical attacks. Heavy armour save (5–6). Strength 10 on the charge. Save mod −2.',
    text: 'Magical attacks. Heavy armour save (5–6). Strength 10 on the charge. Save modifier −2. War beast.'
  },

  'Unicorn Rules': {
    category: 'Mount Rule',
    short: 'Female Good/Lawful only. Rider immune to magic. Magical attacks. Undead within 12″ suffer instability.',
    text: 'Female Good/Lawful riders only. Rider gains automatic magic save and magic immunity. Rider gains extra save 5–6. Undead within 12″ are subject to instability. Magical attacks. War beast.'
  },

  'Wild Cat Rules': {
    category: 'Mount Rule',
    short: 'Claw and bite. On charge vs lower-Initiative target: attacks doubled (leaping strike).',
    text: 'Claw and bite attacks. On charge: if Wild Cat\'s Initiative exceeds target\'s, attacks are doubled (leaping strike).'
  },

  'Wolf-Rat Rules': {
    category: 'Mount Rule',
    short: 'Fears fire. 1 bite attack.',
    text: 'Fears fire. 1 bite attack.'
  },

  'Cold One Rules': {
    category: 'Mount Rule',
    short: 'Causes Fear (under 10′). −2 enemy armour. Stupidity until first charge. Always pursues. Cold-blooded riders only.',
    text: 'Causes Fear in creatures under 10′. −2 to enemy armour saves. Stench: hand-to-hand opponents −1 to hit. Subject to Stupidity until first charge; must declare charge intention one turn in advance. After first charge: no longer Stupid unless idle 3+ whole turns (then must re-whip into fury). Always pursues routing enemies. Cold-blooded riders only (Lizardmen, Slann) — or Dark Elves with nasal treatment. See Bestiary: Creatures.'
  },

  'Giant Spider Rules': {
    category: 'Mount Rule',
    short: 'Causes Fear (under 10′). Poisoned bite. Natural save 4–6. No movement penalty in woods.',
    text: 'Causes Fear in creatures under 10′. Poisoned bite (+1 Str). −1 to enemy armour saves. Natural save 4–6. Immune to psychology except fire (panics within 4″ of fire). No movement penalty in woods; may climb trees instead of normal move (out of charge reach of <10′ creatures). See Bestiary: Creatures.'
  },

  'Great Eagle Rules': {
    category: 'Mount Rule',
    short: 'Causes Fear (under 10′). 2 claw attacks. −1 enemy armour. Good or Neutral riders only.',
    text: 'Causes Fear in creatures under 10′. 2 claw attacks. −1 to enemy armour saves. Good alignment — Good or Neutral riders only.'
  },

  'Griffon Rules': {
    category: 'Mount Rule',
    short: 'Causes Fear (under 10′). 4 attacks. −3 enemy armour. Random characteristics. May have Chaos attributes.',
    text: 'Causes Fear in creatures under 10′. 3 stomp + bite (4 attacks total). −3 to enemy armour saves. Random characteristics (roll D6 per stat before game). Non-competition: may add D4 Chaos attributes. See Bestiary: Creatures of Chaos.'
  },

  'Hippogriff Rules': {
    category: 'Mount Rule',
    short: 'Causes Fear (under 10′). 4 attacks. −3 enemy armour. Always pursues. Random characteristics.',
    text: 'Causes Fear in creatures under 10′. 3 stomp + bite (4 attacks total). −3 to enemy armour saves. Always pursues routing enemies. Random characteristics (roll D6 per stat before game). Non-competition: may add D4 Chaos attributes. Riding beast — suitable alignment required. See Bestiary: Creatures of Chaos.'
  },

  'Manticore Rules': {
    category: 'Mount Rule',
    short: 'Causes Fear (under 10′). 4 attacks including envenomed tail. −3 enemy armour. Random characteristics.',
    text: 'Causes Fear in creatures under 10′. 3 stomp + envenomed tail attack (+1 Str) = 4 attacks total. −3 to enemy armour saves. Random characteristics (roll D6 per stat before game). Non-competition: may add D4−1 Chaos attributes. See Bestiary: Creatures of Chaos.'
  },

  'Wyvern Rules': {
    category: 'Mount Rule',
    short: 'Causes Fear (under 10′). 3 attacks, each causes D4 wounds. −3 enemy armour. Natural save 5–6.',
    text: 'Causes Fear in creatures under 10′. 2 stomps + bite (3 attacks total); all hits cause D4 wounds. −3 to enemy armour saves. Natural save 5–6. Always pursues routing enemies. Random characteristics (roll D6 per stat before game). Non-competition: may add D4 Chaos attributes. Same alignment as rider required. See Bestiary: Creatures of Chaos.'
  },

  'Dragon Rules': {
    category: 'Mount Rule',
    short: 'Causes Fear +2 (under 10′) / +1 (over). 6 attacks. Breath weapon (roll D6 type). May have magic powers.',
    text: 'Causes Fear +1 in creatures over 10′, +2 in creatures under 10′. 4 stomp + bite (D3 wounds) + tail lash. −3 to enemy armour saves. Breath weapon: roll D6 before game — 1 Fire (18″, 2D6 hits Str 4), 2 Smoke (6″, 2D6 Str 3 no save), 3 Chill (12″, 2D6 auto wounds), 4 Desiccation (12″, 2D6 Str 3 no save), 5 Acid (12″, D6 Str 4 no save), 6 Dragon-bolt (18″, 1 hit Str 10 D10 wounds). Magic powers: roll D6 — 1–2 none, 3–6 Level 1–4. Winged costs +50pts. See Bestiary: Creatures.'
  },

};

/* ═══════════════════════════════════════════════════════════════════
   DERIVED EXPORTS — computed from WFB3_RULES above.
   Do not edit directly; update WFB3_RULES instead.
═══════════════════════════════════════════════════════════════════ */

/** Short tooltip text for army-list card rule tags. */
const WFB3_RULE_DEFS = (function() {
  var defs = {};
  Object.keys(WFB3_RULES).forEach(function(key) {
    var rule = WFB3_RULES[key];
    if (rule.short) defs[key] = rule.short;
  });
  return defs;
})();

/** Full companion reference sheet entries. Uses catalogueName as key where set. */
const WFB3_SPECIAL_RULES_CATALOGUE = (function() {
  var cat = {};
  Object.keys(WFB3_RULES).forEach(function(key) {
    var rule = WFB3_RULES[key];
    if (rule.text) {
      var catKey = rule.catalogueName || key;
      cat[catKey] = { category: rule.category, text: rule.text };
    }
  });
  return cat;
})();

/** Special Troop Type key → catalogue rule name. */
const WFB3_STT_RULE_MAP = {
  scouts:      'Scout Rules',
  skirmishers: 'Skirmisher Rules',
  berserkers:  'Berserker Rules',
  foresters:   'Forester Rules',
  falconers:   'Falconer Rules',
  flagellants: 'Flagellant Rules',
  bombardiers: 'Bombardier Rules',
  assassins:   'Assassin Rules',
  handlers:    'Animal Handler Rules'
};

/* ═══════════════════════════════════════════════════════════════════
   WEAPON RULES
   Shown as a compact print-only reference block on each army-list
   card.  Array entries are matched in order against weapon name
   strings from unit.weapons and selected option names, so more
   specific patterns (Repeating Crossbow) must come before broader
   ones (Crossbow, Bow).
═══════════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════════
   NAME-INFERRED RULES
   Applied automatically in buildSpecialRules based on unit name.
   Each entry: { match: fn(name) → bool, rules: [ruleName, …] }
   More specific entries must come before broader ones.
═══════════════════════════════════════════════════════════════════ */
const WFB3_NAME_RULES = [
  /* Bestiary — Giant Races */
  { match: function(n) { return /\bgiants?\b/i.test(n); },                                           rules: ['Giant Rules'] },
  { match: function(n) { return /\bogres?\b/i.test(n) && !/rat.ogre/i.test(n); },                   rules: ['Ogre Rules'] },
  { match: function(n) { return /\btrolls?\b/i.test(n) && !/slayer/i.test(n); },                    rules: ['Troll Rules'] },
  { match: function(n) { return /\bminotaurs?\b/i.test(n); },                                        rules: ['Minotaur Rules'] },
  { match: function(n) { return /\btreemen?\b/i.test(n); },                                          rules: ['Treeman Rules'] },
  { match: function(n) { return /\btroglodytes?\b/i.test(n); },                                      rules: ['Troglodyte Rules'] },
  /* Bestiary — Unit Specific */
  { match: function(n) { return /\brat.ogre/i.test(n); },                                            rules: ['Rat-Ogre Fear'] },
  { match: function(n) { return /\bblack orc/i.test(n); },                                           rules: ['Black Orc Animosity'] },
  { match: function(n) { return /\bsavage orc/i.test(n); },                                          rules: ['Savage Orc Frenzy'] },
  /* Orcs & Goblins racial — Animosity on all orcs/goblins not covered above */
  { match: function(n) { return /\borc/i.test(n) && !/black orc|savage orc|half.orc/i.test(n); },   rules: ['Animosity'] },
  { match: function(n) { return /\bgoblin|gobbo/i.test(n); },                                        rules: ['Animosity', 'Hatred (Dwarfs & Gnomes)'] },
  { match: function(n) { return /\bsnotling/i.test(n); },                                            rules: ['Animosity'] },
  /* Army-wide catch-alls by unit ID prefix (covers characters + any unlisted units) */
  { match: function(n, id) { return /^un-|^ally-un-/.test(id); },                                                             rules: ['Cause Fear', 'Immune to Psychology'] },
  { match: function(n, id) { return /^dw-|^ally-dw-|^merc-dw-/.test(id); },                                                  rules: ['Hatred (Goblinoids)'] },
  { match: function(n, id) { return /^de-|^ally-de-/.test(id); },                                                             rules: ['Dark Elf Racial Rules'] },
  { match: function(n, id) { return /^sk-|^ally-sk-/.test(id); },                                                             rules: ['Skaven Racial Rules'] },
  { match: function(n, id) { return /^ch-|^ally-chaos/.test(id); },                                                           rules: ['Chaos Racial Rules'] },
  /* O&G catch-all: everything except Black Orcs (Immune to Psychology) and Trolls (own rules) */
  { match: function(n, id) { return /^og-|^ally-og|^merc-or|^merc-hg/.test(id) && !/black.orc|^og-020-trolls/.test(id); },  rules: ['Animosity'] },
  /* Hobgoblins also hate Dwarfs */
  { match: function(n, id) { return /^merc-hg/.test(id); },                                                                   rules: ['Hatred (Dwarfs & Gnomes)'] },
  /* Fimir characters/commanders missing explicit Cause Fear */
  { match: function(n, id) { return /^ally-fi/.test(id); },                                                                   rules: ['Cause Fear'] },
];

const WFB3_WEAPON_RULES = [
  /* ── Missile weapons (stats) ─── */
  { pattern: /repeating crossbow/i,                      name: 'Repeating Crossbow',   rule: 'Range 24″, Str 3. Fires twice per shooting phase.' },
  { pattern: /\bcrossbow/i,                              name: 'Crossbow',              rule: 'Range 30″, Str 4. Cannot move and fire.' },
  { pattern: /long\s*bow/i,                              name: 'Long Bow',              rule: 'Range 30″, Str 3.' },
  { pattern: /short\s*bow/i,                             name: 'Short Bow',             rule: 'Range 12″, Str 2.' },
  { pattern: /\bbow\b/i,                                 name: 'Bow',                   rule: 'Range 24″, Str 3.' },
  { pattern: /\bsling/i,                                 name: 'Sling',                 rule: 'Range 18″, Str 2. Two shots per turn.' },
  { pattern: /\bpistol/i,                                name: 'Pistol',                rule: 'Range 8″, Str 4. May fire in close combat instead of fighting.' },
  { pattern: /blunderbuss/i,                             name: 'Blunderbuss',           rule: 'Range 12″, Str 3. Hits D6 targets in a 45° arc. Cannot move and fire.' },
  { pattern: /arquebus|handgun/i,                        name: 'Arquebus / Handgun',    rule: 'Range 24″, Str 4, −2 armour save. Cannot move and fire. Misfire: natural 1 to hit — roll D6: 1 = weapon destroyed.' },
  { pattern: /\bjavelin/i,                               name: 'Javelin',               rule: 'Range 8″, Str 3. May be thrown on the charge. One volley per turn.' },
  { pattern: /blowpipe/i,                                name: 'Blowpipe',              rule: 'Range 12″, Str 1. Poisoned: wounds automatically on any hit. No armour save.' },
  { pattern: /throwing\s+(knife|knives|star|stars|axe|axes)/i, name: 'Throwing Weapons', rule: 'Range 6″, Str 3, no armour save. May move and fire. One volley per turn.' },
  /* ── Hand-to-hand weapons (rules) ─── */
  { pattern: /\blance/i,                                 name: 'Lance',                 rule: 'Charge: +1 Strength; opponent gets no armour save in first round. Reverts to hand weapon.' },
  { pattern: /\bspear/i,                                 name: 'Spear',                 rule: 'Two ranks may fight. vs charging cavalry: unit fights in normal Initiative order.' },
  { pattern: /\bpike/i,                                  name: 'Pike',                  rule: 'Three ranks fight. Strikes first unless charged. −1 Str from 2nd & 3rd ranks.' },
  { pattern: /\bhalberd/i,                               name: 'Halberd',               rule: '+1 Strength bonus. Strikes in normal Initiative order.' },
  { pattern: /double.handed/i,                           name: 'Double-Handed Weapon',  rule: '+2 Strength. Always strikes last (except first round vs charging cavalry).' },
  { pattern: /\bflail/i,                                 name: 'Flail',                 rule: 'Charge: +2 Strength, no armour save for opponent. Must pursue after combat.' },
  { pattern: /\bnet\b/i,                                 name: 'Net',                   rule: 'Target −1 Attack. Roll D6 each round: 1–2 the net breaks.' },
  { pattern: /additional\s+hand\s+weapon/i,              name: 'Additional Hand Weapon', rule: '+1 Attack. No parry bonus when used.' },
];

/* ═══════════════════════════════════════════════════════════════════
   PER-UNIT SPECIAL RULE TAGS
   Keys match unit IDs in WFB3_UNITS (no "card-" prefix).
   Values are arrays of rule names from WFB3_RULES.
═══════════════════════════════════════════════════════════════════ */
const WFB3_UNIT_RULES = {

  /* ── DARK ELVES ──────────────────────────────────────────────────────── */
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

  /* ── WOOD ELVES ──────────────────────────────────────────────────────── */
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

  /* ── DARK ELVES ─────────────────────────────────────────────────────── */
  // Catch-all id-prefix rule adds Dark Elf Racial Rules to all de- units
  'de-1060-witch-elves':        ['Frenzy', 'Immune to Psychology'],
  'de-025-shadows':             ['Scouts', 'Skirmishers'],
  'de-040-dark-riders':         ['Fast Cavalry'],

  /* ── HIGH ELVES ──────────────────────────────────────────────────────── */
  'he-05-elven-dragonkin':      ['Cause Fear', 'Fly'],
  'he-040-shore-riders':        ['Fast Cavalry'],
  'he-010-sea-elf-wardancers':  ['Immune to Psychology'],
  'he-025-seekers':             ['Scouts', 'Skirmishers'],

  /* ── EMPIRE ──────────────────────────────────────────────────────────── */
  'em-016-fleglers':            ['Flagellant Rules', 'Frenzy'],
  'em-010-bergjaeger':          ['Scouts', 'Skirmishers'],
  'em-030-forstjaeger':         ['Forester Rules', 'Scouts', 'Skirmishers'],

  /* ── BRETONNIA ───────────────────────────────────────────────────────── */
  'br-080-chasseurs-de-la-mort': ['Scouts'],
  'br-020-ribalds':              ['Skirmishers'],

  /* ── NORSE (White Dwarf) ─────────────────────────────────────────────── */
  'wdno-040-berserkers':               ['Berserker Rules'],
  'wdno-060-ulfwerenar':               ['Cause Fear'],
  'wdno-090-norse-dwarf-berserkers':   ['Berserker Rules', 'Hatred (Goblinoids)'],
  'wdno-100-norse-dwarf-troll-slayers':['Frenzy', 'Immune to Psychology', 'Hatred (Goblinoids)'],
  'wdno-110-norse-dwarf-giant-slayers':['Frenzy', 'Immune to Psychology', 'Hatred (Goblinoids)'],

  /* ── CHAOS ───────────────────────────────────────────────────────────── */
  'ch-020-chaos-warrior-horse': ['Cause Fear'],
  'ch-020-chaos-warriors':      ['Cause Fear'],
  'ch-025-minotaurs':           ['Cause Fear', 'Frenzy'],
  'ch-010-trolls':              ['Cause Fear', 'Stupidity', 'Regeneration'],

  /* ── SKAVEN ──────────────────────────────────────────────────────────── */
  'sk-010-night-runners':       ['Scouts', 'Skirmishers'],
  'sk-020-gutter-runners':      ['Scouts', 'Skirmishers'],
  'sk-06-plague-censer-bearers':['Cause Fear', 'Frenzy'],
  'sk-020-plague-monks':        ['Frenzy'],

  /* ── SLANN ───────────────────────────────────────────────────────────── */
  'sl-020-venom-tribes':        ['Poisoned Attacks', 'Skirmishers'],
  'sl-015-scouts':              ['Scouts', 'Skirmishers'],
  'sl-030-jaguar-warriors':     ['Scouts'],
  'sl-05-troglodytes':          ['Cause Fear', 'Stupidity'],
  'sl-030-human-slaves':        ['Stupidity'],

  /* ── ORCS & GOBLINS ──────────────────────────────────────────────────── */
  // Black Orcs: Immune to Psychology and their own Animosity variant — no standard Animosity tag
  'og-030-savage-boyz':         ['Frenzy', 'Animosity'],
  'og-020-savage-arrers':       ['Frenzy', 'Animosity'],
  'og-040-black-orcs':          ['Immune to Psychology'],
  'og-020-trolls':              ['Cause Fear', 'Stupidity', 'Regeneration'],
  'og-03-goblin-fanatics-per-goblin-infantry-u': ['Fanatics', 'Animosity'],

  /* ── DWARFS ──────────────────────────────────────────────────────────── */
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

  /* ── UNDEAD ──────────────────────────────────────────────────────────── */
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

  /* ── ALLIES — CHAOS ──────────────────────────────────────────────────── */
  'ally-chaos-001-chaos-knight':   ['Cause Fear'],
  'ally-chaos-010-chaos-warriors': ['Cause Fear'],
  'ally-chaos-020-minotaurs':      ['Cause Fear', 'Frenzy'],
  'ally-chaos-050-chaos-goblins':  ['Animosity'],
  'ally-chaos-060-cd-berserkers':  ['Berserker Rules'],

  /* ── ALLIES — DARK ELVES ─────────────────────────────────────────────── */
  'ally-de-010-doomdrakes':  ['Stupidity', 'Hatred (High Elves & Wood Elves)'],
  'ally-de-020-doomsteeds':  ['Hatred (High Elves & Wood Elves)'],
  'ally-de-030-warriors':    ['Hatred (High Elves & Wood Elves)'],
  'ally-de-040-witch-elves': ['Frenzy', 'Hatred (High Elves & Wood Elves)'],

  /* ── ALLIES — HIGH ELVES ─────────────────────────────────────────────── */
  'ally-he-010-silver-helms':        ['Fast Cavalry'],
  'ally-he-040-merchant-companies':  ['Skirmishers'],

  /* ── ALLIES — WOOD ELVES ─────────────────────────────────────────────── */
  'ally-we-010-warrior-kinbands': ['Hatred (Goblinoids)'],
  'ally-we-020-lords-bowmen':     ['Hatred (Goblinoids)'],
  'ally-we-030-archers':          ['Hatred (Goblinoids)'],
  'ally-we-040-wardancers':       ['Immune to Psychology', 'Hatred (Goblinoids)'],
  'ally-we-050-glade-runners':    ['Scouts', 'Skirmishers', 'Hatred (Goblinoids)'],

  /* ── ALLIES — FIMIR ──────────────────────────────────────────────────── */
  'ally-fi-010-fianna-fimm':  ['Cause Fear'],
  'ally-fi-020-fimm-warriors':['Cause Fear'],

  /* ── ALLIES — ORCS & GOBLINS ─────────────────────────────────────────── */
  'ally-og-010-biguns':   ['Animosity'],
  'ally-og-020-arrer-boyz':['Animosity'],
  'ally-og-030-boyz':     ['Animosity'],
  'ally-og-040-gobbos':   ['Animosity', 'Hatred (Dwarfs & Gnomes)'],

  /* ── ALLIES — PYGMY ──────────────────────────────────────────────────── */
  'ally-py-040-scouts': ['Scouts', 'Skirmishers'],

  /* ── ALLIES — HALFLING ───────────────────────────────────────────────── */
  'ally-ha-020-scouts': ['Scouts', 'Skirmishers'],

  /* ── ALLIES — SKAVEN ─────────────────────────────────────────────────── */
  'ally-sk-002-assassin':            ['Assassin Rules'],
  'ally-sk-020-gutter-runners':      ['Scouts', 'Skirmishers'],
  'ally-sk-030-plague-censer-bearers':['Cause Fear', 'Frenzy'],
  'ally-sk-040-plague-monks':        ['Frenzy'],

  /* ── ALLIES — UNDEAD ─────────────────────────────────────────────────── */
  'ally-un-010-death-riders':     ['Cause Fear', 'Immune to Psychology'],
  'ally-un-020-skeleton-warriors':['Cause Fear', 'Immune to Psychology'],
  'ally-un-030-grim-reapers':     ['Cause Fear', 'Immune to Psychology'],
  'ally-un-040-zombies':          ['Cause Fear', 'Immune to Psychology'],

  /* ── MERCENARIES — GIANTS & OGRES ───────────────────────────────────── */
  'merc-go-010-giants':          ['Cause Fear'],
  'merc-go-020-ogre-mercenaries':['Cause Fear'],

  /* ── MERCENARIES — HOBGOBLINS ────────────────────────────────────────── */
  'merc-hg-030-hobhound-handlers':['Animal Handler Rules'],

  /* ── MERCENARIES — NIPPON ────────────────────────────────────────────── */
  'merc-ni-002-ninja-assassin': ['Assassin Rules', 'Skirmishers'],

  /* ── MERCENARIES — ORC RENEGADES ─────────────────────────────────────── */
  'merc-or-010-orc-renegades': ['Animosity'],
  'merc-or-020-arrer-boyz':    ['Animosity'],

  /* ── MERCENARIES — NORSE ─────────────────────────────────────────────── */
  'merc-no-020-berserkers':          ['Berserker Rules'],
  'merc-no-030-ulfwerenar':          ['Cause Fear'],
  'merc-no-040-norse-dwarf-berserkers':['Berserker Rules', 'Hatred (Goblinoids)'],
  'merc-no-060-troll-slayers':       ['Frenzy', 'Immune to Psychology', 'Hatred (Goblinoids)'],


};
