# Deploy on Railway (frontend only)

Single service: static frontend from the `frontend/` folder.

---

## 1. Connect the repository

- Go to [Railway](https://railway.app) → **New Project** → **Deploy from GitHub**.
- Select the **justerbaster/aqwarium** repository.

---

## 2. Service settings

- **Root Directory:** `frontend`
- **Build:** automatic (`npm install`)
- **Start:** `npm start` (set in `frontend/railway.toml`)

Railway will serve the static site with `serve` on the `PORT` environment variable.

---

## 3. Domain

In **Settings** → **Networking**, turn on **Generate Domain**. You’ll get a URL like `https://your-project.up.railway.app`.
