import React, { useEffect, useState } from "react";
function Transactions() {
  const [transactions, setTransactions] = useState([]);

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
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN");
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN");
  };

  return (
    <div className="flex">

      <div className="bg-white rounded-xl shadow-md p-8 w-[950px]">

        {/* Title */}
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Transactions
        </h2>

        {/* Table */}
        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Time</th>
              <th className="py-3 px-4 font-semibold">Description</th>
              <th className="py-3 px-4 font-semibold text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">
                  {formatDate(txn.created_at)}
                </td>

                <td className="py-3 px-4">
                  {formatTime(txn.created_at)}
                </td>

                <td className="py-3 px-4">
                  {txn.description}
                </td>

                <td
                  className={`py-3 px-4 text-right font-semibold ${
                    txn.amount >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  ₹{txn.amount}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Transactions;
