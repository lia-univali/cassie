import React from 'react';
import { connect } from 'react-redux';
import { Glyphicon, ListGroupItem, Alert, Dropdown, MenuItem } from 'react-bootstrap';
import { formatArea } from '../utils';
import ColorConverter from 'color-convert';
import DismissablePanel from './DismissablePanel';
import ScrollableListGroup from './ScrollableListGroup';
import { clearDetectedRegions, highlightRegion, clearHighlightedRegion } from '../actions';
import moment from 'moment';

const ColoredRegion = (props) => {
  let color = props.color;
  color = ColorConverter.hex.hsl(color);
  color[2] += 15;
  color = ColorConverter.hsl.hex(color);

  return (
    <span>
      <Glyphicon glyph="globe" style={{color: "#" + color}}/>
      {" " + formatArea(props.area)}
    </span>
  );
};

class RegionCollection extends React.Component {
  handleSave(key) {
    const { id, version, vectors } = this.props.detectedRegions;

    const format = key === 0 ? "kml" : "json";
    const filename = `cassie_${id}_${version}_${moment().format("YYYYMMDD-HHmmss")}`;

    const url = vectors.getDownloadURL(format, [], encodeURIComponent(filename));
    window.open(url);
  }

  render() {
    if (!this.props.detectedRegions) {
      return null;
    }

    const { images, detectedRegions, highlightRegion, clearHighlightedRegion } = this.props;
    const { regions, imageIndex } = detectedRegions;
    const imageName = images[imageIndex].name;

    let total = 0;
    const items = regions.map((region, index) => {
      total += region.area;

      return (
        <ListGroupItem key={index} className="highlight-hover"
          onMouseOver={() => highlightRegion(region)}
          onMouseOut={() => clearHighlightedRegion()}
        >
          <ColoredRegion color={region.color} area={region.area}/>
        </ListGroupItem>
      );
    });

    const title = `Imagem ${imageIndex + 1}: ${imageName}`;

    return (
      <DismissablePanel title={title} onDismiss={() => this.props.clearDetectedRegions()}>
        <ScrollableListGroup className="compressed-list" maxHeight={300}>
          {items}
        </ScrollableListGroup>
        <div className="wrapper-row">
          <span>Total: {formatArea(total)}</span>

          <Dropdown className="flex-right" id="save-dd" onSelect={key => this.handleSave(key)} pullRight>
            <Dropdown.Toggle>
              <Glyphicon glyph="save"/>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey={0}>KML</MenuItem>
              <MenuItem eventKey={1}>GeoJSON</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </DismissablePanel>
    );
  }
}

const stateMapper = (state, ownProps) => {
  const { detectedRegions, images } = state.data;
  return {...ownProps, detectedRegions, images};
}

export default connect(stateMapper, {
  clearDetectedRegions, highlightRegion, clearHighlightedRegion
})(RegionCollection);
