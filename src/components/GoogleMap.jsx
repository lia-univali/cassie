import React from 'react'
import { connect } from 'react-redux'
import i18next from 'i18next'

import { Button, Grow, Paper, Typography } from '@material-ui/core'

import * as Map from '../common/map'
import * as MapActions from '../store/ducks/map'

export const DEFAULT_ZOOM = 9

class GoogleMap extends React.Component {
  componentDidMount() {
    const { completeDrawing, onRegionDrawn, onLoad = () => { } } = this.props

    this.map = new window.google.maps.Map(this.mapComponent, {
      center: { lat: -26.285757, lng: -48.735060 },
      zoom: DEFAULT_ZOOM,
      scaleControl: true,
    })

    Map.initializeMap(this.map)

    Map.onRegionDrawn((overlay, coordinates) => {
      if (onRegionDrawn) {
        onRegionDrawn(overlay, coordinates);
      }

      completeDrawing(overlay, coordinates);
    });

    onLoad(this.map);
  }

  render() {
    return (
      // @TODO has raw css
      <div className="map" style={{ ...this.props.style, ...styles.wrapper }}>
        <Grow in={this.props.map.currentlyDrawing === true}>
          <div style={styles.boxWrapper}>
            <Paper style={styles.overlayBox}>
              <Typography variant="body1" style={styles.overlayText}>
                {this.props.map.drawingMessage}
              </Typography>
              <Button color="secondary" variant="contained" onClick={() => this.props.cancelDrawing()}>
                {i18next.t('forms.map.cancel')}
              </Button>
            </Paper>
          </div>
        </Grow>
        <div ref={r => this.mapComponent = r} className="map"></div>
      </div>
    )
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
}

function mapConnect(stateMapper) {
  return connect(state => ({
    map: state.map,
    ...stateMapper(state)
  }), { ...MapActions })
}


export default mapConnect(() => ({}))(GoogleMap)
