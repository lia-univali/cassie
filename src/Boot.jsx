import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import { hot } from 'react-hot-loader'
import theme from './theme';

let Boot = () => (
  <MuiThemeProvider theme={theme}>
    <AppContainer>
      <App/>
    </AppContainer>
  </MuiThemeProvider>
);

export default hot(module)(Boot);
