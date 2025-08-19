import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../../contexts/CartContext";
import { useLocation, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";
import { AuthContext } from "../../contexts/AuthContext";
import MainLayout from "../../components/layout/MainLayout";
import {
  createOrderFromCart,
  createOrderDirect,
  getVnpayUrl,
} from "../../services/apis/orderApi";
import { useNotification } from "../../contexts/NotificationContext";
import addressService from "../../services/apis/addressApi";
import locationService from "../../services/apis/locationApi";
import pointService from "../../services/apis/pointApi";

const Checkout = () => {
  const { cartItems, removeMultipleItems } = useContext(CartContext);
  const { user: realUser } = useContext(AuthContext);
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNow = location.state?.buyNow;

  const selectedItemIds = location.state?.selectedItems || [];

  const selectedCartItems = cartItems.filter((item) =>
    selectedItemIds.includes(item.id)
  );

  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState("");
  const [useCoins, setUseCoins] = useState(false);
  const [userCoins, setUserCoins] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shippingFees, setShippingFees] = useState([]); // Phí từng shop
  const [totalShippingFee, setTotalShippingFee] = useState(15000); // Tổng phí
  const [artisanAddressCache, setArtisanAddressCache] = useState({});

  const getCachedArtisanAddress = async (artisanId) => {
    if (artisanAddressCache[artisanId]) {
      return artisanAddressCache[artisanId];
    }

    const res = await addressService.getAddressOfArtisan(artisanId);
    setArtisanAddressCache((prev) => ({
      ...prev,
      [artisanId]: res.data.data,
    }));
    return res.data.data;
  };

  useEffect(() => {
    if (!isPlacingOrder && !buyNow && selectedCartItems.length === 0) {
      navigate("/cart");
    }
  }, [selectedCartItems, isPlacingOrder, buyNow]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const res = await addressService.getDefaultAddress(realUser.id);
        const defaultAddress = res?.data?.data;
        if (defaultAddress) {
          setAddresses([defaultAddress]);
          setSelectedAddressId(defaultAddress.id);
        }
      } catch (err) {
        console.error("Lỗi khi lấy địa chỉ mặc định:", err);
      }
    };

    fetchDefaultAddress();
  }, [realUser?.id]);
  useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        if (realUser?.id) {
          const response = await pointService.getPointByUserId(realUser.id);
          if (response.data?.data?.amount) {
            setUserCoins(response.data.data.amount);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy số xu:", error);
        showNotification("Không thể lấy số xu hiện tại.", "warning");
      }
    };
    fetchUserCoins();
  }, [realUser?.id]);

  const getTotal = () => {
    if (buyNow) {
      return buyNow.productPrice * buyNow.quantity;
    }
    return selectedCartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
  };

  const maxDiscountByPercent = Math.floor((getTotal() * 0.15) / 100) * 100; 
  const maxDiscountByCoins = userCoins * 100; // 1 xu = 100 VNĐ

  let coinDiscount = 0;
  if (useCoins) {
    const coinDiscountRaw = maxDiscountByPercent / 100;
    const coinDiscountRounded = Math.floor(coinDiscountRaw); // làm tròn số nguyên
    coinDiscount = Math.min(
      maxDiscountByPercent,
      maxDiscountByCoins,
      coinDiscountRounded * 100 
    );
  }

  const groupedCart = selectedCartItems.reduce((acc, item) => {
    const artisan = item.user?.userName || "Không rõ nghệ nhân";
    acc[artisan] = acc[artisan] || [];
    acc[artisan].push(item);
    return acc;
  }, {});

  const handleApplyVoucher = () => {
    if (voucherCode === "GIAM10") {
      setDiscount(getTotal() * 0.1);
      setVoucherError("");
    } else {
      setDiscount(0);
      setVoucherError("Mã không hợp lệ hoặc đã hết hạn");
    }
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      showNotification("Vui lòng chọn phương thức thanh toán", "warning");
      return;
    }
    setIsPlacingOrder(true);

    const formData = new FormData();
    formData.append("UserId", realUser?.id);
    formData.append(
      "PaymentMethod",
      paymentMethod === "vnpay" ? "Online" : "Cash"
    );
    formData.append("AddressId", selectedAddressId);

    if (buyNow) {
      formData.append("ProductId", buyNow.productId);
      formData.append("Quantity", buyNow.quantity);
      formData.append("DeliveryAmount", totalShippingFee);
      formData.append("VoucherCode", voucherCode);

      const result = await createOrderDirect(realUser?.id, formData);
      console.log("Order result:", result);

      if (result.success) {
        const orderId = result.data?.data;

        if (paymentMethod === "vnpay") {
          const vnpayResult = await getVnpayUrl(orderId);
          if (vnpayResult.success && vnpayResult.data) {
            window.location.href = vnpayResult.data.data;
          } else {
            alert("Không thể tạo URL thanh toán VNPay");
            setIsPlacingOrder(false);
          }
        } else {
          navigate("/order-success");
        }
      } else {
        alert("Đặt hàng thất bại: " + result.error);
        setIsPlacingOrder(false);
      }
    } else {
      selectedCartItems.forEach((item) => {
        formData.append("SelectedCartItemIds", item.id);
      });

      // Tạo đối tượng deliveryAmounts từ shippingFees
      const deliveryAmounts = {};
      shippingFees.forEach((fee) => {
        // Tìm artisanId tương ứng với artisanName
        const artisanItems = selectedCartItems.filter(
          (item) => item.user?.userName === fee.artisanName
        );
        if (artisanItems.length > 0) {
          const artisanId = artisanItems[0].product.artisanId; // Lấy artisanId từ item đầu tiên
          deliveryAmounts[artisanId] = fee.fee;
        }
      });

      // Gửi deliveryAmounts dưới dạng JSON
      formData.append("DeliveryAmounts", JSON.stringify(deliveryAmounts));
      formData.append("VoucherCode", voucherCode);

      const result = await createOrderFromCart(formData);
      console.log("Order result:", result);

      if (result.success) {
        const transactionId = result.data?.data;
        console.log("orderId result:", transactionId);

        if (paymentMethod === "vnpay") {
          const vnpayResult = await getVnpayUrl(transactionId);
          console.log("vnpayResult", vnpayResult);
          if (vnpayResult.success && vnpayResult.data) {
            window.location.href = vnpayResult.data.data;
          } else {
            alert("Không thể tạo URL thanh toán VNPay");
            setIsPlacingOrder(false);
          }
        } else {
          await removeMultipleItems(selectedItemIds);
          navigate("/order-success");
        }
      } else {
        alert("Đặt hàng thất bại: " + result.error);
        setIsPlacingOrder(false);
      }
    }
  };

  const calculateShippingFee = async () => {
    try {
      if (!selectedAddressId || (!buyNow && selectedCartItems.length === 0)) {
        return;
      }

      const userAddress = addresses.find(
        (addr) => addr.id === selectedAddressId
      );
      if (!userAddress) {
        throw new Error("Không lấy được địa chỉ người nhận");
      }

      if (buyNow) {
        // Xử lý mua ngay (1 sản phẩm)
        const dataAddress = await getCachedArtisanAddress(buyNow.artisanId);

        if (!dataAddress) {
          throw new Error("Không lấy được địa chỉ người gửi");
        }

        const totalWeight = buyNow.weight * buyNow.quantity;
        if (!totalWeight || totalWeight <= 0) {
          throw new Error("Khối lượng sản phẩm mua ngay không hợp lệ");
        }

        const serviceTypeId = totalWeight > 30000 ? 5 : 2;

        const feeData = {
          service_type_id: serviceTypeId,
          from_district_id: dataAddress.districtId,
          from_ward_code: dataAddress.wardCode,
          to_district_id: userAddress.districtId,
          to_ward_code: userAddress.wardCode,
          insurance_value: 0,
          weight: totalWeight, // Luôn gửi weight để tránh lỗi
        };

        if (serviceTypeId === 2) {
          feeData.length = buyNow.length || 30;
          feeData.width = buyNow.width || 40;
          feeData.height = buyNow.height || 20;
        } else {
          feeData.items = Array.from({ length: buyNow.quantity }, () => ({
            name: buyNow.productName,
            quantity: 1,
            weight: buyNow.weight,
            length: buyNow.length || 30,
            width: buyNow.width || 40,
            height: buyNow.height || 20,
          }));
        }

        const feeResult = await locationService.getFeeShip(feeData);
        setShippingFees([
          {
            artisanName: buyNow.artisanName,
            fee: feeResult.data.total,
          },
        ]);
        setTotalShippingFee(feeResult.data.total);
      } else {
        // Xử lý giỏ hàng
        const itemsByArtisan = selectedCartItems.reduce((acc, item) => {
          const artisanId = item.product.artisanId;
          const artisanName = item.user?.userName || "Nghệ nhân";
          if (!acc[artisanId]) {
            acc[artisanId] = { name: artisanName, items: [] };
          }
          acc[artisanId].items.push(item);
          return acc;
        }, {});

        const feeResults = await Promise.all(
          Object.entries(itemsByArtisan).map(
            async ([artisanId, { name, items }]) => {
              const dataAddress = await getCachedArtisanAddress(artisanId);

              // Kiểm tra và tính tổng khối lượng
              const totalWeight = items.reduce((sum, item) => {
                const weight = item.product.weight || 0;
                if (!weight || weight <= 0) {
                  throw new Error(
                    `Sản phẩm ${item.productName} có khối lượng không hợp lệ`
                  );
                }
                return sum + weight * item.quantity;
              }, 0);

              // Kiểm tra kích thước
              const maxLength = Math.max(
                ...items.map((item) => item.product.length || 30)
              );
              const maxWidth = Math.max(
                ...items.map((item) => item.product.width || 40)
              );
              const totalHeight = items.reduce(
                (sum, item) =>
                  sum + (item.product.height || 20) * item.quantity,
                0
              );

              if (maxLength > 200 || maxWidth > 200 || totalHeight > 200) {
                throw new Error(
                  `Kích thước kiện hàng từ ${name} vượt quá 200cm`
                );
              }
              if (totalWeight > 1600000) {
                throw new Error(
                  `Khối lượng kiện hàng từ ${name} vượt quá 1,600kg`
                );
              }

              // Chọn service_type_id dựa trên tổng khối lượng
              const serviceTypeId = totalWeight > 30000 ? 5 : 2;

              const feeData = {
                service_type_id: serviceTypeId,
                from_district_id: dataAddress.districtId,
                from_ward_code: dataAddress.wardCode,
                to_district_id: userAddress.districtId,
                to_ward_code: userAddress.wardCode,
                insurance_value: 0,
                weight: totalWeight, // Luôn gửi weight để tránh lỗi
              };

              if (serviceTypeId === 2) {
                feeData.length = maxLength;
                feeData.width = maxWidth;
                feeData.height = totalHeight;
              } else {
                feeData.items = items.flatMap((item) =>
                  Array.from({ length: item.quantity }, () => ({
                    name: item.productName,
                    quantity: 1,
                    weight: item.product.weight || 1000, // Giá trị mặc định nếu weight không hợp lệ
                    length: item.product.length || 30,
                    width: item.product.width || 40,
                    height: item.product.height || 20,
                  }))
                );
              }

              // console.log(`Request feeData cho ${name}:`, feeData); // Debug

              let feeResult;
              try {
                feeResult = await locationService.getFeeShip(feeData);
              } catch (error) {
                console.error(`Lỗi API cho ${name}:`, error.response?.data);
                if (
                  error.response?.data?.message?.includes(
                    "Service not available"
                  ) &&
                  serviceTypeId === 2
                ) {
                  // Thử lại với service_type_id = 5
                  feeData.service_type_id = 5;
                  feeData.items = items.flatMap((item) =>
                    Array.from({ length: item.quantity }, () => ({
                      name: item.productName,
                      quantity: 1,
                      weight: item.product.weight || 1000,
                      length: item.product.length || 30,
                      width: item.product.width || 40,
                      height: item.product.height || 20,
                    }))
                  );
                  delete feeData.length;
                  delete feeData.width;
                  delete feeData.height;
                  console.log(
                    `Thử lại feeData cho ${name} với service_type_id = 5:`,
                    feeData
                  );
                  feeResult = await locationService.getFeeShip(feeData);
                } else {
                  throw error;
                }
              }

              return { artisanName: name, fee: feeResult.data.total };
            }
          )
        );

        setShippingFees(feeResults);
        setTotalShippingFee(feeResults.reduce((sum, { fee }) => sum + fee, 0));
      }
    } catch (error) {
      console.error(
        "Lỗi tính phí vận chuyển:",
        error.message,
        error.response?.data
      );
      setShippingFees([]);
      setTotalShippingFee(15000);
      showNotification(
        `Không thể tính phí vận chuyển: ${error.message}. Áp dụng phí mặc định 15.000đ`,
        "warning"
      );
    }
  };

  useEffect(() => {
    if (selectedAddressId && (buyNow || selectedCartItems.length > 0)) {
      calculateShippingFee();
    }
  }, [selectedAddressId, buyNow, selectedCartItems]);

  return (
    <MainLayout>
      <main className="bg-[#f7f7f7] py-15 text-[#5e3a1e] text-[15px]">
        <h1 className="text-4xl font-bold mb-10 text-center">Thanh Toán</h1>

        <div className="w-[80%] max-w-[1400px] mx-auto space-y-6">
          {/* dia chi */}
          <section className="bg-white rounded shadow-sm border border-gray-200 p-4 flex justify-between items-start gap-4 transition duration-300 hover:shadow-lg">
            <div>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#5e3a1e]">
                <FaMapMarkerAlt className="text-[#b28940]" />
                Địa chỉ nhận hàng
              </h2>
              {(() => {
                const selectedAddress = addresses.find(
                  (addr) => addr.id === selectedAddressId
                );
                if (!selectedAddress)
                  return (
                    <p className="text-gray-500">Chưa có địa chỉ được chọn.</p>
                  );
                return (
                  <div className="space-y-1 text-[15px] leading-relaxed">
                    <p>
                      <span className="font-medium">
                        {selectedAddress.fullName}
                      </span>{" "}
                      | {selectedAddress.phoneNumber}
                    </p>
                    <p>{realUser?.email}</p>
                    <p className="text-[#5e3a1e]">
                      {selectedAddress.fullAddress}
                    </p>
                  </div>
                );
              })()}
            </div>
            <button className="text-[15px] text-[#b28940] hover:text-[#a77a2d] font-medium hover:underline transition cursor-pointer">
              Thay đổi
            </button>
          </section>

          {/* sp */}
          <div className="bg-white border border-gray-200 p-4 mb-0 rounded-t-lg">
            <div className="grid grid-cols-12 font-semibold text-[15px] text-gray-600">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Đơn giá</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Thành tiền</div>
            </div>
          </div>

          {buyNow ? (
            <section className="bg-white rounded shadow-sm border border-gray-200 p-4 mb-6">
              <div className="text-[15px] font-semibold mb-3 pb-2">
                🛍 Nghệ nhân: {buyNow.artisanName}
              </div>

              <div className="grid grid-cols-12 items-center py-3 text-[15px]">
                <div className="col-span-6 flex items-center gap-4">
                  <img
                    src={buyNow.productImage}
                    alt={buyNow.productName}
                    className="w-14 h-14 object-cover rounded border"
                  />
                  <p className="font-medium max-w-[200px] truncate">
                    {buyNow.productName}
                  </p>
                </div>
                <div className="col-span-2 text-center">
                  {(buyNow.productPrice || 0).toLocaleString("vi-VN")}₫
                </div>
                <div className="col-span-2 text-center">
                  {buyNow.quantity}
                </div>
                <div className="col-span-2 text-right font-medium">
                  {(buyNow.productPrice * buyNow.quantity).toLocaleString(
                    "vi-VN"
                  )}
                  ₫
                </div>
              </div>

              <div className="mt-3 space-y-2 text-[15px]">
                {shippingFees.length > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Phí vận chuyển:</span>
                    <span className="text-red-500">
                      {totalShippingFee.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                  <span>Tổng thanh toán tạm tính ({buyNow.quantity} sản phẩm):</span>
                  <span className="text-red-600">
                    {(
                      buyNow.productPrice * buyNow.quantity +
                      totalShippingFee
                    ).toLocaleString("vi-VN")}
                    ₫
                  </span>
                </div>
              </div>
            </section>
          ) : (
            Object.entries(groupedCart).map(([artisanName, items], index) => (
              <section
                key={artisanName}
                className="bg-white rounded shadow-sm border border-gray-200 p-4 mb-6"
              >
                <div className="text-[15px] font-semibold mb-3 pb-2">
                  🛍 Nghệ nhân: {artisanName}
                </div>

                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 items-center py-3 text-[15px]"
                  >
                    <div className="col-span-6 flex items-center gap-4">
                      <img
                        src={item.productImages?.[0]?.imageUrl}
                        alt={item.productName}
                        className="w-14 h-14 object-cover rounded border"
                      />
                      <p className="font-medium max-w-[200px] truncate">
                        {item.productName}
                      </p>
                    </div>
                    <div className="col-span-2 text-center">
                      {(item.unitPrice ?? 0).toLocaleString("vi-VN")}₫
                    </div>
                    <div className="col-span-2 text-center">
                      {item.quantity}
                    </div>
                    <div className="col-span-2 text-right font-medium">
                      {(item.unitPrice * item.quantity).toLocaleString(
                        "vi-VN"
                      )}
                      ₫
                    </div>
                  </div>
                ))}

                <div className="mt-3 space-y-2 text-[15px]">
                  {/* {shippingFees.length > 1 && (
                      <div className="space-y-1 text-gray-600">
                        {shippingFees
                          .filter((fee) => fee.artisanName === artisanName)
                          .map((fee, i) => (
                            <div key={i} className="flex justify-between">
                              <span>Phí vận chuyển từ {fee.artisanName}:</span>
                              <span>{fee.fee.toLocaleString("vi-VN")}₫</span>
                            </div>
                          ))}
                      </div>
                    )} */}
                  <div className="flex justify-between text-gray-700">
                    <span>
                      {shippingFees.length > 1
                        ? "Tổng phí vận chuyển:"
                        : "Phí vận chuyển:"}
                    </span>
                    <span className="text-red-500">
                      {shippingFees
                        .filter((fee) => fee.artisanName === artisanName)
                        .reduce((sum, fee) => sum + fee.fee, 0)
                        .toLocaleString("vi-VN")}
                      ₫
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
                    <span>Tổng thanh toán tạm tính ({items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm):</span>
                    <span className="text-red-600">
                      {(
                        items.reduce(
                          (total, item) =>
                            total + item.unitPrice * item.quantity,
                          0
                        ) +
                        shippingFees
                          .filter((fee) => fee.artisanName === artisanName)
                          .reduce((sum, fee) => sum + fee.fee, 0)
                      ).toLocaleString("vi-VN")}
                      ₫
                    </span>
                  </div>
                </div>
              </section>
            ))
          )}

          {/* voucher xu */}
          <section className="bg-white rounded shadow-sm border border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[15px] font-semibold text-[#5e3a1e]">
                <FaTicketAlt className="text-[#b28940] text-[18px]" />
                Mã giảm giá
              </div>

              <div className="flex gap-2 w-[300px]">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã"
                  className="w-48 border border-gray-300 rounded px-3 py-2 text-[15px]"
                />
                <button
                  onClick={handleApplyVoucher}
                  className="px-4 py-2 bg-[#5e3a1e] hover:bg-[#4a2f15] text-white rounded text-[15px]"
                >
                  Áp dụng
                </button>
              </div>
            </div>

            {voucherError && (
              <p className="text-[14px] text-red-500 mt-1 text-right">
                {voucherError}
              </p>
            )}

            <div className="flex items-center justify-between">
              <label className="text-[15px] font-medium">
                Dùng {userCoins} xu
                <br />
                <span className="text-xs text-gray-500">
                  Giảm tối đa {(coinDiscount || 0).toLocaleString("vi-VN")}₫ ({Math.floor((coinDiscount || 0) / 100)} xu)
                </span>
              </label>
              <label className="relative inline-flex items-center cursor-pointer w-11 h-6">
                <input
                  type="checkbox"
                  checked={useCoins}
                  onChange={(e) => setUseCoins(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#5e3a1e] transition-colors duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>
          </section>

          {/* phuong thuc thanh toan */}
          <section className="bg-white rounded shadow-sm border border-gray-200 p-4 text-[15px] space-y-6">
            <div>
              <h2 className="font-semibold text-[16px] mb-2">
                Phương thức thanh toán
              </h2>
              <div className="flex flex-wrap gap-2">
                {["vnpay", "cod"].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`px-4 py-2 border cursor-pointer rounded ${paymentMethod === method
                      ? "border-[#d0011b] text-[#d0011b] font-semibold"
                      : "border-gray-300 hover:border-[#d0011b]"
                      }`}
                  >
                    {method === "vnpay"
                      ? "Thanh toán VNPay"
                      : "Thanh toán khi nhận hàng"}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#fffdfa] p-4 rounded border border-gray-100 space-y-2 text-[15px]">
              <div className="flex justify-between">
                <span>Tổng tiền hàng</span>
                <span>{getTotal().toLocaleString("vi-VN")}₫</span>
              </div>
              {/* {shippingFees.length > 1 && (
                <div className="space-y-1">
                  {shippingFees.map((fee, index) => (
                    <div key={index} className="flex justify-between">
                      <span>Phí vận chuyển từ {fee.artisanName}:</span>
                      <span>{fee.fee.toLocaleString("vi-VN")}₫</span>
                    </div>
                  ))}
                </div>
              )} */}
              <div className="flex justify-between">
                <span>
                  {shippingFees.length > 1
                    ? "Tổng phí vận chuyển"
                    : "Tổng Phí vận chuyển"}
                </span>
                <span>{totalShippingFee.toLocaleString("vi-VN")}₫</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Voucher giảm giá</span>
                  <span>-{discount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              {coinDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm từ xu</span>
                  <span>-{coinDiscount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              <div className="flex justify-between text-[18px] font-semibold border-t border-gray-200 pt-3 text-[#d0011b]">
                <span>Tổng thanh toán</span>
                <span>
                  {Math.max(
                    0,
                    getTotal() + totalShippingFee - discount - coinDiscount
                  ).toLocaleString("vi-VN")}
                  ₫
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Nhấn <strong>"Đặt hàng"</strong> đồng nghĩa với việc bạn đồng ý
              tuân theo{" "}
              <a href="#" className="text-[#5e3a1e] underline cursor-pointer">
                Điều khoản CraftGoPlay
              </a>
            </p>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className={`w-full py-3 bg-gradient-to-r from-[#5e3a1e] to-[#8b5e34] hover:opacity-95 text-white rounded font-semibold  cursor-pointertransition ${isPlacingOrder ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isPlacingOrder ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </section>
        </div>
      </main>
    </MainLayout>
  );
};

export default Checkout;
