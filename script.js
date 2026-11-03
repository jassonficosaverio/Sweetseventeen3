
/* ================= core ================= */
/* Fungsi dasar + pengatur perpindahan halaman */
const $ = (id) => document.getElementById(id);
const fill = (s) => s.replaceAll("{name}", CONFIG.name).replaceAll("{fullName}", CONFIG.fullName);
const target = new Date(CONFIG.date).getTime();
const preview = !!CONFIG.previewKey && new URLSearchParams(location.search).get("preview") === CONFIG.previewKey;

const PAGES = ["s-gate", "s-envelope", "s-letter", "s-diary", "s-reasons", "s-music", "s-gallery", "s-video",
               "s-dazai", "s-cake", "s-wishes", "s-gift", "s-final"];
const order = PAGES.filter((id) => id !== "s-video" || !!CONFIG.video);
let idx = 0, busy = false;
const hooks = {};
function onPage(id, fn) { (hooks[id] = hooks[id] || []).push(fn); }

const VTEXT = {
  "s-gate": "十七歳の誕生日、おめでとう", "s-envelope": "心をこめて", "s-letter": "ありがとう、そしておめでとう",
  "s-diary": "ひみつの日記", "s-reasons": "あなたの好きなところ", "s-music": "大好きな歌", "s-gallery": "たいせつな思い出", "s-video": "君と過ごした時間",
  "s-dazai": "好きなものは宝物", "s-cake": "願いが叶いますように", "s-wishes": "しあわせでありますように",
  "s-gift": "とっておきの贈りもの", "s-final": "これからもずっと友だち",
};
function setVText(id) {
  const v = $("vtext"); v.style.opacity = 0;
  setTimeout(() => { v.textContent = VTEXT[id] || ""; v.style.opacity = ""; }, 350);
}
function drawDots() {
  const d = $("dots");
  d.classList.toggle("hidden", idx === 0);
  d.innerHTML = order.slice(1).map((_, i) => `<i class="${i + 1 < idx ? "done" : i + 1 === idx ? "now" : ""}"></i>`).join("");
}
function goTo(i) {
  if (busy) return; busy = true;
  const old = $(order[idx]);
  old.classList.remove("active"); old.classList.add("leaving");
  $("dim").classList.remove("on");
  gust();
  setTimeout(() => {
    old.classList.remove("leaving");
    idx = i;
    const el = $(order[idx]);
    el.scrollTop = 0; el.classList.add("active");
    (hooks[order[idx]] || []).forEach((f) => f());
    drawDots(); setVText(order[idx]); busy = false;
  }, 650);
}
function next() { if (idx < order.length - 1) goTo(idx + 1); }
function restart() { goTo(1); }
/* efek lampu: redup (dimOn) -> lampu menyala berkedip (lightsOn) */
function dimOn() { const d = $("dim"); d.classList.remove("flick"); d.classList.add("on"); }
function lightsOn() {
  const d = $("dim"), w = $("warm");
  d.classList.remove("on"); d.classList.remove("flick"); void d.offsetWidth; d.style.opacity = 1; d.classList.add("flick");
  w.classList.remove("flash"); void w.offsetWidth; w.classList.add("flash");
  setTimeout(() => { d.classList.remove("flick"); d.style.opacity = ""; }, 2000);
}

/* ================= sakura ================= */
/* Latar: kelopak sakura jatuh, bintang berkelip, dan confetti */
const bg = $("bg"), bx = bg.getContext("2d");
const dpr = Math.min(devicePixelRatio || 1, 2);
let W, H, wind = 0;
function size() { W = bg.width = innerWidth * dpr; H = bg.height = innerHeight * dpr; }
addEventListener("resize", size); size();
function gust() { wind = 9 * dpr; }

