import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { Enemy } from '../types';
import '../styles/enemy.css';

interface Props {
  enemy: Enemy;
  selected?: boolean;
  onClick?: () => void;
  entranceDelay?: number;
}

const intentIcons: Record<Enemy['intent'], string> = {
  attack: '⚔️', defend: '🛡️', buff: '✨', debuff: '💀',
};
const intentColors: Record<Enemy['intent'], string> = {
  attack: 'rgba(230,57,70,0.9)',
  defend: 'rgba(0,210,255,0.9)',
  buff:   'rgba(201,168,76,0.9)',
  debuff: 'rgba(155,89,182,0.9)',
};

function getSprite(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('cultista'))  return '🧙';
  if (n.includes('verme'))     return '🐛';
  if (n.includes('piolho'))    return '🦟';
  if (n.includes('gosma'))     return '🫧';
  if (n.includes('guardião'))  return '👹';
  if (n.includes('archer'))    return '🏹';
  if (n.includes('wraith') || n.includes('shadow')) return '👻';
  return '👾';
}

export default function EnemyComponent({ enemy, selected, onClick, entranceDelay = 0 }: Props) {
  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const controls = useAnimation();
  const prevHp = useRef(enemy.hp);
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    if (enemy.hp < prevHp.current) {
      setFlashing(true);
      controls.start({
        x: [0, -14, 14, -10, 9, -6, 5, -3, 1, 0],
        y: [0, -4, 3, -3, 2, 0, 0, 0, 0, 0],
        transition: { duration: 0.45 },
      });
      setTimeout(() => setFlashing(false), 300);
    }
    prevHp.current = enemy.hp;
  }, [enemy.hp, controls]);

  const iColor = intentColors[enemy.intent];

  return (
    <motion.div
      className={`enemy-figure ${selected ? 'targeted' : ''}`}
      animate={controls}
      onClick={onClick}
      initial={{ opacity: 0, x: 80, scale: 0.85 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: entranceDelay }}
      whileHover={selected ? { scale: 1.06 } : { scale: 1.03 }}
    >
      {/* Intent bubble */}
      <motion.div
        className="enemy-intent"
        style={{ borderColor: iColor, color: iColor }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span>{intentIcons[enemy.intent]}</span>
        {enemy.intent === 'attack' && enemy.intentValue && (
          <span className="intent-dmg">{enemy.intentValue}</span>
        )}
      </motion.div>

      {/* Name + HP */}
      <div className="enemy-info">
        <span className="enemy-name">{enemy.name}</span>
        <div className="enemy-hp-bar">
          <motion.div
            className="enemy-hp-fill"
            animate={{ width: `${hpPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ width: `${hpPercent}%` }}
          />
          <span className="enemy-hp-text">{enemy.hp}/{enemy.maxHp}</span>
        </div>
      </div>

      {/* Block */}
      {enemy.block > 0 && (
        <motion.div className="enemy-block-badge" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          🛡️ {enemy.block}
        </motion.div>
      )}

      {/* Big sprite */}
      <div className="enemy-sprite-wrap">
        <div className="enemy-sprite">{getSprite(enemy.name)}</div>
        {flashing && (
          <motion.div
            className="hit-flash"
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Shadow */}
      <div className="enemy-shadow" />

      {/* Status effects */}
      {Object.values(enemy.status).some(v => v > 0) && (
        <div className="enemy-statuses">
          {enemy.status.burn       > 0 && <span className="status burn">🔥{enemy.status.burn}</span>}
          {enemy.status.poison     > 0 && <span className="status poison">☠️{enemy.status.poison}</span>}
          {enemy.status.weak       > 0 && <span className="status weak">💧{enemy.status.weak}</span>}
          {enemy.status.vulnerable > 0 && <span className="status vuln">🎯{enemy.status.vulnerable}</span>}
          {enemy.status.strength   > 0 && <span className="status str">💪{enemy.status.strength}</span>}
        </div>
      )}
    </motion.div>
  );
}
