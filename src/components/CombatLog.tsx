import type { CombatLog as LogEntry } from '../types';
import '../styles/log.css';

interface Props {
  entries: LogEntry[];
  compact?: boolean;
}

export default function CombatLog({ entries, compact }: Props) {
  if (compact) {
    const last3 = entries.slice(-3);
    return (
      <div className="combat-log-compact">
        {last3.map(entry => (
          <span key={entry.id} className={`log-entry-compact log-${entry.type}`}>
            {entry.message}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="combat-log">
      {entries.map(entry => (
        <div key={entry.id} className={`log-entry log-${entry.type}`}>
          {entry.message}
        </div>
      ))}
    </div>
  );
}
