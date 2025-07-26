import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaStar, FaShoppingCart } from "react-icons/fa";

const productsData = [
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
];

const formatVND = (value) => value.toLocaleString("vi-VN") + "₫";
const formatSold = (number) => (number >= 1000 ? (number / 1000).toFixed(1).replace(".0", "") + "k" : number.toString());

// Giảm thời gian delay giữa các lần hover của các thẻ
const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.001, type: "spring", stiffness: 120, damping: 16 } // giảm delay từ 0.06 xuống 0.02
    }),
    hover: { scale: 1.04, boxShadow: "0 8px 32px 0 rgba(94,58,30,0.10)" }
};

const ArtisanProducts = () => {
    const [filterText, setFilterText] = useState("");

    const filtered = productsData.filter((product) =>
        product.name.toLowerCase().includes(filterText.toLowerCase())
    );

    return (
        <div className="bg-gradient-to-br from-[#f5ede6] via-[#f5f5f5] to-[#f7f3ef] min-h-[350px] w-full py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-[#5e3a1e] tracking-tight">Sản phẩm của nghệ nhân</h2>
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#c7903f] focus:border-transparent text-base bg-white transition"
                            value={filterText}
                            onChange={(e) => setFilterText(e.target.value)}
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    </div>
                </div>

                {/* Product Grid */}
                <AnimatePresence>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7">
                        {filtered.map((item, idx) => (
                            <motion.div
                                key={item.name + idx}
                                className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden flex flex-col group transition"
                                custom={idx}
                                variants={cardVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                exit={{ opacity: 0, y: 40, scale: 0.96, transition: { duration: 0.2 } }}
                            >
                                <div className="relative overflow-hidden">
                                    <motion.img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                        whileHover={{ scale: 1.08 }}
                                        draggable={false}
                                    />
                                    <motion.div
                                        className="absolute top-3 right-3 bg-[#fff7e6] text-[#c7903f] px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + idx * 0.01 } }} // giảm delay từ 0.03 xuống 0.01
                                    >
                                        {formatSold(item.sold)} đã bán
                                    </motion.div>
                                </div>
                                <div className="flex-1 flex flex-col px-5 py-4">
                                    {/* Tên sản phẩm */}
                                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[44px]">{item.name}</h3>
                                    {/* Giá */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[#ee4d2d] text-lg font-bold">{formatVND(item.price)}</span>
                                    </div>
                                    {/* Rating */}
                                    <div className="flex items-center gap-1 text-sm text-yellow-500 mb-4">
                                        <FaStar className="inline-block" />
                                        <span className="font-medium text-gray-700 ml-1">{item.ratings}</span>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.06, backgroundColor: "#7a4a22" }}
                                        whileTap={{ scale: 0.97 }}
                                        className="mt-auto flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] text-white font-semibold shadow transition-all"
                                    >
                                        <FaShoppingCart className="text-base" />
                                        <span>Mua ngay</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>

                {filtered.length === 0 && (
                    <motion.p
                        className="text-center text-gray-400 mt-10 text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Không tìm thấy sản phẩm nào.
                    </motion.p>
                )}
            </div>
        </div>
    );
};

export default ArtisanProducts;