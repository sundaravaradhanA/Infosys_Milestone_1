import React, { useEffect, useState } from "react";
import { useNavigate, Routes, Route, NavLink } from "react-router-dom";
import Accounts from "./Accounts";
import Transactions from "./Transactions";
import Analytics from "./Analytics";
import Budget from "./Budget";
import KYC from "./KYC";
import Notifications from "./Notifications";
import Rewards from "./Rewards";
import Profile from "./Profile";

function Dashboard() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread notification count
    const fetchUnreadCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
        const response = await fetch("http://127.0.0.1:8000/alerts/unread-count?user_id=1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUnreadCount(data.unread_count || 0);
        }
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    };

    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-[#0f172a] p-6 flex flex-col text-white">

        {/* Bank Pro Title */}
        <h1 className="text-2xl font-bold mb-10 text-white">
          Bank Pro
        </h1>

        <nav className="flex flex-col space-y-4 text-sm font-medium">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Accounts", path: "/dashboard/accounts" },
            { name: "Transactions", path: "/dashboard/transactions" },
            { name: "Analytics", path: "/dashboard/analytics" },
            { name: "Budget", path: "/dashboard/budget" },
            { name: "KYC", path: "/dashboard/kyc" },
            { name: "Notifications", path: "/dashboard/notifications", badge: unreadCount },
            { name: "Rewards", path: "/dashboard/rewards" },
            { name: "Profile", path: "/dashboard/profile" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md transition duration-200 flex items-center justify-between
                ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-blue-500 hover:text-white"
                }`
              }
            >
              <span>{item.name}</span>
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition"
        >
          Sign out
        </button>

      </aside>

      {/* ===== Main Section ===== */}
      <div className="flex-1 flex flex-col">

        <header className="bg-white shadow px-8 py-4">
          <h2 className="text-lg font-semibold text-black">
            Welcome to Digital Banking
          </h2>
        </header>

        <main className="p-10 flex-1">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="budget" element={<Budget />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}

export default Dashboard;





// ================= DASHBOARD HOME =================

function DashboardHome() {
  const [accounts, setAccounts] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/accounts")
      .then(res => res.json())
      .then(data => setAccounts(data));
  }, []);

  const uniqueTypes = [
    ...new Set(accounts.map(acc => acc.account_type))
  ];

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + acc.balance,
    0
  );

  const handleTransfer = () => {
    if (!selectedType || !amount) return;
    alert(`Transferred ₹${amount} from ${selectedType}`);
    setAmount("");
  };

  return (
    <div className="max-w-3xl">

      {/* ===== Total Balance ===== */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-black">
          Total Balance: ₹{totalBalance.toLocaleString()}
        </h1>
      </div>

      {/* ===== Transfer Section ===== */}
      <div className="bg-white rounded-xl shadow-md p-6 w-[500px]">

        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Transfer Money
        </h3>

        <div className="flex gap-4 items-center">

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="border p-2 rounded-md w-40"
          >
            <option value="">Select Type</option>
            {uniqueTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded-md w-40"
          />

          <button
            onClick={handleTransfer}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Transfer
          </button>

        </div>

      </div>

    </div>
  );
}
