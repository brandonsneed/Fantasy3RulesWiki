import sys, io

with open('D:/Tabletop games/Warhammer Fantasy Battle/3rd edition/Wiki Project/wfb3-wiki/army-list.html', 'r', encoding='utf-8') as f:
    content = f.read()

changes = []

# 1. CSS: add custom force separator colour
changes.append((
    '.force-sep-main { border-left-color: #8a7040; }\n.force-sep-ally { border-left-color: #3a6a8a; }\n.force-sep-merc { border-left-color: #6a3a3a; }',
    '.force-sep-main { border-left-color: #8a7040; }\n.force-sep-ally { border-left-color: #3a6a8a; }\n.force-sep-merc { border-left-color: #6a3a3a; }\n.force-sep-custom { border-left-color: #7a5a9a; }'
))

# 2. CSS: add custom badge colour after merc badge style
changes.append((
    '.force-sep-merc .fs-type-badge { color: #c87060; background: #200808; border: 1px solid #6a2010; }',
    '.force-sep-merc .fs-type-badge { color: #c87060; background: #200808; border: 1px solid #6a2010; }\n.force-sep-custom .fs-type-badge { color: #b898d8; background: #180828; border: 1px solid #5a2a8a; }'
))

# 3. CSS: add custom badge style (before Saved Lists overlay comment)
changes.append((
    '/* ── Saved Lists overlay ── */',
    '/* ── Custom unit badge ── */\n.alb-custom-badge { font-family: \'Barlow Condensed\', sans-serif; font-size: 8px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #b898d8; padding: 3px 8px 2px; border-top: 1px solid #252535; }\n\n/* ── Saved Lists overlay ── */'
))

# 4. HTML topbar: add Import Card button and hidden file input
changes.append((
    '<button class="topbar-btn dim" onclick="openSaves()">&#9776; Saved Lists</button>',
    '<input type="file" id="custom-import-file" accept=".json" style="display:none" onchange="importCustomUnitFile(this)">\n    <button class="topbar-btn dim" onclick="document.getElementById(\'custom-import-file\').click()">&#8593; Import Card</button>\n    <button class="topbar-btn dim" onclick="openSaves()">&#9776; Saved Lists</button>'
))

# 5. JS: add CUSTOM_KEY constant and helper functions
changes.append((
    'const SAVES_KEY  = "wfb3-army-saves";\n\n/* ═══ STATE ═══ */',
    'const SAVES_KEY  = "wfb3-army-saves";\nconst CUSTOM_KEY = "wfb3-custom-units";\n\n/* ═══ CUSTOM UNIT HELPERS ═══ */\nfunction getCustomUnits() {\n  try { return JSON.parse(localStorage.getItem(CUSTOM_KEY) || \'[]\'); } catch(e) { return []; }\n}\nfunction saveCustomUnits(units) {\n  localStorage.setItem(CUSTOM_KEY, JSON.stringify(units));\n}\nfunction mergeCustomUnits(incoming) {\n  var existing = getCustomUnits();\n  incoming.forEach(function(u) {\n    var idx = existing.findIndex(function(e) { return e.id === u.id; });\n    if (idx >= 0) existing[idx] = u; else existing.push(u);\n  });\n  saveCustomUnits(existing);\n}\n\n/* ═══ STATE ═══ */'
))

# 6. JS: add inferCustomAssignments before saveCards
changes.append((
    'function saveCards() {\n  // Strip html field before saving (don\'t persist large HTML blobs for official units)',
    'function inferCustomAssignments() {\n  var currentArmy = \'__custom__\';\n  cards.forEach(function(c) {\n    var u = lookupUnit(c.sourceId);\n    if (u && u.army) {\n      currentArmy = u.army;\n    } else if ((u && u.isCustom) || c.html) {\n      c.assignedArmy = currentArmy;\n    }\n  });\n}\n\nfunction saveCards() {\n  inferCustomAssignments();\n  // Strip html field before saving (don\'t persist large HTML blobs for official units)'
))

