const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4 text-center">
        <p>© 2023 MyApp. All rights reserved.</p>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="#" className="hover:text-blue-400">
            Điều khoản
          </a>
          <a href="#" className="hover:text-blue-400">
            Chính sách
          </a>
          <a href="#" className="hover:text-blue-400">
            Liên hệ
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;