"""
Extract character data from WFB3 wiki army list pages.
Appends character unit entries to units-data.js.
"""

import re
import json

html_path = 'index.html'
js_path = 'units-data.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# ──────────────────────────────────────────────
# HTML utilities
# ──────────────────────────────────────────────

def get_section(src, section_id):
    """Find a <div id="section_id">...</div> block (handles nesting)."""
    pattern = 'id="' + section_id + '"'
    idx = src.find(pattern)
    if idx == -1:
        return None
    tag_start = src.rfind('<', 0, idx)
    depth = 0
    i = tag_start
    while i < len(src):
        if src[i:i+4] == '<div':
            depth += 1
            i += 4
        elif src[i:i+6] == '</div>':
            depth -= 1
            if depth == 0:
                return src[tag_start:i+6]
            i += 6
        else:
            i += 1
    return None

def get_chunk_after_id(src, elem_id):
    """Return HTML from the element with elem_id up to (not including) the next <h4.
    Works for <h4 id="..."> sub-section markers that are NOT <div> elements."""
    pattern = 'id="' + elem_id + '"'
    idx = src.find(pattern)
    if idx == -1:
        return None
    next_h4 = src.find('<h4', idx + len(pattern))
    if next_h4 == -1:
        return src[idx:]
    return src[idx:next_h4]

def strip_tags(s):
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'&amp;', '&', s)
    s = re.sub(r'&lt;', '<', s)
    s = re.sub(r'&gt;', '>', s)
    s = re.sub(r'&nbsp;', ' ', s)
    s = re.sub(r'&#\d+;', '', s)
    s = re.sub(r'&[a-z]+;', '', s)
    return s.strip()

def parse_table_rows(table_html):
    rows = []
    for rm in re.finditer(r'<tr([^>]*)>(.*?)</tr>', table_html, re.DOTALL):
        attrs, row_body = rm.group(1), rm.group(2)
        if 'height:6px' in attrs:
            continue
        is_div = 'compact-divider' in attrs
        cells = [strip_tags(cm.group(1))
                 for cm in re.finditer(r'<t[dh][^>]*>(.*?)</t[dh]>', row_body, re.DOTALL)]
        if cells:
            rows.append((is_div, cells))
    return rows

def slugify(name):
    name = name.lower()
    name = re.sub(r"['\u2019\u2018]", '', name)
    name = re.sub(r'[^a-z0-9]+', '-', name)
    return name.strip('-')

# ──────────────────────────────────────────────
# Name singularization
# ──────────────────────────────────────────────

def singularize_word(w):
    """Singularize a single English word. Handles common WFB3 name endings."""
    wl = w.lower()
    # Don't singularize: already singular or irregular (ss, is, us, as, ous, ix)
    if re.search(r'(ss|is|us|as|ous|ix)$', wl):
        return w
    # Irregular: -men -> -man  (Lizardmen->Lizardman, Beastmen->Beastman)
    if wl.endswith('men') and len(w) > 3:
        return w[:-3] + 'man'
    # -ies -> -y  (Armies->Army, Sorceries->Sorcery)
    if wl.endswith('ies') and len(w) > 3:
        return w[:-3] + 'y'
    # -es with sibilant/vowel+o stem: remove 'es'
    if wl.endswith('es') and len(w) > 3:
        stem = w[:-2]
        if re.search(r'(sh|ch|x|z|o)$', stem.lower()):
            return stem          # Witches->Witch, Heroes->Hero
        return w[:-1]            # all other -es: just drop 's'
    # Simple -s plural: drop the 's'
    if wl.endswith('s') and len(w) > 2:
        return w[:-1]
    return w

def singularize(name):
    """Singularize a character name.
    'X of Y' -> singularize the last word of X only.
    Plain name  -> singularize the last word."""
    m = re.match(r'^(.+?)\s+of\s+(.+)$', name, re.I)
    if m:
        prefix_words = m.group(1).split()
        prefix_words[-1] = singularize_word(prefix_words[-1])
        return ' '.join(prefix_words) + ' of ' + m.group(2)
    words = name.split()
    if words:
        words[-1] = singularize_word(words[-1])
    return ' '.join(words)

# ──────────────────────────────────────────────
# Character group label
# ──────────────────────────────────────────────

