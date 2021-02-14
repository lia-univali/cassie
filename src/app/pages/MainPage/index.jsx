import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import NavigationBar from '../../../containers/NavigationBar';
import DialogRoot from '../../components/dialog/DialogRoot';
import AcquisitionPage from '../../../containers/AcquisitionPage';
import ProcessingPage from '../ProcessingPage';
import ActivityIndicator from '../../../containers/ActivityIndicator';

// Register Dialogs
import CoastlineEvolutionDialog from '../../components/dialog/CoastlineEvolutionDialog';
import CoastlineConfigDialog from '../../components/dialog/CoastlineConfigDialog';
import NewLayerDialog from '../../components/dialog/NewLayerDialog';
import ImageSelectionDialog from '../../components/dialog/ImageSelectionDialog';

const NotFound = props => (
  <Typography variant="h2" align="center">
    Página não encontrada.
  </Typography>
)

const useStyles = makeStyles(theme => ({
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  }
}))

const MainPage = ({ match }) => {
  const classes = useStyles()

  return (
    <div className={classes.wrapper}>
      <DialogRoot />

      <NavigationBar />

      <Switch>
        <Route exact strict path={`${match.url}/acquisition/:step?`} component={AcquisitionPage} />
        <Route exact strict path={`${match.url}/processing`} component={ProcessingPage} />
        <Route path={match.url} component={NotFound} />
      </Switch>
      <ActivityIndicator />
    </div>
  )
}

export default MainPage