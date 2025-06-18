import axios from 'axios';
import authService from './authService';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://backend-g1e.herogu.garageisep.com/api/me'
  : '/api/me';

const meService = {
  // Récupérer les infos de l'utilisateur courant
  getMe: async () => {
    const token = authService.getToken();
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  },

  // Mettre à jour les infos de l'utilisateur courant
  updateMe: async (data) => {
    const token = authService.getToken();
    try {
      const response = await axios.post(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }
};

export default meService; 