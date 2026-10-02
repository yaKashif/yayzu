// The songs. Every melody note becomes one step for the wisp. Times are in beats of each song's
// own beat: a quarter note, or an eighth in 6/8 and 3/8. Only well-known traditional tunes and
// classics, all in the public domain; the accompaniments are written for this game.
//
// SONGS lists them easiest first: Twinkle Twinkle to start, then everything else in order of how
// hard it measures (see difficulty).

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

const MOUNTAIN_KING = `
  B4:0.5 C#5:0.5 D5:0.5 E5:0.5 F#5:0.5 D5:0.5 F#5 | E#5:0.5 C#5:0.5 E#5 E5:0.5 C5:0.5 E5 |
  B4:0.5 C#5:0.5 D5:0.5 E5:0.5 F#5:0.5 D5:0.5 F#5:0.5 B5:0.5 | A5:0.5 F#5:0.5 D5:0.5 F#5:0.5 A5:2 |`;

const ELISE = `
  E5:0.5 D#5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 | A4:1.5 C4:0.5 E4:0.5 A4:0.5 |
  B4:1.5 E4:0.5 G#4:0.5 B4:0.5 | C5:1.5 E4:0.5 E5:0.5 D#5:0.5 |
  E5:0.5 D#5:0.5 E5:0.5 B4:0.5 D5:0.5 C5:0.5 | A4:1.5 C4:0.5 E4:0.5 A4:0.5 |
  B4:1.5 E4:0.5 C5:0.5 B4:0.5 |`;
const ELISE_LEFT = `
  r:3 | A2:0.5 E3:0.5 A3:0.5 r:1.5 | E2:0.5 E3:0.5 G#3:0.5 r:1.5 | A2:0.5 E3:0.5 A3:0.5 r:1.5 |
  r:3 | A2:0.5 E3:0.5 A3:0.5 r:1.5 | E2:0.5 E3:0.5 G#3:0.5 r:1.5 | A2:0.5 E3:0.5 A3:0.5 r:1.5 |`;

// Bach's Prelude in C: each bar one chord, broken the same way twice.
const PRELUDE = [
  ["C4", "E4", "G4", "C5", "E5"],
  ["C4", "D4", "A4", "D5", "F5"],
  ["B3", "D4", "G4", "D5", "F5"],
  ["C4", "E4", "G4", "C5", "E5"],
  ["C4", "E4", "A4", "E5", "A5"],
  ["C4", "D4", "F#4", "A4", "D5"],
  ["B3", "D4", "G4", "D5", "G5"],
  ["B3", "C4", "E4", "G4", "C5"],
  ["C4", "E4", "G4", "C5", "E5"],
]
  .map(([a, b, c, d, e]) => repeat(`${a}:0.25 ${b}:0.25 ${c}:0.25 ${d}:0.25 ${e}:0.25 ${c}:0.25 ${d}:0.25 ${e}:0.25`, 2).replace(" | ", " "))
  .join(" | ");

// The Moonlight Sonata's opening: broken chords in triplets.
const triplets = (a, b, c, times) => Array(times).fill(`${a}:1/3 ${b}:1/3 ${c}:1/3`).join(" ");
const MOONLIGHT = [
  triplets("G#3", "C#4", "E4", 4),
  `${triplets("A3", "C#4", "E4", 2)} ${triplets("A3", "D4", "F#4", 2)}`,
  `${triplets("G#3", "B#3", "F#4", 1)} ${triplets("G#3", "C#4", "E4", 1)} ${triplets("G#3", "C#4", "D#4", 1)} ${triplets("F#3", "B#3", "D#4", 1)}`,
  triplets("G#3", "C#4", "E4", 4),
].join(" | ");

