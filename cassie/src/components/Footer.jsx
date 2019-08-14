import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { space } from 'theme';

const Footer = ({classes}) => (
  <div className={classes.wrapper}>
    <div className={classes.footer}>
      <Typography variant="body1" gutterBottom>
        Powered by: Google Earth Engine
      </Typography>
      <Typography variant="body1">
        Fontes das imagens dos satélites: NASA (Landsat) e ESA (Sentinel)
      </Typography>
    </div>
  </div>
);

const style = (theme) => ({
  wrapper: {
    marginTop: 'auto',
    width: '100%',
  },
  footer: {
    marginTop: space(3),
    height: 150,
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    backgroundColor: theme.palette.grey[200],
  }
});

export default withStyles(style)(Footer);
