// hooks/useAddressManagement.js
import { useState, useEffect, useCallback } from "react";
import addressService from "../services/apis/addressApi";
import locationService from "../services/apis/locationApi";

export const useAddressManagement = (userId, options = {}) => {
  const {
    onError = (error) => console.error("Address Management Error:", error),
    onSuccess,
    confirmDelete,
    onAddressChanged, // Thêm callback mới
  } = options;

  const [state, setState] = useState({
    addresses: [],
    loading: true,
    provinces: [],
    districts: [],
    wards: [],
    isDialogOpen: false,
    currentAddress: null,
    loadingLocations: false,
  });

  const fetchAllData = useCallback(async () => {
    if (!userId) return; // Ngăn gọi khi userId không hợp lệ
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
      setState((prev) => ({ ...prev, loading: false }));
      onError(error);
    }
  }, [userId, onError]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const fetchDistricts = useCallback(
    async (provinceId) => {
      try {
        setState((prev) => ({
          ...prev,
          loadingLocations: true,
          districts: [], // Clear districts trước khi load mới
          wards: [], // Clear wards khi province thay đổi
        }));

        const response = await locationService.getDistrict(provinceId);
        setState((prev) => ({
          ...prev,
          districts: response.data || [],
          loadingLocations: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loadingLocations: false,
        }));
        onError(error);
      }
    },
    [onError]
  );

  const fetchWards = useCallback(
    async (districtId) => {
      try {
        setState((prev) => ({ ...prev, loadingLocations: true }));
        const response = await locationService.getWard(districtId);
        setState((prev) => ({
          ...prev,
          wards: response.data || [],
          loadingLocations: false,
        }));
      } catch (error) {
        setState((prev) => ({ ...prev, loadingLocations: false }));
        onError(error);
      }
    },
    [onError]
  );

  // Giữ nguyên các hàm handleAddNew, handleEdit, handleDelete, handleSetDefault, handleSubmit như trong mã cũ
  const handleAddNew = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isDialogOpen: true,
      currentAddress: null,
      districts: [],
      wards: [],
    }));
  }, []);

  const handleEdit = useCallback(
    async (addressId) => {
      const address = state.addresses.find((addr) => addr.id === addressId);
      if (!address) return;

      try {
        setState((prev) => ({ ...prev, loadingLocations: true }));

        // Load tỉnh/thành phố nếu chưa có
        if (state.provinces.length === 0) {
          const provincesRes = await locationService.getProvince();
          setState((prev) => ({ ...prev, provinces: provincesRes.data }));
        }

        // Tìm tỉnh từ ProviceId (theo BE của bạn)
        const province = state.provinces.find(
          (p) => p.ProvinceID === address.proviceId // Sửa thành proviceId theo BE
        );
        if (!province) {
          console.error("Province not found");
          return;
        }

        // Load quận/huyện
        const districtsRes = await locationService.getDistrict(
          address.proviceId
        ); // Sửa thành proviceId
        const district = districtsRes.data?.find(
          (d) => d.DistrictID === address.districtId
        );

        // Load phường/xã
        const wardsRes = await locationService.getWard(address.districtId);
        const ward = wardsRes.data?.find(
          (w) => w.WardCode === address.wardCode
        );

        setState((prev) => ({
          ...prev,
          currentAddress: {
            ...address,
            province: province.ProvinceName,
            provinceId: province.ProvinceID, // Sửa thành proviceId theo BE
            district: district?.DistrictName || "",
            districtId: district?.DistrictID || "",
            ward: ward?.WardName || "",
            wardCode: ward?.WardCode || "",
            recipientName: address.fullName,
            phoneNumber: address.phoneNumber,
            street: address.homeNumber,
            addressType: address.addressType || "Home",
            isDefault: address.isDefault || false,
          },
          districts: districtsRes.data || [],
          wards: wardsRes.data || [],
          isDialogOpen: true,
          loadingLocations: false,
        }));
      } catch (error) {
        setState((prev) => ({ ...prev, loadingLocations: false }));
        onError(error);
      }
    },
    [state.addresses, state.provinces, onError]
  );

  const handleDelete = useCallback(
    async (addressId) => {
      try {
        const confirmed = confirmDelete
          ? await confirmDelete({
              title: "Xóa địa chỉ",
              message: "Bạn chắc chắn muốn xóa địa chỉ này?",
              confirmText: "Xóa",
              cancelText: "Hủy",
              type: "danger",
            })
          : true;
        if (confirmed) {
          await addressService.deleteAddress(addressId);
          setState((prev) => ({
            ...prev,
            addresses: prev.addresses.filter((addr) => addr.id !== addressId),
          }));
          onSuccess?.("Đã xóa địa chỉ thành công");
        }
      } catch (error) {
        onError(error);
      }
    },
    [confirmDelete, onSuccess, onError]
  );

  const handleSetDefault = useCallback(
    async (addressId) => {
      try {
        await addressService.setDefaultAddress(addressId);
        setState((prev) => ({
          ...prev,
          addresses: prev.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === addressId,
          })),
        }));
        onSuccess?.("Đã đặt làm địa chỉ mặc định");
      } catch (error) {
        onError(error);
      }
    },
    [onSuccess, onError]
  );

  const handleSubmit = useCallback(
    async (formData) => {
      try {
        const { province, district, ward, ...rest } = formData;
        const provinceObj = state.provinces.find(
          (p) => p.ProvinceName === province
        );
        const districtObj = state.districts.find(
          (d) => d.DistrictName === district
        );
        const wardObj = state.wards.find((w) => w.WardName === ward);

        if (!provinceObj || !districtObj || !wardObj) {
          throw new Error("Vui lòng chọn đầy đủ thông tin địa chỉ");
        }

        const apiData = {
          UserId: userId,
          ProviceId: provinceObj.ProvinceID || formData.provinceId,
          DistrictId: districtObj.DistrictID,
          WardCode: wardObj.WardCode,
          ProviceName: province,
          DistrictName: district,
          WardName: ward,
          FullName: formData.recipientName,
          PhoneNumber: formData.phoneNumber,
          HomeNumber: formData.street,
          AddressType: formData.addressType,
          IsDefault: formData.isDefault,
        };

        const isUpdate = !!state.currentAddress;
        const response = isUpdate
          ? await addressService.updateAddress(state.currentAddress.id, apiData)
          : await addressService.addNewAddress(apiData);

        setState((prev) => ({ ...prev, isDialogOpen: false }));
        await fetchAllData();
        onSuccess?.(
          isUpdate
            ? "Cập nhật địa chỉ thành công"
            : "Thêm địa chỉ mới thành công"
        );

        // Gọi callback khi địa chỉ thay đổi
        if (onAddressChanged) {
          onAddressChanged();
        }

        return response.data;
      } catch (error) {
        onError(error);
        throw error;
      }
    },
    [
      userId,
      state.provinces,
      state.districts,
      state.wards,
      state.currentAddress,
      fetchAllData,
      onSuccess,
      onError,
      onAddressChanged, // Thêm dependency
    ]
  );

  const closeDialog = useCallback(() => {
    setState((prev) => ({ ...prev, isDialogOpen: false }));
  }, []);

  return {
    addresses: state.addresses,
    loading: state.loading,
    loadingLocations: state.loadingLocations,
    isDialogOpen: state.isDialogOpen,
    currentAddress: state.currentAddress,
    provinces: state.provinces,
    districts: state.districts,
    wards: state.wards,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSetDefault,
    handleSubmit,
    closeDialog,
    fetchDistricts,
    fetchWards,
  };
};
