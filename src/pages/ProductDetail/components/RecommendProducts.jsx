import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../../services/apis/productApi";
import placeholderImg from "../../../assets/images/loginimg.jpg";

const RecommendProducts = ({ subCategoryId, currentProductId, limit = 8 }) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState(null);
    const [error, setError] = useState(null);

    const formatVND = (value) => {
        const n = Number(value || 0);
        return n.toLocaleString("vi-VN") + "₫";
    };

    useEffect(() => {
        let canceled = false;

        const fetch = async () => {
            setError(null);
            setProducts(null);

            if (!subCategoryId) {
                setProducts([]);
                return;
            }

            try {
                const res = await productService.getProductsBySubCategoryId(
                    subCategoryId,
                    1,
                    limit,
                    "Active"
                );

                console.log("GetProductsBySubCategoryId response:", res);
                const groups = res?.data?.data || [];

                let flat = [];
                for (const g of groups) {
                    if (Array.isArray(g?.products)) {
                        flat = flat.concat(g.products);
                    }
                }

                const seen = new Set();
                const deduped = [];
                for (const p of flat) {
                    if (!p || !p.id) continue;
                    if (!seen.has(p.id)) {
                        seen.add(p.id);
                        deduped.push(p);
                    }
                }

                const normalized = deduped.map((p) => {
                    const images = p?.productImages || p?.images || [];
                    return { ...p, _images: images };
                });

                const result = normalized.filter((p) => p.id !== currentProductId).slice(0, limit);

                if (!canceled) setProducts(result);
            } catch (err) {
                console.error("RecommendProducts fetch error:", err);
                if (!canceled) {
                    setError(err);
                    setProducts([]);
                }
            }
        };
        fetch();

        return () => {
            canceled = true;
        };
    }, [subCategoryId, currentProductId, limit]);

    // Loading skeleton
    if (products === null) {
        return (
            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#5e3a1e]">Có thể bạn sẽ thích</h2>
                <div className="w-[82%] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-white rounded-lg shadow p-4 h-[360px]" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center text-[#5e3a1e]">Có thể bạn sẽ thích</h2>
                <div className="py-6 text-center text-red-500">Không thể tải sản phẩm gợi ý.</div>
            </section>
        );
    }

    if (!products.length) {
        return (
            <section className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center text-[#5e3a1e]">Có thể bạn sẽ thích</h2>
                <div className="py-6 text-center text-gray-500">Không có sản phẩm gợi ý.</div>
            </section>
        );
    }

    return (
        <section className="mt-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-[#5e3a1e]">Có thể bạn sẽ thích</h2>

            <div className="w-[82%] mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product, idx) => {
                        const images = product.productImages || [];
                        const img0 = images[0]?.imageUrl || null;
                        const img1 = images[1]?.imageUrl || img0 || null;

                        const firstImg = img0 || placeholderImg;
                        const secondImg = img1 || firstImg;

                        return (
                            <div
                                key={product.id || idx}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="group w-full max-w-sm bg-white shadow rounded-lg overflow-hidden relative text-center mx-auto transition-transform duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                            >
                                <div className="relative w-full h-64 bg-gray-50">
                                    <img
                                        src={firstImg}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-100 group-hover:opacity-0"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = placeholderImg;
                                        }}
                                    />
                                    <img
                                        src={secondImg}
                                        alt={product.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                                        onError={(e) => {
                                            e.currentTarget.onerror = null;
                                            e.currentTarget.src = placeholderImg;
                                        }}
                                    />
                                </div>

                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-[#5e3a1e] leading-tight h-14 overflow-hidden">
                                        {product.name}
                                    </h3>

                                    <div className="mt-2 text-base">
                                        <span className="text-red-600 font-semibold">{formatVND(product.price)}</span>
                                        {product.originalPrice && (
                                            <span className="ml-2 line-through text-gray-500">{formatVND(product.originalPrice)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default RecommendProducts;
