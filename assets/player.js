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

// Full screen where the browser supports it (iPhone Safari doesn't for embedded games), and
// otherwise open the game on its own page.
document.getElementById("fullscreen").addEventListener("click", () => {
  const request = player.requestFullscreen || player.webkitRequestFullscreen;
  if (!request) {
    location.href = game;
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
