import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import NavigationBar from 'containers/NavigationBar';
import DialogRoot from 'containers/DialogRoot';
import AcquisitionPage from 'containers/AcquisitionPage';
import ProcessingPage from 'containers/ProcessingPage';
import ActivityIndicator from 'containers/ActivityIndicator';
import { withStyles } from '@material-ui/core/styles';
// ======= Dialogs
import CoastlineEvolutionDialog from 'containers/CoastlineEvolutionDialog';
import CoastlineConfigDialog from 'containers/CoastlineConfigDialog';
import NewLayerDialog from 'containers/NewLayerDialog';
import ImageSelectionDialog from 'containers/ImageSelectionDialog';

const NotFound = props => (
  <Typography variant="display2" align="center">
    Página não encontrada.
  </Typography>
);

class MainPage extends React.Component {
  render() {
    const { classes, match } = this.props;

    return (
      <div className={classes.wrapper}>
        <DialogRoot/>

        <NavigationBar/>
        <Switch>
          <Route exact strict path={`${match.url}/acquisition/:step?`} component={AcquisitionPage}/>
          <Route exact strict path={`${match.url}/processing`} component={ProcessingPage}/>
          <Route path={match.url} component={NotFound}/>
        </Switch>
        <ActivityIndicator/>
      </div>
    );
  }
}

const styles = theme => ({
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
});

export default withStyles(styles)(MainPage);
