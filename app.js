import { firebaseConfig, COURSES, MATERIAL_TYPES, LAST_UPDATED, IMPORTANT_LINKS, POPULAR_SUBJECTS } from './firebase-config.js';

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

let currentUser = null;
let pendingAction = null;

// ---------------- icons ----------------
const ICONS = {
  home: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5"/><path d="M5 9.5V21h14V9.5"/></svg>`,
  building: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="9" height="18"/><rect x="14" y="8" width="6" height="13"/><line x1="7" y1="7" x2="10" y2="7"/><line x1="7" y1="11" x2="10" y2="11"/><line x1="7" y1="15" x2="10" y2="15"/></svg>`,
  columns: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l8-6 8 6v12"/><line x1="4" y1="21" x2="20" y2="21"/><line x1="9" y1="21" x2="9" y2="12"/><line x1="15" y1="21" x2="15" y2="12"/></svg>`,
  layers: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 3 2 9 12 15 22 9 12 3"/><polyline points="2 15 12 21 22 15"/></svg>`,
  cap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/></svg>`,
  file: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  book: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>`,
  papers: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>`,
  play: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
  clipboard: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3"/></svg>`,
  monitor: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  search: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  folder: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2Z"/></svg>`,
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>`,
  chevron: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  chevronRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  arrowRight: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  megaphone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 13v-2Z"/><path d="M11.6 16.8a3 3 0 0 1-5.8-1.6"/></svg>`,
  link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11 4.93"/><path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L13 19.07"/></svg>`,
  lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  download: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><polyline points="7 11 12 16 17 11"/><path d="M5 21h14"/></svg>`,
  shield: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z"/></svg>`,
  cloud: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 0 0-11.4-1.5A5 5 0 0 0 6.5 19h11Z"/></svg>`,
};

const TYPE_ICON = {
  "Notes": ICONS.file, "Books": ICONS.book, "Question Papers": ICONS.papers,
  "Videos": ICONS.play, "Syllabus": ICONS.clipboard, "Software": ICONS.monitor, "Other": ICONS.folder
};
const TYPE_COLOR_RGB = {
  "Notes": "220,38,38", "Books": "22,163,74", "Question Papers": "217,119,6",
  "Videos": "124,58,237", "Syllabus": "47,111,237", "Software": "13,148,136", "Other": "138,144,153"
};
const PALETTE_RGB = ["47,111,237", "124,58,237", "22,163,74", "217,119,6", "219,39,119", "13,148,136"];

let allMaterials = [];
let announcements = [];
let state = { view: "courses", courseId: null, partId: null, subject: null, searchTerm: "", searchType: "" };

const els = id => document.getElementById(id);
const app_ = {
  crumbs: els("crumbs"),
  crumbBarWrap: els("crumbBarWrap"),
  main: els("mainContent"),
  authArea: els("authArea"),
  modalBackdrop: els("modalBackdrop"),
  closeModal: els("closeModal"),
  contributeForm: els("contributeForm"),
  courseSelect: els("courseSelect"),
  partSelect: els("partSelect"),
  subjectSelect: els("subjectSelect"),
  typeSelect: els("typeSelect"),
  formError: els("formError"),
  formSuccess: els("formSuccess"),
  submitBtn: els("submitBtn"),
  loginBackdrop: els("loginBackdrop"),
  closeLoginModal: els("closeLoginModal"),
  googleSignInBtn: els("googleSignInBtn"),
  loginModalError: els("loginModalError"),
  headerSearchBtn: els("headerSearchBtn"),
  searchBackdrop: els("searchBackdrop"),
  closeSearchModal: els("closeSearchModal"),
  footerUpdated: els("footerUpdated"),
  themeToggleBtn: els("themeToggleBtn"),
  themeIcon: els("themeIcon"),
  navHome: els("navHome"),
  navCoursesBtn: els("navCoursesBtn"),
  navCoursesMenu: els("navCoursesMenu"),
  navContribute: els("navContribute"),
  footerContribute: els("footerContribute"),
  footerResources: els("footerResources"),
  footerCourses: els("footerCourses"),
  linkInputWrap: els("linkInputWrap"),
  qpFieldsWrap: els("qpFieldsWrap"),
  qpYear: els("qpYear"),
  qpFormatRadios: document.getElementsByName("qpFormat"),
  qpPdfWrap: els("qpPdfWrap"),
  qpPdfLink: els("qpPdfLink"),
  qpImagesWrap: els("qpImagesWrap"),
  qpImagesTextarea: els("qpImagesTextarea"),
  paperViewerBackdrop: els("paperViewerBackdrop"),
  closePaperViewer: els("closePaperViewer"),
  paperViewerTitle: els("paperViewerTitle"),
  paperViewerBody: els("paperViewerBody"),
};

function courseById(id) { return COURSES.find(c => c.id === id); }
function partById(course, id) { return course.parts.find(p => p.id === id); }
function escapeHtml(str) { const d = document.createElement("div"); d.textContent = str; return d.innerHTML; }

// ---------------- Google Drive link helpers ----------------
// Pulls the file ID out of any common Drive share-link shape:
// .../file/d/ID/view, ...open?id=ID, ...uc?id=ID, or a bare ID.
function extractDriveFileId(url) {
  if (!url) return null;
  const patterns = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/, /^([a-zA-Z0-9_-]{20,})$/];
  for (const p of patterns) { const m = url.match(p); if (m) return m[1]; }
  return null;
}
function drivePreviewUrl(link) {
  const id = extractDriveFileId(link);
  return id ? `https://drive.google.com/file/d/${id}/preview` : link;
}
function driveImageUrl(link) {
  const id = extractDriveFileId(link);
  return id ? `https://drive.google.com/thumbnail?id=${id}&sz=w1600` : link;
}

