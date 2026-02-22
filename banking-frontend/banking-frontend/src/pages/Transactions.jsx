import React, { useEffect, useState } from "react";

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

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [editCategory, setEditCategory] = useState("");
  const [saveAsRule, setSaveAsRule] = useState(false);
  const [rules, setRules] = useState([]);
  const [showRulePanel, setShowRulePanel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => console.error(err));

    fetch("http://127.0.0.1:8000/categories/rules", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRules(data))
      .catch((err) => console.error(err));
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN");
  };

  const handleSelectTransaction = (txn) => {
    setSelectedTxn(txn);
    setEditCategory(txn.category || "");
    setSaveAsRule(false);
  };

  const handleUpdateCategory = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/transactions/${selectedTxn.id}/category?save_as_rule=${saveAsRule}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ category: editCategory }),
        }
      );
      
      if (response.ok) {
        const updatedTxn = await response.json();
        setTransactions(
          transactions.map((t) =>
            t.id === selectedTxn.id ? updatedTxn : t
          )
        );
        setSelectedTxn(updatedTxn);
        
        // Refresh rules if saved as rule
        if (saveAsRule) {
          const rulesRes = await fetch("http://127.0.0.1:8000/categories/rules", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const rulesData = await rulesRes.json();
          setRules(rulesData);
        }
        
        alert("Category updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    }
  };

  const handleCreateRule = async () => {
    const token = localStorage.getItem("token");
    const keyword = selectedTxn?.description?.split(" ")[0] || "";
    
    try {
      const response = await fetch("http://127.0.0.1:8000/categories/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: editCategory,
          keyword_pattern: keyword,
          priority: 1,
          is_active: true,
        }),
      });
      
      if (response.ok) {
        const newRule = await response.json();
        setRules([...rules, newRule]);
        alert("Rule created successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create rule");
    }
  };

  return (
    <div className="flex gap-6">
      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-md p-8 flex-1">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Transactions
        </h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Time</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                className={`border-b hover:bg-gray-50 transition cursor-pointer ${
                  selectedTxn?.id === txn.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelectTransaction(txn)}
              >
                <td className="py-3 px-4">
                  {formatDate(txn.created_at)}
                </td>
                <td className="py-3 px-4">
                  {formatTime(txn.created_at)}
                </td>
                <td className="py-3 px-4">{txn.description}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                    {txn.category || "Uncategorized"}
                  </span>
                </td>
                <td
                  className={`py-3 px-4 text-right font-semibold ${
                    txn.amount >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  ₹{txn.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right Panel - Category Editor */}
      <div className="w-80 bg-white rounded-xl shadow-md p-6 h-fit">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Update Category
        </h3>

        {selectedTxn ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Description</p>
              <p className="font-medium text-gray-800">
                {selectedTxn.description}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Category
              </label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Category</option>
                {PREDEFINED_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="saveAsRule"
                checked={saveAsRule}
                onChange={(e) => setSaveAsRule(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="saveAsRule" className="text-sm text-gray-700">
                Save As Rule
              </label>
            </div>

            <button
              onClick={handleUpdateCategory}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Update
            </button>

            {/* Show Create Rule button separately */}
            {saveAsRule && (
              <button
                onClick={handleCreateRule}
                className="w-full mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Create Rule
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">
            Select a transaction to update its category
          </p>
        )}

        {/* Category Rules Section */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold mb-3 text-gray-800">Active Rules</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {rules.length > 0 ? (
              rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-2 bg-gray-50 rounded text-xs"
                >
                  <span className="font-medium">{rule.category}</span>
                  <span className="text-gray-500"> - "{rule.keyword_pattern}"</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-xs">No rules created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
