import React, { useState, useEffect } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  FaShoppingCart,
  FaCoins,
  FaChartLine,
  FaBox,
  FaTruck,
  FaHandHoldingUsd,
  FaMoneyBillWave,
  FaTags,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import dashboardService from "../../../services/apis/dashboardApi";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

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
        :{" "}
        <span className="font-semibold">
          {entry.value.toLocaleString()} VNĐ
        </span>
      </div>
    ))}
  </div>
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [timeRange, setTimeRange] = useState({
    type: "Year",
    from: "",
    to: "",
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [lineChartData, setLineChartData] = useState([]);

  // Màu sắc cho biểu đồ thu chi
  const REVENUE_EXPENSE_COLORS = {
    totalProductFeeForArtisan: "#10B981", // Emerald - Tiền trả cho artisan
    totalDeliveryFeeShiper: "#3B82F6", // Blue - Tiền giao hàng
    totalDiscount: "#EF4444", // Red - Tiền giảm giá
  };

  // Icon cho biểu đồ thu chi
  const REVENUE_EXPENSE_ICONS = {
    totalProductFeeForArtisan: <FaHandHoldingUsd className="text-lg" />,
    totalDeliveryFeeShiper: <FaTruck className="text-lg" />,
    totalDiscount: <FaTags className="text-lg" />,
  };

  // Labels cho biểu đồ thu chi
  const REVENUE_EXPENSE_LABELS = {
    totalProductFeeForArtisan: "Tiền nghệ nhân",
    totalDeliveryFeeShiper: "Tiền giao hàng",
    totalDiscount: "Tiền giảm từ voucher và xu",
  };

  // Generate years for select
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setTimeRange({
      type: newType,
      from:
        newType === "Custom" ? new Date().toISOString().split("T")[0] : null,
      to: newType === "Custom" ? new Date().toISOString().split("T")[0] : null,
    });
  };

  const handleFromChange = (e) => {
    setTimeRange({ ...timeRange, from: e.target.value });
  };

  const handleToChange = (e) => {
    setTimeRange({ ...timeRange, to: e.target.value });
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  useEffect(() => {
    const fetchDashboardForAdmin = async () => {
      try {
        const { type, from, to } = timeRange;
        const res = await dashboardService.getDashBoardForAdmin(type, from, to);
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
    fetchDashboardForAdmin();
  }, [timeRange]);

  // Gọi API để lấy dữ liệu biểu đồ
  useEffect(() => {
    const fetchLineChartData = async () => {
      try {
        const response = await dashboardService.getProductsCountByMonths(
          selectedYear
        );
        if (response.data.error === 0) {
          const months = [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
          ];

          // Chuyển đổi dữ liệu từ API thành định dạng cho Chart.js
          const chartData = {
            labels: months,
            datasets: [
              {
                label: "Sản phẩm có sẵn",
                data: response.data.data.availableProducts.map(
                  (value) => value || 0
                ),
                borderColor: "#8B4513", // SaddleBrown
                backgroundColor: "rgba(139, 69, 19, 0.2)", // SaddleBrown with opacity
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: "#8B4513",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBorderColor: "#F4A261", // SandyBrown
                pointHoverBackgroundColor: "#fff",
              },
              {
                label: "Sản phẩm đã bán",
                data: response.data.data.soldProducts.map(
                  (value) => value || 0
                ),
                borderColor: "#D2B48C", // Tan
                backgroundColor: "rgba(210, 180, 140, 0.2)", // Tan with opacity
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: "#D2B48C",
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointHoverRadius: 8,
                pointHoverBorderColor: "#F4A261", // SandyBrown
                pointHoverBackgroundColor: "#fff",
              },
            ],
          };
          setLineChartData(chartData);
        } else {
          console.error("Lỗi khi lấy dữ liệu:", response.data.message);
          setLineChartData([]);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setLineChartData([]);
      }
    };

    fetchLineChartData();
  }, [selectedYear]);

  // Tính toán dữ liệu cho biểu đồ thu chi
  const calculateRevenueExpenseData = () => {
    return [
      {
        name: REVENUE_EXPENSE_LABELS.totalProductFeeForArtisan,
        value: dashboardData?.totalProductFeeForArtisan || 0,
        color: REVENUE_EXPENSE_COLORS.totalProductFeeForArtisan,
        icon: REVENUE_EXPENSE_ICONS.totalProductFeeForArtisan,
      },
      {
        name: REVENUE_EXPENSE_LABELS.totalDeliveryFeeShiper,
        value: dashboardData?.totalDeliveryFeeShiper || 0,
        color: REVENUE_EXPENSE_COLORS.totalDeliveryFeeShiper,
        icon: REVENUE_EXPENSE_ICONS.totalDeliveryFeeShiper,
      },
      {
        name: REVENUE_EXPENSE_LABELS.totalDiscount,
        value: dashboardData?.totalDiscount || 0,
        color: REVENUE_EXPENSE_COLORS.totalDiscount,
        icon: REVENUE_EXPENSE_ICONS.totalDiscount,
      },
    ];
  };

  // Tính toán dữ liệu cho biểu đồ doanh thu
  const calculateRevenueData = () => {
    return [
      {
        name: "Từ sản phẩm",
        value: dashboardData?.totalRevenueProductFee || 0,
        color: "#10B981", // Emerald
        icon: <FaBox className="text-lg" />,
      },
      {
        name: "Từ vận chuyển",
        value: dashboardData?.totalRevenueDeliveryFee || 0,
        color: "#3B82F6", // Blue
        icon: <FaTruck className="text-lg" />,
      },
    ];
  };

  const revenueExpenseData = calculateRevenueExpenseData();
  const revenueData = calculateRevenueData();
  const hasRevenueExpenseData = revenueExpenseData.some(
    (item) => item.value > 0
  );
  const hasRevenueData = revenueData.some((item) => item.value > 0);

  // Tính tổng thu chi
  const totalRevenueExpense = revenueExpenseData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  // Cấu hình Chart.js
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Số lượng sản phẩm",
          color: "#6B7280", // Warm Gray
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "#6B7280",
          callback: (value) => value.toLocaleString(),
        },
      },
      x: {
        title: {
          display: true,
          text: "Tháng",
          color: "#6B7280", // Warm Gray
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "#6B7280",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#6B7280",
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: `Thống kê sản phẩm theo tháng (${selectedYear})`,
        color: "#6B7280",
        font: {
          size: 16,
        },
        padding: {
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: "#FFFBEB", // Amber-50
        titleColor: "#6B7280",
        bodyColor: "#6B7280",
        borderColor: "#A0522D", // Sienna
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) =>
            `${
              context.dataset.label
            }: ${context.raw.toLocaleString()} sản phẩm`,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-brown-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bảng Điều Khiển Admin
          </h1>
          <p className="text-gray-600">Tổng quan về hoạt động kinh doanh</p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Bộ lọc thời gian
          </h3>
          <div className="flex flex-wrap gap-4">
            <select
              className="border-2 border-gray-200 rounded-lg px-4 py-2 bg-white focus:border-amber-500 focus:outline-none transition-colors"
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
                    className="p-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
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
                    className="p-2 border-2 border-gray-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards & Pie Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1: Tổng đơn hàng */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
            <div className="rounded-full p-4 bg-amber-100 mr-4">
              <FaShoppingCart className="text-amber-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Tổng đơn hàng
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.totalOrders || 0}
              </p>
            </div>
          </div>

          {/* Card 2: Tổng doanh thu trước phí */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
            <div className="rounded-full p-4 bg-amber-100 mr-4">
              <FaCoins className="text-amber-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Tổng doanh thu trước phí
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.totalRevenueBeforeFee?.toLocaleString() || "0"}{" "}
                VNĐ
              </p>
            </div>
          </div>

          {/* Card 3: Tổng doanh thu sau phí */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center">
            <div className="rounded-full p-4 bg-amber-100 mr-4">
              <FaChartLine className="text-amber-600 text-2xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-600">
                Tổng doanh thu sau phí
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData?.totalRevenueAfterFee?.toLocaleString() || "0"}{" "}
                VNĐ
              </p>
            </div>
          </div>
        </div>

        {/* Pie Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Biểu đồ chi */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Thống kê các phần chi
            </h3>

            {hasRevenueExpenseData ? (
              <>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueExpenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {revenueExpenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value.toLocaleString()} VNĐ (${(
                            (value / (totalRevenueExpense || 1)) *
                            100
                          ).toFixed(1)}%)`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <PieLegend data={revenueExpenseData} />
                <div className="text-center mt-2 text-sm text-gray-500">
                  Tổng chi: {totalRevenueExpense.toLocaleString()} VNĐ
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Không có dữ liệu thu chi để hiển thị
              </div>
            )}
          </div>

          {/* Biểu đồ doanh thu sau phí */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 text-center">
              Phân bổ doanh thu sau phí
            </h3>

            {hasRevenueData ? (
              <>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {revenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [
                          `${value.toLocaleString()} VNĐ (${(
                            (value /
                              (dashboardData?.totalRevenueAfterFee || 1)) *
                            100
                          ).toFixed(1)}%)`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <PieLegend data={revenueData} />
                <div className="text-center mt-2 text-sm text-gray-500">
                  Tổng doanh thu sau phí:{" "}
                  {dashboardData?.totalRevenueAfterFee?.toLocaleString() || "0"}{" "}
                  VNĐ
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Không có dữ liệu doanh thu để hiển thị
              </div>
            )}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Thống kê sản phẩm theo tháng
            </h3>
            <select
              className="border-2 border-gray-200 rounded-lg px-4 py-2 bg-white focus:border-amber-500 focus:outline-none transition-colors"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  Năm {year}
                </option>
              ))}
            </select>
          </div>

          {lineChartData.labels && lineChartData.labels.length > 0 ? (
            <div style={{ height: "400px" }}>
              <Line data={lineChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Không có dữ liệu để hiển thị
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
