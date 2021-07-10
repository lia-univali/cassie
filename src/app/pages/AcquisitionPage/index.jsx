import React, { useEffect } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { push } from "connected-react-router";
import { Redirect, Switch, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import {
  Divider,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import SatelliteChooser from "../../components/acquisition/SatelliteChooser";
import AOIChooser from "../../components/acquisition/AOIChooser";
import PeriodChooser from "../../components/acquisition/PeriodChooser";
import ImageListRefiner from "../../components/acquisition/ImageListRefiner";
import Footer from "../../components/core/Footer";
import { getAcquisitionParameters } from "../../../selectors";
import { Actions as Auth } from "../../../store/ducks/auth";

// set constants to previous, next, first and final steps
export const PREVIOUS = -1;
export const FIRST = 0;
export const NEXT = 1;
export const FINALIZE = 2;

// set the data for the steps
const STEPS = [
  {
    label: "forms.acquisition.1.title",
    content: "forms.acquisition.1.description",
    component: SatelliteChooser,
  },
  {
    label: "forms.acquisition.2.title",
    content: "forms.acquisition.2.description",
    requires: "satellite",
    component: AOIChooser,
  },
  {
    label: "forms.acquisition.3.title",
    content: "forms.acquisition.3.description",
    requires: "geometry",
    component: PeriodChooser,
  },
  {
    label: "forms.acquisition.4.title",
    content: "forms.acquisition.4.description",
    requires: "availableDates",
    component: ImageListRefiner,
  },
];

// useStyles is a hook into material-ui's useStyles method
const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: "flex",
    flexFlow: "column",
    flexGrow: 1,
  },
  header: {
    backgroundColor: theme.palette.primary[400],
    padding: theme.spacing(6, 0, 16),
  },
  title: {
    color: "white",
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexFlow: "column",
  },
  content: {
    width: "80vw",
    maxWidth: "1000px",
    marginTop: theme.spacing(-9),
  },
  instructions: {
    paddingTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
  },
}));

// AcquisitionPage is the main page of the acquisition process
const AcquisitionPage = (props) => {

  const acquisitionData = useSelector(getAcquisitionParameters, shallowEqual);

  const dispatch = useDispatch();
  // useTranslate is a hook into react-i18next's useTranslate method
  const [t] = useTranslation();
  // use custom styles
  const classes = useStyles();

  const { match } = props;

  // check if the step is valid and attends requirements
  const stepAttendsRequirements = () => {
    const { params } = match;
    // check if the step is valid
    const hasStep = params.step !== undefined;
    // if it is, check the last step, it it is not, set it to the first step
    const step = hasStep ? params.step - 1 : 0;
    // load step data
    const stepData = STEPS[step];
    // check if the step has requirements
    return !("requires" in stepData) || stepData.requires in acquisitionData;
  };

  
  useEffect(() => {
    // check if the user is authenticated
    dispatch(Auth.begin());
    // check if the step is valid and check the requirements
    if (!stepAttendsRequirements()) {
      // if it is not, redirect to the first step
      navigate(FIRST);
    }
  }, [dispatch]);

  // get the current step by the url
  const extractPath = (hasStep) => {
    return hasStep
      ? match.url.substring(0, match.url.lastIndexOf("/"))
      : match.url;
  };

  // navigate to other step
  const navigate = (direction) => {
    const path = extractPath(true);
    const { step } = match.params;

    if (direction === NEXT || direction === PREVIOUS) {
      dispatch(push(`${path}/${parseInt(step, 10) + direction}`));
    } else if (direction === FIRST) {
      dispatch(push(`${path}/1`));
    } else if (direction === FINALIZE) {
      // if it is the final step, redirect to the processing page
      dispatch(push("/main/processing"));
    }
  };

  // render the page according to the step
  const renderStep = (props, Component) => {
    if (stepAttendsRequirements()) {
      return (
        <Component {...props} navigate={(direction) => navigate(direction)} />
      );
    }
    return null;
  };

  // automatize the routes generation based on the steps
  const makeRoutes = (hasStep) => {
    const path = extractPath(hasStep);
    return STEPS.map((el, i) => {
      const id = i + 1;
      const Component = el.component;
      return (
        <Route
          key={id}
          path={`${path}/${id}`}
          render={(props) =>
            renderStep({ ...props, ...acquisitionData }, Component)
          }
        />
      );
    }).concat(<Redirect key={0} from={path} to={path + "/1"} />);
  };

  const hasStep = match.params.step !== undefined;
  const step = hasStep ? match.params.step - 1 : 0;

  return (
    <div className={classes.wrapper}>
      <Grid container spacing={0} justify="center">
        <Grid item xs={12} className={classes.header}>
          <div>
            <Typography className={classes.title} variant="h4" align="center">
              {t("forms.acquisition.title")}
            </Typography>
          </div>
        </Grid>
        <Grid item className={classes.container}>
          <Paper className={classes.content} elevation={1}>
            <Stepper alternativeLabel activeStep={step}>
              {STEPS.map((el, i) => (
                <Step key={i}>
                  <StepLabel>{t(el.label)}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <Typography
              className={classes.instructions}
              variant="subtitle1"
              align="center"
            >
              {t(STEPS[step].content)}
            </Typography>
            <Divider />
            <Switch>{makeRoutes(hasStep)}</Switch>
          </Paper>
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default AcquisitionPage;
