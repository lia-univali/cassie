import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { MuiThemeProvider } from '@material-ui/core/styles';
import App from './App';
import { hot } from 'react-hot-loader'
import theme from './theme';

export default class Boot extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const s = document.createElement('script');
    s.setAttribute('src','https://maps.google.com/maps/api/js?v=3.32&key='+process.env.REACT_APP_MAPS_KEY+'&libraries=drawing');
    document.body.appendChild(s);
    // this.instance.appendChild(s);
  }

  render() {
    return(
      <MuiThemeProvider theme={theme}>
        <AppContainer>
          <App/>
        </AppContainer>
      </MuiThemeProvider>
    )
  }
}


