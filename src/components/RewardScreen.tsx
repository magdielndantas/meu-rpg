import type { Card } from '../types';
import CardComponent from './CardComponent';
import { getRewardCards } from '../game/cards';
import { useState } from 'react';
import '../styles/reward.css';

interface Props {
  floor: number;
  onSelect: (card: Card | null) => void;
}

export default function RewardScreen({ floor, onSelect }: Props) {
  const [cards] = useState<Card[]>(() => getRewardCards(3));

  return (
    <div className="reward-screen">
      <h2>⚔️ Vitória! Andar {floor} completo</h2>
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
