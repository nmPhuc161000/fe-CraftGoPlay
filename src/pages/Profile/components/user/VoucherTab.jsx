// components/profile/VoucherTab.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { AuthContext } from "../../../../contexts/AuthContext";
import userVoucherService from "../../../../services/apis/userVoucherApi";
import pointService from "../../../../services/apis/pointApi";

dayjs.locale("vi");

// ===== Utils =====
const formatVND = (v) =>
  (typeof v === "number" ? v : Number(v || 0)).toLocaleString("vi-VN");

function computeVoucherStatus(v) {
  const now = dayjs();
  const start = dayjs(v.startDate);
  const end = dayjs(v.endDate);

  if (v.isActive === false)
    return { label: "Ngừng hoạt động", color: "bg-gray-100 text-gray-600" };
  if (
    v.quantity !== undefined &&
    v.usedCount !== undefined &&
    v.usedCount >= v.quantity
  )
    return { label: "Hết số lượng", color: "bg-rose-50 text-rose-700" };
  if (start.isAfter(now))
    return { label: "Chưa hiệu lực", color: "bg-amber-50 text-amber-700" };
  if (end.isBefore(now))
    return { label: "Hết hạn", color: "bg-rose-50 text-rose-700" };
  return { label: "Còn hạn", color: "bg-emerald-50 text-emerald-700" };
}

function buildShortDesc(v) {
  if (v.description && v.description.trim().length > 0) return v.description;

  const typeText =
    v.discountType === "FixedAmount"
      ? `Giảm trực tiếp ${formatVND(v.discount || v.discountValue)}đ`
      : v.discountType === "Percentage"
        ? `Giảm ${v.discount || v.discountValue}%`
        : "Giảm giá";

  const cond =
    v.minOrderValue && Number(v.minOrderValue) > 0
      ? ` cho đơn từ ${formatVND(v.minOrderValue)}đ`
      : "";

  const cap =
    v.maxDiscountAmount && Number(v.maxDiscountAmount) > 0
      ? ` (tối đa ${formatVND(v.maxDiscountAmount)}đ)`
      : "";

  const scope = v.type === "Delivery" ? " phí vận chuyển" : "";

  return `${typeText}${cap}${scope}${cond}.`;
}

const mapVoucherType = (type) => {
  switch (type) {
    case "Product":
      return "Sản phẩm";
    case "Delivery":
      return "Vận chuyển";
    default:
      return type;
  }
};

const mapPaymentMethod = (pm) => {
  switch (pm) {
    case "Cash":
      return "Tiền mặt";
    case "All":
      return "Mọi phương thức";
    case "Online":
      return "Thanh toán trực tuyến";
    case "Banking":
      return "Chuyển khoản";
    case "Card":
      return "Thẻ";
    default:
      return pm;
  }
};

const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}>
    {children}
  </span>
);

const Chip = ({ icon, children }) => (
  <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white/60 px-2 py-1 text-xs text-gray-600">
    {icon}
    {children}
  </span>
);


