// pages/profile/AddressTab.jsx
import React, { useState, useEffect } from "react";
import addressService from "../../../../services/apis/addressApi";
import { useNotification } from "../../../../contexts/NotificationContext";
import AddressManager from "../../../../components/common/AddressManager";
import AddressFormPopup from "../../../../components/common/AddressFormPopup";
import locationService from "../../../../services/apis/locationApi";
// import locationService from "../../../services/apis/locationApi"; // Đã comment

export default function AddressTab({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchAddresses();
    // fetchProvinces(); // Đã comment
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressService.getUserAddresses(userId);
      setAddresses(response.data?.data || []);
    } catch (error) {
      showNotification("Lỗi khi tải địa chỉ", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await locationService.getProvince();
      setProvinces(response.data || []);
    } catch (error) {
      console.error("Failed to fetch provinces", error);
    }
  };

  // Thay đổi các hàm fetchDistricts và fetchWards
  const fetchDistricts = async (provinceName) => {
    try {
      const province = provinces.find((p) => p.ProvinceName === provinceName);
      if (!province) return;

      const response = await locationService.getDistrict(province.ProvinceID);
      setDistricts(response.data || []);
      setWards([]);
    } catch (error) {
      console.error("Failed to fetch districts", error);
    }
  };

  const fetchWards = async (districtName) => {
    try {
      const district = districts.find((d) => d.DistrictName === districtName);
      if (!district) return;

      const response = await locationService.getWard(district.DistrictID);
      setWards(response.data || []);
    } catch (error) {
      console.error("Failed to fetch wards", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
    fetchDistricts();
    fetchWards();
  }, []);

  const handleDelete = async (addressId) => {
    if (window.confirm("Bạn chắc chắn muốn xóa địa chỉ này?")) {
      try {
        await addressService.deleteAddress(addressId);
        setAddresses(addresses.filter((addr) => addr.id !== addressId));
        showNotification("Xóa địa chỉ thành công", "success");
      } catch (error) {
        showNotification("Xóa địa chỉ thất bại", "error");
        console.error(error);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await addressService.setDefaultAddress(addressId);
      setAddresses(
        addresses.map((addr) => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
      showNotification("Đã đặt làm địa chỉ mặc định", "success");
    } catch (error) {
      showNotification("Thao tác thất bại", "error");
      console.error(error);
    }
  };

  const handleAddNew = () => {
    setCurrentAddress(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (addressId) => {
    const address = addresses.find((addr) => addr.id === addressId);
    if (address) {
      setCurrentAddress(address);
      /* Đã comment phần fetch districts và wards
      fetchDistricts(address.province).then(() => {
        fetchWards(address.district);
      });
      */
      setIsDialogOpen(true);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentAddress) {
        await addressService.updateAddress(currentAddress.id, formData);
        showNotification("Cập nhật địa chỉ thành công", "success");
      } else {
        await addressService.addAddress({ ...formData, userId });
        showNotification("Thêm địa chỉ mới thành công", "success");
      }
      setIsDialogOpen(false);
      fetchAddresses();
    } catch (error) {
      showNotification(
        currentAddress
          ? "Cập nhật địa chỉ thất bại"
          : "Thêm địa chỉ mới thất bại",
        "error"
      );
      console.error(error);
    }
  };

  // Đã comment các hàm xử lý location
  const handleProvinceChange = (provinceName) => {
    fetchDistricts(provinceName); // Đã comment
  };

  const handleDistrictChange = (districtName) => {
    fetchWards(districtName); // Đã comment
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5e3a1e]"></div>
        <p className="mt-2">Đang tải đại chỉ của bạn...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#5e3a1e]">Địa chỉ của tôi</h3>

      <AddressManager
        addresses={addresses}
        onDelete={handleDelete}
        onSetDefault={handleSetDefault}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
      />

      <AddressFormPopup
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={currentAddress}
        provinces={provinces} // Hiện đang là mảng rỗng do đã comment service
        districts={districts} // Hiện đang là mảng rỗng
        wards={wards} // Hiện đang là mảng rỗng
        onProvinceChange={handleProvinceChange}
        onDistrictChange={handleDistrictChange}
      />
    </div>
  );
}
