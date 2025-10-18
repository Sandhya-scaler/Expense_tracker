# Deployment Guide - Expense Tracker

This guide will help you deploy your Expense Tracker application with the **frontend on Vercel** and the **backend on Render**.

## 📋 Prerequisites

- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Render account (sign up at [render.com](https://render.com))
- MongoDB Atlas account with a database set up

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Prepare Your Backend

1. **Push your code to GitHub** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. **Ensure your backend has these files**:
   - ✅ `backend/package.json`
   - ✅ `backend/server.js`
   - ✅ `backend/.env.example`

### Step 2: Create Web Service on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository**

4. **Configure the service**:
   - **Name**: `Expense_tracker` (or your preferred name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free` (or paid for better performance)

5. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable"
   
   Add these variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_jwt_secret
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

   **Note**: For `MONGODB_URI`, get your connection string from MongoDB Atlas:
   - Go to MongoDB Atlas → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with your database name

6. **Create Web Service**

7. **Wait for deployment** (takes 2-5 minutes)

8. **Copy your backend URL** (e.g., `https://expense-tracker-backend.onrender.com`)

### Step 3: Test Backend

Once deployed, test your backend:
```
https://your-backend-url.onrender.com/api/health
```

You should see: `{"status":"OK","message":"Server is running"}`

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend for Production

1. **Create environment file** for production:

Create `frontend/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace `your-backend-url.onrender.com` with your actual Render backend URL.

2. **Verify `vercel.json` exists** in frontend folder (already created)

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository**

4. **Configure Project**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com`

6. **Click "Deploy"**   

7. **Wait for deployment** (takes 1-3 minutes)

#### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Navigate to frontend folder**:
```bash
cd frontend
```

3. **Login to Vercel**:
```bash
vercel login
```

4. **Deploy**:
```bash
vercel --prod
```

5. **Follow prompts**:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `expense-tracker` (or your preferred name)
   - In which directory: `./`
   - Override settings: `N`

6. **Add environment variables after deployment**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `VITE_API_URL` with your backend URL

---

## 🔄 Part 3: Update Backend CORS Settings

After getting your Vercel URL, update the backend CORS configuration:

1. **Go to Render Dashboard** → Your Web Service → Environment

2. **Update `FRONTEND_URL`**:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```

3. **Save Changes** (this will trigger a redeploy)

---

## 🔧 Part 4: Configure API Calls in Frontend

We need to update the frontend to use the environment variable for API calls.

### Update axios configuration:

Create `frontend/src/config/axios.js`:
```javascript
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
```

Then update all API calls to use this instance instead of the default axios.

---

## ✅ Verification Steps

### 1. Test Backend
```bash
curl https://your-backend-url.onrender.com/api/health
```

### 2. Test Frontend
- Visit your Vercel URL: `https://your-app-name.vercel.app`
- Try to register a new account
- Try to login
- Create an expense
- Check if data persists

### 3. Check Browser Console
- Open Developer Tools (F12)
- Check Console tab for any errors
- Check Network tab to verify API calls are going to the correct URL

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not connecting to MongoDB
- **Solution**: Check MongoDB Atlas → Network Access → Add `0.0.0.0/0` to allow connections from anywhere
- Verify connection string format
- Check environment variables are set correctly

**Problem**: CORS errors
- **Solution**: Verify `FRONTEND_URL` in Render environment variables matches your Vercel URL exactly

### Frontend Issues

**Problem**: API calls failing
- **Solution**: Check `VITE_API_URL` environment variable in Vercel
- Verify backend is deployed and running
- Check browser console for specific error messages

**Problem**: 404 on page refresh
- **Solution**: Verify `vercel.json` exists with correct rewrites configuration

**Problem**: Environment variables not working
- **Solution**: 
  - Make sure variables start with `VITE_`
  - Rebuild and redeploy after adding variables
  - Check Vercel Deployments → Environment Variables

---

## 🔄 Future Deployments

### Auto-Deploy on Git Push

**Vercel**: Automatically deploys when you push to main branch

**Render**: Automatically deploys when you push to main branch

### Manual Deploy

**Vercel**:
```bash
cd frontend
vercel --prod
```

**Render**: Go to Dashboard → Manual Deploy

---

## 🌟 Best Practices

1. **Use Environment Variables**: Never commit `.env` files
2. **Set up CI/CD**: Both Vercel and Render support automatic deployments
3. **Monitor Logs**: 
   - Vercel: Dashboard → Project → Deployments → Function Logs
   - Render: Dashboard → Service → Logs
4. **Use Production Database**: Use a separate MongoDB database for production
5. **Enable HTTPS**: Both platforms provide SSL certificates automatically
6. **Set up Custom Domain** (Optional):
   - Vercel: Dashboard → Project → Settings → Domains
   - Render: Dashboard → Service → Settings → Custom Domain

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

---

## 🎉 Congratulations!

Your Expense Tracker app is now live! Share your deployed URL with others and start tracking expenses in production!

**Frontend URL**: `https://your-app-name.vercel.app`  
**Backend URL**: `https://your-backend-url.onrender.com`

