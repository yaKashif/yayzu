// Records a demo video of Wiz o Wisp: real gameplay of one song, played on the beat, with its sound.
//   node tools/record-demo.mjs [song-id] [out.mp4]
// Needs the dev server running (npm run dev, on port 5200), Chrome, and ffmpeg.
//
// The game runs in headless Chrome on a clock this script steps one frame at a time (see the
// localhost hook at the end of src/main.js), so every frame is captured and nothing stutters. The
// game's sounds are logged as it plays and rendered offline through its own piano and reverb, then
// ffmpeg puts frames and sound together as an MP4 that X (Twitter) and other sites accept.
import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SONG = process.argv[2] || "frere-jacques";
const OUT = path.resolve(process.argv[3] || path.join(root, "media", `wiz-o-wisp-${SONG}.mp4`));
const URL_BASE = process.env.GAME_URL || "http://localhost:5200";
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const FFMPEG = process.env.FFMPEG || "ffmpeg";

// A portrait 4:5 video, 1080 x 1350: the shape that fills the most of a phone's timeline. The page
// is laid out at half that size and drawn at twice the density, as on a phone, so the game's text
// and buttons are big enough to read.
const VIEW = { width: 540, height: 675, scale: 2 };
const FPS = 60;
const TIMING = {
  menu: 1.6, // seconds on the song list before the song starts
  firstHop: 0.9, // then this long before the first hop
  jitter: 0.04, // hops land within ±20 ms of the beat, like a steady player
  end: 3, // seconds the "Song complete" card stays on screen
};

const frames = path.join(path.dirname(OUT), "demo-frames");
const profile = path.join(os.tmpdir(), `wiz-o-wisp-demo-${process.pid}`);
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- Chrome, over the DevTools protocol ----------
const chrome = spawn(CHROME, [
  "--headless=new",
  "--remote-debugging-port=9333",
  `--user-data-dir=${profile}`,
  "--hide-scrollbars",
  "--mute-audio",
  `--window-size=${VIEW.width},${VIEW.height}`,
  "about:blank",
]);

let target;
for (let tries = 0; !target; tries++) {
  if (tries > 50) throw new Error("record-demo: Chrome didn't start");
  await pause(200);
  try {
    target = (await (await fetch("http://127.0.0.1:9333/json/list")).json()).find((t) => t.type === "page");
  } catch {
    // not listening yet
  }
}

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});
let nextId = 0;
const waiting = new Map();
const listeners = new Map();
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.id !== undefined) {
    const { resolve, reject } = waiting.get(message.id);
    waiting.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  } else listeners.get(message.method)?.(message.params);
};
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++nextId;
    waiting.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) => {
  const { result, exceptionDetails } = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (exceptionDetails) throw new Error(`record-demo: ${exceptionDetails.exception?.description || exceptionDetails.text}`);
  return result.value;
};

