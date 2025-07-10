import React from 'react';

export default function CustomersTab({ artisanId }) {
  const customers = [
    { id: 1, name: 'Nguyễn Thị B', orders: 3, lastOrder: '15/05/2023' },
    { id: 2, name: 'Trần Văn C', orders: 1, lastOrder: '22/04/2023' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#5e3a1e]">Khách hàng của tôi</h3>
      
      {customers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Chưa có khách hàng nào</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Tên khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Số đơn hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Đơn cuối</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map(customer => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">{customer.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.orders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastOrder}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#5e3a1e] hover:text-[#7a4b28]">
                      Nhắn tin
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}