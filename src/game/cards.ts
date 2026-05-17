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
  {
    id: 'cleave',
    name: 'Fender',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    description: 'Causa 8 de dano a todos os inimigos.',
    effects: [{ damage: 8 }],
    isAoE: true,
  },
  {
    id: 'body_slam',
    name: 'Pancada Corporal',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    description: 'Causa dano igual ao seu Bloqueio atual.',
    effects: [{ damage: 0, multiplier: 3 }], // Multiplier 3 for block-based damage
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
    id: 'shrug_it_off',
    name: 'Dar de Ombros',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    description: 'Ganha 8 de Bloqueio. Compra 1 carta.',
    effects: [{ block: 8 }, { draw: 1 }],
  },
  {
    id: 'impervious',
    name: 'Impenetrável',
    type: 'skill',
    rarity: 'rare',
    cost: 2,
    description: 'Ganha 30 de Bloqueio. Exaure.',
    effects: [{ block: 30 }],
    exhausts: true,
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

  // === NEW ATTACK CARDS ===
  {
    id: 'blood_slash',
    name: 'Corte Sangrento',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    description: 'Causa 7 de dano. Aplica 2 de Sangramento.',
    effects: [{ damage: 7 }, { applyStatus: { effect: 'bleed', stacks: 2, target: 'enemy' } }],
  },
  {
    id: 'dagger',
    name: 'Punhal',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    description: 'Causa 9 de dano.',
    effects: [{ damage: 9 }],
  },
  {
    id: 'swift_cut',
    name: 'Corte Ágil',
    type: 'attack',
    rarity: 'common',
    cost: 1,
    description: 'Causa 5 de dano. Compra 1 carta.',
    effects: [{ damage: 5 }, { draw: 1 }],
  },
  {
    id: 'blade_dance',
    name: 'Dança das Lâminas',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    description: 'Causa 4 de dano três vezes.',
    effects: [{ damage: 4 }, { damage: 4 }, { damage: 4 }],
  },
  {
    id: 'infernal_blow',
    name: 'Golpe Infernal',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    description: 'Causa 10 de dano. Aplica 3 de Queimadura.',
    effects: [{ damage: 10 }, { applyStatus: { effect: 'burn', stacks: 3, target: 'enemy' } }],
  },
  {
    id: 'double_cut',
    name: 'Corte Duplo',
    type: 'attack',
    rarity: 'uncommon',
    cost: 1,
    description: 'Causa 6 de dano. Aplica 1 de Vulnerável e 1 de Fraqueza.',
    effects: [
      { damage: 6 },
      { applyStatus: { effect: 'vulnerable', stacks: 1, target: 'enemy' } },
      { applyStatus: { effect: 'weak', stacks: 1, target: 'enemy' } },
    ],
  },
  {
    id: 'execution',
    name: 'Execução',
    type: 'attack',
    rarity: 'rare',
    cost: 3,
    description: 'Causa 35 de dano. Exaure.',
    effects: [{ damage: 35 }],
    exhausts: true,
  },
  {
    id: 'void_slash',
    name: 'Corte do Vazio',
    type: 'attack',
    rarity: 'rare',
    cost: 2,
    description: 'Causa 18 de dano. Aplica 3 de Vulnerável.',
    effects: [{ damage: 18 }, { applyStatus: { effect: 'vulnerable', stacks: 3, target: 'enemy' } }],
  },
  {
    id: 'thunder_strike',
    name: 'Golpe Trovão',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    description: 'Causa 14 de dano. Etéreo.',
    effects: [{ damage: 14 }],
    ethereal: true,
  },
  {
    id: 'crushing_blow',
    name: 'Golpe Esmagador',
    type: 'attack',
    rarity: 'uncommon',
    cost: 2,
    description: 'Causa 16 de dano. Aplica 2 de Vulnerável.',
    effects: [{ damage: 16 }, { applyStatus: { effect: 'vulnerable', stacks: 2, target: 'enemy' } }],
  },

  // === NEW SKILL CARDS ===
  {
    id: 'heal_wounds',
    name: 'Curar Feridas',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    description: 'Recupera 12 de HP. Exaure.',
    effects: [{ heal: 12 }],
    exhausts: true,
  },
  {
    id: 'meditate',
    name: 'Meditar',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    description: 'Recupera 6 de HP. Exaure.',
    effects: [{ heal: 6 }],
    exhausts: true,
  },
  {
    id: 'bandage_up',
    name: 'Curativo',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    description: 'Recupera 4 de HP. Exaure.',
    effects: [{ heal: 4 }],
    exhausts: true,
  },
  {
    id: 'taunt',
    name: 'Provocar',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    description: 'Aplica 2 de Vulnerável ao inimigo.',
    effects: [{ applyStatus: { effect: 'vulnerable', stacks: 2, target: 'enemy' } }],
  },
  {
    id: 'swift_step',
    name: 'Passo Rápido',
    type: 'skill',
    rarity: 'common',
    cost: 0,
    description: 'Compra 2 cartas. Exaure.',
    effects: [{ draw: 2 }],
    exhausts: true,
  },
  {
    id: 'second_wind',
    name: 'Segundo Fôlego',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    description: 'Recupera 5 de HP. Compra 1 carta. Exaure.',
    effects: [{ heal: 5 }, { draw: 1 }],
    exhausts: true,
  },
  {
    id: 'guard',
    name: 'Guardar',
    type: 'skill',
    rarity: 'common',
    cost: 1,
    description: 'Ganha 7 de Bloqueio. Reter.',
    effects: [{ block: 7 }],
    retain: true,
  },
  {
    id: 'offering',
    name: 'Oferta',
    type: 'skill',
    rarity: 'rare',
    cost: 0,
    description: 'Aplica 3 de Queimadura em si mesmo. Compra 3 cartas. Exaure.',
    effects: [
      { applyStatus: { effect: 'burn', stacks: 3, target: 'self' } },
      { draw: 3 },
    ],
    exhausts: true,
  },
  {
    id: 'entrench',
    name: 'Entrincheirar',
    type: 'skill',
    rarity: 'uncommon',
    cost: 2,
    description: 'Ganha 14 de Bloqueio.',
    effects: [{ block: 14 }],
  },
  {
    id: 'war_cry',
    name: 'Grito de Guerra',
    type: 'skill',
    rarity: 'uncommon',
    cost: 1,
    description: 'Compra 2 cartas. Ganha 1 de Força. Exaure.',
    effects: [{ draw: 2 }, { applyStatus: { effect: 'strength', stacks: 1, target: 'self' } }],
    exhausts: true,
  },

  // === NEW POWER CARDS ===
  {
    id: 'regeneration',
    name: 'Regeneração',
    type: 'power',
    rarity: 'uncommon',
    cost: 1,
    description: 'Regenera 4 de HP no início de cada turno.',
    effects: [{ applyStatus: { effect: 'regenerate', stacks: 4, target: 'self' } }],
  },
  {
    id: 'strength_training',
    name: 'Treinamento',
    type: 'power',
    rarity: 'common',
    cost: 1,
    description: 'Ganha 2 de Força permanentemente.',
    effects: [{ applyStatus: { effect: 'strength', stacks: 2, target: 'self' } }],
  },
  {
    id: 'battle_cry',
    name: 'Grito de Batalha',
    type: 'power',
    rarity: 'uncommon',
    cost: 2,
    description: 'Ganha 3 de Força. Aplica 2 de Vulnerável ao inimigo.',
    effects: [
      { applyStatus: { effect: 'strength', stacks: 3, target: 'self' } },
      { applyStatus: { effect: 'vulnerable', stacks: 2, target: 'enemy' } },
    ],
  },
  {
    id: 'enrage',
    name: 'Enraivecer',
    type: 'power',
    rarity: 'rare',
    cost: 0,
    description: 'Aplica 4 de Sangramento ao inimigo. Ganha 2 de Força. Exaure.',
    effects: [
      { applyStatus: { effect: 'bleed', stacks: 4, target: 'enemy' } },
      { applyStatus: { effect: 'strength', stacks: 2, target: 'self' } },
    ],
    exhausts: true,
  },
  {
    id: 'cursed_form',
    name: 'Forma Amaldiçoada',
    type: 'power',
    rarity: 'rare',
    cost: 2,
    description: 'Ganha 3 de Força. Aplica 4 de Queimadura em si mesmo. Exaure.',
    effects: [
      { applyStatus: { effect: 'strength', stacks: 3, target: 'self' } },
      { applyStatus: { effect: 'burn', stacks: 4, target: 'self' } },
    ],
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

export function upgradeCard(card: Card): Card {
  const upgraded: Card = {
    ...card,
    name: `${card.name}+`,
    upgraded: true,
  };

  // Manual upgrades for specific cards or general rules
  switch (card.id.split('_')[0]) {
    case 'strike':
      upgraded.description = 'Causa 9 de dano.';
      upgraded.effects = [{ damage: 9 }];
      break;
    case 'defend':
      upgraded.description = 'Ganha 8 de Bloqueio.';
      upgraded.effects = [{ block: 8 }];
      break;
    case 'heavy_blow':
      upgraded.description = 'Causa 20 de dano.';
      upgraded.effects = [{ damage: 20 }];
      break;
    case 'burning_slash':
      upgraded.description = 'Causa 10 de dano. Aplica 3 de Queimadura.';
      upgraded.effects = [{ damage: 10 }, { applyStatus: { effect: 'burn', stacks: 3, target: 'enemy' } }];
      break;
    case 'poison_blade':
      upgraded.description = 'Causa 7 de dano. Aplica 5 de Veneno.';
      upgraded.effects = [{ damage: 7 }, { applyStatus: { effect: 'poison', stacks: 5, target: 'enemy' } }];
      break;
    case 'fortify':
      upgraded.description = 'Ganha 16 de Bloqueio.';
      upgraded.effects = [{ block: 16 }];
      break;
    case 'body_slam':
      upgraded.cost = 0;
      break;
    case 'shrug_it_off':
      upgraded.description = 'Ganha 11 de Bloqueio. Compra 1 carta.';
      upgraded.effects = [{ block: 11 }, { draw: 1 }];
      break;
    case 'flex':
      upgraded.description = 'Ganha 4 de Força. Perde 4 de Força no final do turno.';
      upgraded.effects = [{ applyStatus: { effect: 'strength', stacks: 4, target: 'self' } }];
      break;
    default:
      // General scaling for others
      upgraded.effects = card.effects.map(e => ({
        ...e,
        damage: e.damage ? Math.floor(e.damage * 1.5) : undefined,
        block: e.block ? Math.floor(e.block * 1.5) : undefined,
        draw: e.draw ? e.draw + 1 : undefined,
      }));
      upgraded.description = `${card.description} (Aprimorada)`;
  }

  return upgraded;
}
