import React from 'react';
import './WASDIndicator.css';

interface WASDIndicatorProps {
  pressedKeys: {
    KeyW: boolean;
    KeyA: boolean;
    KeyS: boolean;
    KeyD: boolean;
  };
}

export const WASDIndicator: React.FC<WASDIndicatorProps> = ({ pressedKeys }) => {
  return (
    <div className="wasd-indicator">
      <div className="wasd-grid">
        <div className={`wasd-key wasd-w ${pressedKeys.KeyW ? 'pressed' : ''}`}>W</div>
        <div className="wasd-spacer"></div>
        <div className="wasd-spacer"></div>
        <div className={`wasd-key wasd-a ${pressedKeys.KeyA ? 'pressed' : ''}`}>A</div>
        <div className={`wasd-key wasd-s ${pressedKeys.KeyS ? 'pressed' : ''}`}>S</div>
        <div className={`wasd-key wasd-d ${pressedKeys.KeyD ? 'pressed' : ''}`}>D</div>
      </div>
    </div>
  );
};