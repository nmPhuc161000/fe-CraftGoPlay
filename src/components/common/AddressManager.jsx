// components/common/AddressManager.jsx
import React from 'react';
import { FiEdit, FiTrash2, FiCheck, FiPlus } from 'react-icons/fi';

const AddressManager = ({ 
  addresses, 
  onDelete, 
  onSetDefault, 
  onAddNew,
  onEdit,
  showAddButton = true,
  onSelect, // Dùng cho trang checkout
  selectedAddressId // Dùng cho trang checkout
}) => {
  return (
    <div className="space-y-4">
      {showAddButton && (
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#5e3a1e] text-white rounded hover:bg-[#7a4b28] mb-4"
        >
          <FiPlus className="w-4 h-4" />
          <span>Thêm địa chỉ mới</span>
        </button>
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Không có địa chỉ nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 relative cursor-pointer ${
                address.isDefault ? 'border-[#5e3a1e] border-2' : 'border-gray-200'
              } ${
                selectedAddressId === address.id ? 'ring-2 ring-[#5e3a1e]' : ''
              }`}
              onClick={() => onSelect && onSelect(address.id)}
            >
              {address.isDefault && (
                <div className="absolute top-2 right-2 bg-[#5e3a1e] text-white text-xs px-2 py-1 rounded">
                  Mặc định
                </div>
              )}

              <div className="flex justify-between">
                <h4 className="font-medium">{address.recipientName}</h4>
                <p className="text-gray-600">{address.phoneNumber}</p>
              </div>
              
              <p className="text-gray-600 mt-2">
                {address.street}, {address.ward}, {address.district}, {address.province}
              </p>

              <div className="mt-4 flex gap-2 flex-wrap">
                {onSetDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetDefault(address.id);
                    }}
                    disabled={address.isDefault}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
                      address.isDefault
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FiCheck className="w-4 h-4" />
                    <span>Mặc định</span>
                  </button>
                )}

                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(address.id);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-sm"
                  >
                    <FiEdit className="w-4 h-4" />
                    <span>Sửa</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(address.id);
                    }}
                    className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager;