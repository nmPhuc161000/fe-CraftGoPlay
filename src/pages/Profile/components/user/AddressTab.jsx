// AddressTab.jsx
import React, { useCallback } from 'react';
import { useNotification } from "../../../../contexts/NotificationContext";
import { useConfirm } from "../../../../components/ConfirmForm/ConfirmForm";
import { useAddressManagement } from "../../../../hooks/useAddressManagement";
import AddressManager from "../../../../components/common/AddressManager";
import AddressFormPopup from "../../../../components/common/AddressFormPopup";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";

export default function AddressTab({ userId }) {
  const { showNotification } = useNotification();
  const { confirm, ConfirmComponent } = useConfirm();

  const onError = useCallback((error) => {
    showNotification(error.message, 'error');
  }, [showNotification]);

  const onSuccess = useCallback((message) => {
    showNotification(message, 'success');
  }, [showNotification]);

  const {
    addresses,
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
  } = useAddressManagement(userId, {
    onError,
    onSuccess,
    confirmDelete: confirm,
  });

  if (loading) return <LoadingSpinner message="Đang tải địa chỉ..." />;

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
        onClose={closeDialog}
        onSubmit={handleSubmit}
        initialData={currentAddress}
        provinces={provinces}
        districts={districts}
        wards={wards}
        onProvinceChange={fetchDistricts}
        onDistrictChange={fetchWards}
        loadingLocations={loadingLocations}
      />
      <ConfirmComponent />
    </div>
  );
}