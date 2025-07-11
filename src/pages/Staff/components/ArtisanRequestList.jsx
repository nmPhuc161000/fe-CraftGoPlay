import React, { useState } from "react";
import { MdCheck, MdClose } from 'react-icons/md';

// Fake data yêu cầu từ nghệ nhân
const FAKE_REQUESTS = [
  { id: 1, name: "Nguyễn Văn F", email: "f@gmail.com", phone: "0901234567", address: "123 Đường A, Quận B, TP.HCM", username: "nguyenvanf", status: "pending" },
  { id: 2, name: "Trần Thị G", email: "g@gmail.com", phone: "0912345678", address: "456 Đường X, Quận Y, Hà Nội", username: "tranthig", status: "pending" },
];

const ArtisanRequestList = () => {
  const [requests, setRequests] = useState(FAKE_REQUESTS);
  const [detail, setDetail] = useState(null);

  const handleApprove = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };

  const handleReject = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
  };

  return (
    <div className="bg-amber-25 rounded-2xl shadow p-4 w-full">
      <div className="font-bold text-xl mb-4">Yêu cầu từ nghệ nhân</div>
      <table className="min-w-full text-sm border-separate border-spacing-0">
        <thead>
          <tr>
            <th className="px-3 py-2 text-center bg-blue-600 text-white font-semibold rounded-tl-lg">ID</th>
            <th className="px-3 py-2 text-center bg-blue-600 text-white font-semibold">Tên khách hàng</th>
            <th className="px-3 py-2 text-center bg-blue-600 text-white font-semibold">Email</th>
            <th className="px-3 py-2 text-center bg-blue-600 text-white font-semibold">Số điện thoại</th>
            <th className="px-3 py-2 text-center bg-blue-600 text-white font-semibold">Chi tiết</th>
            <th className="px-3 py-2 text-center bg-blue-600 text-white font-semibold">Trạng thái</th>
            <th className="px-3 py-2 text-center bg-blue-600 text-white font-semibold rounded-tr-lg">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id} className="border-b last:border-0">
              <td className="px-3 py-2 text-center">{r.id}</td>
              <td className="px-3 py-2 text-center">{r.name}</td>
              <td className="px-3 py-2 text-center">{r.email}</td>
              <td className="px-3 py-2 text-center">{r.phone}</td>
              <td className="px-3 py-2 text-center">
                <button className="px-2 py-1 rounded bg-gray-100 hover:bg-blue-100 text-blue-600 font-semibold" onClick={() => setDetail(r)}>
                  Xem
                </button>
              </td>
              <td className="px-3 py-2 text-center">
                {r.status === "pending" ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" style={{ minWidth: 90, display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    Chờ duyệt
                  </span>
                ) : r.status === "approved" ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200" style={{ minWidth: 90, display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    <MdCheck size={16} /> Kích hoạt
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-500 border border-red-200" style={{ minWidth: 120, display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                    <MdClose size={16} /> Ngừng hoạt động
                  </span>
                )}
              </td>
              <td className="px-3 py-2 text-center">
                {r.status === "pending" && (
                  <div className="flex gap-2 justify-center">
                    <button className="px-2 py-1 rounded border border-green-500 text-green-600 font-semibold bg-white hover:bg-green-50 transition-all text-sm" onClick={() => handleApprove(r.id)}>
                      Duyệt
                    </button>
                    <button className="px-2 py-1 rounded border border-red-500 text-red-600 font-semibold bg-white hover:bg-red-50 transition-all text-sm" onClick={() => handleReject(r.id)}>
                      Từ chối
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative animate-fadeIn">
            <button className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600" onClick={() => setDetail(null)} aria-label="Close">×</button>
            <div className="text-xl font-bold mb-4 text-center">Chi tiết yêu cầu</div>
            <div className="space-y-2">
              <div><span className="font-semibold">Họ tên:</span> {detail.name}</div>
              <div><span className="font-semibold">Địa chỉ:</span> {detail.address}</div>
              <div><span className="font-semibold">Số điện thoại:</span> {detail.phone}</div>
              <div><span className="font-semibold">Email:</span> {detail.email}</div>
              <div><span className="font-semibold">Tên đăng nhập:</span> {detail.username}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtisanRequestList; 