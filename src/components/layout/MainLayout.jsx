import Header from "../Header/Header"; // Component Header riêng
import Footer from "../Footer/Footer"; // Component Footer riêng


// MainLayout.jsx
const MainLayout = ({ children }) => {  // Nhận children prop
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children} {/* Render children thay vì Outlet */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
