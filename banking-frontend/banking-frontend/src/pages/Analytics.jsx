import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
  "#F97316", // orange
  "#6366F1", // indigo
];

function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [chartType, setChartType] = useState("pie"); // 'pie' or 'bar'

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch transactions
    fetch("http://127.0.0.1:8000/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error(err));

    // Fetch spending by category from insights
    fetch("http://127.0.0.1:8000/insights/spending-by-category", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item, index) => ({
          ...item,
          color: COLORS[index % COLORS.length],
        }));
        setCategoryData(formattedData);
      })
      .catch((err) => console.error(err));
  }, []);

  // Calculate totals
  const totalExpense = categoryData.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Income</p>
          <p className="text-2xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Expense</p>
          <p className="text-2xl font-bold text-red-500">₹{totalExpense.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Balance</p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{(totalIncome - totalExpense).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Spending by Category Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Spending by Category
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("pie")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                chartType === "pie"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                chartType === "bar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Bar Chart
            </button>
          </div>
        </div>

        {categoryData.length > 0 ? (
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              {chartType === "pie" ? (
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
label={({ category, percent }) =>
                      `${category}: ${Math.abs(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="category"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `₹${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              ) : (
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="category"
                    type="category"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => `₹${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="amount" name="Amount">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <p>No categorized transactions yet. Add categories to see the chart.</p>
          </div>
        )}
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Category Breakdown
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-right">% of Total</th>
                <th className="py-3 px-4 font-semibold">Visual</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.category}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">
                    ₹{item.amount.toFixed(2)}
                  </td>
<td className="py-3 px-4 text-right text-gray-600">
                    {totalExpense > 0
                      ? Math.abs((item.amount / totalExpense) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                  <td className="py-3 px-4 w-32">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${
                            totalExpense > 0
                              ? Math.abs((item.amount / totalExpense) * 100)
                              : 0
                          }%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
