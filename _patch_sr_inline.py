import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'D:/Tabletop games/Warhammer Fantasy Battle/3rd edition/Wiki Project/wfb3-wiki/index.html'
with open(PATH, 'r', encoding='utf-8') as f:
    content = f.read()

changes = []

# ── 1. CSS: insert sr-* styles before the Responsive block ──────────────
SR_CSS = """
  /* ── Special Rules Reference page ──────────────────── */
  .sr-layout { display: flex; gap: 40px; align-items: flex-start; }
  .sr-body { flex: 1; min-width: 0; }
  .sr-toc { width: 160px; flex-shrink: 0; position: sticky; top: 20px; }
  .sr-toc-title { font-family: 'Cinzel', serif; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--text-faint); margin-bottom: 10px; }
  .sr-toc a { display: block; color: var(--text-dim); text-decoration: none; padding: 3px 0 3px 8px; border-left: 1px solid var(--border); font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.04em; line-height: 1.4; transition: all .15s; cursor: pointer; }
  .sr-toc a:hover { color: var(--text); border-left-color: var(--text-dim); }
  .sr-toc a.active { color: var(--text); border-left-color: var(--text); background: rgba(255,255,255,.03); }
  .sr-section { margin-bottom: 52px; padding-bottom: 52px; border-bottom: 1px solid var(--border); }
  .sr-section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .sr-section-heading { font-family: 'Cinzel', serif; font-weight: 700; font-size: 12px; color: var(--text); letter-spacing: 0.18em; text-transform: uppercase; margin: 0 0 20px; padding: 9px 14px; border-left: 3px solid var(--accent); background: rgba(255,255,255,0.04); scroll-margin-top: 20px; }
  .sr-rule-entry { border-bottom: 1px solid var(--border); padding: 18px 0; }
  .sr-rule-entry:last-child { border-bottom: none; padding-bottom: 0; }
  .sr-rule-name { font-family: 'Cinzel', serif; font-weight: 600; font-size: 13px; color: var(--accent); letter-spacing: 0.06em; margin-bottom: 5px; scroll-margin-top: 20px; }
  .sr-rule-short { font-size: 13px; color: var(--text-dim); font-style: italic; margin-bottom: 10px; line-height: 1.45; padding-left: 12px; border-left: 2px solid var(--border2); }
  .sr-rule-text { font-size: 15px; color: var(--text-dim); line-height: 1.7; }
  .sr-racial-entry { border: 1px solid var(--border2); border-left: 3px solid #6a8a6a; background: rgba(106,138,106,0.04); padding: 16px 20px; margin-bottom: 16px; }
  .sr-racial-entry:last-child { margin-bottom: 0; }
  .sr-racial-name { font-family: 'Cinzel', serif; font-weight: 700; font-size: 12px; color: var(--text); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; scroll-margin-top: 20px; }
  .sr-racial-short { font-size: 13px; color: var(--text-dim); font-style: italic; margin-bottom: 10px; line-height: 1.45; }
  .sr-racial-text { font-size: 14px; color: var(--text-dim); line-height: 1.65; }
  .sr-mount-table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 4px; }
  .sr-mount-table thead tr { border-bottom: 2px solid var(--border-hard); background: rgba(255,255,255,0.05); }
  .sr-mount-table thead th { font-family: 'Cinzel', serif; font-weight: 700; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text); padding: 8px 12px; text-align: left; }
  .sr-mount-table thead th:first-child { width: 180px; }
  .sr-mount-table tbody tr { border-bottom: 1px solid var(--border); }
  .sr-mount-table tbody tr:last-child { border-bottom: none; }
  .sr-mount-table td { padding: 10px 12px; color: var(--text-dim); vertical-align: top; line-height: 1.55; font-size: 14px; }
  .sr-mount-table td:first-child { font-family: 'Cinzel', serif; font-size: 11px; font-weight: 600; color: var(--text); letter-spacing: 0.04em; vertical-align: middle; width: 180px; }
  .sr-weapon-subsection { margin-bottom: 28px; }
  .sr-weapon-subsection:last-child { margin-bottom: 0; }
  .sr-weapon-label { font-family: 'Cinzel', serif; font-weight: 600; font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-dim); padding-left: 10px; border-left: 2px solid var(--border-hard); margin-bottom: 12px; }
  .sr-weapon-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .sr-weapon-table thead tr { border-bottom: 2px solid var(--border-hard); background: rgba(255,255,255,0.05); }
  .sr-weapon-table thead th { font-family: 'Cinzel', serif; font-weight: 700; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text); padding: 7px 10px; text-align: left; }
  .sr-weapon-table thead th.centre { text-align: center; }
  .sr-weapon-table tbody tr { border-bottom: 1px solid var(--border); }
  .sr-weapon-table tbody tr:last-child { border-bottom: none; }
  .sr-weapon-table td { padding: 8px 10px; color: var(--text-dim); vertical-align: top; line-height: 1.5; }
  .sr-weapon-table td.weapon-name { font-family: 'Cinzel', serif; font-size: 11px; font-weight: 600; color: var(--text); letter-spacing: 0.04em; vertical-align: middle; white-space: nowrap; width: 180px; }
  .sr-weapon-table td.centre { text-align: center; font-family: 'Share Tech Mono', monospace; font-size: 13px; color: var(--text); white-space: nowrap; vertical-align: middle; }

"""
changes.append(('  /* ── Responsive / Mobile', SR_CSS + '  /* ── Responsive / Mobile'))

