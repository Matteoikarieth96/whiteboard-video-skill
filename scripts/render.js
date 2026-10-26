#!/usr/bin/env node
/*
  Render a whiteboard video project.

  node render.js <project> check              build the scenes and print timing/layout warnings only
  node render.js <project> preview [t ...]    PNG stills into <project>/previews/ (no times = the last moment of every scene)
  node render.js <project> sheet              same default stills, plus one contact sheet <project>/previews/sheet.png to review every scene at once
  node render.js <project> full               every frame, then mux with narration.wav into <project>/out/<name>.mp4

  Needs: timeline.json + narration.wav (from make_audio.py), scenes.js, optional config.json.
  Chrome: set CHROME_PATH if it is not in a standard location.
*/
const fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync } = require("child_process");
const puppeteer = require("puppeteer-core");

const [, , projArg, mode = "check", ...rest] = process.argv;
if (!projArg) { console.error("usage: render.js <project> check|preview|full [times...]"); process.exit(1); }
const project = path.resolve(projArg);
const cfgPath = path.join(project, "config.json");
const cfg = Object.assign({ width: 1920, height: 1080, fps: 30, pan: 0.45, name: path.basename(project) },
  fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, "utf8")) : {});
const tl = JSON.parse(fs.readFileSync(path.join(project, "timeline.json"), "utf8"));

function findChrome() {
  const c = [process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"].filter(Boolean);
  const hit = c.find(p => fs.existsSync(p));
  if (!hit) { console.error("Chrome not found. Set CHROME_PATH=/path/to/chrome"); process.exit(1); }
  return hit;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: findChrome(), headless: "new",
    args: ["--use-mock-keychain", "--password-store=basic", "--no-first-run", "--hide-scrollbars", "--force-device-scale-factor=1", "--allow-file-access-from-files"],
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.setViewport({ width: cfg.width, height: cfg.height });
  await page.goto("file://" + path.join(__dirname, "engine.html"));
  await page.addScriptTag({ path: path.join(project, "scenes.js") });
  const info = await page.evaluate((t, c) => window.init(t, c), tl, cfg).catch(e => { errors.push(e.message); return null; });
  if (errors.length || !info) { console.error("ERROR in scenes.js:\n  " + errors.join("\n  ")); await browser.close(); process.exit(1); }
  console.log(`${info.items} drawing items, ${tl.scenes.length} scenes, ${tl.total.toFixed(2)}s`);
  info.warn.forEach(w => console.log("WARN", w));

  if (mode === "preview" || mode === "sheet") {
    const dir = path.join(project, "previews");
    fs.mkdirSync(dir, { recursive: true });
    const shots = [];
    let times = rest.map(Number).filter(n => !isNaN(n));
    if (!times.length) times = tl.scenes.map((s, i) => i < tl.scenes.length - 1 ? s.end - cfg.pan - 0.05 : s.end - 0.1);
    for (const t of times) {
      await page.evaluate(t => window.renderAt(t), t);
      const scene = tl.scenes.find(s => t >= s.start && t < s.end);
      const file = path.join(dir, `${t.toFixed(2).padStart(7, "0")}${scene ? "_" + scene.id : ""}.png`);
      await page.screenshot({ path: file });
      console.log("preview", file);
      shots.push(file);
    }
    if (mode === "sheet" && shots.length > 1) {
      const w = Math.round(cfg.width / 2), h = Math.round(cfg.height / 2), cols = cfg.width >= cfg.height ? 2 : 3;
      const inputs = shots.flatMap(f => ["-i", f]);
      const scaled = shots.map((_, i) => `[${i}:v]scale=${w}:${h}[s${i}];`).join("");
      const pos = shots.map((_, i) => `${(i % cols) * w}_${Math.floor(i / cols) * h}`).join("|");
      const sheet = path.join(dir, "sheet.png");
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex",
        `${scaled}${shots.map((_, i) => `[s${i}]`).join("")}xstack=inputs=${shots.length}:layout=${pos}:fill=white[out]`, "-map", "[out]", sheet]);
      console.log("sheet", sheet);
    }
  } else if (mode === "full") {
    const frames = path.join(os.tmpdir(), `wbv-frames-${cfg.name}-${process.pid}`);
    fs.mkdirSync(frames, { recursive: true });
    const n = Math.ceil(tl.total * cfg.fps), t0 = Date.now();
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.renderAt(t), i / cfg.fps);
      await page.screenshot({ path: path.join(frames, `f${String(i).padStart(5, "0")}.jpg`), type: "jpeg", quality: 92 });
      if (i % 300 === 0) console.log(`frame ${i}/${n}  ${((i + 1) / ((Date.now() - t0) / 1000)).toFixed(1)} fps`);
    }
    await browser.close();
    const outDir = path.join(project, "out");
    fs.mkdirSync(outDir, { recursive: true });
    const out = path.join(outDir, `${cfg.name}.mp4`);
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(cfg.fps), "-i", path.join(frames, "f%05d.jpg"),
      "-i", path.join(project, "narration.wav"), "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-shortest",
      "-movflags", "+faststart", out], { stdio: "inherit" });
    fs.rmSync(frames, { recursive: true, force: true });
    const dur = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).toString().trim();
    console.log(`video ${out}  ${Number(dur).toFixed(2)}s  rendered in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    return;
  }
  await browser.close();
})();
