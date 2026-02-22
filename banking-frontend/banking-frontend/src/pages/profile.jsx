import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState({
    email: "",
    phone: "",
    address: ""
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users/1", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    await fetch("http://127.0.0.1:8000/users/1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(user)
    });

    alert("Changes saved successfully");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-lg">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      <input
        className="w-full border p-3 mb-4"
        placeholder="Email"
        value={user.email}
        onChange={(e) =>
          setUser({ ...user, email: e.target.value })
        }
      />

      <input
        className="w-full border p-3 mb-4"
        placeholder="Phone"
        value={user.phone}
        onChange={(e) =>
          setUser({ ...user, phone: e.target.value })
        }
      />

      <input
        className="w-full border p-3 mb-4"
        placeholder="Address"
        value={user.address}
        onChange={(e) =>
          setUser({ ...user, address: e.target.value })
        }
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}

export default Profile;
