# Web Messenger Frontend (React + Vite + Tailwind)

Стартовый спринт фронтенда для браузерного мессенджера.

## Стек
- React 19 + Vite + TypeScript
- TailwindCSS 3
- Zustand (стейт менеджер)
- Dockerfile под dev (`npm run dev -- --host`)

## Быстрый старт (локально без Docker)
```bash
cd frontend
npm install
npm run dev -- --host --port 3000
```

## Через docker-compose
```bash
make up         # собирает image и стартует фронт на :3000
make frontend   # рестарт фронта
```

## Структура (ключевые каталоги)
- `src/api/generated` — автоген OpenAPI клиент (не править руками)
- `src/api/ws` — WebSocket клиент/типы
- `src/store` — Zustand стейт: auth, chats, messages, ws
- `src/pages` — маршруты (login/register/chats/chat/:id)
- `src/components` — UI блоки (ChatList, MessageList, MessageInput и т.д.)

## ENV
- `VITE_API_URL` (по умолчанию http://localhost:8000/api)
- `VITE_WS_URL` (по умолчанию ws://localhost:8000/ws)

## Tailwind
`src/styles/globals.css` — подключение Tailwind и базовые стили (фон, шрифт Space Grotesk).
