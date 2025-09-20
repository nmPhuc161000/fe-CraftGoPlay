import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MdVisibility,
  MdShoppingBag,
  MdAttachMoney,
  MdLocalShipping,
  MdSearch,
} from "react-icons/md";
import orderService from "../../../services/apis/orderApi";

const PAGE_SIZE = 10;

const cx = (...cls) => cls.filter(Boolean).join(" ");
const fmtMoney = (n) => Number(n || 0).toLocaleString("vi-VN") + "đ";

// Mã đơn mã hoá: xxxxxx…xxxx
const maskCode = (code = "") => {
  if (!code) return "—";
  if (code.length <= 10) return code;
  return `${code.slice(0, 6)}…${code.slice(-4)}`;
};

const statusChip = (status) => {
  switch ((status || "").toLowerCase()) {
    case "created":
    case "pending":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "accepted":
    case "processing":
      return "bg-indigo-50 text-indigo-700 border border-indigo-200";
    case "paid":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "shipped":
      return "bg-sky-50 text-sky-700 border border-sky-200";
    case "completed":
      return "bg-green-50 text-green-700 border border-green-200";
    case "rejected":
    case "cancelled":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "refund":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-gray-50 text-gray-600 border border-gray-200";
  }
};

const OrderHistory = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);

  // ===== Fetch orders =====
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await orderService.getAllOrders(1, 200, "");
        const payload = res?.data || {};
        const items = Array.isArray(payload.data) ? payload.data : [];

        const rows = items.map((o) => {
          const orderItems = Array.isArray(o.orderItems) ? o.orderItems : [];
          const totalProducts = orderItems.reduce(
            (sum, it) => sum + (Number(it.quantity) || 0),
            0
          );

          return {
            id: o.id || "",
            code: o.id || "",
            status: o.status || "Created",
            isPaid: !!o.isPaid,
            paymentMethod: o.paymentMethod || "",
            createdAt: o.creationDate || "",

            productAmount: o.product_Amount ?? 0,
            deliveryAmount: o.delivery_Amount ?? 0,
            productDiscount: o.productDiscount ?? 0,
            deliveryDiscount: o.deliveryDiscount ?? 0,
            pointDiscount: o.pointDiscount ?? 0,
            totalDiscount: o.totalDiscount ?? 0,
            totalPrice: o.totalPrice ?? 0,

            receiver: o.userAddress?.fullName || "",
            phone: o.userAddress?.phoneNumber || "",
            address: o.userAddress?.fullAddress || "",

            items: orderItems.map((it) => {
              const p = it.product || {};
              const imgObj = p.productImages;
              const imageUrl = Array.isArray(imgObj)
                ? imgObj[0]?.imageUrl
                : imgObj?.imageUrl;
              return {
                name: p.name || "",
                quantity: it.quantity || 0,
                unitPrice: it.unitPrice ?? p.price ?? 0,
                imageUrl:
                  imageUrl ||
                  "https://doanhnghiepkinhtexanh.vn/uploads/images/2022/08/05/074602-1-1659697249.jpg",
              };
            }),
            totalProducts,
          };
        });

        setData(rows);
      } catch (e) {
        console.error(e);
        setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ===== Search (tìm theo mã/ người nhận/ sđt/ địa chỉ) =====
  useEffect(() => {
    const q = (search || "").toLowerCase().trim();
    const f = data.filter((o) => {
      if (!q) return true;
      return (
        o.code.toLowerCase().includes(q) ||
        o.receiver.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
      );
    });
    setFiltered(f);
    setPage(1);
  }, [search, data]);

  // Pagination
  const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openView = (order) => {
    setViewOrder(order);
    setShowViewModal(true);
  };

  // ===== Render states =====
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-lg p-8 w-full"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-3xl shadow-lg p-8 w-full"
      >
        <div className="text-center py-10">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-xl font-bold text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </div>
          <div className="text-gray-600 mb-6">{error}</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-lg text-white shadow bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-lg p-6 md:p-8 w-full"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-500 mt-1">
              Bảng tối giản: STT, Mã đơn, Người nhận, Trạng thái, Ngày tạo
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl px-4 py-2">
              <span className="text-sm">
                Tổng đơn:{" "}
                <span className="font-semibold">{filtered.length}</span>
              </span>
            </div>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-transparent min-w-[260px]"
                placeholder="Tìm mã đơn, người nhận, SĐT, địa chỉ…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table: chỉ 6 cột như yêu cầu */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
        <table className="min-w-full" style={{ tableLayout: "fixed" }}>
          <thead className="bg-gradient-to-r from-[#8b5e3c] to-[#c7903f]">
            <tr>
              <th className="w-14 px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                STT
              </th>
              <th className="w-[36%] px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                MÃ ĐƠN (MÃ HOÁ)
              </th>
              <th className="w-[28%] px-3 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                TÊN NGƯỜI NHẬN
              </th>
              <th className="w-[18%] px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                TRẠNG THÁI
              </th>
              <th className="w-[16%] px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                NGÀY TẠO
              </th>
              <th className="w-16 px-3 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                XEM
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paged.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="hover:bg-gray-50/60 transition-colors"
              >
                {/* STT */}
                <td className="px-3 py-3 text-center text-sm text-gray-700">
                  {(page - 1) * PAGE_SIZE + idx + 1}
                </td>

                {/* Mã đơn (mã hoá) + tooltip full mã */}
                <td className="px-3 py-3">
                  <div className="font-semibold text-gray-900" title={row.code}>
                    {maskCode(row.code)}
                  </div>
                  {/* có thể bỏ dòng ghi full mã nếu không muốn */}
                  <div
                    className="text-[11px] text-gray-500 font-mono truncate"
                    title={row.code}
                  >
                    {row.code}
                  </div>
                </td>

                {/* Tên người nhận */}
                <td className="px-3 py-3">
                  <div
                    className="font-medium text-gray-800 truncate"
                    title={row.receiver}
                  >
                    {row.receiver || "—"}
                  </div>
                </td>

                {/* Trạng thái */}
                <td className="px-3 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusChip(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>

                {/* Ngày tạo */}
                <td className="px-3 py-3 text-center text-sm text-gray-700">
                  {row.createdAt
                    ? new Date(row.createdAt).toLocaleDateString("vi-VN")
                    : "—"}
                </td>

                {/* Xem */}
                <td className="px-3 py-3 text-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg text-green-600 hover:text-green-800 hover:bg-green-50"
                    title="Xem chi tiết"
                    onClick={() => openView(row)}
                  >
                    <MdVisibility className="text-xl" />
                  </motion.button>
                </td>
              </tr>
            ))}

            {paged.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-5 text-sm text-gray-600">
        <span>
          {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} –{" "}
          {Math.min(page * PAGE_SIZE, filtered.length)} trên {filtered.length}
        </span>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="h-9 w-9 flex items-center justify-center rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <span className="px-3 h-9 inline-flex items-center rounded-xl bg-blue-50 font-medium text-blue-700">
            {page}
          </span>

          <button
            disabled={page === totalPage || totalPage === 0}
            onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
            className="h-9 w-9 flex items-center justify-center rounded-xl border bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal View (giữ nguyên, để xem chi tiết khi cần) */}
      {showViewModal && viewOrder && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Chi tiết đơn hàng
                </h2>
                <div className="mt-1 text-sm text-gray-500">
                  Mã đơn:{" "}
                  <span className="font-semibold">{viewOrder.code}</span> • Ngày
                  tạo:{" "}
                  {viewOrder.createdAt
                    ? new Date(viewOrder.createdAt).toLocaleString("vi-VN")
                    : "—"}
                </div>
              </div>
              <button
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  setShowViewModal(false);
                  setViewOrder(null);
                }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* content (giữ nguyên phần chi tiết đầy đủ) */}
            <div className="overflow-y-auto max-h-[calc(90vh-92px)] p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* left */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <MdShoppingBag className="text-2xl text-blue-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-gray-800">
                          {viewOrder.totalProducts}
                        </div>
                        <div className="text-xs text-gray-500">Sản phẩm</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <MdLocalShipping className="text-2xl text-amber-500 mx-auto mb-2" />
                        <div className="text-lg font-bold text-gray-800">
                          {fmtMoney(viewOrder.deliveryAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Phí vận chuyển
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="text-sm text-gray-500 mb-1">Người nhận</div>
                    <div className="font-semibold text-gray-900">
                      {viewOrder.receiver || "—"}
                    </div>
                    {viewOrder.phone && (
                      <div className="text-sm text-gray-600 mt-1">
                        SĐT: {viewOrder.phone}
                      </div>
                    )}
                    <div className="text-sm text-gray-600 mt-1">
                      Địa chỉ: {viewOrder.address || "—"}
                    </div>
                    <div className="mt-3">
                      <span
                        className={cx(
                          "px-3 py-1 rounded-full text-xs font-semibold",
                          statusChip(viewOrder.status)
                        )}
                      >
                        {viewOrder.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* right */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sản phẩm trong đơn
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      {viewOrder.items.map((it, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 bg-white rounded-xl p-3 shadow-sm border border-blue-50"
                        >
                          <img
                            src={it.imageUrl}
                            alt={it.name}
                            className="w-16 h-16 object-cover rounded border"
                            crossOrigin="anonymous"
                          />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-700">
                              {it.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              SL: {it.quantity}
                            </div>
                            <div className="text-xs text-gray-500">
                              Đơn giá:{" "}
                              <span className="font-semibold text-blue-700">
                                {fmtMoney(it.unitPrice)}
                              </span>
                            </div>
                          </div>
                          <div className="text-xl font-bold text-red-600 whitespace-nowrap">
                            {fmtMoney(it.quantity * it.unitPrice)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="text-sm text-gray-600">Tiền hàng</div>
                      <div className="text-right font-semibold">
                        {fmtMoney(viewOrder.productAmount)}
                      </div>

                      <div className="text-sm text-gray-600">
                        Phí vận chuyển
                      </div>
                      <div className="text-right font-semibold">
                        {fmtMoney(viewOrder.deliveryAmount)}
                      </div>

                      {(viewOrder.productDiscount ||
                        viewOrder.deliveryDiscount ||
                        viewOrder.pointDiscount ||
                        viewOrder.totalDiscount) > 0 && (
                        <>
                          <div className="text-sm text-gray-600">Giảm giá</div>
                          <div className="text-right font-semibold text-green-600">
                            -
                            {fmtMoney(
                              (viewOrder.productDiscount || 0) +
                                (viewOrder.deliveryDiscount || 0) +
                                (viewOrder.pointDiscount || 0) +
                                (viewOrder.totalDiscount || 0)
                            )}
                          </div>
                        </>
                      )}

                      <div className="text-sm text-gray-600">Thanh toán</div>
                      <div className="text-right">
                        <span
                          className={cx(
                            "px-3 py-1 rounded-full text-xs font-semibold",
                            viewOrder.isPaid
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          )}
                        >
                          {viewOrder.isPaid
                            ? "ĐÃ THANH TOÁN"
                            : "CHƯA THANH TOÁN"}
                        </span>
                        {viewOrder.paymentMethod && (
                          <span className="ml-2 text-xs text-gray-600">
                            ({viewOrder.paymentMethod})
                          </span>
                        )}
                      </div>

                      <div className="md:col-span-2 text-right text-lg md:text-xl font-bold text-gray-900 mt-2">
                        Tổng thanh toán:{" "}
                        <span className="text-red-600">
                          {fmtMoney(viewOrder.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderHistory;
