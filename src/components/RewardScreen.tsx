import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div
        className="reward-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h2>Victory!</h2>
        <p className="reward-subtitle">Floor {floor} cleared — choose a card to add to your deck</p>
      </motion.div>

      <AnimatePresence>
        {relic && (
          <motion.div
            className="relic-reward"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 18 }}
          >
            <h3>A relic has been found!</h3>
            <div className="relic-card">
              <motion.span
                className="relic-reward-icon"
                animate={{ rotate: [0, -8, 8, -5, 4, 0], scale: [1, 1.1, 1] }}
                transition={{ delay: 0.5, duration: 0.6, ease: 'easeInOut' }}
              >
                {relic.icon}
              </motion.span>
              <div className="relic-reward-info">
                <strong>{relic.name}</strong>
                <p>{relic.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="reward-cards">
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 50, scale: 0.88, rotateY: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.2 + i * 0.13, type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{ y: -10, scale: 1.06, transition: { type: 'spring', stiffness: 350, damping: 22 } }}
          >
            <CardComponent card={card} onClick={() => onSelect(card)} />
          </motion.div>
        ))}
      </div>

      <motion.button
        className="skip-btn"
        onClick={() => onSelect(null)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        whileHover={{ scale: 1.04, opacity: 0.9 }}
        whileTap={{ scale: 0.97 }}
      >
        Skip Reward
      </motion.button>
    </div>
  );
}
