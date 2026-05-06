# Deployment Guide

This guide covers deploying Voice Cluster to production environments.

## Pre-Deployment Checklist

- [ ] Test with real audio files
- [ ] Update API URLs for production
- [ ] Configure CORS for allowed origins
- [ ] Set up environment variables
- [ ] Enable HTTPS
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Plan backup strategy

## Environment Setup

### Environment Variables

Create `.env` file:

```bash
# Backend
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
BACKEND_WORKERS=4
LOG_LEVEL=info
CORS_ORIGINS=https://yourdomain.com

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_ENV=production
```

### Backend Configuration

**`backend/config.py`** (create new file):
```python
import os
from pathlib import Path

class Config:
    DEBUG = False
    AUDIO_DIR = Path(os.getenv('AUDIO_DIR', 'data/audio'))
    MAX_FILE_SIZE = int(os.getenv('MAX_FILE_SIZE', 100 * 1024 * 1024))  # 100MB
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
    
class ProductionConfig(Config):
    DEBUG = False
    LOG_LEVEL = 'info'
    
class DevelopmentConfig(Config):
    DEBUG = True
    LOG_LEVEL = 'debug'
```

## Local Deployment

### Using Gunicorn

1. **Install Gunicorn:**
   ```bash
   pip install gunicorn
   ```

2. **Run:**
   ```bash
   cd Voice_Cluster
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.api:app
   ```

3. **Configuration:**
   ```bash
   gunicorn \
     -w 4 \
     -k uvicorn.workers.UvicornWorker \
     --bind 0.0.0.0:8000 \
     --access-logfile - \
     --error-logfile - \
     backend.api:app
   ```

### Systemd Service (Linux)

Create `/etc/systemd/system/voice-cluster.service`:

```ini
[Unit]
Description=Voice Cluster API
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/voice-cluster
Environment="PATH=/var/www/voice-cluster/venv/bin"
ExecStart=/var/www/voice-cluster/venv/bin/gunicorn \
    -w 4 \
    -k uvicorn.workers.UvicornWorker \
    --bind 127.0.0.1:8000 \
    backend.api:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable voice-cluster
sudo systemctl start voice-cluster
sudo systemctl status voice-cluster
```

## Cloud Deployment

### Heroku

1. **Create app:**
   ```bash
   heroku create voice-cluster
   ```

2. **Create `Procfile`:**
   ```
   web: gunicorn -w 4 -k uvicorn.workers.UvicornWorker backend.api:app
   release: python -m spacy download en_core_web_sm
   ```

