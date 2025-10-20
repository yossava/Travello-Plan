'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  transportation: number;
  shopping: number;
  emergencyFund: number;
  total: number;
  perPerson: number;
  dailyAverage: number;
}

interface BudgetSectionProps {
  budgetBreakdown: BudgetBreakdown;
  currency: string;
  travelers: number;
}

export default function BudgetSection({
  budgetBreakdown,
  currency,
  travelers,
}: BudgetSectionProps) {
  const categories = [
    { name: 'Flights', value: budgetBreakdown.flights, color: '#3b82f6' },
    {
      name: 'Accommodation',
      value: budgetBreakdown.accommodation,
      color: '#10b981',
    },
    { name: 'Food', value: budgetBreakdown.food, color: '#f59e0b' },
    { name: 'Activities', value: budgetBreakdown.activities, color: '#8b5cf6' },
    {
      name: 'Transportation',
      value: budgetBreakdown.transportation,
      color: '#ec4899',
    },
    { name: 'Shopping', value: budgetBreakdown.shopping, color: '#06b6d4' },
    {
      name: 'Emergency Fund',
      value: budgetBreakdown.emergencyFund,
      color: '#ef4444',
    },
  ].filter((cat) => cat.value > 0);

  const calculatePercentage = (value: number) => {
    return ((value / budgetBreakdown.total) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Total Budget Card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-8 text-white">
        <div className="text-center">
          <h3 className="text-lg font-medium opacity-90 mb-2">
            Total Trip Cost
          </h3>
          <div className="text-4xl sm:text-5xl font-bold mb-4 break-words">
            {currency} {budgetBreakdown.total.toLocaleString()}
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs sm:text-sm opacity-90">Per Person</div>
              <div className="text-xl sm:text-2xl font-semibold break-words">
                {currency} {budgetBreakdown.perPerson.toLocaleString()}
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-xs sm:text-sm opacity-90">Daily Average</div>
              <div className="text-xl sm:text-2xl font-semibold break-words">
                {currency} {budgetBreakdown.dailyAverage.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Budget Distribution
          </h3>
          {/* Mobile Chart */}
          <div className="sm:hidden">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="40%"
                  labelLine={false}
                  label={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `${currency} ${value.toLocaleString()}`
                  }
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  iconSize={10}
                  formatter={(value, entry) => (
                    <span className="text-xs">
                      {value} ({calculatePercentage((entry as { payload: { value: number } }).payload.value)}%)
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Desktop Chart */}
          <div className="hidden sm:block">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${calculatePercentage(entry.value)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `${currency} ${value.toLocaleString()}`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detailed Breakdown
          </h3>
          <div className="space-y-3">
            {categories.map((category, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {category.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {currency} {category.value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${calculatePercentage(category.value)}%`,
                      backgroundColor: category.color,
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {calculatePercentage(category.value)}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Cost Summary</h3>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Per Person
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {currency} {category.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {currency} {(category.value / travelers).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                    {calculatePercentage(category.value)}%
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-50 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {currency} {budgetBreakdown.total.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {currency} {budgetBreakdown.perPerson.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {categories.map((category, idx) => (
            <div key={idx} className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm font-semibold text-gray-900">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {calculatePercentage(category.value)}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 block text-xs mb-1">Total</span>
                  <span className="text-gray-900 font-medium">
                    {currency} {category.value.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-1">Per Person</span>
                  <span className="text-gray-600 font-medium">
                    {currency} {(category.value / travelers).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Mobile Total */}
          <div className="px-4 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900">Total</span>
              <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                100%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-500 block text-xs mb-1">Total</span>
                <span className="text-gray-900 font-bold">
                  {currency} {budgetBreakdown.total.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block text-xs mb-1">Per Person</span>
                <span className="text-gray-900 font-bold">
                  {currency} {budgetBreakdown.perPerson.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-1">
              Budget Recommendations
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>
                Consider adding 10-15% buffer for unexpected expenses
              </li>
              <li>
                Emergency fund of {currency}{' '}
                {budgetBreakdown.emergencyFund.toLocaleString()} is included
              </li>
              <li>Book flights and accommodation early for better rates</li>
              <li>
                Daily spending limit: {currency}{' '}
                {budgetBreakdown.dailyAverage.toLocaleString()} per person
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
