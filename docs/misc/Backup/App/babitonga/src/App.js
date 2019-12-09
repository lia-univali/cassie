import React from 'react';
import { Grid, Row, Col, PageHeader, ProgressBar, Panel, Button, Glyphicon, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';

import { runVegetationExperiments } from './actions/experiments';
import { openModal, closeModal } from './actions/modalActions';
import { replaceSatellite } from './actions';

import Icon from './components/Icon';
import GoogleMap from './components/GoogleMap';
import ImageProperties from './components/ImageProperties';
import SatelliteImageChooser from './components/SatelliteImageChooser';
import ImageControlPanel from './components/ImageControlPanel';
import BusyPanel from './components/BusyPanel';
import ModalRoot from './components/ModalRoot';
import InterestRegionView from './components/InterestRegionView';
import TaskButton from './components/TaskButton';
import FilterPanel from './components/FilterPanel';
import TemporalAnalysis from './components/TemporalAnalysis';

class App extends React.Component {
  handleSatelliteChoice() {
    this.props.openModal("SATELLITE_CHOOSER", {}, chosenIndex => {
      this.props.replaceSatellite(chosenIndex);
      this.props.closeModal();
    });
  }

  render() {
    const { working, authenticated, status, selectedImage, satelliteData, layers, spacecraft } = this.props;

    const spacecraftName = spacecraft
      ? `${spacecraft.name} (${spacecraft.collectionName})`
      : "(aguardando dados...)";

    return (
      <div className="main-root">
        <ModalRoot/>

        <Grid>
          <PageHeader>
            C.A.S.S.I.E. <small>Coastal Analysis via Satellite Imagery Engine</small>
          </PageHeader>
          <ButtonGroup className="action-group">
            <TaskButton onClick={() => this.props.runVegetationExperiments()}>
              <Glyphicon glyph="fire"/> Executar experimento
            </TaskButton>
            <TaskButton onClick={() => this.handleSatelliteChoice()} className="flex">
              <Icon icon="satellite"/> Escolher satélite
            </TaskButton>
          </ButtonGroup>

          <p><strong>Satélite atual:</strong> {spacecraftName}</p>

          <Row>
            <Col xs={7}>
              <div className="map-container">
                <BusyPanel shown={working} message={status}/>

                <GoogleMap/>
              </div>

              {authenticated && satelliteData &&
                <div>
                  <SatelliteImageChooser/>
                  <TemporalAnalysis/>
                  <FilterPanel/>
                </div>
              }

              {selectedImage !== null &&
                <ImageProperties/>
              }
            </Col>
            <Col xs={5}>
              <InterestRegionView/>
              <ImageControlPanel/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const stateMapper = (state) => {
  return state.data;
}

export default connect(stateMapper, {
  runVegetationExperiments, openModal, closeModal, replaceSatellite
})(App);
