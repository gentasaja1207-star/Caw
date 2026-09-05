// Lyrics provider architecture.
//
// Genta Music Player ships with no lyrics data source wired in by default —
// licensed lyrics content requires its own provider agreement/API key
// (e.g. Musixmatch, Genius, LRCLIB). This module defines the contract every
// provider must satisfy, so swapping one in later is a one-line change.
//
// Shape returned by fetchLyrics():
// {
//   available: boolean,
//   synced: boolean,                 // true if lines carry timestamps
//   lines: [{ time: number|null, text: string }]
// }

/** No-op provider — always reports lyrics as unavailable. This is the default. */
async function nullProvider(/* track */) {
  return { available: false, synced: false, lines: [] }
}

// --- To connect a real provider -----------------------------------------
// 1. Implement an async function with the same signature: (track) => LyricsResult
// 2. Call the provider through your backend (server/routes/), never from the
//    browser, so any provider API key stays server-side — same pattern as
//    server/routes/youtube.js.
// 3. Swap the export below to point at your implementation.
const activeProvider = nullProvider

export async function fetchLyrics(track) {
  try {
    return await activeProvider(track)
  } catch {
    return { available: false, synced: false, lines: [] }
  }
}
