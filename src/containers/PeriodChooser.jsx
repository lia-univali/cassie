import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import TimePeriodSelector from '../components/TimePeriodSelector';
import lastItem from 'lodash/last';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import StepperButtons from '../components/StepperButtons';
import CloudSelector from '../components/CloudSelector';
import ActivityIndicator from './ActivityIndicator.jsx';
import { formatDate, formatDateDiff, datesBetween } from '../common/utils';
import { withAcquisition } from '../actions';
import { space } from '../theme';
import { uniteMissionsDates, summarizeMissionsDates } from '../common/algorithms';

class PeriodChooser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cloudLevel: 1,
    };

    if (props.dates !== undefined) {
      this.state = {
        start: props.dates[0].date,
        end: lastItem(props.dates).date,
      };
    }
  }

  componentDidMount() {
    this.props.acquisition.loadAvailableImages();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dates !== undefined) {
      const dates = nextProps.dates;

      this.setState({ start: dates[0].date, end: lastItem(dates).date });
    }
  }

  handleNext() {
    const { start, end } = this.state;
    const dates = this.selectDates().filter(entry => entry.date >= start && entry.date <= end);

    this.props.acquisition.setAvailableDates(dates);
  }

  selectDates() {
    return uniteMissionsDates(this.props.missions)
      .filter(entry => entry.content <= this.state.cloudLevel);
  }

  render() {
    const { start, end } = this.state;
    const { dates: dict, navigate, classes, working } = this.props;

    if (working === true || dict === undefined) {
      return <ActivityIndicator textual />
    }

    const dates = this.selectDates(dict).map(entry => entry.date);
    const length = datesBetween(dates, start, end).length;

    return (
      <div className="vcenter flow-column margin-above">
        <TimePeriodSelector dates={dates} start={start} end={end}
          onChange={(start, end) => this.setState({ start, end })}
        />

        <div className={classes.description}>
          <Typography variant="subheading" align="center">
            Período: {formatDate(start)} a {formatDate(end)}
          </Typography>
          <Typography variant="subheading" align="center">
            {formatDateDiff(start, end)}, {length} image{length === 1 ? 'm' : 'ns'}
          </Typography>
        </div>

        <CloudSelector
          level={this.state.cloudLevel}
          onChange={cloudLevel => this.setState({ cloudLevel })}
        />

        <StepperButtons navigate={navigate} onNext={() => this.handleNext()} />
      </div>
    );
  }
}

const style = {
  description: {
    margin: space(7, 0, 3)
  }
}

const connector = connect(state => ({
  dates: state.acquisition.availableDates,
  missions: state.acquisition.missions,
  working: state.common.working,
}));

const enhancer = compose(
  connector,
  withAcquisition(),
  withStyles(style),
);

export default enhancer(PeriodChooser);
