# 📘 **SPRINT_PLAN.md — максимальная детализация**

```md
# SPRINT_PLAN.md
## План разработки MVP мессенджера (6 спринтов)

---

# 🟡 Спринт 1 — Инфра + Проект скелеты

### Backend (Агент A)
- Инициализировать FastAPI
- Создать структуру модульного монолита
- Docker-compose:
  - backend
  - frontend
  - postgres
  - redis
  - minio
  - mailhog
  - celery
- Makefile
- Alembic init

### Frontend (Агент B)
- Создать React/Vite проект
- Tailwind
- Базовый layout
- Подключить ESLint/Prettier

Результат:  
Открывается UI, API отвечает.

---

# 🟡 Спринт 2 — Auth

### Backend
- Users модель
- Auth эндпоинты
- JWT
- OpenAPI обновить

### Frontend
- Генерация TS клиента по OpenAPI
- Страница логина
- Страница регистрации
- Хранение токенов

---

# 🟡 Спринт 3 — Чаты (REST)

### Backend
- Модели chats, members, messages
- API: create chat
- API: list chats
- API: chat messages

### Frontend
- UI списка чатов
- UI истории сообщений
- Отправка сообщений через REST

---

# 🟡 Спринт 4 — WebSocket

### Backend
- WS endpoint
- Поддержка send_message
- ACK
- Broadcasting
- typing_start/stop
- online status

### Frontend
- WS подключение
- Реал-тайм сообщения
- typing indicator
- online/offline в UI

---

# 🟡 Спринт 5 — Файлы + Email уведомления

### Backend
- MinIO presigned URLs
- attachments таблица
- Celery: offline email alerts

### Frontend
- загрузка изображений/файлов
- отображение attachments

---

# 🟡 Спринт 6 — Стабилизация

### Backend
- rate limits
- XSS защита
- оптимизация SQL

### Frontend
- WS reconnection
- локальный кеш сообщений
- моб версия

---

MVP готов.
```

---
