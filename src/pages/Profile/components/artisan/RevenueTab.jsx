import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Tháng 1', revenue: 4000000 },
  { name: 'Tháng 2', revenue: 3000000 },
  { name: 'Tháng 3', revenue: 6000000 },
  { name: 'Tháng 4', revenue: 4800000 },
  { name: 'Tháng 5', revenue: 7500000 },
];

export default function RevenueTab({ artisanId }) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const averageRevenue = Math.round(totalRevenue / data.length);

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-[#5e3a1e]">Doanh thu</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-gray-500 font-medium">Tổng doanh thu</h4>
          <p className="text-2xl font-bold text-[#5e3a1e] mt-2">
            {totalRevenue.toLocaleString()} VND
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-gray-500 font-medium">Doanh thu trung bình</h4>
          <p className="text-2xl font-bold text-[#5e3a1e] mt-2">
            {averageRevenue.toLocaleString()} VND
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-gray-500 font-medium">Số đơn hàng</h4>
          <p className="text-2xl font-bold text-[#5e3a1e] mt-2">24</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-gray-700 font-medium mb-4">Biểu đồ doanh thu 6 tháng gần nhất</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${value / 1000000}M`} 
                domain={[0, 'dataMax + 1000000']}
              />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()} VND`, 'Doanh thu']}
                labelFormatter={(label) => `Tháng ${label.split(' ')[1]}`}
              />
              <Bar 
                dataKey="revenue" 
                fill="#5e3a1e" 
                radius={[4, 4, 0, 0]}
                name="Doanh thu"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}