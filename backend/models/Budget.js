import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other', 'Total']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: 0
  },
  period: {
    type: String,
    enum: ['monthly', 'weekly', 'yearly'],
    default: 'monthly'
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure unique budget per category per user per period
budgetSchema.index({ user: 1, category: 1, period: 1 }, { unique: true });

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;

