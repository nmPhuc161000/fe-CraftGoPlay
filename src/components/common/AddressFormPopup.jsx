import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FiX } from "react-icons/fi";

export default function AddressFormPopup({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  provinces = [],
  districts = [],
  wards = [],
  onProvinceChange,
  onDistrictChange,
}) {
  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    province: "",
    district: "",
    ward: "",
    street: "",
    addressType: "HOME", // "HOME" | "OFFICE"
    isDefault: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        recipientName: initialData.recipientName || "",
        phoneNumber: initialData.phoneNumber || "",
        province: initialData.province || "",
        district: initialData.district || "",
        ward: initialData.ward || "",
        street: initialData.street || "",
        addressType: initialData.addressType || "HOME",
        isDefault: initialData.isDefault || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "province") {
      onProvinceChange?.(value);
      setFormData((prev) => ({
        ...prev,
        district: "",
        ward: "",
      }));
    }
    if (name === "district") {
      onDistrictChange?.(value);
      setFormData((prev) => ({
        ...prev,
        ward: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };    

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 backdrop-blur-sm"
        style={{ backgroundColor: "rgba(230, 230, 230, 0.7)" } }
      />

      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="bg-white rounded-lg shadow-xl w-[500px] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-black"
          >
            <FiX size={20} />
          </button>

          <Dialog.Title className="text-xl font-semibold mb-6">
            {initialData ? "Cập nhật địa chỉ" : "Địa chỉ mới"}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Row 1: Họ và tên, SĐT */}
            <div className="flex gap-4">
              <input
                type="text"
                name="recipientName"
                placeholder="Họ và tên"
                value={formData.recipientName}
                onChange={handleChange}
                required
                className="flex-1 border rounded p-2"
              />
              <input
                type="text"
                name="phoneNumber"
                placeholder="Số điện thoại"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="flex-1 border rounded p-2"
              />
            </div>

            {/* Row 2: Tỉnh - Huyện - Xã */}
            <div>
              <select
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
                className="w-full border rounded p-2 mb-2"
              >
                <option value="">Tỉnh/ Thành phố</option>
                {provinces.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>

              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="w-full border rounded p-2 mb-2"
              >
                <option value="">Quận/ Huyện</option>
                {districts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                required
                className="w-full border rounded p-2"
              >
                <option value="">Phường/ Xã</option>
                {wards.map((w) => (
                  <option key={w.name} value={w.name}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Row 3: Địa chỉ cụ thể */}
            <input
              type="text"
              name="street"
              placeholder="Địa chỉ cụ thể"
              value={formData.street}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />

            {/* Row 4: Loại địa chỉ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại địa chỉ:
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, addressType: "HOME" })
                  }
                  className={`border rounded px-4 py-2 ${
                    formData.addressType === "HOME"
                      ? "bg-orange-500 text-white"
                      : ""
                  }`}
                >
                  Nhà Riêng
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, addressType: "OFFICE" })
                  }
                  className={`border rounded px-4 py-2 ${
                    formData.addressType === "OFFICE"
                      ? "bg-orange-500 text-white"
                      : ""
                  }`}
                >
                  Văn Phòng
                </button>
              </div>
            </div>

            {/* Checkbox mặc định */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
                id="isDefault"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:underline"
              >
                Trở Lại
              </button>
              <button
                type="submit"
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Hoàn thành
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
