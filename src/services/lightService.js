import axios from 'axios';

// En développement, on utilise le proxy défini dans package.json
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://backend-g1e.herogu.garageisep.com/api'
  : '/api';

const lightService = {
    // Récupérer toutes les mesures de luminosité
    getAllLight: async () => {
        try {
            const response = await axios.get(`${API_URL}/light`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des mesures de luminosité:', error);
            throw error;
        }
    },

    // Récupérer la dernière mesure de luminosité
    getLatestLight: async () => {
        try {
            const response = await axios.get(`${API_URL}/light/latest`);
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération de la dernière mesure de luminosité:', error);
            throw error;
        }
    },

    // Insérer une nouvelle mesure de luminosité
    insertLight: async (value) => {
        try {
            const response = await axios.post(`${API_URL}/light`, { val: value });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'insertion de la mesure de luminosité:', error);
            throw error;
        }
    }
};

export default lightService; 