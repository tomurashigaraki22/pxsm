import axios from 'axios';

const API_URL = 'https://app.sizzle.ng/api/v1';
const API_KEY = '80N1Xb27bTOlDym3xytiXndLkmH0TjpE'; // Your API key

// Base function to make API requests
const makeRequest = async (params) => {
  const { action, ...data } = params;
  try {
    const response = await axios.post(API_URL, {
      params: {
        key: API_KEY,
        action: action,
        ...data,
      },
    });
    return response.data;
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
};

// Add Order
export const addOrder = (data) => makeRequest({ action: 'add', ...data });

// Get Order Status
export const getOrderStatus = (orderId) => makeRequest({ action: 'status', order: orderId });

// Get Multiple Order Status
export const getMultiOrderStatus = (orderIds) => makeRequest({ action: 'status', orders: orderIds.join(',') });

// Get All Services
export const getServices = () => makeRequest({ action: 'services' });

// Get User Balance
export const getBalance = () => makeRequest({ action: 'balance' });
