import React from 'react';
import { registerDialog } from 'containers/DialogRoot';
import ImageTable from 'components/ImageTable';
import update from 'immutability-helper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

function datesChanged(previousDates, currentDates) {
  if (currentDates !== undefined) {
    if (previousDates === undefined) {
      return true;
    } else {
      [ previousDates, currentDates ] = [previousDates, currentDates].map(Object.keys);

      return previousDates.length !== currentDates.length
    }
  }

  return false;
}

class ImageSelectionDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleChange(index, checked) {
    const selected = update(this.state.selected, {
      [index]: {$set: checked}
    });

    this.setState({selected});
  }

  handleFinish() {
    const filtered = Object.keys(this.props.dates).filter((image, i) => this.state.selected[i] === true);
    this.props.publish(filtered);
  }

  componentDidUpdate(prevProps) {
    if (datesChanged(prevProps.dates, this.props.dates)) {
      this.setState({selected: Object.keys(this.props.dates).map(() => true)});
    }
  }

  render() {
    const { close, open, metadata, dates } = this.props;

    return (
      <Dialog open={open} maxWidth="md" onClose={() => close()}>
        <DialogTitle>Seleção de imagens</DialogTitle>
        <DialogContent>
          <ImageTable metadata={metadata} images={dates} selected={this.state.selected}
            onCheckboxChange={(i, checked) => this.handleChange(i, checked)}
          />

        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => close()}>
            Cancelar
          </Button>
          <Button color="primary" onClick={() => this.handleFinish()}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default registerDialog("imageSelection", state => ({
  dates: state.acquisition.availableDates,
  metadata: state.acquisition.metadata,
}))(ImageSelectionDialog);
