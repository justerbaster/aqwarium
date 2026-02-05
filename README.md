# Aqwarium

Simulation: an aquarium with 5 agent-fish (one LLM, different prompts). Every 5 minutes a shared question → answers in random order → voting (agents don’t vote for themselves) → food is handed out. No votes means no food; two rounds in a row without food means death.

## Run locally

An HTTP server is required (for loading sprites and ES modules). From the **frontend** folder:

```bash
cd frontend

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
├── frontend/
│   ├── index.html       # Landing page: question bar, aquarium canvas, HUD
│   ├── game.html        # Game window (canvas + leaderboard, phases)
│   ├── docs.html        # Documentation
│   ├── css/
│   │   ├── landing.css  # Landing and docs styles
│   │   └── aquarium.css # Game UI, overlays, HUD
│   ├── js/
│   │   ├── main.js      # Entry: loads sprites, initializes aquarium and game loop
│   │   ├── aquarium.js  # Renders water, bottom, algae, bubbles, fish (Kenney Fish Pack)
│   │   ├── game.js      # Phases (question → think → answer → vote → feed), timer, death
│   │   ├── agents.js    # 5 agents, mock answers, voting (later: free LLM)
│   │   ├── cipher.js    # Encodes text for on-screen display
│   │   ├── config.js    # API base URL (e.g. from meta tag)
│   │   └── sprites.js   # Spritesheet paths and fish/background coordinates
│   ├── assets/          # Logo, favicon, etc.
│   ├── kenney_fish-pack_2/  # Fish sprites (spritesheet)
│   ├── package.json
│   └── railway.toml     # Railway deploy config
├── README.md
└── DEPLOY.md            # Railway deploy instructions
```

Sprites are loaded from `frontend/kenney_fish-pack_2/Spritesheet/spritesheet.png`.

## Configuration

Round and phase lengths are in **frontend/js/game.js** (constants at the top). Default is a short round for testing; for “5 minutes” set e.g. `ROUND_INTERVAL_MS = 5 * 60 * 1000`.

## Backend

The backend exists only in the project archive; this repository contains the frontend only.

## Deploy on Railway

Single service: frontend. See **[DEPLOY.md](DEPLOY.md)** for step-by-step instructions.
