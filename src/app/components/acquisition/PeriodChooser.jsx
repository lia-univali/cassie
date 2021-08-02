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
  useLocalStorage,
} from "../../../common/utils";
import { uniteMissionsDates } from "../../../common/algorithms";
import ReactGA from "react-ga";
import TourGuider from "../tour/TourGuider";
import moment from "moment";
import HelpButton from "../core/HelpButton";

// useStyles is a hook for styling this component with Material UI's styling solution
const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(2),
  },
  description: {
    margin: theme.spacing(7, 0, 3),
  },
  margin: {
    margin: "5px",
  },
  right: {
    textAlign: "right",
  },
}));

// parse ISO date string to timestamp
const toTimestamp = (date) => parseInt(moment(date).format("x"), 10);
// parse timestamps to ISO date string
const toISOString = (timestamp) => moment(timestamp).toISOString();

// This is the page of the third step of the aquisition wizard
// it is supposed to get a start and end date and a max cloud coverage
// and to save it in the storage.
const PeriodChooser = ({ navigate }) => {
  // get available dates from the storage
  const dates = useSelector(
    (state) => state.acquisition.availableDates,
    shallowEqual
  );
  // get available missions from the satellite
  const missions = useSelector(
    (state) => state.acquisition.missions,
    shallowEqual
  );
  // get the loading state from the redux store
  const working = useSelector((state) => state.common.working);

  const dispatch = useDispatch();
  // get the current language
  const [t] = useTranslation();
  // custom styles
  const classes = useStyles();
  // create a new state for the cloud coverage, starting with 100%
  const [cloudCoverage, setcloudCoverage] = useState(1);
  // create a new state for the time period
  const [period, setPeriod] = useState([]);
  // create a new state for the start and end date,
  // starting with the first available date and the last available date
  const [start, end] = period;

  // defines the steps for the tour
  const steps = [
    {
      selector: "#timeselector",
      content: t("tour.acquisition.3.period"),
    },
    {
      selector: "#timeselector",
      content: t("tour.acquisition.3.point"),
    },
    {
      selector: "#cloudselector",
      content: t("tour.acquisition.3.cloud"),
    },
  ];

  // create a localStorage object to check if the user has already seen the tour
  const [isTourOpen, setIsTourOpen] = useLocalStorage("showPeriodTour", true);

  useEffect(() => {
    dispatch(Acquisition.loadAvailableImages());
  }, [dispatch]);

  useEffect(() => {
    if (dates) {
      setPeriod([first(dates).date, last(dates).date]);
    }
  }, [dates]);

  // get all dates between the start and end date with a max cloud coverage
  const selectDates = () => {
    return uniteMissionsDates(missions).filter(
      (entry) => entry.content <= cloudCoverage
    );
  };

  // handle the save of this state and go to the next step
  const handleNext = () => {
    // save the current state in the Google Analytics
    ReactGA.event({
      category: "Acquisition",
      action: "SetcloudCoverage",
      value: cloudCoverage,
    });
    ReactGA.event({
      category: "Acquisition",
      action: "SetPeriod",
      value: start + "-" + end,
    });
    // get the start date
    let begin = new Date(start);
    // !important!
    // set the start date to be one day before
    // this is important to avoid a bug with the acquisition that wasn't getting the images of the day
    // this solution is not perfect but it works and doesn't break the acquisition since the aquisition isn't daily
    begin.setDate(begin.getDate() - 1);
    // transform the start date to ISO string again
    begin = toISOString(toTimestamp(begin));
    // get all the dates in the period
    const dates = selectDates().filter(
      (entry) => entry.date >= begin && entry.date <= end
    );
    // save the dates reversed in the redux storage
    dispatch(Acquisition.setAvailableDates(dates.reverse()));
  };

  // show loading animation when is working
  if (working === true || !dates) {
    return <ActivityIndicator textual />;
  }

  const flatten = selectDates().map((entry) => entry.date);
  const length = datesBetween(flatten, start, end).length;

  return (
    <Box>
      <HelpButton 
        onClickFunction={() => {
          setIsTourOpen(true);
        }}
      />
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
          level={cloudCoverage}
          onChange={(cloudCoverage) => setcloudCoverage(cloudCoverage)}
        />
        <StepperButtons navigate={navigate} onNext={handleNext} />
        <TourGuider
          steps={steps}
          isOpen={isTourOpen}
          setIsTourOpen={setIsTourOpen}
        />
      </Box>
    </Box>
  );
};

export default PeriodChooser;
