import React, { useState } from "react";

const fakeUsers = [];

const ManagerAccount = () => {
  const [loading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Row: User stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Session" value="21,459" percent="+29%" iconBg="bg-indigo-100" iconColor="text-indigo-500" icon="👥" />
        <StatCard label="Paid Users" value="4,567" percent="+18%" iconBg="bg-pink-100" iconColor="text-pink-500" icon="🧑‍💼" />
        <StatCard label="Active Users" value="19,860" percent="-14%" iconBg="bg-green-100" iconColor="text-green-500" icon="🟢" />
        <StatCard label="Pending Users" value="237" percent="+42%" iconBg="bg-yellow-100" iconColor="text-yellow-500" icon="🕒" />
      </div>
      {/* Filters & Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="flex gap-2 items-center">
            <button className="border px-3 py-1.5 rounded text-gray-600 flex items-center gap-1 hover:bg-gray-50">
              <span>⬇️</span> Export
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Search User"
              className="px-3 py-1.5 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button className="bg-indigo-500 text-white px-4 py-1.5 rounded font-semibold hover:bg-indigo-600 transition">Add New User</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-400">
                <th className="py-2 px-2 text-left">USER</th>
                <th className="py-2 px-2 text-left">EMAIL</th>
                <th className="py-2 px-2 text-left">ROLE</th>
                <th className="py-2 px-2 text-left">PLAN</th>
                <th className="py-2 px-2 text-left">STATUS</th>
                <th className="py-2 px-2 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td>
                </tr>
              ) : fakeUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">Showing 0 to 0 of 0 entries</td>
                </tr>
              ) : (
                fakeUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-2">{user.name}</td>
                    <td className="py-2 px-2">{user.email}</td>
                    <td className="py-2 px-2">{user.role}</td>
                    <td className="py-2 px-2">{user.plan}</td>
                    <td className="py-2 px-2">{user.status}</td>
                    <td className="py-2 px-2">Edit | Delete</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, percent, icon, iconBg, iconColor }) => (
  <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
    <div className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBg} ${iconColor} text-2xl`}>{icon}</div>
    <div>
      <div className="text-lg font-bold">{value} <span className="text-xs text-green-500">{percent}</span></div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  </div>
);

export default ManagerAccount; 