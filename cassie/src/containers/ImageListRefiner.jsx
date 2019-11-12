import React from 'react';
import { connect } from 'react-redux';
import ImageTable from '../components/ImageTable';
import StepperButtons from '../components/StepperButtons';
import update from 'immutability-helper';
import { datesBetween } from '../common/utils'
import { FINALIZE } from './AcquisitionPage';
import { loadThumbnails, setAvailableDates } from '../ducks/acquisition';

class ImageListRefiner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.dates.map(() => true)
    };
  }

  handleChange(index, checked) {
    const selected = update(this.state.selected, {
      [index]: { $set: checked }
    });

    this.setState({ selected });
  }

  handleFinish() {
    const filtered = this.props.dates.filter((image, i) => this.state.selected[i] === true);

    this.props.setAvailableDates(filtered);
  }

  componentDidMount() {
    this.props.loadThumbnails();
  }

  render() {
    const { dates, metadata, start, end, navigate } = this.props;

    return (
      <div>
        <ImageTable metadata={metadata} images={dates} selected={this.state.selected}
          onCheckboxChange={(i, checked) => this.handleChange(i, checked)}
        />

        <StepperButtons
          navigate={navigate}
          nextText="Concluir"
          onNext={() => this.handleFinish()}
          nextTarget={FINALIZE}
        />
      </div>
    );
  }
}

const connector = connect(state => ({
  metadata: state.acquisition.metadata,
  dates: state.acquisition.availableDates,
  start: state.acquisition.start,
  end: state.acquisition.end,
  missions: state.acquisition.missions
}), { loadThumbnails, setAvailableDates });

export default connector(ImageListRefiner);
