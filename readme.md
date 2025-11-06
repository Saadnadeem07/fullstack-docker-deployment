# A complete Full Stack project from development to VPS deployment using Docker, Docker Compose, Express, and Vite — covering API integration, containerization, and production hosting.

# 🚀 Full Stack Project with Docker, Express & Vite

A complete **Full Stack project** from development to VPS deployment
using **Docker**, **Docker Compose**, **Express**, and **Vite** ---
covering API integration, containerization, and production hosting.

---

## 🧩 Tech Stack

**Frontend:** Vite + React\
**Backend:** Express.js (Node.js)\
**Database:** MongoDB / PostgreSQL (configurable)\
**Containerization:** Docker & Docker Compose\
**Deployment:** VPS (Ubuntu, Nginx, PM2 / Docker)

---

## 📁 Project Structure

    ├── client/               # Frontend (Vite + React)
    │   ├── src/
    │   ├── public/
    │   └── Dockerfile
    │
    ├── server/               # Backend (Express.js)
    │   ├── src/
    │   ├── package.json
    │   └── Dockerfile
    │
    ├── docker-compose.yml    # Docker services configuration
    ├── nginx.conf            # Reverse proxy config for production
    └── README.md

---

## ⚙️ Local Development Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/fullstack-docker-vite-express.git
cd fullstack-docker-vite-express
```

### 2️⃣ Run with Docker Compose

```bash
docker-compose up --build
```

This will spin up both frontend and backend containers.

Access the app at: - Frontend: http://localhost:5173\

- Backend API: http://localhost:5000/api

---

## 🌐 Production Deployment (VPS)

### 1️⃣ Copy files to your VPS

```bash
scp -r . user@your-vps-ip:/var/www/fullstack-app
ssh user@your-vps-ip
```

### 2️⃣ Build and start in detached mode

```bash
docker-compose up -d --build
```

### 3️⃣ Nginx Reverse Proxy Setup

```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/fullstack-app
```

Example configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

Then enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/fullstack-app /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## 🧠 Environment Variables

Create `.env` in both `client/` and `server/` folders.

### Example: `.env` (server)

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=supersecretkey
```

### Example: `.env` (client)

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🐳 Docker Services Overview

```yaml
services:
  client:
    build: ./client
    ports:
      - "5173:5173"
    depends_on:
      - server

  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
```

---

## 🧩 Scripts

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm run dev
```

---

## 🔒 Security Checklist

✅ Use environment variables for secrets\
✅ Enable HTTPS with Nginx + Certbot\
✅ Regularly rebuild images for security patches\
✅ Use non-root Docker users

---

## 🧰 Useful Commands

Task Command

---

Start containers `docker-compose up`
Stop containers `docker-compose down`
Remove images `docker system prune -a`
Check logs `docker-compose logs -f`
SSH into container `docker exec -it <container_id> bash`

---

## ✨ Author

**Saad Nadeem**\
📧 <saadnadeem5509@example.com>\
💼 [LinkedIn](https://www.linkedin.com/in/saadnadeem07)\
🌐 [GitHub](https://github.com/saadnadeem07)

---
