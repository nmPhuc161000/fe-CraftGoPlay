import React from "react";

const ProductReviews = ({ reviews = [] }) => {
    const getInitial = (name) => name?.trim().charAt(0).toUpperCase();

    return (
        <div className="text-[#5e3a1e]">
            <h3 className="text-3xl font-bold mb-6">Đánh giá sản phẩm</h3>

            {reviews.length === 0 ? (
                <p className="text-base italic text-gray-500">Chưa có đánh giá nào.</p>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-5">
                            <div className="flex items-start gap-4 mb-2">
                                {/* ava */}
                                {review.avatar ? (
                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="w-10 h-10 rounded-full object-cover shadow"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#f3e7db] flex items-center justify-center text-lg font-bold text-[#5e3a1e] shadow">
                                        {getInitial(review.name)}
                                    </div>
                                )}

                                {/* noi dung danh gia */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-lg">{review.name}</span>
                                        <div className="text-yellow-500 text-2xl leading-none">
                                            {"★".repeat(review.rating)}
                                            {"☆".repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p className="text-base mt-1">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductReviews;
