# Deploy iStudy - Step by Step (Get Public URL)

## 🎯 Goal: Get a public URL you can share

Total time: **10 minutes**

---

## Step 1: Deploy Backend to Railway (5 min)

1. **Go to:** https://railway.app/new
2. **Sign in** with GitHub
3. Click **"Deploy from GitHub repo"**
4. Select repository: `mukhammad7733-crypto/istudy`
5. Railway will auto-detect Django app ✓

**Add Database:**
6. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
7. Railway auto-connects it ✓

**Set Environment Variables:**
8. Click on your service → **"Variables"** tab
9. Add these variables:

```
SECRET_KEY=django-insecure-CHANGE-THIS-TO-RANDOM-STRING-IN-PRODUCTION
DEBUG=False
ALLOWED_HOSTS=${{RAILWAY_PUBLIC_DOMAIN}}
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

10. Click **"Deploy"**

**Get your backend URL:**
11. After deploy, click **"Settings"** → **"Generate Domain"**
12. **Copy this URL** (e.g., `istudy-backend.up.railway.app`)

✅ Backend is live!

---

## Step 2: Deploy Frontend to Vercel (3 min)

1. **Go to:** https://vercel.com/new
2. **Sign in** with GitHub
3. Click **"Import Git Repository"**
4. Select: `mukhammad7733-crypto/istudy`
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `ai-academy-react`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**Set Environment Variable:**
6. Click **"Environment Variables"**
7. Add:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```
   (Use the Railway URL from Step 1)

8. Click **"Deploy"**

**Get your frontend URL:**
9. After deploy, Vercel gives you a URL (e.g., `istudy.vercel.app`)

✅ Frontend is live!

---

## Step 3: Connect Them Together (2 min)

**Update Backend CORS:**
1. Go back to Railway
2. Update `CORS_ALLOWED_ORIGINS` variable:
   ```
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
3. Click **"Redeploy"**

**Create Admin User:**
4. In Railway, open your backend service
5. Click **"View Logs"** → **"Shell"**
6. Run:
   ```bash
   python manage.py createsuperuser
   ```
7. Enter email and password

✅ Everything connected!

---

## Step 4: Test Your App

1. Visit your frontend URL: `https://your-frontend.vercel.app`
2. Try logging in
3. Visit admin: `https://your-backend.railway.app/admin`

---

## 🎉 Your Public URLs:

**Frontend (share this):**
```
https://your-frontend.vercel.app
```

**Backend API:**
```
https://your-backend.railway.app
```

**Admin Panel:**
```
https://your-backend.railway.app/admin
```

---

## 📝 Default Login:

After creating superuser, use those credentials.

Or import test data from localStorage if needed.

---

## 🔥 Alternative: Even Faster (Using Dashboard Only)

**Railway Alternative - One Click:**
1. Go to: https://railway.app/template
2. Search for "Django PostgreSQL"
3. Click "Deploy"
4. Upload your code
5. Done!

**Vercel Alternative - One Click:**
1. Click the button in README.md
2. Connect GitHub
3. Deploy!

---

## ⚠️ Important Notes:

- **Free tiers are limited:**
  - Railway: $5 free credit/month
  - Vercel: Unlimited for hobby projects

- **First deploy takes 2-5 minutes**
  - Subsequent deploys: ~1 minute

- **Auto-deploy on git push:**
  - Both platforms auto-deploy when you push to GitHub

---

## 🆘 Need Help?

**Common Issues:**

1. **Build Failed:**
   - Check logs in platform dashboard
   - Verify environment variables

2. **CORS Error:**
   - Update `CORS_ALLOWED_ORIGINS` with exact URL
   - Make sure it's `https://` not `http://`

3. **Database Error:**
   - Make sure PostgreSQL is added
   - Check `DATABASE_URL` is set

4. **Frontend can't reach backend:**
   - Verify `VITE_API_BASE_URL` has `/api` at end
   - Check backend is deployed and running

---

**Ready? Let's deploy together! Follow the steps above.**

I can guide you through each step if needed!