// Matches the sanitize() rule used when generating the /syllabus folder tree,
// so links here resolve to the right static page.
function sanitizeForPath(str) { return String(str).replace(/[<>:"/\\|?*]/g, '-').replace(/\s+/g, ' ').trim(); }
function syllabusPathFor(course, part, subject) {
  return `syllabus/${sanitizeForPath(course.name)}/${sanitizeForPath(part.label)}/${sanitizeForPath(subject)}/index.html`;
}

function countMaterials(filter) {
  return allMaterials.filter(m =>
    (!filter.courseId || m.courseId === filter.courseId) &&
    (!filter.partId || m.partId === filter.partId) &&
    (!filter.subject || m.subject === filter.subject)
  ).length;
}

// ---------------- theme ----------------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem("als-theme", theme); } catch(e) {}
  document.querySelectorAll('.logo-img img').forEach(img => {
    img.src = theme === "dark" ? "assets/logo-white.svg" : "assets/logo-black.svg";
  });
  document.querySelectorAll('.wordmark-img').forEach(img => {
    img.src = theme === "dark" ? "assets/wordmark-white.svg" : "assets/wordmark-black.svg";
  });
  app_.themeIcon.innerHTML = theme === "dark"
    ? `<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z"/>`
    : `<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>`;
}
function initTheme() {
  const saved = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  applyTheme(saved);
  app_.themeToggleBtn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    applyTheme(cur === "dark" ? "light" : "dark");
  });
}

// ---------------- auth ----------------
function requireLogin(action) {
  if (currentUser) { action(); return; }
  pendingAction = action;
  openLoginModal();
}
function openLoginModal() { app_.loginModalError.classList.remove("show"); app_.loginBackdrop.classList.add("open"); }
function closeLoginModal() { app_.loginBackdrop.classList.remove("open"); }

function renderAuthArea() {
  if (currentUser) {
    const initial = (currentUser.displayName || currentUser.email || "?").charAt(0).toUpperCase();
    app_.authArea.innerHTML = `
      <div class="user-chip" id="userChip" title="Sign out">
        <span class="avatar">${currentUser.photoURL ? `<img src="${currentUser.photoURL}" alt="">` : initial}</span>
        <span>${(currentUser.displayName || currentUser.email || "").split(" ")[0]}</span>
      </div>`;
    els("userChip").addEventListener("click", () => { if (confirm("Sign out?")) signOut(auth); });
  } else {
    app_.authArea.innerHTML = `<button class="btn btn-primary" id="signInHeaderBtn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Login</button>`;
    els("signInHeaderBtn").addEventListener("click", openLoginModal);
  }
}

app_.closeLoginModal.addEventListener("click", closeLoginModal);
app_.loginBackdrop.addEventListener("click", e => { if (e.target === app_.loginBackdrop) closeLoginModal(); });
app_.googleSignInBtn.addEventListener("click", async () => {
  app_.loginModalError.classList.remove("show");
  try { await signInWithPopup(auth, googleProvider); closeLoginModal(); }
  catch (err) { console.error(err); app_.loginModalError.textContent = "Sign-in failed. Please try again."; app_.loginModalError.classList.add("show"); }
});

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  renderAuthArea();
  await loadMaterials();
  if (user && pendingAction) { const fn = pendingAction; pendingAction = null; fn(); }
});

// ---------------- nav ----------------
function handleQuickTypeClick(type) {
  // "Syllabus" opens the official reference folder built from real syllabus
  // documents — separate from admin-uploaded "Syllabus"-tagged materials,
  // which is what a normal search would otherwise show (often empty).
  if (type === "Syllabus") { window.open("syllabus/index.html", "_blank"); return; }
  requireLogin(() => goSearch("", type));
}

function populateNav() {
  app_.navCoursesMenu.innerHTML = COURSES.map(c => `<button data-course="${c.id}">${c.fullName}</button>`).join("");
  app_.navCoursesMenu.querySelectorAll("button[data-course]").forEach(b => {
    b.addEventListener("click", () => { app_.navCoursesMenu.classList.remove("open"); goParts(b.dataset.course); });
  });
  app_.navCoursesBtn.addEventListener("click", (e) => { e.stopPropagation(); app_.navCoursesMenu.classList.toggle("open"); });
  document.addEventListener("click", () => app_.navCoursesMenu.classList.remove("open"));

  document.querySelectorAll('.nav-item[data-navtype]').forEach(btn => {
    btn.addEventListener("click", () => handleQuickTypeClick(btn.dataset.navtype));
  });
  app_.navHome.addEventListener("click", goHome);
  app_.navContribute.addEventListener("click", () => requireLogin(() => openModal()));
  app_.footerContribute.addEventListener("click", () => requireLogin(() => openModal()));

  app_.footerResources.innerHTML = MATERIAL_TYPES.filter(t => t !== "Other").map(t =>
    `<li><button data-navtype="${t}">${t}</button></li>`).join("");
  app_.footerResources.querySelectorAll("button[data-navtype]").forEach(btn => {
    btn.addEventListener("click", () => handleQuickTypeClick(btn.dataset.navtype));
  });
  app_.footerCourses.innerHTML = COURSES.map(c => `<li><button data-course="${c.id}">${c.name}</button></li>`).join("");
  app_.footerCourses.querySelectorAll("button[data-course]").forEach(btn => {
    btn.addEventListener("click", () => goParts(btn.dataset.course));
  });
}
function updateNavActive() {
  app_.navHome.classList.toggle("active", state.view === "courses");
}

