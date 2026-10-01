# Yayzu

Free browser games you can play instantly, at [yayzu.com](https://yayzu.com).

A static site served by GitHub Pages: plain HTML and CSS, no build step for the site itself.

- `index.html` is the home page and game grid.
- `<slug>/index.html` is each game's page: the game embedded at the top, then its guide.
- `games/<slug>/` holds each playable game: its build, `game.json` metadata and thumbnail.

## Games

| Game | Page | Source |
| --- | --- | --- |
| Boulder Bear | [/boulder-bear/](https://yayzu.com/boulder-bear/) | Built from the `boulder-bear` project with `npm run publish:yayzu`, which bundles the game and three.js into `games/boulder-bear/`. |

## Submit your game

Made a web game? We'd love to put it on Yayzu. Games are submitted as pull requests to this
repository.

1. **Fork** this repository.
2. **Add your game** in a new folder, `games/<slug>/`, where `<slug>` is a short lowercase name
   with hyphens, like `boulder-bear`. The folder needs:
   - your game's built files, with `index.html` as the entry point,
   - a `game.json` metadata file ([format below](#metadata-gamejson)),
   - a `thumbnail.jpg` or `thumbnail.webp`.
3. **Test it** by serving the repository folder with any static server, for example
   `npx serve .`, then opening `/games/<slug>/`. Try it on a phone too.
4. **Open a pull request** titled `Add game: <Title>`. The template walks you through the
   checklist below.

We review every submission and play it on a computer and a phone. If it meets the guidelines, we
write its game page, add it to the home page and merge. If something needs changing, we'll say
what in the pull request.

Not comfortable with pull requests? [Open an issue](https://github.com/yaKashif/yayzu/issues/new)
with a link to your game and we'll take it from there.

## Guidelines

### 1. Optimized

Yayzu players are often on phones and mobile data, so games must load fast and run smoothly.

- **Small downloads.** Keep what loads before the first screen under **3 MB compressed**, and the
  whole game under **15 MB**. Load large extras (more levels, music) after play starts.
- **Minified and compressed.** Minify JavaScript and CSS. Use compressed images (WebP or
  optimized JPG/PNG) and compressed audio (OGG, MP3 or M4A).
- **Fast to start.** A player should be able to start playing within about **3 seconds** on a
  mid-range phone on 4G.
- **Smooth to play.** Aim for **60 fps** on a mid-range phone; it must never drop below 30 fps
  in normal play.
- **Good citizen.** Pause the game and its sound when the tab is hidden. No errors in the
  browser console.

### 2. Web-only

Games run entirely in the browser, from static files, inside the Yayzu game page.

- **Static files only:** HTML, JavaScript, CSS, WebAssembly, images, audio and fonts. No
  installs, plugins, browser extensions or downloads, and no server-side code.
- **Self-contained.** Bundle your libraries and assets into your folder. A game must not need a
  network connection to anything else to be played. Online extras like leaderboards must be
  optional.
- **Relative paths.** Your game is served from `/games/<slug>/`, so reference every file
  relatively (`./sprites/hero.png`, not `/sprites/hero.png`).
- **Works in a frame.** Games are embedded in an `<iframe>` on their page. Don't redirect the
  top page, and open any links with `target="_top"`.
- **Desktop and mobile.** Support keyboard or mouse on computers and touch on phones, and work
  in current Chrome, Safari, Firefox and Edge.
- **Sound after a tap.** Browsers block audio until the player interacts, so start sound on the
  first tap, click or key press, and offer a mute control.
- **No ads, tracking or data collection.** Yayzu handles ads and analytics site-wide. Saving
  progress or high scores in `localStorage` is fine.

### 3. Metadata

Every game includes a `game.json` file and a thumbnail. We use them to build the game page, the
home page tile and the information search engines show.

- **Thumbnail:** 16:9, at least **800×450** (1200×675 recommended), under **200 KB**. Keep the
  main subject near the centre, because the home page crops tiles to a square. Avoid text in the
  image.
- **`game.json`:** the fields below. Required fields are marked.

### 4. Content

- **Original or properly licensed.** Everything in your game must be yours or licensed for
  commercial use. No characters, music or art from other games, films or brands.
- **Family friendly.** Games must be suitable for all ages: no graphic violence, sexual content
  or hateful material.
- **Made with AI? Welcome**, as long as the game is polished, original and playable, not raw
  generated output.

## Metadata: `game.json`

```json
{
  "slug": "boulder-bear",
  "title": "Boulder Bear",
  "shortDescription": "Help a brave teddy dodge, jump and ride boulders rolling down a mountain.",
  "description": "Boulders are rolling down three mountain trails toward a brave teddy bear...",
  "genres": ["Arcade", "Runner"],
  "tags": ["teddy bear", "endless runner", "3d"],
  "howToPlay": ["Change trails to get out of a boulder's way.", "Jump over single boulders."],
  "controls": {
    "keyboard": [{ "action": "Jump", "keys": ["ArrowUp", "W", "Space"] }],
    "touch": [{ "action": "Jump", "gesture": "Swipe up" }]
  },
  "orientation": "any",
  "platforms": ["desktop", "mobile"],
  "entry": "index.html",
  "thumbnail": "thumbnail.jpg",
  "engine": "three.js",
  "author": { "name": "Your name or studio", "url": "https://example.com" },
  "version": "1.0.0",
  "released": "2026-10-01",
  "sizeKB": { "total": 628, "initialGzip": 150 },
  "contentRating": "everyone"
}
```

| Field | Required | Description |
| --- | --- | --- |
| `slug` | Yes | Matches the folder name. Lowercase letters, numbers and hyphens. |
| `title` | Yes | The game's name, as players should see it. |
| `shortDescription` | Yes | One sentence, up to 160 characters. Used in search results and link previews. |
| `description` | Yes | A paragraph about the game for its page. |
| `genres` | Yes | One to three, such as Arcade, Puzzle, Racing, Runner, Shooter, Sports, Strategy. |
| `tags` | No | Extra keywords people might search for. |
| `howToPlay` | Yes | A few short steps explaining how to play. |
| `controls` | Yes | Keyboard and touch controls. Include `touch` if the game supports phones. |
| `orientation` | Yes | `any`, `portrait` or `landscape`: how the game should be held on a phone. |
| `platforms` | Yes | `desktop`, `mobile`, or both. |
| `entry` | Yes | The file that starts the game, normally `index.html`. |
| `thumbnail` | Yes | The thumbnail file name in your folder. |
| `engine` | No | What the game is built with, such as three.js, Phaser, PixiJS or Godot (web export). |
| `author` | Yes | Your name or studio, and optionally a link. |
| `version` | Yes | Bump it whenever you send an update. |
| `released` | Yes | First release date, as `YYYY-MM-DD`. |
| `sizeKB` | Yes | `total`: the whole folder. `initialGzip`: what loads before the first screen, compressed. |
| `contentRating` | Yes | `everyone`. Games for older audiences aren't accepted yet. |

## Submission checklist

- [ ] The game is in `games/<slug>/` with `index.html` as its entry point.
- [ ] `game.json` is complete and its `slug` matches the folder name.
- [ ] The thumbnail is 16:9, at least 800×450 and under 200 KB.
- [ ] Initial load is under 3 MB compressed, and the whole game under 15 MB.
- [ ] It starts within about 3 seconds and runs smoothly on a mid-range phone.
- [ ] It works with keyboard or mouse on a computer and with touch on a phone.
- [ ] All paths are relative, and it works inside an iframe.
- [ ] It makes no required network requests outside its own folder.
- [ ] No ads, tracking or data collection.
- [ ] Sound starts after the first interaction and can be muted.
- [ ] It pauses when the tab is hidden, and the console shows no errors.
- [ ] All assets are original or licensed for commercial use, and the game suits all ages.
