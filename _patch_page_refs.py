import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'D:/Tabletop games/Warhammer Fantasy Battle/3rd edition/Wiki Project/wfb3-wiki/index.html'
with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

S = 'color:var(--accent);cursor:pointer;text-decoration:none;border-bottom:1px dotted var(--accent)'

def lnk(text, page, section=None):
    if section:
        return f'<a onclick="navigate(\'{page}\');setTimeout(()=>document.getElementById(\'{section}\')?.scrollIntoView({{behavior:\'smooth\'}}),150)" style="{S}">{text}</a>'
    return f'<a onclick="navigate(\'{page}\')" style="{S}">{text}</a>'

changes = []

# ── Chaos Attributes (p6) ────────────────────────────────────────────────
CA = lnk('Chaos Attributes', 'wa-special-rules', 'wa-sr-chaos-attributes')

changes += [
    # "subject to the provisions on p6" — appears 4 times (Chaos, Skaven, Chaos Ally, DE Ally)
    ('subject to the provisions on p6',
     f'subject to the {CA} provisions'),

    # "subject to the provisions on p6" variant with em-dash chars already handled above,
    # now the Boar Centaur "(see p6)"
    ('generated before the game (see p6)',
     f'generated before the game (see {CA})'),

    # Dark Elf "p6" in two sections (same text in army list and ally section)
    ('chaotic attributes, subject to the provisions on p6',
     f'chaotic attributes, subject to the {CA} provisions'),

    # Jezzail FAQ: "See WA p6 for two-man weapon team rules."
    ('See <strong>WA</strong> p6 for two-man weapon team rules.',
     f'See the {lnk("Army Selection", "wa-army-selection")} section for two-man weapon team rules.'),
]

# ── Magic Items (p13) ────────────────────────────────────────────────────
MI = lnk('Magic Items', 'wa-magic-items')

changes += [
    # With <em> wrapper
    ('on the <em>Magic Items Chart</em> (p13)',
     f'in the {lnk("<em>Magic Items</em>", "wa-magic-items")} section'),

    # Plain text (appears in HE, WE, Empire, Bretonnia)
    ('paying the points indicated on the Magic Items Chart (p13)',
     f'paying the points indicated in the {MI} section'),

    # Variant without "paying the points"
    ('on the Magic Items Chart (p13)',
     f'in the {MI} section'),

    # Magic standards p15
    ('must be chosen and noted down before the game (see p15)',
     f'must be chosen and noted down before the game (see {MI})'),

    # Magic instruments p16
    ('must be chosen and noted down before the game (see p16)',
     f'must be chosen and noted down before the game (see {MI})'),

    # Undead magic weapons p120
    ('must carry a magic weapon (see p120)',
     f'must carry a magic weapon (see {MI})'),

    # Necromancer attribute lists p13
    ('chosen from the attribute lists (p13)',
     f'chosen from the {MI} attribute lists'),
]

# ── Allies Section (p126 / pp126–149 / pp126–162) ────────────────────────
AL = lnk('Allies', 'wa-allies')

changes += [
    # Most common form with <em>
    ('assembled using the <em>Allies Section</em> (p126)',
     f'assembled using the {lnk("<em>Allies</em>", "wa-allies")} section'),

    ('the <em>Allies Section</em> (p126)',
     f'the {lnk("<em>Allies</em>", "wa-allies")} section'),

    # Bretonnia pp126–149
    ('assembled from the <em>Allies Section</em> (pp126–149)',
     f'assembled from the {lnk("<em>Allies</em>", "wa-allies")} section'),

    # O&G plain text pp126–149
    ('assembled using the rules given on pp126–149',
     f'assembled using the {AL} rules'),

    # Chaos plain "the Allies Section (p126)"
    ('assembled using the Allies Section (p126)',
     f'assembled using the {AL} section'),

    # Slann standalone "(p126)"
    ('Pygmy allied contingent (p126)',
     f'Pygmy allied contingent (see {AL})'),
]

# ── Mercenaries Section (p150 / pp150–162) ───────────────────────────────
ME = lnk('Mercenaries', 'wa-mercenaries')

