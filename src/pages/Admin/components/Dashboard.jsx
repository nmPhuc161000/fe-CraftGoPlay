import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaUserPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import adminService from "../../../services/apis/adminApi";
import dashBoardService from "../../../services/apis/dashboardApi";

// Cập nhật FAKE_DATA: chỉ còn 1 loại duy nhất là 'Sản phẩm' (Products)
const FAKE_DATA = {
  2025: {
    0: {
      cards: { users: 58, orders: 159, feedbacks: 144, revenues: 9749900 },
      monthlyData: [
        { month: "Tháng 5", Products: 68 + 18 + 16 },
        { month: "Tháng 6", Products: 3 + 2 + 1 },
      ],
      pie: [
        { name: "Thành công", value: 37, color: "#0084FF" },
        { name: "Đã hủy", value: 6, color: "#00C49F" },
        { name: "Phản hồi xấu", value: 16, color: "#FFC233" },
      ],
    },
    5: {
      cards: { users: 28, orders: 89, feedbacks: 84, revenues: 5749900 },
      dailyData: [
        { date: "2025-05-01", Products: 10 + 2 + 1 },
        { date: "2025-05-02", Products: 8 + 3 + 2 },
        { date: "2025-05-03", Products: 12 + 4 + 3 },
        { date: "2025-05-04", Products: 9 + 2 + 1 },
        { date: "2025-05-05", Products: 11 + 3 + 2 },
        { date: "2025-05-06", Products: 8 + 2 + 3 },
        { date: "2025-05-07", Products: 10 + 2 + 4 },
      ],
      pie: [
        { name: "Thành công", value: 27, color: "#0084FF" },
        { name: "Đã hủy", value: 4, color: "#00C49F" },
        { name: "Phản hồi xấu", value: 11, color: "#FFC233" },
      ],
    },
    6: {
      cards: { users: 30, orders: 70, feedbacks: 60, revenues: 4000000 },
      dailyData: [
        { date: "2025-06-01", Products: 1 + 0 + 0 },
        { date: "2025-06-02", Products: 0 + 1 + 0 },
        { date: "2025-06-03", Products: 1 + 0 + 1 },
        { date: "2025-06-04", Products: 0 + 1 + 0 },
        { date: "2025-06-05", Products: 1 + 0 + 0 },
        { date: "2025-06-06", Products: 0 + 0 + 0 },
        { date: "2025-06-07", Products: 0 + 0 + 0 },
      ],
      pie: [
        { name: "Thành công", value: 10, color: "#0084FF" },
        { name: "Đã hủy", value: 2, color: "#00C49F" },
        { name: "Phản hồi xấu", value: 5, color: "#FFC233" },
      ],
    },
  },
  2024: {
    0: {
      cards: { users: 10, orders: 20, feedbacks: 5, revenues: 1000000 },
      bar: [
        { name: "Thiết bị", value: 10 },
        { name: "Bộ sản phẩm", value: 5 },
        { name: "Phòng thí nghiệm", value: 2 },
      ],
      pie: [
        { name: "Thành công", value: 8, color: "#0084FF" },
        { name: "Đã hủy", value: 1, color: "#00C49F" },
        { name: "Phản hồi xấu", value: 1, color: "#FFC233" },
        { name: "Khác", value: 10, color: "#FF8042" },
      ],
    },
  },
};

function getData(year, month) {
  if (FAKE_DATA[year] && FAKE_DATA[year][month]) return FAKE_DATA[year][month];
  if (FAKE_DATA[year] && FAKE_DATA[year][0]) return FAKE_DATA[year][0];
  return null;
}