const VoucherCard = ({ v }) => {
  const status = computeVoucherStatus(v);
  const expiry = v.endDate ? dayjs(v.endDate).format("DD/MM/YYYY HH:mm") : "—";
  const start = v.startDate ? dayjs(v.startDate).format("DD/MM/YYYY HH:mm") : "—";
  const desc = buildShortDesc(v);

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold tracking-wide text-[#5e3a1e]">🎟 {v.code}</p>
          <Badge className={status.color}>{status.label}</Badge>
        </div>
        <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-3 text-amber-200">
          <span className="h-6 w-6 rounded-full bg-white"></span>
          <span className="h-6 w-6 rounded-full bg-white"></span>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-5">
        <div className="text-sm text-gray-700">
          <div className="font-semibold">{v.name}</div>
          <div className="mt-1 text-gray-600">{desc}</div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Chip
            icon={
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 7h18v2H3zm0 4h18v2H3zm0 4h12v2H3z" />
              </svg>
            }
          >
            Loại: {mapVoucherType(v.type)}
          </Chip>

          {v.paymentMethod && (
            <Chip
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 5h18v2H3m0 14h18v2H3M5 7h14v10H5z" />
                </svg>
              }
            >
              PTTT: {mapPaymentMethod(v.paymentMethod)}
            </Chip>
          )}

          {v.minOrderValue > 0 && (
            <Chip
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 3h18v2H3m0 14h18v2H3" />
                </svg>
              }
            >
              Đơn tối thiểu {formatVND(v.minOrderValue)}đ
            </Chip>
          )}

          {v.maxDiscountAmount > 0 && (
            <Chip
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 12l18-9l-9 18l-2-7z" />
                </svg>
              }
            >
              Tối đa {formatVND(v.maxDiscountAmount)}đ
            </Chip>
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <div>
            Hiệu lực: <span className="text-gray-700">{start}</span>
          </div>
          <div className="text-right">
            HSD: <span className="text-gray-700">{expiry}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// main
const VoucherTab = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (!userId) {
        setErr("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setErr("");

        // Gọi song song 2 API
        const [voucherRes, pointRes] = await Promise.all([
          userVoucherService.getAllVouchersByUserId(userId, ""),
          pointService.getPointByUserId(userId),
        ]);

        // voucher
        if (!voucherRes?.success) throw new Error(voucherRes?.error || "API voucher lỗi");
        const voucherPayload = voucherRes.data;
        if (voucherPayload?.error && voucherPayload.error !== 0) {
          throw new Error(voucherPayload.message || "API voucher trả lỗi");
        }
        const raw = Array.isArray(voucherPayload?.data)
          ? voucherPayload.data.flatMap(x =>
            Array.isArray(x?.vouchers) ? x.vouchers : x
          )
          : [];
        console.log("Voucher list:", raw);
        // xu
        if (!pointRes?.success) throw new Error(pointRes?.error || "API điểm lỗi");
        const p =
          pointRes.data?.data?.amount ??
          pointRes.data?.data?.points ??
          pointRes.data?.points ??
          pointRes.data ??
          0;

        if (!mounted) return;
        setVouchers(raw);
        setPoints(Number(p) || 0);
      } catch (e) {
        console.error(e);
        if (!mounted) return;
        setErr("Không thể tải dữ liệu. Vui lòng thử lại.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [userId]);

  // ✅ Chỉ SẮP XẾP (không lọc)
  const sortedVouchers = useMemo(() => {
    return [...vouchers].sort((a, b) => {
      const sa = computeVoucherStatus(a).label;
      const sb = computeVoucherStatus(b).label;
      const rank = (s) =>
        s === "Còn hạn"
          ? 0
          : s === "Chưa hiệu lực"
            ? 1
            : s === "Hết số lượng"
              ? 2
              : s === "Ngừng hoạt động"
                ? 3
                : 4; // Hết hạn
      const ra = rank(sa);
      const rb = rank(sb);
      if (ra !== rb) return ra - rb;
      const ea = dayjs(a.endDate).valueOf();
      const eb = dayjs(b.endDate).valueOf();
      return (isNaN(ea) ? Infinity : ea) - (isNaN(eb) ? Infinity : eb);
    });
  }, [vouchers]);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Kho Voucher của bạn</h2>
          <p className="text-sm text-gray-500">Xem và sử dụng các voucher đã sở hữu.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-sm ring-1 ring-gray-100">
            <div className="rounded-md bg-amber-50 p-2 text-amber-600">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2l1.546 4.64L18 7.24l-3.727 2.91L15.09 15L12 12.91L8.91 15l.817-4.85L6 7.24l4.454-.6z"
                />
              </svg>
            </div>
            <div>
              <div className="text-xs text-gray-500">Xu hiện có</div>
              <div className="text-lg font-semibold">{points} xu</div>
            </div>
          </div>

          <Link
            to="/profile-user/voucher-exchange"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5e3a1e] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            Đổi voucher
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
              <path
                fill="currentColor"
                d="M5 12h12l-4.5 4.5l1.42 1.42L21.84 12l-7.92-5.92L12.5 7.5L17 12H5z"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="rounded-xl border p-8 text-center text-gray-500">
          Đang tải voucher...
        </div>
      ) : err ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          {err}
        </div>
      ) : sortedVouchers.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center text-gray-500">
          Hiện chưa có voucher nào.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedVouchers.map((v) => (
            <VoucherCard key={v.id} v={v} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoucherTab;
