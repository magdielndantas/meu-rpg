import type { Enemy } from '../types';

function makeEnemy(
  id: string,
  name: string,
  hp: number,
  actions: Enemy['actions'],
): Enemy {
  return {
    id,
    name,
    hp,
    maxHp: hp,
    block: 0,
    status: { burn: 0, poison: 0, weak: 0, vulnerable: 0, strength: 0 },
    intent: actions[0].type,
    intentValue: actions[0].value,
    actions,
    actionIndex: 0,
  };
}

export function getEnemiesForFloor(floor: number): Enemy[] {
  if (floor === 1) {
    return [
      makeEnemy('cultist_1', 'Cultista', 50, [
        { type: 'attack', value: 6 },
        { type: 'attack', value: 6 },
        { type: 'buff', status: { effect: 'strength', stacks: 1 } },
      ]),
    ];
  }

  if (floor === 2) {
    return [
      makeEnemy('jaw_worm_1', 'Verme Mandíbula', 44, [
        { type: 'attack', value: 11 },
        { type: 'defend' },
        { type: 'attack', value: 7 },
        { type: 'defend' },
      ]),
    ];
  }

  if (floor === 3) {
    return [
      makeEnemy('louse_1', 'Piolho Verde', 38, [
        { type: 'attack', value: 5, times: 2 },
        { type: 'debuff', status: { effect: 'weak', stacks: 2 } },
      ]),
      makeEnemy('louse_2', 'Piolho Vermelho', 38, [
        { type: 'attack', value: 8 },
        { type: 'buff', status: { effect: 'strength', stacks: 1 } },
      ]),
    ];
  }

  if (floor === 4) {
    return [
      makeEnemy('slime_boss', 'Gosma Ácida', 70, [
        { type: 'attack', value: 14 },
        { type: 'debuff', status: { effect: 'vulnerable', stacks: 2 } },
        { type: 'attack', value: 10 },
        { type: 'defend' },
      ]),
    ];
  }

  // Boss
  return [
    makeEnemy('the_guardian', 'O Guardião', 120, [
      { type: 'attack', value: 18 },
      { type: 'defend' },
      { type: 'attack', value: 12, times: 2 },
      { type: 'buff', status: { effect: 'strength', stacks: 2 } },
    ]),
  ];
}
