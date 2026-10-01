// The game player on each game page. The game only loads when someone presses Play, so the page
// itself stays light and fast. Once the page has loaded, the game's code is fetched in the
// background so pressing Play starts it quickly. Without JavaScript, Play opens the bare game.
const player = document.getElementById("player");
const stage = document.getElementById("stage");
const start = document.getElementById("start");
const game = stage.dataset.game; // the game's folder, like "/games/fruit-slash/"

function loadGame() {
  let frame = stage.querySelector("iframe");
  if (frame) return frame;
  frame = document.createElement("iframe");
  frame.src = `${game}?autostart`;
  frame.title = stage.dataset.title;
  frame.allow = "fullscreen; autoplay";
  frame.allowFullscreen = true;
  // Keyboard games only hear key presses when the frame has focus.
  frame.addEventListener("load", () => frame.contentWindow.focus());
  start.replaceWith(frame);
  return frame;
}

start.addEventListener("click", (e) => {
  e.preventDefault();
  loadGame();
});

// On iPhone and iPad, real full screen is no good for games: Safari closes it on any downward
// swipe, by design, and pages can't stop that. iPhone Safari doesn't offer it for embedded games
// at all. There, "full screen" makes the player fill the browser window instead. (iPads report
// themselves as Macs, but Macs don't have touch screens.)
const appleTouch =
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
const fullscreenButton = document.getElementById("fullscreen");

function fillWindow(on) {
  document.documentElement.classList.toggle("player-max", on);
  fullscreenButton.textContent = on ? "Exit full screen" : "Full screen";
  if (on) scrollTo(0, 0);
}

fullscreenButton.addEventListener("click", () => {
  const request = player.requestFullscreen || player.webkitRequestFullscreen;
  if (appleTouch || !request) {
    const on = !document.documentElement.classList.contains("player-max");
    if (on) loadGame();
    fillWindow(on);
    return;
  }
  loadGame();
  request.call(player);
});

window.addEventListener("load", () => {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = `${game}game.js`;
  document.head.append(link);
});
