import React from "react";

function KYC() {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        KYC Verification
      </h2>

      <p>Status: Pending</p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Upload Document
      </button>
    </div>
  );
}

export default KYC;
