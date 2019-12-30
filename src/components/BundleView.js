import React from 'react';
import { Tag, Table } from 'antd';
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
  if (!deliverableItems) return null;
  const bundleStatus = getBundleStatus(gameState);
  const missingBundleItems = Object.keys(Bundles)
    .map(bundleKey => {
      const dataBundle = Bundles[bundleKey];
      return {
        ...dataBundle,
        ...bundleStatus[dataBundle.id],
        missingIngredients: bundleStatus[dataBundle.id].missingIngredients.map(
          i => ({
            ...i,
            deliverable: canDeliverItem(
              deliverableItems,
              i.itemId,
              i.stack,
              i.quality
            ),
          })
        ),
      };
    })
    .filter(({ nMissing }) => nMissing > 0);
  const columns = [
    {
      title: 'Room',
      dataIndex: 'roomName',
      sorter: (a, b) => a.roomName.localeCompare(b.roomName),
    },
    { title: 'Bundle', dataIndex: 'bundleName' },
    { title: 'Reward', dataIndex: 'reward.name' },
    {
      title: 'nMissing',
      dataIndex: 'nMissing',
      sorter: (a, b) => a.nMissing - b.nMissing,
    },
    {
      title: 'Missing',
      render: bundle => (
        <div>
          {bundle.missingIngredients.map(ing => (
            <Tag key={ing.itemId} color={ing.deliverable ? 'green' : 'red'}>
              {ing.name || ing.itemId}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={missingBundleItems}
      rowKey="id"
      columns={columns}
      pagination={false}
    />
  );
}