function petalPath(c, s) {
  c.beginPath();
  c.moveTo(0, -.7 * s);
  c.bezierCurveTo(.2 * s, -1.05 * s, .85 * s, -1.0 * s, .85 * s, -.3 * s);
  c.bezierCurveTo(.9 * s, .4 * s, .3 * s, .9 * s, 0, 1.0 * s);
  c.bezierCurveTo(-.3 * s, .9 * s, -.9 * s, .4 * s, -.85 * s, -.3 * s);
  c.bezierCurveTo(-.85 * s, -1.0 * s, -.2 * s, -1.05 * s, 0, -.7 * s);
  c.closePath();
}
const pink = ["#ffc9db", "#ffb7d0", "#ffd9e6", "#ffcfe0", "#ffe5ee", "#f9b4cf"];
const rnd = Math.random;
function mkPetal(init) {
  return { x: rnd() * W, y: init ? rnd() * H : -30 * dpr, s: (6 + rnd() * 9) * dpr, vy: (.55 + rnd() * 1.0) * dpr,
    vx: (rnd() * .5 - .05) * dpr, a: rnd() * 6.28, va: (rnd() - .5) * .035, f: rnd() * 6.28, vf: .02 + rnd() * .04,
    sw: rnd() * 6.28, c: pink[Math.floor(rnd() * pink.length)], o: .7 + rnd() * .28 };
}
const petals = Array.from({ length: 58 }, () => mkPetal(true));
const stars = Array.from({ length: 18 }, () => ({ x: rnd() * W, y: rnd() * H, s: (2 + rnd() * 4) * dpr, p: rnd() * 6.28, v: .02 + rnd() * .03 }));

const dust = Array.from({ length: 34 }, () => ({ x: rnd() * W, y: rnd() * H, r: (1 + rnd() * 2.2) * dpr, vy: (.1 + rnd() * .35) * dpr, p: rnd() * 6.28 }));
function star(c, s) {
  c.beginPath();
  for (let i = 0; i < 8; i++) { const r = i % 2 ? s * .28 : s; c.lineTo(Math.cos(i * Math.PI / 4 - Math.PI / 2) * r, Math.sin(i * Math.PI / 4 - Math.PI / 2) * r); }
  c.closePath();
}
function drawBg() {
  bx.clearRect(0, 0, W, H);
  for (const t of stars) {
    t.p += t.v; const a = (Math.sin(t.p) + 1) / 2;
    bx.save(); bx.translate(t.x, t.y); bx.globalAlpha = .15 + a * .6; bx.fillStyle = "#fff"; bx.shadowColor = "#ffd6e8"; bx.shadowBlur = 8 * dpr;
    star(bx, t.s * (.6 + a * .6)); bx.fill(); bx.restore();
  }
  for (const d of dust) {
    d.p += .03; d.y -= d.vy; if (d.y < -10) { d.y = H + 10; d.x = rnd() * W; }
    bx.save(); bx.globalAlpha = .35 + .4 * Math.abs(Math.sin(d.p)); bx.fillStyle = "#f3d58a"; bx.shadowColor = "#f3d58a"; bx.shadowBlur = 10 * dpr;
    bx.beginPath(); bx.arc(d.x + Math.sin(d.p) * 8 * dpr, d.y, d.r, 0, 6.28); bx.fill(); bx.restore();
  }
  wind *= .965;
  for (const p of petals) {
    p.sw += .02; p.f += p.vf; p.a += p.va;
    p.y += p.vy; p.x += p.vx + Math.sin(p.sw) * .7 * dpr + wind * (.35 + p.s / (15 * dpr));
    if (p.y > H + 40 * dpr || p.x > W + 60 * dpr) Object.assign(p, mkPetal(false));
    bx.save(); bx.translate(p.x, p.y); bx.rotate(p.a); bx.scale(.25 + .75 * Math.abs(Math.cos(p.f)), 1);
    bx.globalAlpha = p.o; bx.fillStyle = p.c; petalPath(bx, p.s); bx.fill();
    bx.globalAlpha = p.o * .45; bx.fillStyle = "#fff"; petalPath(bx, p.s * .5); bx.fill();
    bx.restore();
  }
  requestAnimationFrame(drawBg);
}
drawBg();

