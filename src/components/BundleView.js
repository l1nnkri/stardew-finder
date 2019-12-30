import React from 'react';
import { getBundleStatus, ROOMS } from '../bundleUtils';
import Store from '../Store';
import Bundles from '../data/bundles.json';

export default function BundleView(props) {
  const store = Store.useStore();
  const gameState = store.get('gameState');
  if (Object.keys(gameState).length === 0) {
    return null;
  }
  const bundleStatus = getBundleStatus(gameState);
  const rooms = Object.keys(ROOMS).map(roomKey => {
    const roomName = ROOMS[roomKey].name;
    const bundles = Object.keys(ROOMS[roomKey].bundles)
      .sort()
      .filter(key => bundleStatus[key].nMissing > 0)
      .map(key => Bundles[key]);
    return (
      <li key={roomKey}>
        {roomName}
        <ol>
          {bundles.map(b => (
            <li key={b.id}>
              {b.bundleName} - missing {bundleStatus[b.id].nMissing} -{' '}
              {bundleStatus[b.id].missingIngredients
                .map(i => i.name)
                .filter(i => !!i)
                .join(', ')}
            </li>
          ))}
        </ol>
      </li>
    );
  });
  return <ol>{rooms}</ol>;
}