# Words in a group name that already imply the charType (so we don't append it again)
_TYPE_SYNONYMS = {
    'hero':     ['hero', 'heroes', 'lord'],
    'wizard':   ['wizard', 'sorcerer', 'shaman', 'mage', 'warlock', 'druid'],
    'assassin': ['assassin'],
    'slayer':   ['slayer'],
    'gnome':    ['gnome'],
    'liche':    ['liche', 'lich'],
    'vampire':  ['vampire'],
}

def compute_char_group_label(group, ctype):
    """Return a display label for a character group (used in the browser).
    group: compact-divider section name from HTML (may be empty string)
    ctype: charType string ('hero', 'wizard', 'assassin', ...)
    Examples:
      ('',                 'hero')    -> 'Hero'
      ('Beastman Shamans', 'wizard')  -> 'Beastman Shaman'
      ('Slann',            'hero')    -> 'Slann Hero'
      ('Lizardmen',        'hero')    -> 'Lizardman Hero'
      ('Dwarven Slayers',  'slayer')  -> 'Dwarven Slayer'
      ('Assassins',        'assassin')-> 'Assassin'
    """
    if not group or group.lower().rstrip('s') in ('assassin',):
        return ctype.capitalize()
    # Singularize the group name (last word, or word before 'of')
    g_sing = singularize(group)
    g_lower = g_sing.lower()
    # Check whether the singularized group name already implies the charType
    synonyms = _TYPE_SYNONYMS.get(ctype, [ctype])
    if any(syn in g_lower for syn in synonyms):
        return g_sing
    # Append the charType
    return g_sing + ' ' + ctype.capitalize()

# ──────────────────────────────────────────────
# Equipment table parser
# ──────────────────────────────────────────────

def try_cost(s):
    return bool(re.match(r'^[+\-]?\d', s.replace('\u2013','').replace('\u2212','')))

def parse_equipment_table(equip_html):
    """Flatten all name+cost pairs from a 4-column equipment table.
    Handles both compact-divider headers (Dark Elves) and <strong> headers
    (Dwarfs, O&G, Undead, etc.). Returns a single 'Equipment' option group."""
    if not equip_html:
        return []
    rows = parse_table_rows(equip_html)
    items = []
    for is_div, cells in rows:
        n = len(cells)
        if is_div:
            # Special case: DE-style row "Armour | Dragon 3 | 450"
            # (compact-divider with right-side item due to colspan)
            if n == 3 and not try_cost(cells[1]) and try_cost(cells[2]):
                items.append({'name': cells[1], 'cost': cells[2]})
            continue
        # Left pair
        if n >= 2:
            lname, lcost = cells[0], cells[1]
            if lname and try_cost(lcost):
                items.append({'name': lname, 'cost': lcost})
        # Right pair
        if n >= 4:
            rname, rcost = cells[2], cells[3]
            if rname and try_cost(rcost):
                items.append({'name': rname, 'cost': rcost})
    if not items:
        return []
    return [{'subheading': 'Equipment', 'items': items}]

def magic_opts(is_wizard):
    items = [
        {'name': 'A Magic Weapon',          'cost': '25'},
        {'name': 'A Magic Standard (army)', 'cost': '50'},
        {'name': 'A Magic Armour',          'cost': '0'},
    ]
    if is_wizard:
        items += [
            {'name': 'A Magic Scroll', 'cost': '25'},
            {'name': 'A Magic Ring',   'cost': '50'},
        ]
    return {'subheading': 'Magic Items', 'items': items}

def make_options(base, is_wizard):
    return [{'subheading': g['subheading'], 'items': list(g['items'])} for g in base] + [magic_opts(is_wizard)]

# ──────────────────────────────────────────────
# Level profile table parser
# ──────────────────────────────────────────────

def parse_level_profiles(profile_html):
    """Parse a character profile table where rows are labelled 'N Hero', 'N Wizard', etc.
    Returns dict keyed by label, value = {'stats': [...], 'pts': float}."""
    result = {}
    if not profile_html:
        return result
    for is_div, cells in parse_table_rows(profile_html):
        if len(cells) < 14:
            continue
        label = cells[0]
        if not re.match(r'\d+\s+(Hero|Wizard|Assassin|Shaman)', label, re.I):
            continue
        stats = list(cells[1:13])
        try:
            pts = float(cells[13].replace('*','').replace('\xbd','.5'))
        except ValueError:
            pts = 0.0
        result[label] = {'stats': stats, 'pts': pts}
    return result

