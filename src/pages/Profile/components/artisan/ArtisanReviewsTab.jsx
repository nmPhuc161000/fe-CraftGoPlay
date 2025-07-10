// components/profile/ArtisanReviewsTab.jsx
import { useEffect, useState } from "react";

const ArtisanReviewsTab = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Dữ liệu giả lập
    const fakeReviews = [
      {
        id: 1,
        customerName: "Nguyễn Văn A",
        rating: 5,
        comment: "Sản phẩm rất đẹp và chất lượng!",
        createdAt: "2025-07-01",
      },
      {
        id: 2,
        customerName: "Trần Thị B",
        rating: 4,
        comment: "Tôi rất hài lòng với dịch vụ.",
        createdAt: "2025-07-05",
      },
    ];

    setReviews(fakeReviews);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h2>
      {reviews.length === 0 ? (
        <p>Chưa có đánh giá nào.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <p className="text-sm text-gray-700 mb-2">
                <strong>{review.customerName}</strong> – {review.createdAt}
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

export default ArtisanReviewsTab;
