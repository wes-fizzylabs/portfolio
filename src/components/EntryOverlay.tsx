import React from 'react';
import './EntryOverlay.css';

interface EntryOverlayProps {
  onReturnToMap: () => void;
  entryPosition?: { x: number; y: number };
}

export const EntryOverlay: React.FC<EntryOverlayProps> = ({ 
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
                <span className="jrpg-title-text">MYSTERIOUS PORTAL</span>
              </div>
              
              <div className="jrpg-message-area">
                <p className="jrpg-message-text">
                  You've discovered a mysterious portal!
                </p>
                <p className="jrpg-message-text">
                  Strange energy emanates from this place...
                </p>
                <p className="jrpg-message-text">
                  What secrets might it hold?
                </p>
              </div>

              {entryPosition && (
                <div className="jrpg-info-box">
                  <div className="jrpg-info-title">PORTAL DATA</div>
                  <div className="jrpg-coordinates">
                    <span>X: {Math.round(entryPosition.x).toString().padStart(4, '0')}</span>
                    <span>Y: {Math.round(entryPosition.y).toString().padStart(4, '0')}</span>
                  </div>
                </div>
              )}

              <div className="jrpg-options-box">
                <div className="jrpg-option-title">FUTURE ADVENTURES</div>
                <div className="jrpg-option-list">
                  <div className="jrpg-option-item">• Epic quests await</div>
                  <div className="jrpg-option-item">• Meet new characters</div>
                  <div className="jrpg-option-item">• Discover ancient lore</div>
                  <div className="jrpg-option-item">• Battle fierce monsters</div>
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