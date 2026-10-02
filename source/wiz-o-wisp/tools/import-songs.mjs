// Turns public-domain and CC BY score transcriptions (MIDI files in scores/, from the Mutopia
// Project) into the game's song files.
//   node tools/import-songs.mjs
// For each piece below it writes songs/<id>.json, which the game loads when the song is chosen,
// and lists them all in src/imported.js, the catalogue the song list is built from.
//
// The melody, one step per note, is the top line of the music: at each moment the highest note
// that starts, unless a higher melody note started just before and is still sounding (then it's
// an inner voice). It's taken across all the parts, so a tune that passes to the left hand (like
// the horns in Beethoven's Fifth) or from one violin to the next stays in the melody. Every other
// note becomes the accompaniment, played as written.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readMidi } from "./midi.mjs";
import { difficulty } from "../src/difficulty.js";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const MUTOPIA = "Score from the Mutopia Project";

// Each piece: its MIDI file, a title and credit, and optionally:
// - a tempo, either `bpm` (quarter notes a minute, for files that carry no real tempo) or
//   `speed` (a share of the file's own);
// - `melodyTracks`: the parts the melody is taken from ("all", or track numbers). By default it's
//   the first part, the upper staff of a piano or hymn score;
// - `takeover`: whether a new line starting under a held melody note takes over the melody after
//   a beat. Right for orchestral music, where the tune passes between instruments; wrong for piano
//   and hymn settings, where it would let inner voices in.
const PIECES = [
  {
    id: "beethoven-5",
    title: "Symphony No. 5",
    file: "beethoven_fifth_op67.mid",
    credit: `Beethoven, Symphony No. 5, first movement (piano reduction). ${MUTOPIA}, public domain.`,
    melodyTracks: [1, 2], // the horn call is in the left hand
    takeover: true,
    // The quickest notes come every 0.14 s at the score's tempo; at 0.8 of it they're playable,
    // and the game's tempo can follow a player all the way up to the real thing.
    speed: 0.8,
  },
  {
    id: "beethoven-7",
    title: "Symphony No. 7: Allegretto",
    file: "Symphony7_2.mid",
    credit: `Beethoven, Symphony No. 7, second movement. ${MUTOPIA}, public domain.`,
    melodyTracks: "all",
    takeover: true,
  },
  {
    id: "fur-elise",
    title: "Für Elise",
    file: "fur_Elise_WoO59.mid",
    credit: `Beethoven, Für Elise, WoO 59. ${MUTOPIA}, public domain.`,
    speed: 0.8,
  },
  {
    id: "ode-to-joy",
    title: "Ode to Joy",
    file: "ode.mid",
    credit: `Beethoven, Ode to Joy (from Symphony No. 9), hymn setting. ${MUTOPIA}, public domain.`,
  },
  {
    id: "eine-kleine",
    title: "Eine kleine Nachtmusik",
    file: "eine-kleine-nachtmusik-mvt1.mid",
    credit: `Mozart, Eine kleine Nachtmusik, K. 525, first movement. ${MUTOPIA}, public domain.`,
    speed: 0.7,
  },
  {
    id: "turkish-march",
    title: "Rondo alla Turca",
    file: "KV331_3_RondoAllaTurca.mid",
    credit: `Mozart, Piano Sonata K. 331, third movement. ${MUTOPIA}, public domain.`,
    bpm: 84,
  },
  {
    id: "minuet-in-g",
    title: "Minuet in G",
    file: "anna-magdalena-04.mid",
    credit: `Minuet in G, BWV Anh. 114, from the Notebook for Anna Magdalena Bach. ${MUTOPIA}, public domain.`,
    speed: 0.85,
  },
  {
    id: "prelude-in-c",
    title: "Prelude in C",
    file: "wtk1-prelude1.mid",
    credit: `Bach, Prelude in C major, BWV 846. ${MUTOPIA}, public domain.`,
    melodyTracks: [1, 2], // the broken chords run across both hands
  },
  {
    id: "toccata",
    title: "Toccata and Fugue in D Minor",
    file: "ToccataFugue.mid",
    credit: `Bach, Toccata and Fugue in D minor, BWV 565. ${MUTOPIA}, public domain.`,
    melodyTracks: "all",
  },
  {
    id: "canon-in-d",
    title: "Canon in D",
    file: "canon-3-violini/canon_per_3_violini_e_basso.mid",
    credit: `Pachelbel, Canon in D for three violins and basso continuo. ${MUTOPIA}, typeset by Michael Fischer v. Mollard, licensed CC BY 4.0.`,
    melodyTracks: "all", // the bass alone, then the violins as they enter
  },
  {
    id: "mountain-king",
    title: "In the Hall of the Mountain King",
    file: "Dans_l_antre_du_roi_de_la_montagne.mid",
    credit: `Grieg, In the Hall of the Mountain King, from Peer Gynt. ${MUTOPIA}, public domain.`,
    melodyTracks: [1, 2], // the theme starts low, in the left hand
    takeover: true,
  },
  {
    id: "the-entertainer",
    title: "The Entertainer",
    file: "entertainer.mid",
    credit: `Scott Joplin, The Entertainer. ${MUTOPIA}, public domain.`,
  },
  {
    id: "brahms-lullaby",
    title: "Brahms' Lullaby",
    file: "LullabyBrahms-C.mid",
    credit: `Brahms, Wiegenlied, Op. 49 No. 4. ${MUTOPIA}, public domain.`,
  },
  {
    id: "greensleeves",
    title: "Greensleeves",
    file: "greensleeves.mid",
    credit: `Greensleeves, traditional. ${MUTOPIA}, public domain.`,
    bpm: 84,
  },
  {
    id: "silent-night",
    title: "Silent Night",
    file: "stille_nacht.mid",
    credit: `Gruber, Silent Night. ${MUTOPIA}, public domain.`,
    bpm: 76,
  },
  {
    id: "joy-to-the-world",
    title: "Joy to the World",
    file: "antioch.mid",
    credit: `Joy to the World (the hymn tune Antioch, after Handel). ${MUTOPIA}, public domain.`,
    bpm: 90,
  },
  {
    id: "first-noel",
    title: "The First Noel",
    file: "first_noel.mid",
    credit: `The First Noel, traditional. ${MUTOPIA}, public domain.`,
    bpm: 96,
  },
  {
    id: "good-king-wenceslas",
    title: "Good King Wenceslas",
    file: "GoodKingWenceslas.mid",
    credit: `Good King Wenceslas, traditional. ${MUTOPIA}, public domain.`,
    speed: 0.9,
  },
];

