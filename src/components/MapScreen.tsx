import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { GameState, MapNode } from '../types';
import '../styles/map.css';

const FLOOR_WIDTH = 140;
const CANVAS_PADDING_X = 100;
const CANVAS_HEIGHT = 520;
const NODE_POSITIONS_Y = [80, 260, 440];

function nodeIndex(node: MapNode): number {
  const parts = node.id.split('_');
  return parseInt(parts[parts.length - 1], 10);
}

function nodeCenter(node: MapNode): { x: number; y: number } {
  const x = CANVAS_PADDING_X + (node.floor - 1) * FLOOR_WIDTH + FLOOR_WIDTH / 2;
  const idx = nodeIndex(node);
  return { x, y: NODE_POSITIONS_Y[idx] ?? NODE_POSITIONS_Y[1] };
}

interface MapScreenProps {
  state: GameState;
  onSelectNode: (nodeId: string) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ state, onSelectNode }) => {
  const { map, currentNodeId } = state;
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentNode = map.find(n => n.id === currentNodeId);
  const currentFloor = currentNode?.floor ?? 0;

  const totalFloors = Math.max(...map.map(n => n.floor));
  const canvasWidth = CANVAS_PADDING_X * 2 + totalFloors * FLOOR_WIDTH;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || currentFloor === 0) return;
    const targetX = CANVAS_PADDING_X + (currentFloor - 1) * FLOOR_WIDTH + FLOOR_WIDTH / 2;
    el.scrollTo({ left: Math.max(0, targetX - el.clientWidth / 2), behavior: 'smooth' });
  }, [currentFloor]);

  const isSelectable = (node: MapNode) => {
    if (currentNodeId === null) return node.floor === 1;
    return currentNode?.connections.includes(node.id) ?? false;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'enemy': return '⚔️';
      case 'elite': return '💀';
      case 'rest':  return '🔥';
      case 'shop':  return '🏪';
      case 'boss':  return '👑';
      default:      return '❓';
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'enemy': return 'COMBAT';
      case 'elite': return 'ELITE';
      case 'rest':  return 'REST';
      case 'shop':  return 'SHOP';
      case 'boss':  return 'BOSS';
      default:      return type.toUpperCase();
    }
  };

  // Build connections for SVG
  const connections = map.flatMap(node =>
    node.connections.map(targetId => {
      const target = map.find(n => n.id === targetId);
      if (!target) return null;

      let lineType: 'past' | 'active' | 'selectable' | 'future' = 'future';
      if (node.floor < currentFloor) lineType = 'past';
      else if (node.id === currentNodeId) lineType = 'active';
      else if (isSelectable(target) && node.id === currentNodeId) lineType = 'selectable';

      return { from: node, to: target, lineType };
    }).filter(Boolean)
  ) as { from: MapNode; to: MapNode; lineType: string }[];

  return (
    <div className="map-trail-scroll" ref={scrollRef}>
      <div className="map-trail-inner">
        {/* Header */}
        <div className="map-trail-header">
          <h1>Dungeon Trail</h1>
          <p>Choose your path</p>
        </div>

        {/* Canvas */}
        <div
          className="map-trail-canvas"
          style={{ width: canvasWidth, height: CANVAS_HEIGHT }}
        >
          {/* SVG lines */}
          <svg
            width={canvasWidth}
            height={CANVAS_HEIGHT}
            className="map-trail-svg"
          >
            {connections.map(({ from, to, lineType }, idx) => {
              const fc = nodeCenter(from);
              const tc = nodeCenter(to);
              const mx = (fc.x + tc.x) / 2;
              const d = `M ${fc.x} ${fc.y} C ${mx} ${fc.y} ${mx} ${tc.y} ${tc.x} ${tc.y}`;

              const strokeMap: Record<string, string> = {
                past:       'rgba(201,168,76,0.25)',
                active:     'rgba(241,196,15,0.9)',
                selectable: 'rgba(241,196,15,0.55)',
                future:     'rgba(255,255,255,0.07)',
              };
              const widthMap: Record<string, number> = {
                past: 1.5, active: 3, selectable: 2.5, future: 1.5,
              };
              const dashMap: Record<string, string | undefined> = {
                past: '5,5', active: undefined, selectable: undefined, future: '3,7',
              };

              return (
                <path
                  key={idx}
                  d={d}
                  stroke={strokeMap[lineType]}
                  strokeWidth={widthMap[lineType]}
                  strokeDasharray={dashMap[lineType]}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {/* Floor number ticks */}
          {Array.from(new Set(map.map(n => n.floor))).map(floor => {
            const x = CANVAS_PADDING_X + (floor - 1) * FLOOR_WIDTH + FLOOR_WIDTH / 2;
            return (
              <div
                key={`fl-${floor}`}
                className="map-floor-tick"
                style={{ left: x, bottom: 12 }}
              >
                {floor === totalFloors ? '⚡' : floor}
              </div>
            );
          })}

          {/* Nodes */}
          {map.map(node => {
            const { x, y } = nodeCenter(node);
            const selectable = isSelectable(node);
            const active = currentNodeId === node.id;
            const isPast = node.floor < currentFloor;
            const locked = !selectable && !active && node.floor > currentFloor;
            const staggerDelay = node.floor * 0.025 + nodeIndex(node) * 0.015;

            return (
              <motion.div
                key={node.id}
                className={`map-node-wrapper type-${node.type}`}
                style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 18, delay: staggerDelay }}
                whileHover={selectable ? { scale: 1.15 } : {}}
              >
                <motion.div
                  className={`map-node type-${node.type}${active ? ' active' : ''}${selectable ? ' selectable' : ''}${isPast || locked ? ' disabled' : ''}`}
                  onClick={() => selectable && onSelectNode(node.id)}
                  title={getLabel(node.type)}
                  whileTap={selectable ? { scale: 0.88 } : {}}
                >
                  <span className="node-icon">{getIcon(node.type)}</span>
                </motion.div>
                <span className="node-label">{getLabel(node.type)}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MapScreen;
