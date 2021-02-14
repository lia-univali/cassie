import React from 'react';
import { compose } from 'redux';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { space } from '../theme';
import { withTranslation } from 'react-i18next'

const Footer = ({ t, classes }) => (
  <div className={classes.wrapper}>
    <div className={classes.footer}>
      <Typography variant="body1" gutterBottom>
        {t('self.poweredBy')}
      </Typography>
      <Typography variant="body1">
        {t('self.imageryProvider')}
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

const enhancer = compose(
  withStyles(style),
  withTranslation()
)

export default enhancer(Footer);
