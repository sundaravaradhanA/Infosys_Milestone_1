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
  const [chartType, setChartType] = useState("pie");
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userId = 1;

    try {
      // Fetch transactions
      const txnResponse = await fetch(
        `http://127.0.0.1:8000/transactions?user_id=${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (txnResponse.ok) {
        const txnData = await txnResponse.json();
        setTransactions(txnData);
      }

      // Fetch spending by category with month filter
      const categoryResponse = await fetch(
        `http://127.0.0.1:8000/insights/spending-by-category?user_id=${userId}&month=${selectedMonth}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (categoryResponse.ok) {
        const catData = await categoryResponse.json();
        const formattedData = catData.map((item, index) => ({
          ...item,
          color: COLORS[index % COLORS.length],
        }));
        setCategoryData(formattedData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalExpense = categoryData.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Month Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Analytics</h2>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Income</p>
          <p className="text-2xl font-bold text-green-600">{formatAmount(totalIncome)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Total Expense</p>
          <p className="text-2xl font-bold text-red-500">{formatAmount(totalExpense)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500 text-sm">Balance</p>
          <p className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-red-600"}`}>
            {formatAmount(totalIncome - totalExpense)}
          </p>
        </div>
      </div>

      {/* Spending by Category Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Spending by Category - {selectedMonth}
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
                    formatter={(value) => formatAmount(value)}
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
                  <XAxis type="number" tickFormatter={(v) => `₹${v}`} />
                  <YAxis
                    dataKey="category"
                    type="category"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => formatAmount(value)}
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
            <p>No categorized transactions for this month.</p>
          </div>
        )}
      </div>

      {/* Category Breakdown Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Category Breakdown
        </h2>
        {categoryData.length > 0 ? (
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
                      {formatAmount(item.amount)}
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
        ) : (
          <div className="text-center py-8 text-gray-500">
            No data available for this month
          </div>
        )}
      </div>
    </div>
  );
}

export default Analytics;
