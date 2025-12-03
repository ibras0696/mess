# Документ обязателен к прочтению всеми AI перед работой.

---

# 📘 **API_CONTRACT.md — Полностью обновлённый**

```md
# API_CONTRACT.md
## Спецификация REST API + WebSocket протокола

Документ — единый источник истины.
Любые изменения согласуются между Backend и Frontend агентами.

---

# 1. Аутентификация

## POST /auth/register
Request:
{
  "email": "string",
  "password": "string",
  "username": "string"
}

Response:
{
  "id": 1,
  "email": "string",
  "username": "string"
}

---

## POST /auth/login
Response:
{
  "access_token": "jwt",
  "refresh_token": "jwt",
  "user": { ... }
}

---

## POST /auth/refresh
Response:
{
  "access_token": "jwt"
}

---

# 2. Пользователи

## GET /users/me
Возвращает текущего пользователя.

## GET /users/{id}

---

# 3. Создание чата

## POST /chats
Request:
{
  "type": "dialog" | "group",
  "title": "string | null",
  "members": [1, 2, 3]
}

---

# 4. История сообщений

## GET /chats/{id}/messages?limit=50&before_id=123
Response: List<Message>

---

# 5. Модели

## Message
```
{
  "id": 1,
  "chat_id": 123,
  "sender_id": 5,
  "text": "hello",
  "attachments": [Attachment],
  "created_at": "2025-12-03T07:30:12.041Z"
}
```

## Attachment
```
{
  "id": 10,
  "object_key": "uploads/<uuid>/file.png",
  "file_name": "file.png",
  "content_type": "image/png",
  "size_bytes": 12345,
  "url": "https://minio/presigned-or-public-url"
}
```

---

# 6. Presigned URL (файлы)

## POST /attachments/presign
Request:
```
{
  "filename": "image.png",
  "content_type": "image/png",
  "size_bytes": 12345
}
```
Response:
```
{
  "url": "put-url",
  "method": "PUT",
  "expires_in": 600,
  "object_key": "uploads/<uuid>/image.png"
}
```

Флоу: клиент запрашивает presign → загружает файл PUT-ом в `url` с заданным `content_type` → в send_message передает `attachments` с `object_key`/метаданными.

---

# 7. WebSocket Protocol

Коннект: `wss://domain/ws?token=JWT`

## Client → Server

### send_message
```
{
  "type": "send_message",
  "temp_id": "uuid",
  "conversation_id": 123,
  "text": "hello",
  "attachments": [
    {
      "object_key": "uploads/<uuid>/image.png",
      "file_name": "image.png",
      "content_type": "image/png",
      "size_bytes": 12345
    }
  ]
}
```

### typing_start
```
{
  "conversation_id": 123
}
```

### typing_stop
```
{
  "conversation_id": 123
}
```

### delivered/read/online (зарезервировано)
- Не реализовано; при вводе договориться о payload:
  - delivered/read: `{ "type": "delivered"|"read", "message_id": <id> }`
  - online_status: `{ "type": "online_status", "user_id": <id>, "online": true|false }`

---

## Server → Client

### message_sent (ACK)
```
{
  "type": "message_sent",
  "temp_id": "uuid",
  "message": Message
}
```

### new_message
```
{
  "type": "new_message",
  "conversation_id": 123,
  "message": Message
}
```

### typing
```
{
  "type": "typing",
  "conversation_id": 123,
  "user_id": 5,
  "is_typing": true
}
```

### delivered/read/online (зарезервировано)
- Пока не рассылаются.

----
````

----
