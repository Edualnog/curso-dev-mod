/* ============================================================
   FiveM Dev Academy — Lógica do app (gamificação + render)
   ============================================================ */

const STORE_KEY = "fivem_academy_progress_v1";

const defaultState = {
  completed: {},      // { lessonId: true }
  xp: 0,
  quizCorrect: 0,
  badges: {},         // { badgeId: true }
  lastDay: null,      // 'YYYY-MM-DD'
  streak: 0,
};

let state = loadState();

/* ---------- Persistência ---------- */
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return structuredClone(defaultState);
    return Object.assign(structuredClone(defaultState), JSON.parse(raw));
  } catch {
    return structuredClone(defaultState);
  }
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
  if (b) toast(b.icon, "Conquista desbloqueada!", b.name);
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
  el.innerHTML = `<div class="ic">${icon}</div><div><div class="tt">${title}</div><div class="ts">${sub}</div></div>`;
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 350); }, 3200);
}

/* ============================================================
   RENDER
   ============================================================ */
function renderTopbar() {
  const { lvl, pct, hi, lo } = levelBounds(state.xp);
  $("#stat-level").textContent = lvl;
  $("#stat-xp").textContent = state.xp;
  $("#stat-streak").textContent = state.streak;
  const isMax = lvl >= COURSE.levelCurve.length;
  $("#xp-fill").style.width = (isMax ? 100 : pct) + "%";
  $("#xp-lbl").textContent = isMax
    ? "🏅 Nível máximo atingido!"
    : `${state.xp - lo} / ${hi - lo} XP p/ nível ${lvl + 1}`;
}

function renderHeroPills() {
  $("#pill-lessons").textContent = totalLessons();
  $("#pill-done").textContent = completedCount();
  const allVids = COURSE.tracks.reduce((n, t) => n + t.lessons.reduce((m, l) => m + l.videos.length, 0), 0);
  const allQuiz = COURSE.tracks.reduce((n, t) => n + t.lessons.reduce((m, l) => m + l.quiz.length, 0), 0);
  $("#pill-videos").textContent = allVids;
  $("#pill-quiz").textContent = allQuiz;
}

function trackProgress(track) {
  const done = track.lessons.filter(l => state.completed[l.id]).length;
  return { done, total: track.lessons.length, pct: Math.round((done / track.lessons.length) * 100) };
}

function renderRoadmap() {
  const root = $("#roadmap");
  root.innerHTML = "";
  let prevDone = true; // first track always active/unlocked

  COURSE.tracks.forEach((track) => {
    const p = trackProgress(track);
    const isDone = p.done === p.total;
    const isActive = !isDone && prevDone;

    const el = document.createElement("section");
    el.className = "track" + (isDone ? " done" : isActive ? " active" : "");
    el.style.setProperty("--clr", track.color);

    const lessonsHtml = track.lessons.map(l => {
      const done = !!state.completed[l.id];
      return `
        <button class="lesson-chip ${done ? "done" : ""}" data-lesson="${l.id}">
          <span class="check">✓</span>
          <span class="ltype ${l.type}">${l.type}</span>
          <h4>${l.title}</h4>
          <div class="meta"><span>⏱ ${l.duration}</span><span>⚡ ${l.xp} XP</span></div>
        </button>`;
    }).join("");

    el.innerHTML = `
      <div class="node" style="border-color:${isDone ? "var(--accent)" : isActive ? track.color : ""}">${track.icon}</div>
      <div class="track-card">
        <div class="track-head">
          <div>
            <span class="track-tag">${track.tag}</span>
            <h3 style="margin-top:8px">${track.title}</h3>
          </div>
          <div class="track-progress">
            <span>${p.done}/${p.total} aulas</span>
            <div class="bar"><i style="width:${p.pct}%; background:${track.color}"></i></div>
          </div>
        </div>
        <p class="track-summary">${track.summary}</p>
        <div class="lessons">${lessonsHtml}</div>
      </div>`;
    root.appendChild(el);
    prevDone = isDone;
  });

  root.querySelectorAll("[data-lesson]").forEach(btn =>
    btn.addEventListener("click", () => openLesson(btn.dataset.lesson)));
}

function renderBadges() {
  const grid = $("#badges-grid");
  grid.innerHTML = BADGES.map(b => `
    <div class="badge ${state.badges[b.id] ? "earned" : ""}">
      <div class="bi">${b.icon}</div>
      <div class="bn">${b.name}</div>
      <div class="bd">${b.desc}</div>
    </div>`).join("");
}

function renderAll() {
  renderTopbar();
  renderHeroPills();
  renderRoadmap();
  renderBadges();
}

