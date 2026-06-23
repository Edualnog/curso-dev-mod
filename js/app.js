/* ============================================================
   FiveM Dev Academy — app logic (gamification + Notion render)
   ============================================================ */

const STORE_KEY = "fivem_academy_progress_v1";

const defaultState = {
  completed: {},   // { lessonId: true }
  xp: 0,
  quizCorrect: 0,
  badges: {},      // { badgeId: true }
  lastDay: null,   // 'YYYY-MM-DD'
  streak: 0,
};

let state = loadState();

/* ---------- Persistence ---------- */
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(defaultState);
    return Object.assign(structuredClone(defaultState), JSON.parse(raw));
  } catch { return structuredClone(defaultState); }
}
function saveState() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

/* ---------- Helpers ---------- */
const $ = (sel, el = document) => el.querySelector(sel);
const allLessons = () => COURSE.tracks.flatMap(t => t.lessons.map(l => ({ ...l, trackId: t.id })));
const lessonById = (id) => allLessons().find(l => l.id === id);
const totalLessons = () => allLessons().length;
const completedCount = () => Object.keys(state.completed).filter(k => state.completed[k]).length;

function levelFromXp(xp) {
  const curve = COURSE.levelCurve;
  let lvl = 1;
  for (let i = 1; i < curve.length; i++) if (xp >= curve[i]) lvl = i + 1;
  return lvl;
}
function levelBounds(xp) {
  const curve = COURSE.levelCurve;
  const lvl = levelFromXp(xp);
  const lo = curve[lvl - 1] ?? 0;
  const hi = curve[lvl] ?? (lo + 1000);
  return { lvl, lo, hi, pct: Math.min(100, Math.round(((xp - lo) / (hi - lo)) * 100)) };
}

/* ---------- Streak ---------- */
function touchStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastDay === today) return;
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  state.streak = (state.lastDay === yesterday) ? state.streak + 1 : 1;
  state.lastDay = today;
  if (state.streak >= 3) earnBadge("streak_3");
}

/* ---------- Badges ---------- */
function earnBadge(id) {
  if (state.badges[id]) return;
  state.badges[id] = true;
  const b = BADGES.find(x => x.id === id);
  if (b) toast(b.icon, "Conquista desbloqueada", b.name);
}
function checkBadges() {
  if (completedCount() >= 1) earnBadge("first_step");
  if (state.quizCorrect >= 20) earnBadge("quiz_ace");
  const trackDone = (tid) => {
    const t = COURSE.tracks.find(x => x.id === tid);
    return t && t.lessons.every(l => state.completed[l.id]);
  };
  if (trackDone("lua")) earnBadge("lua_master");
  if (trackDone("blender")) earnBadge("artist");
  if (trackDone("core")) earnBadge("core_dev");
  if (trackDone("nui")) earnBadge("ui_wizard");
  const pct = completedCount() / totalLessons();
  if (pct >= 0.5) earnBadge("halfway");
  if (pct >= 1) earnBadge("graduate");
}

/* ---------- Toast ---------- */
function toast(icon, title, sub) {
  const wrap = $("#toasts");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `<span class="ti">${icon}</span><div><div class="tt">${title}</div><div class="ts">${sub}</div></div>`;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 3200);
}

/* ============================================================
   RENDER
   ============================================================ */
function trackProgress(t) {
  const done = t.lessons.filter(l => state.completed[l.id]).length;
  return { done, total: t.lessons.length, pct: Math.round((done / t.lessons.length) * 100) };
}

function renderProgress() {
  const { lvl } = levelBounds(state.xp);
  const isMax = lvl >= COURSE.levelCurve.length;
  const { lo, hi, pct } = levelBounds(state.xp);

  $("#side-level").textContent = lvl;
  $("#side-xp").textContent = state.xp;
  $("#side-streak").textContent = state.streak + "🔥";
  $("#side-xpfill").style.width = (isMax ? 100 : pct) + "%";
  $("#side-xplbl").textContent = isMax ? "nível máximo" : `${state.xp - lo} / ${hi - lo} XP p/ nível ${lvl + 1}`;

  $("#props").innerHTML =
    `<span>⚡ Nível <b>${lvl}</b></span>` +
    `<span><b>${state.xp}</b> XP</span>` +
    `<span>🔥 <b>${state.streak}</b> dias</span>` +
    `<span>✅ <b>${completedCount()}</b>/${totalLessons()} aulas</span>`;
}

