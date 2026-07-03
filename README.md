# Wayfare — Audio Guided Tours for Solo Travellers

A mobile-first, interactive prototype of a self-paced audio walking tour app. Built to explore the UX of guided tours that feel as unhurried and personal as walking with a local friend, rather than a scripted broadcast.

## Try it

```bash
npm install
npm run dev
```

Open the printed local URL — the app is designed for a phone-sized viewport (it renders inside a device frame on wider screens).

## Design brief recap

Solo travellers want the intimacy of an in-person guided tour, but on their own schedule — free to linger at a viewpoint, detour for coffee, or backtrack without feeling like they're holding up a group or missing the story. The app needed:

- Full transport control over the narration (start, pause, speed, skip to any point), with visible timestamps
- AR at points where seeing the location come alive matters more than hearing about it
- An orientation map, especially useful zoomed out, so a solo traveller always knows how to get back
- A mobile-first, single-hand-usable interface that never feels like it's rushing them

## How the design answers that

**Tours are one continuous narration with chapters, not disconnected audio clips.**
Modeling each tour as a single track with chapter markers (`src/types/tour.ts`, `Stop.timestamp`) means the transport controls behave like a podcast: one scrubber, visible chapter tick marks, `mm:ss` timestamps per stop, and a tap-to-jump chapter list — so "skip to any part of the audio" is a single tap, not a search.

**The player is the emotional center, everything else supports it.**
`PlayerScreen` (`src/screens/PlayerScreen.tsx`) is the "now playing" screen: big cover art per stop, five-button transport (previous stop / −15s / play-pause / +15s / next stop), a five-speed selector (0.75×–2×), the live transcript so a stop can be re-read instead of re-heard, and inline AR entry when relevant. Playback state lives in one `PlayerContext` (`src/context/PlayerContext.tsx`) so it survives navigation — the tour keeps narrating while browsing the map or looking at AR, exactly like a real guide wouldn't stop talking because you turned your head.

**A persistent mini-player + 3-tab nav (Listen / Stops / Map) replaces a rigid step-by-step flow.**
Once a tour starts, a traveller can bounce between the full player, the chapter list, and the map at any moment — nothing is locked behind "finish this screen first." This is the core answer to "don't make me feel rushed": there is no forward-only flow to fall behind on.

**The map is built for orientation, not navigation-app precision.**
`MapScreen` shows the whole route zoomed out by default (stylized, not a real tile provider — kept the prototype self-contained and fast), a pulsing "you are here" marker that tracks playback progress along the route, numbered stop pins, and a distinct dashed line to a labeled "quick exit · main street" — a direct answer to "so they can get out easily," which is a real solo-travel anxiety a generic maps app doesn't address. Tapping a pin surfaces a card to jump the audio there or open AR, so orientation and control stay in the same place.

**AR is scoped to a few high-value waypoints, not the whole tour.**
Stops flagged `hasAR` (castle gates, viewpoints, temple pagodas) open a camera-style overlay (`ARScreen`) with floating annotations a traveller can tap for more detail. It attempts a real device camera via `getUserMedia` and falls back to a styled placeholder when no camera is available (e.g. this preview environment) — narration keeps playing underneath, reinforcing that AR is a layer on top of the tour, not a separate mode.

**Visual language:** a warm, editorial "travel journal" palette (terracotta / sage / paper) instead of typical map-app blues and greens, `Fraunces` serif for titles against `Inter` for UI — meant to feel closer to a printed guidebook than software chrome.

## Structure

```
src/
  types/tour.ts        Tour & Stop data model (chapters = timestamped stops)
  data/                Mock content: 3 cities, 7 tours, ~30 stops with transcripts
  context/PlayerContext.tsx   Global playback state (position, speed, chapter, AR)
  screens/
    HomeScreen.tsx      City picker + tour list
    TourDetailScreen.tsx  Tour overview + stop list (doubles as the "Stops" tab)
    PlayerScreen.tsx    Full audio player — the "Listen" tab
    MapScreen.tsx        Zoomed-out route map with live position + exit route
    ARScreen.tsx          Mock AR waypoint overlay
  components/          MiniPlayer, BottomNav, TourCard, ScreenHeader
```

## Notes on the prototype

- Audio playback is simulated (an internal clock advances "elapsed time" at the selected speed) rather than streaming real audio files, since no narration recordings exist yet — the entire transport/seek/speed/chapter UX is real and wired end-to-end, ready to swap in an `<audio>`/HLS backend.
- Map and AR are stylized mockups (SVG route + CSS gradients) rather than a live maps SDK or WebXR session, so the prototype has zero external API-key or network dependencies and runs anywhere. The interaction model (pins, live position, tap-to-jump, camera-with-fallback) is what would carry over to a production maps/AR integration.
- Favorites, feedback, visited stops, and memory photos persist to the browser's `localStorage` (see `src/context/UserDataContext.tsx`) — single device, no account or backend sync. A production version would move this to a per-user account so memories and visited history follow a traveller across devices.