const MIN_STEP_GAP = 0.12; // seconds, at the game's tempo: closer notes stay in the accompaniment

// The colour of the light for each bass note, matching the hand-written songs.
const ROOT_HUES = [40, 30, 20, 12, 5, 345, 332, 300, 310, 322, 290, 275];
const round = (n) => Math.round(n * 1000) / 1000;

function importPiece(piece, midi) {
  const notes = midi.tracks.flatMap((t) => t.notes.map((n) => Object.assign(n, { track: t.index })));
  notes.sort((a, b) => a.startTick - b.startTick || b.pitch - a.pitch);

  // Times run on one steady clock in beats of the file's first tempo, so tempo changes (a written
  // accelerando, say) come through as they sound. The game then plays it all at `bpm`.
  const fileBpm = 60e6 / midi.tempos[0].usPerBeat;
  const speed = piece.bpm ? piece.bpm / fileBpm : piece.speed ?? 1;
  const bpm = fileBpm * speed;
  const beatAt = (tick) => (midi.secondsAt(tick) * fileBpm) / 60;

  // The melody: the top line of the melody parts, as described at the top.
  const withNotes = midi.tracks.filter((t) => t.notes.length).map((t) => t.index);
  const melodyTracks = new Set(piece.melodyTracks === "all" ? withNotes : piece.melodyTracks || [withNotes[0]]);
  const onsets = new Map();
  for (const n of notes) {
    if (!melodyTracks.has(n.track)) continue;
    if (!onsets.has(n.startTick)) onsets.set(n.startTick, []);
    onsets.get(n.startTick).push(n);
  }
  // A held melody note keeps lower notes out while it sounds, or with `takeover` only for its
  // first beat: after that, a new line starting underneath it (the next entry of a theme, say)
  // takes over the melody.
  const melody = new Set();
  let current = null;
  for (const [tick, group] of [...onsets].sort((a, b) => a[0] - b[0])) {
    const top = group[0]; // highest first
    const holding = current && tick < current.endTick && (!piece.takeover || tick - current.startTick < midi.ppq);
    if (holding && top.pitch <= current.pitch) continue;
    melody.add(top);
    current = top;
  }
  // Notes too quick to tap after the one before (grace notes, trills, the odd flourish) are still
  // played, in the accompaniment, but aren't steps.
  let previous = null;
  for (const n of [...melody].sort((a, b) => a.startTick - b.startTick)) {
    if (previous && (midi.secondsAt(n.startTick) - midi.secondsAt(previous.startTick)) / speed < MIN_STEP_GAP) melody.delete(n);
    else previous = n;
  }

  // Bars, from the time signatures, for accents and for the light.
  const meters = midi.meters.length ? midi.meters : [{ tick: 0, numerator: 4, denominator: 4 }];
  const meterAt = (tick) => meters.filter((m) => m.tick <= tick).pop() || meters[0];
  const barTicks = (m) => m.numerator * midi.ppq * (4 / m.denominator);
  // A touch more weight on each bar's first beat, and a little on its middle.
  const velocityAt = (tick) => {
    const m = meterAt(tick);
    const into = (tick - m.tick) % barTicks(m);
    if (into === 0) return 0.68;
    if (m.numerator % 2 === 0 && into === barTicks(m) / 2) return 0.65;
    return 0.62;
  };

  const melodyNotes = notes
    .filter((n) => melody.has(n))
    .map((n) => [round(beatAt(n.startTick)), round(beatAt(n.endTick) - beatAt(n.startTick)), n.pitch, velocityAt(n.startTick)]);

  // The accompaniment: every other note, grouped by when it starts.
  const groups = new Map();
  for (const n of notes) {
    if (melody.has(n)) continue;
    if (!groups.has(n.startTick)) groups.set(n.startTick, []);
    groups.get(n.startTick).push(n);
  }
  const accompaniment = [...groups]
    .sort((a, b) => a[0] - b[0])
    .map(([tick, group]) => {
      const beat = beatAt(tick);
      const length = Math.max(...group.map((n) => beatAt(n.endTick) - beat));
      return [round(beat), round(length), group.map((n) => n.pitch)];
    });

  // The light follows the bass: one hue per bar, from the lowest note sounding as the bar starts.
  const lastTick = Math.max(...notes.map((n) => n.endTick));
  const chords = [];
  for (let tick = 0; tick < lastTick; ) {
    const m = meterAt(tick);
    const sounding = notes.filter((n) => n.startTick <= tick && n.endTick > tick);
    const starting = notes.filter((n) => n.startTick >= tick && n.startTick < tick + barTicks(m));
    const pool = sounding.length ? sounding : starting;
    if (pool.length) {
      const hue = ROOT_HUES[Math.min(...pool.map((n) => n.pitch)) % 12];
      if (!chords.length || chords[chords.length - 1][1] !== hue) chords.push([round(beatAt(tick)), hue]);
    }
    tick += barTicks(m);
  }

  return {
    id: piece.id,
    title: piece.title,
    credit: piece.credit,
    bpm: round(bpm),
    melody: melodyNotes,
    accompaniment,
    chords,
  };
}

