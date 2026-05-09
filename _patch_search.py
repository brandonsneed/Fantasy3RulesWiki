import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

PATH = 'D:/Tabletop games/Warhammer Fantasy Battle/3rd edition/Wiki Project/wfb3-wiki/index.html'

with open(PATH, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Locate block boundaries by unique content
start = next(i for i, l in enumerate(lines) if 'let searchIndex = [];' in l)
end   = next(i for i, l in enumerate(lines) if "// ── PERSISTENCE" in l)

print(f'Replacing lines {start+1}–{end} ({end - start} lines)')

NEW_BLOCK = r"""let searchIndex = [];
let searchSelectedIdx = -1;

function buildSearchIndex() {
  searchIndex = [];
  // Index JS store entries (dynamic pages)
  Object.entries(store).forEach(([key, items]) => {
    const meta = Object.values(sectionMeta).find(m => m.key === key) || sectionMeta[key];
    items.forEach((item, i) => {
      const title = item.name || item.title || null;
      if (!title) return;
      const searchText = [item.name, item.description, item.subtitle, item.special, item.notes]
        .filter(Boolean).join(' ').toLowerCase();
      searchIndex.push({ title, section: meta?.label || key, pageId: key, sectionId: null, idx: i, searchText });
    });
  });
  // Index all static wiki-section elements across all pages
  document.querySelectorAll('.page[id]').forEach(pageEl => {
    const pageId = pageEl.id.replace(/^page-/, '');
    const pageMeta = sectionMeta[pageId];
    const pageLabel = pageMeta?.label || pageId;
    pageEl.querySelectorAll('.wiki-section[id]').forEach(sec => {
      const heading = sec.querySelector('h3, h4');
      const title = heading ? heading.textContent.trim() : null;
      if (!title) return;
      const bodyText = sec.textContent.replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 4000);
      searchIndex.push({ title, section: pageLabel, pageId, sectionId: sec.id, idx: null, searchText: bodyText });
    });
  });
}

function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function scoreEntry(entry, words) {
  // AND search: every word must appear somewhere in the entry
  const titleLo = entry.title ? entry.title.toLowerCase() : '';
  const bodyLo  = entry.searchText || '';
  let score = 0, firstPos = -1;
  for (const w of words) {
    const wbRe       = new RegExp('\\b' + escRe(w));
    const inTitleSub  = titleLo.includes(w);
    const inTitleWord = wbRe.test(titleLo);
    const inBodySub   = bodyLo.includes(w);
    const inBodyWord  = wbRe.test(bodyLo);
    if (!inTitleSub && !inBodySub) return { score: 0, pos: -1 }; // AND: all words must match
    score += inTitleWord ? 4 : inTitleSub ? 2 : 0;
    score += inBodyWord  ? 2 : inBodySub  ? 1 : 0;
    if (firstPos < 0) { const p = bodyLo.indexOf(w); if (p >= 0) firstPos = p; }
  }
  return { score, pos: firstPos };
}

function makeSnippet(rawText, words) {
  if (!rawText) return '';
  const lo = rawText.toLowerCase();
  let best = rawText.length;
  for (const w of words) { const p = lo.indexOf(w); if (p >= 0 && p < best) best = p; }
  const start = Math.max(0, best - 35);
  const end   = Math.min(rawText.length, best + 90);
  let snip = (start > 0 ? '…' : '') + rawText.slice(start, end).trim() + (end < rawText.length ? '…' : '');
  for (const w of words) {
    snip = snip.replace(new RegExp('(' + escRe(w) + ')', 'gi'), '<mark>$1</mark>');
  }
  return snip;
}

function renderSearchResults(hits) {
  const res = document.getElementById('search-results');
  searchSelectedIdx = -1;
  if (!hits.length) { res.style.display = 'none'; return; }
  res._hits = hits;
  res.style.display = 'block';
  res.innerHTML = hits.map((h, i) =>
    `<div class="sr-item" data-hit="${i}">` +
    `<div class="sr-title">${h.title}</div>` +
    `<div class="sr-section">${h.section}</div>` +
    (h.snippet ? `<div class="sr-snippet">${h.snippet}</div>` : '') +
    `</div>`
  ).join('');
}

document.getElementById('search-input').addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  const res = document.getElementById('search-results');
  if (!q) { res.style.display = 'none'; searchSelectedIdx = -1; return; }
  const words = q.split(/\s+/).filter(Boolean);
  const scored = searchIndex
    .map(e => {
      const { score } = scoreEntry(e, words);
      if (!score) return null;
      return { ...e, score, snippet: makeSnippet(e.searchText, words) };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
  renderSearchResults(scored);
});

document.getElementById('search-input').addEventListener('keydown', function(e) {
  const res = document.getElementById('search-results');
  const items = res.querySelectorAll('.sr-item');
  if (e.key === 'Escape') { res.style.display = 'none'; this.blur(); return; }
  if (!items.length) return;
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    searchSelectedIdx = Math.min(searchSelectedIdx + 1, items.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    searchSelectedIdx = Math.max(searchSelectedIdx - 1, 0);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const idx = searchSelectedIdx >= 0 ? searchSelectedIdx : 0;
    const h = res._hits && res._hits[idx];
    if (h) handleSearchClick(h.pageId, h.idx, h.sectionId);
    return;
  } else { return; }
  items.forEach((el, i) => el.classList.toggle('selected', i === searchSelectedIdx));
  items[searchSelectedIdx]?.scrollIntoView({ block: 'nearest' });
});

document.getElementById('search-results').addEventListener('click', function(e) {
  const item = e.target.closest('.sr-item');
  if (!item) return;
  const h = this._hits && this._hits[parseInt(item.dataset.hit, 10)];
  if (h) handleSearchClick(h.pageId, h.idx, h.sectionId);
});

// Ctrl+K or / to jump to search
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const inp = document.getElementById('search-input');
    inp.focus(); inp.select();
  } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault();
    const inp = document.getElementById('search-input');
    inp.focus(); inp.select();
  }
});

document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrap')) {
    document.getElementById('search-results').style.display = 'none';
  }
});

"""

lines[start:end] = [NEW_BLOCK]

with open(PATH, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Done. New line count:', len(lines))