# 7. JS: update lookupUnit
changes.append((
    'function lookupUnit(sourceId) {\n  if (!sourceId || typeof WFB3_UNITS === \'undefined\') return null;\n  const id = sourceId.replace(/^card-/, \'\');\n  return WFB3_UNITS.find(function(u) { return u.id === id; }) || null;\n}',
    'function lookupUnit(sourceId) {\n  if (!sourceId) return null;\n  const id = sourceId.replace(/^card-/, \'\');\n  if (typeof WFB3_UNITS !== \'undefined\') {\n    const official = WFB3_UNITS.find(function(u) { return u.id === id; });\n    if (official) return official;\n  }\n  return getCustomUnits().find(function(u) { return u.id === id; }) || null;\n}'
))

# 8. JS: update resolveCardHtml
changes.append((
    'function resolveCardHtml(item, displayName) {\n  // Official unit via sourceId (strip "card-" prefix if present — wiki buttons add it)\n  if (item.sourceId && typeof WFB3_UNITS !== \'undefined\' && typeof renderAlCard !== \'undefined\') {\n    const normalizedId = item.sourceId.replace(/^card-/, \'\');\n    const unit = WFB3_UNITS.find(function(u) { return u.id === normalizedId; });\n    if (unit) {\n      const isChar = isCharUnit(unit);\n      const opts   = isChar ? (item.optionsSelected || {}) : undefined;\n      const mab    = isChar ? (item.magicAbilities  || {}) : undefined;\n      const rOpts  = { hideAllowance: true };\n      if (displayName) rOpts.unitName = displayName;\n      return renderAlCard(unit, opts, mab, rOpts);\n    }\n  }',
    'function resolveCardHtml(item, displayName) {\n  // Official or custom unit via sourceId\n  if (item.sourceId && typeof renderAlCard !== \'undefined\') {\n    const normalizedId = item.sourceId.replace(/^card-/, \'\');\n    let unit = null;\n    if (typeof WFB3_UNITS !== \'undefined\') {\n      unit = WFB3_UNITS.find(function(u) { return u.id === normalizedId; });\n    }\n    if (!unit) unit = getCustomUnits().find(function(u) { return u.id === normalizedId; });\n    if (unit) {\n      const isChar = isCharUnit(unit);\n      const opts   = isChar ? (item.optionsSelected || {}) : undefined;\n      const mab    = isChar ? (item.magicAbilities  || {}) : undefined;\n      const rOpts  = { hideAllowance: true };\n      if (displayName) rOpts.unitName = displayName;\n      return renderAlCard(unit, opts, mab, rOpts);\n    }\n  }'
))

# 9. JS: update getForceArmyId and getForceType
changes.append((
    'function getForceArmyId(item) {\n    const u = lookupUnit(item.sourceId);\n    return (u && u.army) ? u.army : \'__unknown__\';\n  }\n  function getForceType(armyId) {\n    if (!armyId || armyId === \'__unknown__\') return \'other\';\n    if (armyId.startsWith(\'ally-\')) return \'ally\';\n    if (armyId.startsWith(\'merc-\')) return \'merc\';\n    return \'main\';\n  }',
    'function getForceArmyId(item) {\n    const u = lookupUnit(item.sourceId);\n    if (u && u.army) return u.army;\n    if ((u && u.isCustom) || item.html) return item.assignedArmy || \'__custom__\';\n    return \'__unknown__\';\n  }\n  function getForceType(armyId) {\n    if (!armyId || armyId === \'__unknown__\') return \'other\';\n    if (armyId === \'__custom__\') return \'custom\';\n    if (armyId.startsWith(\'ally-\')) return \'ally\';\n    if (armyId.startsWith(\'merc-\')) return \'merc\';\n    return \'main\';\n  }'
))

# 10. JS: update typeOrder
changes.append((
    'const typeOrder = { main: 0, ally: 1, merc: 2, other: 3 };',
    'const typeOrder = { main: 0, ally: 1, merc: 2, custom: 4, other: 3 };'
))

