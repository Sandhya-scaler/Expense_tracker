# Expense Tracker Backend

Backend API for the Expense Tracker application built with Express.js, MongoDB, and Node.js.

## Features

- User authentication with JWT
- CRUD operations for expenses
- Budget management
- Analytics and reporting
- CSV export functionality
- Date-based filtering

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Start MongoDB server

4. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)

### Expenses
- `GET /api/expenses` - Get all expenses (Protected)
- `GET /api/expenses/:id` - Get single expense (Protected)
- `POST /api/expenses` - Create new expense (Protected)
- `PUT /api/expenses/:id` - Update expense (Protected)
- `DELETE /api/expenses/:id` - Delete expense (Protected)
- `GET /api/expenses/export/csv` - Export expenses to CSV (Protected)

### Budgets
- `GET /api/budgets` - Get all budgets (Protected)
- `GET /api/budgets/:id` - Get single budget (Protected)
- `POST /api/budgets` - Create new budget (Protected)
- `PUT /api/budgets/:id` - Update budget (Protected)
- `DELETE /api/budgets/:id` - Delete budget (Protected)

### Analytics
- `GET /api/analytics/expenses` - Get expense analytics (Protected)
- `GET /api/analytics/budget-comparison` - Get budget vs spending comparison (Protected)
- `GET /api/analytics/dashboard` - Get dashboard summary (Protected)

## MVC Architecture

```
backend/
├── config/        # Database configuration
├── models/        # Mongoose models
├── controllers/   # Request handlers
├── routes/        # API routes
├── middleware/    # Custom middleware
└── server.js      # Entry point
```

