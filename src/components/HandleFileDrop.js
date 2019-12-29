import React from 'react';
import parser from 'fast-xml-parser';
import { withRouter } from 'react-router-dom';
import { isValidLocation, isForageItem, MAP_IMAGES } from '../utils';
import Store from '../Store';

class HandleFileDrop extends React.Component {
  state = {
    locations: {},
    isDraggingFile: false,
  };

  componentDidMount() {
    console.log(this.props.match.params);
  }

  onDrop = ev => {
    ev.preventDefault();
    if (ev.dataTransfer.items) {
      const item = ev.dataTransfer.items[0];
      if (item.kind === 'file') {
        var file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = async theFile => {
          const { result } = theFile.currentTarget;
          const json = parser.parse(result, {
            ignoreAttributes: false,
            parseAttributeValue: true,
          });
          // Parse main info
          const info = {
            currentSeason: json.SaveGame.currentSeason,
            dayOfMonth: json.SaveGame.dayOfMonth,
            dailyLuck: json.SaveGame.dailyLuck,
            year: json.SaveGame.year,
          };
          this.props.store.set('info')(info);
          // Parse locations
          const locations = json.SaveGame.locations.GameLocation.filter(
            ({ name }) => isValidLocation(name) && MAP_IMAGES[name]
          ).reduce((p, location) => {
            const name = location.name;
            location.objects = location.objects || { item: [] };
            location.objects = Array.isArray(location.objects.item)
              ? location.objects
              : { item: [location.objects.item] };
            p[name] = location.objects.item
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
          this.props.store.set('gameState')(json.SaveGame);
          this.setState({ isDraggingFile: false });
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
          if (event.dataTransfer.items.length) {
            this.setState({ isDraggingFile: true });
          }
          event.preventDefault();
        }}
        style={{
          minHeight: '100vh',
          width: '100%',
          background: this.state.isDraggingFile ? '#ccc' : '#fff',
        }}
      >
        {this.state.isDraggingFile ? (
          <h1>Drop file anywhere</h1>
        ) : (
          this.props.children
        )}
      </div>
    );
  }
}

export default Store.withStore(withRouter(HandleFileDrop));
