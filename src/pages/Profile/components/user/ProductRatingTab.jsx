import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import ratingService from "../../../../services/apis/ratingApi";
import { FiStar, FiArrowLeft } from "react-icons/fi";
import { useNotification } from "../../../../contexts/NotificationContext";

const ProductRatingTab = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const notification = useNotification();
  const showNotification =
    notification?.showNotification ||
    ((msg, type) => console.log(`${type}: ${msg}`));
  const [loading, setLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const orderItems = searchParams.get("orderItems");
    if (orderItems) {
      try {
        const items = JSON.parse(decodeURIComponent(orderItems));
        const products = items.map((item) => ({
          id: item.id,
          name: item.name,
          imageUrl:
            item.product?.productImages?.imageUrl || item.imageUrl || "",
          orderItemId: item.orderItemId,
          price: item.price || 0,
        }));
        setAvailableProducts(products);
        setRatings(
          products.map((product) => ({
            productId: product.id,
            orderItemId: product.orderItemId,
            star: 0,
            comment: "",
            hoverStar: 0,
          }))
        );
      } catch (e) {
        console.error("Lỗi khi parse orderItems:", e);
        showNotification("Lỗi khi tải sản phẩm để đánh giá!", "error");
      }
    } else {
      console.warn("Không có orderItems trong searchParams.");
      showNotification("Không có sản phẩm để đánh giá!", "warning");
    }
  }, [searchParams]);

  const handleStarClick = (productId, value) => {
    setRatings((prevRatings) =>
      prevRatings.map((rating) =>
        rating.productId === productId ? { ...rating, star: value } : rating
      )
    );
    setErrors((prev) => ({ ...prev, [productId]: "" }));
  };

  const handleStarHover = (productId, value) => {
    setRatings((prevRatings) =>
      prevRatings.map((rating) =>
        rating.productId === productId
          ? { ...rating, hoverStar: value }
          : rating
      )
    );
  };

  const handleStarLeave = (productId) => {
    setRatings((prevRatings) =>
      prevRatings.map((rating) =>
        rating.productId === productId ? { ...rating, hoverStar: 0 } : rating
      )
    );
  };

  const handleCommentChange = (productId, value) => {
    setRatings((prevRatings) =>
      prevRatings.map((rating) =>
        rating.productId === productId ? { ...rating, comment: value } : rating
      )
    );
    setErrors((prev) => ({ ...prev, [productId]: "" }));
  };

  const handleSubmitAllRatings = async () => {
    const newErrors = {};
    ratings.forEach((rating) => {
      if (rating.star === 0) {
        newErrors[rating.productId] = "Vui lòng chọn số sao!";
      } else if (!rating.comment.trim()) {
        newErrors[rating.productId] = "Vui lòng viết nhận xét!";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showNotification(
        "Vui lòng hoàn thành đánh giá cho tất cả sản phẩm!",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);
      let successCount = 0;
      const errorMessages = [];

      // Gửi yêu cầu tuần tự
      for (const rating of ratings) {
        const data = {
          userId: user?.id || "",
          productId: rating.productId,
          orderItemId: rating.orderItemId,
          star: rating.star,
          comment: rating.comment,
        };
        try {
          const result = await ratingService.rateProduct(data);
          if (result.status === 200) {
            successCount++;
          } else {
            errorMessages.push(
              `Lỗi khi đánh giá ${
                availableProducts.find((p) => p.id === rating.productId).name
              }: ${result.data?.message}`
            );
          }
        } catch (err) {
          errorMessages.push(
            `Lỗi khi đánh giá ${
              availableProducts.find((p) => p.id === rating.productId).name
            }: ${err.response?.data?.message || "Lỗi không xác định"}`
          );
        }
      }

      const totalCoins = successCount * 20;
      if (successCount === ratings.length) {
        showNotification(
          `Đánh giá đã được gửi thành công! Bạn nhận được ${totalCoins} xu`,
          "success"
        );
        setTimeout(() => {
          navigate("/profile-user/orders", {
            state: { expandedOrderId: searchParams.get("orderId") },
          });
        }, 1000);
      } else {
        showNotification(`Tất cả sản phẩm đã được đánh giá!`, "error");
        setTimeout(() => {
          navigate("/profile-user/orders", {
            state: { expandedOrderId: searchParams.get("orderId") },
          });
        }, 1000);
      }
    } catch (err) {
      showNotification("Có lỗi xảy ra khi gửi đánh giá!", "error");
      console.error("Lỗi khi gửi đánh giá:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatProductCode = (id) => {
    if (!id) return "";
    const shortId = id.slice(0, 8).toUpperCase();
    return `${shortId.slice(0, 4)}-${shortId.slice(4)}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const completedCount = ratings.filter(
    (rating) => rating.star > 0 && rating.comment.trim()
  ).length;
  const totalCount = ratings.length;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 sm:p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-3xl font-bold text-gray-800 font-sans">
            Đánh giá sản phẩm
          </h2>
          <button
            onClick={() =>
              navigate("/profile-user/orders", {
                state: { expandedOrderId: searchParams.get("orderId") },
              })
            }
            className="flex items-center text-gray-600 hover:text-yellow-600 transition-colors duration-300 text-sm font-medium"
          >
            <FiArrowLeft className="mr-2 text-lg" />
            Quay lại
          </button>
        </div>

        {/* Progress Indicator */}
        {availableProducts.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium text-gray-600">
                Đã đánh giá: {completedCount}/{totalCount} sản phẩm
              </p>
              <p
                className={`text-sm font-semibold ${
                  isAllCompleted ? "text-green-600" : "text-gray-600"
                }`}
              >
                {isAllCompleted ? "Đã hoàn thành!" : "Cần hoàn thành tất cả"}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        {availableProducts.length > 0 ? (
          <div className="space-y-6">
            {availableProducts.map((product, index) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-2xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-200 flex-shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Mã sản phẩm: {formatProductCode(product.id)}
                    </p>
                    <p className="text-sm text-yellow-600 font-medium mt-1">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Đánh giá
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div key={star} className="relative group">
                        <FiStar
                          className={`cursor-pointer text-2xl transition-transform duration-200 hover:scale-125 ${
                            (ratings[index]?.hoverStar ||
                              ratings[index]?.star) >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                          onMouseEnter={() => handleStarHover(product.id, star)}
                          onMouseLeave={() => handleStarLeave(product.id)}
                          onClick={() => handleStarClick(product.id, star)}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {ratings[index]?.star > 0
                      ? `${ratings[index].star} sao`
                      : "Chưa chọn"}
                  </p>
                  {errors[product.id] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[product.id]}
                    </p>
                  )}
                </div>

                {/* Comment */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhận xét
                  </label>
                  <textarea
                    value={ratings[index]?.comment || ""}
                    onChange={(e) =>
                      handleCommentChange(product.id, e.target.value)
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 placeholder-gray-400 text-sm bg-white shadow-sm hover:shadow-md"
                    rows="3"
                    placeholder="Viết nhận xét chi tiết về sản phẩm (tối đa 500 ký tự)..."
                    maxLength={500}
                  />
                  <div className="absolute inset-0 rounded-lg pointer-events-none transition-all duration-300 focus-within:shadow-[0_0_0_2px_rgba(99,102,241,0.3)]" />
                  <p className="text-right text-xs text-gray-500 mt-1">
                    {ratings[index]?.comment.length || 0}/500
                  </p>
                </div>
              </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-between items-center space-x-4 mt-6">
              <p className="text-sm text-yellow-600 font-bold">
                Mỗi 1 sản phẩm được đánh giá sẽ cộng 20 xu vào ví
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    navigate("/profile-user/orders", {
                      state: { expandedOrderId: searchParams.get("orderId") },
                    })
                  }
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-300 shadow-yellow-200 hover:shadow-yellow-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmitAllRatings}
                  disabled={loading || !isAllCompleted}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 shadow-yellow-200 hover:shadow-yellow-200 ${
                    isAllCompleted
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  {loading && (
                    <div className="w-5 h-5 border-2 border-t-transparent border-yellow-200 rounded-full animate-spin" />
                  )}
                  <span>{loading ? "Đang gửi..." : "Gửi tất cả đánh giá"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 shadow-yellow-200">
            <p className="text-gray-600 mb-4">
              Không có sản phẩm để đánh giá. Vui lòng kiểm tra lại đơn hàng.
            </p>
            <button
              onClick={() =>
                navigate("/profile-user/orders", {
                  state: { expandedOrderId: searchParams.get("orderId") },
                })
              }
              className="px-6 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-yellow-200 hover:shadow-yellow-200"
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
