import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaStar, FaShoppingCart } from "react-icons/fa";
import productService from "../../../services/apis/productApi";

const formatVND = (value) =>
    (Number(value) || 0).toLocaleString("vi-VN") + "₫";
const formatSold = (n = 0) =>
    n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "k" : String(n);

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.001, type: "spring", stiffness: 120, damping: 16 },
    }),
    hover: { scale: 1.04, boxShadow: "0 8px 32px 0 rgba(94,58,30,0.10)" },
};

const ArtisanProducts = ({ artisanId }) => {
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async (pageIndex = 1) => {
            setLoading(true);
            try {
                const res = await productService.getProductsByArtisanId(artisanId, pageIndex, 50, "Active");
                console.log("Response getProductsByArtisanId:", res);

                const list = Array.isArray(res?.data?.data) ? res.data.data : [];

                const filtered = list.filter(p => (Number(p?.quantity) || 0) > 0);
                setProducts(filtered);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm nghệ nhân:", err);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (artisanId) fetchProducts(1);
        else {
            setProducts([]);
            setLoading(false);
        }
    }, [artisanId]);

    const filtered = useMemo(() => {
        const term = filterText.trim().toLowerCase();
        const list = Array.isArray(products) ? products : [];
        return term
            ? list.filter((p) => (p?.name || "").toLowerCase().includes(term))
            : list;
    }, [products, filterText]);

    return (
        <div className="bg-gradient-to-br from-[#f5ede6] via-[#f5f5f5] to-[#f7f3ef] min-h-[350px] w-full py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <h2 className="text-2xl font-bold text-[#5e3a1e] tracking-tight">
                        Sản phẩm của nghệ nhân
                    </h2>
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

                {/* Loading */}
                {loading && (
                    <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
                )}

                {/* Product Grid */}
                <AnimatePresence>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7">
                        {filtered.map((item, idx) => {
                            const name = item?.name ?? "Sản phẩm";
                            const price = item?.price ?? 0;
                            const sold = item?.sold ?? item?.quantitySold ?? 0;
                            const subCategoryName = item?.subCategoryName;

                            // Ảnh: ưu tiên imageUrl; fallback productImages[0].imageUrl; cuối cùng /no-image.png
                            const img =
                                item?.imageUrl ||
                                item?.productImages?.[0]?.imageUrl ||
                                "/no-image.png";

                            const ratingValue = (() => {
                                if (typeof item?.averageRating === "number") return item.averageRating;
                                const rs = item?.ratings;
                                if (Array.isArray(rs) && rs.length > 0) {
                                    const sum = rs.reduce((acc, r) => acc + (Number(r?.star) || 0), 0);
                                    return +(sum / rs.length).toFixed(1);
                                }
                                if (typeof item?.rating === "number") return item.rating;
                                return 0;
                            })();

                            return (
                                <motion.div
                                    key={(item?.id || name) + idx}
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
                                            src={img}
                                            alt={name}
                                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            whileHover={{ scale: 1.08 }}
                                            draggable={false}
                                        />
                                        <motion.div
                                            className="absolute top-3 right-3 bg-[#fff7e6] text-[#c7903f] px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: { delay: 0.2 + idx * 0.01 },
                                            }}
                                        >
                                            {formatSold(sold)} đã bán
                                        </motion.div>
                                    </div>

                                    <div className="flex-1 flex flex-col px-5 py-4">
                                        <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[20px]">
                                            {name}
                                        </h3>

                                        <div className="flex items-center gap-1 text-sm text-yellow-500 mb-4">
                                            <FaStar className="inline-block" />
                                            <span className="font-medium text-gray-700 ml-1">
                                                {ratingValue}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[#ee4d2d] text-lg font-bold">
                                                {formatVND(price)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 text-sm text-yellow-500 mb-4">
                                            <span className="text-gray-500 text-medium">
                                                Danh mục: {subCategoryName}
                                            </span>
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
                            );
                        })}
                    </div>
                </AnimatePresence>

                {!loading && filtered.length === 0 && (
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