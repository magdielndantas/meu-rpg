import { motion } from 'framer-motion';
import type { Player } from '../types';
import '../styles/player.css';

interface Props { player: Player; }

export default function PlayerStats({ player }: Props) {
  const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);

  return (
    <div className="hero-figure">
      {/* Block badge — floating top-right of sprite */}
      {player.block > 0 && (
        <motion.div
          className="hero-block-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          🛡️ {player.block}
        </motion.div>
      )}

      {/* Large sprite */}
      <motion.div
        className="hero-sprite"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        🧙
      </motion.div>

      {/* Shadow under sprite */}
      <div className="hero-shadow" />

      {/* Name */}
      <div className="hero-name">{player.name}</div>

      {/* HP bar */}
      <div className="hero-hp-wrap">
        <div className="hero-hp-bar">
          <motion.div
            className="hero-hp-fill"
            animate={{ width: `${hpPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          <span className="hero-hp-text">❤️ {player.hp}/{player.maxHp}</span>
        </div>
      </div>

      {/* Status effects */}
      {Object.values(player.status).some(v => v > 0) && (
        <div className="hero-statuses">
          {player.status.burn       > 0 && <span className="status burn">🔥{player.status.burn}</span>}
          {player.status.poison     > 0 && <span className="status poison">☠️{player.status.poison}</span>}
          {player.status.weak       > 0 && <span className="status weak">💧{player.status.weak}</span>}
          {player.status.vulnerable > 0 && <span className="status vuln">🎯{player.status.vulnerable}</span>}
          {player.status.strength   > 0 && <span className="status str">💪{player.status.strength}</span>}
        </div>
      )}
    </div>
  );
}
