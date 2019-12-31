import React from 'react';
import { Popover, Tooltip } from 'antd';
import ReactJsonView from 'react-json-view';
import styled from 'styled-components';

const PlacedDiv = styled.div`
  text-align: center;
  cursor: pointer;
  left: ${props => (props.c.x / props.mapSize.x) * 100}%;
  top: ${props => (props.c.y / props.mapSize.y) * 100}%;
  position: absolute;
  height: ${props => (props.tileSize * props.mapSize.x) / props.mapSize.y}%;
  width: ${props => props.tileSize}%;
  // color: ${({ c }) => (c.dead ? '#000' : c.done ? '#52c41a' : 'red')};
  color: white;
  font-size: 0.5rem;
  font-weight: 800;
  background-color: ${({ c }) =>
    c.dead ? '#111111' : c.done ? '#2ECC40' : '#FF4136'};
`;

export default function FarmOverlayView(props) {
  const { items, mapSize } = props;
  const tileSize = 100 / mapSize.x;
  return items.map((c, i) => (
    <Tooltip title={`${c.name} [${c.daysToHarvest}]`} key={i}>
      <Popover
        content={
          <ReactJsonView
            src={c}
            name={false}
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
          />
        }
        title={c.name}
        trigger="click"
        placement="bottom"
      >
        <PlacedDiv tileSize={tileSize} c={c} mapSize={mapSize}>
          {c.dead ? 'X' : c.daysToHarvest}
        </PlacedDiv>
      </Popover>
    </Tooltip>
  ));
}
