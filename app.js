'use strict';
/* Kardio plan: logika aplikacije. Sadržaj je u data.js (window.KARDIO). */
(function () {
  const D = window.KARDIO;

  /* ================= pomoćne ================= */
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  const keyOf = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const parseKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const dow = d => (d.getDay() + 6) % 7;
  const monday = d => addDays(d, -dow(d));
  const diffDays = (a, b) => Math.round((b - a) / 864e5);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const r0 = n => Math.round(n);
  const r1 = n => Math.round(n * 10) / 10;
  const fmtN = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const fmtKg = n => String(r1(n)).replace('.', ',');
  const DANI = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];
  const DANI_K = ['Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub', 'Ned'];
  const MES = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
  const fmtDate = d => d.getDate() + '. ' + MES[d.getMonth()];
  const fmtMin = s => { const m = Math.round(s / 60); return m >= 60 ? Math.floor(m / 60) + ' h ' + (m % 60 ? (m % 60) + ' min' : '') : m + ' min'; };
  const fmtClock = s => { s = Math.max(0, Math.ceil(s)); const m = Math.floor(s / 60); return (m >= 60 ? Math.floor(m / 60) + ':' + pad(m % 60) : m) + ':' + pad(s % 60); };

  /* ================= ikonice ================= */
  const IC = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    pulse: '<path d="M2 12h4l2.5-6 4 13 3-9 1.5 2H22"/>',
    food: '<path d="M7 2v9M4.5 2v6a2.5 2.5 0 0 0 5 0V2M7 11v11M17.5 22V2c-2.5 1.5-3.5 4.5-3.5 8.5h3.5"/>',
    book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/>',
    play: '<path d="M7 4.5v15l12.5-7.5z" fill="currentColor"/>',
    pause: '<rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor"/><rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor"/>',
    next: '<path d="M5 4.5v15l11-7.5z" fill="currentColor"/><path d="M19 5v14"/>',
    prev: '<path d="M19 4.5v15l-11-7.5z" fill="currentColor"/><path d="M5 5v14"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    drop: '<path d="M12 2.7 17.7 8.4a8 8 0 1 1-11.3 0z"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    steps: '<path d="M8 3c2 0 3 2 3 5s-1 5-3 5-3-2-3-5 1-5 3-5zM6 15h4v2a2 2 0 0 1-4 0zM16 7c2 0 3 2 3 5s-1 5-3 5-3-2-3-5 1-5 3-5zM14 19h4v1a2 2 0 0 1-4 0z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    flame: '<path d="M12 2c.5 3.5 5 5.5 5 11a5 5 0 0 1-10 0c0-2.6 1.4-4 2.2-5.6.6 1.3 1.3 2.1 2.3 2.6C11.8 7.6 12.4 5 12 2z"/>',
    zap: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
    chevR: '<path d="m9 18 6-6-6-6"/>',
    chevL: '<path d="m15 18-6-6 6-6"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
    swap: '<path d="M17 3l4 4-4 4M21 7H7M7 21l-4-4 4-4M3 17h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 22l5-3 5 3-1.5-8"/>',
    trend: '<path d="M3 7l6.5 6.5 4-4L21 17M15 17h6v-6"/>',
    alert: '<path d="M12 3 2 20h20zM12 10v4M12 17.5v.01"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5"/>',
    dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    wind: '<path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.5h11.6L22 7H6"/>',
    fridge: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14M9 5v2M9 13v3"/>',
    sound: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>',
    mute: '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6M16 9l6 6"/>',
    voice: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/>',
    cal: '<rect x="3" y="4.5" width="18" height="17" rx="2"/><path d="M3 10h18M8 2.5v4M16 2.5v4"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    scale: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 9a5 5 0 0 1 8 0l-3 3"/>'
  };
  const ic = (n, cls = '') => '<svg class="ic ' + cls + '" viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || '') + '</svg>';

  /* ================= stanje ================= */
  const KEY = 'kardio.v1';
  function defaultState() {
    return {
      v: 1,
      profil: { ime: '', pol: 'm', god: 30, visina: 178, tezina: 92, cilj: 82, start: keyOf(monday(today())), pismo: 'lat', zvuk: true, glas: false, tema: 'auto', podeseno: false },
      treninzi: {},   // datum -> {id, min, kcal, at}
      dani: {},       // datum -> {voda, obroci:[5], koraci, san}
      tezina: [],     // [{d, kg}]
      jelovnik: {},   // datum -> {slot: receptId}
      kupovina: {},   // ponedeljak -> [namirnice]
      omiljeni: [],
      frizider: [],
      prvi: keyOf(today()),
      updatedAt: 0
    };
  }
  function merge(base, src) {
    if (!src || typeof src !== 'object') return base;
    const out = { ...base, ...src };
    out.profil = { ...base.profil, ...(src.profil || {}) };
    return out;
  }
  let S = defaultState();
  try { const t = localStorage.getItem(KEY); if (t) S = merge(defaultState(), JSON.parse(t)); } catch (e) { /* bez lokalnog skladišta */ }

  // Sinhronizacija preko Claude db (ako je stranica otvorena kao Artifact)
  let dbRef = null, dbBusy = false, dbDirty = false, dbTimer = null, syncState = 'local';
  function saveLocal() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* nema */ } }
  function save() {
    S.updatedAt = Date.now();
    saveLocal();
    if (dbRef) { clearTimeout(dbTimer); dbTimer = setTimeout(flushDb, 1200); }
  }
  async function flushDb() {
    if (!dbRef) return;
    if (dbBusy) { dbDirty = true; return; }
    dbBusy = true;
    try { await dbRef.set(JSON.parse(JSON.stringify(S))); setSync('ok'); }
    catch (e) { setSync(e && e.code === 'quota_exceeded' ? 'full' : 'err'); if (e && (e.code === 'revoked' || e.code === 'invalid_argument')) dbRef = null; }
    dbBusy = false;
    if (dbDirty) { dbDirty = false; flushDb(); }
  }
  function setSync(s) { syncState = s; const el = $('#syncDot'); if (el) { el.dataset.s = s; el.title = syncLabel(); } }
  const syncLabel = () => ({ ok: 'Sačuvano na nalogu, isto na svim uređajima', err: 'Nalog nije dostupan, čuva se na ovom uređaju', full: 'Skladište je puno', local: 'Čuva se na ovom uređaju' }[syncState]);
  async function initDb() {
    try {
      if (!window.claude || typeof window.claude.use !== 'function') return;
      const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
      if (!db || !user) return;
      const id = await user.id();
      if (!id) return;
      dbRef = db.doc('data/users/' + id + '/stanje');
      const snap = await dbRef.get();
      const remote = snap.exists ? snap.data() : null;
      if (remote && (remote.updatedAt || 0) > (S.updatedAt || 0)) { S = merge(defaultState(), JSON.parse(JSON.stringify(remote))); saveLocal(); renderAll(); }
      else if (S.updatedAt) await flushDb();
      setSync('ok');
      dbRef.onSnapshot(sn => {
        if (!sn.exists || sn.metadata.hasPendingWrites) return;
        const r = sn.data();
        if ((r.updatedAt || 0) > (S.updatedAt || 0) && !P) { S = merge(defaultState(), JSON.parse(JSON.stringify(r))); saveLocal(); renderAll(); }
      }, () => setSync('err'));
    } catch (e) { dbRef = null; setSync('local'); }
  }

  /* ================= profil i računice ================= */
  const prof = () => S.profil;
  function trenutnaTezina() { const t = S.tezina; return t.length ? t[t.length - 1].kg : prof().tezina; }
  function ciljevi() {
    const p = prof(), kg = trenutnaTezina();
    const bmr = 10 * kg + 6.25 * p.visina - 5 * p.god + (p.pol === 'z' ? -161 : 5);
    const tdee = bmr * 1.5;
    const kcal = Math.max(p.pol === 'z' ? 1300 : 1600, Math.round((tdee - 500) / 10) * 10);
    const protein = Math.round(Math.max(p.cilj, 50) * 1.8);
    const masti = Math.round(kcal * 0.27 / 9);
    const uh = Math.max(80, Math.round((kcal - protein * 4 - masti * 9) / 4));
    const voda = clamp(Math.round(kg * 0.033 / 0.25), 8, 14);
    const hrMax = Math.round(208 - 0.7 * p.god);
    return { bmr: Math.round(bmr), tdee: Math.round(tdee), kcal, protein, masti, uh, voda, hrMax };
  }
  const ZONE = [
    { z: 1, n: 'Lagano, oporavak', od: 0.5, do: 0.6 }, { z: 2, n: 'Sagorevanje masti', od: 0.6, do: 0.7 },
    { z: 3, n: 'Umereno jako', od: 0.7, do: 0.8 }, { z: 4, n: 'Jako', od: 0.8, do: 0.9 }, { z: 5, n: 'Najjače', od: 0.9, do: 1 }
  ];
  const zonaBpm = z => { const m = ciljevi().hrMax, Z = ZONE[z - 1]; return Math.round(m * Z.od) + '–' + Math.round(m * Z.do); };

  /* ================= program ================= */
  function progInfo(date) {
    const start = monday(parseKey(prof().start));
    const d = diffDays(start, date);
    const week = Math.floor(d / 7) + 1;
    const phase = week <= 4 ? 0 : week <= 8 ? 1 : 2;
    return { week, dayNo: d + 1, before: d < 0, phase, deload: week === 4 || week === 8, slot: dow(date) };
  }
  function resolveWorkout(id, p) {
    const def = D.treninzi[id];
    const pick = v => Array.isArray(v) ? v[p.phase] : v;
    const blocks = def.b.filter(b => !b.faze || b.faze.includes(p.phase + 1)).map(b => {
      const out = { n: b.n, v: b.v, z: b.z, pauza: b.pauza || 0 };
      if (b.v === 'niz') {
        out.items = b.s.map(([ex, t]) => { let s = pick(t); if (p.deload && s >= 600) s = Math.round(s * 0.8 / 60) * 60; return { ex, t: s }; });
      } else if (b.v === 'krug') {
        out.runde = Math.max(1, pick(b.runde) - (p.deload && pick(b.runde) > 2 ? 1 : 0));
        out.rad = pick(b.rad); out.odmor = pick(b.odmor || 0); out.pr = pick(b.pr || 0);
        out.items = b.s.map(x => Array.isArray(x) ? { ex: x[0], t: pick(x[1]) } : { ex: x, t: out.rad });
      } else {
        out.odmor = pick(b.odmor);
        out.items = b.s.map(([ex, o]) => ({ ex, s: Math.max(2, pick(o.s) - (p.deload ? 1 : 0)), r: o.r != null ? pick(o.r) : null, t: o.t != null ? pick(o.t) : null, strana: o.strana }));
      }
      return out;
    });
    const w = { id, n: def.n, tip: def.tip, z: def.z, opis: def.opis, blocks, deload: p.deload, phase: p.phase };
    const steps = buildSteps(w);
    w.trajanje = steps.reduce((a, s) => a + (s.t || (s.r ? s.r * 3 * (s.strana ? 2 : 1) : 0)), 0);
    w.kcal = kcalOf(steps);
    return w;
  }
  function kcalOf(steps) {
    const f = trenutnaTezina() / 70;
    return Math.round(steps.reduce((a, s) => {
      if (s.kind === 'odmor' || s.kind === 'prep') return a + 1.5 * (s.t / 60);
      const k = D.vezbe[s.ex].k;
      const sec = s.t || s.r * 3 * (s.strana ? 2 : 1);
      return a + k * sec / 60;
    }, 0) * f);
  }
  function dayPlan(date) {
    const p = progInfo(date);
    if (p.before) return { ...p, rest: true, pre: true };
    const t = D.nedelja[p.slot];
    if (!t.w) return { ...p, rest: true };
    const wid = p.week % 2 === 1 ? t.w[0] : t.w[1];
    return { ...p, rest: false, wid, w: resolveWorkout(wid, p) };
  }
  function buildSteps(w) {
    const st = [];
    w.blocks.forEach((b, bi) => {
      const lastBlock = bi === w.blocks.length - 1;
      if (b.v === 'niz') b.items.forEach(it => st.push({ kind: 'rad', ex: it.ex, t: it.t, blok: b.n, z: b.z }));
      else if (b.v === 'krug') {
        for (let r = 1; r <= b.runde; r++) {
          b.items.forEach((it, i) => {
            st.push({ kind: 'rad', ex: it.ex, t: it.t, blok: b.n, z: b.z, runda: r, R: b.runde });
            const lastIt = i === b.items.length - 1;
            if (!lastIt && b.odmor > 0) st.push({ kind: 'odmor', t: b.odmor, blok: b.n, z: 1 });
            if (lastIt && r < b.runde && (b.pr || b.odmor) > 0) st.push({ kind: 'odmor', t: b.pr || b.odmor, blok: b.n, z: 1, label: 'Pauza između krugova' });
          });
        }
      } else {
        b.items.forEach((it, i) => {
          for (let s = 1; s <= it.s; s++) {
            st.push({ kind: it.t ? 'rad' : 'reps', ex: it.ex, t: it.t || 0, r: it.r, strana: it.strana, set: s, S: it.s, blok: b.n, z: b.z });
            if (!(i === b.items.length - 1 && s === it.s)) st.push({ kind: 'odmor', t: b.odmor, blok: b.n, z: 1 });
          }
        });
      }
      if (b.pauza && !lastBlock) st.push({ kind: 'odmor', t: b.pauza, blok: b.n, z: 1, label: 'Odmor između blokova' });
    });
    return st;
  }

  /* ================= opis treninga običnim rečima ================= */
  const vezbiW = n => n === 1 ? 'vežba' : n % 10 >= 2 && n % 10 <= 4 && (n < 10 || n > 20) ? 'vežbe' : 'vežbi';
  const krugW = n => n === 1 ? 'krug' : n < 5 ? 'kruga' : 'krugova';
  const serijaW = n => n === 1 ? 'serija' : n < 5 ? 'serije' : 'serija';
  const sek = t => t >= 120 ? fmtMin(t) : t + ' s';
  const gdeTrening = w => {
    const napolje = w.blocks.some(b => b.items.some(it => D.vezbe[it.ex].gde === 'napolje'));
    const soba = w.blocks.some(b => !/Zagrevanje|Istezanje na kraju/.test(b.n) && b.items.every(it => D.vezbe[it.ex].gde !== 'napolje'));
    return napolje && soba ? 'oba' : napolje ? 'napolje' : 'soba';
  };
  const gdeTxt = g => ({ napolje: 'Napolju', soba: 'U sobi', oba: 'Napolju, pa u sobi' }[g]);
  function oprema(w) {
    const set = new Set();
    w.blocks.forEach(b => b.items.forEach(it => { const o = D.vezbe[it.ex].opr; if (o) set.add(o); }));
    return [gdeTrening(w) === 'soba' ? 'patike i oko 2 × 2 m slobodnog prostora' : 'udobne patike'].concat([...set]);
  }
  const kisaTrening = w => { for (const b of w.blocks) for (const it of b.items) if (D.vezbe[it.ex].kisa) return D.vezbe[it.ex].kisa; return ''; };
  const blokSek = b => buildSteps({ blocks: [b] }).reduce((a, s) => a + (s.t || (s.r ? s.r * 3 * (s.strana ? 2 : 1) : 0)), 0);
  function blokOpis(b) {
    const n = b.items.length;
    if (b.v === 'niz') {
      if (n === 1) return b.items[0].t >= 300 ? 'Jedna vežba, bez prekida, ' + fmtMin(b.items[0].t) + '.' : 'Drži položaj ' + sek(b.items[0].t) + '.';
      return n + ' ' + vezbiW(n) + ' redom, jedna za drugom, bez pauze. Tajmer ti kaže kad da pređeš na sledeću.';
    }
    if (b.v === 'serije') return 'Svaku vežbu radiš u serijama. Posle svake serije ' + b.odmor + ' s odmora. Kad završiš sve serije jedne vežbe, prelaziš na sledeću. Posle serije dodirni „Završio sam seriju”.';
    if (!b.items.every(i => i.t === b.rad)) return 'Smenjuješ: ' + b.items.map(i => sek(i.t) + ' ' + D.vezbe[i.ex].n.toLowerCase()).join(', pa ') + '. To ponoviš ' + b.runde + ' puta, bez pauze.';
    return n + ' ' + vezbiW(n) + ' redom, svaka po ' + b.rad + ' s' + (b.odmor ? ', a posle svake ' + b.odmor + ' s odmora' : '') + '. To je jedan krug. ' +
      (b.runde > 1 ? 'Uradi ' + b.runde + ' ' + krugW(b.runde) + (b.pr ? ', između krugova ' + b.pr + ' s odmora.' : '.') : '') +
      (b.rad <= 20 ? ' Tih 20 s radiš najjače što možeš.' : '');
  }
  function kolicina(b, it) {
    if (b.v === 'serije') return it.s + ' ' + serijaW(it.s) + ' × ' + (it.t ? it.t + ' s' : it.r + ' ponavljanja' + (it.strana ? ' po nozi' : ''));
    return sek(it.t);
  }

  /* ================= dnevne obaveze ================= */
  const dan = k => S.dani[k] || { voda: 0, obroci: [0, 0, 0, 0, 0], koraci: 0, san: 0 };
  const setDan = (k, patch) => { S.dani[k] = { ...dan(k), ...patch }; save(); };
  function obaveze(k) {
    const date = parseKey(k), pl = dayPlan(date), d = dan(k), c = ciljevi();
    const tr = !!S.treninzi[k];
    const items = [
      { id: 'trening', n: pl.rest ? 'Šetnja od 30 min' : 'Trening', v: pl.rest ? (d.setnja ? 1 : 0) : (tr ? 1 : 0), txt: pl.rest ? (d.setnja ? 'Urađeno' : 'Dan odmora') : (tr ? 'Završen' : fmtMin(pl.w.trajanje)) },
      { id: 'voda', n: 'Voda', v: Math.min(1, d.voda / c.voda), txt: d.voda + ' / ' + c.voda + ' čaša' },
      { id: 'obroci', n: 'Obroci po planu', v: d.obroci.filter(Boolean).length / 5, txt: d.obroci.filter(Boolean).length + ' / 5' },
      { id: 'koraci', n: '8.000 koraka', v: d.koraci ? 1 : 0, txt: d.koraci ? 'Urađeno' : 'Nije još' },
      { id: 'san', n: 'San 7+ sati', v: d.san ? 1 : 0, txt: d.san ? 'Naspavan' : 'Nije još' }
    ];
    const score = items.reduce((a, i) => a + i.v, 0) / items.length;
    const ok = score >= 0.8 && items[0].v === 1;
    return { items, score, ok };
  }
  function streak() {
    let d = today(), n = 0;
    if (!obaveze(keyOf(d)).ok) d = addDays(d, -1);
    while (obaveze(keyOf(d)).ok && n < 2000) { n++; d = addDays(d, -1); }
    return n;
  }
  function najduziNiz() {
    const keys = Object.keys(S.dani).concat(Object.keys(S.treninzi)).sort();
    if (!keys.length) return 0;
    let best = 0, cur = 0, d = parseKey(keys[0]); const end = today();
    while (d <= end) { if (obaveze(keyOf(d)).ok) { cur++; best = Math.max(best, cur); } else cur = 0; d = addDays(d, 1); }
    return best;
  }

  /* ================= jelovnik ================= */
  const R = Object.fromEntries(D.recepti.map(r => [r.id, r]));
  const poObroku = o => D.recepti.filter(r => r.o === o);
  function makro(rec, f = 1) {
    let k = 0, p = 0, u = 0, m = 0, v = 0;
    rec.s.forEach(x => { if (Array.isArray(x)) { const n = D.namirnice[x[0]], g = x[1] / 100; k += n.k * g; p += n.p * g; u += n.u * g; m += n.m * g; v += n.v * g; } });
    return { k: r0(k * f), p: r0(p * f), u: r0(u * f), m: r0(m * f), v: r0(v * f) };
  }
  const SLOTS = ['dorucak', 'uzina1', 'rucak', 'uzina2', 'vecera'];
  const slotTip = s => D.obroci[s].tip || s;
  function menuFor(k) {
    const n = diffDays(new Date(2024, 0, 1), parseKey(k));
    const L = o => poObroku(o);
    const ui = L('uzina');
    const base = {
      dorucak: L('dorucak')[n % L('dorucak').length].id,
      uzina1: ui[(n * 2) % ui.length].id,
      rucak: L('rucak')[(n * 3) % L('rucak').length].id,
      uzina2: ui[(n * 2 + 5) % ui.length].id,
      vecera: L('vecera')[(n + 4) % L('vecera').length].id
    };
    const pl = dayPlan(parseKey(k));
    if (!pl.rest && pl.w && (pl.w.tip === 'hiit' || pl.w.tip === 'tabata' || pl.w.tip === 'krug')) base.uzina2 = 'smuti_posle';
    return { ...base, ...(S.jelovnik[k] || {}) };
  }
  // Porcije se skaliraju da jelovnik pogodi dnevni cilj kalorija
  function faktor(k) { const t = menuTotal(menuFor(k)).k; return t ? clamp(Math.round(ciljevi().kcal / t * 20) / 20, 0.75, 1.75) : 1; }
  const fmtF = f => '×' + f.toFixed(2).replace('.', ',');
  function menuTotal(m) { return SLOTS.reduce((a, s) => { const x = makro(R[m[s]]); a.k += x.k; a.p += x.p; a.u += x.u; a.m += x.m; return a; }, { k: 0, p: 0, u: 0, m: 0 }); }

  /* ================= pismo (latinica / ćirilica) ================= */
  const L2C = { a: 'а', b: 'б', v: 'в', g: 'г', d: 'д', đ: 'ђ', e: 'е', ž: 'ж', z: 'з', i: 'и', j: 'ј', k: 'к', l: 'л', m: 'м', n: 'н', o: 'о', p: 'п', r: 'р', s: 'с', t: 'т', ć: 'ћ', u: 'у', f: 'ф', h: 'х', c: 'ц', č: 'ч', š: 'ш' };
  const DIG = { lj: 'љ', nj: 'њ', dž: 'џ' };
  function cyrWord(w) {
    if (/[qwxyQWXY]/.test(w) || (/^[A-ZČĆŠŽĐ0-9]{2,}$/.test(w))) return w;
    let out = '';
    for (let i = 0; i < w.length; i++) {
      const two = w.substr(i, 2), low2 = two.toLowerCase();
      if (DIG[low2]) { const c = DIG[low2]; out += two[0] === two[0].toUpperCase() && two[0] !== two[0].toLowerCase() ? c.toUpperCase() : c; i++; continue; }
      const ch = w[i], low = ch.toLowerCase();
      if (L2C[low]) out += ch === low ? L2C[low] : L2C[low].toUpperCase(); else out += ch;
    }
    return out;
  }
  const cyr = s => s.replace(/[A-Za-zČĆŠŽĐčćšžđ]+/g, cyrWord);
  function translit(root) {
    if (prof().pismo !== 'cyr' || !root) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('script,style,[data-notr]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
    nodes.forEach(n => { n.nodeValue = cyr(n.nodeValue); });
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => ['placeholder', 'aria-label', 'title'].forEach(a => { if (el.hasAttribute(a)) el.setAttribute(a, cyr(el.getAttribute(a))); }));
  }
  function paint(el, html) { el.innerHTML = html; translit(el); }

  /* ================= UI stanje ================= */
  const TABS = [['danas', 'Danas', 'home'], ['trening', 'Trening', 'pulse'], ['ishrana', 'Ishrana', 'food'], ['recepti', 'Recepti', 'book'], ['napredak', 'Napredak', 'chart']];
  const UI = { tab: 'danas', trSeg: 'plan', ishSeg: 'jelovnik', week: null, kat: 'sve', exQ: '', nKat: 'sve', recF: 'sve', recQ: '', friz: false, menuDate: keyOf(today()) };
  try { const t = JSON.parse(localStorage.getItem('kardio.ui') || '{}'); if (t.tab) UI.tab = t.tab; } catch (e) { /* nema */ }
  const h0 = (location.hash || '').replace('#', '');
  if (TABS.some(t => t[0] === h0)) UI.tab = h0;

  /* ================= delovi ================= */
  function ring(pct, size, stroke, cls = '') {
    const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - clamp(pct, 0, 1));
    return '<svg class="ring ' + cls + '" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<defs><linearGradient id="rg' + size + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--z2)"/><stop offset=".55" stop-color="var(--accent2)"/><stop offset="1" stop-color="var(--accent)"/></linearGradient></defs>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--track)" stroke-width="' + stroke + '"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="url(#rg' + size + ')" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg>';
  }
  const tipChip = tip => { const t = D.tipovi[tip]; return '<span class="tchip" style="--c:var(--' + t.boja + ')">' + esc(t.n) + '</span>'; };
  function zoneBar(z) {
    return '<div class="zones">' + ZONE.map(Z => '<div class="zseg' + (Z.z === z ? ' on' : '') + '" style="--c:var(--z' + Z.z + ')"><span class="zn">Z' + Z.z + '</span><span class="zb">' + zonaBpm(Z.z) + '</span></div>').join('') + '</div>' +
      '<p class="zcap">Ciljni puls: <b>' + zonaBpm(z) + ' otkucaja/min</b> · zona ' + z + ' (' + ZONE[z - 1].n.toLowerCase() + ')</p>';
  }
  const exIc = id => { const v = D.vezbe[id]; return '<span class="exic" data-c="' + v.c + '">' + ic(D.kategorije[v.c].ic) + '</span>'; };
  const empty = (icon, title, text) => '<div class="empty">' + ic(icon) + '<b>' + esc(title) + '</b><p>' + esc(text) + '</p></div>';
  const seg = (name, cur, opts) => '<div class="seg" role="tablist">' + opts.map(([v, l]) => '<button type="button" role="tab" aria-selected="' + (v === cur) + '" data-act="seg" data-seg="' + name + '" data-v="' + v + '">' + esc(l) + '</button>').join('') + '</div>';

  /* ================= DANAS ================= */
  function vDanas() {
    const t = today(), k = keyOf(t), pl = dayPlan(t), ob = obaveze(k), c = ciljevi(), d = dan(k), p = prof();
    const sat = new Date().getHours();
    const poz = sat < 11 ? 'Dobro jutro' : sat < 18 ? 'Dobar dan' : 'Dobro veče';
    const mot = D.motivacija[diffDays(new Date(2024, 0, 1), t) % D.motivacija.length];
    let h = '<header class="top"><div><p class="eyebrow">' + DANI[dow(t)] + ', ' + fmtDate(t) + '</p><h1 class="h1">' + esc(poz) + (p.ime ? ', ' + esc(p.ime) : '') + '</h1></div>' +
      '<button class="avatar" data-act="profil" aria-label="Profil i podešavanja">' + ic('user') + '<i id="syncDot" data-s="' + syncState + '"></i></button></header>';

    if (!p.podeseno) h += '<button class="setup" data-act="profil"><span>' + ic('info') + '</span><div><b>Upiši svoje podatke</b><p>Visina, težina i cilj. Tako računam tvoje kalorije, puls i porcije.</p></div>' + ic('chevR') + '</button>';

    // obaveze
    const pct = Math.round(ob.score * 100);
    h += '<section class="hero card"><div class="hero-top"><div class="ringwrap">' + ring(ob.score, 132, 12) + '<div class="ringlabel"><b class="num">' + pct + '%</b><span>' + (ob.ok ? 'dan ispunjen' : 'današnjih obaveza') + '</span></div></div>' +
      '<div class="hero-meta">' + (pl.pre ? '<p class="eyebrow">Program počinje ' + fmtDate(monday(parseKey(p.start))) + '</p>' :
        '<p class="eyebrow">Nedelja ' + pl.week + ' · Dan ' + pl.dayNo + '</p><p class="phase">Faza ' + (pl.phase + 1) + ': ' + esc(D.faze[Math.min(pl.phase, 2)].n) + (pl.deload ? ' · lakša nedelja' : '') + '</p>') +
      '<div class="streak">' + ic('flame') + '<b class="num">' + streak() + '</b><span>dana zaredom</span></div></div></div>' +
      '<svg class="ecg" viewBox="0 0 320 34" preserveAspectRatio="none" aria-hidden="true"><path d="M0 20h70l6-8 6 8h22l8-18 9 30 7-12h32l5-6 5 6h150"/></svg>' +
      '<ul class="checks">' + ob.items.map(i => '<li><button class="chk' + (i.v >= 1 ? ' done' : '') + '" data-act="ob" data-id="' + i.id + '" aria-pressed="' + (i.v >= 1) + '"><span class="box">' + ic('check') + '</span><span class="cn">' + esc(i.n) + '</span><span class="cv">' + esc(i.txt) + '</span>' +
        (i.v > 0 && i.v < 1 ? '<span class="mini" style="--p:' + (i.v * 100).toFixed(0) + '%"></span>' : '') + '</button></li>').join('') + '</ul></section>';

    // trening danas
    if (pl.pre) h += '<section class="card wcard"><p class="eyebrow">Uskoro</p><h2 class="h2">Program još nije počeo</h2><p class="muted">Datum početka možeš da promeniš u profilu.</p></section>';
    else if (pl.rest) {
      h += '<section class="card wcard rest"><div class="wtop">' + tipChip('odmor') + '<span class="muted">Nedelja</span></div><h2 class="h2">Dan odmora</h2><p class="muted">Oporavak je deo plana. Mišići jačaju dok se odmaraš.</p><ul class="bul">' + D.odmorSaveti.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>' +
        '<button class="btn ghost" data-act="ob" data-id="trening">' + ic(d.setnja ? 'check' : 'route') + (d.setnja ? 'Šetnja urađena' : 'Označi šetnju od 30 min') + '</button></section>';
    } else {
      const w = pl.w, done = S.treninzi[k];
      h += '<section class="card wcard" style="--c:var(--' + D.tipovi[w.tip].boja + ')"><div class="wtop">' + tipChip(w.tip) + '<span class="muted">' + fmtMin(w.trajanje) + ' · ~' + w.kcal + ' kcal</span></div>' +
        '<h2 class="h2">' + esc(w.n) + '</h2><p class="muted">' + esc(w.opis) + '</p>' +
        '<div class="where">' + ic(gdeTrening(w) === 'soba' ? 'home' : 'route') + '<span><b>' + gdeTxt(gdeTrening(w)) + '</b> · treba ti: ' + esc(oprema(w).join(', ')) + '</span></div>' +
        (done ? '<div class="donebar">' + ic('check') + 'Završeno · ' + done.min + ' min · ' + done.kcal + ' kcal</div><button class="btn ghost" data-act="w" data-d="' + k + '">Pogledaj trening</button>'
          : '<button class="btn primary" data-act="w" data-d="' + k + '">' + ic('play') + 'Pogledaj plan i počni</button>') + '</section>';
    }

    // voda
    h += '<section class="card water"><div class="sec-h"><h3 class="h3">' + ic('drop') + 'Voda</h3><span class="muted num">' + (d.voda * 0.25).toFixed(2).replace('.', ',') + ' / ' + (c.voda * 0.25).toFixed(2).replace('.', ',') + ' l</span></div><div class="glasses">' +
      Array.from({ length: c.voda }, (_, i) => '<button class="glass' + (i < d.voda ? ' full' : '') + '" data-act="voda" data-n="' + (i + 1) + '" aria-label="Čaša ' + (i + 1) + '"><svg viewBox="0 0 24 30"><path d="M3 2h18l-2.2 24a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z" class="gl"/><path d="M4.6 11h14.8l-1.6 15a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3z" class="wt"/></svg></button>').join('') + '</div></section>';

    // obroci danas
    const m = menuFor(k), fk = faktor(k);
    h += '<section class="card"><div class="sec-h"><h3 class="h3">' + ic('food') + 'Današnji jelovnik</h3><button class="link" data-act="tab" data-tab="ishrana">Ceo plan</button></div><ul class="meals">' +
      SLOTS.map((s, i) => { const r = R[m[s]], x = makro(r, fk); return '<li class="meal' + (d.obroci[i] ? ' eaten' : '') + '"><button class="mchk" data-act="obrok" data-i="' + i + '" aria-pressed="' + !!d.obroci[i] + '" aria-label="Pojedeno">' + ic('check') + '</button><button class="mbody" data-act="rec" data-id="' + r.id + '" data-f="' + fk + '"><span class="mt">' + D.obroci[s].vreme + ' · ' + esc(D.obroci[s].n) + '</span><span class="mn">' + esc(r.n) + '</span></button><span class="mk num">' + x.k + '</span></li>'; }).join('') +
      '</ul><p class="foot muted">Cilj: <b class="num">' + fmtN(c.kcal) + ' kcal</b> · proteini <b class="num">' + c.protein + ' g</b> · porcije <b class="num">' + fmtF(fk) + '</b></p></section>';

    h += '<blockquote class="quote">' + esc(mot) + '</blockquote>';
    return h;
  }

  /* ================= TRENING ================= */
  function vTrening() {
    let h = '<header class="top"><div><p class="eyebrow">Program od 12 nedelja</p><h1 class="h1">Trening</h1></div></header>' +
      seg('trSeg', UI.trSeg, [['plan', 'Plan'], ['vezbe', 'Vežbe'], ['saveti', 'Saveti']]);
    if (UI.trSeg === 'plan') h += vPlan(); else if (UI.trSeg === 'vezbe') h += vVezbe(); else h += vSaveti();
    return h;
  }
  function vPlan() {
    const t = today(), cur = progInfo(t);
    if (UI.week == null) UI.week = clamp(cur.before ? 1 : cur.week, 1, 12);
    const wk = UI.week, ph = wk <= 4 ? 0 : wk <= 8 ? 1 : 2;
    const start = monday(parseKey(prof().start));
    let h = '<div class="phases">' + D.faze.map((f, i) => '<button class="phase-pill' + (i === ph ? ' on' : '') + '" data-act="week" data-w="' + (i * 4 + 1) + '"><b>' + esc(f.n) + '</b><span>ned. ' + f.ned + '</span></button>').join('') + '</div>' +
      '<p class="muted phase-desc">' + esc(D.faze[ph].opis) + '</p>' +
      '<div class="weeks" id="weeks">' + Array.from({ length: 12 }, (_, i) => {
        const n = i + 1, mon = addDays(start, i * 7);
        let doneN = 0, planN = 0;
        for (let j = 0; j < 7; j++) { const dd = addDays(mon, j); if (D.nedelja[j].w) { planN++; if (S.treninzi[keyOf(dd)]) doneN++; } }
        return '<button class="wk' + (n === wk ? ' on' : '') + (n === cur.week ? ' now' : '') + '" data-act="week" data-w="' + n + '"><b class="num">' + n + '</b><i style="--p:' + Math.round(doneN / planN * 100) + '%"></i></button>';
      }).join('') + '</div>';
    if (wk === 4 || wk === 8) h += '<div class="note">' + ic('info') + '<span>Lakša nedelja: jedan krug manje i kraći kardio, da se telo oporavi pre sledeće faze.</span></div>';
    h += '<ul class="days">';
    for (let j = 0; j < 7; j++) {
      const dd = addDays(start, (wk - 1) * 7 + j), k = keyOf(dd), pl = dayPlan(dd), isT = k === keyOf(t), done = S.treninzi[k];
      const past = dd < t && k >= S.prvi;
      if (pl.rest) h += '<li><button class="day rest' + (isT ? ' today' : '') + '" data-act="restinfo"><span class="dd"><b>' + DANI_K[j] + '</b><span class="num">' + dd.getDate() + '.' + (dd.getMonth() + 1) + '.</span></span><span class="dbody">' + tipChip('odmor') + '<span class="dn">Odmor i oporavak</span></span><span class="dst">' + ic('moon') + '</span></button></li>';
      else h += '<li><button class="day' + (isT ? ' today' : '') + (done ? ' done' : (past ? ' missed' : '')) + '" data-act="w" data-d="' + k + '" style="--c:var(--' + D.tipovi[pl.w.tip].boja + ')"><span class="dd"><b>' + DANI_K[j] + '</b><span class="num">' + dd.getDate() + '.' + (dd.getMonth() + 1) + '.</span></span><span class="dbody">' + tipChip(pl.w.tip) + '<span class="dn">' + esc(pl.w.n) + '</span><span class="dm muted">' + fmtMin(pl.w.trajanje) + ' · ' + gdeTxt(gdeTrening(pl.w)).toLowerCase() + ' · ~' + pl.w.kcal + ' kcal</span></span><span class="dst">' + (done ? ic('check') : past ? '<em>propušten</em>' : ic('chevR')) + '</span></button></li>';
    }
    return h + '</ul>';
  }
  function vVezbe() {
    const q = UI.exQ.trim().toLowerCase();
    const fit = v => UI.kat === 'sve' || (UI.kat === 'lo' ? v.lo : UI.kat === 'soba' || UI.kat === 'napolje' ? v.gde === UI.kat : v.c === UI.kat);
    const list = Object.entries(D.vezbe).filter(([id, v]) => { const hay = (v.n + ' ' + (v.alt || '') + ' ' + v.u + ' ' + v.m).toLowerCase(); return fit(v) && (!q || hay.includes(q) || cyr(hay).includes(q)); });
    let h = '<label class="search">' + ic('search') + '<input id="exQ" type="search" placeholder="Traži vežbu ili deo tela" value="' + esc(UI.exQ) + '" data-in="exQ"></label>' +
      '<div class="chips">' + [['sve', 'Sve'], ['soba', 'U sobi'], ['napolje', 'Napolju'], ['lo', 'Bez skakanja']].concat(Object.entries(D.kategorije).map(([k, v]) => [k, v.n])).map(([k, l]) => '<button class="chip' + (UI.kat === k ? ' on' : '') + '" data-act="kat" data-v="' + k + '">' + esc(l) + '</button>').join('') + '</div>';
    if (!list.length) return h + empty('search', 'Nema takve vežbe', 'Probaj drugu reč ili izaberi „Sve”.');
    return h + '<ul class="list">' + list.map(([id, v]) => '<li><button class="li" data-act="ex" data-id="' + id + '">' + exIc(id) + '<span class="lib"><b>' + esc(v.n) + '</b><span class="muted">' + esc(v.u) + '</span></span><span class="gdetag">' + (v.gde === 'napolje' ? 'napolju' : 'u sobi') + '</span></button></li>').join('') + '</ul>';
  }
  function vSaveti() {
    const c = ciljevi();
    let h = '<section class="card"><h3 class="h3">' + ic('heart') + 'Tvoje zone pulsa</h3><p class="muted">Maksimalni puls za ' + prof().god + ' god: <b class="num">' + c.hrMax + '</b> otkucaja/min</p><ul class="zlist">' +
      ZONE.map(Z => '<li style="--c:var(--z' + Z.z + ')"><span class="zdot"></span><b>Zona ' + Z.z + '</b><span>' + esc(Z.n) + '</span><span class="num">' + zonaBpm(Z.z) + '</span></li>').join('') + '</ul></section>';
    h += D.saveti.map((s, i) => '<details class="card tip"' + (i === 0 ? ' open' : '') + '><summary>' + ic(s.ic) + '<b>' + esc(s.n) + '</b>' + ic('chevR', 'chev') + '</summary><ul class="bul">' + s.t.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></details>').join('');
    return h;
  }

  /* ================= ISHRANA ================= */
  function vIshrana() {
    let h = '<header class="top"><div><p class="eyebrow">Za mršavljenje uz kardio</p><h1 class="h1">Ishrana</h1></div></header>' +
      seg('ishSeg', UI.ishSeg, [['jelovnik', 'Jelovnik'], ['namirnice', 'Namirnice'], ['kupovina', 'Kupovina']]);
    if (UI.ishSeg === 'jelovnik') h += vJelovnik(); else if (UI.ishSeg === 'namirnice') h += vNamirnice(); else h += vKupovina();
    return h;
  }
  function macroBar(label, val, goal, cls) {
    const p = goal ? clamp(val / goal, 0, 1.2) : 0;
    return '<div class="mbar"><div class="mbl"><span>' + label + '</span><b class="num">' + val + ' / ' + goal + ' g</b></div><div class="track"><i class="' + cls + '" style="width:' + Math.min(100, p * 100).toFixed(0) + '%"></i></div></div>';
  }
  function vJelovnik() {
    const k = UI.menuDate, date = parseKey(k), c = ciljevi(), m = menuFor(k), fk = faktor(k), raw = menuTotal(m), pl = dayPlan(date), d = dan(k);
    const tot = { k: r0(raw.k * fk), p: r0(raw.p * fk), u: r0(raw.u * fk), m: r0(raw.m * fk) };
    const isT = k === keyOf(today());
    let h = '<div class="datebar"><button class="iconbtn" data-act="mday" data-n="-1" aria-label="Prethodni dan">' + ic('chevL') + '</button><div><b>' + (isT ? 'Danas' : DANI[dow(date)]) + '</b><span class="muted">' + fmtDate(date) + ' · ' + (pl.rest ? 'dan odmora' : esc(pl.w.n)) + '</span></div><button class="iconbtn" data-act="mday" data-n="1" aria-label="Sledeći dan">' + ic('chevR') + '</button></div>';
    const diff = tot.k - c.kcal;
    h += '<section class="card kcal"><div class="kc-top"><div class="ringwrap sm">' + ring(tot.k / c.kcal, 104, 10) + '<div class="ringlabel"><b class="num">' + fmtN(tot.k) + '</b><span>kcal u planu</span></div></div><div class="kc-side"><p class="eyebrow">Dnevni cilj</p><p class="big num">' + fmtN(c.kcal) + ' <small>kcal</small></p><p class="muted">' +
      (Math.abs(diff) <= 150 ? 'Porcije su ' + (fk === 1 ? 'osnovne' : 'podešene ' + fmtF(fk)) + ' da plan pogodi tvoj cilj.' : diff > 0 ? 'Plan je ' + diff + ' kcal iznad cilja: uzmi manje skroba.' : 'Plan je ' + (-diff) + ' kcal ispod cilja: dodaj voće ili šaku badema.') + '</p></div></div>' +
      macroBar('Proteini', tot.p, c.protein, 'p') + macroBar('Ugljeni hidrati', tot.u, c.uh, 'u') + macroBar('Masti', tot.m, c.masti, 'm') + '</section>';
    h += '<ul class="mplan">' + SLOTS.map((s, i) => {
      const r = R[m[s]], x = makro(r, fk);
      return '<li class="card mp' + (d.obroci[i] ? ' eaten' : '') + '"><div class="mph"><span class="eyebrow">' + D.obroci[s].vreme + ' · ' + esc(D.obroci[s].n) + '</span><div class="mpa"><button class="iconbtn sm" data-act="swap" data-slot="' + s + '" aria-label="Zameni obrok">' + ic('swap') + '</button><button class="iconbtn sm chkb' + (d.obroci[i] ? ' on' : '') + '" data-act="obrok" data-i="' + i + '" data-d="' + k + '" aria-label="Pojedeno">' + ic('check') + '</button></div></div>' +
        '<button class="mpb" data-act="rec" data-id="' + r.id + '" data-f="' + fk + '"><b>' + esc(r.n) + '</b><span class="macros"><span class="num">' + x.k + ' kcal</span><span class="num">P ' + x.p + '</span><span class="num">UH ' + x.u + '</span><span class="num">M ' + x.m + '</span><span>' + ic('clock') + r.min + ' min</span></span></button></li>';
    }).join('') + '</ul>';
    h += '<div class="note">' + ic('info') + '<span>' + (pl.rest ? 'Dan odmora: zadrži proteine, a skrob (hleb, pirinač, krompir) smanji na pola porcije.' : 'Dan treninga: ugljene hidrate jedi pre i posle treninga, a uveče više povrća i proteina.') + '</span></div>';
    return h;
  }
  function vNamirnice() {
    const kats = Object.entries(D.kategorijeNamirnica);
    let h = '<div class="chips">' + [['sve', 'Sve']].concat(kats).map(([k, l]) => '<button class="chip' + (UI.nKat === k ? ' on' : '') + '" data-act="nkat" data-v="' + k + '">' + esc(l) + '</button>').join('') + '</div>' +
      '<p class="legend"><span><i class="ok1"></i>jedi slobodno</span><span><i class="ok2"></i>meri porciju</span><span class="muted">vrednosti na 100 g</span></p>';
    const groups = kats.filter(([k]) => UI.nKat === 'sve' || UI.nKat === k);
    h += groups.map(([kk, kl]) => {
      const items = Object.entries(D.namirnice).filter(([, n]) => n.c === kk);
      return '<h3 class="grp">' + esc(kl) + '</h3><ul class="list">' + items.map(([id, n]) => {
        const cnt = D.recepti.filter(r => r.s.some(x => Array.isArray(x) && x[0] === id)).length;
        return '<li><button class="li food" data-act="food" data-id="' + id + '"><span class="okdot ok' + n.o + '"></span><span class="lib"><b>' + esc(n.n) + '</b><span class="muted">' + (cnt ? cnt + ' ' + (cnt === 1 ? 'recept' : cnt < 5 ? 'recepta' : 'recepata') : esc(n.por)) + '</span></span><span class="fm num"><b>' + n.k + '</b><small>kcal</small></span><span class="fm num"><b>' + n.p + '</b><small>prot.</small></span></button></li>';
      }).join('') + '</ul>';
    }).join('');
    h += '<h3 class="grp">Izbegavaj i zameni</h3><ul class="swaps">' + D.zamene.map(z => '<li class="card"><div class="sw"><span class="no">' + esc(z.ne) + '</span>' + ic('chevR') + '<span class="yes">' + esc(z.da) + '</span></div><p class="muted">' + esc(z.zasto) + '</p></li>').join('') + '</ul>';
    return h;
  }
  function vKupovina() {
    const mon = monday(parseKey(UI.menuDate)), wk = keyOf(mon);
    const sum = {};
    for (let j = 0; j < 7; j++) { const dk = keyOf(addDays(mon, j)), m = menuFor(dk), fk = faktor(dk); SLOTS.forEach(s => R[m[s]].s.forEach(x => { if (Array.isArray(x)) sum[x[0]] = (sum[x[0]] || 0) + x[1] * fk; })); }
    const checked = S.kupovina[wk] || [];
    const kats = Object.entries(D.kategorijeNamirnica);
    const total = Object.keys(sum).length, got = Object.keys(sum).filter(id => checked.includes(id)).length;
    let h = '<div class="datebar"><button class="iconbtn" data-act="mday" data-n="-7" aria-label="Prethodna nedelja">' + ic('chevL') + '</button><div><b>Nedelja ' + fmtDate(mon) + ' – ' + fmtDate(addDays(mon, 6)) + '</b><span class="muted">' + got + ' od ' + total + ' kupljeno</span></div><button class="iconbtn" data-act="mday" data-n="7" aria-label="Sledeća nedelja">' + ic('chevR') + '</button></div>';
    h += '<p class="muted small">Količine su zbir svih obroka iz jelovnika za tu nedelju, za jednu osobu, sa porcijama podešenim na tvoj cilj. Mahunarke i žitarice su date kuvane; suvih treba oko trećine.</p>';
    kats.forEach(([kk, kl]) => {
      const ids = Object.keys(sum).filter(id => D.namirnice[id].c === kk);
      if (!ids.length) return;
      h += '<h3 class="grp">' + esc(kl) + '</h3><ul class="list shop">' + ids.map(id => {
        const g = sum[id], on = checked.includes(id);
        const qty = g >= 1000 ? (g / 1000).toFixed(1).replace('.', ',') + ' kg' : r0(g) + ' g';
        return '<li><button class="li' + (on ? ' got' : '') + '" data-act="shop" data-id="' + id + '" data-w="' + wk + '" aria-pressed="' + on + '"><span class="box">' + ic('check') + '</span><span class="lib"><b>' + esc(D.namirnice[id].n) + '</b></span><span class="num qty">' + qty + '</span></button></li>';
      }).join('') + '</ul>';
    });
    return h;
  }

  /* ================= RECEPTI ================= */
  function vRecepti() {
    let h = '<header class="top"><div><p class="eyebrow">' + D.recepti.length + ' zdravih jela</p><h1 class="h1">Recepti</h1></div><button class="pillbtn' + (UI.friz ? ' on' : '') + '" data-act="friz">' + ic('fridge') + 'Šta imam</button></header>';
    if (UI.friz) {
      const ids = Object.keys(D.namirnice).filter(id => D.namirnice[id].c !== 'napici' && D.namirnice[id].c !== 'dodaci');
      h += '<section class="card friz"><p class="eyebrow">Šta imaš kod kuće?</p><p class="muted small">Označi namirnice, a ja ću poređati recepte po tome koliko sastojaka već imaš.</p><div class="fchips">' +
        ids.map(id => '<button class="fchip' + (S.frizider.includes(id) ? ' on' : '') + '" data-act="fr" data-id="' + id + '">' + esc(D.namirnice[id].n.replace(/ \(.*\)/, '')) + '</button>').join('') + '</div>' +
        (S.frizider.length ? '<button class="link" data-act="frclear">Poništi izbor (' + S.frizider.length + ')</button>' : '') + '</section>';
    }
    h += '<label class="search">' + ic('search') + '<input id="recQ" type="search" placeholder="Traži jelo ili namirnicu" value="' + esc(UI.recQ) + '" data-in="recQ"></label>';
    const F = [['sve', 'Sve'], ['dorucak', 'Doručak'], ['rucak', 'Ručak'], ['vecera', 'Večera'], ['uzina', 'Užina'], ['brzo', 'Brzo'], ['protein', 'Puno proteina'], ['posno', 'Posno'], ['pripremi', 'Spremi unapred'], ['posle-treninga', 'Posle treninga'], ['omiljeni', 'Omiljeni']];
    h += '<div class="chips">' + F.map(([k, l]) => '<button class="chip' + (UI.recF === k ? ' on' : '') + '" data-act="recf" data-v="' + k + '">' + (k === 'omiljeni' ? ic('star') : '') + esc(l) + '</button>').join('') + '</div>';
    const q = UI.recQ.trim().toLowerCase();
    let list = D.recepti.filter(r => {
      if (UI.recF === 'omiljeni' && !S.omiljeni.includes(r.id)) return false;
      if (['dorucak', 'rucak', 'vecera', 'uzina'].includes(UI.recF) && r.o !== UI.recF) return false;
      if (D.oznake[UI.recF] && !r.t.includes(UI.recF)) return false;
      if (q) { const hay = (r.n + ' ' + r.s.map(x => Array.isArray(x) ? D.namirnice[x[0]].n : x).join(' ')).toLowerCase(); if (!hay.includes(q) && !cyr(hay).includes(q)) return false; }
      return true;
    }).map(r => ({ r, x: makro(r), match: matchOf(r) }));
    if (UI.friz && S.frizider.length) list.sort((a, b) => b.match.pct - a.match.pct || a.match.miss - b.match.miss);
    if (!list.length) return h + (UI.recF === 'omiljeni' ? empty('star', 'Još nema omiljenih', 'Otvori recept i dodirni zvezdicu da ga sačuvaš ovde.') : empty('search', 'Nema takvih recepata', 'Probaj drugu reč ili drugi filter.'));
    h += '<ul class="rgrid">' + list.map(({ r, x, match }) => '<li><button class="rcard" data-act="rec" data-id="' + r.id + '"><span class="rtop"><span class="eyebrow">' + esc(D.obroci[r.o === 'uzina' ? 'uzina1' : r.o].n) + '</span>' + (S.omiljeni.includes(r.id) ? ic('star', 'fav') : '') + '</span><b class="rn">' + esc(r.n) + '</b>' +
      (UI.friz && S.frizider.length ? '<span class="match"><i style="width:' + match.pct + '%"></i></span><span class="mt2 muted">Imaš ' + match.have + ' od ' + match.total + ' sastojaka</span>' : '') +
      '<span class="rmeta"><span class="num">' + x.k + ' kcal</span><span class="num">' + x.p + ' g prot.</span><span>' + ic('clock') + r.min + ' min</span></span></button></li>').join('') + '</ul>';
    return h;
  }
  function matchOf(r) {
    const ids = r.s.filter(Array.isArray).map(x => x[0]).filter(id => !['maslinovo', 'limun', 'beli_luk', 'med', 'kakao'].includes(id));
    const have = ids.filter(id => S.frizider.includes(id)).length;
    return { have, total: ids.length, miss: ids.length - have, pct: ids.length ? Math.round(have / ids.length * 100) : 0 };
  }

  /* ================= NAPREDAK ================= */
  function vNapredak() {
    const tr = Object.entries(S.treninzi);
    const totalMin = tr.reduce((a, [, x]) => a + x.min, 0), totalKcal = tr.reduce((a, [, x]) => a + x.kcal, 0);
    const p = prof(), c = ciljevi(), kg = trenutnaTezina(), start = p.tezina;
    let h = '<header class="top"><div><p class="eyebrow">Tvoji brojevi</p><h1 class="h1">Napredak</h1></div></header>';
    h += '<div class="tiles"><div class="tile hot"><span>' + ic('flame') + 'Niz</span><b class="num">' + streak() + '</b><small>dana zaredom · rekord ' + najduziNiz() + '</small></div>' +
      '<div class="tile"><span>' + ic('pulse') + 'Treninzi</span><b class="num">' + tr.length + '</b><small>završeno ukupno</small></div>' +
      '<div class="tile"><span>' + ic('clock') + 'Vreme</span><b class="num">' + fmtN(totalMin) + '</b><small>minuta kardija</small></div>' +
      '<div class="tile"><span>' + ic('zap') + 'Energija</span><b class="num">' + fmtN(totalKcal) + '</b><small>kcal potrošeno</small></div></div>';

    // ova nedelja
    const mon = monday(today());
    const wd = Array.from({ length: 7 }, (_, j) => { const dd = addDays(mon, j), k = keyOf(dd), pl = dayPlan(dd); return { dd, k, pl, done: S.treninzi[k], ob: obaveze(k) }; });
    const maxMin = Math.max(30, ...wd.map(x => x.done ? x.done.min : (x.pl.rest ? 0 : Math.round(x.pl.w.trajanje / 60))));
    const planN = wd.filter(x => !x.pl.rest).length, doneN = wd.filter(x => x.done).length;
    h += '<section class="card"><div class="sec-h"><h3 class="h3">' + ic('cal') + 'Ova nedelja</h3><span class="muted num">' + doneN + ' / ' + planN + ' treninga</span></div><div class="bars">' +
      wd.map((x, j) => { const plan = x.pl.rest ? 0 : Math.round(x.pl.w.trajanje / 60), got = x.done ? x.done.min : 0; const isT = x.k === keyOf(today());
        return '<div class="bar' + (isT ? ' today' : '') + '"><div class="bcol"><i class="plan" style="height:' + (plan / maxMin * 100).toFixed(0) + '%"></i><i class="got" style="height:' + (got / maxMin * 100).toFixed(0) + '%"></i></div><span class="bv num">' + (got || (plan ? plan : '–')) + '</span><span class="bl">' + DANI_K[j] + '</span><span class="bdot' + (x.ob.ok ? ' ok' : '') + '"></span></div>'; }).join('') +
      '</div><p class="legend"><span><i class="lg-got"></i>urađeno (min)</span><span><i class="lg-plan"></i>planirano</span><span><i class="lg-ok"></i>dan ispunjen</span></p></section>';

    // težina
    const lost = r1(start - kg), bmi = kg / Math.pow(p.visina / 100, 2), toGoal = r1(kg - p.cilj), prog = start > p.cilj ? clamp((start - kg) / (start - p.cilj), 0, 1) : 0;
    h += '<section class="card weight"><div class="sec-h"><h3 class="h3">' + ic('scale') + 'Težina</h3><span class="muted">BMI <b class="num">' + r1(bmi).toString().replace('.', ',') + '</b></span></div>' +
      '<div class="wrow"><div><p class="big num">' + fmtKg(kg) + ' <small>kg</small></p><p class="' + (lost > 0 ? 'good' : 'muted') + ' num">' + (lost > 0 ? '−' + fmtKg(lost) + ' kg od početka' : lost < 0 ? '+' + fmtKg(-lost) + ' kg od početka' : 'Početna težina') + '</p></div>' +
      '<div class="goalbox"><span class="muted">Do cilja ' + fmtKg(p.cilj) + ' kg</span><b class="num">' + (toGoal > 0 ? fmtKg(toGoal) + ' kg' : 'Cilj dostignut') + '</b><div class="track"><i class="g" style="width:' + (prog * 100).toFixed(0) + '%"></i></div></div></div>' +
      weightChart() +
      '<form class="wadd" data-form="kg"><label class="field"><span>Današnja težina</span><input id="kgIn" type="number" inputmode="decimal" step="0.1" min="30" max="300" placeholder="' + fmtKg(kg) + '"></label><button class="btn primary sm" type="submit">' + ic('plus') + 'Upiši</button></form>' +
      '<p class="muted small">' + prognoza() + '</p></section>';

    // heatmap programa
    const st = monday(parseKey(p.start));
    h += '<section class="card"><div class="sec-h"><h3 class="h3">' + ic('route') + '12 nedelja programa</h3><span class="muted num">' + Math.round(tr.filter(([k]) => { const pi = progInfo(parseKey(k)); return !pi.before && pi.week <= 12; }).length / 72 * 100) + '%</span></div><div class="heat"><div class="hrow hl"><span></span>' + DANI_K.map(d => '<span>' + d[0] + '</span>').join('') + '</div>' +
      Array.from({ length: 12 }, (_, i) => '<div class="hrow"><span class="num">' + (i + 1) + '</span>' + Array.from({ length: 7 }, (_, j) => { const dd = addDays(st, i * 7 + j), k = keyOf(dd), rest = !D.nedelja[j].w, done = S.treninzi[k], fut = dd > today();
        const t = rest ? 'rest' : done ? 'done' : fut || k < S.prvi ? 'fut' : 'miss'; const tip = rest ? 'odmor' : D.treninzi[D.nedelja[j].w[(i + 1) % 2 === 1 ? 0 : 1]].tip;
        return '<i class="hc ' + t + (k === keyOf(today()) ? ' now' : '') + '" style="--c:var(--' + D.tipovi[tip].boja + ')"></i>'; }).join('') + '</div>').join('') + '</div></section>';

    // bedževi
    const earned = bedzevi();
    h += '<section class="card"><div class="sec-h"><h3 class="h3">' + ic('award') + 'Bedževi</h3><span class="muted num">' + earned.size + ' / ' + D.bedzevi.length + '</span></div><ul class="badges">' +
      D.bedzevi.map(b => '<li class="badge' + (earned.has(b.id) ? ' on' : '') + '">' + ic('award') + '<b>' + esc(b.n) + '</b><span>' + esc(b.o) + '</span></li>').join('') + '</ul></section>';

    // potrošnja
    h += '<section class="card"><h3 class="h3">' + ic('zap') + 'Tvoja potrošnja</h3><dl class="kv"><div><dt>Bazalni metabolizam</dt><dd class="num">' + fmtN(c.bmr) + ' kcal</dd></div><div><dt>Dnevna potrošnja uz trening</dt><dd class="num">' + fmtN(c.tdee) + ' kcal</dd></div><div><dt>Cilj unosa (−500)</dt><dd class="num">' + fmtN(c.kcal) + ' kcal</dd></div><div><dt>Proteini dnevno</dt><dd class="num">' + c.protein + ' g</dd></div></dl></section>';
    return h;
  }
  function weightChart() {
    const pts = S.tezina.slice(-30);
    if (pts.length < 2) return '<div class="chart-empty">' + ic('trend') + '<span>Upisuj težinu jednom nedeljno, isti dan ujutru. Posle dva upisa ovde se crta grafikon.</span></div>';
    const W = 320, H = 130, pl = 30, pr = 10, pt = 12, pb = 22;
    const xs = pts.map(p => parseKey(p.d).getTime()), ys = pts.map(p => p.kg).concat([prof().cilj]);
    let mn = Math.floor(Math.min(...ys) - 1), mx = Math.ceil(Math.max(...ys) + 1);
    const x0 = Math.min(...xs), x1 = Math.max(...xs) || x0 + 1;
    const X = t => pl + (x1 === x0 ? (W - pl - pr) / 2 : (t - x0) / (x1 - x0) * (W - pl - pr)), Y = v => pt + (mx - v) / (mx - mn) * (H - pt - pb);
    const line = pts.map((p, i) => (i ? 'L' : 'M') + X(xs[i]).toFixed(1) + ' ' + Y(p.kg).toFixed(1)).join(' ');
    const area = line + ' L' + X(xs[xs.length - 1]).toFixed(1) + ' ' + (H - pb) + ' L' + X(xs[0]).toFixed(1) + ' ' + (H - pb) + ' Z';
    const ticks = [mn, Math.round((mn + mx) / 2), mx];
    const last = pts[pts.length - 1];
    return '<svg class="wchart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Grafikon težine">' +
      '<defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".28"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>' +
      ticks.map(t => '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(t) + '" y2="' + Y(t) + '" class="grid"/><text x="' + (pl - 6) + '" y="' + (Y(t) + 4) + '" class="axis" text-anchor="end">' + t + '</text>').join('') +
      '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + Y(prof().cilj) + '" y2="' + Y(prof().cilj) + '" class="goal"/><text x="' + (W - pr) + '" y="' + (Y(prof().cilj) - 4) + '" class="axis goalt" text-anchor="end">cilj</text>' +
      '<path d="' + area + '" fill="url(#wg)"/><path d="' + line + '" class="wl"/>' +
      '<circle cx="' + X(xs[xs.length - 1]) + '" cy="' + Y(last.kg) + '" r="4.5" class="wp"/>' +
      '<text x="' + pl + '" y="' + (H - 6) + '" class="axis">' + fmtDate(parseKey(pts[0].d)) + '</text><text x="' + (W - pr) + '" y="' + (H - 6) + '" class="axis" text-anchor="end">' + fmtDate(parseKey(last.d)) + '</text></svg>';
  }
  function prognoza() {
    const t = S.tezina; const p = prof();
    if (t.length < 2) return 'Očekivan tempo uz plan: 0,5–0,8 kg nedeljno.';
    const a = t[0], b = t[t.length - 1], days = diffDays(parseKey(a.d), parseKey(b.d));
    if (days < 7) return 'Za prognozu treba bar nedelju dana upisa.';
    const perW = (a.kg - b.kg) / days * 7;
    if (perW <= 0.05) return 'Prosek: ' + fmtKg(perW) + ' kg nedeljno. Proveri porcije i ulje, to su najčešći skriveni višak.';
    const left = b.kg - p.cilj; if (left <= 0) return 'Cilj je dostignut. Postavi novi u profilu.';
    const weeks = Math.ceil(left / perW);
    return 'Prosek: −' + fmtKg(perW) + ' kg nedeljno. Ovim tempom stižeš do cilja oko ' + fmtDate(addDays(parseKey(b.d), weeks * 7)) + '.';
  }
  function bedzevi() {
    const s = new Set(), tr = Object.values(S.treninzi), c = ciljevi();
    if (tr.length >= 1) s.add('prvi'); if (tr.length >= 10) s.add('tr10'); if (tr.length >= 30) s.add('tr30');
    const best = najduziNiz(); if (best >= 3) s.add('niz3'); if (best >= 7) s.add('niz7'); if (best >= 21) s.add('niz21');
    if (tr.reduce((a, x) => a + x.min, 0) >= 500) s.add('min500');
    if (tr.reduce((a, x) => a + x.kcal, 0) >= 5000) s.add('kcal5000');
    if (Object.values(S.dani).filter(d => d.voda >= c.voda).length >= 7) s.add('voda7');
    const kg = trenutnaTezina(), st = prof().tezina;
    if (st - kg >= 2) s.add('kg2'); if (st - kg >= 5) s.add('kg5'); if (S.tezina.length && kg <= prof().cilj) s.add('cilj');
    return s;
  }

  /* ================= SHEETOVI ================= */
  let sheetT = null;
  function openSheet(html, cls = '') {
    clearTimeout(sheetT);
    const sh = $('#sheet');
    sh.className = 'sheet ' + cls;
    paint($('#sheetBody'), html);
    sh.hidden = false;
    requestAnimationFrame(() => sh.classList.add('open'));
    $('#sheetBody').scrollTop = 0;
    document.body.classList.add('locked');
  }
  function closeSheet() {
    const sh = $('#sheet'); if (sh.hidden) return;
    sh.classList.remove('open');
    clearTimeout(sheetT); sheetT = setTimeout(() => { sh.hidden = true; }, 220);
    document.body.classList.remove('locked');
  }
  const sheetHead = (title, sub) => '<div class="sh-head"><div><p class="eyebrow">' + sub + '</p><h2 class="h2">' + title + '</h2></div><button class="iconbtn" data-act="close" aria-label="Zatvori">' + ic('x') + '</button></div>';

  function sheetWorkout(k) {
    const date = parseKey(k), pl = dayPlan(date), w = pl.w, done = S.treninzi[k];
    const gde = gdeTrening(w), kisa = kisaTrening(w);
    let h = sheetHead(esc(w.n), DANI[dow(date)] + ', ' + fmtDate(date) + ' · nedelja ' + pl.week);
    h += '<div class="wsum" style="--c:var(--' + D.tipovi[w.tip].boja + ')">' + tipChip(w.tip) + '<span>' + ic('clock') + fmtMin(w.trajanje) + '</span><span>' + ic(gde === 'soba' ? 'home' : 'route') + gdeTxt(gde) + '</span><span>' + ic('flame') + '~' + w.kcal + ' kcal</span>' + (w.deload ? '<span>lakša nedelja</span>' : '') + '</div>';
    h += '<p>' + esc(w.opis) + '</p>';
    h += '<div class="need"><div><span class="eyebrow">Treba ti</span><p>' + esc(oprema(w).join(', ')) + ', flaša vode.</p></div>' + (kisa ? '<div><span class="eyebrow">Ako pada kiša</span><p>' + esc(kisa) + '</p></div>' : '') + '</div>';
    h += '<h3 class="h3">' + ic('cal') + 'Plan treninga, korak po korak</h3><ol class="plan">';
    w.blocks.forEach(b => {
      h += '<li class="pblk" style="--c:var(--z' + b.z + ')"><div class="pblk-h"><b>' + esc(b.n) + '</b><span class="num">' + fmtMin(blokSek(b)) + '</span></div>' +
        '<p class="pblk-o">' + esc(blokOpis(b)) + '</p><p class="pblk-z">Puls: ' + zonaBpm(b.z) + ' otkucaja/min · ' + esc(ZONE[b.z - 1].n.toLowerCase()) + '</p><ul class="exlist">' +
        b.items.map(it => { const v = D.vezbe[it.ex]; return '<li><button class="exrow" data-act="ex" data-id="' + it.ex + '">' + exIc(it.ex) + '<span class="exb"><b>' + esc(v.n) + '</b><span class="muted">' + esc(v.u) + '</span>' + (v.tempo ? '<span class="tempo">' + esc(v.tempo) + '</span>' : '') + '<span class="amt">' + esc(kolicina(b, it)) + '</span></span>' + ic('chevR', 'chev') + '</button></li>'; }).join('') + '</ul>' +
        (b.pauza ? '<p class="muted small">Posle ovog bloka ' + b.pauza + ' s odmora.</p>' : '') + '</li>';
    });
    h += '</ol><p class="muted small">Dodirni vežbu da vidiš kako se radi, korak po korak. Isto uputstvo vidiš i na ekranu tajmera dok vežbaš.</p>';
    h += '<section class="card flat"><h3 class="h3">' + ic('heart') + 'Koliko jako</h3>' + zoneBar(w.z) + '<p class="muted small">Nemaš sat za puls? Zona 2: možeš da pričaš u rečenicama. Zona 4 i 5: možeš da kažeš samo par reči.</p></section>';
    const canLog = date <= today();
    h += '<div class="sh-actions">' + (done ? '<div class="donebar">' + ic('check') + 'Završeno · ' + done.min + ' min · ' + done.kcal + ' kcal</div><button class="btn ghost" data-act="undo" data-d="' + k + '">Poništi oznaku</button>' :
      '<button class="btn primary big" data-act="start" data-d="' + k + '">' + ic('play') + 'Spreman sam, počni</button>' + (canLog ? '<button class="btn ghost" data-act="mark" data-d="' + k + '">' + ic('check') + 'Uradio sam bez tajmera</button>' : '')) + '</div>';
    openSheet(h);
  }
  function sheetRest() {
    openSheet(sheetHead('Odmor i oporavak', 'Nedelja') + '<p>Jedan dan potpunog odmora nedeljno sprečava zamor i povrede. Mišići i srce napreduju dok se odmaraš, ne dok treniraš.</p><ul class="bul">' + D.odmorSaveti.map(s => '<li>' + esc(s) + '</li>').join('') + '</ul>');
  }
  function sheetEx(id) {
    const v = D.vezbe[id], cat = D.kategorije[v.c];
    let h = sheetHead(esc(v.n), esc(cat.n) + ' · ' + (v.gde === 'napolje' ? 'napolju' : 'u sobi') + (v.lo ? ' · bez skakanja' : ''));
    h += '<p class="lead">' + esc(v.u) + (v.alt ? ' <span class="muted">Poznato i kao: ' + esc(v.alt) + '.</span>' : '') + '</p>';
    h += '<h3 class="h3">Kako se radi</h3><ol class="steps">' + v.koraci.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>';
    if (v.tempo) h += '<div class="fix tempo-box">' + ic('clock') + '<div><b>Tempo</b><p>' + esc(v.tempo) + '</p></div></div>';
    h += '<div class="fix">' + ic('alert') + '<div><b>Pazi na ovo</b><p>' + esc(v.t) + '</p></div></div>';
    h += '<div class="vars"><div><span class="eyebrow">Ako je teško</span><p>' + esc(v.e) + '</p></div><div><span class="eyebrow">Ako je lako</span><p>' + esc(v.h) + '</p></div></div>';
    h += '<dl class="kv"><div><dt>Gde</dt><dd>' + (v.gde === 'napolje' ? 'Napolju' : 'U sobi') + '</dd></div>' + (v.kisa ? '<div><dt>Ako ne možeš napolje</dt><dd>' + esc(v.kisa.replace(/^[^:]*: /, '')) + '</dd></div>' : '') +
      '<div><dt>Treba ti</dt><dd>' + esc(v.opr || 'ništa') + '</dd></div><div><dt>Radi mišiće</dt><dd>' + esc(v.m) + '</dd></div><div><dt>Potrošnja</dt><dd class="num">~' + Math.round(v.k * trenutnaTezina() / 70) + ' kcal/min</dd></div></dl>';
    openSheet(h);
  }
  function sheetRec(id, f) {
    if (f != null) UI.por = f;
    const pf = UI.por || 1;
    const r = R[id], x = makro(r, pf), fav = S.omiljeni.includes(id);
    let h = sheetHead(esc(r.n), esc(D.obroci[r.o === 'uzina' ? 'uzina1' : r.o].n) + ' · ' + r.min + ' min');
    h += '<div class="porc"><span>Porcija</span><button class="iconbtn sm" data-act="por" data-id="' + id + '" data-n="-0.25" aria-label="Manja porcija">' + ic('minus') + '</button><b class="num">' + fmtF(pf) + '</b><button class="iconbtn sm" data-act="por" data-id="' + id + '" data-n="0.25" aria-label="Veća porcija">' + ic('plus') + '</button></div>';
    h += '<div class="rmac"><div><b class="num">' + x.k + '</b><span>kcal</span></div><div><b class="num">' + x.p + ' g</b><span>proteini</span></div><div><b class="num">' + x.u + ' g</b><span>ug. hidrati</span></div><div><b class="num">' + x.m + ' g</b><span>masti</span></div><div><b class="num">' + x.v + ' g</b><span>vlakna</span></div></div>';
    h += '<div class="tags">' + r.t.map(t => '<span class="tag">' + esc(D.oznake[t]) + '</span>').join('') + '</div>';
    h += '<h3 class="h3">Sastojci</h3><ul class="ing">' + r.s.map(s => Array.isArray(s) ? '<li><button data-act="food" data-id="' + s[0] + '"><span>' + esc(D.namirnice[s[0]].n) + '</span><span class="num muted">' + Math.round(D.namirnice[s[0]].k * s[1] * pf / 100) + ' kcal</span><b class="num">' + Math.round(s[1] * pf / 5) * 5 + ' g</b></button></li>' : '<li class="plain"><span>' + esc(s) + '</span></li>').join('') + '</ul>';
    h += '<h3 class="h3">Priprema</h3><ol class="steps">' + r.k.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol>';
    const slot = r.o === 'uzina' ? 'uzina1' : r.o;
    h += '<div class="sh-actions"><button class="btn primary" data-act="addmenu" data-id="' + id + '" data-slot="' + slot + '">' + ic('cal') + 'Stavi u jelovnik za ' + (UI.menuDate === keyOf(today()) ? 'danas' : fmtDate(parseKey(UI.menuDate))) + '</button><button class="btn ghost" data-act="fav" data-id="' + id + '">' + ic('star', fav ? 'fav' : '') + (fav ? 'Ukloni iz omiljenih' : 'Dodaj u omiljene') + '</button></div>';
    openSheet(h);
  }
  function sheetFood(id) {
    const n = D.namirnice[id];
    const recs = D.recepti.filter(r => r.s.some(x => Array.isArray(x) && x[0] === id));
    let h = sheetHead(esc(n.n), esc(D.kategorijeNamirnica[n.c]) + ' · ' + (n.o === 1 ? 'jedi slobodno' : 'meri porciju'));
    h += '<div class="rmac"><div><b class="num">' + n.k + '</b><span>kcal</span></div><div><b class="num">' + n.p + ' g</b><span>proteini</span></div><div><b class="num">' + n.u + ' g</b><span>ug. hidrati</span></div><div><b class="num">' + n.m + ' g</b><span>masti</span></div><div><b class="num">' + n.v + ' g</b><span>vlakna</span></div></div><p class="muted small">Vrednosti na 100 g. Preporučena porcija: ' + esc(n.por) + '.</p>';
    h += '<div class="fix good">' + ic('heart') + '<div><b>Zašto je dobra za mršavljenje</b><p>' + esc(n.z) + '</p></div></div>';
    h += '<h3 class="h3">Šta da napraviš (' + recs.length + ')</h3>' + (recs.length ? '<ul class="list">' + recs.map(r => { const x = makro(r); return '<li><button class="li" data-act="rec" data-id="' + r.id + '"><span class="lib"><b>' + esc(r.n) + '</b><span class="muted">' + esc(D.obroci[r.o === 'uzina' ? 'uzina1' : r.o].n) + ' · ' + r.min + ' min</span></span><span class="lik num">' + x.k + '<small>kcal</small></span></button></li>'; }).join('') + '</ul>' : '<p class="muted">Pij uz svaki obrok i tokom dana.</p>');
    openSheet(h);
  }
  function sheetProfil() {
    const p = prof(), c = ciljevi();
    const f = (id, label, val, attrs = '') => '<label class="field"><span>' + label + '</span><input id="' + id + '" name="' + id + '" value="' + esc(val) + '" ' + attrs + '></label>';
    let h = sheetHead('Profil', 'Podešavanja');
    h += '<form class="pform" data-form="profil">' +
      f('ime', 'Ime', p.ime, 'type="text" autocomplete="given-name" placeholder="Kako da te zovem"') +
      '<div class="field"><span>Pol</span>' + seg('pol', p.pol, [['m', 'Muški'], ['z', 'Ženski']]) + '</div>' +
      '<div class="grid2">' + f('god', 'Godine', p.god, 'type="number" inputmode="numeric" min="14" max="90"') + f('visina', 'Visina (cm)', p.visina, 'type="number" inputmode="numeric" min="120" max="230"') +
      f('tezina', 'Početna težina (kg)', p.tezina, 'type="number" inputmode="decimal" step="0.1" min="35" max="300"') + f('cilj', 'Ciljna težina (kg)', p.cilj, 'type="number" inputmode="decimal" step="0.1" min="35" max="300"') + '</div>' +
      f('start', 'Početak programa', p.start, 'type="date"') +
      '<p class="muted small">Program uvek kreće od ponedeljka te nedelje.</p>' +
      '<button class="btn primary" type="submit">' + ic('check') + 'Sačuvaj</button></form>';
    h += '<section class="card flat"><h3 class="h3">Prikaz</h3><div class="field"><span>Pismo</span>' + seg('pismo', p.pismo, [['lat', 'Latinica'], ['cyr', 'Ćirilica']]) + '</div><div class="field"><span>Tema</span>' + seg('tema', p.tema, [['auto', 'Automatski'], ['dark', 'Tamna'], ['light', 'Svetla']]) + '</div></section>';
    h += '<section class="card flat"><h3 class="h3">Tvoji brojevi</h3><dl class="kv"><div><dt>Dnevni cilj</dt><dd class="num">' + fmtN(c.kcal) + ' kcal</dd></div><div><dt>Proteini</dt><dd class="num">' + c.protein + ' g</dd></div><div><dt>Voda</dt><dd class="num">' + c.voda + ' čaša</dd></div><div><dt>Maks. puls</dt><dd class="num">' + c.hrMax + '</dd></div></dl></section>';
    h += '<section class="card flat"><h3 class="h3">Podaci</h3><p class="muted small">' + esc(syncLabel()) + '.</p><div class="row2"><button class="btn ghost" data-act="export">' + ic('copy') + 'Kopiraj rezervnu kopiju</button><button class="btn ghost" data-act="importOpen">Vrati iz kopije</button></div><div id="ioBox"></div>' +
      '<button class="btn danger" data-act="reset">Obriši sve podatke</button></section>';
    openSheet(h);
  }

  /* ================= PLAYER ================= */
  let P = null, AC = null, wakeLock = null;
  function beep(f = 880, d = 0.12, vol = 0.25) {
    if (!prof().zvuk || !AC) return;
    try { const o = AC.createOscillator(), g = AC.createGain(); o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(vol, AC.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, AC.currentTime + d); o.connect(g).connect(AC.destination); o.start(); o.stop(AC.currentTime + d + 0.02); } catch (e) { /* bez zvuka */ }
  }
  function say(t) {
    if (!prof().glas || !('speechSynthesis' in window)) return;
    try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); const vs = speechSynthesis.getVoices(); const v = vs.find(x => /^sr/i.test(x.lang)) || vs.find(x => /^(hr|bs)/i.test(x.lang)); if (v) u.voice = v; u.lang = v ? v.lang : 'sr-RS'; u.rate = 1.02; speechSynthesis.speak(u); } catch (e) { /* bez glasa */ }
  }
  async function lockScreen() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) { wakeLock = null; } }
  function startPlayer(k) {
    const date = parseKey(k), pl = dayPlan(date);
    if (pl.rest) return;
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; }
    const steps = buildSteps(pl.w);
    steps.unshift({ kind: 'prep', t: 10, ex: steps[0].ex, blok: 'Spremi se', z: 1 });
    P = { k: date > today() ? keyOf(today()) : k, w: pl.w, steps, i: 0, paused: false, endsAt: 0, rem: 0, startedAt: Date.now(), active: 0, lastTick: Date.now(), lastSec: null, done: false };
    closeSheet();
    $('#player').hidden = false; document.body.classList.add('locked');
    lockScreen();
    goStep(0);
    P.timer = setInterval(tick, 200);
  }
  function goStep(i) {
    if (i >= P.steps.length) return finish();
    P.i = Math.max(0, i);
    const s = P.steps[P.i];
    P.rem = s.t * 1000; P.endsAt = Date.now() + P.rem; P.lastSec = null;
    if (s.kind === 'rad' || s.kind === 'reps') { beep(1046, 0.25, 0.3); say(D.vezbe[s.ex].n); }
    else if (s.kind === 'odmor') { beep(523, 0.25, 0.25); const nx = nextEx(P.i); if (nx) say('Odmor. Sledi ' + D.vezbe[nx.ex].n); }
    else say('Spremi se. Prva vežba: ' + D.vezbe[s.ex].n);
    renderPlayer();
  }
  const nextEx = i => P.steps.slice(i + 1).find(x => x.kind !== 'odmor' && x.kind !== 'prep');
  function tick() {
    if (!P || P.done) return;
    const now = Date.now(), s = P.steps[P.i];
    if (!P.paused && s.kind !== 'prep') P.active += now - P.lastTick;
    P.lastTick = now;
    if (P.paused || s.kind === 'reps') { updateTotal(); return; }
    const rem = P.endsAt - now, sec = Math.ceil(rem / 1000);
    if (sec !== P.lastSec) { P.lastSec = sec; if (sec <= 3 && sec >= 1) beep(660, 0.1, 0.2); const el = $('#pClock'); if (el) el.textContent = fmtClock(rem / 1000); const rg = $('#pRing'); if (rg) rg.style.strokeDashoffset = (rg.dataset.c * (1 - clamp(rem / (s.t * 1000), 0, 1))).toFixed(1); }
    if (rem <= 0) goStep(P.i + 1);
    updateTotal();
  }
  function updateTotal() {
    const el = $('#pTotal'); if (!el) return;
    const left = P.steps.slice(P.i + 1).reduce((a, s) => a + (s.t || 30), 0) + (P.steps[P.i].kind === 'reps' ? 30 : Math.max(0, (P.paused ? P.rem : P.endsAt - Date.now()) / 1000));
    el.textContent = 'još ' + fmtClock(left);
  }
  function renderPlayer() {
    const s = P.steps[P.i], v = D.vezbe[s.ex], nx = nextEx(P.i);
    const rest = s.kind === 'odmor' || s.kind === 'prep';
    const show = rest ? (s.kind === 'prep' ? v : (nx ? D.vezbe[nx.ex] : null)) : v;
    const size = 210, stroke = 13, r = (size - stroke) / 2, c = 2 * Math.PI * r;
    const pct = P.i / P.steps.length;
    const color = rest ? 'var(--cool)' : 'var(--z' + (s.z || 3) + ')';
    let h = '<div class="p-top"><button class="iconbtn" data-act="pclose" aria-label="Prekini trening">' + ic('x') + '</button><div class="p-t"><b>' + esc(s.blok) + '</b><span id="pTotal" class="num"></span></div>' +
      '<button class="iconbtn' + (prof().zvuk ? ' on' : '') + '" data-act="psound" aria-label="Zvuk">' + ic(prof().zvuk ? 'sound' : 'mute') + '</button><button class="iconbtn' + (prof().glas ? ' on' : '') + '" data-act="pvoice" aria-label="Glas">' + ic('voice') + '</button></div>' +
      '<div class="p-prog"><i style="width:' + (pct * 100).toFixed(1) + '%"></i></div>' +
      '<div class="p-main" style="--pc:' + color + '"><p class="p-kind">' + (s.kind === 'prep' ? 'Spremi se' : s.kind === 'odmor' ? esc(s.label || 'Odmor') : (s.runda ? 'Krug ' + s.runda + ' od ' + s.R : s.set ? 'Serija ' + s.set + ' od ' + s.S : 'Radi')) + '</p>';
    if (s.kind === 'reps') {
      h += '<div class="p-reps"><b class="num">' + s.r + '</b><span>ponavljanja' + (s.strana ? ' po nozi' : '') + '</span></div>';
    } else {
      h += '<div class="p-ring"><svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--track)" stroke-width="' + stroke + '"/><circle id="pRing" data-c="' + c.toFixed(1) + '" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="var(--pc)" stroke-width="' + stroke + '" stroke-linecap="round" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="0" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/></svg><b id="pClock" class="num">' + fmtClock(s.t) + '</b></div>';
    }
    h += '<h2 class="p-name">' + (rest ? (show ? '<small>' + (s.kind === 'prep' ? 'Prva vežba' : 'Sledeće') + '</small>' + esc(show.n) : 'Kraj bloka') : esc(show.n)) + '</h2>' +
      (!rest ? '<p class="p-zone">Puls ' + zonaBpm(s.z) + ' otk/min</p>' : '') +
      (show ? '<div class="p-how"><ol>' + show.koraci.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>' +
        (show.tempo ? '<p class="p-tempo">' + ic('clock') + esc(show.tempo) + '</p>' : '') +
        (!rest ? '<p class="p-tip">' + ic('alert') + esc(show.t) + '</p>' : '') + '</div>' : '') + '</div>' +
      (s.kind === 'reps' ? '<button class="btn primary big" data-act="pnext">' + ic('check') + 'Završio sam seriju</button>' : '') +
      '<div class="p-ctrl"><button class="iconbtn lg" data-act="pprev" aria-label="Prethodno">' + ic('prev') + '</button><button class="iconbtn xl" data-act="ppause" aria-label="' + (P.paused ? 'Nastavi' : 'Pauza') + '">' + ic(P.paused ? 'play' : 'pause') + '</button><button class="iconbtn lg" data-act="pnext" aria-label="Sledeće">' + ic('next') + '</button></div>' +
      (nx && !rest ? '<p class="p-next">Sledi: <b>' + esc(D.vezbe[nx.ex].n) + '</b></p>' : '');
    paint($('#playerBody'), h);
    if (s.kind !== 'reps') { const rg = $('#pRing'); const rem = P.paused ? P.rem : P.endsAt - Date.now(); rg.style.strokeDashoffset = (c * (1 - clamp(rem / (s.t * 1000), 0, 1))).toFixed(1); $('#pClock').textContent = fmtClock(rem / 1000); }
    updateTotal();
  }
  function togglePause() {
    if (P.paused) { P.endsAt = Date.now() + P.rem; P.paused = false; } else { P.rem = P.endsAt - Date.now(); P.paused = true; }
    renderPlayer();
  }
  function finish() {
    P.done = true; clearInterval(P.timer); beep(784, 0.15); setTimeout(() => beep(1046, 0.4), 160); say('Bravo. Trening je završen.');
    const min = Math.max(1, Math.round(P.active / 60000));
    const kcal = Math.round(P.w.kcal * clamp(P.active / 1000 / P.w.trajanje, 0.3, 1.3));
    P.result = { min, kcal };
    paint($('#playerBody'), '<div class="p-done"><div class="burst">' + ic('award') + '</div><p class="eyebrow">Trening završen</p><h2 class="h1">Bravo!</h2><p class="muted">' + esc(P.w.n) + '</p>' +
      '<div class="rmac big"><div><b class="num">' + min + '</b><span>minuta</span></div><div><b class="num">' + kcal + '</b><span>kcal</span></div><div><b class="num">' + P.steps.filter(s => s.kind === 'rad' || s.kind === 'reps').length + '</b><span>intervala</span></div></div>' +
      '<button class="btn primary big" data-act="psave">' + ic('check') + 'Sačuvaj trening</button></div>');
  }
  function closePlayer(save_) {
    if (P && P.timer) clearInterval(P.timer);
    if (save_ && P && P.result) { S.treninzi[P.k] = { id: P.w.id, min: P.result.min, kcal: P.result.kcal, at: Date.now() }; save(); toast('Trening sačuvan. Bravo!'); }
    P = null;
    try { if (wakeLock) wakeLock.release(); } catch (e) { /* ništa */ }
    try { speechSynthesis.cancel(); } catch (e) { /* ništa */ }
    $('#player').hidden = true; document.body.classList.remove('locked');
    renderAll();
  }
  document.addEventListener('visibilitychange', () => { if (P && document.visibilityState === 'visible') lockScreen(); });

  /* ================= toast ================= */
  let toastT;
  function toast(t) { const el = $('#toast'); paint(el, esc(t)); el.hidden = false; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => { el.classList.remove('on'); setTimeout(() => { el.hidden = true; }, 250); }, 2200); }

  /* ================= render ================= */
  const ROOT_THEME = document.documentElement.getAttribute('data-theme');
  function applyTheme() {
    const t = prof().tema, el = document.documentElement;
    if (t !== 'auto') el.setAttribute('data-theme', t);
    else if (ROOT_THEME) el.setAttribute('data-theme', ROOT_THEME);
    else el.removeAttribute('data-theme');
  }
  function renderTabs() {
    paint($('#tabbar'), TABS.map(([id, l, i]) => '<button class="tab' + (UI.tab === id ? ' on' : '') + '" data-act="tab" data-tab="' + id + '" aria-current="' + (UI.tab === id ? 'page' : 'false') + '">' + ic(i) + '<span>' + l + '</span></button>').join(''));
  }
  function renderView() {
    const v = { danas: vDanas, trening: vTrening, ishrana: vIshrana, recepti: vRecepti, napredak: vNapredak }[UI.tab];
    const main = $('#main');
    const active = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.in : null;
    const caret = active ? document.activeElement.selectionStart : null;
    paint(main, v());
    if (active) { const el = main.querySelector('[data-in="' + active + '"]'); if (el) { el.focus(); try { el.setSelectionRange(caret, caret); } catch (e) { /* type=search */ } } }
    if (UI.tab === 'trening' && UI.trSeg === 'plan') { const on = $('#weeks .wk.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' }); }
  }
  function renderAll() { applyTheme(); renderTabs(); renderView(); }
  function setTab(t) {
    UI.tab = t; try { localStorage.setItem('kardio.ui', JSON.stringify({ tab: t })); } catch (e) { /* nema */ }
    try { history.replaceState(null, '', '#' + t); } catch (e) { /* nema */ }
    renderAll(); window.scrollTo(0, 0);
  }

  /* ================= događaji ================= */
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b) { if (e.target.id === 'sheet') closeSheet(); return; }
    const a = b.dataset.act, k = keyOf(today());
    switch (a) {
      case 'tab': closeSheet(); setTab(b.dataset.tab); break;
      case 'seg': {
        const sg = b.dataset.seg, v = b.dataset.v;
        if (sg === 'trSeg' || sg === 'ishSeg') { UI[sg] = v; renderView(); }
        else if (sg === 'pol') { b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', x === b)); b.closest('form').dataset.pol = v; }
        else if (sg === 'pismo' || sg === 'tema') { S.profil[sg] = v; save(); renderAll(); sheetProfil(); }
        break; }
      case 'profil': sheetProfil(); break;
      case 'ob': {
        const id = b.dataset.id, d = dan(k), pl = dayPlan(today());
        if (id === 'trening') { if (pl.rest) setDan(k, { setnja: d.setnja ? 0 : 1 }); else if (S.treninzi[k]) sheetWorkout(k); else sheetWorkout(k); }
        else if (id === 'voda') setDan(k, { voda: d.voda >= ciljevi().voda ? 0 : d.voda + 1 });
        else if (id === 'obroci') { setTab('ishrana'); return; }
        else setDan(k, { [id]: d[id] ? 0 : 1 });
        const ob = obaveze(k); renderView(); if (ob.ok && id !== 'trening') toast('Dan ispunjen. Niz: ' + streak() + ' ' + (streak() === 1 ? 'dan' : 'dana'));
        break; }
      case 'voda': { const n = +b.dataset.n, d = dan(k); setDan(k, { voda: d.voda === n ? n - 1 : n }); renderView(); break; }
      case 'obrok': { const dk = b.dataset.d || k, i = +b.dataset.i, d = dan(dk), o = d.obroci.slice(); o[i] = o[i] ? 0 : 1; setDan(dk, { obroci: o }); renderView(); break; }
      case 'w': sheetWorkout(b.dataset.d); break;
      case 'restinfo': sheetRest(); break;
      case 'start': startPlayer(b.dataset.d); break;
      case 'mark': { const dk = b.dataset.d, pl = dayPlan(parseKey(dk)); S.treninzi[dk] = { id: pl.wid, min: Math.round(pl.w.trajanje / 60), kcal: pl.w.kcal, at: Date.now(), rucno: 1 }; save(); closeSheet(); renderView(); toast('Trening označen kao urađen'); break; }
      case 'undo': delete S.treninzi[b.dataset.d]; save(); closeSheet(); renderView(); break;
      case 'week': UI.week = +b.dataset.w; renderView(); break;
      case 'kat': UI.kat = b.dataset.v; renderView(); break;
      case 'ex': sheetEx(b.dataset.id); break;
      case 'nkat': UI.nKat = b.dataset.v; renderView(); break;
      case 'food': sheetFood(b.dataset.id); break;
      case 'rec': sheetRec(b.dataset.id, b.dataset.f ? +b.dataset.f : 1); break;
      case 'por': UI.por = clamp((UI.por || 1) + +b.dataset.n, 0.5, 2.5); sheetRec(b.dataset.id); break;
      case 'recf': UI.recF = b.dataset.v; renderView(); break;
      case 'friz': UI.friz = !UI.friz; renderView(); break;
      case 'fr': { const id = b.dataset.id, i = S.frizider.indexOf(id); if (i >= 0) S.frizider.splice(i, 1); else S.frizider.push(id); save(); renderView(); break; }
      case 'frclear': S.frizider = []; save(); renderView(); break;
      case 'fav': { const id = b.dataset.id, i = S.omiljeni.indexOf(id); if (i >= 0) S.omiljeni.splice(i, 1); else S.omiljeni.push(id); save(); sheetRec(id); renderView(); break; }
      case 'addmenu': { const dk = UI.menuDate, slot = b.dataset.slot; S.jelovnik[dk] = { ...(S.jelovnik[dk] || {}), [slot]: b.dataset.id }; save(); closeSheet(); renderView(); toast('Dodato u jelovnik'); break; }
      case 'swap': {
        const s = b.dataset.slot, dk = UI.menuDate, m = menuFor(dk), list = poObroku(slotTip(s)), i = list.findIndex(r => r.id === m[s]);
        S.jelovnik[dk] = { ...(S.jelovnik[dk] || {}), [s]: list[(i + 1) % list.length].id }; save(); renderView(); break; }
      case 'mday': { const n = +b.dataset.n; UI.menuDate = keyOf(addDays(parseKey(UI.menuDate), n)); renderView(); break; }
      case 'shop': { const w = b.dataset.w, id = b.dataset.id, arr = (S.kupovina[w] || []).slice(), i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1); else arr.push(id); S.kupovina[w] = arr; save(); renderView(); break; }
      case 'close': closeSheet(); break;
      case 'export': {
        const txt = JSON.stringify(S);
        const box = $('#ioBox'); paint(box, '<label class="field"><span>Rezervna kopija</span><textarea id="ioText" rows="4" readonly></textarea></label>'); $('#ioText').value = txt;
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(() => toast('Kopirano. Sačuvaj je u Beleške.'), () => { $('#ioText').select(); toast('Označi tekst i kopiraj ga'); });
        else { $('#ioText').select(); toast('Označi tekst i kopiraj ga'); }
        break; }
      case 'importOpen': paint($('#ioBox'), '<label class="field"><span>Nalepi kopiju ovde</span><textarea id="ioText" rows="4"></textarea></label><button class="btn primary sm" data-act="import">Vrati podatke</button>'); break;
      case 'import': {
        try { const o = JSON.parse($('#ioText').value); if (!o || !o.profil) throw 0; S = merge(defaultState(), o); save(); closeSheet(); renderAll(); toast('Podaci su vraćeni'); }
        catch (err) { toast('Tekst nije ispravna kopija. Kopiraj ga ceo, od { do }.'); }
        break; }
      case 'reset':
        if (b.dataset.sure) { const keep = { ...S.profil }; S = defaultState(); S.profil = { ...S.profil, pismo: keep.pismo, tema: keep.tema }; save(); closeSheet(); renderAll(); toast('Svi podaci su obrisani'); }
        else { b.dataset.sure = '1'; paint(b, 'Dodirni još jednom da obrišeš sve'); }
        break;
      case 'pclose':
        if (b.dataset.sure || (P && P.done)) closePlayer(false);
        else { b.dataset.sure = '1'; toast('Dodirni X još jednom da prekineš trening'); setTimeout(() => { delete b.dataset.sure; }, 3000); }
        break;
      case 'ppause': togglePause(); break;
      case 'pnext': goStep(P.i + 1); break;
      case 'pprev': goStep(P.i - 1); break;
      case 'psound': S.profil.zvuk = !S.profil.zvuk; save(); renderPlayer(); break;
      case 'pvoice': S.profil.glas = !S.profil.glas; save(); renderPlayer(); if (S.profil.glas) say('Glas je uključen'); break;
      case 'psave': closePlayer(true); break;
    }
  });
  document.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.in; if (!k) return;
    UI[k] = e.target.value; clearTimeout(UI._t); UI._t = setTimeout(renderView, 160);
  });
  document.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, type = f.dataset.form;
    if (type === 'kg') {
      const v = parseFloat(String($('#kgIn').value).replace(',', '.'));
      if (!(v >= 30 && v <= 300)) { toast('Upiši težinu u kilogramima, na primer 88,5'); return; }
      const k = keyOf(today()); S.tezina = S.tezina.filter(x => x.d !== k).concat([{ d: k, kg: r1(v) }]).sort((a, b) => a.d < b.d ? -1 : 1); save(); renderView(); toast('Težina upisana');
    } else if (type === 'profil') {
      const g = id => f.querySelector('#' + id).value;
      const num = (id, a, b, def) => { const v = parseFloat(String(g(id)).replace(',', '.')); return v >= a && v <= b ? v : def; };
      const p = S.profil;
      p.ime = g('ime').trim().slice(0, 30);
      if (f.dataset.pol) p.pol = f.dataset.pol;
      p.god = Math.round(num('god', 14, 90, p.god)); p.visina = Math.round(num('visina', 120, 230, p.visina));
      p.tezina = r1(num('tezina', 35, 300, p.tezina)); p.cilj = r1(num('cilj', 35, 300, p.cilj));
      if (/^\d{4}-\d{2}-\d{2}$/.test(g('start'))) { p.start = g('start'); UI.week = null; }
      p.podeseno = true; save(); closeSheet(); renderAll(); toast('Profil sačuvan');
    }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#sheet').hidden) closeSheet(); });

  /* ================= start ================= */
  // Samostalna verzija (GitHub Pages, ikonica na početnom ekranu) radi i bez interneta
  if ('serviceWorker' in navigator && !/claude|anthropic|usercontent/i.test(location.hostname) && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { /* bez offline rada */ }); });
  }
  renderAll();
  initDb();
  setInterval(() => { const k = keyOf(today()); if (k !== UI._day) { UI._day = k; if (!P) renderView(); } }, 60000);
  UI._day = keyOf(today());
})();
