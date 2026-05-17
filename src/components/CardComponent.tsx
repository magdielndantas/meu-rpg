import { motion } from 'framer-motion';
import type { Card } from '../types';
import '../styles/card.css';

interface Props {
  card: Card;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  small?: boolean;
  layoutId?: string;
}

interface CardArt { ra: string; gradient: string }

const CARD_ART: Record<string, CardArt> = {
  // attacks
  strike:            { ra: 'ra-sword',            gradient: 'linear-gradient(160deg, #1a0505 0%, #3d0808 55%, #1a0505 100%)' },
  heavy_blow:        { ra: 'ra-axe-swing',         gradient: 'linear-gradient(160deg, #1a0a00 0%, #4a1500 55%, #200a00 100%)' },
  twin_strike:       { ra: 'ra-crossed-swords',    gradient: 'linear-gradient(160deg, #1a0505 0%, #4d0808 55%, #1a0505 100%)' },
  burning_slash:     { ra: 'ra-fireball-sword',    gradient: 'linear-gradient(160deg, #200500 0%, #5a1200 55%, #3a0800 100%)' },
  poison_blade:      { ra: 'ra-dripping-sword',    gradient: 'linear-gradient(160deg, #001a00 0%, #0a3d0a 55%, #001500 100%)' },
  weak_slash:        { ra: 'ra-droplets',          gradient: 'linear-gradient(160deg, #000510 0%, #000d2a 55%, #000510 100%)' },
  expose:            { ra: 'ra-cracked-shield',    gradient: 'linear-gradient(160deg, #1a0a00 0%, #3d1500 55%, #2a0a00 100%)' },
  power_strike:      { ra: 'ra-broadsword',        gradient: 'linear-gradient(160deg, #1a0800 0%, #4a2000 55%, #3a1000 100%)' },
  whirlwind:         { ra: 'ra-dervish-swords',    gradient: 'linear-gradient(160deg, #050510 0%, #0a1030 55%, #050510 100%)' },
  cleave:            { ra: 'ra-crossed-axes',      gradient: 'linear-gradient(160deg, #1a0505 0%, #4a0a0a 55%, #200505 100%)' },
  body_slam:         { ra: 'ra-muscle-fat',        gradient: 'linear-gradient(160deg, #100a05 0%, #2a1808 55%, #180f05 100%)' },
  blood_slash:       { ra: 'ra-bleeding-eye',      gradient: 'linear-gradient(160deg, #1a0008 0%, #500018 55%, #2a0010 100%)' },
  dagger:            { ra: 'ra-daggers',           gradient: 'linear-gradient(160deg, #0a0a0a 0%, #252525 55%, #151515 100%)' },
  swift_cut:         { ra: 'ra-diving-dagger',     gradient: 'linear-gradient(160deg, #050a1a 0%, #0d1540 55%, #050a1a 100%)' },
  blade_dance:       { ra: 'ra-spinning-sword',    gradient: 'linear-gradient(160deg, #1a051a 0%, #3d0a3d 55%, #280528 100%)' },
  infernal_blow:     { ra: 'ra-fire-breath',       gradient: 'linear-gradient(160deg, #200500 0%, #601800 55%, #400a00 100%)' },
  double_cut:        { ra: 'ra-bat-sword',         gradient: 'linear-gradient(160deg, #0f0f0f 0%, #252020 55%, #181515 100%)' },
  execution:         { ra: 'ra-death-skull',       gradient: 'linear-gradient(160deg, #0a0000 0%, #200000 55%, #150000 100%)' },
  void_slash:        { ra: 'ra-cloak-and-dagger',  gradient: 'linear-gradient(160deg, #050505 0%, #0a0810 55%, #080808 100%)' },
  thunder_strike:    { ra: 'ra-lightning-sword',   gradient: 'linear-gradient(160deg, #050a1a 0%, #0f1845 55%, #050a1a 100%)' },
  crushing_blow:     { ra: 'ra-hammer-drop',       gradient: 'linear-gradient(160deg, #0a0808 0%, #201a18 55%, #151010 100%)' },
  // skills
  defend:            { ra: 'ra-shield',            gradient: 'linear-gradient(160deg, #000a18 0%, #001838 55%, #000a18 100%)' },
  shrug_it_off:      { ra: 'ra-round-shield',      gradient: 'linear-gradient(160deg, #050a15 0%, #0a1530 55%, #050a15 100%)' },
  impervious:        { ra: 'ra-heavy-shield',      gradient: 'linear-gradient(160deg, #050a0a 0%, #0f2020 55%, #050a0a 100%)' },
  iron_wave:         { ra: 'ra-droplet-splash',    gradient: 'linear-gradient(160deg, #000508 0%, #000e20 55%, #000508 100%)' },
  fortify:           { ra: 'ra-bolt-shield',       gradient: 'linear-gradient(160deg, #050a0a 0%, #0a1818 55%, #050a0a 100%)' },
  draw_cards:        { ra: 'ra-book',              gradient: 'linear-gradient(160deg, #0a0805 0%, #1e1610 55%, #120e08 100%)' },
  battle_trance:     { ra: 'ra-crystal-ball',      gradient: 'linear-gradient(160deg, #0a051a 0%, #1e0a3d 55%, #0f052a 100%)' },
  adrenaline:        { ra: 'ra-lightning-bolt',    gradient: 'linear-gradient(160deg, #080d1a 0%, #121530 55%, #080d1a 100%)' },
  heal_wounds:       { ra: 'ra-health-increase',   gradient: 'linear-gradient(160deg, #001a08 0%, #003d15 55%, #001a08 100%)' },
  meditate:          { ra: 'ra-health',            gradient: 'linear-gradient(160deg, #001508 0%, #002e14 55%, #001508 100%)' },
  bandage_up:        { ra: 'ra-health-increase',   gradient: 'linear-gradient(160deg, #001208 0%, #002510 55%, #001208 100%)' },
  taunt:             { ra: 'ra-broken-shield',     gradient: 'linear-gradient(160deg, #1a0a00 0%, #3a1a00 55%, #280e00 100%)' },
  swift_step:        { ra: 'ra-feathered-wing',    gradient: 'linear-gradient(160deg, #000515 0%, #000d30 55%, #000515 100%)' },
  second_wind:       { ra: 'ra-feather-wing',      gradient: 'linear-gradient(160deg, #000815 0%, #001028 55%, #000815 100%)' },
  guard:             { ra: 'ra-eye-shield',        gradient: 'linear-gradient(160deg, #000a18 0%, #001838 55%, #000a18 100%)' },
  offering:          { ra: 'ra-bubbling-potion',   gradient: 'linear-gradient(160deg, #1a0808 0%, #3d1010 55%, #2a0808 100%)' },
  entrench:          { ra: 'ra-rune-stone',        gradient: 'linear-gradient(160deg, #050a08 0%, #101a18 55%, #050a08 100%)' },
  war_cry:           { ra: 'ra-wolf-howl',         gradient: 'linear-gradient(160deg, #1a0d00 0%, #3d1a00 55%, #2a1000 100%)' },
  // powers
  demon_form:        { ra: 'ra-monster-skull',     gradient: 'linear-gradient(160deg, #1a001a 0%, #3d003d 55%, #2a002a 100%)' },
  flex:              { ra: 'ra-muscle-up',         gradient: 'linear-gradient(160deg, #1a0500 0%, #3d0f00 55%, #2a0800 100%)' },
  regeneration:      { ra: 'ra-health-increase',   gradient: 'linear-gradient(160deg, #001a05 0%, #003d10 55%, #001a05 100%)' },
  strength_training: { ra: 'ra-muscle-fat',        gradient: 'linear-gradient(160deg, #1a0a00 0%, #3d1500 55%, #2a0e00 100%)' },
  battle_cry:        { ra: 'ra-skull-trophy',      gradient: 'linear-gradient(160deg, #1a1000 0%, #3d2500 55%, #2a1800 100%)' },
  enrage:            { ra: 'ra-bleeding-hearts',   gradient: 'linear-gradient(160deg, #1a0000 0%, #400000 55%, #2a0000 100%)' },
  cursed_form:       { ra: 'ra-death-skull',       gradient: 'linear-gradient(160deg, #1a001a 0%, #350035 55%, #280028 100%)' },
};

