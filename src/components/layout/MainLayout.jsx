import Header from "../Header/Header"; // Component Header riêng
import Footer from "../Footer/Footer"; // Component Footer riêng

// MainLayout.jsx
const MainLayout = ({ children }) => {
  // Nhận children prop
  const role = localStorage.getItem("role");
  return (
    <div className="min-h-screen flex flex-col">
      {!role === "Artisan" && <Header />}{" "}
      {/* Hiển thị Header nếu không phải là Artisan */}
      <main className="flex-grow">
        {children} {/* Render children thay vì Outlet */}
      </main>
      {!role === "Artisan" && <Footer />}{" "}
      {/* Hiển thị Footer nếu không phải là Artisan */}
    </div>
  );
};

export default MainLayout;
