import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiPieChart, FiPlus } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import GlowCard from '../components/GlowCard';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/analytics/dashboard');
      setDashboardData(data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const percentageChange = parseFloat(dashboardData?.percentageChange || 0);
  const isIncrease = percentageChange > 0;

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Overview of your expenses and budgets</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{dashboardData?.currentMonth?.total?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dashboardData?.currentMonth?.count || 0} transactions
              </p>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-full">
              <FiDollarSign className="text-primary-600 dark:text-primary-400 text-2xl" />
            </div>
          </div>
        </GlowCard>

        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Last Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{dashboardData?.lastMonth?.total?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {dashboardData?.lastMonth?.count || 0} transactions
              </p>
            </div>
            <div className={`p-3 rounded-full ${isIncrease ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
              {isIncrease ? (
                <FiTrendingUp className="text-red-600 dark:text-red-400 text-2xl" />
              ) : (
                <FiTrendingDown className="text-green-600 dark:text-green-400 text-2xl" />
              )}
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm font-medium ${isIncrease ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
              {isIncrease ? '+' : ''}{percentageChange.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last month</span>
          </div>
        </GlowCard>

        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{dashboardData?.totalBudget?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monthly budget</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <FiPieChart className="text-green-600 dark:text-green-400 text-2xl" />
            </div>
          </div>
        </GlowCard>

        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{dashboardData?.budgetRemaining?.toFixed(2) || '0.00'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Budget left</p>
            </div>
            <div className={`p-3 rounded-full ${
              (dashboardData?.budgetRemaining || 0) > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
            }`}>
              <FiDollarSign className={`text-2xl ${
                (dashboardData?.budgetRemaining || 0) > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`} />
            </div>
          </div>
        </GlowCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Categories */}
        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white relative z-10">Top Spending Categories</h2>
          {dashboardData?.topCategories && dashboardData.topCategories.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData.topCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                >
                  {dashboardData.topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
              <FiPieChart className="text-6xl mb-4" />
              <p>No expense data available</p>
            </div>
          )}
        </GlowCard>

        {/* Recent Expenses */}
        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Expenses</h2>
            <Link
              to="/expenses"
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4 relative z-10">
            {dashboardData?.recentExpenses && dashboardData.recentExpenses.length > 0 ? (
              dashboardData.recentExpenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{expense.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {expense.category} • {format(new Date(expense.date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">₹{expense.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{expense.paymentMethod}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                <FiDollarSign className="text-6xl mb-4" />
                <p>No recent expenses</p>
                <Link
                  to="/expenses"
                  className="mt-4 px-4 py-2 bg-primary-600 dark:bg-primary-700 text-white rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors flex items-center space-x-2"
                >
                  <FiPlus />
                  <span>Add Expense</span>
                </Link>
              </div>
            )}
          </div>
        </GlowCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlowCard
          className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          glowColor="139, 92, 246"
          onClick={() => {}}
        >
          <Link to="/expenses" className="block p-6 relative z-10">
            <div className="flex items-center space-x-3">
              <FiPlus className="text-3xl" />
              <div>
                <h3 className="font-semibold text-lg">Add Expense</h3>
                <p className="text-sm text-primary-100 dark:text-primary-200">Track a new expense</p>
              </div>
            </div>
          </Link>
        </GlowCard>

        <GlowCard
          className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          glowColor="16, 185, 129"
          onClick={() => {}}
        >
          <Link to="/budgets" className="block p-6 relative z-10">
            <div className="flex items-center space-x-3">
              <FiPieChart className="text-3xl" />
              <div>
                <h3 className="font-semibold text-lg">Manage Budgets</h3>
                <p className="text-sm text-green-100 dark:text-green-200">Set spending limits</p>
              </div>
            </div>
          </Link>
        </GlowCard>

        <GlowCard
          className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          glowColor="139, 92, 246"
          onClick={() => {}}
        >
          <Link to="/analytics" className="block p-6 relative z-10">
            <div className="flex items-center space-x-3">
              <FiTrendingUp className="text-3xl" />
              <div>
                <h3 className="font-semibold text-lg">View Analytics</h3>
                <p className="text-sm text-purple-100 dark:text-purple-200">Detailed insights</p>
              </div>
            </div>
          </Link>
        </GlowCard>
      </div>
    </div>
  );
};

export default Dashboard;

