COMPOSE = docker compose

.PHONY: up down logs backend frontend celery ps migrate env

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down -v

logs:
	$(COMPOSE) logs -f

backend:
	$(COMPOSE) restart backend

frontend:
	$(COMPOSE) restart frontend

celery:
	$(COMPOSE) restart celery

ps:
	$(COMPOSE) ps

migrate:
	@echo "Alembic migrations will be added once the DB models are defined."

env:
	@test -f .env || cp .env.example .env
