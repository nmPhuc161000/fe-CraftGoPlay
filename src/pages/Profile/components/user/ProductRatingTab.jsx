import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import ratingService from "../../../../services/apis/ratingApi";
import { FiStar, FiArrowLeft } from "react-icons/fi";
import { useNotification } from "../../../../contexts/NotificationContext"; // Kiểm tra đường dẫn

const ProductRatingTab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedProductImage, setSelectedProductImage] = useState("");
  const [availableProducts, setAvailableProducts] = useState([]);
  const notification = useNotification(); // Lấy giá trị từ useNotification
  const showNotification = notification?.showNotification || ((msg, type) => console.log(`${type}: ${msg}`)); // [SỬA] - Fallback

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const productId = searchParams.get("productId");
    const productName = searchParams.get("productName");
    const orderItems = searchParams.get("orderItems");

    if (orderItems) {
      try {
        const items = JSON.parse(decodeURIComponent(orderItems));
        setAvailableProducts(items.map(item => ({
          ...item,
          imageUrl: item.product?.productImages?.imageUrl || item.imageUrl || ""
        })));
      } catch (e) {
        console.error("Lỗi khi parse orderItems:", e);
      }
    } else if (productId && productName) {
      setSelectedProductId(productId);
      setSelectedProductName(decodeURIComponent(productName));
      const productImage = searchParams.get("productImage");
      if (productImage) {
        setSelectedProductImage(decodeURIComponent(productImage));
      }
    } else {
      console.warn("Thiếu tham số cần thiết:", { productId, productName });
    }
  }, [searchParams]);

  const handleStarHover = (value) => setHoverRating(value);
  const handleStarLeave = () => setHoverRating(0);
  const handleStarClick = (value) => setRating(value);

  const handleSelectProduct = (productId, productName, productImage) => {
    setSelectedProductId(productId);
    setSelectedProductName(productName);
    setSelectedProductImage(productImage || "");
    setAvailableProducts([]);
  };

  const handleSubmitRating = async () => {
    if (!rating || !selectedProductId || !content.trim()) {
      alert("Vui lòng chọn số sao và viết nhận xét");
      return;
    }

    try {
      setLoading(true);
      const data = {
        userId: user?.id || "",
        productId: selectedProductId,
        star: rating,
        comment: content,
      };
      const res = await ratingService.rateProduct(data);
      if (res.data.error === 0) {
        showNotification("Đánh giá thành công! +100 xu đã được cộng vào ví", "success");
        setTimeout(() => {
          navigate("/profile-user/orders", {
            state: { expandedOrderId: searchParams.get("orderId") },
          });
        }, 1000);
      } else {
        showNotification(res.data.message || "Sản phẩm đã được đánh giá", "success");
      }
    } catch (err) {
      console.error("Lỗi API đầy đủ:", err);
      showNotification(
        err.response?.data?.message || err.message || "Lỗi khi đánh giá sản phẩm",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatProductCode = (id) => {
    if (!id) return "";
    const shortId = id.slice(0, 8).toUpperCase();
    return `${shortId.slice(0, 4)}-${shortId.slice(4)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-indigo-100 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 transform transition-all duration-300 hover:shadow-2xl">
        <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-4">
          <h2 className="text-3xl font-bold text-gray-900">Đánh giá sản phẩm</h2>
          <button
            onClick={() => navigate("/profile-user/orders", { state: { expandedOrderId: searchParams.get("orderId") } })}
            className="flex items-center text-gray-600 hover:text-indigo-700 transition-colors duration-300"
          >
            <FiArrowLeft className="mr-2 text-xl" />
            Quay lại
          </button>
        </div>

        {availableProducts.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">Chọn sản phẩm để đánh giá</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableProducts.map((item) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                  onClick={() => handleSelectProduct(item.id, item.name, item.imageUrl)}
                >
                  <div className="w-full h-56 overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Hình ảnh không có</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="text-md font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">Mã Sản Phẩm: {formatProductCode(item.id)}</p>
                  </div>
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                    {item.quantity || 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : selectedProductId ? (
          <div className="space-y-8">
            <div className="flex items-center space-x-6 p-5 bg-white rounded-xl border border-gray-200 shadow-lg">
              <div className="w-40 h-40 overflow-hidden rounded-xl border border-gray-300">
                {selectedProductImage ? (
                  <img
                    src={selectedProductImage}
                    alt={selectedProductName}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Hình ảnh không có</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{selectedProductName}</h3>
                <p className="text-sm text-gray-600 mt-1">Mã sản phẩm: {formatProductCode(selectedProductId)}</p>
              </div>
            </div>

            {/* rating */}
            <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-lg">
              <label className="block text-lg font-medium text-gray-700 mb-3">Đánh giá của bạn</label>
              <div className="flex items-center space-x-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`cursor-pointer text-3xl transition-transform duration-300 hover:scale-125 ${hoverRating || rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    onClick={() => handleStarClick(star)}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">{rating > 0 ? `${rating} sao` : "Chưa chọn"}</p>
            </div>

            {/* comment */}
            <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-lg">
              <label className="block text-lg font-medium text-gray-700 mb-3">Nhận xét của bạn</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-gray-400 shadow-inner"
                rows="6"
                placeholder="Viết nhận xét chi tiết về sản phẩm (tối đa 500 ký tự)..."
                maxLength={500}
              />
              <p className="text-right text-sm text-gray-500 mt-1">{content.length}/500</p>
            </div>

            {/* button */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => navigate("/profile-user/orders", { state: { expandedOrderId: searchParams.get("orderId") } })}
                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 shadow-md"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitRating}
                disabled={!rating || loading}
                className={`px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-md">
            <p className="text-gray-600 mb-4">Không có sản phẩm để đánh giá. Vui lòng kiểm tra lại đơn hàng.</p>
            <button
              onClick={() => navigate("/profile-user/orders", { state: { expandedOrderId: searchParams.get("orderId") } })}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-md"
            >
              Quay lại đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRatingTab;