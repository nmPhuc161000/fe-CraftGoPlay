import React, { useState } from "react";
import { FaStore, FaStar, FaUser, FaIndustry, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ArtisanDetail = () => {
    const [artisan] = useState({
        name: "Kenco.clothing",
        countProduct: 320,
        ratings: 4.8,
        ratingsCount: 12000,
        createAt: new Date(2018, 3, 1),
        img: "https://media.cnn.com/api/v1/images/stellar/prod/180703082251-pride-kiss.jpg?q=x_4,y_178,h_1965,w_3492,c_crop/h_833,w_1480",
        craftVillage: "Thợ thủ công",
        description: "Nghệ nhân với nhiều năm kinh nghiệm, chuyên tạo ra các sản phẩm thủ công tinh xảo, độc đáo và mang đậm dấu ấn cá nhân.",
    });

    function formatNumberToK(num) {
        if (num < 1000) return num.toString();
        const formatted = (num / 1000).toFixed(1).replace('.', ',');
        return `${formatted}K`;
    }

    function getYearDiff(date) {
        const now = new Date();
        const diff = now.getFullYear() - date.getFullYear();
        return diff > 0 ? `${diff} Năm Trước` : "Mới tham gia";
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-[#f5ede6] via-[#f5f5f5] to-[#f7f3ef] py-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-2xl shadow-lg p-8 border border-[#e7d7c2]">
                    {/* Avatar & Name */}
                    <motion.div
                        className="flex flex-col items-center md:items-start gap-4 md:w-1/3 w-full"
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="relative">
                            <img
                                className="rounded-full w-32 h-32 object-cover border-4 border-[#c7903f] shadow-lg"
                                src={artisan.img}
                                alt={artisan.name}
                            />
                            <span className="absolute bottom-2 right-2 bg-gradient-to-r from-[#8b5e3c] to-[#c7903f] text-white text-xs px-3 py-1 rounded-full shadow font-semibold">
                                Nghệ nhân
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#5e3a1e]">{artisan.name}</h2>
                        <p className="text-gray-500 text-center md:text-left">{artisan.description}</p>
                    </motion.div>

                    {/* Info Grid */}
                    <motion.div
                        className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Sản phẩm */}
                        <div className="cursor-pointer flex flex-col items-center bg-[#fff7e6] rounded-xl px-5 py-3 shadow hover:shadow-lg transition text-center">
                            <FaStore className="text-3xl text-[#c7903f] mb-2" />
                            <span className="text-gray-500 font-medium">Sản phẩm</span>
                            <span className="text-[#ee4d2d] text-sm font-bold">{artisan.countProduct}</span>
                        </div>
                        {/* Đánh giá */}
                        <div className="cursor-pointer flex flex-col items-center bg-[#fff7e6] rounded-xl px-5 py-3 shadow hover:shadow-lg transition text-center">
                            <FaStar className="text-3xl text-yellow-400 mb-2" />
                            <span className="text-gray-500 font-medium">Đánh giá</span>
                            <span className="text-[#ee4d2d] text-xl font-bold flex items-center gap-1 justify-center">
                                {artisan.ratings}
                                <span className="text-sm text-gray-600 font-normal">
                                    ({formatNumberToK(artisan.ratingsCount)})
                                </span>
                            </span>
                        </div>
                        {/* Tham gia */}
                        <div className="cursor-pointer flex flex-col items-center bg-[#fff7e6] rounded-xl px-5 py-3 shadow hover:shadow-lg transition text-center">
                            <FaCalendarAlt className="text-3xl text-[#c7903f] mb-2" />
                            <span className="text-gray-500 font-medium">Tham gia</span>
                            <span className="text-[#ee4d2d] text-sm font-bold">{getYearDiff(artisan.createAt)}</span>
                        </div>
                        {/* Làng nghề */}
                        <div className="cursor-pointer flex flex-col items-center bg-[#fff7e6] rounded-xl px-5 py-3 shadow hover:shadow-lg transition text-center">
                            <FaIndustry className="text-3xl text-[#c7903f] mb-2" />
                            <span className="text-gray-500 font-medium">Làng nghề</span>
                            <span className="text-[#ee4d2d] text-sm font-bold">{artisan.craftVillage}</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default ArtisanDetail;