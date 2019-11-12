import React from 'react';
import Typography from '@material-ui/core/Typography';
import Expand from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core/Fade';
import LayerActions from '../containers/LayerActions';
import DropdownButton from './DropdownButton';

const LayerTitle = ({ title, threshold, loading = false }) => {
  let thresholdDisplay = null;

  if (threshold !== undefined) {
    thresholdDisplay = (
      <i>{` (T = ${threshold.toFixed(3)})`}</i>
    );
  }

  return (
    <div className="flex1 vcenter">
      <Typography variant="body1" style={{ margin: "6px 0px" }}>
        {title}{thresholdDisplay}
      </Typography>

      <Fade in={loading} unmountOnExit>
        <CircularProgress color="secondary" size={20} thickness={6} style={{ marginLeft: 8 }} />
      </Fade>
    </div>
  );
};

class LayerViewer extends React.Component {
  createMenu() {
    return (
      <DropdownButton icon={Expand}>
        <MenuItem>Limiarizar</MenuItem>
      </DropdownButton>
    );
  }

  render() {
    const { layer, index, parent } = this.props;
    const { /*visible, opacity, */threshold, title } = layer;
    // const bandCount = Object.keys(layer.histogram).length;
    const loaded = layer.overlay !== undefined;

    return (
      <div className="hexpand">
        <div className="vcenter">
          <LayerTitle title={title} threshold={threshold} loading={!loaded} />

          {loaded &&
            <LayerActions index={index} layer={layer} parent={parent} />
          }
        </div>
      </div>
    )
  }
}

export default LayerViewer;
