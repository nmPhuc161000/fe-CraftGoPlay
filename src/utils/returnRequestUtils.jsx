// utils/returnRequestUtils.jsx

// Map trạng thái sang tiếng Việt
export const statusMap = {
  Pending: "Đang chờ",
  Approved: "Đã duyệt",
  Rejected: "Bị từ chối",
  Refunded: "Đã hoàn tiền",
  Escalated: "Đã chuyển đến bộ phận xử lý",
  Resolved: "Đã xử lý",
};

// Map màu sắc cho các trạng thái
export const statusColorMap = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
  Refunded: "bg-green-100 text-green-800",
  Escalated: "bg-purple-100 text-purple-800",
  Resolved: "bg-gray-100 text-gray-800",
};

// Map lý do khiếu nại sang tiếng Việt
export const reasonMap = {
  ChangedMind: "Khách hàng đổi ý không muốn mua nữa",
  WrongItemDelivered: "Nhận sai sản phẩm so với đơn đặt hàng",
  DamagedOrDefective: "Sản phẩm bị lỗi, hư hỏng",
  NotAsDescribed: "Sản phẩm không giống mô tả/ảnh trên website",
  LateDelivery: "Giao hàng trễ hơn thời gian cam kết",
  NoLongerNeeded: "Sản phẩm không còn nhu cầu sử dụng",
  MissingPartsOrAccessories: "Thiếu phụ kiện hoặc bộ phận kèm theo",
  OrderedByMistake: "Mua nhầm, đặt nhầm sản phẩm",
  Other: "Lý do khác"
};

// Map lý do từ chối sang tiếng Việt
export const rejectReasonMap = {
  ProductNotDefective: "Sản phẩm không bị lỗi như khách báo",
  WrongUsage: "Khách sử dụng sai cách gây hỏng",
  MissingEvidence: "Khách không cung cấp đủ bằng chứng",
  ExceededReturnTime: "Quá hạn thời gian cho phép hoàn trả",
  ProductUsedOrDamaged: "Sản phẩm đã qua sử dụng hoặc hư hỏng do khách",
  NotMatchReturnPolicy: "Không đúng chính sách hoàn trả",
  AccessoriesMissing: "Thiếu phụ kiện / quà tặng kèm",
  WrongItemReturned: "Khách trả nhầm sản phẩm không thuộc đơn hàng",
  PackagingNotOriginal: "Bao bì, tem niêm phong không còn nguyên vẹn",
  Other: "Lý do khác",
};

export const orderItemStatusMap = {
  ReturnRequested: "Người dùng yêu cầu trả hàng",
  Returned: "Đơn hàng đã được trả lại",
  Refunded: "Đơn hàng đã được hoàn tiền",
};

// Hàm định dạng ngày tháng
export const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// Hàm định dạng tiền tệ
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "—";
  return `${amount.toLocaleString()}đ`;
};

// Hàm kiểm tra xem có phải là trạng thái cần xử lý không
export const isActionRequired = (status) => {
  return status === "Escalated";
};