// Sprite registry — add entries here after uploading PNGs to public/sprites/
//
// SETUP GUIDE — Kenney "1-Bit Pack" (free, CC0):
//   Download: https://kenney.nl/assets/1-bit-pack
//   Extract and copy desired PNGs to public/sprites/enemies/ and public/sprites/hero/
//   Then uncomment the relevant lines below.
//
// Suggested filename mapping from the 1-Bit Pack:
//   tile_0120.png → wizard (hero)
//   tile_0122.png → skeleton (general enemy)
//   tile_0116.png → ghost / wraith
//   tile_0108.png → slime
//   tile_0110.png → worm
//   tile_0114.png → bat
//   tile_0098.png → golem / construct
//   tile_0100.png → orc / gremlin
//   tile_0104.png → mushroom / fungus
//   tile_0106.png → lizard / cultist
//   tile_0112.png → knight
//   tile_0096.png → dragon (boss)
//   tile_0102.png → witch / mage

export const ENEMY_SPRITES: Record<string, string> = {
  // Uncomment and adjust after uploading sprites:
  // 'Cultista':           '/sprites/enemies/cultist.png',
  // 'Verme Mandíbula':    '/sprites/enemies/worm.png',
  // 'Piolho Verde':       '/sprites/enemies/slime.png',
  // 'Piolho Vermelho':    '/sprites/enemies/slime.png',
  // 'Gosma Ácida M':      '/sprites/enemies/slime.png',
  // 'Gosma Pequena':      '/sprites/enemies/slime.png',
  // 'Morcego Sombrio':    '/sprites/enemies/bat.png',
  // 'Morcego Ancião':     '/sprites/enemies/bat.png',
  // 'Besta Fungo':        '/sprites/enemies/mushroom.png',
  // 'Lesma Espinhosa':    '/sprites/enemies/slime.png',
  // 'Sentinela Alpha':    '/sprites/enemies/knight.png',
  // 'Sentinela Beta':     '/sprites/enemies/knight.png',
  // 'Nobre Gremlin':      '/sprites/enemies/orc.png',
  // 'Gremlin Selvagem':   '/sprites/enemies/orc.png',
  // 'Gremlin Mago':       '/sprites/enemies/orc.png',
  // 'Gremlin Gordo':      '/sprites/enemies/orc.png',
  // 'Cavaleiro Chamas':   '/sprites/enemies/knight.png',
  // 'Golem de Pedra':     '/sprites/enemies/golem.png',
  // 'Bruxa Venenosa':     '/sprites/enemies/witch.png',
  // 'Guardião Esférico':  '/sprites/enemies/golem.png',
  // 'Cultista Avançado':  '/sprites/enemies/cultist.png',
  // 'Iniciado':           '/sprites/enemies/cultist.png',
  // 'Cultista Sanguinário': '/sprites/enemies/cultist.png',
  // 'Construto de Ferro': '/sprites/enemies/golem.png',
  // 'Mago Sombrio':       '/sprites/enemies/witch.png',
  // 'Hidra das Sombras':  '/sprites/enemies/dragon.png',
  // 'Espectro Antigo':    '/sprites/enemies/ghost.png',
  // 'Espectro Sombrio':   '/sprites/enemies/ghost.png',
  // 'Livro das Facadas':  '/sprites/enemies/witch.png',
  // 'Exército Esqueleto': '/sprites/enemies/skeleton.png',
  // 'O Desperto':         '/sprites/enemies/dragon.png',
};

// Hero sprite — set after uploading
export const HERO_SPRITE = '';
// export const HERO_SPRITE = '/sprites/hero/wizard.png';

// Sprite display size in pixels (adjust to your asset size)
export const SPRITE_SIZE = 96;
