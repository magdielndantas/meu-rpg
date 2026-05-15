import type { CombatLog as LogEntry } from '../types';
import '../styles/log.css';

interface Props {
  entries: LogEntry[];
}

export default function CombatLog({ entries }: Props) {
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
