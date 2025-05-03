import axios from 'axios';

const API_URL = 'https://simplecrm-api.onrender.com';

// Create axios instance with base URL
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// API service methods
const apiService = {
    // Get all customers
    getAllCustomers: async () => {
        try {
            const response = await apiClient.get('/api/customers/');
            return response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
            throw error;
        }
    },

    // Get customer by ID
    getCustomerById: async (id) => {
        try {
            const response = await apiClient.get(`/api/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching customer ${id}:`, error);
            throw error;
        }
    },

    // Create new customer
    createCustomer: async (customerData) => {
        try {
            const response = await apiClient.post('/api/customers/', customerData);
            return response.data;
        } catch (error) {
            console.error('Error creating customer:', error);
            throw error;
        }
    },

    // Update customer
    updateCustomer: async (id, customerData) => {
        try {
            const response = await apiClient.put(`/api/customers/${id}`, customerData);
            return response.data;
        } catch (error) {
            console.error(`Error updating customer ${id}:`, error);
            throw error;
        }
    },

    // Delete customer
    deleteCustomer: async (id) => {
        try {
            const response = await apiClient.delete(`/api/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting customer ${id}:`, error);
            throw error;
        }
    }
};

export default apiService;