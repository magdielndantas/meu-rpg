import type { Player } from '../types';
import { getRelic } from '../game/relics';
import '../styles/player.css';

interface Props {
  player: Player;
}

export default function PlayerStats({ player }: Props) {
  const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);

  return (
    <div className="player-stats">

      {/* Hero portrait + name */}
      <div className="player-header">
        <div className="player-portrait">🧙</div>
        <div className="player-name">{player.name}</div>

        {/* Block badge (only when player has block) */}
        {player.block > 0 && (
          <div className="player-block">
            🛡️ {player.block}
          </div>
        )}
      </div>

      {/* Relics */}
      {player.relics.length > 0 && (
        <div className="player-relics">
          {player.relics.map(id => {
            const relic = getRelic(id);
            if (!relic) return null;
            return (
              <span key={id} className="relic-icon" title={`${relic.name}: ${relic.description}`}>
                {relic.icon}
              </span>
            );
          })}
        </div>
      )}

      {/* HP bar */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', fontFamily: 'var(--font-label)', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)' }}>
          <span>Vitals</span>
          <span style={{ color: '#fff' }}>{player.hp} / {player.maxHp}</span>
        </div>
        <div className="hp-bar-container">
          <div className="hp-bar-fill" style={{ width: `${hpPercent}%` }} />
          <span className="hp-text">{player.hp}/{player.maxHp} HP</span>
        </div>
      </div>

      {/* Mana / Energy */}
      <div className="mana-section">
        <span className="mana-label">Mana</span>
        <div className="energy-display">
          {Array.from({ length: player.maxEnergy }).map((_, i) => (
            <div key={i} className={`energy-orb ${i < player.energy ? 'full' : ''}`} />
          ))}
          <span className="energy-text">{player.energy}/{player.maxEnergy}</span>
        </div>
      </div>

      {/* Status effects */}
      <div className="player-statuses">
        {player.status.burn       > 0 && <span className="status burn">🔥 {player.status.burn}</span>}
        {player.status.poison     > 0 && <span className="status poison">☠️ {player.status.poison}</span>}
        {player.status.weak       > 0 && <span className="status weak">💧 {player.status.weak}</span>}
        {player.status.vulnerable > 0 && <span className="status vuln">🎯 {player.status.vulnerable}</span>}
        {player.status.strength   > 0 && <span className="status str">💪 {player.status.strength}</span>}
      </div>

    </div>
  );
}
