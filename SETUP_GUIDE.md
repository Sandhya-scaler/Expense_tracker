# Expense Tracker - Quick Setup Guide

Follow these steps to get your Expense Tracker application up and running.

## Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)
- **npm** (comes with Node.js) or **yarn**

## Step-by-Step Setup

### 1. MongoDB Setup

**Option A: Local MongoDB**
1. Install MongoDB on your computer
2. Start MongoDB service:
   - Windows: MongoDB should start automatically after installation
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

**Option B: MongoDB Atlas (Cloud - Recommended for beginners)**
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/expense_tracker`)

### 2. Backend Setup

1. Open a terminal and navigate to the backend folder:
```bash
cd backend
```

2. Install all backend dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` folder:
```bash
# For Windows PowerShell
New-Item .env

# For Mac/Linux
touch .env
```

4. Open the `.env` file and add these variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Note:** If using MongoDB Atlas, replace the `MONGODB_URI` with your Atlas connection string.

5. Start the backend server:
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
```

### 3. Frontend Setup

1. Open a **NEW terminal** window/tab (keep the backend running)

2. Navigate to the frontend folder:
```bash
cd frontend
```

3. Install all frontend dependencies:
```bash
npm install
```

4. Start the frontend development server:
```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

### 4. Access the Application

1. Open your web browser
2. Go to: `http://localhost:3000`
3. You should see the login page!

## First Time Usage

1. **Register**: Click on "Sign up now" to create your account
2. **Login**: Use your credentials to log in
3. **Add Expenses**: Click "Add Expense" to track your first expense
4. **Set Budgets**: Go to the Budgets page to set spending limits
5. **View Analytics**: Check the Analytics page for insights

## Common Issues & Solutions

### Backend Issues

**Problem:** `MongoNetworkError: failed to connect to server`
- **Solution**: Make sure MongoDB is running
  - Local: Check if MongoDB service is started
  - Atlas: Verify your connection string and network access settings

**Problem:** `Port 5000 is already in use`
- **Solution**: Change the PORT in your `.env` file to another number (e.g., 5001)

### Frontend Issues

**Problem:** `npm ERR! code ENOENT`
- **Solution**: Make sure you're in the correct directory (`frontend` folder) and run `npm install`

**Problem:** Cannot connect to backend
- **Solution**: Ensure the backend server is running on `http://localhost:5000`

**Problem:** `Port 3000 is already in use`
- **Solution**: The Vite dev server will automatically suggest another port (3001), just press 'y'

## Development Workflow

### Running Both Servers

You need **TWO terminal windows**:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

### Stopping the Servers

Press `Ctrl + C` in each terminal window to stop the servers.

## Building for Production

### Backend
The backend runs as-is in production. Just use:
```bash
cd backend
npm start
```

### Frontend
To build the frontend for production:
```bash
cd frontend
npm run build
```

The production files will be in the `frontend/dist` folder.

## Project Features

✅ User authentication (register/login)
✅ Add, edit, delete expenses
✅ Categorize expenses
✅ Set and track budgets
✅ Interactive dashboard
✅ Analytics with charts
✅ Date-based filtering
✅ CSV export
✅ Responsive design

## Tech Stack Summary

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- MVC Architecture

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router
- Recharts (for graphs)
- Axios (API calls)

## Need Help?

If you encounter any issues:
1. Check that both servers are running
2. Verify MongoDB is connected
3. Check the browser console for errors (F12)
4. Check terminal logs for error messages

## Next Steps

After setup:
- Customize the categories to match your needs
- Set up your monthly budgets
- Start tracking your expenses
- Explore the analytics features

Enjoy tracking your expenses! 💰📊

