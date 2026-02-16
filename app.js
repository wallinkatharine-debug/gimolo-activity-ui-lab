
const activity = {
  title: "TWO-MINUTE STORY",
  prompt: "Tell a 2-minute story where every sentence starts with “Suddenly…”.",
  meta: "10 min • Indoor • Medium • Solo"
};

const host = document.getElementById("cardHost");

function render() {
  host.innerHTML = `
    <div class="card">
      <h1 class="title">${activity.title}</h1>
      <p class="desc">${activity.prompt}</p>
      <button class="btn-primary" onclick="startCountdown()">PLAY THIS MOVE →</button>
      <div class="swap" onclick="swap()">Swap move</div>
      <div class="meta">${activity.meta}</div>
    </div>
  `;
}

function swap() {
  alert("Swap logic placeholder.");
}

async function startCountdown() {
  const overlay = document.getElementById("countdown");
  const num = document.getElementById("countNum");
  overlay.classList.remove("hidden");
  for (let i = 3; i > 0; i--) {
    num.textContent = i;
    await new Promise(r => setTimeout(r, 600));
  }
  overlay.classList.add("hidden");
  alert("Start!");
}

render();
