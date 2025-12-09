// dashboard.js
import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  dbRef,
  dbGet,
  dbSet,
  dbUpdate,
  dbRemove
} from "./firebase.js";

// Helpers
const formatDateKey = d => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const formatLabel = d => d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

// DOM
const selectedDateLabel = document.getElementById("selectedDateLabel");
const prevDay = document.getElementById("prevDay");
const nextDay = document.getElementById("nextDay");
const openAdd = document.getElementById("openAdd");
const addFirst = document.getElementById("addFirst");
const activitiesContainer = document.getElementById("activitiesContainer");
const usedText = document.getElementById("usedText");
const remainingText = document.getElementById("remainingText");
const progressBar = document.getElementById("progressBar");
const logoutBtn = document.getElementById("logoutBtn");

// Modal DOM
const modalBackdrop = document.getElementById("modalBackdrop");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const actName = document.getElementById("actName");
const actCategory = document.getElementById("actCategory");
const actMinutes = document.getElementById("actMinutes");
const actNotes = document.getElementById("actNotes");
const modalError = document.getElementById("modalError");
const cancelModal = document.getElementById("cancelModal");
const saveModal = document.getElementById("saveModal");

let currentUser = null;
let currentDate = new Date();
let currentKey = formatDateKey(currentDate);
let editingId = null;
let activitiesMap = {}; // object keyed by id

// Auth handling
onAuthStateChanged(auth, user => {
  if (!user) window.location = "login.html";
  currentUser = user;
  renderDate();
  loadActivities();
});

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location = "index.html";
});

// Date navigation
function renderDate() {
  selectedDateLabel.textContent = formatLabel(currentDate);
  currentKey = formatDateKey(currentDate);
}
prevDay.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  renderDate();
  loadActivities();
});
nextDay.addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  renderDate();
  loadActivities();
});

// Open modal (add)
openAdd.addEventListener("click", openAddModal);
addFirst?.addEventListener("click", openAddModal);

function openAddModal() {
  editingId = null;
  modalTitle.textContent = "Add Activity";
  actName.value = "";
  actCategory.value = "";
  actMinutes.value = "";
  actNotes.value = "";
  modalError.style.display = "none";
  showModal();
}

function openEditModal(item) {
  editingId = item.id;
  modalTitle.textContent = "Edit Activity";
  actName.value = item.name;
  actCategory.value = item.category || "";
  actMinutes.value = item.minutes;
  actNotes.value = item.notes || "";
  modalError.style.display = "none";
  showModal();
}

function showModal() {
  modalBackdrop.style.display = "flex";
  setTimeout(() => modal.classList.add("show"), 30);
}
function hideModal() {
  modal.classList.remove("show");
  setTimeout(() => (modalBackdrop.style.display = "none"), 220);
}
cancelModal.addEventListener("click", hideModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) hideModal();
});

// Save (add or edit)
saveModal.addEventListener("click", async () => {
  modalError.style.display = "none";
  const name = (actName.value || "").trim();
  const category = actCategory.value || "";
  const minutes = parseInt(actMinutes.value || 0, 10);
  const notes = (actNotes.value || "").trim();

  if (!name) return showModalError("Please enter activity name.");
  if (!minutes || minutes <= 0) return showModalError("Enter minutes greater than 0.");
  if (minutes > 1440) return showModalError("Minutes cannot exceed 1440.");

  // compute used time excluding editing activity
  const usedExcept = Object.values(activitiesMap).reduce((acc, it) => acc + (it.id === editingId ? 0 : Number(it.minutes || 0)), 0);
  if (usedExcept + minutes > 1440) {
    return showModalError(`Total would exceed 1440 minutes. You have ${1440 - usedExcept} minutes remaining.`);
  }

  try {
    const basePath = `users/${currentUser.uid}/activities/${currentKey}`;
    if (!editingId) {
      // new id
      const id = String(Date.now());
      const activity = { id, name, category, minutes, notes, createdAt: Date.now() };
      // write to DB: update child id
      await dbUpdate(dbRef(db, `${basePath}/${id}`), activity);
      activitiesMap[id] = activity;
    } else {
      // update existing
      const updated = { id: editingId, name, category, minutes, notes, updatedAt: Date.now() };
      await dbUpdate(dbRef(db, `${basePath}/${editingId}`), updated);
      activitiesMap[editingId] = { ...activitiesMap[editingId], ...updated };
    }
    hideModal();
    renderActivities();
    updateSummary();
  } catch (err) {
    showModalError("Save failed: " + err.message);
  }
});

function showModalError(msg) {
  modalError.style.display = "block";
  modalError.textContent = msg;
}

// Load activities for current date
async function loadActivities() {
  if (!currentUser) return;
  const path = `users/${currentUser.uid}/activities/${currentKey}`;
  try {
    const snap = await dbGet(dbRef(db, path));
    const val = snap.val() || {};
    // val is object keyed by id
    activitiesMap = val;
  } catch (e) {
    console.error(e);
    activitiesMap = {};
  }
  renderActivities();
  updateSummary();
}

// Render list
function renderActivities() {
  const arr = Object.values(activitiesMap || []);
  if (!arr.length) {
    activitiesContainer.innerHTML = `
      <div class="no-state">
        <div style="font-size:36px;">➕</div>
        <h3>No Activities Yet</h3>
        <p class="section-sub">Add your first activity for this day.</p>
        <button id="addFirstBtnMobile" class="btn-primary">Add First Activity</button>
      </div>`;
    const btn = document.getElementById("addFirstBtnMobile");
    if (btn) btn.addEventListener("click", openAddModal);
    return;
  }

  // sort by createdAt descending
  arr.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));

  const html = arr.map(a => `
    <div class="activity-item">
      <div class="activity-left">
        <div class="activity-avatar">${(a.name||'')[0] || '•'}</div>
        <div>
          <div style="font-weight:700">${escapeHtml(a.name)}</div>
          <div style="color:var(--muted);font-size:13px">${a.category ? escapeHtml(a.category) : ''} ${a.notes ? ' · ' + escapeHtml(a.notes) : ''}</div>
        </div>
      </div>

      <div style="display:flex;align-items:center;gap:10px;">
        <div class="activity-name" style="font-weight:700">${Number(a.minutes)} min</div>
        <div>
          <button class="icon-btn" data-action="edit" data-id="${a.id}" title="Edit">✏️</button>
          <button class="icon-btn" data-action="delete" data-id="${a.id}" title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  `).join("\n");

  activitiesContainer.innerHTML = `<div class="activity-list">${html}</div>`;

  activitiesContainer.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const action = btn.dataset.action;
      const item = activitiesMap[id];
      if (!item) return;
      if (action === "edit") openEditModal(item);
      if (action === "delete") {
        if (!confirm(`Delete "${item.name}" (${item.minutes} min)?`)) return;
        try {
          const path = `users/${currentUser.uid}/activities/${currentKey}/${id}`;
          await dbRemove(dbRef(db, path));
          delete activitiesMap[id];
          renderActivities();
          updateSummary();
        } catch (err) {
          alert("Delete failed: " + err.message);
        }
      }
    });
  });
}

function updateSummary() {
  const used = Object.values(activitiesMap || []).reduce((acc, it) => acc + Number(it.minutes || 0), 0);
  usedText.textContent = `${used} / 1440 min`;
  const perc = Math.min(100, Math.round((used / 1440) * 100));
  progressBar.style.width = perc + "%";
  remainingText.textContent = `${1440 - used} min`;
}

function escapeHtml(s) { return String(s || "").replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }
