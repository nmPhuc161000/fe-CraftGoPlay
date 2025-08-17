import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import ratingService from "../../../../services/apis/ratingApi";
import { FaStar, FaRegStar } from "react-icons/fa";

const ArtisanReviewsTab = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchArtisanReviews = async () => {
      if (!user?.id) return;

      try {
        const res = await ratingService.getRatingsByArtisanId(
          user.id,
          0,
          10
        );
        const reviews = res.data?.data || [];
        setReviews(reviews);
      } catch (error) {
        console.error("Lỗi khi tải đánh giá nghệ nhân:", error);
      }
    };

    fetchArtisanReviews();
  }, [user?.id]);


  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-[#333]">
        Đánh giá từ khách hàng
      </h2>

      {reviews.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Chưa có đánh giá nào.
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => {
            const product = review.product || {};
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-6 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      review.thumbnail ||
                      "https://ui-avatars.com/api/?name=" + review.userName
                    }
                    alt={review.userName}
                    className="w-12 h-12 rounded-full border shadow-sm"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800">
                      {review.userName}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(review.ratedAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) =>
                      i < review.star ? (
                        <FaStar key={i} className="text-yellow-400" />
                      ) : (
                        <FaRegStar key={i} className="text-gray-300" />
                      )
                    )}
                    <span className="ml-2 text-sm text-gray-600">
                      {review.star}/5
                    </span>
                  </div>
                </div>

                {/* Product info */}
                <div className="flex gap-6">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                    <img
                      src={product.productImages?.[0]?.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* details */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Chi tiết:{" "}
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                        {product.description}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Loại:{" "}
                      <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                        {product.subCategoryName}
                      </span>
                    </p>
                    <p className="text-base font-semibold text-red-600">
                      {product.price?.toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>

                {/* Comment */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <p className="text-gray-700 italic">“{review.comment}”</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ArtisanReviewsTab;
