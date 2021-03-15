import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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

  return (
    <div className={classes.root}>
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Typography variant="h6" className={classes.title} color="default">
            CASSIE
          </Typography>
          {props.children}
        </Toolbar>
      </AppBar>
    </div>
  );
}