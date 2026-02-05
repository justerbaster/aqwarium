# Deploy on Railway (frontend + backend separately)

Деплой в два сервиса: **фронтенд** (этот репозиторий) и **бэкенд** (Spring Boot — отдельный репозиторий). Потом соединяете фронт с бэком через URL API.

---

## 1. Фронтенд (этот проект)

- Репозиторий: ваш форк или клон с фронтом (HTML/CSS/JS + `serve`).
- На Railway: **New Project → Deploy from GitHub** → выберите репозиторий с этим фронтом.
- Корень репозитория = корень фронта (где лежат `index.html`, `game.html`, `package.json`).
- Railway сам поднимет `npm install` и `npm start` (статический сервер на порту `PORT`).
- После деплоя получите URL вида `https://aqwarium-frontend.up.railway.app`.

Локальная проверка перед пушем:

```bash
npm install
npm start
# Открой http://localhost:3333
```

---

## 2. Бэкенд (отдельный репозиторий)

- Репозиторий: [Fish_Aqwarium_Project_SpringBoot](https://github.com/dumidu27730/Fish_Aqwarium_Project_SpringBoot) (Java/Spring Boot).
- На Railway: **New Project → Deploy from GitHub** → выберите этот репозиторий.
- Укажите root directory, если бэкенд не в корне репо.
- Задайте переменные окружения (БД, секреты и т.д.) в настройках сервиса.
- После деплоя получите URL API, например `https://aqwarium-backend.up.railway.app`.

---

## 3. Соединение фронта и бэка

1. Скопируйте URL бэкенда с Railway (например `https://aqwarium-backend.up.railway.app`).
2. Во фронтенде задайте этот URL одним из способов:
   - **Вариант A:** в `index.html` и `game.html` добавьте в `<head>`:
     ```html
     <meta name="aqwarium-api-url" content="https://your-backend.railway.app">
     ```
     (скрипт `js/config.js` прочитает его в `window.AQWARIUM_API_URL`).
   - **Вариант B:** позже в коде можно заменить на переменную окружения Railway (через сборку или серверную подстановку).
3. В коде запросов к API используйте `window.AQWARIUM_API_URL` как базовый URL (уже подготовлено в `js/config.js`).

---

## 4. Пуш этого проекта (фронт) в Git

Если репозиторий ещё не создан:

```bash
cd /Users/admin/Documents/aqwarium
git init
git add .
git commit -m "Frontend: ready for Railway deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/aqwarium-frontend.git
git push -u origin main
```

Замените `YOUR_USERNAME/aqwarium-frontend` на ваш репозиторий. Затем в Railway выберите этот репозиторий для деплоя фронта.
