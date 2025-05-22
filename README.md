# CraftGoPlay

**CraftGoPlay** là một ứng dụng web thương mại điện tử xây dựng bằng React, hỗ trợ xác thực người dùng, duyệt sản phẩm và giỏ hàng. Dự án được tổ chức theo mô-đun, dễ mở rộng và bảo trì.

## Cấu trúc dự án

Dưới đây là giải thích các thư mục chính trong `src/`:

- **`constants/`**: Chứa các hằng số.
  - `api.jsx`: Định nghĩa `API_BASE_URL` và các nhóm điểm cuối API (`API_ENDPOINTS_AUTH`, `API_ENDPOINTS_HOME`, `API_ENDPOINTS_CART`).
  - `messages.jsx`: Thông báo lỗi/thành công.

- **`services/`**: Quản lý API và cấu hình.
  - `apis/`:
    - `authApi.jsx`: API xác thực (đăng nhập, đăng ký, xác nhận email, v.v.).
    - `homeApi.jsx`: API trang chủ (lấy sản phẩm).
    - `cartApi.jsx`: API giỏ hàng (lấy giỏ, thêm sản phẩm).
  - `axiosInstance.jsx`: Cấu hình Axios, thêm token vào header và xử lý lỗi 401.
  - `index.jsx`: Xuất tất cả API.

- **`hooks/`**: Chứa custom React Hooks.
  - `useAuth.jsx`: Xử lý xác thực (đăng nhập, đăng ký, v.v.) với React Query.
  - `useCart.jsx`: Quản lý giỏ hàng (lấy giỏ, thêm sản phẩm).

- **`context/`**: Quản lý trạng thái toàn cục.
  - `AuthContext.jsx`: Lưu thông tin người dùng và trạng thái xác thực.

- **`pages/`**: Các trang giao diện.
  - `Login/Login.jsx`: Trang đăng nhập.
  - `Register/Register.jsx`: Trang đăng ký.
  - `ForgotPassword/ForgotPassword.jsx`: Trang quên mật khẩu.
  - `ResetPassword/ResetPassword.jsx`: Trang đặt lại mật khẩu.
  - `VerifyEmail/VerifyEmail.jsx`: Trang xác nhận email.
  - `Home/Home.jsx`: Trang chủ hiển thị sản phẩm.
  - `Cart/Cart.jsx`: Trang giỏ hàng.

- **`router/`**: Định tuyến.
  - `index.js`: Cấu hình các route (`/login`, `/cart`, v.v.).

- **`App.jsx`**: Component chính của ứng dụng.
- **`main.jsx`**: Điểm vào của ứng dụng.
- **`index.css`**: CSS toàn cục.

## Bắt đầu

1. **Cài đặt**:
   ```bash
   git clone <repository-url>
   cd my-react-app
   npm install
   ```

2. **Chạy dự án**:
   ```bash
   npm run dev
   ```
   Truy cập `http://localhost:5173` để kiểm tra các trang:
   - Đăng nhập: `/login`
   - Trang chủ: `/`
   - Giỏ hàng: `/cart`

## Đóng góp

- Fork repository, tạo branch mới (`feature/<tên-tính-năng>`).
- Thêm code trong `services/api/`, `hooks/`, hoặc `pages/`.
- Commit và tạo Pull Request trên GitHub.