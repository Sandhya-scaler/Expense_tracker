# Quick Deployment Steps 🚀

## Before You Start

1. **Create `.env.production` in frontend folder**:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

2. **Ensure MongoDB Atlas is configured**:
   - Go to MongoDB Atlas → Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere)
   - Go to Database Access → Verify user exists with read/write permissions

---

## Step 1️⃣: Deploy Backend to Render (15 minutes)

### A. Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### B. On Render Dashboard

1. Go to https://dashboard.render.com/
2. Click **"New +" → "Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Name**: `expense-tracker-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   
5. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense_tracker
   JWT_SECRET=your_secret_key_min_32_chars_long
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=http://localhost:3000
   ```
   (We'll update FRONTEND_URL after deploying frontend)

6. Click **"Create Web Service"**
7. Wait for deployment (~3 minutes)
8. **Copy your backend URL** (e.g., `https://expense-tracker-backend.onrender.com`)

### C. Test Backend
Visit: `https://your-backend-url.onrender.com/api/health`

Should see: `{"status":"OK","message":"Server is running"}`

---

## Step 2️⃣: Deploy Frontend to Vercel (10 minutes)

### A. Update `.env.production`

In `frontend/.env.production`:
```env
VITE_API_URL=https://your-actual-backend-url.onrender.com
```

Commit and push:
```bash
git add frontend/.env.production
git commit -m "Add production API URL"
git push origin main
```

### B. On Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click **"Add New" → "Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com`

6. Click **"Deploy"**
7. Wait (~2 minutes)
8. **Copy your frontend URL** (e.g., `https://expense-tracker.vercel.app`)

---

## Step 3️⃣: Update Backend with Frontend URL

1. Go back to **Render Dashboard** → Your Web Service
2. Go to **Environment** tab
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
4. Click **"Save Changes"** (will trigger redeploy)

---

## Step 4️⃣: Test Your Deployed App

1. **Visit your Vercel URL**
2. **Register a new account**
3. **Login**
4. **Create an expense**
5. **Verify data persists after refresh**

---

## 🐛 Common Issues & Fixes

### Issue: "Network Error" or API calls failing
**Fix**: 
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend is running on Render
- Check browser console for CORS errors

### Issue: CORS Error
**Fix**:
- Verify `FRONTEND_URL` in Render exactly matches your Vercel URL
- Make sure to include `https://` and no trailing slash

### Issue: MongoDB connection failed
**Fix**:
- Check MongoDB Atlas → Network Access → Add `0.0.0.0/0`
- Verify `MONGODB_URI` format in Render environment variables
- Check database user has correct permissions

### Issue: 404 on page refresh
**Fix**: 
- Verify `frontend/vercel.json` exists with rewrites configuration

### Issue: App works locally but not in production
**Fix**:
- Check all environment variables are set
- Check Vercel deployment logs
- Check Render service logs

---

## 📝 Important Notes

1. **Free Tier Limitations**:
   - Render: Service sleeps after 15 min inactivity (first request takes 30s-1min)
   - Vercel: No sleep, instant access
   - MongoDB Atlas: 512MB storage limit

2. **Environment Variables**:
   - Must start with `VITE_` in frontend
   - Changes require redeployment

3. **Auto-Deploy**:
   - Both platforms auto-deploy on git push to main

4. **Logs**:
   - Render: Dashboard → Service → Logs
   - Vercel: Dashboard → Project → Deployments → Function Logs

---

## ✅ Success Checklist

- [ ] Backend deployed and health check works
- [ ] Frontend deployed and accessible
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can create/view/edit/delete expenses
- [ ] Can create/view/edit/delete budgets
- [ ] Analytics page shows data
- [ ] Data persists after page refresh
- [ ] No console errors in browser
- [ ] Dark mode works

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com/
- **MongoDB Atlas**: https://cloud.mongodb.com/

---

## 🎉 Next Steps

1. **Add Custom Domain** (Optional):
   - Vercel: Settings → Domains
   - Render: Settings → Custom Domain

2. **Set Up Monitoring**:
   - Render has built-in metrics
   - Consider adding Sentry for error tracking

3. **Upgrade Plans** (If needed):
   - Render: Faster response, no sleep
   - MongoDB: More storage

---

**Need more help?** Check `DEPLOYMENT_GUIDE.md` for detailed instructions!

