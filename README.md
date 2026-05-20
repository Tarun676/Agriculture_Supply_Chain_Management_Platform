# 🌾 Agriculture Supply Chain Platform (MVP - Phase 1)

> **Cloud-Native Agriculture Supply Chain Platform with Real-Time Bidding**
> A modern, robust, and scalable platform that empowers farmers to list their agricultural products and buyers to place transparent, real-time bids. Built as an enterprise-grade Capstone Project.

---

## 🏗️ Architecture & Technology Stack

The platform is designed with a cloud-native, microservices-ready architecture:

- **Backend:** Java 17 + Spring Boot 3.x + Maven
- **Database:** PostgreSQL (Containerized via Docker Compose)
- **Containerization:** Docker (Multi-stage build) & Docker Compose
- **Security:** Secure custom authentication using **BCrypt** password hashing
- **CI/CD:** GitHub Actions (Build, compile, and test workflow)
- **Frontend:** React + Vite (Dynamic dashboard & real-time bidding simulation)

---

## 📁 Repository Structure

```text
agri-platform/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI Workflow
├── backend/                   # Spring Boot REST API
│   ├── Dockerfile             # Multi-stage production Dockerfile
│   └── pom.xml                # Maven Dependencies & Configuration
├── frontend/                  # React Frontend
├── docs/                      # Architectural & API Documentation
├── docker-compose.yml         # Local Environment Orchestration (DB + Backend)
└── README.md                  # Main project landing documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
Before running the platform, ensure you have the following installed:
- [Docker & Docker Compose](https://www.docker.com/products/docker-desktop/)
- [Java 17+ JDK](https://adoptium.net/temurin/releases/?version=17) (Optional, if running backend locally without Docker)
- [Node.js v18+](https://nodejs.org/) (Optional, if running frontend locally without Docker)

---

### Running the Complete Platform (Backend + DB)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Tarun676/Agriculture_Supply_Chain_Management_Platform.git
   cd Agriculture_Supply_Chain_Management_Platform
   ```

2. **Start the Infrastructure (Database + pgAdmin):**
   ```bash
   docker compose up -d agri-db agri-pgadmin
   ```
   *Note: This starts PostgreSQL on port `5432` and pgAdmin on `http://localhost:5050`.*
   - **pgAdmin Login:** `admin@agriplatform.com` / `adminpassword`
   - **pgAdmin Connection:** Host: `agri-db`, Port: `5432`, Username: `postgres`, Password: `postgrespassword`, DB: `agri_db`

3. **Run the Spring Boot Backend (Local Development Mode):**
   ```bash
   cd backend
   mvn spring-boot:run
   ```
   *The backend will boot up on `http://localhost:8080`.*

4. **Verify Backend APIs:**
   You can verify the backend APIs using your favorite REST client (e.g., Postman or curl).

---

## 🔌 API Documentation (v1)

### Authentication
- **Register:** `POST /api/auth/register`
  ```json
  {
    "name": "John Farmer",
    "email": "farmer@agri.com",
    "password": "securepassword",
    "role": "FARMER"
  }
  ```
- **Login:** `POST /api/auth/login`
  ```json
  {
    "email": "farmer@agri.com",
    "password": "securepassword"
  }
  ```

### Products
- **Create Product:** `POST /api/products` (Requires request body with `farmerId` matching a registered user)
  ```json
  {
    "name": "Premium Basmati Rice",
    "description": "Long-grain aromatic rice, harvested organically.",
    "price": 2.50,
    "quantity": 1000.0,
    "farmerId": 1
  }
  ```
- **Get All Products:** `GET /api/products`

### Bidding
- **Place a Bid:** `POST /api/bids`
  ```json
  {
    "bidAmount": 2.80,
    "productId": 1,
    "buyerId": 2
  }
  ```
- **Get Bids for Product:** `GET /api/bids/product/{productId}`
  *Returns all bids for the product ordered by amount (highest first).*

---

## 📈 Roadmap & Capstone Milestones
- [x] **Phase 1: Foundation MVP** (Current) - Spring Boot Core + PostgreSQL + Docker Compose + CI/CD
- [ ] **Phase 2: Monolith Expansion** - Full Database Schema, Real-Time WebSockets Bidding, Spring Security
- [ ] **Phase 3: Caching & Optimization** - Redis caching for active highest bids and quick lookup
- [ ] **Phase 4: Microservices Transition** - Decomposition into User, Product, Bid, and Order services
- [ ] **Phase 5: Messaging & Eventing** - RabbitMQ integration for async event processing
- [ ] **Phase 6: Cloud-Native & DevOps** - Kubernetes deployment manifests, EKS/AWS hosting, Prometheus metrics
