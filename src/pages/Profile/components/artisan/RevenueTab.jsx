import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../../contexts/AuthContext.jsx";
import dashBoardService from "../../../../services/apis/dashboardApi";

export default function RevenueTab() {
  const { user } = useContext(AuthContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState({
    type: "Month", // Mặc định là tháng
    from: "",
    to: "",
  });

  const statusLabels = {
    Completed: "Hoàn thành",
    ReturnRequested: "Yêu cầu trả hàng",
    Cancel: "Bị hủy",
    Reject: "Đã từ chối",
    Refunded: "Đã hoàn tiền",
  };

  // Hàm lấy dữ liệu dashboard
  const fetchDashboardData = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { type, from, to } = timeRange;
      const response = await dashBoardService.getDashBoardForArtisan(
        user.id,
        type,
        from,
        to
      );

      if (response.data.error === 0) {
        setDashboardData(response.data.data);
        console.log("data", response.data.data);
      } else {
        setError(response.message || "Có lỗi xảy ra khi lấy dữ liệu");
      }
    } catch (err) {
      setError("Không thể kết nối đến server");
      console.error("Fetch dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi loại thời gian
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setTimeRange({
      type: newType,
      from:
        newType === "Custom" ? new Date().toISOString().split("T")[0] : null,
      to: newType === "Custom" ? new Date().toISOString().split("T")[0] : null,
    });
  };

  // Xử lý thay đổi ngày bắt đầu
  const handleFromChange = (e) => {
    setTimeRange({ ...timeRange, from: e.target.value });
  };

  // Xử lý thay đổi ngày kết thúc
  const handleToChange = (e) => {
    setTimeRange({ ...timeRange, to: e.target.value });
  };

  // Gọi API khi component mount hoặc timeRange thay đổi
  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, user]);

  // Format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Bảng Doanh Thu
      </h2>

      {/* Bộ lọc thời gian */}
      <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-col">
          <label className="font-medium text-gray-700 mb-1">
            Khoảng thời gian:
          </label>
          <select
            value={timeRange.type}
            onChange={handleTypeChange}
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="Day">Hôm nay</option>
            <option value="Week">Tuần này</option>
            <option value="Month">Tháng này</option>
            <option value="Year">Năm nay</option>
            <option value="Custom">Tùy chỉnh</option>
          </select>
        </div>

        {timeRange.type === "Custom" && (
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">Từ ngày:</label>
              <input
                type="date"
                value={timeRange.from || ""}
                onChange={handleFromChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 mb-1">
                Đến ngày:
              </label>
              <input
                type="date"
                value={timeRange.to || ""}
                onChange={handleToChange}
                className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className={`px-4 py-2 rounded-md ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white transition-colors`}
        >
          {loading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Hiển thị dữ liệu */}
      {dashboardData ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Tổng đơn hàng
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {dashboardData.totalOrders}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Tổng doanh thu
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {formatCurrency(dashboardData.totalRevenue)}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Trạng thái đơn hàng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(dashboardData.orderStatusCounts).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <span className="text-gray-700">
                      {statusLabels[status] || status}:
                    </span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-10 text-gray-500">
          Đang tải dữ liệu...
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500">
          Không có dữ liệu để hiển thị
        </div>
      )}
    </div>
  );
}
