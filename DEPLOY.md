# Deploy on Railway (frontend repo)

This repository contains only the frontend; everything is at the repo root. Railway will detect `package.json` and build without setting a root directory.

---

## 1. Connect the repository

- Go to [Railway](https://railway.app) → **New Project** → **Deploy from GitHub**.
- Select **justerbaster/aqwarium** (frontend repo).

---

## 2. Build and start

- **Build:** automatic (`npm install`).
- **Start:** `npm start` (from `railway.toml`).

No **Root Directory** setting needed.

---

## 3. Domain

In **Settings** → **Networking**, turn on **Generate Domain**. You’ll get a URL like `https://your-project.up.railway.app`.