# 11. JS: update buildForceSeparatorShell for custom
changes.append((
    'function buildForceSeparatorShell(forceId, forceType) {\n    var armyDef = WFB3_ARMIES.find(function(a) { return a.id === forceId; });\n    var armyName = armyDef ? armyDef.name : forceId;\n    var typeLabel = forceType === \'main\' ? \'Main Force\' : forceType === \'ally\' ? \'Allies\' : \'Mercenaries\';',
    'function buildForceSeparatorShell(forceId, forceType) {\n    var armyDef = WFB3_ARMIES.find(function(a) { return a.id === forceId; });\n    var armyName = forceId === \'__custom__\' ? \'Custom Units\' : (armyDef ? armyDef.name : forceId);\n    var typeLabel = forceType === \'main\' ? \'Main Force\' : forceType === \'ally\' ? \'Allies\'\n                  : forceType === \'merc\' ? \'Mercenaries\' : \'Custom\';'
))

# 12. JS: update openExport to embed custom units
changes.append((
    'function openExport() {\n  const data = {\n    header: JSON.parse(localStorage.getItem(HEADER_KEY) || "{}"),\n    list: cards.map(function(c) {\n      // Export without html blob\n      const out = Object.assign({}, c);\n      delete out.html;\n      return out;\n    })\n  };\n  document.getElementById("export-text").value = JSON.stringify(data, null, 2);',
    'function openExport() {\n  var usedCustomIds = new Set(cards.filter(function(c) {\n    var u = lookupUnit(c.sourceId); return u && u.isCustom;\n  }).map(function(c) { return c.sourceId; }));\n  var embedCustoms = getCustomUnits().filter(function(u) { return usedCustomIds.has(u.id); });\n  const data = {\n    header: JSON.parse(localStorage.getItem(HEADER_KEY) || "{}"),\n    list: cards.map(function(c) {\n      const out = Object.assign({}, c);\n      delete out.html;\n      return out;\n    })\n  };\n  if (embedCustoms.length) data.customUnits = embedCustoms;\n  document.getElementById("export-text").value = JSON.stringify(data, null, 2);'
))

# 13. JS: update doImport to restore custom units
changes.append((
    '    const list = Array.isArray(data) ? data : (data.list || []);\n    const hdr  = Array.isArray(data) ? null : (data.header || null);\n    if (!Array.isArray(list)) throw new Error("Expected an array of units.");\n    cards = list;\n    saveCards();',
    '    const list = Array.isArray(data) ? data : (data.list || []);\n    const hdr  = Array.isArray(data) ? null : (data.header || null);\n    const incomingCustoms = Array.isArray(data) ? [] : (data.customUnits || []);\n    if (!Array.isArray(list)) throw new Error("Expected an array of units.");\n    if (incomingCustoms.length) mergeCustomUnits(incomingCustoms);\n    cards = list;\n    saveCards();'
))

# 14. JS: update saveCurrent to embed custom units
changes.append((
    '  var entry = {\n    name: name,\n    savedAt: new Date().toISOString(),\n    header: hdr,\n    list: cards.map(function(c) {\n      var copy = Object.assign({}, c);\n      delete copy.html;\n      return copy;\n    })\n  };',
    '  var usedCustomIds2 = new Set(cards.filter(function(c) {\n    var u = lookupUnit(c.sourceId); return u && u.isCustom;\n  }).map(function(c) { return c.sourceId; }));\n  var embedCustoms2 = getCustomUnits().filter(function(u) { return usedCustomIds2.has(u.id); });\n  var entry = {\n    name: name,\n    savedAt: new Date().toISOString(),\n    header: hdr,\n    list: cards.map(function(c) {\n      var copy = Object.assign({}, c);\n      delete copy.html;\n      return copy;\n    })\n  };\n  if (embedCustoms2.length) entry.customUnits = embedCustoms2;'
))

