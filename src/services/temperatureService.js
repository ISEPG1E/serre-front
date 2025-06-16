import axios from 'axios';

// En développement, on utilise le proxy défini dans package.json
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-g1e.herogu.garageisep.com/api'
  : '/api';

const temperatureService = {
    // Récupérer toutes les mesures de température
    getAllTemperatures: async () => {
        try {
            const response = await axios.get(`${API_URL}/temperature`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des températures:', error);
            throw error;
        }
    },

    // Récupérer la dernière mesure de température
    getLatestTemperature: async () => {
        try {
            const response = await axios.get(`${API_URL}/temperature/latest`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la dernière température:', error);
            throw error;
        }
    },

    // Insérer une nouvelle mesure de température
    insertTemperature: async (value) => {
        try {
            const response = await axios.post(`${API_URL}/temperature`, { val: value });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'insertion de la température:', error);
            throw error;
        }
    }
};

export default temperatureService; 