# 📘 **FRONTEND_STRUCTURE.md**

```md
# FRONTEND_STRUCTURE.md
## Структура frontend проекта (React + WebSocket + Zustand + TS)

Frontend — это SPA, полностью разделённый от backend.

---

# 📁 Общая структура

frontend/
│
├── src/
│   ├── api/
│   │   ├── generated/
│   │   │   └── (TS-клиент сгенерированный из OpenAPI)
│   │   ├── ws/
│   │   │   ├── ws_client.ts
│   │   │   ├── ws_events.ts
│   │   │   └── ws_manager.ts
│   │   └── http/
│   │       ├── auth.ts
│   │       ├── chats.ts
│   │       └── messages.ts
│   │
│   ├── store/
│   │   ├── useAuthStore.ts
│   │   ├── useChatStore.ts
│   │   ├── useMessageStore.ts
│   │   └── useWSStore.ts
│   │
│   ├── components/
│   │   ├── ChatList/
│   │   ├── MessageList/
│   │   ├── MessageInput/
│   │   ├── FileUploader/
│   │   └── Layout/
│   │
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Chats.tsx
│   │   └── ChatRoom.tsx
│   │
│   ├── utils/
│   │   ├── token.ts
│   │   └── formatting.ts
│   │
│   ├── hooks/
│   │   ├── useWebSocket.ts
│   │   └── useMessages.ts
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── Dockerfile
├── vite.config.ts
├── package.json
├── .env
└── README.md

---

# 📘 Описание директорий

## 📁 /api/generated/
Автогенерируемый TS-клиент по OpenAPI.

Запрещено изменять вручную!

## 📁 /api/ws/
Вебсокеты:
- ws_client.ts — подключение  
- ws_events.ts — типы событий  
- ws_manager.ts — reconnection logic  

## 📁 /store/
Все Zustand store:
- auth  
- chats  
- messages  
- websocket  

## 📁 /components/
Атомарные и модульные UI-компоненты.

## 📁 /pages/
Маршруты:
- /login  
- /register  
- /chats  
- /chat/:id  

## 📁 /hooks/
Переиспользуемые данные (React hooks):
- useWebSocket  
- useMessages  

---

# ✨ Требования

Frontend должен:
- использовать TS client (OpenAPI codegen)  
- использовать WebSocket протокол строго по API_CONTRACT.md  
- не содержать бизнес-логики  
- только отображение и отправка данных  
```

---
