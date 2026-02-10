import api from './api';

const warehouseService = {
  // Get all warehouses (public)
  getWarehouses: async (filters = {}) => {
    const response = await api.get('/warehouses/', { params: filters });
    return response.data.warehouses;
  },

  // Get warehouse by ID (public)
  getWarehouseById: async (warehouseId) => {
    const response = await api.get(`/warehouses/${warehouseId}`);
    return response.data.warehouse;
  },
};

export default warehouseService;
