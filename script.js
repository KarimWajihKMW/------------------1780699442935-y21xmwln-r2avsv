const leagues = [
  { name: "الدوري الإنجليزي", icon: "🏴", color: "#25d7ff", teams: 20, live: 7 },
  { name: "الدوري الإسباني", icon: "🇪🇸", color: "#ffd166", teams: 20, live: 5 },
  { name: "دوري أبطال أوروبا", icon: "⭐", color: "#0b63ff", teams: 36, live: 9 },
  { name: "كأس العالم", icon: "🌍", color: "#42ff9c", teams: 48, live: 3 },
  { name: "الدوري الإيطالي", icon: "🇮🇹", color: "#ff3b63", teams: 20, live: 4 },
  { name: "الدوري السعودي", icon: "🇸🇦", color: "#20e07a", teams: 18, live: 6 }
];

const players = [
  { name: "محمد صلاح", club: "ليفربول", league: "الدوري الإنجليزي", goals: 18, assists: 11, shots: 72, passes: 1214, minutes: 2380, rating: 8.7, xg: 15.8, tackles: 22, cards: 1 },
  { name: "إيرلينغ هالاند", club: "مانشستر سيتي", league: "الدوري الإنجليزي", goals: 24, assists: 5, shots: 91, passes: 544, minutes: 2210, rating: 8.5, xg: 22.4, tackles: 7, cards: 2 },
  { name: "جود بيلينغهام", club: "ريال مدريد", league: "الدوري الإسباني", goals: 16, assists: 9, shots: 58, passes: 1472, minutes: 2460, rating: 8.9, xg: 12.2, tackles: 54, cards: 4 },
  { name: "فينيسيوس جونيور", club: "ريال مدريد", league: "الدوري الإسباني", goals: 15, assists: 12, shots: 66, passes: 887, minutes: 2025, rating: 8.4, xg: 13.9, tackles: 18, cards: 5 },
  { name: "كيليان مبابي", club: "باريس/فرنسا", league: "دوري أبطال أوروبا", goals: 20, assists: 8, shots: 86, passes: 932, minutes: 2304, rating: 8.8, xg: 18.7, tackles: 13, cards: 2 },
  { name: "لامين يامال", club: "برشلونة", league: "الدوري الإسباني", goals: 8, assists: 10, shots: 44, passes: 990, minutes: 1870, rating: 8.1, xg: 6.7, tackles: 31, cards: 3 },
  { name: "لاوتارو مارتينيز", club: "إنتر ميلان", league: "الدوري الإيطالي", goals: 22, assists: 6, shots: 77, passes: 610, minutes: 2320, rating: 8.3, xg: 20.1, tackles: 16, cards: 4 },
  { name: "رافائيل لياو", club: "ميلان", league: "الدوري الإيطالي", goals: 12, assists: 13, shots: 63, passes: 801, minutes: 2188, rating: 8.0, xg: 10.5, tackles: 20, cards: 2 },
  { name: "سالم الدوسري", club: "الهلال", league: "الدوري السعودي", goals: 13, assists: 12, shots: 55, passes: 1085, minutes: 2140, rating: 8.6, xg: 11.1, tackles: 28, cards: 3 },
  { name: "كريستيانو رونالدو", club: "النصر", league: "الدوري السعودي", goals: 27, assists: 7, shots: 103, passes: 735, minutes: 2410, rating: 8.4, xg: 24.6, tackles: 9, cards: 4 },
  { name: "ليونيل ميسي", club: "الأرجنتين", league: "كأس العالم", goals: 10, assists: 14, shots: 50, passes: 1320, minutes: 1985, rating: 8.9, xg: 9.9, tackles: 19, cards: 1 },
  { name: "هاري كين", club: "إنجلترا", league: "دوري أبطال أوروبا", goals: 23, assists: 9, shots: 88, passes: 840, minutes: 2360, rating: 8.6, xg: 21.8, tackles: 12, cards: 2 }
];

let currentPage = 1;
let deferredInstallPrompt = null;
const pageSize = 6;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function showToast(message) {
  const stack = $("#toastStack");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  stack.appendChild(toast);
  setTimeout(() => toast.remove(), 4300);
}

async function sendLocalNotification(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      body,
      icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'%3E%3Crect width='192' height='192' rx='42' fill='%23061a2f'/%3E%3Ccircle cx='96' cy='96' r='58' fill='%2342ff9c'/%3E%3Ctext x='96' y='118' text-anchor='middle' font-size='72'%3E%E2%9A%BD%3C/text%3E%3C/svg%3E",
      badge: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='24' fill='%23061a2f'/%3E%3Ctext x='48' y='62' text-anchor='middle' font-size='44'%3E%E2%9A%BD%3C/text%3E%3C/svg%3E",
      tag: "footpulse-live-update",
      dir: "rtl"
    });
  } else {
    new Notification(title, { body, dir: "rtl" });
  }
}

