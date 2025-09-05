import React, { useEffect, useRef, useState } from "react";
import MainLayout from "../../components/layout/MainLayout";

export default function Game() {
  const [isGameLoaded, setIsGameLoaded] = useState(false);   // toggle màn intro
  const [loading, setLoading] = useState(false);              // loading Unity
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const unityInstanceRef = useRef(null);
  const loaderScriptRef = useRef(null);

  const buildRoot = "/CraftGoPlayGame/Build"; // <-- ĐƯỜNG DẪN TUYỆT ĐỐI từ gốc site

  const startUnity = () => {
    setLoading(true);
    setError("");

    // tạo <script> nạp loader
    const script = document.createElement("script");
    script.src = `${buildRoot}/CraftGoPlay.loader.js`;
    script.async = true;
    script.onload = () => {
      // window.createUnityInstance do loader cung cấp
      if (typeof createUnityInstance !== "function") {
        setError("Không tìm thấy createUnityInstance từ loader.");
        setLoading(false);
        return;
      }

      // CẤU HÌNH: dùng đúng tên file KHÔNG .br
      const config = {
        dataUrl: `${buildRoot}/CraftGoPlay.data`,
        frameworkUrl: `${buildRoot}/CraftGoPlay.framework.js`,
        codeUrl: `${buildRoot}/CraftGoPlay.wasm`,
        streamingAssetsUrl: "StreamingAssets",
        companyName: "CGP",
        productName: "CraftGoPlay",
        productVersion: "1.0",
      };

      createUnityInstance(canvasRef.current, config, (progress) => {
        // bạn có thể dùng progress (0..1) nếu muốn thanh progress
      })
        .then((instance) => {
          unityInstanceRef.current = instance;
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setError("Không khởi tạo được Unity instance.");
          setLoading(false);
        });
    };
    script.onerror = () => {
      setError("Không tải được CraftGoPlay.loader.js (sai đường dẫn?).");
      setLoading(false);
    };
    document.body.appendChild(script);
    loaderScriptRef.current = script;
  };

  const handlePlayClick = (e) => {
    e.preventDefault();
    setIsGameLoaded(true); // ẩn intro
    startUnity();          // bắt đầu nạp Unity
  };

  // cleanup khi rời trang
  useEffect(() => {
    return () => {
      if (unityInstanceRef.current) {
        try { unityInstanceRef.current.Quit(); } catch {}
      }
      if (loaderScriptRef.current) {
        try { document.body.removeChild(loaderScriptRef.current); } catch {}
      }
    };
  }, []);

  return (
    <MainLayout>
      <div
        className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
          isGameLoaded ? "bg-black" : "bg-cover bg-center"
        }`}
        style={{
          backgroundImage: !isGameLoaded
            ? "url('http://res.cloudinary.com/dqnq00784/image/upload/v1753625525/kpnnembzq1bgwncat0hq.png')"
            : undefined,
          backgroundAttachment: !isGameLoaded ? "fixed" : undefined,
        }}
      >
        {!isGameLoaded && (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-20 w-1 h-1 bg-green-300 rounded-full animate-bounce"></div>
            <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse"></div>
            <div className="absolute top-60 left-1/4 w-1 h-1 bg-pink-300 rounded-full animate-bounce"></div>
          </div>
        )}

        <div
          className={`min-h-screen flex items-center justify-center px-4 transition-all duration-500 ${
            isGameLoaded
              ? "bg-transparent p-0"
              : "bg-gradient-to-b from-black/40 via-black/50 to-black/60"
          }`}
        >
          <div
            className={`relative w-full transition-all duration-500 ${
              isGameLoaded ? "max-w-none h-screen" : "max-w-6xl"
            }`}
          >
            {!isGameLoaded && (
              <>
                <div className="absolute -top-6 -left-6 w-12 h-12 border-4 border-green-400/30 rounded-full animate-spin"></div>
                <div className="absolute -bottom-6 -right-6 w-8 h-8 border-4 border-yellow-400/30 rounded-full animate-pulse"></div>
              </>
            )}

            <div
              className={`transition-all duration-500 ${
                isGameLoaded
                  ? "bg-transparent border-0 rounded-none p-0 shadow-none h-screen w-full"
                  : "backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-12 shadow-2xl min-h-[500px]"
              }`}
            >
              {!isGameLoaded ? (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent leading-tight">
                      🌱 Nông Trại 🌾
                    </h1>
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent flex-1"></div>
                      <span className="text-white/80 text-sm font-medium px-4">
                        Cuộc sống nông thôn yên bình
                      </span>
                      <div className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent flex-1"></div>
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <p className="text-white/90 text-lg leading-relaxed mb-6 font-light">
                      Chào mừng bạn đến với thế giới nông trại kỳ diệu! …
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm font-medium border border-green-400/30">
                        🌱 Trồng cây
                      </span>
                      <span className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium border border-blue-400/30">
                        💰 Kinh doanh
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a
                      href="#"
                      onClick={handlePlayClick}
                      className="group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
                    >
                      <span className="text-xl">🎮</span>
                      <span>Chơi ngay</span>
                      <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </a>
                  </div>

                  <div className="text-center mt-8 pt-6 border-t border-white/20">
                    <p className="text-white/60 text-sm font-light">
                      ✨ Khám phá thế giới nông nghiệp đầy màu sắc ✨
                    </p>
                  </div>
                </>
              ) : (
                // Vùng game: canvas + overlay loading/error
                <div className="relative w-full h-screen">
                  <canvas ref={canvasRef} className="w-full h-full" />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                      Đang tải trò chơi…
                    </div>
                  )}
                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-600 text-white px-4 py-3 rounded">
                        {error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {!isGameLoaded && (
          <>
            <div className="absolute top-10 left-10 text-4xl animate-bounce opacity-70">
              🌻
            </div>
            <div className="absolute top-20 right-10 text-3xl animate-pulse opacity-70">
              🦋
            </div>
            <div
              className="absolute bottom-20 left-20 text-3xl animate-bounce opacity-70"
              style={{ animationDelay: "1s" }}
            >
              🐝
            </div>
            <div
              className="absolute bottom-10 right-20 text-4xl animate-pulse opacity-70"
              style={{ animationDelay: "0.5s" }}
            >
              🌸
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
