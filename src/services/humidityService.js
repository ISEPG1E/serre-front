import axios from 'axios';

// En développement, on utilise le proxy défini dans package.json
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-g1e.herogu.garageisep.com/api'
  : '/api';

const humidityService = {
    // Récupérer toutes les mesures d'humidité
    getAllHumidity: async () => {
        try {
            const response = await axios.get(`${API_URL}/humidity`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des mesures d\'humidité:', error);
            throw error;
        }
    },

    // Récupérer la dernière mesure d'humidité
    getLatestHumidity: async () => {
        try {
            const response = await axios.get(`${API_URL}/humidity/latest`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la dernière mesure d\'humidité:', error);
            throw error;
        }
    },

    // Insérer une nouvelle mesure d'humidité
    insertHumidity: async (value) => {
        try {
            const response = await axios.post(`${API_URL}/humidity`, { val: value });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'insertion de la mesure d\'humidité:', error);
            throw error;
        }
    }
};

export default humidityService; 