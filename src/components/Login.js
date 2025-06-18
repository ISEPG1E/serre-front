import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Login.css';

const Login = ({ setIsLoggedIn, setCurrentPage }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);
      try {
        const response = await authService.login(email, password);
        if (response.success) {
          setIsLoggedIn(true);
          setCurrentPage('dashboard');
          navigate('/dashboard');
        } else {
          setError(response.error || 'Email ou mot de passe incorrect');
        }
      } catch (err) {
        setError(err.message || 'Une erreur est survenue lors de la connexion');
      }
      setLoading(false);
    };

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '80vh',
        padding: '20px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '15px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ color: '#27ae60', margin: '0 0 10px 0' }}>🌱 Connexion</h1>
            <p style={{ color: '#666', margin: '0' }}>Accédez à votre serre connectée</p>
          </div>

          {error && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              color: '#c62828', 
              borderRadius: '4px', 
              marginBottom: '20px',
              border: '1px solid #ef5350'
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Email
              </label>
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '16px'
                }} 
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Mot de passe
              </label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=""
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  fontSize: '16px'
                }} 
                required
              />
            </div>
            
            <button 
              type="submit" 
              style={{ 
                width: '100%',
                padding: '12px', 
                backgroundColor: '#27ae60', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold'
              }}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/forgot-password')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#2196f3', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => navigate('/register')}
              style={{ 
                background: 'none', 
                border: '1px solid #2196f3', 
                color: '#2196f3', 
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Créer un compte
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => navigate('/')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#666', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  };

export default Login; 