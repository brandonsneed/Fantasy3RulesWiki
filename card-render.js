/**
 * card-render.js
 * Exports renderAlCard(unit) — returns a complete .al-card HTML string.
 * Used by index.html (wiki) and army-list.html (army list builder).
 *
 * Supported unit.type values:
 *   standard  — normal infantry/cavalry card with .al-mid layout
 *   warmachine — stats band + .al-wm-mid/art/footer layout
 *   waraltar  — .al-wm-mid/art/footer layout (no stats band)
 *   handler   — .al-handler-body layout with optional packs block
 *   chariot   — .al-chariot-mid/info-bar layout
 *   aggregate — no profile table; aggregateTable rendered inside .al-flavour
 */

/* ── Generic army fallback art ───────────────────────────────────────────── */
var GENERIC_ART = {
  'bretonnia':        'img/generic/bretonnia.png',
  'chaos':            'img/generic/chaos.png',
  'dark-elves':       'img/generic/dark-elves.png',
  'dwarfs':           'img/generic/dwarfs.png',
  'empire':           'img/generic/empire.png',
  'high-elves':       'img/generic/high-elves.png',
  'orcs-goblins':     'img/generic/orcs-goblins.png',
  'skaven':           'img/generic/skaven.png',
  'slann':            'img/generic/slann.png',
  'undead':           'img/generic/undead.png',
  'wood-elves':       'img/generic/wood-elves.png',
  // allies & mercs mapped to their parent race
  'ally-chaos':       'img/generic/chaos.png',
  'ally-dwarf':       'img/generic/dwarfs.png',
  'ally-dark-elf':    'img/generic/dark-elves.png',
  'ally-high-elf':    'img/generic/high-elves.png',
  'ally-wood-elf':    'img/generic/wood-elves.png',
  'ally-orc-goblin':  'img/generic/orcs-goblins.png',
  'ally-skaven':      'img/generic/skaven.png',
  'ally-undead':      'img/generic/undead.png',
  'ally-old-worlder': 'img/generic/empire.png',
  'merc-dwarf':       'img/generic/dwarfs.png',
  'merc-orc':         'img/generic/orcs-goblins.png',
  'merc-norse':       'img/generic/chaos.png',
  'norse':            'img/generic/chaos.png',
};
function getArt(unit) {
  return (unit.art) || GENERIC_ART[unit.army] || '';
}

