import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiAlertCircle } from 'react-icons/fi';
import GlowCard from '../components/GlowCard';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  
  const [formData, setFormData] = useState({
    category: 'Food',
    amount: '',
    period: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: ''
  });

  const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Education', 'Other', 'Total'];

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    // Auto-calculate end date based on period
    if (formData.startDate && formData.period) {
      const startDate = new Date(formData.startDate);
      let endDate = new Date(startDate);
      
      if (formData.period === 'weekly') {
        endDate.setDate(startDate.getDate() + 7);
      } else if (formData.period === 'monthly') {
        endDate.setMonth(startDate.getMonth() + 1);
      } else if (formData.period === 'yearly') {
        endDate.setFullYear(startDate.getFullYear() + 1);
      }
      
      setFormData(prev => ({
        ...prev,
        endDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.startDate, formData.period]);

  const fetchBudgets = async () => {
    try {
      const { data } = await axios.get('/api/budgets');
      setBudgets(data.data);
    } catch (error) {
      toast.error('Error fetching budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await axios.put(`/api/budgets/${editingBudget._id}`, formData);
        toast.success('Budget updated successfully');
      } else {
        await axios.post('/api/budgets', formData);
        toast.success('Budget created successfully');
      }
      resetForm();
      fetchBudgets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving budget');
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount,
      period: budget.period,
      startDate: new Date(budget.startDate).toISOString().split('T')[0],
      endDate: new Date(budget.endDate).toISOString().split('T')[0]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) {
      try {
        await axios.delete(`/api/budgets/${id}`);
        toast.success('Budget deleted successfully');
        fetchBudgets();
      } catch (error) {
        toast.error('Error deleting budget');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category: 'Food',
      amount: '',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: ''
    });
    setEditingBudget(null);
    setShowModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'over':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage > 100) return 'bg-red-600 dark:bg-red-500';
    if (percentage > 80) return 'bg-yellow-500 dark:bg-yellow-400';
    return 'bg-green-600 dark:bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Set and manage your spending limits</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <FiPlus />
          <span>Add Budget</span>
        </button>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.length > 0 ? (
          budgets.map((budget) => {
            const percentage = parseFloat(budget.percentage);
            const isOverBudget = percentage > 100;
            
            return (
              <GlowCard key={budget._id} className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow" glowColor="139, 92, 246">
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{budget.category}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{budget.period}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(budget._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Spent</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{budget.spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{percentage.toFixed(1)}% used</span>
                    {isOverBudget && (
                      <span className="text-xs text-red-600 dark:text-red-400 flex items-center space-x-1">
                        <FiAlertCircle />
                        <span>Over budget!</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 relative z-10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                    <span className={`font-semibold ${budget.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ₹{Math.abs(budget.remaining).toFixed(2)}
                      {budget.remaining < 0 && ' over'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 relative z-10">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(budget.status)}`}>
                    {budget.status === 'good' && 'On Track'}
                    {budget.status === 'warning' && 'Close to Limit'}
                    {budget.status === 'over' && 'Over Budget'}
                  </span>
                </div>
              </GlowCard>
            );
          })
        ) : (
          <div className="col-span-full">
            <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
              <FiAlertCircle className="text-6xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Budgets Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Start managing your finances by creating your first budget</p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors inline-flex items-center space-x-2"
              >
                <FiPlus />
                <span>Create Budget</span>
              </button>
            </GlowCard>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-md w-full my-8 max-h-[90vh] flex flex-col border border-gray-200 dark:border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingBudget ? 'Edit Budget' : 'Create Budget'}
              </h2>
              <button onClick={resetForm} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                <FiX className="text-2xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 p-6 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use "Total" for an overall budget across all categories
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget Amount *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Period *</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date *</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date *</label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Automatically calculated based on period
                </p>
              </div>
              </div>

              <div className="flex space-x-3 p-6 pt-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors"
                >
                  {editingBudget ? 'Update' : 'Create'} Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;

