import { useState, useCallback } from 'react';
import type { GameState, Card } from './types';
import { createInitialState, playCard, endTurn, collectReward } from './game/engine';
import CardComponent from './components/CardComponent';
import EnemyComponent from './components/EnemyComponent';
import PlayerStats from './components/PlayerStats';
import CombatLog from './components/CombatLog';
import RewardScreen from './components/RewardScreen';
import './App.css';

export default function App() {
  const [game, setGame] = useState<GameState>(() => createInitialState());
  const [showDeck, setShowDeck] = useState(false);

  const handleCardClick = useCallback((cardId: string) => {
    if (game.phase !== 'player_turn') return;

    if (game.selectedCard === cardId) {
      setGame(g => ({ ...g, selectedCard: null }));
      return;
    }

    if (game.enemies.length === 1) {
      setGame(g => playCard(g, cardId, game.enemies[0].id));
      return;
    }

    setGame(g => ({ ...g, selectedCard: cardId }));
  }, [game]);

  const handleEnemyClick = useCallback((enemyId: string) => {
    if (game.phase !== 'player_turn' || !game.selectedCard) return;
    setGame(g => playCard(g, g.selectedCard!, enemyId));
  }, [game]);

  const handleEndTurn = useCallback(() => {
    setGame(g => endTurn(g));
  }, []);

  const handleReward = useCallback((card: Card | null) => {
    setGame(g => collectReward(g, card));
  }, []);

  const handleRestart = useCallback(() => {
    setGame(createInitialState());
  }, []);

  if (game.phase === 'victory' && game.enemies.length === 0) {
    return <RewardScreen floor={game.floor} onSelect={handleReward} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>RPG Deck Builder</h1>
        <div className="floor-badge">Andar {game.floor}</div>
        <div className="turn-badge">Turno {game.turn}</div>
      </header>

      <div className="battlefield">
        <div className="player-side">
          <PlayerStats player={game.player} />
          <div className="pile-info">
            <span title="Compra">📚 {game.player.drawPile.length}</span>
            <span title="Descarte">🗑️ {game.player.discardPile.length}</span>
            <span title="Exausto">💨 {game.player.exhaustPile.length}</span>
            <button className="deck-btn" onClick={() => setShowDeck(v => !v)}>
              Deck ({game.player.deck.length})
            </button>
          </div>
        </div>

        <div className="center-panel">
          <CombatLog entries={game.log} />
        </div>

        <div className="enemy-side">
          {game.enemies.map(enemy => (
            <EnemyComponent
              key={enemy.id}
              enemy={enemy}
              selected={game.selectedCard !== null}
              onClick={() => handleEnemyClick(enemy.id)}
            />
          ))}
        </div>
      </div>

      <div className="hand-area">
        <div className="hand">
          {game.player.hand.map(card => (
            <CardComponent
              key={card.id}
              card={card}
              selected={game.selectedCard === card.id}
              disabled={game.phase !== 'player_turn' || card.cost > game.player.energy}
              onClick={() => handleCardClick(card.id)}
            />
          ))}
          {game.player.hand.length === 0 && game.phase === 'player_turn' && (
            <div className="empty-hand">Mão vazia — encerre o turno</div>
          )}
        </div>

        {game.phase === 'player_turn' && (
          <button className="end-turn-btn" onClick={handleEndTurn}>
            Encerrar Turno
          </button>
        )}

        {game.phase === 'enemy_turn' && (
          <div className="enemy-turn-indicator">Turno do Inimigo...</div>
        )}

        {game.phase === 'defeat' && (
          <div className="game-over">
            <h2>Você foi derrotado!</h2>
            <button onClick={handleRestart}>Jogar Novamente</button>
          </div>
        )}
      </div>

      {showDeck && (
        <div className="deck-overlay" onClick={() => setShowDeck(false)}>
          <div className="deck-modal" onClick={e => e.stopPropagation()}>
            <h3>Seu Deck ({game.player.deck.length} cartas)</h3>
            <div className="deck-cards">
              {game.player.deck.map((card, i) => (
                <CardComponent key={`${card.id}_${i}`} card={card} small />
              ))}
            </div>
            <button onClick={() => setShowDeck(false)}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}