# 15. JS: update loadSave to restore custom units
changes.append((
    '  cards = save.list || [];\n  localStorage.setItem(LIST_KEY, JSON.stringify(cards));\n\n  closeOverlay("saves-overlay");\n  renderGrid();\n  updateTotals();\n  updatePrintHeader();\n}',
    '  if (save.customUnits && save.customUnits.length) mergeCustomUnits(save.customUnits);\n  cards = save.list || [];\n  localStorage.setItem(LIST_KEY, JSON.stringify(cards));\n\n  closeOverlay("saves-overlay");\n  renderGrid();\n  updateTotals();\n  updatePrintHeader();\n}'
))

# 16. JS: update buildArmyBrowser to add Custom section
changes.append((
    '  makeSection("Mercenaries", mercArmies);\n\n  // Auto-select first army\n  if (mainArmies.length) selectBrowserArmy(mainArmies[0].id);',
    '  makeSection("Mercenaries", mercArmies);\n\n  // Custom units section\n  var custLabel = document.createElement("div");\n  custLabel.className = "browser-section-label";\n  custLabel.textContent = "Custom";\n  container.appendChild(custLabel);\n  var custGrid = document.createElement("div");\n  custGrid.className = "browser-army-grid";\n  var custBtn = document.createElement("button");\n  custBtn.className = "browser-army-btn";\n  custBtn.dataset.armyId = \'__custom__\';\n  custBtn.textContent = "Custom Units";\n  custBtn.onclick = function() { selectBrowserArmy(\'__custom__\'); };\n  custGrid.appendChild(custBtn);\n  container.appendChild(custGrid);\n\n  // Auto-select first army\n  if (mainArmies.length) selectBrowserArmy(mainArmies[0].id);'
))

# 17. JS: add renderBrowserCustomUnits + importCustomUnitFile before renderBrowserUnits
changes.append((
    'function renderBrowserUnits(armyId, filter) {\n  const container = document.getElementById("browser-units");\n  container.innerHTML = "";\n\n  if (typeof WFB3_UNITS === \'undefined\') {',
    'function renderBrowserCustomUnits(filter) {\n  const container = document.getElementById("browser-units");\n  container.innerHTML = "";\n  const hdr = document.createElement("div");\n  hdr.className = "browser-units-header";\n  hdr.textContent = "Custom Units" + (filter ? " — filtered" : "");\n  container.appendChild(hdr);\n  const customs = getCustomUnits();\n  const filtered = filter\n    ? customs.filter(function(u) { return u.name.toLowerCase().includes(filter); })\n    : customs;\n  if (!filtered.length) {\n    const em = document.createElement("div");\n    em.className = "browser-empty";\n    em.textContent = customs.length\n      ? \'No units match "\' + filter + \'".\'\n      : "No custom units yet. Use the Card Editor’s + Army List or Export Card buttons.";\n    container.appendChild(em);\n  } else {\n    filtered.forEach(function(unit) {\n      const row = document.createElement("div");\n      row.className = "browser-unit-row";\n      const info = document.createElement("div");\n      info.className = "browser-unit-info";\n      const nameEl = document.createElement("div");\n      nameEl.className = "browser-unit-name";\n      nameEl.textContent = unit.name;\n      info.appendChild(nameEl);\n      const meta = document.createElement("div");\n      meta.className = "browser-unit-meta";\n      const pts = unit.ptsFixed != null ? unit.ptsFixed + " pts"\n                 : unit.ptsPerModel != null ? unit.ptsPerModel + " pts/model" : "";\n      meta.textContent = (unit.type || "standard") + (pts ? "  ·  " + pts : "");\n      info.appendChild(meta);\n      const addBtn = document.createElement("button");\n      addBtn.className = "browser-add-btn";\n      addBtn.textContent = "+ Add";\n      addBtn.onclick = (function(u) {\n        return function() {\n          addCardFromBrowser({ sourceId: u.id, label: u.name });\n          addBtn.textContent = "✓ Added";\n          addBtn.classList.add("just-added");\n          setTimeout(function() { addBtn.textContent = "+ Add"; addBtn.classList.remove("just-added"); }, 1500);\n        };\n      })(unit);\n      row.appendChild(info);\n      row.appendChild(addBtn);\n      container.appendChild(row);\n    });\n  }\n  var importRow = document.createElement("div");\n  importRow.style.cssText = "padding:8px 10px 4px;";\n  var importBtn = document.createElement("button");\n  importBtn.className = "browser-add-btn";\n  importBtn.style.cssText = "width:100%;padding:5px 8px;";\n  importBtn.textContent = "↑ Import Custom Unit File";\n  importBtn.onclick = function() { document.getElementById(\'custom-import-file\').click(); };\n  importRow.appendChild(importBtn);\n  container.appendChild(importRow);\n}\n\nfunction importCustomUnitFile(fileInput) {\n  var file = fileInput.files[0];\n  if (!file) return;\n  var reader = new FileReader();\n  reader.onload = function(e) {\n    try {\n      var def = JSON.parse(e.target.result);\n      if (!def.id || !def.name || !def.isCustom) throw new Error("Not a valid custom unit file.");\n      mergeCustomUnits([def]);\n      if (browserArmyId === \'__custom__\') renderBrowserUnits(\'__custom__\', document.getElementById(\'browser-search\').value.toLowerCase().trim());\n      var toast = document.createElement(\'div\');\n      toast.style.cssText = \'position:fixed;bottom:20px;right:20px;background:#4a2a7a;color:#e8d8ff;font-family:"Barlow Condensed",sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:9px 18px;border-radius:2px;z-index:9999;box-shadow:2px 2px 8px #0006;\';\n      toast.textContent = \'✓ "\' + def.name + \'" added to library\';\n      document.body.appendChild(toast);\n      setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 2500);\n    } catch(err) {\n      alert("Import failed: " + err.message);\n    }\n    fileInput.value = \'\';\n  };\n  reader.readAsText(file);\n}\n\nfunction renderBrowserUnits(armyId, filter) {\n  const container = document.getElementById("browser-units");\n  container.innerHTML = "";\n\n  if (armyId === \'__custom__\') { renderBrowserCustomUnits(filter); return; }\n\n  if (typeof WFB3_UNITS === \'undefined\') {'
))

