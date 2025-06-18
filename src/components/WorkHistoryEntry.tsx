import React from 'react';
import './EntryOverlay.css';

interface WorkHistoryEntryProps {
  onReturnToMap: () => void;
  entryPosition?: { x: number; y: number };
}

export const WorkHistoryEntry: React.FC<WorkHistoryEntryProps> = ({ 
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
                <span className="jrpg-title-text">Professional Experience</span>
              </div>
              
              <div className="jrpg-message-area">
                <p className="jrpg-message-text">
                  You've uncovered the ancient Guild Archives!
                </p>
                <p className="jrpg-message-text">
                  Chronicles of past adventures and conquered challenges await...
                </p>
                <p className="jrpg-message-text">
                  Years of quests, battles won, and skills mastered.
                </p>
              </div>

              {entryPosition && (
                <div className="jrpg-info-box">
                  <div className="jrpg-info-title">ARCHIVE LOCATION</div>
                  <div className="jrpg-coordinates">
                    <span>X: {Math.round(entryPosition.x).toString().padStart(4, '0')}</span>
                    <span>Y: {Math.round(entryPosition.y).toString().padStart(4, '0')}</span>
                  </div>
                </div>
              )}

              <div className="jrpg-options-box">
                <div className="jrpg-option-title">LEGENDARY ACHIEVEMENTS</div>
                <div className="jrpg-option-list">
                  <div className="jrpg-option-item">• Full-stack development mastery</div>
                  <div className="jrpg-option-item">• Team leadership campaigns</div>
                  <div className="jrpg-option-item">• Complex system architecture</div>
                  <div className="jrpg-option-item">• Innovation and problem solving</div>
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