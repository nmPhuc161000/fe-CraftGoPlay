import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DailyCheckInTab = () => {
  // Mock data for check-in status (true = checked in, false = not checked in)
  const [checkInStatus, setCheckInStatus] = useState([true, true, false, false, false, false, false]);
  const rewards = [100, 100, 100, 100, 100, 200, 500]; // Xu rewards for each day
  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

  // Handle check-in action
  const handleCheckIn = () => {
    const todayIndex = checkInStatus.findIndex(status => !status);
    if (todayIndex !== -1 && !checkInStatus[todayIndex]) {
      const newStatus = [...checkInStatus];
      newStatus[todayIndex] = true;
      setCheckInStatus(newStatus);
      alert(`Bạn đã nhận ${rewards[todayIndex]} xu!`);
    } else {
      alert('Bạn đã điểm danh hôm nay hoặc đã hoàn thành 7 ngày!');
    }
  };

  // Calculate current streak
  const currentStreak = checkInStatus.lastIndexOf(false) === -1 
    ? 7 
    : checkInStatus.lastIndexOf(false);

  return (
    <div className="w-full p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Link
          to="/profile-user/points"
          className="flex items-center text-gray-600 hover:text-orange-500 transition"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Quay lại
        </Link>
        <h2 className="text-2xl font-bold text-orange-600">Điểm danh nhận xu</h2>
        <div className="w-5"></div> {/* Spacer for alignment */}
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Tiến trình: {currentStreak}/7 ngày</span>
          <span className="text-sm font-medium text-orange-600">{rewards.reduce((acc, curr, i) => checkInStatus[i] ? acc + curr : acc, 0)} xu đã nhận</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-orange-500 h-2.5 rounded-full" 
            style={{ width: `${(currentStreak / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {checkInStatus.map((checked, index) => (
          <div
            key={index}
            className={`flex flex-col items-center p-3 rounded-xl transition-all ${
              checked 
                ? 'bg-gradient-to-b from-orange-100 to-orange-50 border-2 border-orange-300 shadow-inner'
                : 'bg-gray-50 border-2 border-gray-200'
            } ${index === 6 ? 'relative' : ''}`}
          >
            {index === 6 && (
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                +{rewards[index]}
              </div>
            )}
            <span className="text-xs font-medium text-gray-500">{dayNames[index]}</span>
            <span className="text-lg font-bold my-1">{index + 1}</span>
            {checked ? (
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-xs font-medium text-gray-400">{rewards[index]} xu</span>
            )}
          </div>
        ))}
      </div>

      {/* Check-in button */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleCheckIn}
          className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all transform hover:scale-105 ${
            checkInStatus.every(status => status) 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-orange-200'
          }`}
          disabled={checkInStatus.every(status => status)}
        >
          {checkInStatus.every(status => status) 
            ? 'Đã hoàn thành' 
            : 'Điểm danh ngay'}
        </button>
        <p className="text-sm text-gray-500 mt-3 text-center">
          Điểm danh liên tục 7 ngày để nhận <span className="font-bold text-orange-500">500 xu</span> vào ngày cuối!
        </p>
      </div>
    </div>
  );
};

export default DailyCheckInTab;