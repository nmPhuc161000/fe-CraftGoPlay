import React, { useState, useEffect, useCallback } from "react";
import addressService from "../../../../services/apis/addressApi";
import { useNotification } from "../../../../contexts/NotificationContext";
import AddressManager from "../../../../components/common/AddressManager";
import AddressFormPopup from "../../../../components/common/AddressFormPopup";
import locationService from "../../../../services/apis/locationApi";
import { useConfirm } from "../../../../components/ConfirmForm/ConfirmForm";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

export default function AddressTab({ userId }) {
  const [state, setState] = useState({
    addresses: [],
    loading: true,
    isDialogOpen: false,
    currentAddress: null,
    provinces: [],
    districts: [],
    wards: [],
  });

  const { showNotification } = useNotification();
  const { confirm, ConfirmComponent } = useConfirm();

  const fetchData = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      const [addressesRes, provincesRes] = await Promise.all([
        addressService.getUserAddresses(userId),
        locationService.getProvince(),
      ]);
      setState((prev) => ({
        ...prev,
        addresses: addressesRes.data?.data || [],
        provinces: provincesRes.data || [],
        loading: false,
      }));
    } catch (error) {
      showNotification("Lỗi khi tải địa chỉ", "error");
      setState((prev) => ({ ...prev, loading: false }));
      console.error("Error fetching addresses or provinces:", error);
    }
  }, [userId, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchDistricts = useCallback(
    async (provinceName) => {
      try {
        const province = state.provinces.find(
          (p) => p.ProvinceName === provinceName
        );
        if (!province) return;
        const response = await locationService.getDistrict(province.ProvinceID);
        setState((prev) => ({
          ...prev,
          districts: response.data || [],
          wards: [],
        }));
      } catch (error) {
        console.error("Failed to fetch districts", error);
      }
    },
    [state.provinces]
  );

  const fetchWards = useCallback(
    async (districtName) => {
      try {
        const district = state.districts.find(
          (d) => d.DistrictName === districtName
        );
        if (!district) return;
        const response = await locationService.getWard(district.DistrictID);
        setState((prev) => ({ ...prev, wards: response.data || [] }));
      } catch (error) {
        console.error("Failed to fetch wards", error);
      }
    },
    [state.districts]
  );

  const handleDelete = async (addressId) => {
    const confirmed = await confirm({
      title: "Xóa địa chỉ",
      message: "Bạn chắc chắn muốn xóa địa chỉ này?",
      confirmText: "Xóa",
      cancelText: "Hủy",
      type: "danger",
    });

    if (confirmed) {
      try {
        const response = await addressService.deleteAddress(addressId);

        // Kiểm tra response từ API
        if (response.status === 200 || response.data?.success) {
          setState((prev) => ({
            ...prev,
            addresses: prev.addresses.filter((addr) => addr.id !== addressId),
          }));
          showNotification("Xóa địa chỉ thành công", "success");
        } else {
          throw new Error(response.data?.message || "Xóa địa chỉ thất bại");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        showNotification(
          error.response?.data?.message ||
            error.message ||
            "Xóa địa chỉ thất bại",
          "error"
        );
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const response = await addressService.setDefaultAddress(addressId);

      // Kiểm tra response từ API
      if (response.status === 200 || response.data?.success) {
        setState((prev) => ({
          ...prev,
          addresses: prev.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          })),
        }));
        showNotification("Đã đặt làm địa chỉ mặc định", "success");
      } else {
        throw new Error(response.data?.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      showNotification(
        error.response?.data?.message || error.message || "Thao tác thất bại",
        "error"
      );
    }
  };

  const handleAddNew = () => {
    setState((prev) => ({
      ...prev,
      currentAddress: null,
      isDialogOpen: true,
      districts: [], // Reset districts
      wards: [], // Reset wards
    }));
  };

  const handleEdit = async (addressId) => {
    const address = state.addresses.find((addr) => addr.id === addressId);
    if (!address) return;

    // Tải dữ liệu trước khi mở form
    try {
      await Promise.all([
        fetchDistricts(address.province),
        fetchWards(address.district),
      ]);
      setState((prev) => ({
        ...prev,
        currentAddress: address,
        isDialogOpen: true,
      }));
    } catch (error) {
      showNotification("Lỗi khi tải dữ liệu địa chỉ", "error");
      console.error("Error fetching address data:", error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const { province, district, ward, ...rest } = formData;
      const provinceObj = state.provinces.find(
        (p) => p.ProvinceName === province
      );
      const districtObj = state.districts.find(
        (d) => d.DistrictName === district
      );
      const wardObj = state.wards.find((w) => w.WardName === ward);

      // Kiểm tra dữ liệu trước khi gửi
      if (!provinceObj || !districtObj || !wardObj) {
        showNotification("Vui lòng chọn đầy đủ thông tin địa chỉ", "error");
        return;
      }

      // Map đúng field names theo API yêu cầu
      const apiData = {
        UserId: userId,
        ProviceId: provinceObj?.ProvinceID || "",
        DistrictId: districtObj?.DistrictID || "",
        WardCode: wardObj?.WardCode || "",
        ProviceName: province,
        DistrictName: district,
        WardName: ward,
        // Map các field từ form sang tên field API yêu cầu
        FullName: formData.recipientName, // recipientName -> FullName
        PhoneNumber: formData.phoneNumber, // phoneNumber -> PhoneNumber
        HomeNumber: formData.street, // street -> HomeNumber
        AddressType: formData.addressType, // addressType -> AddressType
        IsDefault: formData.isDefault, // isDefault -> IsDefault
      };

      console.log("Sending API data:", apiData); // Debug log

      const response = await (state.currentAddress
        ? addressService.updateAddress(state.currentAddress.id, apiData)
        : addressService.addNewAddress(apiData));

      console.log("API Response:", response); // Debug log

      // Kiểm tra response từ API
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.data?.success
      ) {
        showNotification(
          state.currentAddress
            ? "Cập nhật địa chỉ thành công"
            : "Thêm địa chỉ mới thành công",
          "success"
        );
        setState((prev) => ({ ...prev, isDialogOpen: false }));
        await fetchData(); // Reload data
      } else {
        // API trả về lỗi nhưng không throw exception
        throw new Error(response.data?.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("Error submitting address:", error);

      // Xử lý chi tiết các loại lỗi
      let errorMessage = state.currentAddress
        ? "Cập nhật địa chỉ thất bại"
        : "Thêm địa chỉ mới thất bại";

      if (error.response) {
        // Server trả về error response
        const responseData = error.response.data;
        if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseData?.data && Array.isArray(responseData.data)) {
          // Trường hợp có validation errors
          errorMessage = responseData.data.join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showNotification(errorMessage, "error");
    }
  };

  if (state.loading) return <LoadingSpinner message="Đang tải địa chỉ..." />;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#5e3a1e]">Địa chỉ của tôi</h3>
      <AddressManager
        addresses={state.addresses}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
      />
      <AddressFormPopup
        isOpen={state.isDialogOpen}
        onClose={() => setState((prev) => ({ ...prev, isDialogOpen: false }))}
        onSubmit={handleSubmit}
        initialData={state.currentAddress}
        provinces={state.provinces}
        districts={state.districts}
        wards={state.wards}
        onProvinceChange={fetchDistricts}
        onDistrictChange={fetchWards}
      />
      <ConfirmComponent />
    </div>
  );
}
