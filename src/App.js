import { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');

  // Fonction de connexion
  const handleLogin = (email, password) => {
    // Simulation de connexion (vous pouvez ajouter votre logique ici)
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentPage('dashboard'); // Redirection vers dashboard après connexion
      return true;
    }
    return false;
  };

  // Fonction de déconnexion
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  // PAGE D'ACCUEIL (avant connexion)
  const renderWelcomePage = () => (
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

        <button 
          onClick={() => setCurrentPage('login')}
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
          onMouseOver={(e) => e.target.style.backgroundColor = '#219a52'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#27ae60'}
        >
          🔐 Se connecter
        </button>

        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <ul style={{ 
            textAlign: 'left', 
            margin: '0', 
            paddingLeft: '20px', 
            color: '#6c757d',
            fontSize: '0.9em'
          }}>
            <li>Surveillance temps réel</li>
            <li>Alertes automatiques</li>
            <li>Graphiques détaillés</li>
            <li>Contrôle à distance</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // États pour la page de connexion
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // PAGE DE CONNEXION
  const renderLoginPage = () => {

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
                placeholder="••••••••"
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
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button 
              onClick={() => setCurrentPage('forgot-password')}
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
              onClick={() => setCurrentPage('home')}
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
  const renderForgotPasswordPage = () => (
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
            onClick={() => setCurrentPage('login')}
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
      </div>
    </div>
  );

  // PAGES PROTÉGÉES (après connexion uniquement)
  const renderProtectedPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return (
          <div>
            <h1>📊 Tableau de bord</h1>
            <p>Vue d'ensemble de votre serre connectée</p>
            
            {/* Métriques principales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
                <h4>🌡️ Température</h4>
                <p style={{ fontSize: '28px', margin: '10px 0', color: '#1976d2' }}>25°C</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Optimal</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px', textAlign: 'center' }}>
                <h4>💧 Humidité</h4>
                <p style={{ fontSize: '28px', margin: '10px 0', color: '#388e3c' }}>65%</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Parfait</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
                <h4>☀️ Luminosité</h4>
                <p style={{ fontSize: '28px', margin: '10px 0', color: '#f57c00' }}>85%</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Excellent</p>
              </div>
            </div>

            {/* Actions rapides */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setCurrentPage('temperature')}
                style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                📊 Température
              </button>
              <button 
                onClick={() => setCurrentPage('humidity')}
                style={{ padding: '10px 20px', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                📊 Humidité
              </button>
              <button 
                onClick={() => setCurrentPage('light')}
                style={{ padding: '10px 20px', backgroundColor: '#f57c00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                📊 Luminosité
              </button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div>
            <h1>👤 Profil utilisateur</h1>
            <div style={{ maxWidth: '600px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>📋 Informations personnelles</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Nom complet</label>
                  <input type="text" defaultValue="Jean Dupont" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>Email</label>
                  <input type="email" defaultValue="jean.dupont@email.com" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }} />
                </div>
              </div>
              <button style={{ marginTop: '20px', padding: '12px 24px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                💾 Sauvegarder
              </button>
            </div>
          </div>
        );

      case 'humidity':
        return (
          <div>
            <h1>💧 Données d'humidité</h1>
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              <div style={{ display: 'inline-block', padding: '30px', backgroundColor: '#e8f5e8', borderRadius: '15px' }}>
                <h2 style={{ margin: '0', color: '#388e3c' }}>Humidité actuelle</h2>
                <p style={{ fontSize: '48px', margin: '10px 0', color: '#2e7d32' }}>65%</p>
                <p style={{ color: '#666' }}>Dernière mise à jour: il y a 2 minutes</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>📈 Évolution sur 24h</h3>
              <div style={{ height: '100px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Graphique d'humidité (simulation)</p>
              </div>
            </div>
          </div>
        );

      case 'temperature':
        return (
          <div>
            <h1>🌡️ Données de température</h1>
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              <div style={{ display: 'inline-block', padding: '30px', backgroundColor: '#e3f2fd', borderRadius: '15px' }}>
                <h2 style={{ margin: '0', color: '#1976d2' }}>Température actuelle</h2>
                <p style={{ fontSize: '48px', margin: '10px 0', color: '#1565c0' }}>25°C</p>
                <p style={{ color: '#666' }}>Dernière mise à jour: il y a 1 minute</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>📈 Évolution sur 24h</h3>
              <div style={{ height: '100px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Graphique de température (simulation)</p>
              </div>
            </div>
          </div>
        );

      case 'light':
        return (
          <div>
            <h1>☀️ Données de luminosité</h1>
            <div style={{ textAlign: 'center', margin: '30px 0' }}>
              <div style={{ display: 'inline-block', padding: '30px', backgroundColor: '#fff8e1', borderRadius: '15px' }}>
                <h2 style={{ margin: '0', color: '#f57c00' }}>Luminosité actuelle</h2>
                <p style={{ fontSize: '48px', margin: '10px 0', color: '#ef6c00' }}>85%</p>
                <p style={{ color: '#666' }}>Niveau optimal pour la photosynthèse</p>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3>🌅 Cycle lumineux du jour</h3>
              <div style={{ height: '100px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p>Graphique de luminosité (simulation)</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h1>📊 Tableau de bord</h1>
            <p>Vue d'ensemble de votre serre connectée</p>
            
            {/* Métriques principales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0' }}>
              <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
                <h4>🌡️ Température</h4>
                <p style={{ fontSize: '28px', margin: '10px 0', color: '#1976d2' }}>25°C</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Optimal</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px', textAlign: 'center' }}>
                <h4>💧 Humidité</h4>
                <p style={{ fontSize: '28px', margin: '10px 0', color: '#388e3c' }}>65%</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Parfait</p>
              </div>
              <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
                <h4>☀️ Luminosité</h4>
                <p style={{ fontSize: '28px', margin: '10px 0', color: '#f57c00' }}>85%</p>
                <p style={{ fontSize: '12px', color: '#666' }}>Excellent</p>
              </div>
            </div>

            {/* Actions rapides */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setCurrentPage('temperature')}
                style={{ padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                📊 Température
              </button>
              <button 
                onClick={() => setCurrentPage('humidity')}
                style={{ padding: '10px 20px', backgroundColor: '#388e3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                📊 Humidité
              </button>
              <button 
                onClick={() => setCurrentPage('light')}
                style={{ padding: '10px 20px', backgroundColor: '#f57c00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                📊 Luminosité
              </button>
            </div>
          </div>
        );
    }
  };

  // Fonction pour déterminer si un onglet est actif
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

  return (
    <div className="App">
      {/* Header simple pour les pages publiques */}
      {!isLoggedIn && (
        <header style={{ 
          backgroundColor: '#2c3e50', 
          color: 'white', 
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0', color: '#27ae60' }}>🌱 Ma Serre Connectée</h1>
          <p style={{ margin: '10px 0 0 0', opacity: '0.8' }}>Système de surveillance intelligent</p>
        </header>
      )}

      {/* Navigation complète pour les utilisateurs connectés */}
      {isLoggedIn && (
        <nav style={{ 
          padding: '20px', 
          backgroundColor: '#2c3e50', 
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: '0', color: '#27ae60' }}>🌱 Ma Serre Connectée</h2>
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
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setCurrentPage('dashboard')} style={getNavButtonStyle('dashboard')}>
              📊 Dashboard
            </button>
            <button onClick={() => setCurrentPage('profile')} style={getNavButtonStyle('profile')}>
              👤 Profil
            </button>
            <button onClick={() => setCurrentPage('humidity')} style={getNavButtonStyle('humidity')}>
              💧 Humidité
            </button>
            <button onClick={() => setCurrentPage('temperature')} style={getNavButtonStyle('temperature')}>
              🌡️ Température
            </button>
            <button onClick={() => setCurrentPage('light')} style={getNavButtonStyle('light')}>
              ☀️ Luminosité
            </button>
          </div>
        </nav>
      )}

      {/* Contenu principal */}
      <main style={{ 
        padding: isLoggedIn ? '30px' : '0', 
        minHeight: '80vh', 
        backgroundColor: '#ecf0f1'
      }}>
        {!isLoggedIn ? (
          // Pages publiques (avant connexion)
          currentPage === 'home' ? renderWelcomePage() :
          currentPage === 'login' ? renderLoginPage() :
          currentPage === 'forgot-password' ? renderForgotPasswordPage() :
          renderWelcomePage()
        ) : (
          // Pages protégées (après connexion)
          renderProtectedPage()
        )}
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
  );
}

export default App;