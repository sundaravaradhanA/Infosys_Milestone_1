import React, { useState, useEffect } from "react";

const PREDEFINED_CATEGORIES = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Bills & Utilities",
  "Health & Fitness",
  "Travel",
  "Income",
  "Transfer",
  "Other"
];

function Budget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    limit_amount: "",
    month: new Date().toISOString().slice(0, 7)
  });

  // Get current month in YYYY-MM format
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/budgets/?user_id=1&month=${currentMonth}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBudgets(data);
      }
    } catch (err) {
      console.error("Failed to fetch budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const payload = {
      user_id: 1,
      category: formData.category,
      limit_amount: parseFloat(formData.limit_amount),
      month: formData.month
    };

    try {
      let url = "http://127.0.0.1:8000/budgets/";
      let method = "POST";

      if (editingBudget) {
        url = `http://127.0.0.1:8000/budgets/${editingBudget.id}?user_id=1`;
        method = "PUT";
        payload.category = formData.category;
        payload.limit_amount = parseFloat(formData.limit_amount);
        payload.month = formData.month;
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchBudgets();
        setShowForm(false);
        setEditingBudget(null);
        setFormData({
          category: "",
          limit_amount: "",
          month: currentMonth
        });
      } else {
        const error = await response.json();
        alert(error.detail || "Failed to save budget");
      }
    } catch (err) {
      console.error("Failed to save budget:", err);
      alert("Failed to save budget");
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      limit_amount: budget.limit_amount.toString(),
      month: budget.month
    });
    setShowForm(true);
  };

  const handleDelete = async (budgetId) => {
    if (!confirm("Are you sure you want to delete this budget?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://127.0.0.1:8000/budgets/${budgetId}?user_id=1`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchBudgets();
      }
    } catch (err) {
      console.error("Failed to delete budget:", err);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  // Calculate totals
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit_amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent_amount, 0);
  const totalRemaining = totalBudget - totalSpent;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading budgets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Total Budget</p>
          <p className="text-2xl font-bold text-gray-800">{formatAmount(totalBudget)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Total Spent</p>
          <p className="text-2xl font-bold text-red-600">{formatAmount(totalSpent)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-500 text-sm">Remaining</p>
          <p className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatAmount(totalRemaining)}
          </p>
        </div>
      </div>

      {/* Budget List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Monthly Budgets - {currentMonth}
          </h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingBudget(null);
              setFormData({
                category: "",
                limit_amount: "",
                month: currentMonth
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Budget
          </button>
        </div>

        {budgets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No budgets set for this month. Click "Add Budget" to create one.
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{budget.category}</h3>
                    <p className="text-sm text-gray-500">
                      {formatAmount(budget.spent_amount)} spent of {formatAmount(budget.limit_amount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      budget.is_over_budget 
                        ? "bg-red-100 text-red-700" 
                        : budget.progress_percentage >= 70
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}>
                      {budget.progress_percentage.toFixed(1)}%
                    </span>
                    <button
                      onClick={() => handleEdit(budget)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getProgressColor(budget.progress_percentage)}`}
                    style={{ width: `${Math.min(budget.progress_percentage, 100)}%` }}
                  ></div>
                </div>
                {budget.is_over_budget && (
                  <p className="text-red-500 text-sm mt-1">
                    Over budget by {formatAmount(budget.spent_amount - budget.limit_amount)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Budget Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {editingBudget ? "Edit Budget" : "Add Budget"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  {PREDEFINED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Limit (₹)
                </label>
                <input
                  type="number"
                  name="limit_amount"
                  value={formData.limit_amount}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingBudget ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingBudget(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budget;