/* ── HTML escape ─────────────────────────────────────────────────────────── */
function esc(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Profile table ───────────────────────────────────────────────────────── */
/**
 * Builds the shared .al-profile table HTML used by most card types.
 * Handles raceGroup header rows (al-rh) for handler-type multi-race tables.
 * @param {Array} profiles  - array of { label, stats[12], raceGroup }
 * @param {string|null} profileTypeLabel - optional text for the th.rh cell
 *        (used by chariot cards, e.g. "Heavy Chariot")
 */
function buildProfileTable(profiles, profileTypeLabel) {
  if (!profiles || !profiles.length) return '';

  const rhContent = profileTypeLabel ? esc(profileTypeLabel) : '';

  const headerRow =
    `<tr><th class="rh">${rhContent}</th>` +
    '<th>M</th><th>WS</th><th>BS</th><th>S</th><th>T</th>' +
    '<th>W</th><th>I</th><th>A</th><th>Ld</th><th>Int</th><th>Cl</th><th>WP</th></tr>';

  let lastRaceGroup = undefined;
  let bodyRows = '';

  profiles.forEach(function(profile) {
    // Emit a race-header row when raceGroup changes and is non-null
    if (profile.raceGroup != null && profile.raceGroup !== lastRaceGroup) {
      bodyRows += `<tr class="al-rh"><td colspan="13">${esc(profile.raceGroup)}</td></tr>`;
    }
    lastRaceGroup = profile.raceGroup;

    const stats = profile.stats || [];
    const statCells = stats.map(function(v) {
      return `<td>${esc(v)}</td>`;
    }).join('');
    bodyRows += `<tr><td class="rl">${esc(profile.label)}</td>${statCells}</tr>`;
  });

  return (
    `<table class="al-profile">` +
    `<thead>${headerRow}</thead>` +
    `<tbody>${bodyRows}</tbody>` +
    `</table>`
  );
}

/* ── Profile note ────────────────────────────────────────────────────────── */
function buildProfileNote(note) {
  if (!note) return '';
  return `<p class="al-profile-note">${esc(note)}</p>`;
}

/* ── Machine stats band (.al-stats-band) ─────────────────────────────────── */
/**
 * Renders the .al-stats-band table for warmachine cards.
 * Supports two machineStats shapes:
 *   Modern:  { name, statHeaders: [...], statCols: [...] }
 *   Legacy:  { label, move, save, wounds, crew } (JSON placeholder format)
 * If neither contains useful data, nothing is rendered.
 */
function buildMachineStatsBand(machineStats) {
  if (!machineStats) return '';

  let name, headers, cols;

  if (machineStats.statHeaders && machineStats.statCols) {
    // Modern format from unit-card.html editor
    name    = machineStats.name  || machineStats.label || '';
    headers = machineStats.statHeaders;
    cols    = machineStats.statCols;
  } else if (machineStats.label || machineStats.name) {
    // Legacy / placeholder format — skip if all values are '–' or empty
    name    = machineStats.name || machineStats.label || '';
    headers = ['Range', 'Strength', 'Save Mod.', 'Wounds/Hit'];
    cols    = [
      machineStats.range      || '–',
      machineStats.strength   || '–',
      machineStats.saveMod    || machineStats.save || '–',
      machineStats.woundsPerHit || machineStats.wounds || '–'
    ];
    // If all cols are '–' and name is also placeholder-ish, omit the band
    const allDash = cols.every(function(v) { return v === '–' || v === '' || v === null; });
    if (allDash && (!name || name === '–')) return '';
  } else {
    return '';
  }

  const thCells = headers.map(function(h) {
    return `<th>${esc(h)}</th>`;
  }).join('');

  const tdCells = cols.map(function(v) {
    return `<td>${esc(v === null || v === undefined ? '–' : v)}</td>`;
  }).join('');

  return (
    `<div class="al-stats-band">` +
    `<table>` +
    `<thead><tr><th class="al-sn"></th>${thCells}</tr></thead>` +
    `<tbody><tr><td class="al-sn">${esc(name)}</td>${tdCells}</tr></tbody>` +
    `</table>` +
    `</div>`
  );
}

/* ── Options block ───────────────────────────────────────────────────────── */
function buildOptions(options) {
  if (!options || !options.length) return '';

  let html = '<div class="al-opts"><div class="al-opts-h">Options</div>';
  options.forEach(function(group) {
    if (group.subheading) {
      html += `<div class="al-opts-sh">${esc(group.subheading)}</div>`;
    }
    if (group.items && group.items.length) {
      group.items.forEach(function(item) {
        html +=
          `<div class="al-opt">` +
          `<span class="al-opt-n">${esc(item.name)}</span>` +
          `<span class="al-opt-d"></span>` +
          `<span class="al-opt-c">${esc(item.cost)}</span>` +
          `</div>`;
      });
    }
  });
  html += '</div>';
  return html;
}

/* ── Selected options block (character army-list cards) ──────────────────── */
/**
 * Renders only the options that appear in selectedOpts map.
 * Used by character cards in the army list builder so the card shows only
 * what the player has actually chosen, rather than the full catalogue.
 * For magic item options the selected abilities and their descriptions are
 * expanded inline below each option row.
 *
 * @param {Array}  options        unit.options array
 * @param {Object} selectedOpts   { optionName: true, ... }
 * @param {Object} magicAbilities { optionName: { abilityName: true, ... }, ... }
 */
function buildSelectedOptions(options, selectedOpts, magicAbilities) {
  if (!options) return '';
  const chosen = [];
  options.forEach(function(group) {
    if (!group.items) return;
    group.items.forEach(function(item) {
      if (selectedOpts[item.name]) chosen.push(item);
    });
  });
  if (!chosen.length) {
    return '<div class="al-char-no-opts">No upgrades selected</div>';
  }
  const abMap = magicAbilities || {};
  let html = '<div class="al-opts"><div class="al-opts-h">Upgrades</div>';
  chosen.forEach(function(item) {
    html +=
      `<div class="al-opt">` +
      `<span class="al-opt-n">${esc(item.name)}</span>` +
      `<span class="al-opt-d"></span>` +
      `<span class="al-opt-c">${esc(item.cost)}</span>` +
      `</div>`;
    // Expand selected magic abilities with descriptions
    const catKey = getMagicItemCategoryFromName(item.name);
    if (catKey && typeof WFB3_MAGIC_ITEMS !== 'undefined' &&
        WFB3_MAGIC_ITEMS[catKey] && WFB3_MAGIC_ITEMS[catKey].abilities) {
      const selectedAbs = abMap[item.name] || {};
      WFB3_MAGIC_ITEMS[catKey].abilities.forEach(function(ab) {
        if (!selectedAbs[ab.name]) return;
        const desc = ab.desc ? esc(ab.desc) : '';
        html +=
          `<div class="al-magic-ability">` +
          `<span class="al-magic-ab-name">${esc(ab.name)}</span>` +
          (desc ? `<span class="al-magic-ab-desc">${desc}</span>` : '') +
          `<span class="al-magic-ab-cost">+${esc(String(ab.cost))} pts</span>` +
          `</div>`;
      });
    }
  });
  html += '</div>';
  return html;
}

/**
 * Returns the WFB3_MAGIC_ITEMS category key for a given option name string.
 * Mirrors the getMagicItemCategory logic in army-list.html so both pages
 * classify options identically.
 */
function getMagicItemCategoryFromName(optName) {
  if (typeof WFB3_MAGIC_ITEMS === 'undefined') return null;
  const n = (optName || '').toLowerCase();
  if (/magic(al)?\s+(unit\s+)?standard/.test(n) || /\bstandard.*magic/.test(n)) return 'standard';
  if (/magic(al)?\s+instrument/.test(n))                                          return 'instrument';
  if (/magic(al)?\s+(hand\s+)?weapon/.test(n) || /magic(al)?\s+sword/.test(n))   return 'weapon';
  if (/magic(al)?\s+(armou?r|shield|helm)/.test(n))                               return 'armour';
  if (/one.?shot/i.test(n))                                                        return 'missile_oneshot';
  if (/magic(al)?\s+missile/.test(n))                                              return 'missile_supply';
  if (/scroll/.test(n))                                                             return 'scroll';
  if (/magic(al)?\s+ring/.test(n))                                                 return 'ring';
  return null;
}

/* ── Packs block (handler type) ──────────────────────────────────────────── */
function buildPacks(packs) {
  if (!packs || !packs.length) return '';

  let html = '<div class="al-packs"><div class="al-packs-h">Packs</div>';
  packs.forEach(function(pack) {
    html +=
      `<div class="al-pack">` +
      `<span class="al-pack-n">${esc(pack.animal)}</span>` +
      `<span class="al-pack-d"></span>` +
      `<span class="al-pack-c">${esc(pack.cost)}</span>` +
      `</div>`;
  });
  html += '</div>';
  return html;
}

/* ── Art element ─────────────────────────────────────────────────────────── */
function buildArt(unit, cssClass) {
  const src = getArt(unit);
  if (!src) return '';
  const altText = esc(unit.name || '');
  return `<div class="${cssClass}"><img src="${src}" alt="${altText}"></div>`;
}

/* ── Standard info rows ──────────────────────────────────────────────────── */
/**
 * Builds the .al-row info rows inside .al-info (models, points, weapons,
 * armour, mount) and the options block.
 */
function buildInfoRows(unit) {
  let html = '';

  if (unit.models != null && unit.models !== '') {
    html +=
      `<div class="al-row">` +
      `<span class="al-lbl">Models per unit:</span>` +
      `<span class="al-val-r">${esc(unit.models)}</span>` +
      `</div>`;
  }

  if (unit.ptsFixed != null && unit.ptsFixed !== '') {
    html +=
      `<div class="al-row">` +
      `<span class="al-lbl">Points (inc. crew):</span>` +
      `<span class="al-val-r">${esc(unit.ptsFixed)}</span>` +
      `</div>`;
  } else if (unit.ptsPerModel != null && unit.ptsPerModel !== '') {
    html +=
      `<div class="al-row">` +
      `<span class="al-lbl">Points per model:</span>` +
      `<span class="al-val-r">${esc(unit.ptsPerModel)}</span>` +
      `</div>`;
  }

  if (unit.weapons != null && unit.weapons !== '') {
    html +=
      `<div class="al-row">` +
      `<span class="al-lbl">Weapons:</span>` +
      `<span class="al-val">${esc(unit.weapons)}</span>` +
      `</div>`;
  }

  if (unit.armour != null && unit.armour !== '') {
    html +=
      `<div class="al-row">` +
      `<span class="al-lbl">Armour:</span>` +
      `<span class="al-val">${esc(unit.armour)}</span>` +
      `</div>`;
  }

  if (unit.mount != null && unit.mount !== '') {
    html +=
      `<div class="al-row">` +
      `<span class="al-lbl">Mount:</span>` +
      `<span class="al-val">${esc(unit.mount)}</span>` +
      `</div>`;
  }

  return html;
}

/* ── Special rules block ─────────────────────────────────────────────────── */
/**
 * Renders a row of special rule tags for a unit.
 * Combines explicit WFB3_UNIT_RULES entries with name-pattern inference
 * from WFB3_NAME_RULES (bestiary creatures, racial variants, etc.).
 * @param {string} unitId   — unit.id
 * @param {string} unitName — unit.name (used for pattern inference)
 */
function buildSpecialRules(unitId, unitName) {
  const explicit = (typeof WFB3_UNIT_RULES !== 'undefined' && WFB3_UNIT_RULES[unitId])
    ? WFB3_UNIT_RULES[unitId].slice()
    : [];

  const inferred = [];
  if (typeof WFB3_NAME_RULES !== 'undefined') {
    WFB3_NAME_RULES.forEach(function(entry) {
      if (entry.match(unitName || '', unitId)) {
        entry.rules.forEach(function(r) {
          if (explicit.indexOf(r) === -1 && inferred.indexOf(r) === -1) inferred.push(r);
        });
      }
    });
  }

  const rules = explicit.concat(inferred);
  if (!rules.length) return '';

  const tags = rules.map(function(r) {
    return `<span class="al-rule-tag" data-rule="${esc(r)}" onclick="showRuleDetail(this)">${esc(r)}</span>`;
  }).join('');

  return `<div class="al-special-rules">${tags}</div><div class="al-rule-detail"></div>`;
}

/* ── Weapon rules block (print-only) ────────────────────────────────────── */
/**
 * Returns a compact weapon-rules reference block for printing.
 * The block is hidden on screen (CSS: display:none) and only visible in
 * @media print so it doesn't clutter the on-screen army builder.
 *
 * @param {string}      weaponsStr   unit.weapons field (comma-separated names)
 * @param {Object|null} selectedOpts optionsSelected map — character cards only
 * @param {Array|null}  optionGroups unit.options array — to extract selected weapon names
 */
function buildWeaponRules(weaponsStr, selectedOpts, optionGroups) {
  if (typeof WFB3_WEAPON_RULES === 'undefined') return '';

  // Collect every weapon name string we need to inspect
  const names = [];
  if (weaponsStr) {
    weaponsStr.split(',').forEach(function(s) { names.push(s.trim()); });
  }
  if (selectedOpts && optionGroups) {
    optionGroups.forEach(function(group) {
      (group.items || []).forEach(function(item) {
        if (selectedOpts[item.name]) names.push(item.name);
      });
    });
  }
  if (!names.length) return '';

  // Match each name against WFB3_WEAPON_RULES patterns (first match wins per entry)
  const found = [];
  const seen  = new Set();
  names.forEach(function(name) {
    for (var i = 0; i < WFB3_WEAPON_RULES.length; i++) {
      var entry = WFB3_WEAPON_RULES[i];
      if (!seen.has(entry.name) && entry.pattern.test(name)) {
        found.push(entry);
        seen.add(entry.name);
        break;
      }
    }
  });
  if (!found.length) return '';

  let html = '<div class="al-weapon-rules">';
  found.forEach(function(entry) {
    html +=
      `<div class="al-weapon-rule">` +
      `<span class="al-wr-name">${esc(entry.name)}</span>` +
      `<span class="al-wr-sep"> — </span>` +
      `<span class="al-wr-text">${esc(entry.rule)}</span>` +
      `</div>`;
  });
  html += '</div>';
  return html;
}

/* ── Flavour text ────────────────────────────────────────────────────────── */
function buildFlavour(flavour) {
  if (!flavour) return '';
  // Flavour may contain HTML (e.g. anchor tags from index.html inline links).
  // Treat as trusted content — do not escape it.
  return `<div class="al-flavour">${flavour}</div>`;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARD TYPE RENDERERS
═══════════════════════════════════════════════════════════════════════════ */

/* ── standard ────────────────────────────────────────────────────────────── */
function renderStandard(unit) {
  let html = buildProfileTable(unit.profiles);
  html += buildProfileNote(unit.profileNote);

  // .al-mid: art + info column
  let mid = '';
  mid += buildArt(unit, 'al-art');

  let info = '<div class="al-info">';
  info += buildInfoRows(unit);
  info += buildSpecialRules(unit.id, unit.name);
  info += buildWeaponRules(unit.weapons, null, null);
  info += buildOptions(unit.options);
  info += '</div>';

  mid += info;
  html += `<div class="al-mid">${mid}</div>`;
  html += buildFlavour(unit.flavour);
  return html;
}

/* ── handler ─────────────────────────────────────────────────────────────── */
/**
 * Handler cards use .al-handler-body with .al-handler-art / .al-handler-info.
 * The models row uses a column-direction layout (per index.html inline style).
 * Race-group header rows in the profile table distinguish handler from animals.
 */
function renderHandler(unit) {
  let html = buildProfileTable(unit.profiles);
  html += buildProfileNote(unit.profileNote);

  // .al-handler-body
  let body = '';

  // Art
  const handlerArt = getArt(unit);
  if (handlerArt) {
    body += `<div class="al-handler-art"><img src="${handlerArt}" alt="${esc(unit.name || '')}"></div>`;
  }

  // Info
  let info = '<div class="al-handler-info">';

  // Models row — column-direction (matching index.html inline style)
  if (unit.models != null && unit.models !== '') {
    info +=
      `<div class="al-row" style="flex-direction:column;align-items:flex-start;padding:3px 6px 2px">` +
      `<span class="al-lbl">Models per unit:</span>` +
      `<span class="al-val">${esc(unit.models)}</span>` +
      `</div>`;
  }

  // Points
  if (unit.ptsFixed != null && unit.ptsFixed !== '') {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Points (inc. crew):</span>` +
      `<span class="al-val-r">${esc(unit.ptsFixed)}</span>` +
      `</div>`;
  } else if (unit.ptsPerModel != null && unit.ptsPerModel !== '') {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Points per model:</span>` +
      `<span class="al-val-r">${esc(unit.ptsPerModel)}</span>` +
      `</div>`;
  }

  if (unit.weapons != null && unit.weapons !== '') {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Weapons:</span>` +
      `<span class="al-val">${esc(unit.weapons)}</span>` +
      `</div>`;
  }

  if (unit.armour != null && unit.armour !== '') {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Armour:</span>` +
      `<span class="al-val">${esc(unit.armour)}</span>` +
      `</div>`;
  }

  info += buildSpecialRules(unit.id, unit.name);
  info += buildWeaponRules(unit.weapons, null, null);
  info += buildOptions(unit.options);
  info += buildPacks(unit.packs);
  info += '</div>';

  body += info;
  html += `<div class="al-handler-body">${body}</div>`;
  html += buildFlavour(unit.flavour);
  return html;
}

/* ── warmachine ──────────────────────────────────────────────────────────── */
/**
 * Warmachine cards: profile table → optional stats band → .al-wm-mid →
 * .al-wm-art → .al-wm-footer (weapons / armour cells).
 * Optional options block sits between the art and footer when present.
 */
function renderWarMachine(unit) {
  let html = '';

  // Profile table (may be empty for aggregate-style war engine cards)
  if (unit.profiles && unit.profiles.length) {
    html += buildProfileTable(unit.profiles);
    html += buildProfileNote(unit.profileNote);
  }

  // Machine stats band (optional)
  html += buildMachineStatsBand(unit.machineStats);

  // .al-wm-mid: models (left) + points (right)
  const modelsText   = (unit.models   != null && unit.models   !== '') ? esc(unit.models)   : '—';
  const ptsText      = (unit.ptsFixed != null && unit.ptsFixed !== '')
    ? esc(unit.ptsFixed)
    : (unit.ptsPerModel != null && unit.ptsPerModel !== '') ? esc(unit.ptsPerModel) : '—';
  const ptsLabel     = (unit.ptsFixed != null && unit.ptsFixed !== '')
    ? 'Points (inc. crew):'
    : 'Points per model:';

  html +=
    `<div class="al-wm-mid">` +
    `<div class="al-wm-mid-left">` +
    `<span class="al-wm-mid-label">Models per unit:</span>` +
    `<span class="al-wm-mid-value">${modelsText}</span>` +
    `</div>` +
    `<div class="al-wm-mid-right">` +
    `<span class="al-wm-mid-label">${ptsLabel}</span>` +
    `<span class="al-wm-mid-value">${ptsText}</span>` +
    `</div>` +
    `</div>`;

  // Art — full width
  const wmArt1 = getArt(unit);
  if (wmArt1) {
    html += `<div class="al-wm-art"><img src="${wmArt1}" alt="${esc(unit.name || '')}"></div>`;
  }

  // Special rules + options block (between art and footer, if present)
  const srHtml = buildSpecialRules(unit.id, unit.name);
  const wrHtml = buildWeaponRules(unit.weapons, null, null);
  if (srHtml || wrHtml || (unit.options && unit.options.length)) {
    html += `<div style="padding:4px 10px 6px">` + srHtml + wrHtml + buildOptions(unit.options) + `</div>`;
  }

  // .al-wm-footer: weapons + armour cells (+ any extra footer cells from chariot.crew, etc.)
  let footerCells = '';
  if (unit.weapons != null && unit.weapons !== '') {
    footerCells +=
      `<div class="al-wm-footer-cell">` +
      `<span class="al-wm-footer-label">Weapons:</span>` +
      `<span class="al-wm-footer-value">${esc(unit.weapons)}</span>` +
      `</div>`;
  }
  if (unit.armour != null && unit.armour !== '') {
    footerCells +=
      `<div class="al-wm-footer-cell">` +
      `<span class="al-wm-footer-label">Armour:</span>` +
      `<span class="al-wm-footer-value">${esc(unit.armour)}</span>` +
      `</div>`;
  }
  if (footerCells) {
    html += `<div class="al-wm-footer">${footerCells}</div>`;
  }

  html += buildFlavour(unit.flavour);
  return html;
}

/* ── waraltar ────────────────────────────────────────────────────────────── */
/**
 * War altar cards share the warmachine layout but never have a stats band.
 * Structurally identical to warmachine minus machineStats.
 */
function renderWarAltar(unit) {
  // Reuse warmachine renderer — machineStats will be null so no band is emitted
  return renderWarMachine(unit);
}

/* ── chariot ─────────────────────────────────────────────────────────────── */
/**
 * Chariot cards: profile table (with label from chariot.label in th.rh) →
 * .al-chariot-mid (weapons panel | art | armour panel) →
 * .al-chariot-info-bar (models | points).
 */
function renderChariot(unit) {
  const chariot     = unit.chariot || {};
  const charioLabel = chariot.label || null;

  let html = buildProfileTable(unit.profiles, charioLabel);
  html += buildProfileNote(unit.profileNote);

  // .al-chariot-mid
  let weaponsPanel = '';
  if (unit.weapons != null && unit.weapons !== '') {
    weaponsPanel =
      `<div class="al-chariot-weapons">` +
      `<div>` +
      `<span class="al-chariot-stat-label">Weapons:</span>` +
      `<span class="al-chariot-stat-value">${esc(unit.weapons)}</span>` +
      `</div>` +
      `</div>`;
  } else {
    weaponsPanel = `<div class="al-chariot-weapons"></div>`;
  }

  let artPanel = '';
  const chArt = getArt(unit);
  if (chArt) {
    artPanel = `<div class="al-chariot-art"><img src="${chArt}" alt="${esc(unit.name || '')}"></div>`;
  } else {
    artPanel = `<div class="al-chariot-art"></div>`;
  }

  let armourPanel = '';
  if (unit.armour != null && unit.armour !== '') {
    armourPanel =
      `<div class="al-chariot-armour">` +
      `<div>` +
      `<span class="al-chariot-stat-label">Armour:</span>` +
      `<span class="al-chariot-stat-value">${esc(unit.armour)}</span>` +
      `</div>` +
      `</div>`;
  } else {
    armourPanel = `<div class="al-chariot-armour"></div>`;
  }

  html += `<div class="al-chariot-mid">${weaponsPanel}${artPanel}${armourPanel}</div>`;

  // .al-chariot-info-bar: models (left) + points (right)
  const modelsText = (unit.models != null && unit.models !== '') ? esc(unit.models) : '—';
  const ptsText    = (unit.ptsFixed != null && unit.ptsFixed !== '')
    ? esc(unit.ptsFixed)
    : (unit.ptsPerModel != null && unit.ptsPerModel !== '') ? esc(unit.ptsPerModel) : '—';
  const ptsLabel   = (unit.ptsFixed != null && unit.ptsFixed !== '')
    ? 'Points (inc. crew):'
    : 'Points per model:';

  html +=
    `<div class="al-chariot-info-bar">` +
    `<div class="al-chariot-info-cell">` +
    `<span class="al-chariot-info-label">Models per unit:</span>` +
    `<span class="al-chariot-info-value">${modelsText}</span>` +
    `</div>` +
    `<div class="al-chariot-info-cell" style="text-align:right">` +
    `<span class="al-chariot-info-label">${ptsLabel}</span>` +
    `<span class="al-chariot-info-value">${ptsText}</span>` +
    `</div>` +
    `</div>`;

  // Special rules + options (if any)
  const srHtml2 = buildSpecialRules(unit.id, unit.name);
  const wrHtml2 = buildWeaponRules(unit.weapons, null, null);
  if (srHtml2 || wrHtml2 || (unit.options && unit.options.length)) {
    html += `<div style="padding:4px 10px 6px">` + srHtml2 + wrHtml2 + buildOptions(unit.options) + `</div>`;
  }

  html += buildFlavour(unit.flavour);
  return html;
}

/* ── aggregate ───────────────────────────────────────────────────────────── */
/**
 * Aggregate cards (e.g. Dwarf War Engines) have no profile table.
 * They use .al-wm-mid / .al-wm-art / .al-wm-footer for the top section,
 * then an .al-flavour block containing an .al-agg-table and flavour text.
 *
 * unit.aggregateTable: { headers: [...], rows: [[...], [...], ...] }
 */
function renderAggregate(unit) {
  let html = '';

  // .al-wm-mid: models + points
  const modelsText = (unit.models != null && unit.models !== '') ? esc(unit.models) : '—';
  const ptsText    = (unit.ptsFixed != null && unit.ptsFixed !== '')
    ? esc(unit.ptsFixed)
    : (unit.ptsPerModel != null && unit.ptsPerModel !== '') ? esc(unit.ptsPerModel) : '—';
  const ptsLabel   = (unit.ptsFixed != null && unit.ptsFixed !== '')
    ? 'Points (inc. crew):'
    : 'Points per model:';

  html +=
    `<div class="al-wm-mid">` +
    `<div class="al-wm-mid-left">` +
    `<span class="al-wm-mid-label">Models per unit:</span>` +
    `<span class="al-wm-mid-value">${modelsText}</span>` +
    `</div>` +
    `<div class="al-wm-mid-right">` +
    `<span class="al-wm-mid-label">${ptsLabel}</span>` +
    `<span class="al-wm-mid-value">${ptsText}</span>` +
    `</div>` +
    `</div>`;

  // Art
  const wmArt2 = getArt(unit);
  if (wmArt2) {
    html += `<div class="al-wm-art"><img src="${wmArt2}" alt="${esc(unit.name || '')}"></div>`;
  }

  // Footer: weapons + armour
  let footerCells = '';
  if (unit.weapons != null && unit.weapons !== '') {
    footerCells +=
      `<div class="al-wm-footer-cell">` +
      `<span class="al-wm-footer-label">Weapons:</span>` +
      `<span class="al-wm-footer-value">${esc(unit.weapons)}</span>` +
      `</div>`;
  }
  if (unit.armour != null && unit.armour !== '') {
    footerCells +=
      `<div class="al-wm-footer-cell">` +
      `<span class="al-wm-footer-label">Armour:</span>` +
      `<span class="al-wm-footer-value">${esc(unit.armour)}</span>` +
      `</div>`;
  }
  if (footerCells) {
    html += `<div class="al-wm-footer">${footerCells}</div>`;
  }

  // .al-flavour: aggregate table + flavour text
  let flavourContent = '';

  if (unit.aggregateTable) {
    const agg = unit.aggregateTable;
    let tableHtml = `<table class="al-agg-table">`;

    if (agg.headers && agg.headers.length) {
      const ths = agg.headers.map(function(h) {
        return `<th>${esc(h)}</th>`;
      }).join('');
      tableHtml += `<thead><tr>${ths}</tr></thead>`;
    }

    if (agg.rows && agg.rows.length) {
      const bodyRows = agg.rows.map(function(row) {
        const tds = row.map(function(cell) {
          return `<td>${esc(cell)}</td>`;
        }).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      tableHtml += `<tbody>${bodyRows}</tbody>`;
    }

    tableHtml += `</table>`;
    flavourContent += tableHtml;
  }

  if (unit.flavour) {
    flavourContent += `<p class="al-flavour-text">${unit.flavour}</p>`;
  }

  if (flavourContent) {
    html += `<div class="al-flavour">${flavourContent}</div>`;
  }

  return html;
}

/* ── character ───────────────────────────────────────────────────────────── */
/**
 * Character cards (heroes, wizards, assassins, etc.).
 * Shows the profile table, then an info panel with level/max/pts/weapons,
 * then an options block.
 *
 * @param {Object}      unit
 * @param {Object|null} selectedOpts    When provided (army-list context) only the
 *   chosen options are rendered on the card.  When null/undefined (wiki / preview
 *   context) the full options catalogue is shown.
 * @param {Object|null} magicAbilities  { optionName: { abilityName: true } } map
 *   from the army list item — used to expand selected magic item abilities.
 */
function renderCharacter(unit, selectedOpts, magicAbilities) {
  let html = buildProfileTable(unit.profiles);
  if (unit.profileNote) html += buildProfileNote(unit.profileNote);

  // Art panel (generic fallback when no specific art)
  let artHtml;
  const stdArt = getArt(unit);
  if (stdArt) {
    artHtml = buildArt(unit, 'al-art');
  } else {
    artHtml =
      '<div class="al-art">' +
      '<div class="al-art-ph">No<br>art<br>yet</div>' +
      '</div>';
  }

  // Info column
  let info = '<div class="al-info">';

  if (unit.charType) {
    const ct = unit.charType.charAt(0).toUpperCase() + unit.charType.slice(1);
    const lvlSuffix = unit.level != null ? `&nbsp;<span class="al-char-level">Lv&nbsp;${esc(String(unit.level))}</span>` : '';
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Type:</span>` +
      `<span class="al-val">${esc(ct)}${lvlSuffix}</span>` +
      `</div>`;
  } else if (unit.level != null) {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Level:</span>` +
      `<span class="al-val"><span class="al-char-level">Lv&nbsp;${esc(String(unit.level))}</span></span>` +
      `</div>`;
  }

  if (unit.charMax != null) {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Max allowed:</span>` +
      `<span class="al-val-r">${esc(unit.charMax)}</span>` +
      `</div>`;
  }

  if (unit.ptsPerModel != null && unit.ptsPerModel !== '') {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Points:</span>` +
      `<span class="al-val-r">${esc(unit.ptsPerModel)}</span>` +
      `</div>`;
  }

  if (unit.weapons) {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Weapons:</span>` +
      `<span class="al-val">${esc(unit.weapons)}</span>` +
      `</div>`;
  }

  if (unit.armour) {
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Armour:</span>` +
      `<span class="al-val">${esc(unit.armour)}</span>` +
      `</div>`;
  }

  // Special rules
  info += buildSpecialRules(unit.id, unit.name);

  // Weapon rules (print-only; for army-list show only equipped weapons)
  info += buildWeaponRules(unit.weapons,
    selectedOpts != null ? selectedOpts : null,
    selectedOpts != null ? unit.options : null);

  // Options: filtered to selected only (army-list) or full catalogue (preview/wiki)
  if (selectedOpts != null) {
    info += buildSelectedOptions(unit.options, selectedOpts, magicAbilities);
  } else {
    info += buildOptions(unit.options);
  }

  info += '</div>'; // .al-info

  html += `<div class="al-mid">${artHtml}${info}</div>`;
  html += buildFlavour(unit.flavour);
  return html;
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════════════════ */

/**
 * renderAlCard(unit, selectedOpts, magicAbilities, renderOpts)
 *
 * Takes a unit data object (matching the shape in units-data.js) and
 * returns a complete .al-card div HTML string.
 *
 * @param  {Object}      unit
 * @param  {Object|null} selectedOpts    Optional map { optionName: true } for
 *   character cards in the army list builder.  When provided only chosen options
 *   are shown on the card; when omitted the full options catalogue is shown.
 * @param  {Object|null} magicAbilities  Optional map { optionName: { abilityName: true } }
 *   from the army list item — expands selected magic item abilities with descriptions.
 * @param  {Object|null} renderOpts      Optional rendering flags:
 *   { hideAllowance: true } — omits the allowance prefix from the card title.
 *   Used by the army list builder so the title reads "Temple Ritterbruden" not
 *   "0–20 Temple Ritterbruden" (the range is shown in the controls bar instead).
 * @return {string} HTML string
 */
function renderAlCard(unit, selectedOpts, magicAbilities, renderOpts) {
  const id = unit.id ? `id="card-${esc(unit.id)}" ` : '';

  // Header — use renderOpts.unitName when provided (custom rename or auto-numbering)
  const displayName = (renderOpts && renderOpts.unitName) ? renderOpts.unitName : unit.name;

  let headerText;
  if (unit.type === 'character') {
    const lvlPart = unit.level ? 'Level\u00a0' + unit.level : '';
    const ctPart  = unit.charType
      ? (unit.charType.charAt(0).toUpperCase() + unit.charType.slice(1))
      : '';
    const prefix  = [lvlPart, ctPart].filter(Boolean).join('\u00a0');
    headerText    = (prefix ? prefix + '\u00a0\u00b7\u00a0' : '') + esc(displayName);
  } else {
    const hideAllowance = renderOpts && renderOpts.hideAllowance;
    const allowance = (!hideAllowance && unit.allowance != null && unit.allowance !== '')
      ? esc(unit.allowance) + '\u00a0'
      : '';
    headerText = allowance + esc(displayName);
  }
  const header =
    `<div class="al-header">${headerText}</div>` +
    `<div class="al-header-gap"></div>`;

  // Body — dispatched by card type
  let body;
  switch (unit.type) {
    case 'character':
      body = renderCharacter(unit,
        selectedOpts != null ? selectedOpts : null,
        magicAbilities || null);
      break;
    case 'warmachine':
      body = renderWarMachine(unit);
      break;
    case 'waraltar':
      body = renderWarAltar(unit);
      break;
    case 'handler':
      body = renderHandler(unit);
      break;
    case 'chariot':
      body = renderChariot(unit);
      break;
    case 'aggregate':
      body = renderAggregate(unit);
      break;
    case 'standard':
    default:
      body = renderStandard(unit);
      break;
  }

  return `<div class="al-card" ${id}>${header}${body}</div>`;
}

/* ── CommonJS / Node export (also works in browser via script tag) ─────── */
if (typeof module !== 'undefined') module.exports = { renderAlCard };
