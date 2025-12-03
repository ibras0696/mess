COMPOSE = docker compose

.PHONY: up down restart logs logs-backend logs-frontend backend frontend celery ps migrate env init clean

# Поднять всё
up:
	$(COMPOSE) up -d --build

# Полностью остановить (с сохранением томов)
down:
	$(COMPOSE) down

# Полностью остановить и удалить тома (очистка БД/Redis/MinIO)
down-clean:
	$(COMPOSE) down -v

# Быстрый рестарт всего стека (с сохранением данных)
restart:
	$(COMPOSE) down && $(COMPOSE) up -d --build

# Рестарт с очисткой томов (полный ресет БД/Redis/MinIO)
restart-clean:
	$(COMPOSE) down -v && $(COMPOSE) up -d --build

# Совместимость: старое имя без удаления томов
restart-full:
	$(COMPOSE) down && $(COMPOSE) up -d --build


# Общие логи
logs:
	$(COMPOSE) logs -f

# Логи отдельных сервисов
logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend

backend:
	$(COMPOSE) restart backend

frontend:
	$(COMPOSE) restart frontend

celery:
	$(COMPOSE) restart celery

ps:
	$(COMPOSE) ps

migrate:
	$(COMPOSE) run --rm backend alembic upgrade head

# Создать .env из примера
env:
	@test -f .env || cp .env.example .env

# Первичная инициализация (env + up)
init: env up

# Очистка артефактов Playwright/временных файлов (без git clean)
clean:
	rm -rf frontend/tmp-repro.js frontend/tmp-repro.png /tmp/playwright* || true

# Быстрый вывод команды очистки токенов в браузере
clear-storage:
	@echo "Вставь в консоль браузера для очистки localStorage:" && \
	echo "localStorage.removeItem('wm.access'); localStorage.removeItem('wm.refresh'); localStorage.clear(); console.log('cleared localStorage');"

# Перезапуск без удаления томов (сохраняет БД/Redis)
restart-novols:
	$(COMPOSE) down && $(COMPOSE) up -d
