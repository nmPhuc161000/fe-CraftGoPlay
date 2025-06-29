// src/components/layout/MainLayout.jsx
import { motion } from "framer-motion";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

// MainLayout.jsx
const MainLayout = ({ children }) => {
  // Nhận children prop
  const role = localStorage.getItem("role");
  return (
    <div className="min-h-screen flex flex-col">
      {role !== "Artisan" && <Header />}{" "}
      {/* Hiển thị Header nếu không phải là Artisan */}
      <motion.main
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children} {/* Render children thay vì Outlet */}
      </motion.main>
      {role !== "Artisan" && <Footer />}{" "}
      {/* Hiển thị Footer nếu không phải là Artisan */}
    </div>
  );
};

export default MainLayout;
