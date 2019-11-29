import React from 'react';
import { connect } from 'react-redux';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import * as Map from '../common/map';
import * as MapActions from '../ducks/map';

export const DEFAULT_ZOOM = 9;

class GoogleMap extends React.Component {
  componentDidMount() {
    const { completeDrawing, onRegionDrawn, onLoad = () => { } } = this.props;

    this.map = new window.google.maps.Map(this.mapComponent, {
      // center: {lat: -26.9146, lng: -48.6621},
      center: { lat: -26.285757, lng: -48.735060 },
      zoom: DEFAULT_ZOOM,
      scaleControl: true,
    });

    console.log("Map initialized.", this.map);

    Map.initializeMap(this.map);
    Map.onRegionDrawn((overlay, coordinates) => {
      if (onRegionDrawn) {
        onRegionDrawn(overlay, coordinates);
      }

      completeDrawing(overlay, coordinates);
    });

    onLoad(this.map);

    // Shows a button prompting the user to log in.
    /*const onImmediateFailed = function() {
      $('.g-sign-in').removeClass('hidden');
      $('.output').text('(Log in to see the result.)');
      $('.g-sign-in .button').click(function() {
        ee.data.authenticateViaPopup(function() {
          $('.g-sign-in').addClass('hidden');
        });
      });
    };*/

    // basic.updateStatus("Autenticando");
    // basic.beginAuthentication(CLIENT_ID);
    // const onSuccess = () => {
    //   ee.initialize();
    //
    //   basic.updateStatus(false);
    //   basic.setAuthenticationState(true);
    //   basic.replaceSatellite(1); // Landsat 5
    // };
    //
    // // Attempt to authenticate using existing credentials.
    // ee.data.authenticateViaOauth(CLIENT_ID, onSuccess, console.log, null, () => {
    //   //onImmediateFailed();
    //   console.log("Autenticação falhou!");
    //
    //   modal.open("CONSENT");
    // });
  }

  render() {
    return (
      <div className="map" style={{ ...this.props.style, ...styles.wrapper }}>
        <Grow in={this.props.map.currentlyDrawing === true}>
          <div style={styles.boxWrapper}>
            <Paper style={styles.overlayBox}>
              <Typography variant="body1" style={styles.overlayText}>
                {this.props.map.drawingMessage}
              </Typography>
              <Button color="secondary" variant="raised" onClick={() => this.props.cancelDrawing()}>
                Cancelar
              </Button>
            </Paper>
          </div>
        </Grow>
        <div ref={r => this.mapComponent = r} className="map"></div>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "center",
  },
  boxWrapper: {
    position: "absolute",
    top: 16,
    zIndex: 10,
  },
  overlayBox: {
    padding: 16,
    margin: 0,
    display: "flex",
    alignItems: "center"
  },
  overlayText: {
    padding: "0px 16px 0px 8px",
  }
};

function mapConnect(stateMapper) {
  return connect(state => ({
    map: state.map,
    ...stateMapper(state)
  }), { ...MapActions });
}


export default mapConnect(() => ({}))(GoogleMap);