# ──────────────────────────────────────────────
# Availability table parser
# ──────────────────────────────────────────────

def parse_avail_table(section_html, default_ctype):
    """Parse an availability table with rows like:
    '6 Deathshades (level 5 heroes)' | 48
    Returns list of dicts with max, name, level, pts, charType, group."""
    entries = []
    cur_div = None
    for is_div, cells in parse_table_rows(section_html):
        if is_div:
            cur_div = cells[0] if cells else ''
            continue
        if len(cells) < 2:
            continue
        avail, pts_s = cells[0], cells[1]
        try:
            pts = int(pts_s)
        except ValueError:
            continue
        # Match: "6 Deathshades (level 5 heroes)" or "1 Wizendamn (level 25 wizard)"
        m = re.match(r'(\d+)\s+(.+?)\s*\(level\s+(\d+)(?:\s+([\w\-]+))?\)', avail, re.I)
        if not m:
            continue
        max_n = int(m.group(1))
        name  = m.group(2).strip()
        level = int(m.group(3))
        type_w = m.group(4).lower() if m.group(4) else ''
        if 'assassin' in type_w:
            ctype = 'assassin'
        elif 'wizard' in type_w or 'shaman' in type_w:
            ctype = 'wizard'
        elif cur_div and 'assassin' in cur_div.lower():
            ctype = 'assassin'
        else:
            ctype = default_ctype
        entries.append({'max': max_n, 'name': name, 'level': level,
                        'pts': pts, 'charType': ctype, 'group': cur_div or ''})
    return entries

# ──────────────────────────────────────────────
# Character unit builder
# ──────────────────────────────────────────────

def make_char(uid, army, ctype, level, char_max, name, prof_label, race_group,
              stats, pts, options, char_group_label=None):
    return {
        'id':             uid,
        'army':           army,
        'type':           'character',
        'charType':       ctype,
        'charGroupLabel': char_group_label or ctype.capitalize(),
        'level':          level,
        'charMax':        char_max,
        'allowance':      '1',
        'name':           name,
        'profiles':       [{'label': prof_label, 'stats': stats, 'raceGroup': race_group}],
        'profileNote':    None,
        'profileD6':      False,
        'art':            None,
        'ptsPerModel':    pts,
        'ptsFixed':       None,
        'models':         '1',
        'weapons':        'Hand Weapon',
        'armour':         None,
        'options':        options,
        'machineStats':   None,
        'chariot':        None,
        'packs':          None,
        'aggregateTable': None,
        'flavour':        None,
    }

# ──────────────────────────────────────────────
# Standard army extractor
# ──────────────────────────────────────────────

def extract_standard(army, prefix, id_pfx):
    sec = get_section(html, prefix + '-characters')
    if not sec:
        print('    [WARN] section not found: ' + prefix + '-characters')
        return []
    level_profiles = parse_level_profiles(get_chunk_after_id(sec, prefix + '-char-profiles'))
    heroes_chunk  = get_chunk_after_id(sec, prefix + '-char-heroes')
    wizards_chunk = get_chunk_after_id(sec, prefix + '-char-wizards')
    equip_chunk   = get_chunk_after_id(sec, prefix + '-char-equipment')
    base_opts = parse_equipment_table(equip_chunk)
    all_avail = []
    if heroes_chunk:
        all_avail += parse_avail_table(heroes_chunk, 'hero')
    else:
        print('    [WARN] heroes chunk not found: ' + prefix + '-char-heroes')
    if wizards_chunk:
        all_avail += parse_avail_table(wizards_chunk, 'wizard')
    else:
        print('    [WARN] wizards chunk not found: ' + prefix + '-char-wizards')
    units = []
    for e in all_avail:
        lvl, ctype, pts, maxn = e['level'], e['charType'], e['pts'], e['max']
        group = e.get('group', '') or ''
        name  = singularize(e['name'])
        if ctype == 'assassin':
            pkey = str(lvl) + ' Assassin'
        elif ctype == 'wizard':
            pkey = str(lvl) + ' Wizard'
        else:
            pkey = str(lvl) + ' Hero'
        pd = level_profiles.get(pkey) or level_profiles.get(str(lvl) + ' Hero')
        stats = pd['stats'] if pd else ['?'] * 12
        # Include group slug in ID to disambiguate (e.g. Chaos has two wizard groups
        # where both level-5 entries are named "Initiate" after singularization).
        # Skip 'Assassins' group since that's already reflected in ctype.
        grp_slug = slugify(group) if group and group.lower() not in ('assassins',) else ''
        id_parts = [id_pfx, 'char', ctype, str(lvl)] + ([grp_slug] if grp_slug else []) + [slugify(name)]
        uid = '-'.join(id_parts)
        grp_label = compute_char_group_label(group, ctype)
        units.append(make_char(uid, army, ctype, lvl, maxn, name, pkey, None, stats, pts,
                               make_options(base_opts, ctype == 'wizard'),
                               char_group_label=grp_label))
    return units

