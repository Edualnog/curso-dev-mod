/* ============================================================
   FiveM Dev Academy — app logic (TryHackMe-style learning path)
   ============================================================ */

const STORE_KEY = "fivem_academy_progress_v1";

const defaultState = {
  completed: {}, xp: 0, quizCorrect: 0, badges: {}, lastDay: null, streak: 0,
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
const $ = (s, el = document) => el.querySelector(s);
const allLessons = () => COURSE.tracks.flatMap(t => t.lessons.map(l => ({ ...l, trackId: t.id })));
const lessonById = (id) => allLessons().find(l => l.id === id);
const totalLessons = () => allLessons().length;
const completedCount = () => Object.keys(state.completed).filter(k => state.completed[k]).length;

function levelFromXp(xp) {
  const c = COURSE.levelCurve; let lvl = 1;
  for (let i = 1; i < c.length; i++) if (xp >= c[i]) lvl = i + 1;
  return lvl;
}
function trackProgress(t) {
  const done = t.lessons.filter(l => state.completed[l.id]).length;
  return { done, total: t.lessons.length, pct: Math.round((done / t.lessons.length) * 100) };
}
function diffClass(tag) {
  if (tag === "Avançado") return "hard";
  if (tag === "Intermediário") return "medium";
  return "easy"; // Iniciante / Pré-requisito
}

/* ---------- Streak ---------- */
function touchStreak() {
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastDay === today) return;
  const yest = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  state.streak = (state.lastDay === yest) ? state.streak + 1 : 1;
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
function trackDone(tid) {
  const t = COURSE.tracks.find(x => x.id === tid);
  return t && t.lessons.every(l => state.completed[l.id]);
}
function checkBadges() {
  if (completedCount() >= 1) earnBadge("first_step");
  if (state.quizCorrect >= 20) earnBadge("quiz_ace");
  if (trackDone("lua")) earnBadge("lua_master");
  if (trackDone("blender")) earnBadge("artist");
  if (trackDone("animacao")) earnBadge("animator");
  if (trackDone("core")) earnBadge("core_dev");
  if (trackDone("nui")) earnBadge("ui_wizard");
  const pct = completedCount() / totalLessons();
  if (pct >= 0.5) earnBadge("halfway");
  if (pct >= 1) earnBadge("graduate");
}

/* ---------- Toast ---------- */
function toast(icon, title, sub, cls = "") {
  const el = document.createElement("div");
  el.className = "toast " + cls;
  el.innerHTML = `<span class="ti">${icon}</span><div><div class="tt">${title}</div><div class="ts">${sub}</div></div>`;
  $("#toasts").appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 320); }, 3200);
}

/* ============================================================
   RENDER
   ============================================================ */
function renderTopAndHero() {
  const lvl = levelFromXp(state.xp);
  $("#nav-points").textContent = state.xp;
  $("#nav-streak").textContent = state.streak;
  $("#nav-rank").textContent = lvl;

  const done = completedCount(), total = totalLessons();
  const pct = Math.round((done / total) * 100);
  $("#hero-pct").textContent = pct + "%";
  $("#hero-frac").textContent = `${done} / ${total} salas`;
  $("#hero-ring").style.background = `conic-gradient(var(--accent) ${pct}%, var(--panel-3) 0)`;

  const lessons = allLessons();
  $("#stat-videos").textContent = lessons.reduce((n, l) => n + l.videos.length, 0);
  $("#stat-quiz").textContent = lessons.reduce((n, l) => n + l.quiz.length, 0);
  $("#stat-tracks").textContent = COURSE.tracks.length;
}

function renderPath() {
  const firstIncomplete = findFirstIncompleteTrack();
  $("#path").innerHTML = COURSE.tracks.map(t => {
    const p = trackProgress(t);
    const complete = p.done === p.total;
    const current = !complete && t.id === firstIncomplete;
    const d = diffClass(t.tag);

    const rooms = t.lessons.map(l => {
      const ld = !!state.completed[l.id];
      return `<div class="room ${ld ? "done" : ""}" data-lesson="${l.id}">
        <button class="room-check" data-check="${l.id}" aria-label="Concluir ${l.title}">✓</button>
        <div class="room-body">
          <div class="room-title">${l.title}</div>
          <div class="room-sub"><span class="rtype">${l.type}</span><span>⏱ ${l.duration}</span><span>${l.videos.length} vídeos</span></div>
        </div>
        <span class="room-xp">+${l.xp}</span>
      </div>`;
    }).join("");

    return `<section class="track ${complete ? "complete" : ""} ${current ? "current" : ""}" id="track-${t.id}">
      <div class="node" style="background: conic-gradient(var(--accent-2) ${p.pct}%, var(--panel-3) 0)">
        <span class="core">${complete ? "✓" : t.icon}</span>
      </div>
      <div class="track-card">
        <div class="track-top">
          <h3>${t.title}</h3>
          <span class="diff ${d}">${t.tag}</span>
          <div class="track-meta"><span class="frac mono">${p.done}/${p.total}</span></div>
        </div>
        <div class="track-bar"><i style="width:${p.pct}%"></i></div>
        <p class="track-sum">${t.summary}</p>
        <div class="rooms">${rooms}</div>
      </div>
    </section>`;
  }).join("");

  $("#path").querySelectorAll(".room").forEach(r =>
    r.addEventListener("click", () => openLesson(r.dataset.lesson)));
  $("#path").querySelectorAll(".room-check").forEach(cb =>
    cb.addEventListener("click", e => { e.stopPropagation(); completeLesson(cb.dataset.check); }));
}

