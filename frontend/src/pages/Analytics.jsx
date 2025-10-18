import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { FiTrendingUp, FiPieChart, FiBarChart2 } from 'react-icons/fi';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from 'recharts';
import GlowCard from '../components/GlowCard';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [budgetComparison, setBudgetComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [period, setPeriod] = useState('month');

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  useEffect(() => {
    fetchAnalytics();
    fetchBudgetComparison();
  }, [dateRange, period]);

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/analytics/expenses', {
        params: { ...dateRange, period }
      });
      setAnalytics(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetComparison = async () => {
    try {
      const { data } = await axios.get('/api/analytics/budget-comparison');
      setBudgetComparison(data.data);
    } catch (error) {
      console.error('Error fetching budget comparison:', error);
    }
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Detailed insights into your spending patterns</p>
      </div>

      {/* Date Range Filter */}
      <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Period</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="day">Daily</option>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
            </select>
          </div>
        </div>
      </GlowCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlowCard className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-lg shadow-md p-6 text-white" glowColor="139, 92, 246">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <FiTrendingUp className="text-3xl" />
            <span className="text-sm opacity-90">Total</span>
          </div>
          <p className="text-3xl font-bold relative z-10">₹{analytics?.totalSpending?.toFixed(2) || '0.00'}</p>
          <p className="text-sm opacity-90 mt-1 relative z-10">Total Spending</p>
        </GlowCard>

        <GlowCard className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-lg shadow-md p-6 text-white" glowColor="16, 185, 129">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <FiBarChart2 className="text-3xl" />
            <span className="text-sm opacity-90">Count</span>
          </div>
          <p className="text-3xl font-bold relative z-10">{analytics?.totalExpenses || 0}</p>
          <p className="text-sm opacity-90 mt-1 relative z-10">Total Transactions</p>
        </GlowCard>

        <GlowCard className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg shadow-md p-6 text-white" glowColor="139, 92, 246">
          <div className="flex items-center justify-between mb-2 relative z-10">
            <FiPieChart className="text-3xl" />
            <span className="text-sm opacity-90">Average</span>
          </div>
          <p className="text-3xl font-bold relative z-10">₹{analytics?.averageExpense || '0.00'}</p>
          <p className="text-sm opacity-90 mt-1 relative z-10">Per Transaction</p>
        </GlowCard>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Breakdown Pie Chart */}
        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white relative z-10">Spending by Category</h2>
          {analytics?.categoryBreakdown && analytics.categoryBreakdown.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category} (${percentage}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                  >
                    {analytics.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-2 relative z-10">
                {analytics.categoryBreakdown.map((item, index) => (
                  <div key={item.category} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.category}: ₹{item.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
              <p>No data available</p>
            </div>
          )}
        </GlowCard>

        {/* Spending Trend Line Chart */}
        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white relative z-10">Spending Trend</h2>
          {analytics?.trendData && analytics.trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
              <p>No data available</p>
            </div>
          )}
        </GlowCard>
      </div>

      {/* Payment Method Breakdown */}
      <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white relative z-10">Payment Method Distribution</h2>
        {analytics?.paymentMethodBreakdown && Object.keys(analytics.paymentMethodBreakdown).length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={Object.keys(analytics.paymentMethodBreakdown).map(method => ({
                method,
                amount: analytics.paymentMethodBreakdown[method]
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="method" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Bar dataKey="amount" fill="#3b82f6">
                {Object.keys(analytics.paymentMethodBreakdown).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
            <p>No data available</p>
          </div>
        )}
      </GlowCard>

      {/* Budget vs Actual Comparison */}
      {budgetComparison.length > 0 && (
        <GlowCard className="bg-white dark:bg-dark-card rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700" glowColor="139, 92, 246">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white relative z-10">Budget vs Actual Spending</h2>
          <div className="overflow-x-auto relative z-10">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Budgeted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-card divide-y divide-gray-200 dark:divide-gray-700">
                {budgetComparison.map((item) => (
                  <tr key={item.category} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ₹{item.budgeted.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                      ₹{item.spent.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                      item.remaining >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      ₹{Math.abs(item.remaining).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              item.percentage > 100 ? 'bg-red-600 dark:bg-red-500' :
                              item.percentage > 80 ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-green-600 dark:bg-green-500'
                            }`}
                            style={{ width: `${Math.min(item.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.status === 'good' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                        item.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                        'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {item.status === 'good' && 'On Track'}
                        {item.status === 'warning' && 'Warning'}
                        {item.status === 'over' && 'Over Budget'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlowCard>
      )}
    </div>
  );
};

export default Analytics;

