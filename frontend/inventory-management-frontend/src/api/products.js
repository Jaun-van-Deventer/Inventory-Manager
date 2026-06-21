import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export const getApiUrl = () => API_URL;
export const getProductsUrl = () => {
  if (!API_URL) {
    throw new Error('REACT_APP_API_URL is not configured');
  }

  return `${API_URL}/api/products`;
};

export const normalizeProductsResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.products)) {
    return data.products;
  }

  throw new Error('Products API did not return an array');
};

export const getProductsErrorMessage = (error) => {
  if (error.response) {
    const contentType = error.response.headers?.['content-type'] || '';
    const message = error.response.data?.message;

    if (message) {
      return message;
    }

    if (contentType.includes('text/html')) {
      return 'Products API returned HTML instead of JSON.';
    }

    return `Products API request failed with status ${error.response.status}.`;
  }

  return error.message || 'Unable to fetch products.';
};

export const fetchProducts = async () => {
  const response = await axios.get(getProductsUrl());
  return normalizeProductsResponse(response.data);
};
