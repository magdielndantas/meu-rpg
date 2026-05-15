import type { GameState, Player, Card, CombatLog, StatusEffect, GamePhase } from '../types';
import { getStarterDeck } from './cards';
import { getEnemiesForFloor } from './enemies';

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function log(state: GameState, message: string, type: CombatLog['type']): GameState {
  return {
    ...state,
    log: [{ id: uid(), message, type }, ...state.log].slice(0, 30),
  };
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function createInitialState(): GameState {
  const deck = getStarterDeck();
  const player: Player = {
    id: 'player',
    name: 'Herói',
    hp: 80,
    maxHp: 80,
    block: 0,
    status: { burn: 0, poison: 0, weak: 0, vulnerable: 0, strength: 0 },
    energy: 3,
    maxEnergy: 3,
    deck,
    hand: [],
    drawPile: shuffle(deck),
    discardPile: [],
    exhaustPile: [],
    gold: 0,
    relics: [],
  };

  const state: GameState = {
    phase: 'player_turn',
    player,
    enemies: getEnemiesForFloor(1),
    turn: 1,
    log: [],
    floor: 1,
    selectedCard: null,
  };

  return startPlayerTurn(state);
}

function drawCards(player: Player, count: number): Player {
  let p = { ...player };
  for (let i = 0; i < count; i++) {
    if (p.drawPile.length === 0) {
      if (p.discardPile.length === 0) break;
      p = { ...p, drawPile: shuffle(p.discardPile), discardPile: [] };
    }
    const [card, ...rest] = p.drawPile;
    p = { ...p, drawPile: rest, hand: [...p.hand, card] };
  }
  return p;
}

function startPlayerTurn(state: GameState): GameState {
  let player: Player = {
    ...state.player,
    block: 0,
    energy: state.player.maxEnergy,
  };
  player = drawCards(player, 5);

  // Advance enemy intents
  const enemies = state.enemies.map(e => {
    const nextIndex = (e.actionIndex + 1) % e.actions.length;
    const nextAction = e.actions[nextIndex];
    return {
      ...e,
      intent: nextAction.type,
      intentValue: nextAction.value,
    };
  });

  let s: GameState = { ...state, player, enemies, phase: 'player_turn' };
  s = log(s, `--- Turno ${state.turn} ---`, 'system');
  return s;
}

function applyDamage(target: { hp: number; block: number; status: { vulnerable: number } }, rawDamage: number): { hp: number; block: number; damage: number } {
  const isVulnerable = target.status.vulnerable > 0;
  const actualDamage = isVulnerable ? Math.floor(rawDamage * 1.5) : rawDamage;
  const blockedDamage = Math.min(target.block, actualDamage);
  const hpDamage = actualDamage - blockedDamage;
  return {
    block: target.block - blockedDamage,
    hp: target.hp - hpDamage,
    damage: actualDamage,
  };
}

export function playCard(state: GameState, cardId: string, targetId: string): GameState {
  const cardIndex = state.player.hand.findIndex(c => c.id === cardId);
  if (cardIndex === -1) return state;

  const card = state.player.hand[cardIndex];
  if (card.cost > state.player.energy) return state;

  let s = state;
  let player = { ...s.player };
  let enemies = [...s.enemies];
  const target = enemies.find(e => e.id === targetId);

  player.energy -= card.cost;
  player.hand = player.hand.filter((_, i) => i !== cardIndex);

  s = log(s, `Você jogou "${card.name}"`, 'card');

  for (const effect of card.effects) {
    // Block
    if (effect.block) {
      player.block += effect.block;
      s = log(s, `Ganhou ${effect.block} de Bloqueio`, 'block');
    }

    // Draw
    if (effect.draw) {
      player = drawCards(player, effect.draw);
      s = log(s, `Comprou ${effect.draw} carta(s)`, 'system');
    }

    // Energy
    if (effect.energy) {
      player.energy += effect.energy;
      s = log(s, `Ganhou ${effect.energy} de Energia`, 'system');
    }

    // Damage
    if (effect.damage && target) {
      let dmg = effect.damage + player.status.strength;

      // whirlwind: multiplier=2 means energy-based
      if (effect.multiplier === 2) {
        dmg = effect.damage * player.energy;
        player.energy = 0;
      }
      // power strike: multiplier=1 means strength bonus is already added
      if (effect.multiplier === 1) {
        dmg = effect.damage + player.status.strength * 4;
      }

      if (player.status.weak > 0) dmg = Math.floor(dmg * 0.75);

      const result = applyDamage(target, dmg);
      const idx = enemies.findIndex(e => e.id === targetId);
      enemies[idx] = { ...enemies[idx], hp: result.hp, block: result.block };
      s = log(s, `${target.name} recebeu ${result.damage} de dano`, 'damage');
    }

    // Apply status to enemy
    if (effect.applyStatus?.target === 'enemy' && target) {
      const idx = enemies.findIndex(e => e.id === targetId);
      const eff = effect.applyStatus.effect as keyof typeof target.status;
      enemies[idx] = {
        ...enemies[idx],
        status: { ...enemies[idx].status, [eff]: enemies[idx].status[eff] + effect.applyStatus.stacks },
      };
      s = log(s, `${target.name} recebeu ${effect.applyStatus.stacks}x ${statusLabel(effect.applyStatus.effect)}`, 'status');
    }

    // Apply status to self
    if (effect.applyStatus?.target === 'self') {
      const eff = effect.applyStatus.effect as keyof typeof player.status;
      player.status = { ...player.status, [eff]: player.status[eff] + effect.applyStatus.stacks };
      s = log(s, `Você ganhou ${effect.applyStatus.stacks}x ${statusLabel(effect.applyStatus.effect)}`, 'status');
    }
  }

  // Remove dead enemies
  enemies = enemies.filter(e => e.hp > 0);

  if (card.exhausts) {
    player.exhaustPile = [...player.exhaustPile, card];
  } else {
    player.discardPile = [...player.discardPile, card];
  }

  const newPhase: GamePhase = enemies.length === 0 ? 'victory' : s.phase;
  if (enemies.length === 0) {
    s = log(s, 'Todos os inimigos foram derrotados!', 'system');
  }

  return { ...s, player, enemies, selectedCard: null, phase: newPhase };
}

export function endTurn(state: GameState): GameState {
  if (state.phase !== 'player_turn') return state;

  let s = state;
  let player = { ...s.player };

  // Discard hand
  player.discardPile = [...player.discardPile, ...player.hand];
  player.hand = [];

  // Tick player statuses
  if (player.status.burn > 0) {
    player.hp -= player.status.burn;
    s = log(s, `Você recebeu ${player.status.burn} de dano de Queimadura`, 'damage');
    player.status = { ...player.status, burn: Math.max(0, player.status.burn - 1) };
  }
  if (player.status.weak > 0) {
    player.status = { ...player.status, weak: player.status.weak - 1 };
  }
  if (player.status.vulnerable > 0) {
    player.status = { ...player.status, vulnerable: player.status.vulnerable - 1 };
  }

  s = { ...s, player, phase: 'enemy_turn' };
  s = runEnemyTurn(s);
  return s;
}

function runEnemyTurn(state: GameState): GameState {
  let s = state;
  let player = { ...s.player, block: 0 };
  let enemies = s.enemies.map(e => ({ ...e, block: 0 }));

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const action = enemy.actions[enemy.actionIndex];

    if (action.type === 'attack') {
      const times = action.times ?? 1;
      for (let t = 0; t < times; t++) {
        let dmg = (action.value ?? 0) + enemy.status.strength;
        if (enemy.status.weak > 0) dmg = Math.floor(dmg * 0.75);
        const result = applyDamage(player, dmg);
        player = { ...player, hp: result.hp, block: result.block };
        s = log(s, `${enemy.name} causou ${result.damage} de dano`, 'damage');
      }
    } else if (action.type === 'defend') {
      const blockAmount = 8 + enemy.status.strength;
      enemies[i] = { ...enemies[i], block: enemies[i].block + blockAmount };
      s = log(s, `${enemy.name} ganhou ${blockAmount} de Bloqueio`, 'block');
    } else if (action.type === 'buff' && action.status) {
      const eff = action.status.effect as keyof typeof enemy.status;
      enemies[i] = {
        ...enemies[i],
        status: { ...enemies[i].status, [eff]: enemies[i].status[eff] + action.status.stacks },
      };
      s = log(s, `${enemy.name} ganhou ${action.status.stacks}x ${statusLabel(action.status.effect)}`, 'status');
    } else if (action.type === 'debuff' && action.status) {
      const eff = action.status.effect as keyof typeof player.status;
      player.status = { ...player.status, [eff]: player.status[eff] + action.status.stacks };
      s = log(s, `${enemy.name} aplicou ${action.status.stacks}x ${statusLabel(action.status.effect)} em você`, 'status');
    }

    // Tick enemy statuses
    if (enemies[i].status.poison > 0) {
      enemies[i] = { ...enemies[i], hp: enemies[i].hp - enemies[i].status.poison };
      s = log(s, `${enemies[i].name} recebeu ${enemies[i].status.poison} de dano de Veneno`, 'damage');
      enemies[i] = { ...enemies[i], status: { ...enemies[i].status, poison: Math.max(0, enemies[i].status.poison - 1) } };
    }
    if (enemies[i].status.burn > 0) {
      enemies[i] = { ...enemies[i], hp: enemies[i].hp - enemies[i].status.burn };
      s = log(s, `${enemies[i].name} recebeu ${enemies[i].status.burn} de dano de Queimadura`, 'damage');
      enemies[i] = { ...enemies[i], status: { ...enemies[i].status, burn: Math.max(0, enemies[i].status.burn - 1) } };
    }
    if (enemies[i].status.weak > 0) {
      enemies[i] = { ...enemies[i], status: { ...enemies[i].status, weak: enemies[i].status.weak - 1 } };
    }
    if (enemies[i].status.vulnerable > 0) {
      enemies[i] = { ...enemies[i], status: { ...enemies[i].status, vulnerable: enemies[i].status.vulnerable - 1 } };
    }

    // Advance action index
    enemies[i] = { ...enemies[i], actionIndex: (enemies[i].actionIndex + 1) % enemies[i].actions.length };
    const nextAction = enemies[i].actions[enemies[i].actionIndex];
    enemies[i] = { ...enemies[i], intent: nextAction.type, intentValue: nextAction.value };
  }

  // Remove dead enemies after ticks
  enemies = enemies.filter(e => e.hp > 0);

  const phase: GamePhase = player.hp <= 0 ? 'defeat' : enemies.length === 0 ? 'victory' : 'player_turn';

  if (player.hp <= 0) s = log(s, 'Você foi derrotado...', 'system');
  if (enemies.length === 0) s = log(s, 'Todos os inimigos foram derrotados!', 'system');

  s = { ...s, player, enemies, phase, turn: s.turn + 1 };

  if (phase === 'player_turn') {
    s = startPlayerTurn(s);
  }

  return s;
}

export function collectReward(state: GameState, card: Card | null): GameState {
  let player = { ...state.player };

  if (card) {
    player.deck = [...player.deck, card];
    player.discardPile = [...player.discardPile, card];
  }

  player.gold += 20 + state.floor * 5;

  const nextFloor = state.floor + 1;
  const enemies = getEnemiesForFloor(nextFloor);

  let s: GameState = {
    ...state,
    player,
    enemies,
    floor: nextFloor,
    turn: 1,
    phase: 'player_turn',
    log: [],
  };

  s = log(s, `Andar ${nextFloor} — Nova batalha começa!`, 'system');
  s = startPlayerTurn(s);
  return s;
}

function statusLabel(effect: StatusEffect): string {
  const labels: Record<StatusEffect, string> = {
    burn: 'Queimadura',
    poison: 'Veneno',
    weak: 'Fraqueza',
    vulnerable: 'Vulnerável',
    strength: 'Força',
    block: 'Bloqueio',
  };
  return labels[effect] ?? effect;
}
