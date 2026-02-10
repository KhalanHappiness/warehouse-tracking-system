import api from './api';

const trackingService = {
  // Track shipment by tracking number (public)
  trackShipment: async (trackingNumber) => {
    const response = await api.get(`/tracking/${trackingNumber}`);
    return response.data.shipment;
  },

  // Search for tracking (public)
  searchTracking: async (trackingNumber) => {
    const response = await api.post('/tracking/search', { tracking_number: trackingNumber });
    return response.data.shipment;
  },

  // Get user's shipments (protected)
  getMyShipments: async (page = 1, perPage = 20, status = null) => {
    const params = { page, per_page: perPage };
    if (status) params.status = status;
    
    const response = await api.get('/tracking/my-shipments', { params });
    return response.data;
  },

  // Get shipment details (protected)
  getShipmentDetails: async (shipmentId) => {
    const response = await api.get(`/tracking/shipment/${shipmentId}`);
    return response.data.shipment;
  },
};

export default trackingService;
