import React, { useState } from 'react';
import { Player, GameState } from '../types';
import CardComponent from './CardComponent';
import '../styles/shop.css';

interface ShopScreenProps {
  player: Player;
  shopItems: NonNullable<GameState['shopItems']>;
  onBuyCard: (cardId: string) => void;
  onRemoveCard: (cardId: string) => void;
  onLeave: () => void;
}

const ShopScreen: React.FC<ShopScreenProps> = ({ player, shopItems, onBuyCard, onRemoveCard, onLeave }) => {
  const [showRemoval, setShowRemoval] = useState(false);

  return (
    <div className="shop-container">
      <div className="shop-header">
        <h1>Loja do Mercador</h1>
        <div className="player-gold">💰 {player.gold} Ouro</div>
      </div>

      {!showRemoval ? (
        <>
          <div className="shop-grid">
            {shopItems.cards.map(({ card, price }, i) => (
              <div key={`${card.id}_${i}`} className="shop-item">
                <CardComponent card={card} disabled={player.gold < price} onClick={() => onBuyCard(card.id)} />
                <div className="price-tag">💰 {price}</div>
              </div>
            ))}
          </div>

          <div className="shop-services">
            <div className="service-card" onClick={() => player.gold >= shopItems.removalPrice && setShowRemoval(true)}>
              <div className="service-icon">🧹</div>
              <h3>Remover Carta</h3>
              <p>Remova uma carta do seu deck</p>
              <div className="price-tag">💰 {shopItems.removalPrice}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="upgrade-selector">
          <h2>Selecione uma carta para remover</h2>
          <div className="upgrade-grid">
            {player.deck.map((card, i) => (
              <CardComponent 
                key={`${card.id}_${i}`} 
                card={card} 
                onClick={() => {
                  onRemoveCard(card.id);
                  setShowRemoval(false);
                }}
              />
            ))}
          </div>
          <button className="deck-btn" onClick={() => setShowRemoval(false)}>Cancelar</button>
        </div>
      )}

      <button className="leave-shop-btn" onClick={onLeave}>Sair da Loja</button>
    </div>
  );
};

export default ShopScreen;
