# Deploy on Railway (frontend + backend из одного репо)

Один репозиторий, **два сервиса** на Railway: фронтенд и бэкенд. У каждого сервиса свой **Root Directory**.

---

## 1. Подключить репозиторий к Railway

- [Railway](https://railway.app) → **New Project** → **Deploy from GitHub**.
- Выберите репозиторий **justerbaster/aqwarium** (или ваш форк).

---

## 2. Сервис «Фронтенд»

- В проекте Railway создайте сервис (или добавьте второй): **New** → **GitHub Repo** → тот же репозиторий.
- В настройках сервиса:
  - **Root Directory:** `frontend`
  - **Build:** автоматически (`npm install`)
  - **Start:** `npm start` (уже задано в `frontend/railway.toml`)
- Сохраните. Railway задеплоит статику через `serve` на порту `PORT`.
- В **Settings** → **Networking** включите **Generate Domain**. Получите URL вида `https://aqwarium-frontend.up.railway.app`.

---

## 3. Сервис «Бэкенд»

- В том же проекте: **New** → **GitHub Repo** → тот же репозиторий.
- В настройках сервиса:
  - **Root Directory:** `backend`
  - **Build:** `mvn -q -DskipTests package` (задано в `backend/railway.toml`)
  - **Start:** `java -Dserver.port=$PORT -jar target/*.jar`
- Переменные окружения (в **Variables**):
  - `MYSQL_URL` — URL MySQL (если подключаете Railway MySQL, подставьте выданный URL).
  - `MYSQL_USER`, `MYSQL_PASSWORD` — при использовании своей БД.
- В **Networking** включите **Generate Domain**. URL API: `https://aqwarium-backend.up.railway.app`.

---

## 4. Соединение фронта и бэка

1. Скопируйте URL бэкенда (например `https://aqwarium-backend.up.railway.app`).
2. Во фронте задайте его через `<meta>` в `frontend/index.html` и `frontend/game.html` в `<head>`:

   ```html
   <meta name="aqwarium-api-url" content="https://ваш-бэкенд.railway.app">
   ```

   Скрипт `frontend/js/config.js` прочитает значение в `window.AQWARIUM_API_URL`; в запросах к API используйте этот базовый URL.

---

## Кратко

| Сервис   | Root Directory | Что деплоится        |
|----------|----------------|----------------------|
| Frontend | `frontend`     | Node + serve (статика) |
| Backend  | `backend`      | Maven + Spring Boot JAR |

Оба сервиса берут код из одного и того же репозитория на GitHub.
