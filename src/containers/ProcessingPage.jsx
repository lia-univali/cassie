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
import { withTranslation } from 'react-i18next'

class ProcessingPage extends React.Component {
  displayAOI() {
    const { t, addEEFeature, centralizeMap, coordinates } = this.props;

    if (!coordinates) {
      this.props.loadTestState(); return;
    }

    const ee = window.ee;

    const feature = ee.Feature(ee.Geometry.Polygon([coordinates]));
    const border = feature.buffer(15).difference(feature);
    addEEFeature(border, t('forms.map.roi'), "#00A391", 0.6);
    centralizeMap(coordinates);
  }

  render() {
    const { classes, isDrawing } = this.props;

    return (
      <div className={classes.wrapper}>
        <Grow in={!isDrawing} unmountOnExit>
          <Grid container justify="center" spacing={0} className={classes.mapOverlay}>
            {/* <Paper>
              <FeatureInfo data={data}/>
            </Paper> */}
            <Grid item xs={9} className={classes.mapContainer}>
              <ShapeList />
              <ImageChooserCard />
            </Grid>
            <Grid item xs={3}>
              {/* <InterestRegionView/> */}
              <LoadedImagesAccordion />
              {/* <GuideStepper/> */}
            </Grid>
          </Grid>
        </Grow>

        <GoogleMap
          onLoad={() => this.displayAOI()}
          style={{ position: 'absolute' }}
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
}), { loadTestState, setBaseline, addEEFeature, centralizeMap })

const enhancer = compose(
  connector,
  withStyles(style),
  withTranslation()
);

export default enhancer(ProcessingPage);
