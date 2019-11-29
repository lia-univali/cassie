import React from 'react';
import lastItem from 'lodash/last';
import Tick from './Tick'
import { sequence, formatDate } from '../common/utils';
import { createRangeWithTooltip } from './Slider';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';

const TooltipRange = createRangeWithTooltip();

const styles = {
  labels: {
    marginTop: 4,
    justifyContent: "space-between",
  },
  labelContainer: {
    position: "relative"
  },
  label: {
    position: "absolute",
    top: 18,
  }
};

const toTimestamp = (date) => parseInt(moment(date).format("x"), 10);
const fromTimestamp = (timestamp) => moment(timestamp).format("YYYY-MM-DD");

const TimePeriodSelector = ({ start, end, dates = [], labels = 4, onChange = () => { } }) => {
  const timestamps = dates.map(toTimestamp);

  start = start === undefined ? timestamps[0] : toTimestamp(start);
  end = end === undefined ? lastItem(timestamps) : toTimestamp(end);

  const interval = (lastItem(timestamps) - timestamps[0]) / (labels - 1);
  const marks = {};

  timestamps.forEach(stamp => marks[stamp] = "");

  return (
    <div style={{ width: '80%' }}>
      <TooltipRange
        min={timestamps[0]} max={lastItem(timestamps)}
        marks={marks} step={null}
        tipFormatter={val => formatDate(val)}
        value={[start, end]}
        onChange={val => onChange(fromTimestamp(val[0]), fromTimestamp(val[1]))}
      />
      <div className="vcenter" style={styles.labels}>
        {sequence(labels).map(i => (
          <div key={i} className="vcenter flow-column" style={styles.labelContainer}>
            <Tick height={15} />
            <Typography variant="body1" style={styles.label}>
              {formatDate(Math.round(timestamps[0] + interval * i))}
            </Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimePeriodSelector;
