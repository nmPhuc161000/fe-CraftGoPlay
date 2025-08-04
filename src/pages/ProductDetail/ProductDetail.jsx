import React, { useState, useEffect, useContext, useCallback } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import ProductReviews from "./components/ProductReviews";
import { CartContext } from "../../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import productService from "../../services/apis/productApi";
import Notification from "../../components/Notification/Notification";
import favoriteService from "../../services/apis/favoriteApi";
import { useNotification } from "../../contexts/NotificationContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedImg, setSelectedImg] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [showFavoriteMessage, setShowFavoriteMessage] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { showNotification } = useNotification();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const cartItem = useContext(CartContext)?.cartItems?.find(item => item.product?.id === product?.id);
  const quantityInCart = cartItem?.quantity || 0;
  //tong trong kho
  const totalStock = Number(product?.quantity) || 0;
  //so sanh so luong da ban
  const quantitySold = Number(product?.quantitySold) || 0;
  const availableStock = totalStock - quantitySold;
  //kiem tra neu vuot qua so luong trong kho
  const isPlusDisabled = (quantity + quantityInCart) >= availableStock;


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productService.getProductById(id);
        const data = res.data?.data;
        console.log("Product data:", data);

        setProduct(data);
        if (data?.productImages?.length > 0) {
          setSelectedImg(data.productImages[0].imageUrl);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Fake fetch API
  useEffect(() => {
    const fakeFetchReviews = async () => {
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Nguyễn Văn A",
              rating: 5,
              comment: "Sản phẩm rất đẹp và chất lượng, giao hàng nhanh.",
            },
            {
              id: 2,
              name: "Trần Thị B",
              rating: 4,
              comment: "Đóng gói kỹ, sản phẩm như mô tả, sẽ ủng hộ tiếp.",
            },
            {
              id: 3,
              name: "Lê Minh C",
              rating: 5,
              comment: "Tinh xảo, đúng chất hàng thủ công. Rất hài lòng!",
            },
          ]);
        }, 500)
      );

      setReviews(response);
    };

    fakeFetchReviews();
  }, []);

  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    navigate("/checkout", {
      state: {
        buyNow: {
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: selectedImg,
          quantity: quantity,
          artisanName: product.artisanName,
          artisanId: product.artisan_id,
          weight: product.weight,
          height: product.height,
          width: product.width,
          length: product.length,
        },
      },
    });
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    if (quantity + quantityInCart > availableStock) {
      const remaining = Math.max(0, availableStock - quantityInCart);
      showNotification(
        `Chỉ còn ${remaining} sản phẩm trong kho. Bạn đã có ${quantityInCart} trong giỏ hàng.`,
        "error"
      );
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: selectedImg,
      quantity: quantity,
      stock: product.quantity,
    });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3500);
  };

  const handleFavorite = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isAuthenticated) {
        navigate("/login", { state: { from: location.pathname } });
        return;
      }

      try {
        if (isFavorite) {
          // Nếu đã thích thì gọi API xóa yêu thích
          const response = await favoriteService.deleteFavorite(
            user.id,
            product.id
          );
          if (!response.success) {
            throw new Error(response.error || "Lỗi khi xóa yêu thích");
          }
          setIsFavorite(false);
          showNotification("Bỏ yêu thích thành công", "success");
          setTimeout(() => setShowFavoriteMessage(false), 3500);
        } else {
          // Nếu chưa thích thì gọi API thêm yêu thích
          const formData = {
            userId: user.id,
            productId: product.id,
          };
          const response = await favoriteService.addFavorite(formData);
          if (!response.success) {
            throw new Error(response.error || "Lỗi khi thêm yêu thích");
          }
          setIsFavorite(true);
          showNotification("Thêm yêu thích thành công", "success");
          setTimeout(() => setShowFavoriteMessage(false), 3500);
        }
      } catch (error) {
        console.error("Error handling favorite:", error);
      }
    },
    [
      isFavorite,
      isAuthenticated,
      navigate,
      location.pathname,
      user,
      product,
    ]
  );

  // Thêm dependency vào useEffect kiểm tra yêu thích
  useEffect(() => {
    const checkFavorite = async () => {
      if (user && product) {
        // Thêm điều kiện kiểm tra user và product tồn tại
        try {
          const response = await favoriteService.getCheckFavorite(
            user.id,
            product.id
          );
          setIsFavorite(response.data?.isFavorited);
        } catch (error) {
          console.error(error);
        }
      }
    };

    checkFavorite();
  }, [user, product]); // Thêm dependencies

  if (!product)
    return <div className="text-center py-12">Đang tải sản phẩm...</div>;

  return (
    <MainLayout>
      {showFavoriteMessage && (
        <Notification
          message="Đã thêm vào danh sách yêu thích!"
          type="success"
          onClose={() => setShowFavoriteMessage(false)}
        />
      )}

      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 text-[#5e3a1e]">
        {/* img san pham */}
        <div className="flex flex-col md:w-1/2">
          {selectedImg && (
            <img
              src={selectedImg}
              alt="product"
              className="w-full h-[420px] object-cover rounded-md"
            />
          )}
          <div className="flex mt-4 gap-2 overflow-x-auto">
            {product.productImages?.map((imgObj, index) => (
              <img
                key={index}
                src={imgObj.imageUrl}
                alt={`thumb-${index}`}
                onClick={() => setSelectedImg(imgObj.imageUrl)}
                className={`w-17 h-17 object-cover cursor-pointer border ${imgObj.imageUrl === selectedImg
                  ? "border-black"
                  : "border-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* thong tin */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold leading-snug break-words">{product.name}</h1>
          <p className="text-2xl text-red-600 mt-2">
            {product.price.toLocaleString()}₫
          </p>
          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2 leading-snug break-words">Mô Tả Sản Phẩm</h3>
            <p className="">{product.description}</p>
          </div>
          <ul className=" mt-4 text-gray-800 space-y-1 text-base list-disc list-inside">
            <li>
              <span className="font-medium text-[#5e3a1e]">Trọng lượng:</span> {product.weight}g
            </li>
            <li>
              <span className="font-medium text-[#5e3a1e]">Kích thước:</span> {product.length}cm × {product.width}cm × {product.height}cm
            </li>
          </ul>

          {/* gioi thieu them */}
          <div className="mt-6">
            <details className="mb-4 border-b pb-2">
              <summary className="cursor-pointer font-bold">
                Chất Liệu Tạo Nên Sự Khác Biệt
              </summary>
              <div className="mt-2 space-y-1">
                {product.meterials?.length > 0 ? (
                  product.meterials.map((material, index) => (
                    <p key={index}>• {material.name || material}</p>
                  ))
                ) : (
                  <p>Không có thông tin chất liệu.</p>
                )}
              </div>
            </details>
            <details className="mb-4 border-b pb-2">
              <summary className="cursor-pointer font-bold">
                Nghệ Nhân Chế Tác Thủ Công
              </summary>
              <p className="mt-2">
                {product.artisanName ? (
                  <>
                    Sản phẩm được chế tác bởi{" "}
                    <Link
                      to={`/artisan/${product.artisan_id}`}
                      className="text-[#5e3a1e] underline:none hover:text-[#3f2812] font-bold"
                    >
                      {product.artisanName}
                    </Link>
                    .
                  </>
                ) : (
                  "Không có thông tin nghệ nhân."
                )}
              </p>
            </details>
          </div>

          {/* quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-lg font-medium">Số lượng:</span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-lg font-bold text-[#5e3a1e] hover:bg-[#e6d3bc] transition"
              >
                −
              </button>
              <span className="px-5 py-2 text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                disabled={isPlusDisabled}
                className={`px-4 py-2 text-lg font-bold text-[#5e3a1e] hover:bg-[#e6d3bc] transition ${isPlusDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              👍 <span>Bảo hành</span>
            </div>
            <div className="flex items-center gap-1">
              📦 <span> Còn {availableStock} sản phẩm</span>
            </div>
          </div>

          {/* button */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              className="text-white px-6 py-2 rounded bg-[#5e3a1e] hover:bg-[#4a2f15]"
              onClick={() => handleBuyNow(product)}
            >
              Mua ngay
            </button>
            <button
              className={`text-white px-6 py-2 rounded transition duration-200 ${product.quantity > 0
                ? "bg-[#5e3a1e] hover:bg-[#4a2f15] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed opacity-60"
                }`}
              onClick={handleAddToCart}
              disabled={product.quantity <= 0}
            >
              🛒 Thêm vào giỏ hàng
            </button>
            <button
              className={`border ${isFavorite ? "bg-yellow-50 text-yellow-700" : "text-yellow-700"
                } border-yellow-700 px-6 py-2 rounded hover:bg-yellow-100 transition-colors`}
              onClick={handleFavorite}
            >
              {isFavorite ? "🤎 Đã Thích" : "🤎 Yêu Thích"}
            </button>
          </div>
        </div>
      </div>

      {/* dang gia san pham */}
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-12"></div>
      <div className="container mx-auto px-6 pb-12 text-[#5e3a1e]">
        <ProductReviews reviews={reviews} />
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
