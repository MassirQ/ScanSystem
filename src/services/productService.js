import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';


export default {
    // Søg efter et produkt baseret på stregkode
    searchProduct: async (barcode) => {
        try {
            const response = await axios.get(`${API_BASE}/product/${barcode}`);
            return response.data; // Returner produktet direkte (ikke som array)
        } catch (error) {
            console.error('Fejl ved søgning efter produkt:', error);
            throw error;
        }
    },

    // Hent alle produkter
    getAllProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE}/products`);
            return response.data;
        } catch (error) {
            console.error('Fejl ved hentning af alle produkter:', error);
            throw error;
        }
    },

    // Opret et nyt produkt
    createProduct: async (productData) => {
        try {
            const response = await axios.post(`${API_BASE}/RegisterProducts`, productData);
            return response.data;
        } catch (error) {
            console.error('Fejl ved oprettelse af produkt:', error);
            throw error;
        }
    },

    // Opdater et eksisterende produkt
    updateProduct: async (barcode, productData) => {
        try {
            const response = await axios.put(`${API_BASE}/products/${barcode}`, productData);
            return response.data;
        } catch (error) {
            console.error('Fejl ved opdatering af produkt:', error);
            throw error;
        }
    },

    // Slet et produkt
    deleteProduct: async (barcode) => {
        try {
            const response = await axios.delete(`${API_BASE}/products/${barcode}`);
            return response.data;
        } catch (error) {
            console.error('Fejl ved sletning af produkt:', error);
            throw error;
        }
    }




};