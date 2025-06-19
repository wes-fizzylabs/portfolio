import React from 'react';
import './EntryOverlay.css';

interface PersonalEntryProps {
  onReturnToMap: () => void;
  entryPosition?: { x: number; y: number };
}

export const PersonalEntry: React.FC<PersonalEntryProps> = ({ 
  onReturnToMap, 
  entryPosition 
}) => {
  return (
    <div className="jrpg-overlay">
      <div className="jrpg-background"></div>
      
      <div className="jrpg-dialog-container">
        <div className="jrpg-dialog-box">
          <div className="jrpg-dialog-border">
            <div className="jrpg-dialog-content">
              <div className="jrpg-title-bar">
                <span className="jrpg-title-text">About Me</span>
              </div>
              
              <div className="jrpg-message-area">
                <p className="jrpg-message-text">
                  You've entered a peaceful sanctuary...
                </p>
                <p className="jrpg-message-text">
                  A place where the true spirit of the adventurer is revealed.
                </p>
                <p className="jrpg-message-text">
                  Stories of growth, values, and the person behind the legend.
                </p>
              </div>

              {entryPosition && (
                <div className="jrpg-info-box">
                  <div className="jrpg-info-title">SANCTUARY COORDS</div>
                  <div className="jrpg-coordinates">
                    <span>X: {Math.round(entryPosition.x).toString().padStart(4, '0')}</span>
                    <span>Y: {Math.round(entryPosition.y).toString().padStart(4, '0')}</span>
                  </div>
                </div>
              )}

              <div className="jrpg-options-box">
                <div className="jrpg-option-title">INNER QUALITIES</div>
                <div className="jrpg-option-list">
                  <div className="jrpg-option-item">• Life philosophy and values</div>
                  <div className="jrpg-option-item">• Personal growth journey</div>
                  <div className="jrpg-option-item">• Core beliefs and motivations</div>
                  <div className="jrpg-option-item">• Character-defining moments</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="jrpg-button-container">
          <button 
            className="jrpg-button"
            onClick={onReturnToMap}
          >
            <span className="jrpg-button-arrow">▶</span>
            <span className="jrpg-button-text">RETURN TO WORLD</span>
          </button>
        </div>
      </div>
    </div>
  );
};