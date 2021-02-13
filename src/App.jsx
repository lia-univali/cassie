import React from 'react';
import { ConnectedRouter } from 'connected-react-router';
import { Switch, Route } from 'react-router-dom';

import { CssBaseline } from '@material-ui/core';

import { HomePage, MainPage } from './app/pages';
import { Notifier, Scroller } from './app/components'
import { history } from './store';

import './css/App.css'; // @TODO source of all evil, has raw css
import 'rc-slider/assets/index.css';

const App = () => (
  <ConnectedRouter history={history}>
    <Scroller>
      <CssBaseline />
      <Notifier />
      <Switch>
        <Route path="/main" component={MainPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Scroller>
  </ConnectedRouter>
)

export default App;
