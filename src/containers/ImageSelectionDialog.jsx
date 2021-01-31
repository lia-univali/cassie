import React from 'react';
import { registerDialog } from './DialogRoot';
import ImageTable from '../components/ImageTable';
import update from 'immutability-helper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withTranslation } from 'react-i18next'

function datesChanged(previousDates, currentDates) {
  if (currentDates !== undefined) {
    if (previousDates === undefined) {
      return true;
    } else {
      return previousDates.length !== currentDates.length
    }
  }

  return false;
}

class ImageSelectionDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dates: props.dates
    };
  }

  updateDates(dates) {
    this.setState({ dates })
  }

  handleChange(index, checked) {
    const selected = update(this.state.selected, {
      [index]: { $set: checked }
    });

    this.setState({ selected });
  }

  handleFinish() {
    const filtered = this.props.dates.filter((image, i) => this.state.selected[i] === true);
    this.props.publish(filtered);
  }

  componentDidUpdate(prevProps) {
    if (datesChanged(prevProps.dates, this.props.dates)) {
      this.setState({ selected: this.props.dates.map(() => true) });
      this.updateDates(this.props.dates)
    }
  }

  render() {
    const { t, close, open, metadata } = this.props;
    const { dates } = this.state

    return (
      <Dialog open={open} maxWidth="md" onClose={() => close()}>
        <DialogTitle>{t('forms.imageChooser.actions.analyzeShoreline.imageSelection.title')}</DialogTitle>
        <DialogContent>
          <ImageTable metadata={metadata} images={dates} selected={this.state.selected}
            onCheckboxChange={(i, checked) => this.handleChange(i, checked)}
          />

        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => close()}>
            {t('forms.imageChooser.actions.analyzeShoreline.imageSelection.cancel')}
          </Button>
          <Button color="primary" onClick={() => this.handleFinish()}>
            {t('forms.imageChooser.actions.analyzeShoreline.imageSelection.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const enhanced = withTranslation()(ImageSelectionDialog)

export default registerDialog("imageSelection", state => ({
  dates: state.acquisition.availableDates,
  missions: state.acquisition.missions,
  metadata: state.acquisition.metadata,
}))(enhanced);