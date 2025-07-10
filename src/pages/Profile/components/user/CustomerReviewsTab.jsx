// components/profile/CustomerReviewsTab.jsx
import { useEffect, useState } from "react";

const CustomerReviewsTab = () => {
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    // Dữ liệu giả lập
    const fakeMyReviews = [
      {
        id: 1,
        productName: "Túi vải thổ cẩm",
        rating: 5,
        comment: "Rất đáng tiền, giao hàng nhanh!",
        createdAt: "2025-06-30",
      },
      {
        id: 2,
        productName: "Tranh gỗ thủ công",
        rating: 4,
        comment: "Đẹp nhưng hơi nhỏ hơn mong đợi.",
        createdAt: "2025-07-03",
      },
    ];

    setMyReviews(fakeMyReviews);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Đánh giá của bạn</h2>
      {myReviews.length === 0 ? (
        <p>Bạn chưa viết đánh giá nào.</p>
      ) : (
        <div className="space-y-4">
          {myReviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="text-sm text-gray-700 mb-2">
                <strong>{review.productName}</strong> – {review.createdAt}
              </p>
              <p className="text-yellow-500 mb-1">⭐ {review.rating}/5</p>
              <p className="text-gray-800">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerReviewsTab;
