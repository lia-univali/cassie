import React from 'react'

import { makeStyles } from '@material-ui/core'
import { Button, CircularProgress, Fade, Paper, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(2)
  }
}))

// @TODO unused component
const BusyPanel = ({ onAbort, shown = true, message = '', ...rest }) => {
  const classes = useStyles()

  return (
    <Fade in={shown} timeout={300} unmountOnExit>
      <Paper {...rest}>
        <CircularProgress thickness={6} color='secondary'/>
        {
          message &&
          <Typography className={classes.wrapper} variant='body1'>
            {message}...
          </Typography>
        }
        {
          onAbort &&
          <Button className={classes.wrapper} color='error' onClick={onAbort} dense>
            Cancelar
          </Button>
        }
      </Paper>
    </Fade>
  )
}

export default BusyPanel