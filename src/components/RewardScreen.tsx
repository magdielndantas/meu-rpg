import type { Card } from '../types';
import CardComponent from './CardComponent';
import { getRewardCards } from '../game/cards';
import { getRelic } from '../game/relics';
import { useState } from 'react';
import '../styles/reward.css';

interface Props {
  floor: number;
  relicId: string | null;
  onSelect: (card: Card | null) => void;
}

export default function RewardScreen({ floor, relicId, onSelect }: Props) {
  const [cards] = useState<Card[]>(() => getRewardCards(3));
  const relic = relicId ? getRelic(relicId) : null;

  return (
    <div className="reward-screen">
      <div className="reward-header">
        <h2>Victory!</h2>
        <p className="reward-subtitle">Floor {floor} cleared — choose a card to add to your deck</p>
      </div>

      {relic && (
        <div className="relic-reward">
          <h3>A relic has been found!</h3>
          <div className="relic-card">
            <span className="relic-reward-icon">{relic.icon}</span>
            <div className="relic-reward-info">
              <strong>{relic.name}</strong>
              <p>{relic.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="reward-cards">
        {cards.map(card => (
          <CardComponent key={card.id} card={card} onClick={() => onSelect(card)} />
        ))}
      </div>

      <button className="skip-btn" onClick={() => onSelect(null)}>
        Skip Reward
      </button>
    </div>
  );
}
