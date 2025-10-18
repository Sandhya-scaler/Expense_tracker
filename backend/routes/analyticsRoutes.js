import express from 'express';
import {
  getExpenseAnalytics,
  getBudgetComparison,
  getDashboardSummary
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/expenses', protect, getExpenseAnalytics);
router.get('/budget-comparison', protect, getBudgetComparison);
router.get('/dashboard', protect, getDashboardSummary);

export default router;

