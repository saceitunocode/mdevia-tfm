.PHONY: help dev install check db-up db-down

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Arranca el servidor de desarrollo unificado (Front + Back)
	@./dev.sh

install: ## Instala dependencias de Frontend y Backend
	@echo "📦 Instalando dependencias de Frontend..."
	@cd frontend && pnpm install
	@echo "📦 Instalando dependencias de Backend..."
	@cd backend && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt

db-up: ## Levanta la base de datos con Docker
	@docker-compose up -d db

db-down: ## Detiene la base de datos
	@docker-compose stop db

check: ## Ejecuta comprobaciones de calidad (Lint, Tests) - Placeholder
	@echo "🚧 Pendiente de configurar herramientas de calidad (TFM-51)"
