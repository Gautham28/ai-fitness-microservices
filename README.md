# Fitness Tracker Microservices

A fitness tracking application built using Spring Boot Microservices, React, RabbitMQ, PostgreSQL, MongoDB, Keycloak, Gemini AI, and Docker.

## Tech Stack

* Java 21
* Spring Boot
* Spring Cloud
* React
* PostgreSQL
* MongoDB
* RabbitMQ
* Keycloak
* Gemini AI
* Docker

## Services

| Service          | Port |
| ---------------- | ---- |
| Config Server    | 8888 |
| Eureka Server    | 8761 |
| API Gateway      | 8080 |
| User Service     | 8081 |
| Activity Service | 8082 |
| AI Service       | 8083 |
| Frontend         | 5173 |

## Architecture

Frontend → API Gateway → Microservices

* User Service → PostgreSQL
* Activity Service → MongoDB
* AI Service → MongoDB
* Activity Service → RabbitMQ → AI Service

All services use:

* Eureka for Service Discovery
* Config Server for Centralized Configuration

## Prerequisites

* Docker and Docker Compose
* Gemini API Key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))

## Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and fill in your values:

```bash
# Required: Get your API key from Google AI Studio
GEMINI_API_KEY=your_gemini_api_key_here

# Required: Set a secure password for PostgreSQL
POSTGRES_PASSWORD=your_secure_password_here
```

## How to Run (start / stop / restart)

### Prerequisites (every time)

1. **Docker Desktop** is installed and running (whale icon in the menu bar, not “starting…”).
2. From the project root:

```bash
cd fitness-app-microservices
```

3. **First time only** — create `.env`:

```bash
cp .env.example .env
# Edit .env: set POSTGRES_PASSWORD and GEMINI_API_KEY
```

4. **First time only** — Docker images must exist (`config-server`, `api-gateway`, etc.). If `docker compose up` fails with “image not found”, build them once (see [Building images](#building-images-first-time-or-after-code-changes)).

---

### Start the project (recommended)

Microservices need **config-server** running before they boot. Use the ordered start script:

```bash
./scripts/start-all.sh
```

Or manually:

```bash
docker compose up -d
# wait ~60 seconds, then if activity/user services show "Exited":
docker compose restart user-service activity-service ai-service api-gateway
```

Keycloak is configured automatically by `keycloak-setup`.

**Check status:**

```bash
docker compose ps
```

You want `keycloak-setup` → **Exited (0)** and most other services → **Up**.

**Open the app:** [http://localhost:5173](http://localhost:5173)

**Login:** `user1` / `user1` (or `user` / `password`)

| URL | Purpose |
| --- | --- |
| http://localhost:5173 | Frontend |
| http://localhost:8080 | API Gateway |
| http://localhost:8181 | Keycloak |
| http://localhost:8761 | Eureka dashboard |
| http://localhost:15672 | RabbitMQ UI (guest / guest) |

---

### Stop the project (end of day)

```bash
docker compose down
```

- Stops all containers.
- **Keeps data** (Postgres, MongoDB, Keycloak realm) in Docker volumes.
- Safe default when you want to resume later.

---

### Restart the project (next day)

1. Start **Docker Desktop**.
2. Run (recommended):

```bash
./scripts/start-all.sh
```

Or:

```bash
docker compose up -d
sleep 60
docker compose restart user-service activity-service ai-service api-gateway
```

3. Wait until `docker compose ps` shows **user-service**, **activity-service**, and **api-gateway** as **Up**.
4. Open [http://localhost:5173](http://localhost:5173) and log in with **user1** / **user1**.

If login shows Keycloak “Page not found”, run `./setup-keycloak.sh`.

**What survives `docker compose down` (without `-v`):** Keycloak realm, Postgres users, MongoDB activities (stored in Docker volumes).

---

### Full reset (wipe all data)

Use only when you want a clean database and Keycloak realm:

```bash
docker compose down -v
docker compose up -d
```

`-v` deletes volumes (activities, users, Keycloak realm). `keycloak-setup` recreates realm and users on the next start.

---

### View logs

```bash
# All services (follow)
docker compose logs -f

# One service
docker compose logs -f api-gateway
docker compose logs -f activity-service
docker compose logs -f keycloak
```

---

### Common issues

| Problem | What to do |
| --- | --- |
| `Cannot connect to the Docker daemon` | Open **Docker Desktop** and wait until it is running. |
| `port 5432: bind: address already in use` | Local Postgres uses 5432; this project maps container Postgres to host **5433** (already configured). |
| Keycloak “Page not found” on login | Run `./setup-keycloak.sh`, or `docker compose up -d` again and wait for `keycloak-setup` to exit 0. |
| Add activity fails / **500 Internal Server Error** | `activity-service` or `user-service` likely crashed on startup. Run `docker compose ps` — if they show **Exited**, run `./scripts/start-all.sh` or `docker compose restart user-service activity-service api-gateway`. Wait 60s, then try again. |
| Users not in pgAdmin / only old rows | The app uses **Docker Postgres on port 5433**, not local Postgres on 5432. In pgAdmin: host `localhost`, port **5433**, database `fitness_user_db`, user/password from `.env`. |
| New logins not in `users` table | Users are saved on the **first API call after login** (not at Keycloak login). Log in, then add or list an activity. Check Docker Postgres on **5433**. |
| UI looks unstyled | Hard refresh: **Cmd + Shift + R**. Rebuild frontend: `docker build -t fitness-frontend ./fitness-app-frontend && docker compose up -d frontend` |

---

### Building images (first time or after code changes)

Microservice images are not pulled from a registry; build from the repo root:

```bash
# Example — repeat for each service you changed, or build all once
docker build -t config-server ./configserver
docker build -t eureka-server ./eureka
docker build -t user-service ./userservice
docker build -t activity-service ./activityservice
docker build -t ai-service ./aiservice
docker build -t api-gateway ./gateway
docker build -t fitness-frontend ./fitness-app-frontend
```

Then:

```bash
docker compose up -d
```

## Features

* User Management
* Activity Tracking
* AI-Powered Recommendations
* OAuth2 Authentication with Keycloak
* Service Discovery
* API Gateway Routing
* Event-Driven Communication using RabbitMQ
* Dockerized Deployment
