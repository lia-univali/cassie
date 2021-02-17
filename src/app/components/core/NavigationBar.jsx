import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Typography, Toolbar } from '@material-ui/core'

import User from './User'

const useStyles = makeStyles(theme => ({
  title: {
    flex: 1
  }
}))

const NavigationBar = () => {
  const user = useSelector(state => state.auth.user, shallowEqual)

  const classes = useStyles()

  return (
    <AppBar position='static' elevation={0}>
      <Toolbar>
        <Typography className={classes.title} variant='h6' color='inherit'>
          CASSIE <small>Coastal Analysis via Satellite Imagery Engine</small>
        </Typography>
        <User {...user} />
      </Toolbar>
    </AppBar>
  )
}

export default NavigationBar
