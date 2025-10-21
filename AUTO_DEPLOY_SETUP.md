# 🚀 Auto-Deploy Setup - Get Your Links in 3 Minutes!

## ✨ What This Does:

**Every time you push to GitHub → Your app auto-deploys to Vercel!**

You'll get a public URL like: `https://istudy-xyz.vercel.app`

---

## 📋 Quick Setup (3 Steps, 3 Minutes)

### Step 1: Get Vercel Token (1 minute)

1. Go to: **https://vercel.com/account/tokens**
2. Click **"Create Token"**
3. Name it: `GitHub Actions`
4. Scope: Choose your account
5. Expiration: No Expiration
6. Click **"Create Token"**
7. **Copy the token** (starts with `vercel_...`)

**IMPORTANT:** Save this token somewhere safe! You'll need it in next step.

---

### Step 2: Add Token to GitHub (1 minute)

1. Go to your GitHub repo: **https://github.com/mukhammad7733-crypto/istudy**
2. Click **"Settings"** (top menu)
3. In left sidebar, click **"Secrets and variables"** → **"Actions"**
4. Click **"New repository secret"**
5. Name: `VERCEL_TOKEN`
6. Value: Paste the token from Step 1
7. Click **"Add secret"**

---

### Step 3: Trigger Deploy (1 minute)

#### Option A: Push to GitHub (Automatic)

```bash
# Make any small change
cd D:\Developer\ai-study
echo "# Auto-deploy enabled" >> README.md

# Push to GitHub
git add .
git commit -m "Enable auto-deploy"
git push
```

**GitHub Action will start automatically!**

#### Option B: Manual Trigger (No push needed)

1. Go to: **https://github.com/mukhammad7733-crypto/istudy/actions**
2. Click **"Deploy to Vercel"** (left sidebar)
3. Click **"Run workflow"** button (right side)
4. Click green **"Run workflow"** button
5. Wait 2-3 minutes

---

## 🎉 Get Your Link!

### Where to find your URL:

**Option 1: GitHub Actions**
1. Go to: **https://github.com/mukhammad7733-crypto/istudy/actions**
2. Click on the latest workflow run
3. Scroll down - you'll see: **"🚀 Deployed to Vercel: https://your-url.vercel.app"**

**Option 2: Vercel Dashboard**
1. Go to: **https://vercel.com/dashboard**
2. Find your project `istudy`
3. Click on it
4. You'll see the URL at the top

**Option 3: Commit Comment**
- GitHub will add a comment to your commit with the URL!

---

## ✅ Your Public Links:

After deploy completes, you'll have:

**Frontend (share this!):**
```
https://istudy-[random].vercel.app
```

You can also set a custom domain later in Vercel!

---

## 🔄 How Auto-Deploy Works:

```
You push to GitHub
    ↓
GitHub Action triggers
    ↓
Builds your React app
    ↓
Deploys to Vercel
    ↓
You get a URL! 🎉
```

**Every push = auto-deploy!**

---

## 🎯 Next Steps (Optional):

### Add Backend (Railway):

1. Go to: **https://railway.app/new**
2. Sign in with GitHub
3. Click **"Deploy from GitHub repo"**
4. Select `istudy` repo
5. Add PostgreSQL database
6. Railway gives you backend URL

Then update your Vercel environment variable:
```
VITE_API_BASE_URL=https://your-railway-url.railway.app/api
```

### Set Custom Domain:

1. In Vercel dashboard
2. Go to your project → Settings → Domains
3. Add your custom domain
4. Follow DNS instructions

---

## 🆘 Troubleshooting:

### "Error: Invalid token"
- Make sure you copied the full Vercel token
- Token should start with `vercel_`
- Check it's added to GitHub Secrets correctly

### "Build failed"
- Check the error in Actions tab
- Usually it's a missing dependency or wrong config
- Read the error log for details

### "Deployment succeeded but site not working"
- Need to add backend URL
- Set `VITE_API_BASE_URL` in Vercel dashboard
- Or add it to `.env.production` file

### "No URL shown"
- Wait for the workflow to complete (2-3 min)
- Check Actions tab for the URL
- Or go to Vercel dashboard

---

## 📊 Monitoring:

**GitHub Actions:**
- See all deploys: https://github.com/mukhammad7733-crypto/istudy/actions
- Get email on failures

**Vercel:**
- Analytics in Vercel dashboard
- See visitors, performance, errors

---

## 💡 Pro Tips:

1. **Deploy on every push:**
   - Just push to main branch
   - Auto-deploys in 2-3 minutes

2. **Preview deployments:**
   - Create a branch
   - Push to it
   - Vercel creates preview URL

3. **Rollback:**
   - In Vercel dashboard
   - Go to Deployments
   - Click "Promote to Production" on any old version

4. **Environment Variables:**
   - Add in Vercel dashboard → Settings → Environment Variables
   - Or add to GitHub Secrets and update workflow

---

## ✅ Checklist:

- [ ] Got Vercel token from vercel.com/account/tokens
- [ ] Added VERCEL_TOKEN to GitHub Secrets
- [ ] Pushed to GitHub or triggered workflow manually
- [ ] Waited 2-3 minutes for deploy
- [ ] Got public URL from Actions or Vercel dashboard
- [ ] Tested the URL - it works!
- [ ] Shared the URL with others! 🎉

---

## 🎁 What You Get:

✅ **Auto-deploy** - Push = Live in 2 min
✅ **Public URL** - Share with anyone
✅ **Free hosting** - Vercel hobby plan
✅ **HTTPS** - Automatic SSL
✅ **Global CDN** - Fast worldwide
✅ **Preview deploys** - Test before merge
✅ **Analytics** - See your visitors
✅ **Zero downtime** - Seamless updates

---

## 🚀 Ready?

Follow the 3 steps above and **you'll have your public link in 3 minutes!**

**Questions? Issues? Let me know which step you're stuck on!**

---

Generated with [Claude Code](https://claude.com/claude-code)