function renderStats() {
  const lessons = allLessons();
  $("#stat-lessons").textContent = totalLessons();
  $("#stat-videos").textContent = lessons.reduce((n, l) => n + l.videos.length, 0);
  $("#stat-quiz").textContent = lessons.reduce((n, l) => n + l.quiz.length, 0);
  $("#stat-done").textContent = completedCount();
}

function renderNav() {
  const nav = $("#nav-tracks");
  nav.innerHTML = COURSE.tracks.map(t => {
    const p = trackProgress(t);
    const complete = p.done === p.total;
    return `<button class="nav-item ${complete ? "complete" : ""}" data-jump="track-${t.id}">
      <span class="ni-emoji">${t.icon}</span>
      <span class="ni-name">${t.title}</span>
      <span class="ni-count">${complete ? "✓" : p.done + "/" + p.total}</span>
    </button>`;
  }).join("");

  nav.querySelectorAll("[data-jump]").forEach(btn => btn.addEventListener("click", () => {
    document.getElementById(btn.dataset.jump)?.scrollIntoView({ behavior: "smooth", block: "start" });
    $("#sidebar").classList.remove("open");
  }));
}

function renderRoadmap() {
  const root = $("#roadmap");
  root.innerHTML = COURSE.tracks.map(t => {
    const p = trackProgress(t);
    const lessons = t.lessons.map(l => {
      const done = !!state.completed[l.id];
      return `<li class="todo-item ${done ? "done" : ""}" data-lesson="${l.id}">
        <button class="cb" data-check="${l.id}" aria-label="Marcar ${l.title}">✓</button>
        <span class="ti-type mono">${l.type}</span>
        <span class="ti-title">${l.title}</span>
        <span class="ti-meta mono">${l.duration} · ${l.xp} XP</span>
      </li>`;
    }).join("");

    return `<section class="track" id="track-${t.id}">
      <div class="track-top">
        <span class="t-emoji">${t.icon}</span>
        <h3 class="t-title">${t.title}</h3>
        <span class="t-tag mono">${t.tag}</span>
        <span class="t-count mono">${p.done}/${p.total}</span>
        <div class="t-bar"><i style="width:${p.pct}%"></i></div>
      </div>
      <p class="t-sum">${t.summary}</p>
      <ul class="todo">${lessons}</ul>
    </section>`;
  }).join("");

  root.querySelectorAll(".todo-item").forEach(item => {
    item.addEventListener("click", () => openLesson(item.dataset.lesson));
  });
  root.querySelectorAll(".cb").forEach(cb => {
    cb.addEventListener("click", (e) => {
      e.stopPropagation();
      completeLesson(cb.dataset.check);
    });
  });
}

function renderBadges() {
  $("#badges-grid").innerHTML = BADGES.map(b => {
    const earned = !!state.badges[b.id];
    return `<div class="badge ${earned ? "earned" : "locked"}">
      <div class="bi">${b.icon}</div>
      <div class="bn">${b.name}${earned ? "" : '<span class="lock">🔒</span>'}</div>
      <div class="bd">${b.desc}</div>
    </div>`;
  }).join("");
}

function renderAll() {
  renderProgress();
  renderStats();
  renderNav();
  renderRoadmap();
  renderBadges();
  initScrollSpy();
}

/* ============================================================
   LESSON PEEK
   ============================================================ */
function ytSearch(q) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q); }

