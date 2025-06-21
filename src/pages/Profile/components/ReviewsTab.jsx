import React from 'react';

export default function ReviewsTab({ userId, isArtisan }) {
  const reviews = [
    { id: 1, user: 'Nguyễn Thị B', rating: 5, comment: 'Sản phẩm tuyệt vời, chất lượng tốt', date: '20/05/2023' },
    { id: 2, user: 'Trần Văn C', rating: 4, comment: 'Giao hàng hơi chậm nhưng sản phẩm đẹp', date: '12/04/2023' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-[#5e3a1e]">
          {isArtisan ? 'Đánh giá về sản phẩm' : 'Đánh giá của bạn'}
        </h3>
        {!isArtisan && (
          <button className="px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28]">
            Viết đánh giá
          </button>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {isArtisan ? 'Chưa có đánh giá nào' : 'Bạn chưa đánh giá sản phẩm nào'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex justify-between">
                <h4 className="font-medium">{review.user}</h4>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
              <div className="flex mt-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="mt-2 text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}