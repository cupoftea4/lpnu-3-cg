import React, { useEffect } from 'react';
import './TheoryModal.css';
import { TheoryPart } from '../../types';

type OwnProps = {
  theory: TheoryPart[];
  onClose: () => void;
};

const TheoryModal: React.FC<OwnProps> = ({ theory, onClose }) => {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as Element).classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <div className='modal-theory'>
          {theory.map((part, index) => (
            <div className="theory-part" key={index}>
              {part.text && <p className="theory-text">{part.text}</p>}
              {part.htmlContent && (
                <div 
                  className="theory-html-content"
                  dangerouslySetInnerHTML={{ __html: part.htmlContent }}
                />
              )}
              {part.image && <img src={part.image} alt={`Illustration for ${part.text}`} className="theory-image" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheoryModal;
