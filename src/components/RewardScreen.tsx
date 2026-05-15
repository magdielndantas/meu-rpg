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
      <h2>⚔️ Vitória! Andar {floor} completo</h2>
      
      {relic && (
        <div className="relic-reward">
          <h3>Você encontrou uma relíquia!</h3>
          <div className="relic-card">
            <span className="relic-reward-icon">{relic.icon}</span>
            <div className="relic-reward-info">
              <strong>{relic.name}</strong>
              <p>{relic.description}</p>
            </div>
          </div>
        </div>
      )}

      <p>Escolha uma carta para adicionar ao seu deck:</p>
      <div className="reward-cards">
        {cards.map(card => (
          <CardComponent key={card.id} card={card} onClick={() => onSelect(card)} />
        ))}
      </div>
      <button className="skip-btn" onClick={() => onSelect(null)}>
        Pular recompensa
      </button>
    </div>
  );
}