// ---------------- breadcrumbs ----------------
function renderCrumbs() {
  if (state.view === "courses") { app_.crumbBarWrap.style.display = "none"; return; }
  app_.crumbBarWrap.style.display = "block";
  const parts = [`<button data-nav="home">${ICONS.home}</button>`];
  if (state.courseId) {
    const c = courseById(state.courseId);
    parts.push(`<span class="sep">${ICONS.chevron}</span>`);
    parts.push(state.view === "parts" ? `<span class="current">${c.name}</span>` : `<button data-nav="parts" data-course="${c.id}">${c.name}</button>`);
  }
  if (state.partId) {
    const c = courseById(state.courseId), p = partById(c, state.partId);
    parts.push(`<span class="sep">${ICONS.chevron}</span>`);
    parts.push(state.view === "subjects" ? `<span class="current">${p.label}</span>` : `<button data-nav="subjects" data-course="${c.id}" data-part="${p.id}">${p.label}</button>`);
  }
  if (state.subject) { parts.push(`<span class="sep">${ICONS.chevron}</span>`); parts.push(`<span class="current">${state.subject}</span>`); }
  if (state.view === "search") { parts.push(`<span class="sep">${ICONS.chevron}</span>`); parts.push(`<span class="current">Search results</span>`); }
  app_.crumbs.innerHTML = parts.join("");
  app_.crumbs.querySelectorAll("button[data-nav]").forEach(b => b.addEventListener("click", () => {
    const nav = b.dataset.nav;
    if (nav === "home") goHome(); else if (nav === "parts") goParts(b.dataset.course); else if (nav === "subjects") goSubjects(b.dataset.course, b.dataset.part);
  }));
}

// ---------------- navigation ----------------
function goHome() { state = { view: "courses", courseId: null, partId: null, subject: null, searchTerm: "", searchType: "" }; render(); }
function goParts(courseId) { state = { view: "parts", courseId, partId: null, subject: null, searchTerm: "", searchType: "" }; render(); }
function goSubjects(courseId, partId) { state = { view: "subjects", courseId, partId, subject: null, searchTerm: "", searchType: "" }; render(); }
function goMaterials(courseId, partId, subject) { state = { view: "materials", courseId, partId, subject, searchTerm: "", searchType: "" }; render(); }
function goSearch(term, type, scopeCourseId) { state = { view: "search", courseId: scopeCourseId || null, partId: null, subject: null, searchTerm: term || "", searchType: type || "" }; render(); }

function render() {
  renderCrumbs();
  updateNavActive();
  updatePageTitle();
  if (state.view === "courses") return renderHome();
  if (state.view === "parts") return renderParts();
  if (state.view === "subjects") return renderSubjects();
  if (state.view === "materials") return renderMaterialsView();
  if (state.view === "search") return renderSearchView();
}
function updatePageTitle() {
  const base = "ROOPREKHAA";
  if (state.view === "courses") { document.title = base; return; }
  if (state.view === "parts") { document.title = `${courseById(state.courseId).name} — ${base}`; return; }
  if (state.view === "subjects") { const c = courseById(state.courseId), p = partById(c, state.partId); document.title = `${c.name} ${p.label} — ${base}`; return; }
  if (state.view === "materials") { document.title = `${state.subject} — ${base}`; return; }
  if (state.view === "search") { document.title = `Search — ${base}`; return; }
}

function quickAccessGrid(scopeCourseId) {
  return `<div class="quick-grid">
    ${MATERIAL_TYPES.filter(t => t !== "Other").map(t => `
      <div class="quick-card" data-type="${t}" ${scopeCourseId ? `data-scope="${scopeCourseId}"` : ""}>
        <div class="qi" style="background:rgba(${TYPE_COLOR_RGB[t]},.1); color:rgb(${TYPE_COLOR_RGB[t]})">${TYPE_ICON[t]}</div>
        <div><h4>${t}</h4><p>Browse all ${t.toLowerCase()}</p></div>
      </div>`).join("")}
  </div>`;
}
function bindQuickAccess(scopeCourseId) {
  document.querySelectorAll(".quick-card").forEach(q => q.addEventListener("click", () => requireLogin(() => goSearch("", q.dataset.type, scopeCourseId || null))));
}

function importantLinksPanel() {
  return `<div class="panel">
    <div class="panel-head">${ICONS.link}<h3>Important Links</h3><button class="view-all">View All</button></div>
    ${IMPORTANT_LINKS.slice(0,6).map((l, i) => `
      <div class="link-row">
        <a href="${l.url}" target="_blank" rel="noopener noreferrer">
          <span class="li-ic" style="background:rgba(${PALETTE_RGB[i % PALETTE_RGB.length]},.1); color:rgb(${PALETTE_RGB[i % PALETTE_RGB.length]})">${ICONS.link}</span>
          ${escapeHtml(l.label)}
        </a>
        <span class="chev">${ICONS.chevronRight}</span>
      </div>`).join("")}
  </div>`;
}

function announcementsPanel() {
  return `<div class="panel">
    <div class="panel-head">${ICONS.megaphone}<h3>Announcements</h3><button class="view-all">View All</button></div>
    ${announcements.length === 0 ? `<div class="empty-state" style="padding:24px;">No announcements yet.</div>` :
      announcements.slice(0,4).map(a => {
        const kind = a.kind || "info";
        const dateStr = a.createdAt?.toDate ? a.createdAt.toDate().toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "";
        return `<div class="ann-row">
          <span class="ann-badge ${kind}">${kind}</span>
          <div class="ann-body">
            <h4>${escapeHtml(a.title || "")}</h4>
            ${a.body ? `<p>${escapeHtml(a.body)}</p>` : ""}
            <span class="ann-date">${dateStr}</span>
            ${a.link ? ` · <a class="link" href="${a.link}" target="_blank" rel="noopener noreferrer">Open</a>` : ""}
          </div>
        </div>`;
      }).join("")}
  </div>`;
}