/* ============================================================
   LESSON MODAL
   ============================================================ */
function ytSearch(query) {
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(query);
}

function openLesson(id) {
  const l = lessonById(id);
  if (!l) return;
  const done = !!state.completed[id];

  const objs = l.objectives.map(o => `<li>${o}</li>`).join("");
  const docs = l.docs.map(d => `
    <a class="link-row" href="${d.url}" target="_blank" rel="noopener">
      <span class="ic">📄</span><span class="tx">${d.label}</span><span class="go">Abrir ↗</span>
    </a>`).join("");
  const vids = l.videos.map(v => `
    <a class="link-row video" href="${ytSearch(v.query)}" target="_blank" rel="noopener">
      <span class="ic">▶</span><span class="tx">${v.label}</span><span class="go">YouTube ↗</span>
    </a>`).join("");

  const quizHtml = l.quiz.map((q, qi) => `
    <div class="quiz-q" data-qi="${qi}">
      <div class="qt">${qi + 1}. ${q.q}</div>
      <div class="quiz-opts">
        ${q.options.map((o, oi) => `<button class="quiz-opt" data-oi="${oi}">${o}</button>`).join("")}
      </div>
      <div class="quiz-explain"></div>
    </div>`).join("");

  const modal = $("#modal");
  modal.innerHTML = `
    <div class="modal-head">
      <div>
        <span class="ltype ${l.type}">${l.type}</span>
        <h2>${l.title}</h2>
      </div>
      <button class="x" id="modal-x">✕</button>
    </div>
    <div class="modal-body">
      <h5>🎯 Objetivos da aula</h5>
      <ul class="obj-list">${objs}</ul>

      <h5>📘 Conteúdo</h5>
      <p class="lesson-text">${l.content}</p>

      <h5>▶ Vídeos recomendados (YouTube)</h5>
      <div class="link-grid">${vids}</div>

      <h5>📄 Documentação oficial</h5>
      <div class="link-grid">${docs}</div>

      <h5>🧠 Quiz — teste seu conhecimento</h5>
      <div class="quiz">${quizHtml}</div>
    </div>
    <div class="modal-foot">
      <span class="foot-note">Complete a aula para ganhar <b>${l.xp} XP</b>.</span>
      <button class="complete-btn ${done ? "done" : ""}" id="complete-btn">
        ${done ? "✓ Concluída" : "Marcar como concluída"}
      </button>
    </div>`;

  // Quiz interactions
  modal.querySelectorAll(".quiz-q").forEach((qEl, qi) => {
    const q = l.quiz[qi];
    const opts = qEl.querySelectorAll(".quiz-opt");
    const explain = qEl.querySelector(".quiz-explain");
    opts.forEach(opt => {
      opt.addEventListener("click", () => {
        if (qEl.dataset.answered) return;
        qEl.dataset.answered = "1";
        const chosen = +opt.dataset.oi;
        opts.forEach(o => o.disabled = true);
        opts[q.answer].classList.add("correct");
        if (chosen === q.answer) {
          state.quizCorrect++;
          saveState();
          checkBadges();
          renderBadges();
        } else {
          opt.classList.add("wrong");
        }
        explain.textContent = (chosen === q.answer ? "✅ Correto! " : "❌ ") + q.explain;
        explain.classList.add("show");
      });
    });
  });

  $("#modal-x").addEventListener("click", closeModal);
  $("#complete-btn").addEventListener("click", () => completeLesson(id));

  $("#overlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  $("#overlay").classList.remove("open");
  document.body.style.overflow = "";
}

function completeLesson(id) {
  if (state.completed[id]) return;
  const l = lessonById(id);
  state.completed[id] = true;
  state.xp += l.xp;
  const before = levelFromXp(state.xp - l.xp);
  const after = levelFromXp(state.xp);
  touchStreak();
  saveState();
  checkBadges();

  toast("⚡", `+${l.xp} XP`, l.title);
  if (after > before) setTimeout(() => toast("🎉", "Subiu de nível!", `Você alcançou o nível ${after}`), 600);

  renderAll();
  closeModal();
}

/* ---------- Reset ---------- */
function resetProgress() {
  if (!confirm("Tem certeza? Isso apaga todo o seu progresso, XP e conquistas.")) return;
  state = structuredClone(defaultState);
  saveState();
  renderAll();
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderAll();
  $("#overlay").addEventListener("click", (e) => { if (e.target.id === "overlay") closeModal(); });
  $("#reset-btn").addEventListener("click", resetProgress);
  $("#start-btn").addEventListener("click", () => {
    document.querySelector(".roadmap-title").scrollIntoView({ behavior: "smooth" });
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
});
