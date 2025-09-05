import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import loginImg from "../../assets/images/background2.png"; // Đảm bảo đường dẫn đúng

const About = () => {
  return (
    <MainLayout>
      {/* Phần Hero với Banner */}
      <div className="relative w-full h-[500px]">
        <img
          src={loginImg}
          alt="CraftGoPlay Banner Giới thiệu"
          className="w-full h-full object-cover object-center"
          crossorigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Về CraftGoPlay
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Khám phá câu chuyện của chúng tôi
            </p>
          </div>
        </div>
      </div>

      {/* Phần Nội dung Giới thiệu */}
      <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-[#5e3a1e] text-center mb-10">
            Câu Chuyện Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Phần văn bản */}
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                CraftGoPlay ra đời từ niềm đam mê kết nối nghệ thuật thủ công
                truyền thống với thế giới trò chơi hiện đại. Với tầm nhìn trao
                quyền cho các nghệ nhân, chúng tôi đã xây dựng một nền tảng nơi
                sự sáng tạo được nuôi dưỡng. Hành trình bắt đầu từ một cộng đồng
                nhỏ các nghệ nhân tại Việt Nam, và giờ đây, chúng tôi kết nối
                hàng nghìn nhà sáng tạo với khách hàng trên toàn cầu.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Tại CraftGoPlay, chúng tôi tôn vinh sự tinh xảo thủ công, mang
                đến những sản phẩm độc đáo, mỗi món đồ đều kể một câu chuyện văn
                hóa. Kết hợp với các trò chơi mini hấp dẫn, nền tảng của chúng
                tôi tạo ra trải nghiệm độc đáo, hòa quyện giữa nghệ thuật, văn
                hóa và niềm vui.
              </p>
            </div>

            {/* Phần hình ảnh và văn bản nổi */}
            <div className="relative h-64 md:h-[400px] lg:h-[500px]">
              <div className="bg-[#5e3a1e]/10 rounded-lg p-6 h-full flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Hình ảnh nền với kích thước nhỏ hơn một chút */}
                  <img
                    src={loginImg}
                    alt="About CraftGoPlay"
                    className="absolute inset-0 w-[80%] h-[80%] object-cover opacity-50 rounded-lg mx-auto my-auto transition-transform duration-300 hover:scale-105"
                    crossorigin="anonymous"
                  />
                  {/* Văn bản trên hình ảnh */}
                  <p className="text-[#5e3a1e] text-center text-xl md:text-2xl font-semibold relative z-10 px-4 py-2 bg-white/80 rounded-md shadow-lg">
                    "Nơi Nghệ Thuật Gặp Gỡ Trò Chơi"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phần Sứ Mệnh & Tầm Nhìn */}
      <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-white to-gray-100">
        <h2 className="text-4xl md:text-5xl font-bold text-[#5e3a1e] text-center mb-12 animate-fade-in">
          Sứ Mệnh & Tầm Nhìn
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Card Sứ Mệnh */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transform-gpu perspective-1000">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#5e3a1e]/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-[#5e3a1e] text-lg">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-[#5e3a1e] mb-0">
                Sứ Mệnh
              </h3>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Trao quyền cho các nghệ nhân bằng cách cung cấp một thị trường
              toàn cầu, mang đến trải nghiệm phong phú với sản phẩm thủ công
              đích thực và trò chơi tương tác hấp dẫn.
            </p>
          </div>

          {/* Card Tầm Nhìn */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 transform-gpu perspective-1000">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-[#5e3a1e]/20 rounded-full flex items-center justify-center mr-3">
                <span className="text-[#5e3a1e] text-lg">🌐</span>
              </div>
              <h3 className="text-xl font-semibold text-[#5e3a1e] mb-0">
                Tầm Nhìn
              </h3>
            </div>
            <p className="text-gray-600 text-base leading-relaxed">
              Trở thành nền tảng hàng đầu nơi sáng tạo, công nghệ và cộng đồng
              giao thoa, định hình tương lai của thương mại điện tử và giải trí.
            </p>
          </div>
        </div>
      </div>

      {/* Phần Đội Ngũ */}
      <div className="w-full px-4 sm:px-6 lg:px-20 py-16 bg-gradient-to-br from-white to-gray-100">
        <h2 className="text-4xl md:text-5xl font-bold text-[#5e3a1e] text-center mb-12 animate-fade-in">
          Gặp Gỡ Đội Ngũ Của Chúng Tôi
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Backend 1 */}
          <div className="text-center group">
            <div className="w-32 h-32 mx-auto rounded-full bg-[#5e3a1e]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-3xl text-[#5e3a1e]">💻</span>
            </div>
            <h3 className="text-xl font-semibold text-[#5e3a1e] mt-4">
              Ừng Cẩm Tuấn Kiệt
            </h3>
            <p className="text-gray-600">Backend Developer</p>
          </div>

          {/* Backend 2 */}
          <div className="text-center group">
            <div className="w-32 h-32 mx-auto rounded-full bg-[#5e3a1e]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-3xl text-[#5e3a1e]">💾</span>
            </div>
            <h3 className="text-xl font-semibold text-[#5e3a1e] mt-4">
              Nguyễn Minh Phúc
            </h3>
            <p className="text-gray-600">Backend Developer</p>
          </div>

          {/* Frontend */}
          <div className="text-center group">
            <div className="w-32 h-32 mx-auto rounded-full bg-[#5e3a1e]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-3xl text-[#5e3a1e]">🎨</span>
            </div>
            <h3 className="text-xl font-semibold text-[#5e3a1e] mt-4">
              Nguyễn Thành Tiến
            </h3>
            <p className="text-gray-600">Frontend Developer</p>
          </div>

          {/* Unity Developer */}
          <div className="text-center group">
            <div className="w-32 h-32 mx-auto rounded-full bg-[#5e3a1e]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="text-3xl text-[#5e3a1e]">🎮</span>
            </div>
            <h3 className="text-xl font-semibold text-[#5e3a1e] mt-4">
              Nguyễn Ngọc Bao
            </h3>
            <p className="text-gray-600">Unity Developer</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