function latestUploadsPanel() {
  const items = allMaterials.slice(0, 4);
  return `<div class="panel">
    <div class="panel-head">${ICONS.file}<h3>Latest Uploads</h3><button class="view-all">View All</button></div>
    ${items.length === 0
      ? `<div class="empty-state" style="padding:24px;">${currentUser ? "Nothing uploaded yet." : "Sign in to see the latest uploads."}</div>`
      : items.map(m => {
          const dateStr = m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString("en-IN", { month: "short", day: "numeric" }) : "";
          const c = courseById(m.courseId), p = c ? partById(c, m.partId) : null;
          const abbr = (m.type || "FILE").slice(0,3).toUpperCase();
          const colorIdx = (m.type ? m.type.length : 0) % PALETTE_RGB.length;
          return `<div class="upload-row">
            <div class="upload-ic" style="background:rgba(${PALETTE_RGB[colorIdx]},.12); color:rgb(${PALETTE_RGB[colorIdx]})">${abbr}</div>
            <div class="upload-body">
              <h4>${escapeHtml(m.title || "Untitled")}</h4>
              <p>${c ? c.name : ""} ${p ? "· " + p.label : ""}</p>
            </div>
            <div class="upload-meta">
              ${dateStr}
              <a class="dl" href="${m.fileURL || m.link || "#"}" target="_blank" rel="noopener noreferrer">${ICONS.download}</a>
            </div>
          </div>`;
        }).join("")}
  </div>`;
}

function popularSubjectsPanel() {
  return `<div class="panel">
    <div class="panel-head">${ICONS.book}<h3>Popular Subjects</h3><button class="view-all">View All</button></div>
    <div class="subject-grid">
      ${POPULAR_SUBJECTS.map((s, i) => `
        <div class="subject-chip" data-term="${escapeHtml(s)}">
          <span class="sc-ic" style="background:rgba(${PALETTE_RGB[i % PALETTE_RGB.length]},.1); color:rgb(${PALETTE_RGB[i % PALETTE_RGB.length]})">${ICONS.book}</span>
          <span>${escapeHtml(s)}</span>
        </div>`).join("")}
    </div>
  </div>`;
}

function newsletterBox() {
  return `<div class="newsletter">
    <h3>Stay Updated!</h3>
    <p>Subscribe to get notified about new uploads, important updates and announcements.</p>
    <form id="newsletterForm">
      <input type="email" id="newsletterEmail" placeholder="Enter your email address" required>
      <button type="submit" class="btn btn-primary" style="justify-content:center;">Subscribe</button>
    </form>
    <div class="ns-msg" id="newsletterMsg"></div>
  </div>`;
}

function featureStrip() {
  const items = [
    { icon: ICONS.cloud, color: PALETTE_RGB[0], title: "Easy Access", sub: "Access anytime, anywhere" },
    { icon: ICONS.shield, color: PALETTE_RGB[2], title: "Quality Content", sub: "Verified & curated resources" },
    { icon: ICONS.users, color: PALETTE_RGB[0], title: "Student Driven", sub: "Built by students, for students" },
    { icon: ICONS.heart, color: PALETTE_RGB[4], title: "100% Free", sub: "All resources are completely free" },
  ];
  return `<div class="feature-strip">
    ${items.map(it => `<div class="feature-item">
      <div class="fi" style="background:rgba(${it.color},.1); color:rgb(${it.color})">${it.icon}</div>
      <div><h4>${it.title}</h4><p>${it.sub}</p></div>
    </div>`).join("")}
  </div>`;
}

function heroArt() {
  return `<svg viewBox="0 0 400 320" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="40" y="120" width="320" height="170" rx="6" fill="rgba(47,111,237,0.06)"/>
    <rect x="70" y="90" width="130" height="200" fill="none" stroke="rgb(47,111,237)" stroke-width="2"/>
    <rect x="85" y="110" width="24" height="24" fill="none" stroke="rgb(47,111,237)" stroke-width="1.5"/>
    <rect x="120" y="110" width="24" height="24" fill="none" stroke="rgb(47,111,237)" stroke-width="1.5"/>
    <rect x="155" y="110" width="24" height="24" fill="none" stroke="rgb(47,111,237)" stroke-width="1.5"/>
    <rect x="85" y="150" width="24" height="24" fill="none" stroke="rgb(47,111,237)" stroke-width="1.5"/>
    <rect x="120" y="150" width="24" height="24" fill="none" stroke="rgb(47,111,237)" stroke-width="1.5"/>
    <rect x="155" y="150" width="24" height="24" fill="none" stroke="rgb(47,111,237)" stroke-width="1.5"/>
    <rect x="115" y="230" width="40" height="60" fill="none" stroke="rgb(47,111,237)" stroke-width="1.5"/>
    <rect x="210" y="60" width="130" height="230" fill="none" stroke="rgb(124,58,237)" stroke-width="2"/>
    <rect x="225" y="80" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="255" y="80" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="285" y="80" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="225" y="130" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="255" y="130" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="285" y="130" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="225" y="180" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="255" y="180" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="285" y="180" width="20" height="30" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <rect x="255" y="235" width="40" height="55" fill="none" stroke="rgb(124,58,237)" stroke-width="1.5"/>
    <line x1="20" y1="290" x2="380" y2="290" stroke="rgb(138,144,153)" stroke-width="2"/>
    <circle cx="345" cy="45" r="14" fill="rgba(217,119,6,.5)"/>
  </svg>`;
}

