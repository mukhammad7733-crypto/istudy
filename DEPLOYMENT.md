# Deployment Guide - iStudy Platform

Complete guide for deploying iStudy platform to various hosting providers.

## Table of Contents

1. [Quick Deploy Options](#quick-deploy-options)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Variables](#environment-variables)
6. [Production Checklist](#production-checklist)

---

## Quick Deploy Options

### One-Click Deployments

**Frontend:**
- [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mukhammad7733-crypto/istudy)
- [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mukhammad7733-crypto/istudy)

**Backend:**
- [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)
- [![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

---

## Frontend Deployment

### 1. Vercel (Recommended)

**Via Vercel CLI:**

```bash
cd ai-academy-react

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

**Via Vercel Dashboard:**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Framework Preset: **Vite**
4. Root Directory: `ai-academy-react`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add environment variable:
   - `VITE_API_BASE_URL`: Your backend API URL

**Configuration:** Already included in `vercel.json`

---

### 2. Netlify

**Via Netlify CLI:**

```bash
cd ai-academy-react

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# For production
netlify deploy --prod
```

**Via Netlify Dashboard:**

1. Go to [netlify.com](https://www.netlify.com)
2. New site from Git
3. Connect to GitHub
4. Base directory: `ai-academy-react`
5. Build command: `npm run build`
6. Publish directory: `dist`
7. Environment variables:
   - `VITE_API_BASE_URL`: Your backend URL

**Configuration:** Already included in `netlify.toml`

---

### 3. GitHub Pages

```bash
cd ai-academy-react

# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Note:** Update `vite.config.js` with base path:
```js
export default {
  base: '/istudy/',
}
```

---

## Backend Deployment

### 1. Railway (Recommended for Django)

**Via Railway CLI:**

```bash
cd ai-academy-backend

# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

**Via Railway Dashboard:**

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Select your repository
4. Add PostgreSQL database (from service catalog)
5. Set environment variables (see below)
6. Deploy!

**Required Environment Variables:**
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.railway.app
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

### 2. Render

**Via Render Dashboard:**

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Root Directory: `ai-academy-backend`
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `gunicorn backend.wsgi:application`
7. Add PostgreSQL database
8. Set environment variables

**Configuration File** (`render.yaml` - optional):

```yaml
services:
  - type: web
    name: istudy-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn backend.wsgi:application
    envVars:
      - key: SECRET_KEY
        generateValue: true
      - key: DEBUG
        value: False
      - key: DATABASE_URL
        fromDatabase:
          name: istudy-db
          property: connectionString
```

---

### 3. Heroku

```bash
cd ai-academy-backend

# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=your-app.herokuapp.com
heroku config:set CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser
```

**Files included:**
- `Procfile` - Heroku process file
- `runtime.txt` - Python version

---

### 4. DigitalOcean App Platform

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create → Apps
3. Connect GitHub
4. Choose repository
5. Configure component:
   - Type: Web Service
   - Source Directory: `ai-academy-backend`
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `gunicorn backend.wsgi:application`
6. Add managed PostgreSQL database
7. Set environment variables
8. Deploy

---

## Docker Deployment

### Local Development with Docker

```bash
# Build and run all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Access services:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Database: localhost:5432
```

### Production Docker Deployment

**Build images:**

```bash
# Backend
cd ai-academy-backend
docker build -t istudy-backend:latest .

# Frontend
cd ai-academy-react
docker build -t istudy-frontend:latest .
```

**Run containers:**

```bash
# Run PostgreSQL
docker run -d \
  --name istudy-db \
  -e POSTGRES_DB=istudy \
  -e POSTGRES_USER=istudy \
  -e POSTGRES_PASSWORD=your_password \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15

# Run Backend
docker run -d \
  --name istudy-backend \
  --link istudy-db:db \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://istudy:your_password@db:5432/istudy \
  -e SECRET_KEY=your-secret-key \
  -e ALLOWED_HOSTS=your-domain.com \
  istudy-backend:latest

# Run Frontend
docker run -d \
  --name istudy-frontend \
  -p 80:80 \
  istudy-frontend:latest
```

### Docker Registry (DockerHub/GitHub Container Registry)

```bash
# Tag images
docker tag istudy-backend:latest your-username/istudy-backend:latest
docker tag istudy-frontend:latest your-username/istudy-frontend:latest

# Push to registry
docker push your-username/istudy-backend:latest
docker push your-username/istudy-frontend:latest
```

---

## Environment Variables

### Frontend (.env)

```env
# API URL (required)
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

### Backend (.env)

```env
# Django Core (required)
SECRET_KEY=your-very-secret-key-here-change-in-production
DEBUG=False
ALLOWED_HOSTS=your-backend.railway.app,your-backend.herokuapp.com

# Database (required for production)
DATABASE_URL=postgresql://user:password@host:5432/database

# CORS (required)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-frontend.netlify.app

# Optional
SECURE_SSL_REDIRECT=True
DJANGO_LOG_LEVEL=INFO
```

---

## Production Checklist

### Before Deploying

- [ ] Update `SECRET_KEY` to a secure random value
- [ ] Set `DEBUG=False`
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Configure `CORS_ALLOWED_ORIGINS` with frontend URL
- [ ] Set up PostgreSQL database (not SQLite)
- [ ] Update `VITE_API_BASE_URL` to production backend
- [ ] Review and update all environment variables
- [ ] Test local build: `npm run build` (frontend)
- [ ] Test Docker build if using Docker

### After Deploying

- [ ] Run database migrations
- [ ] Create Django superuser
- [ ] Test API endpoints
- [ ] Test frontend-backend connection
- [ ] Configure SSL/HTTPS (most platforms auto-configure)
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/logging
- [ ] Set up automated backups
- [ ] Test all major features

### Security

- [ ] Enable HTTPS (SSL)
- [ ] Configure CORS properly
- [ ] Set secure session cookies
- [ ] Enable HSTS headers
- [ ] Disable DEBUG in production
- [ ] Use environment variables for secrets
- [ ] Regular dependency updates
- [ ] Monitor for security vulnerabilities

---

## Common Commands

### Backend

```bash
# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Check deployment readiness
python manage.py check --deploy
```

### Frontend

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm ci
```

### Docker

```bash
# Rebuild specific service
docker-compose up --build backend

# View service logs
docker-compose logs -f backend

# Execute command in running container
docker-compose exec backend python manage.py migrate

# Remove all containers and volumes
docker-compose down -v
```

---

## Troubleshooting

### CORS Errors
- Ensure backend `CORS_ALLOWED_ORIGINS` includes frontend URL
- Check that URLs match exactly (https vs http, www vs non-www)

### Database Connection Issues
- Verify `DATABASE_URL` format
- Check database is running and accessible
- Ensure migrations are applied

### Static Files Not Loading
- Run `collectstatic` command
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Verify whitenoise is installed and configured

### Build Failures
- Check Node/Python versions match requirements
- Clear cache: `npm ci` or `pip install --no-cache-dir`
- Review build logs for specific errors

---

## Support

For issues or questions:
1. Check documentation
2. Review deployment logs
3. Open an issue on GitHub
4. Contact support

---

**Generated with [Claude Code](https://claude.com/claude-code)**