try {
  await send("Emulation.setDeviceMetricsOverride", { width: VIEW.width, height: VIEW.height, deviceScaleFactor: VIEW.scale, mobile: false });
  await send("Page.enable");
  const loaded = new Promise((resolve) => listeners.set("Page.loadEventFired", resolve));
  await send("Page.navigate", { url: `${URL_BASE}/?all` });
  await loaded;
  await evaluate(`new Promise((resolve) => { const check = () => (window.wizOWisp ? resolve() : setTimeout(check, 50)); check(); })`);

  // Logging sounds starts before anything could wake the real audio, then the song list moves to
  // the chosen song, the way a player would with the arrow keys.
  const index = await evaluate(`(() => {
    const W = wizOWisp;
    W.record.start();
    const index = W.SONGS.findIndex((s) => s.id === ${JSON.stringify(SONG)});
    if (index < 0) throw new Error("no song called ${SONG}");
    for (let i = 0; i < index; i++) window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
    return index;
  })()`);

  // The piano recordings it needs, downloaded for real (the pill hides once they're in).
  await evaluate(`new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (document.getElementById("piano").hidden) resolve();
      else if (Date.now() - start > 60000) reject(new Error("piano recordings didn't load"));
      else setTimeout(check, 200);
    };
    check();
  })`);

  // The site's address along the bottom, and the player that hops on the beat.
  await evaluate(`(() => {
    const tag = document.createElement("div");
    tag.textContent = "Play free · yayzu.com";
    Object.assign(tag.style, {
      position: "fixed", zIndex: 7, left: "50%", bottom: "18px", transform: "translateX(-50%)",
      padding: "8px 18px", borderRadius: "999px", background: "rgba(255, 248, 242, 0.88)",
      color: "#6b3f55", font: "700 15px system-ui, sans-serif", letterSpacing: "0.2px",
      boxShadow: "0 3px 14px rgba(110, 40, 80, 0.25)", whiteSpace: "nowrap",
    });
    tag.style.display = "none"; // on the song list it would cover the credits; it shows once the song starts
    document.body.append(tag);

    const W = wizOWisp;
    const t0 = W.record.clock();
    const timing = ${JSON.stringify(TIMING)};
    let started = false;
    let due = null;
    let doneAt = null;
    window.demo = {
      t0,
      step(dt) {
        const target = W.record.clock() + dt;
        if (!started && target - t0 >= timing.menu) {
          W.startGame(${index});
          started = true;
          tag.style.display = "";
        }
        for (;;) {
          const s = W.state;
          const next = s.steps[s.cur + 1];
          if (s.mode !== "playing" || !next) break;
          if (due === null) {
            const beat = s.cur < 0 ? s.startedAt + timing.firstHop : W.expectedNext();
            due = beat + (Math.random() - 0.5) * timing.jitter;
          }
          if (due > target) break;
          if (due > W.record.clock()) W.record.advance(due - W.record.clock());
          W.press(next.dir, due * 1000);
          due = null;
        }
        if (target > W.record.clock()) W.record.advance(target - W.record.clock());
        if (W.state.mode === "done" && doneAt === null) doneAt = target;
        return { done: doneAt !== null && target - doneAt >= timing.end, mode: W.state.mode };
      },
    };
  })()`);

  // ---------- Frames ----------
  await rm(frames, { recursive: true, force: true });
  await mkdir(frames, { recursive: true });
  let count = 0;
  for (;;) {
    const state = await evaluate(`demo.step(${1 / FPS})`);
    const shot = await send("Page.captureScreenshot", { format: "jpeg", quality: 94 });
    await writeFile(path.join(frames, `${String(count).padStart(6, "0")}.jpg`), Buffer.from(shot.data, "base64"));
    count++;
    if (count % 120 === 0) console.log(`${(count / FPS).toFixed(0)} s recorded (${state.mode})`);
    if (state.done || count > FPS * 150) break;
  }
  const seconds = count / FPS;
  console.log(`${count} frames, ${seconds.toFixed(1)} s`);

  // ---------- Sound ----------
  await evaluate(`wizOWisp.record.render(demo.t0, ${seconds}).then((wav) => { window.demoWav = wav; })`);
  const size = await evaluate(`demoWav.length`);
  let base64 = "";
  for (let i = 0; i < size; i += 1 << 20) base64 += await evaluate(`demoWav.slice(${i}, ${i + (1 << 20)})`);
  const wav = path.join(frames, "sound.wav");
  await writeFile(wav, Buffer.from(base64, "base64"));

  // ---------- The video ----------
  await mkdir(path.dirname(OUT), { recursive: true });
  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(FFMPEG, [
      "-y", "-loglevel", "error",
      "-framerate", String(FPS), "-i", path.join(frames, "%06d.jpg"),
      "-i", wav,
      // Video in the standard (TV) colour range; screenshots come in full range, which some sites
      // show with shifted colours.
      "-vf", "scale=out_range=tv,format=yuv420p",
      "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-color_range", "tv", "-profile:v", "high",
      // The game mixes quietly (about -23 LUFS); lift it to around -15, as loud as other videos in a
      // feed, with a limiter keeping peaks under -1.5 dB.
      "-af", "volume=8dB,alimiter=limit=0.84:level=false",
      "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
      "-movflags", "+faststart", "-shortest", OUT,
    ], { stdio: "inherit" });
    ffmpeg.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
  });
  console.log(`Wrote ${OUT}`);
} finally {
  socket.close();
  chrome.kill();
  await pause(300);
  await rm(profile, { recursive: true, force: true }).catch(() => {});
  await rm(frames, { recursive: true, force: true }).catch(() => {});
}
