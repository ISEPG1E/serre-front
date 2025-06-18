import React from 'react';

// Composant pour un segment individuel
const Segment = ({ active, position, size }) => {
  // Définir les dimensions et position selon le type de segment
  const getStyle = () => {
    let width, height, top, left, transform;
    
    // Définir les dimensions selon si c'est un segment horizontal ou vertical
    if (position === 'top' || position === 'middle' || position === 'bottom') {
      // Segments horizontaux
      width = size * 0.8;
      height = size * 0.1;
      left = size * 0.1;
      transform = 'none';
      
      if (position === 'top') top = 0;
      else if (position === 'middle') top = size * 0.7;
      else if (position === 'bottom') top = size * 1.4;
    } else {
      // Segments verticaux
      width = size * 0.1;
      height = size * 0.65;
      
      if (position === 'top-left' || position === 'bottom-left') {
        left = 0;
      } else if (position === 'top-right' || position === 'bottom-right') {
        left = size * 0.9;
      }
      
      if (position === 'top-left' || position === 'top-right') {
        top = size * 0.05;
      } else if (position === 'bottom-left' || position === 'bottom-right') {
        top = size * 0.75;
      }
      transform = 'none';
    }

    return {
      position: 'absolute',
      width,
      height,
      backgroundColor: active ? 'currentColor' : 'rgba(0, 0, 0, 0.05)',
      borderRadius: size * 0.05,
      top,
      left,
      transform,
      transition: 'background-color 0.3s ease',
      boxShadow: active ? '0 0 8px rgba(0, 180, 0, 0.4)' : 'none'
    };
  };

  return <div style={getStyle()} />;
};

// Composant pour un chiffre
const Digit = ({ value, size = 50, color = '#27ae60' }) => {
  // Configuration des segments actifs pour chaque chiffre (0-9)
  const digitConfigs = {
    '0': [true, true, true, true, true, true, false],
    '1': [false, true, true, false, false, false, false],
    '2': [true, true, false, true, true, false, true],
    '3': [true, true, true, true, false, false, true],
    '4': [false, true, true, false, false, true, true],
    '5': [true, false, true, true, false, true, true],
    '6': [true, false, true, true, true, true, true],
    '7': [true, true, true, false, false, false, false],
    '8': [true, true, true, true, true, true, true],
    '9': [true, true, true, true, false, true, true]
  };

  // Déterminer quels segments sont actifs pour ce chiffre
  const segments = digitConfigs[value] || digitConfigs['0'];

  return (
    <div style={{ 
      position: 'relative', 
      width: size, 
      height: size * 1.5, 
      color, 
      margin: '0 5px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ position: 'relative', width: size, height: size * 1.5 }}>
        <Segment active={segments[0]} position="top" size={size} />
        <Segment active={segments[1]} position="top-right" size={size} />
        <Segment active={segments[2]} position="bottom-right" size={size} />
        <Segment active={segments[3]} position="bottom" size={size} />
        <Segment active={segments[4]} position="bottom-left" size={size} />
        <Segment active={segments[5]} position="top-left" size={size} />
        <Segment active={segments[6]} position="middle" size={size} />
      </div>
    </div>
  );
};

// Composant principal pour l'affichage complet
const SevenSegmentDisplay = ({ value, size = 50, color = '#27ae60', showPercent = true }) => {
  // Formater la valeur pour afficher 3 chiffres
  const formattedValue = String(Math.min(Math.max(0, Math.round(value)), 999)).padStart(3, '0');
  
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      <div style={{ 
        display: 'flex', 
        backgroundColor: 'rgba(0,0,0,0.05)', 
        padding: '15px', 
        borderRadius: '8px',
        boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.1)'
      }}>
        {formattedValue.split('').map((digit, index) => (
          <Digit key={index} value={digit} size={size} color={color} />
        ))}
        {showPercent && (
          <div style={{ 
            fontSize: size * 0.8, 
            marginLeft: '10px', 
            fontWeight: 'bold', 
            color,
            alignSelf: 'center',
            paddingBottom: '8px'
          }}>%</div>
        )}
      </div>
    </div>
  );
};

export default SevenSegmentDisplay; 