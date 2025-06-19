import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import '../styles/Login.css';

const Login = ({ setIsLoggedIn, setCurrentPage }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [weather, setWeather] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState(null);

    // Charger la météo de Paris au montage
    useEffect(() => {
      const fetchWeather = async () => {
        setWeatherLoading(true);
        setWeatherError(null);
        try {
          const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current_weather=true&timezone=Europe%2FParis');
          const data = await res.json();
          setWeather(data.current_weather);
        } catch (err) {
          setWeatherError('Erreur lors du chargement de la météo');
        } finally {
          setWeatherLoading(false);
        }
      };
      fetchWeather();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      
      if (!email || !password) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      try {
        const res = await authService.login(email, password);
        if (res.success) {
          setIsLoggedIn(true);
          setCurrentPage('dashboard');
          navigate('/dashboard');
        } else {
          setError(res.error || 'Erreur de connexion');
        }
      } catch (err) {
        setError('Erreur lors de la connexion');
      }
    };

    return (
      <>
        {/* Barre de navigation */}
        <nav style={{ 
          padding: '20px', 
           backgroundColor: '#f5f0e1', 
          color: '#333',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: '0', color: '#43512a' }}>🌱 Ma Serre Connectée</h2>
            <button 
              onClick={() => navigate('/')}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: 'transparent', 
                color: '#333', 
                border: '1px solid #ccc', 
                borderRadius: '4px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🏠 Accueil
            </button>
          </div>
        </nav>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          padding: '20px',
          backgroundColor: '#ecf0f1'
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
              <h1 style={{ color: '#43512a', margin: '0 0 10px 0' }}>🔐 Connexion</h1>
              <p style={{ color: '#666', margin: '0' }}>Connectez-vous à votre compte</p>
            </div>

            {/* Météo Paris */}
            <div style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>🌦️ Météo à Paris</h3>
              {weatherLoading ? (
                <span>Chargement...</span>
              ) : weatherError ? (
                <span style={{ color: 'red' }}>{weatherError}</span>
              ) : weather ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '1.5em' }}>{weather.weathercode === 0 ? '☀️' : weather.weathercode < 4 ? '⛅' : weather.weathercode < 7 ? '☁️' : weather.weathercode < 20 ? '🌧️' : '❓'}</span>
                  <span style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{weather.temperature}°C</span>
                </div>
              ) : null}
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
                  Username
                </label>
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Username"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '16px'
                  }} 
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
                  placeholder="Votre mot de passe"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px',
                    fontSize: '16px'
                  }} 
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
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </>
    );
  };

export default Login; 