function renderHome() {
  const totalMaterials = allMaterials.length;
  const totalSubjects = COURSES.reduce((n, c) => n + c.parts.reduce((m, p) => m + p.subjects.length, 0), 0);

  app_.main.innerHTML = `
    <section class="hero">
      <div>
        <p class="eyebrow">FREE · CURATED · STUDENT DRIVEN</p>
        <h1>Everything Architecture.<br><span class="accent">All in One</span> Place.</h1>
        <p class="lead">Access high-quality study materials, notes, books, papers, videos and more for IIA, Diploma, B.Arch and M.Arch courses.</p>
        <div class="search-wrap">
          <div class="search-box">
            ${ICONS.search}
            <input type="text" id="heroSearch" placeholder="Search notes, books, subjects, papers..." autocomplete="off">
            <button id="heroSearchBtn">${ICONS.search}</button>
          </div>
          <div class="suggestions" id="suggestions"></div>
        </div>
        <div class="tag-row">
          <span class="label">Popular:</span>
          ${["Building Construction","Structural Systems","Design Studio","Working Drawings","History of Architecture"]
            .map(t => `<button class="pill" data-tag="${t}">${t}</button>`).join("")}
        </div>
      </div>
      <div class="hero-art">${heroArt()}</div>
    </section>

    <div class="stats-bar">
      <div class="stat">${ICONS.users}<div><div class="num">500+</div><div class="lbl">Students</div></div></div>
      <div class="stat">${ICONS.folder}<div><div class="num">${totalMaterials}</div><div class="lbl">Resources</div></div></div>
      <div class="stat">${ICONS.book}<div><div class="num">${totalSubjects}</div><div class="lbl">Subjects</div></div></div>
      <div class="stat">${ICONS.cap}<div><div class="num">${COURSES.length}</div><div class="lbl">Courses</div></div></div>
      <div class="stat">${ICONS.heart}<div><div class="num">100%</div><div class="lbl">Free</div></div></div>
    </div>

    <section class="section">
      <div class="section-head"><span class="bar"></span><h2>Explore by Course</h2></div>
      <div class="course-grid">
        ${COURSES.map(c => `
          <div class="course-card accent-${c.accent}" data-course="${c.id}" tabindex="0" role="button">
            <div class="icon-circle">${ICONS.building}</div>
            <h3>${c.name}</h3>
            <div class="full-name">${c.fullName}</div>
            <p>${c.tagline}</p>
            <span class="explore">Explore ${c.parts[0].label.includes("Semester") ? "Semesters" : "Parts"} ${ICONS.arrowRight}</span>
          </div>`).join("")}
      </div>
    </section>

    <section class="section">
      <div class="panel-grid">
        ${importantLinksPanel()}
        ${announcementsPanel()}
      </div>
    </section>

    <section class="section">
      <div class="panel-grid">
        ${latestUploadsPanel()}
        ${popularSubjectsPanel()}
      </div>
    </section>

    <section class="section">
      ${newsletterBox()}
    </section>

    <section class="section">
      <div class="section-head"><span class="bar"></span><h2>Quick Access</h2></div>
      ${quickAccessGrid(null)}
    </section>

    ${featureStrip()}
  `;

  bindHeroSearch();
  bindQuickAccess(null);
  document.querySelectorAll(".course-card").forEach(card => {
    const open = () => goParts(card.dataset.course);
    card.addEventListener("click", open);
    card.addEventListener("keydown", e => { if (e.key === "Enter") open(); });
  });
  document.querySelectorAll(".pill[data-tag]").forEach(p => p.addEventListener("click", () => requireLogin(() => goSearch(p.dataset.tag, ""))));
  document.querySelectorAll(".subject-chip[data-term]").forEach(el => el.addEventListener("click", () => requireLogin(() => goSearch(el.dataset.term, ""))));
  const nlForm = els("newsletterForm");
  if (nlForm) nlForm.addEventListener("submit", handleNewsletterSubmit);
}

async function handleNewsletterSubmit(e) {
  e.preventDefault();
  const email = els("newsletterEmail").value.trim();
  const msg = els("newsletterMsg");
  if (!email) return;
  try {
    await addDoc(collection(db, "subscribers"), { email, createdAt: serverTimestamp() });
    msg.textContent = "Subscribed! You're on the list.";
    msg.className = "ns-msg ok";
    els("newsletterEmail").value = "";
  } catch (err) {
    console.error(err);
    msg.textContent = "Couldn't subscribe right now — try again later.";
    msg.className = "ns-msg err";
  }
}

function renderParts() {
  const c = courseById(state.courseId);
  const isSemester = c.parts[0].label.includes("Semester");
  app_.main.innerHTML = `
    <section class="section" style="margin-top:28px;">
      <div class="section-head"><span class="bar"></span><h2>${c.fullName} — ${isSemester ? "Semesters" : "Parts"}</h2></div>
      <div class="tile-grid">
        ${c.parts.map(p => `
          <div class="tile" data-part="${p.id}" tabindex="0" role="button">
            <div class="tile-label">${p.label}</div>
            <div class="tile-meta">${p.subjects.length} subjects · ${countMaterials({courseId:c.id, partId:p.id})} resources</div>
          </div>`).join("")}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><span class="bar"></span><h2>Quick Access — ${c.name}</h2></div>
      ${quickAccessGrid(c.id)}
    </section>
  `;
  document.querySelectorAll(".tile[data-part]").forEach(t => {
    const open = () => goSubjects(c.id, t.dataset.part);
    t.addEventListener("click", open);
    t.addEventListener("keydown", e => { if (e.key === "Enter") open(); });
  });
  bindQuickAccess(c.id);
}

