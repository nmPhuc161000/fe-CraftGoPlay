// /src/pages/Profile/VoucherExchange.jsx
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { AuthContext } from "../../../../contexts/AuthContext";
import pointService from "../../../../services/apis/pointApi";
import userVoucherService from "../../../../services/apis/userVoucherAPI";
import voucherService from "../../../../services/apis/voucherApi";
import Notification from "../../../../components/Notification/Notification";

dayjs.locale("vi");

const formatVND = (n) => `${(Number(n) || 0).toLocaleString("vi-VN")}đ`;

async function getExchangeCatalog() {
    const res = await voucherService.getAllVouchers();
    if (!res?.success) return [];

    const payload = res.data;
    const list = Array.isArray(payload?.data) ? payload.data : [];

    return list.map((v) => ({
        id: v.id ?? v.Id,
        code: v.code ?? v.Code,
        name: v.name ?? v.Name,
        description: v.description ?? v.Description,
        type: v.type ?? v.Type, 
        discountType: v.discountType ?? v.DiscountType, 
        paymentMethod: v.paymentMethod ?? v.PaymentMethod, 
        minOrderValue: v.minOrderValue ?? v.MinOrderValue,
        maxDiscountAmount: v.maxDiscountAmount ?? v.MaxDiscountAmount,
        discount: v.discount ?? v.Discount,
        startDate: v.startDate ?? v.StartDate,
        endDate: v.endDate ?? v.EndDate,
        isActive: v.isActive ?? v.IsActive,
        pointChangeAmount: v.pointChangeAmount ?? v.PointChangeAmount,
    }));
}

const t = (value) =>
({
    Product: "Sản phẩm",
    Delivery: "Vận chuyển",
    Percentage: "Phần trăm",
    FixedAmount: "Số tiền cố định",
    All: "Mọi phương thức",
    Cash: "Tiền mặt",
    Online: "Trực tuyến",
}[value] || value);

const statusOfVoucher = (v) => {
    const now = dayjs();
    const hasStart = !!v.startDate;
    const hasEnd = !!v.endDate;
    const start = hasStart ? dayjs(v.startDate) : null;
    const end = hasEnd ? dayjs(v.endDate) : null;

    if (v.isActive === false)
        return { label: "Ngừng hoạt động", className: "bg-gray-100 text-gray-600" };

    if (hasEnd && end.isBefore(now))
        return { label: "Hết hạn", className: "bg-rose-50 text-rose-700" };

    if (hasStart && start.isAfter(now))
        return { label: "Chưa hiệu lực", className: "bg-amber-50 text-amber-700" };

    if (hasEnd && end.diff(now, "day") <= 3)
        return { label: "Sắp hết hạn", className: "bg-orange-50 text-orange-700" };

    return { label: "Còn hạn", className: "bg-emerald-50 text-emerald-700" };
};

const Badge = ({ className = "", children }) => (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}>
        {children}
    </span>
);

const Chip = ({ className = "", icon, children }) => (
    <span className={`inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white/70 px-2 py-1 text-xs text-gray-600 ${className}`}>
        {icon}
        {children}
    </span>
);

