# 📘 **BACKEND_STRUCTURE.md**

```md
# BACKEND_STRUCTURE.md
## Структура backend проекта (FastAPI модульный монолит)

Backend — это основа логики мессенджера.  
Структура должна быть понятной, масштабируемой и строгой.

---

# 📁 Общая структура

backend/
│
├── app/
│   ├── api/
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── chats.py
│   │   │   ├── messages.py
│   │   │   └── attachments.py
│   │   ├── dependencies/
│   │   │   └── auth.py
│   │   └── __init__.py
│   │
│   ├── ws/
│   │   ├── connection_manager.py
│   │   ├── events.py
│   │   ├── router.py
│   │   └── utils.py
│   │
│   ├── services/
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── chat_service.py
│   │   ├── message_service.py
│   │   ├── attachment_service.py
│   │   └── email_service.py
│   │
│   ├── repositories/
│   │   ├── user_repo.py
│   │   ├── chat_repo.py
│   │   ├── message_repo.py
│   │   └── attachment_repo.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── chat.py
│   │   ├── message.py
│   │   ├── attachment.py
│   │   └── base.py (Base = declarative_base())
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── chat.py
│   │   ├── message.py
│   │   └── attachment.py
│   │
│   ├── workers/
│   │   ├── celery_app.py
│   │   ├── tasks_email.py
│   │   └── tasks_media.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── logger.py
│   │   ├── database.py
│   │   ├── redis.py
│   │   └── utils.py
│   │
│   ├── main.py
│   └── ws_main.py
│
├── alembic/
├── alembic.ini
├── Dockerfile
├── requirements.txt
├── .env
└── README.md

---

# 📘 Подробное описание директорий

## 📁 /api/
HTTP эндпоинты.  
Тут НЕТ логики — только вызов сервисов.

- routers/auth.py  
- routers/chats.py  
- routers/messages.py  

## 📁 /ws/
Всё для WebSocket:
- router.py — ws endpoint  
- connection_manager.py — хранение соединений  
- events.py — обработка событий ws  
- utils.py — вспомогательные функции  

## 📁 /services/
Бизнес-логика.  
Правило: **API вызывает сервисы, а сервисы вызывают репозитории.**

Пример:
- chat_service.create_chat()  
- message_service.send_message()  

## 📁 /repositories/
Работа с БД:
- user_repo  
- chat_repo  
- message_repo  

Только SQL, никаких Pydantic.

## 📁 /models/
Все SQLAlchemy модели.

## 📁 /schemas/
Все Pydantic DTO (request/response).

## 📁 /core/
Конфигурации:
- config.py — чтение env  
- security.py — JWT  
- database.py — PostgreSQL session  
- redis.py — redis connector  
- logger.py — кастом логгер  

## 📁 /workers/
Celery:
- email уведомления  
- обработка изображений  

---

# 📘 Доп. файлы

## main.py
Запуск HTTP API.

## ws_main.py
Запуск WebSocket worker (отдельный процесс).

---

# ✨ Требования

Backend должен:
- строго следовать API_CONTRACT.md  
- генерировать OpenAPI  
- обновлять миграции  
- поддерживать docker-compose  
```

---