function renderSubjects() {
  const c = courseById(state.courseId);
  const p = partById(c, state.partId);
  app_.main.innerHTML = `
    <section class="section" style="margin-top:28px;">
      <div class="section-head"><span class="bar"></span><h2>${c.name} — ${p.label} Subjects</h2></div>
      <div class="gate-note">${ICONS.lock} Sign in with Google to open a subject's notes, books, papers or videos, or to contribute material.</div>
      <div class="tile-grid">
        ${p.subjects.map(s => `
          <div class="tile" data-subject="${encodeURIComponent(s)}" tabindex="0" role="button">
            <div class="tile-label">${s}</div>
            <div class="tile-meta">${countMaterials({courseId:c.id, partId:p.id, subject:s})} resources</div>
          </div>`).join("")}
      </div>
    </section>
  `;
  document.querySelectorAll(".tile[data-subject]").forEach(t => {
    const subject = decodeURIComponent(t.dataset.subject);
    const open = () => requireLogin(() => goMaterials(c.id, p.id, subject));
    t.addEventListener("click", open);
    t.addEventListener("keydown", e => { if (e.key === "Enter") open(); });
  });
}

function renderMaterialsView() {
  const c = courseById(state.courseId);
  const p = partById(c, state.partId);
  const items = allMaterials.filter(m => m.courseId === c.id && m.partId === p.id && m.subject === state.subject);
  const syllabusHref = syllabusPathFor(c, p, state.subject);
  app_.main.innerHTML = `
    <section class="section" style="margin-top:28px;">
      <div class="section-head"><span class="bar"></span><h2>${state.subject}</h2>
        <a class="btn btn-sm" style="margin-left:auto;" href="${syllabusHref}" target="_blank" rel="noopener noreferrer">${ICONS.clipboard} Official syllabus</a>
        <button class="btn btn-primary btn-sm" id="addHereBtn">+ Add material here</button>
      </div>
      <div class="material-grid">${materialCards(items)}</div>
    </section>
  `;
  els("addHereBtn").addEventListener("click", () => requireLogin(() => openModal({ courseId: c.id, partId: p.id, subject: state.subject })));
  bindMaterialCardActions();
}

function renderSearchView() {
  let items = allMaterials;
  let title = "Search results";
  if (state.courseId) items = items.filter(m => m.courseId === state.courseId);
  if (state.searchType) { items = items.filter(m => m.type === state.searchType); title = state.courseId ? `${state.searchType} — ${courseById(state.courseId).name}` : state.searchType; }
  if (state.searchTerm) {
    const t = state.searchTerm.toLowerCase();
    items = items.filter(m => (m.title || "").toLowerCase().includes(t) || (m.subject || "").toLowerCase().includes(t) || (m.description || "").toLowerCase().includes(t));
    title = `Results for "${state.searchTerm}"`;
  }
  app_.main.innerHTML = `
    <section class="section" style="margin-top:28px;">
      <div class="section-head"><span class="bar"></span><h2>${title}</h2></div>
      <div class="material-grid">${materialCards(items, true)}</div>
    </section>
  `;
  bindMaterialCardActions();
}

function materialCards(items, showPath = false) {
  if (items.length === 0) return `<div class="empty-state">Nothing here yet — be the first to add one.</div>`;
  return items.map(m => {
    const isQp = m.type === "Question Papers" && (m.pdfLink || (m.pageLinks && m.pageLinks.length));
    const href = m.fileURL || m.link || "#";
    const dateStr = m.createdAt?.toDate ? m.createdAt.toDate().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "—";
    const course = courseById(m.courseId);
    const part = course ? partById(course, m.partId) : null;
    return `<div class="material-card">
      <div class="body">
        <span class="type-tag">${m.type || "Other"}</span>${m.year ? `<span class="year-badge">${escapeHtml(m.year)}</span>` : ""}
        <h4>${escapeHtml(m.title || "Untitled")}</h4>
        ${m.description ? `<p>${escapeHtml(m.description)}</p>` : ""}
        ${showPath && course ? `<div class="path">${course.name} · ${part ? part.label : ""} · ${escapeHtml(m.subject || "")}</div>` : ""}
      </div>
      <div class="meta-row"><span>${escapeHtml(m.uploaderName || "Anonymous")}</span><span>${dateStr}</span></div>
      <div class="actions">
        ${isQp
          ? `<button class="btn btn-primary btn-sm" data-viewpaper-id="${m.id}">View Paper</button>`
          : `<a class="btn btn-primary btn-sm" href="${href}" target="_blank" rel="noopener noreferrer">Open</a>`}
      </div>
    </div>`;
  }).join("");
}
function bindMaterialCardActions() {
  document.querySelectorAll("[data-viewpaper-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const material = allMaterials.find(m => m.id === btn.dataset.viewpaperId);
      if (material) openPaperViewer(material);
    });
  });
}

