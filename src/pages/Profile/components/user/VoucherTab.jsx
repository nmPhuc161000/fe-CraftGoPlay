// components/profile/VoucherTab.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { AuthContext } from "../../../../contexts/AuthContext";
import userVoucherService from "../../../../services/apis/userVoucherApi";
import pointService from "../../../../services/apis/pointApi";

dayjs.locale("vi");

const formatVND = (v) =>
  (typeof v === "number" ? v : Number(v || 0)).toLocaleString("vi-VN");

function computeVoucherStatus(v) {
  const now = dayjs();
  const start = dayjs(v.startDate);
  const end = dayjs(v.endDate);

  if (v.isActive === false) return { label: "Ngừng hoạt động", color: "bg-gray-100 text-gray-600" };
  if (v.quantity !== undefined && v.usedCount !== undefined && v.usedCount >= v.quantity)
    return { label: "Hết số lượng", color: "bg-rose-50 text-rose-700" };
  if (start.isAfter(now)) return { label: "Chưa hiệu lực", color: "bg-amber-50 text-amber-700" };
  if (end.isBefore(now)) return { label: "Hết hạn", color: "bg-rose-50 text-rose-700" };
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

  const scope = v.type === "Shipping" ? " phí vận chuyển" : "";

  return `${typeText}${cap}${scope}${cond}.`;
}

export const mapVoucherType = (type) => {
  switch (type) {
    case "Product": return "Sản phẩm";
    case "Shipping": return "Vận chuyển";
    default: return type;
  }
};

export const mapDiscountType = (dt) => {
  switch (dt) {
    case "FixedAmount": return "Giảm số tiền";
    case "Percentage": return "Giảm phần trăm";
    default: return dt;
  }
};

export const mapPaymentMethod = (pm) => {
  switch (pm) {
    case "Cash": return "Tiền mặt";
    case "All": return "Mọi phương thức";
    case "Banking": return "Chuyển khoản";
    case "Card": return "Thẻ";
    default: return pm;
  }
};

const VoucherCard = ({ v }) => {
  const status = computeVoucherStatus(v);
  const expiry = v.endDate ? dayjs(v.endDate).format("DD/MM/YYYY HH:mm") : "—";
  const start = v.startDate ? dayjs(v.startDate).format("DD/MM/YYYY HH:mm") : "—";
  const desc = buildShortDesc(v);

  return (
    <div className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow transition">
      <div className="flex items-center justify-between gap-3">
        <p className="text-lg font-bold tracking-wide">🎟 {v.code}</p>
        <span className={`text-xs px-2 py-1 rounded ${status.color}`}>{status.label}</span>
      </div>

      <div className="mt-1 text-sm text-gray-600">
        <div className="font-medium">{v.name}</div>
        <div className="mt-1">{desc}</div>
      </div>

      <div className="mt-3 text-xs text-gray-500 space-y-1">
        <div>Hiệu lực: {start}</div>
        <div>HSD: {expiry}</div>
        {typeof v.usedCount === "number" && typeof v.quantity === "number" && (
          <div>
            Đã dùng: {v.usedCount}/{v.quantity}
          </div>
        )}
        {v.paymentMethod && <div>PTTT áp dụng: {mapPaymentMethod(v.paymentMethod)}</div>}
        {v.type && <div>Loại voucher: {mapVoucherType(v.type)}</div>}
      </div>
    </div>
  );
};

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
        const list = Array.isArray(voucherPayload?.data) && voucherPayload.data.length > 0
          ? voucherPayload.data[0]?.vouchers || []
          : [];

        // xu
        if (!pointRes?.success) throw new Error(pointRes?.error || "API điểm lỗi");
        const p = pointRes.data?.data?.amount
          ?? pointRes.data?.data?.points
          ?? pointRes.data?.points
          ?? pointRes.data
          ?? 0;

        if (!mounted) return;
        setVouchers(list);
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
    return () => { mounted = false; };
  }, [userId]);


  const sortedVouchers = useMemo(() => {
    return [...vouchers].sort((a, b) => {
      const sa = computeVoucherStatus(a).label;
      const sb = computeVoucherStatus(b).label;
      const rank = (s) =>
        s === "Còn hạn" ? 0 :
          s === "Chưa hiệu lực" ? 1 :
            s === "Hết số lượng" ? 2 :
              s === "Ngừng hoạt động" ? 3 :
                4; // Hết hạn
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kho Voucher của bạn</h2>
          <p className="text-sm text-gray-500">Xem và sử dụng các voucher đã sở hữu.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-slate-100">
            <div className="text-xs text-gray-500">Xu hiện có</div>
            <div className="text-lg font-semibold">{points} xu</div>
          </div>
          <Link
            to="/profile-user/voucher-exchange"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28] text-sm"
          >
            Đổi voucher
            <svg width="16" height="16" viewBox="0 0 24 24" className="opacity-90">
              <path fill="currentColor" d="M5 12h12l-4.5 4.5l1.42 1.42L21.84 12l-7.92-5.92L12.5 7.5L17 12H5z" />
            </svg>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border p-8 text-center text-gray-500">
          Đang tải voucher...
        </div>
      ) : err ? (
        <div className="rounded-xl border border-rose-200 p-8 text-center text-rose-600">
          {err}
        </div>
      ) : sortedVouchers.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
          Hiện chưa có voucher nào.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedVouchers.map((v) => (
            <VoucherCard key={v.id} v={v} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoucherTab;
