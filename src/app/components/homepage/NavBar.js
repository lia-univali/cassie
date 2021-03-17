import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {AppBar, Link, Toolbar, Typography} from '@material-ui/core';
import { useTranslation } from 'react-i18next'
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 700
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  const [t] = useTranslation();
  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Link color="inherit" href="/" className={classes.title}>
            <Typography variant="h6" color="default">
              {t('self.title')}
            </Typography>
          </Link>
          
          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  );
}