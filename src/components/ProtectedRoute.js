import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        // Redirige vers la page de login si non authentifié
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute; 