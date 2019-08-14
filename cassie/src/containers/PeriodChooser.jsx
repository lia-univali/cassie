import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import TimePeriodSelector from 'components/TimePeriodSelector';
import lastItem from 'lodash/last';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import StepperButtons from 'components/StepperButtons';
import CloudSelector from 'components/CloudSelector';
import ActivityIndicator from './ActivityIndicator.jsx';
import { formatDate, formatDateDiff, datesBetween } from 'common/utils';
import { withAcquisition } from 'actions';
import { space } from 'theme';

class PeriodChooser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cloudLevel: 1,
    };

    if (props.dates !== undefined) {
      const dates = Object.keys(props.dates);

      this.state = {
        start: dates[0],
        end: lastItem(dates),
      };
    }
  }

  componentDidMount() {
    this.props.acquisition.loadAvailableImages();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dates !== undefined) {
      const dates = Object.keys(nextProps.dates);

      this.setState({start: dates[0], end: lastItem(dates)});
    }
  }

  handleNext() {
    console.log(this.state);
    const dict = {};

    const {start, end} = this.state;
    this.selectDates().forEach(date => {
      if (date >= start && date <= end)      // not the optimal solution, dict should be an array, so we'd filter it.
        dict[date] = this.props.dates[date];
    });

    //dict.filter(date => date >= start && date <= end); // dict is actually a dict

    this.props.acquisition.setAvailableDates(dict);
  }

  selectDates() {
    return Object.keys(this.props.dates).filter(date => {
      const clouds = this.props.dates[date];
      return clouds <= this.state.cloudLevel;
    });
  }

  render() {
    const { start, end } = this.state;
    const { dates: dict, navigate, classes, working } = this.props;

    //console.log(images);

    if (working === true || dict === undefined) {
      return <ActivityIndicator textual/>
    }

    const dates = this.selectDates(dict);
    const length = datesBetween(dates, start, end).length;

    return (
      <div className="vcenter flow-column margin-above">
        <TimePeriodSelector dates={dates} start={start} end={end}
          onChange={(start, end) => this.setState({start, end})}
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
          onChange={cloudLevel => this.setState({cloudLevel})}
        />

        <StepperButtons navigate={navigate} onNext={() => this.handleNext()}/>
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
  working: state.common.working,
}));

const enhancer = compose(
  connector,
  withAcquisition(),
  withStyles(style),
);

export default enhancer(PeriodChooser);