const catalogue = [];
await mkdir(path.join(root, "songs"), { recursive: true });
for (const piece of PIECES) {
  const midi = readMidi(await readFile(path.join(root, "scores", piece.file)));
  const song = importPiece(piece, midi);
  await writeFile(path.join(root, "songs", `${piece.id}.json`), JSON.stringify(song));
  const asNotes = song.melody.map(([beat, beats, midi]) => ({ beat, beats, midi }));
  const pitches = new Set([...song.melody.map((m) => m[2]), ...song.accompaniment.flatMap((a) => a[2])]);
  catalogue.push({
    id: song.id,
    title: song.title,
    credit: song.credit,
    src: `songs/${song.id}.json`,
    difficulty: round(difficulty({ bpm: song.bpm, melody: asNotes })),
    notes: [...pitches].sort((a, b) => a - b),
  });
  const spb = 60 / song.bpm;
  const gaps = song.melody.slice(1).map((m, i) => (m[0] - song.melody[i][0]) * spb);
  const seconds = (song.melody[song.melody.length - 1][0] - song.melody[0][0]) * spb;
  console.log(
    `${song.id.padEnd(20)} ${String(song.melody.length).padStart(5)} steps  ${String(Math.round(seconds)).padStart(4)} s at ${String(Math.round(song.bpm)).padStart(3)} bpm  quickest ${Math.min(...gaps).toFixed(2)} s  under 0.17 s: ${gaps.filter((g) => g < 0.17).length}`
  );
}

await writeFile(
  path.join(root, "src", "imported.js"),
  `// Songs imported from public-domain and CC BY scores by tools/import-songs.mjs. Generated: don't\n` +
    `// edit. Each one's notes are in its src file, loaded when the song is chosen.\n` +
    `export const IMPORTED = ${JSON.stringify(catalogue, null, 2)};\n`
);
console.log(`wrote src/imported.js with ${catalogue.length} songs`);