function renderBadges() {
  $("#badges-grid").innerHTML = BADGES.map(b => {
    const earned = !!state.badges[b.id];
    return `<div class="badge ${earned ? "earned" : "locked"}">
      <div class="bi">${earned ? b.icon : "🔒"}</div>
      <div class="bn">${b.name}</div>
      <div class="bd">${b.desc}</div>
    </div>`;
  }).join("");
}

function renderAll() { renderTopAndHero(); renderPath(); renderBadges(); }

function findFirstIncompleteTrack() {
  for (const t of COURSE.tracks) if (!t.lessons.every(l => state.completed[l.id])) return t.id;
  return null;
}
function findFirstIncompleteLesson() {
  for (const t of COURSE.tracks) for (const l of t.lessons) if (!state.completed[l.id]) return l.id;
  return null;
}

/* ============================================================
   LESSON MODAL
   ============================================================ */
function ytSearch(q) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q); }

function openLesson(id) {
  const l = lessonById(id);
  if (!l) return;
  const done = !!state.completed[id];

  const objs = l.objectives.map(o => `<li>${o}</li>`).join("");
  const vids = l.videos.map(v =>
    `<a class="link video" href="${ytSearch(v.query)}" target="_blank" rel="noopener">
      <span class="li">▶</span><span class="lt">${v.label}</span><span class="lg">YouTube ↗</span></a>`).join("");
  const docs = l.docs.map(d =>
    `<a class="link" href="${d.url}" target="_blank" rel="noopener">
      <span class="li">↳</span><span class="lt">${d.label}</span><span class="lg">docs ↗</span></a>`).join("");
  const quiz = l.quiz.map((q, qi) =>
    `<div class="quiz-q" data-qi="${qi}">
      <div class="qt">${qi + 1}. ${q.q}</div>
      <div class="quiz-opts">${q.options.map((o, oi) => `<button class="quiz-opt" data-oi="${oi}">${o}</button>`).join("")}</div>
      <div class="quiz-explain"></div>
    </div>`).join("");

  $("#modal").innerHTML = `
    <div class="modal-head">
      <div>
        <div class="mh-eyebrow">${l.type} · ${l.duration} · +${l.xp} XP</div>
        <h2>${l.title}</h2>
      </div>
      <button class="x" id="modal-x" aria-label="Fechar">✕</button>
    </div>
    <div class="modal-body">
      <div class="block-label">Objetivos</div>
      <ul class="obj-list">${objs}</ul>
      <div class="block-label">Sobre esta sala</div>
      <p class="lesson-text">${l.content}</p>
      <div class="block-label">Vídeos de referência (YouTube)</div>
      <div class="links">${vids}</div>
      <div class="block-label">Documentação oficial</div>
      <div class="links">${docs}</div>
      <div class="block-label">Quiz</div>
      <div class="quiz">${quiz}</div>
    </div>
    <div class="modal-foot">
      <span class="foot-note">Conclua para ganhar +${l.xp} XP.</span>
      <button class="complete-btn ${done ? "done" : ""}" id="complete-btn">${done ? "✓ Concluída" : "Marcar como concluída"}</button>
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
      if (chosen === q.answer) { state.quizCorrect++; saveState(); checkBadges(); renderBadges(); }
      else opt.classList.add("wrong");
      explain.textContent = (chosen === q.answer ? "Correto. " : "Resposta certa destacada. ") + q.explain;
      explain.classList.add("show");
    }));
  });

  $("#modal-x").addEventListener("click", closeModal);
  $("#complete-btn").addEventListener("click", () => completeLesson(id, true));

  $("#overlay").classList.add("open");
  document.body.style.overflow = "hidden";
  $("#modal").scrollTop = 0;
}

function closeModal() {
  $("#overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function completeLesson(id, fromModal = false) {
  if (state.completed[id]) { if (fromModal) closeModal(); return; }
  const l = lessonById(id);
  const before = levelFromXp(state.xp);
  state.completed[id] = true;
  state.xp += l.xp;
  const after = levelFromXp(state.xp);
  touchStreak();
  saveState();
  checkBadges();
  toast("⚡", `+${l.xp} XP`, l.title, "xp");
  if (after > before) setTimeout(() => toast("🎉", `Nível ${after}`, "Você subiu de nível!"), 650);
  renderAll();
  if (fromModal) closeModal();
}

/* ---------- Continue ---------- */
function continueLearning() {
  const id = findFirstIncompleteLesson();
  if (!id) { document.querySelector(".badges").scrollIntoView({ behavior: "smooth" }); return; }
  const track = lessonById(id).trackId;
  document.getElementById("track-" + track)?.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => openLesson(id), 400);
}

/* ---------- Reset ---------- */
function resetProgress() {
  if (!confirm("Apagar todo o progresso, XP e conquistas deste navegador?")) return;
  state = structuredClone(defaultState);
  saveState();
  renderAll();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  $("#overlay").addEventListener("click", e => { if (e.target.id === "overlay") closeModal(); });
  $("#reset-btn").addEventListener("click", resetProgress);
  $("#continue-btn").addEventListener("click", continueLearning);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
});
