# Aqwarium

Симуляция: аквариум с 5 агентами-рыбами (один LLM, разные промпты). Каждые 5 минут общий вопрос → ответы в хаотичном порядке → голосование (агент не голосует за себя) → выдача еды. Кто без голосов — не получает еду; два раунда подряд без еды — смерть.

Репозиторий — **монорепо**: фронт и бэк в одном репо, для деплоя на Railway как два отдельных сервиса.

## Структура

```
aqwarium/
├── frontend/          # Статика (HTML/CSS/JS) + serve
│   ├── index.html, game.html, docs.html
│   ├── css/, js/, assets/, kenney_fish-pack_2/
│   ├── package.json
│   └── railway.toml
├── backend/            # Spring Boot (Java, Maven)
│   ├── pom.xml
│   ├── src/
│   └── railway.toml
├── README.md
└── DEPLOY.md           # Инструкция по деплою на Railway
```

## Запуск локально

**Фронтенд** (из папки `frontend/`):

```bash
cd frontend
npm install
npm start
# Открой http://localhost:3333
```

**Бэкенд** (из папки `backend/`):

```bash
cd backend
./mvnw spring-boot:run
# или mvn spring-boot:run
# Нужна MySQL (по умолчанию localhost:3306, user root, password 1234).
```

## Деплой на Railway

Фронт и бэк деплоятся **двумя сервисами** из одного репозитория. Подробно: **[DEPLOY.md](DEPLOY.md)**.
