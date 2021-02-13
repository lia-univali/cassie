import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

import { AppBar, Typography, Toolbar } from '@material-ui/core';

import User from './User';

const NavigationBar = () => {
  const user = useSelector(state => state.auth.user, shallowEqual)

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" className="flex1" color="inherit">
          C.A.S.S.I.E. <small>Coastal Analysis via Satellite Imagery Engine</small>
        </Typography>
        <User {...user} />
      </Toolbar>
    </AppBar>
  )
}

export default NavigationBar
