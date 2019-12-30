import React, { useState } from 'react';
import { groupBy } from 'lodash';
import { Table, Input } from 'antd';
import { getDeliverableItems } from '../bundleUtils';
import Store from '../Store';
import QualityIcon from './QualityIcon';
import TableWrapper from './TableWrapper';
import Wikify from './Wikify';

const { Search } = Input;

export default function InventoryView(props) {
  const [searchTerm, setSearchTerm] = useState();
  const store = Store.useStore();
  const gameState = store.get('gameState');
  if (!gameState || Object.keys(gameState).length === 0) {
    return null;
  }
  const itemsMap = getDeliverableItems(gameState);
  const itemsArray = Object.keys(itemsMap).reduce(
    (p, c) => [...p, ...itemsMap[c]],
    []
  );
  const itemsByQuality = groupBy(
    itemsArray,
    item => `${item.id}_${item.quality}`
  );
  const dataSource = Object.values(itemsByQuality).reduce(
    (p, c) => [
      ...p,
      c.length === 0
        ? undefined
        : { ...c[0], stack: c.reduce((prev, cur) => prev + cur.stack, 0) },
    ],
    []
  );
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '10%',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      render: row => (
        <Wikify {...row}>
          {row.name}{' '}
          <QualityIcon style={{ float: 'right' }} quality={row.quality} />
        </Wikify>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Quantity',
      dataIndex: 'stack',
      sorter: (a, b) => a.stack - b.stack,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
  ];

  const searchRegexp = new RegExp(searchTerm, 'i');
  const filteredData = dataSource.filter(row => searchRegexp.test(row.name));

  return (
    <div>
      <Search
        width="100%"
        size="large"
        style={{ marginBottom: '10px' }}
        placeholder="Press enter to search"
        onSearch={value => {
          setSearchTerm(value);
        }}
      />
      <TableWrapper>
        <Table
          rowKey={row => `${row.id}_${row.quality}`}
          dataSource={filteredData}
          columns={columns}
          pagination={false}
        />
      </TableWrapper>
    </div>
  );
}
