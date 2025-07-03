import React, { useContext, useEffect, useState } from "react";
import ProductCard from "../../../components/profile/ProductCard";
import { AuthContext } from "../../../contexts/AuthContext";
import favoriteService from "../../../services/apis/favoriteApi";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useNotification } from "../../../contexts/NotificationContext";
import { MESSAGES } from "../../../constants/messages";

export default function FavoritesTab() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { showNotification } = useNotification();

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await favoriteService.getFavorite(user.id);
      setFavorites(response.data.data || []);
    } catch (error) {
      setError(error.message);
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFavorite = async (userId, productId, id) => {
    try {
      const response = await favoriteService.deleteFavorite(userId, productId);
      showNotification(
        response.message || MESSAGES.FAVORITE.DELETE_SUCCESS,
        "success"
      );
      // Cập nhật UI mà không cần gọi lại API
      setFavorites((prev) => prev.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa yêu thích:", error);
      showNotification("Xóa yêu thích thất bại", "error");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5e3a1e]"></div>
        <p className="mt-2">Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-1 bg-gray-100 rounded hover:bg-gray-200"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#5e3a1e]">Sản phẩm yêu thích</h3>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.product.id} className="relative">
              <Link to={`/product/${favorite.product.id}`} className="block">
                <ProductCard product={favorite.product} isFavorite={true} />
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Ngăn Link chuyển trang
                  e.stopPropagation(); // Ngăn sự kiện nổi bọt
                  handleDeleteFavorite(user.id, favorite.product.id, favorite.id);
                }}
                className="absolute top-2 right-2 z-20 text-red-500 hover:scale-110 transition-transform bg-white/80 rounded-full p-1"
                title="Bỏ yêu thích"
              >
                <FaHeart className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
