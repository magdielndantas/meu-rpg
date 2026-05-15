import type { Card } from '../types';

export const ALL_CARDS: Card[] = [
  // === ATTACK CARDS ===
  {
    id: 'strike',
    name: 'Golpe',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    description: 'Causa 6 de dano.',
    effects: [{ damage: 6 }],
  },
  {
    id: 'heavy_blow',
    name: 'Golpe Pesado',
    type: 'attack',
    rarity: 'common',
    cost: 2,
    description: 'Causa 14 de dano.',
    effects: [{ damage: 14 }],
  },
  {
    id: 'twin_strike',
    name: 'Golpe Duplo',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    description: 'Causa 5 de dano duas vezes.',
    effects: [{ damage: 5 }, { damage: 5 }],
  },
  {
    id: 'burning_slash',
    name: 'Corte Flamejante',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    description: 'Causa 8 de dano. Aplica 2 de Queimadura.',
    effects: [{ damage: 8 }, { applyStatus: { effect: 'burn', stacks: 2, target: 'enemy' } }],
  },
  {
    id: 'poison_blade',
    name: 'Lâmina Venenosa',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    description: 'Causa 5 de dano. Aplica 3 de Veneno.',
    effects: [{ damage: 5 }, { applyStatus: { effect: 'poison', stacks: 3, target: 'enemy' } }],
  },
  {
    id: 'weak_slash',
    name: 'Corte Enfraquecedor',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    description: 'Causa 5 de dano. Aplica Fraqueza por 2 turnos.',
    effects: [{ damage: 5 }, { applyStatus: { effect: 'weak', stacks: 2, target: 'enemy' } }],
  },
  {
    id: 'expose',
    name: 'Expor',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    description: 'Causa 4 de dano. Aplica Vulnerável por 2 turnos.',
    effects: [{ damage: 4 }, { applyStatus: { effect: 'vulnerable', stacks: 2, target: 'enemy' } }],
  },
  {
    id: 'power_strike',
    name: 'Golpe Poderoso',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    description: 'Causa 10 de dano. +4 de dano para cada Força.',
    effects: [{ damage: 10 }, { damage: 4, multiplier: 1 }],
  },
  {
    id: 'whirlwind',
    name: 'Redemoinho',
    type: 'attack',
    rarity: 'rare',
    cost: 0,
    description: 'Causa 5 de dano por cada ponto de Energia restante. Gasta toda a energia.',
    effects: [{ damage: 5, multiplier: 2 }],
  },

  // === SKILL CARDS ===
  {
    id: 'defend',
    name: 'Defender',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    description: 'Ganha 5 de Bloqueio.',
    effects: [{ block: 5 }],
  },
  {
    id: 'iron_wave',
    name: 'Onda de Ferro',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    description: 'Ganha 5 de Bloqueio. Causa 5 de dano.',
    effects: [{ block: 5 }, { damage: 5 }],
  },
  {
    id: 'fortify',
    name: 'Fortalecer',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    description: 'Ganha 12 de Bloqueio.',
    effects: [{ block: 12 }],
  },
  {
    id: 'draw_cards',
    name: 'Concentração',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    description: 'Compra 2 cartas.',
    effects: [{ draw: 2 }],
  },
  {
    id: 'battle_trance',
    name: 'Transe de Batalha',
    type: 'skill',
    rarity: 'uncommon',
    cost: 0,
    description: 'Compra 3 cartas. Não pode comprar mais cartas neste turno.',
    effects: [{ draw: 3 }],
    exhausts: true,
  },
  {
    id: 'adrenaline',
    name: 'Adrenalina',
    type: 'skill',
    rarity: 'rare',
    cost: 0,
    description: 'Ganha 1 de Energia. Compra 2 cartas. Exaure.',
    effects: [{ energy: 1 }, { draw: 2 }],
    exhausts: true,
  },

  // === POWER CARDS ===
  {
    id: 'demon_form',
    name: 'Forma Demoníaca',
    type: 'power',
    rarity: 'rare',
    cost: 3,
    description: 'Ganha 2 de Força permanentemente por turno.',
    effects: [{ applyStatus: { effect: 'strength', stacks: 2, target: 'self' } }],
  },
  {
    id: 'flex',
    name: 'Flexionar',
    type: 'power',
    rarity: 'common',
    cost: 0,
    description: 'Ganha 2 de Força. Perde 2 de Força no final do turno.',
    effects: [{ applyStatus: { effect: 'strength', stacks: 2, target: 'self' } }],
    exhausts: true,
  },
];

export function getStarterDeck(): Card[] {
  const starterIds = [
    'strike', 'strike', 'strike', 'strike', 'strike',
    'defend', 'defend', 'defend', 'defend', 'defend',
  ];
  return starterIds.map((id, i) => ({
    ...ALL_CARDS.find(c => c.id === id)!,
    id: `${id}_${i}`,
  }));
}

export function getRewardCards(count = 3): Card[] {
  const pool = ALL_CARDS.filter(c => c.rarity !== 'rare' || Math.random() < 0.3);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((c, i) => ({ ...c, id: `${c.id}_reward_${i}` }));
}
