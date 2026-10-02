// The songs. Every melody note becomes one step for the wisp. Times are in beats of each song's
// own beat: a quarter note, or an eighth in 6/8 and 3/8. Only well-known traditional tunes and
// classics, all in the public domain; the accompaniments are written for this game.
//
// SONGS lists them easiest first: Twinkle Twinkle to start, then everything else in order of how
// hard it measures (see difficulty).

import { difficulty } from "./difficulty.js";
import { IMPORTED } from "./imported.js";

const PITCH = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const mod12 = (n) => ((n % 12) + 12) % 12;

// "C5", "F#4", "Bb3" -> MIDI note number (middle C, C4, is 60).
export function midiOf(name) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) throw new Error(`songs: bad note name ${name}`);
  return 12 * (Number(m[3]) + 1) + PITCH[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
}

// "1", "0.5", "1/3" -> beats.
const lengthOf = (text) => (text.includes("/") ? Number(text.split("/")[0]) / Number(text.split("/")[1]) : Number(text));

// Notes as "name:beats" tokens: one beat when the length is left out, "r" for a rest, and "+12"
// (or any "+n"/"-n") to shift every later note by that many semitones. The "|" bar lines are only
// there to make the tunes readable.
function parseNotes(text) {
  const notes = [];
  let beat = 0;
  let shift = 0;
  for (const token of text.trim().split(/\s+/)) {
    if (token === "|") continue;
    if (/^[+-]\d+$/.test(token)) {
      shift = Number(token);
      continue;
    }
    const [name, length = "1"] = token.split(":");
    const beats = lengthOf(length);
    if (name !== "r") notes.push({ beat, beats, midi: midiOf(name) + shift });
    beat += beats;
  }
  return notes;
}

