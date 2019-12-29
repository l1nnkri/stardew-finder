import React, { useState } from 'react';
import farmUrl from '../img/Farm.png';
import Store from '../Store';
import { REVERSE_ID_TABLE, MAP_SIZES } from '../utils';
import { Tooltip, Checkbox, Popover, Divider } from 'antd';
import ReactJsonView from 'react-json-view';

const filterObjectsByName = (location, name) =>
  location.objects.item
    .filter(feature => feature.value.Object.name === name)
    .map(feature => {
      const {
        name,
        heldObject = { name: 'empty' },
        minutesUntilReady,
      } = feature.value.Object;
      const type = heldObject.name;
      const daysToHarvest = Math.round(minutesUntilReady / 60 / 24);
      return {
        ...feature,
        name: `${name} (${type})`,
        daysToHarvest,
        x: feature.key.Vector2.X,
        y: feature.key.Vector2.Y,
        done: minutesUntilReady === 0,
      };
    });

const findInBuildings = (location, building, names = []) => {
  const buildings = location.buildings.Building.filter(
    b => b.buildingType === building
  );
  const allObjects = buildings.reduce((p, building) => {
    const objects = building.indoors.objects.item
      .filter(
        item => names.length === 0 || names.includes(item.value.Object.name)
      )
      .map(item => {
        const { name, minutesUntilReady } = item.value.Object;
        const daysToHarvest = Math.round(minutesUntilReady / 60 / 24);
        return {
          ...item,
          name,
          daysToHarvest,
          x: item.key.Vector2.X,
          y: item.key.Vector2.Y,
          done: minutesUntilReady === 0,
        };
      });
    return [...p, ...objects];
  }, []);

  return allObjects;
};

export default function FarmView(props) {
  const store = Store.useStore();
  const gameState = store.get('gameState');
  const [checked, setChecked] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const location = gameState.locations
    ? gameState.locations.GameLocation.find(({ name }) => name === 'Farm')
    : null;
  if (!location) {
    return (
      <div>
        <img src={farmUrl} style={{ maxWidth: '100%' }} />
      </div>
    );
  }
  const mapSize = MAP_SIZES['Farm'];

  const tileSize = 100 / MAP_SIZES['Farm'].x;

  let tappers = filterObjectsByName(location, 'Tapper');
  let preservesJars = filterObjectsByName(location, 'Preserves Jar');
  let beeHouses = filterObjectsByName(location, 'Bee House');
  let eggs = findInBuildings(location, 'Coop', ['Egg']);

  let crops = location.terrainFeatures.item
    .filter(feature => feature.value.TerrainFeature.crop)
    .map(feature => {
      const phaseDays = feature.value.TerrainFeature.crop.phaseDays.int;
      const currentPhase = feature.value.TerrainFeature.crop.currentPhase;
      const dayOfCurrentPhase =
        feature.value.TerrainFeature.crop.dayOfCurrentPhase;
      const regrowAfterHarvest =
        feature.value.TerrainFeature.crop.regrowAfterHarvest;
      let daysToHarvest =
        phaseDays.slice(currentPhase + 1, -1).reduce((p, c) => p + c, 0) +
        phaseDays[currentPhase] -
        dayOfCurrentPhase;
      let done = false;
      if (currentPhase === phaseDays.length - 1) {
        // Check if done
        if (regrowAfterHarvest > 0) {
          if (
            feature.value.TerrainFeature.state === 1 ||
            dayOfCurrentPhase === -1 ||
            dayOfCurrentPhase === 0
          ) {
            daysToHarvest = 0;
            done = true;
          } else {
            daysToHarvest = regrowAfterHarvest - dayOfCurrentPhase;
          }
        } else {
          done = true;
          daysToHarvest = 0;
        }
      }

      return {
        ...feature,
        name:
          REVERSE_ID_TABLE[feature.value.TerrainFeature.crop.indexOfHarvest],
        superName: feature.value.TerrainFeature['@_xsi:type'],
        daysToHarvest,
        done,
        dead: feature.value.TerrainFeature.crop.dead,
        x: feature.key.Vector2.X,
        y: feature.key.Vector2.Y,
      };
    });

  const allObjects = [
    ...crops,
    ...tappers,
    ...preservesJars,
    ...beeHouses,
    ...eggs,
  ];

  const cropsCountMap = allObjects.reduce((p, c) => {
    const existing = p[c.name] || 0;
    p[c.name] = existing + 1;
    return p;
  }, {});

  const cropsOptions = Object.keys(cropsCountMap).map(key => ({
    label: `${key} (${cropsCountMap[key]})`,
    value: key,
  }));

  return (
    <div>
      <div style={{ width: '15%', display: 'inline-block' }}>
        <Checkbox
          onChange={e => {
            setIndeterminate(false);
            setChecked(e.target.checked ? cropsOptions.map(o => o.value) : []);
          }}
          indeterminate={indeterminate}
        >
          Check all ({Object.values(cropsCountMap).reduce((p, c) => p + c, 0)})
        </Checkbox>
        <Divider />
        <Checkbox.Group
          options={cropsOptions}
          value={checked}
          onChange={c => {
            setIndeterminate(!!c.length && c.length < cropsOptions.length);
            setChecked(c);
          }}
        />
      </div>
      <div
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '80%',
          display: 'inline-block',
        }}
      >
        <img src={farmUrl} style={{ maxWidth: '100%', opacity: '50%' }} />
        {allObjects
          .filter(c =>
            c.name === undefined
              ? checked.includes('undefined')
              : checked.includes(c.name)
          )
          .map((c, i) => (
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
                <div
                  style={{
                    textAlign: 'center',
                    cursor: 'pointer',
                    fontSize: '0.45rem',
                    height: `${(tileSize * mapSize.x) / mapSize.y}%`,
                    border: '1px solid black',
                    left: `${(c.x / mapSize.x) * 100}%`,
                    top: `${(c.y / mapSize.y) * 100}%`,
                    position: 'absolute',
                    width: `${tileSize}%`,
                    color: c.dead ? '#000' : c.done ? '#52c41a' : 'red',
                  }}
                >
                  {c.dead ? 'X' : c.daysToHarvest}
                </div>
              </Popover>
            </Tooltip>
          ))}
      </div>
    </div>
  );
}
