import React from 'react';
import './EntryOverlay.css';

interface RandomEntryProps {
  onReturnToMap: () => void;
  entryPosition?: { x: number; y: number };
}

export const RandomEntry: React.FC<RandomEntryProps> = ({ 
  onReturnToMap, 
  entryPosition 
}: RandomEntryProps) => {
  return (
    <div className="jrpg-overlay">
      <div className="jrpg-background"></div>
      
      <div className="jrpg-dialog-container">
        <div className="jrpg-dialog-box">
          <div className="jrpg-dialog-border">
            <div className="jrpg-dialog-content">
              <div className="jrpg-title-bar">
                <span className="jrpg-title-text">Wes's House</span>
              </div>
              
              <div className="jrpg-message-area">
                <p className="jrpg-message-text">
                  You've stumbled upon the Chaos Nexus!
                </p>
                <p className="jrpg-message-text">
                  A realm where randomness reigns supreme...
                </p>
                <p className="jrpg-message-text">
                  Unexpected surprises, fun facts, and quirky discoveries await!
                </p>
              </div>

              <div className="jrpg-options-box">
                <div className="jrpg-option-title">RANDOM ENCOUNTERS</div>
                <div className="jrpg-option-list">
                  <div className="jrpg-option-item">• Unexpected trivia and facts</div>
                  <div className="jrpg-option-item">• Strange coincidences</div>
                  <div className="jrpg-option-item">• Hidden easter eggs</div>
                  <div className="jrpg-option-item">• Spontaneous adventures</div>
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