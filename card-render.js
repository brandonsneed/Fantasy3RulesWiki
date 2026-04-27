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
 * @param {Array}  options      unit.options array
 * @param {Object} selectedOpts { optionName: true, ... }
 */
function buildSelectedOptions(options, selectedOpts) {
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
  let html = '<div class="al-opts"><div class="al-opts-h">Upgrades</div>';
  chosen.forEach(function(item) {
    html +=
      `<div class="al-opt">` +
      `<span class="al-opt-n">${esc(item.name)}</span>` +
      `<span class="al-opt-d"></span>` +
      `<span class="al-opt-c">${esc(item.cost)}</span>` +
      `</div>`;
  });
  html += '</div>';
  return html;
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
  if (!unit.art) return '';
  // art path is used directly in src — not escaped (it's a file path, not user text)
  const altText = esc(unit.name || '');
  return `<div class="${cssClass}"><img src="${unit.art}" alt="${altText}"></div>`;
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
  if (unit.art) {
    body += `<div class="al-handler-art"><img src="${unit.art}" alt="${esc(unit.name || '')}"></div>`;
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
  if (unit.art) {
    html += `<div class="al-wm-art"><img src="${unit.art}" alt="${esc(unit.name || '')}"></div>`;
  }

  // Options block (between art and footer, if present)
  if (unit.options && unit.options.length) {
    html += `<div style="padding:4px 10px 6px">` + buildOptions(unit.options) + `</div>`;
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
  if (unit.art) {
    artPanel = `<div class="al-chariot-art"><img src="${unit.art}" alt="${esc(unit.name || '')}"></div>`;
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

  // Options (if any)
  if (unit.options && unit.options.length) {
    html += `<div style="padding:4px 10px 6px">` + buildOptions(unit.options) + `</div>`;
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
  if (unit.art) {
    html += `<div class="al-wm-art"><img src="${unit.art}" alt="${esc(unit.name || '')}"></div>`;
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
 * @param {Object|null} selectedOpts  When provided (army-list context) only the
 *   chosen options are rendered on the card.  When null/undefined (wiki / preview
 *   context) the full options catalogue is shown.
 */
function renderCharacter(unit, selectedOpts) {
  let html = buildProfileTable(unit.profiles);
  if (unit.profileNote) html += buildProfileNote(unit.profileNote);

  // Art panel (placeholder when no art)
  let artHtml;
  if (unit.art) {
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
    info +=
      `<div class="al-row">` +
      `<span class="al-lbl">Type:</span>` +
      `<span class="al-val">${esc(ct)}</span>` +
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

  // Options: filtered to selected only (army-list) or full catalogue (preview/wiki)
  if (selectedOpts != null) {
    info += buildSelectedOptions(unit.options, selectedOpts);
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
 * renderAlCard(unit, selectedOpts)
 *
 * Takes a unit data object (matching the shape in units-data.js) and
 * returns a complete .al-card div HTML string.
 *
 * @param  {Object}      unit
 * @param  {Object|null} selectedOpts  Optional map of { optionName: true } for
 *   character cards in the army list builder.  When provided only chosen options
 *   are shown on the card; when omitted the full options catalogue is shown.
 * @return {string} HTML string
 */
function renderAlCard(unit, selectedOpts) {
  const id = unit.id ? `id="card-${esc(unit.id)}" ` : '';

  // Header — characters get a "Level N Chartype · Name" header
  let headerText;
  if (unit.type === 'character') {
    const lvlPart = unit.level ? 'Level\u00a0' + unit.level : '';
    const ctPart  = unit.charType
      ? (unit.charType.charAt(0).toUpperCase() + unit.charType.slice(1))
      : '';
    const prefix  = [lvlPart, ctPart].filter(Boolean).join('\u00a0');
    headerText    = (prefix ? prefix + '\u00a0\u00b7\u00a0' : '') + esc(unit.name);
  } else {
    const allowance = (unit.allowance != null && unit.allowance !== '') ? esc(unit.allowance) + ' ' : '';
    headerText = allowance + esc(unit.name);
  }
  const header =
    `<div class="al-header">${headerText}</div>` +
    `<div class="al-header-gap"></div>`;

  // Body — dispatched by card type
  let body;
  switch (unit.type) {
    case 'character':
      body = renderCharacter(unit, selectedOpts != null ? selectedOpts : null);
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