function openLesson(id) {
  const l = lessonById(id);
  if (!l) return;
  const done = !!state.completed[id];

  const objs = l.objectives.map(o => `<li>${o}</li>`).join("");
  const vids = l.videos.map(v =>
    `<a class="link" href="${ytSearch(v.query)}" target="_blank" rel="noopener">
      <span class="li">▶</span><span class="lt">${v.label}</span><span class="lg">YouTube ↗</span>
    </a>`).join("");
  const docs = l.docs.map(d =>
    `<a class="link" href="${d.url}" target="_blank" rel="noopener">
      <span class="li">↳</span><span class="lt">${d.label}</span><span class="lg">docs ↗</span>
    </a>`).join("");
  const quiz = l.quiz.map((q, qi) =>
    `<div class="quiz-q" data-qi="${qi}">
      <div class="qt">${qi + 1}. ${q.q}</div>
      <div class="quiz-opts">
        ${q.options.map((o, oi) => `<button class="quiz-opt" data-oi="${oi}">${o}</button>`).join("")}
      </div>
      <div class="quiz-explain"></div>
    </div>`).join("");

  $("#modal").innerHTML = `
    <div class="peek-head">
      <div>
        <div class="ph-eyebrow">${l.type} · ${l.duration} · ${l.xp} XP</div>
        <h2>${l.title}</h2>
      </div>
      <button class="x" id="peek-x" aria-label="Fechar">✕</button>
    </div>
    <div class="peek-body">
      <div class="block-label">Objetivos</div>
      <ul class="obj-list">${objs}</ul>

      <div class="block-label">Sobre esta aula</div>
      <p class="lesson-text">${l.content}</p>

      <div class="block-label">Vídeos no YouTube</div>
      <div class="links">${vids}</div>

      <div class="block-label">Documentação oficial</div>
      <div class="links">${docs}</div>

      <div class="block-label">Quiz</div>
      <div class="quiz">${quiz}</div>
    </div>
    <div class="peek-foot">
      <span class="foot-note">Marque como concluída para ganhar ${l.xp} XP.</span>
      <button class="complete-btn ${done ? "done" : ""}" id="complete-btn">
        ${done ? "✓ Concluída" : "Marcar como concluída"}
      </button>
    </div>`;

  $("#modal").querySelectorAll(".quiz-q").forEach((qEl, qi) => {
    const q = l.quiz[qi];
    const opts = qEl.querySelectorAll(".quiz-opt");
    const explain = qEl.querySelector(".quiz-explain");
    opts.forEach(opt => opt.addEventListener("click", () => {
      if (qEl.dataset.answered) return;
      qEl.dataset.answered = "1";
      const chosen = +opt.dataset.oi;
      opts.forEach(o => o.disabled = true);
      opts[q.answer].classList.add("correct");
      if (chosen === q.answer) {
        state.quizCorrect++; saveState(); checkBadges(); renderBadges();
      } else {
        opt.classList.add("wrong");
      }
      explain.textContent = (chosen === q.answer ? "Correto. " : "Resposta certa destacada acima. ") + q.explain;
      explain.classList.add("show");
    }));
  });

  $("#peek-x").addEventListener("click", closeModal);
  $("#complete-btn").addEventListener("click", () => completeLesson(id, true));

  $("#overlay").classList.add("open");
  document.body.style.overflow = "hidden";
  $("#modal").scrollTop = 0;
}

function closeModal() {
  $("#overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function completeLesson(id, fromPeek = false) {
  if (state.completed[id]) { if (fromPeek) closeModal(); return; }
  const l = lessonById(id);
  const before = levelFromXp(state.xp);
  state.completed[id] = true;
  state.xp += l.xp;
  const after = levelFromXp(state.xp);
  touchStreak();
  saveState();
  checkBadges();

  toast("⚡", `+${l.xp} XP`, l.title);
  if (after > before) setTimeout(() => toast("🎉", `Nível ${after}`, "Você subiu de nível"), 650);

  renderAll();
  if (fromPeek) closeModal();
}

/* ---------- Reset ---------- */
function resetProgress() {
  if (!confirm("Apagar todo o progresso, XP e conquistas deste navegador?")) return;
  state = structuredClone(defaultState);
  saveState();
  renderAll();
}

/* ---------- Scrollspy (sidebar active) ---------- */
let spyObs = null;
function initScrollSpy() {
  if (spyObs) spyObs.disconnect();
  const items = new Map();
  document.querySelectorAll(".nav-item").forEach(n => items.set(n.dataset.jump, n));
  spyObs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        document.querySelectorAll(".nav-item.active").forEach(n => n.classList.remove("active"));
        items.get(en.target.id)?.classList.add("active");
      }
    });
  }, { rootMargin: "-15% 0px -75% 0px" });
  document.querySelectorAll(".track").forEach(t => spyObs.observe(t));
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  $("#overlay").addEventListener("click", (e) => { if (e.target.id === "overlay") closeModal(); });
  $("#reset-btn").addEventListener("click", resetProgress);
  $("#menu-btn").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
});
