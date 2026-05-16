import { useEffect, useState, useRef } from 'react';
import type { Enemy } from '../types';
import '../styles/enemy.css';

interface Props {
  enemy: Enemy;
  selected?: boolean;
  onClick?: () => void;
}

const intentIcons: Record<Enemy['intent'], string> = {
  attack: '⚔️',
  defend: '🛡️',
  buff:   '✨',
  debuff: '💀',
};

/** Derive elemental / personality badges from enemy name keywords. */
function getEnemyBadges(name: string): { label: string; color: string }[] {
  const n = name.toLowerCase();
  const badges: { label: string; color: string }[] = [];
  if (n.includes('cultista') || n.includes('wraith') || n.includes('shadow')) {
    badges.push({ label: 'Shadow', color: 'rgba(155,89,182,0.8)' });
  }
  if (n.includes('verme') || n.includes('gosma') || n.includes('slime')) {
    badges.push({ label: 'Poison', color: 'rgba(46,204,113,0.8)' });
  }
  if (n.includes('guardião') || n.includes('guardian') || n.includes('boss')) {
    badges.push({ label: 'Elite', color: 'rgba(201,168,76,0.8)' });
  }
  if (n.includes('piolho') || n.includes('louse') || n.includes('archer')) {
    badges.push({ label: 'Swift', color: 'rgba(0,210,255,0.8)' });
  }
  return badges;
}

/** Pick a large emoji sprite based on the enemy name. */
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

export default function EnemyComponent({ enemy, selected, onClick }: Props) {
  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const [isShaking, setIsShaking] = useState(false);
  const prevHp = useRef(enemy.hp);
  const badges = getEnemyBadges(enemy.name);

  useEffect(() => {
    if (enemy.hp < prevHp.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 500);
      prevHp.current = enemy.hp;
      return () => clearTimeout(timer);
    }
    prevHp.current = enemy.hp;
  }, [enemy.hp]);

  return (
    <div
      className={`enemy-container ${selected ? 'targeted' : ''} ${isShaking ? 'shake' : ''}`}
      onClick={onClick}
    >
      {/* Name + HP bar + badges — above the art */}
      <div className="enemy-header">
        <h3 className="enemy-name">{enemy.name}</h3>

        <div className="enemy-hp-bar">
          <div className="enemy-hp-fill" style={{ width: `${hpPercent}%` }} />
          <div className="enemy-hp-text">{enemy.hp}/{enemy.maxHp}</div>
        </div>

        {badges.length > 0 && (
          <div className="enemy-badges">
            {badges.map(b => (
              <span
                key={b.label}
                className="enemy-badge"
                style={{ borderColor: b.color, color: b.color }}
              >
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Art card with floating intent icon */}
      <div className="enemy-card">
        {/* Floating intent bubble */}
        <div className="enemy-intent-bubble">
          <span className="intent-icon">{intentIcons[enemy.intent]}</span>
          {enemy.intent === 'attack' && enemy.intentValue && (
            <span className="intent-value">{enemy.intentValue}</span>
          )}
        </div>

        {/* Sprite */}
        <div className="enemy-sprite">{getSprite(enemy.name)}</div>

        {/* Block badge */}
        {enemy.block > 0 && (
          <div className="enemy-block-shield">
            <span className="block-value">{enemy.block}</span>
          </div>
        )}

        {/* Status row */}
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
      </div>

      {isShaking && <div className="hit-flash"></div>}
    </div>
  );
}
