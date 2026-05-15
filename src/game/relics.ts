import { Relic } from '../types';

export const ALL_RELICS: Record<string, Relic> = {
  'vampiric_blood': {
    id: 'vampiric_blood',
    name: 'Sangue de Vampiro',
    description: 'Cura 3 HP no início de cada combate.',
    icon: '🩸',
    effect: {
      trigger: 'onCombatStart',
      action: (state) => {
        const newHp = Math.min(state.player.maxHp, state.player.hp + 3);
        return {
          ...state,
          player: { ...state.player, hp: newHp },
          log: [{ 
            id: Math.random().toString(36).slice(2, 9), 
            message: 'Sangue de Vampiro curou 3 HP', 
            type: 'heal' 
          }, ...state.log].slice(0, 30)
        };
      }
    }
  },
  'training_weight': {
    id: 'training_weight',
    name: 'Peso de Treino',
    description: 'Comece cada combate com 1 de Força.',
    icon: '🏋️',
    effect: {
      trigger: 'onCombatStart',
      action: (state) => {
        return {
          ...state,
          player: { 
            ...state.player, 
            status: { ...state.player.status, strength: state.player.status.strength + 1 } 
          },
          log: [{ 
            id: Math.random().toString(36).slice(2, 9), 
            message: 'Peso de Treino concedeu 1 de Força', 
            type: 'status' 
          }, ...state.log].slice(0, 30)
        };
      }
    }
  },
  'energy_ring': {
    id: 'energy_ring',
    name: 'Anel Energético',
    description: 'Ganhe 1 de Energia extra no início de cada turno.',
    icon: '💍',
    effect: {
      trigger: 'onTurnStart',
      action: (state) => {
        return {
          ...state,
          player: { ...state.player, energy: state.player.energy + 1 },
          log: [{ 
            id: Math.random().toString(36).slice(2, 9), 
            message: 'Anel Energético concedeu 1 de Energia', 
            type: 'system' 
          }, ...state.log].slice(0, 30)
        };
      }
    }
  }
};

export function getRelic(id: string): Relic | undefined {
  return ALL_RELICS[id];
}

export function getRandomRelic(): Relic {
  const keys = Object.keys(ALL_RELICS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return ALL_RELICS[randomKey];
}
