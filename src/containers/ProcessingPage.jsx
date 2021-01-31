import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import Zoom from '@material-ui/core/Zoom';
import GoogleMap from '../components/GoogleMap';
import ImageChooserCard from './ImageChooserCard';
import ShapeList from './ShapeList';
import LoadedImagesAccordion from './LoadedImagesAccordion';
import { loadTestState } from '../ducks/acquisition';
import { setBaseline } from '../ducks/imagery';
import { addEEFeature, centralizeMap } from '../ducks/map';
import { push } from 'react-router-redux';
import { withStyles } from '@material-ui/core/styles';
import { space } from '../theme';
import FeatureInfo from './FeatureInfo';
import Paper from '@material-ui/core/Paper';

class ProcessingPage extends React.Component {
  displayAOI() {
    //this.props.loadTestState(); return;

    const { addEEFeature, centralizeMap, coordinates } = this.props;

    if (!coordinates) {
      this.props.loadTestState(); return;
    }

    const ee = window.ee;

    const feature = ee.Feature(ee.Geometry.Polygon([coordinates]));
    const border = feature.buffer(15).difference(feature);
    addEEFeature(border, "Área de Interesse", "#00A391", 0.6);
    centralizeMap(coordinates);
  }

  render() {
    const { classes, isDrawing } = this.props;

    const data = JSON.parse(`{"AOI_CONTAINS":true,"distances":{"0":{"closest":[-48.75755144879842,-26.259901000281168],"date":"1986-09-30","distance":246.05601307210065,"intersections":2,"withRespectTo":"0"},"1":{"closest":[-48.75749935004163,-26.259895353801355],"date":"1988-06-15","distance":240.8140708975357,"intersections":2,"withRespectTo":"1"},"2":{"closest":[-48.75755542313075,-26.259901431019777],"date":"1989-11-25","distance":246.45589246445405,"intersections":2,"withRespectTo":"2"},"3":{"closest":[-48.75749935004163,-26.259895353801355],"date":"1990-05-20","distance":240.8140708975357,"intersections":2,"withRespectTo":"3"},"4":{"closest":[-48.75753486376973,-26.25989920279259],"date":"1991-05-23","distance":244.38730226412235,"intersections":2,"withRespectTo":"4"},"5":{"closest":[-48.757499350041634,-26.259895353801355],"date":"1991-07-26","distance":240.81407089816662,"intersections":2,"withRespectTo":"5"}},"endpoints":[[-48.763070544421964,-26.260499052041485],[-48.74714146609983,-26.25877237878836]],"lrr":-0.5193494808261373,"trend":{"offset":289.86020487697607,"scale":-0.0014228752899346226},"x":[[31683,246.05601307210065],[32307,240.8140708975357],[32835,246.45589246445405],[33011,240.8140708975357],[33379,244.38730226412235],[33443,240.81407089816662]],"customStyle":{"fillOpacity":1,"fillColor":"#6D8200","strokeWeight":0.333,"strokeColor":"#6D8200","strokeOpacity":1},"featureType":"transect"}`);

    return (
      <div className={classes.wrapper}>
        <Grow in={!isDrawing} unmountOnExit>
          <Grid container justify="center" spacing={0} className={classes.mapOverlay}>
            {/* <Paper>
              <FeatureInfo data={data}/>
            </Paper> */}
            <Grid item xs={9} className={classes.mapContainer}>
              <ShapeList/>
              <ImageChooserCard/>
            </Grid>
            <Grid item xs={3}>
              {/* <InterestRegionView/> */}
              <LoadedImagesAccordion/>
              {/* <GuideStepper/> */}
            </Grid>
          </Grid>
        </Grow>

        <GoogleMap
          onLoad={() => this.displayAOI()}
          style={{position: 'absolute'}}
        />
      </div>
    );
  }
}

const style = (theme) => ({
  wrapper: {
    maxHeight: "calc(100vh - 64px)",
    flexGrow: 1,
    position: 'relative',
  },
  mapContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    flexFlow: 'column',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 10,
    pointerEvents: 'none',
    '& > *': {
      pointerEvents: 'none',
      '& > *': {
        pointerEvents: 'auto',
      }
    }
  }
});

const connector = connect(state => ({
  coordinates: state.acquisition.coordinates,
  done: state.acquisition.done,
  isDrawing: state.map.currentlyDrawing,
}), {loadTestState, setBaseline, addEEFeature, centralizeMap})

const enhancer = compose(
  connector,
  withStyles(style)
);

export default enhancer(ProcessingPage);
