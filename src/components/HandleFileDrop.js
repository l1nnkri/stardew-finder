import React from 'react';
import parser from 'fast-xml-parser';
import { isValidLocation, isForageItem, MAPS } from '../utils';
import Store from '../Store';

class HandleFileDrop extends React.Component {
  state = {
    locations: {},
  };

  onDrop = ev => {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      const item = ev.dataTransfer.items[0];
      if (item.kind === 'file') {
        var file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = theFile => {
          const { result } = theFile.currentTarget;
          const json = parser.parse(result);
          // Parse locations
          const locations = json.SaveGame.locations.GameLocation.filter(
            ({ name }) => isValidLocation(name) && MAPS[name]
          ).reduce((p, location) => {
            const name = location.name;
            p[name] = (location.objects || { item: [] }).item
              .map(item => {
                const itemId = item.value.Object.parentSheetIndex;
                if (!isForageItem(itemId)) {
                  return null;
                }
                return {
                  name: item.value.Object.name,
                  x: item.key.Vector2.X,
                  y: item.key.Vector2.Y,
                };
              })
              .filter(l => !!l);
            return p;
          }, {});
          this.props.store.set('locations')(locations);
        };
        reader.readAsText(file);
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {}
    }
  };

  render() {
    return (
      <div
        onDrop={this.onDrop}
        onDragOver={event => {
          event.preventDefault();
        }}
        style={{
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Store.withStore(HandleFileDrop);
