// /src/pages/Checkout/components/UserAddress.jsx
import React, { useState, useCallback } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNotification } from "../../../contexts/NotificationContext";
import { useConfirm } from "../../../components/ConfirmForm/ConfirmForm";
import { useAddressManagement } from "../../../hooks/useAddressManagement";
import AddressManager from "../../../components/common/AddressManager";
import AddressFormPopup from "../../../components/common/AddressFormPopup";
import LoadingSpinner from "../../../components/common/LoadingSpinner";

const UserAddress = ({
  addresses,
  selectedAddressId,
  realUser,
  onDefaultAddressChanged,
}) => {
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const { showNotification } = useNotification();
  const { confirm, ConfirmComponent } = useConfirm();

  const onError = useCallback(
    (error) => {
      showNotification(error.message, "error");
    },
    [showNotification]
  );

  const onSuccess = useCallback(
    (message) => {
      showNotification(message, "success");
    },
    [showNotification]
  );

  const {
    addresses: managedAddresses,
    loading,
    loadingLocations,
    isDialogOpen,
    currentAddress,
    provinces,
    districts,
    wards,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSetDefault,
    handleSubmit,
    closeDialog,
    fetchDistricts,
    fetchWards,
  } = useAddressManagement(realUser.id, {
    onError,
    onSuccess,
    confirmDelete: confirm,
    onAddressChanged: onDefaultAddressChanged, // Thêm callback này
  });

  // Thêm hàm xử lý khi set default
  const handleSetDefaultAddress = async (addressId) => {
    await handleSetDefault(addressId);
    onDefaultAddressChanged?.(); // Gọi callback khi đặt mặc định thành công
  };

  // Hàm xử lý khi đóng popup
  const handleClosePopup = () => {
    setShowAddressPopup(false);
    // Gọi callback khi đóng popup (bao gồm cả khi thêm địa chỉ mới)
    if (onDefaultAddressChanged) {
      onDefaultAddressChanged();
    }
  };

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  return (
    <>
      <section className="bg-white rounded shadow-sm border border-gray-200 p-4 flex justify-between items-start gap-4 transition duration-300 hover:shadow-lg">
        <div>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 text-[#5e3a1e]">
            <FaMapMarkerAlt className="text-[#b28940]" />
            Địa chỉ nhận hàng
          </h2>
          {!selectedAddress ? (
            <p className="text-gray-500">Chưa có địa chỉ được chọn.</p>
          ) : (
            <div className="space-y-1 text-[15px] leading-relaxed">
              <p>
                <span className="font-medium">{selectedAddress.fullName}</span>{" "}
                | {selectedAddress.phoneNumber}
              </p>
              <p>{realUser?.email}</p>
              <p className="text-[#5e3a1e]">{selectedAddress.fullAddress}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowAddressPopup(true)}
          className="text-[15px] text-[#b28940] hover:text-[#a77a2d] font-medium hover:underline transition"
        >
          Thay đổi
        </button>
      </section>

      {/* Popup quản lý địa chỉ */}
      {showAddressPopup && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 h-full"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#5e3a1e]">
                  Chọn địa chỉ nhận hàng
                </h3>
                <button
                  onClick={handleClosePopup} // Sử dụng hàm mới
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {loading ? (
                <LoadingSpinner message="Đang tải địa chỉ..." />
              ) : (
                <div className="space-y-4">
                  <AddressManager
                    addresses={managedAddresses}
                    onDelete={handleDelete}
                    onSetDefault={handleSetDefaultAddress}
                    onAddNew={handleAddNew}
                    onEdit={handleEdit}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Popup thêm/sửa địa chỉ */}
      <AddressFormPopup
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        initialData={currentAddress}
        provinces={provinces}
        districts={districts}
        wards={wards}
        onProvinceChange={fetchDistricts}
        onDistrictChange={fetchWards}
        loadingLocations={loadingLocations}
        onAddressChanged={onDefaultAddressChanged} // Thêm prop này
      />

      <ConfirmComponent />
    </>
  );
};

export default UserAddress;