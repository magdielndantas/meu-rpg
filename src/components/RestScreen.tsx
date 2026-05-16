import React, { useState } from 'react';
import type { Player } from '../types';
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
  const healAmount = Math.floor(player.maxHp * 0.3);
  const hpAfterHeal = Math.min(player.hp + healAmount, player.maxHp);
  const hpAfterPercent = Math.round((hpAfterHeal / player.maxHp) * 100);

  return (
    <div className="rest-container">
      {!showUpgrade ? (
        <>
          {/* Header */}
          <div className="rest-header">
            <h1 className="rest-title">Rest Site</h1>
            <p className="rest-subtitle">Take a moment to recover before the next encounter</p>
          </div>

          {/* Bonfire */}
          <span className="rest-fire">🔥</span>

          {/* Action panels */}
          <div className="rest-options">
            {/* Heal panel */}
            <div className="rest-option" onClick={onHeal}>
              <span className="option-icon">❤️</span>
              <span className="option-title">Rest &amp; Heal</span>
              <span className="option-desc">
                Recover 30% of your max HP
                <br />
                +{healAmount} HP
              </span>
              {/* HP preview bar */}
              <div className="option-hp-bar">
                <div
                  className="option-hp-fill"
                  style={{ width: `${hpAfterPercent}%` }}
                />
              </div>
              <span className="option-desc" style={{ marginTop: 8, fontSize: '0.78rem', color: '#666' }}>
                {player.hp} → {hpAfterHeal} / {player.maxHp}
              </span>
            </div>

            {/* Upgrade panel */}
            <div
              className={`rest-option${upgradeableCards.length === 0 ? ' disabled' : ''}`}
              onClick={() => upgradeableCards.length > 0 && setShowUpgrade(true)}
            >
              <span className="option-icon">⬆️</span>
              <span className="option-title">Upgrade Card</span>
              <span className="option-desc">
                Permanently enhance a card in your deck
                <br />
                {upgradeableCards.length === 0
                  ? 'No cards to upgrade'
                  : `${upgradeableCards.length} card${upgradeableCards.length !== 1 ? 's' : ''} available`}
              </span>
            </div>
          </div>

          {/* HP footer */}
          <p className="rest-hp-footer">
            Current HP: <span>{player.hp}</span> / {player.maxHp}
          </p>
        </>
      ) : (
        <div className="upgrade-selector">
          <h2>Select a card to upgrade</h2>
          <div className="upgrade-grid">
            {upgradeableCards.map((card, i) => (
              <CardComponent
                key={`${card.id}_${i}`}
                card={card}
                onClick={() => onUpgrade(card.id)}
              />
            ))}
          </div>
          <button className="deck-btn" onClick={() => setShowUpgrade(false)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default RestScreen;
