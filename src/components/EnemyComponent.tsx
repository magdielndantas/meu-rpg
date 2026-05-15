import type { Enemy } from '../types';
import '../styles/enemy.css';

interface Props {
  enemy: Enemy;
  selected?: boolean;
  onClick?: () => void;
}

const intentLabel: Record<Enemy['intent'], string> = {
  attack: '⚔️ Atacar',
  defend: '🛡️ Defender',
  buff: '💪 Buff',
  debuff: '☠️ Debuff',
};

export default function EnemyComponent({ enemy, selected, onClick }: Props) {
  const hpPercent = Math.max(0, (enemy.hp / enemy.maxHp) * 100);

  return (
    <div
      className={`enemy ${selected ? 'targeted' : ''}`}
      onClick={onClick}
    >
      <div className="enemy-name">{enemy.name}</div>
      <div className="enemy-sprite">
        {enemy.name.includes('Cultista') && '🧙'}
        {enemy.name.includes('Verme') && '🐛'}
        {enemy.name.includes('Piolho') && '🦟'}
        {enemy.name.includes('Gosma') && '🫧'}
        {enemy.name.includes('Guardião') && '👹'}
      </div>

      <div className="enemy-hp-bar">
        <div className="enemy-hp-fill" style={{ width: `${hpPercent}%` }} />
      </div>
      <div className="enemy-hp-text">{enemy.hp}/{enemy.maxHp}</div>

      {enemy.block > 0 && (
        <div className="enemy-block">🛡️ {enemy.block}</div>
      )}

      <div className="enemy-intent">
        {intentLabel[enemy.intent]}
        {enemy.intent === 'attack' && enemy.intentValue && ` ${enemy.intentValue}`}
      </div>

      <div className="enemy-statuses">
        {enemy.status.burn > 0 && <span className="status burn">🔥{enemy.status.burn}</span>}
        {enemy.status.poison > 0 && <span className="status poison">☠️{enemy.status.poison}</span>}
        {enemy.status.weak > 0 && <span className="status weak">💧{enemy.status.weak}</span>}
        {enemy.status.vulnerable > 0 && <span className="status vuln">🎯{enemy.status.vulnerable}</span>}
        {enemy.status.strength > 0 && <span className="status str">💪{enemy.status.strength}</span>}
      </div>
    </div>
  );
}
