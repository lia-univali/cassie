import React from 'react';
import { connect } from 'react-redux';

import MapLayer from './MapLayer';
import LayerPanel from './LayerPanel';
import { removeImage, updateThreshold, updateVisibility, updateOpacity } from '../actions';

class ImageControlPanel extends React.Component {
  mapImagesToComponents() {
    const { removeImage, updateThreshold, updateVisibility, updateOpacity } = this.props;

    return this.props.images.map((im, index) => (
      <LayerPanel key={index} name={im.name} onRemove={() => removeImage(index)}>
        {im.layers.map(k => {
          return (
            <MapLayer key={k} index={k}/>
          );
        })}
      </LayerPanel>
    ));
  }

  render() {
    return (
      <div>
        {this.mapImagesToComponents()}
      </div>
    )
  }
}

const stateMapper = (state) => {
  const { satelliteData, images, layers } = state.data;
  return {satelliteData, images, layers};
};

export default connect(stateMapper, {removeImage})(ImageControlPanel);
