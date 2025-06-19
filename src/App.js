import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import authService from './services/authService';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import SerreConditionMonitor from './components/SerreConditionMonitor';
import temperatureService from './services/temperatureService';
import humidityService from './services/humidityService';
import lightService from './services/lightService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import vegetableService from './services/vegetableService';
import meService from './services/meService';
import logo from './assets/logo.png';
import logo1 from './assets/logo1.png';
import greenhouseBg from './assets/greenhouse-bg.jpg';

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Composant de navigation
const Navigation = ({ isLoggedIn, currentPage, setCurrentPage, handleLogout, showMobileMenu, setShowMobileMenu }) => {
  const navigate = useNavigate();

  const getNavButtonStyle = (page) => ({
    padding: '10px 15px',
    backgroundColor: currentPage === page ? '#27ae60' : 'rgba(0,0,0,0.05)',
    color: currentPage === page ? 'white' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: currentPage === page ? 'bold' : 'normal'
  });

  const handleNavigation = (page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  return (
    <nav style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5dc', 
      color: '#333',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ height: '50px', display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo Serre Connectée" style={{ height: '120px', maxHeight: '120px', marginTop: '-10px' }} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{ 
              display: 'block',
              padding: '8px', 
              backgroundColor: 'transparent', 
              color: '#333', 
              border: '1px solid #333', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ☰
          </button>
          
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚪 Déconnexion
          </button>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={() => handleNavigation('dashboard')} style={getNavButtonStyle('dashboard')}>
          📊 Dashboard
        </button>
        <button onClick={() => handleNavigation('greenhouse')} style={getNavButtonStyle('greenhouse')}>
          🌱 Gestion de ma serre
        </button>
        <button onClick={() => handleNavigation('humidity')} style={getNavButtonStyle('humidity')}>
          💧 Humidité
        </button>
        <button onClick={() => handleNavigation('temperature')} style={getNavButtonStyle('temperature')}>
          🌡️ Température
        </button>
        <button onClick={() => handleNavigation('light')} style={getNavButtonStyle('light')}>
          ☀️ Luminosité
        </button>
        <button onClick={() => handleNavigation('profile')} style={getNavButtonStyle('profile')}>
          👤 Profil
        </button>
      </div>

      {showMobileMenu && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '20px',
          backgroundColor: '#43512a',
          borderRadius: '8px',
          padding: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          zIndex: 1000,
          minWidth: '200px'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', color: '#27ae60', fontWeight: 'bold' }}>
            ● Connecté
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => { handleNavigation('dashboard'); setShowMobileMenu(false); }}
              style={{ 
                padding: '10px', 
                backgroundColor: currentPage === 'dashboard' ? '#27ae60' : 'transparent',
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              📊 Dashboard
            </button>
            <button 
              onClick={() => { handleNavigation('greenhouse'); setShowMobileMenu(false); }}
              style={{ 
                padding: '10px', 
                backgroundColor: currentPage === 'greenhouse' ? '#27ae60' : 'transparent',
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🌱 Gestion de ma serre
            </button>
            <hr style={{ margin: '10px 0', border: '1px solid #555' }} />
            <button 
              onClick={() => { handleLogout(); setShowMobileMenu(false); }}
              style={{ 
                padding: '10px', 
                backgroundColor: '#e74c3c',
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              🚪 Déconnexion
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

// Composant de layout protégé
const ProtectedLayout = ({ children, isLoggedIn }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [draggedPlant, setDraggedPlant] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [temperatureData, setTemperatureData] = useState([]);
  const [latestTemperature, setLatestTemperature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [humidityData, setHumidityData] = useState([]);
  const [latestHumidity, setLatestHumidity] = useState(null);
  const [isHumidityLoading, setIsHumidityLoading] = useState(false);
  const [humidityError, setHumidityError] = useState(null);
  const [lightData, setLightData] = useState([]);
  const [latestLight, setLatestLight] = useState(null);
  const [isLightLoading, setIsLightLoading] = useState(false);
  const [lightError, setLightError] = useState(null);
  const [vegetables, setVegetables] = useState([]);
  const [newVegetable, setNewVegetable] = useState({ name: '', emoji: '', duration: '', average_water_consumption: '' });
  const [vegError, setVegError] = useState('');
  const [vegSuccess, setVegSuccess] = useState('');
  const [isVegLoading, setIsVegLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);
  const [valveOpen, setValveOpen] = useState(false);

  // État de la grille de la serre
  const [greenhouseGrid, setGreenhouseGrid] = useState(
    Array.from({ length: 40 }, (_, index) => {
      if (index < 8) return { name: 'Tomate', emoji: '🍅' };
      if (index >= 8 && index < 12) return { name: 'Salade', emoji: '🥬' };
      return null;
    })
  );

  // Fonction pour calculer la consommation d'eau totale de la serre
  const calculateWaterConsumption = () => {
    let totalConsumption = 0;
    const plantConsumption = {};

    greenhouseGrid.forEach((cell, index) => {
      if (cell) {
        // Chercher la plante correspondante dans les données de l'API
        const plantData = vegetables.find(veg => 
          veg.name.toLowerCase() === cell.name.toLowerCase() || 
          veg.emoji === cell.emoji
        );

        if (plantData && plantData.average_water_consumption) {
          const consumption = parseFloat(plantData.average_water_consumption);
          totalConsumption += consumption;
          
          // Stocker la consommation par plante pour l'affichage détaillé
          if (!plantConsumption[cell.name]) {
            plantConsumption[cell.name] = {
              count: 0,
              consumption: 0,
              emoji: cell.emoji
            };
          }
          plantConsumption[cell.name].count++;
          plantConsumption[cell.name].consumption += consumption;
        }
      }
    });

    return {
      total: totalConsumption,
      details: plantConsumption
    };
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const token = authService.getToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);


  // Fonction de déconnexion
  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // Fonctions de drag and drop
  const handleDragStart = (e, plant, fromGrid = false, gridIndex = null) => {
    setDraggedPlant({ ...plant, fromGrid, gridIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedPlant) return;

    const newGrid = [...greenhouseGrid];
    
    if (draggedPlant.fromGrid && draggedPlant.gridIndex !== null) {
      // Déplacer d'une case à une autre
      newGrid[draggedPlant.gridIndex] = null;
      newGrid[targetIndex] = { name: draggedPlant.name, emoji: draggedPlant.emoji };
    } else {
      // Ajouter une nouvelle plante
      newGrid[targetIndex] = { name: draggedPlant.name, emoji: draggedPlant.emoji };
    }
    
    setGreenhouseGrid(newGrid);
    setDraggedPlant(null);
  };

  const handleGridCellClick = (index) => {
    if (selectedPlant) {
      // Planter la plante sélectionnée
      const newGrid = [...greenhouseGrid];
      newGrid[index] = { name: selectedPlant.name, emoji: selectedPlant.emoji };
      setGreenhouseGrid(newGrid);
      setSelectedPlant(null);
    } else if (greenhouseGrid[index]) {
      // Supprimer la plante existante
      const newGrid = [...greenhouseGrid];
      newGrid[index] = null;
      setGreenhouseGrid(newGrid);
    }
  };

  // Composant graphique réutilisable
  const SensorChart = ({ title, data, color, unit, currentValue }) => (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
      <h3>{title}</h3>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'inline-block', padding: '20px', backgroundColor: color, borderRadius: '10px', color: 'white' }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Valeur actuelle</h4>
          <p style={{ fontSize: '36px', margin: '0', fontWeight: 'bold' }}>{currentValue}{unit}</p>
        </div>
      </div>
      
      <h4>📈 Évolution sur 24h</h4>
      <div style={{ position: 'relative', height: '300px', backgroundColor: '#f8f9fa', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
        {/* Grille de fond */}
        {[20, 40, 60, 80, 100].map(y => (
          <div key={y} style={{
            position: 'absolute',
            left: '0',
            right: '0',
            top: `${100 - y}%`,
            height: '1px',
            backgroundColor: '#e0e0e0'
          }}></div>
        ))}
        
        {/* Axe Y */}
        <div style={{ position: 'absolute', left: '10px', top: '10px', fontSize: '12px', color: '#666' }}>100</div>
        <div style={{ position: 'absolute', left: '10px', top: '25%', fontSize: '12px', color: '#666' }}>75</div>
        <div style={{ position: 'absolute', left: '10px', top: '50%', fontSize: '12px', color: '#666' }}>50</div>
        <div style={{ position: 'absolute', left: '10px', top: '75%', fontSize: '12px', color: '#666' }}>25</div>
        <div style={{ position: 'absolute', left: '10px', bottom: '10px', fontSize: '12px', color: '#666' }}>0</div>
        
        {/* Courbe des données */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%' }}>
          <polyline
            points={data}
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
          {/* Points de données */}
          {data.split(' ').map((point, index) => {
            const [x, y] = point.split(',').map(Number);
            return (
              <circle key={index} cx={x} cy={y} r="4" fill={color} />
            );
          })}
        </svg>
        
        {/* Axe X - Heures */}
        <div style={{ position: 'absolute', bottom: '5px', left: '10%', fontSize: '11px', color: '#666' }}>00:00</div>
        <div style={{ position: 'absolute', bottom: '5px', left: '30%', fontSize: '11px', color: '#666' }}>06:00</div>
        <div style={{ position: 'absolute', bottom: '5px', left: '50%', fontSize: '11px', color: '#666' }}>12:00</div>
        <div style={{ position: 'absolute', bottom: '5px', left: '70%', fontSize: '11px', color: '#666' }}>18:00</div>
        <div style={{ position: 'absolute', bottom: '5px', left: '90%', fontSize: '11px', color: '#666' }}>24:00</div>
      </div>

      {/* Statistiques */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginTop: '20px' }}>
        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Minimum</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>18{unit}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Maximum</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>28{unit}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>Moyenne</div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color }}>23{unit}</div>
        </div>
      </div>
    </div>
  );

  // PAGE D'ACCUEIL (avant connexion)
  const WelcomePage = () => {
    const navigate = useNavigate();

    return (
      <>
        <header style={{ 
          backgroundColor: '#f5f5dc', 
          color: '#333', 
          padding: '20px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
          
        }}>
          <h1 style={{ margin: '0', color: '#43512a' }}>🌱 Ma Serre Connectée</h1>
          <p style={{ margin: '10px 0 0 0', opacity: '0.8' }}>Système de surveillance intelligent</p>
        </header>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '80vh',
          textAlign: 'center',
           padding: '40px',
          position: 'relative',
          overflow: 'hidden'
        }}>

          {/* Image d'arrière-plan floue */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${greenhouseBg})`, // Vous devrez ajouter cette image dans le dossier public
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(0px)',
            opacity: 1,
            zIndex: 0
          }} />

          <div style={{ 
            backgroundColor: 'white', 
            padding: '60px 40px', 
            borderRadius: '15px', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            maxWidth: '500px',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              marginBottom: '20px'
            }}>
              <img 
                 src={logo1}  
                alt="Ma Serre Connectée" 
                style={{
                  maxWidth: '70%',
                  height: 'auto'
                }}
              />
            </div>
            <p style={{ 
              fontSize: '1.2em', 
              color: '#666', 
              margin: '0 0 30px 0',
              lineHeight: '1.6'
            }}>
              Surveillez et contrôlez votre serre intelligente en temps réel
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
              gap: '20px', 
              margin: '30px 0'
            }}>
              <div style={{ padding: '15px', backgroundColor: '#f5f0e1', borderRadius: '8px' }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>🌡️</div>
                <p style={{ margin: '0', fontSize: '0.9em', color: '#1976d2' }}>Température</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>💧</div>
                <p style={{ margin: '0', fontSize: '0.9em', color: '#388e3c' }}>Humidité</p>
              </div>
              <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
                <div style={{ fontSize: '2em', marginBottom: '5px' }}>☀️</div>
                <p style={{ margin: '0', fontSize: '0.9em', color: '#f57c00' }}>Luminosité</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/login')}
                style={{ 
                  padding: '15px 40px', 
                  fontSize: '1.1em',
                  backgroundColor: '#27ae60', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                🔐 Se connecter
              </button>
              <button 
                onClick={() => navigate('/register')}
                style={{ 
                  padding: '15px 40px', 
                  fontSize: '1.1em',
                  backgroundColor: '#3498db', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                📝 S'inscrire
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // PAGE DE CONNEXION
  
  // PAGE D'INSCRIPTION
  const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegisterSubmit = (e) => {
      e.preventDefault();
      setError('');
      
      if (!fullName || !email || !password || !confirmPassword) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }

      setIsLoggedIn(true);
      navigate('/dashboard');
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
            <h1 style={{ color: '#3498db', margin: '0 0 10px 0' }}>📝 Inscription</h1>
            <p style={{ color: '#666', margin: '0' }}>Créez votre compte</p>
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

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Nom complet
              </label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Votre nom"
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
                Email
              </label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
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
                placeholder="Minimum 6 caractères"
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
                Confirmer le mot de passe
              </label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
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
                backgroundColor: '#3498db', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              S'inscrire
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                background: 'none', 
                border: '1px solid #27ae60', 
                color: '#27ae60', 
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Déjà un compte ?
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
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

  // PAGE MOT DE PASSE OUBLIÉ
  const ForgotPasswordPage = () => {
    const navigate = useNavigate();

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
            <h1 style={{ color: '#2196f3', margin: '0 0 10px 0' }}>🔑 Récupération</h1>
            <p style={{ color: '#666', margin: '0' }}>Réinitialiser votre mot de passe</p>
          </div>

          <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' }}>
                Email
              </label>
              <input 
                type="email" 
                placeholder="votre.email@exemple.com"
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
                backgroundColor: '#2196f3', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Envoyer le lien
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#2196f3', 
                textDecoration: 'underline', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Retour à la connexion
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '10px' }}>
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

  // Fonction pour charger les données de température
  const loadTemperatureData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [allData, latestData] = await Promise.all([
        temperatureService.getAllTemperatures(),
        temperatureService.getLatestTemperature()
      ]);
      
      if (allData.success) {
        setTemperatureData(allData.data);
      }
      if (latestData.success) {
        setLatestTemperature(latestData.data);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données de température');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant et toutes les 30 secondes
  useEffect(() => {
    loadTemperatureData();
  }, []);

  // Fonction pour charger les données d'humidité
  const loadHumidityData = async () => {
    setIsHumidityLoading(true);
    setHumidityError(null);
    try {
      const [allData, latestData] = await Promise.all([
        humidityService.getAllHumidity(),
        humidityService.getLatestHumidity()
      ]);
      
      if (allData.success) {
        setHumidityData(allData.data);
      }
      if (latestData.success) {
        setLatestHumidity(latestData.data);
      }
    } catch (err) {
      setHumidityError('Erreur lors du chargement des données d\'humidité');
      console.error(err);
    } finally {
      setIsHumidityLoading(false);
    }
  };

  // Charger les données d'humidité au montage du composant et toutes les 30 secondes
  useEffect(() => {
    loadHumidityData();
  }, []);

  // Fonction pour charger les données de luminosité
  const loadLightData = async () => {
    setIsLightLoading(true);
    setLightError(null);
    try {
      const [allData, latestData] = await Promise.all([
        lightService.getAllLight(),
        lightService.getLatestLight()
      ]);
      
      if (allData.success) {
        setLightData(allData.data);
      }
      if (latestData.success) {
        setLatestLight(latestData.data);
      }
    } catch (err) {
      setLightError('Erreur lors du chargement des données de luminosité');
      console.error(err);
    } finally {
      setIsLightLoading(false);
    }
  };

  // Charger les données de luminosité au montage du composant et toutes les 30 secondes
  useEffect(() => {
    loadLightData();
  }, []);

  // Fonction pour charger les légumes
  const loadVegetables = async () => {
    setIsVegLoading(true);
    const res = await vegetableService.getAllVegetables();
    if (res.success) setVegetables(res.data);
    setIsVegLoading(false);
  };

  // Charger les légumes au montage
  useEffect(() => {
    loadVegetables();
  }, []);

  // Gérer l'ajout d'un légume
  const handleAddVegetable = async (e) => {
    e.preventDefault();
    setVegError(''); setVegSuccess('');
    if (!newVegetable.name || !newVegetable.emoji || !newVegetable.duration || !newVegetable.average_water_consumption) {
      setVegError('Tous les champs sont obligatoires');
      return;
    }
    const res = await vegetableService.addVegetable(newVegetable);
    if (res.success) {
      setVegSuccess('Légume ajouté !');
      setNewVegetable({ name: '', emoji: '', duration: '', average_water_consumption: '' });
      // Recharger la liste
      loadVegetables();
    } else {
      setVegError(res.error || "Erreur lors de l'ajout");
    }
  };

  // Charger la météo de Paris au montage du dashboard
  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      setWeatherError(null);
      try {
        // Utilisation de l'API Open-Meteo (pas besoin de clé)
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

  // Composant pour la page de la serre
  const GreenhousePage = () => {
    const [vegetables, setVegetables] = useState([]);
    const [newVegetable, setNewVegetable] = useState({ name: '', emoji: '', duration: '', average_water_consumption: '' });
    const [vegError, setVegError] = useState('');
    const [vegSuccess, setVegSuccess] = useState('');
    const [isVegLoading, setIsVegLoading] = useState(false);
    const [availablePlants, setAvailablePlants] = useState([]);
    const [isPlantsLoading, setIsPlantsLoading] = useState(false);
    const [plantsError, setPlantsError] = useState('');

    // Charger les légumes au montage
    useEffect(() => {
      const fetchVegetables = async () => {
        setIsVegLoading(true);
        const res = await vegetableService.getAllVegetables();
        if (res.success) setVegetables(res.data);
        setIsVegLoading(false);
      };
      fetchVegetables();
    }, []);

    // Charger les plantes disponibles au montage
    useEffect(() => {
      const fetchAvailablePlants = async () => {
        setIsPlantsLoading(true);
        setPlantsError('');
        try {
          const res = await vegetableService.getAllVegetables();
          if (res.success) {
            setAvailablePlants(res.data);
          } else {
            setPlantsError('Erreur lors du chargement des plantes');
          }
        } catch (err) {
          setPlantsError('Erreur lors du chargement des plantes');
        } finally {
          setIsPlantsLoading(false);
        }
      };
      fetchAvailablePlants();
    }, []);

    // Gérer l'ajout d'un légume
    const handleAddVegetable = async (e) => {
      e.preventDefault();
      setVegError(''); setVegSuccess('');
      if (!newVegetable.name || !newVegetable.emoji || !newVegetable.duration || !newVegetable.average_water_consumption) {
        setVegError('Tous les champs sont obligatoires');
        return;
      }
      const res = await vegetableService.addVegetable(newVegetable);
      if (res.success) {
        setVegSuccess('Légume ajouté !');
        setNewVegetable({ name: '', emoji: '', duration: '', average_water_consumption: '' });
        // Recharger la liste
        loadVegetables();
      } else {
        setVegError(res.error || "Erreur lors de l'ajout");
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>🌱 Gestion de ma serre</h2>
        <div style={{ marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Ajouter un légume</h3>
          <form onSubmit={handleAddVegetable} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="text" placeholder="Nom" value={newVegetable.name} onChange={e => setNewVegetable({ ...newVegetable, name: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="text" placeholder="Emoji" value={newVegetable.emoji} onChange={e => setNewVegetable({ ...newVegetable, emoji: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '60px' }} />
            <input type="text" placeholder="Durée (ex: 2-3 mois)" value={newVegetable.duration} onChange={e => setNewVegetable({ ...newVegetable, duration: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <input type="number" step="0.1" placeholder="Conso eau (L/j)" value={newVegetable.average_water_consumption} onChange={e => setNewVegetable({ ...newVegetable, average_water_consumption: e.target.value })} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }} />
            <button type="submit" style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ajouter</button>
          </form>
          {vegError && <div style={{ color: 'red', marginTop: '8px' }}>{vegError}</div>}
          {vegSuccess && <div style={{ color: 'green', marginTop: '8px' }}>{vegSuccess}</div>}
        </div>

        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Grille de la serre */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flex: '1', minWidth: '400px' }}>
            <h3>Disposition de votre serre (10x4 cases)</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Drag & Drop ou cliquez avec une plante sélectionnée pour planter. Cliquez sur une case plantée pour la vider.
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '4px', 
              maxWidth: '400px',
              margin: '0 auto',
              padding: '20px',
              backgroundColor: '#8B4513',
              borderRadius: '8px'
            }}>
              {greenhouseGrid.map((cell, index) => (
                <div 
                  key={index} 
                  onClick={() => handleGridCellClick(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: cell ? '#27ae60' : '#8FBC8F',
                    border: '2px solid #556B2F',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onMouseOver={(e) => {
                    if (!cell) e.target.style.backgroundColor = '#98FB98';
                  }}
                  onMouseOut={(e) => {
                    if (!cell) e.target.style.backgroundColor = '#8FBC8F';
                  }}
                >
                  {cell && (
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, cell, true, index)}
                      style={{ cursor: 'move' }}
                    >
                      {cell.emoji}
                    </div>
                  )}
                  {!cell && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#556B2F', 
                      fontWeight: 'bold' 
                    }}>
                      +
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '20px', justifyContent: 'center', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#27ae60', borderRadius: '4px' }}></div>
                <span>Case plantée</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '20px', height: '20px', backgroundColor: '#8FBC8F', borderRadius: '4px' }}></div>
                <span>Case vide</span>
              </div>
            </div>
            {/* Statistiques */}
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4>📊 Statistiques de la serre</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                    {greenhouseGrid.filter(cell => cell).length}/40
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Cases occupées</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
                    {Math.round((greenhouseGrid.filter(cell => cell).length / 40) * 100)}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Taux d'occupation</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                    {40 - greenhouseGrid.filter(cell => cell).length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Cases libres</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'blue' }}>
                    {calculateWaterConsumption().total.toFixed(1)}L
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Consommation d'eau</div>
                </div>
              </div>
            </div>
          </div>
          {/* Sélection des plantes */}
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '280px', flexShrink: 0 }}>
            <h3>🌱 Plantes disponibles</h3>
            <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
              Glissez-déposez ou cliquez pour sélectionner
            </p>
            {isPlantsLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>Chargement des plantes...</div>
            ) : plantsError ? (
              <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
                {plantsError}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {availablePlants.map((plant, index) => (
                  <div 
                    key={plant.id} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, plant)}
                    onClick={() => setSelectedPlant(selectedPlant?.name === plant.name ? null : plant)}
                    style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px', 
                      border: `2px solid ${selectedPlant?.name === plant.name ? '#27ae60' : '#e0e0e0'}`, 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backgroundColor: selectedPlant?.name === plant.name ? '#e8f5e8' : 'white'
                    }}
                    onMouseOver={(e) => {
                      if (selectedPlant?.name !== plant.name) {
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedPlant?.name !== plant.name) {
                        e.currentTarget.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{ fontSize: '32px', flexShrink: 0 }}>{plant.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '2px' }}>{plant.name}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>{plant.duration}</div>
                      <div style={{ fontSize: '11px', color: '#888' }}>💧 {plant.average_water_consumption} L/j</div>
                    </div>
                    {selectedPlant?.name === plant.name && (
                      <div style={{ color: '#27ae60', fontSize: '16px' }}>✓</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {selectedPlant && (
              <div style={{ 
                marginTop: '15px',
                padding: '12px', 
                backgroundColor: '#e8f5e8', 
                borderRadius: '6px', 
                textAlign: 'center',
                border: '1px solid #27ae60',
                fontSize: '14px'
              }}>
                <strong>{selectedPlant.emoji} {selectedPlant.name}</strong><br />
                <span style={{ color: '#666' }}>Cliquez sur une case pour planter</span>
              </div>
            )}
            <div style={{ 
              marginTop: '20px', 
              padding: '12px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '6px',
              fontSize: '12px',
              color: '#666'
            }}>
              <strong>💡 Instructions :</strong><br />
              • Glissez-déposez dans la serre<br />
              • Ou cliquez puis cliquez sur une case<br />
              • Cliquez sur une plante pour la retirer
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modifier le rendu du dashboard
  const renderDashboard = () => {
    return (
      <div style={{ padding: '20px' }}>
        <h2>📊 Tableau de bord</h2>

        {/* Météo Paris */}
        <div style={{ marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h3 style={{ margin: 0 }}>🌦️ Météo à Paris</h3>
          {weatherLoading ? (
            <span>Chargement...</span>
          ) : weatherError ? (
            <span style={{ color: 'red' }}>{weatherError}</span>
          ) : weather ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ fontSize: '2em' }}>{weather.weathercode === 0 ? '☀️' : weather.weathercode < 4 ? '⛅' : weather.weathercode < 7 ? '☁️' : weather.weathercode < 20 ? '🌧️' : '❓'}</span>
              <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{weather.temperature}°C</span>
              <span style={{ color: '#666' }}>Vent : {weather.windspeed} km/h</span>
            </div>
          ) : null}
        </div>

         {/* Afficheur de condition de la serre */}
        <SerreConditionMonitor 
          temperature={latestTemperature?.val}
          humidity={latestHumidity?.val}
          light={latestLight?.val}
        />
        

        {/* Cartes des dernières mesures */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Carte de température */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#1976d2', marginBottom: '15px' }}>🌡️ Température</h3>
            {latestTemperature ? (
              <>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>
                  {latestTemperature.val}°C
                </p>
                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>
                  Dernière mise à jour : {new Date(latestTemperature.created_at).toLocaleString()}
                </p>
              </>
            ) : (
              <p>Chargement...</p>
            )}
          </div>

          {/* Carte d'humidité */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#2196f3', marginBottom: '15px' }}>💧 Humidité</h3>
            {latestHumidity ? (
              <>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>
                  {latestHumidity.val}%
                </p>
                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>
                  Dernière mise à jour : {new Date(latestHumidity.created_at).toLocaleString()}
                </p>
              </>
            ) : (
              <p>Chargement...</p>
            )}
          </div>

          {/* Carte de luminosité */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#ffc107', marginBottom: '15px' }}>☀️ Luminosité</h3>
            {latestLight ? (
              <>
                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>
                  {latestLight.val} lux
                </p>
                <p style={{ color: '#666', fontSize: '14px', margin: '5px 0 0 0' }}>
                  Dernière mise à jour : {new Date(latestLight.created_at).toLocaleString()}
                </p>
              </>
            ) : (
              <p>Chargement...</p>
            )}
          </div>

          {/* Carte vanne d'eau */}
          <WaterValveCard />
        </div>

        {/* Graphiques des dernières 24h */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '30px',
          overflowX: 'auto'
        }}>
          <h3>Évolution sur 24h</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))', 
            gap: '20px',
            minWidth: '900px',
            padding: '10px'
          }}>
            {/* Graphique de température */}
            <div style={{ height: '250px' }}>
              <h4 style={{ color: '#1976d2', marginBottom: '10px', textAlign: 'center', fontSize: '14px' }}>🌡️ Température</h4>
              <Line 
                data={{
                  labels: temperatureData.map(measure => 
                    new Date(measure.created_at).toLocaleTimeString()
                  ),
                  datasets: [
                    {
                      label: 'Température (°C)',
                      data: temperatureData.map(measure => measure.val),
                      borderColor: '#1976d2',
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      title: {
                        display: true,
                        text: 'Température (°C)',
                        font: {
                          size: 12
                        }
                      },
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Heure',
                        font: {
                          size: 12
                        }
                      },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </div>

            {/* Graphique d'humidité */}
            <div style={{ height: '250px' }}>
              <h4 style={{ color: '#2196f3', marginBottom: '10px', textAlign: 'center', fontSize: '14px' }}>💧 Humidité</h4>
              <Line 
                data={{
                  labels: humidityData.map(measure => 
                    new Date(measure.created_at).toLocaleTimeString()
                  ),
                  datasets: [
                    {
                      label: 'Humidité (%)',
                      data: humidityData.map(measure => measure.val),
                      borderColor: '#2196f3',
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      title: {
                        display: true,
                        text: 'Humidité (%)',
                        font: {
                          size: 12
                        }
                      },
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Heure',
                        font: {
                          size: 12
                        }
                      },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </div>

            {/* Graphique de luminosité */}
            <div style={{ height: '250px' }}>
              <h4 style={{ color: '#ffc107', marginBottom: '10px', textAlign: 'center', fontSize: '14px' }}>☀️ Luminosité</h4>
              <Line 
                data={{
                  labels: lightData.map(measure => 
                    new Date(measure.created_at).toLocaleTimeString()
                  ),
                  datasets: [
                    {
                      label: 'Luminosité (lux)',
                      data: lightData.map(measure => measure.val),
                      borderColor: '#ffc107',
                      backgroundColor: 'rgba(255, 193, 7, 0.1)',
                      tension: 0.4,
                      fill: true
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      title: {
                        display: true,
                        text: 'Luminosité (lux)',
                        font: {
                          size: 12
                        }
                      },
                      ticks: {
                        font: {
                          size: 11
                        }
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Heure',
                        font: {
                          size: 12
                        }
                      },
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45,
                        font: {
                          size: 11
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* État de la serre */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>État de la serre</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px',
            marginTop: '15px'
          }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 10px 0' }}>🌱 Plantes</h4>
              <p style={{ margin: '0' }}>{greenhouseGrid.filter(cell => cell !== null).length} plantes en culture</p>
                </div>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 10px 0' }}>📅 Prochaine récolte</h4>
              <p style={{ margin: '0' }}>Dans 2 semaines</p>
                </div>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 10px 0' }}>💧 Prochain arrosage</h4>
              <p style={{ margin: '0' }}>Dans 3 heures</p>
                </div>
              </div>
            </div>
          </div>
        );
  };

  // PAGES PROTÉGÉES (après connexion uniquement)
  const renderProtectedPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'greenhouse':
        return <GreenhousePage />;
      case 'profile':
        return <ProfilePage />;
      case 'humidity':
        return renderHumidityPage();
      case 'temperature':
        return renderTemperaturePage();
      case 'light':
        return renderLightPage();
      default:
        return renderDashboard();
    }
  };

  const DataTable = ({ data, title, unit, icon }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const itemsPerPage = 10;

    // Filtrer les données par date
    const filteredData = data.filter(measure => {
      if (!startDate && !endDate) return true;
      const measureDate = new Date(measure.created_at);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      
      if (start && end) {
        return measureDate >= start && measureDate <= end;
      } else if (start) {
        return measureDate >= start;
      } else if (end) {
        return measureDate <= end;
      }
      return true;
    });

    // Trier les données du plus récent au plus ancien
    const sortedData = [...filteredData].sort((a, b) => 
      new Date(b.created_at) - new Date(a.created_at)
    );

    // Calculer les données pour la page courante
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const latestMeasure = data[0];

    // Préparer les données pour le graphique
    const chartData = {
      labels: data.map(measure => 
        new Date(measure.created_at).toLocaleTimeString()
      ),
      datasets: [
        {
          label: `${title} (${unit})`,
          data: data.map(measure => measure.val),
          borderColor: '#1976d2',
          backgroundColor: 'rgba(25, 118, 210, 0.1)',
          tension: 0.4,
          fill: true
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: `Évolution de ${title.toLowerCase()}`
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: `${title} (${unit})`
          }
        },
        x: {
          title: {
            display: true,
            text: 'Heure'
          }
        }
      }
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>{icon} {title}</h2>
        
        {latestMeasure && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>Dernière mesure</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {latestMeasure.val}{unit}
            </p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Mesuré le {new Date(latestMeasure.created_at).toLocaleString()}
            </p>
          </div>
        )}

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h3>Graphique</h3>
          <div style={{ height: '400px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3>Historique des mesures</h3>
          
          {/* Filtres de date */}
          <div style={{ 
            marginBottom: '20px',
            display: 'flex',
            gap: '15px',
            alignItems: 'center'
          }}>
            <div>
              <label style={{ marginRight: '10px', fontSize: '14px' }}>Du:</label>
              <input 
                type="datetime-local" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ 
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div>
              <label style={{ marginRight: '10px', fontSize: '14px' }}>Au:</label>
              <input 
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ 
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
          </div>
          <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setCurrentPage(1);
              }}
            style={{
                padding: '8px 16px',
                backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Réinitialiser
          </button>
        </div>

          {/* Tableau des données */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              marginBottom: '20px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Date et heure</th>
                  <th style={{ padding: '12px', textAlign: 'right', borderBottom: '2px solid #ddd' }}>{title} ({unit})</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((measure, index) => (
                  <tr key={index} style={{ 
                    backgroundColor: index % 2 === 0 ? 'white' : '#f9f9f9'
                  }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                      {new Date(measure.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                      {measure.val}{unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 1 ? '#ddd' : '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'default' : 'pointer'
              }}
            >
              Précédent
            </button>
            <span style={{ fontSize: '14px' }}>
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === totalPages ? '#ddd' : '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === totalPages ? 'default' : 'pointer'
              }}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderTemperaturePage = () => {
    return <DataTable 
      data={temperatureData}
      title="Température"
      unit="°C"
      icon="🌡️"
    />;
  };

  const renderHumidityPage = () => {
    return <DataTable 
      data={humidityData}
      title="Humidité"
      unit="%"
      icon="💧"
    />;
  };

  // Ajouter le rendu de la page de luminosité
  const renderLightPage = () => {
    return <DataTable 
      data={lightData}
      title="Luminosité"
      unit="lux"
      icon="☀️"
    />;
  };

  // Composant pour la page de profil utilisateur
  const ProfilePage = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [initialFullName, setInitialFullName] = useState('');
    const [initialEmail, setInitialEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
      let mounted = true;
      setLoading(true);
      meService.getMe().then(res => {
        if (mounted) {
          if (res.success) {
            setFullName(res.data.full_name);
            setEmail(res.data.email);
            setInitialFullName(res.data.full_name);
            setInitialEmail(res.data.email);
            setError('');
          } else {
            setError(res.error || 'Erreur lors du chargement du profil');
          }
          setLoading(false);
        }
      });
      return () => { mounted = false; };
    }, []);

    const handleSave = async (e) => {
      e.preventDefault();
      setSuccess('');
      setError('');
      setSaving(true);
      // Toujours envoyer l'email (obligatoire côté backend)
      const data = { email };
      if (fullName !== initialFullName) data.full_name = fullName;
      // Si rien n'a changé, ne pas envoyer
      if (fullName === initialFullName && email === initialEmail) {
        setSaving(false);
        return;
      }
      const res = await meService.updateMe(data);
      if (res.success) {
        setSuccess('Profil mis à jour !');
        setInitialFullName(fullName);
        setInitialEmail(email);
      } else {
        setError(res.error || 'Erreur lors de la mise à jour');
      }
      setSaving(false);
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>👤 Profil utilisateur</h2>
        <div style={{ maxWidth: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>📋 Informations personnelles</h3>
          {loading ? (
            <div>Chargement...</div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nom complet</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
              </div>
              <div>
                <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
              </div>
              <button
                type="submit"
                disabled={saving || (fullName === initialFullName && email === initialEmail)}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  backgroundColor: saving || (fullName === initialFullName && email === initialEmail) ? '#aaa' : '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: saving || (fullName === initialFullName && email === initialEmail) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
              </button>
              {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
              {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
            </form>
          )}
        </div>
      </div>
    );
  };

  const WaterValveCard = () => (
    <div style={{
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '180px',
      minWidth: '220px'
    }}>
      <h3 style={{ color: '#4caf50', marginBottom: '15px' }}>🚰 Vanne d'eau</h3>
      <div style={{ fontSize: '2.5em', marginBottom: '10px' }}>{valveOpen ? '💧' : '🚫'}</div>
      <div style={{
        color: valveOpen ? '#4caf50' : '#e74c3c',
        fontWeight: 'bold',
        fontSize: '1.2em',
        marginBottom: '15px'
      }}>
        {valveOpen ? 'Ouverte' : 'Fermée'}
      </div>
      <button
        onClick={() => setValveOpen(v => !v)}
        style={{
          padding: '10px 24px',
          backgroundColor: valveOpen ? '#e74c3c' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          fontSize: '1em',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
      >
        {valveOpen ? 'Fermer la vanne' : 'Ouvrir la vanne'}
      </button>
    </div>
  );

  return (
    <Router>
      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Navigation pour les utilisateurs connectés */}
        {isLoggedIn && (
          <Navigation 
            isLoggedIn={isLoggedIn}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            handleLogout={handleLogout}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
          />
        )}

        {/* Contenu principal avec routes */}
        <main 
          style={{ 
            padding: isLoggedIn ? '30px' : '0', 
            minHeight: '80vh', 
            backgroundColor: '#ecf0f1'
          }}
          onClick={() => setShowMobileMenu(false)}
        >
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={
              !isLoggedIn ? <WelcomePage /> : <Navigate to="/dashboard" replace />
            } />
            <Route path="/login" element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login setIsLoggedIn={setIsLoggedIn} setCurrentPage={setCurrentPage} />
            } />
            <Route path="/register" element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/forgot-password" element={!isLoggedIn ? <ForgotPasswordPage /> : <Navigate to="/dashboard" replace />} />

            {/* Routes protégées */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                {renderProtectedPage()}
              </ProtectedRoute>
            } />
            <Route path="/greenhouse" element={
              <ProtectedRoute>
                {renderProtectedPage()}
              </ProtectedRoute>
            } />
            <Route path="/humidity" element={
              <ProtectedRoute>
                {renderProtectedPage()}
              </ProtectedRoute>
            } />
            <Route path="/temperature" element={
              <ProtectedRoute>
                {renderProtectedPage()}
              </ProtectedRoute>
            } />
            <Route path="/light" element={
              <ProtectedRoute>
                {renderProtectedPage()}
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                {renderProtectedPage()}
              </ProtectedRoute>
            } />

            {/* Route par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{ 
          backgroundColor: '#f5f5dc', 
          color: '#333', 
          textAlign: 'center', 
          padding: '20px',
          boxShadow: '0px -2px 6px rgba(0,0,0,0.1)',
          position: 'relative'
        }}>
          <p style={{ margin: '0' }}>© 2025 Ma Serre Connectée by DÉMÉTERIA</p>
          {isLoggedIn && (
            <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: '0.7' }}>
              Connecté | Page: {currentPage}
            </p>
          )}
        </footer>
      </div>
    </Router>
  );
}

export default App;