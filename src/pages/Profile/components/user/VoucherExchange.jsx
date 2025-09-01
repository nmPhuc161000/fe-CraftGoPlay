// pages/rewards/VoucherExchange.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatVND = (n) => (n || 0).toLocaleString("vi-VN") + "đ";

export default function VoucherExchange() {
    const [loading, setLoading] = useState(true);
    const [catalog, setCatalog] = useState([]);
    const [points, setPoints] = useState(0);
    const [search, setSearch] = useState("");
    const [type, setType] = useState("All");
    const [minOrder, setMinOrder] = useState("all");
    const [onlyActive, setOnlyActive] = useState(true);
    const [confirming, setConfirming] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const [p, list] = await Promise.all([getMyPoints(), getExchangeCatalog()]);
                setPoints(p);
                setCatalog(Array.isArray(list) ? list : list?.data || []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const filtered = useMemo(() => {
        let list = catalog;
        if (onlyActive) list = list.filter(x => x.IsActive);
        if (type !== "All") list = list.filter(x => x.Type === type);
        if (search.trim()) {
            const s = search.trim().toLowerCase();
            list = list.filter(x =>
                x.Code?.toLowerCase().includes(s) ||
                x.Name?.toLowerCase().includes(s) ||
                x.Description?.toLowerCase().includes(s)
            );
        }
        if (minOrder !== "all") {
            if (minOrder === "200k") list = list.filter(x => (x.MinOrderValue || 0) >= 200_000 && (x.MinOrderValue || 0) < 500_000);
            if (minOrder === "500k") list = list.filter(x => (x.MinOrderValue || 0) >= 500_000 && (x.MinOrderValue || 0) < 1_000_000);
            if (minOrder === "1m") list = list.filter(x => (x.MinOrderValue || 0) >= 1_000_000);
        }
        return list;
    }, [catalog, search, type, minOrder, onlyActive]);

    const progress = (need) => {
        const pct = Math.max(0, Math.min(100, Math.floor((points / (need || 1)) * 100)));
        return (
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${pct}%` }} />
            </div>
        );
    };

    const onExchange = async (item) => {
        setConfirming(null);
        await exchangeVoucher(item);        // TODO: gọi BE thật → trừ Xu + cấp voucher
        const p = await getMyPoints();      // refresh điểm
        setPoints(p);
        navigate("/profile/vouchers");      // chuyển về kho voucher
    };

    if (loading) {
        return (
            <div className="min-h-[50vh] grid place-items-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-amber-100">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-amber-900">Đổi voucher</h1>
                            <p className="text-sm text-amber-700">
                                Quy tắc A: Voucher đổi từ Xu kém lời hơn hoặc bằng dùng Xu trực tiếp. Xu chỉ được giảm tối đa 10% khi thanh toán.
                            </p>
                        </div>
                        <div className="px-5 py-3 rounded-2xl border bg-amber-50">
                            <div className="text-xs uppercase text-amber-600">Xu hiện có</div>
                            <div className="text-2xl font-bold text-amber-900">{points} xu</div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow p-4 mb-6 border border-amber-100">
                    <div className="grid md:grid-cols-4 gap-3">
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm mã / tên / mô tả…"
                            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-3 rounded-xl border">
                            <option value="All">Tất cả loại</option>
                            <option value="Product">Sản phẩm</option>
                            <option value="Delivery">Vận chuyển</option>
                        </select>
                        <select value={minOrder} onChange={e => setMinOrder(e.target.value)} className="w-full px-4 py-3 rounded-xl border">
                            <option value="all">Đơn tối thiểu: Tất cả</option>
                            <option value="200k">Từ 200K - &lt; 500K</option>
                            <option value="500k">Từ 500K - &lt; 1 triệu</option>
                            <option value="1m">Từ 1 triệu trở lên</option>
                        </select>
                        <button
                            onClick={() => setOnlyActive(v => !v)}
                            className={`px-4 py-3 rounded-xl border ${onlyActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-50 text-gray-700"}`}
                        >
                            {onlyActive ? "Đang hiển thị: Voucher Active" : "Hiển thị cả hết hạn"}
                        </button>
                    </div>
                </div>

                {/* Grid */}
                {filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed p-10 text-center text-gray-500 bg-white">
                        Không tìm thấy voucher phù hợp.
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((v) => {
                            const need = v.PointChangeAmount || 0;
                            const can = points >= need && v.IsActive;
                            return (
                                <div key={v.Code} className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow-md transition">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="text-sm text-gray-500">Mã</div>
                                            <div className="text-lg font-semibold tracking-wide">{v.Code}</div>
                                        </div>
                                        <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">{v.Type}</span>
                                    </div>

                                    <div className="mt-3 space-y-1">
                                        <div className="text-sm text-gray-700">{v.Name}</div>
                                        <div className="text-sm text-gray-500">{v.Description}</div>
                                        <div className="text-sm">
                                            <span className="font-medium">Ưu đãi:</span>{" "}
                                            {v.DiscountType === "Percentage"
                                                ? `${v.Discount}%` + (v.MaxDiscountAmount ? ` (tối đa ${formatVND(v.MaxDiscountAmount)})` : "")
                                                : `${formatVND(v.Discount)}`
                                            }
                                        </div>
                                        {v.MinOrderValue ? (
                                            <div className="text-xs text-gray-500">Đơn tối thiểu: {formatVND(v.MinOrderValue)}</div>
                                        ) : null}
                                        <div className="text-xs text-gray-500">HSD: {new Date(v.EndDate).toLocaleDateString("vi-VN")}</div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Cần: <b>{need}</b> xu</span>
                                            <span className={can ? "text-emerald-600" : "text-rose-600"}>
                                                {can ? "Đủ xu" : (v.IsActive ? "Chưa đủ xu" : "Đã đóng")}
                                            </span>
                                        </div>
                                        {progress(need)}
                                    </div>

                                    <button
                                        disabled={!can}
                                        onClick={() => setConfirming(v)}
                                        className={`mt-4 w-full px-4 py-2 rounded-xl border transition
                      ${can ? "bg-black text-white hover:opacity-90" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
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
                            <h3 className="text-xl font-bold">Xác nhận đổi voucher</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Bạn sẽ dùng <b>{confirming.PointChangeAmount}</b> xu để đổi <b>{confirming.Code}</b>.
                            </p>
                            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm">
                                <div><span className="text-gray-500">Ưu đãi:</span>{" "}
                                    {confirming.DiscountType === "Percentage"
                                        ? `${confirming.Discount}%` + (confirming.MaxDiscountAmount ? ` (tối đa ${formatVND(confirming.MaxDiscountAmount)})` : "")
                                        : `${formatVND(confirming.Discount)}`
                                    }
                                </div>
                                {confirming.MinOrderValue ? <div><span className="text-gray-500">Đơn tối thiểu:</span> {formatVND(confirming.MinOrderValue)}</div> : null}
                                <div><span className="text-gray-500">HSD:</span> {new Date(confirming.EndDate).toLocaleDateString("vi-VN")}</div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button onClick={() => setConfirming(null)} className="px-4 py-2 rounded-xl border hover:bg-slate-50">Huỷ</button>
                                <button onClick={() => onExchange(confirming)} className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90">Xác nhận</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
