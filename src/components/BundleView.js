import React from 'react';
import { Tag, Table } from 'antd';
import { getBundleStatus, ROOMS, canDeliverItem } from '../bundleUtils';
import Store from '../Store';
import Bundles from '../data/bundles.json';
import { uniqBy } from 'lodash';

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
    {
      title: 'Reward',
      dataIndex: 'reward',
      render: reward => `${reward.name} (${reward.stack})`,
    },
    {
      title: 'nMissing',
      dataIndex: 'nMissing',
      sorter: (a, b) => a.nMissing - b.nMissing,
    },
    {
      title: 'Missing',
      dataIndex: 'missingIngredients',
      render: (_, bundle) => (
        <div>
          {bundle.missingIngredients
            .filter(i => i.name)
            .map(ing => (
              <Tag key={ing.itemId} color={ing.deliverable ? 'green' : 'red'}>
                {ing.name}
              </Tag>
            ))}
        </div>
      ),
      filters: uniqBy(
        missingBundleItems
          .reduce((p, c) => [...p, ...c.missingIngredients], [])
          .map(ing => ({ text: ing.name, value: ing.itemId })),
        'value'
      )
        .filter(i => !!i.text)
        .sort((a, b) => a.text.localeCompare(b.text)),
      onFilter: (value, record) =>
        record.missingIngredients.find(i => i.itemId === value),
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
