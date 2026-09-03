.PHONY: help install-all dev test test-backend test-frontend build lint format clean docker-up docker-down

help:
	@echo "HIMARKA Development Automation Commands"
	@echo "========================================="
	@echo "make install-all    - Install frontend & backend dependencies"
	@echo "make dev            - Run backend and frontend concurrently"
	@echo "make test           - Run full test suite (frontend + backend)"
	@echo "make test-backend   - Run pytest suite"
	@echo "make test-frontend  - Run vitest suite"
	@echo "make lint           - Lint backend and frontend"
	@echo "make format         - Autoformat code"
	@echo "make docker-up      - Launch docker-compose environment"
	@echo "make docker-down    - Teardown docker-compose environment"

install-all:
	cd frontend && npm install
	pip install -r backend/requirements.txt

test: test-backend test-frontend

test-backend:
	pytest backend/tests -v

test-frontend:
	cd frontend && npm run test

docker-up:
	docker compose up -d

docker-down:
	docker compose down
