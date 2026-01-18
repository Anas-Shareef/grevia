const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_BASE_URL = BASE_URL;
export const STORAGE_URL = `${BASE_URL.replace('/api', '')}/storage`;

export const api = {
    request: async (endpoint: string, options: RequestInit = {}): Promise<any> => {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...options.headers,
        };

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `API Error: ${response.statusText}`);
        }

        if (response.status === 204) return null;
        return response.json();
    },

    get: async (endpoint: string) => {
        return api.request(endpoint, {
            method: 'GET',
        });
    },

    post: async (endpoint: string, data: any) => {
        return api.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    put: async (endpoint: string, data: any) => {
        return api.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (endpoint: string) => {
        return api.request(endpoint, {
            method: 'DELETE',
        });
    },

    subscribe: async (data: { email: string; source: 'popup' | 'footer' | 'register' | 'auto' }) => {
        return api.post('/newsletter/subscribe', data);
    },

    updateProfile: async (data: any) => {
        return api.put('/profile', data);
    },

    changePassword: async (data: any) => {
        return api.put('/profile/password', data);
    },

    // Addresses
    getAddresses: async () => api.get('/customer/addresses'),
    createAddress: async (data: any) => api.post('/customer/addresses', data),
    updateAddress: async (id: number, data: any) => api.put(`/customer/addresses/${id}`, data),
    deleteAddress: async (id: number) => api.delete(`/customer/addresses/${id}`),

    // Reviews
    getReviews: async () => api.get('/my-reviews'),
    updateReview: async (id: number, data: any) => api.put(`/reviews/${id}`, data),
    deleteReview: async (id: number) => api.delete(`/reviews/${id}`),

    downloadInvoice: async (invoiceId: number) => {
        // Direct download URL from API domain
        // Remiving /api suffix if present to get root, or relying on Laravel route
        // Assuming route is /invoices/{id}/download on the backend root or api?
        // Usually file downloads are backend routes.
        // Let's assume it lives at {API_HOST}/invoices/{id}/download
        const host = BASE_URL.replace('/api', '');
        window.open(`${host}/invoices/${invoiceId}/download`, '_blank');
    }
};
