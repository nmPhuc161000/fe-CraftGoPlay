import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DailyCheckInService from "../../../../services/apis/dailyCheckInApi"; // Adjust path as needed
import { AuthContext } from "../../../../contexts/AuthContext";

const DailyCheckInTab = () => {
  const [checkInStatus, setCheckInStatus] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const rewards = [100, 100, 100, 200, 100, 100, 200];
  const dayNames = [
    "Ngày 1",
    "Ngày 2",
    "Ngày 3",
    "Ngày 4",
    "Ngày 5",
    "Ngày 6",
    "Ngày 7",
  ];
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Update streak when user enters the tab
        await DailyCheckInService.updateStreak(userId);

        // Check if user has checked in today
        const hasCheckedResponse = await DailyCheckInService.hasCheckedIn(
          userId
        );
        setHasCheckedInToday(hasCheckedResponse.data.data);

        // Get current streak
        const streakResponse = await DailyCheckInService.getCurrentStreak(
          userId
        );
        const streakDays = streakResponse.data.data || 0;
        const newStatus = Array(7).fill(false);
        for (let i = 0; i < Math.min(streakDays, 7); i++) {
          newStatus[i] = true;
        }
        setCheckInStatus(newStatus);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        alert("Không thể tải dữ liệu điểm danh. Vui lòng thử lại!");
      }
    };

    fetchInitialData();
  }, [userId]);

  const handleCheckIn = async () => {
    if (hasCheckedInToday) {
      alert("Bạn đã điểm danh hôm nay!");
      return;
    }

    try {
      // Create FormData for checkIn API
      const formData = new FormData();
      formData.append("UserId", userId);
      console.log([...formData.entries()]);

      const response = await DailyCheckInService.checkIn(formData);
      const todayIndex = checkInStatus.findIndex((status) => !status);
      if (todayIndex !== -1) {
        const newStatus = [...checkInStatus];
        newStatus[todayIndex] = true;
        setCheckInStatus(newStatus);
        setHasCheckedInToday(true);
        alert(
          response.data.message || `Bạn đã nhận ${rewards[todayIndex]} xu!`
        );
      }
    } catch (error) {
      console.error("Check-in error:", error);
      alert("Điểm danh thất bại. Vui lòng thử lại!");
    }
  };

  const currentStreak = checkInStatus.filter(status => status).length;

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/profile-user/points"
          className="flex items-center text-gray-600 hover:text-orange-500 transition"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại
        </Link>
        <h2 className="text-2xl font-bold text-orange-600">
          Điểm danh nhận xu
        </h2>
        <div className="w-5"></div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Tiến trình: {currentStreak}/7 ngày
          </span>
          <span className="text-sm font-medium text-orange-600">
            {rewards.reduce(
              (acc, curr, i) => (checkInStatus[i] ? acc + curr : acc),
              0
            )}{" "}
            xu đã nhận
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-orange-500 h-2.5 rounded-full"
            style={{ width: `${(currentStreak / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mb-8">
        {checkInStatus.map((checked, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              checked
                ? "bg-gradient-to-b from-orange-100 to-orange-50 border-2 border-orange-300 shadow-inner"
                : "bg-gray-50 border-2 border-gray-200"
            } ${index === 6 ? "relative" : ""}`}
          >
            <span className="text-xs font-medium text-gray-500">
              {dayNames[index]}
            </span>
            <span className="text-lg font-bold my-1">{index + 1}</span>
            {checked ? (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <span className="text-xs font-medium text-gray-400">
                {rewards[index]} xu
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={handleCheckIn}
          className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105 ${
            hasCheckedInToday || checkInStatus.every((status) => status)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-orange-200"
          }`}
          disabled={
            hasCheckedInToday || checkInStatus.every((status) => status)
          }
        >
          {hasCheckedInToday || checkInStatus.every((status) => status)
            ? "Đã điểm danh"
            : "Điểm danh ngay"}
        </button>
        <p className="text-sm text-gray-500 mt-3 text-center">
          Điểm danh liên tục 7 ngày để nhận thêm xu!
        </p>
      </div>
    </div>
  );
};

export default DailyCheckInTab;
