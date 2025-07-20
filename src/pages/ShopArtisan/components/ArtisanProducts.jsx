import React, { useState } from "react";

const ArtisanProducts = () => {
    const [filterText, setFilterText] = useState("");

    const [products, setProducts] = useState(
        [
            {
                name: "đồ gốm 1",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },
            {
                name: "đồ gốm 2",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },
            {
                name: "đồ gốm 3",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },

            {
                name: "đồ gốm 4",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },
            {
                name: "đồ gốm 5",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },
            {
                name: "đồ gốm 6",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },
            {
                name: "đồ gốm 7",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },
            {
                name: "đồ gốm 8",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },
            {
                name: "đồ gốm 9",
                price: 120000,
                img: "https://vn1.vdrive.vn/trongtinbattrang.com/2022/01/gomsu4-1.jpg",
                ratings: 3,
                sold: 20
            },
        ]
    )

    const formatVND = (value) => {
        return value.toLocaleString("vi-VN") + "₫";
    };

    const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(filterText.toLowerCase())
    );

    const formatSold = (number) => {
        if (number >= 1000) {
            return (number / 1000).toFixed(1).replace(".0", "") + "k";
        }
        return number.toString();
    };

    return (
        <div className="bg-[#f5f5f5] min-h-[302px] w-full py-10">
            <div className="max-w-[1300px] mx-auto px-5">
                {/* Filter */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Sản phẩm của nghệ nhân</h2>
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {filtered.map((item, index) => (
                        <div key={index} className="bg-white rounded-md shadow-sm hover:shadow-md transition duration-300 border border-gray-200 overflow-hidden">
                            <div className="relative cursor-pointer">
                                <img src={item.img} alt={item.name} className="w-full h-[200px] object-cover" />
                            </div>
                            <div className="px-4 py-3">
                                {/* Tên sản phẩm */}
                                <h3 className="text-lg font-normal leading-snug line-clamp-2 h-[40px]">{item.name}</h3>

                                {/* Giá & Giảm giá */}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[#ee4d2d] font-semibold">{formatVND(item.price)}</span>
                                </div>

                                {/* Rating + Đã bán */}
                                <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="text-sm font-medium mr-2">{item.ratings}</span>
                                        <span>Đã bán {formatSold(item.sold)}</span>
                                    </div>
                                    <button className="flex items-center py-1 px-3 gap-1 text-white bg-[#5e3a1e] rounded-[999px] cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-dasharray="16" stroke-dashoffset="16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M5 12h14"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.4s" values="16;0" /></path><path d="M12 5v14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.4s" values="16;0" /></path></g></svg>
                                        <span className="mr-1">Mua</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">Không tìm thấy sản phẩm nào.</p>
                )}
            </div>
        </div>
    );
}

export default ArtisanProducts;