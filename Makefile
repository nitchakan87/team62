
# Default target
.PHONY: help
help:
	@echo "ArisePreQ Loan Pre-Qualification System"
	@echo "Available commands:"
	@grep -E '^.PHONY:\s+[^#]*(##.*)?' $(MAKEFILE_LIST) | sort | cut -d ':' -f 2 | awk 'BEGIN {FS = "#"}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


# Start the complete system
.PHONY: start
start:
	@echo "Starting ArisePreQ system..."
	@./scripts/start-system.sh

# Start local development
.PHONY: start-local
start-local:
	@echo "Starting local development..."
	@echo "TODO: fix me - you can docker-compose up here"

# Build all components
.PHONY: build
build:
	@echo "Building backend..."
	@cd backend && echo "TODO: fix me - build backend app"
	@echo "Building frontend..."
	@cd frontend && echo "TODO: fix me - build frontend app"

# Clean build artifacts
.PHONY: clean
clean:
	@echo "Cleaning build artifacts..."
	@echo "Cleaning backend build..."
	cd backend && ./gradlew clean

	@echo "Cleaning frontend dist/..."
	rm -rf frontend/dist/

	@echo "Removing Docker images..."
	docker image rm -f team062-backend || true
	docker image rm -f team062-frontend || true

# Build Docker images
.PHONY: docker-build
docker-build:
	@echo "Building Docker images..."
	@echo "build-backend images..."
	@make build-backend
	@echo "build-frontend images..."
	@make build-frontend

.PHONY: build-backend
build-backend:
	@chmod +x scripts/*.sh
	@./scripts/build-backend.sh

.PHONY: build-frontend
build-frontend:
	@chmod +x scripts/*.sh
	@./scripts/build-frontend.sh

.PHONY: k8s-deploy
k8s-deploy: 
	@echo "Deploying to Kubernetes..."
	@chmod +x scripts/*.sh
	@make build-frontend
	@make build-backend
	@./scripts/k8s-deploy.sh



# Clean Kubernetes resources
.PHONY: k8s-clean
k8s-clean:
	@echo "Cleaning Kubernetes resources..."
	@chmod +x scripts/*.sh     
	@./scripts/k8s-clean.sh

# Backend commands
.PHONY: bed-test-cov
bed-test-cov:
	@echo "Running backend coverage tests..."
	@cd backend && echo "TODO: fix me"

# Run backend tests
.PHONY: bed-test
bed-test:
	@echo "Running backend tests..."
	@cd backend && echo "TODO: fix me"


# Frontend commands
.PHONY: fed-test-cov
fed-test-cov:
	@echo "Running frontend coverage tests..."
	@cd frontend && echo "TODO: fix me"

# Run frontend tests
.PHONY: fed-test
fed-test:
	@echo "Running frontend tests..."
	@cd frontend && echo "TODO: fix me"

# Run e2e
.PHONY: e2e setup-e2e
setup-e2e:
	@./scripts/setup-e2e.sh

e2e: setup-e2e
	@echo "Running e2e tests..."
	@cd e2e && npx playwright test e2e/ --headed --project=chromium

# Run k6 load tests
.PHONY: smoke-test
smoke-test:
	@echo "Running smoke tests..."
	@k6 run k6/01-api-apply-loans.smoke.test.js --env BASE_URL=http://localhost:30090 --vus 1 --iterations 1

.PHONY: load-test
load-test:
	@echo "Running load average tests..."
	@k6 run k6/02-api-apply-loans.average.test.js --env BASE_URL=http://localhost:30090

.PHONY: stress-test
stress-test:
	@echo "Running stress tests..."
	@k6 run k6/03-api-apply-loans.stress.test.js --env BASE_URL=http://localhost:30090

.PHONY: spike-test
spike-test:
	@echo "Running spike tests..."
	@k6 run k6/04-api-apply-loans.spike.test.js --env BASE_URL=http://localhost:30090

.PHONY: load-web-test
load-web-test:
	@echo "Running load web tests..."
	@k6 run k6/06-frontend-web.average.test.js --env FRONTEND_URL=http://localhost:30080

.PHONY: validate-payload-test
validate-payload-test:
	@echo "Running test validate payload..."
	@k6 run k6/05-api-apply-loans.validation.test.js --env BASE_URL=http://localhost:30090  --vus 1 --iterations 1