3. **Create `runtime.txt`:**
   ```
   python-3.10.13
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **View logs:**
   ```bash
   heroku logs --tail
   ```

### AWS EC2

1. **Launch instance:**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - 50GB storage

2. **Connect:**
   ```bash
   ssh -i key.pem ubuntu@ec2-instance-ip
   ```

3. **Setup:**
   ```bash
   sudo apt update
   sudo apt install python3.10 python3-pip python3-venv nginx

   # Clone repo
   git clone <repo-url>
   cd Voice_Cluster
   
   # Setup Python
   python3 -m venv venv
   source venv/bin/activate
   pip install -r backend/requirements.txt
   pip install gunicorn
   
   # Setup frontend
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install nodejs
   cd frontend
   npm install
   npm run build
   cd ..
   ```

4. **Configure Nginx:**

Create `/etc/nginx/sites-available/voice-cluster`:

```nginx
upstream voice_cluster {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    client_max_body_size 100M;

    # Frontend
    location / {
        root /var/www/voice-cluster/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://voice_cluster/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # Audio files
    location /data/audio/ {
        alias /var/www/voice-cluster/data/audio/;
        expires 1h;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/voice-cluster /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

5. **SSL Certificate (Let's Encrypt):**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot certonly --nginx -d yourdomain.com
   ```

### Docker Deployment

**Create `Dockerfile` (backend):**

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Application
COPY . .

EXPOSE 8000

CMD ["gunicorn", \
    "-w", "4", \
    "-k", "uvicorn.workers.UvicornWorker", \
    "--bind", "0.0.0.0:8000", \
    "backend.api:app"]
```

**Create `Dockerfile` (frontend):**

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Create `docker-compose.yml`:**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "8000:8000"
    environment:
      - LOG_LEVEL=info
    volumes:
      - ./data:/app/data
    restart: always

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  data:
```

**Deploy:**
```bash
docker-compose up -d
```

### Vercel (Frontend Only)

1. **Create `vercel.json`:**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "env": {
       "VITE_API_URL": "@api_url"
     }
   }
   ```

2. **Deploy:**
   ```bash
   npm i -g vercel
   vercel --cwd frontend
   ```

## Performance Optimization

### Backend

1. **Enable Caching:**
   ```python
   from fastapi_cache2 import FastAPICache2
   from fastapi_cache2.backends.redis import RedisBackend
   from aioredis import from_url
   
   @app.on_event("startup")
   async def startup():
       redis = from_url("redis://localhost")
       FastAPICache2.init(RedisBackend(redis), prefix="fastapi-cache")
   ```

2. **Use Connection Pooling:**
   - Connection pool for database
   - Keep-alive for HTTP

3. **Enable Compression:**
   ```python
   from fastapi.middleware.gzip import GZIPMiddleware
   app.add_middleware(GZIPMiddleware, minimum_size=1000)
   ```

### Frontend

1. **Build Optimization:**
   ```bash
   npm run build -- --minify esbuild
   ```

2. **CDN for Assets:**
   - Serve static files from CDN
   - Cache busting with versioning

3. **Lazy Loading:**
   - Code split routes
   - Load components on demand

## Monitoring & Logging

### Logging

**Backend logging config:**
```python
import logging
import logging.handlers

handler = logging.handlers.RotatingFileHandler(
    'logs/app.log',
    maxBytes=10485760,  # 10MB
    backupCount=10
)
handler.setFormatter(logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
))
logging.getLogger().addHandler(handler)
```

### Monitoring Services

1. **Sentry (Error Tracking):**
   ```python
   import sentry_sdk
   sentry_sdk.init(
       dsn="your-sentry-dsn",
       environment="production",
       traces_sample_rate=1.0
   )
   ```

2. **Prometheus (Metrics):**
   ```bash
   pip install prometheus-client
   ```

3. **Health Checks:**
   ```bash
   # Check endpoint
   curl https://yourdomain.com/health
   ```

## Backup & Recovery

### File Backups

```bash
# Daily backup
0 2 * * * tar -czf /backups/voice-cluster-$(date +%Y%m%d).tar.gz /var/www/voice-cluster/data/
```

### Database Backup

For future database integration:
```bash
# PostgreSQL
pg_dump voice_cluster > backup.sql

# MongoDB
mongodump --db voice_cluster --out /backups/
```

## Security Hardening

1. **HTTPS Only:**
   ```python
   from fastapi.middleware.trustedhost import TrustedHostMiddleware
   app.add_middleware(
       TrustedHostMiddleware,
       allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
   )
   ```

2. **CORS Configuration:**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],
       allow_credentials=True,
       allow_methods=["GET", "POST"],
       allow_headers=["*"],
   )
   ```

3. **Rate Limiting:**
   ```bash
   pip install slowapi
   ```

4. **File Upload Validation:**
   - Check file type (magic numbers)
   - Limit file size
   - Scan for malware

## Scaling

### Horizontal Scaling

1. **Load Balancer:**
   - Nginx (reverse proxy)
   - AWS Application Load Balancer

2. **Multiple Instances:**
   - Docker containers with orchestration
   - Kubernetes for auto-scaling

3. **Distributed Processing:**
   - Redis queue for clustering jobs
   - Worker processes

### Vertical Scaling

- Increase CPU cores
- Increase RAM
- Use GPU for embeddings

## Troubleshooting

### Check Logs
```bash
# Systemd
sudo journalctl -u voice-cluster -f

# Docker
docker logs voice-cluster-backend

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Common Issues

**High Memory Usage:**
- Reduce worker count
- Implement model caching

**Slow Processing:**
- Enable GPU
- Increase resources
- Optimize embeddings

**Connection Refused:**
- Check firewall
- Verify ports open
- Check service running

## Rollback Procedures

```bash
# Git rollback
git revert HEAD
git push

# Docker rollback
docker pull voice-cluster:latest-stable
docker-compose up -d
```

## Support

For deployment issues:
1. Check logs
2. Review troubleshooting section
3. Verify configuration
4. Create GitHub issue with details

## License

See main README.md