function renderLeagues() {
  const track = $("#leagueTrack");
  const grid = $("#leagueGrid");
  const filter = $("#leagueFilter");
  if (track) track.innerHTML = leagues.map(l => `<article class="league-pill"><span>${l.icon}</span><b>${l.name}</b><small>${l.live} مباريات مباشرة</small></article>`).join("");
  if (grid) grid.innerHTML = leagues.map(l => `<article class="league-card" style="--league-color:${l.color}"><span class="eyebrow">${l.icon} ${l.name}</span><h3>${l.name}</h3><p>متابعة إحصائيات اللاعبين والفرق لحظة بلحظة مع تنبيهات للأهداف والبطاقات والتبديلات.</p><div class="meta"><span>${l.teams} فريق</span><span>${l.live} مباشر الآن</span></div><button type="button" data-league="${l.name}">تابع البطولة</button></article>`).join("");
  if (filter && filter.options.length === 1) {
    leagues.forEach(l => filter.insertAdjacentHTML("beforeend", `<option value="${l.name}">${l.name}</option>`));
  }
}

function filteredPlayers() {
  const q = ($("#playerSearch")?.value || "").trim().toLowerCase();
  const league = $("#leagueFilter")?.value || "all";
  const sort = $("#sortSelect")?.value || "rating";
  return players
    .filter(p => (league === "all" || p.league === league) && (`${p.name} ${p.club}`.toLowerCase().includes(q)))
    .sort((a, b) => b[sort] - a[sort]);
}

function renderPlayers() {
  const grid = $("#playersGrid");
  if (!grid) return;
  const list = filteredPlayers();
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  currentPage = Math.min(currentPage, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = list.slice(start, start + pageSize);
  $("#resultCount").textContent = `${list.length} لاعب`;
  $("#pageInfo").textContent = `صفحة ${currentPage} من ${totalPages}`;
  $("#prevPage").disabled = currentPage === 1;
  $("#nextPage").disabled = currentPage === totalPages;
  grid.innerHTML = pageItems.map(p => `
    <article class="player-card" data-tilt>
      <div class="player-top">
        <div><span class="club">${p.club} • ${p.league}</span><h3>${p.name}</h3></div>
        <div class="score-ring" style="--score:${p.rating}"><span>${p.rating.toFixed(1)}</span></div>
      </div>
      <div class="stat-chips">
        <span>أهداف <b>${p.goals}</b></span><span>صناعة <b>${p.assists}</b></span><span>تسديدات <b>${p.shots}</b></span><span>xG <b>${p.xg}</b></span>
        <span>تمريرات <b>${p.passes}</b></span><span>دقائق <b>${p.minutes}</b></span><span>افتكاكات <b>${p.tackles}</b></span><span>بطاقات <b>${p.cards}</b></span>
      </div>
      <div class="player-actions"><button type="button" data-follow="${p.name}">متابعة</button><button type="button" data-alert="${p.name}">تنبيه</button></div>
    </article>`).join("");
}

function renderEvents() {
  const feed = $("#eventFeed");
  if (!feed) return;
  const events = [
    "محمد صلاح رفع تقييمه إلى 8.7 بعد صناعة فرصة محققة",
    "سالم الدوسري وصل إلى 12 صناعة هذا الموسم",
    "رونالدو: تسديدة جديدة ترفع xG إلى 24.6",
    "بيلينغهام الأكثر تأثيراً في آخر 10 دقائق",
    "هالاند يضيف تسديدة على المرمى في الدقيقة 63"
  ];
  feed.innerHTML = events.map(e => `<li><span class="live-dot"></span> ${e}</li>`).join("");
}

function routeTo(path) {
  const normalized = path === "/index.html" ? "/" : path;
  $$(".page").forEach(page => page.classList.toggle("active", page.dataset.page === normalized));
  $$("[data-route]").forEach(link => link.classList.toggle("active", new URL(link.href).pathname === normalized));
  window.scrollTo({ top: 0, behavior: "smooth" });
  revealVisible();
}

function initRouting() {
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-route]");
    if (!link) return;
    event.preventDefault();
    const path = new URL(link.href).pathname;
    history.pushState({}, "", path);
    routeTo(path);
    $(".main-nav")?.classList.remove("open");
    $(".menu-toggle")?.setAttribute("aria-expanded", "false");
  });
  window.addEventListener("popstate", () => routeTo(location.pathname));
  routeTo(location.pathname);
}

function revealVisible() {
  $$(".reveal").forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 70) el.classList.add("in-view");
  });
}