# ── 2. HTML: insert page div after /page-glossary ───────────────────────
SR_PAGE = """    </div><!-- /page-glossary -->

    <div class="page" id="page-special-rules-ref">
      <div class="article-header">
        <div class="article-header-content">
          <h1>Special Rules Reference</h1>
          <p class="article-subtitle">Psychology, combat rules, special troop types, racial rules, bestiary abilities, mount rules and weapon rules</p>
        </div>
      </div>
      <div class="sr-layout">
        <div class="sr-body">
          <div id="sr-inner"></div>
        </div>
        <aside class="sr-toc">
          <div class="sr-toc-title">Contents</div>
          <nav id="sr-page-toc"></nav>
        </aside>
      </div>
    </div><!-- /page-special-rules-ref -->
"""
changes.append(('    </div><!-- /page-glossary -->', SR_PAGE.rstrip('\n')))

# ── 3. sectionMeta: add entry after glossary ─────────────────────────────
changes.append((
    "  'glossary':             { label: 'Glossary',               icon: '📖', desc: 'Characteristics, game terms and psychology quick-reference', key: 'glossary', parent: null },",
    "  'glossary':             { label: 'Glossary',               icon: '📖', desc: 'Characteristics, game terms and psychology quick-reference', key: 'glossary', parent: null },\n  'special-rules-ref':    { label: 'Special Rules',           icon: '📜', desc: 'Full reference: psychology, combat, troop types, racial rules, mounts, weapons', key: 'special-rules-ref', parent: null },"
))

# ── 4. Nav item: replace href with onclick navigate() ───────────────────
changes.append((
    "return `<a class=\"nav-item\" href=\"special-rules.html\" style=\"padding-left:${item.indent}px\">${item.label}</a>`;",
    "return `<a class=\"nav-item\" data-page=\"special-rules-ref\" onclick=\"navigate('special-rules-ref')\" style=\"padding-left:${item.indent}px\">${item.label}</a>`;"
))

# ── 5. renderPage: add case ──────────────────────────────────────────────
changes.append((
    "  switch(pageId) {\n    case 'home': break;\n  }",
    "  switch(pageId) {\n    case 'home': break;\n    case 'special-rules-ref': renderSpecialRulesRef(); break;\n  }"
))

# ── 6. JS: add renderSpecialRulesRef() after renderPage ─────────────────
SR_JS = """
function renderPage(pageId) {"""

