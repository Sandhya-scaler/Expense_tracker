import express from 'express';
import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget
} from '../controllers/budgetController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getBudgets)
  .post(protect, createBudget);

router.route('/:id')
  .get(protect, getBudgetById)
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

export default router;