// ---------------- live search suggestions ----------------
function allSubjectsFlat() {
  const out = [];
  COURSES.forEach(c => c.parts.forEach(p => p.subjects.forEach(s => out.push({ courseId: c.id, courseName: c.name, partId: p.id, partLabel: p.label, subject: s }))));
  return out;
}
function renderSuggestionsInto(term, box) {
  if (!box) return;
  const t = term.trim().toLowerCase();
  if (!t) { box.classList.remove("open"); box.innerHTML = ""; return; }
  const subjectMatches = allSubjectsFlat().filter(x => x.subject.toLowerCase().includes(t)).slice(0, 6);
  const materialMatches = allMaterials.filter(m => (m.title || "").toLowerCase().includes(t)).slice(0, 6);
  if (subjectMatches.length === 0 && materialMatches.length === 0) {
    box.innerHTML = `<div class="sug-empty">No matches for "${escapeHtml(term)}" yet.</div>`;
    box.classList.add("open");
    return;
  }
  let html = "";
  if (subjectMatches.length) {
    html += `<div class="sug-label">Subjects</div>`;
    html += subjectMatches.map((x, i) => `<div class="sug-item" data-kind="subject" data-i="${i}"><span class="sug-main">${escapeHtml(x.subject)}</span><span class="sug-path">${x.courseName} · ${x.partLabel}</span></div>`).join("");
  }
  if (materialMatches.length) {
    html += `<div class="sug-label">Materials${currentUser ? "" : " (sign in to open)"}</div>`;
    html += materialMatches.map((m, i) => `<div class="sug-item" data-kind="material" data-i="${i}"><span class="sug-main">${escapeHtml(m.title)}</span><span class="sug-path">${m.type || ""}</span></div>`).join("");
  }
  box.innerHTML = html;
  box.classList.add("open");
  box.querySelectorAll(".sug-item").forEach(el => {
    el.addEventListener("click", () => {
      const i = Number(el.dataset.i);
      box.classList.remove("open");
      closeSearchModal();
      if (el.dataset.kind === "subject") { const x = subjectMatches[i]; requireLogin(() => goMaterials(x.courseId, x.partId, x.subject)); }
      else { const m = materialMatches[i]; requireLogin(() => goMaterials(m.courseId, m.partId, m.subject)); }
    });
  });
}
function bindSearchInput(input, box, btn) {
  input.addEventListener("input", () => renderSuggestionsInto(input.value, box));
  input.addEventListener("focus", () => { if (input.value.trim()) renderSuggestionsInto(input.value, box); });
  document.addEventListener("click", (e) => { if (box && !box.contains(e.target) && e.target !== input) box.classList.remove("open"); });
  const go = () => { box.classList.remove("open"); closeSearchModal(); requireLogin(() => goSearch(input.value.trim(), "")); };
  if (btn) btn.addEventListener("click", go);
  input.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
}
function bindHeroSearch() { bindSearchInput(els("heroSearch"), els("suggestions"), els("heroSearchBtn")); }
function openSearchModal() {
  app_.searchBackdrop.classList.add("open");
  const input = els("quickSearchInput");
  input.value = "";
  els("quickSuggestions").innerHTML = "";
  setTimeout(() => input.focus(), 50);
}
function closeSearchModal() { app_.searchBackdrop.classList.remove("open"); }

