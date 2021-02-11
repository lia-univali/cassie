import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Box, CircularProgress, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  vcenter: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const Task = React.forwardRef(({ message, dismissable, onClose }, ref) => {
  const classes = useStyles()

  return (
    <Box className={classes.vcenter} ref={ref}>
      <CircularProgress color="secondary" size={32} />
      <Typography className="margin-left" variant="body2" color="inherit">
        {message}
      </Typography>
    </Box>
  )
})

export default Task