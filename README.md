# 🚀 DevOps Starter Kit

A production-ready DevOps scaffold for **Flask** and **Node.js** applications — batteries included.

---

## 📁 Project Structure

```
devops-starter-kit/
├── docker/
│   ├── flask/
│   │   ├── Dockerfile          # Multi-stage Python/Flask image
│   │   └── requirements.txt    # Pinned Python dependencies
│   └── node/
│       └── Dockerfile          # Multi-stage Node.js image
├── ci-cd/
│   ├── flask-deploy.yml        # GitHub Actions: Flask pipeline
│   └── node-deploy.yml         # GitHub Actions: Node pipeline
├── examples/
│   └── docker-compose.yml      # Full local dev stack
├── README.md
└── LICENSE
```

---

## ⚡ Quick Start

### Prerequisites

| Tool | Min Version |
|------|-------------|
| Docker | 24+ |
| Docker Compose | v2.20+ |
| Git | 2.40+ |

### 1. Clone & launch

```bash
git clone https://github.com/your-org/devops-starter-kit.git
cd devops-starter-kit

# Start the full stack (Postgres, Redis, Flask, Node, Nginx, Celery)
docker compose -f examples/docker-compose.yml up --build
```

| Service | URL |
|---------|-----|
| Flask API | http://localhost:5000 |
| Node App | http://localhost:3000 |
| Nginx (proxy) | http://localhost:80 |
| Flower (Celery) | http://localhost:5555 |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

### 2. Build images individually

```bash
# Flask
docker build -f docker/flask/Dockerfile -t my-flask-app .

# Node.js
docker build -f docker/node/Dockerfile -t my-node-app .
```

---

## 🔄 CI/CD Pipelines

Both pipelines live in `ci-cd/` and are designed for **GitHub Actions**.

### How it works

```
Push to main
    │
    ▼
┌─────────┐    ┌────────────────┐    ┌──────────────┐
│  Lint & │───▶│ Build & Push   │───▶│  Deploy via  │
│  Test   │    │ Docker Image   │    │  SSH + Pull  │
└─────────┘    └────────────────┘    └──────────────┘
```

### Required GitHub Secrets

Add these under **Settings → Secrets and variables → Actions**:

| Secret | Description |
|--------|-------------|
| `PROD_HOST` | Production server IP or domain |
| `PROD_USER` | SSH username |
| `PROD_SSH_KEY` | Private SSH key (PEM format) |
| `CODECOV_TOKEN` | Codecov upload token (optional) |

### Copy pipelines to your repo

```bash
mkdir -p .github/workflows
cp ci-cd/flask-deploy.yml .github/workflows/
cp ci-cd/node-deploy.yml  .github/workflows/
```

---

## 🐳 Docker Details

### Flask Image Highlights

- **Multi-stage build** — builder stage keeps the final image lean
- **Non-root user** — runs as `appuser` for security
- **Gunicorn** — 4-worker production WSGI server
- **Health check** — hits `/health` every 30 s

### Node Image Highlights

- **Alpine-based** — minimal surface area
- **3-stage build** — deps → builder (tsc/vite) → runtime
- **Non-root user** — runs as `appuser`
- **Health check** — wget probe on `/health`

---

## 🛠️ Local Development Tips

### Hot reload (Flask)

Mount your source directory:

```yaml
volumes:
  - ./app:/app/app
```

Then run Flask in dev mode by setting `FLASK_ENV=development`.

### Hot reload (Node)

```yaml
volumes:
  - ./src:/app/src
```

Use `nodemon` or `tsx watch` in your dev `CMD`.

### Database migrations

```bash
docker exec -it flask_app flask db upgrade
```

### Run tests inside container

```bash
# Flask
docker exec -it flask_app pytest --cov=app

# Node
docker exec -it node_app npm test
```

---

## 🔐 Security Checklist

- [ ] Replace all `dev-secret-*` values with real secrets in production
- [ ] Use a `.env` file (never commit it) or a secrets manager (Vault, AWS SSM)
- [ ] Enable HTTPS in Nginx with real TLS certs (Let's Encrypt)
- [ ] Set `POSTGRES_PASSWORD` to a strong random value
- [ ] Restrict Redis to the internal network only (already done via `internal: true`)
- [ ] Rotate SSH keys regularly

---

## 📦 Extending the Stack

### Add a new service

1. Add a `Dockerfile` under `docker/<service>/`
2. Add a service block to `examples/docker-compose.yml`
3. Create a new CI/CD pipeline in `ci-cd/`

### Switch to Kubernetes

The Docker images produced by this kit are Kubernetes-ready. Point your `image:` field in your Deployment manifests to the GHCR image pushed by the CI/CD pipeline.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.
