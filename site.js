const BATCH = 24;      // items added to the DOM per scroll step
const grid = document.getElementById('grid');
const sentinel = document.getElementById('sentinel');

let manifest, tab, ids, shown;

// Titles: battles show their number, dailies show DD.MM.YYYY
const title = (id) =>
  tab === 'battles' ? id : id.split('.').map((p, i) => (i < 2 ? p.padStart(2, '0') : p)).join('.');

// Scaffolding some solutions need: they were written inside cssbattle's
// .frame wrapper without linking frame.css, so supply it, neutralising the
// absolute centering (the iframe itself is the 400x300 frame).
const FRAME_FIX = `<style>.frame{width:400px;height:300px;overflow:hidden;position:relative;
  margin:0;top:0;left:0;border-radius:0;box-shadow:none}</style>`;

// cssbattle clips output to the 400x300 box, so never allow scrolling.
const NO_SCROLL = '<style>html{overflow:hidden!important}</style>';

// Fetch the raw snippet and drop it in via srcdoc. No doctype is added, so
// the iframe renders in quirks mode with default body margin, as on cssbattle.
const loader = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    loader.unobserve(e.target);
    load(e.target);
  }
}, { rootMargin: '600px' });

async function load(frame) {
  try {
    const res = await fetch(frame.dataset.src);
    let html = await res.text();
    if (/class=["']?frame/.test(html)) html = FRAME_FIX + html;
    frame.srcdoc = NO_SCROLL + html;
  } catch {
    frame.srcdoc = 'failed to load';
  }
}

function addBatch() {
  const next = ids.slice(shown, shown + BATCH);
  const frag = document.createDocumentFragment();
  for (const id of next) {
    const item = document.createElement('section');
    item.className = 'item';
    const h = document.createElement('h2');
    h.textContent = title(id);
    const f = document.createElement('iframe');
    f.scrolling = 'no';
    f.sandbox = '';                         // static CSS only; no scripts needed
    f.title = title(id);
    f.dataset.src = `${tab}/${id}.html`;
    item.append(h, f);
    frag.append(item);
    loader.observe(f);
  }
  grid.append(frag);
  shown += next.length;
  if (shown >= ids.length) scroller.disconnect();
}

const scroller = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) addBatch();
}, { rootMargin: '800px' });

function setTab(name) {
  tab = name;
  ids = manifest[tab];
  shown = 0;
  grid.replaceChildren();
  document.querySelectorAll('nav button').forEach((b) =>
    b.classList.toggle('active', b.dataset.tab === name));
  location.hash = name;
  window.scrollTo(0, 0);
  scroller.disconnect();
  addBatch();
  scroller.observe(sentinel);
}

document.querySelector('nav').addEventListener('click', (e) => {
  if (e.target.dataset.tab) setTab(e.target.dataset.tab);
});

fetch('manifest.json').then((r) => r.json()).then((m) => {
  manifest = m;
  setTab(location.hash === '#battles' ? 'battles' : 'daily');
});
