# Deploy iStudy Now - Quick Guide

Ready to deploy? Follow these simple steps!

## 🚀 Fastest Way to Deploy

### Option 1: One-Click Deploy (5 minutes)

**Frontend (Vercel - Recommended):**
1. Click: [![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mukhammad7733-crypto/istudy)
2. Connect your GitHub account
3. Wait for build to complete
4. Get your URL (e.g., `istudy-frontend.vercel.app`)
5. Copy this URL - you'll need it for backend

**Backend (Railway - Recommended):**
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `istudy` repository
5. Add PostgreSQL database (from Add Service)
6. Set environment variables:
   ```
   SECRET_KEY=your-random-secret-key-here
   DEBUG=False
   ALLOWED_HOSTS=your-app.railway.app
   CORS_ALLOWED_ORIGINS=https://istudy-frontend.vercel.app
   DATABASE_URL=${Postgres.DATABASE_URL}
   ```
7. Deploy!
8. Copy your backend URL

**Connect Frontend to Backend:**
1. Go back to Vercel project settings
2. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```
3. Redeploy frontend

✅ **Done! Your app is live!**

---

### Option 2: Deploy with Docker (10 minutes)

**Prerequisites:**
- Docker installed
- Docker Compose installed

**Steps:**
```bash
# Clone repository
git clone https://github.com/mukhammad7733-crypto/istudy.git
cd istudy

# Start all services
docker-compose up -d

# Access application:
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Admin: http://localhost:8000/admin
```

**For production Docker deployment:**
See [DEPLOYMENT.md](./DEPLOYMENT.md) Section "Docker Deployment"

---

### Option 3: Deploy to Heroku + Netlify (15 minutes)

**Backend (Heroku):**
```bash
cd ai-academy-backend

# Login to Heroku
heroku login

# Create app
heroku create istudy-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS=istudy-backend.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate

# Create admin user
heroku run python manage.py createsuperuser
```

**Frontend (Netlify):**
```bash
cd ai-academy-react

# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Set environment variable in Netlify dashboard:
# VITE_API_BASE_URL=https://istudy-backend.herokuapp.com/api
```

---

## 📋 Quick Deployment Checklist

Before deploying, make sure you have:

- [ ] GitHub account
- [ ] Account on deployment platform (Vercel/Railway/Netlify/Heroku)
- [ ] Updated `SECRET_KEY` to a secure random value
- [ ] Set `DEBUG=False` for production
- [ ] Configured `ALLOWED_HOSTS` with your domain
- [ ] Set `CORS_ALLOWED_ORIGINS` with frontend URL
- [ ] Updated `VITE_API_BASE_URL` with backend URL

---

## 🔑 Required Environment Variables

### Frontend
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### Backend
```env
SECRET_KEY=your-very-long-random-secret-key
DEBUG=False
ALLOWED_HOSTS=your-backend-domain.com
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

---

## 🆘 Need Help?

### Common Issues:

**CORS Errors:**
- Make sure backend `CORS_ALLOWED_ORIGINS` includes exact frontend URL
- Check https vs http

**Database Connection:**
- Verify `DATABASE_URL` is correct
- Make sure database is created
- Run migrations: `python manage.py migrate`

**Build Failures:**
- Check Node.js version (need 18+)
- Check Python version (need 3.10+)
- Clear build cache and retry

### Get More Help:
- **Full Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **API Integration:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **Quick Start:** [QUICK_START.md](./QUICK_START.md)
- **GitHub Issues:** https://github.com/mukhammad7733-crypto/istudy/issues

---

## 🎯 Deployment Platforms Comparison

| Platform | Type | Free Tier | Best For | Difficulty |
|----------|------|-----------|----------|------------|
| **Vercel** | Frontend | ✅ Yes | React/Vite apps | ⭐ Easy |
| **Netlify** | Frontend | ✅ Yes | Static sites | ⭐ Easy |
| **Railway** | Backend | ✅ Yes (limited) | Django/Node | ⭐⭐ Easy |
| **Render** | Backend | ✅ Yes | Full-stack apps | ⭐⭐ Easy |
| **Heroku** | Backend | ⚠️ Paid only | Production apps | ⭐⭐ Medium |
| **Docker** | Both | ✅ Self-host | Full control | ⭐⭐⭐ Medium |

---

## 🎉 After Deployment

1. **Test your application:**
   - Visit frontend URL
   - Try logging in
   - Check admin panel: `your-backend-url.com/admin`

2. **Create admin user:**
   ```bash
   # Railway/Render
   Run from dashboard console: python manage.py createsuperuser

   # Heroku
   heroku run python manage.py createsuperuser

   # Docker
   docker-compose exec backend python manage.py createsuperuser
   ```

3. **Set up custom domain (optional):**
   - Vercel/Netlify: Add custom domain in dashboard
   - Railway/Render/Heroku: Add custom domain in settings

4. **Monitor your app:**
   - Check logs regularly
   - Set up error tracking (optional)
   - Monitor performance

---

**Ready to deploy? Choose your platform and follow the steps above!**

**Questions? Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.**

---

Generated with [Claude Code](https://claude.com/claude-code)