const TYPE_FALLBACK: Record<string, CardArt> = {
  attack: { ra: 'ra-sword',   gradient: 'linear-gradient(160deg, #1a0505 0%, #3d0808 55%, #1a0505 100%)' },
  skill:  { ra: 'ra-shield',  gradient: 'linear-gradient(160deg, #000a18 0%, #001838 55%, #000a18 100%)' },
  power:  { ra: 'ra-crystals', gradient: 'linear-gradient(160deg, #0a051a 0%, #1e0a3d 55%, #0a051a 100%)' },
};

function getCardArt(card: Card): CardArt {
  const base = card.id.replace(/_reward_\d+$/, '').replace(/_\d+$/, '');
  return CARD_ART[base] ?? TYPE_FALLBACK[card.type] ?? TYPE_FALLBACK.attack;
}

function getCardValue(card: Card): { value: number | null; kind: 'attack' | 'block' | null } {
  for (const fx of card.effects) {
    if (fx.damage !== undefined && fx.damage > 0) return { value: fx.damage, kind: 'attack' };
  }
  for (const fx of card.effects) {
    if (fx.block !== undefined && fx.block > 0) return { value: fx.block, kind: 'block' };
  }
  return { value: null, kind: null };
}

export default function CardComponent({ card, selected, disabled, onClick, small, layoutId }: Props) {
  const rarityClass = `rarity-${card.rarity}`;
  const typeClass   = `type-${card.type}`;
  const { value: cardValue, kind: badgeKind } = getCardValue(card);
  const art = getCardArt(card);

  return (
    <motion.div
      layoutId={layoutId}
      className={`card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''} ${small ? 'small' : ''} ${rarityClass} ${typeClass}`}
      onClick={disabled ? undefined : onClick}
      whileTap={!disabled ? { scale: 0.93 } : {}}
      transition={{ type: 'spring', stiffness: 340, damping: 26 }}
    >
      <div className="card-inner">

        {/* Mana crystal — top-left */}
        <div className="card-mana-crystal">
          <span className="mana-value">{card.cost}</span>
        </div>

        {/* Value badge — top-right */}
        {cardValue !== null && badgeKind !== null && (
          <div className={`card-value-badge ${badgeKind}-badge`}>
            {cardValue}
          </div>
        )}

        {/* Art box — unique per card */}
        <div className="card-art-box" style={{ background: art.gradient }}>
          <div className="card-art-image">
            <i className={`ra ${art.ra}`} />
          </div>
          <div className="card-art-glow" />
        </div>

        {/* Name banner */}
        <div className="card-name-banner">
          <span className="card-name">{card.name}{card.upgraded ? ' +' : ''}</span>
        </div>

        {/* Description */}
        <div className="card-text-box">
          <div className="card-description">{card.description}</div>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <span className="card-type-label">{card.type.toUpperCase()}</span>
          <div className="card-badges">
            {card.retain   && <span className="card-badge badge-retain"  title="Reter">🔒</span>}
            {card.ethereal && <span className="card-badge badge-ethereal" title="Etéreo">👻</span>}
            {card.exhausts && <span className="card-badge badge-exhaust"  title="Exaure">🔥</span>}
          </div>
          <div className="rarity-gem" title={card.rarity} />
        </div>

        <div className="card-glow" />
      </div>
    </motion.div>
  );
}