const BUMBLEBEE = "E5:0.25 D#5:0.25 D5:0.25 C#5:0.25 C5:0.25 F5:0.25 E5:0.25 D#5:0.25 E5:0.25 D#5:0.25 D5:0.25 C#5:0.25 C5:0.25 C#5:0.25 D5:0.25 D#5:0.25";
const CAROL = "Bb5 A5:0.5 Bb5:0.5 G5";

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
    id: "ode-to-joy",
    title: "Ode to Joy",
    key: "C",
    bpm: 112,
    bar: 4,
    melody: `
      E5 E5 F5 G5 | G5 F5 E5 D5 | C5 C5 D5 E5 | E5:1.5 D5:0.5 D5:2 |
      E5 E5 F5 G5 | G5 F5 E5 D5 | C5 C5 D5 E5 | D5:1.5 C5:0.5 C5:2 |
      D5 D5 E5 C5 | D5 E5:0.5 F5:0.5 E5 C5 | D5 E5:0.5 F5:0.5 E5 D5 | C5 D5 G4:2 |
      E5 E5 F5 G5 | G5 F5 E5 D5 | C5 C5 D5 E5 | D5:1.5 C5:0.5 C5:2`,
    harmony: `
      C | G | C | G | C | G | C | G:2 C:2 |
      G:2 C:2 | G:2 C:2 | G:2 C:2 | C:2 G:2 |
      C | G | C | G:2 C:2`,
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
    id: "greensleeves",
    title: "Greensleeves",
    key: "Am",
    bpm: 150, // eighth notes
    bar: 6,
    pickup: 1,
    melody: `
      A4 |
      C5:2 D5 E5:1.5 F5:0.5 E5 | D5:2 B4 G4:1.5 A4:0.5 B4 | C5:2 A4 A4:1.5 G#4:0.5 A4 | B4:2 G#4 E4:2 A4 |
      C5:2 D5 E5:1.5 F5:0.5 E5 | D5:2 B4 G4:1.5 A4:0.5 B4 | C5:1.5 B4:0.5 A4 G#4:1.5 F#4:0.5 G#4 | A4:6 |
      G5:3 G5:1.5 F#5:0.5 E5 | D5:2 B4 G4:1.5 A4:0.5 B4 | C5:2 A4 A4:1.5 G#4:0.5 A4 | B4:2 G#4 E4:3 |
      G5:3 G5:1.5 F#5:0.5 E5 | D5:2 B4 G4:1.5 A4:0.5 B4 | C5:1.5 B4:0.5 A4 G#4:1.5 F#4:0.5 G#4 | A4:6`,
    harmony: `
      Am:7 | G:6 | Am:6 | E:6 | Am:6 | G:6 | Am:3 E:3 | Am:6 |
      C:6 | G:6 | Am:6 | E:6 | C:6 | G:6 | Am:3 E:3 | Am:6`,
  },
  {
    id: "minuet-in-g",
    title: "Minuet in G",
    key: "G",
    bpm: 116,
    bar: 3,
    melody: `
      D5 G4:0.5 A4:0.5 B4:0.5 C5:0.5 | D5 G4 G4 | E5 C5:0.5 D5:0.5 E5:0.5 F#5:0.5 | G5 G4 G4 |
      C5 D5:0.5 C5:0.5 B4:0.5 A4:0.5 | B4 C5:0.5 B4:0.5 A4:0.5 G4:0.5 | F#4 G4:0.5 A4:0.5 B4:0.5 G4:0.5 | A4:3 |
      D5 G4:0.5 A4:0.5 B4:0.5 C5:0.5 | D5 G4 G4 | E5 C5:0.5 D5:0.5 E5:0.5 F#5:0.5 | G5 G4 G4 |
      C5 D5:0.5 C5:0.5 B4:0.5 A4:0.5 | B4 C5:0.5 B4:0.5 A4:0.5 G4:0.5 | A4 B4:0.5 A4:0.5 G4:0.5 F#4:0.5 | G4:3`,
    harmony: "G | G | C | G | C | G | D7 | D | G | G | C | G | C | G | D7 | G",
  },
  {
    id: "mountain-king",
    title: "In the Hall of the Mountain King",
    key: "Bm",
    bpm: 132,
    bar: 4,
    // The theme four times, climbing an octave halfway, and home to B.
    melody: `${MOUNTAIN_KING} ${MOUNTAIN_KING} +12 ${MOUNTAIN_KING} ${MOUNTAIN_KING} +0 B5:4`,
    harmony: `
      Bm | C#:2 C:2 | Bm | D | Bm | C#:2 C:2 | Bm | D |
      Bm | C#:2 C:2 | Bm | D | Bm | C#:2 C:2 | Bm | D | Bm`,
  },
  {
    id: "fur-elise",
    title: "Für Elise",
    key: "Am",
    bpm: 126, // eighth notes
    bar: 3,
    pickup: 1,
    melody: `E5:0.5 D#5:0.5 | ${ELISE} A4:2 E5:0.5 D#5:0.5 | ${ELISE} A4:3`,
    left: `r:1 | ${ELISE_LEFT} ${ELISE_LEFT}`,
    harmony: `
      E:4 | Am:3 | E:3 | Am:3 | E:3 | Am:3 | E:3 | Am:3 |
      E:3 | Am:3 | E:3 | Am:3 | E:3 | Am:3 | E:3 | Am:3`,
  },
  {
    id: "hot-cross-buns",
    title: "Hot Cross Buns",
    key: "C",
    bpm: 96,
    bar: 4,
    melody: repeat(
      `E5 D5 C5:2 | E5 D5 C5:2 | C5:0.5 C5:0.5 C5:0.5 C5:0.5 D5:0.5 D5:0.5 D5:0.5 D5:0.5 | E5 D5 C5:2`,
      2
    ),
  },
  {
    id: "au-clair",
    title: "Au Clair de la Lune",
    key: "C",
    bpm: 100,
    bar: 4,
    melody: `
      C5 C5 C5 D5 | E5:2 D5:2 | C5 E5 D5 D5 | C5:4 |
      C5 C5 C5 D5 | E5:2 D5:2 | C5 E5 D5 D5 | C5:4 |
      D5 D5 D5 D5 | A4:2 A4:2 | D5 C5 B4 A4 | G4:4 |
      C5 C5 C5 D5 | E5:2 D5:2 | C5 E5 D5 D5 | C5:4`,
  },
  {
    id: "row-your-boat",
    title: "Row, Row, Row Your Boat",
    key: "C",
    bpm: 180, // eighth notes
    bar: 6,
    melody: `
      C5:3 C5:3 | C5:2 D5 E5:3 | E5:2 D5 E5:2 F5 | G5:6 |
      C6 C6 C6 G5 G5 G5 | E5 E5 E5 C5 C5 C5 | G5:2 F5 E5:2 D5 | C5:6`,
  },
  {
    id: "yankee-doodle",
    title: "Yankee Doodle",
    key: "C",
    bpm: 120,
    bar: 4,
    melody: `
      C5 C5 D5 E5 | C5 E5 D5 G4 | C5 C5 D5 E5 | C5:2 B4:2 |
      C5 C5 D5 E5 | F5 E5 D5 C5 | B4 G4 A4 B4 | C5:2 C5:2 |
      A4:1.5 B4:0.5 A4 G4 | A4 B4 C5:2 | G4:1.5 A4:0.5 G4 F4 | E4:2 G4:2 |
      A4:1.5 B4:0.5 A4 G4 | A4 B4 C5 A4 | G4 C5 B4 D5 | C5:2 C5:2`,
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
    id: "silent-night",
    title: "Silent Night",
    key: "C",
    bpm: 150, // eighth notes
    bar: 6,
    melody: `
      G4:3 A4 G4:2 | E4:6 | G4:3 A4 G4:2 | E4:6 | D5:4 D5:2 | B4:6 | C5:4 C5:2 | G4:6 |
      A4:4 A4:2 | C5:3 B4 A4:2 | G4:3 A4 G4:2 | E4:6 | A4:4 A4:2 | C5:3 B4 A4:2 | G4:3 A4 G4:2 | E4:6 |
      D5:4 D5:2 | F5:3 D5 B4:2 | C5:6 | E5:6 | C5:3 G4 E4:2 | G4:3 F4 D4:2 | C4:6`,
  },
  {
    id: "joy-to-the-world",
    title: "Joy to the World",
    key: "C",
    bpm: 92,
    bar: 4,
    melody: repeat(`C6 B5:0.75 A5:0.25 G5:1.5 F5:0.5 | E5 D5 C5:1.5 G5:0.5 | A5:1.5 A5:0.5 B5:1.5 B5:0.5 | C6:4`, 2),
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
    id: "good-king-wenceslas",
    title: "Good King Wenceslas",
    key: "G",
    bpm: 104,
    bar: 4,
    melody: `
      G4 G4 G4 A4 | G4 G4 D4:2 | E4 D4 E4 F#4 | G4:2 G4:2 |
      G4 G4 G4 A4 | G4 G4 D4:2 | E4 D4 E4 F#4 | G4:2 G4:2 |
      D5 C5 B4 A4 | B4 A4 G4:2 | E4 D4 E4 F#4 | G4:2 G4:2 |
      D4 D4 E4 F#4 | G4 G4 A4:2 | D5 C5 B4 A4 | G4:2 C5:2 | G4:4`,
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
    id: "first-noel",
    title: "The First Noel",
    key: "C",
    bpm: 108,
    bar: 3,
    pickup: 1,
    melody: `
      E4:0.5 D4:0.5 |
      C4:1.5 D4:0.5 E4:0.5 F4:0.5 | G4:2 A4:0.5 B4:0.5 | C5 B4 A4 | G4:2 A4:0.5 B4:0.5 |
      C5 B4 A4 | G4 A4 B4 | C5 G4 F4 | E4:2 E4:0.5 D4:0.5 |
      C4:1.5 D4:0.5 E4:0.5 F4:0.5 | G4:2 A4:0.5 B4:0.5 | C5 B4 A4 | G4:2 A4:0.5 B4:0.5 |
      C5 B4 A4 | G4 A4 B4 | C5 G4 F4 | E4:2`,
  },
  {
    id: "god-rest-ye",
    title: "God Rest Ye Merry, Gentlemen",
    key: "Em",
    bpm: 112,
    bar: 4,
    pickup: 1,
    melody: `
      E4 |
      E4 B4 B4 A4 | G4 F#4 E4 D4 | E4 F#4 G4 A4 | B4:3 E4 |
      E4 B4 B4 A4 | G4 F#4 E4 D4 | E4 F#4 G4 A4 | B4:3 B4 |
      C5 A4 B4 C5 | D5 E5 B4 A4 | G4 E4 F#4 G4 | A4:2 G4 A4 |
      B4:2 C5 B4 | B4 A4 G4 F#4 | E4:2 G4:0.5 F#4:0.5 E4 | A4:2 G4 A4 |
      B4 C5 D5 E5 | B4 A4 G4 F#4 | E4:3`,
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
    id: "camptown-races",
    title: "Camptown Races",
    key: "C",
    bpm: 116,
    bar: 4,
    melody: repeat(`G5 G5 E5 G5 | A5 G5 E5:2 | E5 D5:3 | E5 D5:3 | G5 G5 E5 G5 | A5 G5 E5:2 | D5:2 E5 D5 | C5:4`, 2),
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
    id: "when-the-saints",
    title: "When the Saints Go Marching In",
    key: "C",
    bpm: 132,
    bar: 4,
    pickup: 3,
    melody: `
      C5 E5 F5 |
      G5:4 | r C5 E5 F5 | G5:4 | r C5 E5 F5 | G5:2 E5:2 | C5:2 E5:2 | D5:4 |
      r E5 E5 D5 | C5:3 C5 | E5:2 G5:2 | G5 F5:3 | r:2 E5 F5 | G5:2 E5:2 | C5:2 D5:2 | C5:4`,
  },
  {
    id: "pop-goes-the-weasel",
    title: "Pop Goes the Weasel",
    key: "C",
    bpm: 192, // eighth notes
    bar: 6,
    melody: `
      C5:2 C5 D5:2 D5 | E5 G5 E5 C5:3 | C5:2 C5 D5:2 D5 | E5:3 C5:3 |
      C5:2 C5 D5:2 D5 | E5 G5 E5 C5:3 | A5:3 D5:2 F5 | E5:3 C5:3`,
  },
  {
    id: "eine-kleine",
    title: "Eine kleine Nachtmusik",
    key: "G",
    bpm: 132,
    bar: 4,
    melody: `
      G4 r:0.5 D4:0.5 G4 r:0.5 D4:0.5 | G4:0.5 D4:0.5 G4:0.5 B4:0.5 D5 r |
      C5 r:0.5 A4:0.5 C5 r:0.5 A4:0.5 | C5:0.5 A4:0.5 F#4:0.5 A4:0.5 D4 r | +12
      G4 r:0.5 D4:0.5 G4 r:0.5 D4:0.5 | G4:0.5 D4:0.5 G4:0.5 B4:0.5 D5 r |
      C5 r:0.5 A4:0.5 C5 r:0.5 A4:0.5 | C5:0.5 A4:0.5 F#4:0.5 A4:0.5 D4:2`,
  },
  {
    id: "prelude-in-c",
    title: "Prelude in C",
    key: "C",
    bpm: 66,
    bar: 4,
    solo: true,
    melody: PRELUDE,
    harmony: "C | Dm | G7 | C | Am | D7 | G | C | C",
  },
  {
    id: "symphony-40",
    title: "Symphony No. 40",
    key: "Gm",
    bpm: 116,
    bar: 4,
    pickup: 1,
    melody: `
      Eb5:0.5 D5:0.5 |
      D5 Eb5:0.5 D5:0.5 D5 Eb5:0.5 D5:0.5 | D5 Bb5 r Bb5:0.5 A5:0.5 | G5 G5:0.5 F5:0.5 Eb5 Eb5:0.5 D5:0.5 | C5 C5 r D5:0.5 C5:0.5 |
      C5 D5:0.5 C5:0.5 C5 D5:0.5 C5:0.5 | C5 A5 r A5:0.5 G5:0.5 | F#5 F#5:0.5 Eb5:0.5 D5 D5:0.5 C5:0.5 | Bb4 Bb4 r:2`,
  },
  {
    id: "new-world-largo",
    title: "New World Symphony Largo",
    key: "C",
    bpm: 56,
    bar: 4,
    melody: `
      E5:1.5 G5:0.5 G5:2 | E5:1.5 D5:0.5 C5:2 | D5 E5 G5 E5 | D5:4 |
      E5:1.5 G5:0.5 G5:2 | E5:1.5 D5:0.5 C5:2 | D5 E5 D5 C5 | C5:4`,
  },
  {
    id: "toccata",
    title: "Toccata in D Minor",
    key: "Dm",
    bpm: 50,
    bar: 4,
    solo: true,
    melody: `
      A5:0.25 G5:0.25 A5:3.5 | G5:0.25 F5:0.25 E5:0.25 D5:0.25 C#5 D5:2 |
      A4:0.25 G4:0.25 A4:3.5 | E4:0.5 F4:0.5 C#4 D4:2 |
      A3:0.25 G3:0.25 A3:3.5 | G3:0.25 F3:0.25 E3:0.25 D3:0.25 C#3 D3:2`,
    harmony: "Dm | A:2 Dm:2 | Dm | A:2 Dm:2 | Dm | A:2 Dm:2",
  },
  {
    id: "turkish-march",
    title: "Rondo alla Turca",
    key: "Am",
    bpm: 72,
    bar: 2,
    melody: repeat(
      `B4:0.25 A4:0.25 G#4:0.25 A4:0.25 C5:0.5 r:0.5 | D5:0.25 C5:0.25 B4:0.25 C5:0.25 E5:0.5 r:0.5 |
       F5:0.25 E5:0.25 D#5:0.25 E5:0.25 B5:0.25 A5:0.25 G#5:0.25 A5:0.25 | B5:0.25 A5:0.25 G#5:0.25 A5:0.25 C6`,
      2
    ),
    harmony: "Am:2 | E:2 | Am:2 | E:1 Am:1 | Am:2 | E:2 | Am:2 | E:1 Am:1",
  },
  {
    id: "funeral-march",
    title: "Funeral March",
    key: "Bbm",
    bpm: 52,
    bar: 4,
    melody: repeat(`Bb4 Bb4:0.75 Bb4:0.25 Bb4 Db5:0.75 C5:0.25 | C5:0.75 Bb4:0.25 Bb4:0.75 A4:0.25 Bb4:2`, 2),
  },
  {
    id: "bumblebee",
    title: "Flight of the Bumblebee",
    key: "Am",
    bpm: 63,
    bar: 4,
    melody: `${BUMBLEBEE} | ${BUMBLEBEE} | +5 ${BUMBLEBEE} | ${BUMBLEBEE} | +0 ${BUMBLEBEE} | ${BUMBLEBEE} | E5:4`,
    harmony: "Am | Am | Dm | Dm | Am | Am | Am",
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
  {
    id: "carol-of-the-bells",
    title: "Carol of the Bells",
    key: "Gm",
    bpm: 132,
    bar: 3,
    melody: `${repeat(CAROL, 4)} | +4 ${repeat(CAROL, 4)} | +0 ${repeat(CAROL, 4)} | G5:3`,
  },
  {
    id: "moonlight-sonata",
    title: "Moonlight Sonata",
    key: "C#m",
    bpm: 54,
    bar: 4,
    solo: true,
    melody: `${MOONLIGHT} | ${MOONLIGHT}`,
    harmony: "C#m | A:2 D:2 | G#:2 C#m:2 | C#m | C#m | A:2 D:2 | G#:2 C#m:2 | C#m",
  },
  {
    id: "clementine",
    title: "Oh My Darling, Clementine",
    key: "F",
    bpm: 104,
    bar: 3,
    melody: repeat(
      `F5:0.75 F5:0.25 F5 C5 | A5:0.75 A5:0.25 A5 F5 | F5:0.75 A5:0.25 C6:1.5 C6:0.5 | Bb5:0.5 A5:0.5 G5:2 |
       G5:0.5 A5:0.5 Bb5 Bb5 | A5:0.75 G5:0.25 A5 F5 | F5:0.75 A5:0.25 G5:1.5 C5:0.5 | E5:0.5 G5:0.5 F5:2`,
      2
    ),
  },
  {
    id: "canon-in-d",
    title: "Canon in D",
    key: "D",
    bpm: 60,
    bar: 4,
    // Over the ground bass, one chord a beat: the long line, the falling line, the running eighths,
    // and the long line again.
    melody: `
      F#5 E5 D5 C#5 | B4 A4 B4 C#5 | D5 C#5 B4 A4 | G4 F#4 G4 E4 |
      D5:0.5 F#5:0.5 A5:0.5 G5:0.5 F#5:0.5 D5:0.5 F#5:0.5 E5:0.5 | D5:0.5 B4:0.5 D5:0.5 A5:0.5 G5:0.5 B5:0.5 A5:0.5 G5:0.5 |
      F#5 E5 D5 C#5 | B4 A4 B4 C#5 | D5:4`,
    harmony: `${repeat("D:1 A:1 Bm:1 F#m:1 G:1 D:1 G:1 A:1", 4)} | D:4`,
  },
  {
    id: "beethoven-5",
    title: "Symphony No. 5",
    key: "Cm",
    bpm: 100,
    bar: 2,
    melody: `
      r:0.5 G4:0.5 G4:0.5 G4:0.5 | Eb4:4 | r:0.5 F4:0.5 F4:0.5 F4:0.5 | D4:4 |
      r:0.5 G4:0.5 G4:0.5 G4:0.5 | Eb4:2 | r:0.5 Ab4:0.5 Ab4:0.5 Ab4:0.5 | G4:2 | r:0.5 Eb5:0.5 Eb5:0.5 Eb5:0.5 | C5:4 |
      r:0.5 G4:0.5 G4:0.5 G4:0.5 | D4:2 | r:0.5 Ab4:0.5 Ab4:0.5 Ab4:0.5 | G4:2 | r:0.5 F5:0.5 F5:0.5 F5:0.5 | D5:4`,
  },
  {
    id: "surprise-symphony",
    title: "Surprise Symphony",
    key: "C",
    bpm: 80,
    bar: 2,
    melody: repeat(`C5:0.5 C5:0.5 E5:0.5 E5:0.5 | G5:0.5 G5:0.5 E5 | F5:0.5 F5:0.5 D5:0.5 D5:0.5 | B4:0.5 B4:0.5 G4`, 2),
  },
  {
    id: "the-entertainer",
    title: "The Entertainer",
    key: "C",
    bpm: 76,
    bar: 4,
    pickup: 0.5,
    melody: `D4:0.25 D#4:0.25 | E4:0.25 C5:0.5 E4:0.25 C5:0.5 E4:0.25 C5:1.5 C5:0.25 D5:0.25 D#5:0.25 | E5:0.25 C5:0.25 D5:0.25 E5:0.5 B4:0.25 D5:0.5 C5:1.5 D4:0.25 D#4:0.25 | E4:0.25 C5:0.5 E4:0.25 C5:0.5 E4:0.25 C5:1.75 A4:0.25 G4:0.25 | F#4:0.25 A4:0.25 C5:0.25 E5:0.5 D5:0.25 C5:0.25 A4:0.25 D5:1.5 D4:0.25 D#4:0.25 | E4:0.25 C5:0.5 E4:0.25 C5:0.5 E4:0.25 C5:1.5 C5:0.25 D5:0.25 D#5:0.25 | E5:0.25 C5:0.25 D5:0.25 E5:0.5 B4:0.25 D5:0.5 C5:2`,
  },
];