# 18. JS: init - call inferCustomAssignments after loading cards
changes.append((
    '  // Restore cards\n  cards = JSON.parse(localStorage.getItem(LIST_KEY) || "[]");\n\n  // Render\n  renderGrid();',
    '  // Restore cards\n  cards = JSON.parse(localStorage.getItem(LIST_KEY) || "[]");\n  inferCustomAssignments();\n\n  // Render\n  renderGrid();'
))

# 19. JS: createWrapper - track isCustom flag
changes.append((
    '    const renameUnitData = lookupUnit(item.sourceId);\n    const renameIsChar   = isCharUnit(renameUnitData);',
    '    const renameUnitData = lookupUnit(item.sourceId);\n    const renameIsChar   = isCharUnit(renameUnitData);\n    const renameIsCustom = !!(renameUnitData && renameUnitData.isCustom);'
))

# 20. JS: createWrapper - add custom badge before wrapper.appendChild(controls)
changes.append((
    '    wrapper.appendChild(controls);\n    return wrapper;',
    '    if (renameIsCustom) {\n      var customBadgeEl = document.createElement("div");\n      customBadgeEl.className = "alb-custom-badge";\n      customBadgeEl.textContent = "⚙ Custom Unit";\n      controls.appendChild(customBadgeEl);\n    }\n    wrapper.appendChild(controls);\n    return wrapper;'
))

# Apply all changes
ok = 0
miss = 0
for old, new in changes:
    if old in content:
        content = content.replace(old, new, 1)
        ok += 1
    else:
        miss += 1
        # Print first 80 chars to identify which one failed
        print('MISS:', repr(old[:80]))

print(f'Applied {ok}/{ok+miss} changes')

with open('D:/Tabletop games/Warhammer Fantasy Battle/3rd edition/Wiki Project/wfb3-wiki/army-list.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Saved. New length:', len(content))
