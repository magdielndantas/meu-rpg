import { motion } from 'framer-motion';
import type { Card } from '../types';
import '../styles/card.css';

interface Props {
  card: Card;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  small?: boolean;
  layoutId?: string;
}

function getCardValue(card: Card): { value: number | null; kind: 'attack' | 'block' | null } {
  for (const fx of card.effects) {
    if (fx.damage !== undefined && fx.damage > 0) return { value: fx.damage, kind: 'attack' };
  }
  for (const fx of card.effects) {
    if (fx.block !== undefined && fx.block > 0) return { value: fx.block, kind: 'block' };
  }
  return { value: null, kind: null };
}

export default function CardComponent({ card, selected, disabled, onClick, small, layoutId }: Props) {
  const rarityClass = `rarity-${card.rarity}`;
  const typeClass   = `type-${card.type}`;
  const { value: cardValue, kind: badgeKind } = getCardValue(card);

  return (
    <motion.div
      layoutId={layoutId}
      className={`card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${small ? 'small' : ''} ${rarityClass} ${typeClass}`}
      onClick={disabled ? undefined : onClick}
      whileTap={!disabled ? { scale: 0.93 } : {}}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
    >
      <div className="card-inner">

        {/* Mana crystal — top-left */}
        <div className="card-mana-crystal">
          <span className="mana-value">{card.cost}</span>
        </div>

        {/* Value badge — top-right */}
        {cardValue !== null && badgeKind !== null && (
          <div className={`card-value-badge ${badgeKind}-badge`}>
            {cardValue}
          </div>
        )}

        {/* Art box */}
        <div className="card-art-box">
          <div className="card-art-image">
            {card.type === 'attack' && '⚔️'}
            {card.type === 'skill'  && '🛡️'}
            {card.type === 'power'  && '✨'}
          </div>
          <div className={`card-art-overlay ${card.type}`}></div>
        </div>

        {/* Name banner */}
        <div className="card-name-banner">
          <span className="card-name">{card.name}{card.upgraded ? ' +' : ''}</span>
        </div>

        {/* Description */}
        <div className="card-text-box">
          <div className="card-description">{card.description}</div>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <span className="card-type-label">{card.type.toUpperCase()}</span>
          <div className="rarity-gem" title={card.rarity}></div>
        </div>

        <div className="card-glow"></div>
      </div>
    </motion.div>
  );
}
