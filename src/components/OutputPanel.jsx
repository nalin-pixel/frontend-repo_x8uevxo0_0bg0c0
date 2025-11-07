export default function OutputPanel({ data }) {
  if (!data) return null;

  const { name, genre, premise, controls } = data;

  const htmlCode = `<!DOCTYPE html>\n<html lang=\"id\">\n<head>\n<meta charset=\"UTF-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n<title>${name} — Prototype</title>\n<style>\n  html,body{height:100%;margin:0;background:#0a0b10;color:#e6fbff;font-family:Inter,system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}\n  #game{display:block;width:100vw;height:100vh;}\n  .hud{position:fixed;top:16px;left:16px;color:#9ff7ff;text-shadow:0 0 12px rgba(0,255,255,0.3);} \n</style>\n</head>\n<body>\n<canvas id=\"game\"></canvas>\n<div class=\"hud\">Skor: <span id=\"score\">0</span></div>\n<script src=\"player.js\"></script>\n<script src=\"environment.js\"></script>\n<script src=\"game.js\"></script>\n</body>\n</html>`;

  const playerJs = `// player.js\nexport class Player {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n    this.vx = 0;\n    this.vy = 0;\n    this.speed = 6;\n    this.size = 16;\n    this.color = '#4be3ff';\n  }\n  update(input, bounds) {\n    this.vx = 0;\n    if (input.left) this.vx = -this.speed;\n    if (input.right) this.vx = this.speed;\n    this.x += this.vx;\n    // clamp inside bounds\n    this.x = Math.max(this.size, Math.min(bounds.w - this.size, this.x));\n  }\n  draw(ctx) {\n    ctx.save();\n    ctx.shadowColor = this.color;\n    ctx.shadowBlur = 16;\n    ctx.strokeStyle = this.color;\n    ctx.lineWidth = 3;\n    ctx.beginPath();\n    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);\n    ctx.stroke();\n    ctx.restore();\n  }\n}`;

  const envJs = `// environment.js\nexport class Obstacle {\n  constructor(x, y, speed) {\n    this.x = x; this.y = y; this.w = 26; this.h = 6;\n    this.speed = speed;\n    this.color = '#ff5edd';\n  }\n  update(dt) { this.y += this.speed * dt; }\n  draw(ctx) {\n    ctx.save();\n    ctx.shadowColor = this.color; ctx.shadowBlur = 12;\n    ctx.strokeStyle = this.color; ctx.lineWidth = 3;\n    ctx.strokeRect(this.x - this.w/2, this.y - this.h/2, this.w, this.h);\n    ctx.restore();\n  }\n}\n\nexport class BackgroundGrid {\n  constructor() { this.offset = 0; this.color = 'rgba(0,255,255,0.15)'; }\n  update(dt, speed=120) { this.offset += speed * dt; }\n  draw(ctx, w, h) {\n    ctx.save();\n    ctx.strokeStyle = this.color; ctx.lineWidth = 1;\n    const gap = 40;\n    const off = this.offset % gap;\n    for (let y = -gap; y < h + gap; y += gap) {\n      ctx.beginPath(); ctx.moveTo(0, y + off); ctx.lineTo(w, y + off); ctx.stroke();\n    }\n    for (let x = 0; x < w; x += gap) {\n      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();\n    }\n    ctx.restore();\n  }\n}`;

  const gameJs = `// game.js\nimport { Player } from './player.js';\nimport { Obstacle, BackgroundGrid } from './environment.js';\n\nconst canvas = document.getElementById('game');\nconst ctx = canvas.getContext('2d');\nconst DPR = Math.min(window.devicePixelRatio || 1, 2);\n\nconst input = { left: false, right: false };

function resize() {\n  canvas.width = Math.floor(window.innerWidth * DPR);\n  canvas.height = Math.floor(window.innerHeight * DPR);\n  canvas.style.width = window.innerWidth + 'px';\n  canvas.style.height = window.innerHeight + 'px';\n  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);\n}\nwindow.addEventListener('resize', resize);\nresize();\n\n// Controls\nwindow.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') input.left = true; if (e.key === 'ArrowRight') input.right = true; });\nwindow.addEventListener('keyup', (e) => { if (e.key === 'ArrowLeft') input.left = false; if (e.key === 'ArrowRight') input.right = false; });\nlet touchX = null;\nwindow.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; });\nwindow.addEventListener('touchmove', (e) => { const dx = e.touches[0].clientX - touchX; if (dx < -5) { input.left = true; input.right = false; } else if (dx > 5) { input.right = true; input.left = false; } });\nwindow.addEventListener('touchend', () => { input.left = input.right = false; touchX = null; });\n\n// Entities\nconst player = new Player(window.innerWidth/2, window.innerHeight*0.8);\nconst grid = new BackgroundGrid();\nconst obstacles = [];\nlet score = 0;\nlet last = 0;\nlet accumulator = 0;\n\nfunction spawnObstacle() {\n  const x = 30 + Math.random() * (window.innerWidth - 60);\n  const speed = 160 + Math.random() * 120;\n  obstacles.push(new Obstacle(x, -20, speed));\n}\nlet spawnTimer = 0;\n\nfunction update(dt) {\n  grid.update(dt);\n  player.update(input, { w: window.innerWidth });\n  spawnTimer -= dt;\n  if (spawnTimer <= 0) { spawnObstacle(); spawnTimer = 0.6; }\n  for (let i = obstacles.length - 1; i >= 0; i--) {\n    const o = obstacles[i];\n    o.update(dt);\n    if (o.y - o.h > window.innerHeight) { obstacles.splice(i, 1); score += 10; }\n    // collision\n    const dx = Math.abs(o.x - player.x); const dy = Math.abs(o.y - player.y);\n    if (dx < (o.w/2 + player.size*0.8) && dy < (o.h/2 + player.size*0.8)) {\n      // simple game over: reset\n      obstacles.length = 0; score = 0; spawnTimer = 0.6;\n    }\n  }\n  document.getElementById('score').textContent = String(score);\n}\n\nfunction draw() {\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\n  // background\n  grid.draw(ctx, window.innerWidth, window.innerHeight);\n  // neon center lane\n  ctx.save(); ctx.strokeStyle = 'rgba(0,255,255,0.35)'; ctx.lineWidth = 2;\n  ctx.beginPath(); ctx.moveTo(window.innerWidth/2, 0); ctx.lineTo(window.innerWidth/2, window.innerHeight); ctx.stroke(); ctx.restore();\n  // entities\n  player.draw(ctx);\n  obstacles.forEach((o) => o.draw(ctx));\n}\n\nfunction loop(ts) {\n  if (!last) last = ts;\n  const dt = Math.min(0.033, (ts - last) / 1000);\n  last = ts;\n  accumulator += dt;\n  // fixed update can be applied here; for now, use dt directly\n  update(dt);\n  draw();\n  requestAnimationFrame(loop);\n}\nrequestAnimationFrame(loop);`;

  const promptDoc = `Nama Konsep Game: ${name}\nGenre Game: ${genre}\n\nPremis Inti Game (Gameplay Loop):\n${premise}\n\nMekanik Kontrol:\n${controls}\n\nBagian 2: Struktur Teknis (Web Game)\nTeknologi: HTML5 Canvas untuk grafis, JavaScript murni untuk logika, CSS untuk UI.\nStruktur Kode Dasar:\n- game.js: loop utama (update(), draw(), requestAnimationFrame).\n- player.js: posisi x,y, kecepatan, draw() neon.\n- environment.js: rintangan + grid latar.\nFrame Rate: Gunakan requestAnimationFrame untuk kelancaran.\nResponsif: Kanvas menyesuaikan ukuran jendela dengan DPR awareness.\n\nBagian 3: Estetika (Futuristik & Smooth)\nVisual: Garis neon, bentuk geometris sederhana, latar gelap.\nPalet: Gelap/Hitam + Neon Cyan, Magenta, Electric Blue.\nAnimasi: Interpolasi halus untuk gerak & transisi.\nHUD/UI: Font sans-serif modern dengan glow halus.\n\nBagian 4: Output\n- HTML5 + <canvas> + HUD skor.\n- player.js & environment.js minimal.\n- game.js lengkap dengan kontrol keyboard & sentuh.`;

  return (
    <section className="bg-[#070a10] py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-6">
        <h3 className="text-xl md:text-2xl font-semibold text-white">Hasil Prompt & Kode</h3>
        <p className="mt-2 text-cyan-100/80">
          Salin dokumen dan berkas kode berikut untuk memulai prototype berbasis HTML5 Canvas.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-cyan-500/20 bg-[#0b0f1a] p-4">
            <h4 className="font-semibold text-cyan-300">Dokumen Prompt</h4>
            <textarea
              readOnly
              className="mt-3 h-[320px] w-full resize-none rounded-lg bg-[#0f1420] p-3 text-sm text-cyan-100/90 border border-cyan-500/20"
              value={promptDoc}
            />
          </div>

          <div className="rounded-xl border border-cyan-500/20 bg-[#0b0f1a] p-4">
            <h4 className="font-semibold text-cyan-300">index.html</h4>
            <textarea
              readOnly
              className="mt-3 h-[320px] w-full resize-none rounded-lg bg-[#0f1420] p-3 text-xs text-cyan-100/90 border border-cyan-500/20"
              value={htmlCode}
            />
          </div>

          <CodeBlock title="player.js" code={playerJs} />
          <CodeBlock title="environment.js" code={envJs} />
          <CodeBlock title="game.js" code={gameJs} />
        </div>
      </div>
    </section>
  );
}

function CodeBlock({ title, code }) {
  return (
    <div className="rounded-xl border border-cyan-500/20 bg-[#0b0f1a] p-4">
      <h4 className="font-semibold text-cyan-300">{title}</h4>
      <textarea
        readOnly
        className="mt-3 h-[280px] w-full resize-none rounded-lg bg-[#0f1420] p-3 text-xs text-cyan-100/90 border border-cyan-500/20 font-mono"
        value={code}
      />
    </div>
  );
}
