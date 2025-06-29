import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import productService from "../../../services/apis/productApi";

export default function ProductDetailTab() {
  const { productId } = useParams();
  const [product, setProduct] = useState([]);
  console.log( "Product:", product);
  
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(productId);
        console.log("Product detail response:", response.data.data);
        
        if (response.success) {
          setProduct(response.data.data);
          const firstImg = response.data?.data?.productImages?.[0]?.imageUrl;
          if (firstImg) setMainImage(firstImg);
        } else {
          console.error("Không thể tải thông tin sản phẩm:", response.error);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return <p className="text-center text-gray-500 mt-6">Đang tải...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg space-y-6">
      <h2 className="text-3xl font-bold text-[#5e3a1e]">{product.name}</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Hình ảnh */}
        <div className="flex-1">
          <div className="border rounded-lg overflow-hidden">
            <img
              src={mainImage || "/default.jpg"}
              alt={product.name}
              className="w-full h-[360px] object-cover"
              onError={(e) => (e.target.src = "/default.jpg")}
            />
          </div>

          {/* Thumbnails */}
          <div className="flex mt-4 gap-2 overflow-x-auto">
            {product.productImages?.map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt={img.name || "Thumbnail"}
                className={`w-20 h-20 object-cover rounded border cursor-pointer transition-all duration-200 ${
                  mainImage === img.imageUrl
                    ? "border-[#5e3a1e] scale-105"
                    : "border-gray-300"
                }`}
                onClick={() => setMainImage(img.imageUrl)}
              />
            ))}
          </div>
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex-1 space-y-4 text-gray-700">
          <p>
            <strong className="text-[#5e3a1e]">Giá:</strong>{" "}
            {product.price?.toLocaleString()} VND
          </p>
          <p>
            <strong className="text-[#5e3a1e]">Tồn kho:</strong> {product.quantity}
          </p>
          <p>
            <strong className="text-[#5e3a1e]">Đã bán:</strong> {product.soldQuantity}
          </p>
          <p>
            <strong className="text-[#5e3a1e]">Trạng thái:</strong>{" "}
            {product.status === "Active" ? "Đang bán" : "Ngừng bán"}
          </p>
          <p>
            <strong className="text-[#5e3a1e]">Mô tả:</strong>{" "}
            {product.description || "Không có mô tả"}
          </p>
        </div>
      </div>
    </div>
  );
}
