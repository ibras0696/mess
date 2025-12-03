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

# 5. Presigned URL (файлы)

## POST /attachments/presign
Request:
{
  "filename": "image.png",
  "content_type": "image/png"
}

Response:
{
  "url": "put-url",
  "method": "PUT",
  "expires_in": 600
}

---

# 6. WebSocket Protocol

Коннект:
wss://domain/ws?token=JWT

## Client → Server

### send_message
{
  "type": "send_message",
  "temp_id": "uuid",
  "conversation_id": 123,
  "text": "hello",
  "attachments": []
}

### typing_start
{
  "conversation_id": 123
}

### typing_stop
{
  "conversation_id": 123
}

---

## Server → Client

### message_sent (ACK)
{
  "type": "message_sent",
  "temp_id": "uuid",
  "message": {...}
}

### new_message
{
  "type": "new_message",
  "conversation_id": 123,
  "message": {...}
}

### typing
{
  "type": "typing",
  "conversation_id": 123,
  "user_id": 5
}

### delivered
{
  "type": "delivered",
  "message_id": 55
}

### read
{
  "type": "read",
  "message_id": 55
}

### online_status
{
  "type": "online_status",
  "user_id": 1,
  "online": true
}

---
````

---
