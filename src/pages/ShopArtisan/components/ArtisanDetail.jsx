import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const statsIcons = [
  (
    // Sản phẩm: Shopping bag icon
    <svg className="w-7 h-7 text-[#5e3a1e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.5 12.5A2 2 0 0115.5 22h-7a2 2 0 01-1.99-1.5L3 8zm2-3a4 4 0 018 0v3" />
    </svg>
  ),
  (
    // Đánh giá: Heart icon
    <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
  ),
  (
    // Người theo dõi: User group icon
    <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-6.13a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  (
    // Đánh giá tích cực: Thumbs up icon
    <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-6 0v4M5 15h14a2 2 0 002-2v-5a2 2 0 00-2-2H7.5a2 2 0 00-2 2v7a2 2 0 002 2H19" />
    </svg>
  ),
];

const ArtisanDetail = () => {
  // Dữ liệu mẫu cho artisan
  const [artisan] = useState({
    name: "Artisan hihi",
    avatar: "https://images2.thanhnien.vn/528068263637045248/2024/8/6/edit-z5702195010194b3764a0d29832183f191be8474cec899-17229255731661205687929.jpeg",
    banner: "https://www.datocms-assets.com/32068/1596095737-img5091.jpg",
    verified: true,
    joinDate: "6 tháng 6, 2025",
    about:
      "Chuyên cung cấp các sản phẩm đồ thủ công mỹ nghệ với giá cả phải chăng. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm tinh xảo và dịch vụ chuyên nghiệp.",
    stats: [
      {
        icon: statsIcons[0],
        value: "1,234",
        label: "Sản phẩm",
        delay: 2.2,
      },
      {
        icon: statsIcons[1],
        value: "4.8/5",
        label: "Đánh giá",
        delay: 2.3,
      },
      {
        icon: statsIcons[2],
        value: "12,5K",
        label: "Người theo dõi",
        delay: 2.4,
      },
      {
        icon: statsIcons[3],
        value: "98%",
        label: "Đánh giá tích cực",
        delay: 2.5,
      },
    ],
    contact: {
      address: "123 Đường Lê Duẩn, P. Bến Nghé, Quận 1, TP.HCM",
      phone: "0123 456 789",
      email: "ecohomestore@gmail.com",
    },
  });

  // Sử dụng controls để trigger animate khi mount
  const controls = useAnimation();

  useEffect(() => {
    // Khi component mount, trigger animate
    controls.start("visible");
  }, [controls]);

  return (
    <motion.div
      className="w-full bg-[#f5f5f5] min-h-[800px] relative"
      initial="hidden"
      animate={controls}
      variants={fadeIn}
      custom={0.1}
    >
      <motion.div
        initial="hidden"
        animate={controls}
        variants={fadeIn}
        custom={0}
        className="relative flex justify-center"
      >
        <motion.div
          className="relative w-full h-[320px] md:h-[360px] bg-cover bg-center"
          style={{ backgroundImage: `url('${artisan.banner}')` }}
          variants={fadeInUp}
          custom={0.1}
        >
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 absolute top-[calc(100%-160px)]">
          <motion.div
            className="flex flex-row w-full mb-14 items-center"
            variants={fadeInUp}
            custom={0.3}
          >
            <motion.div
              className="w-35 h-35 rounded-xl overflow-hidden bg-white border-2 border-white shadow-lg mr-4"
              variants={fadeInUp}
              custom={0.4}
            >
              <motion.img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-full h-full object-cover"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              />
            </motion.div>
            <motion.div
              className="flex flex-col"
              variants={fadeInUp}
              custom={0.5}
            >
              <motion.div
                className="mt-2 flex items-center gap-2"
                variants={fadeInUp}
                custom={0.5}
              >
                <motion.span
                  className="text-3xl font-bold text-white whitespace-nowrap"
                  variants={fadeInUp}
                  custom={0.6}
                >
                  {artisan.name}
                </motion.span>
                {artisan.verified && (
                  <motion.span
                    className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                    variants={fadeInUp}
                    custom={0.7}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 6.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                    Đã xác minh
                  </motion.span>
                )}
              </motion.div>
              <motion.div
                className="flex items-center gap-1 mt-1"
                variants={fadeInUp}
                custom={0.8}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-sm">
                  Tham gia từ {artisan.joinDate}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-8">
              {/* About */}
              <motion.div
                className="bg-white rounded-lg shadow p-6"
                variants={fadeInUp}
                custom={1.2}
              >
                <motion.h2
                  className="text-lg font-semibold mb-2 text-[#5e3a1e]"
                  variants={fadeInUp}
                  custom={1.3}
                >
                  Giới thiệu
                </motion.h2>
                <motion.p
                  className="text-gray-700"
                  variants={fadeInUp}
                  custom={1.4}
                >
                  {artisan.about}
                </motion.p>
              </motion.div>
              {/* Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                variants={fadeInUp}
                custom={2.1}
              >
                {artisan.stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    className="bg-white rounded-lg shadow flex flex-col items-center py-6"
                    variants={fadeInUp}
                    custom={stat.delay}
                    whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
                  >
                    <span>{stat.icon}</span>
                    <motion.span className="text-xl font-bold text-[#5e3a1e]" variants={fadeInUp} custom={stat.delay + 0.1}>
                      {stat.value}
                    </motion.span>
                    <motion.span className="text-gray-500 text-xs mt-1" variants={fadeInUp} custom={stat.delay + 0.15}>
                      {stat.label}
                    </motion.span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            {/* Contact Info */}
            <motion.div
              className="bg-white rounded-lg shadow p-6"
              variants={fadeInUp}
              custom={1.5}
            >
              <motion.h2
                className="text-lg font-semibold mb-2 text-[#5e3a1e]"
                variants={fadeInUp}
                custom={1.6}
              >
                Thông tin liên hệ
              </motion.h2>
              <motion.ul
                className="text-gray-700 text-sm space-y-1"
                variants={fadeInUp}
                custom={1.7}
              >
                <motion.li variants={fadeInUp} custom={1.8}>
                  <span className="font-medium">Địa chỉ:</span> {artisan.contact.address}
                </motion.li>
                <motion.li variants={fadeInUp} custom={1.9}>
                  <span className="font-medium">Điện thoại:</span> {artisan.contact.phone}
                </motion.li>
                <motion.li variants={fadeInUp} custom={2.0}>
                  <span className="font-medium">Email:</span> {artisan.contact.email}
                </motion.li>
              </motion.ul>
            </motion.div>
          </div>
        </div>
      </motion.div>
      {/* Banner */}
    </motion.div>
  );
};

export default ArtisanDetail;