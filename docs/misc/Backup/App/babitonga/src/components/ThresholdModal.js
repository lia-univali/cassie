import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { closeModal, clearParams } from '../actions/modalActions';
import HistogramChart from './HistogramChart';
import { otsuThreshold } from '../algorithms';

class ThresholdModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      threshold: 0
    };
  }

  componentWillMount() {
    this.updateThreshold(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateThreshold(nextProps);
  }

  updateThreshold(props) {
    if (!props.shown) {
      return;
    }

    let threshold = undefined;
    let histogramData = props.params.histogram;

    // Use the existing data if available
    if (props.params.index !== undefined) {
      const layer = props.data.layers[props.params.index];
      threshold = layer.thresholdIndex;
      histogramData = layer.histogram;
    }

    if (threshold === undefined) {
      // Choose the first band
      const band = Object.keys(histogramData)[0];
      threshold = otsuThreshold(histogramData[band]).indexMax;
    }

    this.setState({threshold});
  }

  render() {
    const { shown, closeModal, clearParams, data, params, callback = () => {}} = this.props;
    const places = 3;

    if (params.index === undefined && params.histogram == undefined) {
      return null;
    }

    // Choose the histogram if there is no index; otherwise, use the specified index.
    // TODO handle the case where the band is not "nd".
    const histogramData = params.index === undefined
      ? params.histogram.nd
      : data.layers[params.index].histogram.nd

    const thresholdValue = histogramData.bucketMeans[this.state.threshold];

    return (
      <Modal show={shown} onHide={() => closeModal()} onExited={() => clearParams()}>
        <Modal.Header closeButton>
          <Modal.Title>Limiarização</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HistogramChart
            places={places}
            data={histogramData}
            threshold={this.state.threshold}
            onChangeThreshold={(threshold) => this.setState({threshold})}
          />
          <p>Limiar atual: {thresholdValue.toFixed(places)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => closeModal()}>Cancelar</Button>
          <Button onClick={() => callback({index: this.state.threshold, value: thresholdValue})}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const stateMapper = (state) => {
  const { modal, data } = state;
  return { ...modal, data};
};

export default connect(stateMapper, {
  closeModal, clearParams
})(ThresholdModal);
