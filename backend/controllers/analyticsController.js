import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';

// @desc    Get expense analytics
// @route   GET /api/analytics/expenses
// @access  Private
export const getExpenseAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, period = 'month' } = req.query;
    
    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query);

    // Total spending
    const totalSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Category-wise breakdown
    const categoryBreakdown = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    // Convert to array format for charts
    const categoryData = Object.keys(categoryBreakdown).map(category => ({
      category,
      amount: categoryBreakdown[category],
      percentage: ((categoryBreakdown[category] / totalSpending) * 100).toFixed(2)
    }));

    // Payment method breakdown
    const paymentMethodBreakdown = expenses.reduce((acc, expense) => {
      if (!acc[expense.paymentMethod]) {
        acc[expense.paymentMethod] = 0;
      }
      acc[expense.paymentMethod] += expense.amount;
      return acc;
    }, {});

    // Time-based spending (for trend charts)
    const timeBasedSpending = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      let key;
      
      if (period === 'day') {
        key = date.toLocaleDateString();
      } else if (period === 'week') {
        const weekNum = Math.ceil((date.getDate()) / 7);
        key = `Week ${weekNum} - ${date.toLocaleDateString('default', { month: 'short' })}`;
      } else {
        key = date.toLocaleDateString('default', { month: 'short', year: 'numeric' });
      }

      if (!timeBasedSpending[key]) {
        timeBasedSpending[key] = 0;
      }
      timeBasedSpending[key] += expense.amount;
    });

    const trendData = Object.keys(timeBasedSpending).map(period => ({
      period,
      amount: timeBasedSpending[period]
    }));

    res.json({
      success: true,
      data: {
        totalSpending,
        totalExpenses: expenses.length,
        averageExpense: expenses.length > 0 ? (totalSpending / expenses.length).toFixed(2) : 0,
        categoryBreakdown: categoryData,
        paymentMethodBreakdown,
        trendData
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get budget vs spending comparison
// @route   GET /api/analytics/budget-comparison
// @access  Private
export const getBudgetComparison = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });

    const comparison = await Promise.all(
      budgets.map(async (budget) => {
        const query = {
          user: req.user._id,
          date: { $gte: budget.startDate, $lte: budget.endDate }
        };

        if (budget.category !== 'Total') {
          query.category = budget.category;
        }

        const expenses = await Expense.find(query);
        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remaining = budget.amount - totalSpent;
        const percentage = budget.amount > 0 ? (totalSpent / budget.amount) * 100 : 0;

        return {
          category: budget.category,
          budgeted: budget.amount,
          spent: totalSpent,
          remaining,
          percentage: percentage.toFixed(2),
          status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
        };
      })
    );

    res.json({
      success: true,
      data: comparison
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard summary
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardSummary = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    // Current month expenses
    const currentMonthExpenses = await Expense.find({
      user: req.user._id,
      date: { $gte: currentMonth, $lt: nextMonth }
    });

    const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Last month expenses for comparison
    const lastMonthExpenses = await Expense.find({
      user: req.user._id,
      date: { $gte: lastMonth, $lt: currentMonth }
    });

    const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate percentage change
    const percentageChange = lastMonthTotal > 0 
      ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(2)
      : 0;

    // Total budget for current month
    const currentBudgets = await Budget.find({
      user: req.user._id,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate }
    });

    const totalBudget = currentBudgets.reduce((sum, budget) => sum + budget.amount, 0);

    // Recent expenses
    const recentExpenses = await Expense.find({ user: req.user._id })
      .sort('-date')
      .limit(5);

    // Top spending categories this month
    const categoryTotals = currentMonthExpenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    }, {});

    const topCategories = Object.keys(categoryTotals)
      .map(category => ({
        category,
        amount: categoryTotals[category]
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        currentMonth: {
          total: currentMonthTotal,
          count: currentMonthExpenses.length
        },
        lastMonth: {
          total: lastMonthTotal,
          count: lastMonthExpenses.length
        },
        percentageChange,
        totalBudget,
        budgetRemaining: totalBudget - currentMonthTotal,
        recentExpenses,
        topCategories
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

