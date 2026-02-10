import api from './api';

const quoteService = {
  // Calculate shipping quote (public)
  calculateQuote: async (quoteData) => {
    const response = await api.post('/quotes/calculate', quoteData);
    return response.data;  // Changed from response.data.quote
  },

  // Get user's quotes (protected)
  getMyQuotes: async (page = 1, perPage = 20) => {
    const response = await api.get('/quotes/my-quotes', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  // Get shipping methods
  getShippingMethods: async () => {
    const response = await api.get('/shipping-methods/');
    return response.data;  // Changed from response.data.shipping_methods
  },
};

export default quoteService;