const BASES = Object.fromEntries(TUNES.map((spec) => [spec.id, build(spec)]));

// How hard a song is to play: how many notes come each second, how quick its quickest passages
// are, how much its rhythm varies, and how long it goes on.
export function difficulty(song) {
  const spb = 60 / song.bpm;
  const gaps = song.melody
    .slice(1)
    .map((n, i) => (n.beat - song.melody[i].beat) * spb)
    .sort((a, b) => a - b);
  const mean = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  const quick = gaps[Math.floor(gaps.length * 0.2)];
  const spread = Math.sqrt(gaps.reduce((sum, g) => sum + (g - mean) ** 2, 0) / gaps.length) / mean;
  return 1 / mean + 0.6 / quick + 0.8 * spread + song.melody.length / 100;
}

// Twinkle Twinkle first, as where everyone starts, then everything else easiest first.
const ordered = Object.values(BASES)
  .filter((s) => s.id !== "twinkle")
  .sort((a, b) => difficulty(a) - difficulty(b));
export const SONGS = [BASES.twinkle, ...ordered].map((song, i, all) => ({ ...song, level: 1 + Math.floor((i * 5) / all.length) }));

// The tune specs, for checking them.
export const TUNE_SPECS = TUNES;

// Every note a song plays, melody first, so the piano knows which recordings to fetch first.
export function songNotes(song) {
  return [...song.melody.map((n) => n.midi), ...song.accompaniment.flatMap((a) => a.notes), ...song.ending];
}