// ---------------- data load ----------------
async function loadMaterials() {
  try {
    const q = query(collection(db, "materials"), where("status", "==", "approved"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    allMaterials = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) { allMaterials = []; }
  render();
}
async function loadAnnouncements() {
  try {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(6));
    const snap = await getDocs(q);
    announcements = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) { console.error("Failed to load announcements:", err); announcements = []; }
  if (state.view === "courses") render();
}

// ---------------- contribute modal ----------------
function populateCourseSelect() {
  app_.courseSelect.innerHTML = COURSES.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
  app_.typeSelect.innerHTML = MATERIAL_TYPES.map(t => `<option value="${t}">${t}</option>`).join("");
  app_.courseSelect.addEventListener("change", () => populatePartSelect(app_.courseSelect.value));
  app_.partSelect.addEventListener("change", () => populateSubjectSelect(app_.courseSelect.value, app_.partSelect.value));
  app_.typeSelect.addEventListener("change", updateTypeFieldsVisibility);
  app_.qpFormatRadios.forEach(r => r.addEventListener("change", updateQpFormatVisibility));
}
function updateTypeFieldsVisibility() {
  const isQp = app_.typeSelect.value === "Question Papers";
  app_.qpFieldsWrap.style.display = isQp ? "block" : "none";
  app_.linkInputWrap.style.display = isQp ? "none" : "block";
  if (isQp) updateQpFormatVisibility();
}
function updateQpFormatVisibility() {
  const format = [...app_.qpFormatRadios].find(r => r.checked)?.value || "pdf";
  app_.qpPdfWrap.style.display = format === "pdf" ? "block" : "none";
  app_.qpImagesWrap.style.display = format === "images" ? "block" : "none";
}
function populatePartSelect(courseId) {
  const c = courseById(courseId);
  app_.partSelect.innerHTML = c.parts.map(p => `<option value="${p.id}">${p.label}</option>`).join("");
  populateSubjectSelect(courseId, app_.partSelect.value);
}
function populateSubjectSelect(courseId, partId) {
  const c = courseById(courseId), p = partById(c, partId);
  app_.subjectSelect.innerHTML = p.subjects.map(s => `<option value="${s}">${s}</option>`).join("");
}
function openModal(preset) {
  populateCourseSelect();
  if (preset?.courseId) {
    app_.courseSelect.value = preset.courseId;
    populatePartSelect(preset.courseId);
    if (preset.partId) app_.partSelect.value = preset.partId;
    populateSubjectSelect(preset.courseId, app_.partSelect.value);
    if (preset.subject) app_.subjectSelect.value = preset.subject;
  } else { populatePartSelect(app_.courseSelect.value); }
  updateTypeFieldsVisibility();
  app_.modalBackdrop.classList.add("open");
  app_.formError.classList.remove("show");
  app_.formSuccess.style.display = "none";
  app_.contributeForm.style.display = "block";
}
function closeModal() {
  app_.modalBackdrop.classList.remove("open");
  app_.contributeForm.reset();
  app_.qpFieldsWrap.style.display = "none";
  app_.linkInputWrap.style.display = "block";
}
async function handleSubmit(e) {
  e.preventDefault();
  app_.formError.classList.remove("show");
  const title = els("titleInput").value.trim();
  const courseId = app_.courseSelect.value, partId = app_.partSelect.value, subject = app_.subjectSelect.value, type = app_.typeSelect.value;
  const description = els("descInput").value.trim();
  const uploaderName = els("nameInput").value.trim() || "Anonymous";
  if (!title) return showError("Please add a title.");

  const newDoc = {
    title, courseId, partId, subject, type, description, uploaderName,
    link: null, fileURL: null, fileName: null, fileSize: null,
    year: null, paperFormat: null, pdfLink: null, pageLinks: null,
    status: "pending", createdAt: serverTimestamp()
  };

  if (type === "Question Papers") {
    const year = app_.qpYear.value.trim();
    const format = [...app_.qpFormatRadios].find(r => r.checked)?.value || "pdf";
    if (!year) return showError("Please add the year.");
    newDoc.year = year;
    newDoc.paperFormat = format;
    if (format === "pdf") {
      const pdfLink = app_.qpPdfLink.value.trim();
      if (!pdfLink) return showError("Please paste the PDF link.");
      newDoc.pdfLink = pdfLink;
    } else {
      const lines = app_.qpImagesTextarea.value.split("\n").map(l => l.trim()).filter(Boolean);
      if (lines.length === 0) return showError("Please paste at least one page image link.");
      newDoc.pageLinks = lines;
    }
  } else {
    const linkVal = els("linkInput").value.trim();
    if (!linkVal) return showError("Please paste a link.");
    newDoc.link = linkVal;
  }

  app_.submitBtn.disabled = true; app_.submitBtn.textContent = "Submitting...";
  try {
    await addDoc(collection(db, "materials"), newDoc);
    app_.contributeForm.style.display = "none";
    app_.formSuccess.style.display = "block";
    app_.formSuccess.textContent = "Submitted — an admin will review and publish it shortly.";
  } catch (err) { console.error(err); showError("Something went wrong submitting this. Please try again."); }
  finally { app_.submitBtn.disabled = false; app_.submitBtn.textContent = "Submit for review"; }
}
function showError(msg) { app_.formError.textContent = msg; app_.formError.classList.add("show"); }

function bindEvents() {
  app_.closeModal.addEventListener("click", closeModal);
  app_.modalBackdrop.addEventListener("click", e => { if (e.target === app_.modalBackdrop) closeModal(); });
  app_.contributeForm.addEventListener("submit", handleSubmit);
  els("logoBrand").addEventListener("click", goHome);

  app_.headerSearchBtn.addEventListener("click", openSearchModal);
  app_.closeSearchModal.addEventListener("click", closeSearchModal);
  app_.searchBackdrop.addEventListener("click", e => { if (e.target === app_.searchBackdrop) closeSearchModal(); });
  bindSearchInput(els("quickSearchInput"), els("quickSuggestions"), els("quickSearchBtn"));

  app_.closePaperViewer.addEventListener("click", closePaperViewer);
  app_.paperViewerBackdrop.addEventListener("click", e => { if (e.target === app_.paperViewerBackdrop) closePaperViewer(); });

  if (app_.footerUpdated) app_.footerUpdated.textContent = LAST_UPDATED;
}

// ---------------- question paper viewer ----------------
let galleryState = { links: [], index: 0, zoom: 1 };

function openPaperViewer(material) {
  app_.paperViewerTitle.textContent = `${material.title || "Question Paper"}${material.year ? " — " + material.year : ""}`;
  if (material.paperFormat === "images" && material.pageLinks && material.pageLinks.length) {
    galleryState = { links: material.pageLinks, index: 0, zoom: 1 };
    renderGallery();
  } else {
    const src = drivePreviewUrl(material.pdfLink || material.link);
    app_.paperViewerBody.innerHTML = `
      <div class="pdf-embed-wrap"><iframe src="${src}" allow="fullscreen"></iframe></div>
      <div class="pdf-note">If download/print icons appear here, that's controlled by the uploader's Google Drive sharing settings, not this site.</div>
    `;
  }
  app_.paperViewerBackdrop.classList.add("open");
}
function closePaperViewer() {
  app_.paperViewerBackdrop.classList.remove("open");
  app_.paperViewerBody.innerHTML = "";
}
function renderGallery() {
  const { links, index, zoom } = galleryState;
  app_.paperViewerBody.innerHTML = `
    <div class="gallery">
      <div class="gallery-stage"><img src="${driveImageUrl(links[index])}" style="transform:scale(${zoom});" alt="Page ${index + 1}"></div>
      <div class="gallery-controls">
        <button class="btn btn-sm" id="galleryPrev">← Prev</button>
        <button class="icon-btn" id="galleryZoomOut">−</button>
        <span class="page-count">Page ${index + 1} / ${links.length}</span>
        <button class="icon-btn" id="galleryZoomIn">+</button>
        <button class="btn btn-sm" id="galleryNext">Next →</button>
      </div>
      <div class="gallery-thumbs">
        ${links.map((l, i) => `<img src="${driveImageUrl(l)}" class="${i === index ? "active" : ""}" data-thumb-i="${i}" alt="Page ${i + 1} thumbnail">`).join("")}
      </div>
    </div>
  `;
  els("galleryPrev").addEventListener("click", () => { galleryState.index = Math.max(0, index - 1); galleryState.zoom = 1; renderGallery(); });
  els("galleryNext").addEventListener("click", () => { galleryState.index = Math.min(links.length - 1, index + 1); galleryState.zoom = 1; renderGallery(); });
  els("galleryZoomIn").addEventListener("click", () => { galleryState.zoom = Math.min(3, zoom + 0.25); renderGallery(); });
  els("galleryZoomOut").addEventListener("click", () => { galleryState.zoom = Math.max(0.5, zoom - 0.25); renderGallery(); });
  document.querySelectorAll("[data-thumb-i]").forEach(t => t.addEventListener("click", () => { galleryState.index = Number(t.dataset.thumbI); galleryState.zoom = 1; renderGallery(); }));
}

initTheme();
populateNav();
bindEvents();
renderAuthArea();
render();
loadAnnouncements();
loadMaterials();
