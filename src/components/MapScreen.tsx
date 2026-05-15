import React from 'react';
import { GameState, MapNode } from '../types';
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
      case 'rest': return '🔥';
      case 'shop': return '💰';
      case 'boss': return '👹';
      default: return '❓';
    }
  };

  return (
    <div className="map-container">
      <div className="map-header">
        <h1>Mapa do Calabouço</h1>
        <p>Escolha seu próximo destino</p>
      </div>
      
      {floors.map(floor => (
        <div key={floor} className="map-floor">
          {map.filter(n => n.floor === floor).map(node => {
            const selectable = isNodeSelectable(node);
            const active = currentNodeId === node.id;
            const disabled = !selectable && !active && (currentNodeId !== null && node.floor >= (map.find(n => n.id === currentNodeId)?.floor || 0));

            return (
              <div
                key={node.id}
                className={`map-node ${active ? 'active' : ''} ${selectable ? 'selectable' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => selectable && onSelectNode(node.id)}
                title={node.type.toUpperCase()}
              >
                <span className="node-icon">{getNodeIcon(node.type)}</span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MapScreen;
