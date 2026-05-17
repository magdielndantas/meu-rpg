import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GameState, Card } from './types';
import { createInitialState, playCard, endTurn, collectReward, selectNode, restHeal, restUpgrade, buyCard, removeCard, leaveShop } from './game/engine';
import CardComponent from './components/CardComponent';
import EnemyComponent from './components/EnemyComponent';
import PlayerStats from './components/PlayerStats';
import CombatLog from './components/CombatLog';
import RewardScreen from './components/RewardScreen';
import MapScreen from './components/MapScreen';
import RestScreen from './components/RestScreen';
import ShopScreen from './components/ShopScreen';
import { getRelic } from './game/relics';
import { play, setMuted } from './audio/sounds';
import './App.css';
import './styles/floating-text.css';

interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'damage' | 'block' | 'heal' | 'status';
}

/* ── Hand fan helpers ─────────────────────────────────────── */
function handRotate(idx: number, total: number): number {
  if (total <= 1) return 0;
  const half = (total - 1) / 2;
  const spread = total <= 3 ? 7 : total <= 5 ? 6 : 4;
  return (idx - half) * spread;
}
function handOffsetY(idx: number, total: number): number {
  if (total <= 1) return 0;
  const half = (total - 1) / 2;
  const t = Math.abs((idx - half) / half);
  return t * t * 26;
}

const screenIn  = { opacity: 1, y: 0 };
const screenOut  = { opacity: 0, y: -8 };
const screenInit = { opacity: 0, y: 12 };
const screenTransition = { duration: 0.28, ease: 'easeOut' as const };