// "C", "Am", "F#m", "Bb" -> the key's home note (0 to 11) and whether it's minor.
function keyOf(name) {
  const m = /^([A-G])([#b]?)(m?)$/.exec(name);
  if (!m) throw new Error(`songs: bad key ${name}`);
  return { tonic: mod12(PITCH[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0)), minor: !!m[3] };
}

// The colour of the light for each chord root: golds and peaches round C, roses round F, lilacs
// round G and B. Minor chords are a shade cooler.
const ROOT_HUES = [40, 30, 20, 12, 5, 345, 332, 300, 310, 322, 290, 275];

// "C", "Am", "G7", "D7", "C#": a bass note, a soft two-note chord above it, and a hue.
function chordOf(name) {
  const m = /^([A-G])([#b]?)(m?)(7?)$/.exec(name);
  if (!m) throw new Error(`songs: bad chord ${name}`);
  const root = mod12(PITCH[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0));
  const third = m[3] ? 3 : 4;
  const seventh = m[4] ? 10 : null;
  const bass = 40 + mod12(root - 4); // E2 up to D#3
  const above = (interval) => {
    let n = bass + interval;
    while (n < 55) n += 12; // from G3 up
    return n;
  };
  return {
    hue: (ROOT_HUES[root] - (m[3] ? 12 : 0) + 360) % 360,
    bass,
    third,
    upper: [above(third), above(seventh ?? 7)],
  };
}

// Chord names, each lasting `chordBeats` unless given a ":beats" length.
function parseHarmony(text, chordBeats) {
  const chords = [];
  let beat = 0;
  for (const token of text.trim().split(/\s+/)) {
    if (token === "|") continue;
    const [name, length] = token.split(":");
    const beats = length ? lengthOf(length) : chordBeats;
    chords.push({ beat, beats, name });
    beat += beats;
  }
  return chords;
}

// ---------- Harmonizing ----------
// Songs without written-out chords get them chosen here, a bar (or half a bar) at a time: the
// chord of the key whose notes best cover the melody there, with a lean toward the home chord
// and the chords either side of it, and toward keeping the chord already playing.
const QUALITIES = { "": [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10] };
const KEY_CHORDS = {
  // [steps above the home note, quality, how much it's favoured]
  major: [[0, "", 0.35], [7, "", 0.25], [5, "", 0.15], [9, "m", 0], [2, "m", 0], [7, "7", 0.05], [4, "m", -0.1]],
  minor: [[0, "m", 0.35], [7, "", 0.25], [5, "m", 0.15], [8, "", 0], [3, "", 0], [10, "", -0.05], [7, "7", 0.05]],
};

function harmonize(notes, key, bar, pickup) {
  const options = KEY_CHORDS[key.minor ? "minor" : "major"].map(([step, quality, favour]) => {
    const root = mod12(key.tonic + step);
    return { name: NAMES[root] + quality, root, favour, tones: QUALITIES[quality].map((t) => mod12(root + t)) };
  });
  const home = options[0];
  const end = Math.max(...notes.map((n) => n.beat + n.beats));
  const fit = (chord, from, to) => {
    let score = 0;
    for (const n of notes) {
      const overlap = Math.min(n.beat + n.beats, to) - Math.max(n.beat, from);
      if (overlap <= 0) continue;
      const onDownbeat = Math.abs(n.beat - from) < 1e-6;
      const pc = mod12(n.midi);
      if (chord.tones.includes(pc)) score += overlap * (onDownbeat ? 1.6 : 1) * (pc === chord.root ? 1.25 : 1);
      else score -= overlap * (onDownbeat ? 1.3 : 0.45);
    }
    return score / (to - from) + chord.favour;
  };
  const best = (from, to, previous) => {
    let top = null;
    for (const chord of options) {
      const score = fit(chord, from, to) + (chord === previous ? 0.1 : 0);
      if (!top || score > top.score) top = { chord, score };
    }
    return top;
  };
  const chords = [];
  let previous = home;
  if (pickup > 0) chords.push({ beat: 0, beats: pickup, name: home.name });
  for (let start = pickup; start < end - 1e-6; start += bar) {
    const stop = Math.min(start + bar, end);
    const whole = best(start, stop, previous);
    let picks = [{ beat: start, beats: stop - start, chord: whole.chord }];
    const half = bar / 2;
    if (bar % 2 === 0 && stop - start === bar) {
      const first = best(start, start + half, previous);
      const second = best(start + half, stop, first.chord);
      if ((first.score + second.score) / 2 > whole.score + 0.35) {
        picks = [
          { beat: start, beats: half, chord: first.chord },
          { beat: start + half, beats: half, chord: second.chord },
        ];
      }
    }
    for (const pick of picks) {
      chords.push({ beat: pick.beat, beats: pick.beats, name: pick.chord.name });
      previous = pick.chord;
    }
  }
  // Finish at home when the last note allows it.
  if (home.tones.includes(mod12(notes[notes.length - 1].midi))) chords[chords.length - 1].name = home.name;
  return chords;
}

// ---------- Building songs ----------
// How the accompaniment plays each chord: [beat, "bass" or "upper"] hits, repeated every `every`
// beats for as long as the chord lasts.
const PATTERNS = {
  two: { every: 2, hits: [[0, "bass"], [1, "upper"]] },
  minuet: { every: 3, hits: [[0, "bass"], [1, "upper"]] },
  lilt: { every: 3, hits: [[0, "bass"], [2, "upper"]] }, // 6/8, counted in eighths
};

// Builds a song from its spec. `melody` is notes text (or already-parsed notes). `harmony` is
// chord names; without it the chords are chosen to suit the melody in `key`. The accompaniment
// comes from the chords and a pattern to suit the bar, unless the song writes out its own left
// hand in `left`, or is `solo` and has none.
function build(spec) {
  const { id, title, bpm, bar, pickup = 0, key, melody, harmony, chordBeats = bar, left, solo = false } = spec;
  const notes = typeof melody === "string" ? parseNotes(melody) : melody;
  const keyInfo = keyOf(key);
  const chordList = (harmony ? parseHarmony(harmony, chordBeats) : harmonize(notes, keyInfo, bar, pickup)).map((c) => ({
    ...c,
    ...chordOf(c.name),
  }));
  const pattern = spec.pattern || (bar === 6 ? PATTERNS.lilt : bar === 3 ? PATTERNS.minuet : PATTERNS.two);
  let accompaniment = [];
  if (left) accompaniment = parseNotes(left).map((n) => ({ beat: n.beat, notes: [n.midi], velocity: 0.4 }));
  else if (!solo) {
    accompaniment = chordList.flatMap((c) => {
      const hits = [];
      for (let start = c.beat; start < c.beat + c.beats - 1e-6; start += pattern.every) {
        for (const [offset, part] of pattern.hits) {
          if (start + offset >= c.beat + c.beats - 1e-6) continue;
          const isBass = part === "bass";
          hits.push({ beat: start + offset, notes: isBass ? [c.bass] : c.upper, velocity: isBass ? 0.42 : 0.3 });
        }
      }
      return hits;
    });
  }
  const last = chordList[chordList.length - 1];
  return {
    id,
    title,
    bpm,
    bar,
    pickup,
    key: keyInfo,
    spec,
    melody: notes,
    chords: chordList.map((c) => ({ beat: c.beat, hue: c.hue })),
    accompaniment,
    // A rolled chord, low to high, once the last note has rung out.
    ending: [0, 12, 19, 24, 24 + last.third, 31, 36].map((n) => last.bass - 12 + n),
  };
}

// ---------- The tunes ----------
const repeat = (text, times) => Array(times).fill(text.trim()).join(" | ");

const TUNES = [
  {
    id: "twinkle",
    title: "Twinkle Twinkle Little Star",
    key: "C",
    bpm: 92,
    bar: 4,
    chordBeats: 2,
    melody: `
      C5 C5 G5 G5 | A5 A5 G5:2 | F5 F5 E5 E5 | D5 D5 C5:2 |
      G5 G5 F5 F5 | E5 E5 D5:2 | G5 G5 F5 F5 | E5 E5 D5:2 |
      C5 C5 G5 G5 | A5 A5 G5:2 | F5 F5 E5 E5 | D5 D5 C5:2`,
    harmony: "C C | F C | F C | G C | C F | C G | C F | C G | C C | F C | F C | G C",
  },
  {
    id: "mary",
    title: "Mary Had a Little Lamb",
    key: "C",
    bpm: 100,
    bar: 4,
    melody: `
      E5 D5 C5 D5 | E5 E5 E5:2 | D5 D5 D5:2 | E5 G5 G5:2 |
      E5 D5 C5 D5 | E5 E5 E5 E5 | D5 D5 E5 D5 | C5:4`,
    harmony: "C | C | G | C | C | C | G | C",
  },
  {
    id: "old-macdonald",
    title: "Old MacDonald Had a Farm",
    key: "C",
    bpm: 104,
    bar: 4,
    melody: `
      C5 C5 C5 G4 | A4 A4 G4:2 | E5 E5 D5 D5 | C5:3 G4 |
      C5 C5 C5 G4 | A4 A4 G4:2 | E5 E5 D5 D5 | C5:4`,
    harmony: "C | F:2 C:2 | C:2 G:2 | C | C | F:2 C:2 | C:2 G:2 | C",
  },
  {
    id: "frere-jacques",
    title: "Frère Jacques",
    key: "C",
    bpm: 104,
    bar: 4,
    melody: `
      C5 D5 E5 C5 | C5 D5 E5 C5 | E5 F5 G5:2 | E5 F5 G5:2 |
      G5:0.5 A5:0.5 G5:0.5 F5:0.5 E5 C5 | G5:0.5 A5:0.5 G5:0.5 F5:0.5 E5 C5 |
      C5 G4 C5:2 | C5 G4 C5:2`,
    harmony: "C | Am | C | Am | C | F | C:1 G:1 C:2 | C:1 G:1 C:2",
  },
  {
    id: "london-bridge",
    title: "London Bridge Is Falling Down",
    key: "C",
    bpm: 108,
    bar: 4,
    melody: `
      G5:1.5 A5:0.5 G5 F5 | E5 F5 G5:2 | D5 E5 F5:2 | E5 F5 G5:2 |
      G5:1.5 A5:0.5 G5 F5 | E5 F5 G5:2 | D5:2 G5:2 | E5 C5:3`,
    harmony: "C | C | G7 | C | C | C | G7 | C",
  },
  {
    id: "jingle-bells",
    title: "Jingle Bells",
    key: "C",
    bpm: 120,
    bar: 4,
    melody: `
      E5 E5 E5:2 | E5 E5 E5:2 | E5 G5 C5:1.5 D5:0.5 | E5:4 |
      F5 F5 F5:1.5 F5:0.5 | F5 E5 E5 E5:0.5 E5:0.5 | E5 D5 D5 E5 | D5:2 G5:2 |
      E5 E5 E5:2 | E5 E5 E5:2 | E5 G5 C5:1.5 D5:0.5 | E5:4 |
      F5 F5 F5 F5 | F5 E5 E5 E5:0.5 E5:0.5 | G5 G5 F5 D5 | C5:4`,
    harmony: "C | C | C | C | F | C | D7 | G7 | C | C | C | C | F | C | G7 | C",
  },
  {
    id: "auld-lang-syne",
    title: "Auld Lang Syne",
    key: "F",
    bpm: 84,
    bar: 4,
    pickup: 1,
    melody: `
      C5 |
      F5:1.5 E5:0.5 F5 A5 | G5:1.5 F5:0.5 G5 A5 | F5:1.5 F5:0.5 A5 C6 | D6:3 D6 |
      C6:1.5 A5:0.5 A5 F5 | G5:1.5 F5:0.5 G5 A5 | F5:1.5 D5:0.5 D5 C5 | F5:3 C5 |
      F5:1.5 E5:0.5 F5 A5 | G5:1.5 F5:0.5 G5 A5 | F5:1.5 F5:0.5 A5 C6 | D6:3 D6 |
      C6:1.5 A5:0.5 A5 F5 | G5:1.5 F5:0.5 G5 A5 | F5:1.5 D5:0.5 D5 C5 | F5:4`,
  },
  {
    id: "deck-the-halls",
    title: "Deck the Halls",
    key: "C",
    bpm: 112,
    bar: 4,
    melody: `
      G5:1.5 F5:0.5 E5 D5 | C5 D5 E5 C5 | D5:0.5 E5:0.5 F5:0.5 D5:0.5 E5:1.5 D5:0.5 | C5 B4 C5:2 |
      G5:1.5 F5:0.5 E5 D5 | C5 D5 E5 C5 | D5:0.5 E5:0.5 F5:0.5 D5:0.5 E5:1.5 D5:0.5 | C5 B4 C5:2 |
      D5:1.5 E5:0.5 F5 D5 | E5:1.5 F5:0.5 G5 D5 | E5:0.5 F#5:0.5 G5 A5:0.5 B5:0.5 C6 | B5 A5 G5:2 |
      G5:1.5 F5:0.5 E5 D5 | C5 D5 E5 C5 | A5:0.5 A5:0.5 A5:0.5 A5:0.5 G5:1.5 F5:0.5 | E5 D5 C5:2`,
  },
  {
    id: "we-wish-you",
    title: "We Wish You a Merry Christmas",
    key: "C",
    bpm: 132,
    bar: 3,
    pickup: 1,
    melody: `
      G4 |
      C5 C5:0.5 D5:0.5 C5:0.5 B4:0.5 | A4 A4 A4 | D5 D5:0.5 E5:0.5 D5:0.5 C5:0.5 | B4 G4 G4 |
      E5 E5:0.5 F5:0.5 E5:0.5 D5:0.5 | C5 A4 G4:0.5 G4:0.5 | A4 D5 B4 | C5:2 G4 |
      C5 C5:0.5 D5:0.5 C5:0.5 B4:0.5 | A4 A4 A4 | D5 D5:0.5 E5:0.5 D5:0.5 C5:0.5 | B4 G4 G4 |
      E5 E5:0.5 F5:0.5 E5:0.5 D5:0.5 | C5 A4 G4:0.5 G4:0.5 | A4 D5 B4 | C5:3`,
  },
  {
    id: "hark-the-herald",
    title: "Hark! The Herald Angels Sing",
    key: "C",
    bpm: 100,
    bar: 4,
    melody: `
      G4 C5 C5:1.5 B4:0.5 | C5 E5 E5 D5 | G5 G5 G5:1.5 F5:0.5 | E5 D5 E5:2 |
      G4 C5 C5:1.5 B4:0.5 | C5 E5 E5 D5 | G5 D5 D5:1.5 B4:0.5 | B4 A4 G4:2 |
      G5 G5 G5 C5 | F5 E5 E5 D5 | G5 G5 G5 C5 | F5 E5 E5 D5 |
      A5 A5 A5 G5 | F5 E5 F5:2 | D5 E5:0.5 F5:0.5 G5:1.5 C5:0.5 | C5 D5 E5:2 |
      A5:1.5 A5:0.5 A5 G5 | F5 E5 F5:2 | D5 E5:0.5 F5:0.5 G5:1.5 C5:0.5 | C5 D5 C5:2`,
  },
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    key: "F",
    bpm: 80,
    bar: 3,
    pickup: 1,
    melody: `
      C5 |
      F5:2 A5:0.5 F5:0.5 | A5:2 G5 | F5:2 D5 | C5:2 C5 |
      F5:2 A5:0.5 F5:0.5 | A5:2 G5 | C6:3 | r:2 A5 |
      C6:2 A5:0.5 F5:0.5 | A5:2 G5 | F5:2 D5 | C5:2 C5 |
      F5:2 A5:0.5 F5:0.5 | A5:2 G5 | F5:2`,
  },
  {
    id: "happy-birthday",
    title: "Happy Birthday",
    key: "C",
    bpm: 100,
    bar: 3,
    pickup: 1,
    melody: `
      G4:0.75 G4:0.25 |
      A4 G4 C5 | B4:2 G4:0.75 G4:0.25 | A4 G4 D5 | C5:2 G4:0.75 G4:0.25 |
      G5 E5 C5 | B4 A4 F5:0.75 F5:0.25 | E5 C5 D5 | C5:2`,
  },
  {
    id: "oh-susanna",
    title: "Oh! Susanna",
    key: "C",
    bpm: 120,
    bar: 4,
    pickup: 1,
    melody: `
      C5:0.5 D5:0.5 |
      E5 G5 G5:1.5 A5:0.5 | G5 E5 C5:1.5 D5:0.5 | E5 E5 D5 C5 | D5:3 C5:0.5 D5:0.5 |
      E5 G5 G5:1.5 A5:0.5 | G5 E5 C5:1.5 D5:0.5 | E5 E5 D5 D5 | C5:3 r |
      F5:2 F5:2 | A5 A5:2 A5 | G5 G5 E5 C5 | D5:3 C5:0.5 D5:0.5 |
      E5 G5 G5:1.5 A5:0.5 | G5 E5 C5:1.5 D5:0.5 | E5 E5 D5 D5 | C5:3`,
  },
  {
    id: "my-bonnie",
    title: "My Bonnie Lies Over the Ocean",
    key: "C",
    bpm: 132,
    bar: 3,
    pickup: 1,
    melody: `
      G4 |
      E5 D5 C5 | D5 C5 A4 | G4 E4:2 | r:2 G4 | E5 D5 C5 | C5 B4 C5 | D5:3 | r:2 G4 |
      E5 D5 C5 | D5 C5 A4 | G4 E4:2 | r:2 G4 | A4 D5 C5 | B4 A4 B4 | C5:3`,
  },
  {
    id: "drunken-sailor",
    title: "Drunken Sailor",
    key: "Dm",
    bpm: 120,
    bar: 4,
    melody: `
      A5 A5:0.5 A5:0.5 A5 A5:0.5 A5:0.5 | A5 D5 F5 A5 | G5 G5:0.5 G5:0.5 G5 G5:0.5 G5:0.5 | G5 C5 E5 G5 |
      A5 A5:0.5 A5:0.5 A5 A5:0.5 A5:0.5 | A5 B5 C6 D6 | C6 A5 G5 E5 | D5:2 D5:2 |
      A5:2 A5:2 | A5 D5 F5 A5 | G5:2 G5:2 | G5 C5 E5 G5 |
      A5:2 A5:2 | A5 B5 C6 D6 | C6 A5 G5 E5 | D5:2 D5:2`,
  },
  {
    id: "korobeiniki",
    title: "Korobeiniki",
    key: "Am",
    bpm: 120,
    bar: 4,
    melody: repeat(
      `E5 B4:0.5 C5:0.5 D5 C5:0.5 B4:0.5 | A4 A4:0.5 C5:0.5 E5 D5:0.5 C5:0.5 | B4:1.5 C5:0.5 D5 E5 | C5 A4 A4:2 |
       r:0.5 D5 F5:0.5 A5 G5:0.5 F5:0.5 | E5:1.5 C5:0.5 E5 D5:0.5 C5:0.5 | B4 B4:0.5 C5:0.5 D5 E5 | C5 A4 A4:2`,
      2
    ),
  },
  {
    id: "daisy-bell",
    title: "Daisy Bell",
    key: "C",
    bpm: 160,
    bar: 3,
    melody: `
      G5:3 | E5:3 | C5:3 | G4:3 | A4 B4 C5 | A4:2 C5 | G4:3 | r:3 |
      D5:3 | G5:3 | E5:3 | C5:3 | A4 B4 C5 | D5:2 E5 | D5:3 | r:3 |
      G5:3 | E5:3 | C5:3 | G4:3 | A4 B4 C5 | A4:2 C5 | G4:3 | r:3 |
      D5:3 | G5:3 | E5:3 | C5:3 | A4 B4 C5 | D5:2 E5 | D5:3`,
  },
];

const BASES = Object.fromEntries(TUNES.map((spec) => [spec.id, build(spec)]));

// Twinkle Twinkle first, as where everyone starts, then everything else easiest first: the tunes
// written out here, and the pieces imported from scores (which arrive without their notes; see
// loadSong).
for (const song of Object.values(BASES)) song.difficulty = difficulty(song);
const ordered = [...Object.values(BASES), ...IMPORTED.map((entry) => ({ ...entry }))]
  .filter((s) => s.id !== "twinkle")
  .sort((a, b) => a.difficulty - b.difficulty);
export const SONGS = [BASES.twinkle, ...ordered].map((song, i, all) => ({ ...song, level: 1 + Math.floor((i * 5) / all.length) }));

// The tune specs, for checking them.
export const TUNE_SPECS = TUNES;

// Every note a song plays, melody first, so the piano knows which recordings to fetch first. An
// imported piece not loaded yet lists its notes in the catalogue.
export function songNotes(song) {
  if (!song.melody) return song.notes;
  return [...song.melody.map((n) => n.midi), ...song.accompaniment.flatMap((a) => a.notes), ...song.ending];
}

// Fetches an imported piece's notes the first time it's needed. Its accompaniment is the score's
// own: each chord held as long as written.
const loading = new Map();
export function loadSong(song) {
  if (song.melody) return Promise.resolve(song);
  if (!loading.has(song.id)) {
    const url = new URL(song.src, document.baseURI);
    loading.set(
      song.id,
      fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`songs: ${url} answered ${res.status}`);
          return res.json();
        })
        .then((data) => {
          Object.assign(song, {
            bpm: data.bpm,
            credit: data.credit,
            // Each note's velocity carries the score's accents: a little more on strong beats.
            melody: data.melody.map(([beat, beats, midi, velocity]) => ({ beat, beats, midi, velocity })),
            accompaniment: data.accompaniment.map(([beat, beats, notes]) => ({
              beat,
              beats,
              notes,
              velocity: 0.4 / (1 + 0.15 * (notes.length - 1)),
            })),
            chords: data.chords.map(([beat, hue]) => ({ beat, hue })),
            ending: [], // the score ends with its own chord
          });
          return song;
        })
        .catch((error) => {
          loading.delete(song.id); // let a later try fetch it again
          throw error;
        })
    );
  }
  return loading.get(song.id);
}
