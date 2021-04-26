import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { useTranslation } from "react-i18next";
import { first, last } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography } from "@material-ui/core";
import TimePeriodSelector from "./TimePeriodSelector";
import StepperButtons from "./StepperButtons";
import CloudSelector from "./CloudSelector";
import ActivityIndicator from "../core/ActivityIndicator.jsx";
import { Actions as Acquisition } from "../../../store/ducks/acquisition";
import {
  formatDate,
  formatDateDiff,
  datesBetween,
} from "../../../common/utils";
import { uniteMissionsDates } from "../../../common/algorithms";
import ReactGA from "react-ga";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(2),
  },
  description: {
    margin: theme.spacing(7, 0, 3),
  },
}));

const PeriodChooser = ({ navigate }) => {
  const dates = useSelector(
    (state) => state.acquisition.availableDates,
    shallowEqual
  );
  const missions = useSelector(
    (state) => state.acquisition.missions,
    shallowEqual
  );
  const working = useSelector((state) => state.common.working);

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const classes = useStyles();

  const [cloudLevel, setCloudLevel] = useState(1);
  const [period, setPeriod] = useState([]);
  const [start, end] = period;

  useEffect(() => {
    dispatch(Acquisition.loadAvailableImages());
  }, [dispatch]);

  useEffect(() => {
    if (dates) {
      setPeriod([first(dates).date, last(dates).date]);
    }
  }, [dates]);

  const selectDates = () => {
    return uniteMissionsDates(missions).filter(
      (entry) => entry.content <= cloudLevel
    );
  };

  const handleNext = () => {
    ReactGA.event({
      category: 'Acquisition',
      action: 'SetCloudLevel',
      value: cloudLevel
    });
    ReactGA.event({
      category: 'Acquisition',
      action: 'SetPeriod',
      value: (start+"-"+end)
    });
    const dates = selectDates().filter(
      (entry) => entry.date >= start && entry.date <= end
    );

    dispatch(Acquisition.setAvailableDates(dates));
  };

  if (working === true || !dates) {
    return <ActivityIndicator textual />;
  }

  const flatten = selectDates().map((entry) => entry.date);
  const length = datesBetween(flatten, start, end).length;

  return (
    <Box
      className={classes.wrapper}
      display="flex"
      alignItems="center"
      flexDirection="column"
    >
      <TimePeriodSelector
        dates={flatten}
        start={start}
        end={end}
        onChange={(start, end) => setPeriod([start, end])}
      />
      <Box className={classes.description}>
        <Typography variant="subtitle1" align="center">
          {t("forms.acquisition.3.period")}: {formatDate(start)}{" "}
          {t("forms.acquisition.3.to")} {formatDate(end)}
        </Typography>
        <Typography variant="subtitle1" align="center">
          {formatDateDiff(start, end)}, {length}{" "}
          {t(
            `forms.acquisition.3.imageQuantity.${
              length === 1 ? "singular" : "plural"
            }`
          )}
        </Typography>
      </Box>
      <CloudSelector
        level={cloudLevel}
        onChange={(cloudLevel) => setCloudLevel(cloudLevel)}
      />
      <StepperButtons navigate={navigate} onNext={handleNext} />
    </Box>
  );
};

export default PeriodChooser;
