import React from "react";

function Rewards() {
  const rewards = [
    "5% cashback on groceries",
    "Free movie ticket",
    "Travel discount coupon"
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Rewards
      </h2>

      <ul className="space-y-2">
        {rewards.map((r, i) => (
          <li key={i} className="border p-3 rounded">
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Rewards;
