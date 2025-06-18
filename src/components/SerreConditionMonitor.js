import React, { useMemo } from 'react';
import SevenSegmentDisplay from './SevenSegmentDisplay';

const SerreConditionMonitor = ({ temperature, humidity, light }) => {
  // Calcul du pourcentage de condition basé sur les données des capteurs
  const calculateConditionScore = useMemo(() => {
    // Valeurs par défaut si les données ne sont pas disponibles
    const temp = temperature || 20;
    const hum = humidity || 50;
    const lum = light || 500;
    
    // Normalisation de la luminosité (0-1023 -> 0-100%)
    const normalizedLight = Math.min(100, (lum / 1023) * 100);
    
    // Poids pour chaque facteur
    const poidsHumidite = 1.5;
    const poidsTemp = 1.0;
    const poidsLumiere = 0.5;
    
    // Formule de calcul du score
    // Score = (100 - humidité%) × poidsHumidité + (Température°C - 20) × poidsTemp + lumièreNormée × poidsLumière
    const humidityContribution = (100 - hum) * poidsHumidite;
    const temperatureContribution = (temp - 20) * poidsTemp;
    const lightContribution = normalizedLight * poidsLumiere;
    
    // Score total (limité entre 0 et 100)
    const rawScore = humidityContribution + temperatureContribution + lightContribution;
    return Math.max(0, Math.min(100, rawScore));
  }, [temperature, humidity, light]);
  
  // Déterminer l'état et la couleur en fonction du score
  const getStatusInfo = () => {
    if (calculateConditionScore > 70) {
      return { 
        status: 'BON', 
        color: '#27ae60',
        description: 'Conditions optimales pour vos plantes' 
      };
    } else if (calculateConditionScore >= 50) {
      return { 
        status: 'CORRECT', 
        color: '#f39c12',
        description: 'Conditions acceptables, surveillance recommandée' 
      };
    } else {
      return { 
        status: 'MAUVAIS', 
        color: '#e74c3c',
        description: 'Conditions défavorables, intervention nécessaire' 
      };
    }
  };
  
  const { status, color, description } = getStatusInfo();
  
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '8px', 
      padding: '20px', 
      marginBottom: '25px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h3 style={{ textAlign: 'center', marginTop: 0, marginBottom: 0, marginRight: '6px' }}>État de la Serre</h3>
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#f1f1f1',
            color: '#666',
            cursor: 'help',
            fontSize: '12px',
            fontWeight: 'bold',
            marginTop: '1px'  // Ajustement fin pour l'alignement vertical
          }}
          title="Score = (100 - Humidité%) × 1.5 + (Température°C - 20) × 1.0 + (Luminosité/1023×100) × 0.5"
        >
          ?
        </div>
      </div>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        margin: '20px 0'
      }}>
        <SevenSegmentDisplay value={calculateConditionScore} size={60} color={color} />
        
        <div style={{ 
          marginTop: '15px', 
          padding: '8px 16px', 
          backgroundColor: color, 
          color: 'white', 
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          {status}
        </div>
        
        <div style={{ marginTop: '10px', color: '#666', textAlign: 'center' }}>
          {description}
        </div>
      </div>
    </div>
  );
};

export default SerreConditionMonitor; 