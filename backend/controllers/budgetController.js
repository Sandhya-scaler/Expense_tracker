import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
export const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort('-createdAt');

    // Calculate spending for each budget
    const budgetsWithSpending = await Promise.all(
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
          ...budget.toObject(),
          spent: totalSpent,
          remaining: remaining,
          percentage: percentage.toFixed(2)
        };
      })
    );

    res.json({
      success: true,
      count: budgetsWithSpending.length,
      data: budgetsWithSpending
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
export const getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
export const createBudget = async (req, res) => {
  try {
    const { category, amount, period, startDate, endDate } = req.body;

    // Check if budget already exists for this category and period
    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category,
      period
    });

    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: 'Budget already exists for this category and period'
      });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount,
      period,
      startDate: startDate || Date.now(),
      endDate
    });

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
export const updateBudget = async (req, res) => {
  try {
    let budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: budget
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    if (budget.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await budget.deleteOne();

    res.json({
      success: true,
      message: 'Budget deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

