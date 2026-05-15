import type { Player } from '../types';
import '../styles/player.css';

interface Props {
  player: Player;
}

export default function PlayerStats({ player }: Props) {
  const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);

  return (
    <div className="player-stats">
      <div className="player-name">{player.name}</div>

      <div className="hp-bar-container">
        <div className="hp-bar-fill" style={{ width: `${hpPercent}%` }} />
        <span className="hp-text">{player.hp}/{player.maxHp} HP</span>
      </div>

      {player.block > 0 && (
        <div className="player-block">🛡️ {player.block}</div>
      )}

      <div className="energy-display">
        {Array.from({ length: player.maxEnergy }).map((_, i) => (
          <div key={i} className={`energy-orb ${i < player.energy ? 'full' : 'empty'}`} />
        ))}
        <span className="energy-text">{player.energy}/{player.maxEnergy}</span>
      </div>

      <div className="player-statuses">
        {player.status.burn > 0 && <span className="status burn">🔥{player.status.burn}</span>}
        {player.status.poison > 0 && <span className="status poison">☠️{player.status.poison}</span>}
        {player.status.weak > 0 && <span className="status weak">💧{player.status.weak}</span>}
        {player.status.vulnerable > 0 && <span className="status vuln">🎯{player.status.vulnerable}</span>}
        {player.status.strength > 0 && <span className="status str">💪{player.status.strength}</span>}
      </div>
    </div>
  );
}
