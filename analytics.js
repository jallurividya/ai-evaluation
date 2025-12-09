// analytics.js
import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  dbRef,
  dbGet
} from "./firebase.js";

const canvas = document.getElementById("pieChart");
const noData = document.getElementById("noDataAna");
const anaDateLabel = document.getElementById("anaDateLabel");
const prevAna = document.getElementById("prevAna");
const nextAna = document.getElementById("nextAna");
const logoutLink = document.getElementById("logoutLink");

let currentUser = null;
let currentDate = new Date();
let chart = null;

const formatDateKey = d => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const formatLabel = d => d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });

function renderDate() { anaDateLabel.textContent = formatLabel(currentDate); }

onAuthStateChanged(auth, user => {
  if (!user) location = "login.html";
  currentUser = user;
  renderDate();
  loadAndRender();
});

logoutLink?.addEventListener("click", async () => {
  await signOut(auth);
  location = "index.html";
});

prevAna.addEventListener("click", () => { currentDate.setDate(currentDate.getDate() - 1); renderDate(); loadAndRender(); });
nextAna.addEventListener("click", () => { currentDate.setDate(currentDate.getDate() + 1); renderDate(); loadAndRender(); });

async function loadAndRender() {
  if (!currentUser) return;
  const key = formatDateKey(currentDate);
  const path = `users/${currentUser.uid}/activities/${key}`;
  try {
    const snap = await dbGet(dbRef(db, path));
    const val = snap.val() || {};
    const arr = Object.values(val || []);
    if (!arr.length) {
      showNoData();
      return;
    }
    calculateSummaryStats(arr);
    // aggregate by category (if empty, label "Other")
    const agg = {};
    arr.forEach(a => {
      const cat = a.category && a.category.trim() ? a.category.trim() : (a.name || "Other");
      agg[cat] = (agg[cat] || 0) + Number(a.minutes || 0);
    });

    const labels = Object.keys(agg);
    const data = labels.map(l => agg[l]);

    buildPie(labels, data);
  } catch (err) {
    console.error(err);
    showNoData();
  }
}

function calculateSummaryStats(activities) {
  let totalMinutes = 0;
  let categoryMap = {};
  let activityCount = activities.length;

  activities.forEach(a => {
    const mins = Number(a.minutes || 0);
    totalMinutes += mins;

    const cat = a.category || "Other";
    if (!categoryMap[cat]) categoryMap[cat] = 0;
    categoryMap[cat] += mins;
  });

  document.getElementById("totalHours").innerText = (totalMinutes / 60).toFixed(1) + " h";
  document.getElementById("totalActivities").innerText = activityCount;

  let list = "";
  Object.keys(categoryMap).forEach(cat => {
    list += `<li><strong>${cat}:</strong> ${(categoryMap[cat] / 60).toFixed(1)} h</li>`;
  });

  document.getElementById("categoryBreakdown").innerHTML = list;
}


function showNoData() {
  if (chart) { chart.destroy(); chart = null; }
  canvas.style.display = "none";
  noData.style.display = "block";
}

function buildPie(labels, data) {
  noData.style.display = "none";
  canvas.style.display = "block";

  const colors = [
    "#7c3aed", "#a78bfa", "#d946ef", "#fb7185", "#60a5fa", "#06b6d4", "#34d399", "#f59e0b", "#f97316", "#ef4444"
  ];
  if (chart) chart.destroy();
  chart = new Chart(canvas.getContext("2d"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.label}: ${ctx.formattedValue} min (${((ctx.raw / 1440) * 100).toFixed(1)}%)`
          }
        }
      }
    }
  });
}
