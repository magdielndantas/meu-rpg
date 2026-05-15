import type { Card } from '../types';
import '../styles/card.css';

interface Props {
  card: Card;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  small?: boolean;
}

export default function CardComponent({ card, selected, disabled, onClick, small }: Props) {
  const rarityClass = `rarity-${card.rarity}`;
  const typeClass = `type-${card.type}`;
  
  return (
    <div
      className={`card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${small ? 'small' : ''} ${rarityClass} ${typeClass}`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="card-inner">
        <div className="card-mana-crystal">
          <span className="mana-value">{card.cost}</span>
        </div>
        
        <div className="card-frame">
          <div className="card-name-banner">
            <span className="card-name">{card.name}</span>
          </div>
          
          <div className="card-art-box">
            <div className="card-art-image">
              {card.type === 'attack' && '⚔️'}
              {card.type === 'skill' && '🛡️'}
              {card.type === 'power' && '✨'}
            </div>
          </div>
          
          <div className="card-text-box">
            <div className="card-description">
              {card.description}
            </div>
          </div>
          
          <div className="card-footer">
            <span className="card-type-label">{card.type.toUpperCase()}</span>
            {card.upgraded && <span className="upgrade-star">★</span>}
          </div>
        </div>

        {/* Decorative elements for TCG feel */}
        <div className="card-glow"></div>
        <div className="card-border-frame"></div>
      </div>
    </div>
  );
}
