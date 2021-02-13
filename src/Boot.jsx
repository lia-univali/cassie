import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { loadScript } from './services/dynamic-script'
import App from './App';
import theme from './theme';

const Boot = () => {
  useEffect(() => {
    loadScript(
      'boot-google-maps',
      `https://maps.google.com/maps/api/js?key=${process.env.REACT_APP_MAPS_KEY}&libraries=drawing,visualization`
    )
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  )
}

export default Boot
