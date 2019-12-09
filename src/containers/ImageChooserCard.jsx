import React from 'react';
import { connect } from 'react-redux';
import MoreIcon from '@material-ui/icons/ExpandMore';
import LessIcon from '@material-ui/icons/ExpandLess';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import ImageChooserForm from '../components/ImageChooserForm';
import ActionList from './ActionList';
import { acquireImage } from '../ducks/acquisition';
import { bindDispatch, datesBetween } from '../common/utils';
import { getAcquisitionParameters } from '../selectors';

class ImageChooserCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = { expanded: true };
  }

  shouldDisable(index) {
    return false;
    // return this.props.loadedImages.find(image => (
    //   compareImages(image, this.props.images.features[index])
    // )) !== undefined;
  }

  render() {
    const { expanded } = this.state;
    const { availableDates, start, end, acquireImage, satellite, className } = this.props;

    if (availableDates === undefined) {
      return null;
    }

    return (
      <Card className={className} style={{ margin: 12 }}>
        <CardHeader
          title="Imagens disponíveis"
          subheader={`${availableDates.length} resultados`}
        />

        <Divider />

        <CardContent>
          <ImageChooserForm
            images={availableDates}
            disabledPredicate={i => this.shouldDisable(i)}
            onLoadRequested={i => acquireImage(availableDates[i].name, availableDates[i].date)}
            formatter={i => satellite.get(availableDates[i].name).format}
          />
        </CardContent>

        <Divider />

        <CardActions>
          <div className="flex1">
            <Typography variant="subheading">Ações</Typography>
          </div>

          <IconButton onClick={() => this.setState({ expanded: !expanded })}>
            {expanded ? <LessIcon /> : <MoreIcon />}
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <ActionList name="actions" />
        </Collapse>
      </Card>
    );
  }
}

export default connect(state => (
  getAcquisitionParameters(state)
), { acquireImage })(ImageChooserCard);