/* confetti + kelopak yang meledak */
const cf = $("confetti"), cx = cf.getContext("2d"); let bits = [], running = false;
function cfSize() { cf.width = innerWidth * dpr; cf.height = innerHeight * dpr; }
addEventListener("resize", cfSize); cfSize();
const cfCols = ["#b79be3", "#ee9db8", "#ffd1e0", "#ffffff", "#f6d77a", "#c98a86", "#ffb7d0"];
function burst(n) {
  for (let i = 0; i < n; i++) {
    const a = rnd() * 6.28, s = (4 + rnd() * 9) * dpr;
    bits.push({ x: cf.width / 2, y: cf.height * .45, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6 * dpr,
      w: (5 + rnd() * 6) * dpr, h: (3 + rnd() * 5) * dpr, r: rnd() * 6, vr: (rnd() - .5) * .4, petal: rnd() < .4,
      c: cfCols[Math.floor(rnd() * cfCols.length)], life: 160 + rnd() * 60 });
  }
  if (!running) { running = true; cfLoop(); }
}
const fwCols = ["#ffd36b", "#ffb7d0", "#ffffff", "#c9a8ff", "#ffe9a8", "#ff9bb8"];
function hanabi(x, y) {
  const c1 = fwCols[Math.floor(rnd() * fwCols.length)], c2 = fwCols[Math.floor(rnd() * fwCols.length)], n = 72;
  for (let i = 0; i < n; i++) {
    const a = i / n * 6.283 + rnd() * .05, sp = (2.2 + rnd() * 3.4) * dpr;
    bits.push({ fw: true, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, w: (1.6 + rnd() * 1.4) * dpr, c: i % 2 ? c1 : c2, life: 70 + rnd() * 40 });
  }
  if (!running) { running = true; cfLoop(); }
}
function fireworks(n = 5) { for (let i = 0; i < n; i++) setTimeout(() => hanabi((.15 + rnd() * .7) * cf.width, (.12 + rnd() * .35) * cf.height), i * 420); }
function petalsAt(x, y, n) {
  for (let i = 0; i < n; i++) bits.push({ x, y, vx: (rnd() - .5) * 5 * dpr, vy: (-rnd() * 4 - 1) * dpr, w: (4 + rnd() * 4) * dpr, h: 3 * dpr,
    r: rnd() * 6, vr: (rnd() - .5) * .4, petal: true, c: pink[Math.floor(rnd() * pink.length)], life: 70 + rnd() * 30 });
  if (!running) { running = true; cfLoop(); }
}
document.addEventListener("pointerdown", (e) => petalsAt(e.clientX * dpr, e.clientY * dpr, 7));
function cfLoop() {
  cx.clearRect(0, 0, cf.width, cf.height);
  bits = bits.filter((b) => b.life-- > 0 && b.y < cf.height + 40);
  for (const b of bits) {
    if (b.fw) {
      b.vy += .05 * dpr; b.vx *= .975; b.vy *= .975; b.x += b.vx; b.y += b.vy;
      cx.save(); cx.globalAlpha = Math.min(1, b.life / 35); cx.strokeStyle = b.c; cx.lineWidth = b.w; cx.lineCap = "round";
      cx.shadowColor = b.c; cx.shadowBlur = 10 * dpr; cx.beginPath(); cx.moveTo(b.x - b.vx * 2.5, b.y - b.vy * 2.5); cx.lineTo(b.x, b.y); cx.stroke(); cx.restore();
      continue;
    }
    b.vy += .22 * dpr; b.vx *= .99; b.x += b.vx; b.y += b.vy; b.r += b.vr;
    cx.save(); cx.translate(b.x, b.y); cx.rotate(b.r); cx.globalAlpha = Math.min(1, b.life / 40); cx.fillStyle = b.c;
    if (b.petal) { petalPath(cx, b.w * .9); cx.fill(); } else cx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
    cx.restore();
  }
  if (bits.length) requestAnimationFrame(cfLoop); else running = false;
}

