
# 📘 **README.md (готовая версия)**

```md
<h1 align="center">🚀 Web Messenger — Реал-тайм мессенджер (FastAPI + React)</h1>

<p align="center">
Модульный монолит · WebSocket · PostgreSQL · Redis · MinIO · Celery · Docker
</p>

---

## 📌 О проекте

**Web Messenger** — это современный веб-мессенджер, работающий прямо в браузере (без скачивания),  
предназначенный для масштабирования до **5000 активных пользователей**.

🎯 Основные технологии:

- 🔵 **Backend:** FastAPI · WebSocket · PostgreSQL · Redis · Celery · MinIO  
- 🟣 **Frontend:** React · Vite · TypeScript · Zustand · Tailwind  
- 🟢 **DevOps:** Docker · Docker Compose · Makefile  

Проект построен по принципам:

- **Модульный монолит**  
- **Строгий API контракт**  
- **Frontend и Backend полностью разделены**  
- **Чистая архитектура**  
- **Готовность к масштабированию**

---

## 📐 Архитектура

### Общая схема проекта

```

```
     ┌───────────────────────────┐
     │         FRONTEND          │
     │   React + WebSocket +     │
     │   OpenAPI TS Client       │
     └──────────────┬────────────┘
                    REST / WS
     ┌──────────────┴─────────────┐
     │           BACKEND           │
     │     FastAPI Modular         │
     │  - /api (REST)              │
     │  - /ws  (WebSocket)         │
     │  - services / repositories  │
     └───────┬─────────┬──────────┘
             │         │
    PostgreSQL     Redis     MinIO
     (DB)          (Cache)   (Files)
             Celery (email)
```

```

📄 Подробности:  
- [ARCHITECTURE.md](docs/ARCHITECTURE.md)  
- [BACKEND_STRUCTURE.md](docs/BACKEND_STRUCTURE.md)  
- [FRONTEND_STRUCTURE.md](docs/FRONTEND_STRUCTURE.md)

---

## 🔗 REST & WebSocket Контракт

Полная спецификация API и WebSocket протоколов:

👉 **[API_CONTRACT.md](docs/API_CONTRACT.md)**

Frontend и Backend обязаны строго следовать этой схеме.  
Из этого файла генерируется TypeScript клиент (OpenAPI generator).

---

## 🤖 Роли двух AI-разработчиков

Проект поддерживается двумя независимыми нейронками в VS Code:

- 🟢 **Агент A — Backend Engineer**  
- 🔵 **Агент B — Frontend Engineer**

Они работают строго по правилам:

📄 **[AI_ROLES.md](docs/AI_ROLES.md)**  
📄 **[DEV_WORKFLOW.md](docs/DEV_WORKFLOW.md)**

---

## 🗂️ Структура проекта

```

project/
│
├── backend/                 # FastAPI backend (модульный монолит)
│   ├── app/
│   ├── alembic/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                # React/Vite frontend
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml       # Вся инфраструктура
├── Makefile                 # Команды для разработки
├── docs/                    # Вся документация
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACT.md
│   ├── AI_ROLES.md
│   ├── BACKEND_STRUCTURE.md
│   ├── FRONTEND_STRUCTURE.md
│   ├── SPRINT_PLAN.md
│   └── DEV_WORKFLOW.md
└── README.md

````

---

## 🚀 Быстрый старт (локальный запуск)

### 1️⃣ Установи Docker + Docker Compose  
(Windows/Mac/Linux — не важно)

### 2️⃣ Запусти проект:

```bash
make up
````

Проект поднимет:

* backend (FastAPI)
* frontend (React)
* PostgreSQL
* Redis
* MinIO
* MailHog (для e-mail)
* Celery worker

### 3️⃣ Открывай:

* 🌐 Frontend: **[http://localhost:3000](http://localhost:3000)**
* 🧪 API Swagger: **[http://localhost:8000/docs](http://localhost:8000/docs)**
* 🗄️ MinIO UI: **[http://localhost:9000](http://localhost:9000)**
* ✉️ MailHog: **[http://localhost:8025](http://localhost:8025)**

### 4️⃣ Остановить:

```bash
make down
```

---

## 🧪 Полезные команды

### Перезапустить backend

```bash
make backend
```

### Перезапустить frontend

```bash
make frontend
```

### Логи всех сервисов

```bash
make logs
```

### Запустить миграции

```bash
make migrate
```

### Redis CLI

```bash
make redis
```

---

## 🧱 Спринты и план разработки

Проект развивается по 6-ти спринтовой системе:

📄 **[SPRINT_PLAN.md](docs/SPRINT_PLAN.md)**

Спринты включают:

* инфраструктуру
* авторизацию
* чаты
* WS реальное время
* отправку файлов
* email уведомления
* мобильную адаптацию
* стабильность

---

## 🧩 Особенности проекта

### 🔥 Реальное время (WebSocket)

* отправка сообщений
* уведомления "печатает"
* статусы онлайн
* ACK подтверждение

### 🖼️ Файлы: MinIO + presigned URLs

* загрузка изображений
* документы
* предпросмотр

### ✉️ Email уведомления

Если человек оффлайн → после N минут ему приходит письмо.

### 📱 Mobile-friendly SPA

Интерфейс адаптирован под мобильные.

---

## 🧬 Масштабирование (до 5k пользователей)

На текущем этапе используется:

* 1 API процесс
* 1–2 WS процесса
* PostgreSQL + Redis
* Celery + MinIO

Позднее можно вынести:

* WebSocket в отдельный сервис
* pub/sub через Redis
* message sharding
* Celery кластер

---

## ❤️ Автор

Разработано с упором на:

* масштабируемость
* читаемость
* архитектурную чистоту
* удобство двух нейронок в VS Code

---

<h3 align="center">💬 Готов к запуску.  
Если нужен авто-генератор структуры проекта — скажи.</h3>
```

---