# ──────────────────────────────────────────────
# O&G multi-race extractor
# ──────────────────────────────────────────────

def extract_og():
    army, prefix, id_pfx = 'orcs-goblins', 'wa-og', 'og'
    sec = get_section(html, prefix + '-characters')
    if not sec:
        return []
    race_stats = {}
    psec = get_chunk_after_id(sec, prefix + '-char-profiles')
    if psec:
        for is_div, cells in parse_table_rows(psec):
            if len(cells) >= 13:
                r = cells[0]
                if r in ('Goblin', 'Half-Orc', 'Orc', 'Savage Orc', 'Black Orc'):
                    race_stats[r] = list(cells[1:13])
    equip_chunk = get_chunk_after_id(sec, prefix + '-char-equipment')
    base_opts = parse_equipment_table(equip_chunk)
    # Column order in heroes/wizards table: Orc | Half Orc | Goblin | Black Orc | Savage Orc
    races     = ['Orc', 'Half-Orc', 'Goblin', 'Black Orc', 'Savage Orc']
    race_slugs = {'Orc':'orc','Half-Orc':'half-orc','Goblin':'goblin',
                  'Black Orc':'black-orc','Savage Orc':'savage-orc'}
    units = []
    for chunk, ctype in [(get_chunk_after_id(sec, prefix + '-char-heroes'), 'hero'),
                         (get_chunk_after_id(sec, prefix + '-char-wizards'), 'wizard')]:
        if not chunk:
            continue
        for is_div, cells in parse_table_rows(chunk):
            if is_div or len(cells) < 2:
                continue
            m = re.match(r'(\d+)\s+level\s+(\d+)\s+(heroes?|wizards?|shamans?)', cells[0], re.I)
            if not m:
                continue
            maxn  = int(m.group(1))
            level = int(m.group(2))
            pts_cols = cells[1:]
            for i, race in enumerate(races):
                if i >= len(pts_cols):
                    continue
                try:
                    pts = int(pts_cols[i])
                except ValueError:
                    continue
                rslug     = race_slugs[race]
                uid       = id_pfx + '-char-' + ctype + '-' + rslug + '-' + str(level)
                stats     = race_stats.get(race, ['?'] * 12)
                label     = race + ' (base)'
                name      = race + ' Level ' + str(level) + ' ' + ctype.title()
                grp_label = race + ' ' + ctype.title()
                units.append(make_char(uid, army, ctype, level, maxn, name, label, race, stats, pts,
                                       make_options(base_opts, ctype == 'wizard'),
                                       char_group_label=grp_label))
    return units

# ──────────────────────────────────────────────
# Dwarfs multi-section extractor
# ──────────────────────────────────────────────