/* ================= music ================= */
/* Musik latar */
const audio = $("audio");
audio.src = CONFIG.music;
audio.addEventListener("error", () => {
  $("musicBtn").classList.add("hidden");
  const k = order.indexOf("s-music"); if (k > idx) order.splice(k, 1);   // tidak ada file lagu = halaman lagu dilewati
  if (idx > 0) drawDots();
});
$("musicBtn").onclick = () => {
  if (audio.paused) { audio.play(); $("musicBtn").classList.add("on"); }
  else { audio.pause(); $("musicBtn").classList.remove("on"); }
};
function startMusic() {
  audio.volume = 0.7;
  audio.play().then(() => { $("musicBtn").classList.remove("hidden"); $("musicBtn").classList.add("on"); }).catch(() => {});
}

/* pemutar di halaman lagu */
const fmt = (t) => isFinite(t) ? Math.floor(t / 60) + ":" + String(Math.floor(t % 60)).padStart(2, "0") : "0:00";
function syncPlayer() {
  const on = !audio.paused;
  $("mPlay").textContent = on ? "❚❚" : "▶"; $("vinyl").classList.toggle("spin", on); $("musicBtn").classList.toggle("on", on);
}
audio.addEventListener("play", syncPlayer); audio.addEventListener("pause", syncPlayer);
audio.addEventListener("timeupdate", () => {
  if (audio.duration) $("mBar").value = audio.currentTime / audio.duration * 100;
  $("mTime").textContent = fmt(audio.currentTime) + " / " + fmt(audio.duration);
});
$("mBar").oninput = () => { if (audio.duration) audio.currentTime = $("mBar").value / 100 * audio.duration; };
$("mPlay").onclick = () => { if (audio.paused) audio.play(); else audio.pause(); };
$("songJP").insertAdjacentText("afterbegin", CONFIG.song.title);
$("songSub").textContent = `${CONFIG.song.romaji} • ${CONFIG.song.artist}`;
onPage("s-music", () => { audio.currentTime = 0; startMusic(); syncPlayer(); });
$("musicNext").onclick = next;

/* ================= countdown =================
/* Halaman 1: hitung mundur + kunci sampai hari H */
/* Halaman 1: tiga fase (terbuka -> terkunci + hitung mundur -> terbuka) */
const lockFrom = new Date(CONFIG.lockFrom).getTime();
$("gateSub").textContent = `Hari spesial ${CONFIG.name} akan segera tiba…`;
$("gateDate").textContent = "📅 " + new Date(CONFIG.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }) + " • 00:00 WIB";
function isLocked() {
  const now = Date.now();
  return CONFIG.lockBeforeDate && !preview && now >= lockFrom && now < target;
}
function tick() {
  const now = Date.now(), diff = target - now;
  if (!isLocked()) {
    $("count").classList.add("hidden"); $("gateHint").classList.add("hidden"); $("openGate").classList.remove("hidden");
    $("gateSub").textContent = now >= target ? `Selamat ulang tahun, ${CONFIG.name}! 🎉`
      : preview ? "Mode preview aktif 👀" : "Mode pengecekan 👀 (terkunci mulai " + new Date(CONFIG.lockFrom).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" }) + ")";
    return;
  }
  $("count").classList.remove("hidden"); $("gateHint").classList.remove("hidden"); $("openGate").classList.add("hidden");
  $("gateSub").textContent = `Hari spesial ${CONFIG.name} akan segera tiba…`;
  const dd = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
  const p = (n) => String(n).padStart(2, "0");
  $("cd").textContent = p(dd); $("ch").textContent = p(h); $("cm").textContent = p(m); $("cs").textContent = p(s);
}
tick(); setInterval(tick, 1000);
$("openGate").onclick = () => {
  if (isLocked()) return;
  if (CONFIG.musicFromStart) startMusic();
  burst(60); next();
};

