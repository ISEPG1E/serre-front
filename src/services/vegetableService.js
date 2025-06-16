import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://backend-g1e.herogu.garageisep.com/api/vegetables' : '/api/vegetables';

const vegetableService = {
  // Récupérer tous les légumes
  getAllVegetables: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des légumes', error);
      return { success: false, error: error.message };
    }
  },

  // Ajouter un nouveau légume
  addVegetable: async (vegetable) => {
    try {
      const response = await axios.post(API_URL, vegetable);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout du légume', error);
      return { success: false, error: error.message };
    }
  }
};

export default vegetableService; 