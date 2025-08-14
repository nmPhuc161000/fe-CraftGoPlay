import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import { useNotification } from "../../../../contexts/NotificationContext";
import returnRequestService from "../../../../services/apis/returnrequestApi";
import { FiPackage, FiArrowLeft } from "react-icons/fi";
import orderService from "../../../../services/apis/orderApi";

const ReturnRequestTab = () => {
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const orderItemId = new URLSearchParams(location.search).get("orderItemId") || "";
  const orderId = new URLSearchParams(location.search).get("orderId") || "";

  const [formData, setFormData] = useState({
    reason: "",
    otherReason: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderItemId || !user?.id) {
      showNotification("Thiếu thông tin sản phẩm hoặc người dùng", "error");
      return;
    }
    if (!formData.reason) {
      showNotification("Vui lòng chọn lý do trả hàng", "error");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("OrderItemId", orderItemId); // bắt buộc theo API
      data.append("UserId", user.id);          // bắt buộc theo API
      data.append("Reason", formData.reason);  // lý do trả hàng
      if (formData.reason === "Other") {
        data.append("OtherReason", formData.otherReason || "");
      }
      data.append("Description", formData.description || "");
      if (formData.image) {
        data.append("ImageUrl", formData.image);
      }

      const res = await returnRequestService.createReturnRequest(data);
      if (res.data.error === 0) {
        showNotification("Yêu cầu trả hàng thành công", "success");
        await orderService.updateStatusOrder(orderId, "ReturnRequested");
        navigate("/profile-user/orders", {
          state: { expandedOrderId: orderId },
        });
      } else {
        showNotification(res.data.message || "Lỗi khi gửi yêu cầu trả hàng", "error");
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu trả hàng:", err);
      showNotification("Có lỗi xảy ra khi gửi yêu cầu trả hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-50 to-orange-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <button
          onClick={() => navigate("/profile-user/orders")}
          className="mb-8 flex items-center text-orange-700 hover:text-orange-900 font-semibold transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FiArrowLeft className="mr-2 text-xl" />
          Quay lại đơn hàng
        </button>
        <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 p-10">
          <div className="flex items-center mb-8">
            <FiPackage className="text-3xl text-orange-600 mr-3" />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Yêu cầu trả hàng
            </h1>
            <span className="ml-2 text-lg text-gray-600">
              (Mã sản phẩm #{orderItemId.split("-")[0].toUpperCase()})
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do trả hàng <span className="text-orange-500">*</span>
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white shadow-sm transition duration-300 ease-in-out hover:border-orange-300"
                required
              >
                <option value="">Chọn lý do</option>
                <option value="ChangedMind">Đổi ý</option>
                <option value="WrongItemDelivered">Giao sai sản phẩm</option>
                <option value="DamagedOrDefective">Hư hỏng hoặc lỗi</option>
                <option value="NotAsDescribed">Không như mô tả</option>
                <option value="LateDelivery">Giao hàng muộn</option>
                <option value="NoLongerNeeded">Không còn cần</option>
                <option value="MissingPartsOrAccessories">Thiếu bộ phận/phụ kiện</option>
                <option value="OrderedByMistake">Đặt hàng nhầm</option>
                <option value="Other">Khác</option>
              </select>
            </div>
            {formData.reason === "Other" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do khác
                </label>
                <input
                  type="text"
                  name="otherReason"
                  value={formData.otherReason}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white shadow-sm transition duration-300 ease-in-out hover:border-orange-300"
                  placeholder="Vui lòng nêu rõ lý do"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white shadow-sm transition duration-300 ease-in-out hover:border-orange-300"
                rows="5"
                placeholder="Mô tả lý do trả hàng (tùy chọn)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh minh họa (tùy chọn)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFormChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-gray-700 bg-white shadow-sm transition duration-300 ease-in-out file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/profile-user/orders")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:from-orange-600 hover:to-orange-700 shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ReturnRequestTab);
