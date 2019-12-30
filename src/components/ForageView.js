import React from 'react';
import { Tooltip, Select, Divider } from 'antd';
import 'antd/dist/antd.css';
import { MAP_IMAGES, MAP_SIZES } from '../utils';
import Store from '../Store';

class ForageView extends React.Component {
  state = {
    locations: {},
    maps: Object.keys(MAP_IMAGES),
  };

  onChange = values => {
    this.setState({ maps: values });
  };

  createMapElements = (maps, locations) => {
    const mapElements = maps.map(key => {
      const mapSize = MAP_SIZES[key];
      const mapUrl = MAP_IMAGES[key];
      const markers = (locations[key] || []).map(({ x, y, name }, idx) => {
        const top = (y / mapSize.y) * 100;
        const left = (x / mapSize.x) * 100;
        return (
          <Tooltip title={name} key={idx}>
            <img
              src="https://stardew.djomp.co.uk/images/marker.png"
              style={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
              }}
              alt={name}
            />
          </Tooltip>
        );
      });
      return (
        <div key={key}>
          <div>
            <h3>
              <a name={key} href={`#${key}`}>
                {key} ({markers.length})
              </a>
            </h3>
          </div>
          <div
            style={{
              display: 'inline-block',
              top: 0,
              left: 0,
              position: 'relative',
            }}
          >
            <img
              alt={mapUrl}
              style={{ maxWidth: '100%', opacity: '50%' }}
              src={mapUrl}
              key={key}
            />
            {markers}
          </div>
        </div>
      );
    });
    return mapElements;
  };

  render() {
    const { maps } = this.state;
    const locations = this.props.store.get('locations');
    return (
      <div>
        <div
          style={{
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <h1>
            Total count:
            {Object.keys(locations).reduce(
              (p, c) => p + locations[c].length,
              0
            )}
          </h1>
          <div>
            <Select
              allowClear
              mode="multiple"
              style={{ width: '80%' }}
              onChange={this.onChange}
              value={maps}
            >
              {Object.keys(MAP_IMAGES).map(key => {
                return (
                  <Select.Option key={key} value={key}>
                    {key} [{(locations[key] || []).length}]
                  </Select.Option>
                );
              })}
            </Select>
          </div>
          {maps.map(m => (
            <div style={{ marginTop: 10, display: 'inline-block' }} key={m}>
              <a style={{ marginRight: 10 }} href={`#${m}`}>
                {m}
              </a>
            </div>
          ))}
          <Divider />
          {this.createMapElements(maps, locations)}
        </div>
      </div>
    );
  }
}

export default Store.withStore(ForageView);
