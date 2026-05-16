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
  // Early Floors (1-3)
  if (floor <= 3) {
    const pool = [
      () => [makeEnemy('cultist_1', 'Cultista', 50, [
        { type: 'attack', value: 6 },
        { type: 'attack', value: 6 },
        { type: 'buff', status: { effect: 'strength', stacks: 1 } },
      ])],
      () => [makeEnemy('jaw_worm_1', 'Verme Mandíbula', 44, [
        { type: 'attack', value: 11 },
        { type: 'defend' },
        { type: 'attack', value: 7 },
        { type: 'defend' },
      ])],
      () => [
        makeEnemy('louse_1', 'Piolho Verde', 38, [
          { type: 'attack', value: 5, times: 2 },
          { type: 'debuff', status: { effect: 'weak', stacks: 2 } },
        ]),
        makeEnemy('louse_2', 'Piolho Vermelho', 38, [
          { type: 'attack', value: 8 },
          { type: 'buff', status: { effect: 'strength', stacks: 1 } },
        ]),
      ]
    ];
    return pool[Math.floor(Math.random() * pool.length)]();
  }

  // Mid Floors (4-7)
  if (floor <= 7) {
    const pool = [
      () => [makeEnemy('slime_m', 'Gosma Ácida M', 65, [
        { type: 'attack', value: 12 },
        { type: 'debuff', status: { effect: 'vulnerable', stacks: 2 } },
        { type: 'attack', value: 10 },
        { type: 'defend' },
      ])],
      () => [
        makeEnemy('sentry_1', 'Sentinela Alpha', 40, [
          { type: 'attack', value: 10 },
          { type: 'debuff', status: { effect: 'weak', stacks: 1 } },
        ]),
        makeEnemy('sentry_2', 'Sentinela Beta', 40, [
          { type: 'attack', value: 10 },
          { type: 'buff', status: { effect: 'strength', stacks: 1 } },
        ])
      ],
      () => [makeEnemy('gremlin_nob', 'Nobre Gremlin', 82, [
        { type: 'attack', value: 14 },
        { type: 'attack', value: 6, times: 3 },
        { type: 'buff', status: { effect: 'strength', stacks: 2 } },
      ])]
    ];
    return pool[Math.floor(Math.random() * pool.length)]();
  }

  // Late Floors (8-14)
  if (floor < 15) {
    const pool = [
      () => [makeEnemy('spheric_guardian', 'Guardião Esférico', 100, [
        { type: 'defend' },
        { type: 'attack', value: 10, times: 2 },
        { type: 'debuff', status: { effect: 'vulnerable', stacks: 3 } },
      ])],
      () => [
        makeEnemy('cultist_adv', 'Cultista Avançado', 75, [
          { type: 'buff', status: { effect: 'strength', stacks: 3 } },
          { type: 'attack', value: 12 },
          { type: 'attack', value: 12 },
        ]),
        makeEnemy('cultist_adv_2', 'Iniciado', 50, [
          { type: 'attack', value: 8 },
          { type: 'debuff', status: { effect: 'weak', stacks: 2 } },
        ])
      ],
      () => [makeEnemy('book_of_stabbing', 'Livro das Facadas', 160, [
        { type: 'attack', value: 7, times: 4 },
        { type: 'attack', value: 7, times: 5 },
        { type: 'attack', value: 7, times: 6 },
      ])]
    ];
    return pool[Math.floor(Math.random() * pool.length)]();
  }

  // Final Boss (Floor 15)
  return [
    makeEnemy('the_awakened_one', 'O Desperto', 320, [
      { type: 'attack', value: 20 },
      { type: 'attack', value: 6, times: 4 },
      { type: 'buff', status: { effect: 'strength', stacks: 4 } },
      { type: 'defend' },
      { type: 'debuff', status: { effect: 'vulnerable', stacks: 2 } },
    ]),
  ];
}
