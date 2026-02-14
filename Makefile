.PHONY: help dev install check db-up db-down test-e2e

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Arranca el servidor de desarrollo unificado (Front + Back)
	@./scripts/dev.sh

install: ## Instala dependencias de Frontend y Backend
	@echo "📦 Instalando dependencias de Frontend..."
	@cd frontend && pnpm install
	@echo "📦 Instalando dependencias de Backend..."
	@cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt

db-up: ## Levanta la base de datos con Docker
	@docker compose up -d db

db-down: ## Detiene la base de datos
	@docker compose stop db

db-seed: ## Puebla la base de datos con datos maestro e iniciales
	@echo "🌱 Poblando base de datos..."
	@cd backend && . venv/bin/activate && python3 scripts/seed.py

check: ## Ejecuta comprobaciones de calidad (Lint + Tests Unitarios)
	@echo "🧹 Ejecutando Linting Frontend..."
	@cd frontend && pnpm lint
	@echo "🧪 Ejecutando Tests de Frontend..."
	@cd frontend && pnpm test
	@echo "🐍 Ejecutando Tests de Backend..."
	@cd backend && . venv/bin/activate && export PYTHONPATH=$$PYTHONPATH:. && pytest

test-e2e: ## Ejecuta tests E2E con Playwright
	@echo "🎭 Ejecutando Tests E2E..."
	@cd frontend && pnpm test:e2e
