# Expense Tracker Frontend

Frontend application for the Expense Tracker built with React, Vite, and Tailwind CSS.

## Features

- User authentication (login/register)
- Dashboard with expense overview
- Add, edit, delete expenses
- Budget management
- Analytics with interactive charts
- Date-based filtering
- CSV export functionality
- Responsive design

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend is running on `http://localhost:5000`

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── context/      # React context (Auth)
│   ├── App.jsx       # Main app component
│   ├── main.jsx      # Entry point
│   └── index.css     # Global styles
├── index.html        # HTML template
├── vite.config.js    # Vite configuration
└── tailwind.config.js # Tailwind configuration
```

## Pages

- **Login** - User login
- **Register** - User registration
- **Dashboard** - Overview of expenses and budgets
- **Expenses** - Manage all expenses
- **Budgets** - Create and manage budgets
- **Analytics** - Detailed charts and reports
- **Profile** - User profile settings

