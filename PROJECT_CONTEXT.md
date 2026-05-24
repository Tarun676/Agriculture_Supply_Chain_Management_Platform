# Project Context: Agriculture Supply Chain Platform (DevOps Capstone)

This document serves as the single source of truth for the project context, technical architecture, and roadmap. It is highly optimized for AI-assisted development (e.g., Claude, Gemini) to quickly understand the codebase state and plan implementation.

---

## 🌾 Project Overview
*   **Name:** Agriculture Supply Chain Management Platform
*   **Description:** A cloud-native, microservices-ready agriculture platform that allows farmers to list organic produce and enables buyers to place transparent, real-time bids.
*   **Objective:** Elevate a basic Java/React MVP into a premium, resume-worthy DevOps Capstone project hosted on Azure with Infrastructure as Code (IaC), GitOps CI/CD, Kubernetes, and Observability.

---

## 🛠️ Tech Stack & Tooling

### Core Application
*   **Backend:** Java 17 + Spring Boot 3.2.5 + Maven
*   **Frontend:** React (v19) + Vite (Javascript-based UI)
*   **Database:** PostgreSQL 15 (Alpine)

### DevOps & Cloud Infrastructure (Azure Production-Ready)
*   **Cloud Provider:** Microsoft Azure (utilizing Azure Student $5,000 credit)
*   **Orchestration:** Azure Kubernetes Service (AKS) — utilizing a single cost-effective burstable VM node (`Standard_B2s` with stop/start automation to preserve credits)
*   **Container Registry:** Azure Container Registry (ACR) for private image hosting
*   **Infrastructure as Code (IaC):** Terraform (`.tf` configurations for provisioning AKS, ACR, and networks)
*   **Kubernetes Networking & Ingress:** NGINX Ingress Controller (single public IP, path-based routing: `/api` for Spring Boot, `/` for React) + `cert-manager` (Let's Encrypt SSL/TLS)
*   **CI/CD Pipeline:** GitHub Actions (compiling, running unit tests, building Docker images, pushing to ACR, and applying Kubernetes manifests)
*   **Observability Stack:** Prometheus & Grafana (deployed via Helm) for monitoring JVM performance and cluster metrics

---

## 📁 Repository Structure
```text
agri-platform/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI Workflow (Java compilation & tests)
├── backend/                   # Spring Boot API
│   ├── Dockerfile             # Multi-stage production Java JRE build
│   ├── pom.xml                # Maven Dependencies (Web, JPA, Security, Websocket, H2)
│   └── src/                   # Source code (com.agri.platform)
│       ├── config/            # SecurityConfig.java (Current: permitAll)
│       ├── controller/        # REST APIs (Auth, Bid, Product)
│       ├── entity/            # JPA Entities (User, Product, Bid, Order, Wishlist)
│       ├── repository/        # Spring Data JPA repositories
│       └── service/           # Business logic (User, Product, Bid)
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx            # Single-page dynamic bidding dashboard & simulation
│   │   ├── index.css          # Vanilla global styles
│   │   └── App.css            # Component level styles
│   └── package.json           # React dependencies
├── docker-compose.yml         # Local DB & pgAdmin container orchestration
└── README.md                  # Developer Quick-start
```

---

## ⚙️ Environment Variables & Configs

### Backend (application.properties fallbacks)
*   `DB_HOST` (Default: `localhost` | Prod: Kubernetes Service Name / Azure Managed IP)
*   `DB_PORT` (Default: `5432`)
*   `DB_NAME` (Default: `agri_db`)
*   `DB_USER` (Default: `postgres`)
*   `DB_PASSWORD` (Default: `postgrespassword`)

### Ingress / Networking Rules (Target Configuration)
*   `/*` (React Frontend Container)
*   `/api/*` (Spring Boot Backend Container)

---

## 🚀 Current Progress & Features Completed
*   [x] **Seeded Admin Account:** Root operator (`penumuditarun@gmail.com` / `Tarun@0607`) populated on application startup via `DataSeeder.java`.
*   [x] **JWT Security Integration:** Custom, secure stateless token manager (`TokenService.java`) and interceptor (`JwtAuthenticationFilter.java`) fully enforce stateless bearer token authentication.
*   [x] **Real-Time WebSockets Engine:** Native HTML5 WebSockets mapped to a custom Spring Boot `BiddingWebSocketHandler.java` at `/ws/bids` to sync bids across browser windows instantly.
*   [x] **Premium Glassmorphism UI:** Stunning dark slate HSL design, hover micro-animations, glass cards, dynamic crop countdown clocks, and live toast outbid notifications.
*   [x] **Admin Moderator Dashboard:** Dynamic moderator desk displaying user registry metrics, crop catalogs, and de-registration triggers.
*   *   [x] **Local Infrastructure:** Full local DB + pgAdmin + backend JRE + frontend NGINX stack orchestrated under a single `docker-compose.yml` config.
*   *   [x] **Peak DevOps CI Workflow:** Expanded `.github/workflows/ci.yml` that compiles Maven, builds Vite assets, and tests multi-stage Dockerfile builds in parallel in the cloud runner.

---

## ⚠️ Current Issues & Architectural Gaps
1.  **No Cloud IaC / Manifests:** No Terraform files or Kubernetes YAML manifests (AKS Deployments, Services, ConfigMaps, Ingress paths) created yet (Scheduled for AKS Phase).
2.  **No Helm / Prometheus Monitoring:** Cluster JVM and resource scraping setup is pending cluster deployment.

---

## 🏢 Target DevOps Architecture
```mermaid
graph TD
    User([End User / Browser]) -->|HTTP / HTTPS| Ingress[NGINX Ingress Controller]
    
    subgraph AKS Cluster (Single Node: Standard_B2s)
        Ingress -->|Path: / | FrontendPod[React App Pod - Port 80]
        Ingress -->|Path: /api/* | BackendPod[Spring Boot Pod - Port 8080]
        
        subgraph Monitoring Namespace
            Prometheus[Prometheus Server] -.->|Scrapes JVM / K8s Metrics| BackendPod
            Grafana[Grafana Dashboard] -->|Visualizes| Prometheus
        end
    end

    BackendPod -->|JPA / JDBC| ProductionDB[(PostgreSQL)]
```

---

## 🎯 Important Architectural Decisions (ADRs)
1.  **Azure for Cloud Hosting:** Selected Microsoft Azure over AWS to utilize the user's $5,000 Student credit, enabling a production-grade Kubernetes cluster for free.
2.  **Raw AKS (Option B) for Compute:** Chosen raw Kubernetes over Serverless (ACA) to maximize hands-on DevOps resume experience with YAML and Helm.
3.  **NGINX Ingress with Path Routing:** Routes all traffic through one public IP to minimize cloud load-balancer costs.
4.  **Terraform for Provisioning:** Direct resource creation will be fully scripted with Terraform to enforce declarative Infrastructure as Code.
5.  **Prometheus & Grafana via Helm:** Custom-configured to track Spring Boot metrics (`micrometer-registry-prometheus`) to show advanced system engineering capability.

---

## 📋 Upcoming DevOps Capstone Roadmap

### Phase 1: Dockerize Frontend & Secure Spring Boot
*   Create an optimized, production-grade Dockerfile for the React/Vite frontend using an NGINX base image.
*   Implement JWT-based stateless authentication in Spring Boot and restrict Spring Security routes.
*   Configure actual WebSockets / STOMP configuration in Spring Boot for real-time bids.

### Phase 2: Write Kubernetes YAML Manifests
*   Create local-deployable Kubernetes manifests (`deployment.yml`, `service.yml`, `configmap.yml`, `secret.yml`) for:
    *   PostgreSQL (StatefulSet + Persistent Volume Claim)
    *   Spring Boot Backend
    *   React Frontend

### Phase 3: Infrastructure as Code (Terraform)
*   Write Terraform files (`main.tf`, `variables.tf`, `outputs.tf`) to provision:
    *   Azure Resource Group
    *   Azure Container Registry (ACR)
    *   Azure Kubernetes Service (AKS) with a single `Standard_B2s` pool.

### Phase 4: Production GitOps CI/CD
*   Extend `.github/workflows/ci.yml` to:
    *   Build frontend and backend Docker containers.
    *   Log in to Azure and push images to ACR.
    *   Deploy updated manifests to AKS on every push to `main`.

### Phase 5: Monitoring & SSL Setup
*   Install NGINX Ingress and `cert-manager` for SSL padlocks.
*   Deploy Prometheus & Grafana using Helm and build a dashboard showing application JVM performance and resource utilization.

---

## ⌨️ Frequently Used Commands

### Local Operations
```bash
# Start local DB + pgAdmin
docker compose up -d

# Stop local DB + pgAdmin
docker compose down

# Run backend locally
cd backend
mvn spring-boot:run

# Run frontend locally
cd frontend
npm install
npm run dev
```

### Production / Kubernetes Target Commands (Draft)
```bash
# Stop AKS Cluster (to save credits)
az aks stop --name <cluster-name> --resource-group <rg-name>

# Start AKS Cluster
az aks start --name <cluster-name> --resource-group <rg-name>

# Get credentials for kubectl
az aks get-credentials --resource-group <rg-name> --name <cluster-name>
```
