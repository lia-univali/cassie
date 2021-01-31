import React from 'react';
import { hot } from 'react-hot-loader';
import { withRouter } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import { Switch, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import HomePage from './containers/HomePage';
import SnackbarRoot from './containers/SnackbarRoot';
import MainPage from './components/MainPage';
import { history } from './store';
import './css/App.css';
import 'rc-slider/assets/index.css';

let Scroller = class extends React.Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

Scroller = withRouter(Scroller);

// === // === //

const App = () => (
  <ConnectedRouter history={history}>
    <Scroller>
      <div>
        <CssBaseline />

        <SnackbarRoot />

        <Switch>
          <Route path="/main" component={MainPage} />
          <Route path="/" component={HomePage} />
        </Switch>
      </div>
    </Scroller>
  </ConnectedRouter>
);

export default App;
