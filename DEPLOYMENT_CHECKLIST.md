# 🚀 Deployment Checklist

## ✅ Pre-Deployment (Already Done!)

- [x] Created `vercel.json` for frontend routing
- [x] Created axios configuration with environment variables
- [x] Updated backend CORS for production
- [x] Updated all axios imports in frontend
- [x] Created deployment documentation

---

## 📝 What You Need to Do

### 1. Create Environment Files

#### Backend `.env` file
You need to manually create `backend/.env` with:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key_min_32_chars
PORT=5000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000
```

#### Frontend `.env.production` file
You need to manually create `frontend/.env.production` with:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```
*(You'll update this after deploying backend)*

---

### 2. Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

---

### 3. Deploy Backend to Render

**Time: ~15 minutes**

1. Go to https://dashboard.render.com/
2. Sign up or login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `expense-tracker-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Instance Type: Free

6. Add environment variables (same as backend `.env` above)
7. Click "Create Web Service"
8. **Copy the URL** once deployed

---

### 4. Deploy Frontend to Vercel

**Time: ~10 minutes**

1. Update `frontend/.env.production` with your Render backend URL
2. Commit and push to GitHub
3. Go to https://vercel.com/dashboard
4. Click "Add New" → "Project"
5. Import your GitHub repo
6. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Add environment variable:
   - `VITE_API_URL` = your Render backend URL
8. Click "Deploy"
9. **Copy the Vercel URL** once deployed

---

### 5. Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to Environment tab
4. Update `FRONTEND_URL` to your Vercel URL
5. Save (will trigger redeploy)

---

### 6. Test Your App! 🎉

1. Visit your Vercel URL
2. Register a new account
3. Create some expenses
4. Check if data persists
5. Test all features

---

## 📚 Documentation Files

- **`QUICK_DEPLOYMENT_STEPS.md`** - Step-by-step deployment guide
- **`DEPLOYMENT_GUIDE.md`** - Detailed deployment instructions
- **`UPDATE_AXIOS_IMPORTS.md`** - Technical notes on axios configuration

---

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Verify `FRONTEND_URL` in Render matches Vercel URL exactly
   - Check both URLs use `https://`

2. **API Not Connecting**
   - Verify `VITE_API_URL` in Vercel environment variables
   - Check Render service is running

3. **MongoDB Connection Failed**
   - Add `0.0.0.0/0` to MongoDB Atlas network access
   - Verify connection string format

4. **404 on Page Refresh**
   - Verify `vercel.json` exists in frontend folder

---

## 🎯 Quick Links

- **Render Dashboard**: https://dashboard.render.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com/

---

## 💡 Tips

1. **Free Tier**: Render sleeps after 15 min (first request takes ~30s)
2. **Environment Variables**: Changes require redeployment
3. **Auto-Deploy**: Both platforms auto-deploy on git push
4. **Logs**: Check logs if something doesn't work
   - Render: Service → Logs
   - Vercel: Project → Deployments → Function Logs

---

## ✨ After Deployment

- [ ] Test all features thoroughly
- [ ] Share your app URL!
- [ ] Consider adding a custom domain
- [ ] Monitor usage and performance

---

**Good luck with your deployment! 🚀**

Need help? Check the detailed guides or the troubleshooting section!

