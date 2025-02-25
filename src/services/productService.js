// services/productService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

export default {
    searchProduct: async (barcode) => {
        const response = await axios.get(`${API_BASE}/products/${barcode}`);
        return response.data;
    },

    getAllProducts: async () => {
        const response = await axios.get(`${API_BASE}/products`);
        return response.data;
    },

    createProduct: async (productData) => {
        return axios.post(`${API_BASE}/products`, productData);
    },

    updateProduct: async (barcode, productData) => {
        return axios.put(`${API_BASE}/products/${barcode}`, productData);
    },

    deleteProduct: async (barcode) => {
        return axios.delete(`${API_BASE}/products/${barcode}`);
    }
};