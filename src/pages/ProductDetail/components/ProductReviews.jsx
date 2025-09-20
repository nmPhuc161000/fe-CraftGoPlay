import React, { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import ratingService from "../../../services/apis/ratingApi";

const ProductReviews = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getInitial = (name) => name?.trim().charAt(0).toUpperCase();

    useEffect(() => {
        const fetchReviews = async () => {
            if (!productId) {
                setError("Không có productId được cung cấp.");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const res = await ratingService.getRatingsByProductId(productId, 0, 10); // Lấy 10 đánh giá đầu tiên
                const fetchedReviews = res.data?.data || [];
                const formattedReviews = fetchedReviews.map((review, index) => ({
                    id: review.id || `${review.userId}-${index}`,
                    name: review.userName || "Người dùng ẩn danh",
                    avatar: review.avatarUrl || null,
                    rating: review.star || 0,
                    comment: review.comment || "Không có nhận xét",
                    ratedAt: review.ratedAt || null,
                }));
                setReviews(formattedReviews);
            } catch (err) {
                console.error("Lỗi khi lấy đánh giá:", err);
                setError("Không thể tải danh sách đánh giá.");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [productId]);

    // Hàm định dạng thời gian
    const formatDate = (dateString) => {
        if (!dateString) return "Không xác định";
        const now = new Date();
        const ratedDate = new Date(dateString);
        const diffMs = now - ratedDate;

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        if (diffMinutes < 60) {
            return diffMinutes === 0 ? "Vừa xong" : `${diffMinutes} phút trước`;
        }
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        }
        // Định dạng đầy đủ nếu quá 24 giờ
        return ratedDate.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) return <p className="text-[#5e3a1e] text-center">Đang tải...</p>;
    if (error) return <p className="text-[#5e3a1e] text-center">{error}</p>;

    return (
        <div className="text-[#5e3a1e]">
            <h3 className="text-3xl font-bold mb-6">Đánh giá sản phẩm</h3>

            {reviews.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center shadow-xl border border-[#d4a373]/30">
                    <p className="text-xl italic text-[#8b5e3c]/80">
                        Chưa có đánh giá nào.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <span className="inline-block w-16 h-1 bg-[#d4a373] rounded-full animate-pulse"></span>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review, reviewIndex) => (
                        <div
                            key={review.id}
                            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#d4a373]/20 hover:border-[#8b5e3c]/30 transform hover:-translate-y-2"
                        >
                            <div className="flex items-start gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    {review.avatar ? (
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-16 h-16 rounded-full object-cover shadow-md ring-2 ring-[#d4a373]/50"
                                            crossOrigin="anonymous"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f3e7db] to-[#d4a373]/50 flex items-center justify-center text-2xl font-bold text-[#8b5e3c] shadow-md ring-2 ring-[#d4a373]/30">
                                            {getInitial(review.name)}
                                        </div>
                                    )}
                                    <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-[#8b5e3c] rounded-full flex items-center justify-center text-white text-xs">
                                        ✓
                                    </div>
                                </div>

                                {/* Nội dung đánh giá */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xl font-semibold text-[#5e3a1e] drop-shadow">
                                            {review.name}
                                        </span>
                                        <div className="text-yellow-500 text-2xl leading-none flex items-center space-x-1">
                                            {[...Array(5)].map((_, i) => (
                                                <FiStar
                                                    key={`${reviewIndex}-star-${i}`}
                                                    className={`${i < review.rating ? "text-yellow-500" : "text-gray-300"} transition-colors duration-300`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-base text-[#5e3a1e]/90 mb-3 leading-relaxed">
                                        {review.comment}
                                    </p>
                                    <p className="text-sm text-[#8b5e3c]/70 font-medium">
                                        {formatDate(review.ratedAt)}
                                    </p>
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