export default function App() {
  const [game, setGame] = useState<GameState>(() => createInitialState());
  const [showDeck, setShowDeck] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [playedCard, setPlayedCard] = useState<Card | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const prevPlayerRef = useRef(game.player);
  const prevEnemiesRef = useRef(game.enemies);
  const prevPhaseRef = useRef(game.phase);
  const prevHandLengthRef = useRef(game.player.hand.length);

  const addFloatingText = useCallback((text: string, x: number, y: number, type: FloatingText['type']) => {
    const id = Math.random().toString(36).slice(2, 9);
    setFloatingTexts(prev => [...prev, { id, text, x, y, type }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1100);
  }, []);

  // Floating text + damage sounds
  useEffect(() => {
    const p = game.player;
    const prevP = prevPlayerRef.current;
    if (p.hp < prevP.hp) { addFloatingText(`-${prevP.hp - p.hp}`, 200, 400, 'damage'); play('playerHit'); }
    if (p.hp > prevP.hp) { addFloatingText(`+${p.hp - prevP.hp}`, 200, 400, 'heal');   play('heal'); }
    if (p.block > prevP.block) { addFloatingText(`+${p.block - prevP.block}`, 200, 350, 'block'); play('block'); }

    game.enemies.forEach(e => {
      const prevE = prevEnemiesRef.current.find(pe => pe.id === e.id);
      if (prevE) {
        if (e.hp < prevE.hp) { addFloatingText(`-${prevE.hp - e.hp}`, 800, 300, 'damage'); play('enemyHit'); }
        if (e.block > prevE.block) { addFloatingText(`+${e.block - prevE.block}`, 800, 250, 'block'); play('block'); }
      }
    });

    prevPlayerRef.current = p;
    prevEnemiesRef.current = game.enemies;
  }, [game.player, game.enemies, addFloatingText]);

  // Phase change sounds
  useEffect(() => {
    const prev = prevPhaseRef.current;
    const curr = game.phase;
    if (prev === curr) return;
    prevPhaseRef.current = curr;
    if (curr === 'player_turn') play('turnStart');
    else if (curr === 'enemy_turn') play('enemyTurn');
    else if (curr === 'victory') play('victory');
    else if (curr === 'defeat') play('defeat');
    else if (curr === 'rest') play('restEnter');
  }, [game.phase]);

  // Card deal sound — when hand grows (new cards drawn)
  useEffect(() => {
    const prev = prevHandLengthRef.current;
    const curr = game.player.hand.length;
    if (curr > prev) {
      const added = curr - prev;
      for (let i = 0; i < added; i++) {
        setTimeout(() => play('cardDraw'), i * 80);
      }
    }
    prevHandLengthRef.current = curr;
  }, [game.player.hand.length]);

  const handleCardClick = useCallback((cardId: string) => {
    if (game.phase !== 'player_turn' || playedCard) return;
    if (game.selectedCard === cardId) {
      setGame(g => ({ ...g, selectedCard: null }));
      return;
    }
    const card = game.player.hand.find(c => c.id === cardId);
    if (!card) return;
    const needsTarget = !card.isAoE && card.effects.some(e =>
      e.damage !== undefined || (e.applyStatus?.target === 'enemy')
    );
    if (!needsTarget || game.enemies.length === 1) {
      const targetId = needsTarget ? game.enemies[0].id : '';
      play(card.type === 'attack' ? 'cardAttack' : card.type === 'power' ? 'cardPower' : 'cardSkill');
      setPlayedCard(card);
      setTimeout(() => {
        setGame(g => playCard(g, cardId, targetId));
        setPlayedCard(null);
      }, 560);
      return;
    }
    setGame(g => ({ ...g, selectedCard: cardId }));
  }, [game, playedCard]);

  const handleEnemyClick = useCallback((enemyId: string) => {
    if (game.phase !== 'player_turn' || !game.selectedCard || playedCard) return;
    const card = game.player.hand.find(c => c.id === game.selectedCard);
    if (!card) return;
    play(card.type === 'attack' ? 'cardAttack' : card.type === 'power' ? 'cardPower' : 'cardSkill');
    setPlayedCard(card);
    setTimeout(() => {
      setGame(g => playCard(g, g.selectedCard!, enemyId));
      setPlayedCard(null);
    }, 560);
  }, [game, playedCard]);

  const handleEndTurn    = useCallback(() => { play('endTurn'); setGame(g => endTurn(g)); }, []);
  const handleReward     = useCallback((card: Card | null) => setGame(g => collectReward(g, card)), []);
  const handleSelectNode = useCallback((nodeId: string) => { play('nodeSelect'); setGame(g => selectNode(g, nodeId)); }, []);
  const handleHeal       = useCallback(() => { play('heal'); setGame(g => restHeal(g)); }, []);
  const handleUpgrade    = useCallback((cardId: string) => { play('cardSkill'); setGame(g => restUpgrade(g, cardId)); }, []);
  const handleBuyCard    = useCallback((cardId: string) => { play('shopBuy'); setGame(g => buyCard(g, cardId)); }, []);
  const handleRemoveCard = useCallback((cardId: string) => setGame(g => removeCard(g, cardId)), []);
  const handleLeaveShop  = useCallback(() => setGame(g => leaveShop(g)), []);
  const handleRestart    = useCallback(() => setGame(createInitialState()), []);

  const deckOverlay = showDeck && (
    <motion.div
      className="deck-overlay"
      onClick={() => setShowDeck(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="deck-modal"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <h3>Seu Deck ({game.player.deck.length} cartas)</h3>
        <div className="deck-cards">
          {game.player.deck.map((card, i) => (
            <CardComponent key={`${card.id}_${i}`} card={card} small />
          ))}
        </div>
        <button onClick={() => setShowDeck(false)}>Fechar</button>
      </motion.div>
    </motion.div>
  );

  /* ── MAP ──────────────────────────────────────────────────── */
  if (game.phase === 'map') {
    return (
      <AnimatePresence mode="wait">
        <motion.div className="app app--map" key="map" initial={screenInit} animate={screenIn} exit={screenOut} transition={screenTransition}>
          <header className="app-header">
            <h1>Shadow Realm Chronicles</h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {game.player.relics.map(id => {
                const relic = getRelic(id);
                if (!relic) return null;
                return (
                  <motion.span key={id} className="relic-icon" title={`${relic.name}: ${relic.description}`}
                    whileHover={{ scale: 1.25, boxShadow: '0 0 12px rgba(201,168,76,0.6)' }}
                    style={{ width: 32, height: 32, borderRadius: 4, background: 'rgba(18,18,30,0.8)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: 'var(--arcane-gold)', cursor: 'help' }}
                  >
                    {relic.icon}
                  </motion.span>
                );
              })}
            </div>
            <div className="player-overview">
              <span>❤️ {game.player.hp}/{game.player.maxHp}</span>
              <span>💰 {game.player.gold}</span>
              <button className="deck-btn" style={{ width: 'auto', padding: '4px 14px' }} onClick={() => setShowDeck(v => !v)}>
                Deck ({game.player.deck.length})
              </button>
              <button className="mute-btn" title={isMuted ? 'Ativar sons' : 'Silenciar'} onClick={() => { setIsMuted(m => { setMuted(!m); return !m; }); }}>
                {isMuted ? '🔇' : '🔊'}
              </button>
            </div>
          </header>
          <div className="map-phase-content">
            <MapScreen state={game} onSelectNode={handleSelectNode} />
          </div>
          <AnimatePresence>{deckOverlay}</AnimatePresence>
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ── REST ─────────────────────────────────────────────────── */
  if (game.phase === 'rest') {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="rest" initial={screenInit} animate={screenIn} exit={screenOut} transition={screenTransition} style={{ width: '100%', height: '100%' }}>
          <RestScreen player={game.player} onHeal={handleHeal} onUpgrade={handleUpgrade} />
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ── SHOP ─────────────────────────────────────────────────── */
  if (game.phase === 'shop' && game.shopItems) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="shop" initial={screenInit} animate={screenIn} exit={screenOut} transition={screenTransition} style={{ width: '100%', height: '100%' }}>
          <ShopScreen player={game.player} shopItems={game.shopItems} onBuyCard={handleBuyCard} onRemoveCard={handleRemoveCard} onLeave={handleLeaveShop} />
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ── VICTORY / REWARD ─────────────────────────────────────── */
  if (game.phase === 'victory' && game.enemies.length === 0) {
    return (
      <AnimatePresence mode="wait">
        <motion.div key="reward" initial={screenInit} animate={screenIn} exit={screenOut} transition={screenTransition} style={{ width: '100%', height: '100%' }}>
          <RewardScreen floor={game.floor} relicId={game.relicReward} onSelect={handleReward} />
        </motion.div>
      </AnimatePresence>
    );
  }

  /* ── COMBAT ───────────────────────────────────────────────── */
  return (
    <AnimatePresence mode="wait">
      <motion.div className="app" key="combat" initial={screenInit} animate={screenIn} exit={screenOut} transition={screenTransition}>

        {/* Floating damage / heal text */}
        <div className="floating-text-container">
          <AnimatePresence>
            {floatingTexts.map(t => (
              <motion.div
                key={t.id}
                className={`floating-text ${t.type}`}
                style={{ left: t.x, top: t.y }}
                initial={{ opacity: 1, y: 0, scale: 0.4, x: '-50%' }}
                animate={{ opacity: [1, 1, 0], y: -130, scale: [1.5, 1.1, 0.9], x: '-50%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, times: [0, 0.15, 1], ease: 'easeOut' }}
              >
                {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Card slam animation */}
        <AnimatePresence>
          {playedCard && (
            <motion.div
              className="card-slam-overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.35 } }}
            >
              <motion.div
                initial={{ scale: 0.3, y: 160, rotateX: 25, opacity: 0.8 }}
                animate={{ scale: [0.3, 1.35, 1.5], y: [160, -20, 0], rotateX: [25, -4, 0], opacity: [0.8, 1, 1] }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              >
                <CardComponent card={playedCard} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP BAR */}
        <header className="app-header">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {game.player.relics.map(id => {
              const relic = getRelic(id);
              if (!relic) return null;
              return (
                <motion.span key={id} title={`${relic.name}: ${relic.description}`}
                  whileHover={{ scale: 1.2, boxShadow: '0 0 10px rgba(201,168,76,0.5)' }}
                  style={{ width: 32, height: 32, borderRadius: 4, background: 'rgba(18,18,30,0.8)', border: '1px solid rgba(201,168,76,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', cursor: 'help' }}
                >
                  {relic.icon}
                </motion.span>
              );
            })}
            {game.player.relics.length === 0 && (
              <span style={{ fontSize: '0.65rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(201,168,76,0.3)', fontFamily: 'var(--font-label)' }}>
                Sem relíquias
              </span>
            )}
          </div>
          <h1 style={{ marginLeft: 16 }}>Shadow Realm Chronicles</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span className="floor-badge">Andar {game.floor}</span>
            <span className="turn-badge">Turno {game.turn}</span>
            <button className="mute-btn" title={isMuted ? 'Ativar sons' : 'Silenciar'} onClick={() => { setIsMuted(m => { setMuted(!m); return !m; }); }}>
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>
        </header>

        {/* BATTLEFIELD */}
        <div className="battlefield">

          {/* Atmospheric particles */}
          <div className="battle-ambience" aria-hidden="true">
            {[
              { left: '8%',  delay: 0,   dur: 6.2 },
              { left: '18%', delay: 1.4, dur: 5.1 },
              { left: '30%', delay: 0.6, dur: 7.4 },
              { left: '42%', delay: 2.8, dur: 5.8 },
              { left: '56%', delay: 1.0, dur: 6.8 },
              { left: '68%', delay: 3.5, dur: 4.9 },
              { left: '78%', delay: 0.3, dur: 7.1 },
              { left: '88%', delay: 2.2, dur: 5.5 },
            ].map((p, i) => (
              <div key={i} className="ember" style={{ left: p.left, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s` }} />
            ))}
            <div className="battlefield-fog" />
          </div>

          {/* Top info bar: pile counts + compact log */}
          <div className="battlefield-info">
            <span style={{ fontSize:'0.65rem', letterSpacing:'2px', textTransform:'uppercase', color:'rgba(201,168,76,0.4)', fontFamily:'var(--font-label)' }}>
              📚 {game.player.drawPile.length} &nbsp; 🗑️ {game.player.discardPile.length} &nbsp; 💨 {game.player.exhaustPile.length}
            </span>
            <CombatLog entries={game.log} compact />
          </div>

          {/* Scene: hero left, enemies right */}
          <div className="battlefield-scene">
            <div className="hero-zone">
              <PlayerStats player={game.player} />
            </div>
            <div className="enemy-zone">
              {game.enemies.map((enemy, i) => (
                <EnemyComponent
                  key={enemy.id}
                  enemy={enemy}
                  selected={game.selectedCard !== null}
                  onClick={() => handleEnemyClick(enemy.id)}
                  entranceDelay={i * 0.12}
                />
              ))}
            </div>
          </div>
        </div>

        {/* HAND AREA */}
        <div className="hand-area">
          {/* Energy */}
          <div className="hand-energy">
            <span className="hand-energy-label">Mana</span>
            <div className="hand-energy-orbs">
              {Array.from({ length: game.player.maxEnergy }).map((_, i) => (
                <div key={i} className={`energy-orb ${i < game.player.energy ? 'full' : ''}`} />
              ))}
            </div>
            <span className="hand-energy-count">{game.player.energy}/{game.player.maxEnergy}</span>
          </div>

          {/* Cards */}
          <div className="hand">
            <AnimatePresence>
              {game.player.hand.map((card, idx) => (
                <motion.div
                  key={card.id}
                  className="card-wrapper"
                  style={{ transformOrigin: 'bottom center', zIndex: idx + 10 }}
                  initial={{ opacity: 0, y: 140, rotate: 0 }}
                  animate={{
                    opacity: 1,
                    y: handOffsetY(idx, game.player.hand.length),
                    rotate: handRotate(idx, game.player.hand.length),
                  }}
                  exit={{ opacity: 0, y: 120, scale: 0.8, transition: { duration: 0.25 } }}
                  whileHover={game.phase === 'player_turn' ? {
                    y: -78, rotate: 0, scale: 1.08, zIndex: 1000,
                    transition: { type: 'spring', stiffness: 380, damping: 22 },
                  } : {}}
                  transition={{ type: 'spring', stiffness: 260, damping: 24, delay: idx * 0.07 }}
                >
                  <CardComponent
                    card={card}
                    selected={game.selectedCard === card.id}
                    disabled={game.phase !== 'player_turn' || card.cost > game.player.energy}
                    onClick={() => handleCardClick(card.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {game.player.hand.length === 0 && game.phase === 'player_turn' && (
              <motion.div className="empty-hand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                Mão vazia — encerre o turno
              </motion.div>
            )}
          </div>

          {/* Pile info */}
          <div className="hand-piles">
            <div className="pile-count"><span>📚</span><span>Compra</span><strong>{game.player.drawPile.length}</strong></div>
            <div className="pile-count"><span>🗑️</span><span>Descarte</span><strong>{game.player.discardPile.length}</strong></div>
            <div className="pile-count"><span>💨</span><span>Exausto</span><strong>{game.player.exhaustPile.length}</strong></div>
            <button className="deck-btn" onClick={() => setShowDeck(v => !v)}>
              Deck ({game.player.deck.length})
            </button>
          </div>
        </div>

        {/* END TURN / ENEMY TURN */}
        <AnimatePresence mode="wait">
          {game.phase === 'player_turn' && (
            <motion.button
              key="end-turn"
              className="end-turn-btn"
              onClick={handleEndTurn}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            >
              Encerrar Turno
            </motion.button>
          )}
          {game.phase === 'enemy_turn' && (
            <motion.div
              key="enemy-turn"
              className="enemy-turn-indicator"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              Turno do Inimigo...
            </motion.div>
          )}
        </AnimatePresence>

        {/* DEFEAT */}
        <AnimatePresence>
          {game.phase === 'defeat' && (
            <motion.div
              className="game-over"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.h2
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 16 }}
              >
                Você foi derrotado!
              </motion.h2>
              <motion.button
                onClick={handleRestart}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Jogar Novamente
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* DECK OVERLAY */}
        <AnimatePresence>{deckOverlay}</AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
