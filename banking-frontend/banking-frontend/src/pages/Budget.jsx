import React, { useState } from "react";

function Budget() {
  const [budget, setBudget] = useState(20000);
  const [spent, setSpent] = useState(11500);

  const remaining = budget - spent;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Monthly Budget
      </h2>

      <p>Total: ₹{budget}</p>
      <p>Spent: ₹{spent}</p>
      <p className="text-green-600">
        Remaining: ₹{remaining}
      </p>
    </div>
  );
}

export default Budget;