const PieLegend = ({ data }) => (
  <div className="flex flex-wrap justify-center gap-4 mt-4">
    {data.map((entry) => (
      <div key={entry.name} className="flex items-center gap-1 text-sm">
        <span
          className="inline-block w-4 h-4 rounded"
          style={{ background: entry.color }}
        ></span>
        <span className="font-medium" style={{ color: entry.color }}>
          {entry.name}
        </span>
        : <span className="font-semibold">{entry.value}</span>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(0);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState({
    type: "Year", // Mặc định là tháng
    from: "",
    to: "",
  });

  // Lấy dữ liệu fake cho các mục khác
  const data = getData(year, month);

  // Thêm mapping trạng thái đơn hàng
  const ORDER_STATUS_LABELS = {
    Completed: "Hoàn thành",
    ReturnRequested: "Yêu cầu trả hàng",
    Cancel: "Bị hủy",
    Reject: "Đã từ chối",
    Refunded: "Đã hoàn tiền",
  };

  // Gán màu sắc cho từng trạng thái
  const ORDER_STATUS_COLORS = {
    Completed: "#0084FF",
    ReturnRequested: "#FFC233",
    Cancel: "#FF4D4F",
    Reject: "#FF8042",
    Refunded: "#00C49F",
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

  const fetchDashboardForAdmin = async () => {
    try {
      const { type, from, to } = timeRange;
      const res = await dashBoardService.getDashBoardForAdmin(type, from, to);
      console.log("API Response: ", res);
      if (res.success === true) {
        setDashboardData(res.data.data || null);
      } else {
        setDashboardData(null);
      }
    } catch (error) {
      console.error("Error fetching user count:", error);
      setDashboardData(null);
    }
  };
  useEffect(() => {
    fetchDashboardForAdmin();
  }, [timeRange.type, timeRange.from, timeRange.to]);

  // Xác định dữ liệu cho BarChart
  let barData = [];
  let xKey = "";
  if (month === 0 && data && data.monthlyData) {
    barData = data.monthlyData;
    xKey = "month";
  } else if (month !== 0 && data && data.dailyData) {
    barData = data.dailyData;
    xKey = "date";
  }

  return (
    <div className="w-full">
      <main className="bg-amber-25 min-h-screen w-full">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
          {/* Breadcrumb */}
          <h1 className="text-2xl font-bold mb-4">Bảng doanh thu</h1>
          {/* Filter */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
            <select
              className="border rounded px-3 py-2 bg-white w-full sm:w-auto"
              value={timeRange.type}
              onChange={handleTypeChange}
            >
              <option value="Day">Hôm nay</option>
              <option value="Week">Tuần này</option>
              <option value="Month">Tháng này</option>
              <option value="Year">Năm nay</option>
              <option value="Custom">Tùy chỉnh</option>
            </select>
            {timeRange.type === "Custom" && (
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">
                    Từ ngày:
                  </label>
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
          </div>
          {/* Cards */}
          {dashboardData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mb-6">
              {/* Tổng đơn hàng */}
              <div className="bg-amber-25 rounded-xl shadow p-4 sm:p-6 flex items-center gap-3 sm:gap-4 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="bg-green-100 text-green-500 rounded-full p-2 sm:p-3 text-xl sm:text-2xl">
                  <FaShoppingCart />
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Tổng đơn hàng
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {dashboardData.totalOrders ?? "0"}
                  </div>
                </div>
              </div>

              {/* Tổng doanh thu trước phí */}
              <div className="bg-amber-25 rounded-xl shadow p-4 sm:p-6 flex items-center gap-3 sm:gap-4 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="bg-yellow-100 text-yellow-500 rounded-full p-2 sm:p-3 text-xl sm:text-2xl">
                  <FaCoins />
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Tổng doanh thu trước phí
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {dashboardData.totalRevenueBeforeFee?.toLocaleString() ||
                      "0"}{" "}
                    VNĐ
                  </div>
                </div>
              </div>

              {/* Tổng doanh thu sau phí */}
              <div className="bg-amber-25 rounded-xl shadow p-4 sm:p-6 flex items-center gap-3 sm:gap-4 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="bg-yellow-100 text-yellow-500 rounded-full p-2 sm:p-3 text-xl sm:text-2xl">
                  <FaCoins />
                </div>
                <div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    Tổng doanh thu sau phí
                  </div>
                  <div className="text-xl sm:text-2xl font-bold">
                    {dashboardData.totalRevenueAfterFee?.toLocaleString() ||
                      "0"}{" "}
                    VNĐ
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-6">
            <div className="col-span-1 lg:col-span-2 bg-amber-25 rounded-xl shadow p-3 sm:p-6 transition-all duration-300 hover:shadow-2xl">
              <div className="font-semibold mb-2">Thống kê sản phẩm</div>
              {barData && barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={barData} barCategoryGap={24}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKey} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="Products"
                      fill="#8884d8"
                      name="Sản phẩm"
                      isAnimationActive
                      animationDuration={700}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-red-500 font-semibold py-8 sm:py-12">
                  Không có dữ liệu
                </div>
              )}
            </div>
            <div className="bg-amber-25 rounded-xl shadow p-3 sm:p-6 flex flex-col items-center transition-all duration-300 hover:shadow-2xl">
              <div className="font-semibold mb-2">Phân bố đơn hàng</div>
              {dashboardData && dashboardData.orderStatusCounts ? (
                (() => {
                  const pieData = Object.keys(ORDER_STATUS_LABELS).map(
                    (key) => ({
                      name: ORDER_STATUS_LABELS[key],
                      value: dashboardData.orderStatusCounts[key] || 0,
                      color: ORDER_STATUS_COLORS[key],
                    })
                  );

                  // Kiểm tra nếu tất cả value = 0 thì không render chart
                  const hasData = pieData.some((item) => item.value > 0);

                  return hasData ? (
                    <>
                      <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            label={false}
                            isAnimationActive
                            animationDuration={700}
                          >
                            {pieData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [`${value} đơn`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <PieLegend data={pieData} />
                    </>
                  ) : (
                    <div className="text-center text-red-500 font-semibold py-8 sm:py-12">
                      Không có dữ liệu
                    </div>
                  );
                })()
              ) : (
                <div className="text-center text-red-500 font-semibold py-8 sm:py-12">
                  Không có dữ liệu
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
