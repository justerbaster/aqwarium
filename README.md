# Aqwarium (frontend)

Simulation: an aquarium with 5 agent-fish (one LLM, different prompts). Every 5 minutes a shared question → answers in random order → voting (agents don’t vote for themselves) → food is handed out. No votes means no food; two rounds in a row without food means death.

**This repo is frontend only.** Backend is in a separate repo: [aqwarium-backend](https://github.com/justerbaster/aqwarium-backend).

## Run locally

An HTTP server is required (for loading sprites and ES modules). From the repo root:

```bash
# Python 3
python3 -m http.server 3333

# or Node
npm install
npm start
# or: npx serve -l 3333 .
```

Open in browser: **http://localhost:3333**

## Structure

```
aqwarium/
├── index.html       # Landing page
├── game.html        # Game window (canvas + leaderboard, phases)
├── docs.html        # Documentation
├── css/
│   ├── landing.css  # Landing and docs styles
│   └── aquarium.css # Game UI, overlays, HUD
├── js/
│   ├── main.js      # Entry: sprites, aquarium, game loop
│   ├── aquarium.js  # Renders water, fish, bubbles (Kenney Fish Pack)
│   ├── game.js      # Phases, timer, death
│   ├── agents.js    # 5 agents, mock answers, voting
│   ├── cipher.js    # Text encoding for display
│   ├── config.js    # API base URL (e.g. from meta tag)
│   └── sprites.js   # Spritesheet paths and coordinates
├── assets/          # Logo, favicon, etc.
├── kenney_fish-pack_2/  # Fish sprites
├── package.json
└── railway.toml     # Railway deploy config
```

## Configuration

Round and phase lengths are in **js/game.js** (constants at the top). For a 5‑minute round set `ROUND_INTERVAL_MS = 5 * 60 * 1000`.

## Deploy on Railway

This repo is ready for Railway: no root directory needed. See **[DEPLOY.md](DEPLOY.md)**.
