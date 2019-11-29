import React from 'react';
import { compose } from 'redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import StepperButtons from '../components/StepperButtons';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import GoogleMap, { DEFAULT_ZOOM } from '../components/GoogleMap';
import { withAcquisition, withMap } from '../actions';
import * as Map from '../common/map';

class AOIChooser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: AOIChooser.isAboveThreshold(DEFAULT_ZOOM),
      zoomLevel: DEFAULT_ZOOM,
    };
  }

  static isAboveThreshold(zoom) {
    return zoom > 4;
  }

  changeDelimiterVisibility(visible) {
    if (visible) {
      Map.displayElement(this.wrs);
    } else {
      Map.hideElement(this.wrs);
    }

    this.setState({ visible });
  }

  handleZoomChange(zoomLevel) {
    const prevVisible = AOIChooser.isAboveThreshold(this.state.zoomLevel);
    const visible = AOIChooser.isAboveThreshold(zoomLevel);

    if (visible !== prevVisible) {
      this.changeDelimiterVisibility(visible);
    }

    this.setState({ zoomLevel, switchDisabled: visible === false });
  }

  componentDidMount() {
    this.wrs = Map.loadWRSLayer();

    Map.onZoomChange(zoomLevel => this.handleZoomChange(zoomLevel));
    Map.setDrawingControlsVisible(true);
  }

  componentWillUnmount() {
    Map.onZoomChange(() => { });
  }

  handleDrawing(overlay, coordinates) {
    this.setState({ overlay, coordinates });

    Map.setDrawingControlsVisible(false);
  }

  handleUndo() {
    this.state.overlay.setMap(null);
    this.setState({ overlay: undefined, coordinates: undefined });

    Map.setDrawingControlsVisible(true);
  }

  handleSwitchChange(event) {
    this.changeDelimiterVisibility(event.target.checked);
  }

  handleChoose() {
    const { overlay, coordinates } = this.state;

    this.props.acquisition.setAOI(overlay, coordinates, window.ee.Geometry.Polygon([coordinates]));
  }

  render() {
    const styles = {
      map: {
        width: 1000,
        height: 500,
      },
      middleButton: {
        margin: "24px 8px"
      }
    };

    const { navigate } = this.props;
    const { overlay, coordinates, visible, switchDisabled } = this.state;
    const drawn = coordinates !== undefined;

    return (
      <div className="vcenter flow-column">
        <FormControlLabel label="Mostrar delimitadores"
          control={
            <Switch
              checked={visible}
              disabled={switchDisabled}
              onChange={e => this.handleSwitchChange(e)} />
          }
        />
        <GoogleMap
          style={styles.map}
          onRegionDrawn={this.handleDrawing.bind(this)}
        />
        <StepperButtons navigate={navigate} nextDisabled={drawn === false} onNext={() => this.handleChoose()}>
          <Button onClick={() => this.handleUndo()} disabled={drawn === false} color="secondary" variant="outlined">
            Desfazer
          </Button>
        </StepperButtons>
      </div>
    );
  }
}

export default compose(
  withAcquisition(),
  withMap(),
)(AOIChooser);