/* ================= envelope ================= */
/* Halaman 2: amplop */
$("envTo").textContent = `For ${CONFIG.name}`;
onPage("s-envelope", () => { $("envelope").classList.remove("open"); dimOn(); setTimeout(lightsOn, 900); });
function openEnvelope() {
  const e = $("envelope");
  if (e.classList.contains("open")) return;
  e.classList.add("open"); burst(40);
  setTimeout(next, 1600);
}
$("envelope").onclick = openEnvelope;
$("envelope").onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") openEnvelope(); };

/* ================= letter ================= */
/* Halaman 3: surat yang diketik */
$("letterTitle").textContent = CONFIG.letterTitle;
let typeTimer, fullText = "";
function startTyping() {
  fullText = CONFIG.letter.map(fill).join("\n\n");
  const el = $("letterText"); el.textContent = ""; let i = 0;
  $("skipType").classList.remove("hidden"); $("letterNext").classList.add("hidden");
  clearInterval(typeTimer);
  typeTimer = setInterval(() => {
    el.textContent += fullText[i++];
    document.querySelector("#s-letter .paper").scrollTop = 1e5;
    if (i >= fullText.length) finishTyping();
  }, 24);
}
function finishTyping() {
  clearInterval(typeTimer);
  $("letterText").textContent = fullText;
  $("skipType").classList.add("hidden"); $("letterNext").classList.remove("hidden");
}
onPage("s-letter", startTyping);
$("skipType").onclick = finishTyping;
$("letterNext").onclick = next;

/* ================= diary ================= */
/* Halaman 4: diary rahasia */
let dIdx = 0;
$("coverText").textContent = CONFIG.diaryCover;
function showEntry() {
  const e = CONFIG.diary[dIdx], p = $("dpage");
  p.classList.remove("show");
  setTimeout(() => {
    p.innerHTML = `<h3>${e.title}</h3><p>${e.text}</p>`;
    $("dCount").textContent = `${dIdx + 1}/${CONFIG.diary.length}`;
    p.classList.add("show");
  }, 220);
  if (dIdx === CONFIG.diary.length - 1) $("diaryDone").classList.remove("hidden");
}
function openBook() {
  const b = $("book"); if (b.classList.contains("open")) return;
  b.classList.add("open"); $("diaryHint").classList.add("hidden"); lightsOn();
  setTimeout(() => { $("dnav").classList.remove("hidden"); showEntry(); }, 700);
}
onPage("s-diary", () => {
  dimOn(); dIdx = 0; $("book").classList.remove("open"); $("dnav").classList.add("hidden");
  $("diaryHint").classList.remove("hidden"); $("diaryDone").classList.add("hidden"); $("dpage").classList.remove("show");
});
$("book").onclick = openBook;
$("book").onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") openBook(); };
$("dPrev").onclick = () => { if (dIdx > 0) { dIdx--; showEntry(); } };
$("dNext").onclick = () => { if (dIdx < CONFIG.diary.length - 1) { dIdx++; showEntry(); } };
$("diaryDone").onclick = next;

/* ================= reasons ================= */
/* Halaman 5: 17 alasan */
let opened = new Set();
function buildHearts() {
  const box = $("hearts"); box.innerHTML = ""; opened = new Set();
  $("rCount").textContent = 0; $("reasonNext").classList.add("hidden");
  CONFIG.reasons.forEach((r, i) => {
    const b = document.createElement("button"); b.textContent = i + 1; b.setAttribute("aria-label", "Alasan " + (i + 1));
    b.onclick = () => {
      b.classList.add("done"); opened.add(i);
      $("rNum").textContent = `alasan ke-${i + 1}`; $("rText").textContent = fill(r);
      $("reasonPop").classList.remove("hidden"); burst(26);
      $("rCount").textContent = opened.size;
      if (opened.size >= CONFIG.reasons.length) $("reasonNext").classList.remove("hidden");
    };
    box.append(b);
  });
}
onPage("s-reasons", buildHearts);
$("reasonPop").onclick = () => $("reasonPop").classList.add("hidden");
$("reasonSkip").onclick = next;
$("reasonNext").onclick = next;

