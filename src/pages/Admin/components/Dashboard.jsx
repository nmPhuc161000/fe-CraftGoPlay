import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Row 1: Sales Overview, Ratings, Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6 col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-gray-600">Sales Overview</span>
            <span className="text-green-500 text-sm font-bold">+18%</span>
          </div>
          <div className="flex items-center gap-8">
            <div>
              <div className="text-2xl font-bold">8,458</div>
              <div className="text-xs text-gray-400">New Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$28.5k</div>
              <div className="text-xs text-gray-400">Total Profit</div>
            </div>
            <div>
              <div className="text-2xl font-bold">2,450k</div>
              <div className="text-xs text-gray-400">New Transactions</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-600">Ratings</span>
            <span className="text-green-500 text-xs font-bold">+15.6%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">8.14k</div>
            <span className="text-xs text-gray-400">Year of 2021</span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-600">Sessions</span>
            <span className="text-red-500 text-xs font-bold">-25.5%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">12.2k</div>
            <span className="text-xs text-gray-400">Last Month</span>
          </div>
        </div>
      </div>

      {/* Row 2: Weekly Sales, Total Visits, Sales This Month */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 rounded-xl shadow p-6 col-span-1 text-white relative overflow-hidden">
          <div className="font-semibold mb-2">Weekly Sales</div>
          <div className="text-lg font-bold">Total $23.5k Earning <span className="text-green-200 text-sm">+62%</span></div>
          <div className="mt-4 flex gap-6">
            <div>
              <div className="text-xs">TV's</div>
              <div className="font-bold text-lg">16</div>
            </div>
            <div>
              <div className="text-xs">Shoes</div>
              <div className="font-bold text-lg">43</div>
            </div>
            <div>
              <div className="text-xs">Speakers</div>
              <div className="font-bold text-lg">40</div>
            </div>
            <div>
              <div className="text-xs">Sun Glasses</div>
              <div className="font-bold text-lg">7</div>
            </div>
          </div>
          <img src="https://static.vecteezy.com/system/resources/previews/021/548/618/original/smartwatch-3d-illustration-png.png" alt="watch" className="absolute right-4 bottom-2 w-24 h-24 object-contain opacity-80" />
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-600">Total Visits</span>
            <span className="text-green-500 text-xs font-bold">+18.4%</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold">$42.5k</div>
            <div className="flex flex-col text-xs text-gray-400">
              <span>Mobile: 23.5%</span>
              <span>Desktop: 76.5%</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col justify-between">
          <div className="font-semibold text-gray-600 mb-2">Sales This Month</div>
          <div className="text-2xl font-bold">$28,450</div>
          <div className="mt-2">
            <svg height="40" width="100%" viewBox="0 0 100 40" className="w-full">
              <polyline fill="none" stroke="#6366f1" strokeWidth="3" points="0,30 10,20 20,25 30,15 40,20 50,10 60,15 70,10 80,20 90,15 100,25" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 3: Activity Timeline & Top Referral Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold mb-4">Activity Timeline</div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="h-3 w-3 bg-blue-500 rounded-full mt-1"></span>
              <div>
                <div className="font-semibold">12 Invoices have been paid <span className="text-xs text-gray-400 ml-2">12 min ago</span></div>
                <div className="text-xs text-gray-500">Invoices have been paid to the company</div>
                <span className="inline-block bg-gray-100 text-xs px-2 py-1 rounded mt-1">invoices.pdf</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-3 w-3 bg-green-500 rounded-full mt-1"></span>
              <div>
                <div className="font-semibold">Client Meeting <span className="text-xs text-gray-400 ml-2">45 min ago</span></div>
                <div className="text-xs text-gray-500">Project meeting with john @10:15am</div>
                <div className="flex items-center gap-2 mt-1">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="client" className="w-6 h-6 rounded-full" />
                  <span className="text-xs text-gray-400">Lester McCarthy (Client)</span>
                </div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="h-3 w-3 bg-yellow-500 rounded-full mt-1"></span>
              <div>
                <div className="font-semibold">Create a new project for client <span className="text-xs text-gray-400 ml-2">2 Day Ago</span></div>
                <div className="text-xs text-gray-500">6 team members in a project</div>
                <div className="flex -space-x-2 mt-1">
                  <img src="https://randomuser.me/api/portraits/men/33.jpg" alt="member1" className="w-6 h-6 rounded-full border-2 border-white" />
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="member2" className="w-6 h-6 rounded-full border-2 border-white" />
                  <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="member3" className="w-6 h-6 rounded-full border-2 border-white" />
                  <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold border-2 border-white">+3</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold mb-4">Top Referral Sources</div>
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-blue-400">
              <img src="https://cdn.tgdd.vn/Products/Images/42/303226/samsung-galaxy-s22-ultra-thumb-xanh-600x600.jpg" alt="Samsung s22" className="w-10 h-10 object-contain" />
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <img src="https://cdn.tgdd.vn/Products/Images/42/303228/iphone-14-pro-thumb-den-600x600.jpg" alt="iPhone 14 Pro" className="w-10 h-10 object-contain" />
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <img src="https://cdn.tgdd.vn/Products/Images/54/289663/tay-cam-choi-game-ps5-dualsense-thumb-600x600.jpg" alt="Gamepad" className="w-10 h-10 object-contain" />
            </div>
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-gray-400 text-2xl font-bold">+</span>
            </div>
          </div>
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-gray-400">
                <th className="py-2 px-2 text-left">IMAGE</th>
                <th className="py-2 px-2 text-left">NAME</th>
                <th className="py-2 px-2 text-left">STATUS</th>
                <th className="py-2 px-2 text-left">REVENUE</th>
                <th className="py-2 px-2 text-left">PROFIT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-2"><img src="https://cdn.tgdd.vn/Products/Images/42/303226/samsung-galaxy-s22-ultra-thumb-xanh-600x600.jpg" alt="Samsung s22" className="w-8 h-8 rounded" /></td>
                <td className="py-2 px-2">Samsung s22</td>
                <td className="py-2 px-2"><span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Out of Stock</span></td>
                <td className="py-2 px-2">$12.5k</td>
                <td className="py-2 px-2 text-green-500 font-bold">+24%</td>
              </tr>
              <tr>
                <td className="py-2 px-2"><img src="https://cdn.tgdd.vn/Products/Images/42/303228/iphone-14-pro-thumb-den-600x600.jpg" alt="iPhone 14 Pro" className="w-8 h-8 rounded" /></td>
                <td className="py-2 px-2">iPhone 14 Pro</td>
                <td className="py-2 px-2"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">In Stock</span></td>
                <td className="py-2 px-2">$45k</td>
                <td className="py-2 px-2 text-red-500 font-bold">-18%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 