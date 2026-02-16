/* Gimolo Activity Card Mockups – Static (GitHub Pages) */
let activities = [];
let currentVariant = "v1";
let countdownEnabled = true; // set false if you don't want it

const elHost = document.getElementById("cardHost");
const elSelect = document.getElementById("activitySelect");
const segButtons = Array.from(document.querySelectorAll(".seg-btn"));

function iconFor(tag){
  const map = {
    story:"🗺️",
    art:"🎨",
    stretch:"❤️",
    sort:"⏱️",
    play:"🎲",
    win:"🏆"
  };
  return map[tag] || "✨";
}

function renderCard(activity){
  if(!activity) return;

  const metaItems = [
    { label: activity.timeLabel, icon: "⏱️" },
    { label: activity.energyLabel, icon: "⚡" },
    { label: activity.locationLabel, icon: "📍" },
    { label: activity.modeLabel, icon: "👥" },
  ];

  const metaHtml = metaItems.map(m =>
    `<span class="meta-item">${m.icon} ${escapeHtml(m.label)}</span>`
  ).join("");

  // Variant-specific labels and CTA
  const variantMap = {
    v1: { kicker: "ROUND 1", cta: "START ROUND", btnClass: "" },
    v2: { kicker: activity.badge || "PLAY MOMENT", cta: "START THE STORY", btnClass: "sunset" },
    v3: { kicker: activity.timeLabel, cta: `START ${activity.timeLabel} TIMER`, btnClass: "" },
    v4: { kicker: "TONIGHT: MOVE 1 OF 3", cta: "PLAY THIS MOVE", btnClass: "alt" },
  };

  const v = variantMap[currentVariant];

  // Keep the “activity” as hero: title + one line description, everything else quieter.
  const baseTop =
    currentVariant === "v3"
      ? `<div class="timer-ghost"></div>`
      : "";

  const headerChip =
    currentVariant === "v1" || currentVariant === "v2"
      ? `<span class="chip">${iconFor(activity.tag)} ${escapeHtml(activity.title)}</span>`
      : `<span class="chip">${iconFor(activity.tag)} ${escapeHtml(v.kicker)}</span>`;

  const kickerText =
    currentVariant === "v1" ? v.kicker
    : currentVariant === "v2" ? (activity.badge || "PLAY MOMENT")
    : currentVariant === "v3" ? "2:00 READY"
    : v.kicker;

  const title =
    currentVariant === "v2" ? activity.title : activity.title.toUpperCase();

  const desc =
    (activity.prompt || "").trim();

  // Metadata strategy by variant:
  // v1: compact footer line + optional details link
  // v2: minimal meta line (quiet)
  // v3: meta pills okay because title is still big + timer ghost adds focus
  // v4: meta moved to footer line (quiet) inside panel
  const metaBlock = (() => {
    if(currentVariant === "v2"){
      return `<div class="meta">⏱️ ${escapeHtml(activity.timeLabel)} • ⚡ ${escapeHtml(activity.energyLabel)} • 📍 ${escapeHtml(activity.locationLabel)}</div>`;
    }
    if(currentVariant === "v4"){
      return `<div class="meta">⏱️ ${escapeHtml(activity.timeLabel)} • 📍 ${escapeHtml(activity.locationLabel)} • ⚡ ${escapeHtml(activity.energyLabel)}</div>`;
    }
    return `<div class="meta-row">${metaHtml}</div>`;
  })();

  const detailsLink = `<button class="btn-link small" data-action="details">ⓘ Details</button>`;

  // v4 has an inner panel to create “session container” feel.
  const innerWrapOpen = currentVariant === "v4" ? `<div class="panel">` : "";
  const innerWrapClose = currentVariant === "v4" ? `</div>` : "";

  const html = `
    <article class="card bg-sparkle ${currentVariant}">
      ${baseTop}
      <div class="card-inner">
        <div class="kicker">${headerChip}</div>

        <h1 class="title">${escapeHtml(title)}</h1>
        <p class="desc">${escapeHtml(desc)}</p>

        ${innerWrapOpen}
          <div class="actions">
            <button class="btn-primary ${v.btnClass}" data-action="start">${escapeHtml(v.cta)} →</button>
            <div class="swap"><button class="btn-link" data-action="swap">Swap move</button></div>
          </div>

          <div style="margin-top:12px;">
            ${metaBlock}
            <div style="margin-top:10px; display:flex; justify-content:center;">
              ${detailsLink}
            </div>
          </div>
        ${innerWrapClose}
      </div>
    </article>
  `;

  elHost.innerHTML = html;

  // Wire actions
  elHost.querySelector('[data-action="swap"]').addEventListener("click", () => {
    pickRandomActivity();
  });
  elHost.querySelector('[data-action="details"]').addEventListener("click", () => {
    alert(
      `Details\n\n` +
      `Time: ${activity.timeLabel}\n` +
      `Energy: ${activity.energyLabel}\n` +
      `Location: ${activity.locationLabel}\n` +
      `Mode: ${activity.modeLabel}`
    );
  });
  elHost.querySelector('[data-action="start"]').addEventListener("click", async () => {
    if(countdownEnabled){
      await runCountdown();
    }
    alert("Start! (Wire this to your real Start flow)");
  });
}

function pickRandomActivity(){
  const idx = Math.floor(Math.random() * activities.length);
  elSelect.value = String(idx);
  renderCard(activities[idx]);
}

function setVariant(v){
  currentVariant = v;
  segButtons.forEach(b => b.classList.toggle("active", b.dataset.variant === v));
  const idx = Number(elSelect.value || 0);
  renderCard(activities[idx]);
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* Countdown */
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
async function runCountdown(){
  const overlay = document.getElementById("countdown");
  const num = document.getElementById("countNum");
  const sub = document.getElementById("countSub");
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");

  const seq = ["3","2","1","GO"];
  for(let i=0;i<seq.length;i++){
    num.textContent = seq[i];
    sub.textContent = i < 3 ? "Get ready" : "Go";
    await sleep(520);
  }

  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

/* Init */
async function init(){
  const res = await fetch("./activities.json");
  activities = await res.json();

  // Populate select
  activities.forEach((a, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = a.title;
    elSelect.appendChild(opt);
  });

  elSelect.addEventListener("change", () => {
    const idx = Number(elSelect.value || 0);
    renderCard(activities[idx]);
  });

  segButtons.forEach(btn => {
    btn.addEventListener("click", () => setVariant(btn.dataset.variant));
  });

  // default
  setVariant("v1");
  elSelect.value = "0";
  renderCard(activities[0]);
}

init().catch(err => {
  console.error(err);
  elHost.innerHTML = '<div style="padding:16px;color:white;">Failed to load activities.json</div>';
});
