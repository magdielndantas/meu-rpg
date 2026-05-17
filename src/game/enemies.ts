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
    status: { burn: 0, poison: 0, weak: 0, vulnerable: 0, strength: 0, bleed: 0, regenerate: 0 },
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
      ],
      // New early enemies
      () => [makeEnemy('small_slime', 'Gosma Pequena', 35, [
        { type: 'attack', value: 6 },
        { type: 'debuff', status: { effect: 'weak', stacks: 1 } },
        { type: 'attack', value: 6 },
      ])],
      () => [
        makeEnemy('bat_1', 'Morcego Sombrio', 28, [
          { type: 'attack', value: 5, times: 2 },
          { type: 'attack', value: 8 },
        ]),
        makeEnemy('bat_2', 'Morcego Ancião', 28, [
          { type: 'attack', value: 7 },
          { type: 'debuff', status: { effect: 'vulnerable', stacks: 1 } },
        ]),
      ],
      () => [makeEnemy('fungus_beast', 'Besta Fungo', 46, [
        { type: 'attack', value: 7 },
        { type: 'buff', status: { effect: 'strength', stacks: 2 } },
        { type: 'debuff', status: { effect: 'weak', stacks: 2 } },
      ])],
      () => [makeEnemy('spiky_slug', 'Lesma Espinhosa', 42, [
        { type: 'attack', value: 9 },
        { type: 'defend' },
        { type: 'debuff', status: { effect: 'vulnerable', stacks: 2 } },
      ])],
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
      ])],
      // New mid enemies
      () => [makeEnemy('flame_knight', 'Cavaleiro Chamas', 72, [
        { type: 'debuff', status: { effect: 'burn', stacks: 2 } },
        { type: 'attack', value: 12 },
        { type: 'buff', status: { effect: 'strength', stacks: 2 } },
        { type: 'attack', value: 12 },
      ])],
      () => [makeEnemy('stone_golem', 'Golem de Pedra', 95, [
        { type: 'defend' },
        { type: 'attack', value: 16 },
        { type: 'defend' },
        { type: 'attack', value: 16 },
      ])],
      () => [makeEnemy('poison_witch', 'Bruxa Venenosa', 62, [
        { type: 'debuff', status: { effect: 'poison', stacks: 5 } },
        { type: 'attack', value: 9 },
        { type: 'debuff', status: { effect: 'vulnerable', stacks: 2 } },
        { type: 'attack', value: 9 },
      ])],
      () => [
        makeEnemy('gremlin_a', 'Gremlin Selvagem', 35, [
          { type: 'attack', value: 8 },
          { type: 'buff', status: { effect: 'strength', stacks: 1 } },
        ]),
        makeEnemy('gremlin_b', 'Gremlin Mago', 35, [
          { type: 'debuff', status: { effect: 'weak', stacks: 2 } },
          { type: 'attack', value: 6 },
        ]),
        makeEnemy('gremlin_c', 'Gremlin Gordo', 35, [
          { type: 'attack', value: 5, times: 2 },
          { type: 'defend' },
        ]),
      ],
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
      ])],
      // New late enemies
      () => [makeEnemy('blood_cultist', 'Cultista Sanguinário', 88, [
        { type: 'buff', status: { effect: 'strength', stacks: 2 } },
        { type: 'attack', value: 15 },
        { type: 'debuff', status: { effect: 'bleed', stacks: 3 } },
        { type: 'attack', value: 15 },
      ])],
      () => [makeEnemy('iron_construct', 'Construto de Ferro', 130, [
        { type: 'defend' },
        { type: 'defend' },
        { type: 'attack', value: 20 },
        { type: 'buff', status: { effect: 'strength', stacks: 2 } },
      ])],
      () => [makeEnemy('dark_mage', 'Mago Sombrio', 80, [
        { type: 'debuff', status: { effect: 'vulnerable', stacks: 3 } },
        { type: 'debuff', status: { effect: 'bleed', stacks: 2 } },
        { type: 'attack', value: 14 },
        { type: 'attack', value: 14 },
      ])],
      () => [makeEnemy('shadow_hydra', 'Hidra das Sombras', 150, [
        { type: 'attack', value: 12, times: 2 },
        { type: 'buff', status: { effect: 'regenerate', stacks: 8 } },
        { type: 'attack', value: 10, times: 3 },
        { type: 'debuff', status: { effect: 'weak', stacks: 2 } },
      ])],
      () => [
        makeEnemy('wraith_1', 'Espectro Antigo', 75, [
          { type: 'attack', value: 11 },
          { type: 'debuff', status: { effect: 'vulnerable', stacks: 2 } },
          { type: 'attack', value: 11 },
        ]),
        makeEnemy('wraith_2', 'Espectro Sombrio', 75, [
          { type: 'debuff', status: { effect: 'weak', stacks: 2 } },
          { type: 'attack', value: 9 },
          { type: 'buff', status: { effect: 'strength', stacks: 2 } },
        ]),
      ],
      () => [makeEnemy('skeleton_army', 'Exército Esqueleto', 110, [
        { type: 'attack', value: 5, times: 5 },
        { type: 'buff', status: { effect: 'strength', stacks: 1 } },
        { type: 'attack', value: 5, times: 6 },
        { type: 'defend' },
      ])],
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
      { type: 'debuff', status: { effect: 'bleed', stacks: 3 } },
    ]),
  ];
}
