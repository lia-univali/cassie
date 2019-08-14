import React from 'react';
import { connect } from 'react-redux';
import ThresholdModal from './ThresholdModal';
import AreaSeriesModal from './AreaSeriesModal';
import SatelliteChooserModal from './SatelliteChooserModal';

class ModalRoot extends React.Component {
  render() {
    console.log(this.props.currentModal);
    switch (this.props.currentModal) {
    case "THRESHOLD":
      return <ThresholdModal/>;
    case "SATELLITE_CHOOSER":
      return <SatelliteChooserModal/>;
    case "VEGETATION_AREA":
      return <AreaSeriesModal/>;
    }

    return null;
  }
}

const stateMapper = (state) => {
  return {currentModal: state.modal.currentModal};
}

export default connect(stateMapper, {})(ModalRoot);
