import React from 'react';
import { Tag } from 'antd';
import { getBundleStatus, ROOMS, canDeliverItem } from '../bundleUtils';
import Store from '../Store';
import Bundles from '../data/bundles.json';

export default function BundleView(props) {
  const store = Store.useStore();
  const deliverableItems = store.get('deliverableItems');
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
            <li key={b.id} style={{ marginBottom: 5 }}>
              {b.bundleName} - missing {bundleStatus[b.id].nMissing} -{' '}
              {bundleStatus[b.id].missingIngredients
                .map(i => ({
                  ...i,
                  deliverable: canDeliverItem(
                    deliverableItems,
                    i.itemId,
                    i.stack,
                    i.quality
                  ),
                }))
                .filter(i => i.name)
                .map(item => (
                  <Tag
                    key={item.itemId}
                    color={item.deliverable ? 'green' : 'red'}
                  >
                    {item.name}[{item.quality}]
                  </Tag>
                ))}{' '}
              - {b.reward.name || b.reward.id}
            </li>
          ))}
        </ol>
      </li>
    );
  });
  return <ol>{rooms}</ol>;
}
