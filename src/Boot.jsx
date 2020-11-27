import React from 'react';
import { AppContainer } from 'react-hot-loader';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './App';
import { hot } from 'react-hot-loader'
import theme from './theme';

export default class Boot extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const s = document.createElement('script');
    s.setAttribute('src', 'https://maps.google.com/maps/api/js?key=' + process.env.REACT_APP_MAPS_KEY + '&libraries=drawing,visualization');
    document.body.appendChild(s);
    // this.instance.appendChild(s);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppContainer>
          <App />
        </AppContainer>
      </ThemeProvider>
    )
  }
}


