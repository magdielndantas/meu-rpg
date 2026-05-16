import React from 'react';
import type { GameState, MapNode } from '../types';
import '../styles/map.css';

interface MapScreenProps {
  state: GameState;
  onSelectNode: (nodeId: string) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ state, onSelectNode }) => {
  const { map, currentNodeId } = state;
  const floors = Array.from(new Set(map.map(n => n.floor))).sort((a, b) => a - b);

  const isNodeSelectable = (node: MapNode) => {
    if (currentNodeId === null) {
      return node.floor === 1;
    }
    const currentNode = map.find(n => n.id === currentNodeId);
    return currentNode?.connections.includes(node.id) ?? false;
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'enemy': return '⚔️';
      case 'elite': return '💀';
      case 'rest':  return '🔥';
      case 'shop':  return '🏪';
      case 'boss':  return '👑';
      default:      return '❓';
    }
  };

  const getNodeLabel = (type: string) => {
    switch (type) {
      case 'enemy': return 'COMBAT';
      case 'elite': return 'ELITE';
      case 'rest':  return 'REST';
      case 'shop':  return 'SHOP';
      case 'boss':  return 'BOSS';
      default:      return type.toUpperCase();
    }
  };

  const currentNode = map.find(n => n.id === currentNodeId);
  const currentFloor = currentNode?.floor ?? 0;

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>Dungeon Map</h1>
        <p>Choose your next destination</p>
      </div>

      {[...floors].reverse().map((floor, idx, arr) => (
        <React.Fragment key={floor}>
          <div className="map-floor">
            {map.filter(n => n.floor === floor).map(node => {
              const selectable = isNodeSelectable(node);
              const active = currentNodeId === node.id;
              const isPast = node.floor < currentFloor;
              const isFutureLocked = !selectable && !active && node.floor > currentFloor;
              const disabled = isPast || isFutureLocked;

              return (
                <div
                  key={node.id}
                  className={`map-node-wrapper type-${node.type}`}
                >
                  <div
                    className={`map-node type-${node.type}${active ? ' active' : ''}${selectable ? ' selectable' : ''}${disabled ? ' disabled' : ''}`}
                    onClick={() => selectable && onSelectNode(node.id)}
                    title={getNodeLabel(node.type)}
                  >
                    <span className="node-icon">{getNodeIcon(node.type)}</span>
                  </div>
                  <span className="node-label">{getNodeLabel(node.type)}</span>
                </div>
              );
            })}
          </div>

          {/* Connector between floors (not after last/topmost floor) */}
          {idx < arr.length - 1 && (
            <div className="map-floor-connector" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MapScreen;
