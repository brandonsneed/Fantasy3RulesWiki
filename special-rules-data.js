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
    short: 'O&G units test against the closest friendly Animosity unit within 12″ (unless enemy in reach, bated enemy in sight, or in combat). Roll D6 − leader Ld bonus ± modifiers. 7+: charges or moves/fires on the friendly unit. 6: fires or moves to within 1″ and jeers — no reserve move. 5−: passes.',
    html: '<p>Test at the start of the turn if a friendly Animosity unit is within 12″ — unless:</p><ul class="wiki-list"><li>Enemy troops are within 12″ or within the unit\'s charge reach</li><li>A <em>bated</em> enemy is within sight</li><li>The unit is already in close combat from a previous animosity result</li></ul><p>Always test against the <em>closest</em> animosity unit only. Roll D6 − leader\'s <strong>Ld</strong> bonus, then add:</p><ul class="wiki-list"><li>+1 if the animosity unit is directly in front and within charge reach</li><li>+1 if the animosity unit is of a different race</li><li>+1 if no enemies are in sight</li></ul><p><strong>7+:</strong> charges the animosity unit if within reach — if not, moves as close as possible and fires missiles; if no missiles, simply moves as close as possible.</p><p><strong>6:</strong> fires missiles if available; if not, moves to within 1″ and exchanges jeers — neither unit may reserve move.</p><p><strong>5−:</strong> unit behaves normally.</p><p>Once in animosity combat, leader models are placed out of the fight. Combat continues until enemy come within 12″, within the fighting unit\'s charge reach, or bated enemy appear in sight. At the end of any round where one side pushes the other back:</p><ul class="wiki-list"><li>Winning side rolls 2D6 vs <strong>Ld</strong> (as a rout test) — if passed, leaders hold their troops back; no follow-up; pushed-back unit takes no rout test; both units freeze</li><li>If combat is ended by intervening enemy: units are not unformed, but auto-rout if pushed back by the fresh enemy</li><li>If a unit routs from animosity combat: it automatically rallies on its first rally test</li></ul>'
  },

  'Cause Fear': {
    category: 'Psychology',
    short: 'Enemies (under 10′ tall) test 2D6 vs Cl: to fire missiles within charge reach (fail = no shot), to charge (fail = frozen for turn), when charged (fail = auto-rout). Pushed back by this unit: auto-rout. Fear Range (if listed): −1 to hit within range; cannot rally; no reserve move into range.',
    text: 'This unit causes Fear in all living enemies under 10′ tall (unless those enemies are themselves Fear-causing or Immune to Psychology). Fear tests (2D6 vs Cl) are required in three situations: (1) a unit wants to fire missiles at this unit while it is within the shooter\'s charge reach — fail means it cannot fire; (2) a unit wants to charge this unit — fail means it cannot move that turn; (3) a unit is charged by this unit — fail means it automatically routs. In addition, any unit pushed back in combat by a Fear-causing unit automatically routs. Creatures over 10′ tall are not affected by Fear from smaller creatures. Some creatures have a Fear Range (e.g. Fear 15″): enemy units within that range suffer −1 to hit in all attacks, cannot rally if routing within range, and may not make reserve moves toward the feared creature.'
  },

  'Frenzy': {
    category: 'Psychology',
    short: 'Test on charge (2D6 vs Cl, inverted: MORE than Cl = frenzied). While frenzied: +1 to hit, +1 to wound, +1 to saves; must follow up and pursue; cannot be routed; ignores all psychology tests. Lasts while in base-to-base contact.',
    text: 'When this unit charges, test 2D6 vs Cl — note the inverted logic: rolling MORE than Cl triggers frenzy; rolling equal to or under Cl means the unit keeps its cool and does not frenzy. While frenzied: +1 to hit, +1 to wound, +1 to all saving throws; must always follow up enemies who are pushed back; must always pursue routing enemies; never takes other psychology tests or Rout tests. Frenzy persists as long as the unit remains in base-to-base contact with the enemy, including during pursuit and free hacks — it is not lost when the unit takes casualties.'
  },

  'Hatred': {
    category: 'Psychology',
    short: 'Must charge/shoot hated enemy if able (Cl test to resist). +1 to hit in hand-to-hand. +1 Ld on rout tests if pushed back by the hated element. Must always pursue routing hated enemy.',
    text: 'Must charge a hated enemy if able, or shoot at them if unable to charge (make a Cl test to resist either compulsion). In hand-to-hand combat against the hated enemy: +1 to hit. If pushed back, +1 Ld bonus on rout tests — only applies if the hated element inflicted sufficient casualties to cause the push-back. Must always pursue a routing hated enemy.'
  },

  'Hatred (High Elves & Wood Elves)': {
    category: 'Psychology',
    short: 'Must charge/shoot High/Wood Elves if able. +1 to hit in first round of combat vs High or Wood Elves.',
    text: 'This unit hates all High Elves and Wood Elves. Must charge/shoot hated enemy if able (Cl test to resist). In combat vs High or Wood Elves: +1 to hit in the first round; +1 Ld on rout tests if pushed back; must always pursue.'
  },

  'Hatred (Goblinoids)': {
    category: 'Psychology',
    short: 'Must charge/shoot Goblinoids if able. +1 to hit in first round of combat vs Goblinoids.',
    text: 'This unit hates all Goblinoids (Orcs, Goblins, Hobgoblins, Snotlings and any similar creatures). Must charge/shoot hated enemy if able (Cl test to resist). In combat vs Goblinoids: +1 to hit in the first round; +1 Ld on rout tests if pushed back; must always pursue.'
  },

  'Hatred (Dwarfs & Gnomes)': {
    category: 'Psychology',
    short: 'Must charge/shoot Dwarfs and Gnomes if able. +1 to hit in first round of combat vs Dwarfs or Gnomes.',
    text: 'This unit hates all Dwarfs and Gnomes. Must charge/shoot hated enemy if able (Cl test to resist). In combat vs Dwarfs or Gnomes: +1 to hit in the first round; +1 Ld on rout tests if pushed back; must always pursue. This is a racial trait of Goblins as noted in the O&G army psychology section.'
  },

  'Stupidity': {
    category: 'Psychology',
    short: 'Test each turn (2D6 vs Cl). Fail in combat: only odd models fight (D6 4+). Fail out of combat: D6 — 1–3 random half-rate move; 4–6 completely inactive. No magic or shooting while stupid.',
    text: 'Test at start of each turn (2D6 vs Cl). In combat: half the models fail to fight — for an odd number of troops, the odd one fights on a D6 result of 4+; characters test individually on the same basis. Out of combat: roll D6 — on 1–3 the unit moves randomly at half rate (roll D12 for direction using a clock face; no penalty for turning); on 4–6 the unit stands completely inactive and does nothing at all. In either case no magic may be used and no missiles may be fired. Stupid units ignore all other psychology tests.'
  },

  'Immune to Psychology': {
    category: 'Psychology',
    short: 'Never tests for Fear, Terror, Hatred, Animosity, Panic, or any other psychological reaction.',
    text: 'This unit is completely immune to all psychological reactions. It never tests for Fear, Terror, Hatred, Animosity, Panic, Stupidity, or any similar mental effect. It cannot be affected by spells or items that cause psychological reactions. Note that being Immune to Psychology does not grant immunity to other effects that happen to mention a psychology rule (e.g. Instability in Undead armies).'
  },

  'Instability': {
    category: 'Psychology',
    short: 'Test when pushed back in combat, within 12″ of a Zone spell, or targeted by Dispel Magic. Roll D6: 1 = loses combat ability; 2 = cannot act; 3–4 = models removed on roll; 5 = extra attacks/movement; 6 = casualties restored.',
    text: 'Test when: (1) the unit is pushed back in combat; (2) the unit begins its turn within 12″ of a wizard using a relevant Zone spell; (3) a Dispel Magic spell is cast at the unit. Roll D6:\n1 — unit cannot cause physical damage but is still affected by weapons and magic normally; paralysis and chill attacks plus psychological effects still work. The effect is permanent — a second Instability result immediately dispels the unit.\n2 — unit may not move, fire missiles or use magic this turn; if in combat attacks at −1 to hit for the remainder of the engagement.\n3 — roll a D6 for each model: on 4–6 the model is removed from play (character models receive a magic save: 2D6 equal to or under WP).\n4 — as result 3 but models are only removed on a 5 or 6.\n5 — unit may strike an extra round of blows, or double its movement, or fire missiles twice; if the enemy\'s turn, these effects apply during the unit\'s next turn.\n6 — any casualties caused this turn are returned to the unit (though still counted for combat results).'
  },

  /* ── COMBAT SPECIAL RULES ───────────────────────────────────────────── */

  'Cause Terror': {
    category: 'Psychology',
    short: 'All living creatures regardless of size must test (2D6 vs Cl) when charged, when they wish to charge, or when they wish to fire missiles within charge reach. Same modifiers as Cause Fear but applies to all creature sizes.',
    text: 'This unit causes Terror in all living creatures regardless of their size. Terror tests (2D6 vs Cl) are required in the same situations as Fear tests (before charging, when charged, and before firing within charge reach) but with no size exemption — even giant creatures are affected. All the same results apply: failed charge test means frozen for the turn, failed counter-charge means automatic rout, failed missile test means the unit cannot fire. Units pushed back in combat by a Terror-causing unit automatically rout. Terror supersedes Fear: a unit that causes Terror also causes Fear for all purposes.'
  },

  'Scaly Skin': {
    category: 'Combat',
    short: 'Natural armour from scales or thick hide. Grants a basic saving throw without encumbrance (6+ for light scales, 5+ for heavy hide). Stacks with worn armour to a maximum of 3+.',
    text: 'The creature\'s natural scales or hide give it a basic saving throw without any encumbrance penalty. The save value varies by creature: Lizardmen and Zoats have 6+ (equivalent to chainmail); Treemen have 5+. This natural save stacks with worn armour in the same way as any other armour combination, subject to the usual 3+ maximum. Unlike normal armour it cannot be stripped away by enemy action or special rules that remove armour.'
  },

  'Poisoned Attacks': {
    category: 'Combat',
    short: 'Each poisoned attack counts as +1 to the attacker\'s Strength for wounding. No effect against undead, ethereal, daemonic, or elemental creatures (attacks still hit at normal Strength).',
    text: 'Each attack made with poison counts as having +1 bonus to the attacker\'s Strength when determining whether a wound is caused — the normal Strength vs Toughness wounding roll is still made, but at the higher effective Strength. Armour saves are taken as normal. Troops may be equipped with poisoned weapons at a cost of 3 points per model; some creatures have natural poisoned attacks as part of their profile (cost already included). If the model has multiple attacks only the specified attacks are poisoned unless otherwise noted.'
  },

  'Regeneration': {
    category: 'Combat',
    short: 'At end of each turn, roll a single D6: on 4+ ALL wounds taken that turn are recovered. Fire/acid: 6+ only. Wholly fire/acid source: no regeneration.',
    text: 'At the end of each player turn, any model with Regeneration that took wounds that turn rolls a single D6. On a result of 4, 5 or 6 the regeneration is successful and all wounds suffered that turn are recovered — it is not a roll per wound, it is one roll that either heals everything or nothing. Wounds caused by fire or acid are harder to regenerate: such wounds require a 6+ to heal. Wounds caused by a weapon or attack that is entirely fire or acid based cannot be regenerated at all. Armoured Trolls cannot regenerate.'
  },

  'Fly': {
    category: 'Combat',
    short: 'Uses aerial movement rules. Has a listed maximum and minimum flight speed, acceleration/deceleration rate, and turning radius. Occupies height levels. May not make a reserve move.',
    text: 'Flying creatures use the aerial movement rules rather than ground movement. Each flying creature\'s profile lists its maximum flight speed, minimum flight speed, acceleration/deceleration rate per turn, and turning radius (equal to its movement distance). Creatures occupy height levels (attack level, +10, +20, +30, +40) and fight at attack level when in combat. A flyer crashing below minimum speed crashes to the ground. Flying creatures may not make a reserve move. When killed in the air a flyer crashes D12″ in a random direction, causing D4 wounds/damage points per height level above ground to itself and anything it lands on (modify by adding the flyer\'s Toughness and deducting the target\'s Toughness for landings on creatures).'
  },

  'Magical Attacks': {
    category: 'Combat',
    short: 'All attacks count as magical — required to harm Ethereal creatures, Daemons, and Elementals, which are immune to non-magical attacks.',
    text: 'All attacks made by this unit count as magical attacks. This is required to harm Ethereal creatures (wraiths, spirits) and some types of Daemonic or Chaos entities that can only be harmed by magic. Magical attacks also interact with certain spell effects and magic item abilities. A unit with Magical Attacks does not automatically receive any combat bonus — the magical nature only matters for the purpose of wounding creatures immune to mundane weapons.'
  },

  'Fanatics': {
    category: 'Combat',
    short: 'Hidden in parent unit. Automatically released when unit comes within 8″ of enemy. Spin 2D6″ causing D6 Str 5 auto-hits (no save) on all in path. Subsequently move 2D6″ on D12 direction each turn. Removed on a double.',
    text: 'Night Goblin Fanatics are hidden within a Night Goblin infantry unit before the game. As soon as the unit comes within 8″ of an enemy unit the Fanatics are automatically and compulsorily released toward the enemy — this happens regardless of which player\'s turn it is. The owning player aims each Fanatic and moves them 2D6″ in the chosen direction. Every unit in their path (friend or foe) suffers D6 automatic Strength 5 hits with no armour save. Skirmishing units may roll D6: on a 5–6 they avoid the fanatic. After release, Fanatics continue to move each turn: roll 2D6″ for distance and a D12 for direction (using a clock face, with 12 o\'clock as the current facing). A Fanatic is removed if it rolls a double for movement distance in any subsequent turn, or moves into a building, wood or other obstacle.'
  },

  'Ambushers': {
    category: 'Deployment',
    short: 'Deploy after all other units; arrive from unexpected angles during the battle.',
    text: 'Ambushers are not deployed at the start of the game. Instead, they are placed in reserve. From Turn 2 onwards, roll D6 at the start of the owning player\'s turn — on a 4+ the Ambushers may arrive. They are placed anywhere on the table edge (or as specified in the scenario rules) that is not in the enemy deployment zone or within 12″ of an enemy unit. Ambushers that arrive may not charge in the turn they arrive.'
  },

  /* ── DEPLOYMENT & SPECIAL TROOP TYPES ──────────────────────────────── */

  'Scouts': {
    category: 'Deployment',
    short: 'All Skirmisher rules but can charge normally and stand when charged. Deploy after all forces, anywhere not in enemy deployment zone or within charge distance of enemy. +5 pts (unmodified).',
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
    short: 'Auto-Frenzy on first charge or being charged (permanent). Cannot be pushed back or routed in hand-to-hand. Must always follow up and pursue. If not in combat: must charge nearest enemy, or nearest friendly unit if no enemies in reach.',
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
    short: 'Guards (within 6″) immune to psychology and rout tests. Friendly units within 12″ gain +1 combat resolution and +2 Ld.',
    text: 'Guards within 6″ are immune to psychology tests and rout tests. All friendly troops within 12″: +1 to hand-to-hand combat resolution score; +2 bonus to Leadership. If captured or desecrated (all guards slain AND enemy in base contact), all friendly troops within 12″ must take an immediate Rout test. May be mounted on a wagon. Base cost: 50 pts.'
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
    text: 'Most Undead: immune to psychology, cause Fear in all living creatures, subject to Instability. Skeletons/Zombies/Undead Horsemen: Stupid unless controlled by a character; cannot be routed. Ghouls: not immune to psychology; always rout if pushed back. Mummies: not immune to psychology; not subject to Instability — they are independently animated and operate under their own rules. Vampires: separate rules — see Bestiary.'
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
    text: 'Causes Fear in creatures under 10′. Halves movement penalties for difficult ground; ignores obstacles under 10′. Short-weapon troops suffer −1 to hit. If pushed-back, roll D6: on a 6 the Giant falls — place the Fallen Giant template; all models under the template suffer a Strength 5 blow and 1 wound. Roll D6 before game: 6 = drunk — each move requires a D10 roll determining stagger, fall, or random lurch. See Bestiary: Giant Races for drunk attack table.'
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
  { pattern: /\blance/i,                                 name: 'Lance',                 rule: 'Charge only: +2 Initiative, +2 Strength; opponent −1 armour save. Reverts to hand weapon from 2nd round.' },
  { pattern: /\bspear/i,                                 name: 'Spear',                 rule: '+1 Initiative in first round. vs. mounted: +2 Initiative if not pushed back (+3 in first round). Every other model in 2nd rank may fight. Can use shield.' },
  { pattern: /\bpike/i,                                  name: 'Pike',                  rule: '+3 Initiative if not pushed back (+6 vs. cavalry). Every other model in 2nd rank, every 3rd in 3rd rank, every 4th in 4th rank may fight. Pushed back: loses all Initiative bonuses, fights single rank. Cannot use shield; movement restricted.' },
  { pattern: /\bhalberd/i,                               name: 'Halberd',               rule: '+1 Strength. +1 Initiative vs. mounted or aerial opponents if not pushed back. Cannot use shield.' },
  { pattern: /double.handed/i,                           name: 'Double-Handed Weapon',  rule: '+1 Strength; opponent −1 armour save. −1 Initiative. Cannot use shield.' },
  { pattern: /\bflail/i,                                 name: 'Flail',                 rule: '+1 Strength. If pushed back: −1 Initiative next round. Cannot charge at full speed. Requires WS 3+.' },
  { pattern: /\bnet\b/i,                                 name: 'Net',                   rule: '+1 armour save. Attackers −1 to hit. Cannot be used with a shield.' },
  { pattern: /additional\s+hand\s+weapon/i,              name: 'Additional Hand Weapon', rule: 'Extra attack: right-hand weapon −1 to hit, left-hand weapon −2 to hit.' },
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
  'de-1060-witch-elves':        ['Frenzy', 'Immune to Psychology', 'Hatred (High Elves & Wood Elves)'],
  'de-025-shadows':             ['Scouts', 'Skirmishers', 'Hatred (High Elves & Wood Elves)'],
  'de-040-dark-riders':         ['Hatred (High Elves & Wood Elves)'],
  'de-020-helldrakes':          ['Stupidity', 'Hatred (High Elves & Wood Elves)'],   // Cold One riders
  'de-030-doomsteeds':          ['Hatred (High Elves & Wood Elves)'],
  'de-040-doomdrakes':          ['Stupidity', 'Hatred (High Elves & Wood Elves)'],   // younger Cold One riders
  'de-08-whelp-masters':        ['Hatred (High Elves & Wood Elves)'],

  /* ── WOOD ELVES ──────────────────────────────────────────────────────── */
  // All Wood Elves hate Goblinoids (army-wide rule)
  'we-020-elven-lords':         ['Hatred (Goblinoids)'],
  'we-040-wood-riders':         ['Hatred (Goblinoids)'],
  'we-04-wain-lords':           ['Hatred (Goblinoids)'],
  'we-020-guards':              ['Hatred (Goblinoids)'],
  'we-040-wardancers':          ['Immune to Psychology', 'Hatred (Goblinoids)'],
  'we-030-lords-bowmen':        ['Hatred (Goblinoids)'],
  'we-030-glade-runners':       ['Scouts', 'Skirmishers', 'Hatred (Goblinoids)'],
  'we-3060-archers':            ['Hatred (Goblinoids)'],
  'we-060-warrior-kinbands':    ['Hatred (Goblinoids)'],
  'we-06-beastmasters':         ['Hatred (Goblinoids)'],
  'we-020-falconers':           ['Hatred (Goblinoids)'],
  'we-08-shapechangers':        ['Cause Fear', 'Hatred (Goblinoids)'],
  'we-03-treemen':              ['Cause Fear', 'Hatred (Goblinoids)'],

  /* ── HIGH ELVES ──────────────────────────────────────────────────────── */
  'he-05-elven-dragonkin':      ['Cause Fear', 'Fly'],
  'he-040-shore-riders':        [],
  'he-010-sea-elf-wardancers':  ['Immune to Psychology'],
  'he-025-seekers':             ['Scouts', 'Skirmishers'],

  /* ── EMPIRE ──────────────────────────────────────────────────────────── */
  'em-016-fleglers':            ['Flagellant Rules', 'Frenzy'],
  'em-010-bergjaeger':          ['Scouts', 'Skirmishers'],
  'em-030-forstjaeger':         ['Forester Rules', 'Scouts', 'Skirmishers'],

  /* ── BRETONNIA ───────────────────────────────────────────────────────── */
  'br-080-chasseurs-de-la-mort': ['Scouts'],
  'br-020-ribalds':              [],

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
  'sk-010-night-runners':       ['Scouts'],
  'sk-020-gutter-runners':      ['Scouts', 'Skirmishers'],
  'sk-06-plague-censer-bearers':['Cause Fear', 'Frenzy'],
  'sk-020-plague-monks':        ['Frenzy'],

  /* ── SLANN ───────────────────────────────────────────────────────────── */
  'sl-020-venom-tribes':        ['Poisoned Attacks'],
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
  'dw-015-mountaineers':        ['Scouts', 'Hatred (Goblinoids)'],

  /* ── UNDEAD ──────────────────────────────────────────────────────────── */
  // Most Undead: Cause Fear + Immune to Psychology (via army catch-all in WFB3_NAME_RULES).
  // Exceptions: Ghouls are NOT immune to psychology (they always rout if pushed back).
  //             Mummies cause Fear (not Terror) and are NOT immune to psychology.
  'un-050-death-riders':        ['Cause Fear', 'Immune to Psychology'],
  'un-04-undead-chariots':      ['Cause Fear', 'Immune to Psychology'],
  'un-20100-skeleton-warriors': ['Cause Fear', 'Immune to Psychology'],
  'un-040-skeleton-archers':    ['Cause Fear', 'Immune to Psychology'],
  'un-040-skeleton-crossbows':  ['Cause Fear', 'Immune to Psychology'],
  'un-1050-grim-reapers':       ['Cause Fear', 'Immune to Psychology'],
  'un-0100-zombies':            ['Cause Fear', 'Immune to Psychology'],
  'un-080-ghouls':              ['Cause Fear'],
  'un-010-mummies':             ['Cause Fear'],
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

/* ═══════════════════════════════════════════════════════════════════════
   WFB3_SKIRMISHER_ELIGIBILITY
   ─────────────────────────────────────────────────────────────────────
   Optional-skirmisher units: may be deployed as skirmishers at the
   player's pre-game discretion ("Skirmishing units must be noted down
   before the battle"). These units do NOT carry the 'Skirmishers' rule
   tag — that is reserved for always-skirmisher units (Scouts etc.).

   Value: maximum number of skirmishing units of this type allowed in
   the army. null = unlimited ("Any"). Conditional qualifiers noted in
   comments.

   Note: skirmishing units are generally capped at 15 models (foot) or
   10 models (mounted) unless the army list specifies otherwise.

   Source: each army's Skirmishers section in the Warhammer Armies list.
═══════════════════════════════════════════════════════════════════════ */
const WFB3_SKIRMISHER_ELIGIBILITY = {

  /* ── DARK ELVES ──────────────────────────────────────────────────────── */
  'de-2060-crossbowmen':           2,

  /* ── WOOD ELVES ──────────────────────────────────────────────────────── */
  'we-040-wood-riders':            1,
  'we-3060-archers':               2,
  'we-030-lords-bowmen':           2,

  /* ── HIGH ELVES ──────────────────────────────────────────────────────── */
  'he-040-shore-riders':           2,
  'he-060-warrior-kindreds':       1,
  'he-050-archers':                1,

  /* ── EMPIRE ──────────────────────────────────────────────────────────── */
  'em-1050-armbrustschutzen':      2,
  'em-020-hakbutschutzen':         2,

  /* ── BRETONNIA ───────────────────────────────────────────────────────── */
  'br-020-arblastiers':            1,
  'br-020-brigands':               1,
  'br-060-rapscallions':           2,

  /* ── ORCS & GOBLINS ──────────────────────────────────────────────────── */
  'og-2060-arrer-boyz':            2,
  'og-20200-gobbos':               2,
  'og-20200-stickas':              2,
  'og-050-gobbo-wulfboyz':         1,   // only if armed with bows

  /* ── DWARFS ──────────────────────────────────────────────────────────── */
  'dw-2060-dwarf-crossbowmen':     1,
  'dw-020-thunderers':             1,

  /* ── SLANN ───────────────────────────────────────────────────────────── */
  'sl-020-venom-tribes':           null,  // Any
  'sl-060-jungle-braves':          null,  // Any

  /* ── NORSE (WD#107) ──────────────────────────────────────────────────── */
  'wdno-030-bondsmen-archers':     null,  // Any
  'wdno-080-bondsdwarfs':          null,  // Any; only if armed with bows

};

/* ═══════════════════════════════════════════════════════════════════
   RULE COSTS
   Points values for special rules used in the custom unit calculator.
   Two tiers:
     official — drawn directly from WA surcharge tables (exact)
     est.     — derived from formula gap analysis (approximate)
   Keys match WFB3_RULES entry names exactly.
═══════════════════════════════════════════════════════════════════ */
const WFB3_RULE_COSTS = {
  // ── Official WA surcharges ───────────────────────────────────────
  'Poisoned Attacks':    { pts: 3,  tier: 'official' },
  'Scouts':              { pts: 5,  tier: 'official' },
  'Forester Rules':      { pts: 2,  tier: 'official' },
  'Falconer Rules':      { pts: 3,  tier: 'official' },
  'Berserker Rules':     { pts: 5,  tier: 'official' },
  'Flagellant Rules':    { pts: 4,  tier: 'official' },
  'Animal Handler Rules':{ pts: 5,  tier: 'official' },
  'Assassin Rules':      { pts: 25, tier: 'official' },
  // ── Derived/estimated creature rules ────────────────────────────
  'Cause Fear':          { pts: 3,  tier: 'est.' },
  'Cause Terror':        { pts: 6,  tier: 'est.' },
  'Regeneration':        { pts: 5,  tier: 'est.' },
  'Scaly Skin':          { pts: 4,  tier: 'est.' },
  'Immune to Psychology':{ pts: 2,  tier: 'est.' },
  'Fly':                 { pts: 5,  tier: 'est.' },
  'Magical Attacks':     { pts: 2,  tier: 'est.' },
  'Frenzy':              { pts: 3,  tier: 'est.' },
  'Hatred':              { pts: 1,  tier: 'est.' },
  'Hatred (Goblinoids)': { pts: 1,  tier: 'est.' },
  'Hatred (Dwarfs & Gnomes)': { pts: 1, tier: 'est.' },
  'Hatred (High Elves & Wood Elves)': { pts: 1, tier: 'est.' },
  // ── Drawbacks (negative pts) ────────────────────────────────────
  'Stupidity':           { pts: -2, tier: 'est.' },
  'Instability':         { pts: -2, tier: 'est.' },
  'Animosity':           { pts: -1, tier: 'est.' },
};

/* ═══════════════════════════════════════════════════════════════════
   RACE RULES
   Maps each race's dropdown display name to the special rules that
   are intrinsic to that race, sourced from their Bestiary entries.
   Used by unit-card.html to auto-populate the companion reference
   sheet when a race is selected.
   Keys match the option text in the f-race dropdown exactly.
═══════════════════════════════════════════════════════════════════ */
const WFB3_RACE_RULES = {
  // ── Intelligent Races — Bestiary ────────────────────────────────
  'Goblin':         ['Animosity', 'Hatred (Dwarfs & Gnomes)'],
  'Pygmy':          [],
  'Halfling':       [],
  'Skaven':         ['Skaven Racial Rules'],
  'Human':          [],
  'Gnome':          [],
  'Hobgoblin':      ['Animosity', 'Hatred (Dwarfs & Gnomes)'],
  'Half-Orc':       ['Animosity'],
  'Orc':            ['Animosity'],
  'Savage Orc':     ['Savage Orc Frenzy', 'Animosity'],
  'Chaos Thug':     ['Chaos Racial Rules'],
  'Black Orc':      ['Black Orc Animosity', 'Immune to Psychology'],
  'Slann':          [],
  'Dwarf':          ['Dwarf Racial Rules', 'Hatred (Goblinoids)'],
  'Norse Dwarf':    ['Dwarf Racial Rules', 'Hatred (Goblinoids)'],
  'Chaos Dwarf':    ['Dwarf Racial Rules', 'Hatred (Goblinoids)'],
  'Elf':            [],
  'Dark Elf':       ['Dark Elf Racial Rules'],
  'Wood Elf':       [],
  'High Elf':       [],
  'Fimir-Shearl':   [],
  'Beastman':       ['Chaos Racial Rules'],
  'Were':           ['Cause Fear'],
  'Lizardman':      ['Immune to Psychology', 'Scaly Skin'],
  'Centaur':        ['Hatred (Goblinoids)'],
  'Fimir-Fimm':     ['Stupidity'],
  'Coatl':          ['Cause Fear', 'Fly', 'Poisoned Attacks'],
  'Chaos Marauder': ['Chaos Racial Rules'],
  'Zoat':           ['Scaly Skin'],
  'Chaos Warrior':  ['Chaos Racial Rules', 'Immune to Psychology'],
  // ── Named race overrides ────────────────────────────────────────
  'Skeleton':        ['Undead Racial Rules'],
  'Slann Levy':      [],
  'Human Slave':     [],
  'Zombie':          ['Undead Racial Rules'],
  'Ghoul':           ['Cause Fear', 'Poisoned Attacks'],
  'Mummy':           ['Cause Terror', 'Undead Racial Rules'],
  'Undead Horseman': ['Undead Racial Rules'],
  // ── Giant Races ─────────────────────────────────────────────────
  'Giant':           ['Giant Rules', 'Cause Fear'],
  'Ogre':            ['Ogre Rules', 'Cause Fear'],
  'Troll':           ['Troll Rules', 'Cause Fear', 'Stupidity', 'Regeneration'],
  'Minotaur':        ['Minotaur Rules', 'Cause Fear'],
  'Treeman':         ['Treeman Rules', 'Cause Fear', 'Scaly Skin', 'Hatred (Goblinoids)'],
  'Troglodyte':      ['Troglodyte Rules', 'Cause Fear', 'Stupidity', 'Immune to Psychology'],
};