def extract_dwarfs():
    army, prefix, id_pfx = 'dwarfs', 'wa-dw', 'dw'
    sec = get_section(html, prefix + '-characters')
    if not sec:
        return []
    race_stats = {}
    psec = get_chunk_after_id(sec, prefix + '-char-profiles')
    if psec:
        for is_div, cells in parse_table_rows(psec):
            if len(cells) >= 13:
                r = cells[0]
                if r in ('Dwarf', 'Gnome'):
                    race_stats[r] = list(cells[1:13])
    equip_chunk = get_chunk_after_id(sec, prefix + '-char-equipment')
    base_opts = parse_equipment_table(equip_chunk)
    units = []
    cur_div = None
    hsec = get_chunk_after_id(sec, prefix + '-char-heroes')
    if hsec:
        for is_div, cells in parse_table_rows(hsec):
            if is_div:
                cur_div = cells[0] if cells else ''
                continue
            if len(cells) < 2:
                continue
            try:
                pts = int(cells[1])
            except ValueError:
                continue
            m = re.match(r'(\d+)\s+(.+?)\s*\(level\s+(\d+)\)', cells[0], re.I)
            if not m:
                continue
            maxn  = int(m.group(1))
            name  = singularize(m.group(2).strip())
            level = int(m.group(3))
            if cur_div and 'slayer' in cur_div.lower():
                ctype     = 'slayer'
                race      = 'Dwarf'
                grp_label = singularize(cur_div)   # "Dwarven Slayer"
            elif cur_div and 'gnome' in cur_div.lower():
                ctype     = 'gnome'
                race      = 'Gnome'
                grp_label = singularize(cur_div)   # "Gnome"
            else:
                ctype     = 'hero'
                race      = 'Dwarf'
                grp_label = 'Hero'
            stats = race_stats.get(race, ['?'] * 12)
            uid   = id_pfx + '-char-' + ctype + '-' + str(level) + '-' + slugify(name)
            label = race + ' (base)'
            units.append(make_char(uid, army, ctype, level, maxn, name, label, race, stats, pts,
                                   make_options(base_opts, False),
                                   char_group_label=grp_label))
    wsec = get_chunk_after_id(sec, prefix + '-char-wizards')
    if wsec:
        for is_div, cells in parse_table_rows(wsec):
            if is_div or len(cells) < 2:
                continue
            try:
                pts = int(cells[1])
            except ValueError:
                continue
            m = re.match(r'(\d+)\s+(.+?)\s*\(level\s+(\d+)\)', cells[0], re.I)
            if not m:
                continue
            maxn  = int(m.group(1))
            name  = singularize(m.group(2).strip())
            level = int(m.group(3))
            stats = race_stats.get('Dwarf', ['?'] * 12)
            uid   = id_pfx + '-char-wizard-' + str(level) + '-' + slugify(name)
            units.append(make_char(uid, army, 'wizard', level, maxn, name, 'Dwarf (base)',
                                   'Dwarf', stats, pts, make_options(base_opts, True),
                                   char_group_label='Wizard'))
    return units

# ──────────────────────────────────────────────
# Undead special extractor
# ──────────────────────────────────────────────

def extract_undead():
    army, prefix, id_pfx = 'undead', 'wa-un', 'un'
    sec = get_section(html, prefix + '-characters')
    if not sec:
        return []
    # Profile table: Race | 12 stats | pts5 | pts10 | pts15 | pts20 | pts25  (18 cols)
    race_data = {}
    psec = get_chunk_after_id(sec, prefix + '-char-profiles')
    if psec:
        for is_div, cells in parse_table_rows(psec):
            if len(cells) >= 18:
                race = cells[0]
                stats = list(cells[1:13])
                pbl = {}
                for i, lvl in enumerate([5, 10, 15, 20, 25]):
                    try:
                        pbl[lvl] = int(cells[13 + i])
                    except (ValueError, IndexError):
                        pass
                race_data[race] = {'stats': stats, 'pts_by_level': pbl}
    equip_chunk = get_chunk_after_id(sec, prefix + '-char-equipment')
    base_opts = parse_equipment_table(equip_chunk)
    units = []

    # Heroes
    hsec = get_chunk_after_id(sec, prefix + '-char-heroes')
    if hsec:
        hero_stats = race_data.get('Undead Heroes', {}).get('stats', ['?'] * 12)
        for is_div, cells in parse_table_rows(hsec):
            if is_div or len(cells) < 2:
                continue
            try:
                pts = int(cells[1])
            except ValueError:
                continue
            m = re.match(r'(\d+)\s+(.+?)\s*\(level\s+(\d+)\)', cells[0], re.I)
            if not m:
                continue
            maxn  = int(m.group(1))
            name  = singularize(m.group(2).strip())
            level = int(m.group(3))
            uid = id_pfx + '-char-hero-' + str(level) + '-' + slugify(name)
            units.append(make_char(uid, army, 'hero', level, maxn, name, 'Undead Hero',
                                   'Undead Hero', hero_stats, pts,
                                   make_options(base_opts, False),
                                   char_group_label='Hero'))

    # Wizards: two tables (pts table + names table) between wa-un-char-wizards and next <h4
    wsec = get_chunk_after_id(sec, prefix + '-char-wizards')
    if wsec:
        all_tables = re.findall(r'<table[^>]*>(.*?)</table>', wsec, re.DOTALL)
        pts_by_level   = {}
        names_by_level = {}
        wtypes = ['Evil Sorcerer', 'Liche', 'Vampire']
        for tbl in all_tables:
            rows = parse_table_rows(tbl)
            # Only rows whose first cell looks like "N level N ..." or "level N"
            data_rows = [r for r in rows
                         if not r[0] and len(r[1]) >= 4
                         and re.match(r'(?:\d+\s+)?level\s+\d+', r[1][0], re.I)]
            if not data_rows:
                continue
            try:
                int(data_rows[0][1][1])
                is_pts = True
            except (ValueError, IndexError):
                is_pts = False
            for _, cells in data_rows:
                m = re.match(r'(?:\d+\s+)?level\s+(\d+)', cells[0], re.I)
                if not m:
                    continue
                level = int(m.group(1))
                for j, wt in enumerate(wtypes):
                    val = cells[j + 1] if j + 1 < len(cells) else ''
                    if is_pts:
                        try:
                            pts_by_level.setdefault(level, {})[wt] = int(val)
                        except ValueError:
                            pass
                    else:
                        names_by_level.setdefault(level, {})[wt] = val.strip()
        profile_key = {'Evil Sorcerer': 'Necromancers', 'Liche': 'Liches', 'Vampire': 'Vampires'}
        wtype_ctype  = {'Evil Sorcerer': 'wizard', 'Liche': 'liche', 'Vampire': 'vampire'}
        wtype_slug   = {'Evil Sorcerer': 'necromancer', 'Liche': 'liche', 'Vampire': 'vampire'}
        for level in sorted(pts_by_level.keys()):
            for wt in wtypes:
                pts = pts_by_level[level].get(wt)
                if pts is None:
                    continue
                raw_name = names_by_level.get(level, {}).get(wt, wt + ' Level ' + str(level))
                name     = singularize(raw_name)
                rd       = race_data.get(profile_key.get(wt, wt), {})
                stats    = rd.get('stats', ['?'] * 12)
                ctype    = wtype_ctype[wt]
                uid      = id_pfx + '-char-' + wtype_slug[wt] + '-' + str(level) + '-' + slugify(name)
                units.append(make_char(uid, army, ctype, level,
                                       2 if level < 25 else 1,
                                       name, wt, wt, stats, pts,
                                       make_options(base_opts, True),
                                       char_group_label=wt))  # 'Evil Sorcerer' / 'Liche' / 'Vampire'
    return units

