import React, { useState, useEffect } from "react";

function Notifications() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/alerts/?user_id=1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/alerts/${alertId}/mark-read?user_id=1`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setAlerts(alerts.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true } : alert
        ));
      }
    } catch (err) {
      console.error("Failed to mark alert as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:8000/alerts/mark-all-read?user_id=1", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setAlerts(alerts.map(alert => ({ ...alert, is_read: true })));
      }
    } catch (err) {
      console.error("Failed to mark all alerts as read:", err);
    }
  };

  const handleDelete = async (alertId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/alerts/${alertId}?user_id=1`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setAlerts(alerts.filter(alert => alert.id !== alertId));
      }
    } catch (err) {
      console.error("Failed to delete alert:", err);
    }
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN");
  };

  const getAlertTypeColor = (type) => {
    switch (type) {
      case "budget_exceeded":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      case "info":
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading notifications...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">
                {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No notifications yet
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.is_read 
                    ? "bg-gray-50 border-gray-200" 
                    : getAlertTypeColor(alert.alert_type)
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${
                        alert.is_read ? "text-gray-700" : "text-gray-900"
                      }`}>
                        {alert.title}
                      </h3>
                      {!alert.is_read && (
                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className={`text-sm ${
                      alert.is_read ? "text-gray-500" : "text-gray-700"
                    }`}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(alert.created_at)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {!alert.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(alert.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
