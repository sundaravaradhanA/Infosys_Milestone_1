import React from "react";

function Notifications() {
  const notifications = [
    "Salary credited",
    "Electricity bill due",
    "New reward available"
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Notifications
      </h2>

      <ul className="space-y-2">
        {notifications.map((n, i) => (
          <li key={i} className="border p-3 rounded">
            {n}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
