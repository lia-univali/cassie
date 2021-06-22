import React from "react";
import moment from "moment";
import lastItem from "lodash/last";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import Tick from "./Tick";
import { createRangeWithTooltip } from "./Slider";
import { sequence, formatDate } from "../../../common/utils";

const TooltipRange = createRangeWithTooltip();

const toTimestamp = (date) => parseInt(moment(date).format("x"), 10);
const fromTimestamp = (timestamp) => moment(timestamp).toISOString();

const useStyles = makeStyles((theme) => ({
  wrapper: {
    width: "80%",
  },
  labels: {
    marginTop: 4,
    justifyContent: "space-between",
  },
  container: {
    position: "relative",
  },
  label: {
    position: "absolute",
    top: 18,
  },
}));

const TimePeriodSelector = ({
  start,
  end,
  dates = [],
  labels = 4,
  onChange = () => {},
}) => {
  const classes = useStyles();

  const timestamps = dates.map(toTimestamp);
  const interval = (lastItem(timestamps) - timestamps[0]) / (labels - 1);
  const marks = timestamps.reduce(
    (acc, current) => ({ ...acc, [current]: "" }),
    {}
  );

  start = !start ? timestamps[0] : toTimestamp(start);
  end = !end ? lastItem(timestamps) : toTimestamp(end);

  return (
    <Box className={classes.wrapper} id="timeselector">
      <TooltipRange
        min={timestamps[0]}
        max={lastItem(timestamps)}
        marks={marks}
        step={null}
        tipFormatter={(val) => formatDate(val)}
        value={[start, end]}
        onChange={(val) =>
          onChange(fromTimestamp(val[0]), fromTimestamp(val[1]))
        }
      />
      <Box className={classes.labels} display="flex" alignItems="center">
        {sequence(labels).map((i) => (
          <Box
            key={i}
            className={classes.container}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Tick height={15} />
            <Typography className={classes.label} variant="body1">
              {formatDate(Math.round(timestamps[0] + interval * i))}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TimePeriodSelector;
