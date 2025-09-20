import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import ratingService from "../../../../services/apis/ratingApi";
import { FaStar, FaRegStar } from "react-icons/fa"; 

const CustomerReviewsTab = () => {
  const { user } = useContext(AuthContext);
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    const fetchMyReviews = async () => {
      if (!user?.id) return;

      try {
        const res = await ratingService.getRatingsByUserId(user.id, 0, 10);
        const reviews = res.data?.data || [];
        setMyReviews(reviews);
      } catch (error) {
        console.error("Lỗi khi tải đánh giá người dùng:", error);
      }
    };

    fetchMyReviews();
  }, [user]);

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-[#333]">Đánh giá của bạn</h2>

      {myReviews.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Bạn chưa viết đánh giá nào.
        </div>
      ) : (
        <div className="space-y-6">
          {myReviews.map((review, index) => {
            const product = review.product || {};
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 transition hover:shadow-lg"
              >
                {/* Ảnh sản phẩm */}
                <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {product ? (
                    <img
                      src={product.productImages?.[0]?.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Nội dung */}
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-[#1f2937]">
                      {product.name || "Tên sản phẩm không xác định"}
                    </h3>
                    <span className="text-sm text-gray-400">
                      {new Date(review.ratedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-600">{product.description}</p>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) =>
                      i < review.star ? (
                        <FaStar key={i} className="text-yellow-400" />
                      ) : (
                        <FaRegStar key={i} className="text-yellow-300" />
                      )
                    )}
                    <span className="ml-2 text-sm text-gray-500">
                      ({review.star}/5)
                    </span>
                  </div>

                  <div className="bg-gray-100 p-3 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-gray-800 italic">"{review.comment}"</p>
                  </div>

                  {/* <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-700 pt-2">
                    <p>
                      <span className="font-medium">Giá:</span>{" "}
                      {product.price?.toLocaleString()} VND
                    </p>
                    <p>
                      <span className="font-medium">Tình trạng:</span>{" "}
                      {product.status}
                    </p>
                    <p>
                      <span className="font-medium">Số lượng:</span>{" "}
                      {product.quantity}
                    </p>
                    {product.subCategoryName && (
                      <p>
                        <span className="font-medium">Danh mục:</span>{" "}
                        {product.subCategoryName}
                      </p>
                    )}
                    {product.artisanName && (
                      <p>
                        <span className="font-medium">Nghệ nhân:</span>{" "}
                        {product.artisanName}
                      </p>
                    )}
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerReviewsTab;
