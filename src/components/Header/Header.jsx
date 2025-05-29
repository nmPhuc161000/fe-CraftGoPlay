import { Link } from 'react-router-dom';

const Header = ({ isAuthenticated, user }) => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          MyApp
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:underline">
            Trang chủ
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/cart" className="hover:underline">
                Giỏ hàng
              </Link>
              <div className="flex items-center space-x-2">
                <span>Xin chào, {user?.name}</span>
                <button className="ml-4 px-3 py-1 bg-red-500 rounded hover:bg-red-600">
                  Đăng xuất
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Đăng nhập
              </Link>
              <Link to="/register" className="hover:underline">
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;