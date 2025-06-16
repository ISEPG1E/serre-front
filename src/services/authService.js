import axios from 'axios';

// En développement, on utilise le proxy défini dans package.json
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-g1e.herogu.garageisep.com/api'
  : '/api';

const authService = {
    login: async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username,
                password
            });
            
            if (response.data.success) {
                // Stocker le token dans le localStorage
                localStorage.setItem('token', response.data.data.token);
                return response.data;
            }
            throw new Error(response.data.error || 'Login failed');
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    }
};

export default authService; 