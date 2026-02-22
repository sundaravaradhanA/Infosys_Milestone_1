import React, { useEffect, useState } from "react";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState("Savings");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false); // ✅ prevent double click

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = () => {
    fetch("http://127.0.0.1:8000/accounts")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error(err));
  };

  const handleAddAccount = async () => {
    if (loading) return; // 🛑 stop if already submitting

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bank_name: bankName,
          account_type: accountType,
          balance: parseFloat(balance),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add account");
      }

      await response.json();

      // Reset form
      setShowModal(false);
      setBankName("");
      setAccountType("Savings");
      setBalance("");

      // Refresh table
      fetchAccounts();

    } catch (error) {
      console.error(error);
      alert("Error adding account");
    }

    setLoading(false);
  };

  return (
    <div className="relative p-6">

      <h2 className="text-2xl font-bold mb-6">My Accounts</h2>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Bank</th>
              <th>Type</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{acc.bank_name}</td>
                <td>{acc.account_type}</td>
                <td className="font-semibold text-blue-600">
                  ₹{acc.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-10 right-10 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700"
      >
        + Add Account
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-96">

            <h3 className="text-xl font-bold mb-6">
              Add New Account
            </h3>

            <input
              type="text"
              placeholder="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            />

            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
            >
              <option>Savings</option>
              <option>Current</option>
              <option>Credit</option>
            </select>

            <input
              type="number"
              placeholder="Balance"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full border p-2 mb-6 rounded"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddAccount}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Account"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Accounts;

