import axiosInstance from '../axiosInstance';

const adminApi = {
    // Product APIs
    getProducts: () => axiosInstance.get('/api/products'),
    createProduct: (data) => axiosInstance.post('/api/products', data),
    updateProduct: (id, data) => axiosInstance.put(`/api/products/${id}`, data),
    deleteProduct: (id) => axiosInstance.delete(`/api/products/${id}`),

    // Order APIs
    getOrders: () => axiosInstance.get('/api/orders'),
    updateOrderStatus: (id, status) => axiosInstance.put(`/api/orders/${id}/status`, { status }),

    // Analytics APIs
    getSalesAnalytics: (period) => axiosInstance.get(`/api/analytics/sales?period=${period}`),

    // Message APIs
    getMessages: () => axiosInstance.get('/api/messages'),
    sendMessage: (data) => axiosInstance.post('/api/messages', data),

    // Profile APIs
    getProfile: () => axiosInstance.get('/api/auth/profile'),
    updateProfile: (data) => axiosInstance.put('/api/auth/profile', data),
};

export default adminApi;