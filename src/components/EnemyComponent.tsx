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
  buff: '✨',
  debuff: '💀',
};

export default function EnemyComponent({ enemy, selected, onClick }: Props) {
  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);
  const [isShaking, setIsShaking] = useState(false);
  const prevHp = useRef(enemy.hp);

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
      <div className="enemy-intent-bubble">
        <span className="intent-icon">{intentIcons[enemy.intent]}</span>
        {enemy.intent === 'attack' && enemy.intentValue && (
          <span className="intent-value">{enemy.intentValue}</span>
        )}
      </div>

      <div className="enemy-card">
        <div className="enemy-name">{enemy.name}</div>
        <div className="enemy-sprite">
          {enemy.name.includes('Cultista') && '🧙'}
          {enemy.name.includes('Verme') && '🐛'}
          {enemy.name.includes('Piolho') && '🦟'}
          {enemy.name.includes('Gosma') && '🫧'}
          {enemy.name.includes('Guardião') && '👹'}
        </div>

        <div className="enemy-stats">
          <div className="enemy-hp-bar">
            <div className="enemy-hp-fill" style={{ width: `${hpPercent}%` }} />
            <div className="enemy-hp-text">{enemy.hp}/{enemy.maxHp}</div>
          </div>
          
          {enemy.block > 0 && (
            <div className="enemy-block-shield">
              <span className="block-icon">🛡️</span>
              <span className="block-value">{enemy.block}</span>
            </div>
          )}
        </div>

        <div className="enemy-statuses">
          {enemy.status.burn > 0 && <span className="status burn">🔥{enemy.status.burn}</span>}
          {enemy.status.poison > 0 && <span className="status poison">☠️{enemy.status.poison}</span>}
          {enemy.status.weak > 0 && <span className="status weak">💧{enemy.status.weak}</span>}
          {enemy.status.vulnerable > 0 && <span className="status vuln">🎯{enemy.status.vulnerable}</span>}
          {enemy.status.strength > 0 && <span className="status str">💪{enemy.status.strength}</span>}
        </div>
      </div>
      
      {isShaking && <div className="hit-flash"></div>}
    </div>
  );
}
