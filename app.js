
const activity = {
  title: "TWO-MINUTE STORY",
  prompt: "Tell a 2-minute story where every sentence starts with “Suddenly…”.",
  meta: "10 min • Indoor • Medium • Solo"
};

const host = document.getElementById("cardHost");

function render() {
  host.innerHTML = `
    <div class="card" role="region" aria-label="Activity">
      <div class="round-label">Tonight</div>
      <h1 class="title">${escapeHtml(activity.title)}</h1>
      <p class="desc">${escapeHtml(activity.prompt)}</p>
      <div class="micro">Ready?</div>
      <button class="btn-primary" id="startBtn">START →</button>
      <div class="secondary" id="spinAgain">Spin again</div>
      <div class="meta">${escapeHtml(activity.meta)}</div>
    </div>
  `;

  document.getElementById("startBtn").addEventListener("click", startCountdown);
  document.getElementById("spinAgain").addEventListener("click", spinAgain);
}

function spinAgain() {
  // Placeholder hook: wire to your wheel / reselection logic in the main app
  alert("Spin again (wire this to your spin flow).");
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

async function startCountdown() {
  const overlay = document.getElementById("countdown");
  const num = document.getElementById("countNum");
  const sub = document.getElementById("countSub");

  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden","false");

  const seq = ["3","2","1","GO"];
  for (let i = 0; i < seq.length; i++) {
    num.textContent = seq[i];
    // retrigger pop animation
    num.style.animation = "none";
    // force reflow
    void num.offsetHeight;
    num.style.animation = "";
    sub.textContent = i < 3 ? "Get ready" : "Go";
    await sleep(560);
  }

  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden","true");

  // Placeholder hook: replace with your real activity-start behavior
  alert("Start! (wire into timer/activity flow)");
}

render();
