import type { Card } from '../types';
import '../styles/card.css';

interface Props {
  card: Card;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  small?: boolean;
}

const typeColors: Record<string, string> = {
  attack: '#c0392b',
  skill: '#2980b9',
  power: '#8e44ad',
};

const rarityBorder: Record<string, string> = {
  common: '#555',
  uncommon: '#27ae60',
  rare: '#f39c12',
};

export default function CardComponent({ card, selected, disabled, onClick, small }: Props) {
  return (
    <div
      className={`card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${small ? 'small' : ''}`}
      style={{
        borderColor: rarityBorder[card.rarity],
        '--header-bg': typeColors[card.type],
      } as React.CSSProperties}
      onClick={disabled ? undefined : onClick}
    >
      <div className="card-header">
        <span className="card-name">{card.name}</span>
        <span className="card-cost">{card.cost}</span>
      </div>
      <div className="card-art">
        {card.type === 'attack' && '⚔️'}
        {card.type === 'skill' && '🛡️'}
        {card.type === 'power' && '✨'}
      </div>
      <div className="card-desc">{card.description}</div>
      <div className="card-type">{card.type.toUpperCase()}</div>
    </div>
  );
}
