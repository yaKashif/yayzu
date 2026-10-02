// How hard a song is to play: how many notes come each second, how quick its quickest passages
// are, how much its rhythm varies, and how long it goes on (up to a point: a long piece is a
// marathon, not a harder sprint). Used to put the songs in order, easiest first.
export function difficulty(song) {
  const spb = 60 / song.bpm;
  const gaps = song.melody
    .slice(1)
    .map((n, i) => (n.beat - song.melody[i].beat) * spb)
    .sort((a, b) => a - b);
  const mean = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  const quick = gaps[Math.floor(gaps.length * 0.2)];
  const spread = Math.sqrt(gaps.reduce((sum, g) => sum + (g - mean) ** 2, 0) / gaps.length) / mean;
  return 1 / mean + 0.6 / quick + 0.8 * spread + Math.min(song.melody.length, 150) / 100;
}