SR_RENDER_FN = '''
let srBuilt = false;
function renderSpecialRulesRef() {
  if (srBuilt) return;
  srBuilt = true;

  var SR_SECTIONS = [
    { id: 'psychology',    label: 'Psychology',               category: 'Psychology',               type: 'rules'   },
    { id: 'combat',        label: 'Combat Rules',             category: 'Combat',                   type: 'rules'   },
    { id: 'deployment',    label: 'Deployment',               category: 'Deployment',               type: 'rules'   },
    { id: 'special-troop', label: 'Special Troop Types',      category: 'Special Troop',            type: 'rules'   },
    { id: 'special-unit',  label: 'Special Unit Rules',       category: 'Special Rule',             type: 'rules'   },
    { id: 'racial',        label: 'Racial Rules',             category: 'Racial Rules',             type: 'racial'  },
    { id: 'giant-races',   label: 'Bestiary — Giant Races',   category: 'Bestiary — Giant Races',   type: 'rules'   },
    { id: 'unit-specific', label: 'Bestiary — Unit Specific', category: 'Bestiary — Unit Specific', type: 'rules'   },
    { id: 'mounts',        label: 'Mount Rules',              category: 'Mount Rule',               type: 'mounts'  },
    { id: 'weapons',       label: 'Weapon Rules',             category: null,                       type: 'weapons' },
  ];

  function srEl(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function srEsc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function buildRulesSection(entries) {
    var frag = document.createDocumentFragment();
    entries.forEach(function(pair) {
      var name = pair[0], rule = pair[1];
      var div = srEl('div', 'sr-rule-entry');
      var h4 = srEl('div', 'sr-rule-name');
      h4.id = 'rule-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      h4.textContent = name;
      div.appendChild(h4);
      if (rule.short) { var s = srEl('p', 'sr-rule-short'); s.textContent = rule.short; div.appendChild(s); }
      if (rule.text)  { var t = srEl('p', 'sr-rule-text');  t.textContent = rule.text;  div.appendChild(t); }
      frag.appendChild(div);
    });
    return frag;
  }

  function buildRacialSection(entries) {
    var frag = document.createDocumentFragment();
    entries.forEach(function(pair) {
      var name = pair[0], rule = pair[1];
      var div = srEl('div', 'sr-racial-entry');
      var h4 = srEl('div', 'sr-racial-name');
      h4.id = 'rule-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      h4.textContent = name;
      div.appendChild(h4);
      if (rule.short) { var s = srEl('p', 'sr-racial-short'); s.textContent = rule.short; div.appendChild(s); }
      if (rule.text)  { var t = srEl('p', 'sr-racial-text');  t.textContent = rule.text;  div.appendChild(t); }
      frag.appendChild(div);
    });
    return frag;
  }

  function buildMountsSection(entries) {
    var table = srEl('table', 'sr-mount-table');
    table.innerHTML = '<thead><tr><th>Mount</th><th>Rules</th></tr></thead>';
    var tbody = srEl('tbody');
    entries.forEach(function(pair) {
      var name = pair[0], rule = pair[1];
      var tr = srEl('tr');
      var td1 = srEl('td'); td1.id = 'rule-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      td1.textContent = name.replace(/ Rules$/, '').replace(/ Magical Attacks$/, '');
      var td2 = srEl('td'); td2.textContent = rule.text || rule.short || '';
      tr.appendChild(td1); tr.appendChild(td2); tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  }

  function buildWeaponsSection() {
    var frag = document.createDocumentFragment();
    var missileNames = ['Repeating Crossbow','Crossbow','Long Bow','Short Bow','Bow','Sling','Pistol','Blunderbuss','Throwing Weapons'];
    var missiles = [], hth = [];
    (typeof WFB3_WEAPON_RULES !== 'undefined' ? WFB3_WEAPON_RULES : []).forEach(function(w) {
      (missileNames.indexOf(w.name) !== -1 ? missiles : hth).push(w);
    });

    function weaponTable(rows, isMissile) {
      var wrap = srEl('div', 'sr-weapon-subsection');
      var label = srEl('div', 'sr-weapon-label');
      label.textContent = isMissile ? 'Missile Weapons' : 'Hand-to-Hand Weapons';
      wrap.appendChild(label);
      var t = srEl('table', 'sr-weapon-table');
      t.innerHTML = isMissile
        ? '<thead><tr><th>Weapon</th><th class="centre">Range</th><th class="centre">Str</th><th>Notes</th></tr></thead>'
        : '<thead><tr><th>Weapon</th><th>Rules</th></tr></thead>';
      var tb = srEl('tbody');
      rows.forEach(function(w) {
        var tr = srEl('tr');
        if (isMissile) {
          var rangeM = w.rule.match(/Range\\s+([\\d\\u2033\\u201d]+)/);
          var strM   = w.rule.match(/Str(?:ength)?\\s+(\\d)/);
          var notes  = w.rule.replace(/Range\\s+[\\d\\u2033\\u201d]+[\\u2033\\u201d]?,?\\s*/,'').replace(/Str(?:ength)?\\s+\\d\\.?\\s*/,'').replace(/^[.,;]\\s*/,'').trim();
          tr.innerHTML = '<td class="weapon-name">' + srEsc(w.name) + '</td>'
            + '<td class="centre">' + srEsc(rangeM ? rangeM[1] + '″' : '—') + '</td>'
            + '<td class="centre">' + srEsc(strM   ? strM[1]              : '—') + '</td>'
            + '<td>' + srEsc(notes || '—') + '</td>';
        } else {
          tr.innerHTML = '<td class="weapon-name">' + srEsc(w.name) + '</td><td>' + srEsc(w.rule) + '</td>';
        }
        tb.appendChild(tr);
      });
      t.appendChild(tb); wrap.appendChild(t); return wrap;
    }
    frag.appendChild(weaponTable(missiles, true));
    frag.appendChild(weaponTable(hth, false));
    return frag;
  }

  var inner = document.getElementById('sr-inner');
  var toc   = document.getElementById('sr-page-toc');
  if (!inner || typeof WFB3_RULES === 'undefined') return;

  SR_SECTIONS.forEach(function(sec) {
    var entries = [];
    if (sec.type !== 'weapons') {
      Object.keys(WFB3_RULES).forEach(function(name) {
        if (WFB3_RULES[name].category === sec.category) entries.push([name, WFB3_RULES[name]]);
      });
      if (!entries.length) return;
    }
    var section = srEl('section', 'sr-section');
    section.id = 'sec-' + sec.id;
    var heading = srEl('div', 'sr-section-heading');
    heading.textContent = sec.label;
    section.appendChild(heading);
    if      (sec.type === 'rules')   section.appendChild(buildRulesSection(entries));
    else if (sec.type === 'racial')  section.appendChild(buildRacialSection(entries));
    else if (sec.type === 'mounts')  section.appendChild(buildMountsSection(entries));
    else if (sec.type === 'weapons') section.appendChild(buildWeaponsSection());
    inner.appendChild(section);

    var a = srEl('a'); a.dataset.target = 'sec-' + sec.id; a.textContent = sec.label;
    a.onclick = function(e) {
      e.preventDefault();
      var el = document.getElementById('sec-' + sec.id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    toc.appendChild(a);
  });

  // Scroll spy on the content pane
  var contentDiv = document.getElementById('content');
  var allSections = inner.querySelectorAll('.sr-section');
  var allLinks    = toc.querySelectorAll('a');
  contentDiv.addEventListener('scroll', function() {
    var scrollY = contentDiv.scrollTop + 100;
    var current = '';
    allSections.forEach(function(s) { if (s.offsetTop <= scrollY) current = s.id; });
    allLinks.forEach(function(a) { a.classList.toggle('active', a.dataset.target === current); });
  }, { passive: true });
}

function renderPage(pageId) {'''

changes.append(('\nfunction renderPage(pageId) {', SR_RENDER_FN))

# Apply
ok = miss = 0
for old, new in changes:
    if old in content:
        content = content.replace(old, new, 1)
        ok += 1
    else:
        miss += 1
        print('MISS:', repr(old[:80]))

print(f'Applied {ok}/{ok+miss} changes')
with open(PATH, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done. Length:', len(content))