changes += [
    ('the <em>Mercenary Section</em> (p150)',
     f'the {lnk("<em>Mercenaries</em>", "wa-mercenaries")} section'),

    # Bretonnia pp150–162
    ('detailed in the <em>Mercenary Section</em>, pp150–162',
     f'detailed in the {lnk("<em>Mercenaries</em>", "wa-mercenaries")} section'),

    # O&G
    ('assembled using the <em>Mercenaries Section</em> (pp150–162)',
     f'assembled using the {lnk("<em>Mercenaries</em>", "wa-mercenaries")} section'),

    # Chaos plain
    ('assembled using the Mercenary Section (p150)',
     f'assembled using the {ME} section'),
]

# ── Hosts (WFB p241/251/263 and WA/Bestiary p8/p240/p265) ───────────────
HS = lnk('Hosts', 'wa-special-rules', 'wa-sr-hosts')

changes += [
    # wa-sr-hosts section: WFB core refs rewritten as cross-links
    ('Refer to <strong>WFB</strong> p241 for rules concerning the binding and use of a monstrous host.',
     f'See the {HS} section for rules concerning the binding and use of a monstrous host.'),
    ('Refer to <strong>WFB</strong> p251 for rules concerning binding and use of a chaotic host.',
     f'See the {HS} section for rules concerning binding and use of a chaotic host.'),
    ('Refer to <strong>WFB</strong> p263, for rules concerning binding and use of an ethereal host.',
     f'See the {HS} section for rules concerning binding and use of an ethereal host.'),

    # Bretonnia: "guidelines given on p8 of the Warhammer Armies volume"
    ('The host must be assembled subject to the guidelines given on p8 of the <em>Warhammer Armies</em> volume.',
     f'The host must be assembled subject to the {HS} guidelines.'),

    # Empire / Skaven: "rules in the Warhammer Bestiary, p240/263" and "p240/265"
    ('using the rules in the <em>Warhammer Bestiary</em>, p240/263',
     f'using the {HS} rules'),
    ('using the rules in the <em>Warhammer Bestiary</em> on p240/265',
     f'using the {HS} rules'),
]

# ── Magic / Spell Table (p9, p10) ────────────────────────────────────────
MA = lnk('Magic', 'wa-magic')

changes += [
    # Standard/Magic army rule: "(see Magic p9)"
    ('(see <em>Magic</em> p9)',
     f'(see the {MA} section)'),

    # Pre-game checklist: "as described on page 9 and noted down"
    ('randomly determined as described on page 9 and noted down',
     f'randomly determined as described in the {MA} section and noted down'),

    # Spell generation: "from the Spell Table (see p10)"
    ('from the <strong>Spell Table</strong> (see p10)',
     f'from the {lnk("<strong>Spell Table</strong>", "wa-magic")}'),
]

# ── Wizard Record Sheet (p167) ───────────────────────────────────────────
changes += [
    ('This should be done by preparing a <em>Wizard Record Sheet</em> (page 167) for each wizard.',
     'This should be done by keeping a note of each wizard\'s spells, remaining magic points and magic level.'),
]

# ── Berserkers (p96 of WFB) ──────────────────────────────────────────────
changes += [
    ('subject to the special rules for Berserkers on p96 of WFB.',
     f'subject to the {lnk("Berserk special rules", "special-rules-ref")}.'),
]

# ── Retire/withdrawal (p133 of WFB) ─────────────────────────────────────
changes += [
    ('may retire as explained on p133 of <strong>WFB</strong>',
     f'may retire as explained in the {lnk("Movement rules", "bg-turn-movement")}'),
]

# ── Characters leaving units (p93) ───────────────────────────────────────
changes += [
    ('a character may not leave unless already placed in a non-fighting rank during the first round (see p93)',
     'a character may not leave unless already placed in a non-fighting rank during the first round'),
]

# ── Chaos Dwarf war machines (p18–20) — remove bare page citation ────────
changes += [
    ('Chaos Dwarf war machines described in this volume (p18–20)',
     'Chaos Dwarf war machines described in this section'),
]

# ── Apply all ────────────────────────────────────────────────────────────
ok = miss = 0
for old, new in changes:
    count = content.count(old)
    if count:
        content = content.replace(old, new)
        print(f'  OK  ({count}x) {repr(old[:70])}')
        ok += count
    else:
        print(f' MISS      {repr(old[:70])}')
        miss += 1

print(f'\nReplaced {ok} occurrences across {len(changes)} patterns ({miss} misses)')
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done.')