function initTilt() {
  document.addEventListener("mousemove", (e) => {
    $$("[data-tilt]").forEach(card => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (x < 0 || y < 0 || x > r.width || y > r.height) return;
      const rx = ((y / r.height) - .5) * -8;
      const ry = ((x / r.width) - .5) * 8;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
  });
  document.addEventListener("mouseleave", () => $$('[data-tilt]').forEach(card => card.style.transform = ""));
}

function initLiveSimulation() {
  const heroPlayers = ["محمد صلاح", "بيلينغهام", "سالم الدوسري", "هالاند", "رونالدو"];
  setInterval(() => {
    const player = heroPlayers[Math.floor(Math.random() * heroPlayers.length)];
    const rating = (7.8 + Math.random() * 1.2).toFixed(1);
    if ($("#heroPlayerName")) $("#heroPlayerName").textContent = player;
    if ($("#heroRating")) $("#heroRating").textContent = rating;
    if ($("#shotStat")) $("#shotStat").textContent = 2 + Math.floor(Math.random() * 7);
    if ($("#passStat")) $("#passStat").textContent = 35 + Math.floor(Math.random() * 45);
    if ($("#dribbleStat")) $("#dribbleStat").textContent = 1 + Math.floor(Math.random() * 9);
    if ($("#liveUsers")) $("#liveUsers").textContent = (18420 + Math.floor(Math.random() * 950)).toLocaleString("en-US");
    showToast(`تحديث لحظي: ${player} أصبح تقييمه ${rating}`);
    sendLocalNotification("FootPulse تحديث لاعب", `${player} أصبح تقييمه المباشر ${rating}`);
  }, 8500);
}

function initInteractions() {
  $(".menu-toggle")?.addEventListener("click", (e) => {
    const nav = $(".main-nav");
    nav.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", nav.classList.contains("open"));
  });
  ["#playerSearch", "#leagueFilter", "#sortSelect"].forEach(sel => $(sel)?.addEventListener("input", () => { currentPage = 1; renderPlayers(); }));
  $("#prevPage")?.addEventListener("click", () => { currentPage--; renderPlayers(); });
  $("#nextPage")?.addEventListener("click", () => { currentPage++; renderPlayers(); });
  document.addEventListener("click", (event) => {
    const follow = event.target.closest("[data-follow]");
    const alert = event.target.closest("[data-alert]");
    const league = event.target.closest("[data-league]");
    if (follow) showToast(`تمت متابعة ${follow.dataset.follow} ضمن قائمتك المفضلة`);
    if (alert) showToast(`سيصلك تنبيه عند تغيّر أرقام ${alert.dataset.alert}`);
    if (league) showToast(`تم تفعيل متابعة ${league.dataset.league}`);
  });
  $("#notifyBtn")?.addEventListener("click", async () => {
    if ("Notification" in window && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch (e) { /* ignored for unsupported browsers */ }
    }
    $("#notifyCount").textContent = "0";
    showToast("تم تفعيل تنبيهات الأهداف والبطاقات وتحديثات اللاعبين");
    sendLocalNotification("FootPulse", "الإشعارات اللحظية جاهزة للاعبين والدوريات التي تتابعها");
  });
  $("#installAppBtn")?.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      showToast("إن لم يظهر زر التثبيت، استخدم قائمة المتصفح ثم اختر تثبيت التطبيق أو Add to Home Screen");
      return;
    }
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
  });
  $("#iosInstallBtn")?.addEventListener("click", () => showToast("على iPhone: افتح Safari ثم مشاركة ثم Add to Home Screen"));
  $("#apiPlanBtn")?.addEventListener("click", () => showToast("عند توفر API سنستبدل البيانات النموذجية من ملف script.js بطلبات مباشرة دون تغيير الواجهة"));
  $("#subscribeBtn")?.addEventListener("click", () => showToast("تم اختيار اشتراك الدولار الشهري — جاهز للربط ببوابة دفع"));
  $("#loginForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email");
    localStorage.setItem("footpulseUser", email);
    $("#loginMessage").textContent = `مرحباً ${email}، تم تسجيل الدخول محلياً بنجاح.`;
    showToast("تم تسجيل الدخول وتخصيص التنبيهات لحسابك");
  });
}

window.addEventListener("scroll", revealVisible, { passive: true });
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  showToast("يمكنك الآن تثبيت FootPulse كتطبيق على الهاتف");
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js").catch(() => {
      showToast("تعذر تفعيل وضع التطبيق دون اتصال حالياً");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderLeagues();
  renderPlayers();
  renderEvents();
  initRouting();
  initTilt();
  initInteractions();
  initLiveSimulation();
  revealVisible();
  showToast("FootPulse يعمل حالياً ببيانات نموذجية لأنك لا تملك API بعد");
});
