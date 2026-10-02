// A small reader for Standard MIDI Files: the notes of each track, with times in beats (quarter
// notes) and seconds, plus the tempo and time-signature changes. Enough for turning public-domain
// transcriptions into songs; nothing in the game itself uses it.

export function readMidi(buffer) {
  const data = new Uint8Array(buffer);
  let pos = 0;
  const u8 = () => data[pos++];
  const u16 = () => (u8() << 8) | u8();
  const u32 = () => ((u8() << 24) | (u8() << 16) | (u8() << 8) | u8()) >>> 0;
  const text = (n) => {
    const s = String.fromCharCode(...data.subarray(pos, pos + n));
    pos += n;
    return s;
  };
  const varLength = () => {
    let value = 0;
    for (;;) {
      const b = u8();
      value = (value << 7) | (b & 0x7f);
      if (!(b & 0x80)) return value;
    }
  };

  if (text(4) !== "MThd") throw new Error("midi: not a MIDI file");
  const headerLength = u32();
  const format = u16();
  const trackCount = u16();
  const division = u16();
  pos += headerLength - 6;
  if (division & 0x8000) throw new Error("midi: SMPTE timing isn't supported");
  const ppq = division;

  const tracks = [];
  const tempos = []; // { tick, usPerBeat }
  const meters = []; // { tick, numerator, denominator }
  for (let t = 0; t < trackCount; t++) {
    if (text(4) !== "MTrk") throw new Error(`midi: track ${t} is missing`);
    const length = u32();
    const end = pos + length;
    const track = { index: t, name: "", notes: [] };
    const open = new Map(); // channel*128+pitch -> [{ tick, velocity }]
    let tick = 0;
    let status = 0;
    while (pos < end) {
      tick += varLength();
      let byte = u8();
      if (byte < 0x80) {
        pos--; // running status: the last channel message's status carries on
        byte = status;
      } else if (byte < 0xf0) status = byte;
      const kind = byte & 0xf0;
      const channel = byte & 0x0f;
      if (byte === 0xff) {
        const type = u8();
        const length = varLength();
        if (type === 0x03) track.name = text(length);
        else if (type === 0x51) {
          tempos.push({ tick, usPerBeat: (u8() << 16) | (u8() << 8) | u8() });
        } else if (type === 0x58) {
          const numerator = u8();
          const denominator = 2 ** u8();
          pos += length - 2;
          meters.push({ tick, numerator, denominator });
        } else pos += length;
      } else if (byte === 0xf0 || byte === 0xf7) {
        pos += varLength();
      } else if (kind === 0x90 || kind === 0x80) {
        const pitch = u8();
        const velocity = u8();
        const key = channel * 128 + pitch;
        if (kind === 0x90 && velocity > 0) {
          if (!open.has(key)) open.set(key, []);
          open.get(key).push({ tick, velocity });
        } else {
          const started = open.get(key)?.shift();
          if (started) track.notes.push({ pitch, channel, velocity: started.velocity, startTick: started.tick, endTick: tick });
        }
      } else if (kind === 0xc0 || kind === 0xd0) {
        pos += 1;
      } else {
        pos += 2; // other channel messages carry two data bytes
      }
    }
    pos = end;
    tracks.push(track);
  }

  // Ticks to seconds, through every tempo change.
  tempos.sort((a, b) => a.tick - b.tick);
  if (!tempos.length || tempos[0].tick > 0) tempos.unshift({ tick: 0, usPerBeat: 500000 });
  const segments = [];
  let seconds = 0;
  tempos.forEach((tempo, i) => {
    segments.push({ tick: tempo.tick, seconds, usPerBeat: tempo.usPerBeat });
    const next = tempos[i + 1];
    if (next) seconds += ((next.tick - tempo.tick) / ppq) * (tempo.usPerBeat / 1e6);
  });
  const secondsAt = (tick) => {
    let s = segments[0];
    for (const seg of segments) if (seg.tick <= tick) s = seg;
    return s.seconds + ((tick - s.tick) / ppq) * (s.usPerBeat / 1e6);
  };
  for (const track of tracks) {
    for (const note of track.notes) {
      note.beat = note.startTick / ppq;
      note.beats = (note.endTick - note.startTick) / ppq;
      note.time = secondsAt(note.startTick);
      note.seconds = secondsAt(note.endTick) - note.time;
    }
    track.notes.sort((a, b) => a.startTick - b.startTick || b.pitch - a.pitch);
  }
  return { format, ppq, tracks, tempos, meters, secondsAt };
}
