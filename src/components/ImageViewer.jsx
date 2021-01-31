import React from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ExpandIcon from '@material-ui/icons/ExpandMore';
import ImageActions from '../containers/ImageActions';
import LayerViewer from './LayerViewer';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/AddCircleOutline';
import { requestExpression } from '../ducks/imagery';
import { withTranslation } from 'react-i18next'

class ImageViewer extends React.Component {
  createTitle() {
    const { image, index } = this.props;

    return (
      <div>
        <Typography variant="body1" className="word-breakable">
          {image.name}
        </Typography>

      </div>
    )
  }

  createLayers() {
    const { t, image, index } = this.props;

    if (image === undefined || image.layers === undefined || Object.keys(image.layers).length === 0) {
      return <p>{t('forms.imageryOverlay.loading')}</p>
    }

    return Object.keys(image.layers).map((id, i) => (
      <LayerViewer key={i} layer={image.layers[id]} index={id} parent={index} />
    )).reverse();
  }

  render() {
    const { t, image, index } = this.props;

    return (
      <ExpansionPanel defaultExpanded style={{ margin: "1px 1px" }}>
        <ExpansionPanelSummary expandIcon={<ExpandIcon />}>
          {this.createTitle()}
        </ExpansionPanelSummary>

        <Divider />

        <ExpansionPanelDetails>
          <div className="hexpand vcenter flow-column">
            {this.createLayers()}
          </div>
        </ExpansionPanelDetails>

        <Divider />

        <Tooltip title={t('forms.imageryOverlay.hint')} placement="top">
          <IconButton onClick={() => this.props.requestExpression(index)}>
            <Add />
          </IconButton>
        </Tooltip>
      </ExpansionPanel>
    );
  }
}

const enhancer = compose(
  connect(state => ({}), { requestExpression }),
  withTranslation()
)

export default enhancer(ImageViewer);
