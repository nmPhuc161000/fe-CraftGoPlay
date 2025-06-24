import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import ProductReviews from "./components/ProductReviews";

const sampleProduct = {
  name: "Sản phẩm thủ công bằng Tre",
  price: 13990000,
  description: `Lấy cảm hứng từ vẻ đẹp huyền bí của những đền tháp cổ Á Đông, Majestic Mahjong Set tái hiện tinh hoa văn hoá qua từng nét chạm khắc tinh xảo. Một tác phẩm nghệ thuật giao thoa giữa lịch sử và nghệ thuật, bộ cờ vừa toát lên vẻ cổ kính uy nghi, vừa tạo dấu ấn độc bản cho trải nghiệm chơi và trưng bày.`,
  images: [
    "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
    "https://mynghesenviet.vn/wp-content/uploads/2020/01/20190504_115952_petu.jpg",
    "https://wikiluat.com/wp-content/uploads/2017/11/12maytredanXKquangnam5_0792_640x426.jpg",
  ],
  warranty: "12 tháng",
  shipping: "Miễn phí vận chuyển",
};

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImg, setSelectedImg] = useState(sampleProduct.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  // Fake fetch API
  useEffect(() => {
    const fakeFetchReviews = async () => {
      // Giả lập API trả về dữ liệu
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

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 text-[#5e3a1e]">
        {/* img san pham */}
        <div className="flex flex-col md:w-1/2">
          <img src={selectedImg} alt="product" className="w-full rounded-md" />
          <div className="flex mt-4 gap-2 overflow-x-auto">
            {sampleProduct.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                onClick={() => setSelectedImg(img)}
                className={`w-16 h-16 object-cover cursor-pointer border ${img === selectedImg ? "border-black" : "border-gray-300"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* thong tin */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold">{sampleProduct.name}</h1>
          <p className="text-2xl text-red-600 mt-2">
            {sampleProduct.price.toLocaleString()}₫
          </p>
          <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2">Mô Tả Sản Phẩm</h3>
            <p className="">{sampleProduct.description}</p>
          </div>

          {/* gioi thieu them */}
          <div className="mt-6">
            <details className="mb-4 border-b pb-2">
              <summary className="cursor-pointer font-bold">
                Chất Liệu Tạo Nên Sự Khác Biệt
              </summary>
              <p className="mt-2">
                Sản phẩm thủ công từ tre được ưa chuộng trong và ngoài nước có
                thể kể đến là: đèn mây tre, gương tre, mẹt tre, khay tre, giỏ
                tre, bàn tre, ghế tre, mành tre che nắng, ống hút tre
              </p>
            </details>
            <details className="mb-4 border-b pb-2">
              <summary className="cursor-pointer font-bold">
                Nghệ Nhân Chế Tác Thủ Công
              </summary>
              <p className="mt-2">
                Mỗi chi tiết được làm thủ công bởi nghệ nhân lành nghề.
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
                className="px-4 py-2 text-lg font-bold text-[#5e3a1e] hover:bg-[#e6d3bc] transition"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-6 flex gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              👍 <span>Bảo hành {sampleProduct.warranty}</span>
            </div>
            <div className="flex items-center gap-1">
              📦 <span>{sampleProduct.shipping}</span>
            </div>
          </div>

          {/* button */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="text-white px-6 py-2 rounded bg-[#b28940] hover:bg-[#9e7635]">
              Thêm vào giỏ hàng
            </button>
            <button className="border border-yellow-700 text-yellow-700 px-6 py-2 rounded hover:bg-yellow-50">
              🤎 Yêu Thích
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
