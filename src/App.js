import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import authService from './services/authService';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
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
    backgroundColor: currentPage === page ? '#27ae60' : 'rgba(255,255,255,0.1)',
    color: 'white',
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
      backgroundColor: '#2c3e50', 
      color: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: '0', color: '#27ae60' }}>🌱 Ma Serre Connectée</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{ 
              display: 'block',
              padding: '8px', 
              backgroundColor: 'transparent', 
              color: 'white', 
              border: '1px solid #fff', 
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
          backgroundColor: '#34495e',
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

  // État de la grille de la serre
  const [greenhouseGrid, setGreenhouseGrid] = useState(
    Array.from({ length: 40 }, (_, index) => {
      if (index < 8) return { name: 'Tomate', emoji: '🍅' };
      if (index >= 8 && index < 12) return { name: 'Salade', emoji: '🥬' };
      return null;
    })
  );

  // Plantes disponibles
  const availablePlants = [
    { name: 'Tomate', emoji: '🍅', duration: '3-5 mois' },
    { name: 'Salade', emoji: '🥬', duration: '1-2 mois' },
    { name: 'Carotte', emoji: '🥕', duration: '3-4 mois' },
    { name: 'Oignon', emoji: '🧅', duration: '4-6 mois' },
    { name: 'Courgette', emoji: '🥒', duration: '2-3 mois' },
    { name: 'Poivron', emoji: '🫑', duration: '3-4 mois' },
    { name: 'Aubergine', emoji: '🍆', duration: '4-5 mois' },
    { name: 'Concombre', emoji: '🥒', duration: '2-3 mois' }
  ];

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const token = authService.getToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Fonction de connexion
  const handleLogin = (email, password) => {
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  };

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
          backgroundColor: '#2c3e50', 
          color: 'white', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0', color: '#27ae60' }}>🌱 Ma Serre Connectée</h1>
          <p style={{ margin: '10px 0 0 0', opacity: '0.8' }}>Système de surveillance intelligent</p>
        </header>
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '60px 40px', 
          borderRadius: '15px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          maxWidth: '500px'
        }}>
          <h1 style={{ 
            fontSize: '3em', 
            margin: '0 0 20px 0', 
            color: '#27ae60' 
          }}>
            🌱 Ma Serre Connectée
          </h1>
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
            <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
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
  const LoginPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      setError('');
      
      if (!email || !password) {
        setError('Veuillez remplir tous les champs');
        return;
      }

      const success = handleLogin(email, password);
      if (!success) {
        setError('Email ou mot de passe incorrect');
      }
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
                type="email" 
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
    const interval = setInterval(loadTemperatureData, 30000);
    return () => clearInterval(interval);
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
    const interval = setInterval(loadHumidityData, 30000);
    return () => clearInterval(interval);
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
    const interval = setInterval(loadLightData, 30000);
    return () => clearInterval(interval);
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

  // Fonction composant pour rendre la page de la serre
  const GreenhousePage = () => {
    const [vegetables, setVegetables] = useState([]);
    // Initialiser l'état avec les valeurs du localStorage s'il y en a
    const [newVegetable, setNewVegetable] = useState(() => {
      const saved = localStorage.getItem('vegetableFormState');
      return saved ? JSON.parse(saved) : { 
        name: '', 
        emoji: '', 
        duration: '', 
        average_water_consumption: '' 
      };
    });
    const [vegError, setVegError] = useState('');
    const [vegSuccess, setVegSuccess] = useState('');
    const [isVegLoading, setIsVegLoading] = useState(false);

    // Sauvegarder dans le localStorage à chaque modification du formulaire
    useEffect(() => {
      localStorage.setItem('vegetableFormState', JSON.stringify(newVegetable));
    }, [newVegetable]);

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

    // Gérer l'ajout d'un légume
    const handleAddVegetable = async (e) => {
      e.preventDefault();
      setVegError(''); 
      setVegSuccess('');
      if (!newVegetable.name || !newVegetable.emoji || !newVegetable.duration || !newVegetable.average_water_consumption) {
        setVegError('Tous les champs sont obligatoires');
        return;
      }
      const res = await vegetableService.addVegetable(newVegetable);
      if (res.success) {
        setVegSuccess('Légume ajouté !');
        // Réinitialiser le formulaire et le localStorage
        const emptyState = { name: '', emoji: '', duration: '', average_water_consumption: '' };
        setNewVegetable(emptyState);
        localStorage.setItem('vegetableFormState', JSON.stringify(emptyState));
        // Recharger la liste
        const reload = await vegetableService.getAllVegetables();
        if (reload.success) setVegetables(reload.data);
      } else {
        setVegError(res.error || "Erreur lors de l'ajout");
      }
    };

    // Gérer les changements de champs
    const handleFieldChange = (field, value) => {
      const updatedVegetable = { ...newVegetable, [field]: value };
      setNewVegetable(updatedVegetable);
      localStorage.setItem('vegetableFormState', JSON.stringify(updatedVegetable));
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>🌱 Gestion de ma serre</h2>
        <div style={{ marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Ajouter un légume</h3>
          <form onSubmit={handleAddVegetable} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Nom" 
              value={newVegetable.name} 
              onChange={e => handleFieldChange('name', e.target.value)} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
            <input 
              type="text" 
              placeholder="Emoji" 
              value={newVegetable.emoji} 
              onChange={e => handleFieldChange('emoji', e.target.value)} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '60px' }} 
            />
            <input 
              type="text" 
              placeholder="Durée (ex: 2-3 mois)" 
              value={newVegetable.duration} 
              onChange={e => handleFieldChange('duration', e.target.value)} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
            <input 
              type="number" 
              step="0.1" 
              placeholder="Conso eau (L/j)" 
              value={newVegetable.average_water_consumption} 
              onChange={e => handleFieldChange('average_water_consumption', e.target.value)} 
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '120px' }} 
            />
            <button type="submit" style={{ padding: '8px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ajouter</button>
          </form>
          {vegError && <div style={{ color: 'red', marginTop: '8px' }}>{vegError}</div>}
          {vegSuccess && <div style={{ color: 'green', marginTop: '8px' }}>{vegSuccess}</div>}
        </div>
        <div style={{ marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Légumes disponibles</h3>
          {isVegLoading ? <p>Chargement...</p> : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {vegetables.map(veg => (
                <div key={veg.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '12px', minWidth: '120px', background: '#f8f9fa', textAlign: 'center' }}>
                  <div style={{ fontSize: '2em' }}>{veg.emoji}</div>
                  <div style={{ fontWeight: 'bold' }}>{veg.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{veg.duration}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>💧 {veg.average_water_consumption} L/j</div>
            </div>
              ))}
            </div>
          )}
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
                  </div>
                </div>
              </div>
          {/* Sélection des plantes */}
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', width: '280px', flexShrink: 0 }}>
                <h3>🌱 Plantes disponibles</h3>
                <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                  Glissez-déposez ou cliquez pour sélectionner
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {availablePlants.map((plant, index) => (
                    <div 
                      key={index} 
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
                      </div>
                      {selectedPlant?.name === plant.name && (
                        <div style={{ color: '#27ae60', fontSize: '16px' }}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
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

  // Modifier le rendu de la page température
  const renderTemperaturePage = () => {
    if (isLoading) {
      return <div>Chargement des données...</div>;
    }

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    // Préparer les données pour le graphique
    const chartData = {
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
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Évolution de la température'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Température (°C)'
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
        <h2>🌡️ Température</h2>
        
        {latestTemperature && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>Dernière mesure</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {latestTemperature.val}°C
            </p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Mesuré le {new Date(latestTemperature.created_at).toLocaleString()}
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
          <h3>Graphique des températures</h3>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '15px',
            marginTop: '15px'
          }}>
            {temperatureData.map((measure) => (
              <div key={measure.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
                  {measure.val}°C
                </p>
                <p style={{ color: '#666', fontSize: '12px', margin: '5px 0 0 0' }}>
                  {new Date(measure.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
          </div>
        );
  };

  // Ajouter le rendu de la page d'humidité
  const renderHumidityPage = () => {
    if (isHumidityLoading) {
      return <div>Chargement des données...</div>;
    }

    if (humidityError) {
      return <div className="error-message">{humidityError}</div>;
    }

    // Préparer les données pour le graphique
    const chartData = {
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
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Évolution de l\'humidité'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Humidité (%)'
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
        <h2>💧 Humidité</h2>
        
        {latestHumidity && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>Dernière mesure</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {latestHumidity.val}%
            </p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Mesuré le {new Date(latestHumidity.created_at).toLocaleString()}
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
          <h3>Graphique de l'humidité</h3>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '15px',
            marginTop: '15px'
          }}>
            {humidityData.map((measure) => (
              <div key={measure.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
                  {measure.val}%
                </p>
                <p style={{ color: '#666', fontSize: '12px', margin: '5px 0 0 0' }}>
                  {new Date(measure.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
          </div>
        );
  };

  // Ajouter le rendu de la page de luminosité
  const renderLightPage = () => {
    if (isLightLoading) {
      return <div>Chargement des données...</div>;
    }

    if (lightError) {
      return <div className="error-message">{lightError}</div>;
    }

    // Préparer les données pour le graphique
    const chartData = {
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
    };

    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Évolution de la luminosité'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'Luminosité (lux)'
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
        <h2>☀️ Luminosité</h2>
            
        {latestLight && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>Dernière mesure</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {latestLight.val} lux
            </p>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Mesuré le {new Date(latestLight.created_at).toLocaleString()}
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
          <h3>Graphique de la luminosité</h3>
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
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '15px',
            marginTop: '15px'
          }}>
            {lightData.map((measure) => (
              <div key={measure.id} style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #dee2e6'
              }}>
                <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
                  {measure.val} lux
                </p>
                <p style={{ color: '#666', fontSize: '12px', margin: '5px 0 0 0' }}>
                  {new Date(measure.created_at).toLocaleString()}
                </p>
            </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Composant pour la page de profil utilisateur
  const ProfilePage = () => {
    const [fullName, setFullName] = useState('Jean Dupont');
    const [email, setEmail] = useState('jean.dupont@email.com');
    const [success, setSuccess] = useState('');

    const handleSave = (e) => {
      e.preventDefault();
      setSuccess('Profil mis à jour !');
      setTimeout(() => setSuccess(''), 2000);
    };

    return (
      <div style={{ padding: '20px' }}>
        <h2>👤 Profil utilisateur</h2>
        <div style={{ maxWidth: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>📋 Informations personnelles</h3>
          <form onSubmit={handleSave} style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nom complet</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
            </div>
            <button type="submit" style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              💾 Sauvegarder
              </button>
            {success && <div style={{ color: 'green', marginTop: '10px' }}>{success}</div>}
          </form>
            </div>
          </div>
        );
  };

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
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />
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
          backgroundColor: '#34495e', 
          color: 'white', 
          textAlign: 'center', 
          padding: '20px'
        }}>
          <p style={{ margin: '0' }}>© 2025 Ma Serre Connectée - Système IoT</p>
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