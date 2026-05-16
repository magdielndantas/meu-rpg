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
  attack: '⚔️',
  defend: '🛡️',
  buff:   '✨',
  debuff: '💀',
};

function getEnemyBadges(name: string): { label: string; color: string }[] {
  const n = name.toLowerCase();
  const badges: { label: string; color: string }[] = [];
  if (n.includes('cultista') || n.includes('wraith') || n.includes('shadow'))
    badges.push({ label: 'Shadow', color: 'rgba(155,89,182,0.8)' });
  if (n.includes('verme') || n.includes('gosma') || n.includes('slime'))
    badges.push({ label: 'Poison', color: 'rgba(46,204,113,0.8)' });
  if (n.includes('guardião') || n.includes('guardian') || n.includes('boss'))
    badges.push({ label: 'Elite', color: 'rgba(201,168,76,0.8)' });
  if (n.includes('piolho') || n.includes('louse') || n.includes('archer'))
    badges.push({ label: 'Swift', color: 'rgba(0,210,255,0.8)' });
  return badges;
}

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
  const badges = getEnemyBadges(enemy.name);

  useEffect(() => {
    if (enemy.hp < prevHp.current) {
      setFlashing(true);
      // Violent shake + recoil
      controls.start({
        x: [0, -14, 14, -10, 9, -6, 5, -3, 1, 0],
        y: [0, -4,   3,  -3, 2,  0,  0,  0, 0, 0],
        transition: { duration: 0.45, ease: 'easeInOut' },
      });
      setTimeout(() => setFlashing(false), 300);
    }
    prevHp.current = enemy.hp;
  }, [enemy.hp, controls]);

  return (
    <motion.div
      className={`enemy-container ${selected ? 'targeted' : ''}`}
      animate={controls}
      onClick={onClick}
      initial={{ opacity: 0, x: 60, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: entranceDelay }}
      whileHover={selected ? { scale: 1.06 } : { scale: 1.03 }}
    >
      {/* Name + HP + badges */}
      <div className="enemy-header">
        <h3 className="enemy-name">{enemy.name}</h3>
        <div className="enemy-hp-bar">
          <motion.div
            className="enemy-hp-fill"
            animate={{ width: `${hpPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ width: `${hpPercent}%` }}
          />
          <div className="enemy-hp-text">{enemy.hp}/{enemy.maxHp}</div>
        </div>
        {badges.length > 0 && (
          <div className="enemy-badges">
            {badges.map(b => (
              <span key={b.label} className="enemy-badge" style={{ borderColor: b.color, color: b.color }}>
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Art card */}
      <div className="enemy-card">
        {/* Intent bubble */}
        <motion.div
          className="enemy-intent-bubble"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="intent-icon">{intentIcons[enemy.intent]}</span>
          {enemy.intent === 'attack' && enemy.intentValue && (
            <span className="intent-value">{enemy.intentValue}</span>
          )}
        </motion.div>

        {/* Sprite */}
        <div className="enemy-sprite">{getSprite(enemy.name)}</div>

        {/* Block badge */}
        {enemy.block > 0 && (
          <motion.div
            className="enemy-block-shield"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <span className="block-value">{enemy.block}</span>
          </motion.div>
        )}

        {/* Statuses */}
        {Object.values(enemy.status).some(v => v > 0) && (
          <div className="enemy-stats">
            <div className="enemy-statuses">
              {enemy.status.burn       > 0 && <span className="status burn">🔥{enemy.status.burn}</span>}
              {enemy.status.poison     > 0 && <span className="status poison">☠️{enemy.status.poison}</span>}
              {enemy.status.weak       > 0 && <span className="status weak">💧{enemy.status.weak}</span>}
              {enemy.status.vulnerable > 0 && <span className="status vuln">🎯{enemy.status.vulnerable}</span>}
              {enemy.status.strength   > 0 && <span className="status str">💪{enemy.status.strength}</span>}
            </div>
          </div>
        )}

        {/* Hit flash overlay */}
        {flashing && (
          <motion.div
            className="hit-flash"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </motion.div>
  );
}
