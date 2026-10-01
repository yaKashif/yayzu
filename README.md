# Yayzu

Free browser games you can play instantly, at [yayzu.com](https://yayzu.com).

A static site served by GitHub Pages: plain HTML and CSS, no build step for the site itself.

- `index.html` is the home page and game grid.
- `<game>/index.html` is each game's page: the game embedded at the top, then its guide.
- `games/<game>/` holds each playable game build.

## Games

| Game | Page | Source |
| --- | --- | --- |
| Boulder Bear | [/boulder-bear/](https://yayzu.com/boulder-bear/) | Built from the `boulder-bear` project with `npm run publish:yayzu`, which bundles the game and three.js into `games/boulder-bear/`. |

## Local preview

Serve the folder with any static server, for example `npx serve .`, and open the printed address.
