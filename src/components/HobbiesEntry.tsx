import React from 'react';
import './EntryOverlay.css';

interface HobbiesEntryProps {
  onReturnToMap: () => void;
  entryPosition?: { x: number; y: number };
}

export const HobbiesEntry: React.FC<HobbiesEntryProps> = ({ 
  onReturnToMap, 
  entryPosition 
}: HobbiesEntryProps) => {
  return (
    <div className="jrpg-overlay">
      <div className="jrpg-background"></div>
      
      <div className="jrpg-dialog-container">
        <div className="jrpg-dialog-box">
          <div className="jrpg-dialog-border">
            <div className="jrpg-dialog-content">
              <div className="jrpg-title-bar">
                <span className="jrpg-title-text">Hobbies and Projects</span>
              </div>
              
              <div className="jrpg-message-area">
                <p className="jrpg-message-text">
                  You've discovered a cozy haven filled with treasures!
                </p>
                <p className="jrpg-message-text">
                  Artifacts of passion, creativity, and personal adventures.
                </p>
                <p className="jrpg-message-text">
                  The hobbies and interests that fuel the soul.
                </p>
              </div>

              {entryPosition && (
                <div className="jrpg-info-box">
                  <div className="jrpg-info-title">HAVEN POSITION</div>
                  <div className="jrpg-coordinates">
                    <span>X: {Math.round(entryPosition.x).toString().padStart(4, '0')}</span>
                    <span>Y: {Math.round(entryPosition.y).toString().padStart(4, '0')}</span>
                  </div>
                </div>
              )}

              <div className="jrpg-options-box">
                <div className="jrpg-option-title">PASSION PROJECTS</div>
                <div className="jrpg-option-list">
                  <div className="jrpg-option-item">• Creative pursuits and arts</div>
                  <div className="jrpg-option-item">• Outdoor adventures</div>
                  <div className="jrpg-option-item">• Learning new skills</div>
                  <div className="jrpg-option-item">• Community involvement</div>
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