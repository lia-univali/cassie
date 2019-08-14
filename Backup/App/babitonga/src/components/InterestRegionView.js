import React from 'react';
import { connect } from 'react-redux';
import { Panel, ButtonGroup, DropdownButton } from 'react-bootstrap';
import { openModal, closeModal } from '../actions/modalActions';
import { removeRegion, calculateVegetationArea, updateStatus, fetchSatelliteData } from '../actions';
import Evaluator from './Evaluator';
import RegionCollection from './RegionCollection';
import DismissablePanel from './DismissablePanel';
import { formatArea } from '../utils';
import { Roles } from '../constants';
import { createHistogram } from '../operations';
import TaskMenuItem from './TaskMenuItem';
import TaskButton from './TaskButton';

class InterestRegionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {hasArea: false};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.region && nextProps.region.eeGeometry) {
      nextProps.region.eeGeometry.area().evaluate(area => {
        this.setState({area});
      });
    }
  }

  handleVegetationArea(imageIndex) {
    const layerIndex = this.props.images[imageIndex][Roles.ndvi];
    const layer = this.props.layers[layerIndex];

    this.props.updateStatus("Gerando histograma");
    const params = {
      scale: 20,
      geometry: this.props.region.eeGeometry
    };

    createHistogram(layer.image, params, hist => {
      this.props.updateStatus(false);

      this.props.openModal("THRESHOLD", {histogram: hist}, result => {
        this.props.calculateVegetationArea(imageIndex, result.value);
        this.props.closeModal();
      });
    });
  }

  createVegetationButton() {
    const items = this.props.images.map((image, i) => (
      <TaskMenuItem eventKey={i} key={i}>Imagem {i}: {image.name}</TaskMenuItem>
    ));

    const { hasArea } = this.state;

    return (
      <DropdownButton disabled={!hasArea} title="Área de vegetação" id="vegetation-dd" pullRight
        disabled={items.length == 0 || this.props.detectedRegions != undefined}
        onSelect={key => this.handleVegetationArea(key)}>
        {items}
      </DropdownButton>
    )
  }

  render() {
    const { region, removeRegion, calculateVegetationArea, fetchSatelliteData } = this.props;

    if (!region) {
      return null;
    }

    const dismissHandler = () => {
      this.setState({hasArea: false})
      removeRegion();
    }

    return (
      <DismissablePanel title="Região de Interesse" big onDismiss={() => dismissHandler()}>
        <TaskButton onClick={() => fetchSatelliteData()} className="pull-right">
          Obter imagens
        </TaskButton>
        <p>
          {"Área: "}
          <Evaluator
            task={region.eeGeometry.area()}
            view={(props) => <span>{formatArea(props.result)}</span>}
            onComplete={() => this.setState({hasArea: true})}
          />
        </p>

        <ButtonGroup vertical>
          {this.createVegetationButton()}
        </ButtonGroup>

        <RegionCollection/>
      </DismissablePanel>
    );
  }
}

const stateMapper = (state) => {
  const { region, detectedRegions, images, layers } = state.data;
  return {region, detectedRegions, images, layers};
};

export default connect(stateMapper, {
  removeRegion, calculateVegetationArea,
  openModal, closeModal, updateStatus, fetchSatelliteData
})(InterestRegionView);