# ──────────────────────────────────────────────
# Run all armies
# ──────────────────────────────────────────────

ARMY_CONFIGS = [
    ('dark-elves',   'wa-de', 'de', 'standard'),
    ('wood-elves',   'wa-we', 'we', 'standard'),
    ('high-elves',   'wa-he', 'he', 'standard'),
    ('empire',       'wa-em', 'em', 'standard'),
    ('bretonnia',    'wa-br', 'br', 'standard'),
    ('chaos',        'wa-ch', 'ch', 'standard'),
    ('skaven',       'wa-sk', 'sk', 'standard'),
    ('slann',        'wa-sl', 'sl', 'standard'),
    ('orcs-goblins', None,    None, 'og'),
    ('dwarfs',       None,    None, 'dwarfs'),
    ('undead',       None,    None, 'undead'),
]

all_chars = []
for army, prefix, id_pfx, pattern in ARMY_CONFIGS:
    try:
        if pattern == 'standard':
            entries = extract_standard(army, prefix, id_pfx)
        elif pattern == 'og':
            entries = extract_og()
        elif pattern == 'dwarfs':
            entries = extract_dwarfs()
        elif pattern == 'undead':
            entries = extract_undead()
        else:
            entries = []
        print('  ' + army.ljust(20) + str(len(entries)).rjust(4) + ' characters')
        all_chars.extend(entries)
    except Exception as exc:
        import traceback
        print('  ERROR [' + army + ']: ' + str(exc))
        traceback.print_exc()

print('')
print('Total characters extracted: ' + str(len(all_chars)))

# ──────────────────────────────────────────────
# Append to units-data.js
# ──────────────────────────────────────────────

with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

ins = content.rfind('];')
new_entries = ''
for unit in all_chars:
    blob = json.dumps(unit, ensure_ascii=False, indent=2)
    blob = '  ' + blob.replace('\n', '\n  ')
    new_entries += ',\n' + blob

new_content = content[:ins] + new_entries + '\n' + content[ins:]

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Appended ' + str(len(all_chars)) + ' character entries to units-data.js')
