// hooks/useAddressManagement.js
import { useState, useEffect, useCallback } from 'react';
import addressService from '../services/apis/addressApi';
import locationService from '../services/apis/locationApi';

export const useAddressManagement = (userId, options = {}) => {
  const {
    onError = (error) => console.error('Address Management Error:', error),
    onSuccess,
    confirmDelete,
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

  const fetchDistricts = useCallback(async (provinceName) => {
    try {
      setState((prev) => ({ ...prev, loadingLocations: true }));
      const province = state.provinces.find((p) => p.ProvinceName === provinceName);
      if (!province) return;
      const response = await locationService.getDistrict(province.ProvinceID);
      setState((prev) => ({
        ...prev,
        districts: response.data || [],
        wards: [],
        loadingLocations: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loadingLocations: false }));
      onError(error);
    }
  }, [state.provinces, onError]);

  const fetchWards = useCallback(async (districtName) => {
    try {
      setState((prev) => ({ ...prev, loadingLocations: true }));
      const district = state.districts.find((d) => d.DistrictName === districtName);
      if (!district) return;
      const response = await locationService.getWard(district.DistrictID);
      setState((prev) => ({
        ...prev,
        wards: response.data || [],
        loadingLocations: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loadingLocations: false }));
      onError(error);
    }
  }, [state.districts, onError]);

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

  const handleEdit = useCallback(async (addressId) => {
    const address = state.addresses.find((addr) => addr.id === addressId);
    if (!address) return;
    try {
      setState((prev) => ({ ...prev, loadingLocations: true }));
      await fetchDistricts(address.province);
      if (address.district) {
        await fetchWards(address.district);
      }
      setState((prev) => ({
        ...prev,
        currentAddress: address,
        isDialogOpen: true,
        loadingLocations: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loadingLocations: false }));
      onError(error);
    }
  }, [state.addresses, fetchDistricts, fetchWards, onError]);

  const handleDelete = useCallback(async (addressId) => {
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
        onSuccess?.('Đã xóa địa chỉ thành công');
      }
    } catch (error) {
      onError(error);
    }
  }, [confirmDelete, onSuccess, onError]);

  const handleSetDefault = useCallback(async (addressId) => {
    try {
      await addressService.setDefaultAddress(addressId);
      setState((prev) => ({
        ...prev,
        addresses: prev.addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        })),
      }));
      onSuccess?.('Đã đặt làm địa chỉ mặc định');
    } catch (error) {
      onError(error);
    }
  }, [onSuccess, onError]);

  const handleSubmit = useCallback(async (formData) => {
    try {
      const { province, district, ward, ...rest } = formData;
      const provinceObj = state.provinces.find((p) => p.ProvinceName === province);
      const districtObj = state.districts.find((d) => d.DistrictName === district);
      const wardObj = state.wards.find((w) => w.WardName === ward);

      if (!provinceObj || !districtObj || !wardObj) {
        throw new Error('Vui lòng chọn đầy đủ thông tin địa chỉ');
      }

      const apiData = {
        UserId: userId,
        ProviceId: provinceObj.ProvinceID,
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
      onSuccess?.(isUpdate ? 'Cập nhật địa chỉ thành công' : 'Thêm địa chỉ mới thành công');
      return response.data;
    } catch (error) {
      onError(error);
      throw error;
    }
  }, [userId, state.provinces, state.districts, state.wards, state.currentAddress, fetchAllData, onSuccess, onError]);

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