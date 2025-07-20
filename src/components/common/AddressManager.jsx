import React, { memo } from 'react';
import { FiEdit, FiTrash2, FiCheck, FiPlus, FiHome, FiBriefcase, FiMapPin } from 'react-icons/fi';
import PropTypes from 'prop-types';

const AddressTypeIcon = ({ type }) => {
  const iconMap = {
    home: <FiHome className="w-4 h-4" />,
    office: <FiBriefcase className="w-4 h-4" />,
    other: <FiMapPin className="w-4 h-4" />,
  };
  return iconMap[type.toLowerCase()] || iconMap.other;
};

const AddressCard = ({ address, onDelete, onSetDefault, onEdit, onSelect, selectedAddressId }) => {
  const isSelected = selectedAddressId === address.id;
  const isDefault = address.isDefault;

  return (
    <div
      className={`relative border rounded-xl p-5 ${
        isDefault ? 'border-2 border-[#5e3a1e] bg-[#f9f5f1]' : 'border-gray-200 hover:border-gray-300'
      } ${isSelected ? 'ring-2 ring-[#5e3a1e] shadow-md' : 'hover:shadow-md'}`}
      onClick={() => onSelect?.(address.id)}
    >
      {isDefault && (
        <div className="absolute top-3 right-3 bg-[#5e3a1e] text-white text-xs px-2.5 py-1 rounded-full flex items-center">
          <FiCheck className="mr-1 w-3 h-3" />
          Mặc định
        </div>
      )}
      <div className="flex items-start mb-3">
        <div className="p-2 bg-[#eee5dd] rounded-lg text-[#5e3a1e] mr-3">
          <AddressTypeIcon type={address.type || 'home'} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-900">{address.fullName}</h4>
          <p className="text-gray-600 text-sm">{address.phoneNumber}</p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-3 text-sm">
        <div className="flex items-start text-gray-700">
          <FiMapPin className="flex-shrink-0 mt-0.5 mr-2 text-gray-500" />
          <p className="break-words">
            {address.fullAddress.split(', ').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
        {address.note && (
          <div className="mt-2 flex items-start text-gray-500">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Ghi chú:</span>
            <span className="ml-2 text-xs">{address.note}</span>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {onSetDefault && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault(address.id);
            }}
            disabled={isDefault}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
              isDefault ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FiCheck className="w-4 h-4" />
            Đặt mặc định
          </button>
        )}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address.id);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
          >
            <FiEdit className="w-4 h-4" />
            Chỉnh sửa
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
          >
            <FiTrash2 className="w-4 h-4" />
            Xóa
          </button>
        )}
      </div>
    </div>
  );
};

const AddressManager = ({
  addresses = [],
  onDelete,
  onSetDefault,
  onAddNew,
  onEdit,
  showAddButton = true,
  onSelect,
  selectedAddressId,
}) => (
  <div className="space-y-6">
    {showAddButton && (
      <button
        onClick={onAddNew}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#5e3a1e] text-white rounded-lg hover:bg-[#7a4b28] shadow-sm"
      >
        <FiPlus className="w-5 h-5" />
        <span className="font-medium">Thêm địa chỉ mới</span>
      </button>
    )}
    {addresses.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <FiMapPin className="mx-auto w-8 h-8 text-gray-400" />
        <p className="mt-2 text-gray-500">Bạn chưa có địa chỉ nào</p>
        <p className="text-sm text-gray-400 mt-1">Thêm địa chỉ để bắt đầu sử dụng</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onDelete={onDelete}
            onSetDefault={onSetDefault}
            onEdit={onEdit}
            onSelect={onSelect}
            selectedAddressId={selectedAddressId}
          />
        ))}
      </div>
    )}
  </div>
);

AddressManager.propTypes = {
  addresses: PropTypes.array,
  onDelete: PropTypes.func,
  onSetDefault: PropTypes.func,
  onAddNew: PropTypes.func,
  onEdit: PropTypes.func,
  showAddButton: PropTypes.bool,
  onSelect: PropTypes.func,
  selectedAddressId: PropTypes.string,
};

export default memo(AddressManager);