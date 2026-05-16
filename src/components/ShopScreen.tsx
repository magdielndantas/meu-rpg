import React, { useState } from 'react';
import type { Player, GameState } from '../types';
import CardComponent from './CardComponent';
import '../styles/shop.css';

interface ShopScreenProps {
  player: Player;
  shopItems: NonNullable<GameState['shopItems']>;
  onBuyCard: (cardId: string) => void;
  onRemoveCard: (cardId: string) => void;
  onLeave: () => void;
}

const MERCHANT_QUOTES = [
  '"Everything has a price, adventurer. Even hope."',
  '"My wares are the finest in these cursed lands."',
  '"Buy something or get out of my shop."',
  '"The dungeon takes many things. Gold is not one of them."',
];

const ShopScreen: React.FC<ShopScreenProps> = ({ player, shopItems, onBuyCard, onRemoveCard, onLeave }) => {
  const [showRemoval, setShowRemoval] = useState(false);
  const quote = MERCHANT_QUOTES[Math.floor(Math.random() * MERCHANT_QUOTES.length)];

  return (
    <div className="shop-container">
      {/* Header */}
      <div className="shop-header">
        <div className="shop-merchant-info">
          <span className="shop-merchant-avatar">🧙</span>
          <span className="shop-merchant-name">The Merchant</span>
        </div>

        <div className="shop-header-actions">
          <div className="shop-gold-display">💰 {player.gold}</div>
          <button className="leave-shop-btn" onClick={onLeave}>Leave</button>
        </div>
      </div>

      {!showRemoval ? (
        <>
          {/* Cards for sale */}
          <p className="shop-section-title">— Wares for sale —</p>
          <div className="shop-grid">
            {shopItems.cards.map(({ card, price }, i) => {
              const affordable = player.gold >= price;
              return (
                <div
                  key={`${card.id}_${i}`}
                  className={`shop-item${!affordable ? ' shop-item--unaffordable' : ''}`}
                >
                  <CardComponent
                    card={card}
                    disabled={!affordable}
                    onClick={() => affordable && onBuyCard(card.id)}
                  />
                  <div className="price-tag">
                    💰 {price}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Services */}
          <div className="shop-services">
            <div
              className={`service-card${player.gold < shopItems.removalPrice ? ' disabled' : ''}`}
              onClick={() => player.gold >= shopItems.removalPrice && setShowRemoval(true)}
            >
              <div className="service-icon">🧹</div>
              <h3>Remove a Card</h3>
              <p>Purge a card from your deck permanently</p>
              <div className="price-tag">💰 {shopItems.removalPrice}</div>
            </div>
          </div>

          {/* Merchant quote */}
          <p className="shop-quote">{quote}</p>
        </>
      ) : (
        <div className="upgrade-selector">
          <h2>Select a card to remove</h2>
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
          <button className="deck-btn" onClick={() => setShowRemoval(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default ShopScreen;
