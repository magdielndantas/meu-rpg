export type CardType = 'attack' | 'skill' | 'power';
export type CardRarity = 'common' | 'uncommon' | 'rare';
export type StatusEffect = 'burn' | 'poison' | 'weak' | 'vulnerable' | 'strength' | 'block';

export interface CardEffect {
  damage?: number;
  block?: number;
  draw?: number;
  energy?: number;
  applyStatus?: { effect: StatusEffect; stacks: number; target: 'enemy' | 'self' };
  multiplier?: number; // multiplies damage by stacks of a status
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  description: string;
  effects: CardEffect[];
  upgraded?: boolean;
  exhausts?: boolean;
}

export interface StatusState {
  burn: number;
  poison: number;
  weak: number;
  vulnerable: number;
  strength: number;
}

export interface Combatant {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  block: number;
  status: StatusState;
}

export interface Player extends Combatant {
  energy: number;
  maxEnergy: number;
  deck: Card[];
  hand: Card[];
  drawPile: Card[];
  discardPile: Card[];
  exhaustPile: Card[];
  gold: number;
  relics: string[];
}

export type EnemyIntent = 'attack' | 'defend' | 'buff' | 'debuff';

export interface Enemy extends Combatant {
  intent: EnemyIntent;
  intentValue?: number;
  actions: EnemyAction[];
  actionIndex: number;
}

export interface EnemyAction {
  type: EnemyIntent;
  value?: number;
  status?: { effect: StatusEffect; stacks: number };
  times?: number;
}

export type GamePhase = 'player_turn' | 'enemy_turn' | 'victory' | 'defeat' | 'reward' | 'map';

export interface CombatLog {
  id: string;
  message: string;
  type: 'damage' | 'block' | 'heal' | 'status' | 'card' | 'system';
}

export interface GameState {
  phase: GamePhase;
  player: Player;
  enemies: Enemy[];
  turn: number;
  log: CombatLog[];
  floor: number;
  selectedCard: string | null;
}
