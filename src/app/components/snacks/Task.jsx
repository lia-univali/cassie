import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'
import { Box, CircularProgress, Typography } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  vcenter: {
    display: 'flex',
    alignItems: 'center'
  }
}))

const Task = React.forwardRef(({ id }, ref) => {
  const { message, options: { variant, value } } =
    useSelector(state => state.snacks.notes.find(note => note.key === id), shallowEqual)

  const classes = useStyles()

  return (
    <Box className={classes.vcenter} ref={ref}>
      <CircularProgress variant={variant} value={value} color='secondary' size={32} />
      <Typography className='margin-left' variant='body2' color='inherit'>
        {message}
      </Typography>
    </Box>
  )
})

export default Task