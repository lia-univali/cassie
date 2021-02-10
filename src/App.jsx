import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HomePage, MainPage } from './app/pages';
import { Scroller } from './app/components'
import SnackbarRoot from './app/components/SnackbarRoot';
import { history } from './store';
import './css/App.css';
import 'rc-slider/assets/index.css';

const App = () => (
  <ConnectedRouter history={history}>
    <Scroller>
      <CssBaseline />
      <SnackbarRoot />

      <Switch>
        <Route path="/main" component={MainPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Scroller>
  </ConnectedRouter>
)

export default App;