/* ================= gallery ================= */
/* Halaman 6: galeri polaroid */
function placeholder(i) {
  const d = document.createElement("div"); d.className = "ph";
  d.textContent = ["🌸", "💜", "🦋", "🎀", "✨", "🌷"][i % 6]; return d;
}
let galleryBuilt = false;
function buildGallery() {
  if (galleryBuilt) return; galleryBuilt = true;
  const box = $("polaroids");
  CONFIG.photos.forEach((p, i) => {
    const f = document.createElement("div"); f.className = "pol";
    f.style.setProperty("--r", (Math.random() * 10 - 5).toFixed(1) + "deg");
    f.style.setProperty("--d", i * 0.15 + "s");
    const img = new Image(); img.src = p.src; img.alt = p.caption; img.loading = "lazy";
    img.onerror = () => img.replaceWith(placeholder(i));
    f.append(img);
    const c = document.createElement("small"); c.textContent = p.caption; f.append(c);
    f.onclick = () => {
      const t = $("lbImg"); t.innerHTML = "";
      const big = f.querySelector("img") ? new Image() : placeholder(i);
      if (big instanceof Image) big.src = p.src;
      t.append(big); $("lbCap").textContent = p.caption; $("lightbox").classList.remove("hidden");
    };
    box.append(f);
  });
}
onPage("s-gallery", buildGallery);
$("lightbox").onclick = () => $("lightbox").classList.add("hidden");
$("galleryNext").onclick = next;

/* ================= video ================= */
/* Halaman 7: video (hanya muncul kalau CONFIG.video diisi) */
const vid = $("momentVideo");
if (CONFIG.video) vid.src = CONFIG.video;
onPage("s-video", () => { vid.currentTime = 0; });
$("videoNext").onclick = () => { vid.pause(); next(); };

/* ================= dazai ================= */
/* Halaman 8: karakter favorit */
const fav = CONFIG.favorite;
$("dzTitle").textContent = fill(fav.title);
$("dzTag").textContent = fav.anime;
$("dzName").textContent = fav.character;
$("dzNote").textContent = fill(fav.note);
(function () {
  const box = $("dzImg"), img = new Image(); img.src = fav.image; img.alt = fav.character;
  img.onerror = () => { box.innerHTML = '<div class="ph" style="height:100%">🌸</div>'; };
  box.append(img);
})();
onPage("s-dazai", () => burst(30));
$("dzNext").onclick = next;

/* ================= cake ================= */
/* Halaman 9: kue + tiup lilin (tombol atau mikrofon) */
let micStream = null, micTimer = null;
function stopMic() {
  clearInterval(micTimer); micTimer = null;
  if (micStream) { micStream.getTracks().forEach((t) => t.stop()); micStream = null; }
  $("micHint").classList.add("hidden");
}
function blowOut() {
  if ($("cake").classList.contains("out")) return;
  stopMic();
  $("cake").classList.add("out"); setTimeout(lightsOn, 500); $("blowRow").classList.add("hidden");
  $("cakeSub").textContent = "Yeay! Semoga harapanmu terkabul 🎉";
  burst(220); setTimeout(() => burst(150), 700); fireworks(5);
  setTimeout(() => $("cakeNext").classList.remove("hidden"), 1200);
}
onPage("s-cake", () => {
  dimOn(); stopMic();
  $("cake").classList.remove("out"); $("blowRow").classList.remove("hidden"); $("cakeNext").classList.add("hidden");
  $("cakeSub").textContent = "Pejamkan mata, buat harapan, lalu tiup lilinnya 🕯️";
  $("blowMic").classList.toggle("hidden", !(navigator.mediaDevices && navigator.mediaDevices.getUserMedia));
});
$("blow").onclick = blowOut;
$("blowMic").onclick = async () => {
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ac = new (window.AudioContext || window.webkitAudioContext)(), an = ac.createAnalyser();
    an.fftSize = 512; ac.createMediaStreamSource(micStream).connect(an);
    const buf = new Uint8Array(an.fftSize); let hits = 0;
    $("micHint").classList.remove("hidden");
    micTimer = setInterval(() => {
      an.getByteTimeDomainData(buf);
      let peak = 0; for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
      hits = peak > 60 ? hits + 1 : 0;
      if (hits >= 3) { ac.close(); blowOut(); }
    }, 60);
  } catch (e) { $("micHint").textContent = "Mikrofon tidak diizinkan, pakai tombol Tiup Lilin aja ya 😊"; $("micHint").classList.remove("hidden"); }
};
$("cakeNext").onclick = next;

