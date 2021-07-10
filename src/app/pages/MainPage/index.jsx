import React from "react";
import { Switch, Route } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import NavigationBar from "../../components/core/NavigationBar";
import DialogRoot from "../../components/dialog/DialogRoot";
import AcquisitionPage from "../AcquisitionPage";
import ProcessingPage from "../ProcessingPage";
import ActivityIndicator from "../../components/core/ActivityIndicator";

// Register Dialogs
// eslint-disable-next-line no-unused-vars
import CoastlineEvolutionDialog from "../../components/dialog/CoastlineEvolutionDialog";
// eslint-disable-next-line no-unused-vars
import CoastlineConfigDialog from "../../components/dialog/CoastlineConfigDialog";
// eslint-disable-next-line no-unused-vars
import NewLayerDialog from "../../components/dialog/NewLayerDialog";
// eslint-disable-next-line no-unused-vars
import ImageSelectionDialog from "../../components/dialog/ImageSelectionDialog";

// custom Typography component for showing error message
const NotFound = (props) => (
  <Typography variant="h2" align="center">
    Página não encontrada.
  </Typography>
);

// useSyles hook to inject custom styles
const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
}));

// main function
const MainPage = ({ match }) => {
  // useStyles hook to inject custom styles
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <DialogRoot />

      <NavigationBar />

      <Switch>
        <Route
          exact
          strict
          // send the user to the AcquisitionPage (step) if the url is acquisition
          path={`${match.url}/acquisition/:step?`}
          component={AcquisitionPage}
        />
        <Route
          exact
          strict
          // send the user to the Processing step if the url is processing
          path={`${match.url}/processing`}
          component={ProcessingPage}
        />
        {/* route for else */}
        <Route path={match.url} component={NotFound} />
      </Switch>

      <ActivityIndicator />
    </div>
  );
};

export default MainPage;
