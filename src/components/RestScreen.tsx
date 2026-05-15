import React, { useState } from 'react';
import { Player } from '../types';
import CardComponent from './CardComponent';
import '../styles/rest.css';

interface RestScreenProps {
  player: Player;
  onHeal: () => void;
  onUpgrade: (cardId: string) => void;
}

const RestScreen: React.FC<RestScreenProps> = ({ player, onHeal, onUpgrade }) => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  const upgradeableCards = player.deck.filter(c => !c.upgraded);

  return (
    <div className="rest-container">
      <h1 className="rest-title">O Acampamento</h1>
      
      {!showUpgrade ? (
        <div className="rest-options">
          <div className="rest-option" onClick={onHeal}>
            <span className="option-icon">🛌</span>
            <span className="option-title">Descansar</span>
            <span className="option-desc">Recupera 30% do HP Máximo (+{Math.floor(player.maxHp * 0.3)} HP)</span>
          </div>

          <div 
            className={`rest-option ${upgradeableCards.length === 0 ? 'disabled' : ''}`} 
            onClick={() => upgradeableCards.length > 0 && setShowUpgrade(true)}
          >
            <span className="option-icon">🔨</span>
            <span className="option-title">Aprimorar</span>
            <span className="option-desc">Melhore uma carta do seu deck permanentemente</span>
          </div>
        </div>
      ) : (
        <div className="upgrade-selector">
          <h2>Selecione uma carta para aprimorar</h2>
          <div className="upgrade-grid">
            {upgradeableCards.map((card, i) => (
              <CardComponent 
                key={`${card.id}_${i}`} 
                card={card} 
                onClick={() => onUpgrade(card.id)}
              />
            ))}
          </div>
          <button className="deck-btn" onClick={() => setShowUpgrade(false)}>Voltar</button>
        </div>
      )}
    </div>
  );
};

export default RestScreen;
