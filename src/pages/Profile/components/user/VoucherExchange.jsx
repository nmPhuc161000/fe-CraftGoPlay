import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import pointService from "../../../../services/apis/pointApi";
import userVoucherService from "../../../../services/apis/userVoucherApi";
import voucherService from "../../../../services/apis/voucherApi";
import Notification from "../../../../components/Notification/Notification";

const formatVND = (n) => (n || 0).toLocaleString("vi-VN") + "đ";

async function getExchangeCatalog() {
    const res = await voucherService.getAllVouchers();
    if (!res?.success) return [];

    const payload = res.data;
    const list = Array.isArray(payload?.data) ? payload.data : [];

    return list.map(v => ({
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


    const [toasts, setToasts] = useState([]);
    const pushToast = (type, message) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, type, message }]);
    };
    const removeToast = (id) => setToasts((prev) => prev.filter(t => t.id !== id));

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
                    p = pointRes.data?.data?.amount
                        ?? pointRes.data?.data?.points
                        ?? pointRes.data?.points
                        ?? pointRes.data
                        ?? 0;
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

            // refresh xu
            const pointRes = await pointService.getPointByUserId(userId);
            let p = pointRes?.data?.data?.amount
                ?? pointRes?.data?.data?.points
                ?? pointRes?.data?.points
                ?? pointRes?.data
                ?? 0;
            setPoints(Number(p) || 0);

            navigate("/profile-user/vouchers");
        } catch (e) {
            console.error("Lỗi khi đổi voucher:", e);
            pushToast("error", e.message || "Có lỗi khi đổi voucher.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] grid place-items-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    const filtered = catalog.filter(v => {
        if (type !== "all" && v.type !== type) return false;
        if (discountType !== "all" && v.discountType !== discountType) return false;
        if (paymentMethod !== "all" && v.paymentMethod !== paymentMethod) return false;
        return true;
    });

    const t = (value) => ({
        Product: "Sản phẩm",
        Delivery: "Vận chuyển",
        Percentage: "Phần trăm",
        FixedAmount: "Số tiền cố định",
        All: "Tất cả",
        Cash: "Tiền mặt",
        Online: "Thanh toán trực tuyến",
    }[value] || value);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            {/* Notifications stack */}
            <div className="fixed top-4 right-4 z-[9999] space-y-2">
                {toasts.map(t => (
                    <Notification
                        key={t.id}
                        type={t.type}
                        message={t.message}
                        onClose={() => removeToast(t.id)}
                    />
                ))}
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-amber-100 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-amber-900">Đổi voucher</h1>
                    <div className="px-5 py-3 rounded-2xl border bg-amber-50">
                        <div className="text-xs uppercase text-amber-600">Xu hiện có</div>
                        <div className="text-xl font-bold text-amber-900">{points} xu</div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow p-4 mb-6 border border-amber-100">
                    <div className="grid sm:grid-cols-3 gap-3">
                        {/* Type */}
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border"
                        >
                            <option value="all">Loại: Tất cả</option>
                            <option value="Product">Sản phẩm</option>
                            <option value="Delivery">Vận chuyển</option>
                        </select>

                        {/* DiscountType */}
                        <select
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border"
                        >
                            <option value="all">Giảm giá: Tất cả</option>
                            <option value="FixedAmount">Số tiền cố định</option>
                            <option value="Percentage">Phần trăm</option>
                        </select>

                        {/* PaymentMethod */}
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border"
                        >
                            <option value="all">Thanh toán: Tất cả</option>
                            <option value="Cash">Tiền mặt</option>
                            <option value="Online">Thanh toán trực tuyến</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500 bg-white">
                        Không có voucher nào phù hợp.
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(v => {
                            const need = v.pointChangeAmount || 0;
                            const can = points >= need && v.isActive;
                            return (
                                <div
                                    key={v.id}
                                    className="rounded-2xl border bg-white p-4 shadow hover:shadow-md transition flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-start justify-between">
                                            <p className="font-bold">{v.code}</p>
                                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">{t(v.type)}</span>
                                        </div>
                                        <div className="mt-2 text-sm text-gray-700">{v.name}</div>
                                        <div className="text-sm text-gray-500">{v.description}</div>
                                        <div className="mt-2 text-sm">
                                            Ưu đãi: {formatVND(v.discount)}{" "}
                                            {v.maxDiscountAmount ? `(tối đa ${formatVND(v.maxDiscountAmount)})` : ""}
                                        </div>
                                        {v.minOrderValue ? (
                                            <div className="text-xs text-gray-500">
                                                Đơn tối thiểu: {formatVND(v.minOrderValue)}
                                            </div>
                                        ) : null}
                                        <div className="text-xs text-gray-500">
                                            HSD: {new Date(v.endDate).toLocaleDateString("vi-VN")}
                                        </div>

                                        <div className="mt-4 flex justify-between text-sm">
                                            <span>
                                                Cần: <b>{v.pointChangeAmount || 0}</b> xu
                                            </span>
                                            <span className={points >= (v.pointChangeAmount || 0) && v.isActive ? "text-emerald-600" : "text-rose-600"}>
                                                {points >= (v.pointChangeAmount || 0) && v.isActive ? "Đủ xu" : "Chưa đủ xu"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Button luôn ở dưới */}
                                    <button
                                        disabled={!(points >= (v.pointChangeAmount || 0) && v.isActive)}
                                        onClick={() => setConfirming(v)}
                                        className={`mt-4 w-full px-4 py-2 rounded-xl border transition
      ${points >= (v.pointChangeAmount || 0) && v.isActive
                                                ? "bg-black text-white hover:opacity-90"
                                                : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                                    >
                                        Đổi voucher
                                    </button>
                                </div>

                            );
                        })}
                    </div>
                )}


                {/* Confirm modal */}
                {confirming && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-md rounded-2xl bg-white p-6">
                            <h3 className="text-lg font-bold">Xác nhận đổi voucher</h3>
                            <p className="mt-2 text-sm">
                                Bạn sẽ dùng <b>{confirming.pointChangeAmount}</b> xu để đổi <b>{confirming.code}</b>.
                            </p>
                            <div className="mt-4 flex justify-end gap-3">
                                <button onClick={() => setConfirming(null)} className="px-4 py-2 rounded-xl border">Huỷ</button>
                                <button onClick={() => onExchange(confirming)} className="px-4 py-2 rounded-xl bg-black text-white">Xác nhận</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