export default function VoucherExchange() {
    const { user } = useContext(AuthContext);
    const userId = user?.id;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [catalog, setCatalog] = useState([]);
    const [points, setPoints] = useState(0);

    const [confirming, setConfirming] = useState(null);

    const [type, setType] = useState("all");
    const [discountType, setDiscountType] = useState("all");
    const [paymentMethod, setPaymentMethod] = useState("all");

    // toasts
    const [toasts, setToasts] = useState([]);
    const pushToast = (type, message) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, type, message }]);
    };
    const removeToast = (id) =>
        setToasts((prev) => prev.filter((t) => t.id !== id));

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            pushToast("warning", "Bạn chưa đăng nhập.");
            return;
        }
        (async () => {
            try {
                setLoading(true);
                const [pointRes, catalogList] = await Promise.all([
                    pointService.getPointByUserId(userId),
                    getExchangeCatalog(),
                ]);

                let p = 0;
                if (pointRes?.success) {
                    p =
                        pointRes.data?.data?.amount ??
                        pointRes.data?.data?.points ??
                        pointRes.data?.points ??
                        pointRes.data ??
                        0;
                }
                setPoints(Number(p) || 0);
                setCatalog(catalogList);
            } catch (e) {
                console.error("Lỗi khi load dữ liệu:", e);
                pushToast("error", "Không thể tải dữ liệu. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    const onExchange = async (item) => {
        setConfirming(null);
        try {
            if (!userId) throw new Error("Bạn chưa đăng nhập");
            const voucherId = item.id;
            if (!voucherId) throw new Error("Không tìm thấy VoucherId");

            const res = await userVoucherService.swapVoucher(userId, voucherId);
            if (!res?.success) throw new Error(res?.error || "Đổi voucher thất bại");

            pushToast("success", `Đổi voucher ${item.code} thành công!`);

            // refresh coins
            const pointRes = await pointService.getPointByUserId(userId);
            let p =
                pointRes?.data?.data?.amount ??
                pointRes?.data?.data?.points ??
                pointRes?.data?.points ??
                pointRes?.data ??
                0;
            setPoints(Number(p) || 0);

            navigate("/profile-user/vouchers");
        } catch (e) {
            console.error("Lỗi khi đổi voucher:", e);
            pushToast("error", e.message || "Có lỗi khi đổi voucher.");
        }
    };

    const filtered = useMemo(() => {
        return catalog.filter((v) => {
            if (type !== "all" && v.type !== type) return false;
            if (discountType !== "all" && v.discountType !== discountType) return false;
            if (paymentMethod !== "all" && v.paymentMethod !== paymentMethod) return false;
            return true;
        });
    }, [catalog, type, discountType, paymentMethod]);


    if (loading) {
        return (
            <div className="min-h-[60vh] grid place-items-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-amber-900" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Notifications */}
            <div className="fixed top-4 right-4 z-[9999] space-y-2">
                {toasts.map((t) => (
                    <Notification
                        key={t.id}
                        type={t.type}
                        message={t.message}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8">
                {/* Header */}
                <div className="mb-6 flex flex-col items-start justify-between gap-4 rounded-2xl border border-amber-100 bg-white p-6 shadow sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-amber-900">
                            Đổi voucher
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Dùng xu để đổi lấy phiếu giảm giá áp dụng khi thanh toán.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3">
                        <div className="rounded-xl bg-white p-2 text-amber-600 shadow-sm">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M12 2a10 10 0 1 1-7.07 2.93A10 10 0 0 1 12 2m1 5h-2v3H8v2h3v3h2v-3h3V10h-3z"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wide text-amber-600">
                                Xu hiện có
                            </div>
                            <div className="text-xl font-extrabold text-amber-900">
                                {points} xu
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 rounded-2xl border border-amber-100 bg-white p-4 shadow">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <label className="flex items-center gap-2 rounded-xl border px-3 py-2.5">
                            <span className="text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M3 5h18v2H3zM3 11h12v2H3zM3 17h6v2H3z" />
                                </svg>
                            </span>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-transparent text-sm outline-none"
                            >
                                <option value="all">Loại: Tất cả</option>
                                <option value="Product">Sản phẩm</option>
                                <option value="Delivery">Vận chuyển</option>
                            </select>
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border px-3 py-2.5">
                            <span className="text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 3l4 7H8l4-7z" />
                                </svg>
                            </span>
                            <select
                                value={discountType}
                                onChange={(e) => setDiscountType(e.target.value)}
                                className="w-full bg-transparent text-sm outline-none"
                            >
                                <option value="all">Giảm giá: Tất cả</option>
                                <option value="FixedAmount">Số tiền cố định</option>
                                <option value="Percentage">Phần trăm</option>
                            </select>
                        </label>

                        <label className="flex items-center gap-2 rounded-xl border px-3 py-2.5">
                            <span className="text-gray-400">
                                <svg width="16" height="16" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M3 7h18v10H3zM5 9v6h14V9z" />
                                </svg>
                            </span>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full bg-transparent text-sm outline-none"
                            >
                                <option value="all">Thanh toán: Tất cả</option>
                                <option value="Cash">Tiền mặt</option>
                                <option value="Online">Trực tuyến</option>
                            </select>
                        </label>
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-gray-500 shadow">
                        Không có voucher nào phù hợp.
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((v) => {
                            const need = Number(v.pointChangeAmount) || 0;
                            const status = statusOfVoucher(v);
                            const now = dayjs();
                            const activeNow =
                                v.isActive !== false &&
                                (!v.startDate || dayjs(v.startDate).valueOf() <= now.valueOf()) &&
                                (!v.endDate || dayjs(v.endDate).valueOf() > now.valueOf());

                            const canRedeem = points >= need && activeNow;
                            const progress =
                                need <= 0 ? 100 : Math.min(100, Math.round((points / need) * 100));

                            const discountText =
                                v.discountType === "Percentage"
                                    ? `${v.discount || 0}%`
                                    : `${formatVND(v.discount)}`;

                            return (
                                <div
                                    key={v.id}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-lg"
                                >
                                    {/* Header strip w/ perforation */}
                                    <div className="relative bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-bold tracking-wide text-[#5e3a1e]">
                                                🎟 {v.code}
                                            </p>
                                            <Badge className={status.className}>{status.label}</Badge>
                                        </div>
                                        <div className="absolute -bottom-3 left-0 right-0 flex justify-between px-3 text-amber-200">
                                            <span className="h-6 w-6 rounded-full bg-white" />
                                            <span className="h-6 w-6 rounded-full bg-white" />
                                        </div>
                                    </div>

                                    {/* Body */}
                                    <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
                                        <div className="text-sm text-gray-800">
                                            <div className="font-semibold">{v.name}</div>
                                            {v.description && (
                                                <div className="mt-1 text-gray-600">{v.description}</div>
                                            )}
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <Chip
                                                icon={
                                                    <svg width="14" height="14" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M3 5h18v2H3zM3 11h12v2H3zM3 17h6v2H3z" />
                                                    </svg>
                                                }
                                            >
                                                {t(v.type)}
                                            </Chip>

                                            <Chip
                                                icon={
                                                    <svg width="14" height="14" viewBox="0 0 24 24">
                                                        <path fill="currentColor" d="M12 3l4 7H8l4-7z" />
                                                    </svg>
                                                }
                                            >
                                                Ưu đãi: {discountText}
                                                {v.maxDiscountAmount
                                                    ? ` (tối đa ${formatVND(v.maxDiscountAmount)})`
                                                    : ""}
                                            </Chip>

                                            {v.minOrderValue ? (
                                                <Chip
                                                    icon={
                                                        <svg width="14" height="14" viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M3 3h18v2H3z" />
                                                        </svg>
                                                    }
                                                >
                                                    Đơn tối thiểu: {formatVND(v.minOrderValue)}
                                                </Chip>
                                            ) : null}

                                            {v.paymentMethod ? (
                                                <Chip
                                                    icon={
                                                        <svg width="14" height="14" viewBox="0 0 24 24">
                                                            <path fill="currentColor" d="M3 7h18v10H3z" />
                                                        </svg>
                                                    }
                                                >
                                                    PTTT: {t(v.paymentMethod)}
                                                </Chip>
                                            ) : null}
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
                                            <div>Hiệu lực: {v.startDate ? dayjs(v.startDate).format("DD/MM/YYYY HH:mm") : "—"}</div>
                                            <div className="text-right">HSD: {v.endDate ? dayjs(v.endDate).format("DD/MM/YYYY HH:mm") : "—"}</div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs">
                                                <span>
                                                    Cần: <b>{need}</b> xu
                                                </span>
                                                <span className={canRedeem ? "text-emerald-600" : "text-rose-600"}>
                                                    {canRedeem ? "Đủ xu" : "Chưa đủ xu"}
                                                </span>
                                            </div>
                                            <div className="mt-1 text-right text-[11px] text-gray-500">
                                                Bạn có <b>{points}</b> xu
                                            </div>
                                        </div>


                                        <button
                                            disabled={!canRedeem}
                                            onClick={() => setConfirming(v)}
                                            className={`mt-auto w-full px-4 py-2 rounded-xl font-medium text-sm shadow transition ${canRedeem
                                                ? "bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] text-white hover:opacity-90"
                                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                }`}
                                            aria-disabled={!canRedeem}
                                        >
                                            Đổi voucher
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* modal confirm */}
                {confirming && (
                    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                            <h3 className="text-lg font-bold">Xác nhận đổi voucher</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Bạn sẽ dùng <b>{confirming.pointChangeAmount}</b> xu để đổi{" "}
                                <b>{confirming.code}</b>.
                            </p>
                            <div className="mt-4 flex justify-end gap-3">
                                <button
                                    onClick={() => setConfirming(null)}
                                    className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                                >
                                    Huỷ
                                </button>
                                <button
                                    onClick={() => onExchange(confirming)}
                                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                                >
                                    Xác nhận
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