/* ================= wishes ================= */
/* Halaman 10: gelembung doa melayang */
let readW = new Set();
function buildSky() {
  const sky = $("sky"); sky.innerHTML = ""; readW = new Set();
  $("wCount").textContent = 0; $("wishNext").classList.add("hidden");
  const emo = ["💌", "🌸", "✨", "💜", "🦋", "🎀", "⭐", "🫧"];
  CONFIG.wishes.forEach((w, i) => {
    const b = document.createElement("button"); b.className = "bubble"; b.textContent = emo[i % emo.length];
    const N = CONFIG.wishes.length, t = 12 + (i % 3) * 2;
    b.style.left = 4 + (((i * 5) % N) / Math.max(N - 1, 1)) * 78 + "%";
    b.style.setProperty("--t", t + "s"); b.style.setProperty("--d", -(t * ((i * 3) % N) / N) + "s");
    b.onclick = () => {
      $("wText").textContent = fill(w); $("wishPop").classList.remove("hidden"); burst(20);
      b.classList.add("read"); readW.add(i); $("wCount").textContent = readW.size;
      if (readW.size >= CONFIG.wishes.length) $("wishNext").classList.remove("hidden");
    };
    sky.append(b);
  });
}
onPage("s-wishes", buildSky);
$("wishPop").onclick = () => $("wishPop").classList.add("hidden");
$("wishSkip").onclick = next;
$("wishNext").onclick = next;

/* ================= gift ================= */
/* Halaman 11: kado kejutan */
onPage("s-gift", () => { $("gift").classList.remove("open", "shake"); dimOn(); });
function openGift() {
  const g = $("gift"); if (g.classList.contains("shake") || g.classList.contains("open")) return;
  g.classList.add("shake");
  setTimeout(() => { g.classList.remove("shake"); g.classList.add("open"); burst(200); fireworks(4); lightsOn(); }, 1600);
  setTimeout(next, 3300);
}
$("gift").onclick = openGift;
$("gift").onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") openGift(); };

/* ================= final ================= */
/* Halaman 12: penutup */
$("finalName").textContent = `untuk ${CONFIG.fullName}`;
$("finalMsg").textContent = fill(CONFIG.finalMessage);
$("sign").textContent = "— " + CONFIG.from;
$("finalJP").innerHTML = `${CONFIG.finalJP}<small>${CONFIG.finalJPid}</small>`;
if (CONFIG.whatsapp) {
  $("waBtn").href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappText)}`;
  $("waBtn").classList.remove("hidden");
}
onPage("s-final", () => { dimOn(); setTimeout(lightsOn, 700); burst(160); setTimeout(() => burst(120), 900); fireworks(7); });
$("replay").onclick = restart;

/* ================= main ================= */
/* Pengaturan umum */
document.title = `Sweet Seventeen untuk ${CONFIG.fullName} 🌸`;
setVText("s-gate");
if (preview) { $("devNext").classList.remove("hidden"); $("devNext").onclick = next; }
